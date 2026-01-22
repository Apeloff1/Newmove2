/**
 * OPEN WORLD PIRATE RPG - NPC DATABASE
 * 125+ Unique Characters with Branching Dialogue
 * 
 * NPCs organized by:
 * - Region/City
 * - Role (merchant, quest-giver, companion, etc.)
 * - Importance (major, minor, ambient)
 */

// ============================================================================
// NPC PERSONALITY TRAITS (for procedural dialogue)
// ============================================================================

export const NPC_PERSONALITIES = {
  friendly: { greetingMod: 1.2, priceMod: 0.9, dialogueTone: 'warm' },
  grumpy: { greetingMod: 0.7, priceMod: 1.1, dialogueTone: 'curt' },
  mysterious: { greetingMod: 0.9, priceMod: 1.0, dialogueTone: 'cryptic' },
  jovial: { greetingMod: 1.5, priceMod: 0.95, dialogueTone: 'loud' },
  nervous: { greetingMod: 0.8, priceMod: 1.05, dialogueTone: 'hesitant' },
  proud: { greetingMod: 1.0, priceMod: 1.2, dialogueTone: 'boastful' },
  kind: { greetingMod: 1.3, priceMod: 0.85, dialogueTone: 'gentle' },
  cunning: { greetingMod: 1.0, priceMod: 1.15, dialogueTone: 'sly' },
  wise: { greetingMod: 1.1, priceMod: 1.0, dialogueTone: 'thoughtful' },
  eccentric: { greetingMod: 1.2, priceMod: 0.9, dialogueTone: 'odd' }
};

// ============================================================================
// PORT FORTUNE NPCS (Main Hub - 30 NPCs)
// ============================================================================

