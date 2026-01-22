"""
Sea Voyage System - The core sidescrolling minigame backend
Features:
- 20 boats from rowboat to large pirate vessel
- 100 stages with varying difficulty
- Ports, islands, cities, and pirate havens
- Net fishing mechanics
- Food/water requirements
- Rum/oranges for extended sea time
- Pirate gold currency
- Wind and sea dangers
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random
import math

router = APIRouter(prefix="/api/sea-voyage", tags=["sea_voyage"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# SECTION 1: BOAT DEFINITIONS (20 BOATS)
# ============================================================================

BOATS = [
    # Tier 1: Beginner Boats (1-5)
    {
        "id": 1,
        "name": "Driftwood Raft",
        "tier": 1,
        "description": "A humble raft made of salvaged driftwood. Every captain starts somewhere.",
        "cost": 0,
        "crew_capacity": 1,
        "cargo_capacity": 10,
        "fishing_capacity": 5,
        "speed": 2,
        "durability": 20,
        "max_sea_time": 30,
        "special_ability": None,
        "unlock_level": 1,
        "sprite": "raft",
        "lore": "Barnacle Bill always said the sea doesn't care what you sail - just that you sail."
    },
    {
        "id": 2,
        "name": "Rowboat",
        "tier": 1,
        "description": "A simple wooden rowboat. Reliable but slow.",
        "cost": 100,
        "crew_capacity": 2,
        "cargo_capacity": 20,
        "fishing_capacity": 10,
        "speed": 3,
        "durability": 30,
        "max_sea_time": 45,
        "special_ability": "silent_approach",
        "unlock_level": 2,
        "sprite": "rowboat",
        "lore": "The traditional vessel of coastal fishermen for centuries."
    },
    {
        "id": 3,
        "name": "Fisher's Dinghy",
        "tier": 1,
        "description": "A small fishing boat with basic equipment.",
        "cost": 250,
        "crew_capacity": 2,
        "cargo_capacity": 35,
        "fishing_capacity": 20,
        "speed": 4,
        "durability": 40,
        "max_sea_time": 60,
        "special_ability": "fish_finder_basic",
        "unlock_level": 3,
        "sprite": "dinghy",
        "lore": "Standard issue at Barnacle Bay's fishing academy."
    },
    {
        "id": 4,
        "name": "Coastal Skiff",
        "tier": 1,
        "description": "A versatile shallow-water craft.",
        "cost": 500,
        "crew_capacity": 3,
        "cargo_capacity": 50,
        "fishing_capacity": 25,
        "speed": 5,
        "durability": 50,
        "max_sea_time": 75,
        "special_ability": "shallow_water_expert",
        "unlock_level": 5,
        "sprite": "skiff",
        "lore": "Perfect for navigating the treacherous shoals near Treasure Cove."
    },
    {
        "id": 5,
        "name": "Harbor Runner",
        "tier": 1,
        "description": "A fast boat designed for quick harbor-to-harbor trips.",
        "cost": 800,
        "crew_capacity": 3,
        "cargo_capacity": 40,
        "fishing_capacity": 15,
        "speed": 7,
        "durability": 45,
        "max_sea_time": 60,
        "special_ability": "quick_dock",
        "unlock_level": 7,
        "sprite": "runner",
        "lore": "The choice of merchants who value speed over cargo space."
    },
    
    # Tier 2: Intermediate Boats (6-10)
    {
        "id": 6,
        "name": "Fishing Sloop",
        "tier": 2,
        "description": "A proper fishing vessel with sail power.",
        "cost": 1500,
        "crew_capacity": 4,
        "cargo_capacity": 80,
        "fishing_capacity": 50,
        "speed": 6,
        "durability": 70,
        "max_sea_time": 120,
        "special_ability": "net_fishing",
        "unlock_level": 10,
        "sprite": "sloop",
        "lore": "The backbone of the Saltwind fishing fleet."
    },
    {
        "id": 7,
        "name": "Trade Cutter",
        "tier": 2,
        "description": "A merchant vessel optimized for cargo.",
        "cost": 2000,
        "crew_capacity": 5,
        "cargo_capacity": 150,
        "fishing_capacity": 30,
        "speed": 5,
        "durability": 80,
        "max_sea_time": 150,
        "special_ability": "expanded_hold",
        "unlock_level": 12,
        "sprite": "cutter",
        "lore": "Queen Coralina's approved design for reef traders."
    },
    {
        "id": 8,
        "name": "Storm Chaser",
        "tier": 2,
        "description": "A rugged vessel built to handle rough weather.",
        "cost": 2500,
        "crew_capacity": 5,
        "cargo_capacity": 100,
        "fishing_capacity": 40,
        "speed": 6,
        "durability": 120,
        "max_sea_time": 180,
        "special_ability": "storm_resistant",
        "unlock_level": 15,
        "sprite": "storm_chaser",
        "lore": "Admiral Stormwrath personally approved this design."
    },
    {
        "id": 9,
        "name": "Explorer's Vessel",
        "tier": 2,
        "description": "A well-balanced ship for long expeditions.",
        "cost": 3500,
        "crew_capacity": 6,
        "cargo_capacity": 120,
        "fishing_capacity": 45,
        "speed": 7,
        "durability": 100,
        "max_sea_time": 240,
        "special_ability": "extended_supplies",
        "unlock_level": 18,
        "sprite": "explorer",
        "lore": "Standard issue for the Explorers' Guild expeditions."
    },
    {
        "id": 10,
        "name": "Buccaneer's Pride",
        "tier": 2,
        "description": "A fast attack vessel favored by privateers.",
        "cost": 5000,
        "crew_capacity": 8,
        "cargo_capacity": 90,
        "fishing_capacity": 35,
        "speed": 9,
        "durability": 90,
        "max_sea_time": 150,
        "special_ability": "boarding_ready",
        "unlock_level": 20,
        "sprite": "buccaneer",
        "lore": "The ship that made Scarlet Sally famous."
    },
    
    # Tier 3: Advanced Boats (11-15)
    {
        "id": 11,
        "name": "Deep Sea Trawler",
        "tier": 3,
        "description": "Industrial fishing vessel for serious anglers.",
        "cost": 8000,
        "crew_capacity": 10,
        "cargo_capacity": 200,
        "fishing_capacity": 100,
        "speed": 5,
        "durability": 150,
        "max_sea_time": 300,
        "special_ability": "deep_net_fishing",
        "unlock_level": 25,
        "sprite": "trawler",
        "lore": "The workhorse of the Grand Fishing Companies."
    },
    {
        "id": 12,
        "name": "Corsair Frigate",
        "tier": 3,
        "description": "A powerful warship converted for adventure.",
        "cost": 12000,
        "crew_capacity": 15,
        "cargo_capacity": 180,
        "fishing_capacity": 60,
        "speed": 8,
        "durability": 200,
        "max_sea_time": 360,
        "special_ability": "cannon_fishing",
        "unlock_level": 30,
        "sprite": "frigate",
        "lore": "Once the terror of the seas, now a symbol of adventure."
    },
    {
        "id": 13,
        "name": "Merchant Galleon",
        "tier": 3,
        "description": "A massive cargo vessel for serious traders.",
        "cost": 15000,
        "crew_capacity": 20,
        "cargo_capacity": 400,
        "fishing_capacity": 50,
        "speed": 4,
        "durability": 250,
        "max_sea_time": 420,
        "special_ability": "massive_cargo",
        "unlock_level": 35,
        "sprite": "galleon",
        "lore": "The gold standard for maritime commerce."
    },
    {
        "id": 14,
        "name": "Night Stalker",
        "tier": 3,
        "description": "A black-sailed vessel for nocturnal expeditions.",
        "cost": 18000,
        "crew_capacity": 12,
        "cargo_capacity": 150,
        "fishing_capacity": 80,
        "speed": 10,
        "durability": 180,
        "max_sea_time": 300,
        "special_ability": "night_vision",
        "unlock_level": 40,
        "sprite": "night_stalker",
        "lore": "Lord Darkfin's personal design for moonlit fishing."
    },
    {
        "id": 15,
        "name": "Coral Queen",
        "tier": 3,
        "description": "A beautiful vessel blessed by the reef spirits.",
        "cost": 22000,
        "crew_capacity": 14,
        "cargo_capacity": 180,
        "fishing_capacity": 90,
        "speed": 8,
        "durability": 220,
        "max_sea_time": 360,
        "special_ability": "reef_harmony",
        "unlock_level": 45,
        "sprite": "coral_queen",
        "lore": "Built with living coral and blessed by Queen Coralina herself."
    },
    
    # Tier 4: Elite Boats (16-18)
    {
        "id": 16,
        "name": "Storm Sovereign",
        "tier": 4,
        "description": "A legendary vessel that commands the weather.",
        "cost": 35000,
        "crew_capacity": 25,
        "cargo_capacity": 300,
        "fishing_capacity": 120,
        "speed": 9,
        "durability": 350,
        "max_sea_time": 480,
        "special_ability": "weather_control",
        "unlock_level": 55,
        "sprite": "storm_sovereign",
        "lore": "Said to be sailed by Admiral Stormwrath in her prime."
    },
    {
        "id": 17,
        "name": "Volcanic Fury",
        "tier": 4,
        "description": "A fire-resistant ship forged in Vulcanus's domain.",
        "cost": 45000,
        "crew_capacity": 20,
        "cargo_capacity": 250,
        "fishing_capacity": 100,
        "speed": 11,
        "durability": 400,
        "max_sea_time": 420,
        "special_ability": "fire_immunity",
        "unlock_level": 60,
        "sprite": "volcanic_fury",
        "lore": "Forged in the heart of Mount Vulcanus for the bravest captains."
    },
    {
        "id": 18,
        "name": "Abyssal Leviathan",
        "tier": 4,
        "description": "A massive ship designed for the deepest waters.",
        "cost": 60000,
        "crew_capacity": 30,
        "cargo_capacity": 500,
        "fishing_capacity": 150,
        "speed": 7,
        "durability": 500,
        "max_sea_time": 600,
        "special_ability": "deep_dive",
        "unlock_level": 70,
        "sprite": "leviathan",
        "lore": "The only ship capable of visiting the Mariana Monarchy."
    },
    
    # Tier 5: Legendary Boats (19-20)
    {
        "id": 19,
        "name": "Golden Dream",
        "tier": 5,
        "description": "Captain Goldtooth's legendary vessel, recreated.",
        "cost": 100000,
        "crew_capacity": 35,
        "cargo_capacity": 400,
        "fishing_capacity": 200,
        "speed": 12,
        "durability": 600,
        "max_sea_time": 720,
        "special_ability": "legendary_luck",
        "unlock_level": 85,
        "sprite": "golden_dream",
        "lore": "A faithful recreation of the legendary ship that sailed beyond known waters."
    },
    {
        "id": 20,
        "name": "World-Fisher",
        "tier": 5,
        "description": "The ultimate fishing vessel. A mobile fishing paradise.",
        "cost": 200000,
        "crew_capacity": 50,
        "cargo_capacity": 1000,
        "fishing_capacity": 500,
        "speed": 10,
        "durability": 999,
        "max_sea_time": 999,
        "special_ability": "master_of_seas",
        "unlock_level": 100,
        "sprite": "world_fisher",
        "lore": "The ship that can sail anywhere, catch anything, and fear nothing."
    }
]

# ============================================================================
# SECTION 2: LOCATION DEFINITIONS (100 STAGES)
# ============================================================================

LOCATION_TYPES = ["port", "island", "city", "pirate_haven", "fishing_ground", "danger_zone", "secret_location"]

def generate_stages():
    """Generate 100 stages with varying locations and challenges"""
    stages = []
    
    # Stage templates by region
    regions = [
        {"name": "Barnacle Bay", "start": 1, "end": 10, "difficulty": 1, "theme": "coastal"},
        {"name": "Coral Reef Waters", "start": 11, "end": 20, "difficulty": 2, "theme": "reef"},
        {"name": "Merchant Sea", "start": 21, "end": 30, "difficulty": 2, "theme": "trade"},
        {"name": "Storm Straits", "start": 31, "end": 40, "difficulty": 3, "theme": "stormy"},
        {"name": "Pirate's Passage", "start": 41, "end": 50, "difficulty": 3, "theme": "danger"},
        {"name": "Deep Blue", "start": 51, "end": 60, "difficulty": 4, "theme": "deep"},
        {"name": "Volcanic Waters", "start": 61, "end": 70, "difficulty": 4, "theme": "volcanic"},
        {"name": "Ghost Seas", "start": 71, "end": 80, "difficulty": 5, "theme": "haunted"},
        {"name": "Abyssal Depths", "start": 81, "end": 90, "difficulty": 5, "theme": "abyss"},
        {"name": "The Beyond", "start": 91, "end": 100, "difficulty": 6, "theme": "legendary"}
    ]
    
    location_names = {
        "port": [
            "Rusty Anchor Port", "Fisherman's Wharf", "Coral Landing", "Storm Harbor",
            "Golden Dock", "Silver Bay Marina", "Neptune's Rest", "Sunset Pier",
            "Treasure Cove Port", "Dragon's Landing", "Mermaid's Welcome", "Captain's Haven",
            "Sailor's End", "Old Salt Dock", "Windward Port", "Tidewater Landing",
            "Shell Shore", "Anchor's Hope", "Seastar Port", "Horizon Dock"
        ],
        "island": [
            "Coconut Isle", "Skull Rock Island", "Paradise Atoll", "Shipwreck Shoal",
            "Turtle Island", "Seagull's Perch", "Mystery Isle", "Buried Treasure Island",
            "Serpent's Coil", "Lost Lagoon", "Pelican Point", "Crab Claw Island",
            "Moonrise Atoll", "Sunken Crown", "Foggy Rock", "Storm Eye Island",
            "Pearl Island", "Ruby Reef", "Emerald Cay", "Diamond Shoal"
        ],
        "city": [
            "Saltwind City", "Port Royal", "Merchant's Paradise", "Neptune's Capital",
            "Golden Gate City", "Coral Metropolis", "Storm King's Seat", "Tide's End City",
            "Prosperity Harbor", "Admiral's Rest", "Grand Maritime", "Oceanview",
            "Seabreeze City", "Lighthouse City", "Harbor Master's Domain", "Pearl City",
            "Crystal Waters", "Azure Bay City", "Emerald Port City", "Diamond Harbor"
        ],
        "pirate_haven": [
            "Blackbeard's Cove", "Skull & Crossbones Bay", "Cutthroat Landing", "Rogue's Rest",
            "Dagger Isle", "Bloody Hook Harbor", "Mutineer's Hideout", "Plunder Point",
            "Smuggler's Den", "Corsair's Nest", "Marauder's Mark", "Privateer's Paradise",
            "Buccaneer's Breach", "Raider's Refuge", "Freebooter's Fort", "Swashbuckler's Shore"
        ]
    }
    
    stage_id = 1
    for region in regions:
        for i in range(region["start"], region["end"] + 1):
            # Determine location type based on stage number
            if i % 10 == 0:  # Every 10th stage is a city
                loc_type = "city"
            elif i % 5 == 0:  # Every 5th is a pirate haven
                loc_type = "pirate_haven"
            elif i % 3 == 0:  # Every 3rd is an island
                loc_type = "island"
            else:  # Default is port or fishing ground
                loc_type = random.choice(["port", "fishing_ground"])
            
            # Get location name
            if loc_type in location_names:
                name = location_names[loc_type][i % len(location_names[loc_type])]
            else:
                name = f"Stage {i} - {loc_type.replace('_', ' ').title()}"
            
            # Generate fish available at this stage
            fish_variety = 3 + (region["difficulty"] * 2)
            
            # Generate dangers
            dangers = []
            if region["difficulty"] >= 2:
                dangers.append("strong_currents")
            if region["difficulty"] >= 3:
                dangers.extend(["storms", "pirates"])
            if region["difficulty"] >= 4:
                dangers.extend(["sea_monsters", "whirlpools"])
            if region["difficulty"] >= 5:
                dangers.extend(["ghost_ships", "volcanic_eruptions"])
            if region["difficulty"] >= 6:
                dangers.extend(["reality_warps", "legendary_beasts"])
            
            stage = {
                "id": stage_id,
                "name": name,
                "region": region["name"],
                "location_type": loc_type,
                "difficulty": region["difficulty"],
                "theme": region["theme"],
                "required_level": (i - 1) * 1,  # Level requirement
                "required_boat_tier": max(1, region["difficulty"] - 1),
                "fish_variety": fish_variety,
                "base_fish_value": 10 * region["difficulty"],
                "dangers": dangers,
                "has_store": loc_type in ["port", "city", "pirate_haven"],
                "has_inn": loc_type in ["port", "city"],
                "has_npc": True,
                "wind_patterns": ["calm", "breeze", "strong"][min(2, region["difficulty"] - 1)],
                "sea_conditions": ["calm", "choppy", "rough", "stormy", "dangerous"][min(4, region["difficulty"] - 1)],
                "description": f"A {loc_type.replace('_', ' ')} in the {region['name']} region.",
                "rewards": {
                    "gold_multiplier": 1 + (region["difficulty"] * 0.2),
                    "xp_multiplier": 1 + (region["difficulty"] * 0.15),
                    "rare_fish_chance": 0.05 * region["difficulty"]
                }
            }
            stages.append(stage)
            stage_id += 1
    
    return stages

STAGES = generate_stages()

# ============================================================================
# SECTION 3: FISH FOR SEA VOYAGES
# ============================================================================

SEA_FISH = [
    # Common Fish (Tier 1)
    {"id": 1, "name": "Anchovy", "tier": 1, "value": 5, "rarity": 0.3, "min_stage": 1, "description": "Small but plentiful."},
    {"id": 2, "name": "Sardine", "tier": 1, "value": 6, "rarity": 0.28, "min_stage": 1, "description": "A staple of the sea."},
    {"id": 3, "name": "Herring", "tier": 1, "value": 8, "rarity": 0.25, "min_stage": 1, "description": "Silver scales glinting."},
    {"id": 4, "name": "Mackerel", "tier": 1, "value": 10, "rarity": 0.22, "min_stage": 5, "description": "Fast and feisty."},
    {"id": 5, "name": "Sea Bream", "tier": 1, "value": 12, "rarity": 0.2, "min_stage": 5, "description": "A tasty catch."},
    
    # Uncommon Fish (Tier 2)
    {"id": 6, "name": "Red Snapper", "tier": 2, "value": 25, "rarity": 0.15, "min_stage": 11, "description": "Prized for its flavor."},
    {"id": 7, "name": "Grouper", "tier": 2, "value": 30, "rarity": 0.14, "min_stage": 15, "description": "A hefty bottom-dweller."},
    {"id": 8, "name": "Barracuda", "tier": 2, "value": 35, "rarity": 0.12, "min_stage": 20, "description": "Fierce and fast."},
    {"id": 9, "name": "Mahi-Mahi", "tier": 2, "value": 40, "rarity": 0.11, "min_stage": 25, "description": "A rainbow of the sea."},
    {"id": 10, "name": "Wahoo", "tier": 2, "value": 45, "rarity": 0.1, "min_stage": 30, "description": "Speed demon of the deep."},
    
    # Rare Fish (Tier 3)
    {"id": 11, "name": "Swordfish", "tier": 3, "value": 80, "rarity": 0.07, "min_stage": 35, "description": "A noble warrior fish."},
    {"id": 12, "name": "Marlin", "tier": 3, "value": 100, "rarity": 0.06, "min_stage": 40, "description": "The king of sport fish."},
    {"id": 13, "name": "Bluefin Tuna", "tier": 3, "value": 150, "rarity": 0.05, "min_stage": 45, "description": "Worth its weight in gold."},
    {"id": 14, "name": "Giant Sea Bass", "tier": 3, "value": 120, "rarity": 0.055, "min_stage": 50, "description": "Ancient and massive."},
    {"id": 15, "name": "Sailfish", "tier": 3, "value": 130, "rarity": 0.048, "min_stage": 55, "description": "The fastest fish alive."},
    
    # Epic Fish (Tier 4)
    {"id": 16, "name": "Oarfish", "tier": 4, "value": 250, "rarity": 0.03, "min_stage": 60, "description": "Serpent of the deep."},
    {"id": 17, "name": "Coelacanth", "tier": 4, "value": 400, "rarity": 0.02, "min_stage": 70, "description": "A living fossil."},
    {"id": 18, "name": "Megamouth Shark", "tier": 4, "value": 350, "rarity": 0.025, "min_stage": 75, "description": "Mysterious giant."},
    {"id": 19, "name": "Giant Squid", "tier": 4, "value": 500, "rarity": 0.015, "min_stage": 80, "description": "Legend of the abyss."},
    
    # Legendary Fish (Tier 5)
    {"id": 20, "name": "Leviathan's Child", "tier": 5, "value": 1000, "rarity": 0.005, "min_stage": 85, "description": "Offspring of the great beast."},
    {"id": 21, "name": "Golden Kraken", "tier": 5, "value": 2000, "rarity": 0.003, "min_stage": 90, "description": "A myth made real."},
    {"id": 22, "name": "World-Fish Fragment", "tier": 5, "value": 5000, "rarity": 0.001, "min_stage": 95, "description": "A piece of legend itself."},
    {"id": 23, "name": "The Eternal Catch", "tier": 5, "value": 10000, "rarity": 0.0005, "min_stage": 100, "description": "The fish that grants wisdom."}
]

# ============================================================================
# SECTION 4: SUPPLIES AND CONSUMABLES
# ============================================================================

SUPPLIES = {
    "food": [
        {"id": "hardtack", "name": "Hardtack", "type": "food", "value": 10, "cost": 5, "sea_time_bonus": 10, "description": "Basic sailor's bread."},
        {"id": "dried_fish", "name": "Dried Fish", "type": "food", "value": 20, "cost": 15, "sea_time_bonus": 20, "description": "Preserved catch."},
        {"id": "salted_pork", "name": "Salted Pork", "type": "food", "value": 35, "cost": 30, "sea_time_bonus": 35, "description": "Hearty meat."},
        {"id": "ships_biscuit", "name": "Ship's Biscuit", "type": "food", "value": 50, "cost": 50, "sea_time_bonus": 50, "description": "Quality rations."},
        {"id": "captains_feast", "name": "Captain's Feast", "type": "food", "value": 100, "cost": 150, "sea_time_bonus": 100, "description": "A royal meal at sea."}
    ],
    "water": [
        {"id": "barrel_water", "name": "Water Barrel", "type": "water", "value": 20, "cost": 10, "sea_time_bonus": 15, "description": "Fresh drinking water."},
        {"id": "filtered_water", "name": "Filtered Water", "type": "water", "value": 35, "cost": 25, "sea_time_bonus": 30, "description": "Purified and clean."},
        {"id": "spring_water", "name": "Spring Water", "type": "water", "value": 50, "cost": 50, "sea_time_bonus": 50, "description": "From mountain springs."},
        {"id": "enchanted_water", "name": "Enchanted Water", "type": "water", "value": 100, "cost": 200, "sea_time_bonus": 100, "description": "Blessed by the sea spirits."}
    ],
    "special": [
        {"id": "rum", "name": "Pirate Rum", "type": "special", "value": 30, "cost": 40, "sea_time_bonus": 25, "morale_bonus": 20, "description": "Yo ho ho and a bottle of rum!"},
        {"id": "oranges", "name": "Fresh Oranges", "type": "special", "value": 40, "cost": 35, "sea_time_bonus": 30, "health_bonus": 15, "description": "Prevents scurvy."},
        {"id": "grog", "name": "Sailor's Grog", "type": "special", "value": 25, "cost": 25, "sea_time_bonus": 20, "morale_bonus": 15, "description": "Watered-down rum."},
        {"id": "limes", "name": "Limes", "type": "special", "value": 35, "cost": 30, "sea_time_bonus": 25, "health_bonus": 12, "description": "Sour but essential."},
        {"id": "coconuts", "name": "Coconuts", "type": "special", "value": 45, "cost": 45, "sea_time_bonus": 35, "health_bonus": 10, "description": "Tropical refreshment."}
    ]
}

# ============================================================================
# SECTION 5: DANGERS AND WEATHER
# ============================================================================

SEA_DANGERS = {
    "strong_currents": {
        "name": "Strong Currents",
        "damage_range": [5, 15],
        "speed_penalty": 2,
        "avoidance_skill": "navigation",
        "description": "Powerful currents that can push your ship off course."
    },
    "storms": {
        "name": "Sea Storm",
        "damage_range": [15, 35],
        "speed_penalty": 4,
        "avoidance_skill": "weather_reading",
        "description": "Violent storms with high waves and lightning."
    },
    "pirates": {
        "name": "Pirate Attack",
        "damage_range": [20, 50],
        "gold_loss_range": [10, 30],
        "avoidance_skill": "combat",
        "description": "Hostile pirates looking for plunder."
    },
    "sea_monsters": {
        "name": "Sea Monster",
        "damage_range": [30, 60],
        "crew_loss_chance": 0.1,
        "avoidance_skill": "monster_lore",
        "description": "Terrifying creatures from the deep."
    },
    "whirlpools": {
        "name": "Whirlpool",
        "damage_range": [25, 45],
        "cargo_loss_range": [5, 20],
        "avoidance_skill": "navigation",
        "description": "Spinning vortexes that can swallow ships."
    },
    "ghost_ships": {
        "name": "Ghost Ship",
        "damage_range": [20, 40],
        "morale_loss": 30,
        "avoidance_skill": "spirit_ward",
        "description": "Spectral vessels from beyond the veil."
    },
    "volcanic_eruptions": {
        "name": "Volcanic Eruption",
        "damage_range": [40, 80],
        "fire_damage": True,
        "avoidance_skill": "volcanic_knowledge",
        "description": "Underwater volcanic activity causing chaos."
    },
    "reality_warps": {
        "name": "Reality Warp",
        "effects": ["time_skip", "location_shift", "memory_loss"],
        "avoidance_skill": "dream_navigation",
        "description": "The fabric of reality becomes unstable."
    },
    "legendary_beasts": {
        "name": "Legendary Beast",
        "damage_range": [50, 100],
        "special_loot_chance": 0.3,
        "avoidance_skill": "legendary_knowledge",
        "description": "A mythical creature of immense power."
    }
}

WIND_PATTERNS = {
    "calm": {"speed_modifier": 0.8, "fuel_consumption": 1.2, "description": "No wind, slow going."},
    "breeze": {"speed_modifier": 1.0, "fuel_consumption": 1.0, "description": "Gentle winds, smooth sailing."},
    "strong": {"speed_modifier": 1.3, "fuel_consumption": 0.8, "description": "Strong winds filling your sails."},
    "gale": {"speed_modifier": 1.5, "fuel_consumption": 0.6, "damage_chance": 0.1, "description": "Dangerous but fast."},
    "hurricane": {"speed_modifier": 0.5, "fuel_consumption": 1.5, "damage_chance": 0.3, "description": "Survival is the priority."}
}

# ============================================================================
# SECTION 6: PYDANTIC MODELS
# ============================================================================

class VoyageState(BaseModel):
    user_id: str
    voyage_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    current_boat_id: int
    current_stage: int = 1
    current_location_type: str = "port"
    pirate_gold: int = 100
    food: int = 50
    water: int = 50
    rum: int = 0
    oranges: int = 0
    sea_time_remaining: int = 100
    cargo: List[Dict] = Field(default_factory=list)
    crew_count: int = 1
    crew_morale: int = 100
    ship_durability: int = 100
    voyage_started: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_fish_caught: int = 0
    total_gold_earned: int = 0
    dangers_survived: int = 0
    stages_visited: List[int] = Field(default_factory=list)
    active: bool = True

class StartVoyageRequest(BaseModel):
    user_id: str
    boat_id: int

class FishingAttempt(BaseModel):
    user_id: str
    voyage_id: str
    net_size: str = "small"  # small, medium, large

class TravelRequest(BaseModel):
    user_id: str
    voyage_id: str
    destination_stage: int

class PurchaseRequest(BaseModel):
    user_id: str
    voyage_id: str
    item_id: str
    quantity: int = 1

class SellFishRequest(BaseModel):
    user_id: str
    voyage_id: str
    fish_ids: List[str]

# ============================================================================
# SECTION 7: API ROUTES
# ============================================================================

@router.get("/boats")
async def get_all_boats():
    """Get all available boats"""
    return {"boats": BOATS, "total": len(BOATS)}

@router.get("/boats/{boat_id}")
async def get_boat(boat_id: int):
    """Get a specific boat by ID"""
    boat = next((b for b in BOATS if b["id"] == boat_id), None)
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    return boat

@router.get("/stages")
async def get_all_stages():
    """Get all stages"""
    return {"stages": STAGES, "total": len(STAGES)}

@router.get("/stages/{stage_id}")
async def get_stage(stage_id: int):
    """Get a specific stage"""
    stage = next((s for s in STAGES if s["id"] == stage_id), None)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    return stage

@router.get("/stages/region/{region_name}")
async def get_stages_by_region(region_name: str):
    """Get all stages in a region"""
    stages = [s for s in STAGES if s["region"].lower() == region_name.lower()]
    return {"stages": stages, "total": len(stages)}

@router.get("/fish")
async def get_all_sea_fish():
    """Get all sea fish"""
    return {"fish": SEA_FISH, "total": len(SEA_FISH)}

@router.get("/supplies")
async def get_all_supplies():
    """Get all available supplies"""
    return SUPPLIES

@router.get("/dangers")
async def get_all_dangers():
    """Get all possible dangers"""
    return SEA_DANGERS

@router.post("/voyage/start")
async def start_voyage(request: StartVoyageRequest):
    """Start a new sea voyage"""
    # Verify boat exists
    boat = next((b for b in BOATS if b["id"] == request.boat_id), None)
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    
    # Check if user owns boat
    user_boats = await db.user_boats.find_one({"user_id": request.user_id})
    if not user_boats:
        # Give user the starter boat if they have none
        await db.user_boats.insert_one({
            "user_id": request.user_id,
            "owned_boats": [1],  # Starter raft
            "active_boat": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        user_boats = {"owned_boats": [1]}
    
    if request.boat_id not in user_boats.get("owned_boats", [1]):
        raise HTTPException(status_code=403, detail="You don't own this boat")
    
    # Create voyage state
    voyage = VoyageState(
        user_id=request.user_id,
        current_boat_id=request.boat_id,
        sea_time_remaining=boat["max_sea_time"],
        ship_durability=boat["durability"],
        crew_count=min(boat["crew_capacity"], 1),  # Start with 1 crew
    )
    
    # Save voyage
    await db.voyages.insert_one(voyage.model_dump())
    
    return {
        "message": "Voyage started!",
        "voyage": voyage.model_dump(),
        "boat": boat,
        "starting_stage": STAGES[0]
    }

@router.get("/voyage/{user_id}/active")
async def get_active_voyage(user_id: str):
    """Get user's active voyage"""
    voyage = await db.voyages.find_one(
        {"user_id": user_id, "active": True},
        {"_id": 0}
    )
    if not voyage:
        return {"active": False, "message": "No active voyage"}
    
    boat = next((b for b in BOATS if b["id"] == voyage["current_boat_id"]), None)
    stage = next((s for s in STAGES if s["id"] == voyage["current_stage"]), None)
    
    return {
        "active": True,
        "voyage": voyage,
        "boat": boat,
        "current_stage": stage
    }

