# ========== GO FISH! EVENT SYSTEM API ==========
# Limited-time events, seasonal content, and special challenges
# ~450+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random

router = APIRouter(prefix="/api/events", tags=["events"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== EVENT DEFINITIONS ==========

SEASONAL_EVENTS = {
    "spring_bloom": {
        "id": "spring_bloom",
        "name": "Spring Bloom Festival",
        "description": "Cherry blossoms fill the air! Catch special spring fish.",
        "season": "spring",
        "duration_days": 14,
        "icon": "🌸",
        "theme_color": "#FFB7C5",
        "special_fish": [
            {"id": "cherry_koi", "name": "Cherry Blossom Koi", "rarity": "rare", "points": 250},
            {"id": "spring_bass", "name": "Spring Bass", "rarity": "uncommon", "points": 150},
            {"id": "petal_fish", "name": "Petal Fish", "rarity": "common", "points": 75},
        ],
        "challenges": [
            {"id": "catch_cherry_koi", "name": "Catch 3 Cherry Blossom Koi", "target": 3, "reward": {"gems": 50}},
            {"id": "spring_catches", "name": "Catch 100 Spring Fish", "target": 100, "reward": {"coins": 5000}},
        ],
        "shop_items": [
            {"id": "spring_rod", "name": "Spring Blossom Rod", "cost": {"gems": 150}, "type": "rod"},
            {"id": "spring_lure", "name": "Petal Lure", "cost": {"event_tokens": 500}, "type": "lure"},
        ],
        "rewards": {
            1000: {"coins": 1000, "event_tokens": 100},
            5000: {"coins": 3000, "gems": 25, "event_tokens": 250},
            10000: {"coins": 5000, "gems": 50, "exclusive_fish": "cherry_koi_gold"},
            25000: {"coins": 10000, "gems": 100, "title": "Spring Champion"},
        },
    },
    "summer_splash": {
        "id": "summer_splash",
        "name": "Summer Splash",
        "description": "Beat the heat with tropical fish hunting!",
        "season": "summer",
        "duration_days": 14,
        "icon": "☀️",
        "theme_color": "#FFD700",
        "special_fish": [
            {"id": "tropical_angelfish", "name": "Tropical Angelfish", "rarity": "rare", "points": 275},
            {"id": "sunfish", "name": "Sunfish", "rarity": "uncommon", "points": 160},
            {"id": "coral_fish", "name": "Coral Fish", "rarity": "common", "points": 80},
        ],
        "challenges": [
            {"id": "catch_sunfish", "name": "Catch 5 Sunfish", "target": 5, "reward": {"gems": 40}},
            {"id": "summer_combo", "name": "Get 20x Combo", "target": 20, "reward": {"coins": 3000}},
        ],
        "rewards": {
            1000: {"coins": 1000, "event_tokens": 100},
            5000: {"coins": 3000, "gems": 25, "event_tokens": 250},
            10000: {"coins": 5000, "gems": 50, "exclusive_fish": "golden_sunfish"},
            25000: {"coins": 10000, "gems": 100, "title": "Summer Legend"},
        },
    },
    "autumn_harvest": {
        "id": "autumn_harvest",
        "name": "Autumn Harvest",
        "description": "Golden leaves fall as legendary fish appear!",
        "season": "autumn",
        "duration_days": 14,
        "icon": "🍂",
        "theme_color": "#D2691E",
        "special_fish": [
            {"id": "maple_carp", "name": "Maple Carp", "rarity": "rare", "points": 300},
            {"id": "harvest_bass", "name": "Harvest Bass", "rarity": "uncommon", "points": 170},
            {"id": "autumn_minnow", "name": "Autumn Minnow", "rarity": "common", "points": 70},
        ],
        "challenges": [
            {"id": "catch_maple", "name": "Catch 3 Maple Carp", "target": 3, "reward": {"gems": 60}},
            {"id": "harvest_score", "name": "Score 10,000 Points", "target": 10000, "reward": {"coins": 4000}},
        ],
        "rewards": {
            1000: {"coins": 1000, "event_tokens": 100},
            5000: {"coins": 3000, "gems": 25, "event_tokens": 250},
            10000: {"coins": 5000, "gems": 50, "exclusive_fish": "golden_maple_carp"},
            25000: {"coins": 10000, "gems": 100, "title": "Harvest King"},
        },
    },
    "winter_wonderland": {
        "id": "winter_wonderland",
        "name": "Winter Wonderland",
        "description": "Ice fishing season! Catch rare winter fish under the frozen lakes.",
        "season": "winter",
        "duration_days": 14,
        "icon": "❄️",
        "theme_color": "#87CEEB",
        "special_fish": [
            {"id": "ice_dragon_fish", "name": "Ice Dragon Fish", "rarity": "legendary", "points": 500},
            {"id": "frost_trout", "name": "Frost Trout", "rarity": "rare", "points": 280},
            {"id": "snowflake_fish", "name": "Snowflake Fish", "rarity": "uncommon", "points": 140},
        ],
        "challenges": [
            {"id": "catch_ice_dragon", "name": "Catch an Ice Dragon Fish", "target": 1, "reward": {"gems": 100}},
            {"id": "winter_perfects", "name": "Get 50 Perfect Catches", "target": 50, "reward": {"coins": 5000}},
        ],
        "rewards": {
            1000: {"coins": 1000, "event_tokens": 100},
            5000: {"coins": 3000, "gems": 25, "event_tokens": 250},
            10000: {"coins": 5000, "gems": 75, "exclusive_fish": "ice_dragon_gold"},
            25000: {"coins": 15000, "gems": 150, "title": "Ice Fisher"},
        },
    },
}

SPECIAL_EVENTS = {
    "fishing_festival": {
        "id": "fishing_festival",
        "name": "Grand Fishing Festival",
        "description": "Annual fishing celebration with massive rewards!",
        "duration_days": 7,
        "icon": "🎉",
        "theme_color": "#FF69B4",
        "multipliers": {"xp": 2.0, "coins": 1.5, "rare_chance": 1.5},
        "challenges": [
            {"id": "festival_catches", "name": "Catch 500 Fish", "target": 500, "reward": {"gems": 100}},
            {"id": "festival_score", "name": "Score 50,000 Points", "target": 50000, "reward": {"exclusive_rod": "festival_rod"}},
        ],
    },
    "midnight_madness": {
        "id": "midnight_madness",
        "name": "Midnight Madness",
        "description": "Double rewards during night fishing hours!",
        "duration_days": 3,
        "icon": "🌙",
        "theme_color": "#191970",
        "time_restriction": {"start_hour": 20, "end_hour": 6},
        "multipliers": {"xp": 2.5, "coins": 2.0, "rare_chance": 2.0},
    },
    "whale_watching": {
        "id": "whale_watching",
        "name": "Whale Watching Week",
        "description": "Increased whale sightings with special rewards!",
        "duration_days": 5,
        "icon": "🐋",
        "theme_color": "#4169E1",
        "whale_chance_multiplier": 5.0,
        "whale_rewards": {"coins": 1000, "gems": 10},
    },
}


# ========== REQUEST MODELS ==========

class JoinEventRequest(BaseModel):
    user_id: str
    event_id: str


class UpdateEventProgressRequest(BaseModel):
    user_id: str
    event_id: str
    points_earned: int = 0
    fish_caught: Dict[str, int] = Field(default_factory=dict)
    challenge_progress: Dict[str, int] = Field(default_factory=dict)


class ClaimEventRewardRequest(BaseModel):
    user_id: str
    event_id: str
    milestone: int


class PurchaseEventItemRequest(BaseModel):
    user_id: str
    event_id: str
    item_id: str


# ========== HELPER FUNCTIONS ==========

def get_current_season() -> str:
    """Get current season based on date"""
    month = datetime.now(timezone.utc).month
    if month in [3, 4, 5]:
        return "spring"
    elif month in [6, 7, 8]:
        return "summer"
    elif month in [9, 10, 11]:
        return "autumn"
    else:
        return "winter"


async def get_active_events() -> List[dict]:
    """Get all currently active events"""
    now = datetime.now(timezone.utc)
    
    # Get events from database
    active_db_events = await db.active_events.find({
        "end_time": {"$gt": now.isoformat()}
    }, {"_id": 0}).to_list(20)
    
    return active_db_events


async def get_player_event_progress(user_id: str, event_id: str) -> dict:
    """Get player's progress in an event"""
    progress = await db.player_event_progress.find_one({
        "user_id": user_id,
        "event_id": event_id
    }, {"_id": 0})
    
    if not progress:
        progress = {
            "user_id": user_id,
            "event_id": event_id,
            "joined_at": None,
            "points": 0,
            "fish_caught": {},
            "challenges_progress": {},
            "challenges_completed": [],
            "milestones_claimed": [],
            "event_tokens": 0,
        }
    
    return progress


# ========== EVENT ENDPOINTS ==========

@router.get("/active")
async def get_active_events_list():
    """Get all active events"""
    active = await get_active_events()
    current_season = get_current_season()
    
    # Check if seasonal event should be active
    seasonal = SEASONAL_EVENTS.get(f"{current_season}_{'bloom' if current_season == 'spring' else 'splash' if current_season == 'summer' else 'harvest' if current_season == 'autumn' else 'wonderland'}")
    
    return {
        "active_events": active,
        "current_season": current_season,
        "seasonal_event": seasonal,
    }


@router.get("/{event_id}")
async def get_event_details(event_id: str):
    """Get event details"""
    # Check seasonal events
    for season_id, event in SEASONAL_EVENTS.items():
        if event["id"] == event_id:
            return {"event": event, "type": "seasonal"}
    
    # Check special events
    for special_id, event in SPECIAL_EVENTS.items():
        if event["id"] == event_id:
            return {"event": event, "type": "special"}
    
    # Check database
    db_event = await db.active_events.find_one({"id": event_id}, {"_id": 0})
    if db_event:
        return {"event": db_event, "type": "custom"}
    
    raise HTTPException(status_code=404, detail="Event not found")


@router.post("/join")
async def join_event(request: JoinEventRequest):
    """Join an event"""
    # Get event details
    event_data = None
    for events_dict in [SEASONAL_EVENTS, SPECIAL_EVENTS]:
        for event_id, event in events_dict.items():
            if event["id"] == request.event_id:
                event_data = event
                break
    
    if not event_data:
        db_event = await db.active_events.find_one({"id": request.event_id}, {"_id": 0})
        if db_event:
            event_data = db_event
    
    if not event_data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if already joined
    existing = await db.player_event_progress.find_one({
        "user_id": request.user_id,
        "event_id": request.event_id
    })
    
    if existing:
        return {"success": True, "message": "Already joined", "progress": existing}
    
    # Create progress record
    progress = {
        "user_id": request.user_id,
        "event_id": request.event_id,
        "joined_at": datetime.now(timezone.utc).isoformat(),
        "points": 0,
        "fish_caught": {},
        "challenges_progress": {},
        "challenges_completed": [],
        "milestones_claimed": [],
        "event_tokens": 0,
    }
    
    await db.player_event_progress.insert_one(progress)
    
    return {"success": True, "event": event_data, "progress": progress}


@router.get("/progress/{user_id}/{event_id}")
async def get_event_progress(user_id: str, event_id: str):
    """Get player's event progress"""
    progress = await get_player_event_progress(user_id, event_id)
    
    # Get event details for context
    event_data = None
    for events_dict in [SEASONAL_EVENTS, SPECIAL_EVENTS]:
        for eid, event in events_dict.items():
            if event["id"] == event_id:
                event_data = event
                break
    
    # Calculate next milestone
    next_milestone = None
    if event_data and "rewards" in event_data:
        for milestone, _ in sorted(event_data["rewards"].items()):
            if milestone > progress["points"] and milestone not in progress.get("milestones_claimed", []):
                next_milestone = milestone
                break
    
    return {
        "progress": progress,
        "event": event_data,
        "next_milestone": next_milestone,
    }


@router.post("/progress/update")
async def update_event_progress(request: UpdateEventProgressRequest):
    """Update player's event progress"""
    progress = await get_player_event_progress(request.user_id, request.event_id)
    
    if not progress.get("joined_at"):
        raise HTTPException(status_code=400, detail="Not joined to this event")
    
    # Update points
    new_points = progress["points"] + request.points_earned
    
    # Update fish caught
    fish_caught = progress.get("fish_caught", {})
    for fish_id, count in request.fish_caught.items():
        fish_caught[fish_id] = fish_caught.get(fish_id, 0) + count
    
    # Update challenge progress
    challenges_progress = progress.get("challenges_progress", {})
    for challenge_id, amount in request.challenge_progress.items():
        challenges_progress[challenge_id] = challenges_progress.get(challenge_id, 0) + amount
    
    # Check completed challenges
    completed_challenges = progress.get("challenges_completed", [])
    
    # Get event for challenge targets
    event_data = None
    for events_dict in [SEASONAL_EVENTS, SPECIAL_EVENTS]:
        for eid, event in events_dict.items():
            if event["id"] == request.event_id:
                event_data = event
                break
    
    newly_completed = []
    if event_data and "challenges" in event_data:
        for challenge in event_data["challenges"]:
            if challenge["id"] not in completed_challenges:
                current = challenges_progress.get(challenge["id"], 0)
                if current >= challenge["target"]:
                    completed_challenges.append(challenge["id"])
                    newly_completed.append(challenge)
                    
                    # Award challenge reward
                    for currency, amount in challenge["reward"].items():
                        if currency == "event_tokens":
                            progress["event_tokens"] = progress.get("event_tokens", 0) + amount
                        else:
                            await db.users.update_one(
                                {"id": request.user_id},
                                {"$inc": {currency: amount}}
                            )
    
    # Update database
    await db.player_event_progress.update_one(
        {"user_id": request.user_id, "event_id": request.event_id},
        {
            "$set": {
                "points": new_points,
                "fish_caught": fish_caught,
                "challenges_progress": challenges_progress,
                "challenges_completed": completed_challenges,
                "event_tokens": progress.get("event_tokens", 0),
            }
        },
        upsert=True
    )
    
    return {
        "success": True,
        "new_points": new_points,
        "newly_completed_challenges": newly_completed,
    }


@router.post("/reward/claim")
async def claim_event_reward(request: ClaimEventRewardRequest):
    """Claim a milestone reward"""
    progress = await get_player_event_progress(request.user_id, request.event_id)
    
    if request.milestone in progress.get("milestones_claimed", []):
        raise HTTPException(status_code=400, detail="Reward already claimed")
    
    if progress["points"] < request.milestone:
        raise HTTPException(status_code=400, detail="Milestone not reached")
    
    # Get rewards
    event_data = None
    for events_dict in [SEASONAL_EVENTS, SPECIAL_EVENTS]:
        for eid, event in events_dict.items():
            if event["id"] == request.event_id:
                event_data = event
                break
    
    if not event_data or "rewards" not in event_data:
        raise HTTPException(status_code=404, detail="Event rewards not found")
    
    rewards = event_data["rewards"].get(request.milestone)
    if not rewards:
        raise HTTPException(status_code=404, detail="Milestone reward not found")
    
    # Award rewards
    for reward_type, value in rewards.items():
        if reward_type == "coins":
            await db.users.update_one({"id": request.user_id}, {"$inc": {"coins": value}})
        elif reward_type == "gems":
            await db.users.update_one({"id": request.user_id}, {"$inc": {"gems": value}})
        elif reward_type == "event_tokens":
            await db.player_event_progress.update_one(
                {"user_id": request.user_id, "event_id": request.event_id},
                {"$inc": {"event_tokens": value}}
            )
        elif reward_type == "title":
            await db.player_titles.update_one(
                {"user_id": request.user_id},
                {"$addToSet": {"titles": value}},
                upsert=True
            )
        elif reward_type == "exclusive_fish":
            # Add exclusive fish to tacklebox
            exclusive_fish = {
                "id": str(uuid.uuid4()),
                "user_id": request.user_id,
                "name": value.replace("_", " ").title(),
                "is_exclusive": True,
                "event_id": request.event_id,
                "acquired_at": datetime.now(timezone.utc).isoformat(),
            }
            await db.tacklebox.insert_one(exclusive_fish)
    
    # Mark as claimed
    await db.player_event_progress.update_one(
        {"user_id": request.user_id, "event_id": request.event_id},
        {"$push": {"milestones_claimed": request.milestone}}
    )
    
    return {"success": True, "rewards": rewards}


@router.get("/shop/{event_id}")
async def get_event_shop(event_id: str):
    """Get event shop items"""
    event_data = None
    for events_dict in [SEASONAL_EVENTS, SPECIAL_EVENTS]:
        for eid, event in events_dict.items():
            if event["id"] == event_id:
                event_data = event
                break
    
    if not event_data or "shop_items" not in event_data:
        return {"items": []}
    
    return {"items": event_data["shop_items"]}


@router.post("/shop/purchase")
async def purchase_event_item(request: PurchaseEventItemRequest):
    """Purchase item from event shop"""
    progress = await get_player_event_progress(request.user_id, request.event_id)
    
    event_data = None
    for events_dict in [SEASONAL_EVENTS, SPECIAL_EVENTS]:
        for eid, event in events_dict.items():
            if event["id"] == request.event_id:
                event_data = event
                break
    
    if not event_data or "shop_items" not in event_data:
        raise HTTPException(status_code=404, detail="Event shop not found")
    
    item = next((i for i in event_data["shop_items"] if i["id"] == request.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Check cost
    for currency, cost in item["cost"].items():
        if currency == "event_tokens":
            if progress.get("event_tokens", 0) < cost:
                raise HTTPException(status_code=400, detail="Not enough event tokens")
        else:
            user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
            if user.get(currency, 0) < cost:
                raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct cost
    for currency, cost in item["cost"].items():
        if currency == "event_tokens":
            await db.player_event_progress.update_one(
                {"user_id": request.user_id, "event_id": request.event_id},
                {"$inc": {"event_tokens": -cost}}
            )
        else:
            await db.users.update_one(
                {"id": request.user_id},
                {"$inc": {currency: -cost}}
            )
    
    # Add item to inventory
    await db.player_inventory.update_one(
        {"user_id": request.user_id},
        {"$addToSet": {"items": item["id"]}},
        upsert=True
    )
    
    return {"success": True, "item": item}


@router.get("/leaderboard/{event_id}")
async def get_event_leaderboard(event_id: str, limit: int = 100):
    """Get event leaderboard"""
    entries = await db.player_event_progress.find(
        {"event_id": event_id},
        {"_id": 0, "user_id": 1, "points": 1}
    ).sort("points", -1).limit(limit).to_list(limit)
    
    # Enrich with usernames
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1
        user = await db.users.find_one({"id": entry["user_id"]}, {"_id": 0, "username": 1})
        entry["username"] = user.get("username", "Unknown") if user else "Unknown"
    
    return {"leaderboard": entries}


# ========== ADMIN: CREATE EVENT ==========

@router.post("/admin/create")
async def create_custom_event(
    name: str,
    description: str,
    duration_days: int,
    icon: str = "🎣",
    theme_color: str = "#4A90D9"
):
    """Create a custom event"""
    now = datetime.now(timezone.utc)
    
    event = {
        "id": str(uuid.uuid4()),
        "name": name,
        "description": description,
        "icon": icon,
        "theme_color": theme_color,
        "start_time": now.isoformat(),
        "end_time": (now + timedelta(days=duration_days)).isoformat(),
        "created_at": now.isoformat(),
    }
    
    await db.active_events.insert_one(event)
    
    return {"success": True, "event": event}
