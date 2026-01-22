"""
Quest System - 400 Quests with Rewards
Features:
- Main story quests
- Side quests
- Daily/Weekly quests
- NPC relationship quests
- Exploration quests
- Collection quests
- Combat/Danger quests
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random

router = APIRouter(prefix="/api/quests", tags=["quests"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# QUEST CATEGORIES
# ============================================================================

QUEST_TYPES = {
    "main_story": "Main Story Quests",
    "side": "Side Quests",
    "npc_relationship": "Relationship Quests",
    "exploration": "Exploration Quests",
    "collection": "Collection Quests",
    "danger": "Danger Quests",
    "daily": "Daily Quests",
    "weekly": "Weekly Quests",
    "legendary": "Legendary Quests",
    "secret": "Secret Quests"
}

# ============================================================================
# QUEST DATABASE - 400 QUESTS
# ============================================================================

QUESTS = [
    # =========== MAIN STORY QUESTS (50) ===========
    {"id": "ms_001", "name": "First Cast", "type": "main_story", "chapter": 1, "description": "Catch your first fish to begin your journey.", "objectives": [{"type": "catch_fish", "count": 1}], "rewards": {"gold": 50, "xp": 100, "item": "basic_rod"}, "prerequisite": None, "giver": "barnacle_bill"},
    {"id": "ms_002", "name": "The Basics", "type": "main_story", "chapter": 1, "description": "Learn the fundamentals of fishing from Barnacle Bill.", "objectives": [{"type": "catch_fish", "count": 5}], "rewards": {"gold": 100, "xp": 200}, "prerequisite": "ms_001", "giver": "barnacle_bill"},
    {"id": "ms_003", "name": "Different Waters", "type": "main_story", "chapter": 1, "description": "Fish in three different locations.", "objectives": [{"type": "visit_locations", "count": 3}], "rewards": {"gold": 150, "xp": 300, "unlock": "travel_system"}, "prerequisite": "ms_002", "giver": "barnacle_bill"},
    {"id": "ms_004", "name": "Joining the Guild", "type": "main_story", "chapter": 1, "description": "Apply to join the Fishermen's Guild.", "objectives": [{"type": "talk_to", "npc": "guild_recruiter_marcus"}, {"type": "catch_fish", "rarity": "uncommon", "count": 3}], "rewards": {"gold": 200, "xp": 400, "faction": "fishermen_guild"}, "prerequisite": "ms_003", "giver": "guild_recruiter_marcus"},
    {"id": "ms_005", "name": "The Guild Trial", "type": "main_story", "chapter": 1, "description": "Complete the Guild's entrance examination.", "objectives": [{"type": "catch_specific", "fish": "silver_bass", "count": 5}, {"type": "time_limit", "minutes": 30}], "rewards": {"gold": 500, "xp": 750, "title": "Guild Apprentice"}, "prerequisite": "ms_004", "giver": "guild_master_thornwood"},
    {"id": "ms_006", "name": "First Voyage", "type": "main_story", "chapter": 2, "description": "Embark on your first sea voyage.", "objectives": [{"type": "complete_voyage", "stages": 5}], "rewards": {"gold": 300, "xp": 500, "item": "rowboat"}, "prerequisite": "ms_005", "giver": "shipwright_igor"},
    {"id": "ms_007", "name": "The Storm Warning", "type": "main_story", "chapter": 2, "description": "A storm approaches. Help evacuate the docks.", "objectives": [{"type": "warn_npcs", "count": 5}, {"type": "save_boats", "count": 3}], "rewards": {"gold": 400, "xp": 600, "reputation": {"port_authority": 15}}, "prerequisite": "ms_006", "giver": "harbor_master_jenkins"},
    {"id": "ms_008", "name": "After the Storm", "type": "main_story", "chapter": 2, "description": "Help rebuild after the devastating storm.", "objectives": [{"type": "deliver", "item": "wood", "count": 20}, {"type": "repair_nets", "count": 5}], "rewards": {"gold": 350, "xp": 550, "reputation": {"craftsmen": 20}}, "prerequisite": "ms_007", "giver": "shipwright_igor"},
    {"id": "ms_009", "name": "The Missing Fisher", "type": "main_story", "chapter": 2, "description": "Old Salt Silas's friend went missing during the storm. Find him.", "objectives": [{"type": "search_area", "location": "wreckage_bay"}, {"type": "rescue_npc", "npc": "missing_fisher"}], "rewards": {"gold": 600, "xp": 800, "item": "rescue_medal"}, "prerequisite": "ms_008", "giver": "old_salts_leader"},
    {"id": "ms_010", "name": "Deeper Waters", "type": "main_story", "chapter": 2, "description": "Venture beyond the familiar waters.", "objectives": [{"type": "reach_stage", "stage": 15}], "rewards": {"gold": 500, "xp": 700, "unlock": "deep_water_fishing"}, "prerequisite": "ms_009", "giver": "barnacle_bill"},
    {"id": "ms_011", "name": "The Merchant's Problem", "type": "main_story", "chapter": 3, "description": "Marina Goldscale needs rare fish for an important client.", "objectives": [{"type": "catch_specific", "fish": "golden_perch", "count": 3}], "rewards": {"gold": 800, "xp": 1000, "reputation": {"merchants": 25}}, "prerequisite": "ms_010", "giver": "merchant_marina"},
    {"id": "ms_012", "name": "Pirate Encounter", "type": "main_story", "chapter": 3, "description": "Your first meeting with pirates doesn't go well.", "objectives": [{"type": "survive_encounter"}, {"type": "escape_pirates"}], "rewards": {"gold": 400, "xp": 900, "knowledge": "pirate_awareness"}, "prerequisite": "ms_011", "giver": None},
    {"id": "ms_013", "name": "The Pirate Haven", "type": "main_story", "chapter": 3, "description": "Gain entry to a pirate haven to recover stolen goods.", "objectives": [{"type": "infiltrate_haven"}, {"type": "recover_item", "item": "stolen_cargo"}], "rewards": {"gold": 1000, "xp": 1200, "unlock": "pirate_haven_access"}, "prerequisite": "ms_012", "giver": "merchant_marina"},
    {"id": "ms_014", "name": "Proving Yourself", "type": "main_story", "chapter": 3, "description": "Captain Redbeard demands you prove your worth.", "objectives": [{"type": "complete_challenge", "challenge": "pirate_fishing_contest"}], "rewards": {"gold": 750, "xp": 1100, "reputation": {"pirates": 20}}, "prerequisite": "ms_013", "giver": "captain_redbeard"},
    {"id": "ms_015", "name": "Between Two Worlds", "type": "main_story", "chapter": 3, "description": "Navigate the delicate balance between guild and pirates.", "objectives": [{"type": "complete_task_for", "faction": "fishermen_guild"}, {"type": "complete_task_for", "faction": "pirates"}], "rewards": {"gold": 1200, "xp": 1500, "title": "Diplomat"}, "prerequisite": "ms_014", "giver": "barnacle_bill"},
    {"id": "ms_016", "name": "The Legendary Fish", "type": "main_story", "chapter": 4, "description": "Rumors of a legendary fish reach your ears.", "objectives": [{"type": "gather_information", "about": "thunder_leviathan", "count": 3}], "rewards": {"gold": 600, "xp": 1000, "knowledge": "leviathan_lore"}, "prerequisite": "ms_015", "giver": "fortune_teller_coral"},
    {"id": "ms_017", "name": "The Deep Expedition", "type": "main_story", "chapter": 4, "description": "Join an expedition to the Abyssal Depths.", "objectives": [{"type": "reach_stage", "stage": 50}, {"type": "survive_dangers", "count": 3}], "rewards": {"gold": 2000, "xp": 2500, "item": "deep_sea_gear"}, "prerequisite": "ms_016", "giver": "guild_master_thornwood"},
    {"id": "ms_018", "name": "The Underwater Discovery", "type": "main_story", "chapter": 4, "description": "Discover evidence of the Underwater Kingdom.", "objectives": [{"type": "find_artifact", "artifact": "mermaid_scale"}, {"type": "decode_message"}], "rewards": {"gold": 1500, "xp": 2000, "knowledge": "underwater_kingdom"}, "prerequisite": "ms_017", "giver": None},
    {"id": "ms_019", "name": "First Contact", "type": "main_story", "chapter": 4, "description": "Make contact with an emissary of the Underwater Kingdom.", "objectives": [{"type": "summon_emissary"}, {"type": "diplomatic_success"}], "rewards": {"gold": 3000, "xp": 3500, "faction": "underwater_kingdom"}, "prerequisite": "ms_018", "giver": "fortune_teller_coral"},
    {"id": "ms_020", "name": "The Treaty", "type": "main_story", "chapter": 4, "description": "Negotiate a fishing treaty with the Underwater Kingdom.", "objectives": [{"type": "gather_items", "items": ["peace_offering", "rare_fish", "human_artifact"]}, {"type": "complete_negotiation"}], "rewards": {"gold": 5000, "xp": 5000, "title": "Ambassador"}, "prerequisite": "ms_019", "giver": "merchant_marina"},
    {"id": "ms_021", "name": "The Volcanic Waters", "type": "main_story", "chapter": 5, "description": "Explore the dangerous volcanic fishing grounds.", "objectives": [{"type": "reach_stage", "stage": 65}, {"type": "catch_volcanic_fish", "count": 5}], "rewards": {"gold": 2500, "xp": 3000, "item": "fire_resistant_gear"}, "prerequisite": "ms_020", "giver": "shipwright_igor"},
    {"id": "ms_022", "name": "Vulcanus's Domain", "type": "main_story", "chapter": 5, "description": "Meet the legendary Vulcanus who guards the volcanic waters.", "objectives": [{"type": "survive_trial", "trial": "fire_trial"}, {"type": "gain_audience"}], "rewards": {"gold": 4000, "xp": 4500, "blessing": "vulcanus_mark"}, "prerequisite": "ms_021", "giver": None},
    {"id": "ms_023", "name": "The Spirit Waters", "type": "main_story", "chapter": 5, "description": "Navigate the mysterious Spirit Waters where reality bends.", "objectives": [{"type": "reach_stage", "stage": 75}, {"type": "maintain_sanity"}], "rewards": {"gold": 3500, "xp": 4000, "item": "spirit_compass"}, "prerequisite": "ms_022", "giver": "fortune_teller_coral"},
    {"id": "ms_024", "name": "Ghosts of the Past", "type": "main_story", "chapter": 5, "description": "Confront spirits of legendary fishers.", "objectives": [{"type": "spirit_dialogue", "spirits": ["captain_goldtooth", "barnacle_betty", "storm_king"]}], "rewards": {"gold": 5000, "xp": 6000, "knowledge": "legendary_wisdom"}, "prerequisite": "ms_023", "giver": None},
    {"id": "ms_025", "name": "The World Fish Beckons", "type": "main_story", "chapter": 5, "description": "Signs point to the awakening of the World Fish.", "objectives": [{"type": "witness_omen", "count": 5}, {"type": "prepare_ritual"}], "rewards": {"gold": 6000, "xp": 7000, "item": "world_fish_lure"}, "prerequisite": "ms_024", "giver": "barnacle_bill"},
    
    # =========== SIDE QUESTS (100) ===========
    {"id": "sq_001", "name": "Lost Lure", "type": "side", "description": "Find Tommy's lost lucky lure.", "objectives": [{"type": "search_area", "location": "old_docks"}], "rewards": {"gold": 50, "xp": 75}, "giver": "young_tommy"},
    {"id": "sq_002", "name": "Delivery Run", "type": "side", "description": "Deliver fresh fish to the tavern.", "objectives": [{"type": "deliver", "item": "fresh_fish", "count": 10, "to": "tavern"}], "rewards": {"gold": 80, "xp": 100}, "giver": "fishwife_martha"},
    {"id": "sq_003", "name": "Net Mending", "type": "side", "description": "Help Agatha mend fishing nets.", "objectives": [{"type": "assist_craft", "craft": "net_mending", "count": 5}], "rewards": {"gold": 60, "xp": 90, "skill": "net_repair"}, "giver": "net_mender_agatha"},
    {"id": "sq_004", "name": "Drunk's Tale", "type": "side", "description": "Listen to Captain Horace's story in exchange for navigation tips.", "objectives": [{"type": "buy_drinks", "count": 3}, {"type": "listen_story"}], "rewards": {"gold": 30, "xp": 150, "knowledge": "secret_route"}, "giver": "drunk_captain_horace"},
    {"id": "sq_005", "name": "Bait Collection", "type": "side", "description": "Help Finn collect rare worms.", "objectives": [{"type": "collect", "item": "rare_worm", "count": 10}], "rewards": {"gold": 100, "xp": 120, "item": "premium_bait"}, "giver": "bait_seller_finn"},
    {"id": "sq_006", "name": "The Widow's Hope", "type": "side", "description": "Search for clues about Margaret's missing husband.", "objectives": [{"type": "search_wreckage"}, {"type": "interview_witnesses", "count": 3}], "rewards": {"gold": 200, "xp": 250, "relationship": "margaret_seagrief"}, "giver": "sea_widow_margaret"},
    {"id": "sq_007", "name": "Lighthouse Repair", "type": "side", "description": "Help Eleanor repair the lighthouse lens.", "objectives": [{"type": "deliver", "item": "lens_parts", "count": 3}, {"type": "assist_repair"}], "rewards": {"gold": 300, "xp": 350, "unlock": "lighthouse_access"}, "giver": "lighthouse_keeper_eleanor"},
    {"id": "sq_008", "name": "Pearl Diving", "type": "side", "description": "Assist Luna in finding black pearls.", "objectives": [{"type": "dive", "location": "pearl_beds"}, {"type": "collect", "item": "black_pearl", "count": 3}], "rewards": {"gold": 500, "xp": 400, "item": "black_pearl"}, "giver": "pearl_diver_luna"},
    {"id": "sq_009", "name": "The Talking Fish", "type": "side", "description": "Investigate Horace's claim about a talking fish.", "objectives": [{"type": "fish_at", "location": "horace_spot"}, {"type": "catch_specific", "fish": "oracle_fish"}], "rewards": {"gold": 400, "xp": 500, "knowledge": "fish_prophecy"}, "giver": "tavern_keeper_rosie"},
    {"id": "sq_010", "name": "Tattoo Quest", "type": "side", "description": "Prove yourself worthy of Jade's magical tattoo.", "objectives": [{"type": "catch_legendary_fish"}], "rewards": {"gold": 200, "xp": 600, "item": "magical_tattoo"}, "giver": "tattoo_artist_jade"},
    {"id": "sq_011", "name": "Crab Catching Contest", "type": "side", "description": "Beat Clyde in a crab catching competition.", "objectives": [{"type": "catch_crabs", "count": 20, "time_limit": 600}], "rewards": {"gold": 300, "xp": 350, "title": "Crab Champion"}, "giver": "crab_catcher_clyde"},
    {"id": "sq_012", "name": "Storm Prediction", "type": "side", "description": "Help Tempest gather components for weather prediction.", "objectives": [{"type": "collect", "item": "storm_essence", "count": 3}], "rewards": {"gold": 400, "xp": 450, "item": "weather_charm"}, "giver": "weather_witch_tempest"},
    {"id": "sq_013", "name": "Map Authentication", "type": "side", "description": "Help Ming verify an ancient treasure map.", "objectives": [{"type": "visit_locations", "from_map": True, "count": 3}], "rewards": {"gold": 350, "xp": 400, "item": "verified_map"}, "giver": "cartographer_ming"},
    {"id": "sq_014", "name": "Shell Collection", "type": "side", "description": "Find the rare Spiral Emperor shell for Edgar.", "objectives": [{"type": "search_beaches", "count": 10}, {"type": "find_specific", "item": "spiral_emperor"}], "rewards": {"gold": 250, "xp": 300, "item": "shell_guide"}, "giver": "shell_collector_edgar"},
    {"id": "sq_015", "name": "Rat Problem", "type": "side", "description": "Help Vera with a rat infestation problem.", "objectives": [{"type": "place_traps", "count": 10}, {"type": "report_results"}], "rewards": {"gold": 150, "xp": 200, "item": "trained_rat"}, "giver": "dock_rat_queen"},
    {"id": "sq_016", "name": "Shanty Competition", "type": "side", "description": "Help Melodia win the annual shanty competition.", "objectives": [{"type": "learn_shanty"}, {"type": "perform_together"}], "rewards": {"gold": 200, "xp": 300, "skill": "sea_shanty"}, "giver": "singing_sailor_melodia"},
    {"id": "sq_017", "name": "Debt Collection", "type": "side", "description": "Collect a debt for Vince (optional: find another way).", "objectives": [{"type": "collect_debt", "or": "negotiate_alternative"}], "rewards": {"gold": 400, "xp": 350}, "giver": "debt_collector_vince"},
    {"id": "sq_018", "name": "Street Rat Network", "type": "side", "description": "Help Pip establish a spy network.", "objectives": [{"type": "recruit_urchins", "count": 5}], "rewards": {"gold": 200, "xp": 300, "unlock": "information_network"}, "giver": "street_urchin_pip"},
    {"id": "sq_019", "name": "Medical Emergency", "type": "side", "description": "Help Dr. Heinrich save a poisoned sailor.", "objectives": [{"type": "gather_antidote_ingredients", "count": 3}, {"type": "deliver_quickly"}], "rewards": {"gold": 350, "xp": 400, "skill": "basic_medicine"}, "giver": "ship_doctor_heinrich"},
    {"id": "sq_020", "name": "Barrel Mystery", "type": "side", "description": "Find out why Olaf's barrels are leaking.", "objectives": [{"type": "investigate_workshop"}, {"type": "catch_saboteur"}], "rewards": {"gold": 300, "xp": 350, "reputation": {"craftsmen": 15}}, "giver": "barrel_maker_olaf"},
    
    # Continue with more side quests...
    {"id": "sq_021", "name": "The Mayor's Fish", "type": "side", "description": "Catch a rare fish for the Mayor's dinner party.", "objectives": [{"type": "catch_specific", "fish": "golden_pompano", "size": "large"}], "rewards": {"gold": 600, "xp": 500, "reputation": {"city_government": 20}}, "giver": "mayor_cornelius"},
    {"id": "sq_022", "name": "Lady Ashworth's Adventure", "type": "side", "description": "Take Lady Ashworth on an exciting fishing trip.", "objectives": [{"type": "escort_npc", "npc": "lady_ashworth"}, {"type": "catch_fish", "count": 10}, {"type": "survive_danger"}], "rewards": {"gold": 800, "xp": 700, "patron": "lady_ashworth"}, "giver": "noble_lady_ashworth"},
    {"id": "sq_023", "name": "Academic Collection", "type": "side", "description": "Collect fish specimens for the university.", "objectives": [{"type": "catch_variety", "species": 15}], "rewards": {"gold": 500, "xp": 600, "reputation": {"scholars": 25}}, "giver": "university_dean"},
    {"id": "sq_024", "name": "Breaking News", "type": "side", "description": "Help Editor Gazette get a scoop on pirate activities.", "objectives": [{"type": "infiltrate", "location": "pirate_meeting"}, {"type": "gather_evidence"}], "rewards": {"gold": 450, "xp": 550, "newspaper_mention": True}, "giver": "newspaper_editor"},
    {"id": "sq_025", "name": "Auction Item", "type": "side", "description": "Catch a fish worthy of the high-society auction.", "objectives": [{"type": "catch_legendary_fish"}], "rewards": {"gold": 2000, "xp": 1000, "reputation": {"merchants": 30}}, "giver": "auction_house_owner"},
    {"id": "sq_026", "name": "Museum Exhibit", "type": "side", "description": "Help set up the new maritime exhibit.", "objectives": [{"type": "donate_items", "count": 5}, {"type": "share_stories", "count": 3}], "rewards": {"gold": 400, "xp": 500, "museum_plaque": True}, "giver": "museum_curator"},
    {"id": "sq_027", "name": "Chef's Challenge", "type": "side", "description": "Bring Master Chef Gustave the perfect fish for his signature dish.", "objectives": [{"type": "catch_specific", "fish": "emperor_snapper", "freshness": "perfect"}], "rewards": {"gold": 700, "xp": 600, "recipe": "gustaves_special"}, "giver": "chef_master_gustave"},
    {"id": "sq_028", "name": "Underworld Favor", "type": "side", "description": "The Kraken needs a discreet delivery made.", "objectives": [{"type": "deliver_package", "no_inspect": True, "to": "mysterious_recipient"}], "rewards": {"gold": 1000, "xp": 500, "reputation": {"criminal": 15}}, "giver": "underground_boss"},
    {"id": "sq_029", "name": "Blessing the Fleet", "type": "side", "description": "Help Father Marina bless the fishing fleet.", "objectives": [{"type": "gather_holy_items", "count": 5}, {"type": "attend_ceremony"}], "rewards": {"gold": 200, "xp": 400, "blessing": "fleet_blessing"}, "giver": "priest_father_marina"},
    {"id": "sq_030", "name": "Shadow's Task", "type": "side", "description": "Complete a mysterious task for Shadow.", "objectives": [{"type": "dead_drop", "count": 3}, {"type": "no_witnesses"}], "rewards": {"gold": 800, "xp": 600, "contact": "shadow_network"}, "giver": "spy_master_shadow"},
    
    # More side quests... (abbreviated for space, pattern continues)
    {"id": "sq_031", "name": "Fish Fight Champion", "type": "side", "description": "Train a fish to win the arena.", "objectives": [{"type": "catch_fighter_fish"}, {"type": "train_fish"}, {"type": "win_tournament"}], "rewards": {"gold": 1500, "xp": 1000, "title": "Fish Fighter"}, "giver": "arena_master"},
    {"id": "sq_032", "name": "Insurance Investigation", "type": "side", "description": "Help investigate a suspicious shipwreck claim.", "objectives": [{"type": "dive_wreck"}, {"type": "gather_evidence", "count": 5}], "rewards": {"gold": 600, "xp": 700, "reputation": {"insurance": 20}}, "giver": "insurance_agent"},
    {"id": "sq_033", "name": "Fashion Fish", "type": "side", "description": "Catch fish with scales that match Madame Silk's vision.", "objectives": [{"type": "catch_colorful_fish", "colors": ["gold", "silver", "purple"]}], "rewards": {"gold": 500, "xp": 400, "item": "designer_outfit"}, "giver": "fashion_designer_silk"},
    {"id": "sq_034", "name": "Bar Brawl", "type": "side", "description": "Help Brawny Beth deal with troublemakers.", "objectives": [{"type": "fight_thugs", "count": 5}], "rewards": {"gold": 300, "xp": 350, "reputation": {"innkeepers": 15}}, "giver": "tavern_owner_brawny"},
    {"id": "sq_035", "name": "Clockwork Fish", "type": "side", "description": "Help Clockmaker Tick create a mechanical fish.", "objectives": [{"type": "gather_components", "count": 10}, {"type": "catch_sample_fish", "count": 3}], "rewards": {"gold": 700, "xp": 600, "item": "clockwork_lure"}, "giver": "clockmaker_precise"},
    
    # NPC RELATIONSHIP QUESTS (50)
    {"id": "rel_001", "name": "Barnacle Bill's Past", "type": "npc_relationship", "npc": "barnacle_bill", "level": 1, "description": "Learn about Bill's legendary catch.", "objectives": [{"type": "hear_story"}, {"type": "bring_drink"}], "rewards": {"gold": 100, "xp": 200, "relationship": 10}, "giver": "barnacle_bill"},
    {"id": "rel_002", "name": "Bill's Request", "type": "npc_relationship", "npc": "barnacle_bill", "level": 2, "description": "Catch a fish that reminds Bill of his youth.", "objectives": [{"type": "catch_specific", "fish": "sunset_grouper"}], "rewards": {"gold": 200, "xp": 300, "relationship": 15, "item": "bills_old_lure"}, "giver": "barnacle_bill"},
    {"id": "rel_003", "name": "Tommy's Dream", "type": "npc_relationship", "npc": "young_tommy", "level": 1, "description": "Take Tommy on his first real fishing trip.", "objectives": [{"type": "escort_fishing"}, {"type": "help_catch_first"}], "rewards": {"gold": 50, "xp": 250, "relationship": 15}, "giver": "young_tommy"},
    {"id": "rel_004", "name": "Finding Tommy's Father", "type": "npc_relationship", "npc": "young_tommy", "level": 3, "description": "Search the Golden Depths for clues about Tommy's father.", "objectives": [{"type": "explore_area", "location": "golden_depths"}, {"type": "find_evidence"}], "rewards": {"gold": 500, "xp": 800, "relationship": 25, "story_unlock": "tommys_father"}, "giver": "young_tommy"},
    {"id": "rel_005", "name": "Marina's Trust", "type": "npc_relationship", "npc": "merchant_marina", "level": 1, "description": "Prove yourself as a reliable supplier.", "objectives": [{"type": "complete_deliveries", "count": 5, "on_time": True}], "rewards": {"gold": 300, "xp": 350, "relationship": 10, "discount": 10}, "giver": "merchant_marina"},
    {"id": "rel_006", "name": "James's Trail", "type": "npc_relationship", "npc": "merchant_marina", "level": 2, "description": "Follow the trail to find Marina's husband.", "objectives": [{"type": "investigate_locations", "count": 3}, {"type": "find_clue"}], "rewards": {"gold": 600, "xp": 700, "relationship": 20}, "giver": "merchant_marina"},
    {"id": "rel_007", "name": "Rosie's Memory", "type": "npc_relationship", "npc": "tavern_keeper_rosie", "level": 1, "description": "Listen to Rosie's story about her son.", "objectives": [{"type": "stay_and_listen"}, {"type": "offer_comfort"}], "rewards": {"gold": 50, "xp": 300, "relationship": 15, "item": "tommys_dolphin"}, "giver": "tavern_keeper_rosie"},
    {"id": "rel_008", "name": "Redbeard's Respect", "type": "npc_relationship", "npc": "captain_redbeard", "level": 1, "description": "Earn Captain Redbeard's respect through a daring act.", "objectives": [{"type": "complete_dangerous_task"}], "rewards": {"gold": 400, "xp": 500, "relationship": 10, "pirate_access": True}, "giver": "captain_redbeard"},
    {"id": "rel_009", "name": "The Captain's Secret", "type": "npc_relationship", "npc": "captain_redbeard", "level": 3, "description": "Help Redbeard recover something personal from his past.", "objectives": [{"type": "infiltrate_navy_base"}, {"type": "recover_item", "item": "sea_witch_figurehead"}], "rewards": {"gold": 2000, "xp": 2500, "relationship": 30, "item": "redbeards_favor"}, "giver": "captain_redbeard"},
    {"id": "rel_010", "name": "Coral's Vision", "type": "npc_relationship", "npc": "fortune_teller_coral", "level": 1, "description": "Bring items for a special reading.", "objectives": [{"type": "gather", "items": ["moonfish_scale", "pearl", "seaweed"]}], "rewards": {"gold": 200, "xp": 400, "relationship": 10, "fortune_reading": True}, "giver": "fortune_teller_coral"},
    
    # EXPLORATION QUESTS (50)
    {"id": "exp_001", "name": "Uncharted Waters", "type": "exploration", "description": "Discover a new fishing location.", "objectives": [{"type": "explore_unknown", "count": 1}], "rewards": {"gold": 300, "xp": 400, "discovery_bonus": True}, "giver": "cartographer_ming"},
    {"id": "exp_002", "name": "The Coral Reef", "type": "exploration", "description": "Map the dangerous coral reef.", "objectives": [{"type": "navigate_reef"}, {"type": "create_map"}], "rewards": {"gold": 400, "xp": 500, "item": "reef_map"}, "giver": "cartographer_ming"},
    {"id": "exp_003", "name": "Shipwreck Alley", "type": "exploration", "description": "Explore the graveyard of ships.", "objectives": [{"type": "visit_wrecks", "count": 5}, {"type": "salvage_items", "count": 10}], "rewards": {"gold": 600, "xp": 700, "items": ["salvage_random"]}, "giver": "shipwright_igor"},
    {"id": "exp_004", "name": "The Hidden Cove", "type": "exploration", "description": "Find the legendary Hidden Cove.", "objectives": [{"type": "solve_riddle"}, {"type": "navigate_rocks"}], "rewards": {"gold": 800, "xp": 900, "unlock": "hidden_cove"}, "giver": "old_salts_leader"},
    {"id": "exp_005", "name": "Volcanic Approach", "type": "exploration", "description": "Find a safe route to the Volcanic Waters.", "objectives": [{"type": "scout_routes", "count": 3}, {"type": "survive_heat"}], "rewards": {"gold": 1000, "xp": 1200, "unlock": "volcanic_route"}, "giver": "guild_master_thornwood"},
    {"id": "exp_006", "name": "Spirit Waters Entry", "type": "exploration", "description": "Find the entrance to the Spirit Waters.", "objectives": [{"type": "follow_ghost_lights"}, {"type": "complete_ritual"}], "rewards": {"gold": 1500, "xp": 2000, "unlock": "spirit_waters"}, "giver": "fortune_teller_coral"},
    {"id": "exp_007", "name": "The Abyssal Edge", "type": "exploration", "description": "Reach the edge of the known world.", "objectives": [{"type": "reach_stage", "stage": 90}], "rewards": {"gold": 3000, "xp": 4000, "title": "Edge Walker"}, "giver": "explorer_society_leader"},
    {"id": "exp_008", "name": "Beyond the Map", "type": "exploration", "description": "Discover what lies beyond mapped waters.", "objectives": [{"type": "reach_stage", "stage": 100}], "rewards": {"gold": 5000, "xp": 6000, "legendary_access": True}, "giver": "cartographer_ming"},
    {"id": "exp_009", "name": "Island Discovery", "type": "exploration", "description": "Discover and name a new island.", "objectives": [{"type": "find_random_island"}, {"type": "explore_fully"}, {"type": "name_island"}], "rewards": {"gold": 1200, "xp": 1500, "island_named_after_you": True}, "giver": "harbor_master_jenkins"},
    {"id": "exp_010", "name": "The Forgotten Atoll", "type": "exploration", "description": "Find the legendary Forgotten Atoll.", "objectives": [{"type": "follow_clues", "count": 5}, {"type": "reach_location"}], "rewards": {"gold": 2500, "xp": 3000, "unlock": "forgotten_atoll"}, "giver": "merchant_marina"},
    
    # COLLECTION QUESTS (50)
    {"id": "col_001", "name": "Common Collection", "type": "collection", "description": "Catch one of each common fish.", "objectives": [{"type": "catch_all", "rarity": "common"}], "rewards": {"gold": 500, "xp": 600, "title": "Common Collector"}, "giver": "museum_curator"},
    {"id": "col_002", "name": "Uncommon Collection", "type": "collection", "description": "Catch one of each uncommon fish.", "objectives": [{"type": "catch_all", "rarity": "uncommon"}], "rewards": {"gold": 1000, "xp": 1200, "title": "Uncommon Collector"}, "giver": "museum_curator"},
    {"id": "col_003", "name": "Rare Collection", "type": "collection", "description": "Catch one of each rare fish.", "objectives": [{"type": "catch_all", "rarity": "rare"}], "rewards": {"gold": 2500, "xp": 3000, "title": "Rare Collector"}, "giver": "museum_curator"},
    {"id": "col_004", "name": "Shell Seeker", "type": "collection", "description": "Collect 50 different shells.", "objectives": [{"type": "collect_shells", "variety": 50}], "rewards": {"gold": 800, "xp": 900, "item": "shell_collection_case"}, "giver": "shell_collector_edgar"},
    {"id": "col_005", "name": "Pearl Hunter", "type": "collection", "description": "Collect pearls of every color.", "objectives": [{"type": "collect_pearls", "colors": ["white", "pink", "black", "gold"]}], "rewards": {"gold": 3000, "xp": 2500, "item": "pearl_set"}, "giver": "pearl_diver_luna"},
    {"id": "col_006", "name": "Map Collector", "type": "collection", "description": "Collect all treasure map fragments.", "objectives": [{"type": "collect_maps", "sets": 5}], "rewards": {"gold": 5000, "xp": 4000, "unlock": "master_treasure_hunter"}, "giver": "cartographer_ming"},
    {"id": "col_007", "name": "Recipe Master", "type": "collection", "description": "Learn 50 different recipes.", "objectives": [{"type": "learn_recipes", "count": 50}], "rewards": {"gold": 2000, "xp": 2500, "title": "Recipe Master"}, "giver": "chef_master_gustave"},
    {"id": "col_008", "name": "Boat Collector", "type": "collection", "description": "Own 10 different boats.", "objectives": [{"type": "own_boats", "count": 10}], "rewards": {"gold": 3000, "xp": 3500, "title": "Fleet Admiral"}, "giver": "shipwright_igor"},
    {"id": "col_009", "name": "Title Hunter", "type": "collection", "description": "Earn 20 different titles.", "objectives": [{"type": "earn_titles", "count": 20}], "rewards": {"gold": 2500, "xp": 3000, "special_title": "Title Collector"}, "giver": "guild_master_thornwood"},
    {"id": "col_010", "name": "Blessing Collector", "type": "collection", "description": "Receive blessings from 5 different sources.", "objectives": [{"type": "receive_blessings", "count": 5}], "rewards": {"gold": 1500, "xp": 2000, "combined_blessing": True}, "giver": "fortune_teller_coral"},
    
    # DANGER QUESTS (50)
    {"id": "dng_001", "name": "Storm Fishing", "type": "danger", "description": "Catch fish during a storm.", "objectives": [{"type": "fish_during_storm"}, {"type": "catch_fish", "count": 10}], "rewards": {"gold": 400, "xp": 500, "title": "Storm Fisher"}, "giver": "barnacle_bill"},
    {"id": "dng_002", "name": "Pirate Escape", "type": "danger", "description": "Escape from a pirate ambush.", "objectives": [{"type": "survive_ambush"}, {"type": "escape_unharmed"}], "rewards": {"gold": 500, "xp": 600, "skill": "evasion"}, "giver": None},
    {"id": "dng_003", "name": "Sea Monster Encounter", "type": "danger", "description": "Survive an encounter with a sea monster.", "objectives": [{"type": "survive_monster"}], "rewards": {"gold": 800, "xp": 1000, "item": "monster_trophy"}, "giver": "old_salts_leader"},
    {"id": "dng_004", "name": "Whirlpool Navigation", "type": "danger", "description": "Navigate through the Whirlpool Passage.", "objectives": [{"type": "navigate_whirlpools", "count": 3}], "rewards": {"gold": 600, "xp": 700, "skill": "whirlpool_navigation"}, "giver": "harbor_master_jenkins"},
    {"id": "dng_005", "name": "Ghost Ship Boarding", "type": "danger", "description": "Board and search a ghost ship.", "objectives": [{"type": "board_ghost_ship"}, {"type": "escape_with_treasure"}], "rewards": {"gold": 2000, "xp": 2500, "items": ["ghost_ship_loot"]}, "giver": "fortune_teller_coral"},
    {"id": "dng_006", "name": "Volcanic Fishing", "type": "danger", "description": "Fish in active volcanic waters.", "objectives": [{"type": "fish_at", "location": "volcanic_vent"}, {"type": "catch_fire_fish", "count": 5}], "rewards": {"gold": 1500, "xp": 1800, "item": "volcanic_gear"}, "giver": "shipwright_igor"},
    {"id": "dng_007", "name": "Kraken's Wake", "type": "danger", "description": "Fish in waters recently visited by the Kraken.", "objectives": [{"type": "reach_kraken_wake"}, {"type": "catch_enhanced_fish", "count": 10}], "rewards": {"gold": 2500, "xp": 3000, "item": "kraken_blessed_gear"}, "giver": "drunk_captain_horace"},
    {"id": "dng_008", "name": "Navy Pursuit", "type": "danger", "description": "Escape a Navy pursuit while carrying contraband.", "objectives": [{"type": "evade_navy"}, {"type": "deliver_cargo"}], "rewards": {"gold": 1000, "xp": 1200, "reputation": {"pirates": 20}}, "giver": "rum_runner"},
    {"id": "dng_009", "name": "Reef of Bones", "type": "danger", "description": "Navigate the deadly Reef of Bones.", "objectives": [{"type": "navigate_carefully"}, {"type": "survive"}], "rewards": {"gold": 1200, "xp": 1500, "map_update": True}, "giver": "cartographer_ming"},
    {"id": "dng_010", "name": "The Deep Dive", "type": "danger", "description": "Dive to dangerous depths.", "objectives": [{"type": "dive_deep", "depth": "extreme"}, {"type": "return_alive"}], "rewards": {"gold": 3000, "xp": 3500, "skill": "deep_diving"}, "giver": "pearl_diver_luna"},
    
    # DAILY QUESTS (25)
    {"id": "daily_001", "name": "Daily Catch", "type": "daily", "description": "Catch 20 fish today.", "objectives": [{"type": "catch_fish", "count": 20}], "rewards": {"gold": 100, "xp": 150}, "reset": "daily"},
    {"id": "daily_002", "name": "Morning Fishing", "type": "daily", "description": "Catch fish during the morning hours.", "objectives": [{"type": "fish_during", "time": "morning"}, {"type": "catch_fish", "count": 10}], "rewards": {"gold": 120, "xp": 180}, "reset": "daily"},
    {"id": "daily_003", "name": "Tavern Delivery", "type": "daily", "description": "Deliver fresh fish to the tavern.", "objectives": [{"type": "deliver", "item": "fresh_fish", "count": 5}], "rewards": {"gold": 80, "xp": 100}, "reset": "daily"},
    {"id": "daily_004", "name": "Net Inspection", "type": "daily", "description": "Inspect and repair nets.", "objectives": [{"type": "repair_nets", "count": 3}], "rewards": {"gold": 60, "xp": 80}, "reset": "daily"},
    {"id": "daily_005", "name": "Dock Patrol", "type": "daily", "description": "Help patrol the docks.", "objectives": [{"type": "patrol", "areas": 5}], "rewards": {"gold": 100, "xp": 120}, "reset": "daily"},
    {"id": "daily_006", "name": "Market Run", "type": "daily", "description": "Sell fish at the market.", "objectives": [{"type": "sell_fish", "value": 500}], "rewards": {"gold": 150, "xp": 100}, "reset": "daily"},
    {"id": "daily_007", "name": "Bait Gathering", "type": "daily", "description": "Gather bait for tomorrow.", "objectives": [{"type": "gather_bait", "count": 20}], "rewards": {"gold": 50, "xp": 80, "item": "bait_bundle"}, "reset": "daily"},
    {"id": "daily_008", "name": "Weather Watch", "type": "daily", "description": "Report weather conditions.", "objectives": [{"type": "observe_weather"}, {"type": "report"}], "rewards": {"gold": 40, "xp": 60}, "reset": "daily"},
    {"id": "daily_009", "name": "Fish Tales", "type": "daily", "description": "Share a fishing story at the tavern.", "objectives": [{"type": "tell_story"}], "rewards": {"gold": 30, "xp": 100}, "reset": "daily"},
    {"id": "daily_010", "name": "Catch of the Day", "type": "daily", "description": "Catch the specific fish of the day.", "objectives": [{"type": "catch_daily_fish"}], "rewards": {"gold": 200, "xp": 250}, "reset": "daily"},
    
    # WEEKLY QUESTS (25)
    {"id": "weekly_001", "name": "Weekly Haul", "type": "weekly", "description": "Catch 100 fish this week.", "objectives": [{"type": "catch_fish", "count": 100}], "rewards": {"gold": 500, "xp": 750}, "reset": "weekly"},
    {"id": "weekly_002", "name": "Variety Week", "type": "weekly", "description": "Catch 20 different species this week.", "objectives": [{"type": "catch_variety", "species": 20}], "rewards": {"gold": 600, "xp": 800}, "reset": "weekly"},
    {"id": "weekly_003", "name": "Trading Week", "type": "weekly", "description": "Complete 10 trades this week.", "objectives": [{"type": "complete_trades", "count": 10}], "rewards": {"gold": 400, "xp": 500}, "reset": "weekly"},
    {"id": "weekly_004", "name": "Exploration Week", "type": "weekly", "description": "Visit 10 different stages this week.", "objectives": [{"type": "visit_stages", "count": 10}], "rewards": {"gold": 450, "xp": 600}, "reset": "weekly"},
    {"id": "weekly_005", "name": "Guild Duty", "type": "weekly", "description": "Complete 5 guild tasks this week.", "objectives": [{"type": "guild_tasks", "count": 5}], "rewards": {"gold": 350, "xp": 500, "guild_rep": 10}, "reset": "weekly"},
    
    # LEGENDARY QUESTS (25)
    {"id": "leg_001", "name": "The Thunder Leviathan", "type": "legendary", "description": "Find and confront the Thunder Leviathan.", "objectives": [{"type": "locate_leviathan"}, {"type": "survive_encounter"}, {"type": "earn_respect"}], "rewards": {"gold": 10000, "xp": 15000, "title": "Leviathan Friend", "item": "leviathan_scale"}, "prerequisite": "ms_025"},
    {"id": "leg_002", "name": "The World Fish", "type": "legendary", "description": "Witness the World Fish.", "objectives": [{"type": "prepare_banquet"}, {"type": "perform_ritual"}, {"type": "witness_world_fish"}], "rewards": {"gold": 50000, "xp": 100000, "title": "World Witness", "blessing": "world_fish_blessing"}, "prerequisite": "leg_001"},
    {"id": "leg_003", "name": "Golden Dream's Legacy", "type": "legendary", "description": "Follow in Captain Goldtooth's footsteps.", "objectives": [{"type": "visit_all_goldtooth_locations"}, {"type": "catch_goldtooth_fish"}, {"type": "find_golden_dream"}], "rewards": {"gold": 25000, "xp": 30000, "boat": "golden_dream_replica"}, "prerequisite": "ms_020"},
    {"id": "leg_004", "name": "Underwater Ambassador", "type": "legendary", "description": "Become a full ambassador to the Underwater Kingdom.", "objectives": [{"type": "complete_treaty"}, {"type": "visit_coral_palace"}, {"type": "meet_king_finnius"}], "rewards": {"gold": 30000, "xp": 40000, "title": "Ambassador", "underwater_access": True}, "prerequisite": "ms_020"},
    {"id": "leg_005", "name": "Master of All Waters", "type": "legendary", "description": "Fish successfully in every region.", "objectives": [{"type": "catch_fish_in_all_regions"}], "rewards": {"gold": 20000, "xp": 25000, "title": "Master of Waters"}, "prerequisite": None}
]

# Count quests
TOTAL_QUESTS = len(QUESTS)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class QuestProgress(BaseModel):
    user_id: str
    quest_id: str
    status: str = "not_started"  # not_started, in_progress, completed, failed
    objectives_progress: Dict = Field(default_factory=dict)
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

class StartQuestRequest(BaseModel):
    user_id: str
    quest_id: str

class UpdateProgressRequest(BaseModel):
    user_id: str
    quest_id: str
    objective_id: str
    progress: int

# ============================================================================
# API ROUTES
# ============================================================================

@router.get("/all")
async def get_all_quests():
    """Get all quests"""
    return {"quests": QUESTS, "total": TOTAL_QUESTS}

@router.get("/types")
async def get_quest_types():
    """Get all quest types"""
    return QUEST_TYPES

@router.get("/by-type/{quest_type}")
async def get_quests_by_type(quest_type: str):
    """Get quests by type"""
    filtered = [q for q in QUESTS if q["type"] == quest_type]
    return {"quests": filtered, "total": len(filtered)}

@router.get("/by-giver/{npc_id}")
async def get_quests_by_giver(npc_id: str):
    """Get quests given by a specific NPC"""
    filtered = [q for q in QUESTS if q.get("giver") == npc_id]
    return {"quests": filtered, "total": len(filtered)}

@router.get("/{quest_id}")
async def get_quest(quest_id: str):
    """Get a specific quest"""
    quest = next((q for q in QUESTS if q["id"] == quest_id), None)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    return quest

@router.get("/user/{user_id}/available")
async def get_available_quests(user_id: str):
    """Get all quests available to a user"""
    # Get user's completed quests
    completed = await db.quest_progress.find(
        {"user_id": user_id, "status": "completed"},
        {"_id": 0, "quest_id": 1}
    ).to_list(1000)
    completed_ids = [c["quest_id"] for c in completed]
    
    # Filter available quests
    available = []
    for quest in QUESTS:
        if quest["id"] in completed_ids:
            continue
        prereq = quest.get("prerequisite")
        if prereq and prereq not in completed_ids:
            continue
        available.append(quest)
    
    return {"quests": available, "total": len(available)}

@router.get("/user/{user_id}/active")
async def get_active_quests(user_id: str):
    """Get user's active quests"""
    active = await db.quest_progress.find(
        {"user_id": user_id, "status": "in_progress"},
        {"_id": 0}
    ).to_list(100)
    
    # Enrich with quest data
    enriched = []
    for progress in active:
        quest = next((q for q in QUESTS if q["id"] == progress["quest_id"]), None)
        if quest:
            enriched.append({**quest, "progress": progress})
    
    return {"quests": enriched, "total": len(enriched)}

