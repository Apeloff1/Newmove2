"""
Letter Bottle Event System - Super rare timed event (3% chance)
Features:
- Random bottle events triggered by exploration
- Mysterious messages with clues
- Special rewards and quests
- Pirate mail with rare recipes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random

router = APIRouter(prefix="/api/events", tags=["events"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# SECTION 1: BOTTLE EVENT CONSTANTS
# ============================================================================

BOTTLE_TRIGGER_CHANCE = 0.03  # 3% chance per fishing action

BOTTLE_TYPES = {
    "mysterious_message": {
        "id": "mysterious_message",
        "name": "Mysterious Message in a Bottle",
        "rarity": 0.40,  # 40% of bottles
        "sprite": "bottle_sealed",
        "description": "A weathered bottle containing a mysterious rolled parchment.",
        "rewards_type": "clue"
    },
    "treasure_map": {
        "id": "treasure_map",
        "name": "Treasure Map Fragment",
        "rarity": 0.20,  # 20% of bottles
        "sprite": "bottle_map",
        "description": "The bottle contains what appears to be part of a treasure map!",
        "rewards_type": "map_fragment"
    },
    "rare_recipe": {
        "id": "rare_recipe",
        "name": "Ancient Recipe",
        "rarity": 0.15,  # 15% of bottles
        "sprite": "bottle_recipe",
        "description": "A bottle containing a rare cooking recipe from a legendary chef.",
        "rewards_type": "recipe"
    },
    "pirate_letter": {
        "id": "pirate_letter",
        "name": "Pirate's Letter",
        "rarity": 0.15,  # 15% of bottles
        "sprite": "bottle_letter",
        "description": "A letter from a pirate! They might be trying to contact you...",
        "rewards_type": "pirate_contact"
    },
    "cursed_bottle": {
        "id": "cursed_bottle",
        "name": "Cursed Bottle",
        "rarity": 0.05,  # 5% of bottles - dangerous!
        "sprite": "bottle_cursed",
        "description": "This bottle emanates an ominous aura. Something dark is trapped within...",
        "rewards_type": "curse_or_blessing"
    },
    "golden_bottle": {
        "id": "golden_bottle",
        "name": "Golden Bottle",
        "rarity": 0.05,  # 5% of bottles - legendary!
        "sprite": "bottle_golden",
        "description": "A bottle made of solid gold! What treasures could it hold?",
        "rewards_type": "legendary_reward"
    }
}

# ============================================================================
# SECTION 2: MESSAGE CONTENTS
# ============================================================================

MYSTERIOUS_MESSAGES = [
    {
        "id": "msg_001",
        "title": "A Sailor's Warning",
        "content": """To whoever finds this bottle,
        
Beware the waters near the Crimson Reef when the moon turns blood red. I've seen things there... creatures that shouldn't exist. Ships that sail without wind. Voices in the fog that call your name.

I write this as my ship drifts, compass spinning madly. If you find this, I am already lost. Learn from my mistake - some waters are not meant to be sailed.

- Captain Harrison, Final Entry""",
        "clue_type": "location_warning",
        "related_location": "crimson_reef",
        "reward": {"knowledge": "crimson_reef_danger", "xp": 50}
    },
    {
        "id": "msg_002",
        "title": "Love Lost at Sea",
        "content": """My dearest Marina,

It has been three years since I last saw your smile. The merchant guild claims I am dead, but I live still, trapped on an island they call the Forgotten Atoll. The currents are impossible - ships come in but never leave.

I survive on fish and hope. Please, if anyone finds this, tell Marina Goldscale of Port Royal that her husband lives. Tell her I still love her.

Tell her I'm coming home.

- James Goldscale""",
        "clue_type": "quest_hook",
        "related_npc": "merchant_marina",
        "reward": {"quest_unlock": "lost_husband", "rep_marina": 10}
    },
    {
        "id": "msg_003",
        "title": "The Leviathan's Cycle",
        "content": """Observation Log - Day 4,382

After twelve years of study, I have finally understood the Leviathan's migration pattern. It follows the ghost currents - invisible rivers beneath the waves that only appear during the convergence of three lunar events.

The next convergence is in... [the rest is water damaged and illegible]

This knowledge must be preserved. The Leviathan is not a monster to be feared, but a guardian to be respected.

- Dr. Eliza Deepwater, Marine Scholar""",
        "clue_type": "legendary_fish_clue",
        "related_fish": "thunder_leviathan",
        "reward": {"knowledge": "leviathan_migration", "fishing_bonus": {"legendary_chance": 0.01}}
    },
    {
        "id": "msg_004",
        "title": "Confession of a Pirate",
        "content": """I ain't got long left. The poison's in me blood now - that treacherous first mate of mine.

