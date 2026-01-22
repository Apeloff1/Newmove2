/**
 * ============================================================================
 * OPEN WORLD ASSETS EXTENDED - Additional 1500+ Lines
 * ============================================================================
 * Extended world building content including fishing spots, loot tables,
 * crafting recipes, achievements, and more world detail
 * ============================================================================
 */

// ============================================================================
// SECTION 1: DETAILED FISHING SPOTS
// ============================================================================

export const FISHING_SPOTS = {
  // Barnacle Bay fishing spots
  barnacle_bay: {
    wobbly_pier_end: {
      id: 'wobbly_pier_end',
      name: 'End of Wobbly Pier',
      icon: '🎣',
      description: 'A classic spot for beginners, the pier creaks ominously',
      difficulty: 'easy',
      depth: 'shallow',
      fishTypes: ['minnow', 'perch', 'small_bass', 'sunfish', 'catfish'],
      rareFish: ['golden_perch'],
      legendaryFish: null,
      bestTime: { start: 6, end: 10 },
      bestWeather: 'clear',
      bestSeason: 'summer',
      catchRates: { common: 0.7, uncommon: 0.25, rare: 0.04, epic: 0.01 },
      hazards: ['slippery_boards', 'seagull_theft'],
      ambience: ['pier_creaking', 'seagulls', 'gentle_waves'],
      requirements: null,
    },
    rocky_outcrop: {
      id: 'rocky_outcrop',
      name: 'Rocky Outcrop',
      icon: '🪨',
      description: 'Slippery rocks but great for catching bass',
      difficulty: 'medium',
      depth: 'medium',
      fishTypes: ['bass', 'pike', 'trout', 'carp'],
      rareFish: ['striped_bass', 'lake_trout'],
      legendaryFish: 'stone_guardian',
      bestTime: { start: 16, end: 20 },
      bestWeather: 'cloudy',
      bestSeason: 'autumn',
      catchRates: { common: 0.5, uncommon: 0.35, rare: 0.12, epic: 0.03 },
      hazards: ['slippery_rocks', 'strong_currents'],
      ambience: ['waves_crashing', 'wind'],
      requirements: { level: 5 },
    },
    hidden_cove: {
      id: 'hidden_cove',
      name: 'Hidden Cove',
      icon: '🏝️',
      description: 'A secret spot known only to locals',
      difficulty: 'medium',
      depth: 'medium',
      fishTypes: ['flounder', 'sea_bass', 'snapper', 'grouper'],
      rareFish: ['golden_snapper', 'crystal_bass'],
      legendaryFish: 'cove_spirit',
      bestTime: { start: 4, end: 7 },
      bestWeather: 'foggy',
      bestSeason: 'spring',
      catchRates: { common: 0.4, uncommon: 0.4, rare: 0.15, epic: 0.05 },
      hazards: ['hidden_rocks', 'tide_changes'],
      ambience: ['birds', 'lapping_water', 'mysterious_hum'],
      requirements: { quest: 'find_hidden_cove' },
    },
    lighthouse_reef: {
      id: 'lighthouse_reef',
      name: 'Lighthouse Reef',
      icon: '🗼',
      description: 'The reef near the lighthouse attracts exotic fish',
      difficulty: 'hard',
      depth: 'deep',
      fishTypes: ['reef_fish', 'parrotfish', 'angelfish', 'barracuda'],
      rareFish: ['neon_reef_fish', 'ancient_parrotfish'],
      legendaryFish: 'lighthouse_guardian',
      bestTime: { start: 22, end: 2 },
      bestWeather: 'clear',
      bestSeason: 'summer',
      catchRates: { common: 0.3, uncommon: 0.4, rare: 0.2, epic: 0.1 },
      hazards: ['sharp_coral', 'strong_currents', 'predators'],
      ambience: ['lighthouse_horn', 'night_waves', 'distant_bells'],
      requirements: { level: 15, item: 'reef_rod' },
    },
  },
  
  // Skull Island fishing spots
  skull_island: {
    beach_of_broken_dreams: {
      id: 'beach_of_broken_dreams',
      name: 'Beach of Broken Dreams',
      icon: '💀',
      description: 'Shipwreck debris attracts unusual fish',
      difficulty: 'hard',
      depth: 'varied',
      fishTypes: ['wreck_fish', 'ghost_fish', 'cursed_cod', 'phantom_perch'],
      rareFish: ['spirit_salmon', 'ethereal_eel'],
      legendaryFish: 'dream_eater',
      bestTime: { start: 0, end: 4 },
      bestWeather: 'storm',
      bestSeason: 'autumn',
      catchRates: { common: 0.2, uncommon: 0.4, rare: 0.3, epic: 0.1 },
      hazards: ['cursed_catches', 'ghost_encounters', 'sudden_fog'],
      ambience: ['eerie_whispers', 'distant_thunder', 'chains_rattling'],
      requirements: { level: 20, quest: 'unlock_skull_island' },
    },
    probably_magical_lagoon: {
      id: 'probably_magical_lagoon',
      name: 'The Probably Magical Lagoon',
      icon: '✨',
      description: 'A lagoon that definitely has something magical going on',
      difficulty: 'expert',
      depth: 'unknown',
      fishTypes: ['glowfish', 'starfish_prime', 'moonray', 'aurora_salmon'],
      rareFish: ['wish_fish', 'fate_flounder'],
      legendaryFish: 'mermaid_kiss',
      bestTime: { start: 21, end: 23 },
      bestWeather: 'rainbow',
      bestSeason: 'any_full_moon',
      catchRates: { common: 0.1, uncommon: 0.3, rare: 0.4, epic: 0.2 },
      hazards: ['magical_mishaps', 'reality_warps', 'enchantment'],
      ambience: ['magical_hum', 'tinkling_bells', 'mermaid_song'],
      requirements: { level: 30, item: 'mermaid_scale', quest: 'mermaids_blessing' },
    },
    skull_eye_socket: {
      id: 'skull_eye_socket',
      name: 'Skull Eye Socket',
      icon: '👁️',
      description: 'Fish in the literal eye socket of Skull Island',
      difficulty: 'extreme',
      depth: 'bottomless',
      fishTypes: ['abyss_dweller', 'void_fish', 'nightmare_eel', 'terror_trout'],
      rareFish: ['one_eyed_horror', 'skull_spirit'],
      legendaryFish: 'eye_of_the_island',
      bestTime: { start: 3, end: 4 },
      bestWeather: 'storm',
      bestSeason: 'winter',
      catchRates: { common: 0.05, uncommon: 0.2, rare: 0.45, epic: 0.3 },
      hazards: ['extreme_depth', 'sanity_drain', 'tentacles'],
      ambience: ['heartbeat', 'whispering_voices', 'bone_grinding'],
      requirements: { level: 40, item: 'void_rod', quest: 'face_the_depths' },
    },
  },
  
  // Rainbow Reef fishing spots
  coral_reef: {
    shallow_gardens: {
      id: 'shallow_gardens',
      name: 'Shallow Coral Gardens',
      icon: '🪸',
      description: 'Beautiful shallow waters teeming with colorful fish',
      difficulty: 'easy',
      depth: 'shallow',
      fishTypes: ['clownfish', 'blue_tang', 'butterfly_fish', 'damselfish'],
      rareFish: ['emperor_angelfish', 'rainbow_wrasse'],
      legendaryFish: 'coral_king',
      bestTime: { start: 10, end: 14 },
      bestWeather: 'clear',
      bestSeason: 'summer',
      catchRates: { common: 0.6, uncommon: 0.3, rare: 0.08, epic: 0.02 },
      hazards: ['coral_cuts', 'jellyfish'],
      ambience: ['bubbles', 'fish_schools', 'gentle_current'],
      requirements: { item: 'snorkel' },
    },
    abyss_edge: {
      id: 'abyss_edge',
      name: 'The Abyss Edge',
      icon: '🕳️',
      description: 'Where the reef drops into endless darkness',
      difficulty: 'extreme',
      depth: 'abyssal',
      fishTypes: ['anglerfish', 'gulper_eel', 'viperfish', 'fangtooth'],
      rareFish: ['bioluminescent_shark', 'abyss_leviathan_spawn'],
      legendaryFish: 'the_ancient_one',
      bestTime: { start: 0, end: 24 },
      bestWeather: 'any',
      bestSeason: 'winter',
      catchRates: { common: 0.1, uncommon: 0.2, rare: 0.4, epic: 0.3 },
      hazards: ['pressure', 'darkness', 'ancient_horrors'],
      ambience: ['silence', 'distant_roars', 'bioluminescence'],
      requirements: { level: 50, item: 'abyssal_suit', quest: 'champion_of_deep' },
    },
  },
};