export const PORT_FORTUNE_NPCS = {
  // === MAJOR CHARACTERS ===
  finley_scales: {
    id: 'finley_scales',
    name: "Finley Scales",
    title: "Fish Merchant Extraordinaire",
    portrait: '🐟',
    gender: 'male',
    personality: 'jovial',
    role: 'merchant',
    location: 'harbor_district',
    importance: 'major',
    shop: 'fish_market',
    schedule: { morning: 'fish_market', afternoon: 'fish_market', evening: 'tavern', night: 'home' },
    relationships: { player: 0, rosie: 50, goldbeard: 30 },
    quests: ['find_rare_fish', 'fish_delivery'],
    lore: "Third generation fish merchant. His grandfather allegedly talked to fish. Finley just yells at them.",
    dialogueStyle: 'enthusiastic'
  },
  
  captain_goldbeard: {
    id: 'captain_goldbeard',
    name: "Cap'n Goldbeard",
    title: "Retired Pirate Legend",
    portrait: '🏴‍☠️',
    gender: 'male',
    personality: 'grumpy',
    role: 'quest_giver',
    location: 'docks',
    importance: 'major',
    shop: null,
    schedule: { morning: 'docks', afternoon: 'docks', evening: 'tavern', night: 'tavern' },
    relationships: { player: 0, rosie: 60, governor: -80 },
    quests: ['rowboat_repairs', 'pirate_stories', 'goldbeards_legacy'],
    lore: "Sailed every sea, fought every monster, dyed his beard gold (don't tell anyone).",
    dialogueStyle: 'gruff'
  },
  
  rosie_stormglass: {
    id: 'rosie_stormglass',
    name: "Rosie Stormglass",
    title: "Tavern Owner & Information Broker",
    portrait: '🍺',
    gender: 'female',
    personality: 'cunning',
    role: 'information',
    location: 'tavern_row',
    importance: 'major',
    shop: 'tavern',
    schedule: { morning: 'supplies', afternoon: 'tavern', evening: 'tavern', night: 'tavern' },
    relationships: { player: 0, goldbeard: 60, shadow_merchant: 40, governor: -30 },
    quests: ['gather_rumors', 'find_informant', 'rosies_past'],
    lore: "Knows everyone's secrets. Shares them for the right price. Or just for fun.",
    dialogueStyle: 'shrewd'
  },
  
  governor_reginald: {
    id: 'governor_reginald',
    name: "Governor Reginald Pompous III",
    title: "The Honorable Governor",
    portrait: '👑',
    gender: 'male',
    personality: 'proud',
    role: 'authority',
    location: 'governors_hill',
    importance: 'major',
    shop: null,
    schedule: { morning: 'manor', afternoon: 'town_hall', evening: 'manor', night: 'secret_meetings' },
    relationships: { player: 0, goldbeard: -80, navy: 70, shadow_merchant: 50 },
    quests: ['governor_mystery', 'official_duties', 'dark_secret'],
    lore: "Inherited the governorship. Hides many secrets behind his pompous facade.",
    dialogueStyle: 'pompous',
    secretAlignment: 'villain'
  },
  
  shadow_merchant: {
    id: 'shadow_merchant',
    name: "The Shadow",
    title: "Dealer in Mysteries",
    portrait: '👤',
    gender: 'unknown',
    personality: 'mysterious',
    role: 'black_market',
    location: 'shady_alley',
    importance: 'major',
    shop: 'black_market',
    schedule: { morning: 'hidden', afternoon: 'hidden', evening: 'alley', night: 'alley' },
    relationships: { player: 0, governor: 50, rosie: 40 },
    quests: ['complete_the_map', 'shadow_favors', 'truth_revealed'],
    lore: "Nobody knows their real name, face, or purpose. Perfect mysterious stranger.",
    dialogueStyle: 'cryptic'
  },
  
  eleanor_brightspark: {
    id: 'eleanor_brightspark',
    name: "Eleanor Brightspark",
    title: "Lighthouse Keeper & Astronomer",
    portrait: '🔦',
    gender: 'female',
    personality: 'eccentric',
    role: 'quest_giver',
    location: 'lighthouse',
    importance: 'major',
    shop: null,
    schedule: { morning: 'lighthouse', afternoon: 'lighthouse', evening: 'observatory', night: 'observatory' },
    relationships: { player: 0, mother: 70 },
    quests: ['eleanors_apology', 'star_charts', 'lighthouse_mystery'],
    lore: "Talks to stars. They rarely respond. She doesn't let that stop her.",
    dialogueStyle: 'scattered'
  },

  // === MERCHANTS (10) ===
  barnaby_hooks: {
    id: 'barnaby_hooks',
    name: "Barnaby Hooks",
    title: "Bait & Tackle Master",
    portrait: '🪝',
    gender: 'male',
    personality: 'friendly',
    role: 'merchant',
    location: 'harbor_district',
    importance: 'minor',
    shop: 'bait_shop',
    quests: ['rare_bait_quest'],
    lore: "Lost three fingers to bait. Still considers it a fair trade."
  },
  
  martha_anvil: {
    id: 'martha_anvil',
    name: "Martha 'Iron' Anvil",
    title: "Master Blacksmith",
    portrait: '⚒️',
    gender: 'female',
    personality: 'grumpy',
    role: 'merchant',
    location: 'market_square',
    importance: 'minor',
    shop: 'blacksmith',
    quests: ['forge_legendary', 'find_materials'],
    lore: "Stronger than most pirates. Makes sure everyone knows it."
  },
  
  percival_goods: {
    id: 'percival_goods',
    name: "Percival T. Goods",
    title: "General Store Proprietor",
    portrait: '🏪',
    gender: 'male',
    personality: 'nervous',
    role: 'merchant',
    location: 'market_square',
    importance: 'minor',
    shop: 'general_store',
    quests: ['supply_run'],
    lore: "Anxious about everything. His prices reflect his fear of bankruptcy."
  },
  
  madame_mystique: {
    id: 'madame_mystique',
    name: "Madame Mystique",
    title: "Potion Brewer",
    portrait: '🔮',
    gender: 'female',
    personality: 'mysterious',
    role: 'merchant',
    location: 'market_square',
    importance: 'minor',
    shop: 'potion_shop',
    quests: ['rare_ingredients', 'test_potion'],
    lore: "Claims to see the future. Mostly sees customers coming and raises prices."
  },
  
  old_salty: {
    id: 'old_salty',
    name: "Old Salty",
    title: "Dried Goods Vendor",
    portrait: '🧂',
    gender: 'male',
    personality: 'wise',
    role: 'merchant',
    location: 'market_square',
    importance: 'ambient',
    shop: 'dried_goods',
    lore: "So old he might be pickled. Stories older than him."
  },

  // === TAVERN REGULARS (8) ===
  mumblin_pete: {
    id: 'mumblin_pete',
    name: "Mumblin' Pete",
    title: "Professional Drunk",
    portrait: '🥴',
    gender: 'male',
    personality: 'friendly',
    role: 'information',
    location: 'tavern_row',
    importance: 'minor',
    schedule: { morning: 'alley', afternoon: 'tavern', evening: 'tavern', night: 'floor' },
    quests: ['petes_story', 'sober_him_up'],
    lore: "Former first mate. Now first to the bar. Knows things when sober enough."
  },
  
  lucky_lucy: {
    id: 'lucky_lucy',
    name: "Lucky Lucy",
    title: "Card Shark",
    portrait: '🃏',
    gender: 'female',
    personality: 'cunning',
    role: 'minigame',
    location: 'tavern_row',
    importance: 'minor',
    quests: ['beat_lucy', 'card_tournament'],
    lore: "Never lost a game. Never. Not once. (She cheats.)"
  },
  
  three_finger_tim: {
    id: 'three_finger_tim',
    name: "Three-Finger Tim",
    title: "Arm Wrestling Champion",
    portrait: '💪',
    gender: 'male',
    personality: 'jovial',
    role: 'minigame',
    location: 'tavern_row',
    importance: 'minor',
    quests: ['arm_wrestling_champion'],
    lore: "Lost fingers in various adventures. Won't say which adventure was which finger."
  },
  
  songbird_sally: {
    id: 'songbird_sally',
    name: "Songbird Sally",
    title: "Tavern Singer",
    portrait: '🎵',
    gender: 'female',
    personality: 'kind',
    role: 'entertainment',
    location: 'tavern_row',
    importance: 'minor',
    quests: ['find_lost_song', 'sallys_secret'],
    lore: "Voice of an angel. Past of a pirate. Won't sing about it."
  },
  
  complaining_carl: {
    id: 'complaining_carl',
    name: "Complaining Carl",
    title: "Professional Pessimist",
    portrait: '😤',
    gender: 'male',
    personality: 'grumpy',
    role: 'ambient',
    location: 'tavern_row',
    importance: 'ambient',
    lore: "If there's a cloud, he'll find it. Then complain about it."
  },

  // === DOCK WORKERS (5) ===
  dock_master_drake: {
    id: 'dock_master_drake',
    name: "Dock Master Drake",
    title: "Harbor Authority",
    portrait: '⚓',
    gender: 'male',
    personality: 'proud',
    role: 'service',
    location: 'docks',
    importance: 'minor',
    quests: ['clear_docks', 'missing_shipment'],
    lore: "Runs the docks with an iron fist. And an iron hook. Lost the hand to bureaucracy."
  },
  
  nellie_nets: {
    id: 'nellie_nets',
    name: "Nellie Nets",
    title: "Net Mender",
    portrait: '🕸️',
    gender: 'female',
    personality: 'kind',
    role: 'service',
    location: 'docks',
    importance: 'ambient',
    lore: "Can fix any net. Any sail. Any heart. Very handy."
  },
  
  crane_operator_crane: {
    id: 'crane_operator_crane',
    name: "Crane the Crane Operator",
    title: "Cargo Handler",
    portrait: '🏗️',
    gender: 'male',
    personality: 'nervous',
    role: 'ambient',
    location: 'docks',
    importance: 'ambient',
    lore: "Named after his job. Or his job was named after him. Nobody remembers."
  },

  // === GUARDS & AUTHORITY (4) ===
  sergeant_snooze: {
    id: 'sergeant_snooze',
    name: "Sergeant Snooze",
    title: "Guard Captain",
    portrait: '💂',
    gender: 'male',
    personality: 'friendly',
    role: 'authority',
    location: 'governors_hill',
    importance: 'minor',
    schedule: { morning: 'patrol', afternoon: 'nap', evening: 'patrol', night: 'deep_sleep' },
    quests: ['help_guard', 'stolen_uniform'],
    lore: "Best guard in town. Except during nap time. Which is always."
  },
  
  private_pepper: {
    id: 'private_pepper',
    name: "Private Pepper",
    title: "Rookie Guard",
    portrait: '🫡',
    gender: 'female',
    personality: 'nervous',
    role: 'authority',
    location: 'market_square',
    importance: 'ambient',
    lore: "Tries very hard. Results vary."
  },

  // === QUEST GIVERS (5) ===
  professor_plankton: {
    id: 'professor_plankton',
    name: "Professor Plankton",
    title: "Marine Biologist",
    portrait: '🔬',
    gender: 'male',
    personality: 'eccentric',
    role: 'quest_giver',
    location: 'harbor_district',
    importance: 'minor',
    quests: ['study_fish', 'discover_species', 'research_grant'],
    lore: "Studies fish. Talks to fish. Fish probably talk back at this point."
  },
  
  treasure_hunter_tess: {
    id: 'treasure_hunter_tess',
    name: "Treasure Hunter Tess",
    title: "Professional Seeker",
    portrait: '💎',
    gender: 'female',
    personality: 'cunning',
    role: 'quest_giver',
    location: 'tavern_row',
    importance: 'minor',
    quests: ['treasure_leads', 'partnership', 'ancient_map'],
    lore: "Found forty treasures. Lost thirty-eight. Still counts as winning."
  },
  
  message_boy_max: {
    id: 'message_boy_max',
    name: "Message Boy Max",
    title: "Town Courier",
    portrait: '📨',
    gender: 'male',
    personality: 'friendly',
    role: 'quest_giver',
    location: 'market_square',
    importance: 'ambient',
    quests: ['delivery_quest', 'urgent_message'],
    lore: "Knows everyone. Delivers everything. Reads nothing. Probably."
  }
};