@router.post("/voyage/fish")
async def attempt_fishing(request: FishingAttempt):
    """Attempt to catch fish during voyage"""
    voyage = await db.voyages.find_one(
        {"voyage_id": request.voyage_id, "user_id": request.user_id, "active": True},
        {"_id": 0}
    )
    if not voyage:
        raise HTTPException(status_code=404, detail="No active voyage found")
    
    boat = next((b for b in BOATS if b["id"] == voyage["current_boat_id"]), None)
    stage = next((s for s in STAGES if s["id"] == voyage["current_stage"]), None)
    
    # Net size affects catch
    net_multipliers = {"small": 1, "medium": 2, "large": 3}
    net_costs = {"small": 5, "medium": 10, "large": 20}
    
    # Check if enough sea time
    time_cost = net_costs.get(request.net_size, 5)
    if voyage["sea_time_remaining"] < time_cost:
        raise HTTPException(status_code=400, detail="Not enough sea time")
    
    # Calculate catch
    base_catch = boat["fishing_capacity"] * net_multipliers.get(request.net_size, 1) / 10
    catch_count = random.randint(int(base_catch * 0.5), int(base_catch * 1.5))
    
    # Get available fish for this stage
    available_fish = [f for f in SEA_FISH if f["min_stage"] <= voyage["current_stage"]]
    
    caught_fish = []
    total_value = 0
    
    for _ in range(max(1, catch_count)):
        # Random fish selection weighted by rarity
        fish_pool = []
        for fish in available_fish:
            if random.random() < fish["rarity"] * stage["rewards"]["rare_fish_chance"] * 10:
                fish_pool.append(fish)
        
        if fish_pool:
            caught = random.choice(fish_pool)
            fish_entry = {
                "fish_id": str(uuid.uuid4()),
                "type_id": caught["id"],
                "name": caught["name"],
                "tier": caught["tier"],
                "value": int(caught["value"] * stage["rewards"]["gold_multiplier"]),
                "caught_at": datetime.now(timezone.utc).isoformat(),
                "stage": voyage["current_stage"]
            }
            caught_fish.append(fish_entry)
            total_value += fish_entry["value"]
    
    # Update voyage
    await db.voyages.update_one(
        {"voyage_id": request.voyage_id},
        {
            "$push": {"cargo": {"$each": caught_fish}},
            "$inc": {
                "sea_time_remaining": -time_cost,
                "total_fish_caught": len(caught_fish)
            }
        }
    )
    
    return {
        "success": True,
        "fish_caught": caught_fish,
        "total_value": total_value,
        "catch_count": len(caught_fish),
        "sea_time_used": time_cost,
        "sea_time_remaining": voyage["sea_time_remaining"] - time_cost
    }

