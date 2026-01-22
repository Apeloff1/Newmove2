# ========== GO FISH! BIOTOPE EQUIPMENT SYSTEM ==========
# Specialized rods, reels, lines, bobbers for each biotope
# ~700+ lines of backend code

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
import os

router = APIRouter(prefix="/api/equipment", tags=["equipment"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== FISHING RODS BY BIOTOPE ==========

FISHING_RODS = {
    # UNIVERSAL RODS
    "basic_rod": {
        "id": "basic_rod",
        "name": "Basic Fishing Rod",
        "category": "rod",
        "biotope": "universal",
        "description": "A simple rod suitable for beginners in any water.",
        "stats": {
            "cast_distance": 50,
            "power": 30,
            "sensitivity": 40,
            "durability": 60
        },
        "bonuses": {},
        "cost": {"coins": 0},
        "unlock_level": 1,
        "icon": "🎣",
        "rarity": "common"
    },
    
    # SALTWATER RODS
    "surf_rod": {
        "id": "surf_rod",
        "name": "Surf Casting Rod",
        "category": "rod",
        "biotope": "saltwater",
        "description": "Long rod designed for casting from beaches into surf.",
        "stats": {
            "cast_distance": 90,
            "power": 60,
            "sensitivity": 50,
            "durability": 70
        },
        "bonuses": {
            "saltwater_catch_rate": 1.15,
            "saltwater_distance": 1.3
        },
        "cost": {"coins": 2500},
        "unlock_level": 15,
        "icon": "🏖️",
        "rarity": "uncommon"
    },
    "offshore_rod": {
        "id": "offshore_rod",
        "name": "Offshore Trolling Rod",
        "category": "rod",
        "biotope": "saltwater",
        "description": "Heavy-duty rod for big game offshore fishing.",
        "stats": {
            "cast_distance": 40,
            "power": 95,
            "sensitivity": 60,
            "durability": 90
        },
        "bonuses": {
            "saltwater_catch_rate": 1.25,
            "big_fish_bonus": 1.4,
            "fighting_power": 1.5
        },
        "cost": {"gems": 150},
        "unlock_level": 40,
        "icon": "🚤",
        "rarity": "rare"
    },
    "deep_sea_rod": {
        "id": "deep_sea_rod",
        "name": "Abyssal Deep Sea Rod",
        "category": "rod",
        "biotope": "saltwater",
        "description": "Specialized rod for extreme deep water fishing.",
        "stats": {
            "cast_distance": 30,
            "power": 100,
            "sensitivity": 80,
            "durability": 85
        },
        "bonuses": {
            "saltwater_catch_rate": 1.35,
            "deep_sea_bonus": 1.5,
            "rare_fish_chance": 1.3
        },
        "cost": {"gems": 300},
        "unlock_level": 55,
        "icon": "🦑",
        "rarity": "epic"
    },
    "arctic_rod": {
        "id": "arctic_rod",
        "name": "Arctic Ice Rod",
        "category": "rod",
        "biotope": "saltwater",
        "description": "Freeze-resistant rod for Arctic conditions.",
        "stats": {
            "cast_distance": 60,
            "power": 70,
            "sensitivity": 85,
            "durability": 95
        },
        "bonuses": {
            "saltwater_catch_rate": 1.3,
            "arctic_bonus": 1.6,
            "cold_resistance": 2.0
        },
        "cost": {"gems": 250},
        "unlock_level": 70,
        "icon": "❄️",
        "rarity": "epic"
    },
    
    # LAKE RODS
    "pond_rod": {
        "id": "pond_rod",
        "name": "Pond Fishing Rod",
        "category": "rod",
        "biotope": "freshwater_lake",
        "description": "Light rod perfect for pond panfish.",
        "stats": {
            "cast_distance": 55,
            "power": 25,
            "sensitivity": 70,
            "durability": 65
        },
        "bonuses": {
            "lake_catch_rate": 1.15,
            "panfish_bonus": 1.25
        },
        "cost": {"coins": 1000},
        "unlock_level": 3,
        "icon": "🪷",
        "rarity": "common"
    },
    "bass_rod": {
        "id": "bass_rod",
        "name": "Bass Tournament Rod",
        "category": "rod",
        "biotope": "freshwater_lake",
        "description": "Medium-heavy rod optimized for bass fishing.",
        "stats": {
            "cast_distance": 70,
            "power": 65,
            "sensitivity": 75,
            "durability": 70
        },
        "bonuses": {
            "lake_catch_rate": 1.2,
            "bass_bonus": 1.35,
            "hook_setting": 1.2
        },
        "cost": {"coins": 4000},
        "unlock_level": 12,
        "icon": "🏆",
        "rarity": "uncommon"
    },
    "trolling_lake_rod": {
        "id": "trolling_lake_rod",
        "name": "Deep Lake Trolling Rod",
        "category": "rod",
        "biotope": "freshwater_lake",
        "description": "Specialized for trolling deep lake structures.",
        "stats": {
            "cast_distance": 45,
            "power": 75,
            "sensitivity": 65,
            "durability": 80
        },
        "bonuses": {
            "lake_catch_rate": 1.25,
            "deep_lake_bonus": 1.4,
            "trout_bonus": 1.3
        },
        "cost": {"gems": 120},
        "unlock_level": 28,
        "icon": "🎣",
        "rarity": "rare"
    },
    "mountain_rod": {
        "id": "mountain_rod",
        "name": "Alpine Ultra-Light Rod",
        "category": "rod",
        "biotope": "freshwater_lake",
        "description": "Ultra-light rod for pristine mountain lakes.",
        "stats": {
            "cast_distance": 65,
            "power": 40,
            "sensitivity": 95,
            "durability": 60
        },
        "bonuses": {
            "lake_catch_rate": 1.3,
            "mountain_lake_bonus": 1.5,
            "golden_trout_chance": 1.4
        },
        "cost": {"gems": 200},
        "unlock_level": 42,
        "icon": "⛰️",
        "rarity": "rare"
    },
    
    # BRACKISH RODS
    "inshore_rod": {
        "id": "inshore_rod",
        "name": "Inshore Saltwater Rod",
        "category": "rod",
        "biotope": "brackish",
        "description": "Versatile rod for marsh and inshore fishing.",
        "stats": {
            "cast_distance": 75,
            "power": 55,
            "sensitivity": 70,
            "durability": 75
        },
        "bonuses": {
            "brackish_catch_rate": 1.2,
            "redfish_bonus": 1.25
        },
        "cost": {"coins": 3500},
        "unlock_level": 25,
        "icon": "🌿",
        "rarity": "uncommon"
    },
    "mangrove_rod": {
        "id": "mangrove_rod",
        "name": "Mangrove Specialist Rod",
        "category": "rod",
        "biotope": "brackish",
        "description": "Short, powerful rod for tight mangrove casts.",
        "stats": {
            "cast_distance": 50,
            "power": 70,
            "sensitivity": 80,
            "durability": 70
        },
        "bonuses": {
            "brackish_catch_rate": 1.25,
            "snook_bonus": 1.35,
            "accuracy": 1.3
        },
        "cost": {"gems": 140},
        "unlock_level": 35,
        "icon": "🌴",
        "rarity": "rare"
    },
    "tarpon_rod": {
        "id": "tarpon_rod",
        "name": "Silver King Tarpon Rod",
        "category": "rod",
        "biotope": "brackish",
        "description": "Heavy-duty rod designed for trophy tarpon.",
        "stats": {
            "cast_distance": 65,
            "power": 90,
            "sensitivity": 70,
            "durability": 85
        },
        "bonuses": {
            "brackish_catch_rate": 1.3,
            "tarpon_bonus": 1.5,
            "fighting_power": 1.4
        },
        "cost": {"gems": 220},
        "unlock_level": 50,
        "icon": "👑",
        "rarity": "epic"
    },
    "delta_rod": {
        "id": "delta_rod",
        "name": "River Delta Monster Rod",
        "category": "rod",
        "biotope": "brackish",
        "description": "Ultimate rod for delta giants and monsters.",
        "stats": {
            "cast_distance": 55,
            "power": 100,
            "sensitivity": 75,
            "durability": 95
        },
        "bonuses": {
            "brackish_catch_rate": 1.4,
            "delta_bonus": 1.6,
            "monster_fish_chance": 1.5
        },
        "cost": {"gems": 350},
        "unlock_level": 70,
        "icon": "🐊",
        "rarity": "legendary"
    },
    
    # RIVER RODS
    "fly_rod": {
        "id": "fly_rod",
        "name": "Classic Fly Rod",
        "category": "rod",
        "biotope": "river",
        "description": "Traditional fly rod for stream fishing.",
        "stats": {
            "cast_distance": 60,
            "power": 30,
            "sensitivity": 90,
            "durability": 55
        },
        "bonuses": {
            "river_catch_rate": 1.2,
            "trout_bonus": 1.3,
            "fly_fishing_bonus": 1.5
        },
        "cost": {"coins": 2000},
        "unlock_level": 10,
        "icon": "🪶",
        "rarity": "uncommon"
    },
    "spinning_river_rod": {
        "id": "spinning_river_rod",
        "name": "River Spinning Rod",
        "category": "rod",
        "biotope": "river",
        "description": "Versatile spinning rod for various river species.",
        "stats": {
            "cast_distance": 70,
            "power": 50,
            "sensitivity": 75,
            "durability": 70
        },
        "bonuses": {
            "river_catch_rate": 1.15,
            "smallmouth_bonus": 1.25
        },
        "cost": {"coins": 2500},
        "unlock_level": 18,
        "icon": "🌊",
        "rarity": "uncommon"
    },
    "catfish_rod": {
        "id": "catfish_rod",
        "name": "Heavy Catfish Rod",
        "category": "rod",
        "biotope": "river",
        "description": "Stout rod for battling big river catfish.",
        "stats": {
            "cast_distance": 50,
            "power": 85,
            "sensitivity": 60,
            "durability": 90
        },
        "bonuses": {
            "river_catch_rate": 1.25,
            "catfish_bonus": 1.4,
            "bottom_fishing": 1.3
        },
        "cost": {"gems": 100},
        "unlock_level": 32,
        "icon": "🐱",
        "rarity": "rare"
    },
    "salmon_rod": {
        "id": "salmon_rod",
        "name": "Salmon & Steelhead Rod",
        "category": "rod",
        "biotope": "river",
        "description": "Premium rod for migratory salmon and steelhead.",
        "stats": {
            "cast_distance": 80,
            "power": 75,
            "sensitivity": 80,
            "durability": 75
        },
        "bonuses": {
            "river_catch_rate": 1.3,
            "salmon_bonus": 1.45,
            "steelhead_bonus": 1.4
        },
        "cost": {"gems": 180},
        "unlock_level": 45,
        "icon": "🐟",
        "rarity": "rare"
    },
    "sturgeon_rod": {
        "id": "sturgeon_rod",
        "name": "Monster Sturgeon Rod",
        "category": "rod",
        "biotope": "river",
        "description": "The ultimate rod for prehistoric river giants.",
        "stats": {
            "cast_distance": 45,
            "power": 100,
            "sensitivity": 70,
            "durability": 100
        },
        "bonuses": {
            "river_catch_rate": 1.35,
            "sturgeon_bonus": 1.6,
            "legendary_chance": 1.4
        },
        "cost": {"gems": 400},
        "unlock_level": 60,
        "icon": "🦴",
        "rarity": "legendary"
    }
}


# ========== FISHING LINES BY BIOTOPE ==========

FISHING_LINES = {
    "basic_line": {
        "id": "basic_line",
        "name": "Basic Monofilament",
        "category": "line",
        "biotope": "universal",
        "test_strength": "10 lb",
        "description": "Standard fishing line for general use.",
        "stats": {"strength": 40, "visibility": 30, "stretch": 60},
        "bonuses": {},
        "cost": {"coins": 100},
        "unlock_level": 1,
        "icon": "🧵",
        "rarity": "common"
    },
    "saltwater_mono": {
        "id": "saltwater_mono",
        "name": "Saltwater Monofilament",
        "category": "line",
        "biotope": "saltwater",
        "test_strength": "30 lb",
        "description": "Salt-resistant line for ocean fishing.",
        "stats": {"strength": 70, "visibility": 25, "stretch": 50},
        "bonuses": {"saltwater_durability": 1.3, "corrosion_resistance": 2.0},
        "cost": {"coins": 500},
        "unlock_level": 15,
        "icon": "🌊",
        "rarity": "uncommon"
    },
    "braided_ocean": {
        "id": "braided_ocean",
        "name": "Braided Superline",
        "category": "line",
        "biotope": "saltwater",
        "test_strength": "80 lb",
        "description": "Ultra-strong braided line for big game.",
        "stats": {"strength": 95, "visibility": 40, "stretch": 10},
        "bonuses": {"saltwater_power": 1.4, "sensitivity": 1.5},
        "cost": {"gems": 80},
        "unlock_level": 40,
        "icon": "💪",
        "rarity": "rare"
    },
    "fluorocarbon_lake": {
        "id": "fluorocarbon_lake",
        "name": "Lake Fluorocarbon",
        "category": "line",
        "biotope": "freshwater_lake",
        "test_strength": "12 lb",
        "description": "Nearly invisible line for wary lake fish.",
        "stats": {"strength": 55, "visibility": 10, "stretch": 30},
        "bonuses": {"lake_stealth": 1.4, "clear_water_bonus": 1.3},
        "cost": {"coins": 400},
        "unlock_level": 10,
        "icon": "👻",
        "rarity": "uncommon"
    },
    "ice_line": {
        "id": "ice_line",
        "name": "Cold Weather Line",
        "category": "line",
        "biotope": "freshwater_lake",
        "test_strength": "6 lb",
        "description": "Stays flexible in freezing temperatures.",
        "stats": {"strength": 40, "visibility": 15, "stretch": 40},
        "bonuses": {"cold_flexibility": 2.0, "winter_fishing": 1.5},
        "cost": {"coins": 350},
        "unlock_level": 25,
        "icon": "❄️",
        "rarity": "uncommon"
    },
    "brackish_hybrid": {
        "id": "brackish_hybrid",
        "name": "Brackish Hybrid Line",
        "category": "line",
        "biotope": "brackish",
        "test_strength": "20 lb",
        "description": "Handles varying salinity conditions.",
        "stats": {"strength": 65, "visibility": 20, "stretch": 45},
        "bonuses": {"brackish_durability": 1.35, "salt_resistance": 1.5},
        "cost": {"coins": 600},
        "unlock_level": 25,
        "icon": "🌿",
        "rarity": "uncommon"
    },
    "fly_line": {
        "id": "fly_line",
        "name": "Weight-Forward Fly Line",
        "category": "line",
        "biotope": "river",
        "test_strength": "5 wt",
        "description": "Specialized line for fly casting.",
        "stats": {"strength": 35, "visibility": 50, "stretch": 20},
        "bonuses": {"fly_casting": 1.5, "presentation": 1.4},
        "cost": {"coins": 450},
        "unlock_level": 10,
        "icon": "🪶",
        "rarity": "uncommon"
    },
    "leader_line": {
        "id": "leader_line",
        "name": "Tapered Leader",
        "category": "line",
        "biotope": "river",
        "test_strength": "4x",
        "description": "Invisible tippet for spooky trout.",
        "stats": {"strength": 30, "visibility": 5, "stretch": 25},
        "bonuses": {"trout_stealth": 1.6, "river_presentation": 1.5},
        "cost": {"coins": 300},
        "unlock_level": 15,
        "icon": "🎯",
        "rarity": "uncommon"
    }
}


# ========== BOBBERS/FLOATS BY BIOTOPE ==========

BOBBERS = {
    "basic_bobber": {
        "id": "basic_bobber",
        "name": "Red & White Bobber",
        "category": "bobber",
        "biotope": "universal",
        "description": "Classic round bobber for any fishing.",
        "stats": {"visibility": 70, "sensitivity": 40, "stability": 50},
        "bonuses": {},
        "cost": {"coins": 50},
        "unlock_level": 1,
        "icon": "🔴",
        "rarity": "common"
    },
    "slip_bobber": {
        "id": "slip_bobber",
        "name": "Slip Float",
        "category": "bobber",
        "biotope": "freshwater_lake",
        "description": "Adjustable depth float for deep water.",
        "stats": {"visibility": 75, "sensitivity": 70, "stability": 65},
        "bonuses": {"depth_control": 1.5, "lake_bonus": 1.15},
        "cost": {"coins": 200},
        "unlock_level": 10,
        "icon": "🎈",
        "rarity": "uncommon"
    },
    "popping_cork": {
        "id": "popping_cork",
        "name": "Popping Cork",
        "category": "bobber",
        "biotope": "brackish",
        "description": "Creates noise to attract fish.",
        "stats": {"visibility": 80, "sensitivity": 60, "stability": 55},
        "bonuses": {"attraction": 1.4, "brackish_bonus": 1.2},
        "cost": {"coins": 350},
        "unlock_level": 25,
        "icon": "💥",
        "rarity": "uncommon"
    },
    "strike_indicator": {
        "id": "strike_indicator",
        "name": "Yarn Strike Indicator",
        "category": "bobber",
        "biotope": "river",
        "description": "Sensitive indicator for fly fishing.",
        "stats": {"visibility": 65, "sensitivity": 95, "stability": 40},
        "bonuses": {"river_detection": 1.5, "nymph_fishing": 1.4},
        "cost": {"coins": 150},
        "unlock_level": 12,
        "icon": "🧶",
        "rarity": "uncommon"
    },
    "balsa_float": {
        "id": "balsa_float",
        "name": "European Balsa Float",
        "category": "bobber",
        "biotope": "freshwater_lake",
        "description": "Ultra-sensitive float for light bites.",
        "stats": {"visibility": 70, "sensitivity": 90, "stability": 70},
        "bonuses": {"bite_detection": 1.6, "panfish_bonus": 1.3},
        "cost": {"coins": 400},
        "unlock_level": 20,
        "icon": "📍",
        "rarity": "rare"
    },
    "balloon_float": {
        "id": "balloon_float",
        "name": "Balloon Float",
        "category": "bobber",
        "biotope": "saltwater",
        "description": "Large float for offshore live bait.",
        "stats": {"visibility": 90, "sensitivity": 50, "stability": 80},
        "bonuses": {"saltwater_live_bait": 1.4, "offshore_bonus": 1.25},
        "cost": {"coins": 250},
        "unlock_level": 30,
        "icon": "🎈",
        "rarity": "uncommon"
    },
    "glow_bobber": {
        "id": "glow_bobber",
        "name": "LED Glow Bobber",
        "category": "bobber",
        "biotope": "universal",
        "description": "Lights up for night fishing.",
        "stats": {"visibility": 100, "sensitivity": 60, "stability": 55},
        "bonuses": {"night_fishing": 1.5, "visibility_bonus": 2.0},
        "cost": {"gems": 50},
        "unlock_level": 20,
        "icon": "💡",
        "rarity": "rare"
    }
}


# ========== REQUEST MODELS ==========

class PurchaseEquipmentRequest(BaseModel):
    user_id: str
    equipment_id: str
    equipment_type: str  # "rod", "line", "bobber"


class EquipItemRequest(BaseModel):
    user_id: str
    equipment_id: str
    equipment_type: str


# ========== HELPER FUNCTIONS ==========

async def get_player_equipment(user_id: str) -> dict:
    """Get player's equipment inventory"""
    equipment = await db.player_equipment.find_one({"user_id": user_id}, {"_id": 0})
    
    if not equipment:
        equipment = {
            "user_id": user_id,
            "owned_rods": ["basic_rod"],
            "owned_lines": ["basic_line"],
            "owned_bobbers": ["basic_bobber"],
            "equipped_rod": "basic_rod",
            "equipped_line": "basic_line",
            "equipped_bobber": "basic_bobber",
        }
        await db.player_equipment.insert_one(equipment)
    
    return equipment


def calculate_equipment_bonuses(rod_id: str, line_id: str, bobber_id: str, biotope: str) -> dict:
    """Calculate combined equipment bonuses for a biotope"""
    rod = FISHING_RODS.get(rod_id, FISHING_RODS["basic_rod"])
    line = FISHING_LINES.get(line_id, FISHING_LINES["basic_line"])
    bobber = BOBBERS.get(bobber_id, BOBBERS["basic_bobber"])
    
    bonuses = {
        "catch_rate": 1.0,
        "rare_chance": 1.0,
        "cast_distance": 1.0,
        "sensitivity": 1.0,
        "fighting_power": 1.0
    }
    
    # Apply rod bonuses
    for key, value in rod.get("bonuses", {}).items():
        if biotope in key or "bonus" in key:
            bonuses["catch_rate"] *= value
        if "rare" in key or "legendary" in key:
            bonuses["rare_chance"] *= value
        if "distance" in key:
            bonuses["cast_distance"] *= value
        if "fighting" in key or "power" in key:
            bonuses["fighting_power"] *= value
    
    # Apply line bonuses
    for key, value in line.get("bonuses", {}).items():
        if "stealth" in key:
            bonuses["catch_rate"] *= value
        if "sensitivity" in key:
            bonuses["sensitivity"] *= value
    
    # Apply bobber bonuses
    for key, value in bobber.get("bonuses", {}).items():
        if "detection" in key:
            bonuses["sensitivity"] *= value
        if "bonus" in key:
            bonuses["catch_rate"] *= value
    
    return bonuses


# ========== EQUIPMENT ENDPOINTS ==========

@router.get("/rods")
async def get_all_rods(biotope: Optional[str] = None):
    """Get all fishing rods"""
    rods = list(FISHING_RODS.values())
    if biotope:
        rods = [r for r in rods if r["biotope"] == biotope or r["biotope"] == "universal"]
    return {"rods": rods}


@router.get("/lines")
async def get_all_lines(biotope: Optional[str] = None):
    """Get all fishing lines"""
    lines = list(FISHING_LINES.values())
    if biotope:
        lines = [l for l in lines if l["biotope"] == biotope or l["biotope"] == "universal"]
    return {"lines": lines}


@router.get("/bobbers")
async def get_all_bobbers(biotope: Optional[str] = None):
    """Get all bobbers"""
    bobbers = list(BOBBERS.values())
    if biotope:
        bobbers = [b for b in bobbers if b["biotope"] == biotope or b["biotope"] == "universal"]
    return {"bobbers": bobbers}


@router.get("/inventory/{user_id}")
async def get_equipment_inventory(user_id: str):
    """Get player's equipment inventory"""
    equipment = await get_player_equipment(user_id)
    
    # Enrich with full item data
    owned_rods = [FISHING_RODS[r] for r in equipment.get("owned_rods", []) if r in FISHING_RODS]
    owned_lines = [FISHING_LINES[l] for l in equipment.get("owned_lines", []) if l in FISHING_LINES]
    owned_bobbers = [BOBBERS[b] for b in equipment.get("owned_bobbers", []) if b in BOBBERS]
    
    return {
        "owned_rods": owned_rods,
        "owned_lines": owned_lines,
        "owned_bobbers": owned_bobbers,
        "equipped_rod": FISHING_RODS.get(equipment.get("equipped_rod")),
        "equipped_line": FISHING_LINES.get(equipment.get("equipped_line")),
        "equipped_bobber": BOBBERS.get(equipment.get("equipped_bobber")),
    }


@router.post("/purchase")
async def purchase_equipment(request: PurchaseEquipmentRequest):
    """Purchase equipment"""
    # Get item data
    if request.equipment_type == "rod":
        item = FISHING_RODS.get(request.equipment_id)
        owned_key = "owned_rods"
    elif request.equipment_type == "line":
        item = FISHING_LINES.get(request.equipment_id)
        owned_key = "owned_lines"
    elif request.equipment_type == "bobber":
        item = BOBBERS.get(request.equipment_id)
        owned_key = "owned_bobbers"
    else:
        raise HTTPException(status_code=400, detail="Invalid equipment type")
    
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check level
    if user.get("level", 1) < item.get("unlock_level", 1):
        raise HTTPException(status_code=400, detail=f"Requires level {item['unlock_level']}")
    
    # Check ownership
    equipment = await get_player_equipment(request.user_id)
    if request.equipment_id in equipment.get(owned_key, []):
        raise HTTPException(status_code=400, detail="Already owned")
    
    # Check cost
    for currency, amount in item.get("cost", {}).items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct cost
    if item.get("cost"):
        update_ops = {"$inc": {}}
        for currency, amount in item["cost"].items():
            update_ops["$inc"][currency] = -amount
        await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Add to inventory
    await db.player_equipment.update_one(
        {"user_id": request.user_id},
        {"$push": {owned_key: request.equipment_id}},
        upsert=True
    )
    
    return {"success": True, "item": item}


@router.post("/equip")
async def equip_item(request: EquipItemRequest):
    """Equip an item"""
    equipment = await get_player_equipment(request.user_id)
    
    if request.equipment_type == "rod":
        owned_key = "owned_rods"
        equipped_key = "equipped_rod"
        item = FISHING_RODS.get(request.equipment_id)
    elif request.equipment_type == "line":
        owned_key = "owned_lines"
        equipped_key = "equipped_line"
        item = FISHING_LINES.get(request.equipment_id)
    elif request.equipment_type == "bobber":
        owned_key = "owned_bobbers"
        equipped_key = "equipped_bobber"
        item = BOBBERS.get(request.equipment_id)
    else:
        raise HTTPException(status_code=400, detail="Invalid equipment type")
    
    if request.equipment_id not in equipment.get(owned_key, []):
        raise HTTPException(status_code=400, detail="Item not owned")
    
    await db.player_equipment.update_one(
        {"user_id": request.user_id},
        {"$set": {equipped_key: request.equipment_id}}
    )
    
    return {"success": True, "equipped": item}


@router.get("/bonuses/{user_id}/{biotope_id}")
async def get_equipment_bonuses(user_id: str, biotope_id: str):
    """Get current equipment bonuses for a biotope"""
    equipment = await get_player_equipment(user_id)
    
    bonuses = calculate_equipment_bonuses(
        equipment.get("equipped_rod", "basic_rod"),
        equipment.get("equipped_line", "basic_line"),
        equipment.get("equipped_bobber", "basic_bobber"),
        biotope_id
    )
    
    return {
        "biotope": biotope_id,
        "bonuses": bonuses,
        "equipped": {
            "rod": FISHING_RODS.get(equipment.get("equipped_rod")),
            "line": FISHING_LINES.get(equipment.get("equipped_line")),
            "bobber": BOBBERS.get(equipment.get("equipped_bobber")),
        }
    }


@router.get("/recommended/{biotope_id}")
async def get_recommended_equipment(biotope_id: str):
    """Get recommended equipment for a biotope"""
    recommended_rods = [r for r in FISHING_RODS.values() if r["biotope"] == biotope_id]
    recommended_lines = [l for l in FISHING_LINES.values() if l["biotope"] == biotope_id]
    recommended_bobbers = [b for b in BOBBERS.values() if b["biotope"] == biotope_id]
    
    return {
        "biotope": biotope_id,
        "recommended_rods": recommended_rods,
        "recommended_lines": recommended_lines,
        "recommended_bobbers": recommended_bobbers
    }