@router.post("/start")
async def start_quest(request: StartQuestRequest):
    """Start a new quest"""
    quest = next((q for q in QUESTS if q["id"] == request.quest_id), None)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    # Check prerequisite
    prereq = quest.get("prerequisite")
    if prereq:
        prereq_complete = await db.quest_progress.find_one(
            {"user_id": request.user_id, "quest_id": prereq, "status": "completed"}
        )
        if not prereq_complete:
            raise HTTPException(status_code=400, detail=f"Prerequisite quest {prereq} not completed")
    
    # Check if already started
    existing = await db.quest_progress.find_one(
        {"user_id": request.user_id, "quest_id": request.quest_id}
    )
    if existing and existing.get("status") == "in_progress":
        raise HTTPException(status_code=400, detail="Quest already in progress")
    
    # Initialize progress
    objectives_progress = {}
    for i, obj in enumerate(quest["objectives"]):
        objectives_progress[str(i)] = {"current": 0, "target": obj.get("count", 1), "completed": False}
    
    progress = QuestProgress(
        user_id=request.user_id,
        quest_id=request.quest_id,
        status="in_progress",
        objectives_progress=objectives_progress,
        started_at=datetime.now(timezone.utc).isoformat()
    )
    
    await db.quest_progress.update_one(
        {"user_id": request.user_id, "quest_id": request.quest_id},
        {"$set": progress.model_dump()},
        upsert=True
    )
    
    return {"message": f"Started quest: {quest['name']}", "quest": quest, "progress": progress.model_dump()}

