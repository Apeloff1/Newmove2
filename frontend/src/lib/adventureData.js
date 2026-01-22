/**
 * ADVENTURE MODE DATA
 * A Humongous & Tremendous Pirate Adventure
 * Inspired by classic point-and-click adventures (original content, no copyright issues)
 * 
 * Features:
 * - 15+ Unique Locations
 * - 25+ NPCs with personality
 * - 100+ Dialogue lines with choices
 * - 50+ Items and collectibles
 * - Witty humor throughout
 */

// ============================================================================
// LOCATIONS - The World of Saltbeard's Cove
// ============================================================================

export const ADVENTURE_LOCATIONS = {
  harbor_square: {
    id: 'harbor_square',
    name: "Barnacle Bay Plaza",
    description: "The chaotic heart of Codswallop Cove. Fish merchants yell at clouds, sailors argue with seagulls, and someone's always dropping a crate of 'definitely legal' goods.",
    background: 'linear-gradient(180deg, #1a3a5c 0%, #0a1628 100%)',
    ambiance: 'busy',
    hotspots: [
      { id: 'fish_merchant', name: 'Finnegan McScales', x: 15, y: 60, type: 'npc', npcId: 'finley_scales', icon: '🐟' },
      { id: 'rival_ricky', name: '"Razor" Ricky Sharkbait', x: 85, y: 35, type: 'npc', npcId: 'razor_ricky', icon: '🦈', storyPhase: 'intro' },
      { id: 'tackle_shop', name: "Hooky McHookface's", x: 25, y: 45, type: 'shop', shopId: 'tackle_shop', icon: '🪝' },
      { id: 'notice_board', name: 'Board of Questionable Jobs', x: 45, y: 40, type: 'interact', icon: '📜' },
      { id: 'mysterious_well', name: 'The Wishing Well of Regret', x: 75, y: 70, type: 'interact', icon: '🪣' },
      { id: 'to_docks', name: 'Wobbly Pier District', x: 90, y: 55, type: 'travel', destination: 'docks', icon: '→' },
      { id: 'to_tavern', name: 'The Tipsy Tentacle', x: 35, y: 25, type: 'travel', destination: 'salty_barnacle_tavern', icon: '🍺' },
      { id: 'to_alley', name: 'Suspiciously Dark Alley', x: 5, y: 45, type: 'travel', destination: 'shady_alley', icon: '🌑' },
      { id: 'to_merchant', name: 'Overpriced Boulevard', x: 55, y: 20, type: 'travel', destination: 'merchant_quarter', icon: '🏪' }
    ],
    firstVisitDialogue: "You step into Barnacle Bay Plaza. The smell of fish, questionable decisions, and adventure fills your nostrils. Mostly fish and regret, though.",
    items: ['old_coin', 'seagull_feather']
  },
  
  docks: {
    id: 'docks',
    name: "The Wobbly Pier District",
    description: "Wooden planks held together by hope and barnacle spit. Ships bob lazily while their crews engage in competitive napping.",
    background: 'linear-gradient(180deg, #2a6090 0%, #1a3a5c 100%)',
    ambiance: 'maritime',
    hotspots: [
      { id: 'captain_goldbeard', name: "Cap'n Glitterbeard", x: 20, y: 55, type: 'npc', npcId: 'captain_goldbeard', icon: '🏴‍☠️' },
      { id: 'net_captain', name: 'Admiral Tangles McNetsworth', x: 40, y: 45, type: 'npc', npcId: 'net_captain_jonas', icon: '🕸️' },
      { id: 'fishing_boat', name: 'S.S. Probably Floats', x: 70, y: 35, type: 'boat_fishing', icon: '🚢', requiresItem: 'fishing_net' },
      { id: 'rowboat', name: 'Definitely Not Stolen Rowboat', x: 55, y: 75, type: 'interact', icon: '🚣' },
      { id: 'fishing_spot', name: 'Prime Fishing Hole', x: 85, y: 60, type: 'fishing', icon: '🎣' },
      { id: 'to_harbor', name: 'Barnacle Bay Plaza', x: 10, y: 50, type: 'travel', destination: 'harbor_square', icon: '←' },
      { id: 'to_lighthouse', name: 'The Tipsy Tower', x: 90, y: 30, type: 'travel', destination: 'lighthouse', icon: '🏠' }
    ],
    firstVisitDialogue: "The docks creak menacingly. Every step sounds like the wood is having an existential crisis. The seagulls judge you silently.",
    items: ['rope_piece', 'barnacle']
  },
  
  salty_barnacle_tavern: {
    id: 'salty_barnacle_tavern',
    name: "The Tipsy Tentacle Tavern",
    description: "Where dreams go to marinate in rum. The games corner is suspiciously competitive. The tentacle on the sign sometimes waves - nobody asks why.",
    background: 'linear-gradient(180deg, #3e2723 0%, #1a1a1a 100%)',
    ambiance: 'cozy_dangerous',
    hotspots: [
      { id: 'bartender', name: 'Rosie "No Refunds" McGee', x: 50, y: 40, type: 'npc', npcId: 'rosie_stormglass', icon: '🍺' },
      { id: 'drunk_sailor', name: 'Mumblin\' Pete (3 Sheets Gone)', x: 25, y: 65, type: 'npc', npcId: 'mumblin_pete', icon: '🥴' },
      { id: 'memory_game', name: 'Forgetful Freds Corner', x: 70, y: 55, type: 'minigame', minigameId: 'memory', icon: '🧠', description: 'Match fish with Forgetful Fred... if he remembers the rules!' },
      { id: 'timing_game', name: 'Twitchy Tims Table', x: 80, y: 55, type: 'minigame', minigameId: 'timing', icon: '⚡', description: 'Test reflexes with Twitchy Tim - he had too much coffee!' },
      { id: 'quiz_game', name: 'Professor Pompous Corner', x: 70, y: 35, type: 'minigame', minigameId: 'quiz', icon: '❓', description: 'Fish trivia with the self-appointed Professor!' },
      { id: 'sorting_game', name: 'Obsessive Ollies Station', x: 80, y: 35, type: 'minigame', minigameId: 'sorting', icon: '📊', description: 'Sort fish with Ollie - he NEEDS everything organized!' },
      { id: 'fireplace', name: 'Slightly Haunted Fireplace', x: 15, y: 30, type: 'interact', icon: '🔥' },
      { id: 'to_harbor', name: 'Escape to Daylight', x: 10, y: 50, type: 'travel', destination: 'harbor_square', icon: '🚪' }
    ],
    firstVisitDialogue: "The door swings open dramatically. A tentacle waves from somewhere. Everyone turns to judge you. This feels like home if home was weird.",
    items: ['mug_shard', 'playing_card']
  },
  
  shady_alley: {
    id: 'shady_alley',
    name: "Definitely Legal Lane",
    description: "A place where everyone is clearly conducting legitimate business. The shadows are just... atmospheric. Nothing suspicious here.",
    background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
    ambiance: 'suspicious',
    hotspots: [
      { id: 'hooded_figure', name: 'Legitimate Businessperson', x: 30, y: 50, type: 'npc', npcId: 'shadow_merchant', icon: '👤' },
      { id: 'trash_pile', name: 'Treasure (Probably)', x: 60, y: 70, type: 'interact', icon: '🗑️' },
      { id: 'cat', name: 'Lord Whiskers the Witness', x: 80, y: 60, type: 'npc', npcId: 'patches_the_cat', icon: '🐱' },
      { id: 'to_harbor', name: 'Return to Witnesses', x: 95, y: 45, type: 'travel', destination: 'harbor_square', icon: '☀️' }
    ],
    firstVisitDialogue: "This seems like a great place for definitely legal activities. The shadows whisper 'we saw nothing' which is comforting.",
    items: ['mysterious_key', 'rat_tooth']
  },
  
  lighthouse: {
    id: 'lighthouse',
    name: "The Tipsy Tower",
    description: "Leaning at a jaunty angle since the Great Sneeze of '83. The lighthouse keeper insists it's 'artistically tilted.'",
    background: 'linear-gradient(180deg, #4a90d9 0%, #1a3a5c 100%)',
    ambiance: 'windy',
    hotspots: [
      { id: 'rival_ricky_ch3', name: '"Razor" Ricky (Wind-Blown)', x: 55, y: 65, type: 'npc', npcId: 'razor_ricky', icon: '🦈', storyPhase: 'chapter3' },
      { id: 'keeper', name: 'Ella Sparkplug', x: 40, y: 45, type: 'npc', npcId: 'eleanor_brightspark', icon: '🔦' },
      { id: 'telescope', name: 'Spyglass of Mild Voyeurism', x: 70, y: 30, type: 'interact', icon: '🔭' },
      { id: 'locked_chest', name: 'Dramatically Locked Chest', x: 25, y: 70, type: 'interact', requiresItem: 'mysterious_key', icon: '📦' },
      { id: 'star_charts', name: 'Confusing Star Doodles', x: 80, y: 55, type: 'interact', icon: '⭐' },
      { id: 'to_docks', name: 'Wobbly Pier District', x: 10, y: 55, type: 'travel', destination: 'docks', icon: '←' },
      { id: 'to_cliffs', name: 'The Dramatic Cliffs', x: 85, y: 40, type: 'travel', destination: 'windswept_cliffs', icon: '🏔️' }
    ],
    firstVisitDialogue: "The lighthouse leans like it's had one too many. The keeper insists it's 'architecturally adventurous.'",
    items: ['lighthouse_lens_shard', 'seagull_nest']
  },
  
  windswept_cliffs: {
    id: 'windswept_cliffs',
    name: "The Dramatically Windswept Cliffs",
    description: "Where hair goes to die. Perfect for brooding, pondering life choices, or screaming into the void (acoustics are great).",
    background: 'linear-gradient(180deg, #87CEEB 0%, #4a90d9 100%)',
    ambiance: 'dramatic',
    hotspots: [
      { id: 'hermit', name: 'Gary the Unnecessarily Cryptic', x: 35, y: 55, type: 'npc', npcId: 'whiskerbeard_hermit', icon: '🧙' },
      { id: 'cave_entrance', name: 'Extremely Obvious Secret Cave', x: 70, y: 70, type: 'travel', destination: 'smugglers_cave', icon: '🕳️' },
      { id: 'rare_flower', name: 'Flower of Moderate Rarity', x: 55, y: 35, type: 'interact', icon: '🌺' },
      { id: 'to_lighthouse', name: 'The Tipsy Tower', x: 15, y: 50, type: 'travel', destination: 'lighthouse', icon: '←' }
    ],
    firstVisitDialogue: "The wind immediately does unspeakable things to your hair. You briefly consider a career in indoor activities.",
    items: ['wind_crystal', 'cliff_moss']
  },
  
  smugglers_cave: {
    id: 'smugglers_cave',
    name: "The Cave of Legitimate Business",
    description: "Absolutely not used for smuggling. These crates contain... cave supplies. Cave torches. Cave snacks. Mind your business.",
    background: 'linear-gradient(180deg, #2d2d44 0%, #1a1a2e 100%)',
    ambiance: 'echoing',
    hotspots: [
      { id: 'crates', name: 'Definitely Legal Crates', x: 30, y: 60, type: 'interact', icon: '📦' },
      { id: 'underground_pool', name: 'Pool of Suspicious Glowing', x: 65, y: 70, type: 'fishing', icon: '✨' },
      { id: 'cave_painting', name: 'Prehistoric Doodles', x: 50, y: 30, type: 'interact', icon: '🖼️' },
      { id: 'secret_passage', name: 'Totally Not a Secret Door', x: 85, y: 45, type: 'travel', destination: 'treasure_chamber', requiresItem: 'dynamite_fish', icon: '💥' },
      { id: 'to_cliffs', name: 'Return to Hair Chaos', x: 10, y: 50, type: 'travel', destination: 'windswept_cliffs', icon: '☀️' }
    ],
    firstVisitDialogue: "The echoes make everything sound dramatic. You whisper 'hello' and it comes back as 'BEHOLD THE MIGHTY ADVENTURER.'",
    items: ['smuggler_map_piece', 'glow_mushroom']
  },
  
  treasure_chamber: {
    id: 'treasure_chamber',
    name: "Captain Codswallop's Hoard",
    description: "GOLD! Piles of glorious— wait, some of these are chocolate coins. And IOUs. Still pretty good though!",
    background: 'linear-gradient(180deg, #ffd700 0%, #b8860b 100%)',
    ambiance: 'glittering',
    hotspots: [
      { id: 'rival_ricky_finale', name: '"Razor" Ricky (Dramatic)', x: 65, y: 50, type: 'npc', npcId: 'razor_ricky', icon: '🦈', storyPhase: 'finale' },
      { id: 'treasure_pile', name: 'SHINY THINGS!', x: 50, y: 45, type: 'interact', icon: '💰' },
      { id: 'skeleton', name: 'Sir Bones McRattles', x: 25, y: 65, type: 'npc', npcId: 'boney_mcgee', icon: '💀' },
      { id: 'ancient_shrine', name: 'Shrine to the Fish Gods', x: 75, y: 30, type: 'interact', icon: '🏛️' },
      { id: 'saltbeard_ghost', name: "Captain Codswallop's Ghost", x: 85, y: 55, type: 'npc', npcId: 'saltbeard_ghost', icon: '👻', requiresItem: 'all_map_fragments' },
      { id: 'to_cave', name: 'Back to Legal Business', x: 10, y: 50, type: 'travel', destination: 'smugglers_cave', icon: '←' }
    ],
    firstVisitDialogue: "Your eyes go dinner-plate wide. Your brain calculates how many sandwiches this could buy. The answer is: ALL of them.",
    items: ['ancient_doubloon', 'cursed_compass']
  },
  
  merchant_quarter: {
    id: 'merchant_quarter',
    name: "Overpriced Boulevard",
    description: "Where dreams are sold at a 300% markup. Everything's negotiable except the fact that you'll overpay.",
    background: 'linear-gradient(180deg, #daa520 0%, #8b4513 100%)',
    ambiance: 'bustling',
    hotspots: [
      { id: 'rival_ricky_ch1', name: '"Razor" Ricky (Shopping)', x: 60, y: 45, type: 'npc', npcId: 'razor_ricky', icon: '🦈', storyPhase: 'chapter1' },
      { id: 'general_shop', name: "Wallet Emptier's Paradise", x: 30, y: 40, type: 'shop', shopId: 'general_store', icon: '🏪' },
      { id: 'rod_shop', name: "Angry Ingrid's Hammer Hut", x: 70, y: 35, type: 'shop', shopId: 'rod_shop', icon: '⚒️' },
      { id: 'magic_shop', name: "Definitely Real Magic Shop", x: 85, y: 50, type: 'shop', shopId: 'magic_shop', icon: '🔮' },
      { id: 'shop_keeper', name: "Penny Pincher McProfits", x: 25, y: 55, type: 'npc', npcId: 'marina_goldscale', icon: '👩‍🦰' },
      { id: 'blacksmith', name: 'Angry Ingrid (Hammering)', x: 75, y: 50, type: 'npc', npcId: 'iron_ingrid', icon: '👩‍🔧' },
      { id: 'fountain', name: 'Fountain of Broken Promises', x: 50, y: 70, type: 'interact', icon: '⛲' },
      { id: 'to_harbor', name: 'Barnacle Bay Plaza', x: 10, y: 50, type: 'travel', destination: 'harbor_square', icon: '←' },
      { id: 'to_governors', name: "Lord Fancypants Estate", x: 90, y: 25, type: 'travel', destination: 'governors_manor', icon: '🏰' }
    ],
    firstVisitDialogue: "Merchants yell competitively. 'FRESH FISH!' 'FRESHER FISH!' 'MY FISH LITERALLY STILL SWIMMING!' The capitalism is strong here.",
    items: ['merchant_badge', 'gold_nugget']
  },
  
  governors_manor: {
    id: 'governors_manor',
    name: "Lord Fancypants Estate",
    description: "So fancy the furniture has furniture. So pompous the portraits roll their eyes at each other.",
    background: 'linear-gradient(180deg, #8b0000 0%, #4a0000 100%)',
    ambiance: 'pompous',
    hotspots: [
      { id: 'rival_ricky_ch2', name: '"Razor" Ricky (Formal Wear)', x: 65, y: 55, type: 'npc', npcId: 'razor_ricky', icon: '🦈', storyPhase: 'chapter2' },
      { id: 'governor', name: 'Lord Bartholomew Fancypants III', x: 50, y: 35, type: 'npc', npcId: 'governor_reginald', icon: '👑' },
      { id: 'portrait', name: 'Self-Important Portrait', x: 75, y: 25, type: 'interact', icon: '🖼️' },
      { id: 'guard', name: 'Snoring Steve (Guard)', x: 25, y: 60, type: 'npc', npcId: 'guard_snooze', icon: '💂' },
      { id: 'butler', name: 'Jeeves McSuspicious', x: 35, y: 45, type: 'npc', npcId: 'butler_graves', icon: '🎩' },
      { id: 'to_merchant', name: 'Escape to Poverty', x: 10, y: 50, type: 'travel', destination: 'merchant_quarter', icon: '←' }
    ],
    firstVisitDialogue: "Everything here costs more than your boat. Including the air, probably. They charge for breathing in places like this.",
    items: ['fancy_invitation', 'guard_schedule']
  },
  
  shipwreck_beach: {
    id: 'shipwreck_beach',
    name: "Beach of Broken Dreams",
    description: "Where ships discover gravity the hard way. Also: crabs. Crabs everywhere. They're watching.",
    background: 'linear-gradient(180deg, #87CEEB 0%, #f0e6d2 100%)',
    ambiance: 'melancholy',
    hotspots: [
      { id: 'wreck', name: 'S.S. Poor Life Choices', x: 50, y: 40, type: 'interact', icon: '🚢' },
      { id: 'castaway', name: 'Dave (Just... Dave)', x: 30, y: 65, type: 'npc', npcId: 'wilson_castaway', icon: '🏝️' },
      { id: 'bottle', name: 'Probably Spam In Bottle', x: 70, y: 75, type: 'interact', icon: '🍾' },
      { id: 'to_harbor', name: 'Civilization', x: 10, y: 50, type: 'travel', destination: 'harbor_square', icon: '←' },
      { id: 'to_lagoon', name: 'The Sparkly Bit', x: 90, y: 55, type: 'travel', destination: 'mermaid_lagoon', icon: '🌊' }
    ],
    firstVisitDialogue: "The crabs watch you arrive. They remember everyone. They judge everyone. Welcome to Crab Court.",
    items: ['ships_wheel', 'broken_compass']
  },
  
  mermaid_lagoon: {
    id: 'mermaid_lagoon',
    name: "The Probably Magical Lagoon",
    description: "Either mermaids live here or someone went VERY heavy on the glitter. The locals are weirdly secretive about it.",
    background: 'linear-gradient(180deg, #00CED1 0%, #008B8B 100%)',
    ambiance: 'mystical',
    hotspots: [
      { id: 'rival_ricky_ch4', name: '"Razor" Ricky (Soggy & Angry)', x: 45, y: 40, type: 'npc', npcId: 'razor_ricky', icon: '🦈', storyPhase: 'chapter4' },
      { id: 'sage_coralia', name: 'Coral McFishlady', x: 70, y: 30, type: 'npc', npcId: 'sage_coralia', icon: '🧜‍♀️' },
      { id: 'lagoon_center', name: 'The Glittery Waters', x: 50, y: 65, type: 'fishing', icon: '✨' },
      { id: 'seashell_throne', name: 'Uncomfortable Seashell Chair', x: 80, y: 50, type: 'interact', icon: '👑' },
      { id: 'underwater_cave', name: 'Mysteriously Glowing Hole', x: 25, y: 70, type: 'interact', icon: '💫' },
      { id: 'mermaid_queen', name: 'Her Fishiness the Queen', x: 85, y: 35, type: 'npc', npcId: 'mermaid_queen', icon: '👸' },
      { id: 'to_beach', name: 'Crab Court', x: 10, y: 50, type: 'travel', destination: 'shipwreck_beach', icon: '←' }
    ],
    firstVisitDialogue: "The water literally sparkles. Fish seem... judgmental? A crab gives you a tiny thumbs up. This place is weird.",
    items: ['mermaid_scale', 'pearl_of_wisdom']
  }
};

