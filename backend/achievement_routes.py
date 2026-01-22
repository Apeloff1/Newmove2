# ========== GO FISH! ACHIEVEMENT & PROGRESSION SYSTEM API ==========
# Achievements, badges, daily rewards, and progression milestones
# ~450+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== ACHIEVEMENT DEFINITIONS ==========

ACHIEVEMENTS = {
    # Fishing Achievements
    "first_catch": {
        "id": "first_catch",
        "name": "First Catch",
        "description": "Catch your first fish",
        "category": "fishing",
        "icon": "🎣",
        "xp_reward": 50,
        "coin_reward": 100,
        "hidden": False,
        "requirement": {"type": "fish_caught", "count": 1},
    },
    "ten_catches": {
        "id": "ten_catches",
        "name": "Getting Started",
        "description": "Catch 10 fish",
        "category": "fishing",
        "icon": "🐟",
        "xp_reward": 100,
        "coin_reward": 250,
        "hidden": False,
        "requirement": {"type": "fish_caught", "count": 10},
    },
    "hundred_catches": {
        "id": "hundred_catches",
        "name": "Fisherman",
        "description": "Catch 100 fish",
        "category": "fishing",
        "icon": "🐠",
        "xp_reward": 300,
        "coin_reward": 1000,
        "gem_reward": 10,
        "hidden": False,
        "requirement": {"type": "fish_caught", "count": 100},
    },
    "thousand_catches": {
        "id": "thousand_catches",
        "name": "Master Angler",
        "description": "Catch 1,000 fish",
        "category": "fishing",
        "icon": "🎣✨",
        "xp_reward": 1000,
        "coin_reward": 5000,
        "gem_reward": 50,
        "title_reward": "Master Angler",
        "hidden": False,
        "requirement": {"type": "fish_caught", "count": 1000},
    },
    "ten_thousand_catches": {
        "id": "ten_thousand_catches",
        "name": "Legendary Fisher",
        "description": "Catch 10,000 fish",
        "category": "fishing",
        "icon": "👑🎣",
        "xp_reward": 5000,
        "coin_reward": 25000,
        "gem_reward": 200,
        "title_reward": "Legendary Fisher",
        "hidden": False,
        "requirement": {"type": "fish_caught", "count": 10000},
    },
    
    # Perfect Catch Achievements
    "perfect_1": {
        "id": "perfect_1",
        "name": "Perfect Timing",
        "description": "Get your first perfect catch",
        "category": "skill",
        "icon": "✨",
        "xp_reward": 75,
        "coin_reward": 150,
        "hidden": False,
        "requirement": {"type": "perfect_catches", "count": 1},
    },
    "perfect_50": {
        "id": "perfect_50",
        "name": "Precision Fisher",
        "description": "Get 50 perfect catches",
        "category": "skill",
        "icon": "⭐",
        "xp_reward": 500,
        "coin_reward": 2000,
        "gem_reward": 25,
        "hidden": False,
        "requirement": {"type": "perfect_catches", "count": 50},
    },
    "perfect_500": {
        "id": "perfect_500",
        "name": "Flawless Technique",
        "description": "Get 500 perfect catches",
        "category": "skill",
        "icon": "💫",
        "xp_reward": 2000,
        "coin_reward": 10000,
        "gem_reward": 100,
        "title_reward": "Perfectionist",
        "hidden": False,
        "requirement": {"type": "perfect_catches", "count": 500},
    },
    
    # Combo Achievements
    "combo_5": {
        "id": "combo_5",
        "name": "Combo Starter",
        "description": "Get a 5x combo",
        "category": "skill",
        "icon": "🔥",
        "xp_reward": 100,
        "coin_reward": 300,
        "hidden": False,
        "requirement": {"type": "max_combo", "count": 5},
    },
    "combo_15": {
        "id": "combo_15",
        "name": "Combo Master",
        "description": "Get a 15x combo",
        "category": "skill",
        "icon": "🔥🔥",
        "xp_reward": 400,
        "coin_reward": 1500,
        "gem_reward": 15,
        "hidden": False,
        "requirement": {"type": "max_combo", "count": 15},
    },
    "combo_30": {
        "id": "combo_30",
        "name": "Unstoppable",
        "description": "Get a 30x combo",
        "category": "skill",
        "icon": "🔥🔥🔥",
        "xp_reward": 1000,
        "coin_reward": 5000,
        "gem_reward": 50,
        "title_reward": "Combo King",
        "hidden": False,
        "requirement": {"type": "max_combo", "count": 30},
    },
    
    # Rare Fish Achievements
    "rare_1": {
        "id": "rare_1",
        "name": "Rare Discovery",
        "description": "Catch your first rare fish",
        "category": "collection",
        "icon": "💎",
        "xp_reward": 150,
        "coin_reward": 500,
        "hidden": False,
        "requirement": {"type": "rare_fish", "count": 1},
    },
    "rare_25": {
        "id": "rare_25",
        "name": "Rare Collector",
        "description": "Catch 25 rare fish",
        "category": "collection",
        "icon": "💎💎",
        "xp_reward": 750,
        "coin_reward": 3000,
        "gem_reward": 30,
        "hidden": False,
        "requirement": {"type": "rare_fish", "count": 25},
    },
    "legendary_1": {
        "id": "legendary_1",
        "name": "Legendary Encounter",
        "description": "Catch a legendary fish",
        "category": "collection",
        "icon": "👑",
        "xp_reward": 500,
        "coin_reward": 2500,
        "gem_reward": 25,
        "hidden": False,
        "requirement": {"type": "legendary_fish", "count": 1},
    },
    "legendary_10": {
        "id": "legendary_10",
        "name": "Legend Hunter",
        "description": "Catch 10 legendary fish",
        "category": "collection",
        "icon": "👑👑",
        "xp_reward": 2500,
        "coin_reward": 15000,
        "gem_reward": 150,
        "title_reward": "Legend Hunter",
        "hidden": False,
        "requirement": {"type": "legendary_fish", "count": 10},
    },
    
    # Level Achievements
    "level_10": {
        "id": "level_10",
        "name": "Rising Star",
        "description": "Reach level 10",
        "category": "progression",
        "icon": "⬆️",
        "xp_reward": 0,
        "coin_reward": 1000,
        "gem_reward": 10,
        "hidden": False,
        "requirement": {"type": "level", "count": 10},
    },
    "level_25": {
        "id": "level_25",
        "name": "Expert Fisher",
        "description": "Reach level 25",
        "category": "progression",
        "icon": "🌟",
        "xp_reward": 0,
        "coin_reward": 5000,
        "gem_reward": 50,
        "hidden": False,
        "requirement": {"type": "level", "count": 25},
    },
    "level_50": {
        "id": "level_50",
        "name": "Fishing Master",
        "description": "Reach level 50",
        "category": "progression",
        "icon": "🏆",
        "xp_reward": 0,
        "coin_reward": 15000,
        "gem_reward": 150,
        "title_reward": "Fishing Master",
        "hidden": False,
        "requirement": {"type": "level", "count": 50},
    },
    "level_100": {
        "id": "level_100",
        "name": "Grand Master",
        "description": "Reach level 100",
        "category": "progression",
        "icon": "👑✨",
        "xp_reward": 0,
        "coin_reward": 50000,
        "gem_reward": 500,
        "title_reward": "Grand Master",
        "hidden": False,
        "requirement": {"type": "level", "count": 100},
    },
    
    # Social/Guild Achievements
    "join_guild": {
        "id": "join_guild",
        "name": "Team Player",
        "description": "Join a guild",
        "category": "social",
        "icon": "👥",
        "xp_reward": 100,
        "coin_reward": 500,
        "hidden": False,
        "requirement": {"type": "guild_joined", "count": 1},
    },
    "create_guild": {
        "id": "create_guild",
        "name": "Guild Founder",
        "description": "Create a guild",
        "category": "social",
        "icon": "🏰",
        "xp_reward": 250,
        "coin_reward": 1000,
        "gem_reward": 20,
        "hidden": False,
        "requirement": {"type": "guild_created", "count": 1},
    },
    "tournament_win": {
        "id": "tournament_win",
        "name": "Tournament Victor",
        "description": "Win a tournament",
        "category": "competition",
        "icon": "🏅",
        "xp_reward": 500,
        "coin_reward": 3000,
        "gem_reward": 30,
        "hidden": False,
        "requirement": {"type": "tournament_wins", "count": 1},
    },
    "tournament_10_wins": {
        "id": "tournament_10_wins",
        "name": "Champion",
        "description": "Win 10 tournaments",
        "category": "competition",
        "icon": "🏆",
        "xp_reward": 2500,
        "coin_reward": 20000,
        "gem_reward": 200,
        "title_reward": "Champion",
        "hidden": False,
        "requirement": {"type": "tournament_wins", "count": 10},
    },
    
    # Breeding Achievements
    "first_breed": {
        "id": "first_breed",
        "name": "Fish Breeder",
        "description": "Breed your first fish",
        "category": "breeding",
        "icon": "🧬",
        "xp_reward": 150,
        "coin_reward": 500,
        "hidden": False,
        "requirement": {"type": "fish_bred", "count": 1},
    },
    "breed_special": {
        "id": "breed_special",
        "name": "Special Discovery",
        "description": "Breed a special fish variant",
        "category": "breeding",
        "icon": "🧬✨",
        "xp_reward": 500,
        "coin_reward": 2500,
        "gem_reward": 25,
        "hidden": True,
        "requirement": {"type": "special_breed", "count": 1},
    },
    
    # Crafting Achievements
    "first_craft": {
        "id": "first_craft",
        "name": "Craftsman",
        "description": "Craft your first item",
        "category": "crafting",
        "icon": "🔨",
        "xp_reward": 100,
        "coin_reward": 300,
        "hidden": False,
        "requirement": {"type": "items_crafted", "count": 1},
    },
    "craft_50": {
        "id": "craft_50",
        "name": "Master Craftsman",
        "description": "Craft 50 items",
        "category": "crafting",
        "icon": "🔨✨",
        "xp_reward": 500,
        "coin_reward": 2000,
        "gem_reward": 20,
        "hidden": False,
        "requirement": {"type": "items_crafted", "count": 50},
    },
    
    # Secret/Hidden Achievements
    "night_fisher": {
        "id": "night_fisher",
        "name": "Night Owl",
        "description": "Catch 50 fish during night time",
        "category": "hidden",
        "icon": "🌙",
        "xp_reward": 400,
        "coin_reward": 2000,
        "gem_reward": 20,
        "hidden": True,
        "requirement": {"type": "night_catches", "count": 50},
    },
    "storm_chaser": {
        "id": "storm_chaser",
        "name": "Storm Chaser",
        "description": "Catch 25 fish during a storm",
        "category": "hidden",
        "icon": "⛈️",
        "xp_reward": 600,
        "coin_reward": 3000,
        "gem_reward": 30,
        "hidden": True,
        "requirement": {"type": "storm_catches", "count": 25},
    },
    "whale_watcher": {
        "id": "whale_watcher",
        "name": "Whale Watcher",
        "description": "Spot 10 whales",
        "category": "hidden",
        "icon": "🐋",
        "xp_reward": 300,
        "coin_reward": 1500,
        "gem_reward": 15,
        "hidden": True,
        "requirement": {"type": "whales_spotted", "count": 10},
    },
}

