# ========== GO FISH! CRAFTING SYSTEM API ==========
# Item crafting, recipes, and workshop management
# ~450+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random

router = APIRouter(prefix="/api/crafting", tags=["crafting"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== CRAFTING RECIPES ==========

CRAFTING_RECIPES = [
    # Bait Recipes
    {
        "id": "basic_bait",
        "name": "Basic Bait",
        "category": "bait",
        "description": "Standard fishing bait",
        "ingredients": [
            {"item": "worm", "quantity": 2},
            {"item": "bread_crumb", "quantity": 1},
        ],
        "output": {"item": "basic_bait", "quantity": 5},
        "craft_time_seconds": 30,
        "xp_reward": 5,
        "unlock_level": 1,
        "icon": "🪱",
    },
    {
        "id": "premium_bait",
        "name": "Premium Bait",
        "category": "bait",
        "description": "High-quality bait that attracts better fish",
        "ingredients": [
            {"item": "worm", "quantity": 3},
            {"item": "fish_oil", "quantity": 1},
            {"item": "special_seasoning", "quantity": 1},
        ],
        "output": {"item": "premium_bait", "quantity": 5},
        "craft_time_seconds": 60,
        "xp_reward": 15,
        "unlock_level": 5,
        "icon": "🪱✨",
    },
    {
        "id": "legendary_bait",
        "name": "Legendary Bait",
        "category": "bait",
        "description": "Irresistible to legendary fish",
        "ingredients": [
            {"item": "golden_worm", "quantity": 1},
            {"item": "rare_essence", "quantity": 2},
            {"item": "moonlight_dust", "quantity": 1},
        ],
        "output": {"item": "legendary_bait", "quantity": 3},
        "craft_time_seconds": 300,
        "xp_reward": 50,
        "unlock_level": 25,
        "icon": "🪱👑",
    },
    
    # Lure Recipes
    {
        "id": "spinner_lure",
        "name": "Spinner Lure",
        "category": "lure",
        "description": "A spinning lure that catches fish attention",
        "ingredients": [
            {"item": "metal_scrap", "quantity": 3},
            {"item": "fishing_line", "quantity": 1},
            {"item": "colorful_feather", "quantity": 2},
        ],
        "output": {"item": "spinner_lure", "quantity": 1},
        "craft_time_seconds": 120,
        "xp_reward": 25,
        "unlock_level": 8,
        "icon": "🪝",
    },
    {
        "id": "glowing_lure",
        "name": "Glowing Lure",
        "category": "lure",
        "description": "Attracts fish in deep water",
        "ingredients": [
            {"item": "bioluminescent_extract", "quantity": 2},
            {"item": "glass_orb", "quantity": 1},
            {"item": "silver_wire", "quantity": 2},
        ],
        "output": {"item": "glowing_lure", "quantity": 1},
        "craft_time_seconds": 300,
        "xp_reward": 50,
        "unlock_level": 20,
        "icon": "🪝💫",
    },
    
    # Equipment Recipes
    {
        "id": "tackle_box_upgrade",
        "name": "Tackle Box Upgrade",
        "category": "equipment",
        "description": "Expands your tackle box capacity",
        "ingredients": [
            {"item": "wooden_plank", "quantity": 5},
            {"item": "metal_hinge", "quantity": 2},
            {"item": "leather_strap", "quantity": 1},
        ],
        "output": {"item": "tackle_box_upgrade", "quantity": 1, "effect": {"inventory_slots": 10}},
        "craft_time_seconds": 600,
        "xp_reward": 75,
        "unlock_level": 10,
        "icon": "🧰",
    },
    {
        "id": "fishing_rod_repair_kit",
        "name": "Rod Repair Kit",
        "category": "equipment",
        "description": "Repairs damaged fishing rods",
        "ingredients": [
            {"item": "wood_polish", "quantity": 1},
            {"item": "fishing_line", "quantity": 2},
            {"item": "cork", "quantity": 1},
        ],
        "output": {"item": "repair_kit", "quantity": 3},
        "craft_time_seconds": 90,
        "xp_reward": 20,
        "unlock_level": 3,
        "icon": "🔧",
    },
    
    # Consumables
    {
        "id": "energy_drink",
        "name": "Energy Drink",
        "category": "consumable",
        "description": "Restores 25 energy instantly",
        "ingredients": [
            {"item": "fresh_water", "quantity": 2},
            {"item": "sugar", "quantity": 1},
            {"item": "caffeine_berry", "quantity": 1},
        ],
        "output": {"item": "energy_drink", "quantity": 2, "effect": {"energy_restore": 25}},
        "craft_time_seconds": 45,
        "xp_reward": 10,
        "unlock_level": 2,
        "icon": "⚡",
    },
    {
        "id": "xp_potion",
        "name": "XP Potion",
        "category": "consumable",
        "description": "Doubles XP gain for 10 minutes",
        "ingredients": [
            {"item": "rare_herb", "quantity": 3},
            {"item": "fish_essence", "quantity": 2},
            {"item": "crystal_dust", "quantity": 1},
        ],
        "output": {"item": "xp_potion", "quantity": 1, "effect": {"xp_multiplier": 2.0, "duration_minutes": 10}},
        "craft_time_seconds": 180,
        "xp_reward": 30,
        "unlock_level": 15,
        "icon": "🧪",
    },
    {
        "id": "luck_charm",
        "name": "Luck Charm",
        "category": "consumable",
        "description": "Increases rare fish chance for 15 minutes",
        "ingredients": [
            {"item": "four_leaf_clover", "quantity": 1},
            {"item": "rabbit_foot", "quantity": 1},
            {"item": "enchanted_thread", "quantity": 2},
        ],
        "output": {"item": "luck_charm", "quantity": 1, "effect": {"rare_chance_multiplier": 1.5, "duration_minutes": 15}},
        "craft_time_seconds": 240,
        "xp_reward": 40,
        "unlock_level": 18,
        "icon": "🍀",
    },
    
    # Decorations
    {
        "id": "aquarium_ornament_coral",
        "name": "Coral Ornament",
        "category": "decoration",
        "description": "A beautiful coral for your aquarium",
        "ingredients": [
            {"item": "coral_fragment", "quantity": 3},
            {"item": "sea_glass", "quantity": 2},
            {"item": "aquarium_glue", "quantity": 1},
        ],
        "output": {"item": "coral_ornament", "quantity": 1},
        "craft_time_seconds": 120,
        "xp_reward": 20,
        "unlock_level": 7,
        "icon": "🪸",
    },
    {
        "id": "aquarium_castle",
        "name": "Underwater Castle",
        "category": "decoration",
        "description": "A majestic castle for your fish",
        "ingredients": [
            {"item": "stone_brick", "quantity": 10},
            {"item": "moss", "quantity": 3},
            {"item": "miniature_flag", "quantity": 1},
        ],
        "output": {"item": "underwater_castle", "quantity": 1},
        "craft_time_seconds": 600,
        "xp_reward": 60,
        "unlock_level": 15,
        "icon": "🏰",
    },
]

# Crafting materials that can be obtained
CRAFTING_MATERIALS = {
    "worm": {"name": "Worm", "rarity": "common", "sources": ["dig", "shop", "reward"]},
    "bread_crumb": {"name": "Bread Crumb", "rarity": "common", "sources": ["shop", "cooking"]},
    "fish_oil": {"name": "Fish Oil", "rarity": "uncommon", "sources": ["fishing", "cooking"]},
    "special_seasoning": {"name": "Special Seasoning", "rarity": "uncommon", "sources": ["cooking", "shop"]},
    "golden_worm": {"name": "Golden Worm", "rarity": "rare", "sources": ["dig", "reward"]},
    "rare_essence": {"name": "Rare Essence", "rarity": "rare", "sources": ["fishing_legendary", "reward"]},
    "moonlight_dust": {"name": "Moonlight Dust", "rarity": "epic", "sources": ["night_fishing", "event"]},
    "metal_scrap": {"name": "Metal Scrap", "rarity": "common", "sources": ["shop", "salvage"]},
    "fishing_line": {"name": "Fishing Line", "rarity": "common", "sources": ["shop"]},
    "colorful_feather": {"name": "Colorful Feather", "rarity": "uncommon", "sources": ["bird_catch", "shop"]},
    "bioluminescent_extract": {"name": "Bioluminescent Extract", "rarity": "rare", "sources": ["deep_fishing"]},
    "glass_orb": {"name": "Glass Orb", "rarity": "uncommon", "sources": ["shop", "craft"]},
    "silver_wire": {"name": "Silver Wire", "rarity": "uncommon", "sources": ["shop", "salvage"]},
    "wooden_plank": {"name": "Wooden Plank", "rarity": "common", "sources": ["shop", "gather"]},
    "metal_hinge": {"name": "Metal Hinge", "rarity": "uncommon", "sources": ["shop", "craft"]},
    "leather_strap": {"name": "Leather Strap", "rarity": "common", "sources": ["shop"]},
    "wood_polish": {"name": "Wood Polish", "rarity": "common", "sources": ["shop", "craft"]},
    "cork": {"name": "Cork", "rarity": "common", "sources": ["shop"]},
    "fresh_water": {"name": "Fresh Water", "rarity": "common", "sources": ["gather", "shop"]},
    "sugar": {"name": "Sugar", "rarity": "common", "sources": ["shop"]},
    "caffeine_berry": {"name": "Caffeine Berry", "rarity": "uncommon", "sources": ["gather", "shop"]},
    "rare_herb": {"name": "Rare Herb", "rarity": "rare", "sources": ["gather", "event"]},
    "fish_essence": {"name": "Fish Essence", "rarity": "uncommon", "sources": ["fishing"]},
    "crystal_dust": {"name": "Crystal Dust", "rarity": "rare", "sources": ["mining", "reward"]},
    "four_leaf_clover": {"name": "Four-Leaf Clover", "rarity": "rare", "sources": ["gather", "luck"]},
    "rabbit_foot": {"name": "Lucky Rabbit Foot", "rarity": "rare", "sources": ["reward", "event"]},
    "enchanted_thread": {"name": "Enchanted Thread", "rarity": "epic", "sources": ["craft", "event"]},
    "coral_fragment": {"name": "Coral Fragment", "rarity": "uncommon", "sources": ["ocean_fishing"]},
    "sea_glass": {"name": "Sea Glass", "rarity": "common", "sources": ["beach_gather"]},
    "aquarium_glue": {"name": "Aquarium Glue", "rarity": "common", "sources": ["shop"]},
    "stone_brick": {"name": "Stone Brick", "rarity": "common", "sources": ["gather", "shop"]},
    "moss": {"name": "Moss", "rarity": "common", "sources": ["gather"]},
    "miniature_flag": {"name": "Miniature Flag", "rarity": "uncommon", "sources": ["shop", "event"]},
}


# ========== REQUEST MODELS ==========

class StartCraftRequest(BaseModel):
    user_id: str
    recipe_id: str
    slot: int = 0


class CollectCraftRequest(BaseModel):
    user_id: str
    slot: int


class CancelCraftRequest(BaseModel):
    user_id: str
    slot: int


class SpeedUpCraftRequest(BaseModel):
    user_id: str
    slot: int
    use_gems: bool = True


# ========== HELPER FUNCTIONS ==========

async def get_player_workshop(user_id: str) -> dict:
    """Get or create player's workshop"""
    workshop = await db.player_workshop.find_one({"user_id": user_id}, {"_id": 0})
    
    if not workshop:
        workshop = {
            "user_id": user_id,
            "crafting_slots": [None, None],  # 2 slots by default
            "max_slots": 2,
            "total_crafted": 0,
            "crafting_xp": 0,
            "crafting_level": 1,
            "unlocked_recipes": ["basic_bait", "energy_drink", "fishing_rod_repair_kit"],
        }
        await db.player_workshop.insert_one(workshop)
    
    # Check if any crafts are complete
    now = datetime.now(timezone.utc)
    updated = False
    
    for i, slot in enumerate(workshop["crafting_slots"]):
        if slot and slot.get("status") == "crafting":
            complete_time = datetime.fromisoformat(slot["complete_at"])
            if now >= complete_time:
                workshop["crafting_slots"][i]["status"] = "complete"
                updated = True
    
    if updated:
        await db.player_workshop.update_one(
            {"user_id": user_id},
            {"$set": {"crafting_slots": workshop["crafting_slots"]}}
        )
    
    return workshop


async def get_player_materials(user_id: str) -> dict:
    """Get player's crafting materials inventory"""
    inventory = await db.player_materials.find_one({"user_id": user_id}, {"_id": 0})
    
    if not inventory:
        # Give starter materials
        inventory = {
            "user_id": user_id,
            "materials": {
                "worm": 10,
                "bread_crumb": 5,
                "fresh_water": 10,
                "fishing_line": 3,
            }
        }
        await db.player_materials.insert_one(inventory)
    
    return inventory


# ========== CRAFTING ENDPOINTS ==========

@router.get("/recipes")
async def get_crafting_recipes(user_id: Optional[str] = None):
    """Get all crafting recipes"""
    recipes = CRAFTING_RECIPES.copy()
    
    if user_id:
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
        workshop = await get_player_workshop(user_id)
        materials = await get_player_materials(user_id)
        
        user_level = user.get("level", 1) if user else 1
        unlocked = workshop.get("unlocked_recipes", [])
        
        for recipe in recipes:
            recipe["unlocked"] = recipe["id"] in unlocked or user_level >= recipe["unlock_level"]
            recipe["can_craft"] = recipe["unlocked"]
            
            # Check if player has enough materials
            if recipe["can_craft"]:
                for ingredient in recipe["ingredients"]:
                    have = materials.get("materials", {}).get(ingredient["item"], 0)
                    if have < ingredient["quantity"]:
                        recipe["can_craft"] = False
                        break
    
    return {"recipes": recipes}


@router.get("/materials")
async def get_materials_info():
    """Get all crafting materials info"""
    return {"materials": CRAFTING_MATERIALS}


@router.get("/workshop/{user_id}")
async def get_workshop(user_id: str):
    """Get player's workshop status"""
    workshop = await get_player_workshop(user_id)
    materials = await get_player_materials(user_id)
    
    return {
        "crafting_slots": workshop["crafting_slots"],
        "max_slots": workshop["max_slots"],
        "crafting_level": workshop.get("crafting_level", 1),
        "crafting_xp": workshop.get("crafting_xp", 0),
        "total_crafted": workshop.get("total_crafted", 0),
        "materials": materials.get("materials", {}),
    }


@router.get("/inventory/{user_id}")
async def get_crafting_inventory(user_id: str):
    """Get player's crafting materials inventory"""
    materials = await get_player_materials(user_id)
    
    # Enrich with material info
    inventory = []
    for material_id, quantity in materials.get("materials", {}).items():
        if quantity > 0:
            info = CRAFTING_MATERIALS.get(material_id, {})
            inventory.append({
                "id": material_id,
                "name": info.get("name", material_id),
                "quantity": quantity,
                "rarity": info.get("rarity", "common"),
                "sources": info.get("sources", []),
            })
    
    return {"inventory": inventory}


@router.post("/start")
async def start_crafting(request: StartCraftRequest):
    """Start crafting an item"""
    recipe = next((r for r in CRAFTING_RECIPES if r["id"] == request.recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    workshop = await get_player_workshop(request.user_id)
    materials = await get_player_materials(request.user_id)
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "level": 1})
    
    # Check unlock
    user_level = user.get("level", 1) if user else 1
    if user_level < recipe["unlock_level"] and request.recipe_id not in workshop.get("unlocked_recipes", []):
        raise HTTPException(status_code=400, detail=f"Recipe requires level {recipe['unlock_level']}")
    
    # Check slot availability
    if request.slot >= workshop["max_slots"]:
        raise HTTPException(status_code=400, detail="Invalid crafting slot")
    
    if workshop["crafting_slots"][request.slot] is not None:
        raise HTTPException(status_code=400, detail="Crafting slot is occupied")
    
    # Check materials
    for ingredient in recipe["ingredients"]:
        have = materials.get("materials", {}).get(ingredient["item"], 0)
        if have < ingredient["quantity"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Not enough {ingredient['item']}. Need {ingredient['quantity']}, have {have}"
            )
    
    # Deduct materials
    for ingredient in recipe["ingredients"]:
        await db.player_materials.update_one(
            {"user_id": request.user_id},
            {"$inc": {f"materials.{ingredient['item']}": -ingredient["quantity"]}}
        )
    
    # Start crafting
    now = datetime.now(timezone.utc)
    complete_at = now + timedelta(seconds=recipe["craft_time_seconds"])
    
    craft_job = {
        "recipe_id": request.recipe_id,
        "recipe_name": recipe["name"],
        "started_at": now.isoformat(),
        "complete_at": complete_at.isoformat(),
        "status": "crafting",
        "output": recipe["output"],
        "xp_reward": recipe["xp_reward"],
    }
    
    workshop["crafting_slots"][request.slot] = craft_job
    
    await db.player_workshop.update_one(
        {"user_id": request.user_id},
        {"$set": {f"crafting_slots.{request.slot}": craft_job}}
    )
    
    return {
        "success": True,
        "slot": request.slot,
        "recipe": recipe["name"],
        "complete_at": complete_at.isoformat(),
        "craft_time_seconds": recipe["craft_time_seconds"]
    }


@router.post("/collect")
async def collect_crafted_item(request: CollectCraftRequest):
    """Collect a completed craft"""
    workshop = await get_player_workshop(request.user_id)
    
    if request.slot >= len(workshop["crafting_slots"]):
        raise HTTPException(status_code=400, detail="Invalid slot")
    
    craft_job = workshop["crafting_slots"][request.slot]
    
    if not craft_job:
        raise HTTPException(status_code=400, detail="No craft in this slot")
    
    if craft_job["status"] != "complete":
        raise HTTPException(status_code=400, detail="Craft not complete yet")
    
    # Give output items
    output = craft_job["output"]
    
    if output.get("effect"):
        # Consumable with effect - add to player inventory
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$inc": {f"items.{output['item']}": output["quantity"]}},
            upsert=True
        )
    else:
        # Regular item - add to appropriate collection
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$inc": {f"crafted_items.{output['item']}": output["quantity"]}},
            upsert=True
        )
    
    # Award XP
    xp_reward = craft_job.get("xp_reward", 0)
    await db.player_workshop.update_one(
        {"user_id": request.user_id},
        {
            "$set": {f"crafting_slots.{request.slot}": None},
            "$inc": {"total_crafted": 1, "crafting_xp": xp_reward}
        }
    )
    
    # Check for level up
    new_workshop = await db.player_workshop.find_one({"user_id": request.user_id}, {"_id": 0})
    current_xp = new_workshop.get("crafting_xp", 0)
    current_level = new_workshop.get("crafting_level", 1)
    xp_for_next = current_level * 100  # Simple XP curve
    
    leveled_up = False
    if current_xp >= xp_for_next:
        await db.player_workshop.update_one(
            {"user_id": request.user_id},
            {"$inc": {"crafting_level": 1}, "$set": {"crafting_xp": current_xp - xp_for_next}}
        )
        leveled_up = True
    
    return {
        "success": True,
        "collected": output,
        "xp_earned": xp_reward,
        "leveled_up": leveled_up
    }