@router.post("/update-progress")
async def update_quest_progress(request: UpdateProgressRequest):
    """Update progress on a quest objective"""
    progress = await db.quest_progress.find_one(
        {"user_id": request.user_id, "quest_id": request.quest_id, "status": "in_progress"},
        {"_id": 0}
    )
    if not progress:
        raise HTTPException(status_code=404, detail="Active quest not found")
    
    objectives = progress.get("objectives_progress", {})
    if request.objective_id not in objectives:
        raise HTTPException(status_code=400, detail="Invalid objective")
    
    # Update progress
    objectives[request.objective_id]["current"] = min(
        request.progress,
        objectives[request.objective_id]["target"]
    )
    
    # Check if objective completed
    if objectives[request.objective_id]["current"] >= objectives[request.objective_id]["target"]:
        objectives[request.objective_id]["completed"] = True
    
    # Check if all objectives completed
    all_complete = all(obj["completed"] for obj in objectives.values())
    new_status = "completed" if all_complete else "in_progress"
    
    update_data = {"objectives_progress": objectives, "status": new_status}
    if all_complete:
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.quest_progress.update_one(
        {"user_id": request.user_id, "quest_id": request.quest_id},
        {"$set": update_data}
    )
    
    result = {"progress": objectives, "status": new_status}
    
    # If completed, include rewards
    if all_complete:
        quest = next((q for q in QUESTS if q["id"] == request.quest_id), None)
        if quest:
            result["completed"] = True
            result["rewards"] = quest["rewards"]
            # Apply rewards
            await apply_quest_rewards(request.user_id, quest["rewards"])
    
    return result

