# ========== GO FISH! COOKING SYSTEM API ==========
# Fish recipes, cooking mechanics, and culinary achievements
# ~600+ lines of backend code

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
import os
import random

router = APIRouter(prefix="/api/cooking", tags=["cooking"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== COOKING RECIPES ==========

RECIPES = {
    # BASIC RECIPES (Common fish, easy to make)
    "grilled_bass": {
        "id": "grilled_bass",
        "name": "Grilled Bass",
        "category": "grilled",
        "difficulty": 1,
        "description": "Simple grilled bass with herbs and lemon.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["largemouth_bass", "sea_bass", "smallmouth_bass"], "quantity": 1},
            {"type": "item", "item_id": "lemon", "quantity": 1},
            {"type": "item", "item_id": "herbs", "quantity": 1}
        ],
        "cooking_time_seconds": 60,
        "required_station": "grill",
        "unlock_level": 1,
        "rewards": {
            "xp": 25,
            "coins": 50,
            "dish_value": 100
        },
        "stats_boost": {
            "energy_restore": 15,
            "duration_minutes": 10
        },
        "icon": "🍖"
    },
    "fried_panfish": {
        "id": "fried_panfish",
        "name": "Crispy Fried Panfish",
        "category": "fried",
        "difficulty": 1,
        "description": "Golden fried bluegill or crappie with tartar sauce.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["bluegill", "crappie", "pumpkinseed", "yellow_perch"], "quantity": 3},
            {"type": "item", "item_id": "flour", "quantity": 2},
            {"type": "item", "item_id": "oil", "quantity": 1}
        ],
        "cooking_time_seconds": 45,
        "required_station": "fryer",
        "unlock_level": 2,
        "rewards": {
            "xp": 30,
            "coins": 60,
            "dish_value": 120
        },
        "stats_boost": {
            "energy_restore": 20,
            "xp_bonus": 1.05,
            "duration_minutes": 15
        },
        "icon": "🍳"
    },
    "fish_tacos": {
        "id": "fish_tacos",
        "name": "Fresh Fish Tacos",
        "category": "fusion",
        "difficulty": 2,
        "description": "Crispy fish in soft tortillas with slaw.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["mahi_mahi", "flounder", "snapper", "wahoo"], "quantity": 1},
            {"type": "item", "item_id": "tortilla", "quantity": 3},
            {"type": "item", "item_id": "cabbage", "quantity": 1},
            {"type": "item", "item_id": "lime", "quantity": 1}
        ],
        "cooking_time_seconds": 90,
        "required_station": "kitchen",
        "unlock_level": 10,
        "rewards": {
            "xp": 50,
            "coins": 100,
            "dish_value": 200
        },
        "stats_boost": {
            "energy_restore": 30,
            "catch_bonus": 1.1,
            "duration_minutes": 20
        },
        "icon": "🌮"
    },
    
    # INTERMEDIATE RECIPES
    "catfish_po_boy": {
        "id": "catfish_po_boy",
        "name": "Catfish Po'Boy",
        "category": "sandwich",
        "difficulty": 2,
        "description": "Southern-style fried catfish sandwich.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["channel_catfish", "flathead_catfish", "blue_catfish", "bullhead_catfish"], "quantity": 1},
            {"type": "item", "item_id": "french_bread", "quantity": 1},
            {"type": "item", "item_id": "remoulade", "quantity": 1}
        ],
        "cooking_time_seconds": 120,
        "required_station": "fryer",
        "unlock_level": 15,
        "rewards": {
            "xp": 75,
            "coins": 150,
            "dish_value": 300
        },
        "stats_boost": {
            "energy_restore": 40,
            "catfish_bonus": 1.2,
            "duration_minutes": 25
        },
        "icon": "🥖"
    },
    "salmon_sashimi": {
        "id": "salmon_sashimi",
        "name": "Fresh Salmon Sashimi",
        "category": "raw",
        "difficulty": 3,
        "description": "Premium raw salmon slices, Japanese style.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["chinook_salmon", "coho_salmon", "sockeye_salmon", "atlantic_salmon"], "quantity": 1, "min_size": 50},
            {"type": "item", "item_id": "wasabi", "quantity": 1},
            {"type": "item", "item_id": "soy_sauce", "quantity": 1}
        ],
        "cooking_time_seconds": 30,
        "required_station": "prep_table",
        "unlock_level": 25,
        "rewards": {
            "xp": 100,
            "coins": 250,
            "dish_value": 500
        },
        "stats_boost": {
            "energy_restore": 25,
            "rare_fish_bonus": 1.15,
            "duration_minutes": 30
        },
        "icon": "🍣"
    },
    "blackened_redfish": {
        "id": "blackened_redfish",
        "name": "Cajun Blackened Redfish",
        "category": "grilled",
        "difficulty": 3,
        "description": "Spicy Cajun-seasoned redfish, charred to perfection.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["redfish", "spotted_seatrout", "snapper"], "quantity": 1},
            {"type": "item", "item_id": "cajun_spice", "quantity": 2},
            {"type": "item", "item_id": "butter", "quantity": 1}
        ],
        "cooking_time_seconds": 90,
        "required_station": "grill",
        "unlock_level": 28,
        "rewards": {
            "xp": 90,
            "coins": 180,
            "dish_value": 400
        },
        "stats_boost": {
            "energy_restore": 35,
            "brackish_bonus": 1.2,
            "duration_minutes": 25
        },
        "icon": "🌶️"
    },
    "trout_almondine": {
        "id": "trout_almondine",
        "name": "Trout Almondine",
        "category": "classic",
        "difficulty": 3,
        "description": "Classic French preparation with toasted almonds.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["rainbow_trout", "brown_trout", "brook_trout", "golden_trout"], "quantity": 1},
            {"type": "item", "item_id": "almonds", "quantity": 2},
            {"type": "item", "item_id": "butter", "quantity": 2},
            {"type": "item", "item_id": "lemon", "quantity": 1}
        ],
        "cooking_time_seconds": 150,
        "required_station": "kitchen",
        "unlock_level": 20,
        "rewards": {
            "xp": 80,
            "coins": 160,
            "dish_value": 350
        },
        "stats_boost": {
            "energy_restore": 30,
            "river_bonus": 1.15,
            "duration_minutes": 20
        },
        "icon": "🥜"
    },
    
    # ADVANCED RECIPES
    "seared_tuna_steak": {
        "id": "seared_tuna_steak",
        "name": "Seared Ahi Tuna Steak",
        "category": "gourmet",
        "difficulty": 4,
        "description": "Rare-seared tuna with sesame crust.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["yellowfin_tuna"], "quantity": 1, "min_size": 80},
            {"type": "item", "item_id": "sesame_seeds", "quantity": 2},
            {"type": "item", "item_id": "soy_sauce", "quantity": 1},
            {"type": "item", "item_id": "ginger", "quantity": 1}
        ],
        "cooking_time_seconds": 60,
        "required_station": "grill",
        "unlock_level": 40,
        "rewards": {
            "xp": 150,
            "coins": 350,
            "dish_value": 700
        },
        "stats_boost": {
            "energy_restore": 50,
            "saltwater_bonus": 1.25,
            "speed_bonus": 1.1,
            "duration_minutes": 35
        },
        "icon": "🥩"
    },
    "lobster_bisque": {
        "id": "lobster_bisque",
        "name": "Classic Lobster Bisque",
        "category": "soup",
        "difficulty": 4,
        "description": "Rich, creamy soup with chunks of seafood.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["grouper", "snapper", "flounder"], "quantity": 2},
            {"type": "item", "item_id": "cream", "quantity": 2},
            {"type": "item", "item_id": "sherry", "quantity": 1},
            {"type": "item", "item_id": "tomato_paste", "quantity": 1}
        ],
        "cooking_time_seconds": 300,
        "required_station": "kitchen",
        "unlock_level": 45,
        "rewards": {
            "xp": 180,
            "coins": 400,
            "dish_value": 800
        },
        "stats_boost": {
            "energy_restore": 60,
            "all_catch_bonus": 1.15,
            "duration_minutes": 40
        },
        "icon": "🍲"
    },
    "ceviche": {
        "id": "ceviche",
        "name": "Peruvian Ceviche",
        "category": "raw",
        "difficulty": 4,
        "description": "Fresh fish cured in citrus with onions and chili.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["sea_bass", "flounder", "snapper", "mahi_mahi"], "quantity": 2},
            {"type": "item", "item_id": "lime", "quantity": 4},
            {"type": "item", "item_id": "onion", "quantity": 1},
            {"type": "item", "item_id": "chili", "quantity": 1}
        ],
        "cooking_time_seconds": 180,
        "required_station": "prep_table",
        "unlock_level": 35,
        "rewards": {
            "xp": 120,
            "coins": 280,
            "dish_value": 550
        },
        "stats_boost": {
            "energy_restore": 40,
            "perfect_catch_bonus": 1.2,
            "duration_minutes": 30
        },
        "icon": "🍋"
    },
    
    # MASTER RECIPES
    "sturgeon_caviar": {
        "id": "sturgeon_caviar",
        "name": "Premium Sturgeon Caviar",
        "category": "luxury",
        "difficulty": 5,
        "description": "The finest caviar, a true delicacy.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["lake_sturgeon", "white_sturgeon", "prehistoric_sturgeon"], "quantity": 1, "min_size": 100},
            {"type": "item", "item_id": "salt", "quantity": 1}
        ],
        "cooking_time_seconds": 600,
        "required_station": "prep_table",
        "unlock_level": 60,
        "rewards": {
            "xp": 300,
            "coins": 1000,
            "gems": 5,
            "dish_value": 2000
        },
        "stats_boost": {
            "energy_restore": 100,
            "legendary_bonus": 1.3,
            "vip_points": 50,
            "duration_minutes": 60
        },
        "icon": "🖤"
    },
    "koi_hotpot": {
        "id": "koi_hotpot",
        "name": "Golden Koi Hotpot",
        "category": "legendary",
        "difficulty": 5,
        "description": "A mystical dish said to grant great fortune.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["golden_koi", "koi"], "quantity": 1},
            {"type": "item", "item_id": "rare_mushroom", "quantity": 3},
            {"type": "item", "item_id": "ginseng", "quantity": 2},
            {"type": "item", "item_id": "truffle", "quantity": 1}
        ],
        "cooking_time_seconds": 900,
        "required_station": "kitchen",
        "unlock_level": 70,
        "rewards": {
            "xp": 500,
            "coins": 2000,
            "gems": 15,
            "dish_value": 5000
        },
        "stats_boost": {
            "energy_restore": 100,
            "all_catch_bonus": 1.3,
            "coin_bonus": 1.5,
            "legendary_bonus": 1.5,
            "vip_points": 100,
            "duration_minutes": 120
        },
        "icon": "🍲✨"
    },
    "deep_sea_platter": {
        "id": "deep_sea_platter",
        "name": "Abyssal Seafood Platter",
        "category": "legendary",
        "difficulty": 5,
        "description": "A rare feast from the deepest ocean.",
        "ingredients": [
            {"type": "fish", "fish_ids": ["giant_squid_deep", "anglerfish", "coelacanth"], "quantity": 1},
            {"type": "fish", "fish_ids": ["oarfish_deep", "gulper_eel"], "quantity": 1},
            {"type": "item", "item_id": "deep_sea_salt", "quantity": 2},
            {"type": "item", "item_id": "bioluminescent_sauce", "quantity": 1}
        ],
        "cooking_time_seconds": 1200,
        "required_station": "kitchen",
        "unlock_level": 80,
        "rewards": {
            "xp": 750,
            "coins": 3000,
            "gems": 25,
            "dish_value": 8000
        },
        "stats_boost": {
            "energy_restore": 100,
            "deep_sea_bonus": 2.0,
            "rare_fish_bonus": 1.5,
            "vip_points": 150,
            "duration_minutes": 180
        },
        "icon": "🦑✨"
    }
}