# Daily Login Rewards
DAILY_REWARDS = [
    {"day": 1, "rewards": {"coins": 100, "xp": 25}},
    {"day": 2, "rewards": {"coins": 150, "xp": 50}},
    {"day": 3, "rewards": {"coins": 200, "gems": 5, "xp": 75}},
    {"day": 4, "rewards": {"coins": 250, "xp": 100}},
    {"day": 5, "rewards": {"coins": 300, "xp": 125}},
    {"day": 6, "rewards": {"coins": 400, "gems": 10, "xp": 150}},
    {"day": 7, "rewards": {"coins": 500, "gems": 25, "xp": 200, "item": "weekly_mystery_box"}},
]


# ========== REQUEST MODELS ==========

class CheckAchievementRequest(BaseModel):
    user_id: str
    achievement_id: str


class ClaimDailyRewardRequest(BaseModel):
    user_id: str


class UpdateProgressRequest(BaseModel):
    user_id: str
    stat_type: str
    amount: int = 1


# ========== HELPER FUNCTIONS ==========

async def get_player_progress(user_id: str) -> dict:
    """Get player's achievement progress"""
    progress = await db.achievement_progress.find_one({"user_id": user_id}, {"_id": 0})
    
    if not progress:
        progress = {
            "user_id": user_id,
            "stats": {
                "fish_caught": 0,
                "perfect_catches": 0,
                "max_combo": 0,
                "rare_fish": 0,
                "legendary_fish": 0,
                "fish_bred": 0,
                "items_crafted": 0,
                "tournament_wins": 0,
                "night_catches": 0,
                "storm_catches": 0,
                "whales_spotted": 0,
            },
            "unlocked_achievements": [],
            "claimed_achievements": [],
        }
        await db.achievement_progress.insert_one(progress)
    
    return progress


