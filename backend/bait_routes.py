# ========== GO FISH! BAIT & FISHING SPOTS SYSTEM API ==========
# Bait management, fishing spot discovery, and location bonuses
# ~400+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random

router = APIRouter(prefix="/api/fishing", tags=["fishing"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== BAIT TYPES ==========

BAIT_TYPES = {
    "worm": {
        "id": "worm",
        "name": "Common Worm",
        "description": "Basic bait for beginners",
        "rarity": "common",
        "catch_bonus": 1.0,
        "rare_bonus": 1.0,
        "durability": 3,  # Uses per bait
        "cost": {"coins": 10},
        "icon": "🪱",
        "effective_fish": ["minnow", "perch", "bass"],
    },
    "night_crawler": {
        "id": "night_crawler",
        "name": "Night Crawler",
        "description": "Premium worm for serious anglers",
        "rarity": "uncommon",
        "catch_bonus": 1.2,
        "rare_bonus": 1.15,
        "durability": 4,
        "cost": {"coins": 30},
        "icon": "🪱✨",
        "effective_fish": ["bass", "catfish", "pike"],
    },
    "minnow_bait": {
        "id": "minnow_bait",
        "name": "Live Minnow",
        "description": "Small fish bait for bigger catches",
        "rarity": "uncommon",
        "catch_bonus": 1.3,
        "rare_bonus": 1.2,
        "durability": 2,
        "cost": {"coins": 50},
        "icon": "🐟",
        "effective_fish": ["pike", "muskie", "bass"],
    },
    "power_bait": {
        "id": "power_bait",
        "name": "Power Bait",
        "description": "Scientifically enhanced formula",
        "rarity": "rare",
        "catch_bonus": 1.5,
        "rare_bonus": 1.3,
        "durability": 5,
        "cost": {"coins": 100},
        "icon": "💪",
        "effective_fish": ["all"],
    },
    "golden_bait": {
        "id": "golden_bait",
        "name": "Golden Bait",
        "description": "Attracts legendary fish",
        "rarity": "epic",
        "catch_bonus": 1.5,
        "rare_bonus": 2.0,
        "legendary_bonus": 2.5,
        "durability": 3,
        "cost": {"gems": 20},
        "icon": "⭐",
        "effective_fish": ["koi", "golden_koi", "legendary"],
    },
    "storm_bait": {
        "id": "storm_bait",
        "name": "Storm Bait",
        "description": "Special bait for stormy weather",
        "rarity": "rare",
        "catch_bonus": 1.4,
        "rare_bonus": 1.5,
        "storm_bonus": 2.0,
        "durability": 4,
        "cost": {"coins": 80},
        "icon": "⛈️",
        "effective_fish": ["storm_fish", "catfish"],
    },
    "night_bait": {
        "id": "night_bait",
        "name": "Glow Bait",
        "description": "Bioluminescent bait for night fishing",
        "rarity": "rare",
        "catch_bonus": 1.3,
        "rare_bonus": 1.6,
        "night_bonus": 2.0,
        "durability": 4,
        "cost": {"coins": 75},
        "icon": "🌙",
        "effective_fish": ["night_fish", "catfish", "eel"],
    },
    "event_bait": {
        "id": "event_bait",
        "name": "Event Special Bait",
        "description": "Limited edition event bait",
        "rarity": "legendary",
        "catch_bonus": 2.0,
        "rare_bonus": 2.5,
        "durability": 10,
        "cost": {"event_tokens": 100},
        "icon": "🎉",
        "effective_fish": ["event_fish"],
        "limited": True,
    },
}


# ========== FISHING SPOTS ==========

FISHING_SPOTS = {
    "pond": {
        "id": "pond",
        "name": "Beginner's Pond",
        "description": "A calm pond perfect for learning",
        "difficulty": 1,
        "unlock_level": 1,
        "fish_pool": ["minnow", "perch", "bass"],
        "rare_pool": ["golden_perch"],
        "environment": {"weather_effect": 0.5, "time_effect": 0.5},
        "bonuses": {"xp": 1.0, "coins": 1.0},
        "icon": "🏞️",
        "background": "pond_bg",
    },
    "river": {
        "id": "river",
        "name": "Sunset River",
        "description": "A flowing river with diverse fish",
        "difficulty": 2,
        "unlock_level": 5,
        "fish_pool": ["bass", "catfish", "pike", "trout"],
        "rare_pool": ["rainbow_trout", "king_salmon"],
        "environment": {"weather_effect": 1.0, "time_effect": 1.0},
        "bonuses": {"xp": 1.2, "coins": 1.15},
        "icon": "🌊",
        "background": "river_bg",
    },
    "lake": {
        "id": "lake",
        "name": "Crystal Lake",
        "description": "A deep lake hiding mysterious fish",
        "difficulty": 3,
        "unlock_level": 15,
        "fish_pool": ["bass", "pike", "muskie", "carp", "koi"],
        "rare_pool": ["golden_koi", "crystal_fish"],
        "environment": {"weather_effect": 1.2, "time_effect": 1.2},
        "bonuses": {"xp": 1.4, "coins": 1.3},
        "icon": "🌅",
        "background": "lake_bg",
    },
    "ocean": {
        "id": "ocean",
        "name": "Deep Ocean",
        "description": "The vast ocean with dangerous creatures",
        "difficulty": 4,
        "unlock_level": 25,
        "fish_pool": ["tuna", "marlin", "shark", "swordfish"],
        "rare_pool": ["giant_squid", "whale_shark"],
        "legendary_pool": ["leviathan"],
        "environment": {"weather_effect": 1.5, "time_effect": 0.8},
        "bonuses": {"xp": 1.8, "coins": 1.5, "rare_chance": 1.3},
        "icon": "🌊",
        "background": "ocean_bg",
        "requires_boat": True,
    },
    "reef": {
        "id": "reef",
        "name": "Coral Reef",
        "description": "Colorful reef with exotic tropical fish",
        "difficulty": 3,
        "unlock_level": 20,
        "fish_pool": ["clownfish", "angelfish", "parrotfish", "tang"],
        "rare_pool": ["mandarin_fish", "seahorse"],
        "environment": {"weather_effect": 0.8, "time_effect": 1.3},
        "bonuses": {"xp": 1.5, "coins": 1.4, "rare_chance": 1.5},
        "icon": "🪸",
        "background": "reef_bg",
        "requires_boat": True,
    },
    "arctic": {
        "id": "arctic",
        "name": "Arctic Waters",
        "description": "Ice fishing in frozen waters",
        "difficulty": 5,
        "unlock_level": 40,
        "fish_pool": ["arctic_char", "cod", "halibut"],
        "rare_pool": ["ice_fish", "frost_pike"],
        "legendary_pool": ["ice_dragon"],
        "environment": {"weather_effect": 2.0, "time_effect": 0.5},
        "bonuses": {"xp": 2.0, "coins": 1.8, "rare_chance": 1.5},
        "icon": "❄️",
        "background": "arctic_bg",
        "requires_boat": True,
        "requires_item": "ice_drill",
    },
    "volcano": {
        "id": "volcano",
        "name": "Volcanic Springs",
        "description": "Dangerous waters near active volcano",
        "difficulty": 5,
        "unlock_level": 50,
        "fish_pool": ["lava_fish", "obsidian_carp", "fire_eel"],
        "rare_pool": ["phoenix_fish", "magma_koi"],
        "legendary_pool": ["volcano_dragon"],
        "environment": {"weather_effect": 0.3, "time_effect": 0.5},
        "bonuses": {"xp": 2.5, "coins": 2.0, "rare_chance": 2.0, "legendary_chance": 1.5},
        "icon": "🌋",
        "background": "volcano_bg",
        "requires_item": "heat_suit",
    },
    "secret_cove": {
        "id": "secret_cove",
        "name": "Secret Cove",
        "description": "A hidden spot known only to masters",
        "difficulty": 4,
        "unlock_level": 60,
        "fish_pool": ["ghost_fish", "spirit_koi", "ethereal_bass"],
        "rare_pool": ["void_fish", "star_fish"],
        "legendary_pool": ["cosmic_whale"],
        "environment": {"weather_effect": 0.0, "time_effect": 2.0},
        "bonuses": {"xp": 3.0, "coins": 2.5, "rare_chance": 2.5, "legendary_chance": 2.0},
        "icon": "🌌",
        "background": "secret_bg",
        "hidden": True,
    },
}


# ========== REQUEST MODELS ==========

class EquipBaitRequest(BaseModel):
    user_id: str
    bait_id: str


class UseBaitRequest(BaseModel):
    user_id: str


class PurchaseBaitRequest(BaseModel):
    user_id: str
    bait_id: str
    quantity: int = 1


class UnlockSpotRequest(BaseModel):
    user_id: str
    spot_id: str


class SelectSpotRequest(BaseModel):
    user_id: str
    spot_id: str


# ========== HELPER FUNCTIONS ==========

async def get_player_bait_inventory(user_id: str) -> dict:
    """Get player's bait inventory"""
    inventory = await db.player_bait.find_one({"user_id": user_id}, {"_id": 0})
    
    if not inventory:
        inventory = {
            "user_id": user_id,
            "baits": {"worm": 10},  # Starter baits
            "equipped_bait": None,
            "equipped_uses_remaining": 0,
        }
        await db.player_bait.insert_one(inventory)
    
    return inventory


async def get_player_spots(user_id: str) -> dict:
    """Get player's unlocked fishing spots"""
    spots = await db.player_spots.find_one({"user_id": user_id}, {"_id": 0})
    
    if not spots:
        spots = {
            "user_id": user_id,
            "unlocked_spots": ["pond"],
            "current_spot": "pond",
            "spot_stats": {},
        }
        await db.player_spots.insert_one(spots)
    
    return spots


def calculate_catch_bonuses(bait_data: dict, spot_data: dict, conditions: dict) -> dict:
    """Calculate all bonuses for a catch attempt"""
    bonuses = {
        "catch_rate": 1.0,
        "rare_chance": 1.0,
        "legendary_chance": 1.0,
        "xp_multiplier": 1.0,
        "coin_multiplier": 1.0,
    }
    
    # Bait bonuses
    if bait_data:
        bonuses["catch_rate"] *= bait_data.get("catch_bonus", 1.0)
        bonuses["rare_chance"] *= bait_data.get("rare_bonus", 1.0)
        bonuses["legendary_chance"] *= bait_data.get("legendary_bonus", 1.0)
        
        # Weather/time specific bonuses
        if conditions.get("is_storm") and bait_data.get("storm_bonus"):
            bonuses["catch_rate"] *= bait_data["storm_bonus"]
        if conditions.get("is_night") and bait_data.get("night_bonus"):
            bonuses["rare_chance"] *= bait_data["night_bonus"]
    
    # Spot bonuses
    if spot_data:
        bonuses["xp_multiplier"] *= spot_data.get("bonuses", {}).get("xp", 1.0)
        bonuses["coin_multiplier"] *= spot_data.get("bonuses", {}).get("coins", 1.0)
        bonuses["rare_chance"] *= spot_data.get("bonuses", {}).get("rare_chance", 1.0)
        bonuses["legendary_chance"] *= spot_data.get("bonuses", {}).get("legendary_chance", 1.0)
    
    return bonuses


# ========== BAIT ENDPOINTS ==========

@router.get("/bait/types")
async def get_bait_types():
    """Get all bait types"""
    return {"baits": list(BAIT_TYPES.values())}


@router.get("/bait/inventory/{user_id}")
async def get_bait_inventory(user_id: str):
    """Get player's bait inventory"""
    inventory = await get_player_bait_inventory(user_id)
    
    # Enrich with bait info
    baits = []
    for bait_id, quantity in inventory.get("baits", {}).items():
        if quantity > 0:
            bait_info = BAIT_TYPES.get(bait_id, {})
            baits.append({
                **bait_info,
                "quantity": quantity,
            })
    
    return {
        "baits": baits,
        "equipped_bait": inventory.get("equipped_bait"),
        "equipped_uses_remaining": inventory.get("equipped_uses_remaining", 0),
    }


@router.post("/bait/purchase")
async def purchase_bait(request: PurchaseBaitRequest):
    """Purchase bait"""
    bait = BAIT_TYPES.get(request.bait_id)
    if not bait:
        raise HTTPException(status_code=404, detail="Bait not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate total cost
    total_cost = {k: v * request.quantity for k, v in bait["cost"].items()}
    
    # Verify funds
    for currency, amount in total_cost.items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct currency
    update_ops = {"$inc": {}}
    for currency, amount in total_cost.items():
        update_ops["$inc"][currency] = -amount
    await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Add bait to inventory
    await db.player_bait.update_one(
        {"user_id": request.user_id},
        {"$inc": {f"baits.{request.bait_id}": request.quantity}},
        upsert=True
    )
    
    return {
        "success": True,
        "bait": bait["name"],
        "quantity": request.quantity,
        "cost": total_cost
    }


@router.post("/bait/equip")
async def equip_bait(request: EquipBaitRequest):
    """Equip a bait"""
    inventory = await get_player_bait_inventory(request.user_id)
    
    bait = BAIT_TYPES.get(request.bait_id)
    if not bait:
        raise HTTPException(status_code=404, detail="Bait not found")
    
    # Check if player has this bait
    current_quantity = inventory.get("baits", {}).get(request.bait_id, 0)
    if current_quantity <= 0:
        raise HTTPException(status_code=400, detail="No bait of this type")
    
    # Equip bait (use one)
    await db.player_bait.update_one(
        {"user_id": request.user_id},
        {
            "$set": {
                "equipped_bait": request.bait_id,
                "equipped_uses_remaining": bait["durability"]
            },
            "$inc": {f"baits.{request.bait_id}": -1}
        }
    )
    
    return {
        "success": True,
        "equipped": bait["name"],
        "uses": bait["durability"]
    }


@router.post("/bait/use")
async def use_bait(request: UseBaitRequest):
    """Use equipped bait (called on each cast)"""
    inventory = await get_player_bait_inventory(request.user_id)
    
    if not inventory.get("equipped_bait"):
        return {"success": True, "bait_used": False, "bonus": 1.0}
    
    uses_remaining = inventory.get("equipped_uses_remaining", 0)
    
    if uses_remaining <= 0:
        # Bait depleted
        await db.player_bait.update_one(
            {"user_id": request.user_id},
            {"$set": {"equipped_bait": None, "equipped_uses_remaining": 0}}
        )
        return {"success": True, "bait_used": False, "bait_depleted": True}
    
    # Use one durability
    await db.player_bait.update_one(
        {"user_id": request.user_id},
        {"$inc": {"equipped_uses_remaining": -1}}
    )
    
    bait = BAIT_TYPES.get(inventory["equipped_bait"])
    
    return {
        "success": True,
        "bait_used": True,
        "bait_name": bait["name"] if bait else "Unknown",
        "catch_bonus": bait.get("catch_bonus", 1.0) if bait else 1.0,
        "rare_bonus": bait.get("rare_bonus", 1.0) if bait else 1.0,
        "uses_remaining": uses_remaining - 1
    }


# ========== FISHING SPOTS ENDPOINTS ==========

@router.get("/spots/all")
async def get_all_spots():
    """Get all fishing spots"""
    return {"spots": list(FISHING_SPOTS.values())}


@router.get("/spots/{user_id}")
async def get_user_spots(user_id: str):
    """Get player's unlocked and current spot"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
    spots_data = await get_player_spots(user_id)
    user_level = user.get("level", 1) if user else 1
    
    spots = []
    for spot_id, spot_data in FISHING_SPOTS.items():
        spot_copy = dict(spot_data)
        spot_copy["unlocked"] = spot_id in spots_data.get("unlocked_spots", [])
        spot_copy["can_unlock"] = user_level >= spot_data["unlock_level"] and not spot_copy["unlocked"]
        spot_copy["is_current"] = spot_id == spots_data.get("current_spot")
        spot_copy["stats"] = spots_data.get("spot_stats", {}).get(spot_id, {"fish_caught": 0})
        spots.append(spot_copy)
    
    return {
        "spots": spots,
        "current_spot": spots_data.get("current_spot"),
    }


@router.post("/spots/unlock")
async def unlock_spot(request: UnlockSpotRequest):
    """Unlock a fishing spot"""
    spot = FISHING_SPOTS.get(request.spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "level": 1})
    user_level = user.get("level", 1) if user else 1
    
    if user_level < spot["unlock_level"]:
        raise HTTPException(status_code=400, detail=f"Requires level {spot['unlock_level']}")
    
    spots_data = await get_player_spots(request.user_id)
    
    if request.spot_id in spots_data.get("unlocked_spots", []):
        raise HTTPException(status_code=400, detail="Already unlocked")
    
    # Check requirements
    if spot.get("requires_boat"):
        inventory = await db.player_inventory.find_one({"user_id": request.user_id}, {"_id": 0})
        has_boat = any(item.startswith("boat") for item in inventory.get("items", [])) if inventory else False
        if not has_boat:
            raise HTTPException(status_code=400, detail="Requires a boat")
    
    if spot.get("requires_item"):
        inventory = await db.player_inventory.find_one({"user_id": request.user_id}, {"_id": 0})
        if not inventory or spot["requires_item"] not in inventory.get("items", []):
            raise HTTPException(status_code=400, detail=f"Requires {spot['requires_item']}")
    
    # Unlock spot
    await db.player_spots.update_one(
        {"user_id": request.user_id},
        {"$push": {"unlocked_spots": request.spot_id}},
        upsert=True
    )
    
    return {"success": True, "spot_unlocked": spot["name"]}


@router.post("/spots/select")
async def select_spot(request: SelectSpotRequest):
    """Select a fishing spot"""
    spots_data = await get_player_spots(request.user_id)
    
    if request.spot_id not in spots_data.get("unlocked_spots", []):
        raise HTTPException(status_code=400, detail="Spot not unlocked")
    
    await db.player_spots.update_one(
        {"user_id": request.user_id},
        {"$set": {"current_spot": request.spot_id}}
    )
    
    spot = FISHING_SPOTS.get(request.spot_id)
    
    return {"success": True, "current_spot": spot}


@router.post("/spots/record-catch/{user_id}/{spot_id}")
async def record_spot_catch(user_id: str, spot_id: str, fish_type: str):
    """Record a catch at a spot (for statistics)"""
    await db.player_spots.update_one(
        {"user_id": user_id},
        {
            "$inc": {
                f"spot_stats.{spot_id}.fish_caught": 1,
                f"spot_stats.{spot_id}.fish_types.{fish_type}": 1
            }
        },
        upsert=True
    )
    
    return {"success": True}


@router.get("/bonuses/{user_id}")
async def get_current_fishing_bonuses(user_id: str, is_night: bool = False, is_storm: bool = False):
    """Get all current fishing bonuses"""
    bait_inv = await get_player_bait_inventory(user_id)
    spots = await get_player_spots(user_id)
    
    bait_data = BAIT_TYPES.get(bait_inv.get("equipped_bait")) if bait_inv.get("equipped_bait") else None
    spot_data = FISHING_SPOTS.get(spots.get("current_spot", "pond"))
    
    conditions = {"is_night": is_night, "is_storm": is_storm}
    bonuses = calculate_catch_bonuses(bait_data, spot_data, conditions)
    
    return {
        "bonuses": bonuses,
        "equipped_bait": bait_data,
        "current_spot": spot_data,
    }