So I'll confess what I never told no one. The treasure of the Crimson Terror? It ain't on Skull Island where everyone looks. I moved it. Buried it beneath the lighthouse at Storm Point, in a hidden cellar only accessible at low tide.

May whoever finds this use it better than I did.

- Redbeard the Elder (not that young pretender who took me name)""",
        "clue_type": "treasure_location",
        "related_location": "storm_point_lighthouse",
        "reward": {"treasure_hint": True, "gold": 100}
    },
    {
        "id": "msg_005",
        "title": "Recipe for the Sea Spirit",
        "content": """The old shaman taught me this before he passed. If you ever anger a sea spirit, cook this:

- 3 Silver Mackerel, caught at dawn
- Seaweed from the Spirit Waters
- A drop of rum (they appreciate the gesture)
- One tear of genuine remorse

Burn it on a coral stone while singing the old sailor's hymn. The spirit will forgive... usually.

I've never had to use it. I hope you never do either.

- Anonymous Fisher""",
        "clue_type": "recipe",
        "recipe_id": "spirit_appeasement",
        "reward": {"recipe": "spirit_appeasement", "xp": 75}
    },
    {
        "id": "msg_006",
        "title": "The Coordinates",
        "content": """37.4219° N, 122.0840° W
At the third moon
When the fish sleep
The door opens
The World speaks
Don't be late

[drawn at the bottom is a symbol resembling a spiral with an eye in the center]""",
        "clue_type": "mysterious_coordinates",
        "related_event": "world_fish_encounter",
        "reward": {"map_marker": "mysterious_location", "event_unlock": True}
    },
    {
        "id": "msg_007",
        "title": "From the Future?",
        "content": """This message finds you because it must.

In seventeen days, a storm will come to Barnacle Bay. It will destroy everything... unless you warn Barnacle Bill. He must move the boats to the inner harbor. He won't believe you at first. Show him this symbol:

[a complex geometric pattern is drawn]

Trust nothing else I might tell you. This is all you need to know.

- A Friend (from seventeen days from now)""",
        "clue_type": "time_warning",
        "related_npc": "barnacle_bill",
        "timed_event": True,
        "reward": {"quest_unlock": "storm_warning", "rep_bill": 20}
    },
    {
        "id": "msg_008",
        "title": "The Fish King's Decree",
        "content": """HEAR YE, SURFACE DWELLERS

By royal decree of His Majesty King Finnius the 47th of the Underwater Kingdom, it is hereby declared that ONE human shall be granted audience in our coral halls.

The chosen one must:
- Catch and RELEASE 100 fish with respect
- Never use nets of cruelty
- Learn the language of bubbles

When these conditions are met, throw a golden scale into the deepest water you can find. We shall send an escort.

[The signature is in an unreadable script of bubbles and swirls]""",
        "clue_type": "quest_requirement",
        "related_faction": "underwater_kingdom",
        "reward": {"quest_unlock": "fish_king_audience", "faction_discover": "underwater_kingdom"}
    },
    {
        "id": "msg_009",
        "title": "The Fisherman's Psalm",
        "content": """Before the first cast, speak these words:

"To the sea that provides, I give thanks.
To the fish that sustain, I give respect.
To the waves that test, I give courage.
To the storms that humble, I give patience.
May my line be true, my catch be fair,
And may I always remember:
I take only what I need,
I return what I cannot use,
I honor the depth and the shallows alike."

My grandfather taught me this. His grandfather taught him. Now I teach you.

- The Last Fisher of the Old Ways""",
        "clue_type": "blessing",
        "effect": "daily_fishing_blessing",
        "reward": {"ability": "fishermans_psalm", "luck_bonus": 5}
    },
    {
        "id": "msg_010",
        "title": "SOS",
        "content": """HELP

STRANDED

VOLCANO ISLAND

BRING WATER

THREE OF US LEFT

HURRY

[The writing becomes increasingly shaky and small]

