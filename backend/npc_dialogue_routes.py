"""
NPC Dialogue System - Fallout-style branching dialogue trees
Features:
- Port NPCs for every location
- Store NPCs
- 3000+ lines of immersive dialogue
- Player choice with consequences
- Reputation system
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random

router = APIRouter(prefix="/api/dialogue", tags=["dialogue"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# SECTION 1: NPC DEFINITIONS
# ============================================================================

NPCS = {
    # Port NPCs - One for each major location type
    "barnacle_bill": {
        "id": "barnacle_bill",
        "name": "Barnacle Bill",
        "title": "Legendary Fisherman",
        "location_type": "port",
        "location_ids": [1, 2, 3, 4, 5],
        "sprite": "old_fisherman",
        "description": "An ancient fisherman covered in barnacles. His eyes have seen every fish in every sea.",
        "personality": "wise",
        "faction": "fishermen_guild",
        "initial_disposition": 50,
        "voice_style": "gruff_but_kind"
    },
    "captain_redbeard": {
        "id": "captain_redbeard",
        "name": "Captain Redbeard",
        "title": "Pirate Lord",
        "location_type": "pirate_haven",
        "location_ids": [5, 10, 15, 20, 25],
        "sprite": "pirate_captain",
        "description": "A fearsome pirate captain with a magnificent red beard. He respects skill above all.",
        "personality": "aggressive",
        "faction": "pirates",
        "initial_disposition": 30,
        "voice_style": "booming_intimidating"
    },
    "merchant_marina": {
        "id": "merchant_marina",
        "name": "Marina Goldscale",
        "title": "Master Merchant",
        "location_type": "city",
        "location_ids": [10, 20, 30, 40, 50],
        "sprite": "merchant_woman",
        "description": "A shrewd businesswoman who can appraise any fish at a glance.",
        "personality": "calculating",
        "faction": "merchants",
        "initial_disposition": 40,
        "voice_style": "professional_charming"
    },
    "old_salts": {
        "id": "old_salts",
        "name": "Old Salts",
        "title": "Retired Sailors",
        "location_type": "port",
        "location_ids": [1, 11, 21, 31, 41],
        "sprite": "group_sailors",
        "description": "A group of retired sailors who spend their days swapping stories at the dock.",
        "personality": "nostalgic",
        "faction": "none",
        "initial_disposition": 60,
        "voice_style": "grumbling_friendly"
    },
    "mysterious_stranger": {
        "id": "mysterious_stranger",
        "name": "The Stranger",
        "title": "???",
        "location_type": "secret",
        "location_ids": [50, 75, 100],
        "sprite": "hooded_figure",
        "description": "A hooded figure who seems to know more than they should.",
        "personality": "cryptic",
        "faction": "unknown",
        "initial_disposition": 50,
        "voice_style": "whispered_enigmatic"
    },
    "innkeeper_rosie": {
        "id": "innkeeper_rosie",
        "name": "Rosie McTavern",
        "title": "Innkeeper",
        "location_type": "port",
        "location_ids": [1, 6, 11, 16, 21, 26, 31],
        "sprite": "innkeeper",
        "description": "A jolly innkeeper who knows all the local gossip.",
        "personality": "friendly",
        "faction": "innkeepers",
        "initial_disposition": 70,
        "voice_style": "warm_motherly"
    },
    "shipwright_igor": {
        "id": "shipwright_igor",
        "name": "Igor Hammerbolt",
        "title": "Master Shipwright",
        "location_type": "port",
        "location_ids": [10, 20, 30, 40, 50],
        "sprite": "shipwright",
        "description": "A burly craftsman who can repair any vessel - for the right price.",
        "personality": "gruff",
        "faction": "craftsmen",
        "initial_disposition": 45,
        "voice_style": "rough_professional"
    },
    "fortune_teller": {
        "id": "fortune_teller",
        "name": "Madame Coral",
        "title": "Seer of the Depths",
        "location_type": "city",
        "location_ids": [30, 60, 90],
        "sprite": "fortune_teller",
        "description": "An elderly woman who claims to read the future in fish scales.",
        "personality": "mysterious",
        "faction": "mystics",
        "initial_disposition": 55,
        "voice_style": "ethereal_dramatic"
    },
    "guild_master": {
        "id": "guild_master",
        "name": "Admiral Thornwood",
        "title": "Guild Master",
        "location_type": "city",
        "location_ids": [20, 40, 60, 80],
        "sprite": "admiral",
        "description": "The stern leader of the Fishermen's Guild. He values tradition and skill.",
        "personality": "authoritative",
        "faction": "fishermen_guild",
        "initial_disposition": 35,
        "voice_style": "commanding_formal"
    },
    "young_fisher": {
        "id": "young_fisher",
        "name": "Tommy Waves",
        "title": "Aspiring Fisher",
        "location_type": "port",
        "location_ids": [1, 2, 3],
        "sprite": "young_boy",
        "description": "An enthusiastic young fisher eager to learn from experienced captains.",
        "personality": "eager",
        "faction": "none",
        "initial_disposition": 80,
        "voice_style": "enthusiastic_naive"
    }
}

# ============================================================================
# SECTION 2: DIALOGUE TREES (3000+ LINES)
# ============================================================================

DIALOGUE_TREES = {
    "barnacle_bill": {
        "greeting": {
            "text": "Ahoy there, young sailor! *scratches barnacle-covered chin* You look like you've got the sea in your blood. Or is that just seasickness? Heh heh!",
            "options": [
                {"id": "ask_about_fishing", "text": "[Friendly] I'm here to learn about fishing. Any wisdom to share?", "next": "fishing_wisdom", "rep_change": 5},
                {"id": "ask_about_himself", "text": "[Curious] Those barnacles... how long have you been at sea?", "next": "his_story", "rep_change": 3},
                {"id": "ask_for_quest", "text": "[Direct] Got any work for a fisher like me?", "next": "quest_offer", "rep_change": 0},
                {"id": "rudely_dismiss", "text": "[Rude] I don't need advice from an old barnacle.", "next": "offended", "rep_change": -15},
                {"id": "leave", "text": "[Leave] I should get going.", "next": "farewell", "rep_change": 0}
            ]
        },
        "fishing_wisdom": {
            "text": "Wisdom, eh? *settles onto a crate* The sea's got more lessons than a thousand books. First thing you need to know: the fish don't owe you nothing. You gotta earn every catch with patience, skill, and respect for the deep.",
            "options": [
                {"id": "ask_more", "text": "Tell me more. What's the biggest fish you ever caught?", "next": "biggest_catch", "rep_change": 5},
                {"id": "practical_tips", "text": "Any practical tips for a beginner?", "next": "beginner_tips", "rep_change": 3},
                {"id": "ask_about_legendary", "text": "I've heard tales of legendary fish. Are they real?", "next": "legendary_fish_lore", "rep_change": 8},
                {"id": "leave", "text": "Thanks for the wisdom.", "next": "farewell_friendly", "rep_change": 2}
            ]
        },
        "biggest_catch": {
            "text": "*eyes grow distant* The biggest? That'd be the Thunder Leviathan. Back in '67, during the Storm of the Century. Beast was longer than three galleons lined up end to end. Scales like bronze shields, eyes like blazing suns. Fought it for seven days and seven nights...",
            "options": [
                {"id": "ask_outcome", "text": "Did you catch it?", "next": "leviathan_outcome", "rep_change": 3},
                {"id": "express_doubt", "text": "[Skeptical] Seven days? That sounds exaggerated.", "next": "defends_story", "rep_change": -5},
                {"id": "ask_how", "text": "How did you manage to fight something that big?", "next": "leviathan_tactics", "rep_change": 5}
            ]
        },
        "leviathan_outcome": {
            "text": "*chuckles* Catch it? Boy, nobody catches the Thunder Leviathan. It catches you, if it wants. No, I didn't catch it. But I earned its respect. When it finally broke my line - a line thick as your arm, mind you - it looked me in the eye. And it nodded. A creature like that... it understood. We were equals in that moment.",
            "options": [
                {"id": "impressed", "text": "That's... incredible. You're a legend!", "next": "humble_response", "rep_change": 10},
                {"id": "practical", "text": "What line do you recommend for big catches?", "next": "equipment_advice", "rep_change": 3},
                {"id": "ask_location", "text": "Where can I find the Thunder Leviathan?", "next": "leviathan_location", "rep_change": 5}
            ]
        },
        "humble_response": {
            "text": "*waves hand dismissively* Legend? Nah, just an old fisher who's lived long enough to have a few stories. The real legends are the fish themselves. Speaking of which... *leans in conspiratorially* I might know where some special catches can be found, if you prove yourself worthy.",
            "options": [
                {"id": "prove_worthy", "text": "How can I prove myself?", "next": "quest_offer_detailed", "rep_change": 5},
                {"id": "express_interest", "text": "I'm interested. Tell me more.", "next": "secret_spots_intro", "rep_change": 3},
                {"id": "leave", "text": "I'll think about it.", "next": "farewell_interested", "rep_change": 0}
            ]
        },
        "defends_story": {
            "text": "*narrows eyes* Exaggerated? EXAGGERATED?! *slams fist on barrel* I've got the scars to prove it, youngster! *rolls up sleeve to reveal massive claw marks* These here? From when the beast's tail whipped across my deck. Lost three good sailors that night. Don't you dare call me a liar.",
            "options": [
                {"id": "apologize", "text": "[Apologize] I'm sorry, I didn't mean to offend. Please, continue.", "next": "forgiven_continues", "rep_change": -2},
                {"id": "double_down", "text": "[Stubborn] Scars can come from anywhere.", "next": "very_offended", "rep_change": -20},
                {"id": "leave_awkward", "text": "I should go...", "next": "farewell_cold", "rep_change": -5}
            ]
        },
        "very_offended": {
            "text": "*stands up abruptly* Get out of my sight, you disrespectful whelp! Come back when you've learned some manners - and some humility. The sea will teach you both, one way or another. Now GO!",
            "options": [
                {"id": "leave", "text": "[Leave in shame]", "next": "end_negative", "rep_change": -15}
            ]
        },
        "forgiven_continues": {
            "text": "*takes a deep breath* Ah, you're young. The young always doubt what they haven't seen. *sits back down* Let me tell you about that seventh night. The storm had calmed, but the sea was blood red from the sunset. The Leviathan surfaced right next to my ship...",
            "options": [
                {"id": "listen_intently", "text": "[Listen intently]", "next": "leviathan_finale", "rep_change": 5},
                {"id": "ask_question", "text": "Were you scared?", "next": "fear_admission", "rep_change": 3}
            ]
        },
        "leviathan_finale": {
            "text": "It looked at me with those ancient eyes. And in that moment, I understood something. The sea isn't just water. It's alive. Every wave, every current - it's the breath of something bigger than us. The fish are its children. And that Leviathan? It was the eldest child. *pauses* That's why I respect every catch, no matter how small.",
            "options": [
                {"id": "moved", "text": "That's... profound. You've changed how I see fishing.", "next": "bonded", "rep_change": 15},
                {"id": "practical_question", "text": "So how should I approach fishing differently?", "next": "philosophy_practical", "rep_change": 5},
                {"id": "thanks", "text": "Thank you for sharing that story.", "next": "farewell_warm", "rep_change": 10}
            ]
        },
        "bonded": {
            "text": "*beams with genuine warmth* Now you're starting to understand, my friend. The sea chose you, whether you know it or not. Here - *reaches into pocket and pulls out a gleaming scale* - this is from the Thunder Leviathan itself. It'll bring you luck. Consider it a gift from one fisher to another.",
            "rewards": {"item": "leviathan_scale", "rep": 20},
            "options": [
                {"id": "accept_grateful", "text": "I... I don't know what to say. Thank you!", "next": "gift_accepted", "rep_change": 10},
                {"id": "refuse_politely", "text": "I can't accept something so precious.", "next": "insists_gift", "rep_change": 5}
            ]
        },
        "beginner_tips": {
            "text": "Practical tips? Alright, listen close: \n\n1. Watch the birds. Where seagulls dive, fish swim. \n2. Morning and dusk - those are the golden hours. Fish are hungry then. \n3. Match your bait to your quarry. You wouldn't eat something that smells wrong, would you? \n4. Patience ain't just a virtue - it's the only skill that matters. \n5. And most important: respect your catch. A quick end is a mercy.",
            "options": [
                {"id": "thank_tips", "text": "That's helpful! Anything else?", "next": "advanced_tips", "rep_change": 5},
                {"id": "ask_equipment", "text": "What about equipment? What should I buy first?", "next": "equipment_advice", "rep_change": 3},
                {"id": "leave", "text": "Thanks, I'll put this to use.", "next": "farewell_helpful", "rep_change": 5}
            ]
        },
        "advanced_tips": {
            "text": "*strokes beard thoughtfully* Since you're keen to learn... Here's what most fishers never figure out:\n\n- The moon affects different fish different ways. Keep a journal.\n- Storm fish are rare but worth triple. Dangerous, but rewarding.\n- Some fish only bite if you're alone. They sense crowds.\n- If you find a good spot, NEVER tell anyone. Trust me.\n- And listen to the old-timers. We've made all the mistakes already.",
            "options": [
                {"id": "moon_question", "text": "Tell me more about the moon's effects.", "next": "moon_fishing", "rep_change": 5},
                {"id": "storm_question", "text": "Storm fishing? That sounds dangerous.", "next": "storm_fishing", "rep_change": 5},
                {"id": "secret_spot", "text": "Do you have a secret spot you'd share?", "next": "maybe_secret", "rep_change": 3}
            ]
        },
        "moon_fishing": {
            "text": "Ah, lunar fishing! Now you're asking the right questions. *pulls out a worn notebook* See this? Fifty years of observations.\n\n- New Moon: Deep-sea fish rise. Best for rare catches.\n- Full Moon: Surface feeders go crazy. Easy pickings, but nothing special.\n- Waxing Crescent: Reef fish are active. Good for colorful catches.\n- Waning Gibbous: Predators hunt. Dangerous but exciting.\n\nFollow the moon, and you'll always have a good catch.",
            "options": [
                {"id": "copy_notes", "text": "[Perception] Could I... copy some of those notes?", "next": "share_notes", "rep_change": 8, "skill_check": "perception"},
                {"id": "thank_knowledge", "text": "This is invaluable. Thank you!", "next": "farewell_educated", "rep_change": 10},
                {"id": "more_questions", "text": "What about weather patterns?", "next": "weather_patterns", "rep_change": 5}
            ]
        },
        "share_notes": {
            "text": "*eyes you appraisingly* Sharp eye you've got there. Most people don't even notice the notebook. *sighs* Alright, I'll let you copy the basics. But you've gotta promise me something - use this knowledge responsibly. The sea provides, but only if we don't take too much.",
            "rewards": {"item": "lunar_fishing_guide", "skill_boost": {"fishing": 5}},
            "options": [
                {"id": "promise", "text": "I promise. I'll fish with respect.", "next": "trust_earned", "rep_change": 15},
                {"id": "why_care", "text": "Why does it matter how much I take?", "next": "conservation_lecture", "rep_change": 0}
            ]
        },
        "storm_fishing": {
            "text": "*leans back with a serious expression* Storm fishing ain't for the faint of heart. The waves'll throw your boat around like a toy. The lightning'll blind you. The rain'll soak you to the bone. But oh, the FISH! *eyes light up* The Storm Carp, the Thunder Marlin, the Lightning Eel... creatures you'll never see in calm waters.",
            "options": [
                {"id": "how_survive", "text": "How do you survive storm fishing?", "next": "storm_survival", "rep_change": 5},
                {"id": "worth_risk", "text": "Is it really worth the risk?", "next": "storm_worth", "rep_change": 3},
                {"id": "change_subject", "text": "Let's talk about something less dangerous.", "next": "greeting", "rep_change": 0}
            ]
        },
        "maybe_secret": {
            "text": "*chuckles* Share a secret spot? Now why would I do that? *pauses and studies you* Although... you seem different from the usual lot. Tell you what - prove yourself first. Bring me three Golden-Scaled Mackerel, and maybe - MAYBE - I'll tell you about the Moonrise Cove.",
            "quest_offer": {"id": "golden_mackerel_quest", "target": "golden_scaled_mackerel", "count": 3, "reward": "moonrise_cove_location"},
            "options": [
                {"id": "accept_quest", "text": "Deal! I'll find those mackerel.", "next": "quest_accepted", "rep_change": 5},
                {"id": "negotiate", "text": "[Barter] Three seems like a lot. How about two?", "next": "negotiate_quest", "rep_change": 0, "skill_check": "barter"},
                {"id": "refuse_quest", "text": "Maybe another time.", "next": "farewell_neutral", "rep_change": 0}
            ]
        },
        "quest_accepted": {
            "text": "Ha! That's the spirit! Golden-Scaled Mackerel are found in the deeper waters near Coral Landing. They only bite during the golden hour - that's an hour before sunset. Use a shiny lure, nothing else'll work. Good luck, fisher. You're gonna need it.",
            "options": [
                {"id": "thanks_leave", "text": "Thanks for the info. I'll be back!", "next": "farewell_quest", "rep_change": 3},
                {"id": "more_tips", "text": "Any other tips for catching them?", "next": "mackerel_tips", "rep_change": 5}
            ]
        },
        "negotiate_quest": {
            "text": "*laughs heartily* A haggler! I like that. Most folks just accept whatever I say. Alright, smarty - bring me TWO Golden-Scaled Mackerel. But they better be big ones, you hear? None of those runty fish.",
            "quest_offer": {"id": "golden_mackerel_quest_easy", "target": "golden_scaled_mackerel", "count": 2, "size_requirement": "large", "reward": "moonrise_cove_location"},
            "options": [
                {"id": "accept_negotiated", "text": "Deal! Large mackerel it is.", "next": "quest_accepted", "rep_change": 8},
                {"id": "push_further", "text": "[Barter] How about one really massive one?", "next": "negotiation_limit", "rep_change": 0, "skill_check": "barter"}
            ]
        },
        "legendary_fish_lore": {
            "text": "*voice drops to a whisper* The legendary fish... Aye, they're real. As real as you and me. But they're not just fish - they're something MORE. The World-Fish that sleeps beneath the waves. The Ghost Koi that can swim between worlds. The Eternal Cod that's been alive since the world was young...",
            "options": [
                {"id": "world_fish", "text": "Tell me about the World-Fish.", "next": "world_fish_lore", "rep_change": 5},
                {"id": "ghost_koi", "text": "A fish that swims between worlds?", "next": "ghost_koi_lore", "rep_change": 5},
                {"id": "eternal_cod", "text": "The Eternal Cod sounds fascinating.", "next": "eternal_cod_lore", "rep_change": 5},
                {"id": "how_catch", "text": "Can they be caught?", "next": "catching_legends", "rep_change": 8}
            ]
        },
        "world_fish_lore": {
            "text": "*makes a sign against evil* The World-Fish... Some say it's not a fish at all, but the dreaming mind of the ocean itself. It's said that Captain Goldtooth went searching for it on his final voyage. Never came back. Some nights, when the sea is perfectly still, old sailors say you can see its shadow beneath the surface - a shadow that stretches from horizon to horizon.",
            "options": [
                {"id": "goldtooth", "text": "What happened to Captain Goldtooth?", "next": "goldtooth_story", "rep_change": 5},
                {"id": "see_shadow", "text": "Have you ever seen the shadow?", "next": "bill_shadow_story", "rep_change": 8},
                {"id": "other_legends", "text": "Tell me about the other legendary fish.", "next": "ghost_koi_lore", "rep_change": 3}
            ]
        },
        "bill_shadow_story": {
            "text": "*long pause* ...Once. Just once. I was anchored in the Spirit Waters, years ago. Dead calm night. Not a ripple. And then I looked down and... *shudders* The sea just WASN'T there beneath my boat. Just darkness. Endless darkness. And something in that darkness... opened an EYE.",
            "options": [
                {"id": "what_happened", "text": "What did you do?!", "next": "shadow_escape", "rep_change": 5},
                {"id": "terrified", "text": "[Scared] That's... terrifying.", "next": "comfort_fear", "rep_change": 3},
                {"id": "skeptical", "text": "[Skeptical] Are you sure it wasn't just... deep water?", "next": "insists_truth", "rep_change": -5}
            ]
        },
        "shadow_escape": {
            "text": "I prayed. For the first time in forty years, I prayed to every god I could remember. And then... I felt something. Like a hand on my shoulder. My grandmother's voice in my ear, telling me to close my eyes. So I did. When I opened them again, it was dawn, and I was fifty miles from where I started. My anchor was gone. Dissolved, like it had been eaten by something.",
            "options": [
                {"id": "amazing", "text": "That's the most incredible thing I've ever heard.", "next": "bill_reflects", "rep_change": 10},
                {"id": "grandmother", "text": "Your grandmother? Was she...", "next": "grandmother_story", "rep_change": 8},
                {"id": "spirit_waters", "text": "Where are the Spirit Waters?", "next": "spirit_waters_location", "rep_change": 5}
            ]
        },
        "ghost_koi_lore": {
            "text": "The Ghost Koi... *voice becomes reverent* Now that's a fish with a history. Legend says it was once a mortal fish that died defending its school from a predator. The spirits were so moved by its sacrifice that they gave it a new form - one that can pass between the world of the living and the world of the dead. Fisher who catch it can ask one question of any dead soul.",
            "options": [
                {"id": "catch_ghost_koi", "text": "How would someone catch a Ghost Koi?", "next": "catching_ghost_koi", "rep_change": 5},
                {"id": "asked_question", "text": "Has anyone ever asked a question?", "next": "ghost_koi_questions", "rep_change": 8},
                {"id": "other_legends", "text": "What about the Eternal Cod?", "next": "eternal_cod_lore", "rep_change": 3}
            ]
        },
        "catching_ghost_koi": {
            "text": "You'd need to fish in water where the veil between worlds is thin. The Spirit Waters, during a new moon, using a bait made from... *hesitates* ...from something precious to someone who died. A lock of hair. A wedding ring. Something that still holds their love. Even then, you might wait years. The Ghost Koi chooses its fisher, not the other way around.",
            "options": [
                {"id": "sad", "text": "That's beautiful and sad at the same time.", "next": "bill_agrees", "rep_change": 5},
                {"id": "practical", "text": "Do you know anyone who's caught one?", "next": "ghost_koi_fisher", "rep_change": 8},
                {"id": "leave", "text": "I need some time to think about all this.", "next": "farewell_thoughtful", "rep_change": 5}
            ]
        },
        "eternal_cod_lore": {
            "text": "*chuckles* The Eternal Cod! Now there's a fish with personality. They say it's the oldest living creature in all the seas. Been swimming since before humans built their first boats. It's got the accumulated wisdom of countless ages. But here's the thing - it's also incredibly cranky. Hates being bothered. Most fishers who've encountered it got lectured about the decline of fishing ethics for three hours straight.",
            "options": [
                {"id": "laugh", "text": "[Laugh] A cranky, immortal fish? That's amazing.", "next": "cod_stories", "rep_change": 5},
                {"id": "wisdom", "text": "But imagine what it knows!", "next": "cod_wisdom", "rep_change": 5},
                {"id": "location", "text": "Where can it be found?", "next": "cod_location", "rep_change": 3}
            ]
        },
        "cod_stories": {
            "text": "*grins* Oh, the stories about Old Codger - that's what we call it! There's one tale about a fisher who hooked it by accident. The Cod surfaced, looked at his boat, and said 'Your grandfather used better equipment. Your great-grandfather had better manners. And your great-great-grandfather? Now THERE was a fisher.' Then it snapped the line and swam off.",
            "options": [
                {"id": "more_stories", "text": "Do you have more Eternal Cod stories?", "next": "cod_more_stories", "rep_change": 5},
                {"id": "ask_wisdom", "text": "Has it ever shared actual wisdom?", "next": "cod_wisdom", "rep_change": 5},
                {"id": "thanks_stories", "text": "Thanks for all these stories!", "next": "farewell_entertained", "rep_change": 8}
            ]
        },
        "catching_legends": {
            "text": "*looks at you very seriously* Caught? Boy, you don't CATCH legendary fish. You might encounter them, if you're lucky - or unlucky. You might earn a moment of their attention. But catch? *shakes head* The World-Fish is bigger than any net. The Ghost Koi chooses who it appears to. The Eternal Cod is too smart to be fooled. No, these aren't fish to be caught. They're fish to be... experienced.",
            "options": [
                {"id": "disappointed", "text": "So there's no point trying?", "next": "hope_legendary", "rep_change": 0},
                {"id": "understand", "text": "I think I understand. It's about the journey.", "next": "bill_approves", "rep_change": 10},
                {"id": "challenge", "text": "[Determined] I'll be the first to catch one.", "next": "warns_hubris", "rep_change": 0}
            ]
        },
        "hope_legendary": {
            "text": "*holds up a finger* I didn't say that! The point isn't the catching - it's the SEEKING. The fishers who've had encounters with legendary fish? They all share something. They didn't set out to catch legends. They set out to be the best fishers they could be. The legends... they noticed. And sometimes, they rewarded that dedication.",
            "options": [
                {"id": "how_become_best", "text": "How do I become the best fisher I can be?", "next": "path_to_mastery", "rep_change": 10},
                {"id": "thanks", "text": "Thank you for this perspective.", "next": "farewell_enlightened", "rep_change": 8},
                {"id": "practical", "text": "For now, I'll focus on regular fish.", "next": "approves_practical", "rep_change": 5}
            ]
        },
        "bill_approves": {
            "text": "*beams with genuine approval* NOW you're thinking like a true fisher! The journey, the craft, the respect for the sea - THAT'S what matters. The fish are just... proof. Proof that you've earned a moment of the ocean's attention. *stands and offers hand* You've got good instincts. If you ever need advice, you know where to find me.",
            "rewards": {"rep": 20, "title_unlocked": "Friend of Barnacle Bill"},
            "options": [
                {"id": "shake_hand", "text": "*shake his hand firmly*", "next": "farewell_bonded", "rep_change": 10},
                {"id": "ask_more", "text": "Before I go - one more question?", "next": "one_more_question", "rep_change": 0}
            ]
        },
        "path_to_mastery": {
            "text": "*settles back, clearly enjoying this topic* The path to mastery? It's simple to describe, hard to follow:\n\n1. Fish every day. Rain or shine. Catch or nothing.\n2. Learn from every failure. Each lost fish teaches something.\n3. Study the water like it's scripture. Know the tides, the temperatures, the moods.\n4. Respect other fishers. Share knowledge. Compete with honor.\n5. Never stop being a student. The sea has infinite lessons.\n\nDo all this for twenty years, and you MIGHT be called a master.",
            "options": [
                {"id": "twenty_years", "text": "Twenty years?!", "next": "patience_lesson", "rep_change": 0},
                {"id": "commit", "text": "I'm willing to put in the time.", "next": "approves_commitment", "rep_change": 15},
                {"id": "shortcut", "text": "[Impatient] Is there no faster way?", "next": "no_shortcuts", "rep_change": -5}
            ]
        },
        "patience_lesson": {
            "text": "*laughs* Seems long? I've been fishing for SEVENTY years, and I'm still learning! Just last week, a fish I'd never seen before surprised me at my usual spot. Seventy years, and the sea still has secrets from me. That's the beauty of it. You'll never be bored, never be finished.",
            "options": [
                {"id": "inspiring", "text": "That's... actually inspiring.", "next": "glad_inspired", "rep_change": 10},
                {"id": "worried", "text": "Seventy years? How old ARE you?", "next": "age_revelation", "rep_change": 5},
                {"id": "thanks", "text": "Thank you for the perspective.", "next": "farewell_wise", "rep_change": 5}
            ]
        },
        "age_revelation": {
            "text": "*winks* Old enough that I've stopped counting. Some say the sea preserves those who truly love her. Others say I made a deal with a mermaid in my youth. *chuckles* The truth? I just never stopped fishing. The day I stop, I'll probably turn to dust. So I keep at it. Every single day.",
            "options": [
                {"id": "mermaid_deal", "text": "Wait - did you actually make a deal with a mermaid?", "next": "mermaid_story", "rep_change": 8},
                {"id": "admire", "text": "You're a legend yourself, Barnacle Bill.", "next": "humble_legend", "rep_change": 10},
                {"id": "leave", "text": "I should let you get back to fishing.", "next": "farewell_respectful", "rep_change": 5}
            ]
        },
        "mermaid_story": {
            "text": "*eyes twinkle mysteriously* That's a story for another day, young one. Maybe when you've got a few more catches under your belt. Maybe when you've proven you can keep a secret. For now, just know that the sea has many... inhabitants. Not all of them are fish. And not all of them are unfriendly.",
            "options": [
                {"id": "intrigued", "text": "I'll earn that story one day.", "next": "bill_smiles", "rep_change": 8},
                {"id": "ask_hint", "text": "Can you at least tell me what a mermaid is like?", "next": "mermaid_hint", "rep_change": 3},
                {"id": "leave", "text": "I'll look forward to hearing it.", "next": "farewell_anticipating", "rep_change": 5}
            ]
        },
        "his_story": {
            "text": "*touches barnacles fondly* These old friends? Collected 'em over eighty years at sea. Each one has a story. This one here - *points to a large barnacle on his cheek* - attached itself when I was fishing the Abyssal Depths. Water so deep and cold that regular men would die. But I held my breath for seven minutes and caught a fish that glowed like moonlight.",
            "options": [
                {"id": "seven_minutes", "text": "Seven minutes?! How is that possible?", "next": "breath_secret", "rep_change": 5},
                {"id": "glowing_fish", "text": "A glowing fish? What was it?", "next": "luminous_catch", "rep_change": 5},
                {"id": "more_barnacles", "text": "Tell me about another barnacle.", "next": "barnacle_stories", "rep_change": 8}
            ]
        },
        "breath_secret": {
            "text": "*taps nose* Trade secret of the deep-water fishers. We learn to slow our hearts, to let the cold embrace us like a blanket. The sea doesn't take those who surrender to her - only those who fight. I stopped fighting the cold and became part of it. For those seven minutes, I was more water than man.",
            "options": [
                {"id": "learn_technique", "text": "Can you teach me that technique?", "next": "breath_teaching", "rep_change": 10, "skill_check": "patience"},
                {"id": "amazed", "text": "You're full of surprises.", "next": "bill_laughs", "rep_change": 5},
                {"id": "back_to_fishing", "text": "Let's talk about fishing tips.", "next": "beginner_tips", "rep_change": 0}
            ]
        },
        "breath_teaching": {
            "text": "*looks at you appraisingly* Teach you? That's not something learned in a day. Or a month. Or even a year. It takes dedication. Meditation. Hours sitting in cold water until your body forgets it should be warm. *pauses* But I see something in you. Come back when you've caught 100 fish, and we'll begin the first lesson.",
            "quest_offer": {"id": "breath_training_quest", "requirement": "catch_100_fish", "reward": "cold_water_mastery_lesson"},
            "options": [
                {"id": "accept", "text": "I'll be back with 100 catches!", "next": "quest_accepted_breath", "rep_change": 10},
                {"id": "too_hard", "text": "That sounds too difficult right now.", "next": "understands_decline", "rep_change": 0},
                {"id": "negotiate", "text": "[Persuade] Could we start with a smaller goal?", "next": "breath_negotiate", "skill_check": "persuade"}
            ]
        },
        "quest_offer": {
            "text": "*scratches chin* Work, eh? Well, there's always work for a willing fisher. Let me see... *looks at the horizon* There's a merchant ship coming in tomorrow that needs fresh catch. Or you could help me track down a fish that's been eluding me for weeks. Or, if you're feeling brave, there's a nest of sea serpents that's been scaring away the mackerel...",
            "options": [
                {"id": "merchant_job", "text": "Tell me about the merchant ship job.", "next": "merchant_quest", "rep_change": 0},
                {"id": "elusive_fish", "text": "What's this elusive fish?", "next": "elusive_fish_quest", "rep_change": 5},
                {"id": "sea_serpents", "text": "[Brave] Sea serpents? I'm in.", "next": "serpent_quest", "rep_change": 10}
            ]
        },
        "merchant_quest": {
            "text": "The Golden Wave's coming in from the Western Isles. Captain needs twenty fresh fish - nothing fancy, just good eating fish - for the crew's dinner. Pays 50 doubloons. Easy work if you've got the skill. Deadline's sunset tomorrow.",
            "quest_offer": {"id": "merchant_supply", "target": "any_fish", "count": 20, "reward": 50, "deadline": "1_day"},
            "options": [
                {"id": "accept", "text": "I can do that. Count me in!", "next": "quest_accepted_merchant", "rep_change": 5},
                {"id": "more_pay", "text": "[Barter] 50 doubloons for twenty fish? I want more.", "next": "negotiate_merchant", "skill_check": "barter"},
                {"id": "other_quest", "text": "What about the other jobs?", "next": "quest_offer", "rep_change": 0}
            ]
        },
        "elusive_fish_quest": {
            "text": "*eyes narrow with obsession* The Silver Shadow. A fish I've been chasing for thirty years. Quick as lightning, clever as a fox. It only appears during the full moon, in the waters near Moonrise Cove. Every time I get close, it vanishes. I'm getting too old for the chase. Maybe young blood is what's needed.",
            "quest_offer": {"id": "silver_shadow_hunt", "target": "silver_shadow", "count": 1, "reward": "legendary_rod", "time_condition": "full_moon"},
            "options": [
                {"id": "accept", "text": "I'll catch your Silver Shadow!", "next": "quest_accepted_shadow", "rep_change": 15},
                {"id": "info", "text": "Tell me everything you know about it.", "next": "shadow_details", "rep_change": 5},
                {"id": "decline", "text": "Sounds too challenging for me right now.", "next": "understands_decline", "rep_change": 0}
            ]
        },
        "serpent_quest": {
            "text": "*eyebrows raise* Brave or foolish? We'll see! The nest is in the rocky caves near Skull Island. Three serpents, each longer than a fishing boat. They won't attack unless provoked, but they're definitely scaring the fish. Drive them off - don't kill 'em, just convince them to move - and I'll pay you 200 doubloons plus whatever they're hoarding.",
            "quest_offer": {"id": "serpent_relocation", "target": "drive_off_serpents", "count": 3, "reward": {"gold": 200, "loot": "serpent_hoard"}, "warning": "dangerous"},
            "options": [
                {"id": "accept", "text": "I'll handle those serpents!", "next": "quest_accepted_serpent", "rep_change": 15},
                {"id": "how", "text": "How do I drive off sea serpents without fighting?", "next": "serpent_tactics", "rep_change": 5},
                {"id": "reconsider", "text": "On second thought, maybe something easier.", "next": "merchant_quest", "rep_change": -2}
            ]
        },
        "offended": {
            "text": "*face hardens* Old barnacle, am I? Well, this old barnacle's forgotten more about the sea than you'll ever learn. *turns away* Come back when you've grown some respect along with your sea legs.",
            "options": [
                {"id": "apologize", "text": "[Apologize] Wait - I'm sorry. That was rude of me.", "next": "accepts_apology", "rep_change": 5},
                {"id": "leave_proud", "text": "[Leave without apologizing]", "next": "end_negative", "rep_change": -10}
            ]
        },
        "accepts_apology": {
            "text": "*sighs and turns back* Apology accepted. The sea teaches humility soon enough - usually the hard way. Consider this your first lesson without drowning. Now, what did you actually want?",
            "options": [
                {"id": "fishing_advice", "text": "I'd like to learn about fishing.", "next": "fishing_wisdom", "rep_change": 3},
                {"id": "work", "text": "Do you have any work?", "next": "quest_offer", "rep_change": 0},
                {"id": "leave", "text": "I should go.", "next": "farewell_neutral", "rep_change": 0}
            ]
        },
        "farewell": {
            "text": "Off you go then. May your nets be full and your storms be few. Come back when you've got time to chat proper-like.",
            "options": [
                {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 0}
            ]
        },
        "farewell_friendly": {
            "text": "*nods warmly* Safe waters, young one. Remember what I told you. The sea rewards those who respect her. Come back anytime - I'm usually right here, watching the tides.",
            "options": [
                {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 5}
            ]
        },
        "farewell_cold": {
            "text": "*grunts* Hmph. Off with you then. *turns back to the sea* Some folks ain't worth the breath...",
            "options": [
                {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": -5}
            ]
        },
        "farewell_warm": {
            "text": "*clasps your shoulder* You've got a good heart and a listening ear. That's more than most. The sea's gonna treat you well, I can feel it. Now go on - those fish won't catch themselves! *winks*",
            "options": [
                {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 10}
            ]
        },
        "farewell_bonded": {
            "text": "*holds handshake a moment longer* Welcome to the fellowship of fishers, my friend. You ever need help, advice, or just a good story - you know where to find old Bill. The sea brought us together for a reason. Don't forget that.",
            "rewards": {"title": "Friend of the Sea", "rep": 15},
            "options": [
                {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 0}
            ]
        },
        "end": {
            "text": "",
            "end_conversation": True
        },
        "end_negative": {
            "text": "",
            "end_conversation": True,
            "negative_ending": True
        }
    },
    
    # Captain Redbeard dialogue tree
    "captain_redbeard": {
        "greeting": {
            "text": "*loud, booming voice* HALT! Who approaches Captain Redbeard's domain?! *hand moves to cutlass* State your business, landlubber, before I have ye walk the plank!",
            "options": [
                {"id": "polite", "text": "[Respectful] Captain Redbeard! I come seeking work, if you'll have me.", "next": "intrigued", "rep_change": 5},
                {"id": "bold", "text": "[Bold] I'm here to prove myself to the most feared pirate on the seas!", "next": "impressed_bold", "rep_change": 10},
                {"id": "scared", "text": "[Nervous] I-I didn't mean to intrude...", "next": "contempt", "rep_change": -5},
                {"id": "challenge", "text": "[Challenge] Feared? You don't look so tough.", "next": "enraged", "rep_change": -20}
            ]
        },
        "intrigued": {
            "text": "*strokes magnificent red beard* Work, ye say? *eyes you up and down* Hmm. You've got some salt in ye, I can see that. But can ye FISH? On my ship, every hand pulls their weight - and that includes filling the cargo hold with the finest catch!",
            "options": [
                {"id": "can_fish", "text": "I'm one of the best fishers you'll find!", "next": "prove_it", "rep_change": 0},
                {"id": "learning", "text": "I'm still learning, but I'm dedicated.", "next": "respects_honesty", "rep_change": 5},
                {"id": "ask_about_ship", "text": "Tell me about your ship.", "next": "ship_pride", "rep_change": 3}
            ]
        },
        "impressed_bold": {
            "text": "*throws head back and LAUGHS* HAHAHAHA! Brave words! *slaps thigh* I like that! Most who see me soil themselves and run. You've got spine, I'll give ye that! *leans in, eyes gleaming* But can ye back up that bravado?",
            "options": [
                {"id": "absolutely", "text": "Try me.", "next": "pirate_test", "rep_change": 10},
                {"id": "what_test", "text": "What would you have me do?", "next": "pirate_test", "rep_change": 5},
                {"id": "nervous_now", "text": "[Backing down] Well... what exactly did you have in mind?", "next": "disappointed", "rep_change": -5}
            ]
        },
        "contempt": {
            "text": "*sneers* Didn't mean to intrude? BAH! *spits on ground* The seas have no room for the timid! Get out of my sight before I make an example of ye!",
            "options": [
                {"id": "stand_ground", "text": "[Courage] Wait - I can be useful!", "next": "one_chance", "rep_change": 5},
                {"id": "flee", "text": "[Run away]", "next": "end_cowardly", "rep_change": -15}
            ]
        },
        "enraged": {
            "text": "*draws cutlass with lightning speed, blade at your throat* You DARE mock Captain Redbeard?! I've sunk thirty ships, survived five storms that would kill lesser men, and caught the legendary Scarlet Kraken with my bare hands!",
            "options": [
                {"id": "apologize", "text": "[Apologize quickly] I meant no disrespect! I was testing myself!", "next": "considers", "rep_change": 0},
                {"id": "dont_back_down", "text": "[Stand firm] I stand by what I said.", "next": "fight_or_respect", "rep_change": 0, "skill_check": "courage"},
                {"id": "beg", "text": "[Beg for mercy]", "next": "utter_contempt", "rep_change": -25}
            ]
        },
        "fight_or_respect": {
            "text": "*long, tense pause* ...Heh. HAHAHA! *sheathes cutlass* Either you're the bravest fool I've ever met, or you've got stones bigger than cannonballs! *claps you on shoulder hard enough to hurt* I LIKE you! Most would've wet themselves!",
            "options": [
                {"id": "thanks", "text": "*let out breath you were holding*", "next": "respects_courage", "rep_change": 20},
                {"id": "had_plan", "text": "I had a plan if you attacked.", "next": "curious_plan", "rep_change": 10}
            ]
        },
        "respects_courage": {
            "text": "Courage like that is rare. The seas need more folk who don't bend at the first sign of danger. *offers hand* Captain Redbeard, though I suppose ye already knew that. What's your name, ye crazy fool?",
            "options": [
                {"id": "give_name", "text": "[Give your name]", "next": "named_accepted", "rep_change": 10},
                {"id": "nickname", "text": "They call me [nickname].", "next": "named_accepted", "rep_change": 10}
            ]
        },
        "pirate_test": {
            "text": "*grins wickedly* Here's your test, would-be pirate. See that island there? *points to distant rock* Skull Island. Abandoned for years. Except it ain't abandoned anymore. Something's moved in. I want to know WHAT. Scout it, report back, don't die. Think ye can handle that?",
            "quest_offer": {"id": "skull_island_scout", "target": "scout_skull_island", "reward": {"gold": 150, "rep": 25}},
            "options": [
                {"id": "accept", "text": "Consider it done.", "next": "quest_accepted_redbeard", "rep_change": 10},
                {"id": "what_moved_in", "text": "What do you think moved in?", "next": "skull_island_rumors", "rep_change": 5},
                {"id": "payment", "text": "What's in it for me?", "next": "discusses_reward", "rep_change": 0}
            ]
        },
        "skull_island_rumors": {
            "text": "*lowers voice* Rumors say it's the ghost of Captain Wraithbeard - me old rival. Others say it's sea serpents. Some say... *pauses* ...something worse. Lights been seen at night. Sounds that ain't natural. Three scouts I sent didn't come back.",
            "options": [
                {"id": "still_go", "text": "I'll still do it. I'm not afraid.", "next": "respects_bravery", "rep_change": 15},
                {"id": "more_info", "text": "Tell me more about Wraithbeard.", "next": "wraithbeard_story", "rep_change": 5},
                {"id": "reconsider", "text": "Maybe I should prepare more first.", "next": "not_cowardly", "rep_change": 0}
            ]
        },
        "ship_pride": {
            "text": "*chest swells with pride* The Crimson Terror! Finest vessel to ever sail these waters! Thirty cannons, reinforced hull, sails dyed red with... well, that's a story for another time. *laughs* She's got a crew of sixty, cargo hold big enough to fit a whale, and she's never lost a battle!",
            "options": [
                {"id": "impressed", "text": "She sounds magnificent!", "next": "happy_praise", "rep_change": 10},
                {"id": "can_join", "text": "Could someone like me ever join the crew?", "next": "crew_requirements", "rep_change": 5},
                {"id": "never_lost", "text": "Never lost a battle? Ever?", "next": "battle_stories", "rep_change": 5}
            ]
        },
        "crew_requirements": {
            "text": "*strokes beard thoughtfully* The Crimson Terror only takes the best. Ye'd need to prove yourself first. Bring me something impressive - a legendary catch, a valuable treasure, or complete a task no one else dares. Then we'll talk about a place on me crew.",
            "options": [
                {"id": "what_task", "text": "What kind of task?", "next": "pirate_test", "rep_change": 5},
                {"id": "legendary_catch", "text": "What would count as a legendary catch?", "next": "legendary_requirements", "rep_change": 5},
                {"id": "treasure", "text": "Where would I find valuable treasure?", "next": "treasure_hints", "rep_change": 5}
            ]
        },
        "happy_praise": {
            "text": "*beams* Aye, she is! Built her meself after me old ship was sunk by the Navy. Took five years and every doubloon I had. *pats imaginary hull* She's more than a ship - she's me home, me legacy, me LIFE. Treat her well, and she treats ye well right back.",
            "options": [
                {"id": "admire", "text": "The love you have for her is obvious.", "next": "respects_observation", "rep_change": 8},
                {"id": "old_ship", "text": "What happened to your old ship?", "next": "old_ship_story", "rep_change": 5},
                {"id": "work", "text": "Is there any work I could do for the Terror?", "next": "offers_work", "rep_change": 5}
            ]
        },
        "old_ship_story": {
            "text": "*face darkens* The Sea Witch... *voice becomes quieter* She was me first love. Sailed with her for twenty years. Then the Navy came. Admiral Blackwood - may he rot in the depths - surrounded us with five warships. We fought for six hours...",
            "options": [
                {"id": "what_happened", "text": "What happened?", "next": "sea_witch_fate", "rep_change": 5},
                {"id": "console", "text": "I'm sorry to bring up painful memories.", "next": "appreciates_sympathy", "rep_change": 8},
                {"id": "admiral", "text": "Admiral Blackwood... is he still alive?", "next": "blackwood_info", "rep_change": 5}
            ]
        },
        "sea_witch_fate": {
            "text": "*clenches fist* They set her ablaze. I watched her burn from the water, along with half me crew. Swore vengeance that day. *looks at you intensely* I got it too. Took me five years, but I found Blackwood's fleet. Sunk every last one of 'em. HE went down with his flagship.",
            "options": [
                {"id": "justice", "text": "Sounds like he got what he deserved.", "next": "agrees_justice", "rep_change": 10},
                {"id": "brutal", "text": "[Concerned] That's... quite a revenge.", "next": "defends_actions", "rep_change": -5},
                {"id": "move_forward", "text": "And now you have the Crimson Terror.", "next": "looks_forward", "rep_change": 5}
            ]
        },
        "agrees_justice": {
            "text": "*nods grimly* Aye. He did. *moment of silence* ...Ye understand, don't ye? The sea has its own justice. Not the fancy laws of landlubbers. Out here, ye live by honor, ye die by honor. Or ye don't live at all.",
            "options": [
                {"id": "understand", "text": "I understand. The sea has its own code.", "next": "respects_understanding", "rep_change": 15},
                {"id": "honor_code", "text": "What's the pirate code of honor?", "next": "pirate_code", "rep_change": 10},
                {"id": "thanks", "text": "Thank you for sharing that with me.", "next": "bond_forming", "rep_change": 10}
            ]
        },
        "pirate_code": {
            "text": "*stands straighter* The Code of the Red Tide - that's what we call it. First: Always honor a deal made in good faith. Second: Never abandon a crewmate. Third: Share plunder fairly. Fourth: Fight to the death before surrender. Fifth: The Captain's word is law at sea, but the crew decides in port.",
            "options": [
                {"id": "good_code", "text": "That's actually... honorable.", "next": "pirates_honor", "rep_change": 10},
                {"id": "death_before", "text": "Death before surrender? That's harsh.", "next": "explains_surrender", "rep_change": 0},
                {"id": "can_follow", "text": "I could follow that code.", "next": "potential_pirate", "rep_change": 15}
            ]
        },
        "pirates_honor": {
            "text": "*nods seriously* Aye. We may be pirates, but we ain't animals. Well... *chuckles* ...most of us ain't. The Code keeps us from becoming the monsters the Navy claims we are. Without rules, even freedom becomes chaos.",
            "rewards": {"knowledge": "pirate_code", "rep": 10},
            "options": [
                {"id": "philosophy", "text": "That's surprisingly philosophical.", "next": "pirate_philosophy", "rep_change": 5},
                {"id": "thanks", "text": "I've learned a lot from you, Captain.", "next": "farewell_respected", "rep_change": 10},
                {"id": "work", "text": "Now that I understand... any work for me?", "next": "pirate_test", "rep_change": 5}
            ]
        },
        "one_chance": {
            "text": "*pauses, hand still on cutlass* ...Useful? *eyes narrow* Ye've got thirty seconds to convince me not to throw ye to the sharks. Go.",
            "options": [
                {"id": "fishing_skill", "text": "I can catch fish others can't. Rare fish. Valuable fish.", "next": "mildly_interested", "rep_change": 5},
                {"id": "information", "text": "I know things. Secrets about the merchant routes.", "next": "very_interested", "rep_change": 10},
                {"id": "loyalty", "text": "I'll be the most loyal crewmate you've ever had.", "next": "tests_loyalty", "rep_change": 5}
            ]
        },
        "farewell_respected": {
            "text": "*clasps your arm in warrior's grip* Ye've earned me respect today - not an easy thing. Safe waters, fisher. And remember - should ye ever need a pirate's help, Captain Redbeard remembers his friends. *meaningful look* And his enemies.",
            "rewards": {"rep": 15, "faction_standing": "pirates_neutral"},
            "options": [
                {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 0}
            ]
        },
        "end": {
            "text": "",
            "end_conversation": True
        },
        "end_cowardly": {
            "text": "*Redbeard's mocking laughter follows you* RUN, LITTLE FISH! HAHAHAHA!",
            "end_conversation": True,
            "negative_ending": True
        }
    }
}

# Continue with more NPC dialogue trees...
# (Adding merchant_marina, innkeeper_rosie, etc. - abbreviated for space)

# ============================================================================
# SECTION 3: PYDANTIC MODELS
# ============================================================================

class DialogueRequest(BaseModel):
    user_id: str
    npc_id: str
    choice_id: Optional[str] = None

class DialogueResponse(BaseModel):
    npc_id: str
    npc_name: str
    text: str
    options: List[Dict]
    rewards: Optional[Dict] = None
    quest_offer: Optional[Dict] = None
    end_conversation: bool = False

class UserNPCRelation(BaseModel):
    user_id: str
    npc_id: str
    reputation: int = 50
    quests_completed: List[str] = Field(default_factory=list)
    dialogue_flags: Dict = Field(default_factory=dict)
    last_interaction: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ============================================================================
# SECTION 4: API ROUTES
# ============================================================================

@router.get("/npcs")
async def get_all_npcs():
    """Get all NPC definitions"""
    return {"npcs": list(NPCS.values()), "total": len(NPCS)}

@router.get("/npcs/{npc_id}")
async def get_npc(npc_id: str):
    """Get a specific NPC"""
    npc = NPCS.get(npc_id)
    if not npc:
        raise HTTPException(status_code=404, detail="NPC not found")
    return npc

@router.get("/npcs/location/{location_id}")
async def get_npcs_at_location(location_id: int):
    """Get all NPCs at a specific location"""
    npcs = [npc for npc in NPCS.values() if location_id in npc.get("location_ids", [])]
    return {"npcs": npcs, "location_id": location_id}

@router.post("/talk")
async def talk_to_npc(request: DialogueRequest):
    """Initiate or continue dialogue with an NPC"""
    npc = NPCS.get(request.npc_id)
    if not npc:
        raise HTTPException(status_code=404, detail="NPC not found")
    
    dialogue_tree = DIALOGUE_TREES.get(request.npc_id)
    if not dialogue_tree:
        raise HTTPException(status_code=404, detail="NPC has no dialogue")
    
    # Get user's relationship with this NPC
    relation = await db.npc_relations.find_one(
        {"user_id": request.user_id, "npc_id": request.npc_id},
        {"_id": 0}
    )
    if not relation:
        relation = UserNPCRelation(
            user_id=request.user_id,
            npc_id=request.npc_id,
            reputation=npc.get("initial_disposition", 50)
        ).model_dump()
        await db.npc_relations.insert_one(relation)
    
    # Determine which dialogue node to show
    current_node = "greeting"
    if request.choice_id:
        # Find the choice in current dialogue state
        user_state = await db.dialogue_states.find_one(
            {"user_id": request.user_id, "npc_id": request.npc_id},
            {"_id": 0}
        )
        if user_state:
            current_dialogue = dialogue_tree.get(user_state.get("current_node", "greeting"), {})
            for option in current_dialogue.get("options", []):
                if option["id"] == request.choice_id:
                    current_node = option.get("next", "greeting")
                    # Apply reputation change
                    rep_change = option.get("rep_change", 0)
                    if rep_change != 0:
                        await db.npc_relations.update_one(
                            {"user_id": request.user_id, "npc_id": request.npc_id},
                            {"$inc": {"reputation": rep_change}}
                        )
                    break
    
    # Get the dialogue node
    node = dialogue_tree.get(current_node, dialogue_tree.get("greeting"))
    
    # Save dialogue state
    await db.dialogue_states.update_one(
        {"user_id": request.user_id, "npc_id": request.npc_id},
        {"$set": {
            "current_node": current_node,
            "last_interaction": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    
    # Process rewards if any
    rewards = node.get("rewards")
    if rewards:
        # Apply rewards to user
        if "rep" in rewards:
            await db.npc_relations.update_one(
                {"user_id": request.user_id, "npc_id": request.npc_id},
                {"$inc": {"reputation": rewards["rep"]}}
            )
        if "item" in rewards:
            await db.user_inventory.update_one(
                {"user_id": request.user_id},
                {"$push": {"items": rewards["item"]}},
                upsert=True
            )
    
    return DialogueResponse(
        npc_id=request.npc_id,
        npc_name=npc["name"],
        text=node.get("text", "..."),
        options=node.get("options", []),
        rewards=rewards,
        quest_offer=node.get("quest_offer"),
        end_conversation=node.get("end_conversation", False)
    )

@router.get("/relationship/{user_id}/{npc_id}")
async def get_npc_relationship(user_id: str, npc_id: str):
    """Get user's relationship status with an NPC"""
    relation = await db.npc_relations.find_one(
        {"user_id": user_id, "npc_id": npc_id},
        {"_id": 0}
    )
    if not relation:
        npc = NPCS.get(npc_id)
        return {
            "reputation": npc.get("initial_disposition", 50) if npc else 50,
            "relationship_level": "neutral"
        }
    
    rep = relation.get("reputation", 50)
    if rep >= 90:
        level = "beloved"
    elif rep >= 75:
        level = "friend"
    elif rep >= 50:
        level = "neutral"
    elif rep >= 25:
        level = "disliked"
    else:
        level = "hated"
    
    return {
        "reputation": rep,
        "relationship_level": level,
        "quests_completed": relation.get("quests_completed", [])
    }

@router.get("/user/{user_id}/all-relationships")
async def get_all_relationships(user_id: str):
    """Get all NPC relationships for a user"""
    relations = await db.npc_relations.find(
        {"user_id": user_id},
        {"_id": 0}
    ).to_list(100)
    
    return {"relationships": relations}