# Cooking ingredients available
COOKING_INGREDIENTS = {
    "lemon": {"name": "Lemon", "cost": {"coins": 10}, "icon": "🍋"},
    "herbs": {"name": "Fresh Herbs", "cost": {"coins": 15}, "icon": "🌿"},
    "flour": {"name": "Flour", "cost": {"coins": 5}, "icon": "🌾"},
    "oil": {"name": "Cooking Oil", "cost": {"coins": 8}, "icon": "🫒"},
    "tortilla": {"name": "Tortillas", "cost": {"coins": 12}, "icon": "🫓"},
    "cabbage": {"name": "Cabbage", "cost": {"coins": 10}, "icon": "🥬"},
    "lime": {"name": "Lime", "cost": {"coins": 10}, "icon": "🍋"},
    "french_bread": {"name": "French Bread", "cost": {"coins": 20}, "icon": "🥖"},
    "remoulade": {"name": "Remoulade Sauce", "cost": {"coins": 25}, "icon": "🫙"},
    "wasabi": {"name": "Wasabi", "cost": {"coins": 30}, "icon": "🟢"},
    "soy_sauce": {"name": "Soy Sauce", "cost": {"coins": 15}, "icon": "🫗"},
    "cajun_spice": {"name": "Cajun Spice", "cost": {"coins": 20}, "icon": "🌶️"},
    "butter": {"name": "Butter", "cost": {"coins": 12}, "icon": "🧈"},
    "almonds": {"name": "Sliced Almonds", "cost": {"coins": 25}, "icon": "🥜"},
    "sesame_seeds": {"name": "Sesame Seeds", "cost": {"coins": 18}, "icon": "⚪"},
    "ginger": {"name": "Fresh Ginger", "cost": {"coins": 15}, "icon": "🫚"},
    "cream": {"name": "Heavy Cream", "cost": {"coins": 20}, "icon": "🥛"},
    "sherry": {"name": "Cooking Sherry", "cost": {"coins": 35}, "icon": "🍷"},
    "tomato_paste": {"name": "Tomato Paste", "cost": {"coins": 12}, "icon": "🍅"},
    "onion": {"name": "Onion", "cost": {"coins": 8}, "icon": "🧅"},
    "chili": {"name": "Chili Pepper", "cost": {"coins": 10}, "icon": "🌶️"},
    "salt": {"name": "Sea Salt", "cost": {"coins": 5}, "icon": "🧂"},
    "rare_mushroom": {"name": "Rare Mushroom", "cost": {"gems": 5}, "icon": "🍄"},
    "ginseng": {"name": "Ginseng Root", "cost": {"gems": 8}, "icon": "🌱"},
    "truffle": {"name": "Black Truffle", "cost": {"gems": 15}, "icon": "🖤"},
    "deep_sea_salt": {"name": "Deep Sea Salt", "cost": {"gems": 10}, "icon": "🧂✨"},
    "bioluminescent_sauce": {"name": "Bioluminescent Sauce", "cost": {"gems": 20}, "icon": "💫"}
}


