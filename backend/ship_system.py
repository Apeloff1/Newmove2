"""
Ship NPCs and Store System
Features:
- On-ship crew NPCs
- Ship bridge store
- Port stores
- Store inventories by location
- Crew management
- Store reputation bonuses
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random

router = APIRouter(prefix="/api/ship", tags=["ship"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# SHIP CREW NPCs
# ============================================================================

SHIP_CREW_TYPES = {
    "first_mate": {
        "role": "first_mate",
        "name_pool": ["Morgan", "Drake", "Hawkins", "Bones", "Silver"],
        "title": "First Mate",
        "description": "Your second in command. Manages the crew and navigation.",
        "abilities": ["crew_management", "navigation_boost", "morale_support"],
        "dialogue_style": "professional_loyal",
        "max_per_ship": 1,
        "salary": 50,
        "skill_bonuses": {"navigation": 10, "crew_efficiency": 15}
    },
    "cook": {
        "role": "cook",
        "name_pool": ["Cookie", "Gustave", "Pepper", "Beans", "Spice"],
        "title": "Ship's Cook",
        "description": "Keeps the crew fed and happy. Can prepare special meals.",
        "abilities": ["cooking", "food_preservation", "morale_boost"],
        "dialogue_style": "grumpy_caring",
        "max_per_ship": 1,
        "salary": 30,
        "skill_bonuses": {"food_efficiency": 20, "morale": 10}
    },
    "navigator": {
        "role": "navigator",
        "name_pool": ["Stars", "Compass", "Chart", "True North", "Meridian"],
        "title": "Navigator",
        "description": "Expert at reading stars and maps. Finds the fastest routes.",
        "abilities": ["star_navigation", "route_optimization", "danger_detection"],
        "dialogue_style": "precise_informative",
        "max_per_ship": 1,
        "salary": 45,
        "skill_bonuses": {"travel_speed": 15, "danger_avoidance": 10}
    },
    "quartermaster": {
        "role": "quartermaster",
        "name_pool": ["Ledger", "Count", "Balance", "Fair Share", "Numbers"],
        "title": "Quartermaster",
        "description": "Manages supplies and loot distribution. Keeps things fair.",
        "abilities": ["inventory_management", "fair_distribution", "supply_tracking"],
        "dialogue_style": "fair_strict",
        "max_per_ship": 1,
        "salary": 40,
        "skill_bonuses": {"cargo_capacity": 20, "supply_efficiency": 15}
    },
    "lookout": {
        "role": "lookout",
        "name_pool": ["Eagle Eye", "Hawk", "Spotter", "Vision", "Sharp"],
        "title": "Lookout",
        "description": "Watches for dangers and opportunities from the crow's nest.",
        "abilities": ["early_warning", "fish_spotting", "land_detection"],
        "dialogue_style": "alert_brief",
        "max_per_ship": 2,
        "salary": 25,
        "skill_bonuses": {"fish_detection": 15, "danger_warning": 20}
    },
    "deckhand": {
        "role": "deckhand",
        "name_pool": ["Swab", "Rope", "Deck", "Sail", "Anchor", "Knot", "Barnacle"],
        "title": "Deckhand",
        "description": "General crew member. Handles ropes, sails, and fishing.",
        "abilities": ["sailing", "fishing_assist", "general_labor"],
        "dialogue_style": "simple_hardworking",
        "max_per_ship": 10,
        "salary": 15,
        "skill_bonuses": {"fishing_speed": 5, "sailing_efficiency": 5}
    },
    "surgeon": {
        "role": "surgeon",
        "name_pool": ["Doc", "Sawbones", "Stitches", "Healer", "Patch"],
        "title": "Ship's Surgeon",
        "description": "Tends to injuries and illness. Essential for dangerous waters.",
        "abilities": ["healing", "disease_prevention", "emergency_treatment"],
        "dialogue_style": "calm_clinical",
        "max_per_ship": 1,
        "salary": 55,
        "skill_bonuses": {"crew_health": 25, "injury_recovery": 30}
    },
    "musician": {
        "role": "musician",
        "name_pool": ["Shanty", "Melody", "Strings", "Drum", "Whistle"],
        "title": "Ship's Musician",
        "description": "Keeps morale high with songs and entertainment.",
        "abilities": ["morale_boost", "work_songs", "celebration"],
        "dialogue_style": "cheerful_musical",
        "max_per_ship": 1,
        "salary": 20,
        "skill_bonuses": {"morale": 25, "work_efficiency": 10}
    },
    "carpenter": {
        "role": "carpenter",
        "name_pool": ["Plank", "Hammer", "Nail", "Wood", "Fix-it"],
        "title": "Ship's Carpenter",
        "description": "Repairs the ship and maintains its structure.",
        "abilities": ["ship_repair", "maintenance", "custom_modifications"],
        "dialogue_style": "practical_skilled",
        "max_per_ship": 1,
        "salary": 35,
        "skill_bonuses": {"ship_durability": 20, "repair_speed": 25}
    },
    "gunner": {
        "role": "gunner",
        "name_pool": ["Boom", "Thunder", "Powder", "Cannon", "Blast"],
        "title": "Master Gunner",
        "description": "Operates cannons and manages ammunition. Essential for defense.",
        "abilities": ["cannon_operation", "defensive_fire", "sea_monster_deterrent"],
        "dialogue_style": "loud_confident",
        "max_per_ship": 1,
        "salary": 40,
        "skill_bonuses": {"combat_power": 20, "monster_deterrent": 15}
    }
}

# ============================================================================
# STORE TYPES AND INVENTORIES
# ============================================================================

STORE_TYPES = {
    "general_store": {
        "id": "general_store",
        "name": "General Store",
        "description": "Basic supplies for any sailor.",
        "icon": "store",
        "base_inventory": [
            {"id": "food_basic", "name": "Hardtack", "price": 5, "type": "food", "quantity": 100},
            {"id": "water_barrel", "name": "Water Barrel", "price": 10, "type": "water", "quantity": 50},
            {"id": "rope_coil", "name": "Rope Coil", "price": 15, "type": "supply", "quantity": 30},
            {"id": "lantern", "name": "Lantern", "price": 25, "type": "equipment", "quantity": 20},
            {"id": "fishing_line", "name": "Fishing Line", "price": 8, "type": "fishing", "quantity": 50},
            {"id": "basic_bait", "name": "Basic Bait", "price": 3, "type": "bait", "quantity": 200}
        ]
    },
    "bait_shop": {
        "id": "bait_shop",
        "name": "Bait & Tackle",
        "description": "Specialized fishing supplies.",
        "icon": "fish_hook",
        "base_inventory": [
            {"id": "worm_bait", "name": "Worm Bait", "price": 5, "type": "bait", "quantity": 100},
            {"id": "shrimp_bait", "name": "Shrimp Bait", "price": 10, "type": "bait", "quantity": 75},
            {"id": "premium_bait", "name": "Premium Bait", "price": 25, "type": "bait", "quantity": 30},
            {"id": "legendary_bait", "name": "Legendary Bait", "price": 100, "type": "bait", "quantity": 5},
            {"id": "basic_rod", "name": "Basic Rod", "price": 50, "type": "equipment", "quantity": 10},
            {"id": "improved_rod", "name": "Improved Rod", "price": 150, "type": "equipment", "quantity": 5},
            {"id": "net_small", "name": "Small Net", "price": 75, "type": "equipment", "quantity": 10},
            {"id": "net_large", "name": "Large Net", "price": 200, "type": "equipment", "quantity": 5},
            {"id": "fish_finder", "name": "Fish Finder", "price": 500, "type": "equipment", "quantity": 3}
        ]
    },
    "ship_supply": {
        "id": "ship_supply",
        "name": "Ship Supplies",
        "description": "Everything for your vessel.",
        "icon": "anchor",
        "base_inventory": [
            {"id": "sail_patch", "name": "Sail Patch Kit", "price": 30, "type": "repair", "quantity": 20},
            {"id": "hull_planks", "name": "Hull Planks", "price": 50, "type": "repair", "quantity": 15},
            {"id": "anchor_spare", "name": "Spare Anchor", "price": 200, "type": "equipment", "quantity": 5},
            {"id": "compass", "name": "Compass", "price": 100, "type": "navigation", "quantity": 10},
            {"id": "spyglass", "name": "Spyglass", "price": 150, "type": "navigation", "quantity": 8},
            {"id": "ship_paint", "name": "Ship Paint", "price": 25, "type": "cosmetic", "quantity": 30}
        ]
    },
    "tavern": {
        "id": "tavern",
        "name": "Tavern",
        "description": "Food, drink, and information.",
        "icon": "beer_mug",
        "base_inventory": [
            {"id": "rum", "name": "Rum", "price": 15, "type": "drink", "quantity": 100},
            {"id": "grog", "name": "Grog", "price": 8, "type": "drink", "quantity": 150},
            {"id": "fine_wine", "name": "Fine Wine", "price": 50, "type": "drink", "quantity": 20},
            {"id": "hot_meal", "name": "Hot Meal", "price": 20, "type": "food", "quantity": 50},
            {"id": "feast", "name": "Captain's Feast", "price": 100, "type": "food", "quantity": 10},
            {"id": "room_basic", "name": "Basic Room (night)", "price": 25, "type": "lodging", "quantity": 10},
            {"id": "room_premium", "name": "Premium Room (night)", "price": 75, "type": "lodging", "quantity": 5}
        ]
    },
    "black_market": {
        "id": "black_market",
        "name": "Black Market",
        "description": "Goods of questionable origin.",
        "icon": "skull",
        "base_inventory": [
            {"id": "stolen_goods", "name": "Stolen Goods", "price": 50, "type": "contraband", "quantity": 20},
            {"id": "smuggled_rum", "name": "Smuggled Rum", "price": 10, "type": "drink", "quantity": 50},
            {"id": "forged_permit", "name": "Forged Permit", "price": 200, "type": "document", "quantity": 5},
            {"id": "treasure_map_fake", "name": "Treasure Map (?)", "price": 100, "type": "map", "quantity": 10},
            {"id": "treasure_map_real", "name": "Genuine Treasure Map", "price": 500, "type": "map", "quantity": 1},
            {"id": "poison", "name": "Sailor's Poison", "price": 150, "type": "dangerous", "quantity": 5}
        ],
        "requires_reputation": {"pirates": 500}
    },
    "shipyard": {
        "id": "shipyard",
        "name": "Shipyard",
        "description": "Buy, sell, and upgrade ships.",
        "icon": "ship",
        "services": ["buy_ship", "sell_ship", "upgrade_ship", "repair_ship"],
        "base_inventory": []  # Ships are handled separately
    },
    "fish_market": {
        "id": "fish_market",
        "name": "Fish Market",
        "description": "Sell your catch for the best prices.",
        "icon": "fish",
        "services": ["sell_fish", "fish_appraisal"],
        "base_inventory": []  # This is for selling, not buying
    }
}

# ============================================================================
# SHIP BRIDGE STORE (Available on your ship)
# ============================================================================

SHIP_BRIDGE_STORE = {
    "id": "ship_bridge_store",
    "name": "Ship's Stores",
    "description": "Basic supplies available on your ship.",
    "inventory": [
        {"id": "emergency_rations", "name": "Emergency Rations", "price": 15, "type": "food", "quantity": 20},
        {"id": "water_reserve", "name": "Water Reserve", "price": 12, "type": "water", "quantity": 20},
        {"id": "repair_kit_basic", "name": "Basic Repair Kit", "price": 50, "type": "repair", "quantity": 5},
        {"id": "flare", "name": "Emergency Flare", "price": 25, "type": "emergency", "quantity": 10}
    ],
    "restock_on_port": True,
    "markup": 1.5  # 50% markup vs port prices
}

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class CrewMember(BaseModel):
    crew_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ship_id: str
    role: str
    name: str
    level: int = 1
    experience: int = 0
    morale: int = 100
    health: int = 100
    salary: int
    hired_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    dialogue_unlocks: List[str] = Field(default_factory=list)

class HireCrewRequest(BaseModel):
    user_id: str
    ship_id: str
    role: str

class PurchaseRequest(BaseModel):
    user_id: str
    store_id: str
    item_id: str
    quantity: int = 1

class SellFishRequest(BaseModel):
    user_id: str
    fish_ids: List[str]

# ============================================================================
# API ROUTES
# ============================================================================

@router.get("/crew-types")
async def get_crew_types():
    """Get all available crew types"""
    return {"crew_types": SHIP_CREW_TYPES}

@router.get("/stores")
async def get_store_types():
    """Get all store types"""
    return {"stores": STORE_TYPES}

@router.get("/{user_id}/crew")
async def get_ship_crew(user_id: str, ship_id: Optional[str] = None):
    """Get crew members on a ship"""
    query = {"user_id": user_id}
    if ship_id:
        query["ship_id"] = ship_id
    
    crew = await db.ship_crew.find(query, {"_id": 0}).to_list(50)
    
    # Calculate total bonuses
    total_bonuses = {}
    total_salary = 0
    for member in crew:
        crew_type = SHIP_CREW_TYPES.get(member["role"], {})
        for bonus, value in crew_type.get("skill_bonuses", {}).items():
            total_bonuses[bonus] = total_bonuses.get(bonus, 0) + value
        total_salary += member.get("salary", 0)
    
    return {
        "crew": crew,
        "total_crew": len(crew),
        "total_bonuses": total_bonuses,
        "daily_salary": total_salary
    }

@router.post("/hire-crew")
async def hire_crew_member(request: HireCrewRequest):
    """Hire a new crew member"""
    crew_type = SHIP_CREW_TYPES.get(request.role)
    if not crew_type:
        raise HTTPException(status_code=404, detail="Invalid crew role")
    
    # Check if max crew of this type reached
    existing = await db.ship_crew.count_documents({
        "user_id": request.user_id,
        "ship_id": request.ship_id,
        "role": request.role
    })
    
    if existing >= crew_type["max_per_ship"]:
        raise HTTPException(status_code=400, detail=f"Maximum {crew_type['title']}s reached")
    
    # Generate crew member
    name = random.choice(crew_type["name_pool"])
    
    crew_member = CrewMember(
        user_id=request.user_id,
        ship_id=request.ship_id,
        role=request.role,
        name=name,
        salary=crew_type["salary"]
    )
    
    # Deduct hiring cost (10x salary)
    hiring_cost = crew_type["salary"] * 10
    user = await db.users.find_one({"id": request.user_id})
    if not user or user.get("gold", 0) < hiring_cost:
        raise HTTPException(status_code=400, detail=f"Not enough gold (need {hiring_cost})")
    
    await db.users.update_one(
        {"id": request.user_id},
        {"$inc": {"gold": -hiring_cost}}
    )
    
    await db.ship_crew.insert_one(crew_member.model_dump())
    
    return {
        "hired": True,
        "crew_member": crew_member.model_dump(),
        "cost": hiring_cost,
        "message": f"Hired {name} as {crew_type['title']}"
    }

@router.delete("/dismiss-crew/{crew_id}")
async def dismiss_crew_member(crew_id: str, user_id: str):
    """Dismiss a crew member"""
    result = await db.ship_crew.delete_one({
        "crew_id": crew_id,
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Crew member not found")
    
    return {"dismissed": True}

@router.post("/talk-to-crew/{crew_id}")
async def talk_to_crew(crew_id: str, user_id: str, topic: Optional[str] = None):
    """Talk to a crew member"""
    crew = await db.ship_crew.find_one(
        {"crew_id": crew_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not crew:
        raise HTTPException(status_code=404, detail="Crew member not found")
    
    crew_type = SHIP_CREW_TYPES.get(crew["role"], {})
    
    # Generate dialogue based on role and morale
    dialogues = generate_crew_dialogue(crew, crew_type, topic)
    
    return {
        "crew_member": crew,
        "dialogue": dialogues,
        "available_topics": ["status", "advice", "story", "complaint"]
    }

def generate_crew_dialogue(crew: Dict, crew_type: Dict, topic: Optional[str]) -> Dict:
    """Generate contextual dialogue for crew member"""
    morale = crew.get("morale", 100)
    name = crew["name"]
    role = crew_type.get("title", "Crew")
    
    dialogues = {
        "greeting": f"*{name} nods* Aye, Captain?",
        "status": "",
        "advice": "",
        "story": ""
    }
    
    if morale >= 80:
        dialogues["status"] = f"Feeling great, Captain! Ready for anything the sea throws at us."
        dialogues["advice"] = f"The crew's spirits are high. Good time for a challenging voyage!"
    elif morale >= 50:
        dialogues["status"] = f"Getting by, Captain. Could use some shore leave soon."
        dialogues["advice"] = f"Maybe stop at a port? The crew could use some relaxation."
    else:
        dialogues["status"] = f"*sighs* It's been rough, Captain. The crew is wearing thin."
        dialogues["advice"] = f"We need rest, Captain. Pushing further could be dangerous."
    
    # Role-specific stories
    stories = {
        "first_mate": "Let me tell you about the time I served under Captain Blackwood...",
        "cook": "You know what the secret to good ship's biscuit is? Anger. Lots of anger.",
        "navigator": "See that constellation? It saved my life once in the Storm Straits...",
        "lookout": "I once spotted a whale so big it blocked out the horizon...",
        "surgeon": "I've stitched up wounds that would make lesser men faint...",
        "musician": "*strums instrument* Want to hear a shanty about the Leviathan?",
        "carpenter": "This ship's got character. Every plank tells a story.",
        "gunner": "BOOM! Haha, sorry Captain, I just love the sound of cannons."
    }
    
    dialogues["story"] = stories.get(crew["role"], "I've seen some things on these seas, Captain...")
    
    return dialogues

@router.get("/store/{store_id}/inventory")
async def get_store_inventory(store_id: str, location_id: Optional[str] = None):
    """Get a store's inventory"""
    store = STORE_TYPES.get(store_id)
    if not store:
        # Check if it's the ship bridge store
        if store_id == "ship_bridge_store":
            return {
                "store": SHIP_BRIDGE_STORE,
                "inventory": SHIP_BRIDGE_STORE["inventory"]
            }
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Base inventory with location-specific modifications
    inventory = store.get("base_inventory", []).copy()
    
    # Apply location-specific stock variations
    if location_id:
        # Could modify inventory based on location
        pass
    
    return {
        "store": {
            "id": store["id"],
            "name": store["name"],
            "description": store["description"]
        },
        "inventory": inventory,
        "services": store.get("services", [])
    }