@router.post("/voyage/travel")
async def travel_to_stage(request: TravelRequest):
    """Travel to a new stage"""
    voyage = await db.voyages.find_one(
        {"voyage_id": request.voyage_id, "user_id": request.user_id, "active": True},
        {"_id": 0}
    )
    if not voyage:
        raise HTTPException(status_code=404, detail="No active voyage found")
    
    destination = next((s for s in STAGES if s["id"] == request.destination_stage), None)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    current_stage = voyage["current_stage"]
    distance = abs(request.destination_stage - current_stage)
    travel_time = distance * 5  # 5 time units per stage
    
    # Check if enough time
    if voyage["sea_time_remaining"] < travel_time:
        raise HTTPException(status_code=400, detail="Not enough sea time for this journey")
    
    # Check for dangers during travel
    boat = next((b for b in BOATS if b["id"] == voyage["current_boat_id"]), None)
    dangers_encountered = []
    damage_taken = 0
    gold_lost = 0
    
    for danger_key in destination.get("dangers", []):
        if random.random() < 0.2:  # 20% chance per danger type
            danger = SEA_DANGERS.get(danger_key)
            if danger:
                # Check for special abilities
                if danger_key == "storms" and boat.get("special_ability") == "storm_resistant":
                    continue
                if danger_key == "volcanic_eruptions" and boat.get("special_ability") == "fire_immunity":
                    continue
                
                dmg = random.randint(*danger.get("damage_range", [5, 10]))
                damage_taken += dmg
                if "gold_loss_range" in danger:
                    gold_lost += random.randint(*danger["gold_loss_range"])
                dangers_encountered.append({
                    "type": danger_key,
                    "name": danger["name"],
                    "damage": dmg,
                    "description": danger["description"]
                })
    
    # Consume supplies
    food_consumed = travel_time // 10
    water_consumed = travel_time // 8
    
    new_food = max(0, voyage["food"] - food_consumed)
    new_water = max(0, voyage["water"] - water_consumed)
    new_durability = max(0, voyage["ship_durability"] - damage_taken)
    new_gold = max(0, voyage["pirate_gold"] - gold_lost)
    
    # Check for ship destruction
    if new_durability <= 0:
        await db.voyages.update_one(
            {"voyage_id": request.voyage_id},
            {"$set": {"active": False, "destroyed": True}}
        )
        return {
            "success": False,
            "message": "Your ship has been destroyed!",
            "dangers": dangers_encountered,
            "voyage_ended": True
        }
    
    # Update voyage
    await db.voyages.update_one(
        {"voyage_id": request.voyage_id},
        {
            "$set": {
                "current_stage": request.destination_stage,
                "current_location_type": destination["location_type"],
                "food": new_food,
                "water": new_water,
                "ship_durability": new_durability,
                "pirate_gold": new_gold
            },
            "$inc": {
                "sea_time_remaining": -travel_time,
                "dangers_survived": len(dangers_encountered)
            },
            "$push": {"stages_visited": request.destination_stage}
        }
    )
    
    return {
        "success": True,
        "arrived_at": destination,
        "travel_time": travel_time,
        "dangers_encountered": dangers_encountered,
        "damage_taken": damage_taken,
        "gold_lost": gold_lost,
        "supplies_consumed": {
            "food": food_consumed,
            "water": water_consumed
        },
        "current_status": {
            "food": new_food,
            "water": new_water,
            "durability": new_durability,
            "gold": new_gold
        }
    }

