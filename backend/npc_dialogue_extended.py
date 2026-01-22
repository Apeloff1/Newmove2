"""
Extended NPC Dialogue System - Part 2
Additional 1000+ lines of Fallout-style branching dialogue
More NPCs, more depth, more story branches
"""

from typing import Dict, List, Any

# ============================================================================
# MERCHANT MARINA DIALOGUE TREE
# ============================================================================

MERCHANT_MARINA_DIALOGUE = {
    "greeting": {
        "text": "*adjusts spectacles and looks up from ledger* Ah, a customer! Welcome to Goldscale Trading. I'm Marina Goldscale, purveyor of fine goods and... *squints at you* ...appraiser of potential. What brings you to my establishment?",
        "options": [
            {"id": "trade", "text": "[Friendly] I'm looking to do some trading.", "next": "trade_menu", "rep_change": 3},
            {"id": "info", "text": "[Curious] Goldscale... any relation to James Goldscale?", "next": "james_mention", "rep_change": 5},
            {"id": "appraisal", "text": "[Business] I need something appraised.", "next": "appraisal_offer", "rep_change": 0},
            {"id": "gossip", "text": "[Casual] What's the latest news in the trading world?", "next": "market_gossip", "rep_change": 2},
            {"id": "leave", "text": "[Leave] Just browsing. I'll be going.", "next": "farewell_cold", "rep_change": -2}
        ]
    },
    "james_mention": {
        "text": "*freezes, pen hovering over ledger* ...James? *voice cracks slightly* You know something about my husband? He's been... he's been missing for three years. The Guild declared him dead, but I... I never believed it. What do you know?!",
        "options": [
            {"id": "bottle_info", "text": "I found a message in a bottle. It mentioned someone named James Goldscale on the Forgotten Atoll.", "next": "bottle_revelation", "rep_change": 25},
            {"id": "just_name", "text": "I just heard the name somewhere. I'm sorry - I didn't mean to upset you.", "next": "disappointed_hope", "rep_change": 5},
            {"id": "lie", "text": "[Lie] I met him. He's doing fine.", "next": "demands_details", "rep_change": -10}
        ]
    },
    "bottle_revelation": {
        "text": "*tears welling up* A message? From James? *hands trembling as she reaches for you* Please... please tell me everything. Every word. The Forgotten Atoll... I've heard of it. Sailors say ships go there but never return. If James is alive...",
        "options": [
            {"id": "give_bottle", "text": "*hand over the bottle message*", "next": "receives_bottle", "rep_change": 30, "requires_item": "james_bottle"},
            {"id": "summarize", "text": "He said he's been trapped there for three years. The currents won't let him leave. He survives on fish and hope.", "next": "marina_determined", "rep_change": 20},
            {"id": "help_offer", "text": "I could try to rescue him, if you can tell me more about the Atoll.", "next": "rescue_quest_offer", "rep_change": 35}
        ]
    },
    "receives_bottle": {
        "text": "*reads message with shaking hands, tears streaming down face* It's... it's really his handwriting. After all this time... *clutches bottle to chest* You... you've given me something priceless. Hope. *looks at you with fierce determination* I WILL get him back. And you... you're going to help me.",
        "rewards": {"rep": 40, "trust_level": "max", "quest_unlock": "rescue_james"},
        "options": [
            {"id": "accept_help", "text": "Of course. What do you need me to do?", "next": "rescue_mission_planning", "rep_change": 20},
            {"id": "payment", "text": "I'd be happy to help... for the right price.", "next": "understands_business", "rep_change": 5},
            {"id": "reluctant", "text": "The Forgotten Atoll sounds dangerous...", "next": "marina_persuades", "rep_change": 0}
        ]
    },
    "rescue_mission_planning": {
        "text": "*wipes eyes and transforms into sharp businesswoman again* Right. Business mode. The Forgotten Atoll is in the Spirit Waters - stage 75 on the sea charts. The currents there form a trap - easy to sail in, impossible to sail out without special equipment. I can provide that equipment, but I need certain things first...",
        "quest_offer": {
            "id": "rescue_james_goldscale",
            "objectives": [
                {"type": "collect", "item": "current_breaker", "count": 1, "source": "shipwright_igor"},
                {"type": "collect", "item": "spirit_compass", "count": 1, "source": "fortune_teller"},
                {"type": "reach", "location": "forgotten_atoll", "stage": 75}
            ],
            "rewards": {"gold": 5000, "item": "goldscale_heirloom", "reputation": {"merchant_marina": 50}}
        },
        "options": [
            {"id": "accept", "text": "I'll gather what's needed.", "next": "quest_accepted_james", "rep_change": 15},
            {"id": "more_info", "text": "Tell me more about this equipment.", "next": "equipment_explanation", "rep_change": 5},
            {"id": "negotiate", "text": "[Barter] What's my reward for this dangerous mission?", "next": "discusses_reward_james", "rep_change": 0}
        ]
    },
    "trade_menu": {
        "text": "*adjusts spectacles* Trading! Excellent. I deal in all manner of goods - fish, of course, but also supplies, equipment, and occasionally... *lowers voice* ...items of a more exotic nature. What interests you?",
        "options": [
            {"id": "sell_fish", "text": "I have fish to sell.", "next": "fish_appraisal", "rep_change": 0},
            {"id": "buy_supplies", "text": "I need to buy supplies.", "next": "supply_shop", "rep_change": 0},
            {"id": "exotic", "text": "[Curious] Exotic items? Tell me more.", "next": "black_market_hint", "rep_change": 5},
            {"id": "back", "text": "Actually, let me ask about something else.", "next": "greeting", "rep_change": 0}
        ]
    },
    "fish_appraisal": {
        "text": "*pulls out magnifying glass and scales* Let's see what you've got. I pay fair prices - better than fair for quality catches. I've been in this business for twenty years, and I can spot a healthy fish from across the room. *gestures to counter* Lay them out.",
        "options": [
            {"id": "show_common", "text": "*show common fish*", "next": "appraises_common", "rep_change": 0},
            {"id": "show_rare", "text": "*show rare catch*", "next": "appraises_rare", "rep_change": 5},
            {"id": "show_legendary", "text": "*reveal legendary fish*", "next": "appraises_legendary", "rep_change": 15},
            {"id": "negotiate_first", "text": "[Barter] Before I show you - what's your best price guarantee?", "next": "haggle_setup", "rep_change": 3}
        ]
    },
    "appraises_legendary": {
        "text": "*spectacles nearly fall off* Is that... is that what I think it is?! *rushes around counter to examine fish closely* Great Neptune's beard! A genuine ${fish_name}! Do you have ANY idea how rare this is? I've only seen three in my entire career! *composes self* I must have it. Name your price.",
        "options": [
            {"id": "high_price", "text": "[Barter] 10,000 gold, minimum.", "next": "legendary_negotiation", "rep_change": 0},
            {"id": "fair_price", "text": "What's it worth to you?", "next": "legendary_fair_offer", "rep_change": 5},
            {"id": "not_selling", "text": "Actually, I think I'll keep it.", "next": "legendary_disappointment", "rep_change": -5},
            {"id": "trade", "text": "I'll trade it for information instead of gold.", "next": "legendary_info_trade", "rep_change": 10}
        ]
    },
    "legendary_info_trade": {
        "text": "*pauses, surprised* Information? *studies you with new respect* You're smarter than you look. Most fishers just want gold. Information... is power. What do you want to know? I have contacts everywhere - the Guild, the pirates, even... *glances around* ...the Underwater Kingdom.",
        "options": [
            {"id": "underwater_kingdom", "text": "The Underwater Kingdom? Tell me about that.", "next": "underwater_secrets", "rep_change": 10},
            {"id": "guild_secrets", "text": "What secrets does the Fishermen's Guild hide?", "next": "guild_corruption", "rep_change": 8},
            {"id": "james_info", "text": "Tell me about the Forgotten Atoll.", "next": "atoll_knowledge", "rep_change": 5},
            {"id": "pirate_info", "text": "What do you know about Captain Flint's treasure?", "next": "flint_treasure", "rep_change": 8}
        ]
    },
    "underwater_secrets": {
        "text": "*locks shop door and returns* What I'm about to tell you... it cannot leave this room. *takes deep breath* The Underwater Kingdom is real. I've traded with their emissaries. King Finnius XLVII rules a civilization beneath the waves - merfolk, speaking fish, creatures of legend. They watch us surface dwellers... and they're not happy with what they see.",
        "rewards": {"knowledge": "underwater_kingdom_confirmed", "faction_discover": "underwater_kingdom"},
        "options": [
            {"id": "why_unhappy", "text": "Why aren't they happy with us?", "next": "pollution_concern", "rep_change": 5},
            {"id": "how_contact", "text": "How can I contact them?", "next": "underwater_contact_method", "rep_change": 8},
            {"id": "emissaries", "text": "What did you trade with their emissaries?", "next": "emissary_trades", "rep_change": 5},
            {"id": "enough", "text": "That's incredible. I need time to process this.", "next": "farewell_secrets", "rep_change": 0}
        ]
    },
    "pollution_concern": {
        "text": "Overfishing. Pollution. Disrespect. *sighs* They've been patient for centuries, but there are... factions beneath the waves that want to end the surface world. The moderates still believe in coexistence, but they're losing influence. King Finnius is old, and his heir... *shakes head* ...Prince Scaleborn is not as forgiving.",
        "options": [
            {"id": "prevent_war", "text": "Is there a way to prevent conflict?", "next": "peace_path", "rep_change": 10},
            {"id": "side_underwater", "text": "[Dark] Maybe they have a point.", "next": "marina_disturbed", "rep_change": -10},
            {"id": "defend_surface", "text": "We need to prepare defenses!", "next": "war_path", "rep_change": 0}
        ]
    },
    "peace_path": {
        "text": "*eyes light up* You think like I do! There IS a way. The ancient treaties speak of a ritual - a gift from the surface world that could renew the bonds of trust. It requires... *checks notes* ...a fish caught by a surface dweller, cooked with love, and presented by someone the sea has blessed. If such a person could reach the Coral Palace...",
        "quest_offer": {
            "id": "underwater_peace_treaty",
            "type": "legendary_quest",
            "requirements": ["blessing_of_sea", "legendary_cooking", "underwater_access"],
            "rewards": {"title": "Ambassador of Two Worlds", "faction_standing": {"underwater_kingdom": 100, "fishermen_guild": 50}}
        },
        "options": [
            {"id": "accept_peace", "text": "I'll work toward making this happen.", "next": "marina_hopeful", "rep_change": 20},
            {"id": "how_blessed", "text": "How does one become blessed by the sea?", "next": "blessing_explanation", "rep_change": 10},
            {"id": "too_big", "text": "That sounds too important for someone like me.", "next": "marina_encourages", "rep_change": 5}
        ]
    },
    "market_gossip": {
        "text": "*sets down quill* Ah, gossip! The lifeblood of any good merchant. *leans in conspiratorially* Let me tell you what's happening in our little corner of the world...\n\n- Fish prices are rising - something's disturbing the schools.\n- Captain Redbeard's been seen near the Volcanic Waters.\n- The Guild is preparing some kind of grand announcement.\n- And strangest of all - bottles with messages keep washing ashore.",
        "options": [
            {"id": "fish_prices", "text": "Why are fish prices rising?", "next": "market_analysis", "rep_change": 3},
            {"id": "redbeard_info", "text": "What's Redbeard doing near the Volcanic Waters?", "next": "redbeard_movements", "rep_change": 5},
            {"id": "guild_announcement", "text": "What's this Guild announcement?", "next": "guild_plans", "rep_change": 5},
            {"id": "bottles", "text": "Bottles with messages? Tell me more.", "next": "bottle_phenomenon", "rep_change": 8}
        ]
    },
    "bottle_phenomenon": {
        "text": "*lowers voice* It started about three months ago. Fishers finding bottles everywhere - in their nets, washed up on shores, even appearing in their boats overnight. The messages inside... some are warnings, some are treasure maps, and some... *shivers* ...some are from people who shouldn't be able to write. People who died years ago.",
        "options": [
            {"id": "ghost_letters", "text": "Letters from the dead?!", "next": "ghost_mail_explanation", "rep_change": 5},
            {"id": "treasure_maps", "text": "Treasure maps? Has anyone found anything?", "next": "treasure_hunters_fate", "rep_change": 5},
            {"id": "warnings", "text": "What kind of warnings?", "next": "warning_messages", "rep_change": 8},
            {"id": "origin", "text": "Where are the bottles coming from?", "next": "bottle_source", "rep_change": 10}
        ]
    },
    "ghost_mail_explanation": {
        "text": "Old Barnacle Bill got one from his grandmother - she died forty years ago. The letter mentioned things only she could know, including where she hid her wedding ring. He found the ring exactly where the letter said. *pauses* The sea is speaking to us somehow. Or something in the sea is.",
        "rewards": {"knowledge": "ghost_mail_phenomenon"},
        "options": [
            {"id": "investigate", "text": "I want to investigate this.", "next": "investigation_offer", "rep_change": 10},
            {"id": "scared", "text": "That's terrifying.", "next": "marina_agrees", "rep_change": 3},
            {"id": "skeptical", "text": "[Skeptical] There must be a rational explanation.", "next": "rational_options", "rep_change": 0}
        ]
    },
    "farewell_cold": {
        "text": "*barely looks up from ledger* Mmm. Do come back when you're actually buying something. Time is money, you know.",
        "options": [
            {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 0}
        ]
    },
    "farewell_secrets": {
        "text": "*unlocks door* Remember what I told you. And if you ever need anything - information, supplies, a friend in the merchant's world... *hands you a card* My door is always open to those who see the bigger picture.",
        "rewards": {"item": "marina_business_card", "rep": 15},
        "options": [
            {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 0}
        ]
    },
    "end": {
        "text": "",
        "end_conversation": True
    }
}