async def check_and_unlock_achievements(user_id: str) -> List[dict]:
    """Check all achievements and unlock any that qualify"""
    progress = await get_player_progress(user_id)
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
    
    newly_unlocked = []
    
    for ach_id, achievement in ACHIEVEMENTS.items():
        if ach_id in progress.get("unlocked_achievements", []):
            continue
        
        req = achievement["requirement"]
        req_type = req["type"]
        req_count = req["count"]
        
        # Check stat-based requirements
        if req_type in progress.get("stats", {}):
            current = progress["stats"].get(req_type, 0)
            if current >= req_count:
                newly_unlocked.append(achievement)
        
        # Check level requirement
        elif req_type == "level":
            if user and user.get("level", 1) >= req_count:
                newly_unlocked.append(achievement)
        
        # Check guild requirements
        elif req_type == "guild_joined":
            guild_member = await db.guild_members.find_one({"user_id": user_id})
            if guild_member:
                newly_unlocked.append(achievement)
        
        elif req_type == "guild_created":
            guild = await db.guilds.find_one({"leader_id": user_id})
            if guild:
                newly_unlocked.append(achievement)
        
        # Check special breed
        elif req_type == "special_breed":
            lab = await db.breeding_lab.find_one({"user_id": user_id}, {"_id": 0})
            if lab and len(lab.get("rare_discoveries", [])) >= req_count:
                newly_unlocked.append(achievement)
    
    # Unlock achievements
    if newly_unlocked:
        unlock_ids = [a["id"] for a in newly_unlocked]
        await db.achievement_progress.update_one(
            {"user_id": user_id},
            {"$push": {"unlocked_achievements": {"$each": unlock_ids}}}
        )
    
    return newly_unlocked