// ============================================================================
// SECTION 2: COMPLETE LOOT TABLES
// ============================================================================

export const LOOT_TABLES = {
  // Fishing loot
  fishing: {
    common_catch: {
      fish: { weight: 80, items: ['random_common_fish'] },
      junk: { weight: 15, items: ['old_boot', 'seaweed', 'rusty_can', 'driftwood'] },
      treasure: { weight: 5, items: ['coin_purse', 'small_gem', 'old_ring'] },
    },
    uncommon_catch: {
      fish: { weight: 70, items: ['random_uncommon_fish'] },
      junk: { weight: 10, items: ['waterlogged_book', 'broken_compass'] },
      treasure: { weight: 15, items: ['silver_locket', 'gem_cluster', 'antique_watch'] },
      special: { weight: 5, items: ['message_bottle', 'small_treasure_map'] },
    },
    rare_catch: {
      fish: { weight: 60, items: ['random_rare_fish'] },
      treasure: { weight: 25, items: ['gold_chain', 'jeweled_ring', 'ancient_coin'] },
      special: { weight: 10, items: ['enchanted_lure', 'rare_bait'] },
      legendary: { weight: 5, items: ['legendary_bait', 'treasure_map'] },
    },
  },
  
  // Treasure chest loot
  treasure_chests: {
    common_chest: {
      gold: { min: 10, max: 50 },
      guaranteed: ['random_common_item'],
      bonus_rolls: 2,
      bonus_pool: ['fishing_supplies', 'food', 'basic_gear', 'bait'],
    },
    uncommon_chest: {
      gold: { min: 50, max: 200 },
      guaranteed: ['random_uncommon_item', 'treasure_map_fragment'],
      bonus_rolls: 3,
      bonus_pool: ['better_gear', 'rare_bait', 'gem', 'artifact_fragment'],
    },
    rare_chest: {
      gold: { min: 200, max: 500 },
      guaranteed: ['random_rare_item', 'skill_book'],
      bonus_rolls: 4,
      bonus_pool: ['epic_bait', 'rare_gem', 'ancient_artifact', 'upgrade_material'],
    },
    epic_chest: {
      gold: { min: 500, max: 2000 },
      guaranteed: ['random_epic_item', 'legendary_map_piece'],
      bonus_rolls: 5,
      bonus_pool: ['legendary_bait', 'perfect_gem', 'mythic_fragment', 'special_rod'],
    },
    legendary_chest: {
      gold: { min: 2000, max: 10000 },
      guaranteed: ['legendary_item', 'unique_artifact'],
      bonus_rolls: 6,
      bonus_pool: ['legendary_materials', 'mythic_items', 'one_of_a_kind'],
    },
  },
  
  // Enemy drops
  enemy_drops: {
    ghost_pirate: {
      always: ['ectoplasm'],
      common: ['ghostly_doubloon', 'tattered_bandana', 'spectral_rope'],
      rare: ['ghost_cutlass', 'phantom_compass', 'spirit_bottle'],
      epic: ['ghost_captain_hat', 'ethereal_anchor'],
    },
    sea_monster: {
      always: ['monster_scale'],
      common: ['sharp_tooth', 'tentacle_piece', 'monster_ink'],
      rare: ['kraken_beak', 'leviathan_fin', 'monster_heart'],
      epic: ['monster_soul_gem', 'ancient_sea_artifact'],
    },
    poacher: {
      always: ['confiscated_goods'],
      common: ['stolen_fish', 'illegal_nets', 'counterfeit_license'],
      rare: ['poacher_maps', 'black_market_contacts', 'rare_contraband'],
      epic: ['poacher_boss_journal', 'hidden_warehouse_key'],
    },
  },
  
  // Daily rewards
  daily_rewards: {
    day_1: { gold: 50, items: ['daily_bait_pack'] },
    day_2: { gold: 75, items: ['daily_bait_pack', 'common_lure'] },
    day_3: { gold: 100, items: ['premium_bait_pack'] },
    day_4: { gold: 125, items: ['premium_bait_pack', 'uncommon_lure'] },
    day_5: { gold: 150, items: ['rare_bait_pack'] },
    day_6: { gold: 200, items: ['rare_bait_pack', 'rare_lure'] },
    day_7: { gold: 500, items: ['legendary_bait_pack', 'weekly_bonus_chest'] },
  },
};