# ============================================================================
# INNKEEPER ROSIE DIALOGUE TREE
# ============================================================================

INNKEEPER_ROSIE_DIALOGUE = {
    "greeting": {
        "text": "*beams warmly* Welcome to the Salty Dog Inn, dearie! Come in, come in! You look like you've been out on the water all day. Sit yourself down by the fire - I'll have a hot meal ready in no time. Unless... *eyes twinkle* ...you're here for something else?",
        "options": [
            {"id": "room", "text": "I need a room for the night.", "next": "room_options", "rep_change": 3},
            {"id": "meal", "text": "A hot meal sounds perfect.", "next": "meal_menu", "rep_change": 5},
            {"id": "gossip", "text": "What's the word around the docks?", "next": "local_gossip", "rep_change": 5},
            {"id": "stories", "text": "Know any good stories?", "next": "story_time", "rep_change": 8},
            {"id": "drunk_sailor", "text": "*look around* Any interesting characters here tonight?", "next": "patron_descriptions", "rep_change": 3}
        ]
    },
    "room_options": {
        "text": "Rooms! Of course, dearie. I've got three types:\n\n- The Hammock Corner: 10 gold. Basic, but clean. You'll share with three other sailors.\n- The Captain's Berth: 30 gold. Private room, decent bed, window overlooking the harbor.\n- The Admiral's Suite: 100 gold. The best we've got. Four-poster bed, private bath, and breakfast included.\n\nWhich suits your fancy?",
        "options": [
            {"id": "hammock", "text": "The Hammock Corner will do.", "next": "book_hammock", "rep_change": 0},
            {"id": "captain", "text": "Captain's Berth sounds good.", "next": "book_captain", "rep_change": 3},
            {"id": "admiral", "text": "I'll take the Admiral's Suite.", "next": "book_admiral", "rep_change": 10},
            {"id": "too_expensive", "text": "I'll think about it.", "next": "room_hesitation", "rep_change": 0}
        ]
    },
    "book_admiral": {
        "text": "*eyebrows raise appreciatively* The Admiral's Suite! Well now, we have a proper captain among us! *takes payment* Right this way, dearie. You'll find fresh towels, a warm fire already burning, and I'll send up some spiced wine on the house. Sleep well - you've earned it.",
        "rewards": {"rest_bonus": "full", "buff": "well_rested_premium", "duration": 7200},
        "options": [
            {"id": "thanks", "text": "Thank you, Rosie.", "next": "rosie_advice", "rep_change": 5},
            {"id": "wine", "text": "Spiced wine sounds wonderful.", "next": "wine_delivery", "rep_change": 3}
        ]
    },
    "rosie_advice": {
        "text": "*pats your arm* You know, dearie, I've been running this inn for forty years. Seen a lot of fishers come and go. The ones who last... they're not always the strongest or the richest. They're the ones who remember that the sea is bigger than all of us. *meaningful look* Don't ever let pride make you forget that.",
        "options": [
            {"id": "wisdom", "text": "That's wise advice. Thank you.", "next": "rosie_stories_tease", "rep_change": 10},
            {"id": "experience", "text": "You've seen a lot in forty years, haven't you?", "next": "rosie_history", "rep_change": 8},
            {"id": "retire", "text": "[Rest now]", "next": "end", "rep_change": 0}
        ]
    },
    "rosie_history": {
        "text": "*chuckles warmly* More than I care to remember, dearie. I was a fisher myself, once. Had my own boat - the Sweet Surrender. Sailed her for twenty years before I settled down. *distant look* Lost her in the Storm of '82. Lost... a lot that year. But the sea gives and takes in equal measure. *shakes off mood* That's why I opened this inn. To give sea-weary souls a warm place to rest.",
        "options": [
            {"id": "lost", "text": "I'm sorry. What did you lose?", "next": "rosie_loss", "rep_change": 5},
            {"id": "sweet_surrender", "text": "Sweet Surrender is a beautiful name for a boat.", "next": "boat_story", "rep_change": 5},
            {"id": "storm_82", "text": "The Storm of '82? I've heard of that.", "next": "storm_82_story", "rep_change": 8}
        ]
    },
    "rosie_loss": {
        "text": "*long pause, eyes glistening* My crew. My friends. And... my son. Tommy was his name. Just fourteen. He begged me to let him come on that voyage. *wipes eye* I should have said no. A mother should have said no. But he loved the sea so much...",
        "options": [
            {"id": "condolences", "text": "I'm so sorry, Rosie. I shouldn't have asked.", "next": "rosie_accepts", "rep_change": 10},
            {"id": "memory", "text": "Tell me about Tommy.", "next": "tommy_memory", "rep_change": 15},
            {"id": "silent_support", "text": "*place hand on her shoulder*", "next": "rosie_grateful", "rep_change": 12}
        ]
    },
    "tommy_memory": {
        "text": "*smiles through tears* He was the best of us. Could read the water like nobody else - even at fourteen, he knew where the fish would be before they got there. Always laughing, always singing those silly sea shanties. *pauses* You know what his last words were? 'Look, Ma - dolphins!' He was pointing at them when the wave hit. He died... he died happy, at least.",
        "rewards": {"relationship": "deep_bond", "title": "Friend of Rosie"},
        "options": [
            {"id": "beautiful", "text": "That's... heartbreaking and beautiful at the same time.", "next": "rosie_philosophy", "rep_change": 10},
            {"id": "honor_memory", "text": "I'll think of Tommy next time I see dolphins.", "next": "rosie_touched", "rep_change": 20},
            {"id": "too_sad", "text": "I... I need a moment.", "next": "rosie_understands", "rep_change": 5}
        ]
    },
    "rosie_touched": {
        "text": "*tears flow freely now, but she's smiling* Oh, dearie... *hugs you tightly* That's the kindest thing anyone's said to me in years. Tommy would have liked you. He always had a sense for good people. *releases you, wiping eyes* Here - *presses something into your hand* - this was his lucky charm. A dolphin carved from driftwood. I think... I think he'd want you to have it.",
        "rewards": {"item": "tommys_dolphin_charm", "buff": "luck_bonus_permanent", "relationship": "family"},
        "options": [
            {"id": "accept_honored", "text": "I'll treasure it always.", "next": "rosie_blessing", "rep_change": 25},
            {"id": "refuse_politely", "text": "I can't take something so precious to you.", "next": "rosie_insists", "rep_change": 10}
        ]
    },
    "rosie_blessing": {
        "text": "*cups your face in weathered hands* May the sea be gentle with you, dearie. May your nets always be full, your compass always true, and may you always find your way home. *kisses forehead* That's an innkeeper's blessing. It's not magic, but... well, those who receive it seem to have good luck on the water.",
        "rewards": {"buff": "innkeepers_blessing", "duration": "permanent_minor"},
        "options": [
            {"id": "grateful", "text": "Thank you, Rosie. For everything.", "next": "farewell_warm", "rep_change": 15},
            {"id": "blessing_power", "text": "Is the blessing really just luck?", "next": "blessing_secret", "rep_change": 10}
        ]
    },
    "blessing_secret": {
        "text": "*winks mysteriously* Who's to say? I learned it from my grandmother, who learned it from hers. They say our family has sea-folk blood somewhere way back. Nonsense, probably. But... *lowers voice* ...every fisher I've blessed has come back alive from their voyages. Even the dangerous ones. Make of that what you will.",
        "rewards": {"knowledge": "rosie_heritage_hint"},
        "options": [
            {"id": "sea_folk", "text": "Sea-folk blood? You mean mermaids?", "next": "mermaid_heritage", "rep_change": 8},
            {"id": "accept_mystery", "text": "Some things are better left as mysteries.", "next": "farewell_warm", "rep_change": 5},
            {"id": "thank_again", "text": "Whatever it is, I'm grateful.", "next": "farewell_warm", "rep_change": 5}
        ]
    },
    "local_gossip": {
        "text": "*leans on bar conspiratorially* Oh, I've got gossip, dearie. An innkeeper hears everything!\n\n- Old Man Horace caught a talking fish yesterday. It told him to go home. He's been drinking ever since.\n- There's a new captain in port - woman by the name of Scarlet Sally. Beautiful as sin, dangerous as a storm.\n- Something's been stealing bait from the fishing boats at night. Nobody knows what.\n- And there's been a stranger asking about ancient fishing rituals. Hooded, mysterious. Gives me the creeps.",
        "options": [
            {"id": "talking_fish", "text": "A talking fish? Is Horace a reliable source?", "next": "horace_talking_fish", "rep_change": 3},
            {"id": "scarlet_sally", "text": "Tell me more about Scarlet Sally.", "next": "scarlet_sally_info", "rep_change": 5},
            {"id": "bait_thief", "text": "Any idea what's stealing the bait?", "next": "bait_mystery", "rep_change": 5},
            {"id": "stranger", "text": "A stranger asking about rituals? Where can I find them?", "next": "stranger_location", "rep_change": 8}
        ]
    },
    "horace_talking_fish": {
        "text": "*sighs* Horace is... well, he likes his rum. BUT - and this is the thing - he was stone sober when it happened. I saw him come in, white as a sheet, hands shaking. He's not a fanciful man. If he says the fish talked, then something happened. Whether it was really talking or he just needs to see a doctor... *shrugs* ...who can say?",
        "options": [
            {"id": "where_horace", "text": "Is Horace here now? Can I talk to him?", "next": "horace_location", "rep_change": 3},
            {"id": "what_fish_said", "text": "What exactly did the fish say?", "next": "fish_message_detail", "rep_change": 5},
            {"id": "other_gossip", "text": "Tell me about the other rumors.", "next": "local_gossip", "rep_change": 0}
        ]
    },
    "fish_message_detail": {
        "text": "*recites from memory* According to Horace, the fish looked him dead in the eye and said: 'Horace Jenkins, your time grows short. Go home to your wife. Tell her you love her. The storm comes in seven days.' Then it... well, it smiled at him. Can fish smile? Horace says it smiled. Then he threw it back and ran here.",
        "rewards": {"quest_hook": "horace_prophecy"},
        "options": [
            {"id": "storm", "text": "A storm in seven days? We should warn people!", "next": "storm_warning_path", "rep_change": 10},
            {"id": "horace_wife", "text": "Did Horace go home to his wife?", "next": "horace_wife_story", "rep_change": 5},
            {"id": "more_fish", "text": "Have other fish been talking?", "next": "fish_uprising", "rep_change": 8}
        ]
    },
    "story_time": {
        "text": "*eyes light up* Stories! Oh, I've got stories, dearie. Forty years of them! What kind would you like?\n\n- Romance and tragedy?\n- Adventure and danger?\n- Mystery and the supernatural?\n- Comedy and hijinks?\n\nName your flavor!",
        "options": [
            {"id": "romance", "text": "Romance and tragedy.", "next": "story_romance", "rep_change": 5},
            {"id": "adventure", "text": "Adventure and danger!", "next": "story_adventure", "rep_change": 5},
            {"id": "mystery", "text": "Mystery and supernatural.", "next": "story_mystery", "rep_change": 8},
            {"id": "comedy", "text": "Make me laugh!", "next": "story_comedy", "rep_change": 5}
        ]
    },
    "story_mystery": {
        "text": "*voice drops low* Gather 'round, dearie, and let me tell you about the Ghost of Moonrise Cove...\n\nEvery full moon, sailors report seeing a woman standing on the rocks, singing. Her song is beautiful - haunting - impossible to resist. Those who sail toward her... they never come back. Their boats are found days later, drifting, with hot meals still on the table. But no crew. Not a single soul.\n\nSome say she's the spirit of a mermaid who fell in love with a sailor. He promised to return for her, but he never did. Now she waits, forever, singing her love song - and when sailors answer, she claims them as substitutes for the man who broke her heart.",
        "options": [
            {"id": "seen_her", "text": "Have you ever seen her?", "next": "rosie_ghost_encounter", "rep_change": 8},
            {"id": "how_survive", "text": "How do sailors survive passing Moonrise Cove?", "next": "survival_method", "rep_change": 5},
            {"id": "another_story", "text": "Tell me another one!", "next": "story_time", "rep_change": 3},
            {"id": "enough", "text": "That's enough stories for tonight.", "next": "farewell_warm", "rep_change": 0}
        ]
    },
    "rosie_ghost_encounter": {
        "text": "*long pause* ...Once. Twenty years ago. I was sailing back from the Coral Reef when my compass went mad near Moonrise Cove. And I heard it - that song. It was... *shudders* ...the most beautiful thing I've ever heard. I wanted to steer toward it so badly.\n\n*voice drops to whisper* But then I saw HER. Standing on the rocks. She looked right at me with those empty, glowing eyes. And she... smiled. A sad, terrible smile. Then she just... vanished. I sailed away as fast as I could.",
        "options": [
            {"id": "why_survive", "text": "Why didn't she take you?", "next": "rosie_theory", "rep_change": 10},
            {"id": "felt_sad", "text": "Did you feel anything from her?", "next": "ghost_emotions", "rep_change": 8},
            {"id": "avoid_cove", "text": "I'll make sure to avoid that cove.", "next": "cove_warning", "rep_change": 5}
        ]
    },
    "farewell_warm": {
        "text": "*hugs you warmly* Safe travels, dearie. Remember - my door is always open, day or night. If you ever need a warm bed, a hot meal, or just someone to listen... old Rosie is here. May fair winds follow you!",
        "options": [
            {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 5}
        ]
    },
    "end": {
        "text": "",
        "end_conversation": True
    }
}