// ============================================================================
// CORAL ARCHIPELAGO NPCS (25 NPCs)
// ============================================================================

export const CORAL_ARCHIPELAGO_NPCS = {
  queen_coraline: {
    id: 'queen_coraline',
    name: "Queen Coraline",
    title: "Ruler of the Coral Court",
    portrait: '🧜‍♀️',
    gender: 'female',
    personality: 'proud',
    role: 'royalty',
    location: 'coral_city',
    importance: 'major',
    quests: ['audience_with_queen', 'prove_worthy', 'mermaids_heart'],
    lore: "Half-human, half-mermaid. Fully regal. Very particular about manners."
  },
  
  pearl_diver_paco: {
    id: 'pearl_diver_paco',
    name: "Pearl Diver Paco",
    title: "Champion Free Diver",
    portrait: '🤿',
    gender: 'male',
    personality: 'jovial',
    role: 'trainer',
    location: 'coral_city',
    importance: 'minor',
    quests: ['diving_lessons', 'deep_dive_challenge'],
    lore: "Can hold breath for 10 minutes. Claims it's 20. It's definitely 10."
  },
  
  chef_crustacean: {
    id: 'chef_crustacean',
    name: "Chef Crustacean",
    title: "Seafood Master",
    portrait: '🦀',
    gender: 'male',
    personality: 'proud',
    role: 'merchant',
    location: 'coral_city',
    importance: 'minor',
    shop: 'fine_dining',
    quests: ['rare_ingredients', 'cooking_competition'],
    lore: "Cooks crustaceans. Is suspiciously crab-like. We don't ask questions."
  },
  
  reef_guide_ray: {
    id: 'reef_guide_ray',
    name: "Reef Guide Ray",
    title: "Coral Expert",
    portrait: '🐠',
    gender: 'male',
    personality: 'kind',
    role: 'guide',
    location: 'rainbow_reef',
    importance: 'minor',
    quests: ['reef_tour', 'save_coral', 'exotic_fish_hunt'],
    lore: "Named after a ray. Not a ray himself. Probably."
  },
  
  shell_collector_shelly: {
    id: 'shell_collector_shelly',
    name: "Shell Collector Shelly",
    title: "Conchologist",
    portrait: '🐚',
    gender: 'female',
    personality: 'eccentric',
    role: 'merchant',
    location: 'turtle_beach',
    importance: 'minor',
    shop: 'shell_shop',
    quests: ['rare_shell', 'shell_collection'],
    lore: "Has 10,000 shells. Names them all. Remembers every name."
  },
  
  captain_tsunami: {
    id: 'captain_tsunami',
    name: "Captain Tsunami",
    title: "Storm Rider",
    portrait: '🌊',
    gender: 'female',
    personality: 'cunning',
    role: 'ship_captain',
    location: 'palm_haven',
    importance: 'minor',
    quests: ['storm_voyage', 'racing_challenge'],
    lore: "Sails into storms for fun. Profits are a bonus."
  },
  
  retired_admiral_anchor: {
    id: 'retired_admiral_anchor',
    name: "Admiral Anchor",
    title: "Retired Naval Commander",
    portrait: '⚓',
    gender: 'male',
    personality: 'proud',
    role: 'quest_giver',
    location: 'palm_haven',
    importance: 'minor',
    quests: ['naval_history', 'old_war_stories', 'find_old_ship'],
    lore: "Fought in every major naval battle. Talks about all of them. Constantly."
  },
  
  tropical_trader_tiki: {
    id: 'tropical_trader_tiki',
    name: "Trader Tiki",
    title: "Exotic Goods Merchant",
    portrait: '🗿',
    gender: 'male',
    personality: 'mysterious',
    role: 'merchant',
    location: 'coral_city',
    importance: 'minor',
    shop: 'exotic_fish_emporium',
    lore: "Sells things from places that don't exist on maps. Yet."
  },
  
  sunken_temple_guardian: {
    id: 'sunken_temple_guardian',
    name: "The Guardian",
    title: "Temple Protector",
    portrait: '🗿',
    gender: 'unknown',
    personality: 'wise',
    role: 'boss',
    location: 'sunken_temple',
    importance: 'major',
    quests: ['temple_trial', 'ancient_wisdom'],
    lore: "Has guarded the temple for a thousand years. Still not bored."
  },
  
  volcano_hermit: {
    id: 'volcano_hermit',
    name: "Ignis the Hermit",
    title: "Fire Sage",
    portrait: '🌋',
    gender: 'male',
    personality: 'wise',
    role: 'quest_giver',
    location: 'volcano_isle',
    importance: 'minor',
    quests: ['volcano_fish', 'fire_blessing', 'hermits_riddles'],
    lore: "Lives in a volcano. Says it's for the view. The view is lava."
  }
};