// ============================================================================
// SECTION 3: CRAFTING RECIPES
// ============================================================================

export const CRAFTING_RECIPES = {
  // Fishing gear
  fishing_gear: {
    basic_lure: {
      id: 'basic_lure',
      name: 'Basic Lure',
      description: 'A simple but effective lure',
      materials: [{ item: 'wood', count: 2 }, { item: 'string', count: 1 }],
      craftTime: 30,
      skill: 'crafting',
      skillLevel: 1,
      output: { item: 'basic_lure', count: 1 },
    },
    feather_lure: {
      id: 'feather_lure',
      name: 'Feather Lure',
      description: 'Attracts fish with its realistic movement',
      materials: [{ item: 'wood', count: 2 }, { item: 'feather', count: 3 }, { item: 'string', count: 1 }],
      craftTime: 60,
      skill: 'crafting',
      skillLevel: 5,
      output: { item: 'feather_lure', count: 1 },
    },
    glow_lure: {
      id: 'glow_lure',
      name: 'Glowing Lure',
      description: 'Attracts nocturnal fish',
      materials: [{ item: 'bioluminescent_algae', count: 5 }, { item: 'glass_vial', count: 1 }, { item: 'silver_wire', count: 2 }],
      craftTime: 120,
      skill: 'crafting',
      skillLevel: 15,
      output: { item: 'glow_lure', count: 1 },
    },
    legendary_lure: {
      id: 'legendary_lure',
      name: 'Legendary Lure',
      description: 'The ultimate fishing lure',
      materials: [{ item: 'mermaid_scale', count: 1 }, { item: 'golden_thread', count: 3 }, { item: 'enchanted_gem', count: 1 }, { item: 'ancient_metal', count: 2 }],
      craftTime: 300,
      skill: 'crafting',
      skillLevel: 40,
      output: { item: 'legendary_lure', count: 1 },
    },
  },
  
  // Bait crafting
  bait: {
    worm_bait: {
      id: 'worm_bait',
      name: 'Worm Bait',
      materials: [{ item: 'worms', count: 5 }, { item: 'dirt', count: 1 }],
      craftTime: 10,
      output: { item: 'worm_bait', count: 10 },
    },
    fish_bait: {
      id: 'fish_bait',
      name: 'Fish Chunk Bait',
      materials: [{ item: 'common_fish', count: 1 }],
      craftTime: 15,
      output: { item: 'fish_bait', count: 5 },
    },
    premium_bait: {
      id: 'premium_bait',
      name: 'Premium Bait',
      materials: [{ item: 'rare_worms', count: 3 }, { item: 'fish_oil', count: 1 }, { item: 'secret_ingredient', count: 1 }],
      craftTime: 60,
      skill: 'crafting',
      skillLevel: 10,
      output: { item: 'premium_bait', count: 10 },
    },
    magical_bait: {
      id: 'magical_bait',
      name: 'Magical Bait',
      materials: [{ item: 'moonfish_essence', count: 1 }, { item: 'fairy_dust', count: 3 }, { item: 'enchanted_worm', count: 5 }],
      craftTime: 180,
      skill: 'crafting',
      skillLevel: 30,
      output: { item: 'magical_bait', count: 5 },
    },
  },
  
  // Cooking recipes
  cooking: {
    grilled_fish: {
      id: 'grilled_fish',
      name: 'Grilled Fish',
      materials: [{ item: 'any_fish', count: 1 }, { item: 'salt', count: 1 }],
      craftTime: 30,
      skill: 'cooking',
      skillLevel: 1,
      output: { item: 'grilled_fish', count: 1 },
      effects: { hunger: 20, energy: 10 },
    },
    fish_stew: {
      id: 'fish_stew',
      name: 'Fish Stew',
      materials: [{ item: 'any_fish', count: 2 }, { item: 'potato', count: 2 }, { item: 'onion', count: 1 }, { item: 'spices', count: 1 }],
      craftTime: 120,
      skill: 'cooking',
      skillLevel: 10,
      output: { item: 'fish_stew', count: 1 },
      effects: { hunger: 50, energy: 30, warmth: 20 },
    },
    seafood_feast: {
      id: 'seafood_feast',
      name: 'Seafood Feast',
      materials: [{ item: 'rare_fish', count: 2 }, { item: 'lobster', count: 1 }, { item: 'crab', count: 1 }, { item: 'exotic_spices', count: 2 }],
      craftTime: 300,
      skill: 'cooking',
      skillLevel: 25,
      output: { item: 'seafood_feast', count: 1 },
      effects: { hunger: 100, energy: 50, luck: 10, duration: 3600 },
    },
    legendary_sushi: {
      id: 'legendary_sushi',
      name: 'Legendary Sushi Platter',
      materials: [{ item: 'legendary_fish', count: 1 }, { item: 'perfect_rice', count: 2 }, { item: 'wasabi', count: 1 }, { item: 'nori', count: 3 }],
      craftTime: 600,
      skill: 'cooking',
      skillLevel: 40,
      output: { item: 'legendary_sushi', count: 1 },
      effects: { all_stats: 20, fishing_luck: 25, duration: 7200 },
    },
  },
  
  // Boat upgrades
  boat_upgrades: {
    reinforced_hull: {
      id: 'reinforced_hull',
      name: 'Reinforced Hull',
      materials: [{ item: 'hardwood', count: 20 }, { item: 'iron_plates', count: 10 }, { item: 'waterproof_sealant', count: 5 }],
      craftTime: 3600,
      skill: 'boatcraft',
      skillLevel: 15,
      effect: { durability: '+50%' },
    },
    improved_sails: {
      id: 'improved_sails',
      name: 'Improved Sails',
      materials: [{ item: 'fine_cloth', count: 15 }, { item: 'rope', count: 10 }, { item: 'sail_rings', count: 8 }],
      craftTime: 2400,
      skill: 'boatcraft',
      skillLevel: 10,
      effect: { speed: '+25%' },
    },
    fish_finder: {
      id: 'fish_finder',
      name: 'Fish Finder Device',
      materials: [{ item: 'crystal_lens', count: 2 }, { item: 'copper_wire', count: 10 }, { item: 'resonance_stone', count: 1 }],
      craftTime: 1800,
      skill: 'boatcraft',
      skillLevel: 20,
      effect: { fish_detection: true },
    },
    cargo_expansion: {
      id: 'cargo_expansion',
      name: 'Cargo Hold Expansion',
      materials: [{ item: 'hardwood', count: 30 }, { item: 'iron_hinges', count: 6 }, { item: 'preservation_runes', count: 2 }],
      craftTime: 4800,
      skill: 'boatcraft',
      skillLevel: 25,
      effect: { storage: '+100%' },
    },
  },
};

