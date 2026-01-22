"""
Game World Map System
Features:
- Full game world map
- Discovered locations tracking
- Navigation routes
- Points of interest
- Region information
- Random island generation
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random
import math

router = APIRouter(prefix="/api/map", tags=["map"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# WORLD MAP CONFIGURATION
# ============================================================================

WORLD_SIZE = {"width": 10000, "height": 8000}  # Virtual units

# ============================================================================
# REGIONS
# ============================================================================

REGIONS = [
    {
        "id": "barnacle_bay",
        "name": "Barnacle Bay",
        "description": "The starting region. Safe, calm waters perfect for learning.",
        "difficulty": 1,
        "theme": "coastal",
        "color": "#4a90d9",
        "bounds": {"x": 0, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(1, 11)),
        "weather_patterns": ["clear", "cloudy", "light_rain"],
        "fish_types": ["common", "uncommon"],
        "dangers": [],
        "points_of_interest": [
            {"id": "starting_dock", "name": "Starting Dock", "type": "port", "x": 100, "y": 400},
            {"id": "barnacle_bills_spot", "name": "Barnacle Bill's Spot", "type": "fishing_spot", "x": 300, "y": 300},
            {"id": "lighthouse_point", "name": "Lighthouse Point", "type": "landmark", "x": 800, "y": 200}
        ]
    },
    {
        "id": "coral_reef_waters",
        "name": "Coral Reef Waters",
        "description": "Beautiful but treacherous coral formations. Rich fishing grounds.",
        "difficulty": 2,
        "theme": "reef",
        "color": "#ff6b9d",
        "bounds": {"x": 1000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(11, 21)),
        "weather_patterns": ["clear", "tropical_storm"],
        "fish_types": ["common", "uncommon", "rare"],
        "dangers": ["sharp_coral", "strong_currents"],
        "points_of_interest": [
            {"id": "coral_city", "name": "Coral City", "type": "city", "x": 1500, "y": 400},
            {"id": "queen_coralinas_palace", "name": "Queen Coralina's Reef", "type": "landmark", "x": 1800, "y": 200}
        ]
    },
    {
        "id": "merchant_sea",
        "name": "Merchant Sea",
        "description": "Busy trade routes where merchants and pirates cross paths.",
        "difficulty": 2,
        "theme": "trade",
        "color": "#ffd700",
        "bounds": {"x": 2000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(21, 31)),
        "weather_patterns": ["clear", "cloudy", "fog"],
        "fish_types": ["common", "uncommon", "rare"],
        "dangers": ["pirates", "naval_patrols"],
        "points_of_interest": [
            {"id": "port_prosperity", "name": "Port Prosperity", "type": "city", "x": 2500, "y": 400},
            {"id": "merchants_crossing", "name": "Merchant's Crossing", "type": "trade_hub", "x": 2200, "y": 600}
        ]
    },
    {
        "id": "storm_straits",
        "name": "Storm Straits",
        "description": "Perpetually stormy waters. Only the brave sail here.",
        "difficulty": 3,
        "theme": "stormy",
        "color": "#4a4a6a",
        "bounds": {"x": 3000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(31, 41)),
        "weather_patterns": ["storm", "heavy_storm", "hurricane"],
        "fish_types": ["uncommon", "rare", "storm_fish"],
        "dangers": ["storms", "lightning", "whirlpools"],
        "points_of_interest": [
            {"id": "stormwatch_fort", "name": "Stormwatch Fort", "type": "fortress", "x": 3500, "y": 300},
            {"id": "eye_of_calm", "name": "Eye of Calm", "type": "safe_haven", "x": 3700, "y": 500}
        ]
    },
    {
        "id": "pirates_passage",
        "name": "Pirate's Passage",
        "description": "Lawless waters ruled by pirates. High risk, high reward.",
        "difficulty": 3,
        "theme": "danger",
        "color": "#8b0000",
        "bounds": {"x": 4000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(41, 51)),
        "weather_patterns": ["clear", "fog", "storm"],
        "fish_types": ["uncommon", "rare", "pirate_treasures"],
        "dangers": ["pirates", "ambush", "treachery"],
        "points_of_interest": [
            {"id": "skull_island", "name": "Skull Island", "type": "pirate_haven", "x": 4300, "y": 400},
            {"id": "black_flag_bay", "name": "Black Flag Bay", "type": "pirate_haven", "x": 4700, "y": 200},
            {"id": "smugglers_cove", "name": "Smuggler's Cove", "type": "secret", "x": 4500, "y": 700}
        ]
    },
    {
        "id": "deep_blue",
        "name": "The Deep Blue",
        "description": "Open ocean with extreme depths. Home to strange creatures.",
        "difficulty": 4,
        "theme": "deep",
        "color": "#000080",
        "bounds": {"x": 5000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(51, 61)),
        "weather_patterns": ["calm", "rolling_swells"],
        "fish_types": ["rare", "epic", "deep_sea"],
        "dangers": ["sea_monsters", "pressure", "isolation"],
        "points_of_interest": [
            {"id": "mariana_monarchy", "name": "Mariana Monarchy", "type": "underwater_kingdom", "x": 5500, "y": 600},
            {"id": "the_abyss_edge", "name": "The Abyss Edge", "type": "danger_zone", "x": 5800, "y": 300}
        ]
    },
    {
        "id": "volcanic_waters",
        "name": "Volcanic Waters",
        "description": "Waters heated by underwater volcanoes. Unique fish found here.",
        "difficulty": 4,
        "theme": "volcanic",
        "color": "#ff4500",
        "bounds": {"x": 6000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(61, 71)),
        "weather_patterns": ["hot", "ash_fall", "eruption"],
        "fish_types": ["rare", "epic", "fire_fish"],
        "dangers": ["volcanic_eruption", "boiling_water", "toxic_gas"],
        "points_of_interest": [
            {"id": "vulcanus_throne", "name": "Vulcanus's Throne", "type": "legendary", "x": 6500, "y": 400},
            {"id": "obsidian_port", "name": "Obsidian Port", "type": "port", "x": 6200, "y": 600}
        ]
    },
    {
        "id": "ghost_seas",
        "name": "Ghost Seas",
        "description": "Haunted waters where reality bends. Not all ships return.",
        "difficulty": 5,
        "theme": "haunted",
        "color": "#800080",
        "bounds": {"x": 7000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(71, 81)),
        "weather_patterns": ["fog", "unnatural_calm", "spectral_storm"],
        "fish_types": ["epic", "legendary", "ghost_fish"],
        "dangers": ["ghost_ships", "spirit_possession", "reality_warps"],
        "points_of_interest": [
            {"id": "spirit_waters", "name": "Spirit Waters", "type": "mystical", "x": 7500, "y": 400},
            {"id": "phantom_fleet", "name": "Phantom Fleet", "type": "ghost_ships", "x": 7300, "y": 200},
            {"id": "veil_crossing", "name": "Veil Crossing", "type": "portal", "x": 7800, "y": 600}
        ]
    },
    {
        "id": "abyssal_depths",
        "name": "Abyssal Depths",
        "description": "The deepest, darkest waters. Ancient things dwell here.",
        "difficulty": 5,
        "theme": "abyss",
        "color": "#1a1a2e",
        "bounds": {"x": 8000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(81, 91)),
        "weather_patterns": ["eternal_dark", "bioluminescence"],
        "fish_types": ["epic", "legendary", "abyssal"],
        "dangers": ["legendary_beasts", "crushing_pressure", "madness"],
        "points_of_interest": [
            {"id": "leviathan_lair", "name": "Leviathan's Lair", "type": "legendary", "x": 8500, "y": 400},
            {"id": "ancient_temple", "name": "Ancient Temple", "type": "ruins", "x": 8200, "y": 700}
        ]
    },
    {
        "id": "the_beyond",
        "name": "The Beyond",
        "description": "Waters beyond the known world. Only legends speak of what lies here.",
        "difficulty": 6,
        "theme": "legendary",
        "color": "#ffd700",
        "bounds": {"x": 9000, "y": 0, "width": 1000, "height": 800},
        "stages": list(range(91, 101)),
        "weather_patterns": ["cosmic", "reality_shift"],
        "fish_types": ["legendary", "mythic"],
        "dangers": ["reality_warps", "legendary_beasts", "unknown"],
        "points_of_interest": [
            {"id": "world_fish_domain", "name": "World Fish Domain", "type": "legendary", "x": 9500, "y": 400},
            {"id": "edge_of_existence", "name": "Edge of Existence", "type": "boundary", "x": 9900, "y": 400}
        ]
    }
]

# ============================================================================
# RANDOM ISLAND GENERATOR
# ============================================================================

ISLAND_NAMES_PREFIX = [
    "Mystery", "Lost", "Hidden", "Forgotten", "Ancient", "Sacred", "Wild",
    "Sunken", "Floating", "Drifting", "Lonely", "Twin", "Coral", "Pearl",
    "Golden", "Silver", "Crystal", "Emerald", "Ruby", "Sapphire"
]

ISLAND_NAMES_SUFFIX = [
    "Isle", "Atoll", "Cay", "Key", "Rock", "Shoal", "Reef", "Bank",
    "Island", "Haven", "Refuge", "Sanctuary", "Paradise", "Retreat"
]

ISLAND_FEATURES = [
    "pristine beaches", "dense jungle", "rocky cliffs", "volcanic crater",
    "freshwater spring", "ancient ruins", "mysterious cave", "abandoned camp",
    "rare flower fields", "crystal caves", "hot springs", "tide pools"
]

ISLAND_FISH_TYPES = [
    "beach_dwellers", "reef_fish", "tropical_fish", "rare_specimens",
    "legendary_variants", "unique_species"
]

def generate_random_island(region_id: str, user_id: str) -> Dict:
    """Generate a random island for discovery"""
    region = next((r for r in REGIONS if r["id"] == region_id), None)
    if not region:
        region = REGIONS[0]
    
    # Generate name
    name = f"{random.choice(ISLAND_NAMES_PREFIX)} {random.choice(ISLAND_NAMES_SUFFIX)}"
    
    # Generate position within region
    bounds = region["bounds"]
    x = random.randint(bounds["x"], bounds["x"] + bounds["width"])
    y = random.randint(bounds["y"], bounds["y"] + bounds["height"])
    
    # Generate features
    num_features = random.randint(1, 3)
    features = random.sample(ISLAND_FEATURES, num_features)
    
    # Generate fish types
    fish_types = random.sample(ISLAND_FISH_TYPES, random.randint(1, 3))
    
    # Rare fish chance based on region difficulty
    rare_fish_chance = 0.05 * region["difficulty"]
    
    island = {
        "id": str(uuid.uuid4()),
        "name": name,
        "region": region_id,
        "position": {"x": x, "y": y},
        "size": random.choice(["tiny", "small", "medium", "large"]),
        "features": features,
        "description": f"A {random.choice(['mysterious', 'beautiful', 'rugged', 'peaceful'])} island with {', '.join(features)}.",
        "fish_types": fish_types,
        "rare_fish_chance": rare_fish_chance,
        "discovered_by": user_id,
        "discovered_at": datetime.now(timezone.utc).isoformat(),
        "has_beach_fishing": True,
        "has_secrets": random.random() < 0.3,
        "danger_level": region["difficulty"]
    }
    
    return island

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class DiscoveredLocation(BaseModel):
    user_id: str
    location_id: str
    location_type: str
    discovered_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    times_visited: int = 1
    fish_caught_here: int = 0
    notes: str = ""

class NavigationRoute(BaseModel):
    route_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    waypoints: List[Dict]
    total_distance: float
    estimated_time: int  # minutes
    dangers_on_route: List[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ============================================================================
# API ROUTES
# ============================================================================

@router.get("/world")
async def get_world_map():
    """Get the complete world map"""
    return {
        "world_size": WORLD_SIZE,
        "regions": REGIONS,
        "total_regions": len(REGIONS)
    }

@router.get("/regions")
async def get_all_regions():
    """Get all regions"""
    return {"regions": REGIONS}

@router.get("/regions/{region_id}")
async def get_region(region_id: str):
    """Get a specific region"""
    region = next((r for r in REGIONS if r["id"] == region_id), None)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region

@router.get("/user/{user_id}/discovered")
async def get_discovered_locations(user_id: str):
    """Get all locations discovered by user"""
    discovered = await db.discovered_locations.find(
        {"user_id": user_id},
        {"_id": 0}
    ).to_list(1000)
    
    return {"locations": discovered, "total": len(discovered)}

@router.get("/user/{user_id}/fog-of-war")
async def get_fog_of_war(user_id: str):
    """Get user's explored/unexplored areas"""
    discovered = await db.discovered_locations.find(
        {"user_id": user_id},
        {"_id": 0, "location_id": 1}
    ).to_list(1000)
    
    discovered_ids = [d["location_id"] for d in discovered]
    
    # All possible locations
    all_locations = []
    for region in REGIONS:
        for poi in region.get("points_of_interest", []):
            all_locations.append({
                "id": poi["id"],
                "region": region["id"],
                "discovered": poi["id"] in discovered_ids
            })
    
    discovered_count = len([l for l in all_locations if l["discovered"]])
    total_count = len(all_locations)
    
    return {
        "locations": all_locations,
        "discovered_count": discovered_count,
        "total_count": total_count,
        "exploration_percentage": round(discovered_count / total_count * 100, 1) if total_count > 0 else 0
    }