@router.post("/speed-up")
async def speed_up_craft(request: SpeedUpCraftRequest):
    """Speed up a craft with gems"""
    workshop = await get_player_workshop(request.user_id)
    
    if request.slot >= len(workshop["crafting_slots"]):
        raise HTTPException(status_code=400, detail="Invalid slot")
    
    craft_job = workshop["crafting_slots"][request.slot]
    
    if not craft_job or craft_job["status"] == "complete":
        raise HTTPException(status_code=400, detail="No active craft to speed up")
    
    # Calculate remaining time and gem cost
    now = datetime.now(timezone.utc)
    complete_at = datetime.fromisoformat(craft_job["complete_at"])
    remaining_seconds = max(0, (complete_at - now).total_seconds())
    
    gem_cost = max(1, int(remaining_seconds / 60))  # 1 gem per minute
    
    if request.use_gems:
        user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "gems": 1})
        if user.get("gems", 0) < gem_cost:
            raise HTTPException(status_code=400, detail=f"Not enough gems. Need {gem_cost}")
        
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"gems": -gem_cost}}
        )
    
    # Complete instantly
    await db.player_workshop.update_one(
        {"user_id": request.user_id},
        {"$set": {f"crafting_slots.{request.slot}.status": "complete"}}
    )
    
    return {
        "success": True,
        "gems_spent": gem_cost,
        "status": "complete"
    }