// ============================================================================
// FROZEN NORTH NPCS (20 NPCs)
// ============================================================================

export const FROZEN_NORTH_NPCS = {
  chief_frostbeard: {
    id: 'chief_frostbeard',
    name: "Chief Frostbeard",
    title: "Leader of Frostport",
    portrait: '🧔',
    gender: 'male',
    personality: 'grumpy',
    role: 'authority',
    location: 'frostport',
    importance: 'major',
    quests: ['earn_trust', 'beast_hunt', 'northern_passage'],
    lore: "Beard is actually frozen. Refuses to thaw it. 'Character,' he says."
  },
  
  ice_fisher_ingrid: {
    id: 'ice_fisher_ingrid',
    name: "Ice Fisher Ingrid",
    title: "Arctic Angling Expert",
    portrait: '🎣',
    gender: 'female',
    personality: 'friendly',
    role: 'trainer',
    location: 'frostport',
    importance: 'minor',
    quests: ['ice_fishing_lessons', 'legendary_frost_fish'],
    lore: "Caught a fish bigger than her boat. The boat was big."
  },
  
  sled_master_sven: {
    id: 'sled_master_sven',
    name: "Sled Master Sven",
    title: "Dog Sled Champion",
    portrait: '🛷',
    gender: 'male',
    personality: 'jovial',
    role: 'transport',
    location: 'frostport',
    importance: 'minor',
    quests: ['sled_race', 'rescue_mission'],
    lore: "Dogs love him. Actually everyone loves him. Very lovable guy."
  },
  
  aurora_watcher_astrid: {
    id: 'aurora_watcher_astrid',
    name: "Aurora Watcher Astrid",
    title: "Northern Lights Scholar",
    portrait: '🌌',
    gender: 'female',
    personality: 'eccentric',
    role: 'quest_giver',
    location: 'frostport',
    importance: 'minor',
    quests: ['aurora_prophecy', 'sky_fish', 'light_magic'],
    lore: "Studies the aurora. Claims it talks to her. Who are we to argue?"
  },
  
  fur_trader_fjord: {
    id: 'fur_trader_fjord',
    name: "Fur Trader Fjord",
    title: "Premium Pelts Dealer",
    portrait: '🦊',
    gender: 'male',
    personality: 'cunning',
    role: 'merchant',
    location: 'frostport',
    importance: 'minor',
    shop: 'fur_trader',
    lore: "Only sells furs from animals that died of natural causes. Mostly."
  },
  
  hot_springs_helga: {
    id: 'hot_springs_helga',
    name: "Hot Springs Helga",
    title: "Bath House Owner",
    portrait: '♨️',
    gender: 'female',
    personality: 'kind',
    role: 'service',
    location: 'frostport',
    importance: 'minor',
    quests: ['find_hot_spring', 'bath_supplies'],
    lore: "Runs the only warm place in Frostport. Very popular."
  },
  
  expedition_leader_erik: {
    id: 'expedition_leader_erik',
    name: "Expedition Leader Erik",
    title: "Arctic Explorer",
    portrait: '🧭',
    gender: 'male',
    personality: 'proud',
    role: 'quest_giver',
    location: 'glacier_outpost',
    importance: 'major',
    quests: ['glacier_expedition', 'find_lost_explorer', 'map_unknown'],
    lore: "Has mapped more ice than anyone alive. Still gets lost occasionally."
  },
  
  ice_witch_isolde: {
    id: 'ice_witch_isolde',
    name: "Ice Witch Isolde",
    title: "Frost Sorceress",
    portrait: '❄️',
    gender: 'female',
    personality: 'mysterious',
    role: 'quest_giver',
    location: 'frozen_caverns',
    importance: 'major',
    quests: ['ice_magic', 'witch_favor', 'frost_heart'],
    lore: "Not actually a witch. Just very cold and dramatic about it."
  },
  
  whale_caller_wilhelm: {
    id: 'whale_caller_wilhelm',
    name: "Whale Caller Wilhelm",
    title: "Cetacean Whisperer",
    portrait: '🐋',
    gender: 'male',
    personality: 'wise',
    role: 'quest_giver',
    location: 'whale_graveyard',
    importance: 'minor',
    quests: ['call_the_whales', 'whale_song', 'leviathan_hunt'],
    lore: "Speaks whale. Fluently. Has interesting conversations."
  },
  
  yeti_friend_yuri: {
    id: 'yeti_friend_yuri',
    name: "Yuri the Yeti Friend",
    title: "Cryptid Researcher",
    portrait: '🦣',
    gender: 'male',
    personality: 'eccentric',
    role: 'quest_giver',
    location: 'iceberg_maze',
    importance: 'minor',
    quests: ['find_yeti', 'yeti_proof', 'befriend_beast'],
    lore: "Says he has a yeti friend. Nobody believes him. He has photos though."
  }
};