// ============================================================================
// SECTION 4: ACHIEVEMENT SYSTEM
// ============================================================================

export const ACHIEVEMENTS = {
  // Fishing achievements
  fishing: {
    first_catch: {
      id: 'first_catch',
      name: 'First Catch',
      description: 'Catch your first fish',
      icon: '🐟',
      requirement: { fish_caught: 1 },
      rewards: { xp: 10, title: 'Novice Angler' },
      hidden: false,
    },
    century_fisher: {
      id: 'century_fisher',
      name: 'Century Fisher',
      description: 'Catch 100 fish',
      icon: '🎣',
      requirement: { fish_caught: 100 },
      rewards: { xp: 500, gold: 200, item: 'silver_fishing_badge' },
      hidden: false,
    },
    master_angler: {
      id: 'master_angler',
      name: 'Master Angler',
      description: 'Catch 1000 fish',
      icon: '🏆',
      requirement: { fish_caught: 1000 },
      rewards: { xp: 2000, gold: 1000, item: 'gold_fishing_badge', title: 'Master Angler' },
      hidden: false,
    },
    legendary_catch: {
      id: 'legendary_catch',
      name: 'Legendary Catch',
      description: 'Catch a legendary fish',
      icon: '⭐',
      requirement: { legendary_fish_caught: 1 },
      rewards: { xp: 1000, gold: 500, item: 'legendary_trophy' },
      hidden: false,
    },
    catch_them_all: {
      id: 'catch_them_all',
      name: 'Catch \'Em All',
      description: 'Catch every species of fish',
      icon: '📚',
      requirement: { unique_species: 'all' },
      rewards: { xp: 5000, gold: 5000, item: 'complete_fish_encyclopedia', title: 'Fish Master' },
      hidden: false,
    },
    night_owl: {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Catch 50 fish at night',
      icon: '🌙',
      requirement: { night_catches: 50 },
      rewards: { xp: 300, item: 'night_vision_lure' },
      hidden: false,
    },
    storm_chaser: {
      id: 'storm_chaser',
      name: 'Storm Chaser',
      description: 'Catch 25 fish during storms',
      icon: '⛈️',
      requirement: { storm_catches: 25 },
      rewards: { xp: 500, item: 'storm_proof_rod' },
      hidden: false,
    },
    perfect_streak: {
      id: 'perfect_streak',
      name: 'Perfect Streak',
      description: 'Get 10 perfect catches in a row',
      icon: '💯',
      requirement: { perfect_streak: 10 },
      rewards: { xp: 400, item: 'precision_lure' },
      hidden: false,
    },
  },
  
  // Exploration achievements
  exploration: {
    first_steps: {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Explore your first area',
      icon: '👣',
      requirement: { areas_explored: 1 },
      rewards: { xp: 25 },
      hidden: false,
    },
    world_traveler: {
      id: 'world_traveler',
      name: 'World Traveler',
      description: 'Visit all major locations',
      icon: '🗺️',
      requirement: { locations_visited: 'all_major' },
      rewards: { xp: 1000, item: 'world_map' },
      hidden: false,
    },
    secret_finder: {
      id: 'secret_finder',
      name: 'Secret Finder',
      description: 'Find 10 hidden areas',
      icon: '🔍',
      requirement: { secrets_found: 10 },
      rewards: { xp: 500, item: 'secret_detector' },
      hidden: false,
    },
    deep_diver: {
      id: 'deep_diver',
      name: 'Deep Diver',
      description: 'Reach the deepest point of the ocean',
      icon: '🤿',
      requirement: { deepest_dive: 'max' },
      rewards: { xp: 1000, title: 'Abyssal Explorer' },
      hidden: false,
    },
    lighthouse_climber: {
      id: 'lighthouse_climber',
      name: 'Lighthouse Climber',
      description: 'Climb to the top of every lighthouse',
      icon: '🗼',
      requirement: { lighthouses_climbed: 'all' },
      rewards: { xp: 300, item: 'lighthouse_miniature' },
      hidden: false,
    },
  },
  
  // Social achievements
  social: {
    making_friends: {
      id: 'making_friends',
      name: 'Making Friends',
      description: 'Befriend 5 NPCs',
      icon: '🤝',
      requirement: { friends: 5 },
      rewards: { xp: 200, item: 'friendship_bracelet' },
      hidden: false,
    },
    social_butterfly: {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Befriend 25 NPCs',
      icon: '🦋',
      requirement: { friends: 25 },
      rewards: { xp: 1000, title: 'Beloved Citizen' },
      hidden: false,
    },
    best_friends: {
      id: 'best_friends',
      name: 'Best Friends',
      description: 'Reach max friendship with someone',
      icon: '💕',
      requirement: { max_friendship: 1 },
      rewards: { xp: 500, item: 'best_friend_photo' },
      hidden: false,
    },
    tavern_regular: {
      id: 'tavern_regular',
      name: 'Tavern Regular',
      description: 'Visit the tavern 50 times',
      icon: '🍺',
      requirement: { tavern_visits: 50 },
      rewards: { xp: 200, item: 'personal_mug', perk: 'tavern_discount' },
      hidden: false,
    },
    matchmaker: {
      id: 'matchmaker',
      name: 'Matchmaker',
      description: 'Help 3 couples get together',
      icon: '💘',
      requirement: { couples_matched: 3 },
      rewards: { xp: 400, title: 'Cupid of the Cove' },
      hidden: false,
    },
  },
  
  // Hidden achievements
  hidden: {
    rubber_ducky: {
      id: 'rubber_ducky',
      name: 'Rubber Ducky',
      description: 'Find the legendary rubber ducky',
      icon: '🦆',
      requirement: { item_found: 'rubber_ducky' },
      rewards: { xp: 100, item: 'rubber_ducky_trophy' },
      hidden: true,
    },
    fish_whisperer: {
      id: 'fish_whisperer',
      name: 'Fish Whisperer',
      description: 'Have a fish voluntarily jump into your boat',
      icon: '🐠',
      requirement: { special_event: 'fish_volunteer' },
      rewards: { xp: 250, title: 'Fish Whisperer' },
      hidden: true,
    },
    cat_burglar: {
      id: 'cat_burglar',
      name: 'Cat Burglar',
      description: 'Have a cat steal your fish 10 times',
      icon: '🐱',
      requirement: { cat_thefts: 10 },
      rewards: { xp: 50, item: 'cat_treat' },
      hidden: true,
    },
    seagull_nemesis: {
      id: 'seagull_nemesis',
      name: 'Seagull Nemesis',
      description: 'Have seagulls steal from you 25 times',
      icon: '🐦',
      requirement: { seagull_thefts: 25 },
      rewards: { xp: 100, item: 'anti_seagull_hat' },
      hidden: true,
    },
    ghost_encounter: {
      id: 'ghost_encounter',
      name: 'Ghost Encounter',
      description: 'Meet a ghost',
      icon: '👻',
      requirement: { ghost_met: 1 },
      rewards: { xp: 200, item: 'ghost_photo' },
      hidden: true,
    },
    mermaid_sighting: {
      id: 'mermaid_sighting',
      name: 'Mermaid Sighting',
      description: 'Spot a mermaid',
      icon: '🧜‍♀️',
      requirement: { mermaid_spotted: 1 },
      rewards: { xp: 500, item: 'mermaid_comb' },
      hidden: true,
    },
    whale_song: {
      id: 'whale_song',
      name: 'Whale Song',
      description: 'Witness a whale breach',
      icon: '🐋',
      requirement: { whale_breach_witnessed: 1 },
      rewards: { xp: 300, item: 'whale_bone_flute' },
      hidden: true,
    },
  },
};

