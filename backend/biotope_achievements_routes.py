# ========== GO FISH! BIOTOPE ACHIEVEMENTS & UNIFIED FISH DATABASE ==========
# Biotope-specific achievements and combined fish registry
# ~500+ lines of backend code

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
import os

# Import all fish databases
from fish_saltwater import SALTWATER_FISH
from fish_lake import LAKE_FISH
from fish_brackish import BRACKISH_FISH
from fish_river import RIVER_FISH

router = APIRouter(prefix="/api/biotope-fish", tags=["biotope_fish"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== UNIFIED FISH DATABASE ==========

ALL_BIOTOPE_FISH = {
    **SALTWATER_FISH,
    **LAKE_FISH,
    **BRACKISH_FISH,
    **RIVER_FISH
}

# Fish count summary
FISH_BY_BIOTOPE = {
    "saltwater": list(SALTWATER_FISH.keys()),
    "freshwater_lake": list(LAKE_FISH.keys()),
    "brackish": list(BRACKISH_FISH.keys()),
    "river": list(RIVER_FISH.keys())
}


# ========== BIOTOPE ACHIEVEMENTS ==========

BIOTOPE_ACHIEVEMENTS = {
    # SALTWATER ACHIEVEMENTS
    "saltwater_beginner": {
        "id": "saltwater_beginner",
        "name": "Ocean Novice",
        "description": "Catch 10 saltwater fish",
        "biotope": "saltwater",
        "category": "biotope",
        "icon": "🌊",
        "requirement": {"type": "saltwater_catches", "count": 10},
        "rewards": {"xp": 100, "coins": 500},
    },
    "saltwater_master": {
        "id": "saltwater_master",
        "name": "Master of the Deep",
        "description": "Catch 500 saltwater fish",
        "biotope": "saltwater",
        "category": "biotope",
        "icon": "🌊👑",
        "requirement": {"type": "saltwater_catches", "count": 500},
        "rewards": {"xp": 2000, "coins": 10000, "gems": 100, "title": "Ocean Master"},
    },
    "deep_sea_explorer": {
        "id": "deep_sea_explorer",
        "name": "Abyssal Explorer",
        "description": "Catch 25 deep sea fish",
        "biotope": "saltwater",
        "category": "biotope",
        "icon": "🦑",
        "requirement": {"type": "deep_sea_catches", "count": 25},
        "rewards": {"xp": 1000, "coins": 5000, "gems": 50},
    },
    "arctic_fisher": {
        "id": "arctic_fisher",
        "name": "Ice Fisher",
        "description": "Catch 50 fish in Arctic waters",
        "biotope": "saltwater",
        "category": "biotope",
        "icon": "❄️",
        "requirement": {"type": "arctic_catches", "count": 50},
        "rewards": {"xp": 800, "coins": 4000, "gems": 40},
    },
    "reef_diver": {
        "id": "reef_diver",
        "name": "Reef Explorer",
        "description": "Catch all 5 coral reef fish species",
        "biotope": "saltwater",
        "category": "collection",
        "icon": "🪸",
        "requirement": {"type": "reef_species", "count": 5},
        "rewards": {"xp": 600, "coins": 3000, "gems": 30},
    },
    
    # LAKE ACHIEVEMENTS
    "lake_beginner": {
        "id": "lake_beginner",
        "name": "Lake Angler",
        "description": "Catch 10 lake fish",
        "biotope": "freshwater_lake",
        "category": "biotope",
        "icon": "🏞️",
        "requirement": {"type": "lake_catches", "count": 10},
        "rewards": {"xp": 100, "coins": 500},
    },
    "lake_master": {
        "id": "lake_master",
        "name": "Lake Legend",
        "description": "Catch 500 lake fish",
        "biotope": "freshwater_lake",
        "category": "biotope",
        "icon": "🏞️👑",
        "requirement": {"type": "lake_catches", "count": 500},
        "rewards": {"xp": 2000, "coins": 10000, "gems": 100, "title": "Lake Legend"},
    },
    "bass_master": {
        "id": "bass_master",
        "name": "Bass Master",
        "description": "Catch 100 bass",
        "biotope": "freshwater_lake",
        "category": "species",
        "icon": "🐟",
        "requirement": {"type": "bass_catches", "count": 100},
        "rewards": {"xp": 500, "coins": 2500, "gems": 25},
    },
    "trophy_hunter_lake": {
        "id": "trophy_hunter_lake",
        "name": "Trophy Hunter",
        "description": "Catch a fish over 100cm in a lake",
        "biotope": "freshwater_lake",
        "category": "size",
        "icon": "🏆",
        "requirement": {"type": "lake_trophy", "size": 100},
        "rewards": {"xp": 400, "coins": 2000, "gems": 20},
    },
    "ancient_lake_explorer": {
        "id": "ancient_lake_explorer",
        "name": "Ancient Lake Explorer",
        "description": "Discover 5 fish species from Ancient Lake",
        "biotope": "freshwater_lake",
        "category": "collection",
        "icon": "🦕",
        "requirement": {"type": "ancient_lake_species", "count": 5},
        "rewards": {"xp": 1200, "coins": 6000, "gems": 60},
    },
    
    # BRACKISH ACHIEVEMENTS
    "brackish_beginner": {
        "id": "brackish_beginner",
        "name": "Estuary Explorer",
        "description": "Catch 10 brackish water fish",
        "biotope": "brackish",
        "category": "biotope",
        "icon": "🌿",
        "requirement": {"type": "brackish_catches", "count": 10},
        "rewards": {"xp": 100, "coins": 500},
    },
    "brackish_master": {
        "id": "brackish_master",
        "name": "Brackish Baron",
        "description": "Catch 500 brackish water fish",
        "biotope": "brackish",
        "category": "biotope",
        "icon": "🌿👑",
        "requirement": {"type": "brackish_catches", "count": 500},
        "rewards": {"xp": 2000, "coins": 10000, "gems": 100, "title": "Brackish Baron"},
    },
    "tarpon_hunter": {
        "id": "tarpon_hunter",
        "name": "Silver King Hunter",
        "description": "Catch 10 tarpon",
        "biotope": "brackish",
        "category": "species",
        "icon": "👑",
        "requirement": {"type": "tarpon_catches", "count": 10},
        "rewards": {"xp": 750, "coins": 3500, "gems": 35},
    },
    "mangrove_master": {
        "id": "mangrove_master",
        "name": "Mangrove Master",
        "description": "Catch all 5 mangrove forest fish",
        "biotope": "brackish",
        "category": "collection",
        "icon": "🌴",
        "requirement": {"type": "mangrove_species", "count": 5},
        "rewards": {"xp": 600, "coins": 3000, "gems": 30},
    },
    "delta_monster": {
        "id": "delta_monster",
        "name": "Delta Monster Hunter",
        "description": "Catch a legendary delta fish",
        "biotope": "brackish",
        "category": "rarity",
        "icon": "🐊",
        "requirement": {"type": "delta_legendary", "count": 1},
        "rewards": {"xp": 1500, "coins": 8000, "gems": 80},
    },
    
    # RIVER ACHIEVEMENTS
    "river_beginner": {
        "id": "river_beginner",
        "name": "River Runner",
        "description": "Catch 10 river fish",
        "biotope": "river",
        "category": "biotope",
        "icon": "🏔️",
        "requirement": {"type": "river_catches", "count": 10},
        "rewards": {"xp": 100, "coins": 500},
    },
    "river_master": {
        "id": "river_master",
        "name": "River King",
        "description": "Catch 500 river fish",
        "biotope": "river",
        "category": "biotope",
        "icon": "🏔️👑",
        "requirement": {"type": "river_catches", "count": 500},
        "rewards": {"xp": 2000, "coins": 10000, "gems": 100, "title": "River King"},
    },
    "trout_specialist": {
        "id": "trout_specialist",
        "name": "Trout Whisperer",
        "description": "Catch 100 trout of any species",
        "biotope": "river",
        "category": "species",
        "icon": "🌈",
        "requirement": {"type": "trout_catches", "count": 100},
        "rewards": {"xp": 500, "coins": 2500, "gems": 25},
    },
    "salmon_run": {
        "id": "salmon_run",
        "name": "Salmon Run Champion",
        "description": "Catch 50 salmon during spawning season",
        "biotope": "river",
        "category": "seasonal",
        "icon": "🐟",
        "requirement": {"type": "salmon_catches", "count": 50},
        "rewards": {"xp": 800, "coins": 4000, "gems": 40},
    },
    "sturgeon_slayer": {
        "id": "sturgeon_slayer",
        "name": "Sturgeon Slayer",
        "description": "Catch 10 sturgeon",
        "biotope": "river",
        "category": "species",
        "icon": "🦴",
        "requirement": {"type": "sturgeon_catches", "count": 10},
        "rewards": {"xp": 1000, "coins": 5000, "gems": 50},
    },
    
    # CROSS-BIOTOPE ACHIEVEMENTS
    "biotope_explorer": {
        "id": "biotope_explorer",
        "name": "Biotope Explorer",
        "description": "Catch at least 1 fish from each biotope",
        "biotope": "all",
        "category": "exploration",
        "icon": "🌍",
        "requirement": {"type": "biotopes_fished", "count": 4},
        "rewards": {"xp": 300, "coins": 1500, "gems": 15},
    },
    "world_angler": {
        "id": "world_angler",
        "name": "World Angler",
        "description": "Catch 100 fish from each biotope",
        "biotope": "all",
        "category": "exploration",
        "icon": "🌍👑",
        "requirement": {"type": "biotopes_mastered", "count": 4, "each": 100},
        "rewards": {"xp": 5000, "coins": 25000, "gems": 250, "title": "World Angler"},
    },
    "complete_encyclopedia": {
        "id": "complete_encyclopedia",
        "name": "Master Ichthyologist",
        "description": "Discover all 100 biotope fish species",
        "biotope": "all",
        "category": "collection",
        "icon": "📚",
        "requirement": {"type": "all_biotope_fish", "count": 100},
        "rewards": {"xp": 10000, "coins": 50000, "gems": 500, "title": "Master Ichthyologist"},
    },
    "size_matters": {
        "id": "size_matters",
        "name": "Size Matters",
        "description": "Catch a trophy-sized fish in all 4 biotopes",
        "biotope": "all",
        "category": "size",
        "icon": "📏",
        "requirement": {"type": "trophy_biotopes", "count": 4},
        "rewards": {"xp": 2000, "coins": 10000, "gems": 100},
    },
    "legendary_collector": {
        "id": "legendary_collector",
        "name": "Legendary Collector",
        "description": "Catch a legendary fish from each biotope",
        "biotope": "all",
        "category": "rarity",
        "icon": "👑👑",
        "requirement": {"type": "legendary_per_biotope", "count": 4},
        "rewards": {"xp": 5000, "coins": 30000, "gems": 300, "title": "Legend Seeker"},
    },
    
    # COOKING ACHIEVEMENTS
    "chef_beginner": {
        "id": "chef_beginner",
        "name": "Home Cook",
        "description": "Cook 10 dishes",
        "biotope": "cooking",
        "category": "cooking",
        "icon": "🍳",
        "requirement": {"type": "dishes_cooked", "count": 10},
        "rewards": {"xp": 150, "coins": 750},
    },
    "chef_master": {
        "id": "chef_master",
        "name": "Master Chef",
        "description": "Cook 100 dishes",
        "biotope": "cooking",
        "category": "cooking",
        "icon": "👨‍🍳",
        "requirement": {"type": "dishes_cooked", "count": 100},
        "rewards": {"xp": 1500, "coins": 7500, "gems": 75},
    },
    "gourmet": {
        "id": "gourmet",
        "name": "Gourmet",
        "description": "Cook a legendary dish",
        "biotope": "cooking",
        "category": "cooking",
        "icon": "⭐",
        "requirement": {"type": "legendary_dish", "count": 1},
        "rewards": {"xp": 1000, "coins": 5000, "gems": 50},
    },
    "sushi_master": {
        "id": "sushi_master",
        "name": "Sushi Master",
        "description": "Prepare 25 raw fish dishes",
        "biotope": "cooking",
        "category": "cooking",
        "icon": "🍣",
        "requirement": {"type": "raw_dishes", "count": 25},
        "rewards": {"xp": 600, "coins": 3000, "gems": 30},
    },
}


# ========== ENDPOINTS ==========

@router.get("/all")
async def get_all_biotope_fish(biotope: Optional[str] = None, stage: Optional[str] = None, rarity: Optional[str] = None):
    """Get all biotope fish with filters"""
    fish = list(ALL_BIOTOPE_FISH.values())
    
    if biotope:
        fish = [f for f in fish if f.get("biotope") == biotope]
    if stage:
        fish = [f for f in fish if f.get("stage") == stage]
    if rarity:
        fish = [f for f in fish if f.get("rarity") == rarity]
    
    return {
        "fish": fish,
        "total": len(fish),
        "by_biotope": {
            "saltwater": len([f for f in ALL_BIOTOPE_FISH.values() if f.get("biotope") == "saltwater"]),
            "freshwater_lake": len([f for f in ALL_BIOTOPE_FISH.values() if f.get("biotope") == "freshwater_lake"]),
            "brackish": len([f for f in ALL_BIOTOPE_FISH.values() if f.get("biotope") == "brackish"]),
            "river": len([f for f in ALL_BIOTOPE_FISH.values() if f.get("biotope") == "river"]),
        }
    }


@router.get("/fish/{fish_id}")
async def get_fish_details(fish_id: str):
    """Get detailed fish information"""
    fish = ALL_BIOTOPE_FISH.get(fish_id)
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")
    return {"fish": fish}


@router.get("/biotope/{biotope_id}")
async def get_biotope_fish(biotope_id: str):
    """Get all fish for a specific biotope"""
    fish_ids = FISH_BY_BIOTOPE.get(biotope_id, [])
    fish = [ALL_BIOTOPE_FISH[fid] for fid in fish_ids if fid in ALL_BIOTOPE_FISH]
    
    # Group by stage
    by_stage = {}
    for f in fish:
        stage = f.get("stage", "unknown")
        if stage not in by_stage:
            by_stage[stage] = []
        by_stage[stage].append(f)
    
    return {
        "biotope": biotope_id,
        "total_fish": len(fish),
        "fish": fish,
        "by_stage": by_stage
    }


@router.get("/achievements")
async def get_biotope_achievements():
    """Get all biotope achievements"""
    return {"achievements": list(BIOTOPE_ACHIEVEMENTS.values())}


@router.get("/achievements/{user_id}")
async def get_user_biotope_achievements(user_id: str):
    """Get user's biotope achievement progress"""
    progress = await db.biotope_achievement_progress.find_one({"user_id": user_id}, {"_id": 0})
    
    if not progress:
        progress = {
            "user_id": user_id,
            "stats": {},
            "unlocked": [],
            "claimed": []
        }
    
    achievements = []
    for ach_id, ach in BIOTOPE_ACHIEVEMENTS.items():
        ach_copy = dict(ach)
        ach_copy["unlocked"] = ach_id in progress.get("unlocked", [])
        ach_copy["claimed"] = ach_id in progress.get("claimed", [])
        
        # Add progress info
        req = ach["requirement"]
        if req["type"] in progress.get("stats", {}):
            ach_copy["current"] = progress["stats"].get(req["type"], 0)
            ach_copy["target"] = req.get("count", req.get("size", 1))
        
        achievements.append(ach_copy)
    
    return {"achievements": achievements, "stats": progress.get("stats", {})}


@router.post("/achievements/check/{user_id}")
async def check_biotope_achievements(user_id: str):
    """Check and unlock qualifying achievements"""
    progress = await db.biotope_achievement_progress.find_one({"user_id": user_id}, {"_id": 0})
    
    if not progress:
        progress = {"user_id": user_id, "stats": {}, "unlocked": [], "claimed": []}
    
    newly_unlocked = []
    
    for ach_id, ach in BIOTOPE_ACHIEVEMENTS.items():
        if ach_id in progress.get("unlocked", []):
            continue
        
        req = ach["requirement"]
        current = progress.get("stats", {}).get(req["type"], 0)
        target = req.get("count", req.get("size", 1))
        
        if current >= target:
            newly_unlocked.append(ach)
            progress.setdefault("unlocked", []).append(ach_id)
    
    if newly_unlocked:
        await db.biotope_achievement_progress.update_one(
            {"user_id": user_id},
            {"$set": {"unlocked": progress["unlocked"]}},
            upsert=True
        )
    
    return {"newly_unlocked": newly_unlocked}


@router.post("/achievements/claim/{user_id}/{achievement_id}")
async def claim_biotope_achievement(user_id: str, achievement_id: str):
    """Claim a biotope achievement reward"""
    ach = BIOTOPE_ACHIEVEMENTS.get(achievement_id)
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    progress = await db.biotope_achievement_progress.find_one({"user_id": user_id}, {"_id": 0})
    
    if achievement_id not in progress.get("unlocked", []):
        raise HTTPException(status_code=400, detail="Achievement not unlocked")
    
    if achievement_id in progress.get("claimed", []):
        raise HTTPException(status_code=400, detail="Already claimed")
    
    # Award rewards
    rewards = ach["rewards"]
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"xp": rewards.get("xp", 0), "coins": rewards.get("coins", 0), "gems": rewards.get("gems", 0)}}
    )
    
    if rewards.get("title"):
        await db.player_titles.update_one(
            {"user_id": user_id},
            {"$addToSet": {"titles": rewards["title"]}},
            upsert=True
        )
    
    # Mark claimed
    await db.biotope_achievement_progress.update_one(
        {"user_id": user_id},
        {"$push": {"claimed": achievement_id}}
    )
    
    return {"success": True, "rewards": rewards}