# ========== REQUEST MODELS ==========

class StartCookingRequest(BaseModel):
    user_id: str
    recipe_id: str


class CollectDishRequest(BaseModel):
    user_id: str
    cooking_slot: int


class PurchaseIngredientRequest(BaseModel):
    user_id: str
    ingredient_id: str
    quantity: int = 1


# ========== HELPER FUNCTIONS ==========

async def get_player_kitchen(user_id: str) -> dict:
    """Get player's kitchen state"""
    kitchen = await db.player_kitchen.find_one({"user_id": user_id}, {"_id": 0})
    
    if not kitchen:
        kitchen = {
            "user_id": user_id,
            "cooking_slots": [None, None],  # 2 cooking slots
            "max_slots": 2,
            "ingredients": {},
            "unlocked_recipes": ["grilled_bass", "fried_panfish"],
            "cooking_level": 1,
            "cooking_xp": 0,
            "dishes_cooked": 0,
            "active_buffs": []
        }
        await db.player_kitchen.insert_one(kitchen)
    
    # Check cooking completion
    now = datetime.now(timezone.utc)
    for i, slot in enumerate(kitchen.get("cooking_slots", [])):
        if slot and slot.get("status") == "cooking":
            complete_time = datetime.fromisoformat(slot["complete_at"])
            if now >= complete_time:
                kitchen["cooking_slots"][i]["status"] = "complete"
                await db.player_kitchen.update_one(
                    {"user_id": user_id},
                    {"$set": {f"cooking_slots.{i}.status": "complete"}}
                )
    
    return kitchen