# ============================================================================
# FORTUNE TELLER MADAME CORAL DIALOGUE TREE  
# ============================================================================

FORTUNE_TELLER_DIALOGUE = {
    "greeting": {
        "text": "*incense swirls as you enter the dimly lit tent* Ahhhh... *ancient eyes open slowly* The sea has whispered of your coming, child. I am Madame Coral, reader of currents, speaker to spirits, seer of that which has been and that which shall be. *gestures to cushion* Sit. The spirits are... eager to speak with you.",
        "options": [
            {"id": "reading", "text": "I want my fortune told.", "next": "fortune_options", "rep_change": 5},
            {"id": "skeptical", "text": "[Skeptical] Do you actually believe in this stuff?", "next": "defends_gift", "rep_change": -5},
            {"id": "spirits", "text": "The spirits want to speak with ME?", "next": "spirit_interest", "rep_change": 8},
            {"id": "question", "text": "I have questions about my future.", "next": "question_types", "rep_change": 3},
            {"id": "curse", "text": "I think I've been cursed. Can you help?", "next": "curse_examination", "rep_change": 5}
        ]
    },
    "fortune_options": {
        "text": "*spreads collection of items on table* I have many ways of seeing, child. Each reveals different truths:\n\n- The Fish Scales (50 gold): Short-term fortune, immediate guidance\n- The Coral Bones (150 gold): Medium-term fate, next month's path\n- The Abyssal Mirror (500 gold): Deep reading, life-changing revelations\n- The Spirit Communion (1000 gold): Direct contact with the departed\n\nWhat level of truth can you afford?",
        "options": [
            {"id": "scales", "text": "The Fish Scales reading, please.", "next": "scale_reading", "rep_change": 0},
            {"id": "bones", "text": "I'll try the Coral Bones.", "next": "bone_reading", "rep_change": 5},
            {"id": "mirror", "text": "The Abyssal Mirror. I want real answers.", "next": "mirror_reading", "rep_change": 10},
            {"id": "communion", "text": "Spirit Communion. I need to speak with someone who's passed.", "next": "communion_setup", "rep_change": 15},
            {"id": "too_expensive", "text": "I can't afford any of these.", "next": "free_glimpse", "rep_change": 0}
        ]
    },
    "scale_reading": {
        "text": "*casts handful of fish scales onto velvet cloth* Let us see... *studies pattern intently*\n\nYour immediate future shows... a choice. Two paths diverge before you, and you must choose by the next full moon. One path offers safety and modest gain. The other offers great reward but also great risk.\n\n*points to specific scale* This one is interesting. It suggests an encounter with someone from your past. They come bearing news - whether good or bad, I cannot say.",
        "rewards": {"fortune": "scale_reading_result", "buff": "foresight_minor"},
        "options": [
            {"id": "more_details", "text": "Can you be more specific about the choice?", "next": "scale_elaboration", "rep_change": 3},
            {"id": "past_person", "text": "Someone from my past? Who?", "next": "past_person_hint", "rep_change": 5},
            {"id": "satisfied", "text": "Thank you. That gives me much to think about.", "next": "farewell_mystical", "rep_change": 5}
        ]
    },
    "mirror_reading": {
        "text": "*produces a mirror made of black, rippling material* The Abyssal Mirror does not lie, child. It cannot. But be warned - some truths are difficult to bear. Once seen, they cannot be unseen. *pause* Are you certain you wish to proceed?",
        "options": [
            {"id": "certain", "text": "I'm certain. Show me.", "next": "mirror_vision", "rep_change": 10},
            {"id": "hesitate", "text": "What kind of truths are we talking about?", "next": "mirror_warning", "rep_change": 5},
            {"id": "reconsider", "text": "Maybe the Coral Bones would be better...", "next": "bone_reading", "rep_change": 0}
        ]
    },
    "mirror_vision": {
        "text": "*holds mirror to your face* Look deep... deeper... past your reflection... past the darkness... into the TRUTH...\n\n*the mirror surface ripples*\n\nYou see:\n\n- Yourself, standing on the deck of a great ship, facing a storm of impossible size\n- A golden fish, larger than any fish should be, watching you with ancient eyes\n- A figure in shadow, holding something that belongs to you\n- The sea, rising, RISING, until it touches the stars\n\n*mirror goes dark*\n\nThese visions... they are your future. Some are certain. Some are possible. Some are warnings of what might be if you choose poorly.",
        "rewards": {"fortune": "mirror_vision_complete", "buff": "destiny_glimpse", "quest_hints": ["storm_battle", "world_fish_encounter", "shadow_betrayal"]},
        "options": [
            {"id": "golden_fish", "text": "The golden fish... is that the World Fish?", "next": "world_fish_vision", "rep_change": 10},
            {"id": "shadow_figure", "text": "Who is the figure holding something of mine?", "next": "shadow_identity", "rep_change": 8},
            {"id": "rising_sea", "text": "The sea touching the stars? What does that mean?", "next": "apocalypse_vision", "rep_change": 10},
            {"id": "overwhelmed", "text": "I... need a moment.", "next": "coral_comforts", "rep_change": 5}
        ]
    },
    "world_fish_vision": {
        "text": "*nods slowly* You recognize it. Good. The World Fish is the oldest creature in existence - some say it IS existence. It has watched humanity since before we learned to swim. And it watches you... specifically. *touches your forehead* There is something in you that interests it. A potential. What you choose to do with that potential... will matter.",
        "rewards": {"knowledge": "world_fish_attention", "destiny_flag": True},
        "options": [
            {"id": "why_me", "text": "Why would something like that care about me?", "next": "destiny_explanation", "rep_change": 8},
            {"id": "find_it", "text": "How do I find the World Fish?", "next": "world_fish_location_hints", "rep_change": 10},
            {"id": "other_visions", "text": "Tell me about the other visions.", "next": "mirror_vision", "rep_change": 0}
        ]
    },
    "communion_setup": {
        "text": "*expression becomes grave* Spirit Communion is not to be taken lightly, child. To speak with the dead is to touch the other side. Sometimes... things follow you back. *studies you* Who do you wish to speak with? And why?",
        "options": [
            {"id": "family", "text": "A family member who passed.", "next": "family_communion", "rep_change": 5},
            {"id": "legendary", "text": "A legendary captain - Captain Goldtooth, if possible.", "next": "goldtooth_communion", "rep_change": 10},
            {"id": "recent", "text": "Someone who died recently, under mysterious circumstances.", "next": "mystery_communion", "rep_change": 8},
            {"id": "reconsider", "text": "On second thought, maybe I shouldn't...", "next": "wise_caution", "rep_change": 5}
        ]
    },
    "goldtooth_communion": {
        "text": "*eyes widen* Captain Goldtooth himself? The Fisher King? *laughs* Bold choice, child. Very bold. His spirit... it does not rest in the normal realms. He sailed beyond death itself, they say. But I can try...\n\n*begins ritual, incense thickens*\n\nGoldtooth... Goldtooth... by the currents that bind all waters... we call to you...",
        "options": [
            {"id": "watch_ritual", "text": "*watch in fascination*", "next": "goldtooth_appears", "rep_change": 5},
            {"id": "help_ritual", "text": "Is there anything I can do to help?", "next": "ritual_assistance", "rep_change": 10}
        ]
    },
    "goldtooth_appears": {
        "text": "*the temperature drops suddenly*\n\nA figure materializes - not quite there, shimmering like moonlight on water. He's exactly as the legends describe: tall, weather-worn, with a single golden tooth gleaming in his spectral smile.\n\n\"Ahoy there, young one. Been a long time since anyone had the nerve to summon me. What do you want - treasure? Glory? The location of my lost ship?\" *chuckles* \"Everyone wants something. So - what's YOUR price?\"",
        "options": [
            {"id": "treasure", "text": "Where IS your treasure?", "next": "goldtooth_treasure", "rep_change": 0},
            {"id": "wisdom", "text": "I want wisdom. How do I become a true fisher?", "next": "goldtooth_wisdom", "rep_change": 15},
            {"id": "world_fish", "text": "What do you know about the World Fish?", "next": "goldtooth_world_fish", "rep_change": 20},
            {"id": "how_died", "text": "What really happened on your final voyage?", "next": "goldtooth_death", "rep_change": 10}
        ]
    },
    "goldtooth_wisdom": {
        "text": "*ghost's expression softens* Wisdom? Not gold? *laughs* I LIKE you, young one. Most who summon me want easy answers. But wisdom...\n\n*sits cross-legged in mid-air*\n\n\"Listen well:\n\n1. The sea is not your enemy or your friend. It simply IS. Respect that.\n2. Every fish you catch teaches you something. Pay attention.\n3. The greatest catches are never about the fish - they're about who you become catching them.\n4. When the World speaks, LISTEN. Most fishers are too busy fishing to hear it.\n5. And finally... the best fishing story is always the one you haven't lived yet.\"\n\n*winks* \"That's free. Consider it a gift from beyond the grave.\"",
        "rewards": {"buff": "goldtooth_blessing", "wisdom_points": 50, "title": "Student of Goldtooth"},
        "options": [
            {"id": "thank_ghost", "text": "Thank you, Captain. That means more than treasure.", "next": "goldtooth_approves", "rep_change": 25},
            {"id": "one_more_question", "text": "One more question, if I may?", "next": "goldtooth_allows", "rep_change": 5},
            {"id": "let_rest", "text": "I'll let you rest now.", "next": "goldtooth_farewell", "rep_change": 10}
        ]
    },
    "goldtooth_approves": {
        "text": "*ghost's form brightens* You remind me of myself, once. Before the gold tooth, before the legend, before... everything. I was just a fisher who loved the sea.\n\n*reaches into spectral coat and pulls out something glowing*\n\n\"Here. My lucky lure. It's been in the spirit realm for a hundred years. Might not work the same as before, but... it's got stories in it. Lots of stories. Use it well.\"\n\n*form begins to fade* \"See you on the other side, young one. Eventually.\"",
        "rewards": {"item": "goldtooth_spectral_lure", "legendary": True, "buff": "ghost_blessing_permanent"},
        "options": [
            {"id": "accept_grateful", "text": "*accept the ethereal lure with reverence*", "next": "communion_ends", "rep_change": 20},
            {"id": "promise", "text": "I'll make you proud, Captain.", "next": "communion_ends_promise", "rep_change": 25}
        ]
    },
    "curse_examination": {
        "text": "*eyes narrow, studying you intently* A curse, you say? *sniffs the air around you* Mmm. Yes. I sense... something. Let me look closer...\n\n*circles you slowly*\n\nThere IS darkness clinging to you. It's faint, but present. Where did you acquire this?",
        "options": [
            {"id": "bottle", "text": "I opened a cursed bottle.", "next": "bottle_curse_diagnosis", "rep_change": 5},
            {"id": "angered", "text": "I might have angered a sea spirit.", "next": "spirit_curse_diagnosis", "rep_change": 5},
            {"id": "unknown", "text": "I don't know. I've just had terrible luck lately.", "next": "general_curse_check", "rep_change": 3},
            {"id": "pirate", "text": "A pirate cursed me after I escaped him.", "next": "pirate_curse_diagnosis", "rep_change": 5}
        ]
    },
    "bottle_curse_diagnosis": {
        "text": "*nods gravely* A trapped spirit. They can be... vindictive when released, especially if they've been confined for a long time. *examines the darkness around you more closely* This curse is relatively mild - bad luck, minor misfortunes. But left untreated, it will grow.\n\nI can remove it. But I'll need:\n- 100 gold for the ritual\n- A moonfish scale (for purification)\n- Your genuine remorse for disturbing the spirit",
        "options": [
            {"id": "pay_cure", "text": "Here's the gold and scale. I am genuinely sorry.", "next": "curse_removal", "rep_change": 10},
            {"id": "no_scale", "text": "I don't have a moonfish scale.", "next": "scale_alternative", "rep_change": 0},
            {"id": "live_with", "text": "How bad could it really get if I leave it?", "next": "curse_warning", "rep_change": -3}
        ]
    },
    "curse_removal": {
        "text": "*begins ritual*\n\nWaters of the deep, hear my call...\nSpirit who binds, release your thrall...\nBy scale of moon and penitent heart...\nLet this curse now depart!\n\n*the darkness visibly pulls away from you, dissipating into smoke*\n\nIt is done. You are cleansed. *sighs* But be more careful with bottles in the future, child. Not everything at the bottom of the sea wishes to be found.",
        "rewards": {"curse_removed": True, "buff": "spiritually_cleansed", "duration": 86400},
        "options": [
            {"id": "thank", "text": "Thank you, Madame Coral. I feel lighter already.", "next": "farewell_mystical", "rep_change": 15},
            {"id": "prevent_future", "text": "How do I protect myself from future curses?", "next": "protection_advice", "rep_change": 10}
        ]
    },
    "farewell_mystical": {
        "text": "*mysterious smile* The currents will bring you back to me, child. They always do. Until then... *presses something into your palm* ...carry this coral charm. When you are lost, hold it to your heart. It will show you the way.\n\n*incense swirls dramatically* Go now. Your destiny awaits.",
        "rewards": {"item": "coral_charm_of_guidance"},
        "options": [
            {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 5}
        ]
    },
    "end": {
        "text": "",
        "end_conversation": True
    }
}

