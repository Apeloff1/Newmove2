# ========== GO FISH! VIP CATCH OF THE DAY SYSTEM ==========
# Daily VIP rewards, catch challenges, and point accumulation
# ~400+ lines of backend code

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
import os
import random
import hashlib

router = APIRouter(prefix="/api/vip-daily", tags=["vip_daily"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== CATCH OF THE DAY CONFIGURATION ==========

CATCH_OF_THE_DAY_POOLS = {
    "easy": {
        "fish_pool": ["bluegill", "perch", "bass", "catfish", "trout"],
        "min_count": 3,
        "max_count": 5,
        "vip_points": 25,
        "bonus_multiplier": 1.0
    },
    "medium": {
        "fish_pool": ["pike", "walleye", "salmon", "redfish", "snook"],
        "min_count": 2,
        "max_count": 3,
        "vip_points": 50,
        "bonus_multiplier": 1.25
    },
    "hard": {
        "fish_pool": ["tarpon", "marlin", "tuna", "sturgeon", "muskie"],
        "min_count": 1,
        "max_count": 2,
        "vip_points": 100,
        "bonus_multiplier": 1.5
    },
    "legendary": {
        "fish_pool": ["golden_koi", "leviathan", "coelacanth", "sawfish"],
        "min_count": 1,
        "max_count": 1,
        "vip_points": 250,
        "bonus_multiplier": 2.0
    }
}

VIP_POINT_REWARDS = {
    100: {"coins": 1000, "gems": 5},
    250: {"coins": 2500, "gems": 10, "energy_refill": 1},
    500: {"coins": 5000, "gems": 25, "mystery_box": 1},
    1000: {"coins": 10000, "gems": 50, "vip_days": 3},
    2500: {"coins": 25000, "gems": 100, "exclusive_rod": "vip_master_rod"},
    5000: {"coins": 50000, "gems": 250, "exclusive_title": "VIP Legend", "exclusive_lure": "golden_vip_lure"},
}

WEEKLY_VIP_CHALLENGES = [
    {
        "id": "weekly_catches",
        "name": "Weekly Catch Goal",
        "description": "Catch 100 fish this week",
        "target": 100,
        "stat": "fish_caught",
        "vip_points": 150
    },
    {
        "id": "weekly_perfects",
        "name": "Perfect Week",
        "description": "Get 25 perfect catches",
        "target": 25,
        "stat": "perfect_catches",
        "vip_points": 200
    },
    {
        "id": "weekly_rare",
        "name": "Rare Hunter",
        "description": "Catch 10 rare or better fish",
        "target": 10,
        "stat": "rare_fish",
        "vip_points": 175
    },
    {
        "id": "weekly_biotopes",
        "name": "Biotope Explorer",
        "description": "Fish in all 4 biotopes",
        "target": 4,
        "stat": "biotopes_fished",
        "vip_points": 125
    },
    {
        "id": "weekly_cooking",
        "name": "Master Chef",
        "description": "Cook 10 dishes",
        "target": 10,
        "stat": "dishes_cooked",
        "vip_points": 100
    }
]


# ========== REQUEST MODELS ==========

class ClaimCatchOfDayRequest(BaseModel):
    user_id: str


class RedeemVIPPointsRequest(BaseModel):
    user_id: str
    milestone: int


class RecordVIPCatchRequest(BaseModel):
    user_id: str
    fish_id: str
    fish_name: str


# ========== HELPER FUNCTIONS ==========

def generate_catch_of_the_day(user_id: str, user_level: int) -> dict:
    """Generate personalized catch of the day based on level"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    seed = int(hashlib.md5(f"{user_id}{today}".encode()).hexdigest()[:8], 16)
    random.seed(seed)
    
    # Determine difficulty based on level
    if user_level >= 60:
        difficulties = ["easy", "medium", "hard", "legendary"]
    elif user_level >= 40:
        difficulties = ["easy", "medium", "hard"]
    elif user_level >= 20:
        difficulties = ["easy", "medium"]
    else:
        difficulties = ["easy"]
    
    difficulty = random.choice(difficulties)
    pool = CATCH_OF_THE_DAY_POOLS[difficulty]
    
    target_fish = random.choice(pool["fish_pool"])
    target_count = random.randint(pool["min_count"], pool["max_count"])
    
    random.seed()  # Reset seed
    
    return {
        "date": today,
        "difficulty": difficulty,
        "target_fish": target_fish,
        "target_count": target_count,
        "vip_points": pool["vip_points"],
        "bonus_multiplier": pool["bonus_multiplier"],
        "description": f"Catch {target_count} {target_fish.replace('_', ' ').title()}"
    }


async def get_player_vip_progress(user_id: str) -> dict:
    """Get player's VIP progress"""
    progress = await db.vip_progress.find_one({"user_id": user_id}, {"_id": 0})
    
    if not progress:
        progress = {
            "user_id": user_id,
            "vip_points": 0,
            "lifetime_vip_points": 0,
            "claimed_milestones": [],
            "catch_of_day": None,
            "catch_of_day_progress": 0,
            "catch_of_day_completed": False,
            "weekly_challenges": {},
            "week_start": None
        }
        await db.vip_progress.insert_one(progress)
    
    return progress


def get_current_week_start() -> str:
    """Get the start of the current week (Monday)"""
    today = datetime.now(timezone.utc)
    week_start = today - timedelta(days=today.weekday())
    return week_start.strftime("%Y-%m-%d")


# ========== VIP DAILY ENDPOINTS ==========

@router.get("/catch-of-day/{user_id}")
async def get_catch_of_the_day(user_id: str):
    """Get today's catch of the day challenge"""
    # Check VIP status
    vip = await db.player_vip.find_one({"user_id": user_id}, {"_id": 0})
    
    if not vip or not vip.get("is_active"):
        raise HTTPException(status_code=403, detail="VIP membership required")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
    user_level = user.get("level", 1) if user else 1
    
    progress = await get_player_vip_progress(user_id)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check if catch of day needs to be generated/reset
    current_cod = progress.get("catch_of_day")
    
    if not current_cod or current_cod.get("date") != today:
        # Generate new catch of day
        new_cod = generate_catch_of_the_day(user_id, user_level)
        
        await db.vip_progress.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "catch_of_day": new_cod,
                    "catch_of_day_progress": 0,
                    "catch_of_day_completed": False
                }
            }
        )
        
        current_cod = new_cod
        progress["catch_of_day_progress"] = 0
        progress["catch_of_day_completed"] = False
    
    return {
        "catch_of_day": current_cod,
        "progress": progress.get("catch_of_day_progress", 0),
        "completed": progress.get("catch_of_day_completed", False),
        "vip_tier": vip.get("tier", 1)
    }