please""",
        "clue_type": "rescue_mission",
        "urgent": True,
        "related_location": "volcano_island",
        "reward": {"quest_unlock": "volcanic_rescue", "time_limit": "48_hours"}
    }
]

# ============================================================================
# SECTION 3: TREASURE MAP FRAGMENTS
# ============================================================================

TREASURE_MAP_FRAGMENTS = {
    "golden_hoard_1": {
        "id": "golden_hoard_1",
        "set_name": "Golden Hoard",
        "fragment_number": 1,
        "total_fragments": 4,
        "image": "map_fragment_1",
        "hint": "X marks where the sun first touches the eastern cliffs.",
        "treasure_value": 5000
    },
    "golden_hoard_2": {
        "id": "golden_hoard_2",
        "set_name": "Golden Hoard",
        "fragment_number": 2,
        "total_fragments": 4,
        "image": "map_fragment_2",
        "hint": "Count twenty paces from the lone palm tree.",
        "treasure_value": 5000
    },
    "golden_hoard_3": {
        "id": "golden_hoard_3",
        "set_name": "Golden Hoard",
        "fragment_number": 3,
        "total_fragments": 4,
        "image": "map_fragment_3",
        "hint": "Beneath the skull rock, dig when the tide is lowest.",
        "treasure_value": 5000
    },
    "golden_hoard_4": {
        "id": "golden_hoard_4",
        "set_name": "Golden Hoard",
        "fragment_number": 4,
        "total_fragments": 4,
        "image": "map_fragment_4",
        "hint": "The treasure lies where three shadows meet at noon.",
        "treasure_value": 5000
    },
    "ghost_ship_1": {
        "id": "ghost_ship_1",
        "set_name": "Ghost Ship's Cargo",
        "fragment_number": 1,
        "total_fragments": 3,
        "image": "ghost_map_1",
        "hint": "The ship sank in waters that glow at night.",
        "treasure_value": 10000
    },
    "ghost_ship_2": {
        "id": "ghost_ship_2",
        "set_name": "Ghost Ship's Cargo",
        "fragment_number": 2,
        "total_fragments": 3,
        "image": "ghost_map_2",
        "hint": "Only visible during the witching hour.",
        "treasure_value": 10000
    },
    "ghost_ship_3": {
        "id": "ghost_ship_3",
        "set_name": "Ghost Ship's Cargo",
        "fragment_number": 3,
        "total_fragments": 3,
        "image": "ghost_map_3",
        "hint": "Dive deep, hold your breath, face your fears.",
        "treasure_value": 10000
    }
}

# ============================================================================
# SECTION 4: RARE RECIPES
# ============================================================================

RARE_RECIPES = [
    {
        "id": "legendary_fish_stew",
        "name": "Legendary Fish Stew",
        "description": "A recipe passed down through generations of master chefs. Said to grant temporary luck.",
        "ingredients": [
            {"item": "rare_fish", "count": 3},
            {"item": "sea_salt", "count": 2},
            {"item": "mystery_herb", "count": 1},
            {"item": "spring_water", "count": 1}
        ],
        "cooking_time": 300,  # 5 minutes
        "effects": {
            "luck_bonus": 20,
            "duration": 3600  # 1 hour
        },
        "rarity": "legendary"
    },
    {
        "id": "pirates_grog",
        "name": "Captain's Special Grog",
        "description": "The secret recipe of Captain Redbeard himself. Increases morale and sea time.",
        "ingredients": [
            {"item": "rum", "count": 3},
            {"item": "lime_juice", "count": 2},
            {"item": "honey", "count": 1},
            {"item": "secret_spice", "count": 1}
        ],
        "cooking_time": 120,  # 2 minutes
        "effects": {
            "morale_bonus": 30,
            "sea_time_bonus": 60,
            "duration": 1800  # 30 minutes
        },
        "rarity": "rare"
    },
    {
        "id": "mermaids_kiss",
        "name": "Mermaid's Kiss Elixir",
        "description": "An enchanted drink that allows brief underwater breathing.",
        "ingredients": [
            {"item": "bioluminescent_fish", "count": 1},
            {"item": "pearl_dust", "count": 3},
            {"item": "moonlit_water", "count": 2},
            {"item": "coral_essence", "count": 1}
        ],
        "cooking_time": 600,  # 10 minutes
        "effects": {
            "underwater_breathing": 180,  # 3 minutes
            "swim_speed_bonus": 50
        },
        "rarity": "legendary"
    },
    {
        "id": "storm_biscuits",
        "name": "Storm Weathering Biscuits",
        "description": "Hardtack infused with storm essence. Provides protection during rough weather.",
        "ingredients": [
            {"item": "hardtack", "count": 5},
            {"item": "storm_fish_oil", "count": 2},
            {"item": "lightning_salt", "count": 1}
        ],
        "cooking_time": 180,  # 3 minutes
        "effects": {
            "storm_resistance": 50,
            "duration": 3600  # 1 hour
        },
        "rarity": "uncommon"
    },
    {
        "id": "golden_sashimi",
        "name": "Golden Sashimi",
        "description": "Raw fish prepared with gold leaf. A delicacy that increases catch value.",
        "ingredients": [
            {"item": "premium_fish", "count": 2},
            {"item": "gold_flakes", "count": 5},
            {"item": "wasabi_root", "count": 1},
            {"item": "soy_sauce", "count": 1}
        ],
        "cooking_time": 60,  # 1 minute
        "effects": {
            "catch_value_multiplier": 1.5,
            "duration": 1800  # 30 minutes
        },
        "rarity": "rare"
    },
    {
        "id": "kraken_ink_pasta",
        "name": "Kraken Ink Pasta",
        "description": "Pasta made with real kraken ink. Grants temporary intimidation aura.",
        "ingredients": [
            {"item": "kraken_ink", "count": 1},
            {"item": "sea_wheat_flour", "count": 3},
            {"item": "giant_squid_tentacle", "count": 1},
            {"item": "garlic", "count": 2}
        ],
        "cooking_time": 480,  # 8 minutes
        "effects": {
            "intimidation_aura": True,
            "sea_monster_deterrent": 30,
            "duration": 2400  # 40 minutes
        },
        "rarity": "legendary"
    },
    {
        "id": "phoenix_fish_fry",
        "name": "Phoenix Fish Fry",
        "description": "A fiery dish that grants fire resistance and resurrection chance.",
        "ingredients": [
            {"item": "volcanic_fish", "count": 2},
            {"item": "dragon_pepper", "count": 3},
            {"item": "phoenix_feather", "count": 1},
            {"item": "eternal_flame_oil", "count": 1}
        ],
        "cooking_time": 900,  # 15 minutes
        "effects": {
            "fire_resistance": 100,
            "resurrection_chance": 0.1,
            "duration": 3600  # 1 hour
        },
        "rarity": "legendary"
    },
    {
        "id": "ghost_fish_soup",
        "name": "Spectral Soup",
        "description": "A translucent soup that allows you to see hidden things.",
        "ingredients": [
            {"item": "ghost_fish", "count": 1},
            {"item": "spirit_water", "count": 3},
            {"item": "ethereal_herbs", "count": 2}
        ],
        "cooking_time": 666,  # ~11 minutes
        "effects": {
            "see_invisible": True,
            "ghost_communication": True,
            "duration": 600  # 10 minutes
        },
        "rarity": "legendary"
    }
]

# ============================================================================
# SECTION 5: PIRATE MAIL SYSTEM
# ============================================================================

ISLAND_PIRATE = {
    "id": "captain_flint",
    "name": "Captain Josiah Flint",
    "title": "The Hermit Pirate",
    "location": "hidden_isle",
    "description": "A legendary pirate who retired to a secret island. He sends mail to worthy fishers.",
    "personality": "eccentric_but_wise",
    "mail_interval_hours": 24,  # Sends mail once per day at most
    "conditions_to_contact": ["catch_rare_fish", "reach_stage_50", "find_bottle"]
}

PIRATE_MAIL_TEMPLATES = [
    {
        "id": "pm_001",
        "subject": "Greetings from the Island",
        "content": """Ahoy there, fisher!

