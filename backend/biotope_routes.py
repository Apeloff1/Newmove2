# ========== GO FISH! BIOTOPE SYSTEM API ==========
# Complete biotope classification, fish habitats, and environmental systems
# ~800+ lines of backend code

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random

router = APIRouter(prefix="/api/biotope", tags=["biotope"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== BIOTOPE DEFINITIONS ==========

BIOTOPES = {
    "saltwater": {
        "id": "saltwater",
        "name": "Salt Sea",
        "description": "The vast open ocean and coastal waters with high salinity. Home to the largest and most diverse marine life on Earth.",
        "icon": "🌊",
        "color": "#0066CC",
        "salinity": "high",
        "salinity_range": "35-40 ppt",
        "characteristics": [
            "High mineral content from dissolved salts",
            "Supports coral reefs and kelp forests",
            "Home to migratory species",
            "Deepest waters on Earth",
            "Tidal influences affect fishing"
        ],
        "environments": ["open_ocean", "coral_reef", "deep_sea", "coastal", "kelp_forest"],
        "best_times": ["dawn", "dusk", "high_tide"],
        "weather_effects": {"storm": 1.5, "clear": 1.0, "rain": 0.8},
        "unlock_level": 15,
        "required_boat": True,
        "tips": [
            "Use heavy tackle for big game fish",
            "Fish near structures like reefs and wrecks",
            "Tidal movements affect fish activity",
            "Chum the waters to attract schools"
        ]
    },
    "freshwater_lake": {
        "id": "freshwater_lake",
        "name": "Freshwater Lake",
        "description": "Calm, still waters ranging from small ponds to massive lakes. Perfect for beginners and trophy hunters alike.",
        "icon": "🏞️",
        "color": "#4169E1",
        "salinity": "none",
        "salinity_range": "0-0.5 ppt",
        "characteristics": [
            "Still or slow-moving water",
            "Layered by temperature (thermoclines)",
            "Rich in vegetation near shores",
            "Seasonal fish behavior patterns",
            "Ice fishing possible in winter"
        ],
        "environments": ["shallow_lake", "deep_lake", "pond", "reservoir", "mountain_lake"],
        "best_times": ["early_morning", "evening", "overcast"],
        "weather_effects": {"storm": 0.7, "clear": 1.2, "overcast": 1.4},
        "unlock_level": 1,
        "required_boat": False,
        "tips": [
            "Fish near weed beds and lily pads",
            "Early morning and evening are prime times",
            "Use lighter tackle for wary fish",
            "Depth varies catch - explore thermoclines"
        ]
    },
    "brackish": {
        "id": "brackish",
        "name": "Brackish Waters",
        "description": "Where rivers meet the sea. A unique ecosystem with mixed salinity supporting species from both worlds.",
        "icon": "🌿",
        "color": "#20B2AA",
        "salinity": "mixed",
        "salinity_range": "0.5-30 ppt",
        "characteristics": [
            "Mix of fresh and salt water",
            "Found in estuaries and mangroves",
            "Highly productive ecosystems",
            "Nursery grounds for many species",
            "Salinity changes with tides"
        ],
        "environments": ["estuary", "mangrove", "delta", "lagoon", "tidal_marsh"],
        "best_times": ["changing_tide", "dawn", "dusk"],
        "weather_effects": {"storm": 1.3, "clear": 1.0, "rain": 1.2},
        "unlock_level": 25,
        "required_boat": False,
        "tips": [
            "Fish during tidal changes for best results",
            "Mangrove roots hold many species",
            "Adapt tackle to varying conditions",
            "Watch for predator activity"
        ]
    },
    "river": {
        "id": "river",
        "name": "River & Stream",
        "description": "Flowing freshwater from mountain streams to mighty rivers. Current creates unique challenges and rewards.",
        "icon": "🏔️",
        "color": "#1E90FF",
        "salinity": "none",
        "salinity_range": "0-0.5 ppt",
        "characteristics": [
            "Moving water with varying speeds",
            "Oxygenation from rapids and falls",
            "Fish hold in specific current breaks",
            "Seasonal migrations occur",
            "Structure is key to locating fish"
        ],
        "environments": ["mountain_stream", "lowland_river", "rapids", "pool", "waterfall_basin"],
        "best_times": ["morning", "after_rain", "spawning_season"],
        "weather_effects": {"storm": 0.6, "clear": 1.1, "rain": 1.5},
        "unlock_level": 8,
        "required_boat": False,
        "tips": [
            "Cast upstream and let bait drift naturally",
            "Fish behind rocks and in eddies",
            "Match the hatch - use local insects",
            "Wading allows access to prime spots"
        ]
    }
}


# ========== BIOTOPE STAGES/LOCATIONS ==========

BIOTOPE_STAGES = {
    # Saltwater Stages (5 stages, levels 15-75)
    "coastal_shallows": {
        "id": "coastal_shallows",
        "name": "Coastal Shallows",
        "biotope": "saltwater",
        "stage_number": 1,
        "unlock_level": 15,
        "depth_range": "0-30 feet",
        "description": "Sandy beaches and shallow coastal waters",
        "fish_pool": ["sea_bass", "flounder", "bluefish", "striped_bass", "pompano"],
        "rare_pool": ["bonefish", "permit"],
        "difficulty": 2,
        "icon": "🏖️"
    },
    "coral_reef": {
        "id": "coral_reef",
        "name": "Coral Reef",
        "biotope": "saltwater",
        "stage_number": 2,
        "unlock_level": 25,
        "depth_range": "10-100 feet",
        "description": "Vibrant coral ecosystems teeming with life",
        "fish_pool": ["parrotfish", "grouper", "snapper", "triggerfish", "barracuda"],
        "rare_pool": ["napoleon_wrasse", "queen_angelfish"],
        "difficulty": 3,
        "icon": "🪸"
    },
    "open_ocean": {
        "id": "open_ocean",
        "name": "Open Ocean",
        "biotope": "saltwater",
        "stage_number": 3,
        "unlock_level": 40,
        "depth_range": "100-500 feet",
        "description": "The pelagic zone where big game fish roam",
        "fish_pool": ["yellowfin_tuna", "mahi_mahi", "wahoo", "sailfish", "king_mackerel"],
        "rare_pool": ["blue_marlin", "swordfish"],
        "difficulty": 4,
        "icon": "🌊"
    },
    "deep_sea": {
        "id": "deep_sea",
        "name": "Deep Sea",
        "biotope": "saltwater",
        "stage_number": 4,
        "unlock_level": 55,
        "depth_range": "500-3000 feet",
        "description": "The mysterious depths where giants lurk",
        "fish_pool": ["giant_squid", "oarfish", "coelacanth", "anglerfish", "gulper_eel"],
        "rare_pool": ["megamouth_shark", "giant_isopod"],
        "legendary_pool": ["kraken"],
        "difficulty": 5,
        "icon": "🦑"
    },
    "arctic_ocean": {
        "id": "arctic_ocean",
        "name": "Arctic Ocean",
        "biotope": "saltwater",
        "stage_number": 5,
        "unlock_level": 70,
        "depth_range": "0-1000 feet",
        "description": "Frozen waters with hardy, cold-adapted species",
        "fish_pool": ["arctic_cod", "greenland_shark", "arctic_char_sea", "polar_sculpin", "ice_fish"],
        "rare_pool": ["narwhal", "beluga_whale"],
        "legendary_pool": ["leviathan_of_ice"],
        "difficulty": 5,
        "icon": "🧊"
    },
    
    # Lake Stages (5 stages, levels 1-60)
    "pond": {
        "id": "pond",
        "name": "Peaceful Pond",
        "biotope": "freshwater_lake",
        "stage_number": 1,
        "unlock_level": 1,
        "depth_range": "2-15 feet",
        "description": "Small, calm waters perfect for beginners",
        "fish_pool": ["bluegill", "pumpkinseed", "common_carp", "golden_shiner", "bullhead_catfish"],
        "rare_pool": ["golden_koi", "albino_catfish"],
        "difficulty": 1,
        "icon": "🪷"
    },
    "shallow_lake": {
        "id": "shallow_lake",
        "name": "Shallow Lake",
        "biotope": "freshwater_lake",
        "stage_number": 2,
        "unlock_level": 10,
        "depth_range": "5-30 feet",
        "description": "Weedy shallows rich with feeding fish",
        "fish_pool": ["largemouth_bass", "northern_pike", "walleye", "yellow_perch", "crappie"],
        "rare_pool": ["tiger_muskie", "golden_pike"],
        "difficulty": 2,
        "icon": "🌾"
    },
    "deep_lake": {
        "id": "deep_lake",
        "name": "Deep Lake",
        "biotope": "freshwater_lake",
        "stage_number": 3,
        "unlock_level": 25,
        "depth_range": "30-200 feet",
        "description": "Cold depths hiding trophy-sized fish",
        "fish_pool": ["lake_trout", "cisco", "burbot", "lake_sturgeon", "freshwater_drum"],
        "rare_pool": ["trophy_laker", "paddlefish"],
        "difficulty": 3,
        "icon": "🏔️"
    },
    "mountain_lake": {
        "id": "mountain_lake",
        "name": "Mountain Lake",
        "biotope": "freshwater_lake",
        "stage_number": 4,
        "unlock_level": 40,
        "depth_range": "10-150 feet",
        "description": "Crystal-clear alpine waters with pristine fish",
        "fish_pool": ["golden_trout", "brook_char", "arctic_grayling", "mountain_whitefish", "kokanee_salmon"],
        "rare_pool": ["platinum_trout", "ghost_char"],
        "difficulty": 4,
        "icon": "⛰️"
    },
    "ancient_lake": {
        "id": "ancient_lake",
        "name": "Ancient Lake",
        "biotope": "freshwater_lake",
        "stage_number": 5,
        "unlock_level": 60,
        "depth_range": "100-500 feet",
        "description": "Prehistoric lake with living fossils",
        "fish_pool": ["baikal_omul", "golomyanka", "prehistoric_sturgeon", "giant_catfish", "ancient_gar"],
        "rare_pool": ["living_fossil", "lake_monster"],
        "legendary_pool": ["nessie"],
        "difficulty": 5,
        "icon": "🦕"
    },
    
    # Brackish Stages (5 stages, levels 25-80)
    "tidal_marsh": {
        "id": "tidal_marsh",
        "name": "Tidal Marsh",
        "biotope": "brackish",
        "stage_number": 1,
        "unlock_level": 25,
        "depth_range": "1-10 feet",
        "description": "Grassy wetlands where fresh meets salt",
        "fish_pool": ["redfish", "spotted_seatrout", "sheepshead", "black_drum", "flounder_brackish"],
        "rare_pool": ["golden_redfish", "monster_drum"],
        "difficulty": 2,
        "icon": "🌿"
    },
    "mangrove_forest": {
        "id": "mangrove_forest",
        "name": "Mangrove Forest",
        "biotope": "brackish",
        "stage_number": 2,
        "unlock_level": 35,
        "depth_range": "2-20 feet",
        "description": "Tangled roots hiding predators and prey",
        "fish_pool": ["snook", "tarpon", "mangrove_snapper", "jack_crevalle", "ladyfish"],
        "rare_pool": ["silver_king_tarpon", "giant_snook"],
        "difficulty": 3,
        "icon": "🌴"
    },
    "estuary": {
        "id": "estuary",
        "name": "River Estuary",
        "biotope": "brackish",
        "stage_number": 3,
        "unlock_level": 45,
        "depth_range": "5-50 feet",
        "description": "Where the river meets the sea",
        "fish_pool": ["striped_bass_brackish", "white_perch", "blue_crab_fish", "atlantic_croaker", "weakfish"],
        "rare_pool": ["trophy_striper", "albino_weakfish"],
        "difficulty": 3,
        "icon": "🌊"
    },
    "coastal_lagoon": {
        "id": "coastal_lagoon",
        "name": "Coastal Lagoon",
        "biotope": "brackish",
        "stage_number": 4,
        "unlock_level": 55,
        "depth_range": "3-40 feet",
        "description": "Enclosed coastal waters with unique species",
        "fish_pool": ["bonefish_brackish", "permit_brackish", "barramundi", "mulloway", "giant_trevally"],
        "rare_pool": ["platinum_bonefish", "monster_trevally"],
        "difficulty": 4,
        "icon": "🏝️"
    },
    "delta": {
        "id": "delta",
        "name": "River Delta",
        "biotope": "brackish",
        "stage_number": 5,
        "unlock_level": 70,
        "depth_range": "5-100 feet",
        "description": "Massive river mouth with migratory giants",
        "fish_pool": ["nile_perch", "goliath_grouper", "sawfish", "bull_shark", "giant_stingray"],
        "rare_pool": ["mekong_giant_catfish", "arapaima"],
        "legendary_pool": ["river_god"],
        "difficulty": 5,
        "icon": "🐊"
    },
    
    # River Stages (5 stages, levels 8-65)
    "mountain_stream": {
        "id": "mountain_stream",
        "name": "Mountain Stream",
        "biotope": "river",
        "stage_number": 1,
        "unlock_level": 8,
        "depth_range": "1-6 feet",
        "description": "Cold, clear rushing mountain water",
        "fish_pool": ["rainbow_trout", "brown_trout", "brook_trout", "sculpin", "dace"],
        "rare_pool": ["palomino_trout", "tiger_trout"],
        "difficulty": 2,
        "icon": "⛰️"
    },
    "forest_creek": {
        "id": "forest_creek",
        "name": "Forest Creek",
        "biotope": "river",
        "stage_number": 2,
        "unlock_level": 18,
        "depth_range": "2-10 feet",
        "description": "Shaded waters under the forest canopy",
        "fish_pool": ["smallmouth_bass", "rock_bass", "creek_chub", "fallfish", "redhorse_sucker"],
        "rare_pool": ["bronze_smallmouth", "giant_chub"],
        "difficulty": 2,
        "icon": "🌲"
    },
    "lowland_river": {
        "id": "lowland_river",
        "name": "Lowland River",
        "biotope": "river",
        "stage_number": 3,
        "unlock_level": 30,
        "depth_range": "5-30 feet",
        "description": "Wide, slow-moving waters with diverse life",
        "fish_pool": ["channel_catfish", "flathead_catfish", "blue_catfish", "gar", "bowfin"],
        "rare_pool": ["alligator_gar", "albino_bowfin"],
        "difficulty": 3,
        "icon": "🌳"
    },
    "rapids": {
        "id": "rapids",
        "name": "Wild Rapids",
        "biotope": "river",
        "stage_number": 4,
        "unlock_level": 45,
        "depth_range": "3-15 feet",
        "description": "Turbulent waters for expert anglers",
        "fish_pool": ["steelhead", "atlantic_salmon", "chinook_salmon", "coho_salmon", "sockeye_salmon"],
        "rare_pool": ["king_of_salmon", "chrome_steelhead"],
        "difficulty": 4,
        "icon": "🌀"
    },
    "mighty_river": {
        "id": "mighty_river",
        "name": "Mighty River",
        "biotope": "river",
        "stage_number": 5,
        "unlock_level": 60,
        "depth_range": "10-100 feet",
        "description": "Great rivers holding legendary fish",
        "fish_pool": ["white_sturgeon", "pallid_sturgeon", "paddlefish_river", "blue_catfish_giant", "alligator_gar_river"],
        "rare_pool": ["monster_sturgeon", "prehistoric_gar"],
        "legendary_pool": ["river_leviathan"],
        "difficulty": 5,
        "icon": "🏛️"
    }
}


# ========== REQUEST MODELS ==========

class UnlockBiotopeRequest(BaseModel):
    user_id: str
    biotope_id: str


class EnterStageRequest(BaseModel):
    user_id: str
    stage_id: str


class GetBiotopeBonusRequest(BaseModel):
    user_id: str
    biotope_id: str


# ========== HELPER FUNCTIONS ==========

async def get_player_biotope_progress(user_id: str) -> dict:
    """Get player's biotope progress"""
    progress = await db.biotope_progress.find_one({"user_id": user_id}, {"_id": 0})
    
    if not progress:
        progress = {
            "user_id": user_id,
            "unlocked_biotopes": ["freshwater_lake"],
            "unlocked_stages": ["pond"],
            "current_biotope": "freshwater_lake",
            "current_stage": "pond",
            "biotope_xp": {"freshwater_lake": 0, "saltwater": 0, "brackish": 0, "river": 0},
            "biotope_level": {"freshwater_lake": 1, "saltwater": 1, "brackish": 1, "river": 1},
            "fish_caught_by_biotope": {"freshwater_lake": 0, "saltwater": 0, "brackish": 0, "river": 0},
            "favorite_biotope": None,
        }
        await db.biotope_progress.insert_one(progress)
    
    return progress


def calculate_biotope_bonus(biotope_level: int) -> dict:
    """Calculate bonuses based on biotope mastery level"""
    return {
        "catch_rate": 1.0 + (biotope_level * 0.02),  # +2% per level
        "rare_chance": 1.0 + (biotope_level * 0.03),  # +3% per level
        "xp_bonus": 1.0 + (biotope_level * 0.01),  # +1% per level
        "coin_bonus": 1.0 + (biotope_level * 0.015),  # +1.5% per level
    }


# ========== BIOTOPE ENDPOINTS ==========

@router.get("/all")
async def get_all_biotopes():
    """Get all biotope information"""
    return {
        "biotopes": list(BIOTOPES.values()),
        "total": len(BIOTOPES)
    }


@router.get("/{biotope_id}")
async def get_biotope_details(biotope_id: str):
    """Get detailed biotope information"""
    biotope = BIOTOPES.get(biotope_id)
    if not biotope:
        raise HTTPException(status_code=404, detail="Biotope not found")
    
    # Get stages for this biotope
    stages = [s for s in BIOTOPE_STAGES.values() if s["biotope"] == biotope_id]
    stages.sort(key=lambda x: x["stage_number"])
    
    return {
        "biotope": biotope,
        "stages": stages,
        "total_stages": len(stages)
    }


@router.get("/stages/all")
async def get_all_stages():
    """Get all biotope stages"""
    return {
        "stages": list(BIOTOPE_STAGES.values()),
        "total": len(BIOTOPE_STAGES)
    }


@router.get("/stages/{stage_id}")
async def get_stage_details(stage_id: str):
    """Get stage details"""
    stage = BIOTOPE_STAGES.get(stage_id)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    
    biotope = BIOTOPES.get(stage["biotope"])
    
    return {
        "stage": stage,
        "biotope": biotope
    }


@router.get("/progress/{user_id}")
async def get_biotope_progress(user_id: str):
    """Get player's biotope progress"""
    progress = await get_player_biotope_progress(user_id)
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
    user_level = user.get("level", 1) if user else 1
    
    # Calculate what can be unlocked
    unlockable_biotopes = []
    for bio_id, bio_data in BIOTOPES.items():
        if bio_id not in progress["unlocked_biotopes"]:
            if user_level >= bio_data["unlock_level"]:
                unlockable_biotopes.append(bio_data)
    
    unlockable_stages = []
    for stage_id, stage_data in BIOTOPE_STAGES.items():
        if stage_id not in progress["unlocked_stages"]:
            if user_level >= stage_data["unlock_level"]:
                # Check if biotope is unlocked
                if stage_data["biotope"] in progress["unlocked_biotopes"]:
                    unlockable_stages.append(stage_data)
    
    return {
        "progress": progress,
        "unlockable_biotopes": unlockable_biotopes,
        "unlockable_stages": unlockable_stages,
        "user_level": user_level
    }


@router.post("/unlock/biotope")
async def unlock_biotope(request: UnlockBiotopeRequest):
    """Unlock a new biotope"""
    biotope = BIOTOPES.get(request.biotope_id)
    if not biotope:
        raise HTTPException(status_code=404, detail="Biotope not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "level": 1})
    user_level = user.get("level", 1) if user else 1
    
    if user_level < biotope["unlock_level"]:
        raise HTTPException(status_code=400, detail=f"Requires level {biotope['unlock_level']}")
    
    progress = await get_player_biotope_progress(request.user_id)
    
    if request.biotope_id in progress["unlocked_biotopes"]:
        raise HTTPException(status_code=400, detail="Biotope already unlocked")
    
    # Unlock biotope and first stage
    first_stage = next(
        (s for s in BIOTOPE_STAGES.values() 
         if s["biotope"] == request.biotope_id and s["stage_number"] == 1),
        None
    )
    
    update_ops = {
        "$push": {"unlocked_biotopes": request.biotope_id}
    }
    
    if first_stage:
        update_ops["$push"]["unlocked_stages"] = first_stage["id"]
    
    await db.biotope_progress.update_one(
        {"user_id": request.user_id},
        update_ops
    )
    
    return {
        "success": True,
        "biotope_unlocked": biotope,
        "first_stage": first_stage
    }


@router.post("/unlock/stage")
async def unlock_stage(request: EnterStageRequest):
    """Unlock a new stage"""
    stage = BIOTOPE_STAGES.get(request.stage_id)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    
    progress = await get_player_biotope_progress(request.user_id)
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "level": 1})
    user_level = user.get("level", 1) if user else 1
    
    # Check prerequisites
    if stage["biotope"] not in progress["unlocked_biotopes"]:
        raise HTTPException(status_code=400, detail="Unlock biotope first")
    
    if user_level < stage["unlock_level"]:
        raise HTTPException(status_code=400, detail=f"Requires level {stage['unlock_level']}")
    
    if request.stage_id in progress["unlocked_stages"]:
        raise HTTPException(status_code=400, detail="Stage already unlocked")
    
    # Check if previous stage is unlocked
    if stage["stage_number"] > 1:
        prev_stage = next(
            (s for s in BIOTOPE_STAGES.values()
             if s["biotope"] == stage["biotope"] and s["stage_number"] == stage["stage_number"] - 1),
            None
        )
        if prev_stage and prev_stage["id"] not in progress["unlocked_stages"]:
            raise HTTPException(status_code=400, detail="Unlock previous stage first")
    
    await db.biotope_progress.update_one(
        {"user_id": request.user_id},
        {"$push": {"unlocked_stages": request.stage_id}}
    )
    
    return {"success": True, "stage_unlocked": stage}


@router.post("/enter/{user_id}/{stage_id}")
async def enter_stage(user_id: str, stage_id: str):
    """Enter a stage to start fishing"""
    stage = BIOTOPE_STAGES.get(stage_id)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    
    progress = await get_player_biotope_progress(user_id)
    
    if stage_id not in progress["unlocked_stages"]:
        raise HTTPException(status_code=400, detail="Stage not unlocked")
    
    # Update current location
    await db.biotope_progress.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "current_biotope": stage["biotope"],
                "current_stage": stage_id
            }
        }
    )
    
    biotope = BIOTOPES.get(stage["biotope"])
    bonuses = calculate_biotope_bonus(progress["biotope_level"].get(stage["biotope"], 1))
    
    return {
        "success": True,
        "stage": stage,
        "biotope": biotope,
        "bonuses": bonuses
    }