@router.post("/voyage/buy")
async def buy_supplies(request: PurchaseRequest):
    """Buy supplies at a port/store"""
    voyage = await db.voyages.find_one(
        {"voyage_id": request.voyage_id, "user_id": request.user_id, "active": True},
        {"_id": 0}
    )
    if not voyage:
        raise HTTPException(status_code=404, detail="No active voyage found")
    
    stage = next((s for s in STAGES if s["id"] == voyage["current_stage"]), None)
    if not stage or not stage.get("has_store"):
        raise HTTPException(status_code=400, detail="No store at current location")
    
    # Find item
    item = None
    item_type = None
    for supply_type, items in SUPPLIES.items():
        for i in items:
            if i["id"] == request.item_id:
                item = i
                item_type = supply_type
                break
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    total_cost = item["cost"] * request.quantity
    if voyage["pirate_gold"] < total_cost:
        raise HTTPException(status_code=400, detail="Not enough pirate gold")
    
    # Apply purchase
    update_fields = {"pirate_gold": voyage["pirate_gold"] - total_cost}
    bonus_field = None
    
    if item_type == "food":
        update_fields["food"] = voyage["food"] + (item["value"] * request.quantity)
    elif item_type == "water":
        update_fields["water"] = voyage["water"] + (item["value"] * request.quantity)
    elif item_type == "special":
        if item["id"] == "rum":
            update_fields["rum"] = voyage.get("rum", 0) + request.quantity
        elif item["id"] in ["oranges", "limes", "coconuts"]:
            update_fields["oranges"] = voyage.get("oranges", 0) + request.quantity
        # Apply sea time bonus
        update_fields["sea_time_remaining"] = voyage["sea_time_remaining"] + (item["sea_time_bonus"] * request.quantity)
    
    await db.voyages.update_one(
        {"voyage_id": request.voyage_id},
        {"$set": update_fields}
    )
    
    return {
        "success": True,
        "purchased": item["name"],
        "quantity": request.quantity,
        "total_cost": total_cost,
        "remaining_gold": update_fields["pirate_gold"],
        "new_status": update_fields
    }