@router.post("/catch-of-day/record")
async def record_catch_progress(request: RecordVIPCatchRequest):
    """Record a catch toward the catch of the day"""
    vip = await db.player_vip.find_one({"user_id": request.user_id}, {"_id": 0})
    
    if not vip or not vip.get("is_active"):
        return {"success": False, "message": "Not a VIP member"}
    
    progress = await get_player_vip_progress(request.user_id)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    cod = progress.get("catch_of_day")
    
    if not cod or cod.get("date") != today:
        return {"success": False, "message": "No active catch of day"}
    
    if progress.get("catch_of_day_completed"):
        return {"success": True, "message": "Already completed", "completed": True}
    
    # Check if fish matches target
    target = cod["target_fish"].lower().replace("_", " ")
    caught = request.fish_name.lower()
    
    if target in caught or caught in target or request.fish_id.lower() == cod["target_fish"].lower():
        new_progress = progress.get("catch_of_day_progress", 0) + 1
        completed = new_progress >= cod["target_count"]
        
        update_ops = {"$set": {"catch_of_day_progress": new_progress}}
        
        if completed:
            update_ops["$set"]["catch_of_day_completed"] = True
        
        await db.vip_progress.update_one(
            {"user_id": request.user_id},
            update_ops
        )
        
        return {
            "success": True,
            "matched": True,
            "progress": new_progress,
            "target": cod["target_count"],
            "completed": completed
        }
    
    return {"success": True, "matched": False}