@router.post("/discover")
async def discover_location(location: DiscoveredLocation):
    """Record a newly discovered location"""
    existing = await db.discovered_locations.find_one(
        {"user_id": location.user_id, "location_id": location.location_id}
    )
    
    if existing:
        # Update visit count
        await db.discovered_locations.update_one(
            {"user_id": location.user_id, "location_id": location.location_id},
            {"$inc": {"times_visited": 1}}
        )
        return {"message": "Location visited again", "first_discovery": False}
    
    await db.discovered_locations.insert_one(location.model_dump())
    return {"message": "New location discovered!", "first_discovery": True}

@router.post("/random-island/{region_id}")
async def discover_random_island(region_id: str, user_id: str):
    """Generate and discover a random island"""
    island = generate_random_island(region_id, user_id)
    
    # Save island
    await db.random_islands.insert_one(island)
    
    # Record discovery
    discovery = DiscoveredLocation(
        user_id=user_id,
        location_id=island["id"],
        location_type="random_island"
    )
    await db.discovered_locations.insert_one(discovery.model_dump())
    
    return {
        "discovered": True,
        "island": island,
        "message": f"You've discovered {island['name']}!"
    }

@router.get("/user/{user_id}/islands")
async def get_user_discovered_islands(user_id: str):
    """Get all random islands discovered by user"""
    islands = await db.random_islands.find(
        {"discovered_by": user_id},
        {"_id": 0}
    ).to_list(100)
    
    return {"islands": islands, "total": len(islands)}