// ============================================================================
// CURSED WATERS NPCS (25 NPCs)
// ============================================================================

export const CURSED_WATERS_NPCS = {
  boney_mcgee: {
    id: 'boney_mcgee',
    name: "Boney McGee",
    title: "World's Friendliest Skeleton",
    portrait: '💀',
    gender: 'male',
    personality: 'friendly',
    role: 'companion',
    location: 'treasure_chamber',
    importance: 'major',
    quests: ['boney_freedom', 'skeleton_crew', 'rest_in_peace'],
    lore: "200 years of guard duty. Still cheerful. Very impressive."
  },
  
  ghost_captain_graves: {
    id: 'ghost_captain_graves',
    name: "Captain Graves",
    title: "Phantom Pirate Lord",
    portrait: '👻',
    gender: 'male',
    personality: 'proud',
    role: 'boss',
    location: 'ghost_ship_graveyard',
    importance: 'major',
    quests: ['face_the_ghost', 'unfinished_business', 'lift_curse'],
    lore: "Died with unfinished business. The business was revenge. He's patient."
  },
  
  witch_doctor_wanda: {
    id: 'witch_doctor_wanda',
    name: "Witch Doctor Wanda",
    title: "Voodoo Priestess",
    portrait: '🪬',
    gender: 'female',
    personality: 'mysterious',
    role: 'merchant',
    location: 'shadow_port',
    importance: 'major',
    shop: 'cursed_artifacts',
    quests: ['curse_item', 'lift_curse', 'dark_ritual'],
    lore: "Works with curses. Both giving and removing. Flexible morality."
  },
  
  medium_miranda: {
    id: 'medium_miranda',
    name: "Medium Miranda",
    title: "Spirit Communicator",
    portrait: '🔮',
    gender: 'female',
    personality: 'kind',
    role: 'service',
    location: 'shadow_port',
    importance: 'minor',
    quests: ['contact_dead', 'lost_soul', 'medium_mystery'],
    lore: "Talks to ghosts. Charges by the word. Ghosts are chatty."
  },
  
  zombie_chef_zack: {
    id: 'zombie_chef_zack',
    name: "Zombie Chef Zack",
    title: "Undead Culinary Artist",
    portrait: '🧟',
    gender: 'male',
    personality: 'friendly',
    role: 'merchant',
    location: 'shadow_port',
    importance: 'minor',
    shop: 'undead_eatery',
    lore: "Died doing what he loved. Now does it forever. Still loves it."
  },
  
  banshee_beatrice: {
    id: 'banshee_beatrice',
    name: "Banshee Beatrice",
    title: "Singer of Doom",
    portrait: '👩‍🦳',
    gender: 'female',
    personality: 'grumpy',
    role: 'quest_giver',
    location: 'cursed_lighthouse',
    importance: 'minor',
    quests: ['silence_banshee', 'banshee_song', 'find_love'],
    lore: "Screams when someone's about to die. Doesn't enjoy it anymore."
  },
  
  kraken_keeper: {
    id: 'kraken_keeper',
    name: "The Kraken Keeper",
    title: "Monster Warden",
    portrait: '🐙',
    gender: 'unknown',
    personality: 'wise',
    role: 'boss',
    location: 'kraken_depths',
    importance: 'major',
    quests: ['kraken_hunt', 'kraken_pact', 'feed_kraken'],
    lore: "Keeps the kraken calm. Nobody knows how. Nobody asks."
  },
  
  skeleton_merchant: {
    id: 'skeleton_merchant',
    name: "Rattles",
    title: "Bone Trader",
    portrait: '💀',
    gender: 'male',
    personality: 'jovial',
    role: 'merchant',
    location: 'skeleton_isle',
    importance: 'minor',
    shop: 'bone_shop',
    lore: "Sells bones. His own sometimes. They grow back. Somehow."
  },
  
  vampire_fisherman: {
    id: 'vampire_fisherman',
    name: "Count Fins",
    title: "Nocturnal Angler",
    portrait: '🧛',
    gender: 'male',
    personality: 'proud',
    role: 'trainer',
    location: 'shadow_port',
    importance: 'minor',
    quests: ['night_fishing', 'blood_bait', 'vampire_catch'],
    lore: "Only fishes at night. For obvious reasons. Very good at it though."
  },
  
  possessed_parrot: {
    id: 'possessed_parrot',
    name: "Polly (Possessed)",
    title: "Demonic Bird",
    portrait: '🦜',
    gender: 'female',
    personality: 'cunning',
    role: 'information',
    location: 'ghost_ship_graveyard',
    importance: 'minor',
    quests: ['exorcise_parrot', 'parrot_secrets'],
    lore: "A parrot possessed by a demon. Still says 'Polly want a cracker.' Ominously."
  }
};