@router.post("/record-catch/{user_id}")
async def record_biotope_catch(user_id: str, fish_id: str, biotope: str, stage: str, size: int, rarity: str):
    """Record a catch for achievement tracking"""
    stat_updates = {
        f"{biotope}_catches": 1,
        f"{stage}_catches": 1,
        f"{rarity}_catches": 1,
    }
    
    # Special stat tracking
    fish = ALL_BIOTOPE_FISH.get(fish_id)
    if fish:
        fish_type = fish.get("id", "").split("_")[0]
        stat_updates[f"{fish_type}_catches"] = 1
    
    # Update stats
    update_ops = {"$inc": {f"stats.{k}": v for k, v in stat_updates.items()}}
    
    await db.biotope_achievement_progress.update_one(
        {"user_id": user_id},
        update_ops,
        upsert=True
    )
    
    # Check achievements
    newly_unlocked = await check_biotope_achievements(user_id)
    
    return {"success": True, "newly_unlocked": newly_unlocked.get("newly_unlocked", [])}


@router.get("/stats")
async def get_biotope_fish_stats():
    """Get statistics about all biotope fish"""
    stats = {
        "total_fish": len(ALL_BIOTOPE_FISH),
        "by_biotope": {},
        "by_rarity": {"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0},
    }
    
    for fish in ALL_BIOTOPE_FISH.values():
        biotope = fish.get("biotope", "unknown")
        rarity = fish.get("rarity", "common")
        
        if biotope not in stats["by_biotope"]:
            stats["by_biotope"][biotope] = 0
        stats["by_biotope"][biotope] += 1
        
        if rarity in stats["by_rarity"]:
            stats["by_rarity"][rarity] += 1
    
    return stats