# ========== COOKING ENDPOINTS ==========

@router.get("/recipes")
async def get_all_recipes(user_id: Optional[str] = None):
    """Get all cooking recipes"""
    recipes = list(RECIPES.values())
    
    if user_id:
        kitchen = await get_player_kitchen(user_id)
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
        user_level = user.get("level", 1) if user else 1
        
        for recipe in recipes:
            recipe["unlocked"] = (
                recipe["id"] in kitchen.get("unlocked_recipes", []) or
                user_level >= recipe["unlock_level"]
            )
    
    return {"recipes": recipes}


@router.get("/ingredients")
async def get_all_ingredients():
    """Get all cooking ingredients"""
    return {"ingredients": COOKING_INGREDIENTS}


@router.get("/kitchen/{user_id}")
async def get_kitchen_status(user_id: str):
    """Get player's kitchen status"""
    kitchen = await get_player_kitchen(user_id)
    
    return {
        "cooking_slots": kitchen["cooking_slots"],
        "max_slots": kitchen["max_slots"],
        "ingredients": kitchen.get("ingredients", {}),
        "cooking_level": kitchen.get("cooking_level", 1),
        "cooking_xp": kitchen.get("cooking_xp", 0),
        "dishes_cooked": kitchen.get("dishes_cooked", 0),
        "active_buffs": kitchen.get("active_buffs", [])
    }