// ============================================================================
// SECTION 5: DIALOGUE SYSTEM DATA
// ============================================================================

export const DIALOGUE_DATA = {
  // Greeting variations by NPC type
  greetings: {
    fisherman: [
      'Ahoy there! The fish are biting today!',
      'Another beautiful day on the water, eh?',
      'Caught anything good lately?',
      'The sea provides, friend. The sea provides.',
      'Watch out for the big ones - they bite back!',
    ],
    merchant: [
      'Welcome, welcome! Best prices in the cove!',
      'Looking to buy or sell? Either way, youre in the right place!',
      'Ah, a customer with taste, I can tell!',
      'Step right up! Fresh goods, fair prices!',
      'My friend! Have I got a deal for you!',
    ],
    tavern_keeper: [
      'What\'ll it be, friend?',
      'Pull up a chair, you look like you need a drink.',
      'Rough day on the seas? Let me fix that.',
      'Welcome to the Tipsy Tentacle! What can I get ya?',
      'Ah, a familiar face! The usual?',
    ],
    guard: [
      'Citizen. Stay out of trouble.',
      'Move along. Nothing to see here.',
      'Keep your nose clean and we won\'t have problems.',
      'The Governor keeps this town safe. Remember that.',
      'Any trouble, you come find me.',
    ],
    noble: [
      'Ah, one of the common folk. How... quaint.',
      'Do you have business with me, or are you lost?',
      'I suppose I can spare a moment.',
      'Try not to touch anything.',
      'You may approach. Briefly.',
    ],
    child: [
      'Hi! Wanna play?',
      'Are you a pirate?! You look like a pirate!',
      'I caught a fish THIS big once!',
      'My dad says I\'m gonna be the best fisher ever!',
      'Do you have any candy?',
    ],
  },
  
  // Contextual dialogue
  contextual: {
    weather: {
      storm: [
        'Nasty weather, isnt it?',
        'Best to stay indoors in weather like this.',
        'The old lighthouse will guide the ships home.',
        'Reminds me of the great storm of \'87...',
      ],
      rain: [
        'A little rain never hurt anyone.',
        'Good for the crops, at least.',
        'Fish love the rain, you know.',
        'Brings out the worms for bait!',
      ],
      clear: [
        'Beautiful day, isnt it?',
        'Perfect weather for fishing!',
        'Not a cloud in the sky!',
        'The sea is calm today.',
      ],
      foggy: [
        'Can barely see your hand in front of your face.',
        'The ghost ship likes to sail on foggy nights...',
        'Be careful out there.',
        'Fog like this hides all sorts of things.',
      ],
    },
    time: {
      morning: [
        'Early bird gets the fish!',
        'Nothing like a sunrise over the water.',
        'Morning! Ready for another day?',
        'The market will be opening soon.',
      ],
      afternoon: [
        'Hot one today.',
        'Afternoon catch is always good.',
        'The day is flying by!',
        'Time for a lunch break, I think.',
      ],
      evening: [
        'The tavern will be lively tonight.',
        'Sunset fishing is my favorite.',
        'Another day done.',
        'Time to head home soon.',
      ],
      night: [
        'Careful out there after dark.',
        'The night fish are something else.',
        'Cant sleep either, huh?',
        'Quiet night, isnt it?',
      ],
    },
    relationship: {
      stranger: [
        'Dont think weve met. Im [NAME].',
        'New around here?',
        'Youre not from around here, are you?',
      ],
      acquaintance: [
        'Ah, I remember you.',
        'Good to see you again.',
        'How goes it?',
      ],
      friend: [
        'My friend! How have you been?',
        'Always good to see you!',
        'Pull up a seat, lets chat!',
      ],
      close_friend: [
        'There you are! I was just thinking about you!',
        'My dear friend! Come, sit with me!',
        'Youre a sight for sore eyes!',
      ],
    },
  },
  
  // Quest-related dialogue
  quest: {
    available: [
      'Say, could you help me with something?',
      'Youre capable. I have a job for someone like you.',
      'If youve got time, Ive got gold.',
      'I could use a hand with something.',
    ],
    in_progress: [
      'Hows that task coming along?',
      'Any progress on what I asked?',
      'Still working on it, I hope?',
      'Remember what you promised me.',
    ],
    complete: [
      'You did it! Wonderful!',
      'I knew I could count on you!',
      'Excellent work! Heres your reward.',
      'Better than I expected! Well done!',
    ],
    failed: [
      'I... see. Disappointing.',
      'Perhaps I expected too much.',
      'Well, you tried, I suppose.',
      'Maybe next time.',
    ],
  },
};

