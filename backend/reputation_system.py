"""
Complex Reputation System
Features:
- Multiple factions
- Reputation levels with unique names
- Faction relationships
- Reputation-gated content
- Reputation decay/growth
- Special faction events
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid

router = APIRouter(prefix="/api/reputation", tags=["reputation"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# FACTIONS
# ============================================================================

FACTIONS = {
    "fishermen_guild": {
        "id": "fishermen_guild",
        "name": "Fishermen's Guild",
        "description": "The official organization of professional fishers. They value tradition, skill, and fair dealing.",
        "color": "#2e7d32",
        "icon": "fish_hook",
        "leader": "guild_master_thornwood",
        "headquarters": "guild_hall",
        "benefits": {
            "friendly": ["guild_shop_access", "fishing_tips"],
            "honored": ["guild_quests", "discount_10"],
            "revered": ["advanced_training", "discount_20", "guild_boat"],
            "exalted": ["master_techniques", "discount_30", "guild_title"]
        },
        "enemies": ["pirates"],
        "allies": ["merchants", "port_authority"],
        "neutral": ["mystics", "scholars"]
    },
    "pirates": {
        "id": "pirates",
        "name": "The Pirate Brotherhood",
        "description": "Outlaws of the sea. They respect strength, cunning, and loyalty to the code.",
        "color": "#b71c1c",
        "icon": "skull_crossbones",
        "leader": "captain_redbeard",
        "headquarters": "skull_island",
        "benefits": {
            "friendly": ["pirate_haven_access", "black_market"],
            "honored": ["pirate_quests", "smuggling_routes"],
            "revered": ["pirate_crew_join", "treasure_maps"],
            "exalted": ["pirate_ship", "pirate_title", "full_haven_access"]
        },
        "enemies": ["port_authority", "navy"],
        "allies": ["smugglers", "black_market"],
        "neutral": ["mystics"]
    },
    "merchants": {
        "id": "merchants",
        "name": "Merchant Consortium",
        "description": "The trade alliance that keeps commerce flowing. They value profit, reliability, and connections.",
        "color": "#ff8f00",
        "icon": "gold_coins",
        "leader": "merchant_marina",
        "headquarters": "port_prosperity",
        "benefits": {
            "friendly": ["better_fish_prices", "trade_info"],
            "honored": ["exclusive_goods", "price_bonus_10"],
            "revered": ["trade_contracts", "price_bonus_20"],
            "exalted": ["merchant_ship", "price_bonus_30", "trade_monopoly"]
        },
        "enemies": [],
        "allies": ["fishermen_guild", "port_authority"],
        "neutral": ["pirates", "mystics"]
    },
    "port_authority": {
        "id": "port_authority",
        "name": "Port Authority",
        "description": "The official governing body of ports and harbors. They value order, law, and documentation.",
        "color": "#1565c0",
        "icon": "anchor",
        "leader": "harbor_master_jenkins",
        "headquarters": "harbor_office",
        "benefits": {
            "friendly": ["reduced_fees", "fast_processing"],
            "honored": ["priority_docking", "permit_waivers"],
            "revered": ["naval_protection", "government_contracts"],
            "exalted": ["official_title", "harbor_master_access"]
        },
        "enemies": ["pirates", "smugglers"],
        "allies": ["merchants", "fishermen_guild"],
        "neutral": []
    },
    "mystics": {
        "id": "mystics",
        "name": "Order of the Deep",
        "description": "Seers, witches, and those who commune with the sea spirits. They value knowledge and respect for the supernatural.",
        "color": "#7b1fa2",
        "icon": "crystal_ball",
        "leader": "fortune_teller_coral",
        "headquarters": "spirit_waters",
        "benefits": {
            "friendly": ["fortune_readings", "blessing_access"],
            "honored": ["curse_removal", "spirit_contact"],
            "revered": ["magical_items", "prophecy_access"],
            "exalted": ["mystic_powers", "spirit_familiar"]
        },
        "enemies": [],
        "allies": [],
        "neutral": ["fishermen_guild", "pirates", "merchants"]
    },
    "underwater_kingdom": {
        "id": "underwater_kingdom",
        "name": "Underwater Kingdom",
        "description": "The hidden civilization beneath the waves. They value environmental respect and diplomatic honesty.",
        "color": "#00bcd4",
        "icon": "trident",
        "leader": "king_finnius",
        "headquarters": "coral_palace",
        "benefits": {
            "friendly": ["underwater_breathing_short", "kingdom_trade"],
            "honored": ["underwater_exploration", "mermaid_allies"],
            "revered": ["underwater_city_access", "special_fish_access"],
            "exalted": ["ambassador_status", "underwater_home", "legendary_fish_hints"]
        },
        "enemies": ["polluters"],
        "allies": ["mystics"],
        "neutral": []
    },
    "scholars": {
        "id": "scholars",
        "name": "Maritime Academy",
        "description": "Researchers and academics studying the sea. They value knowledge, discovery, and documentation.",
        "color": "#5d4037",
        "icon": "book",
        "leader": "university_dean",
        "headquarters": "maritime_university",
        "benefits": {
            "friendly": ["research_access", "fish_identification"],
            "honored": ["expedition_membership", "rare_knowledge"],
            "revered": ["research_funding", "discovery_naming"],
            "exalted": ["professor_title", "permanent_research_team"]
        },
        "enemies": [],
        "allies": ["fishermen_guild"],
        "neutral": ["pirates", "mystics"]
    },
    "craftsmen": {
        "id": "craftsmen",
        "name": "Shipwright's Union",
        "description": "Builders, repairers, and creators. They value quality craftsmanship and fair pricing.",
        "color": "#6d4c41",
        "icon": "hammer",
        "leader": "shipwright_igor",
        "headquarters": "grand_shipyard",
        "benefits": {
            "friendly": ["repair_discount_10", "upgrade_access"],
            "honored": ["custom_orders", "repair_discount_20"],
            "revered": ["master_crafted_items", "repair_discount_30"],
            "exalted": ["legendary_commissions", "free_repairs"]
        },
        "enemies": [],
        "allies": ["merchants"],
        "neutral": ["pirates"]
    },
    "innkeepers": {
        "id": "innkeepers",
        "name": "Hospitality Guild",
        "description": "Tavern owners and innkeepers. They value hospitality, good stories, and paying customers.",
        "color": "#8d6e63",
        "icon": "bed",
        "leader": "tavern_keeper_rosie",
        "headquarters": "salty_dog_inn",
        "benefits": {
            "friendly": ["free_drinks", "gossip_access"],
            "honored": ["room_discount", "secret_meetings"],
            "revered": ["private_suite", "information_network"],
            "exalted": ["inn_ownership_option", "guild_contacts"]
        },
        "enemies": [],
        "allies": [],
        "neutral": ["everyone"]
    }
}

# ============================================================================
# REPUTATION LEVELS
# ============================================================================

REPUTATION_LEVELS = [
    {"level": -3, "name": "Hated", "min_rep": -1000, "max_rep": -500, "color": "#8b0000"},
    {"level": -2, "name": "Hostile", "min_rep": -500, "max_rep": -200, "color": "#dc143c"},
    {"level": -1, "name": "Unfriendly", "min_rep": -200, "max_rep": -1, "color": "#ff6347"},
    {"level": 0, "name": "Neutral", "min_rep": 0, "max_rep": 499, "color": "#808080"},
    {"level": 1, "name": "Friendly", "min_rep": 500, "max_rep": 2999, "color": "#90ee90"},
    {"level": 2, "name": "Honored", "min_rep": 3000, "max_rep": 8999, "color": "#32cd32"},
    {"level": 3, "name": "Revered", "min_rep": 9000, "max_rep": 20999, "color": "#228b22"},
    {"level": 4, "name": "Exalted", "min_rep": 21000, "max_rep": 999999, "color": "#ffd700"}
]

def get_reputation_level(rep_value: int) -> Dict:
    """Get reputation level info from value"""
    for level in REPUTATION_LEVELS:
        if level["min_rep"] <= rep_value <= level["max_rep"]:
            return level
    return REPUTATION_LEVELS[3]  # Default to neutral

# ============================================================================
# REPUTATION ACTIONS
# ============================================================================

REPUTATION_ACTIONS = {
    # Positive actions
    "complete_quest": {"base": 250, "description": "Complete a faction quest"},
    "donate_fish": {"base": 10, "per_fish": True, "description": "Donate fish to faction"},
    "help_npc": {"base": 50, "description": "Help a faction member"},
    "trade_fairly": {"base": 25, "description": "Complete fair trade"},
    "defend_member": {"base": 150, "description": "Defend a faction member"},
    "major_discovery": {"base": 500, "description": "Make a major discovery for faction"},
    "faction_event": {"base": 300, "description": "Participate in faction event"},
    
    # Negative actions
    "attack_member": {"base": -500, "description": "Attack a faction member"},
    "steal_from": {"base": -300, "description": "Steal from faction"},
    "break_deal": {"base": -200, "description": "Break an agreement"},
    "help_enemy": {"base": -150, "description": "Help faction's enemy"},
    "insult_leader": {"base": -100, "description": "Insult faction leader"}
}

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class UserReputation(BaseModel):
    user_id: str
    faction_id: str
    reputation: int = 0
    level: str = "Neutral"
    last_change: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    history: List[Dict] = Field(default_factory=list)

class ReputationChange(BaseModel):
    user_id: str
    faction_id: str
    amount: int
    reason: str
    related_quest: Optional[str] = None

# ============================================================================
# API ROUTES
# ============================================================================

@router.get("/factions")
async def get_all_factions():
    """Get all factions"""
    return {"factions": list(FACTIONS.values()), "total": len(FACTIONS)}

@router.get("/factions/{faction_id}")
async def get_faction(faction_id: str):
    """Get a specific faction"""
    faction = FACTIONS.get(faction_id)
    if not faction:
        raise HTTPException(status_code=404, detail="Faction not found")
    return faction

@router.get("/levels")
async def get_reputation_levels():
    """Get all reputation levels"""
    return {"levels": REPUTATION_LEVELS}

@router.get("/user/{user_id}")
async def get_user_reputation(user_id: str):
    """Get user's reputation with all factions"""
    reputations = await db.user_reputation.find(
        {"user_id": user_id},
        {"_id": 0}
    ).to_list(20)
    
    # Fill in missing factions with neutral
    rep_dict = {r["faction_id"]: r for r in reputations}
    
    all_reps = []
    for faction_id, faction in FACTIONS.items():
        if faction_id in rep_dict:
            rep = rep_dict[faction_id]
        else:
            rep = {
                "faction_id": faction_id,
                "reputation": 0,
                "level": "Neutral"
            }
        
        rep["faction_name"] = faction["name"]
        rep["faction_color"] = faction["color"]
        level_info = get_reputation_level(rep["reputation"])
        rep["level"] = level_info["name"]
        rep["level_color"] = level_info["color"]
        rep["benefits"] = get_current_benefits(faction_id, level_info["name"].lower())
        all_reps.append(rep)
    
    return {"reputations": all_reps}