@router.post("/ingredient/purchase")
async def purchase_ingredient(request: PurchaseIngredientRequest):
    """Purchase cooking ingredient"""
    ingredient = COOKING_INGREDIENTS.get(request.ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    
    # Calculate total cost
    total_cost = {k: v * request.quantity for k, v in ingredient["cost"].items()}
    
    # Check funds
    for currency, amount in total_cost.items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct cost
    update_ops = {"$inc": {}}
    for currency, amount in total_cost.items():
        update_ops["$inc"][currency] = -amount
    await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Add ingredient
    await db.player_kitchen.update_one(
        {"user_id": request.user_id},
        {"$inc": {f"ingredients.{request.ingredient_id}": request.quantity}},
        upsert=True
    )
    
    return {"success": True, "ingredient": ingredient["name"], "quantity": request.quantity}


@router.post("/cook")
async def start_cooking(request: StartCookingRequest):
    """Start cooking a recipe"""
    recipe = RECIPES.get(request.recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    kitchen = await get_player_kitchen(request.user_id)
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "level": 1})
    
    # Check level
    if user.get("level", 1) < recipe["unlock_level"]:
        raise HTTPException(status_code=400, detail=f"Requires level {recipe['unlock_level']}")
    
    # Find empty slot
    empty_slot = None
    for i, slot in enumerate(kitchen.get("cooking_slots", [])):
        if slot is None:
            empty_slot = i
            break
    
    if empty_slot is None:
        raise HTTPException(status_code=400, detail="No empty cooking slots")
    
    # Check ingredients
    for ing in recipe["ingredients"]:
        if ing["type"] == "item":
            have = kitchen.get("ingredients", {}).get(ing["item_id"], 0)
            if have < ing["quantity"]:
                raise HTTPException(status_code=400, detail=f"Not enough {ing['item_id']}")
        elif ing["type"] == "fish":
            # Check tacklebox for fish
            fish_query = {
                "user_id": request.user_id,
                "$or": [{"species": fid} for fid in ing["fish_ids"]] + 
                       [{"name": {"$regex": fid.replace("_", " "), "$options": "i"}} for fid in ing["fish_ids"]]
            }
            fish_count = await db.tacklebox.count_documents(fish_query)
            if fish_count < ing["quantity"]:
                raise HTTPException(status_code=400, detail=f"Not enough fish of required type")
    
    # Deduct ingredients
    for ing in recipe["ingredients"]:
        if ing["type"] == "item":
            await db.player_kitchen.update_one(
                {"user_id": request.user_id},
                {"$inc": {f"ingredients.{ing['item_id']}": -ing["quantity"]}}
            )
        elif ing["type"] == "fish":
            # Remove fish from tacklebox
            for _ in range(ing["quantity"]):
                fish_query = {
                    "user_id": request.user_id,
                    "$or": [{"species": fid} for fid in ing["fish_ids"]] + 
                           [{"name": {"$regex": fid.replace("_", " "), "$options": "i"}} for fid in ing["fish_ids"]]
                }
                await db.tacklebox.delete_one(fish_query)
    
    # Start cooking
    now = datetime.now(timezone.utc)
    complete_at = now + timedelta(seconds=recipe["cooking_time_seconds"])
    
    cooking_job = {
        "recipe_id": request.recipe_id,
        "recipe_name": recipe["name"],
        "started_at": now.isoformat(),
        "complete_at": complete_at.isoformat(),
        "status": "cooking"
    }
    
    await db.player_kitchen.update_one(
        {"user_id": request.user_id},
        {"$set": {f"cooking_slots.{empty_slot}": cooking_job}}
    )
    
    return {
        "success": True,
        "slot": empty_slot,
        "recipe": recipe["name"],
        "complete_at": complete_at.isoformat()
    }