// ============================================================================
// SECTION 6: MINIGAME CONFIGURATIONS
// ============================================================================

export const MINIGAMES = {
  fishing_minigame: {
    difficulty_levels: {
      easy: { bar_speed: 1.0, fish_speed: 0.8, catch_zone: 0.3, time_limit: 30 },
      medium: { bar_speed: 1.3, fish_speed: 1.2, catch_zone: 0.25, time_limit: 25 },
      hard: { bar_speed: 1.6, fish_speed: 1.5, catch_zone: 0.2, time_limit: 20 },
      expert: { bar_speed: 2.0, fish_speed: 2.0, catch_zone: 0.15, time_limit: 15 },
      legendary: { bar_speed: 2.5, fish_speed: 2.5, catch_zone: 0.1, time_limit: 12 },
    },
    fish_behaviors: {
      lazy: { movement: 'slow_drift', direction_change: 0.1 },
      normal: { movement: 'steady', direction_change: 0.3 },
      active: { movement: 'bouncy', direction_change: 0.5 },
      erratic: { movement: 'random', direction_change: 0.8 },
      legendary: { movement: 'teleport', direction_change: 1.0 },
    },
    bonuses: {
      perfect_catch: { xp_multiplier: 2.0, gold_bonus: 50 },
      quick_catch: { xp_multiplier: 1.5, time_bonus: true },
      combo_catch: { xp_multiplier: 1.25, per_combo: true },
    },
  },
  
  tavern_games: {
    dice: {
      name: 'Liars Dice',
      min_bet: 10,
      max_bet: 1000,
      rules: 'Bluff your way to victory',
      difficulty: ['easy', 'medium', 'hard'],
    },
    cards: {
      name: 'Pirate Poker',
      min_bet: 25,
      max_bet: 2500,
      rules: 'Standard poker with a pirate twist',
      difficulty: ['easy', 'medium', 'hard', 'tournament'],
    },
    arm_wrestling: {
      name: 'Arm Wrestling',
      min_bet: 5,
      max_bet: 500,
      rules: 'Mash buttons to win',
      requires: { strength: 'any' },
    },
    darts: {
      name: 'Darts',
      min_bet: 10,
      max_bet: 200,
      rules: 'Hit the bullseye',
      skill_based: true,
    },
  },
  
  competitions: {
    fishing_tournament: {
      name: 'Fishing Tournament',
      entry_fee: 100,
      prize_pool: { first: 1000, second: 500, third: 250 },
      duration: 3600,
      scoring: 'weight_based',
      frequency: 'weekly',
    },
    cooking_contest: {
      name: 'Cooking Contest',
      entry_fee: 50,
      prize_pool: { first: 500, second: 250, third: 100 },
      duration: 1800,
      scoring: 'judge_based',
      frequency: 'monthly',
    },
    boat_race: {
      name: 'Boat Race',
      entry_fee: 200,
      prize_pool: { first: 2000, second: 1000, third: 500 },
      duration: 600,
      scoring: 'time_based',
      frequency: 'seasonal',
    },
  },
};