@router.post("/store/purchase")
async def purchase_item(request: PurchaseRequest):
    """Purchase an item from a store"""
    store = STORE_TYPES.get(request.store_id)
    if not store and request.store_id != "ship_bridge_store":
        raise HTTPException(status_code=404, detail="Store not found")
    
    if request.store_id == "ship_bridge_store":
        inventory = SHIP_BRIDGE_STORE["inventory"]
        markup = SHIP_BRIDGE_STORE["markup"]
    else:
        inventory = store.get("base_inventory", [])
        markup = 1.0
    
    item = next((i for i in inventory if i["id"] == request.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if item["quantity"] < request.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    
    total_price = int(item["price"] * request.quantity * markup)
    
    # Check user gold
    user = await db.users.find_one({"id": request.user_id})
    if not user or user.get("gold", 0) < total_price:
        raise HTTPException(status_code=400, detail=f"Not enough gold (need {total_price})")
    
    # Process purchase
    await db.users.update_one(
        {"id": request.user_id},
        {"$inc": {"gold": -total_price}}
    )
    
    # Add item to inventory
    for _ in range(request.quantity):
        await db.user_inventory.update_one(
            {"user_id": request.user_id},
            {"$push": {"items": {
                "id": str(uuid.uuid4()),
                "item_id": item["id"],
                "name": item["name"],
                "type": item["type"],
                "purchased_at": datetime.now(timezone.utc).isoformat()
            }}},
            upsert=True
        )
    
    return {
        "purchased": True,
        "item": item["name"],
        "quantity": request.quantity,
        "total_cost": total_price,
        "remaining_gold": user.get("gold", 0) - total_price
    }

@router.get("/locations/{location_id}/stores")
async def get_stores_at_location(location_id: str):
    """Get all stores available at a location"""
    # This would be configured per location
    # For now, return common stores
    available_stores = []
    
    # Most locations have these
    common_stores = ["general_store", "bait_shop", "tavern", "fish_market"]
    
    for store_id in common_stores:
        store = STORE_TYPES.get(store_id)
        if store:
            available_stores.append({
                "id": store["id"],
                "name": store["name"],
                "description": store["description"],
                "icon": store.get("icon", "store")
            })
    
    # Add shipyard if it's a port
    if "port" in location_id or "city" in location_id:
        shipyard = STORE_TYPES.get("shipyard")
        if shipyard:
            available_stores.append({
                "id": shipyard["id"],
                "name": shipyard["name"],
                "description": shipyard["description"],
                "icon": shipyard.get("icon", "ship")
            })
    
    # Add black market if it's a pirate haven
    if "pirate" in location_id or "haven" in location_id:
        black_market = STORE_TYPES.get("black_market")
        if black_market:
            available_stores.append({
                "id": black_market["id"],
                "name": black_market["name"],
                "description": black_market["description"],
                "icon": black_market.get("icon", "skull")
            })
    
    return {"stores": available_stores, "location": location_id}