@router.post("/route/create")
async def create_navigation_route(route: NavigationRoute):
    """Create a saved navigation route"""
    await db.navigation_routes.insert_one(route.model_dump())
    return {"message": "Route saved", "route_id": route.route_id}

@router.get("/user/{user_id}/routes")
async def get_user_routes(user_id: str):
    """Get user's saved routes"""
    routes = await db.navigation_routes.find(
        {"user_id": user_id},
        {"_id": 0}
    ).to_list(50)
    
    return {"routes": routes}

@router.get("/calculate-route")
async def calculate_route(start_x: int, start_y: int, end_x: int, end_y: int):
    """Calculate optimal route between two points"""
    distance = math.sqrt((end_x - start_x)**2 + (end_y - start_y)**2)
    
    # Estimate time (100 units per minute average)
    estimated_time = int(distance / 100)
    
    # Find dangers along route
    dangers = []
    for region in REGIONS:
        bounds = region["bounds"]
        # Simple check if route passes through region
        if (bounds["x"] <= max(start_x, end_x) and 
            bounds["x"] + bounds["width"] >= min(start_x, end_x)):
            dangers.extend(region.get("dangers", []))
    
    return {
        "distance": round(distance, 2),
        "estimated_time_minutes": estimated_time,
        "dangers_on_route": list(set(dangers)),
        "recommended_supplies": calculate_supplies_needed(estimated_time)
    }

def calculate_supplies_needed(time_minutes: int) -> Dict:
    """Calculate supplies needed for a voyage"""
    hours = time_minutes / 60
    return {
        "food": max(1, int(hours * 2)),
        "water": max(1, int(hours * 3)),
        "recommended_rum": max(0, int(hours - 2)),
        "recommended_oranges": max(0, int(hours / 2))
    }

@router.get("/points-of-interest/{region_id}")
async def get_points_of_interest(region_id: str):
    """Get all points of interest in a region"""
    region = next((r for r in REGIONS if r["id"] == region_id), None)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    return {"points_of_interest": region.get("points_of_interest", [])}

@router.get("/search")
async def search_locations(query: str):
    """Search for locations by name"""
    results = []
    query_lower = query.lower()
    
    for region in REGIONS:
        if query_lower in region["name"].lower():
            results.append({"type": "region", "data": region})
        
        for poi in region.get("points_of_interest", []):
            if query_lower in poi["name"].lower():
                results.append({"type": "poi", "region": region["id"], "data": poi})
    
    return {"results": results, "count": len(results)}