@router.post("/voyage/sell-fish")
async def sell_fish(request: SellFishRequest):
    """Sell caught fish at a port"""
    voyage = await db.voyages.find_one(
        {"voyage_id": request.voyage_id, "user_id": request.user_id, "active": True},
        {"_id": 0}
    )
    if not voyage:
        raise HTTPException(status_code=404, detail="No active voyage found")
    
    stage = next((s for s in STAGES if s["id"] == voyage["current_stage"]), None)
    if not stage or not stage.get("has_store"):
        raise HTTPException(status_code=400, detail="No market at current location")
    
    cargo = voyage.get("cargo", [])
    fish_to_sell = [f for f in cargo if f["fish_id"] in request.fish_ids]
    
    if not fish_to_sell:
        raise HTTPException(status_code=400, detail="No matching fish found in cargo")
    
    total_value = sum(f["value"] for f in fish_to_sell)
    remaining_cargo = [f for f in cargo if f["fish_id"] not in request.fish_ids]
    
    await db.voyages.update_one(
        {"voyage_id": request.voyage_id},
        {
            "$set": {"cargo": remaining_cargo},
            "$inc": {
                "pirate_gold": total_value,
                "total_gold_earned": total_value
            }
        }
    )
    
    return {
        "success": True,
        "fish_sold": len(fish_to_sell),
        "gold_earned": total_value,
        "new_gold_total": voyage["pirate_gold"] + total_value
    }