@router.post("/record-catch/{user_id}")
async def record_biotope_catch(user_id: str, biotope_id: str, xp_earned: int = 10):
    """Record a catch in a biotope (for XP/leveling)"""
    progress = await get_player_biotope_progress(user_id)
    
    # Add XP
    current_xp = progress["biotope_xp"].get(biotope_id, 0) + xp_earned
    current_level = progress["biotope_level"].get(biotope_id, 1)
    
    # Check for level up (100 XP per level)
    xp_needed = current_level * 100
    leveled_up = False
    
    if current_xp >= xp_needed:
        current_level += 1
        current_xp -= xp_needed
        leveled_up = True
    
    await db.biotope_progress.update_one(
        {"user_id": user_id},
        {
            "$set": {
                f"biotope_xp.{biotope_id}": current_xp,
                f"biotope_level.{biotope_id}": current_level
            },
            "$inc": {f"fish_caught_by_biotope.{biotope_id}": 1}
        }
    )
    
    return {
        "success": True,
        "biotope": biotope_id,
        "xp": current_xp,
        "level": current_level,
        "leveled_up": leveled_up,
        "bonuses": calculate_biotope_bonus(current_level) if leveled_up else None
    }


@router.get("/bonuses/{user_id}/{biotope_id}")
async def get_biotope_bonuses(user_id: str, biotope_id: str):
    """Get current bonuses for a biotope"""
    progress = await get_player_biotope_progress(user_id)
    level = progress["biotope_level"].get(biotope_id, 1)
    
    return {
        "biotope": biotope_id,
        "level": level,
        "bonuses": calculate_biotope_bonus(level)
    }


@router.get("/leaderboard/{biotope_id}")
async def get_biotope_leaderboard(biotope_id: str, limit: int = 50):
    """Get leaderboard for a specific biotope"""
    entries = await db.biotope_progress.find(
        {},
        {"_id": 0, "user_id": 1, f"fish_caught_by_biotope.{biotope_id}": 1, f"biotope_level.{biotope_id}": 1}
    ).sort(f"fish_caught_by_biotope.{biotope_id}", -1).limit(limit).to_list(limit)
    
    leaderboard = []
    for i, entry in enumerate(entries):
        user = await db.users.find_one({"id": entry["user_id"]}, {"_id": 0, "username": 1})
        leaderboard.append({
            "rank": i + 1,
            "user_id": entry["user_id"],
            "username": user.get("username", "Unknown") if user else "Unknown",
            "fish_caught": entry.get("fish_caught_by_biotope", {}).get(biotope_id, 0),
            "level": entry.get("biotope_level", {}).get(biotope_id, 1)
        })
    
    return {"biotope": biotope_id, "leaderboard": leaderboard}