# ========== ACHIEVEMENT ENDPOINTS ==========

@router.get("/all")
async def get_all_achievements(include_hidden: bool = False):
    """Get all achievements"""
    achievements = []
    for ach_id, achievement in ACHIEVEMENTS.items():
        if not include_hidden and achievement.get("hidden"):
            # Show hidden achievement with masked info
            achievements.append({
                "id": ach_id,
                "name": "???",
                "description": "Hidden achievement",
                "category": "hidden",
                "icon": "❓",
                "hidden": True,
            })
        else:
            achievements.append(achievement)
    
    return {"achievements": achievements}


@router.get("/progress/{user_id}")
async def get_achievement_progress(user_id: str):
    """Get player's achievement progress"""
    progress = await get_player_progress(user_id)
    
    # Calculate achievement stats
    total = len(ACHIEVEMENTS)
    unlocked = len(progress.get("unlocked_achievements", []))
    claimed = len(progress.get("claimed_achievements", []))
    
    # Get detailed achievement list
    achievements = []
    for ach_id, achievement in ACHIEVEMENTS.items():
        ach_copy = dict(achievement)
        ach_copy["unlocked"] = ach_id in progress.get("unlocked_achievements", [])
        ach_copy["claimed"] = ach_id in progress.get("claimed_achievements", [])
        
        # Show progress toward achievement
        req = achievement["requirement"]
        if req["type"] in progress.get("stats", {}):
            ach_copy["current"] = progress["stats"].get(req["type"], 0)
            ach_copy["target"] = req["count"]
            ach_copy["progress_percent"] = min(100, int((ach_copy["current"] / req["count"]) * 100))
        
        achievements.append(ach_copy)
    
    return {
        "stats": {
            "total": total,
            "unlocked": unlocked,
            "claimed": claimed,
            "completion_percent": round((unlocked / total) * 100, 1),
        },
        "achievements": achievements,
        "progress_stats": progress.get("stats", {}),
    }