@router.post("/cancel")
async def cancel_craft(request: CancelCraftRequest):
    """Cancel an in-progress craft (returns 50% materials)"""
    workshop = await get_player_workshop(request.user_id)
    
    if request.slot >= len(workshop["crafting_slots"]):
        raise HTTPException(status_code=400, detail="Invalid slot")
    
    craft_job = workshop["crafting_slots"][request.slot]
    
    if not craft_job:
        raise HTTPException(status_code=400, detail="No craft in this slot")
    
    if craft_job["status"] == "complete":
        raise HTTPException(status_code=400, detail="Cannot cancel completed craft")
    
    # Get recipe to return partial materials
    recipe = next((r for r in CRAFTING_RECIPES if r["id"] == craft_job["recipe_id"]), None)
    returned_materials = {}
    
    if recipe:
        for ingredient in recipe["ingredients"]:
            return_qty = ingredient["quantity"] // 2  # 50% refund
            if return_qty > 0:
                returned_materials[ingredient["item"]] = return_qty
                await db.player_materials.update_one(
                    {"user_id": request.user_id},
                    {"$inc": {f"materials.{ingredient['item']}": return_qty}}
                )
    
    # Clear slot
    await db.player_workshop.update_one(
        {"user_id": request.user_id},
        {"$set": {f"crafting_slots.{request.slot}": None}}
    )
    
    return {
        "success": True,
        "returned_materials": returned_materials
    }