Captain Flint here. Word of your exploits has reached even my hidden isle. I like what I hear.

In my sailing days, I collected recipes from every port in the known world. Seems a shame to let them die with me. So I've decided to share one with you.

Enclosed you'll find the recipe for my famous Storm Caller's Chowder. Cook it before a voyage, and the storms themselves will part for your ship.

Don't tell anyone where you got it.

Fair winds,
Captain Flint

P.S. - If you ever find a bottle with my seal on it, don't ignore it. I only reach out to those the sea deems worthy.""",
        "attachment_type": "recipe",
        "attachment_id": "storm_callers_chowder",
        "conditions": {"stages_visited": 10}
    },
    {
        "id": "pm_002",
        "subject": "A Warning and a Gift",
        "content": """Fisher,

I've been watching the currents. Something's stirring in the deep. The fish are acting strange - migrating early, swimming in patterns I haven't seen in fifty years.

Last time this happened... well, let's just say the Storm of the Century followed.

I'm sending you a recipe for Emergency Rations. They don't taste good, but they'll keep you alive when everything else fails. Make a batch. Keep them on your ship.

You'll thank me later.

- Flint

P.S. - The recipe for proper seasoning is on the back. Don't skip it, or you'll be eating cardboard.""",
        "attachment_type": "recipe",
        "attachment_id": "emergency_rations",
        "conditions": {"days_played": 7}
    },
    {
        "id": "pm_003",
        "subject": "I Know What You Caught",
        "content": """Well, well, well...

A ${rare_fish_name}, eh? Do you have ANY idea how rare that is? I spent twenty years trying to catch one of those!

You've got talent, fisher. Real talent.

As a reward for achieving what I never could, here's my most guarded secret - the recipe for Captain's Pride. It's what I ate before every major expedition. Some say it's why I survived things that killed lesser pirates.

The main ingredient is ironic, I know. You'll need that fish you just caught. But trust me - the result is worth it.

Jealously yours,
Captain Flint""",
        "attachment_type": "recipe",
        "attachment_id": "captains_pride",
        "conditions": {"caught_rare_fish": True}
    },
    {
        "id": "pm_004",
        "subject": "Regarding That Map",
        "content": """So you found one of my map fragments, did you?

Yes, they're real. Yes, there's treasure. No, I'm not going to tell you where the other pieces are. Where's the fun in that?

But since you've proven yourself resourceful enough to find one piece, I'll give you a hint:

"The second piece lies where the sun sleeps,
Where coral towers rise from the deeps,
Ask the oldest fisher you can find,
And remember - the best treasures are of the mind."

Also, here's a recipe for Treasure Hunter's Tea. It won't help you find the map, but it'll keep you warm while you search.

Happy hunting,
Flint""",
        "attachment_type": "recipe",
        "attachment_id": "treasure_hunters_tea",
        "conditions": {"found_map_fragment": True}
    },
    {
        "id": "pm_005",
        "subject": "The Final Recipe",
        "content": """Fisher,

You've done well. Better than anyone I've contacted in years.

I'm an old man now. These bones won't last much longer. Before I sail off into whatever comes next, I want to pass on my greatest creation.

The World Fish's Banquet.

It's not just a recipe - it's a ritual. Cooked properly, it summons... well, you'll see. The ingredients are nearly impossible to find, but you're the type who doesn't give up.

This is my legacy. Use it wisely.

Final voyage awaits,
Captain Josiah Flint

P.S. - When you do catch that World Fish (and I believe you will), pour one out for old Flint. I'll be watching from somewhere.""",
        "attachment_type": "recipe",
        "attachment_id": "world_fish_banquet",
        "conditions": {"legendary_catches": 5}
    }
]

