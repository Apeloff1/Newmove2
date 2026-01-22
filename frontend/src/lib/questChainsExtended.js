/**
 * ============================================================================
 * QUEST CHAINS EXTENDED - Additional Quest Lines (Chains 23-30 Complete)
 * ============================================================================
 * More detailed quest chains with expanded objectives and rewards
 * ============================================================================
 */

// ============================================================================
// QUEST CHAIN 23: THE SHIPWRIGHT'S LEGACY
// ============================================================================

export const QUEST_CHAIN_SHIPWRIGHT = {
  id: 'shipwright_legacy',
  name: 'The Shipwright\'s Legacy',
  description: 'Learn the ancient art of boat building',
  type: 'profession',
  icon: '🚢',
  totalQuests: 12,
  quests: [
    {
      id: 'ship_1',
      name: 'The Old Shipyard',
      description: 'Discover the abandoned shipyard',
      objectives: [
        { type: 'find', target: 'old_shipyard', text: 'Find the old shipyard' },
        { type: 'explore', rooms: 3, text: 'Explore the shipyard' },
        { type: 'find', item: 'old_blueprints', text: 'Find the old blueprints' },
      ],
      rewards: { xp: 100, items: ['shipwright_journal_1'] },
    },
    {
      id: 'ship_2',
      name: 'Gathering Materials',
      description: 'Collect basic boat-building materials',
      objectives: [
        { type: 'collect', item: 'oak_wood', count: 20, text: 'Collect 20 oak planks' },
        { type: 'collect', item: 'iron_nails', count: 50, text: 'Collect 50 iron nails' },
        { type: 'collect', item: 'tar', count: 5, text: 'Collect 5 buckets of tar' },
      ],
      rewards: { xp: 150, gold: 100, skill: 'boatcraft_1' },
    },
    {
      id: 'ship_3',
      name: 'Your First Repair',
      description: 'Repair a damaged rowboat',
      objectives: [
        { type: 'find', target: 'damaged_rowboat', text: 'Find a damaged rowboat' },
        { type: 'repair', item: 'rowboat', text: 'Repair the rowboat' },
        { type: 'test', item: 'rowboat', text: 'Test the repaired boat' },
      ],
      rewards: { xp: 200, items: ['repaired_rowboat'], skill: 'boatcraft_2' },
    },
    {
      id: 'ship_4',
      name: 'The Master\'s Ghost',
      description: 'Meet the spirit of the old shipwright',
      objectives: [
        { type: 'visit', target: 'shipyard', time: 'midnight', text: 'Visit the shipyard at midnight' },
        { type: 'encounter', target: 'ghost_shipwright', text: 'Meet the ghost' },
        { type: 'listen', story: 'shipwright_history', text: 'Listen to his story' },
      ],
      rewards: { xp: 250, items: ['ghost_blessing', 'ancient_technique'] },
    },
    {
      id: 'ship_5',
      name: 'Building from Scratch',
      description: 'Build your first boat from scratch',
      objectives: [
        { type: 'craft', item: 'boat_frame', text: 'Craft the boat frame' },
        { type: 'craft', item: 'boat_hull', text: 'Craft the hull' },
        { type: 'assemble', item: 'small_boat', text: 'Assemble the boat' },
      ],
      rewards: { xp: 400, items: ['handmade_boat'], skill: 'boatcraft_5' },
    },
    {
      id: 'ship_6',
      name: 'Exotic Woods',
      description: 'Find rare wood for better boats',
      objectives: [
        { type: 'travel', to: 'distant_forest', text: 'Travel to the distant forest' },
        { type: 'collect', item: 'ironwood', count: 10, text: 'Collect ironwood' },
        { type: 'collect', item: 'sea_oak', count: 10, text: 'Collect sea oak' },
      ],
      rewards: { xp: 350, items: ['rare_wood_stash'] },
    },
    {
      id: 'ship_7',
      name: 'The Sail Maker',
      description: 'Learn to craft sails',
      objectives: [
        { type: 'find', npc: 'sail_maker', text: 'Find the retired sail maker' },
        { type: 'learn', skill: 'sail_making', text: 'Learn sail making' },
        { type: 'craft', item: 'canvas_sail', text: 'Craft your first sail' },
      ],
      rewards: { xp: 300, skill: 'sail_making', items: ['sail_patterns'] },
    },
    {
      id: 'ship_8',
      name: 'Sea Trials',
      description: 'Test your boat in challenging conditions',
      objectives: [
        { type: 'sail', distance: 1000, text: 'Sail 1000 meters' },
        { type: 'survive', weather: 'rough_seas', text: 'Navigate through rough seas' },
        { type: 'return', safe: true, text: 'Return safely' },
      ],
      rewards: { xp: 450, items: ['sea_trial_certificate'] },
    },
    {
      id: 'ship_9',
      name: 'The Commission',
      description: 'Build a boat for a customer',
      objectives: [
        { type: 'accept', job: 'boat_commission', text: 'Accept a commission' },
        { type: 'build', item: 'custom_fishing_boat', quality: 'good', text: 'Build to specifications' },
        { type: 'deliver', to: 'customer', text: 'Deliver the boat' },
      ],
      rewards: { xp: 500, gold: 500, reputation: { shipwright: 200 } },
    },
    {
      id: 'ship_10',
      name: 'The Lost Technique',
      description: 'Recover an ancient boat-building secret',
      objectives: [
        { type: 'research', target: 'ancient_techniques', text: 'Research ancient methods' },
        { type: 'dive', location: 'sunken_workshop', text: 'Dive to the sunken workshop' },
        { type: 'recover', item: 'technique_scroll', text: 'Recover the technique scroll' },
      ],
      rewards: { xp: 600, items: ['ancient_technique_scroll'], skill: 'master_boatcraft' },
    },
    {
      id: 'ship_11',
      name: 'The Masterpiece',
      description: 'Build a masterwork vessel',
      objectives: [
        { type: 'gather', materials: 'finest', text: 'Gather the finest materials' },
        { type: 'build', item: 'masterwork_ship', quality: 'perfect', text: 'Build a masterwork ship' },
        { type: 'present', to: 'ship_guild', text: 'Present to the shipwright guild' },
      ],
      rewards: { xp: 1000, gold: 2000, items: ['master_shipwright_badge'] },
    },
    {
      id: 'ship_12',
      name: 'Legacy Continued',
      description: 'Become a master shipwright',
      objectives: [
        { type: 'build', ships: 10, quality: 'good', text: 'Build 10 quality ships' },
        { type: 'teach', apprentices: 3, text: 'Train 3 apprentices' },
        { type: 'ceremony', target: 'master_ceremony', text: 'Complete the master ceremony' },
      ],
      rewards: { xp: 1500, items: ['master_shipwright_tools'], title: 'Master Shipwright' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 24: THE DEEP SEA EXPLORER
// ============================================================================

export const QUEST_CHAIN_DEEP_SEA = {
  id: 'deep_sea_explorer',
  name: 'The Deep Sea Explorer',
  description: 'Explore the mysterious ocean depths',
  type: 'exploration',
  icon: '🤿',
  totalQuests: 11,
  quests: [
    {
      id: 'deep_1',
      name: 'Learning to Dive',
      description: 'Learn the basics of diving',
      objectives: [
        { type: 'find', npc: 'dive_instructor', text: 'Find a dive instructor' },
        { type: 'learn', skill: 'basic_diving', text: 'Learn basic diving' },
        { type: 'practice', dives: 3, text: 'Complete 3 practice dives' },
      ],
      rewards: { xp: 100, items: ['basic_diving_gear'], skill: 'diving_1' },
    },
    {
      id: 'deep_2',
      name: 'Shallow Reef Exploration',
      description: 'Explore the shallow reefs',
      objectives: [
        { type: 'dive', location: 'shallow_reef', text: 'Dive to the shallow reef' },
        { type: 'discover', species: 5, text: 'Discover 5 reef species' },
        { type: 'collect', item: 'coral_sample', count: 3, text: 'Collect coral samples' },
      ],
      rewards: { xp: 150, items: ['reef_journal'], gold: 100 },
    },
    {
      id: 'deep_3',
      name: 'The Underwater Cave',
      description: 'Explore an underwater cave system',
      objectives: [
        { type: 'find', location: 'underwater_cave_entrance', text: 'Find the cave entrance' },
        { type: 'explore', caves: 3, text: 'Explore 3 cave chambers' },
        { type: 'survive', hazards: ['darkness', 'currents'], text: 'Navigate the hazards' },
      ],
      rewards: { xp: 250, items: ['cave_map', 'glow_stones'] },
    },
    {
      id: 'deep_4',
      name: 'Pressure Training',
      description: 'Train to dive deeper',
      objectives: [
        { type: 'train', skill: 'pressure_resistance', text: 'Train pressure resistance' },
        { type: 'dive', depth: 50, text: 'Reach 50 meters depth' },
        { type: 'survive', duration: 5, text: 'Stay at depth for 5 minutes' },
      ],
      rewards: { xp: 300, skill: 'diving_2', items: ['pressure_suit_upgrade'] },
    },
    {
      id: 'deep_5',
      name: 'The Shipwreck Graveyard',
      description: 'Explore the shipwreck graveyard',
      objectives: [
        { type: 'dive', location: 'shipwreck_graveyard', text: 'Reach the graveyard' },
        { type: 'explore', wrecks: 3, text: 'Explore 3 shipwrecks' },
        { type: 'recover', artifacts: 5, text: 'Recover 5 artifacts' },
      ],
      rewards: { xp: 400, gold: 500, items: ['shipwreck_treasure'] },
    },
    {
      id: 'deep_6',
      name: 'Bioluminescent Bay',
      description: 'Discover the glowing depths',
      objectives: [
        { type: 'dive', location: 'bioluminescent_zone', time: 'night', text: 'Dive at night' },
        { type: 'observe', creatures: 10, text: 'Observe 10 glowing creatures' },
        { type: 'collect', item: 'bioluminescent_sample', count: 5, text: 'Collect samples' },
      ],
      rewards: { xp: 350, items: ['glow_jar', 'luminescent_lure'] },
    },
    {
      id: 'deep_7',
      name: 'The Abyss Beckons',
      description: 'Prepare for the deep abyss',
      objectives: [
        { type: 'acquire', item: 'abyssal_diving_suit', text: 'Acquire abyssal gear' },
        { type: 'train', skill: 'deep_pressure', text: 'Train for extreme pressure' },
        { type: 'test', item: 'abyssal_suit', text: 'Test the suit' },
      ],
      rewards: { xp: 450, skill: 'diving_3', items: ['abyssal_certification'] },
    },
    {
      id: 'deep_8',
      name: 'Into the Abyss',
      description: 'Descend into the true depths',
      objectives: [
        { type: 'dive', depth: 200, text: 'Reach 200 meters' },
        { type: 'discover', location: 'hydrothermal_vents', text: 'Find hydrothermal vents' },
        { type: 'survive', encounter: 'giant_squid', text: 'Survive a giant squid encounter' },
      ],
      rewards: { xp: 600, items: ['abyss_pearl', 'squid_ink'] },
    },
    {
      id: 'deep_9',
      name: 'The Sunken City',
      description: 'Discover the legendary sunken city',
      objectives: [
        { type: 'follow', clues: 5, text: 'Follow the ancient clues' },
        { type: 'discover', location: 'sunken_city', text: 'Discover the sunken city' },
        { type: 'explore', buildings: 5, text: 'Explore 5 ancient buildings' },
      ],
      rewards: { xp: 800, gold: 1000, items: ['ancient_city_artifact'] },
    },
    {
      id: 'deep_10',
      name: 'Secrets of the Ancients',
      description: 'Uncover the city\'s secrets',
      objectives: [
        { type: 'translate', tablets: 5, text: 'Translate 5 ancient tablets' },
        { type: 'solve', puzzle: 'city_mechanism', text: 'Solve the city mechanism' },
        { type: 'unlock', chamber: 'treasure_vault', text: 'Unlock the treasure vault' },
      ],
      rewards: { xp: 1000, items: ['ancient_knowledge', 'city_treasure'] },
    },
    {
      id: 'deep_11',
      name: 'Master of the Deep',
      description: 'Become a legendary deep sea explorer',
      objectives: [
        { type: 'dive', depth: 'maximum', text: 'Reach the deepest point' },
        { type: 'discover', all: 'deep_locations', text: 'Discover all deep locations' },
        { type: 'document', journal: 'complete', text: 'Complete the exploration journal' },
      ],
      rewards: { xp: 1500, items: ['deep_sea_crown'], title: 'Master of the Deep' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 25: THE WEATHER WARDEN
// ============================================================================

export const QUEST_CHAIN_WEATHER = {
  id: 'weather_warden',
  name: 'The Weather Warden',
  description: 'Learn to predict and use weather to your advantage',
  type: 'skill',
  icon: '🌦️',
  totalQuests: 10,
  quests: [
    {
      id: 'weather_1',
      name: 'Reading the Skies',
      description: 'Learn basic weather reading',
      objectives: [
        { type: 'talk_to', npc: 'old_weather_reader', text: 'Find the old weather reader' },
        { type: 'learn', skill: 'cloud_reading', text: 'Learn to read clouds' },
        { type: 'predict', weather: 3, correct: true, text: 'Correctly predict 3 weather changes' },
      ],
      rewards: { xp: 100, skill: 'weather_reading_1', items: ['weather_journal'] },
    },
    {
      id: 'weather_2',
      name: 'Storm Warning',
      description: 'Learn to predict storms',
      objectives: [
        { type: 'observe', storms: 3, text: 'Observe 3 storms forming' },
        { type: 'record', patterns: 5, text: 'Record storm patterns' },
        { type: 'warn', npcs: 5, text: 'Successfully warn 5 NPCs' },
      ],
      rewards: { xp: 150, gold: 100, reputation: { sailors: 50 } },
    },
    {
      id: 'weather_3',
      name: 'The Barometer',
      description: 'Acquire a weather prediction tool',
      objectives: [
        { type: 'gather', materials: ['glass', 'mercury', 'wood'], text: 'Gather materials' },
        { type: 'craft', item: 'barometer', text: 'Craft a barometer' },
        { type: 'calibrate', item: 'barometer', text: 'Calibrate it' },
      ],
      rewards: { xp: 200, items: ['barometer'], skill: 'weather_reading_2' },
    },
    {
      id: 'weather_4',
      name: 'Fog Navigator',
      description: 'Learn to navigate in fog',
      objectives: [
        { type: 'fish_during', weather: 'foggy', count: 10, text: 'Fish 10 times in fog' },
        { type: 'navigate', without_sight: true, text: 'Navigate without sight' },
        { type: 'find', location: 'hidden_fog_island', text: 'Find the island only visible in fog' },
      ],
      rewards: { xp: 250, items: ['fog_lantern', 'fog_fish_lure'] },
    },
    {
      id: 'weather_5',
      name: 'Storm Fisher',
      description: 'Master fishing during storms',
      objectives: [
        { type: 'fish_during', weather: 'storm', count: 20, text: 'Catch 20 fish during storms' },
        { type: 'catch', fish: 'storm_exclusive', count: 5, text: 'Catch 5 storm-exclusive fish' },
        { type: 'survive', storms: 5, on_water: true, text: 'Survive 5 storms on the water' },
      ],
      rewards: { xp: 400, items: ['storm_rod', 'storm_cloak'] },
    },
    {
      id: 'weather_6',
      name: 'The Weather Shrine',
      description: 'Discover the ancient weather shrine',
      objectives: [
        { type: 'find', location: 'weather_shrine', text: 'Find the weather shrine' },
        { type: 'solve', puzzle: 'elemental_stones', text: 'Solve the elemental puzzle' },
        { type: 'receive', blessing: 'weather_spirit', text: 'Receive the spirit\'s blessing' },
      ],
      rewards: { xp: 350, items: ['weather_amulet'], unlock: 'weather_control_basic' },
    },
    {
      id: 'weather_7',
      name: 'Summoning Rain',
      description: 'Learn to influence the weather',
      objectives: [
        { type: 'learn', ritual: 'rain_dance', text: 'Learn the rain ritual' },
        { type: 'perform', ritual: 'rain_dance', success: true, text: 'Successfully summon rain' },
        { type: 'help', farmers: 3, text: 'Help 3 farmers with your ability' },
      ],
      rewards: { xp: 500, reputation: { farmers: 200 }, skill: 'weather_magic_1' },
    },
    {
      id: 'weather_8',
      name: 'Calming the Storm',
      description: 'Learn to calm storms',
      objectives: [
        { type: 'learn', ritual: 'storm_calming', text: 'Learn the calming ritual' },
        { type: 'calm', storms: 3, text: 'Calm 3 storms' },
        { type: 'save', ships: 1, text: 'Save a ship from a storm' },
      ],
      rewards: { xp: 600, reputation: { sailors: 500 }, items: ['storm_caller_staff'] },
    },
    {
      id: 'weather_9',
      name: 'The Weather Stone',
      description: 'Find the legendary weather stone',
      objectives: [
        { type: 'gather', clues: 5, text: 'Gather clues about the stone' },
        { type: 'climb', peak: 'storm_mountain', text: 'Climb Storm Mountain' },
        { type: 'claim', artifact: 'weather_stone', text: 'Claim the weather stone' },
      ],
      rewards: { xp: 800, items: ['weather_stone'], unlock: 'weather_control_advanced' },
    },
    {
      id: 'weather_10',
      name: 'Weather Warden',
      description: 'Become the official Weather Warden',
      objectives: [
        { type: 'predict', weather: 30, accuracy: 0.9, text: 'Achieve 90% prediction accuracy' },
        { type: 'control', weather_events: 10, text: 'Control 10 weather events' },
        { type: 'appoint', ceremony: 'warden_ceremony', text: 'Complete the appointment ceremony' },
      ],
      rewards: { xp: 1500, items: ['warden_robes', 'weather_mastery'], title: 'Weather Warden' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 26: THE ANIMAL COMPANION
// ============================================================================

export const QUEST_CHAIN_COMPANION = {
  id: 'animal_companion',
  name: 'The Animal Companion',
  description: 'Bond with an animal companion',
  type: 'companion',
  icon: '🐾',
  totalQuests: 11,
  quests: [
    {
      id: 'companion_1',
      name: 'A Stray\'s Trust',
      description: 'Earn the trust of a stray animal',
      objectives: [
        { type: 'find', target: 'stray_animal', text: 'Find a stray animal' },
        { type: 'feed', count: 5, text: 'Feed it 5 times' },
        { type: 'approach', without_scaring: true, text: 'Approach without scaring it' },
      ],
      rewards: { xp: 50, items: ['animal_treat'], unlock: 'companion_slot' },
    },
    {
      id: 'companion_2',
      name: 'A New Friend',
      description: 'Adopt your animal companion',
      objectives: [
        { type: 'bond', level: 1, text: 'Reach bond level 1' },
        { type: 'name', companion: true, text: 'Name your companion' },
        { type: 'build', item: 'pet_bed', text: 'Build a bed for them' },
      ],
      rewards: { xp: 100, items: ['companion_collar'], companion: 'chosen_animal' },
    },
    {
      id: 'companion_3',
      name: 'Basic Training',
      description: 'Train your companion in basic commands',
      objectives: [
        { type: 'teach', command: 'sit', text: 'Teach "Sit"' },
        { type: 'teach', command: 'stay', text: 'Teach "Stay"' },
        { type: 'teach', command: 'come', text: 'Teach "Come"' },
      ],
      rewards: { xp: 150, items: ['training_whistle'], bond: 5 },
    },
    {
      id: 'companion_4',
      name: 'Fishing Buddy',
      description: 'Train your companion to help with fishing',
      objectives: [
        { type: 'fish_together', count: 20, text: 'Fish together 20 times' },
        { type: 'teach', skill: 'fish_retrieval', text: 'Teach fish retrieval' },
        { type: 'celebrate', first_assist: true, text: 'Celebrate their first assist' },
      ],
      rewards: { xp: 200, items: ['fishing_companion_vest'], bond: 10 },
    },
    {
      id: 'companion_5',
      name: 'The Vet Visit',
      description: 'Take care of your companion\'s health',
      objectives: [
        { type: 'visit', npc: 'animal_healer', text: 'Visit the animal healer' },
        { type: 'learn', skill: 'pet_first_aid', text: 'Learn pet first aid' },
        { type: 'buy', item: 'pet_medicine_kit', text: 'Buy a medicine kit' },
      ],
      rewards: { xp: 150, items: ['pet_medicine_kit'], skill: 'animal_care' },
    },
    {
      id: 'companion_6',
      name: 'Advanced Training',
      description: 'Teach advanced skills',
      objectives: [
        { type: 'teach', command: 'fetch', text: 'Teach "Fetch"' },
        { type: 'teach', command: 'guard', text: 'Teach "Guard"' },
        { type: 'teach', command: 'track', text: 'Teach "Track"' },
      ],
      rewards: { xp: 300, items: ['advanced_collar'], bond: 15 },
    },
    {
      id: 'companion_7',
      name: 'Treasure Hunter',
      description: 'Train your companion to find treasure',
      objectives: [
        { type: 'teach', skill: 'treasure_sniffing', text: 'Teach treasure sniffing' },
        { type: 'find', treasures: 5, with_companion: true, text: 'Find 5 treasures together' },
      ],
      rewards: { xp: 350, items: ['treasure_nose_enhancement'], bond: 10 },
    },
    {
      id: 'companion_8',
      name: 'The Pet Show',
      description: 'Enter your companion in the pet show',
      objectives: [
        { type: 'register', event: 'pet_show', text: 'Register for the pet show' },
        { type: 'groom', companion: true, text: 'Groom your companion' },
        { type: 'compete', event: 'pet_show', text: 'Compete in the show' },
      ],
      rewards: { xp: 250, gold: 200, items: ['show_ribbon'], bond: 20 },
    },
    {
      id: 'companion_9',
      name: 'A Life Saved',
      description: 'Your companion saves you from danger',
      objectives: [
        { type: 'survive', danger: 'any', companion_helps: true, text: 'Be saved by your companion' },
        { type: 'thank', companion: true, special: true, text: 'Show your gratitude' },
      ],
      rewards: { xp: 400, bond: 25, unlock: 'deep_bond' },
    },
    {
      id: 'companion_10',
      name: 'Unbreakable Bond',
      description: 'Achieve maximum bond with your companion',
      objectives: [
        { type: 'bond', level: 'maximum', text: 'Reach maximum bond' },
        { type: 'adventure', together: 100, text: 'Complete 100 adventures together' },
        { type: 'unlock', ability: 'companion_special', text: 'Unlock their special ability' },
      ],
      rewards: { xp: 500, items: ['bond_locket'], unlock: 'companion_special_ability' },
    },
    {
      id: 'companion_11',
      name: 'Best Friends Forever',
      description: 'Complete the companion journey',
      objectives: [
        { type: 'complete_all', companion_quests: true, text: 'Complete all companion activities' },
        { type: 'ceremony', target: 'companion_ceremony', text: 'Have a special ceremony' },
        { type: 'receive', item: 'matching_accessories', text: 'Receive matching accessories' },
      ],
      rewards: { xp: 750, items: ['best_friend_badge', 'matching_outfit'], title: 'Animal Friend' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 27: THE GHOST HUNTER
// ============================================================================

export const QUEST_CHAIN_GHOSTS = {
  id: 'ghost_hunter',
  name: 'The Ghost Hunter',
  description: 'Investigate and help the spirits of Codswallop Cove',
  type: 'supernatural',
  icon: '👻',
  totalQuests: 12,
  quests: [
    {
      id: 'ghost_1',
      name: 'Things That Go Bump',
      description: 'Investigate strange occurrences',
      objectives: [
        { type: 'investigate', reports: 3, text: 'Investigate 3 ghost reports' },
        { type: 'witness', event: 'paranormal', text: 'Witness a paranormal event' },
      ],
      rewards: { xp: 100, items: ['ghost_journal'] },
    },
    {
      id: 'ghost_2',
      name: 'Ghost Hunting Tools',
      description: 'Acquire ghost hunting equipment',
      objectives: [
        { type: 'find', npc: 'paranormal_expert', text: 'Find a paranormal expert' },
        { type: 'acquire', items: ['spirit_detector', 'salt', 'candles'], text: 'Acquire equipment' },
        { type: 'learn', skill: 'ghost_detection', text: 'Learn ghost detection' },
      ],
      rewards: { xp: 150, items: ['ghost_hunting_kit'], skill: 'paranormal_1' },
    },
    {
      id: 'ghost_3',
      name: 'The Lighthouse Ghost',
      description: 'Help the lighthouse ghost',
      objectives: [
        { type: 'visit', location: 'lighthouse', time: 'midnight', text: 'Visit at midnight' },
        { type: 'communicate', ghost: 'lighthouse_keeper', text: 'Communicate with the ghost' },
        { type: 'complete', task: 'unfinished_business_1', text: 'Help with unfinished business' },
      ],
      rewards: { xp: 250, items: ['ghost_lantern'], reputation: { spirits: 50 } },
    },
    {
      id: 'ghost_4',
      name: 'Shipwreck Spirits',
      description: 'Help the spirits of a shipwreck',
      objectives: [
        { type: 'dive', location: 'haunted_wreck', text: 'Dive to the haunted wreck' },
        { type: 'communicate', ghosts: 5, text: 'Speak with 5 spirits' },
        { type: 'recover', items: 'personal_effects', text: 'Recover their personal effects' },
        { type: 'deliver', to: 'descendants', text: 'Deliver to their descendants' },
      ],
      rewards: { xp: 400, gold: 300, reputation: { spirits: 100 } },
    },
    {
      id: 'ghost_5',
      name: 'The Poltergeist',
      description: 'Deal with an angry spirit',
      objectives: [
        { type: 'investigate', location: 'haunted_house', text: 'Investigate the haunted house' },
        { type: 'survive', attacks: 5, text: 'Survive 5 poltergeist attacks' },
        { type: 'discover', reason: 'anger', text: 'Discover why it\'s angry' },
        { type: 'resolve', conflict: true, text: 'Resolve the conflict' },
      ],
      rewards: { xp: 350, items: ['spirit_shield'], skill: 'paranormal_2' },
    },
    {
      id: 'ghost_6',
      name: 'The Ghost Ship',
      description: 'Board the legendary ghost ship',
      objectives: [
        { type: 'wait_for', event: 'ghost_ship_appearance', text: 'Wait for the ghost ship' },
        { type: 'board', ship: 'ghost_ship', text: 'Board the ship' },
        { type: 'speak', to: 'ghost_captain', text: 'Speak with the captain' },
      ],
      rewards: { xp: 500, items: ['ghost_compass'], unlock: 'ghost_ship_access' },
    },
    {
      id: 'ghost_7',
      name: 'Souls at Rest',
      description: 'Help multiple spirits find peace',
      objectives: [
        { type: 'help', ghosts: 10, text: 'Help 10 ghosts find peace' },
        { type: 'perform', ritual: 'mass_blessing', text: 'Perform a mass blessing' },
      ],
      rewards: { xp: 450, reputation: { spirits: 200 }, items: ['peacekeeper_medal'] },
    },
    {
      id: 'ghost_8',
      name: 'The Cursed Captain',
      description: 'Help the cursed captain',
      objectives: [
        { type: 'learn', curse: 'captain_curse', text: 'Learn about the captain\'s curse' },
        { type: 'gather', items: ['curse_breaker_ingredients'], text: 'Gather curse-breaking items' },
        { type: 'perform', ritual: 'curse_breaking', text: 'Break the curse' },
      ],
      rewards: { xp: 600, items: ['captains_gratitude', 'ghost_ship_deed'] },
    },
    {
      id: 'ghost_9',
      name: 'The Spirit World',
      description: 'Visit the spirit realm',
      objectives: [
        { type: 'learn', ritual: 'spirit_walk', text: 'Learn to spirit walk' },
        { type: 'enter', realm: 'spirit_world', text: 'Enter the spirit world' },
        { type: 'navigate', challenges: 3, text: 'Navigate spirit challenges' },
      ],
      rewards: { xp: 700, items: ['spirit_walker_badge'], skill: 'spirit_walking' },
    },
    {
      id: 'ghost_10',
      name: 'The Anchor of Souls',
      description: 'Find the legendary anchor',
      objectives: [
        { type: 'research', artifact: 'anchor_of_souls', text: 'Research the anchor' },
        { type: 'find', location: 'anchor_location', text: 'Find its location' },
        { type: 'retrieve', artifact: 'anchor_of_souls', text: 'Retrieve the anchor' },
      ],
      rewards: { xp: 800, items: ['anchor_of_souls'], unlock: 'spirit_binding' },
    },
    {
      id: 'ghost_11',
      name: 'Master Exorcist',
      description: 'Deal with the most dangerous spirit',
      objectives: [
        { type: 'confront', spirit: 'vengeful_ancient', text: 'Confront the ancient spirit' },
        { type: 'survive', battle: 'spirit_battle', text: 'Survive the battle' },
        { type: 'choice', options: ['banish', 'redeem', 'bind'], text: 'Choose its fate' },
      ],
      rewards: { xp: 1000, items: ['exorcist_robes'] },
    },
    {
      id: 'ghost_12',
      name: 'Bridge Between Worlds',
      description: 'Become the bridge between living and dead',
      objectives: [
        { type: 'help', spirits: 50, text: 'Help 50 spirits' },
        { type: 'establish', connection: 'permanent_spirit_link', text: 'Establish permanent connection' },
        { type: 'ceremony', target: 'spirit_guardian', text: 'Become a Spirit Guardian' },
      ],
      rewards: { xp: 1500, items: ['spirit_guardian_cloak'], title: 'Spirit Guardian' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 28: THE COOK'S JOURNEY
// ============================================================================

export const QUEST_CHAIN_COOKING = {
  id: 'cooks_journey',
  name: 'The Cook\'s Journey',
  description: 'Master the culinary arts of seafood',
  type: 'profession',
  icon: '👨‍🍳',
  totalQuests: 10,
  quests: [
    { id: 'cook_1', name: 'Kitchen Basics', objectives: [{ type: 'learn', recipes: 5 }], rewards: { xp: 50, items: ['basic_cookbook'] } },
    { id: 'cook_2', name: 'Grilled to Perfection', objectives: [{ type: 'cook', type: 'grilled', count: 20, quality: 'good' }], rewards: { xp: 100, items: ['grill'] } },
    { id: 'cook_3', name: 'Soup Kitchen', objectives: [{ type: 'learn', recipe: 'fish_soup' }, { type: 'cook', count: 10 }], rewards: { xp: 150, items: ['soup_pot'] } },
    { id: 'cook_4', name: 'Exotic Ingredients', objectives: [{ type: 'gather', ingredients: 'exotic', count: 10 }], rewards: { xp: 200, items: ['exotic_spices'] } },
    { id: 'cook_5', name: 'The Cooking Contest', objectives: [{ type: 'enter', contest: true }, { type: 'rank', top: 3 }], rewards: { xp: 300, gold: 300 } },
    { id: 'cook_6', name: 'Secret Recipes', objectives: [{ type: 'discover', recipes: 'secret', count: 3 }], rewards: { xp: 350, items: ['secret_cookbook'] } },
    { id: 'cook_7', name: 'Feast Preparation', objectives: [{ type: 'cook', feast: true }, { type: 'serve', guests: 20 }], rewards: { xp: 400, reputation: { town: 200 } } },
    { id: 'cook_8', name: 'The Master Chef', objectives: [{ type: 'study', under: 'master_chef' }], rewards: { xp: 500, skill: 'master_cooking' } },
    { id: 'cook_9', name: 'Your Restaurant', objectives: [{ type: 'open', restaurant: true }, { type: 'serve', customers: 100 }], rewards: { xp: 750, items: ['restaurant_deed'] } },
    { id: 'cook_10', name: 'Culinary Legend', objectives: [{ type: 'create', recipe: 'signature_dish' }, { type: 'recognition', from: 'governor' }], rewards: { xp: 1000, title: 'Master Chef' } },
  ],
};

// ============================================================================
// QUEST CHAIN 29: THE MAP MAKER
// ============================================================================

export const QUEST_CHAIN_CARTOGRAPHY = {
  id: 'map_maker',
  name: 'The Map Maker',
  description: 'Chart the uncharted waters',
  type: 'exploration',
  icon: '🗺️',
  totalQuests: 10,
  quests: [
    { id: 'map_1', name: 'First Sketch', objectives: [{ type: 'draw', map: 'local_area' }], rewards: { xp: 50, items: ['drawing_kit'] } },
    { id: 'map_2', name: 'Coastal Survey', objectives: [{ type: 'survey', coastline: 'complete' }], rewards: { xp: 100, items: ['survey_tools'] } },
    { id: 'map_3', name: 'Island Hopping', objectives: [{ type: 'map', islands: 5 }], rewards: { xp: 200, gold: 150 } },
    { id: 'map_4', name: 'Depth Charting', objectives: [{ type: 'chart', depths: 'harbor' }], rewards: { xp: 250, items: ['depth_measure'] } },
    { id: 'map_5', name: 'Hidden Locations', objectives: [{ type: 'discover', secret_locations: 5 }, { type: 'map', them: true }], rewards: { xp: 350, items: ['secret_map'] } },
    { id: 'map_6', name: 'Trade Route Maps', objectives: [{ type: 'map', trade_routes: 'all' }], rewards: { xp: 300, gold: 500, reputation: { merchants: 200 } } },
    { id: 'map_7', name: 'Treasure Maps', objectives: [{ type: 'create', treasure_maps: 3 }], rewards: { xp: 400, items: ['cartographer_set'] } },
    { id: 'map_8', name: 'The Complete Atlas', objectives: [{ type: 'compile', atlas: 'regional' }], rewards: { xp: 600, items: ['atlas_volume_1'] } },
    { id: 'map_9', name: 'Royal Commission', objectives: [{ type: 'complete', commission: 'royal_map' }], rewards: { xp: 800, gold: 1000, reputation: { noble: 300 } } },
    { id: 'map_10', name: 'Master Cartographer', objectives: [{ type: 'map', everything: true }], rewards: { xp: 1500, items: ['master_compass'], title: 'Master Cartographer' } },
  ],
};

// ============================================================================
// QUEST CHAIN 30: THE LEGEND COMPLETE
// ============================================================================

export const QUEST_CHAIN_LEGEND = {
  id: 'legend_complete',
  name: 'The Complete Legend',
  description: 'Become a true legend of Codswallop Cove',
  type: 'meta',
  icon: '🌟',
  totalQuests: 10,
  quests: [
    { id: 'legend_1', name: 'Rising Star', objectives: [{ type: 'complete', questlines: 5 }], rewards: { xp: 500, items: ['star_badge'] } },
    { id: 'legend_2', name: 'Friend to All', objectives: [{ type: 'max_friendship', npcs: 10 }], rewards: { xp: 750, items: ['friendship_crown'] } },
    { id: 'legend_3', name: 'Master of the Sea', objectives: [{ type: 'catch', legendary_fish: 5 }], rewards: { xp: 1000, items: ['sea_master_rod'] } },
    { id: 'legend_4', name: 'Wealthy Beyond Measure', objectives: [{ type: 'accumulate', gold: 100000 }], rewards: { xp: 500, items: ['gold_throne'] } },
    { id: 'legend_5', name: 'Explorer Supreme', objectives: [{ type: 'discover', all_locations: true }], rewards: { xp: 1000, items: ['explorer_statue'] } },
    { id: 'legend_6', name: 'Guild Master', objectives: [{ type: 'max_reputation', all_factions: true }], rewards: { xp: 1500, items: ['guild_master_ring'] } },
    { id: 'legend_7', name: 'Champion Fisher', objectives: [{ type: 'win', tournaments: 10 }], rewards: { xp: 1000, items: ['champion_belt'] } },
    { id: 'legend_8', name: 'Story Complete', objectives: [{ type: 'complete', main_story: true }], rewards: { xp: 2000, items: ['story_memento'] } },
    { id: 'legend_9', name: 'Achievement Hunter', objectives: [{ type: 'unlock', achievements: 100 }], rewards: { xp: 1500, items: ['achievement_display'] } },
    { id: 'legend_10', name: 'True Legend', objectives: [{ type: 'complete', everything: true }], rewards: { xp: 5000, items: ['legend_crown', 'island_deed'], title: 'Legend of Codswallop Cove' } },
  ],
};

// ============================================================================
// EXPORT ALL EXTENDED QUEST CHAINS
// ============================================================================

export const EXTENDED_QUEST_CHAINS = {
  QUEST_CHAIN_SHIPWRIGHT,
  QUEST_CHAIN_DEEP_SEA,
  QUEST_CHAIN_WEATHER,
  QUEST_CHAIN_COMPANION,
  QUEST_CHAIN_GHOSTS,
  QUEST_CHAIN_COOKING,
  QUEST_CHAIN_CARTOGRAPHY,
  QUEST_CHAIN_LEGEND,
};

export default EXTENDED_QUEST_CHAINS;