@router.post("/voyage/end")
async def end_voyage(user_id: str, voyage_id: str):
    """End an active voyage"""
    voyage = await db.voyages.find_one(
        {"voyage_id": voyage_id, "user_id": user_id, "active": True},
        {"_id": 0}
    )
    if not voyage:
        raise HTTPException(status_code=404, detail="No active voyage found")
    
    # Calculate final statistics
    duration = datetime.now(timezone.utc) - datetime.fromisoformat(voyage["voyage_started"])
    
    # Save voyage to history
    await db.voyages.update_one(
        {"voyage_id": voyage_id},
        {
            "$set": {
                "active": False,
                "ended_at": datetime.now(timezone.utc).isoformat(),
                "duration_seconds": duration.total_seconds()
            }
        }
    )
    
    # Transfer gold to user account
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"pirate_gold": voyage["pirate_gold"]}}
    )
    
    return {
        "success": True,
        "voyage_summary": {
            "duration": str(duration),
            "stages_visited": len(voyage["stages_visited"]),
            "fish_caught": voyage["total_fish_caught"],
            "gold_earned": voyage["total_gold_earned"],
            "dangers_survived": voyage["dangers_survived"],
            "final_gold": voyage["pirate_gold"]
        }
    }

@router.get("/user/{user_id}/boats")
async def get_user_boats(user_id: str):
    """Get boats owned by user"""
    user_boats = await db.user_boats.find_one({"user_id": user_id}, {"_id": 0})
    if not user_boats:
        # Initialize with starter boat
        user_boats = {
            "user_id": user_id,
            "owned_boats": [1],
            "active_boat": 1
        }
        await db.user_boats.insert_one(user_boats)
    
    owned = [b for b in BOATS if b["id"] in user_boats.get("owned_boats", [1])]
    return {
        "owned_boats": owned,
        "active_boat": user_boats.get("active_boat", 1),
        "total_owned": len(owned)
    }