# ============================================================================
# ADDITIONAL NPC: YOUNG FISHER TOMMY WAVES
# ============================================================================

YOUNG_FISHER_DIALOGUE = {
    "greeting": {
        "text": "*a young boy with sun-bleached hair and eager eyes runs up* Hey! HEY! Are you a real fisher?! You look like a real fisher! Is that a fishing rod? Wow! Did you catch anything today? Can I see?! My name's Tommy! Well, not THAT Tommy, different Tommy. I'm gonna be the greatest fisher in the world someday!",
        "options": [
            {"id": "friendly", "text": "*laugh* Slow down there! Yes, I'm a fisher.", "next": "tommy_excited", "rep_change": 10},
            {"id": "show_catch", "text": "Want to see what I caught today?", "next": "show_fish", "rep_change": 15},
            {"id": "teach", "text": "The greatest fisher, huh? Want some tips?", "next": "teaching_moment", "rep_change": 20},
            {"id": "busy", "text": "I'm kind of busy, kid.", "next": "tommy_disappointed", "rep_change": -10}
        ]
    },
    "tommy_excited": {
        "text": "I KNEW it! I can always tell! Real fishers have this... this LOOK, you know? Like they've seen amazing things. My dad was a fisher. He used to take me out on his boat before... *trails off* ...before he went away. But I still remember everything he taught me!",
        "options": [
            {"id": "dad_away", "text": "Where did your dad go?", "next": "dads_fate", "rep_change": 5},
            {"id": "taught_what", "text": "What did he teach you?", "next": "lessons_remembered", "rep_change": 8},
            {"id": "take_fishing", "text": "Would you like to go fishing with me sometime?", "next": "tommy_overjoyed", "rep_change": 25}
        ]
    },
    "dads_fate": {
        "text": "*scuffs shoe on ground* He... he went to find the Golden Depths. It's this legendary fishing spot where the fish are all made of gold. Or something. He said he'd be back in a month with enough treasure to buy Mom a big house. *voice gets small* That was two years ago.",
        "options": [
            {"id": "sorry", "text": "I'm sorry, Tommy. That must be hard.", "next": "tommy_strong", "rep_change": 10},
            {"id": "find_dad", "text": "Have you looked for him?", "next": "search_efforts", "rep_change": 8},
            {"id": "golden_depths", "text": "[Knowledge] The Golden Depths... I've heard of that.", "next": "golden_depths_info", "rep_change": 15}
        ]
    },
    "tommy_overjoyed": {
        "text": "*eyes go WIDE* REALLY?! You mean it?! You'd take ME fishing?! Oh wow oh wow oh WOW! *practically vibrates with excitement* When? Today? Tomorrow? Can we catch a whale? Barnacle Bill says whales aren't fish but I don't believe him. Have YOU ever caught a whale?!",
        "rewards": {"reputation": "tommy_friend", "future_companion_unlock": True},
        "options": [
            {"id": "tomorrow", "text": "How about tomorrow morning? Meet me at the docks at dawn.", "next": "tommy_promise", "rep_change": 20},
            {"id": "whale_truth", "text": "Bill's right - whales aren't fish. But they're still amazing!", "next": "whale_discussion", "rep_change": 5},
            {"id": "soon", "text": "Soon, I promise. I just need to prepare.", "next": "tommy_patient", "rep_change": 10}
        ]
    },
    "teaching_moment": {
        "text": "*stands at attention like a little soldier* Yes! Teach me! I'm ready! I've been practicing my casting with a stick and string but it's not the same. Oh! Oh! Can you show me how to tie a proper fisherman's knot? Dad showed me once but I forgot. And how do you know where the fish are? Do they leave tracks?",
        "options": [
            {"id": "knot", "text": "*demonstrate a fisherman's knot*", "next": "knot_lesson", "rep_change": 15},
            {"id": "fish_finding", "text": "Let me tell you how to find where fish hide...", "next": "finding_fish_lesson", "rep_change": 15},
            {"id": "patience", "text": "The first lesson is patience. Fishing isn't about rushing.", "next": "patience_lesson", "rep_change": 15},
            {"id": "respect", "text": "First, you need to learn to respect the sea.", "next": "respect_lesson", "rep_change": 20}
        ]
    },
    "knot_lesson": {
        "text": "*watches with intense concentration as you demonstrate* Over... under... through the loop... pull tight... *tries to replicate* LIKE THIS?! *holds up slightly lopsided but functional knot* I DID IT! Did you see?! Wait till I show Mom! She said I'd never learn to tie knots because I can't even tie my shoes right but LOOK AT THIS!",
        "rewards": {"taught_skill": "basic_knot", "reputation": "tommys_teacher"},
        "options": [
            {"id": "proud", "text": "That's perfect, Tommy! You're a natural!", "next": "tommy_confidence_boost", "rep_change": 15},
            {"id": "show_more", "text": "Good start! Want to learn another knot?", "next": "advanced_knot_offer", "rep_change": 10},
            {"id": "practice", "text": "Practice that one until it's second nature.", "next": "tommy_determined", "rep_change": 8}
        ]
    },
    "respect_lesson": {
        "text": "*grows serious, surprisingly mature for a moment* Dad said that too. He said... *closes eyes, remembering* ...'The sea gives and takes, Tommy. You have to respect that. Never take more than you need. Always thank the water for what it provides. And never, EVER turn your back on the horizon.' *opens eyes* I try to remember that every day.",
        "options": [
            {"id": "good_lesson", "text": "Your dad sounds like a wise man.", "next": "dad_memory", "rep_change": 15},
            {"id": "add_wisdom", "text": "He was right. And there's more to it...", "next": "expand_philosophy", "rep_change": 10},
            {"id": "keep_values", "text": "Hold onto those values. They'll make you a great fisher.", "next": "tommy_thanks", "rep_change": 15}
        ]
    },
    "tommy_promise": {
        "text": "*face lights up like the sun* I'll be there! I'll be there SO early! I'll bring my stick-rod! Well, not a real rod, but it's SORT of a rod. And I have some string that's probably good for fishing. And I found a hook once! It was a little rusty but I cleaned it!\n\n*suddenly hugs you around the waist* THANK YOU THANK YOU THANK YOU!",
        "rewards": {"quest_unlock": "tommys_first_catch", "relationship": "mentor_bond"},
        "options": [
            {"id": "hug_back", "text": "*pat his head affectionately*", "next": "tommys_joy", "rep_change": 20},
            {"id": "give_equipment", "text": "Here - take this proper hook. Keep it safe.", "next": "first_gift", "rep_change": 25},
            {"id": "see_tomorrow", "text": "See you tomorrow, Tommy. Don't be late!", "next": "farewell_tommy", "rep_change": 10}
        ]
    },
    "first_gift": {
        "text": "*takes hook with reverent hands, like it's made of gold* This... this is MINE? A real hook?! *voice cracks* Nobody's ever... I mean, not since Dad... *wipes eyes quickly* I'm not crying! I just got sea salt in my eye! From the wind! Anyway! I'll take SUCH good care of it! I'll name it Shiny! No wait, Hook. No wait...",
        "rewards": {"bond": "deep_connection", "future_storyline_unlock": "tommys_path"},
        "options": [
            {"id": "laugh_warmly", "text": "*laugh* Name it whatever you want, Tommy.", "next": "tommys_gratitude", "rep_change": 15},
            {"id": "serious", "text": "It's just a tool. But remember - a good fisher takes care of their tools.", "next": "tommys_nod", "rep_change": 10}
        ]
    },
    "tommys_gratitude": {
        "text": "*composes himself with visible effort* I'll make you proud! I'll catch the biggest fish EVER and I'll dedicate it to you! And when I'm famous, I'll tell everyone that ${player_name} taught me! We'll be like... like LEGENDS! The Fisher and the Kid! Or... or something cooler. I'll think of a name!",
        "options": [
            {"id": "legend", "text": "I like the sound of that.", "next": "farewell_tommy", "rep_change": 10},
            {"id": "humble", "text": "Let's focus on catching your first fish before we become legends.", "next": "tommy_laughs", "rep_change": 5}
        ]
    },
    "farewell_tommy": {
        "text": "*waves enthusiastically* BYE! I mean, see you later! I mean... *thinks hard* ...fair winds and following seas! That's what fishers say, right? Mom taught me that! OKAY BYE! *runs off, trips, gets up, waves again, runs off*",
        "options": [
            {"id": "leave", "text": "[Leave]", "next": "end", "rep_change": 5}
        ]
    },
    "end": {
        "text": "",
        "end_conversation": True
    }
}

# ============================================================================
# EXPORT ALL DIALOGUE TREES
# ============================================================================

EXTENDED_DIALOGUE_TREES = {
    "merchant_marina": MERCHANT_MARINA_DIALOGUE,
    "innkeeper_rosie": INNKEEPER_ROSIE_DIALOGUE,
    "fortune_teller": FORTUNE_TELLER_DIALOGUE,
    "young_fisher": YOUNG_FISHER_DIALOGUE
}

def get_extended_dialogue(npc_id: str) -> Dict:
    """Get extended dialogue for an NPC"""
    return EXTENDED_DIALOGUE_TREES.get(npc_id, {})

def merge_dialogue_trees(base: Dict, extended: Dict) -> Dict:
    """Merge base and extended dialogue trees"""
    merged = base.copy()
    merged.update(extended)
    return merged