@router.post("/collect")
async def collect_dish(request: CollectDishRequest):
    """Collect a cooked dish"""
    kitchen = await get_player_kitchen(request.user_id)
    
    if request.cooking_slot >= len(kitchen.get("cooking_slots", [])):
        raise HTTPException(status_code=400, detail="Invalid slot")
    
    slot = kitchen["cooking_slots"][request.cooking_slot]
    
    if not slot or slot.get("status") != "complete":
        raise HTTPException(status_code=400, detail="Dish not ready")
    
    recipe = RECIPES.get(slot["recipe_id"])
    
    # Award rewards
    rewards = recipe["rewards"]
    await db.users.update_one(
        {"id": request.user_id},
        {"$inc": {"xp": rewards.get("xp", 0), "coins": rewards.get("coins", 0), "gems": rewards.get("gems", 0)}}
    )
    
    # Apply buff
    if recipe.get("stats_boost"):
        buff = {
            "recipe_id": recipe["id"],
            "name": recipe["name"],
            **recipe["stats_boost"],
            "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=recipe["stats_boost"]["duration_minutes"])).isoformat()
        }
        await db.player_kitchen.update_one(
            {"user_id": request.user_id},
            {"$push": {"active_buffs": buff}}
        )
    
    # Clear slot and update stats
    await db.player_kitchen.update_one(
        {"user_id": request.user_id},
        {
            "$set": {f"cooking_slots.{request.cooking_slot}": None},
            "$inc": {"dishes_cooked": 1, "cooking_xp": rewards.get("xp", 0)}
        }
    )
    
    return {
        "success": True,
        "dish": recipe["name"],
        "rewards": rewards,
        "buff_applied": recipe.get("stats_boost")
    }


@router.get("/buffs/{user_id}")
async def get_active_buffs(user_id: str):
    """Get player's active cooking buffs"""
    kitchen = await get_player_kitchen(user_id)
    now = datetime.now(timezone.utc)
    
    # Filter active buffs
    active_buffs = []
    for buff in kitchen.get("active_buffs", []):
        expires = datetime.fromisoformat(buff["expires_at"])
        if expires > now:
            buff["remaining_minutes"] = int((expires - now).total_seconds() / 60)
            active_buffs.append(buff)
    
    # Update if any expired
    if len(active_buffs) != len(kitchen.get("active_buffs", [])):
        await db.player_kitchen.update_one(
            {"user_id": user_id},
            {"$set": {"active_buffs": active_buffs}}
        )
    
    return {"active_buffs": active_buffs}