@router.post("/unlock-slot/{user_id}")
async def unlock_crafting_slot(user_id: str):
    """Unlock additional crafting slot (costs gems)"""
    workshop = await get_player_workshop(user_id)
    
    max_possible_slots = 5
    if workshop["max_slots"] >= max_possible_slots:
        raise HTTPException(status_code=400, detail="Maximum slots reached")
    
    gem_cost = 100 * workshop["max_slots"]  # Increasing cost
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "gems": 1})
    if user.get("gems", 0) < gem_cost:
        raise HTTPException(status_code=400, detail=f"Not enough gems. Need {gem_cost}")
    
    await db.users.update_one({"id": user_id}, {"$inc": {"gems": -gem_cost}})
    
    # Add new slot
    workshop["crafting_slots"].append(None)
    
    await db.player_workshop.update_one(
        {"user_id": user_id},
        {
            "$set": {"crafting_slots": workshop["crafting_slots"]},
            "$inc": {"max_slots": 1}
        }
    )
    
    return {
        "success": True,
        "new_max_slots": workshop["max_slots"] + 1,
        "gems_spent": gem_cost
    }


@router.post("/materials/add")
async def add_materials(user_id: str, materials: Dict[str, int]):
    """Add materials to player inventory (for rewards/fishing)"""
    for material_id, quantity in materials.items():
        if material_id in CRAFTING_MATERIALS and quantity > 0:
            await db.player_materials.update_one(
                {"user_id": user_id},
                {"$inc": {f"materials.{material_id}": quantity}},
                upsert=True
            )
    
    return {"success": True, "added": materials}