# Additional recipe from pirate mail
PIRATE_MAIL_RECIPES = [
    {
        "id": "storm_callers_chowder",
        "name": "Storm Caller's Chowder",
        "description": "Captain Flint's personal recipe. Calms storms in a radius around your ship.",
        "ingredients": [
            {"item": "storm_fish", "count": 2},
            {"item": "lightning_kelp", "count": 3},
            {"item": "cream", "count": 2},
            {"item": "thunder_salt", "count": 1}
        ],
        "cooking_time": 420,  # 7 minutes
        "effects": {
            "storm_calming": True,
            "radius": 1000,
            "duration": 7200  # 2 hours
        },
        "rarity": "legendary",
        "source": "pirate_mail"
    },
    {
        "id": "emergency_rations",
        "name": "Emergency Rations",
        "description": "Long-lasting food for desperate times. Tastes terrible but saves lives.",
        "ingredients": [
            {"item": "hardtack", "count": 10},
            {"item": "dried_fish", "count": 5},
            {"item": "preserving_salt", "count": 3},
            {"item": "wax_seal", "count": 2}
        ],
        "cooking_time": 600,  # 10 minutes
        "effects": {
            "food_value": 200,
            "shelf_life": "infinite",
            "taste": -50
        },
        "rarity": "rare",
        "source": "pirate_mail"
    },
    {
        "id": "captains_pride",
        "name": "Captain's Pride",
        "description": "The signature dish of Captain Flint. Grants significant temporary stat boosts.",
        "ingredients": [
            {"item": "rare_fish", "count": 1},
            {"item": "exotic_spices", "count": 4},
            {"item": "aged_rum", "count": 1},
            {"item": "secret_sauce", "count": 1}
        ],
        "cooking_time": 900,  # 15 minutes
        "effects": {
            "all_stats_bonus": 15,
            "luck_bonus": 25,
            "courage_bonus": 30,
            "duration": 3600  # 1 hour
        },
        "rarity": "legendary",
        "source": "pirate_mail"
    },
    {
        "id": "treasure_hunters_tea",
        "name": "Treasure Hunter's Tea",
        "description": "A warming brew that slightly increases the chance of finding valuables.",
        "ingredients": [
            {"item": "sea_chamomile", "count": 3},
            {"item": "gold_dust", "count": 1},
            {"item": "honey", "count": 2},
            {"item": "hot_water", "count": 1}
        ],
        "cooking_time": 120,  # 2 minutes
        "effects": {
            "treasure_find_bonus": 10,
            "warmth": 50,
            "duration": 1800  # 30 minutes
        },
        "rarity": "uncommon",
        "source": "pirate_mail"
    },
    {
        "id": "world_fish_banquet",
        "name": "World Fish's Banquet",
        "description": "The ultimate recipe. Legends say it can summon the World Fish itself.",
        "ingredients": [
            {"item": "legendary_fish", "count": 5},
            {"item": "essence_of_ocean", "count": 1},
            {"item": "stardust", "count": 3},
            {"item": "tears_of_mermaid", "count": 1},
            {"item": "eternal_flame", "count": 1}
        ],
        "cooking_time": 3600,  # 1 hour
        "effects": {
            "summon_world_fish": True,
            "legendary_event": True,
            "one_time_use": True
        },
        "rarity": "mythic",
        "source": "pirate_mail"
    }
]