@router.get("/user/{user_id}/faction/{faction_id}")
async def get_user_faction_reputation(user_id: str, faction_id: str):
    """Get user's reputation with a specific faction"""
    faction = FACTIONS.get(faction_id)
    if not faction:
        raise HTTPException(status_code=404, detail="Faction not found")
    
    rep = await db.user_reputation.find_one(
        {"user_id": user_id, "faction_id": faction_id},
        {"_id": 0}
    )
    
    if not rep:
        rep = {"reputation": 0, "level": "Neutral", "history": []}
    
    level_info = get_reputation_level(rep["reputation"])
    
    return {
        "faction": faction,
        "reputation": rep["reputation"],
        "level": level_info["name"],
        "level_info": level_info,
        "benefits": get_current_benefits(faction_id, level_info["name"].lower()),
        "next_level": get_next_level_info(rep["reputation"]),
        "history": rep.get("history", [])[-10:]  # Last 10 changes
    }

def get_current_benefits(faction_id: str, level_name: str) -> List[str]:
    """Get benefits available at current level"""
    faction = FACTIONS.get(faction_id)
    if not faction:
        return []
    
    benefits = []
    level_order = ["friendly", "honored", "revered", "exalted"]
    
    if level_name in level_order:
        level_index = level_order.index(level_name)
        for i in range(level_index + 1):
            level = level_order[i]
            benefits.extend(faction.get("benefits", {}).get(level, []))
    
    return benefits