@router.post("/check")
async def check_achievements(user_id: str):
    """Check and unlock any qualifying achievements"""
    newly_unlocked = await check_and_unlock_achievements(user_id)
    
    return {
        "newly_unlocked": newly_unlocked,
        "count": len(newly_unlocked),
    }


@router.post("/claim")
async def claim_achievement(request: CheckAchievementRequest):
    """Claim rewards for an unlocked achievement"""
    progress = await get_player_progress(request.user_id)
    
    if request.achievement_id not in progress.get("unlocked_achievements", []):
        raise HTTPException(status_code=400, detail="Achievement not unlocked")
    
    if request.achievement_id in progress.get("claimed_achievements", []):
        raise HTTPException(status_code=400, detail="Already claimed")
    
    achievement = ACHIEVEMENTS.get(request.achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    # Award rewards
    rewards = {}
    
    if achievement.get("xp_reward"):
        rewards["xp"] = achievement["xp_reward"]
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"xp": achievement["xp_reward"]}}
        )
    
    if achievement.get("coin_reward"):
        rewards["coins"] = achievement["coin_reward"]
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"coins": achievement["coin_reward"]}}
        )
    
    if achievement.get("gem_reward"):
        rewards["gems"] = achievement["gem_reward"]
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"gems": achievement["gem_reward"]}}
        )
    
    if achievement.get("title_reward"):
        rewards["title"] = achievement["title_reward"]
        await db.player_titles.update_one(
            {"user_id": request.user_id},
            {"$addToSet": {"titles": achievement["title_reward"]}},
            upsert=True
        )
    
    # Mark as claimed
    await db.achievement_progress.update_one(
        {"user_id": request.user_id},
        {"$push": {"claimed_achievements": request.achievement_id}}
    )
    
    return {
        "success": True,
        "achievement": achievement["name"],
        "rewards": rewards,
    }