# ============================================================================
# SECTION 6: PYDANTIC MODELS
# ============================================================================

class BottleEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    bottle_type: str
    contents: Dict
    found_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    location_stage: Optional[int] = None
    opened: bool = False

class PirateMail(BaseModel):
    mail_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    template_id: str
    subject: str
    content: str
    attachment_type: Optional[str] = None
    attachment_id: Optional[str] = None
    sent_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    read: bool = False
    claimed: bool = False

# ============================================================================
# SECTION 7: API ROUTES
# ============================================================================

@router.post("/check-bottle/{user_id}")
async def check_for_bottle(user_id: str, stage_id: Optional[int] = None):
    """Check if a bottle event triggers (3% chance)"""
    # Roll for bottle
    if random.random() > BOTTLE_TRIGGER_CHANCE:
        return {"found_bottle": False}
    
    # Determine bottle type based on rarity
    roll = random.random()
    cumulative = 0
    selected_bottle = None
    
    for bottle_type, data in BOTTLE_TYPES.items():
        cumulative += data["rarity"]
        if roll <= cumulative:
            selected_bottle = data
            break
    
    if not selected_bottle:
        selected_bottle = list(BOTTLE_TYPES.values())[0]
    
    # Generate contents based on bottle type
    contents = generate_bottle_contents(selected_bottle["id"])
    
    # Create bottle event
    event = BottleEvent(
        user_id=user_id,
        bottle_type=selected_bottle["id"],
        contents=contents,
        location_stage=stage_id
    )
    
    # Save to database
    await db.bottle_events.insert_one(event.model_dump())
    
    return {
        "found_bottle": True,
        "bottle": {
            "event_id": event.event_id,
            "type": selected_bottle["id"],
            "name": selected_bottle["name"],
            "description": selected_bottle["description"],
            "sprite": selected_bottle["sprite"]
        }
    }

def generate_bottle_contents(bottle_type: str) -> Dict:
    """Generate contents based on bottle type"""
    if bottle_type == "mysterious_message":
        message = random.choice(MYSTERIOUS_MESSAGES)
        return {
            "type": "message",
            "data": message
        }
    elif bottle_type == "treasure_map":
        fragment = random.choice(list(TREASURE_MAP_FRAGMENTS.values()))
        return {
            "type": "map_fragment",
            "data": fragment
        }
    elif bottle_type == "rare_recipe":
        recipe = random.choice(RARE_RECIPES)
        return {
            "type": "recipe",
            "data": recipe
        }
    elif bottle_type == "pirate_letter":
        return {
            "type": "pirate_contact",
            "data": {
                "message": "A letter from the mysterious Captain Flint! He seems to want to contact you...",
                "unlocks": "pirate_mail_system"
            }
        }
    elif bottle_type == "cursed_bottle":
        is_curse = random.random() < 0.5
        if is_curse:
            return {
                "type": "curse",
                "data": {
                    "effect": "bad_luck",
                    "duration": 3600,
                    "description": "A dark spirit escapes the bottle and curses you!",
                    "cure": "visit_fortune_teller"
                }
            }
        else:
            return {
                "type": "blessing",
                "data": {
                    "effect": "good_luck",
                    "duration": 7200,
                    "description": "A trapped spirit thanks you for releasing it and grants a blessing!"
                }
            }
    elif bottle_type == "golden_bottle":
        return {
            "type": "legendary_reward",
            "data": {
                "gold": random.randint(500, 2000),
                "item": random.choice(["golden_lure", "ancient_rod", "legendary_bait"]),
                "title_unlock": "Fortune's Favorite"
            }
        }
    return {"type": "empty", "data": {}}