def get_next_level_info(current_rep: int) -> Optional[Dict]:
    """Get info about the next reputation level"""
    current = get_reputation_level(current_rep)
    current_index = REPUTATION_LEVELS.index(current)
    
    if current_index < len(REPUTATION_LEVELS) - 1:
        next_level = REPUTATION_LEVELS[current_index + 1]
        return {
            "name": next_level["name"],
            "required": next_level["min_rep"],
            "needed": next_level["min_rep"] - current_rep
        }
    return None

@router.post("/change")
async def change_reputation(change: ReputationChange):
    """Change user's reputation with a faction"""
    faction = FACTIONS.get(change.faction_id)
    if not faction:
        raise HTTPException(status_code=404, detail="Faction not found")
    
    # Get current reputation
    current = await db.user_reputation.find_one(
        {"user_id": change.user_id, "faction_id": change.faction_id}
    )
    
    current_rep = current["reputation"] if current else 0
    new_rep = current_rep + change.amount
    
    level_info = get_reputation_level(new_rep)
    
    # Create history entry
    history_entry = {
        "amount": change.amount,
        "reason": change.reason,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "quest": change.related_quest
    }
    
    # Update database
    await db.user_reputation.update_one(
        {"user_id": change.user_id, "faction_id": change.faction_id},
        {
            "$set": {
                "reputation": new_rep,
                "level": level_info["name"],
                "last_change": datetime.now(timezone.utc).isoformat()
            },
            "$push": {"history": history_entry}
        },
        upsert=True
    )
    
    # Check for spillover effects
    spillover = await calculate_spillover(change.faction_id, change.amount, change.user_id)
    
    # Check if level changed
    old_level = get_reputation_level(current_rep)
    level_changed = old_level["name"] != level_info["name"]
    
    return {
        "faction": change.faction_id,
        "old_reputation": current_rep,
        "new_reputation": new_rep,
        "change": change.amount,
        "level": level_info["name"],
        "level_changed": level_changed,
        "spillover_effects": spillover,
        "new_benefits": get_current_benefits(change.faction_id, level_info["name"].lower()) if level_changed else []
    }