// ============================================================================
// NPCs - The Colorful Cast
// ============================================================================

export const ADVENTURE_NPCS = {
  finley_scales: {
    id: 'finley_scales',
    name: "Finley Scales",
    title: "Fish Merchant Extraordinaire",
    portrait: '🐟',
    personality: 'enthusiastic_merchant',
    description: "A perpetually optimistic fish seller who genuinely believes every fish is 'the best catch of the century.'",
    dialogues: {
      greeting: {
        text: "Welcome, welcome! You look like someone who appreciates QUALITY FISH! And boy, do I have quality fish!",
        options: [
          { text: "Show me your finest fish!", nextDialogue: 'shop_fish', mood: 'happy' },
          { text: "I'm looking for information...", nextDialogue: 'information', mood: 'neutral' },
          { text: "Why are you yelling?", nextDialogue: 'yelling', mood: 'confused' },
          { text: "I should go.", nextDialogue: 'goodbye', mood: 'neutral' }
        ]
      },
      shop_fish: {
        text: "AH! A connoisseur! This mackerel here? Caught this morning. This salmon? Caught YESTERDAY morning - vintage! This mysterious glowing one? Found it in my pocket. Premium pricing!",
        options: [
          { text: "I'll take the glowing one.", nextDialogue: 'buy_glowing', givesItem: 'mysterious_glowing_fish', cost: 50 },
          { text: "Where did that come from?", nextDialogue: 'glowing_origin', mood: 'suspicious' },
          { text: "I need to think about it.", nextDialogue: 'goodbye', mood: 'neutral' }
        ]
      },
      information: {
        text: "*leans in conspiratorially* Information, eh? I hear things. The fish tell me things. Mostly complaints about water temperature, but SOMETIMES useful stuff!",
        options: [
          { text: "Have you heard about any treasure?", nextDialogue: 'treasure_info', requiresItem: 'old_coin' },
          { text: "What's the gossip around town?", nextDialogue: 'gossip', mood: 'curious' },
          { text: "The fish... talk to you?", nextDialogue: 'fish_talk', mood: 'concerned' }
        ]
      },
      treasure_info: {
        text: "TREASURE! *eyes the coin* That's a coin from the old Saltbeard hoard! Word is, the lighthouse keeper knows something. She's seen things from up there. THINGS!",
        advancesQuest: 'main_treasure_hunt',
        options: [
          { text: "Thanks for the tip!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      },
      gossip: {
        text: "Oh ho ho! Well, the Governor's been acting strange. Stranger than usual, I mean. And there's a new face in the alley - spooky type. Also, the crabs are organizing. Don't ask.",
        options: [
          { text: "The crabs are WHAT?", nextDialogue: 'crabs', mood: 'alarmed' },
          { text: "Tell me about the Governor.", nextDialogue: 'governor_gossip', mood: 'interested' },
          { text: "Thanks for the info!", nextDialogue: 'goodbye', mood: 'satisfied' }
        ]
      },
      yelling: {
        text: "WHAT? I'M NOT— ...Oh. Old fishing habit! When you're out at sea, everything's VERY LOUD! THE WAVES! THE WIND! THE EXISTENTIAL DREAD!",
        options: [
          { text: "That's... understandable.", nextDialogue: 'greeting', mood: 'sympathetic' },
          { text: "Maybe see a doctor?", nextDialogue: 'doctor_joke', mood: 'helpful' }
        ]
      },
      fish_talk: {
        text: "Of course they do! ...In a metaphorical sense. Through their eyes. Their cold, judging eyes. *stares at a fish* ...They're disappointed in me.",
        options: [
          { text: "Are you okay?", nextDialogue: 'okay_check', mood: 'concerned' },
          { text: "Anyway, about that information...", nextDialogue: 'information', mood: 'redirecting' }
        ]
      },
      goodbye: {
        text: "Come back soon! Tell your friends! Tell your ENEMIES! Everyone needs fish!",
        options: []
      }
    }
  },
  
  captain_goldbeard: {
    id: 'captain_goldbeard',
    name: "Cap'n Goldbeard",
    title: "Retired Pirate Legend",
    portrait: '🏴‍☠️',
    personality: 'gruff_but_kind',
    description: "A legendary pirate who retired to become a legendary complainer. His beard really is gold-colored. He dyes it.",
    dialogues: {
      greeting: {
        text: "*grumbles* Another landlubber come to gawk at the famous Captain Goldbeard? Well, feast yer eyes! This is what forty years of pirating gets ye - bad knees and a pension that barely covers rum!",
        options: [
          { text: "You're the REAL Captain Goldbeard?!", nextDialogue: 'famous', mood: 'starstruck' },
          { text: "I need sailing advice.", nextDialogue: 'sailing_advice', mood: 'respectful' },
          { text: "Why did you retire?", nextDialogue: 'retirement', mood: 'curious' },
          { text: "Nice beard. Is it natural?", nextDialogue: 'beard', mood: 'suspicious' }
        ]
      },
      famous: {
        text: "The one and only! Scourge of the Seven Seas! Terror of the Trade Routes! Currently... feeder of seagulls. *sigh* How the mighty have fallen.",
        options: [
          { text: "What was your greatest adventure?", nextDialogue: 'greatest_adventure', mood: 'eager' },
          { text: "Could you teach me to be a pirate?", nextDialogue: 'teach', mood: 'hopeful' }
        ]
      },
      sailing_advice: {
        text: "Sailing advice? Ha! First rule: The sea doesn't care about you. Second rule: Neither does the ship. Third rule: The rum is the only thing that cares, and it cares TOO much.",
        options: [
          { text: "That's... dark.", nextDialogue: 'dark', mood: 'uncomfortable' },
          { text: "Any PRACTICAL advice?", nextDialogue: 'practical', mood: 'pragmatic' }
        ]
      },
      practical: {
        text: "Fine, FINE. See that old rowboat? She might not look like much, but with the right repairs, she could get you to Smuggler's Cove. Bring me a rare fish, and I'll tell you where to find the parts.",
        startsQuest: 'rowboat_repairs',
        options: [
          { text: "Deal! What kind of fish?", nextDialogue: 'fish_quest', mood: 'determined' },
          { text: "Can't I just buy a boat?", nextDialogue: 'buy_boat', mood: 'lazy' }
        ]
      },
      beard: {
        text: "*strokes beard defensively* It's... hereditary. My grandmother had the same beard. COMPLETELY NATURAL GOLD. Stop looking at me like that.",
        options: [
          { text: "I believe you.", nextDialogue: 'greeting', mood: 'lying' },
          { text: "Your secret is safe with me.", nextDialogue: 'secret_safe', mood: 'conspiratorial' }
        ]
      },
      greatest_adventure: {
        text: "The greatest? *eyes go misty* The hunt for the Mermaid's Heart. A gem said to grant one wish. Never found it... but I found something better. A really good sandwich recipe. Life's about balance.",
        options: [
          { text: "The Mermaid's Heart exists?!", nextDialogue: 'mermaids_heart', mood: 'excited' },
          { text: "...Can I have the sandwich recipe?", nextDialogue: 'sandwich', mood: 'hungry' }
        ]
      },
      mermaids_heart: {
        text: "Oh, it exists alright. The mermaids guard it in their lagoon, past Shipwreck Beach. But they don't just let anyone in. You'd need to prove yourself worthy. Or bring really good snacks. They love snacks.",
        advancesQuest: 'mermaids_heart_quest',
        options: [
          { text: "How do I prove myself worthy?", nextDialogue: 'prove_worthy', mood: 'determined' },
          { text: "What snacks do they like?", nextDialogue: 'snacks', mood: 'practical' }
        ]
      },
      goodbye: {
        text: "Off with ye then! And if ye see any good rum, send it my way! *waves dismissively while feeding seagulls*",
        options: []
      }
    }
  },
  
  rosie_stormglass: {
    id: 'rosie_stormglass',
    name: "Rosie Stormglass",
    title: "Tavern Owner & Information Broker",
    portrait: '🍺',
    personality: 'warm_but_shrewd',
    description: "She's heard every story, served every pirate, and forgotten nothing. The tavern is her kingdom, and information is her currency.",
    dialogues: {
      greeting: {
        text: "Well, well, a fresh face! Welcome to the Salty Barnacle. Rum's good, food's edible, and the company... *glances at drunk sailor* ...is here. What'll it be?",
        options: [
          { text: "I'll have your finest rum!", nextDialogue: 'finest_rum', mood: 'enthusiastic' },
          { text: "I'm looking for information.", nextDialogue: 'information', mood: 'serious' },
          { text: "What's the story with this place?", nextDialogue: 'history', mood: 'curious' },
          { text: "Who's the drunk in the corner?", nextDialogue: 'drunk_intro', mood: 'curious' }
        ]
      },
      finest_rum: {
        text: "Ha! I like you already. *pours a glass* This is from Captain Goldbeard's personal stash. Don't tell him. Or do. His angry face is hilarious.",
        givesItem: 'captain_rum',
        options: [
          { text: "*sips* This is amazing!", nextDialogue: 'rum_praise', mood: 'impressed' },
          { text: "So, about that information...", nextDialogue: 'information', mood: 'redirecting' }
        ]
      },
      information: {
        text: "*leans on bar* Information costs, friend. But for someone who looks like they're headed for adventure... let's call it professional interest. What do you need to know?",
        options: [
          { text: "What's the Governor hiding?", nextDialogue: 'governor_secret', mood: 'conspiratorial' },
          { text: "I need to find the Smuggler's Cave.", nextDialogue: 'smugglers_cave_info', mood: 'determined' },
          { text: "Any treasure hunts I should know about?", nextDialogue: 'treasure_rumors', mood: 'greedy' }
        ]
      },
      governor_secret: {
        text: "*looks around, lowers voice* The Governor's been buying maps. Lots of maps. Old ones. And he's been meeting with a hooded figure late at night. Very cliché, but also very suspicious.",
        advancesQuest: 'governor_mystery',
        options: [
          { text: "A hooded figure? Like in the alley?", nextDialogue: 'hooded_connection', mood: 'connecting_dots' },
          { text: "Thanks, Rosie. You're the best.", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      },
      history: {
        text: "The Salty Barnacle's been here longer than the town. My grandmother ran it, her grandmother before that. We've served pirates, princes, and one very confused accountant who thought this was a bank.",
        options: [
          { text: "Did he make a deposit?", nextDialogue: 'bank_joke', mood: 'amused' },
          { text: "Your grandmother was a pirate?", nextDialogue: 'grandmother', mood: 'impressed' }
        ]
      },
      drunk_intro: {
        text: "That's Mumblin' Pete. Used to be first mate on the Crimson Tide. Now he's first mate of that barstool. BUT - catch him at the right moment, and he'll tell you secrets worth their weight in gold. Or at least in rum.",
        options: [
          { text: "I'll go talk to him.", nextDialogue: 'goodbye', mood: 'determined' },
          { text: "What happened to the Crimson Tide?", nextDialogue: 'crimson_tide', mood: 'curious' }
        ]
      },
      goodbye: {
        text: "Don't be a stranger, hon. And if you find any good stories out there, bring 'em back. The drunk sailors are getting repetitive.",
        options: []
      }
    }
  },
  
  shadow_merchant: {
    id: 'shadow_merchant',
    name: "???",
    title: "Definitely Not A Spy",
    portrait: '👤',
    personality: 'mysterious',
    description: "A hooded figure who speaks in riddles and sells items of questionable legality but unquestionable usefulness.",
    dialogues: {
      greeting: {
        text: "*raspy whisper* You seek what others hide. I sell what others need. The shadows know your purpose. Also, I have a sale on mysterious orbs. 20% off.",
        options: [
          { text: "What mysterious orbs?", nextDialogue: 'orbs', mood: 'intrigued' },
          { text: "Who are you?", nextDialogue: 'identity', mood: 'suspicious' },
          { text: "I need to find something specific.", nextDialogue: 'specific', mood: 'businesslike' },
          { text: "This is creepy. I'm leaving.", nextDialogue: 'leave', mood: 'nope' }
        ]
      },
      orbs: {
        text: "Orbs of various... purposes. This one glows. This one doesn't glow. This one glows but only when sad. Very popular with poets.",
        options: [
          { text: "I'll take the sad one.", nextDialogue: 'buy_sad_orb', givesItem: 'melancholy_orb', cost: 30 },
          { text: "Do you have anything less weird?", nextDialogue: 'less_weird', mood: 'reasonable' }
        ]
      },
      identity: {
        text: "I am... *dramatic pause* ...a merchant. In shadows. The name seemed obvious. My mother wanted me to be a baker. 'Too many carbs,' I said. 'Too mysterious,' she said. We don't talk anymore.",
        options: [
          { text: "That's... surprisingly relatable.", nextDialogue: 'relatable', mood: 'sympathetic' },
          { text: "Back to business.", nextDialogue: 'specific', mood: 'pragmatic' }
        ]
      },
      specific: {
        text: "Speak your need. I have maps to places that don't exist yet, keys to locks not yet made, and a delicious cookie recipe. The last one is personal.",
        options: [
          { text: "I need a map to the Treasure Chamber.", nextDialogue: 'treasure_map', requiresItem: 'smuggler_map_piece', mood: 'determined' },
          { text: "Keys to locks not yet made?", nextDialogue: 'future_keys', mood: 'confused' },
          { text: "Tell me about the Governor's secret meetings.", nextDialogue: 'governor_meetings', mood: 'investigative' }
        ]
      },
      treasure_map: {
        text: "*examines map piece* Ah, you have half. I have the other. Complete the map, and the chamber's location shall be revealed. In exchange... bring me a fish that glows. A SPECIFIC fish. You'll know it when you see it. Trust me.",
        startsQuest: 'complete_the_map',
        options: [
          { text: "Deal.", nextDialogue: 'goodbye', mood: 'determined' },
          { text: "How will I know it?", nextDialogue: 'fish_hint', mood: 'uncertain' }
        ]
      },
      governor_meetings: {
        text: "*hood shifts* Interesting you should ask. The Governor seeks the same treasure you do. But his methods are... less charming. Watch your back. Or front. Or both. Pirates strike from all directions.",
        advancesQuest: 'governor_mystery',
        options: [
          { text: "Are you helping me or warning me?", nextDialogue: 'helping_warning', mood: 'confused' },
          { text: "Thanks for the tip.", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      },
      leave: {
        text: "*chuckles* They all say that. They all come back. The shadows remember. Also, I'm next to the only good dumpster dive spot in town. Practical AND mysterious.",
        options: []
      },
      goodbye: {
        text: "*melts into shadows* ...I'm just stepping backward slowly. Very slowly. This is embarrassing. Just look away.",
        options: []
      }
    }
  },
  
  eleanor_brightspark: {
    id: 'eleanor_brightspark',
    name: "Eleanor Brightspark",
    title: "Lighthouse Keeper & Astronomer",
    portrait: '🔦',
    personality: 'eccentric_genius',
    description: "She keeps the light burning and tracks the stars. Some say she talks to both. She confirms this enthusiastically.",
    dialogues: {
      greeting: {
        text: "Oh! A visitor! Wonderful! The stars said someone would come today. Well, technically they said 'wink wink blink,' but I've learned to interpret.",
        options: [
          { text: "You understand the stars?", nextDialogue: 'stars', mood: 'fascinated' },
          { text: "I was told you might know about treasure.", nextDialogue: 'treasure_knowledge', mood: 'hopeful' },
          { text: "Why is the lighthouse crooked?", nextDialogue: 'crooked', mood: 'curious' },
          { text: "Can I use the telescope?", nextDialogue: 'telescope', mood: 'eager' }
        ]
      },
      stars: {
        text: "The stars speak! They told me about the Great Fish Migration of '42, the hidden cove beyond the cliffs, AND that Mercury is in retrograde, which explains why my toast keeps burning.",
        options: [
          { text: "Hidden cove?!", nextDialogue: 'hidden_cove', mood: 'excited' },
          { text: "Mercury affects toast?", nextDialogue: 'mercury_toast', mood: 'skeptical' }
        ]
      },
      treasure_knowledge: {
        text: "TREASURE! Yes! I've seen ships navigate to strange coordinates! From up here, I see EVERYTHING! Well, not everything. I missed my mother's birthday. She was not pleased. But MARITIME SECRETS, yes!",
        options: [
          { text: "What coordinates?", nextDialogue: 'coordinates', mood: 'eager' },
          { text: "I could deliver a birthday message for you.", nextDialogue: 'birthday_quest', startsQuest: 'eleanors_apology', mood: 'helpful' }
        ]
      },
      coordinates: {
        text: "The ships head to a spot near Mermaid Lagoon, but they always turn back. Something STOPS them. Or someONE. The mermaids don't like uninvited guests. Very territorial. Very pretty. Very bitey.",
        advancesQuest: 'mermaids_heart_quest',
        options: [
          { text: "How do I get invited?", nextDialogue: 'mermaid_invitation', mood: 'determined' },
          { text: "Bitey?!", nextDialogue: 'bitey', mood: 'concerned' }
        ]
      },
      crooked: {
        text: "Ah yes. The Lean. Local legend says a kraken sneezed. I say it was poor foundation work, but 'kraken sneeze' sounds better on postcards. We sell many postcards.",
        options: [
          { text: "Can I buy a postcard?", nextDialogue: 'postcard', givesItem: 'lighthouse_postcard', cost: 5 },
          { text: "Does the lean affect the light?", nextDialogue: 'lean_light', mood: 'practical' }
        ]
      },
      telescope: {
        text: "Of course! Look, look! You can see Shipwreck Beach from here! And the Governor's manor! And... oh my. The Governor is arguing with someone in a hood. INTRIGUE!",
        advancesQuest: 'governor_mystery',
        options: [
          { text: "A hooded figure?!", nextDialogue: 'hooded_sighting', mood: 'alarmed' },
          { text: "What else can you see?", nextDialogue: 'more_sightings', mood: 'curious' }
        ]
      },
      goodbye: {
        text: "Come back at night! The stars have SO much more to say! Mostly 'twinkle,' but the good stars have DEPTH!",
        options: []
      }
    }
  },
  
  boney_mcgee: {
    id: 'boney_mcgee',
    name: "Boney McGee",
    title: "World's Friendliest Skeleton",
    portrait: '💀',
    personality: 'eternally_optimistic',
    description: "A skeleton who's been guarding treasure for 200 years. He's made peace with his situation and developed a great sense of humor.",
    dialogues: {
      greeting: {
        text: "ANOTHER VISITOR! Oh joy! It's been... *counts on fingers, loses count, fingers fall off* ...a while! Please, sit! Well, don't actually sit. Those chairs are also 200 years old. They'll betray you.",
        options: [
          { text: "Are you... okay?", nextDialogue: 'okay', mood: 'concerned' },
          { text: "Why are you guarding this treasure?", nextDialogue: 'guarding', mood: 'curious' },
          { text: "Can I have some treasure?", nextDialogue: 'treasure_request', mood: 'greedy' },
          { text: "This is terrifying.", nextDialogue: 'terrifying', mood: 'scared' }
        ]
      },
      okay: {
        text: "Better than ever! No aches, no pains, no need to eat! Only downsides: no taste buds, and people run away when I wave hello. But I've got GREAT posture now!",
        options: [
          { text: "*laughs* You're pretty cool, Boney.", nextDialogue: 'friendship', mood: 'amused' },
          { text: "So about that treasure...", nextDialogue: 'treasure_request', mood: 'redirecting' }
        ]
      },
      guarding: {
        text: "Captain Saltbeard - the original one, not the cove - said 'Guard this treasure with your life!' So I did. And then after. Instructions were unclear about the 'after' part.",
        options: [
          { text: "Can you stop guarding now?", nextDialogue: 'stop_guarding', mood: 'logical' },
          { text: "What treasure did Saltbeard hide?", nextDialogue: 'saltbeard_treasure', mood: 'curious' }
        ]
      },
      treasure_request: {
        text: "Take some! Please! I've been staring at these coins for CENTURIES! Do you know how boring gold is? Very. Very boring. Shiny, yes. Interesting? NO.",
        givesItem: 'ancient_doubloon',
        options: [
          { text: "Thanks, Boney!", nextDialogue: 'friendship', mood: 'grateful' },
          { text: "Is there anything more valuable here?", nextDialogue: 'valuable', mood: 'persistent' }
        ]
      },
      saltbeard_treasure: {
        text: "The REAL treasure? The Mermaid's Heart! He hid a map to it here. *taps skull* It's in the back. Behind the cobwebs. Look for the skull with the fancy hat. That's my friend Gerald. He's less chatty.",
        advancesQuest: 'mermaids_heart_quest',
        givesItem: 'saltbeard_map',
        options: [
          { text: "You're the best, Boney!", nextDialogue: 'goodbye', mood: 'grateful' },
          { text: "Gerald... the other skeleton?", nextDialogue: 'gerald', mood: 'disturbed' }
        ]
      },
      friendship: {
        text: "You know, you're alright. Most people scream. Or faint. Or scream THEN faint. Very inefficient. If you ever need a friend who doesn't need sleep or food, I'm your bones!",
        options: [
          { text: "I'd like that.", nextDialogue: 'goodbye', mood: 'warm' },
          { text: "Do you get lonely?", nextDialogue: 'lonely', mood: 'empathetic' }
        ]
      },
      terrifying: {
        text: "*sighs, bones rattle* I know. I'm working on being less scary. I tried wearing a hat, but it kept falling through my skull. Very discouraging for the self-esteem.",
        options: [
          { text: "I'm sorry, let me try again.", nextDialogue: 'greeting', mood: 'apologetic' },
          { text: "Maybe a wig?", nextDialogue: 'wig', mood: 'helpful' }
        ]
      },
      goodbye: {
        text: "Come visit anytime! I'll be here! Forever! ...That came out sadder than I meant. CHEERFULLY forever!",
        options: []
      }
    }
  },

  // ============================================
  // RIVAL NPC - "Razor" Ricky Sharkfin
  // ============================================
  razor_ricky: {
    id: 'razor_ricky',
    name: '"Razor" Ricky Sharkfin',
    title: "Your Insufferable Rival",
    portrait: '🦈',
    personality: 'arrogant_competitive',
    description: "He's faster, richer, and never lets you forget it. But is he better? That's what this journey will decide.",
    dialogues: {
      greeting: {
        text: "*smirks* Well, well, well. Another wannabe fisher thinking they can make it big? I'm Ricky. 'Razor' Ricky. Remember that name - you'll be hearing it when I win EVERY tournament.",
        options: [
          { text: "I'll be the one winning, actually.", nextDialogue: 'challenge_accepted', mood: 'confident' },
          { text: "Nice to meet you too...", nextDialogue: 'polite_response', mood: 'neutral' },
          { text: "Why do they call you 'Razor'?", nextDialogue: 'razor_origin', mood: 'curious' },
          { text: "*walks away*", nextDialogue: 'goodbye', mood: 'dismissive' }
        ]
      },
      challenge_accepted: {
        text: "*laughs* Oh, I LIKE you! You've got spirit. Too bad spirit doesn't catch fish. Tell you what - beat my catch record at any fishing spot, and I'll admit you're... not completely terrible.",
        startsQuest: 'rival_challenge_1',
        options: [
          { text: "You're on!", nextDialogue: 'goodbye', mood: 'determined' },
          { text: "What's the record?", nextDialogue: 'record_info', mood: 'strategic' }
        ]
      },
      polite_response: {
        text: "Polite? How boring. Where's your FIRE? Your PASSION? Your completely irrational confidence? ...Fine, be nice. See where it gets you. Spoiler: nowhere I haven't already been.",
        options: [
          { text: "Maybe I'll surprise you.", nextDialogue: 'challenge_accepted', mood: 'mysterious' },
          { text: "We'll see.", nextDialogue: 'goodbye', mood: 'calm' }
        ]
      },
      razor_origin: {
        text: "*poses dramatically* Because I'm SHARP! Quick reflexes, quicker wit, and I cut through the competition like... well, a razor. Also, I once caught a shark bare-handed. That helped.",
        options: [
          { text: "Impressive. But can you beat ME?", nextDialogue: 'challenge_accepted', mood: 'competitive' },
          { text: "A shark? Really?", nextDialogue: 'shark_story', mood: 'skeptical' }
        ]
      },
      record_info: {
        text: "500 points at Sunny Lake. In ONE session. Think you can beat that? *laughs* I'll wait. I've got time. Unlike you, apparently.",
        options: [
          { text: "Watch me.", nextDialogue: 'goodbye', mood: 'determined' }
        ]
      },
      goodbye: {
        text: "*flips hair dramatically* Until next time! Try to keep up! ...Please. The competition is what keeps me going. *vulnerable moment* I mean— BYE!",
        options: []
      }
    }
  },

  // Stage NPCs
  net_captain_jonas: {
    id: 'net_captain_jonas',
    name: "Captain Jonas Networth",
    title: "Fishing Fleet Master",
    portrait: '🕸️',
    personality: 'gruff_but_fair',
    description: "Commands the fishing fleet. If you want to use fishing nets, you need his permission.",
    dialogues: {
      greeting: {
        text: "*inspects you* Another landlubber wanting to use my nets? Those nets cost more than you, rookie. Prove yourself first.",
        options: [
          { text: "How do I prove myself?", nextDialogue: 'prove_quest', mood: 'eager' },
          { text: "I can pay.", nextDialogue: 'pay_option', mood: 'confident' },
          { text: "What's special about your nets?", nextDialogue: 'net_info', mood: 'curious' }
        ]
      },
      prove_quest: {
        text: "Catch 20 fish in one session without losing a single one. Do that, and you can rent my smallest net.",
        startsQuest: 'net_trial',
        options: [
          { text: "Challenge accepted!", nextDialogue: 'goodbye', mood: 'determined' }
        ]
      },
      pay_option: {
        text: "*laughs* 500 gold for a day's rental. Or prove yourself and pay 50. Your choice.",
        options: [
          { text: "I'll prove myself.", nextDialogue: 'prove_quest', mood: 'determined' },
          { text: "Here's 500 gold.", nextDialogue: 'expensive_rental', cost: 500, givesItem: 'rental_fishing_net' }
        ]
      },
      net_info: {
        text: "These nets were woven by the mermaids themselves. They ATTRACT fish. Use one, and you catch twice as much.",
        options: [
          { text: "I need one!", nextDialogue: 'prove_quest', mood: 'excited' }
        ]
      },
      goodbye: {
        text: "The sea waits for no one, landlubber. Get moving.",
        options: []
      }
    }
  },

  sage_coralia: {
    id: 'sage_coralia',
    name: "Sage Coralia",
    title: "Ocean Whisperer",
    portrait: '🧜‍♀️',
    personality: 'mystical',
    description: "A half-mermaid who guides fishers to the deep. For a price.",
    dialogues: {
      greeting: {
        text: "*emerges from water* The deep calls to you, surface dweller. I can hear it in your heartbeat. But the abyss is not for the unprepared...",
        options: [
          { text: "What preparation do I need?", nextDialogue: 'preparation', mood: 'serious' },
          { text: "Are you... a mermaid?", nextDialogue: 'mermaid_truth', mood: 'curious' }
        ]
      },
      preparation: {
        text: "The deep dwellers are ancient. They don't bite ordinary bait. You need something that glows with moonlight - the Lunar Lure.",
        advancesQuest: 'deep_fishing_prep',
        options: [
          { text: "Where can I find this lure?", nextDialogue: 'lure_location', mood: 'determined' }
        ]
      },
      mermaid_truth: {
        text: "*laughs like waves* Half, dear. My mother was a mermaid, my father a fisherman. Ironic, yes? I help fishers. The mermaids call me traitor. I call myself... balanced.",
        options: [
          { text: "Can you help me reach the Mermaid's Heart?", nextDialogue: 'heart_help', mood: 'hopeful' }
        ]
      },
      heart_help: {
        text: "*eyes widen* The Heart? You seek THAT? I can guide you... but my kin must never know.",
        startsQuest: 'mermaids_heart_quest',
        options: [
          { text: "I'll keep your secret.", nextDialogue: 'goodbye', mood: 'sincere' }
        ]
      },
      goodbye: {
        text: "May the currents favor you, surface dweller.",
        options: []
      }
    }
  },

  mermaid_queen: {
    id: 'mermaid_queen',
    name: "Queen Corallina",
    title: "Sovereign of the Tides",
    portrait: '👸',
    personality: 'regal_mysterious',
    description: "The ruler of all mermaids. Her blessing is required to enter the sacred underwater caves.",
    dialogues: {
      greeting: {
        text: "*rises majestically from the water* A surface dweller in my lagoon. Bold. Foolish. Perhaps... interesting. State your purpose.",
        options: [
          { text: "I seek your blessing, Your Majesty.", nextDialogue: 'seek_blessing', mood: 'humble' },
          { text: "I've heard of the Mermaid's Heart.", nextDialogue: 'heart_mention', mood: 'direct' },
          { text: "I'm just passing through.", nextDialogue: 'passing_through', mood: 'casual' }
        ]
      },
      seek_blessing: {
        text: "*nods slightly* Respect. I appreciate respect. My blessing is not given freely. Complete a task for me, and perhaps... What do you know of fishing?",
        options: [
          { text: "I'm a skilled fisher!", nextDialogue: 'fishing_task', mood: 'confident' },
          { text: "I'm still learning.", nextDialogue: 'honest_answer', mood: 'humble' }
        ]
      },
      heart_mention: {
        text: "*eyes narrow* Who told you about the Heart? *pauses* No matter. The Heart is sacred. It cannot be claimed by force or theft. Only by... worthiness.",
        advancesQuest: 'mermaids_heart_quest',
        options: [
          { text: "How do I prove worthy?", nextDialogue: 'prove_worthy', mood: 'determined' }
        ]
      },
      prove_worthy: {
        text: "Catch the Starlight Leviathan and release it. Show me you value the sea over greed. Then we shall see.",
        startsQuest: 'leviathan_quest',
        options: [
          { text: "I will do this.", nextDialogue: 'goodbye', mood: 'determined' }
        ]
      },
      goodbye: {
        text: "*descends back into the water* The tides will guide you... or drown you. It depends entirely on you.",
        options: []
      }
    }
  },

  saltbeard_ghost: {
    id: 'saltbeard_ghost',
    name: "Captain Saltbeard",
    title: "The Ghost of Legends",
    portrait: '👻',
    personality: 'wise_ghostly',
    description: "The legendary pirate himself. Or what remains of him. Appears only to those who solve all his riddles.",
    dialogues: {
      greeting: {
        text: "*materializes from golden mist* You found me. Not many do. I've been watching you. The treasure is yours... but first, hear my tale.",
        options: [
          { text: "Tell me everything.", nextDialogue: 'story', mood: 'eager' },
          { text: "What's the catch?", nextDialogue: 'catch', mood: 'suspicious' }
        ]
      },
      story: {
        text: "I was the greatest fisher of my age. But greed consumed me. I hoarded treasure instead of sharing the sea's bounty. Now I guard it, unable to move on... unless someone worthy takes my place.",
        options: [
          { text: "I'll be a better legend than you.", nextDialogue: 'legacy', mood: 'determined' },
          { text: "That's... sad.", nextDialogue: 'sympathy', mood: 'empathetic' }
        ]
      },
      legacy: {
        text: "*laughs warmly* THAT'S the spirit! Take the treasure. ALL of it. But remember - the true treasure is the journey. And the fish. Mostly the fish.",
        givesItem: 'saltbeard_legacy_rod',
        completesQuest: 'main_treasure_hunt',
        options: [
          { text: "Thank you, Captain.", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      },
      goodbye: {
        text: "*fades into golden light* Go forth and be legendary. And catch a big one for me, will ya? *vanishes*",
        options: []
      }
    }
  }
};

// ============================================================================
// ITEMS - Collectibles and Quest Items
// ============================================================================

export const ADVENTURE_ITEMS = {
  // Common Items
  old_coin: { id: 'old_coin', name: "Old Coin", description: "A tarnished coin with a face you don't recognize. Valuable to collectors, historians, and people who just really like circles.", icon: '🪙', type: 'quest', rarity: 'common' },
  seagull_feather: { id: 'seagull_feather', name: "Seagull Feather", description: "Slightly dirty, completely free. The seagull didn't mind. Much.", icon: '🪶', type: 'junk', rarity: 'common' },
  rope_piece: { id: 'rope_piece', name: "Rope Piece", description: "Useful for tying, untying, and pretending to lasso things.", icon: '🪢', type: 'crafting', rarity: 'common' },
  barnacle: { id: 'barnacle', name: "Barnacle", description: "It's crusty. It's clingy. It reminds you of someone you used to know.", icon: '🐚', type: 'crafting', rarity: 'common' },
  mug_shard: { id: 'mug_shard', name: "Broken Mug Shard", description: "From a mug that has seen better days. And better contents.", icon: '🍺', type: 'junk', rarity: 'common' },
  playing_card: { id: 'playing_card', name: "Worn Playing Card", description: "The Queen of Spades. She's seen things.", icon: '🃏', type: 'junk', rarity: 'common' },
  
  // Quest Items
  mysterious_key: { id: 'mysterious_key', name: "Mysterious Key", description: "Opens something. Somewhere. Probably.", icon: '🗝️', type: 'quest', rarity: 'uncommon' },
  lighthouse_lens_shard: { id: 'lighthouse_lens_shard', name: "Lens Shard", description: "A piece of the lighthouse's original lens. Still sparkles after all these years.", icon: '💎', type: 'quest', rarity: 'uncommon' },
  smuggler_map_piece: { id: 'smuggler_map_piece', name: "Map Fragment", description: "Half a treasure map. The half with 'X marks the—' but not where.", icon: '🗺️', type: 'quest', rarity: 'rare' },
  glow_mushroom: { id: 'glow_mushroom', name: "Glowing Mushroom", description: "Bioluminescent fungus. Don't eat it. Seriously.", icon: '🍄', type: 'crafting', rarity: 'uncommon' },
  wind_crystal: { id: 'wind_crystal', name: "Wind Crystal", description: "Trapped wind in crystalline form. Whispers when you shake it.", icon: '💨', type: 'quest', rarity: 'rare' },
  
  // Rare Items
  ancient_doubloon: { id: 'ancient_doubloon', name: "Ancient Doubloon", description: "From Captain Saltbeard's original hoard. Very shiny. Very old. Very yours now.", icon: '🥇', type: 'treasure', rarity: 'rare' },
  cursed_compass: { id: 'cursed_compass', name: "Cursed Compass", description: "Points to what you need, not what you want. Frustrating but useful.", icon: '🧭', type: 'quest', rarity: 'rare' },
  mermaid_scale: { id: 'mermaid_scale', name: "Mermaid Scale", description: "Iridescent and slightly damp. The mermaid probably won't miss just one.", icon: '🧜', type: 'quest', rarity: 'epic' },
  pearl_of_wisdom: { id: 'pearl_of_wisdom', name: "Pearl of Wisdom", description: "Whispers advice. Mostly good advice. Sometimes just tells you to eat more vegetables.", icon: '🫧', type: 'quest', rarity: 'epic' },
  saltbeard_map: { id: 'saltbeard_map', name: "Saltbeard's Map", description: "The complete treasure map. X DOES mark the spot!", icon: '🗺️', type: 'quest', rarity: 'legendary' },
  
  // Shop Items
  captain_rum: { id: 'captain_rum', name: "Captain's Rum", description: "From Goldbeard's personal stash. Liquid courage in a bottle.", icon: '🍾', type: 'consumable', rarity: 'uncommon' },
  mysterious_glowing_fish: { id: 'mysterious_glowing_fish', name: "Glowing Fish", description: "It glows. It's a fish. Questions answered, mysteries deepened.", icon: '✨', type: 'quest', rarity: 'rare' },
  melancholy_orb: { id: 'melancholy_orb', name: "Melancholy Orb", description: "Glows when sad. Currently glowing. Poor orb.", icon: '🔮', type: 'misc', rarity: 'uncommon' },
  lighthouse_postcard: { id: 'lighthouse_postcard', name: "Lighthouse Postcard", description: "'Wish you were here (tilting)'", icon: '📮', type: 'misc', rarity: 'common' },
  dynamite_fish: { id: 'dynamite_fish', name: "Dynamite Fish", description: "A fish that explodes. Don't ask how. Don't ask why. Just aim carefully.", icon: '💥', type: 'quest', rarity: 'rare' }
};

// ============================================================================
// QUESTS - The Adventures Within
// ============================================================================

export const ADVENTURE_QUESTS = {
  main_treasure_hunt: {
    id: 'main_treasure_hunt',
    name: "The Hunt for Saltbeard's Treasure",
    description: "The legendary pirate Saltbeard hid his greatest treasure somewhere on the island. Find it!",
    type: 'main',
    stages: [
      { id: 1, name: "Talk to the fish merchant about the old coin", completed: false },
      { id: 2, name: "Visit the lighthouse keeper", completed: false },
      { id: 3, name: "Find the smuggler's map piece", completed: false },
      { id: 4, name: "Complete the map with the shadow merchant", completed: false },
      { id: 5, name: "Reach the Treasure Chamber", completed: false },
      { id: 6, name: "Befriend Boney McGee", completed: false },
      { id: 7, name: "Obtain Saltbeard's Map", completed: false }
    ],
    rewards: { gold: 5000, xp: 10000, item: 'saltbeard_treasure' }
  },
  
  mermaids_heart_quest: {
    id: 'mermaids_heart_quest',
    name: "The Mermaid's Heart",
    description: "A legendary gem guarded by mermaids. Worth a fortune... or a wish.",
    type: 'main',
    stages: [
      { id: 1, name: "Learn about the Mermaid's Heart from Captain Goldbeard", completed: false },
      { id: 2, name: "Find the path to Mermaid Lagoon", completed: false },
      { id: 3, name: "Discover how to be welcomed by the mermaids", completed: false },
      { id: 4, name: "Bring an offering to the mermaids", completed: false },
      { id: 5, name: "Prove your worth in the Mermaid Trial", completed: false },
      { id: 6, name: "Make your choice at the Heart", completed: false }
    ],
    rewards: { gold: 10000, xp: 20000, item: 'mermaids_heart_gem' }
  },
  
  governor_mystery: {
    id: 'governor_mystery',
    name: "The Governor's Secret",
    description: "Governor Reginald is up to something. Something... governmental? No, worse. Something SUSPICIOUS.",
    type: 'side',
    stages: [
      { id: 1, name: "Hear rumors about the Governor", completed: false },
      { id: 2, name: "Spot the hooded figure meeting the Governor", completed: false },
      { id: 3, name: "Investigate the shadow merchant", completed: false },
      { id: 4, name: "Find evidence of the conspiracy", completed: false },
      { id: 5, name: "Confront the Governor or expose him", completed: false }
    ],
    rewards: { gold: 2000, xp: 4000, reputation: 'justice' }
  },
  
  rowboat_repairs: {
    id: 'rowboat_repairs',
    name: "A Boat of My Own",
    description: "Captain Goldbeard will help you repair an old rowboat in exchange for a rare fish.",
    type: 'side',
    stages: [
      { id: 1, name: "Agree to Captain Goldbeard's deal", completed: false },
      { id: 2, name: "Catch a Moonlight Mackerel", completed: false },
      { id: 3, name: "Bring the fish to Goldbeard", completed: false },
      { id: 4, name: "Collect boat repair materials", completed: false },
      { id: 5, name: "Launch your boat!", completed: false }
    ],
    rewards: { gold: 500, xp: 1000, item: 'personal_rowboat' }
  },
  
  complete_the_map: {
    id: 'complete_the_map',
    name: "Two Halves Make a Whole",
    description: "The shadow merchant has the other half of the treasure map. They want... a glowing fish?",
    type: 'side',
    stages: [
      { id: 1, name: "Find a glowing fish", completed: false },
      { id: 2, name: "Trade with the shadow merchant", completed: false },
      { id: 3, name: "Decipher the complete map", completed: false }
    ],
    rewards: { gold: 1000, xp: 2000, item: 'complete_treasure_map' }
  },
  
  eleanors_apology: {
    id: 'eleanors_apology',
    name: "A Letter Home",
    description: "Help Eleanor apologize to her mother for missing her birthday. Again.",
    type: 'side',
    stages: [
      { id: 1, name: "Write the apology letter with Eleanor", completed: false },
      { id: 2, name: "Find Eleanor's mother in the Merchant Quarter", completed: false },
      { id: 3, name: "Deliver the letter and gift", completed: false }
    ],
    rewards: { gold: 300, xp: 600, item: 'homemade_telescope' }
  }
};

// ============================================================================
// DIALOGUE HELPERS
// ============================================================================

export const WITTY_DESCRIPTIONS = [
  "You examine it closely. It examines you back. Uncomfortable.",
  "It's exactly what it looks like. Whatever that is.",
  "Your mother would not approve. Then again, she rarely does.",
  "Is it valuable? Is anything valuable? *existential crisis incoming*",
  "You found it. It's yours now. This is how ownership works at sea.",
  "It's seen better days. Then again, so have you.",
  "Surprisingly heavy for something so... whatever it is.",
  "You're not sure what this is, but you're SURE you need it."
];

export const TRAVEL_MESSAGES = [
  "You walk with purpose. The purpose is unclear, but the walk is confident.",
  "One foot in front of the other. You've got this. Probably.",
  "Adventure awaits! Or at least mild inconvenience. Same thing, really.",
  "You venture forth, like a hero. A slightly confused hero.",
  "The path beckons. You answer. Very polite of you."
];

export const getRandomDescription = () => WITTY_DESCRIPTIONS[Math.floor(Math.random() * WITTY_DESCRIPTIONS.length)];
export const getRandomTravelMessage = () => TRAVEL_MESSAGES[Math.floor(Math.random() * TRAVEL_MESSAGES.length)];

export default {
  locations: ADVENTURE_LOCATIONS,
  npcs: ADVENTURE_NPCS,
  items: ADVENTURE_ITEMS,
  quests: ADVENTURE_QUESTS
};