// ============================================================================
// SECTION 7: SKILL TREES
// ============================================================================

export const SKILL_TREES = {
  fishing: {
    name: 'Fishing Mastery',
    icon: '🎣',
    skills: {
      basic_casting: { name: 'Basic Casting', level: 1, effect: 'Can cast fishing line', cost: 0 },
      improved_casting: { name: 'Improved Casting', level: 5, effect: '+10% cast distance', cost: 1, requires: 'basic_casting' },
      power_casting: { name: 'Power Casting', level: 15, effect: '+25% cast distance', cost: 2, requires: 'improved_casting' },
      perfect_casting: { name: 'Perfect Casting', level: 30, effect: '+50% cast distance', cost: 3, requires: 'power_casting' },
      
      patience: { name: 'Patience', level: 3, effect: '+5% rare fish chance', cost: 1 },
      zen_fishing: { name: 'Zen Fishing', level: 10, effect: '+10% rare fish chance', cost: 2, requires: 'patience' },
      fish_sense: { name: 'Fish Sense', level: 20, effect: '+20% rare fish chance', cost: 3, requires: 'zen_fishing' },
      
      quick_reel: { name: 'Quick Reel', level: 5, effect: '-10% reel time', cost: 1 },
      expert_reel: { name: 'Expert Reel', level: 15, effect: '-25% reel time', cost: 2, requires: 'quick_reel' },
      master_reel: { name: 'Master Reel', level: 30, effect: '-50% reel time', cost: 3, requires: 'expert_reel' },
      
      bait_efficiency: { name: 'Bait Efficiency', level: 8, effect: '20% chance to not consume bait', cost: 1 },
      bait_master: { name: 'Bait Master', level: 20, effect: '40% chance to not consume bait', cost: 2, requires: 'bait_efficiency' },
      
      deep_fishing: { name: 'Deep Fishing', level: 12, effect: 'Unlock deep water fishing', cost: 2 },
      abyssal_fishing: { name: 'Abyssal Fishing', level: 35, effect: 'Unlock abyssal fishing', cost: 3, requires: 'deep_fishing' },
    },
  },
  
  trading: {
    name: 'Trading Expertise',
    icon: '💰',
    skills: {
      basic_haggling: { name: 'Basic Haggling', level: 1, effect: '5% better prices', cost: 0 },
      silver_tongue: { name: 'Silver Tongue', level: 10, effect: '10% better prices', cost: 2, requires: 'basic_haggling' },
      master_negotiator: { name: 'Master Negotiator', level: 25, effect: '20% better prices', cost: 3, requires: 'silver_tongue' },
      
      market_sense: { name: 'Market Sense', level: 5, effect: 'See price trends', cost: 1 },
      trade_routes: { name: 'Trade Routes', level: 15, effect: 'Unlock trade route bonuses', cost: 2, requires: 'market_sense' },
      
      bulk_discount: { name: 'Bulk Discount', level: 8, effect: 'Discounts on large purchases', cost: 1 },
      wholesale: { name: 'Wholesale', level: 20, effect: 'Access to wholesale prices', cost: 2, requires: 'bulk_discount' },
    },
  },
  
  sailing: {
    name: 'Sailing Prowess',
    icon: '⛵',
    skills: {
      basic_sailing: { name: 'Basic Sailing', level: 1, effect: 'Can sail small boats', cost: 0 },
      intermediate_sailing: { name: 'Intermediate Sailing', level: 10, effect: 'Can sail medium boats', cost: 2, requires: 'basic_sailing' },
      advanced_sailing: { name: 'Advanced Sailing', level: 25, effect: 'Can sail large ships', cost: 3, requires: 'intermediate_sailing' },
      
      wind_reading: { name: 'Wind Reading', level: 5, effect: '+10% sailing speed', cost: 1 },
      wind_master: { name: 'Wind Master', level: 20, effect: '+25% sailing speed', cost: 2, requires: 'wind_reading' },
      
      navigation: { name: 'Navigation', level: 8, effect: 'Reduced travel time', cost: 1 },
      star_navigation: { name: 'Star Navigation', level: 18, effect: 'Can navigate at night', cost: 2, requires: 'navigation' },
      
      storm_sailing: { name: 'Storm Sailing', level: 15, effect: 'Reduced storm damage', cost: 2 },
      storm_master: { name: 'Storm Master', level: 30, effect: 'Bonus during storms', cost: 3, requires: 'storm_sailing' },
    },
  },
};

// Export all
export default {
  FISHING_SPOTS,
  LOOT_TABLES,
  CRAFTING_RECIPES,
  ACHIEVEMENTS,
  DIALOGUE_DATA,
  MINIGAMES,
  SKILL_TREES,
};