@router.post("/progress/update")
async def update_stat_progress(request: UpdateProgressRequest):
    """Update a progress stat"""
    valid_stats = [
        "fish_caught", "perfect_catches", "max_combo", "rare_fish",
        "legendary_fish", "fish_bred", "items_crafted", "tournament_wins",
        "night_catches", "storm_catches", "whales_spotted"
    ]
    
    if request.stat_type not in valid_stats:
        raise HTTPException(status_code=400, detail=f"Invalid stat type. Use: {valid_stats}")
    
    # Handle max_combo differently (it's a max, not a sum)
    if request.stat_type == "max_combo":
        await db.achievement_progress.update_one(
            {"user_id": request.user_id},
            {"$max": {f"stats.{request.stat_type}": request.amount}},
            upsert=True
        )
    else:
        await db.achievement_progress.update_one(
            {"user_id": request.user_id},
            {"$inc": {f"stats.{request.stat_type}": request.amount}},
            upsert=True
        )
    
    # Check for newly unlocked achievements
    newly_unlocked = await check_and_unlock_achievements(request.user_id)
    
    return {
        "success": True,
        "stat": request.stat_type,
        "newly_unlocked": newly_unlocked,
    }


# ========== DAILY REWARDS ENDPOINTS ==========

@router.get("/daily/status/{user_id}")
async def get_daily_reward_status(user_id: str):
    """Get daily reward status"""
    daily = await db.daily_rewards.find_one({"user_id": user_id}, {"_id": 0})
    
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    
    if not daily:
        return {
            "current_streak": 0,
            "last_claim": None,
            "can_claim": True,
            "today_reward": DAILY_REWARDS[0],
            "all_rewards": DAILY_REWARDS,
        }
    
    can_claim = daily.get("last_claim_date") != today
    
    # Check if streak should reset
    streak = daily.get("streak", 0)
    last_claim = daily.get("last_claim_date")
    
    if last_claim:
        last_date = datetime.strptime(last_claim, "%Y-%m-%d").date()
        today_date = now.date()
        days_diff = (today_date - last_date).days
        
        if days_diff > 1:
            streak = 0  # Reset streak
    
    # Get today's reward (cycle through 7 days)
    reward_day = (streak % 7) + 1 if can_claim else ((streak - 1) % 7) + 1
    today_reward = next((r for r in DAILY_REWARDS if r["day"] == reward_day), DAILY_REWARDS[0])
    
    return {
        "current_streak": streak,
        "last_claim": daily.get("last_claim_date"),
        "can_claim": can_claim,
        "today_reward": today_reward,
        "all_rewards": DAILY_REWARDS,
    }


@router.post("/daily/claim")
async def claim_daily_reward(request: ClaimDailyRewardRequest):
    """Claim daily reward"""
    daily = await db.daily_rewards.find_one({"user_id": request.user_id}, {"_id": 0})
    
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    
    if daily and daily.get("last_claim_date") == today:
        raise HTTPException(status_code=400, detail="Already claimed today")
    
    # Calculate streak
    streak = 1
    if daily and daily.get("last_claim_date"):
        last_date = datetime.strptime(daily["last_claim_date"], "%Y-%m-%d").date()
        days_diff = (now.date() - last_date).days
        
        if days_diff == 1:
            streak = daily.get("streak", 0) + 1
        else:
            streak = 1
    
    # Get reward
    reward_day = ((streak - 1) % 7) + 1
    reward_data = next((r for r in DAILY_REWARDS if r["day"] == reward_day), DAILY_REWARDS[0])
    
    # Award rewards
    rewards = reward_data["rewards"]
    
    update_ops = {"$inc": {}}
    for currency, amount in rewards.items():
        if currency in ["coins", "gems", "xp"]:
            update_ops["$inc"][currency] = amount
    
    if update_ops["$inc"]:
        await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Handle special item rewards
    if "item" in rewards:
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$push": {"items": rewards["item"]}},
            upsert=True
        )
    
    # Update daily record
    await db.daily_rewards.update_one(
        {"user_id": request.user_id},
        {
            "$set": {
                "last_claim_date": today,
                "last_claim_time": now.isoformat(),
                "streak": streak,
            },
            "$inc": {"total_claims": 1}
        },
        upsert=True
    )
    
    return {
        "success": True,
        "day": reward_day,
        "streak": streak,
        "rewards": rewards,
    }