@router.post("/catch-of-day/claim")
async def claim_catch_of_day_reward(request: ClaimCatchOfDayRequest):
    """Claim reward for completing catch of the day"""
    vip = await db.player_vip.find_one({"user_id": request.user_id}, {"_id": 0})
    
    if not vip or not vip.get("is_active"):
        raise HTTPException(status_code=403, detail="VIP membership required")
    
    progress = await get_player_vip_progress(request.user_id)
    
    if not progress.get("catch_of_day_completed"):
        raise HTTPException(status_code=400, detail="Challenge not completed")
    
    cod = progress.get("catch_of_day")
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    if cod.get("date") != today:
        raise HTTPException(status_code=400, detail="Challenge expired")
    
    # Calculate VIP points with tier bonus
    base_points = cod["vip_points"]
    tier_bonus = 1 + (vip.get("tier", 1) * 0.1)  # +10% per tier
    total_points = int(base_points * tier_bonus * cod["bonus_multiplier"])
    
    # Award points
    await db.vip_progress.update_one(
        {"user_id": request.user_id},
        {
            "$inc": {
                "vip_points": total_points,
                "lifetime_vip_points": total_points
            },
            "$set": {
                "catch_of_day": {**cod, "claimed": True}
            }
        }
    )
    
    # Bonus coins
    bonus_coins = int(500 * cod["bonus_multiplier"])
    await db.users.update_one(
        {"id": request.user_id},
        {"$inc": {"coins": bonus_coins}}
    )
    
    return {
        "success": True,
        "vip_points_earned": total_points,
        "bonus_coins": bonus_coins,
        "difficulty": cod["difficulty"]
    }


@router.get("/points/{user_id}")
async def get_vip_points(user_id: str):
    """Get VIP points balance and available rewards"""
    progress = await get_player_vip_progress(user_id)
    vip = await db.player_vip.find_one({"user_id": user_id}, {"_id": 0})
    
    points = progress.get("vip_points", 0)
    claimed = progress.get("claimed_milestones", [])
    
    # Calculate available rewards
    available_rewards = []
    for milestone, rewards in sorted(VIP_POINT_REWARDS.items()):
        available_rewards.append({
            "milestone": milestone,
            "rewards": rewards,
            "claimed": milestone in claimed,
            "can_claim": points >= milestone and milestone not in claimed
        })
    
    return {
        "vip_points": points,
        "lifetime_points": progress.get("lifetime_vip_points", 0),
        "is_vip": vip.get("is_active", False) if vip else False,
        "vip_tier": vip.get("tier", 0) if vip else 0,
        "rewards": available_rewards
    }


@router.post("/points/redeem")
async def redeem_vip_points(request: RedeemVIPPointsRequest):
    """Redeem VIP points for rewards"""
    if request.milestone not in VIP_POINT_REWARDS:
        raise HTTPException(status_code=400, detail="Invalid milestone")
    
    progress = await get_player_vip_progress(request.user_id)
    
    if progress.get("vip_points", 0) < request.milestone:
        raise HTTPException(status_code=400, detail="Not enough VIP points")
    
    if request.milestone in progress.get("claimed_milestones", []):
        raise HTTPException(status_code=400, detail="Already claimed")
    
    rewards = VIP_POINT_REWARDS[request.milestone]
    
    # Award rewards
    user_update = {"$inc": {}}
    
    if rewards.get("coins"):
        user_update["$inc"]["coins"] = rewards["coins"]
    if rewards.get("gems"):
        user_update["$inc"]["gems"] = rewards["gems"]
    
    if user_update["$inc"]:
        await db.users.update_one({"id": request.user_id}, user_update)
    
    # Special rewards
    if rewards.get("vip_days"):
        # Extend VIP
        vip = await db.player_vip.find_one({"user_id": request.user_id})
        if vip and vip.get("expires_at"):
            new_expires = datetime.fromisoformat(vip["expires_at"]) + timedelta(days=rewards["vip_days"])
            await db.player_vip.update_one(
                {"user_id": request.user_id},
                {"$set": {"expires_at": new_expires.isoformat()}}
            )
    
    if rewards.get("exclusive_rod"):
        await db.player_equipment.update_one(
            {"user_id": request.user_id},
            {"$addToSet": {"owned_rods": rewards["exclusive_rod"]}},
            upsert=True
        )
    
    if rewards.get("exclusive_lure"):
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$addToSet": {"items": rewards["exclusive_lure"]}},
            upsert=True
        )
    
    if rewards.get("exclusive_title"):
        await db.player_titles.update_one(
            {"user_id": request.user_id},
            {"$addToSet": {"titles": rewards["exclusive_title"]}},
            upsert=True
        )
    
    # Mark as claimed (don't deduct points - they accumulate)
    await db.vip_progress.update_one(
        {"user_id": request.user_id},
        {"$push": {"claimed_milestones": request.milestone}}
    )
    
    return {"success": True, "rewards": rewards}


