# ========== GO FISH! AQUARIUM DISPLAY SYSTEM API ==========
# Fish collection display, decoration, and aquarium management
# ~400+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random

router = APIRouter(prefix="/api/aquarium", tags=["aquarium"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== AQUARIUM CONFIGURATION ==========

AQUARIUM_TANKS = {
    "starter": {
        "id": "starter",
        "name": "Starter Tank",
        "capacity": 10,
        "size": {"width": 100, "height": 50},
        "cost": 0,
        "unlock_level": 1,
        "decorations_allowed": 3,
    },
    "medium": {
        "id": "medium",
        "name": "Medium Aquarium",
        "capacity": 25,
        "size": {"width": 200, "height": 80},
        "cost": {"coins": 5000},
        "unlock_level": 10,
        "decorations_allowed": 6,
    },
    "large": {
        "id": "large",
        "name": "Large Aquarium",
        "capacity": 50,
        "size": {"width": 300, "height": 120},
        "cost": {"gems": 200},
        "unlock_level": 25,
        "decorations_allowed": 10,
    },
    "mega": {
        "id": "mega",
        "name": "Mega Aquarium",
        "capacity": 100,
        "size": {"width": 500, "height": 200},
        "cost": {"gems": 500},
        "unlock_level": 50,
        "decorations_allowed": 20,
    },
    "ocean": {
        "id": "ocean",
        "name": "Ocean Exhibit",
        "capacity": 200,
        "size": {"width": 800, "height": 400},
        "cost": {"gems": 1000},
        "unlock_level": 75,
        "decorations_allowed": 50,
        "special": True,
    },
}

DECORATIONS = {
    # Plants
    "seaweed": {"id": "seaweed", "name": "Seaweed", "category": "plant", "cost": {"coins": 100}, "icon": "🌿"},
    "coral_red": {"id": "coral_red", "name": "Red Coral", "category": "plant", "cost": {"coins": 200}, "icon": "🪸"},
    "coral_blue": {"id": "coral_blue", "name": "Blue Coral", "category": "plant", "cost": {"coins": 200}, "icon": "🪸"},
    "lotus": {"id": "lotus", "name": "Lotus Flower", "category": "plant", "cost": {"coins": 300}, "icon": "🪷"},
    "kelp_forest": {"id": "kelp_forest", "name": "Kelp Forest", "category": "plant", "cost": {"gems": 20}, "icon": "🌿"},
    
    # Structures
    "treasure_chest": {"id": "treasure_chest", "name": "Treasure Chest", "category": "structure", "cost": {"coins": 500}, "icon": "📦"},
    "sunken_ship": {"id": "sunken_ship", "name": "Sunken Ship", "category": "structure", "cost": {"gems": 50}, "icon": "🚢"},
    "castle": {"id": "castle", "name": "Underwater Castle", "category": "structure", "cost": {"gems": 75}, "icon": "🏰"},
    "ruins": {"id": "ruins", "name": "Ancient Ruins", "category": "structure", "cost": {"gems": 100}, "icon": "🏛️"},
    "pirate_skull": {"id": "pirate_skull", "name": "Pirate Skull", "category": "structure", "cost": {"coins": 400}, "icon": "💀"},
    
    # Rocks
    "rock_small": {"id": "rock_small", "name": "Small Rock", "category": "rock", "cost": {"coins": 50}, "icon": "🪨"},
    "rock_large": {"id": "rock_large", "name": "Large Rock", "category": "rock", "cost": {"coins": 100}, "icon": "🪨"},
    "crystal_rock": {"id": "crystal_rock", "name": "Crystal Rock", "category": "rock", "cost": {"gems": 30}, "icon": "💎"},
    
    # Animated
    "bubble_maker": {"id": "bubble_maker", "name": "Bubble Maker", "category": "animated", "cost": {"gems": 40}, "icon": "🫧", "animated": True},
    "volcano": {"id": "volcano", "name": "Mini Volcano", "category": "animated", "cost": {"gems": 80}, "icon": "🌋", "animated": True},
    "disco_ball": {"id": "disco_ball", "name": "Disco Ball", "category": "animated", "cost": {"gems": 60}, "icon": "🪩", "animated": True},
    
    # Backgrounds
    "bg_ocean": {"id": "bg_ocean", "name": "Ocean Background", "category": "background", "cost": {"coins": 300}, "icon": "🌊"},
    "bg_reef": {"id": "bg_reef", "name": "Coral Reef Background", "category": "background", "cost": {"gems": 25}, "icon": "🪸"},
    "bg_night": {"id": "bg_night", "name": "Night Ocean Background", "category": "background", "cost": {"gems": 30}, "icon": "🌙"},
    "bg_tropical": {"id": "bg_tropical", "name": "Tropical Background", "category": "background", "cost": {"gems": 35}, "icon": "🏝️"},
}

THEMES = [
    {"id": "ocean", "name": "Ocean Blue", "colors": {"primary": "#0077be", "secondary": "#00a8e8"}},
    {"id": "tropical", "name": "Tropical Paradise", "colors": {"primary": "#00c896", "secondary": "#00e8c2"}},
    {"id": "night", "name": "Deep Night", "colors": {"primary": "#1a1a2e", "secondary": "#16213e"}},
    {"id": "coral", "name": "Coral Reef", "colors": {"primary": "#ff6b6b", "secondary": "#feca57"}},
    {"id": "gold", "name": "Golden", "colors": {"primary": "#ffd700", "secondary": "#ffec8b"}},
]


# ========== REQUEST MODELS ==========

class AddFishToAquariumRequest(BaseModel):
    user_id: str
    fish_id: str
    tank_id: str = "starter"
    position: Optional[Dict[str, int]] = None


class RemoveFishRequest(BaseModel):
    user_id: str
    fish_id: str


class PlaceDecorationRequest(BaseModel):
    user_id: str
    decoration_id: str
    tank_id: str
    position: Dict[str, int]


class PurchaseDecorationRequest(BaseModel):
    user_id: str
    decoration_id: str


class PurchaseTankRequest(BaseModel):
    user_id: str
    tank_id: str


class SetThemeRequest(BaseModel):
    user_id: str
    tank_id: str
    theme_id: str


# ========== HELPER FUNCTIONS ==========

async def get_player_aquarium(user_id: str) -> dict:
    """Get or create player's aquarium data"""
    aquarium = await db.player_aquarium.find_one({"user_id": user_id}, {"_id": 0})
    
    if not aquarium:
        aquarium = {
            "user_id": user_id,
            "tanks": {
                "starter": {
                    "tank_id": "starter",
                    "fish": [],
                    "decorations": [],
                    "theme": "ocean",
                    "background": None,
                }
            },
            "owned_tanks": ["starter"],
            "owned_decorations": [],
            "total_fish_displayed": 0,
            "visitors": 0,
            "likes": 0,
        }
        await db.player_aquarium.insert_one(aquarium)
    
    return aquarium


# ========== AQUARIUM ENDPOINTS ==========

@router.get("/{user_id}")
async def get_aquarium(user_id: str):
    """Get player's aquarium"""
    aquarium = await get_player_aquarium(user_id)
    
    # Enrich with tank info
    tanks = []
    for tank_id, tank_data in aquarium.get("tanks", {}).items():
        tank_config = AQUARIUM_TANKS.get(tank_id, AQUARIUM_TANKS["starter"])
        tanks.append({
            **tank_data,
            "config": tank_config,
            "fish_count": len(tank_data.get("fish", [])),
            "decoration_count": len(tank_data.get("decorations", [])),
        })
    
    return {
        "tanks": tanks,
        "owned_tanks": aquarium.get("owned_tanks", ["starter"]),
        "owned_decorations": aquarium.get("owned_decorations", []),
        "stats": {
            "total_fish": aquarium.get("total_fish_displayed", 0),
            "visitors": aquarium.get("visitors", 0),
            "likes": aquarium.get("likes", 0),
        }
    }


@router.get("/{user_id}/tank/{tank_id}")
async def get_tank(user_id: str, tank_id: str):
    """Get specific tank details"""
    aquarium = await get_player_aquarium(user_id)
    
    tank = aquarium.get("tanks", {}).get(tank_id)
    if not tank:
        raise HTTPException(status_code=404, detail="Tank not found")
    
    tank_config = AQUARIUM_TANKS.get(tank_id, AQUARIUM_TANKS["starter"])
    
    return {
        **tank,
        "config": tank_config,
    }


@router.get("/tanks/available")
async def get_available_tanks():
    """Get all tank types"""
    return {"tanks": list(AQUARIUM_TANKS.values())}


@router.get("/decorations/available")
async def get_available_decorations():
    """Get all decorations"""
    categories = {}
    for dec_id, dec_data in DECORATIONS.items():
        cat = dec_data["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(dec_data)
    
    return {"decorations": DECORATIONS, "categories": categories}


@router.get("/themes")
async def get_themes():
    """Get all themes"""
    return {"themes": THEMES}


@router.post("/fish/add")
async def add_fish_to_aquarium(request: AddFishToAquariumRequest):
    """Add a fish from tacklebox to aquarium"""
    aquarium = await get_player_aquarium(request.user_id)
    
    # Check tank ownership
    if request.tank_id not in aquarium.get("owned_tanks", ["starter"]):
        raise HTTPException(status_code=400, detail="You don't own this tank")
    
    tank = aquarium.get("tanks", {}).get(request.tank_id)
    if not tank:
        raise HTTPException(status_code=404, detail="Tank not found")
    
    tank_config = AQUARIUM_TANKS.get(request.tank_id)
    
    # Check capacity
    if len(tank.get("fish", [])) >= tank_config["capacity"]:
        raise HTTPException(status_code=400, detail="Tank is at capacity")
    
    # Get fish from tacklebox
    fish = await db.tacklebox.find_one({
        "user_id": request.user_id,
        "id": request.fish_id
    }, {"_id": 0})
    
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found in tacklebox")
    
    # Add to aquarium
    aquarium_fish = {
        "id": fish["id"],
        "name": fish.get("name", "Fish"),
        "species": fish.get("name", "Unknown").lower().replace(" ", "_"),
        "size": fish.get("size", 30),
        "color": fish.get("color", "#4A90D9"),
        "traits": fish.get("traits", {}),
        "position": request.position or {"x": random.randint(10, 90), "y": random.randint(10, 90)},
        "added_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.player_aquarium.update_one(
        {"user_id": request.user_id},
        {
            "$push": {f"tanks.{request.tank_id}.fish": aquarium_fish},
            "$inc": {"total_fish_displayed": 1}
        }
    )
    
    # Remove from tacklebox
    await db.tacklebox.delete_one({"id": request.fish_id})
    
    return {"success": True, "fish_added": aquarium_fish}


@router.post("/fish/remove")
async def remove_fish_from_aquarium(request: RemoveFishRequest):
    """Remove a fish from aquarium back to tacklebox"""
    aquarium = await get_player_aquarium(request.user_id)
    
    # Find fish in any tank
    for tank_id, tank_data in aquarium.get("tanks", {}).items():
        for i, fish in enumerate(tank_data.get("fish", [])):
            if fish["id"] == request.fish_id:
                # Return to tacklebox
                fish_data = {
                    "id": fish["id"],
                    "user_id": request.user_id,
                    "name": fish.get("name", "Fish"),
                    "size": fish.get("size", 30),
                    "color": fish.get("color", "#4A90D9"),
                    "traits": fish.get("traits", {}),
                    "returned_from_aquarium": True,
                }
                await db.tacklebox.insert_one(fish_data)
                
                # Remove from tank
                await db.player_aquarium.update_one(
                    {"user_id": request.user_id},
                    {
                        "$pull": {f"tanks.{tank_id}.fish": {"id": request.fish_id}},
                        "$inc": {"total_fish_displayed": -1}
                    }
                )
                
                return {"success": True, "tank_id": tank_id}
    
    raise HTTPException(status_code=404, detail="Fish not found in aquarium")


@router.post("/decoration/purchase")
async def purchase_decoration(request: PurchaseDecorationRequest):
    """Purchase a decoration"""
    decoration = DECORATIONS.get(request.decoration_id)
    if not decoration:
        raise HTTPException(status_code=404, detail="Decoration not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check cost
    for currency, amount in decoration["cost"].items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct cost
    update_ops = {"$inc": {}}
    for currency, amount in decoration["cost"].items():
        update_ops["$inc"][currency] = -amount
    await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Add to owned decorations
    await db.player_aquarium.update_one(
        {"user_id": request.user_id},
        {"$push": {"owned_decorations": request.decoration_id}},
        upsert=True
    )
    
    return {"success": True, "decoration": decoration}


@router.post("/decoration/place")
async def place_decoration(request: PlaceDecorationRequest):
    """Place a decoration in a tank"""
    aquarium = await get_player_aquarium(request.user_id)
    
    # Check ownership
    if request.decoration_id not in aquarium.get("owned_decorations", []):
        raise HTTPException(status_code=400, detail="You don't own this decoration")
    
    tank = aquarium.get("tanks", {}).get(request.tank_id)
    if not tank:
        raise HTTPException(status_code=404, detail="Tank not found")
    
    tank_config = AQUARIUM_TANKS.get(request.tank_id)
    
    # Check decoration limit
    if len(tank.get("decorations", [])) >= tank_config["decorations_allowed"]:
        raise HTTPException(status_code=400, detail="Maximum decorations reached")
    
    decoration = DECORATIONS.get(request.decoration_id)
    
    placed_decoration = {
        "id": str(uuid.uuid4()),
        "decoration_id": request.decoration_id,
        "name": decoration["name"],
        "icon": decoration["icon"],
        "position": request.position,
        "placed_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.player_aquarium.update_one(
        {"user_id": request.user_id},
        {"$push": {f"tanks.{request.tank_id}.decorations": placed_decoration}}
    )
    
    # Remove from inventory (use one)
    await db.player_aquarium.update_one(
        {"user_id": request.user_id},
        {"$pull": {"owned_decorations": request.decoration_id}}
    )
    
    return {"success": True, "placed": placed_decoration}


@router.post("/tank/purchase")
async def purchase_tank(request: PurchaseTankRequest):
    """Purchase a new tank"""
    tank_config = AQUARIUM_TANKS.get(request.tank_id)
    if not tank_config:
        raise HTTPException(status_code=404, detail="Tank not found")
    
    aquarium = await get_player_aquarium(request.user_id)
    
    if request.tank_id in aquarium.get("owned_tanks", []):
        raise HTTPException(status_code=400, detail="Already owned")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    
    # Check level
    if user.get("level", 1) < tank_config["unlock_level"]:
        raise HTTPException(status_code=400, detail=f"Requires level {tank_config['unlock_level']}")
    
    # Check cost
    for currency, amount in tank_config.get("cost", {}).items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct cost
    if tank_config.get("cost"):
        update_ops = {"$inc": {}}
        for currency, amount in tank_config["cost"].items():
            update_ops["$inc"][currency] = -amount
        await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Add tank
    new_tank = {
        "tank_id": request.tank_id,
        "fish": [],
        "decorations": [],
        "theme": "ocean",
        "background": None,
    }
    
    await db.player_aquarium.update_one(
        {"user_id": request.user_id},
        {
            "$push": {"owned_tanks": request.tank_id},
            "$set": {f"tanks.{request.tank_id}": new_tank}
        }
    )
    
    return {"success": True, "tank": tank_config}


@router.post("/tank/set-theme")
async def set_tank_theme(request: SetThemeRequest):
    """Set tank theme"""
    aquarium = await get_player_aquarium(request.user_id)
    
    if request.tank_id not in aquarium.get("owned_tanks", []):
        raise HTTPException(status_code=400, detail="Tank not owned")
    
    theme = next((t for t in THEMES if t["id"] == request.theme_id), None)
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    await db.player_aquarium.update_one(
        {"user_id": request.user_id},
        {"$set": {f"tanks.{request.tank_id}.theme": request.theme_id}}
    )
    
    return {"success": True, "theme": theme}


@router.post("/visit/{owner_id}")
async def visit_aquarium(owner_id: str, visitor_id: str):
    """Visit someone's aquarium"""
    await db.player_aquarium.update_one(
        {"user_id": owner_id},
        {"$inc": {"visitors": 1}}
    )
    
    # Log visit
    await db.aquarium_visits.insert_one({
        "owner_id": owner_id,
        "visitor_id": visitor_id,
        "visited_at": datetime.now(timezone.utc).isoformat(),
    })
    
    return {"success": True}


@router.post("/like/{owner_id}")
async def like_aquarium(owner_id: str, liker_id: str):
    """Like someone's aquarium"""
    # Check if already liked today
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    existing = await db.aquarium_likes.find_one({
        "owner_id": owner_id,
        "liker_id": liker_id,
        "date": today
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Already liked today")
    
    await db.player_aquarium.update_one(
        {"user_id": owner_id},
        {"$inc": {"likes": 1}}
    )
    
    await db.aquarium_likes.insert_one({
        "owner_id": owner_id,
        "liker_id": liker_id,
        "date": today,
        "liked_at": datetime.now(timezone.utc).isoformat(),
    })
    
    return {"success": True}