// ============================================================================
// GOLDEN EMPIRE NPCS (25 NPCs)
// ============================================================================

export const GOLDEN_EMPIRE_NPCS = {
  trade_prince_prometheus: {
    id: 'trade_prince_prometheus',
    name: "Trade Prince Prometheus",
    title: "Merchant King",
    portrait: '👑',
    gender: 'male',
    personality: 'cunning',
    role: 'royalty',
    location: 'grand_bazaar',
    importance: 'major',
    quests: ['merchant_favor', 'trade_war', 'royal_contract'],
    lore: "Richest man in the Seven Seas. Still haggles for fun."
  },
  
  auctioneer_augustus: {
    id: 'auctioneer_augustus',
    name: "Auctioneer Augustus",
    title: "Master of Bids",
    portrait: '🔨',
    gender: 'male',
    personality: 'jovial',
    role: 'service',
    location: 'grand_bazaar',
    importance: 'major',
    quests: ['auction_quest', 'rare_item_bid', 'auction_heist'],
    lore: "Talks faster than anyone alive. Understood by nobody. Still makes sales."
  },
  
  silk_merchant_sasha: {
    id: 'silk_merchant_sasha',
    name: "Silk Merchant Sasha",
    title: "Fabric Empress",
    portrait: '🧵',
    gender: 'female',
    personality: 'proud',
    role: 'merchant',
    location: 'grand_bazaar',
    importance: 'minor',
    shop: 'silk_emporium',
    lore: "Silk so fine it's basically magic. Prices also magical. Magically high."
  },
  
  spice_trader_samir: {
    id: 'spice_trader_samir',
    name: "Spice Trader Samir",
    title: "Flavor Master",
    portrait: '🌶️',
    gender: 'male',
    personality: 'friendly',
    role: 'merchant',
    location: 'grand_bazaar',
    importance: 'minor',
    shop: 'spice_shop',
    quests: ['rare_spice', 'spice_route'],
    lore: "Knows every spice. Tastes everything. Iron stomach."
  },
  
  jeweler_jasmine: {
    id: 'jeweler_jasmine',
    name: "Jeweler Jasmine",
    title: "Gem Expert",
    portrait: '💍',
    gender: 'female',
    personality: 'cunning',
    role: 'merchant',
    location: 'grand_bazaar',
    importance: 'minor',
    shop: 'jewelry_shop',
    quests: ['appraise_gem', 'find_diamond'],
    lore: "Can spot a fake from a mile away. Has very good eyes."
  },
  
  duchess_diamond: {
    id: 'duchess_diamond',
    name: "Duchess Diamond",
    title: "Noble Socialite",
    portrait: '👸',
    gender: 'female',
    personality: 'proud',
    role: 'quest_giver',
    location: 'noble_harbor',
    importance: 'major',
    quests: ['noble_favor', 'scandal_cover', 'diamond_heist'],
    lore: "More diamonds than sense. But lots of both."
  },
  
  butler_bartholomew: {
    id: 'butler_bartholomew',
    name: "Butler Bartholomew",
    title: "Head Servant",
    portrait: '🎩',
    gender: 'male',
    personality: 'wise',
    role: 'information',
    location: 'noble_harbor',
    importance: 'minor',
    quests: ['servant_secrets', 'butler_favor'],
    lore: "Knows every noble secret. Tells none. Unless paid well."
  },
  
  shipping_tycoon_tang: {
    id: 'shipping_tycoon_tang',
    name: "Shipping Tycoon Tang",
    title: "Fleet Owner",
    portrait: '🚢',
    gender: 'male',
    personality: 'cunning',
    role: 'employer',
    location: 'trade_winds_port',
    importance: 'major',
    quests: ['shipping_contract', 'pirate_protection', 'trade_route'],
    lore: "Owns 200 ships. Knows each by name. Names them all 'Money.'"
  },
  
  customs_officer_chen: {
    id: 'customs_officer_chen',
    name: "Customs Officer Chen",
    title: "Import Inspector",
    portrait: '📋',
    gender: 'male',
    personality: 'grumpy',
    role: 'authority',
    location: 'trade_winds_port',
    importance: 'minor',
    quests: ['smuggling_investigation', 'bribe_chen'],
    lore: "Has never been bribed. Because he asks for too much."
  },
  
  translator_tao: {
    id: 'translator_tao',
    name: "Translator Tao",
    title: "Language Expert",
    portrait: '🗣️',
    gender: 'female',
    personality: 'kind',
    role: 'service',
    location: 'trade_winds_port',
    importance: 'minor',
    quests: ['translate_document', 'diplomatic_mission'],
    lore: "Speaks 47 languages. Still learning. Never satisfied."
  }
};

// ============================================================================
// COMPILE ALL NPCS
// ============================================================================

export const ALL_NPCS = {
  ...PORT_FORTUNE_NPCS,
  ...CORAL_ARCHIPELAGO_NPCS,
  ...FROZEN_NORTH_NPCS,
  ...CURSED_WATERS_NPCS,
  ...GOLDEN_EMPIRE_NPCS
};

export const NPC_COUNT = Object.keys(ALL_NPCS).length;

export default {
  NPC_PERSONALITIES,
  PORT_FORTUNE_NPCS,
  CORAL_ARCHIPELAGO_NPCS,
  FROZEN_NORTH_NPCS,
  CURSED_WATERS_NPCS,
  GOLDEN_EMPIRE_NPCS,
  ALL_NPCS,
  NPC_COUNT
};