@router.post("/user/{user_id}/buy-boat/{boat_id}")
async def buy_boat(user_id: str, boat_id: int):
    """Purchase a new boat"""
    boat = next((b for b in BOATS if b["id"] == boat_id), None)
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    
    # Check user's gold
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_gold = user.get("pirate_gold", 0)
    if user_gold < boat["cost"]:
        raise HTTPException(status_code=400, detail="Not enough pirate gold")
    
    # Check if already owned
    user_boats = await db.user_boats.find_one({"user_id": user_id})
    if user_boats and boat_id in user_boats.get("owned_boats", []):
        raise HTTPException(status_code=400, detail="You already own this boat")
    
    # Purchase
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"pirate_gold": -boat["cost"]}}
    )
    
    if user_boats:
        await db.user_boats.update_one(
            {"user_id": user_id},
            {"$push": {"owned_boats": boat_id}}
        )
    else:
        await db.user_boats.insert_one({
            "user_id": user_id,
            "owned_boats": [1, boat_id],
            "active_boat": boat_id
        })
    
    return {
        "success": True,
        "purchased": boat["name"],
        "cost": boat["cost"],
        "remaining_gold": user_gold - boat["cost"]
    }

@router.get("/leaderboard/voyages")
async def get_voyage_leaderboard(limit: int = 20):
    """Get top voyagers"""
    top_voyages = await db.voyages.find(
        {"active": False},
        {"_id": 0}
    ).sort("total_gold_earned", -1).limit(limit).to_list(limit)
    
    return {"leaderboard": top_voyages}