@router.post("/open-bottle/{event_id}")
async def open_bottle(event_id: str, user_id: str):
    """Open a found bottle to reveal its contents"""
    event = await db.bottle_events.find_one(
        {"event_id": event_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not event:
        raise HTTPException(status_code=404, detail="Bottle event not found")
    
    if event.get("opened"):
        return {"already_opened": True, "contents": event["contents"]}
    
    # Mark as opened
    await db.bottle_events.update_one(
        {"event_id": event_id},
        {"$set": {"opened": True}}
    )
    
    # Apply rewards
    contents = event["contents"]
    rewards_applied = []
    
    if contents["type"] == "recipe":
        # Add recipe to user's collection
        await db.user_recipes.update_one(
            {"user_id": user_id},
            {"$addToSet": {"recipes": contents["data"]["id"]}},
            upsert=True
        )
        rewards_applied.append(f"Learned recipe: {contents['data']['name']}")
    
    elif contents["type"] == "map_fragment":
        # Add map fragment to user's collection
        await db.user_maps.update_one(
            {"user_id": user_id},
            {"$addToSet": {"fragments": contents["data"]["id"]}},
            upsert=True
        )
        rewards_applied.append(f"Found map fragment: {contents['data']['set_name']} ({contents['data']['fragment_number']}/{contents['data']['total_fragments']})")
    
    elif contents["type"] == "message":
        # Apply message rewards
        reward = contents["data"].get("reward", {})
        if "xp" in reward:
            await db.users.update_one(
                {"id": user_id},
                {"$inc": {"xp": reward["xp"]}}
            )
            rewards_applied.append(f"Gained {reward['xp']} XP")
        if "gold" in reward:
            await db.users.update_one(
                {"id": user_id},
                {"$inc": {"gold": reward["gold"]}}
            )
            rewards_applied.append(f"Found {reward['gold']} gold")
    
    elif contents["type"] == "legendary_reward":
        data = contents["data"]
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"gold": data.get("gold", 0)}}
        )
        if data.get("item"):
            await db.user_inventory.update_one(
                {"user_id": user_id},
                {"$push": {"items": data["item"]}},
                upsert=True
            )
        rewards_applied.append(f"Found {data.get('gold', 0)} gold and {data.get('item', 'nothing')}!")
    
    elif contents["type"] == "curse":
        # Apply curse
        await db.user_effects.update_one(
            {"user_id": user_id},
            {"$push": {"active_effects": {
                "type": "curse",
                "effect": contents["data"]["effect"],
                "expires": (datetime.now(timezone.utc) + timedelta(seconds=contents["data"]["duration"])).isoformat()
            }}},
            upsert=True
        )
        rewards_applied.append("You've been cursed! Visit the fortune teller to lift it.")
    
    elif contents["type"] == "blessing":
        # Apply blessing
        await db.user_effects.update_one(
            {"user_id": user_id},
            {"$push": {"active_effects": {
                "type": "blessing",
                "effect": contents["data"]["effect"],
                "expires": (datetime.now(timezone.utc) + timedelta(seconds=contents["data"]["duration"])).isoformat()
            }}},
            upsert=True
        )
        rewards_applied.append("You've been blessed! Good fortune awaits!")
    
    elif contents["type"] == "pirate_contact":
        # Unlock pirate mail system
        await db.user_unlocks.update_one(
            {"user_id": user_id},
            {"$set": {"pirate_mail_unlocked": True}},
            upsert=True
        )
        rewards_applied.append("Pirate Mail system unlocked! Check your mailbox for messages from Captain Flint.")
    
    return {
        "opened": True,
        "bottle_type": event["bottle_type"],
        "contents": contents,
        "rewards_applied": rewards_applied
    }

@router.get("/bottles/{user_id}")
async def get_user_bottles(user_id: str, include_opened: bool = False):
    """Get all bottles found by user"""
    query = {"user_id": user_id}
    if not include_opened:
        query["opened"] = False
    
    bottles = await db.bottle_events.find(query, {"_id": 0}).to_list(100)
    return {"bottles": bottles, "total": len(bottles)}

@router.get("/pirate-mail/{user_id}")
async def get_pirate_mail(user_id: str):
    """Get all pirate mail for user"""
    # Check if unlocked
    unlocks = await db.user_unlocks.find_one({"user_id": user_id}, {"_id": 0})
    if not unlocks or not unlocks.get("pirate_mail_unlocked"):
        return {"unlocked": False, "mail": []}
    
    mail = await db.pirate_mail.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("sent_at", -1).to_list(50)
    
    return {"unlocked": True, "mail": mail, "total": len(mail)}