@router.get("/weekly-challenges/{user_id}")
async def get_weekly_challenges(user_id: str):
    """Get weekly VIP challenges"""
    vip = await db.player_vip.find_one({"user_id": user_id}, {"_id": 0})
    
    if not vip or not vip.get("is_active"):
        raise HTTPException(status_code=403, detail="VIP membership required")
    
    progress = await get_player_vip_progress(user_id)
    current_week = get_current_week_start()
    
    # Reset if new week
    if progress.get("week_start") != current_week:
        await db.vip_progress.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "week_start": current_week,
                    "weekly_challenges": {}
                }
            }
        )
        progress["weekly_challenges"] = {}
    
    # Build challenge status
    challenges = []
    for challenge in WEEKLY_VIP_CHALLENGES:
        challenge_progress = progress.get("weekly_challenges", {}).get(challenge["id"], {})
        challenges.append({
            **challenge,
            "current": challenge_progress.get("current", 0),
            "completed": challenge_progress.get("completed", False),
            "claimed": challenge_progress.get("claimed", False)
        })
    
    return {
        "week_start": current_week,
        "challenges": challenges
    }


@router.post("/weekly-challenges/update/{user_id}/{challenge_id}")
async def update_weekly_challenge(user_id: str, challenge_id: str, amount: int = 1):
    """Update progress on a weekly challenge"""
    progress = await get_player_vip_progress(user_id)
    
    challenge = next((c for c in WEEKLY_VIP_CHALLENGES if c["id"] == challenge_id), None)
    if not challenge:
        return {"success": False}
    
    current = progress.get("weekly_challenges", {}).get(challenge_id, {}).get("current", 0)
    new_current = current + amount
    completed = new_current >= challenge["target"]
    
    await db.vip_progress.update_one(
        {"user_id": user_id},
        {
            "$set": {
                f"weekly_challenges.{challenge_id}.current": new_current,
                f"weekly_challenges.{challenge_id}.completed": completed
            }
        }
    )
    
    return {"success": True, "current": new_current, "completed": completed}


@router.post("/weekly-challenges/claim/{user_id}/{challenge_id}")
async def claim_weekly_challenge(user_id: str, challenge_id: str):
    """Claim weekly challenge reward"""
    progress = await get_player_vip_progress(user_id)
    
    challenge = next((c for c in WEEKLY_VIP_CHALLENGES if c["id"] == challenge_id), None)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    challenge_data = progress.get("weekly_challenges", {}).get(challenge_id, {})
    
    if not challenge_data.get("completed"):
        raise HTTPException(status_code=400, detail="Challenge not completed")
    
    if challenge_data.get("claimed"):
        raise HTTPException(status_code=400, detail="Already claimed")
    
    # Award VIP points
    await db.vip_progress.update_one(
        {"user_id": user_id},
        {
            "$inc": {
                "vip_points": challenge["vip_points"],
                "lifetime_vip_points": challenge["vip_points"]
            },
            "$set": {f"weekly_challenges.{challenge_id}.claimed": True}
        }
    )
    
    return {"success": True, "vip_points_earned": challenge["vip_points"]}
