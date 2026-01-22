# ========== GO FISH! FISH ENCYCLOPEDIA & COLLECTION API ==========
# Complete fish database, collection tracking, and fish info
# ~400+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
import os

router = APIRouter(prefix="/api/encyclopedia", tags=["encyclopedia"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== COMPLETE FISH DATABASE ==========

FISH_DATABASE = {
    # Common Fish (Level 1-10)
    "minnow": {
        "id": "minnow",
        "name": "Minnow",
        "scientific_name": "Phoxinus phoxinus",
        "description": "A tiny but spirited fish, perfect for beginners.",
        "rarity": "common",
        "habitat": ["pond", "river"],
        "size_range": {"min": 5, "max": 15},
        "base_value": 10,
        "xp_reward": 5,
        "discovery_level": 1,
        "icon": "🐟",
        "color": "#87CEEB",
        "behavior": "schools",
        "best_bait": ["worm", "bread_crumb"],
        "best_time": "any",
        "facts": [
            "Minnows are often used as bait by larger fish hunters",
            "They can live in both fresh and brackish water",
            "A school of minnows can contain thousands of fish"
        ],
    },
    "perch": {
        "id": "perch",
        "name": "Perch",
        "scientific_name": "Perca fluviatilis",
        "description": "A striped beauty with a fierce appetite.",
        "rarity": "common",
        "habitat": ["pond", "river", "lake"],
        "size_range": {"min": 15, "max": 35},
        "base_value": 25,
        "xp_reward": 10,
        "discovery_level": 1,
        "icon": "🐟",
        "color": "#FFD700",
        "behavior": "predator",
        "best_bait": ["worm", "minnow_bait"],
        "best_time": "dawn",
        "facts": [
            "Perch have distinctive vertical stripes",
            "They're known for their aggressive strikes",
            "Perch are excellent eating fish"
        ],
    },
    "bass": {
        "id": "bass",
        "name": "Largemouth Bass",
        "scientific_name": "Micropterus salmoides",
        "description": "The king of freshwater game fish.",
        "rarity": "common",
        "habitat": ["pond", "river", "lake"],
        "size_range": {"min": 20, "max": 60},
        "base_value": 40,
        "xp_reward": 15,
        "discovery_level": 3,
        "icon": "🐟",
        "color": "#228B22",
        "behavior": "ambush_predator",
        "best_bait": ["minnow_bait", "night_crawler"],
        "best_time": "morning",
        "facts": [
            "Bass can detect prey using their lateral line",
            "They prefer hiding near structures",
            "A largemouth bass can live up to 16 years"
        ],
    },
    "catfish": {
        "id": "catfish",
        "name": "Channel Catfish",
        "scientific_name": "Ictalurus punctatus",
        "description": "A whiskered bottom-dweller with a big appetite.",
        "rarity": "uncommon",
        "habitat": ["river", "lake"],
        "size_range": {"min": 30, "max": 80},
        "base_value": 80,
        "xp_reward": 25,
        "discovery_level": 8,
        "icon": "🐱",
        "color": "#708090",
        "behavior": "bottom_feeder",
        "best_bait": ["night_crawler", "stink_bait"],
        "best_time": "night",
        "facts": [
            "Catfish have over 100,000 taste buds",
            "They can taste with their entire body",
            "Some catfish can breathe through their skin"
        ],
    },
    
    # Uncommon Fish (Level 10-25)
    "pike": {
        "id": "pike",
        "name": "Northern Pike",
        "scientific_name": "Esox lucius",
        "description": "A fierce predator with razor-sharp teeth.",
        "rarity": "uncommon",
        "habitat": ["river", "lake"],
        "size_range": {"min": 50, "max": 120},
        "base_value": 120,
        "xp_reward": 35,
        "discovery_level": 12,
        "icon": "🐊",
        "color": "#2F4F4F",
        "behavior": "apex_predator",
        "best_bait": ["minnow_bait", "spinner_lure"],
        "best_time": "dawn",
        "facts": [
            "Pike can accelerate to 25 mph in a single burst",
            "They've been known to attack ducks and small mammals",
            "Pike can live for over 25 years"
        ],
    },
    "carp": {
        "id": "carp",
        "name": "Common Carp",
        "scientific_name": "Cyprinus carpio",
        "description": "A hardy fish that can grow to impressive sizes.",
        "rarity": "uncommon",
        "habitat": ["pond", "river", "lake"],
        "size_range": {"min": 40, "max": 100},
        "base_value": 60,
        "xp_reward": 30,
        "discovery_level": 10,
        "icon": "🐟",
        "color": "#CD853F",
        "behavior": "bottom_feeder",
        "best_bait": ["corn", "bread"],
        "best_time": "afternoon",
        "facts": [
            "Carp have been domesticated for over 2,000 years",
            "They can survive in low-oxygen water",
            "Carp are considered invasive in many regions"
        ],
    },
    "trout": {
        "id": "trout",
        "name": "Rainbow Trout",
        "scientific_name": "Oncorhynchus mykiss",
        "description": "A beautiful fish with iridescent scales.",
        "rarity": "uncommon",
        "habitat": ["river"],
        "size_range": {"min": 25, "max": 70},
        "base_value": 100,
        "xp_reward": 40,
        "discovery_level": 15,
        "icon": "🌈",
        "color": "#FF69B4",
        "behavior": "surface_feeder",
        "best_bait": ["fly", "night_crawler"],
        "best_time": "morning",
        "facts": [
            "Rainbow trout get their color from their diet",
            "They can jump up to 6 feet out of the water",
            "Native to cold-water tributaries of the Pacific"
        ],
    },
    
    # Rare Fish (Level 25-50)
    "koi": {
        "id": "koi",
        "name": "Koi",
        "scientific_name": "Cyprinus rubrofuscus",
        "description": "An ornamental carp with stunning patterns.",
        "rarity": "rare",
        "habitat": ["pond", "lake"],
        "size_range": {"min": 40, "max": 90},
        "base_value": 200,
        "xp_reward": 75,
        "discovery_level": 20,
        "icon": "🎏",
        "color": "#FF6347",
        "behavior": "social",
        "best_bait": ["premium_bait", "golden_bait"],
        "best_time": "any",
        "facts": [
            "Koi can live for over 200 years",
            "The most expensive koi sold for $1.8 million",
            "Koi recognize their owners and can be trained"
        ],
    },
    "muskie": {
        "id": "muskie",
        "name": "Muskellunge",
        "scientific_name": "Esox masquinongy",
        "description": "The 'fish of 10,000 casts' - a legendary challenge.",
        "rarity": "rare",
        "habitat": ["lake"],
        "size_range": {"min": 80, "max": 150},
        "base_value": 180,
        "xp_reward": 80,
        "discovery_level": 25,
        "icon": "🐊",
        "color": "#006400",
        "behavior": "apex_predator",
        "best_bait": ["large_lure", "live_bait"],
        "best_time": "dawn",
        "facts": [
            "Muskies are the largest member of the pike family",
            "They're called 'the fish of 10,000 casts' due to difficulty",
            "Can grow over 50 pounds"
        ],
    },
    "sturgeon": {
        "id": "sturgeon",
        "name": "Lake Sturgeon",
        "scientific_name": "Acipenser fulvescens",
        "description": "An ancient fish that predates the dinosaurs.",
        "rarity": "rare",
        "habitat": ["lake", "river"],
        "size_range": {"min": 100, "max": 200},
        "base_value": 250,
        "xp_reward": 100,
        "discovery_level": 30,
        "icon": "🐋",
        "color": "#696969",
        "behavior": "bottom_feeder",
        "best_bait": ["worm", "crayfish"],
        "best_time": "night",
        "facts": [
            "Sturgeon can live for over 100 years",
            "They have existed for 200 million years",
            "Their eggs are harvested as caviar"
        ],
    },
    
    # Epic Fish (Level 50-75)
    "marlin": {
        "id": "marlin",
        "name": "Blue Marlin",
        "scientific_name": "Makaira nigricans",
        "description": "The ultimate big game fish.",
        "rarity": "epic",
        "habitat": ["ocean"],
        "size_range": {"min": 200, "max": 500},
        "base_value": 400,
        "xp_reward": 150,
        "discovery_level": 45,
        "icon": "⚔️",
        "color": "#0000CD",
        "behavior": "pelagic_predator",
        "best_bait": ["trolling_lure", "live_fish"],
        "best_time": "morning",
        "facts": [
            "Marlin can swim up to 80 mph",
            "They can dive to depths of 1,800 feet",
            "Featured in Hemingway's 'The Old Man and the Sea'"
        ],
    },
    "giant_squid": {
        "id": "giant_squid",
        "name": "Giant Squid",
        "scientific_name": "Architeuthis dux",
        "description": "A mysterious deep-sea creature of legend.",
        "rarity": "epic",
        "habitat": ["ocean"],
        "size_range": {"min": 300, "max": 600},
        "base_value": 500,
        "xp_reward": 200,
        "discovery_level": 50,
        "icon": "🦑",
        "color": "#8B008B",
        "behavior": "deep_predator",
        "best_bait": ["glowing_lure"],
        "best_time": "night",
        "facts": [
            "Giant squid have the largest eyes in the animal kingdom",
            "They live at depths of 300-1000 meters",
            "First filmed alive in 2004"
        ],
    },
    "oarfish": {
        "id": "oarfish",
        "name": "Giant Oarfish",
        "scientific_name": "Regalecus glesne",
        "description": "The legendary sea serpent revealed.",
        "rarity": "epic",
        "habitat": ["ocean"],
        "size_range": {"min": 400, "max": 1100},
        "base_value": 600,
        "xp_reward": 250,
        "discovery_level": 55,
        "icon": "🐉",
        "color": "#C0C0C0",
        "behavior": "vertical_swimmer",
        "best_bait": ["deep_sea_bait"],
        "best_time": "any",
        "facts": [
            "Oarfish are the longest bony fish in the world",
            "They swim vertically with their head up",
            "Likely the source of sea serpent legends"
        ],
    },
    
    # Legendary Fish (Level 75+)
    "golden_koi": {
        "id": "golden_koi",
        "name": "Golden Emperor Koi",
        "scientific_name": "Cyprinus aureus imperator",
        "description": "A fish of pure gold, said to grant wishes.",
        "rarity": "legendary",
        "habitat": ["secret_pond"],
        "size_range": {"min": 80, "max": 120},
        "base_value": 1000,
        "xp_reward": 500,
        "discovery_level": 60,
        "icon": "👑",
        "color": "#FFD700",
        "behavior": "mystical",
        "best_bait": ["golden_bait"],
        "best_time": "golden_hour",
        "facts": [
            "Only appears when stars align",
            "Scales are worth their weight in gold",
            "Said to bring great fortune to its catcher"
        ],
    },
    "leviathan": {
        "id": "leviathan",
        "name": "The Leviathan",
        "scientific_name": "Unknown",
        "description": "The ancient guardian of the deep.",
        "rarity": "legendary",
        "habitat": ["ocean"],
        "size_range": {"min": 1000, "max": 3000},
        "base_value": 5000,
        "xp_reward": 1000,
        "discovery_level": 75,
        "icon": "🐲",
        "color": "#191970",
        "behavior": "legendary",
        "best_bait": ["legendary_bait"],
        "best_time": "storm",
        "facts": [
            "Only seen once every century",
            "Ancient mariners spoke of its terrible power",
            "Catching one is the ultimate achievement"
        ],
    },
    "ice_dragon": {
        "id": "ice_dragon",
        "name": "Ice Dragon Fish",
        "scientific_name": "Draconis glacialis",
        "description": "A mythical creature from frozen depths.",
        "rarity": "legendary",
        "habitat": ["arctic"],
        "size_range": {"min": 200, "max": 400},
        "base_value": 3000,
        "xp_reward": 750,
        "discovery_level": 70,
        "icon": "❄️🐲",
        "color": "#00FFFF",
        "behavior": "legendary",
        "best_bait": ["ice_bait"],
        "best_time": "winter",
        "facts": [
            "Body temperature is below freezing",
            "Breathes a mist that can freeze prey",
            "Scales never melt, even in warm hands"
        ],
    },
    "phoenix_fish": {
        "id": "phoenix_fish",
        "name": "Phoenix Fish",
        "scientific_name": "Ignis phoenix",
        "description": "A fish born from volcanic flames.",
        "rarity": "legendary",
        "habitat": ["volcano"],
        "size_range": {"min": 150, "max": 300},
        "base_value": 3500,
        "xp_reward": 800,
        "discovery_level": 80,
        "icon": "🔥🐟",
        "color": "#FF4500",
        "behavior": "legendary",
        "best_bait": ["fire_bait"],
        "best_time": "any",
        "facts": [
            "Lives in waters above boiling point",
            "Scales glow with eternal fire",
            "Said to be reborn from its own ashes"
        ],
    },
    "cosmic_whale": {
        "id": "cosmic_whale",
        "name": "Cosmic Whale",
        "scientific_name": "Balaenoptera cosmicus",
        "description": "A being from beyond the stars.",
        "rarity": "legendary",
        "habitat": ["secret_cove"],
        "size_range": {"min": 5000, "max": 10000},
        "base_value": 10000,
        "xp_reward": 2000,
        "discovery_level": 100,
        "icon": "🌌🐋",
        "color": "#4B0082",
        "behavior": "legendary",
        "best_bait": ["cosmic_bait"],
        "best_time": "midnight",
        "facts": [
            "Swims through the void between stars",
            "Body contains entire galaxies",
            "The ultimate legendary catch"
        ],
    },
}


# ========== HELPER FUNCTIONS ==========

async def get_player_collection(user_id: str) -> dict:
    """Get player's fish collection"""
    collection = await db.fish_collection.find_one({"user_id": user_id}, {"_id": 0})
    
    if not collection:
        collection = {
            "user_id": user_id,
            "discovered_fish": [],
            "fish_stats": {},  # {fish_id: {caught: 0, largest: 0, smallest: 0}}
        }
        await db.fish_collection.insert_one(collection)
    
    return collection


# ========== ENCYCLOPEDIA ENDPOINTS ==========

@router.get("/fish")
async def get_all_fish(rarity: Optional[str] = None, habitat: Optional[str] = None):
    """Get all fish in the encyclopedia"""
    fish = list(FISH_DATABASE.values())
    
    if rarity:
        fish = [f for f in fish if f["rarity"] == rarity]
    
    if habitat:
        fish = [f for f in fish if habitat in f["habitat"]]
    
    return {"fish": fish, "total": len(fish)}


@router.get("/fish/{fish_id}")
async def get_fish_details(fish_id: str):
    """Get detailed info about a specific fish"""
    fish = FISH_DATABASE.get(fish_id)
    
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")
    
    return {"fish": fish}


@router.get("/collection/{user_id}")
async def get_user_collection(user_id: str):
    """Get player's fish collection progress"""
    collection = await get_player_collection(user_id)
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
    user_level = user.get("level", 1) if user else 1
    
    # Build collection with discovery status
    fish_list = []
    
    for fish_id, fish_data in FISH_DATABASE.items():
        fish_copy = dict(fish_data)
        fish_copy["discovered"] = fish_id in collection.get("discovered_fish", [])
        fish_copy["stats"] = collection.get("fish_stats", {}).get(fish_id, {})
        fish_copy["can_discover"] = user_level >= fish_data["discovery_level"]
        
        # Hide undiscovered fish details
        if not fish_copy["discovered"]:
            fish_copy["description"] = "???"
            fish_copy["facts"] = []
            if not fish_copy["can_discover"]:
                fish_copy["name"] = "???"
        
        fish_list.append(fish_copy)
    
    # Calculate collection stats
    total = len(FISH_DATABASE)
    discovered = len(collection.get("discovered_fish", []))
    
    by_rarity = {"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}
    by_rarity_discovered = {"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}
    
    for fish_id, fish_data in FISH_DATABASE.items():
        rarity = fish_data["rarity"]
        by_rarity[rarity] += 1
        if fish_id in collection.get("discovered_fish", []):
            by_rarity_discovered[rarity] += 1
    
    return {
        "collection": fish_list,
        "stats": {
            "total": total,
            "discovered": discovered,
            "completion_percent": round((discovered / total) * 100, 1),
            "by_rarity": by_rarity,
            "by_rarity_discovered": by_rarity_discovered,
        }
    }


@router.post("/discover/{user_id}/{fish_id}")
async def discover_fish(user_id: str, fish_id: str, size: int = 50):
    """Record discovering a new fish"""
    fish = FISH_DATABASE.get(fish_id)
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")
    
    collection = await get_player_collection(user_id)
    
    is_new_discovery = fish_id not in collection.get("discovered_fish", [])
    
    # Update fish stats
    fish_stats = collection.get("fish_stats", {}).get(fish_id, {
        "caught": 0,
        "largest": 0,
        "smallest": 9999,
        "first_caught": None,
    })
    
    fish_stats["caught"] += 1
    fish_stats["largest"] = max(fish_stats["largest"], size)
    fish_stats["smallest"] = min(fish_stats["smallest"], size)
    
    if is_new_discovery:
        fish_stats["first_caught"] = datetime.now(timezone.utc).isoformat()
        
        await db.fish_collection.update_one(
            {"user_id": user_id},
            {
                "$addToSet": {"discovered_fish": fish_id},
                "$set": {f"fish_stats.{fish_id}": fish_stats}
            },
            upsert=True
        )
    else:
        await db.fish_collection.update_one(
            {"user_id": user_id},
            {"$set": {f"fish_stats.{fish_id}": fish_stats}},
            upsert=True
        )
    
    return {
        "success": True,
        "is_new_discovery": is_new_discovery,
        "fish": fish if is_new_discovery else None,
        "stats": fish_stats,
    }


@router.get("/habitats")
async def get_habitats():
    """Get all fishing habitats"""
    habitats = set()
    for fish in FISH_DATABASE.values():
        habitats.update(fish["habitat"])
    
    return {"habitats": list(habitats)}


@router.get("/rarities")
async def get_rarities():
    """Get all rarity levels with counts"""
    rarities = {}
    for fish in FISH_DATABASE.values():
        rarity = fish["rarity"]
        if rarity not in rarities:
            rarities[rarity] = {"name": rarity, "count": 0, "fish": []}
        rarities[rarity]["count"] += 1
        rarities[rarity]["fish"].append(fish["id"])
    
    return {"rarities": rarities}


@router.get("/search")
async def search_fish(query: str):
    """Search fish by name or description"""
    query = query.lower()
    results = []
    
    for fish in FISH_DATABASE.values():
        if (query in fish["name"].lower() or 
            query in fish["description"].lower() or
            query in fish.get("scientific_name", "").lower()):
            results.append(fish)
    
    return {"results": results, "count": len(results)}


@router.get("/stats/{user_id}")
async def get_fishing_statistics(user_id: str):
    """Get detailed fishing statistics"""
    collection = await get_player_collection(user_id)
    
    total_caught = 0
    largest_fish = None
    largest_size = 0
    most_caught = None
    most_caught_count = 0
    
    rarity_counts = {"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}
    
    for fish_id, stats in collection.get("fish_stats", {}).items():
        fish_data = FISH_DATABASE.get(fish_id)
        if not fish_data:
            continue
        
        caught = stats.get("caught", 0)
        total_caught += caught
        rarity_counts[fish_data["rarity"]] += caught
        
        if stats.get("largest", 0) > largest_size:
            largest_size = stats["largest"]
            largest_fish = fish_id
        
        if caught > most_caught_count:
            most_caught_count = caught
            most_caught = fish_id
    
    return {
        "total_fish_caught": total_caught,
        "unique_species_discovered": len(collection.get("discovered_fish", [])),
        "largest_catch": {
            "fish_id": largest_fish,
            "fish_name": FISH_DATABASE.get(largest_fish, {}).get("name", "Unknown"),
            "size": largest_size,
        } if largest_fish else None,
        "most_caught": {
            "fish_id": most_caught,
            "fish_name": FISH_DATABASE.get(most_caught, {}).get("name", "Unknown"),
            "count": most_caught_count,
        } if most_caught else None,
        "by_rarity": rarity_counts,
    }