@router.post("/pirate-mail/check/{user_id}")
async def check_for_pirate_mail(user_id: str):
    """Check if user should receive new pirate mail"""
    # Check if unlocked
    unlocks = await db.user_unlocks.find_one({"user_id": user_id})
    if not unlocks or not unlocks.get("pirate_mail_unlocked"):
        return {"new_mail": False, "reason": "Pirate mail not unlocked"}
    
    # Check last mail time
    last_mail = await db.pirate_mail.find_one(
        {"user_id": user_id},
        {"_id": 0}
    )
    
    if last_mail:
        last_sent = datetime.fromisoformat(last_mail["sent_at"])
        hours_since = (datetime.now(timezone.utc) - last_sent).total_seconds() / 3600
        if hours_since < ISLAND_PIRATE["mail_interval_hours"]:
            return {"new_mail": False, "reason": "Too soon since last mail"}
    
    # Get user stats to determine which mail to send
    user_stats = await db.users.find_one({"id": user_id}, {"_id": 0})
    
    # Find eligible mail templates
    eligible_templates = []
    for template in PIRATE_MAIL_TEMPLATES:
        conditions_met = True
        # Check conditions (simplified - would be more complex in production)
        eligible_templates.append(template)
    
    if not eligible_templates:
        return {"new_mail": False, "reason": "No eligible mail templates"}
    
    # Select and send mail
    selected_template = random.choice(eligible_templates)
    
    mail = PirateMail(
        user_id=user_id,
        template_id=selected_template["id"],
        subject=selected_template["subject"],
        content=selected_template["content"],
        attachment_type=selected_template.get("attachment_type"),
        attachment_id=selected_template.get("attachment_id")
    )
    
    await db.pirate_mail.insert_one(mail.model_dump())
    
    return {
        "new_mail": True,
        "mail": {
            "mail_id": mail.mail_id,
            "subject": mail.subject,
            "from": ISLAND_PIRATE["name"]
        }
    }

@router.post("/pirate-mail/read/{mail_id}")
async def read_pirate_mail(mail_id: str, user_id: str):
    """Read and claim pirate mail"""
    mail = await db.pirate_mail.find_one(
        {"mail_id": mail_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not mail:
        raise HTTPException(status_code=404, detail="Mail not found")
    
    # Mark as read
    await db.pirate_mail.update_one(
        {"mail_id": mail_id},
        {"$set": {"read": True}}
    )
    
    # Claim attachment if not already claimed
    rewards = []
    if not mail.get("claimed") and mail.get("attachment_type"):
        if mail["attachment_type"] == "recipe":
            # Find the recipe
            recipe = next((r for r in PIRATE_MAIL_RECIPES if r["id"] == mail["attachment_id"]), None)
            if recipe:
                await db.user_recipes.update_one(
                    {"user_id": user_id},
                    {"$addToSet": {"recipes": recipe["id"]}},
                    upsert=True
                )
                rewards.append(f"Learned recipe: {recipe['name']}")
        
        await db.pirate_mail.update_one(
            {"mail_id": mail_id},
            {"$set": {"claimed": True}}
        )
    
    return {
        "mail": mail,
        "rewards_claimed": rewards,
        "pirate": ISLAND_PIRATE
    }

@router.get("/recipes/{user_id}")
async def get_user_recipes(user_id: str):
    """Get all recipes known by user"""
    user_recipes = await db.user_recipes.find_one({"user_id": user_id}, {"_id": 0})
    
    if not user_recipes:
        return {"recipes": [], "total": 0}
    
    # Get full recipe details
    known_ids = user_recipes.get("recipes", [])
    all_recipes = RARE_RECIPES + PIRATE_MAIL_RECIPES
    known_recipes = [r for r in all_recipes if r["id"] in known_ids]
    
    return {"recipes": known_recipes, "total": len(known_recipes)}

@router.get("/map-progress/{user_id}")
async def get_map_progress(user_id: str):
    """Get user's treasure map progress"""
    user_maps = await db.user_maps.find_one({"user_id": user_id}, {"_id": 0})
    
    if not user_maps:
        return {"maps": [], "completed": []}
    
    fragments = user_maps.get("fragments", [])
    
    # Group by map set
    map_sets = {}
    for frag_id in fragments:
        fragment = TREASURE_MAP_FRAGMENTS.get(frag_id)
        if fragment:
            set_name = fragment["set_name"]
            if set_name not in map_sets:
                map_sets[set_name] = {
                    "name": set_name,
                    "fragments_found": [],
                    "total_fragments": fragment["total_fragments"],
                    "treasure_value": fragment["treasure_value"]
                }
            map_sets[set_name]["fragments_found"].append(fragment["fragment_number"])
    
    # Check for completed maps
    completed = []
    for set_name, data in map_sets.items():
        if len(data["fragments_found"]) == data["total_fragments"]:
            completed.append(set_name)
    
    return {
        "maps": list(map_sets.values()),
        "completed": completed
    }