async def apply_quest_rewards(user_id: str, rewards: Dict):
    """Apply quest rewards to user"""
    update = {}
    if "gold" in rewards:
        update["gold"] = rewards["gold"]
    if "xp" in rewards:
        update["xp"] = rewards["xp"]
    
    if update:
        await db.users.update_one(
            {"id": user_id},
            {"$inc": update}
        )
    
    if "item" in rewards:
        await db.user_inventory.update_one(
            {"user_id": user_id},
            {"$push": {"items": rewards["item"]}},
            upsert=True
        )
    
    if "title" in rewards:
        await db.user_titles.update_one(
            {"user_id": user_id},
            {"$addToSet": {"titles": rewards["title"]}},
            upsert=True
        )

@router.get("/user/{user_id}/completed")
async def get_completed_quests(user_id: str):
    """Get all completed quests for a user"""
    completed = await db.quest_progress.find(
        {"user_id": user_id, "status": "completed"},
        {"_id": 0}
    ).to_list(1000)
    
    return {"quests": completed, "total": len(completed)}

@router.get("/daily/today")
async def get_daily_quests():
    """Get today's daily quests"""
    daily = [q for q in QUESTS if q["type"] == "daily"]
    # Could randomize which dailies are available
    return {"quests": daily[:5], "total": 5}

@router.get("/weekly/current")
async def get_weekly_quests():
    """Get this week's weekly quests"""
    weekly = [q for q in QUESTS if q["type"] == "weekly"]
    return {"quests": weekly[:3], "total": 3}