async def calculate_spillover(faction_id: str, amount: int, user_id: str) -> List[Dict]:
    """Calculate reputation spillover to allied/enemy factions"""
    faction = FACTIONS.get(faction_id)
    if not faction:
        return []
    
    spillover = []
    
    # Allies gain 25% of positive reputation
    if amount > 0:
        for ally_id in faction.get("allies", []):
            ally_amount = int(amount * 0.25)
            if ally_amount > 0:
                await db.user_reputation.update_one(
                    {"user_id": user_id, "faction_id": ally_id},
                    {"$inc": {"reputation": ally_amount}},
                    upsert=True
                )
                spillover.append({"faction": ally_id, "amount": ally_amount, "type": "ally_bonus"})
    
    # Enemies lose 50% of positive reputation gained
    if amount > 0:
        for enemy_id in faction.get("enemies", []):
            enemy_amount = int(amount * -0.5)
            await db.user_reputation.update_one(
                {"user_id": user_id, "faction_id": enemy_id},
                {"$inc": {"reputation": enemy_amount}},
                upsert=True
            )
            spillover.append({"faction": enemy_id, "amount": enemy_amount, "type": "enemy_penalty"})
    
    # If you help enemies, you lose 25% with original faction's allies
    if amount < 0:
        for ally_id in faction.get("allies", []):
            ally_loss = int(amount * 0.25)
            await db.user_reputation.update_one(
                {"user_id": user_id, "faction_id": ally_id},
                {"$inc": {"reputation": ally_loss}},
                upsert=True
            )
            spillover.append({"faction": ally_id, "amount": ally_loss, "type": "ally_sympathy"})
    
    return spillover

@router.get("/user/{user_id}/standing-summary")
async def get_standing_summary(user_id: str):
    """Get a summary of user's faction standings"""
    reputations = await db.user_reputation.find(
        {"user_id": user_id},
        {"_id": 0}
    ).to_list(20)
    
    summary = {
        "total_factions": len(FACTIONS),
        "standings": {
            "exalted": 0,
            "revered": 0,
            "honored": 0,
            "friendly": 0,
            "neutral": 0,
            "unfriendly": 0,
            "hostile": 0,
            "hated": 0
        },
        "best_standing": None,
        "worst_standing": None
    }
    
    best_rep = -999999
    worst_rep = 999999
    
    for rep in reputations:
        level = get_reputation_level(rep["reputation"])
        level_name = level["name"].lower()
        if level_name in summary["standings"]:
            summary["standings"][level_name] += 1
        
        if rep["reputation"] > best_rep:
            best_rep = rep["reputation"]
            summary["best_standing"] = {
                "faction": rep["faction_id"],
                "reputation": rep["reputation"],
                "level": level["name"]
            }
        
        if rep["reputation"] < worst_rep:
            worst_rep = rep["reputation"]
            summary["worst_standing"] = {
                "faction": rep["faction_id"],
                "reputation": rep["reputation"],
                "level": level["name"]
            }
    
    # Count untracked factions as neutral
    tracked = len(reputations)
    summary["standings"]["neutral"] += (len(FACTIONS) - tracked)
    
    return summary

@router.get("/actions")
async def get_reputation_actions():
    """Get all possible reputation actions"""
    return {"actions": REPUTATION_ACTIONS}

@router.get("/faction/{faction_id}/members")
async def get_faction_members(faction_id: str):
    """Get NPCs belonging to a faction"""
    # This would integrate with the NPC system
    faction = FACTIONS.get(faction_id)
    if not faction:
        raise HTTPException(status_code=404, detail="Faction not found")
    
    return {
        "faction": faction_id,
        "leader": faction.get("leader"),
        "headquarters": faction.get("headquarters")
    }
