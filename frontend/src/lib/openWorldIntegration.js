/**
 * OPEN WORLD INTEGRATION DATA
 * Maps all game modes to in-world locations within the adventure
 * 
 * Each mode becomes an interactive location in Saltbeard's Cove
 */

// ============================================================================
// GAME MODE TO WORLD LOCATION MAPPING
// ============================================================================

export const INTEGRATED_LOCATIONS = {
  // ===== HARBOR DISTRICT =====
  fishing_pier: {
    id: 'fishing_pier',
    name: "The Fishing Pier",
    description: "The heart of Port Fortune's fishing industry. Cast your line and see what bites!",
    icon: '🎣',
    gameMode: 'fishing', // Main fishing gameplay
    position: { x: 50, y: 65 },
    npc: 'pier_master_pete',
    unlocked: true,
    lore: "Every legendary fisher started here. The waters are calm, the fish are plentiful, and Old Pete has stories older than the pier itself.",
    activities: ['casual_fishing', 'tournaments', 'fish_selling']
  },
  
  fish_market: {
    id: 'fish_market',
    name: "Finley's Fish Market",
    description: "Buy bait, sell your catch, and hear the latest gossip from Finley Scales.",
    icon: '🐟',
    gameMode: 'tacklebox',
    position: { x: 30, y: 55 },
    npc: 'finley_scales',
    unlocked: true,
    lore: "Three generations of Scales have run this market. They say Finley can identify any fish by smell alone. He's oddly proud of this.",
    activities: ['sell_fish', 'buy_bait', 'check_prices']
  },
  
  captains_quarters: {
    id: 'captains_quarters',
    name: "Captain's Quarters Inn",
    description: "Rest, save your progress, and check the bounty board for fishing contracts.",
    icon: '🏨',
    gameMode: 'daily_rewards',
    position: { x: 25, y: 40 },
    npc: 'innkeeper_isabelle',
    unlocked: true,
    lore: "The finest (and only) inn in port. Isabelle runs a tight ship, despite it being a building.",
    activities: ['daily_check_in', 'rest', 'bounty_board']
  },
  
  // ===== MARKET SQUARE =====
  tackle_emporium: {
    id: 'tackle_emporium',
    name: "Barnaby's Tackle Emporium",
    description: "The finest fishing equipment this side of the Seven Seas.",
    icon: '🪝',
    gameMode: 'expansion_shop',
    position: { x: 35, y: 35 },
    npc: 'barnaby_hooks',
    unlocked: true,
    lore: "Barnaby lost fingers to his trade but gained wisdom. His hooks are legendary, his stories even more so.",
    activities: ['buy_rods', 'buy_upgrades', 'equipment_repair']
  },
  
  mystic_emporium: {
    id: 'mystic_emporium',
    name: "Madame Mystique's Emporium",
    description: "Potions, enchantments, and questionable advice about your future.",
    icon: '🔮',
    gameMode: 'crafting',
    position: { x: 45, y: 30 },
    npc: 'madame_mystique',
    unlocked: true,
    lore: "The madame claims to see the future. Mostly she sees customers coming and raises prices accordingly.",
    activities: ['craft_potions', 'enchant_gear', 'fortune_telling']
  },
  
  blacksmith_forge: {
    id: 'blacksmith_forge',
    name: "Iron Ingrid's Forge",
    description: "Upgrade your equipment and forge legendary fishing rods.",
    icon: '⚒️',
    gameMode: 'skill_tree',
    position: { x: 55, y: 30 },
    npc: 'martha_anvil',
    unlocked: true,
    lore: "Martha - called 'Iron Ingrid' by those who've arm-wrestled her - forges the finest metal in the cove.",
    activities: ['upgrade_equipment', 'learn_skills', 'forge_legendary']
  },
  
  // ===== SCHOLAR'S CORNER =====
  maritime_museum: {
    id: 'maritime_museum',
    name: "Maritime Museum & Fishdex",
    description: "Document your discoveries and learn about the fish of the Seven Seas.",
    icon: '📚',
    gameMode: 'fishdex',
    position: { x: 70, y: 35 },
    npc: 'professor_plankton',
    unlocked: true,
    lore: "Professor Plankton has catalogued over 10,000 fish species. He's named several after himself. Modesty is not his strength.",
    activities: ['view_fishdex', 'research_fish', 'earn_bounties']
  },
  
  trophy_hall: {
    id: 'trophy_hall',
    name: "Hall of Legends",
    description: "View your achievements and see how you rank among the greatest fishers.",
    icon: '🏆',
    gameMode: 'achievements',
    position: { x: 75, y: 45 },
    npc: 'hall_keeper_harold',
    unlocked: true,
    lore: "Every trophy here tells a story. Harold knows them all, and will tell you whether you want to hear or not.",
    activities: ['view_achievements', 'claim_rewards', 'compare_ranks']
  },
  
  leaderboard_tower: {
    id: 'leaderboard_tower',
    name: "The Leaderboard Tower",
    description: "See who's caught the biggest fish and compete for glory.",
    icon: '📊',
    gameMode: 'leaderboard',
    position: { x: 80, y: 40 },
    npc: 'scorekeeper_simon',
    unlocked: true,
    lore: "The tower displays the names of the greatest. Simon updates it obsessively. Very obsessively.",
    activities: ['view_rankings', 'submit_catches', 'weekly_competitions']
  },
  
  // ===== SEASIDE ATTRACTIONS =====
  aquarium: {
    id: 'aquarium',
    name: "The Grand Aquarium",
    description: "Display your prized catches and breed new species.",
    icon: '🐠',
    gameMode: 'aquarium',
    position: { x: 60, y: 60 },
    npc: 'curator_coral',
    unlocked: true,
    lore: "The aquarium houses the rarest fish in captivity. Curator Coral treats each one like family. She has favorites though.",
    activities: ['display_fish', 'breed_fish', 'earn_visitors']
  },
  
  breeding_lab: {
    id: 'breeding_lab',
    name: "Dr. Finn's Breeding Lab",
    description: "Combine fish species to create new hybrids with unique abilities.",
    icon: '🧬',
    gameMode: 'breeding_lab',
    position: { x: 65, y: 55 },
    npc: 'dr_finn',
    unlocked: true,
    requiresLevel: 5,
    lore: "Dr. Finn's experiments are either brilliant or terrifying. Sometimes both. The glowing fish are definitely both.",
    activities: ['breed_hybrids', 'research_genetics', 'create_mutations']
  },
  
  // ===== TAVERN ROW =====
  salty_barnacle: {
    id: 'salty_barnacle',
    name: "The Salty Barnacle Tavern",
    description: "Drink, eat, play games, and hear the latest rumors.",
    icon: '🍺',
    gameMode: 'tavern_hub',
    position: { x: 40, y: 45 },
    npc: 'rosie_stormglass',
    unlocked: true,
    lore: "The Barnacle has stood for generations. Rosie knows everyone's secrets. The rum is surprisingly good.",
    activities: ['play_games', 'gather_rumors', 'card_games', 'arm_wrestling']
  },
  
  // ===== MINIGAME LOCATIONS (Inside Tavern) =====
  memory_corner: {
    id: 'memory_corner',
    name: "Old Barnacle's Memory Corner",
    description: "Test your memory matching fish pairs! Old sailors say it keeps the mind sharp for spotting rare catches.",
    icon: '🧠',
    gameMode: 'minigame_memory',
    position: { x: 38, y: 48 },
    npc: 'old_barnacle_bill',
    unlocked: true,
    lore: "Old Bill claims memory games helped him remember where Saltbeard buried his treasure. He hasn't found it yet, but he remembers breakfast perfectly.",
    activities: ['fish_memory_game'],
    rewards: { gold: '50-200', xp: 25 },
    questHook: "Bill mutters about a pattern in Saltbeard's maps... if only someone could prove their memory skills worthy."
  },
  
  timing_dock: {
    id: 'timing_dock',
    name: "Lightning Larry's Timing Dock",
    description: "Test your reflexes! Time your catches perfectly to earn bonus gold.",
    icon: '⚡',
    gameMode: 'minigame_timing',
    position: { x: 42, y: 48 },
    npc: 'lightning_larry',
    unlocked: true,
    lore: "Larry was once the fastest fisherman in the Seven Seas. Now he trains others, betting on their reflexes.",
    activities: ['fish_timing_game'],
    rewards: { gold: '75-300', xp: 35 },
    questHook: "Larry whispers of a legendary fish that only appears for a split second at sunset..."
  },
  
  quiz_masters_table: {
    id: 'quiz_masters_table',
    name: "Professor Pike's Quiz Table",
    description: "Answer trivia about fish and the seas! Knowledge is treasure.",
    icon: '❓',
    gameMode: 'minigame_quiz',
    position: { x: 36, y: 46 },
    npc: 'professor_pike',
    unlocked: true,
    lore: "Professor Pike was expelled from the Maritime Academy for 'excessive enthusiasm about fish facts'. The tavern welcomed him.",
    activities: ['fish_quiz_game'],
    rewards: { gold: '100-500', xp: 50 },
    questHook: "The Professor hints that ancient riddles in Saltbeard's journal could only be solved by a true fish scholar..."
  },
  
  sorting_station: {
    id: 'sorting_station',
    name: "Swift Sally's Sorting Station",
    description: "Sort fish by size as fast as you can! The market pays well for organized catches.",
    icon: '📊',
    gameMode: 'minigame_sorting',
    position: { x: 44, y: 46 },
    npc: 'swift_sally',
    unlocked: true,
    lore: "Sally sorted 10,000 fish in one night during the Great Catch of '89. She still twitches when she sees a mackerel.",
    activities: ['fish_sorting_game'],
    rewards: { gold: '60-250', xp: 30 },
    questHook: "Sally overheard that Saltbeard's crew used a special sorting system to hide treasure maps among fish shipments..."
  },
  
  galley_kitchen: {
    id: 'galley_kitchen',
    name: "The Galley Kitchen",
    description: "Cook your catches into delicious meals with special bonuses.",
    icon: '🍳',
    gameMode: 'cooking',
    position: { x: 42, y: 50 },
    npc: 'chef_crustacean',
    unlocked: true,
    lore: "Chef Crustacean cooks seafood with passion. His crab cakes are legendary. His temper is also legendary.",
    activities: ['cook_recipes', 'discover_recipes', 'cooking_contests']
  },
  
  // ===== WATERFRONT =====
  weather_station: {
    id: 'weather_station',
    name: "Old Gale's Weather Station",
    description: "Check weather forecasts that affect fishing conditions.",
    icon: '🌤️',
    gameMode: 'weather',
    position: { x: 85, y: 55 },
    npc: 'old_gale',
    unlocked: true,
    lore: "Old Gale has predicted weather for 50 years. His joints are more accurate than any barometer.",
    activities: ['check_forecast', 'plan_expeditions', 'weather_fishing']
  },
  
  event_pavilion: {
    id: 'event_pavilion',
    name: "Festival Pavilion",
    description: "Seasonal events, tournaments, and special celebrations.",
    icon: '🎪',
    gameMode: 'seasonal_events',
    position: { x: 50, y: 25 },
    npc: 'event_coordinator_eva',
    unlocked: true,
    lore: "Eva organizes every festival. She's perpetually stressed but the events are always spectacular.",
    activities: ['seasonal_quests', 'tournaments', 'special_rewards']
  },
  
  // ===== DOCKS =====
  boat_dock: {
    id: 'boat_dock',
    name: "Captain's Boat Dock",
    description: "Board your boat for deep sea fishing expeditions.",
    icon: '⛵',
    gameMode: 'boat',
    position: { x: 90, y: 60 },
    npc: 'captain_goldbeard',
    unlocked: true,
    requiresLevel: 3,
    lore: "Goldbeard retired from piracy but still loves the sea. He'll take you to the best fishing spots. For a price.",
    activities: ['deep_sea_fishing', 'whale_watching', 'treasure_hunting']
  },
  
  whale_watching: {
    id: 'whale_watching',
    name: "Whale Watching Point",
    description: "Spot legendary sea creatures and rare whale species.",
    icon: '🐋',
    gameMode: 'whale',
    position: { x: 95, y: 50 },
    npc: 'whale_watcher_wendy',
    unlocked: true,
    requiresLevel: 10,
    lore: "Wendy has dedicated her life to whales. She knows each by name. The whales might know her too.",
    activities: ['whale_spotting', 'legendary_hunts', 'ocean_expeditions']
  },
  
  // ===== SPECIAL LOCATIONS =====
  journal_archive: {
    id: 'journal_archive',
    name: "The Captain's Journal Archive",
    description: "Record your adventures and track your fishing journal.",
    icon: '📖',
    gameMode: 'journal',
    position: { x: 20, y: 30 },
    npc: 'archivist_anna',
    unlocked: true,
    lore: "Every great fisher keeps a journal. Anna preserves them all. Your story deserves to be remembered.",
    activities: ['write_journal', 'view_history', 'track_progress']
  },
  
  title_registry: {
    id: 'title_registry',
    name: "Title Registry Office",
    description: "Earn and equip titles that show your fishing prowess.",
    icon: '📜',
    gameMode: 'titles',
    position: { x: 15, y: 35 },
    npc: 'registrar_reginald',
    unlocked: true,
    lore: "Titles matter in Port Fortune. Reginald keeps the official registry. He takes it VERY seriously.",
    activities: ['view_titles', 'equip_titles', 'earn_titles']
  },
  
  music_corner: {
    id: 'music_corner',
    name: "Songbird Sally's Stage",
    description: "Listen to sea shanties and control the background music.",
    icon: '🎵',
    gameMode: 'music_player',
    position: { x: 38, y: 42 },
    npc: 'songbird_sally',
    unlocked: true,
    lore: "Sally's voice has calmed storms and started bar fights. Her song selection is impeccable.",
    activities: ['change_music', 'request_songs', 'learn_shanties']
  }
};

// ============================================================================
// LOCATION CATEGORIES FOR UI ORGANIZATION
// ============================================================================

export const LOCATION_CATEGORIES = {
  harbor: {
    name: "Harbor District",
    icon: '⚓',
    locations: ['fishing_pier', 'fish_market', 'captains_quarters', 'boat_dock', 'whale_watching'],
    description: "The heart of Port Fortune's maritime trade."
  },
  market: {
    name: "Market Square",
    icon: '🏪',
    locations: ['tackle_emporium', 'mystic_emporium', 'blacksmith_forge'],
    description: "Where gold changes hands and dreams become reality."
  },
  scholars: {
    name: "Scholar's Corner",
    icon: '📚',
    locations: ['maritime_museum', 'trophy_hall', 'leaderboard_tower', 'journal_archive', 'title_registry'],
    description: "Knowledge is power. And also points."
  },
  seaside: {
    name: "Seaside Attractions",
    icon: '🎡',
    locations: ['aquarium', 'breeding_lab', 'weather_station', 'event_pavilion'],
    description: "Entertainment and wonder by the water."
  },
  tavern: {
    name: "Tavern Row",
    icon: '🍺',
    locations: ['salty_barnacle', 'galley_kitchen', 'music_corner', 'memory_corner', 'timing_dock', 'quiz_masters_table', 'sorting_station'],
    description: "Where sailors unwind, stories are born, and games test your skills."
  }
};

// ============================================================================
// STORE INVENTORIES FOR EACH SHOP
// ============================================================================

export const STORE_INVENTORIES = {
  fish_market: {
    name: "Finley's Fish Market",
    buyItems: [
      { id: 'basic_bait', name: 'Basic Bait Pack', price: 10, icon: '🪱', description: 'Simple worms. Fish love em.', quantity: 10 },
      { id: 'premium_bait', name: 'Premium Bait Pack', price: 50, icon: '🦐', description: 'Shrimp bait attracts bigger fish.', quantity: 10 },
      { id: 'exotic_bait', name: 'Exotic Bait Pack', price: 150, icon: '🦑', description: 'Squid bait for the rarest catches.', quantity: 5 },
      { id: 'lucky_bait', name: 'Lucky Lure Bait', price: 300, icon: '🌟', description: 'Enchanted bait. +25% rare fish chance.', quantity: 3 },
      { id: 'fish_food', name: 'Premium Fish Food', price: 25, icon: '🥫', description: 'Keep your aquarium fish happy.', quantity: 20 },
      { id: 'ice_pack', name: 'Fish Preservation Ice', price: 15, icon: '🧊', description: 'Keep fish fresh longer.', quantity: 10 }
    ],
    sellMultiplier: 1.0,
    specialFeature: 'Daily fish price fluctuations'
  },
  
  tackle_emporium: {
    name: "Barnaby's Tackle Emporium",
    buyItems: [
      { id: 'bamboo_rod', name: 'Bamboo Rod', price: 100, icon: '🎋', description: 'Starter rod. Gets the job done.', stats: { power: 1 } },
      { id: 'oak_rod', name: 'Oak Rod', price: 300, icon: '🪵', description: 'Sturdy and reliable.', stats: { power: 2 } },
      { id: 'steel_rod', name: 'Steel Rod', price: 800, icon: '🔩', description: 'For serious fishers.', stats: { power: 3 } },
      { id: 'titanium_rod', name: 'Titanium Rod', price: 2000, icon: '⚡', description: 'Professional grade.', stats: { power: 5 } },
      { id: 'basic_reel', name: 'Basic Reel', price: 50, icon: '🔄', description: 'Standard fishing reel.', stats: { speed: 1 } },
      { id: 'fast_reel', name: 'Quick-Wind Reel', price: 200, icon: '💨', description: 'Faster retrieval.', stats: { speed: 2 } },
      { id: 'fishing_line_basic', name: 'Standard Line (100m)', price: 20, icon: '🧵', description: 'Durable fishing line.', quantity: 1 },
      { id: 'fishing_line_strong', name: 'Heavy Line (100m)', price: 75, icon: '🪢', description: 'For bigger catches.', quantity: 1 },
      { id: 'tackle_box_small', name: 'Small Tackle Box', price: 150, icon: '🧰', description: '+10 inventory slots.', slots: 10 },
      { id: 'tackle_box_large', name: 'Large Tackle Box', price: 500, icon: '📦', description: '+25 inventory slots.', slots: 25 },
      { id: 'fish_finder', name: 'Basic Fish Finder', price: 400, icon: '📡', description: 'Shows fish locations.', bonus: 'reveal_fish' },
      { id: 'lucky_hat', name: 'Lucky Fishing Hat', price: 250, icon: '🎩', description: '+10% rare fish chance.', bonus: 'luck_10' }
    ],
    sellMultiplier: 0.5,
    specialFeature: 'Equipment upgrades'
  },
  
  mystic_emporium: {
    name: "Madame Mystique's Emporium",
    buyItems: [
      { id: 'luck_potion', name: 'Potion of Fortune', price: 100, icon: '🍀', description: '+50% rare fish for 5 catches.', duration: 5 },
      { id: 'speed_potion', name: 'Swift Fin Elixir', price: 75, icon: '💨', description: 'Fish reel in 50% faster. 3 min.', duration: 180 },
      { id: 'vision_potion', name: 'Fish Sight Potion', price: 150, icon: '👁️', description: 'See all fish in area. 2 min.', duration: 120 },
      { id: 'magnet_potion', name: 'Fish Magnet Brew', price: 200, icon: '🧲', description: 'Fish bite instantly. 1 min.', duration: 60 },
      { id: 'golden_hook_enchant', name: 'Golden Hook Enchant', price: 500, icon: '✨', description: 'Permanent +5% gold from sales.', permanent: true },
      { id: 'preservation_charm', name: 'Preservation Charm', price: 300, icon: '❄️', description: 'Fish never spoil.', permanent: true },
      { id: 'weather_crystal', name: 'Weather Control Crystal', price: 1000, icon: '🌈', description: 'Change weather once per day.', uses: 1 },
      { id: 'teleport_stone', name: 'Waystone', price: 750, icon: '💎', description: 'Instant travel between locations.', uses: 10 },
      { id: 'mystery_box', name: 'Mystery Box', price: 100, icon: '🎁', description: 'Contains random item. Could be legendary!', random: true },
      { id: 'curse_removal', name: 'Curse Removal Service', price: 200, icon: '🙏', description: 'Remove bad luck effects.', service: true }
    ],
    sellMultiplier: 0.3,
    specialFeature: 'Fortune telling (hints)'
  },
  
  blacksmith_forge: {
    name: "Iron Ingrid's Forge",
    buyItems: [
      { id: 'rod_upgrade_1', name: 'Rod Reinforcement', price: 200, icon: '🔧', description: 'Upgrade rod +1 power.', upgrade: true },
      { id: 'rod_upgrade_2', name: 'Advanced Rod Upgrade', price: 500, icon: '⚙️', description: 'Upgrade rod +2 power.', upgrade: true },
      { id: 'hook_sharpening', name: 'Hook Sharpening', price: 50, icon: '📍', description: '+15% catch success.', service: true },
      { id: 'reel_oiling', name: 'Reel Maintenance', price: 30, icon: '🛢️', description: 'Restore reel durability.', service: true },
      { id: 'legendary_hook', name: 'Legendary Hook', price: 5000, icon: '🪝', description: 'Can catch legendary fish.', legendary: true },
      { id: 'unbreakable_line', name: 'Unbreakable Line', price: 3000, icon: '⛓️', description: 'Never breaks. Ever.', legendary: true },
      { id: 'weight_set', name: 'Precision Weight Set', price: 150, icon: '⚖️', description: 'Better depth control.', stats: { accuracy: 2 } },
      { id: 'anchor', name: 'Boat Anchor', price: 400, icon: '⚓', description: 'Required for boat fishing.', required: 'boat' }
    ],
    sellMultiplier: 0.4,
    specialFeature: 'Custom forging'
  },
  
  galley_kitchen: {
    name: "The Galley Kitchen",
    buyItems: [
      { id: 'recipe_basic', name: 'Basic Recipe Book', price: 100, icon: '📕', description: 'Learn 5 basic fish recipes.', recipes: 5 },
      { id: 'recipe_advanced', name: 'Gourmet Recipe Book', price: 500, icon: '📗', description: 'Learn 10 advanced recipes.', recipes: 10 },
      { id: 'spice_pack', name: 'Exotic Spice Pack', price: 75, icon: '🌶️', description: 'Improves dish quality.', quantity: 10 },
      { id: 'cooking_oil', name: 'Premium Cooking Oil', price: 25, icon: '🫒', description: 'Essential for frying.', quantity: 20 },
      { id: 'chef_hat', name: "Chef's Hat", price: 200, icon: '👨‍🍳', description: '+20% cooking success.', bonus: 'cooking_20' },
      { id: 'golden_pan', name: 'Golden Frying Pan', price: 1500, icon: '🍳', description: 'Dishes sell for 50% more.', bonus: 'value_50' },
      { id: 'fish_stew', name: 'Hearty Fish Stew', price: 50, icon: '🍲', description: 'Restores stamina fully.', consumable: true },
      { id: 'sushi_platter', name: 'Sushi Platter', price: 150, icon: '🍣', description: '+30% XP for 10 min.', consumable: true }
    ],
    sellMultiplier: 0.6,
    specialFeature: 'Cook fish into meals'
  },
  
  salty_barnacle: {
    name: "The Salty Barnacle",
    buyItems: [
      { id: 'grog', name: 'Pirate Grog', price: 5, icon: '🍺', description: 'Basic tavern drink.', consumable: true },
      { id: 'rum', name: "Captain's Rum", price: 25, icon: '🥃', description: '+10% charisma for 5 min.', consumable: true },
      { id: 'mystery_drink', name: 'Mystery Cocktail', price: 50, icon: '🍹', description: 'Random positive effect.', consumable: true },
      { id: 'fish_chips', name: 'Fish & Chips', price: 30, icon: '🍟', description: 'Tasty and filling.', consumable: true },
      { id: 'lobster_dinner', name: 'Lobster Dinner', price: 200, icon: '🦞', description: 'Full restore + XP boost.', consumable: true },
      { id: 'rumor', name: 'Buy a Rumor', price: 100, icon: '🗣️', description: 'Hint about treasure or fish.', information: true },
      { id: 'card_deck', name: 'Playing Card Deck', price: 50, icon: '🃏', description: 'Play card games.', minigame: true },
      { id: 'dice_set', name: 'Lucky Dice Set', price: 75, icon: '🎲', description: 'Play dice games.', minigame: true }
    ],
    sellMultiplier: 0.3,
    specialFeature: 'Mini-games and rumors'
  },
  
  aquarium_shop: {
    name: "Aquarium Gift Shop",
    buyItems: [
      { id: 'basic_tank', name: 'Basic Fish Tank', price: 200, icon: '🐟', description: 'Holds 5 display fish.', capacity: 5 },
      { id: 'large_tank', name: 'Large Aquarium', price: 800, icon: '🐠', description: 'Holds 15 display fish.', capacity: 15 },
      { id: 'reef_decoration', name: 'Coral Reef Decor', price: 100, icon: '🪸', description: '+10% fish happiness.', decoration: true },
      { id: 'treasure_chest_decor', name: 'Treasure Chest Decor', price: 150, icon: '💰', description: 'Attracts visitors.', decoration: true },
      { id: 'filter_basic', name: 'Basic Filter', price: 50, icon: '💧', description: 'Keeps water clean.', maintenance: true },
      { id: 'filter_advanced', name: 'Advanced Filter', price: 200, icon: '🌊', description: 'Perfect water quality.', maintenance: true },
      { id: 'breeding_license', name: 'Breeding License', price: 500, icon: '📋', description: 'Required to breed fish.', license: true },
      { id: 'rare_egg', name: 'Mystery Fish Egg', price: 1000, icon: '🥚', description: 'Hatches into rare fish.', breeding: true }
    ],
    sellMultiplier: 0.5,
    specialFeature: 'Display and breed fish'
  },
  
  event_pavilion: {
    name: "Festival Pavilion Shop",
    buyItems: [
      { id: 'event_ticket', name: 'Event Entry Ticket', price: 50, icon: '🎟️', description: 'Access special events.', event: true },
      { id: 'tournament_entry', name: 'Tournament Entry', price: 100, icon: '🏆', description: 'Enter fishing tournament.', event: true },
      { id: 'seasonal_bait', name: 'Seasonal Special Bait', price: 200, icon: '🎃', description: 'Catches seasonal fish.', seasonal: true },
      { id: 'fireworks', name: 'Celebration Fireworks', price: 75, icon: '🎆', description: 'Attract rare fish at night.', consumable: true },
      { id: 'festival_hat', name: 'Festival Hat', price: 300, icon: '🎭', description: 'Double event rewards.', bonus: 'event_2x' },
      { id: 'confetti_cannon', name: 'Confetti Cannon', price: 50, icon: '🎊', description: 'Celebrate your catches!', cosmetic: true }
    ],
    sellMultiplier: 0.2,
    specialFeature: 'Seasonal items'
  }
};

// ============================================================================
// NPC SHOP KEEPERS DATA
// ============================================================================

export const SHOP_NPCS = {
  finley_scales: {
    shop: 'fish_market',
    greeting: "FISH! FRESH FISH! Oh, a customer! You look like someone who appreciates QUALITY FISH!",
    farewell: "Come back soon! The fish won't sell themselves! Well, they might try, but they're fish!",
    personality: 'enthusiastic'
  },
  barnaby_hooks: {
    shop: 'tackle_emporium',
    greeting: "Welcome to Barnaby's! Lost three fingers to this trade, but I've still got seven to help you!",
    farewell: "May your line stay tight and your hooks stay sharp! ...Unlike my fingers.",
    personality: 'helpful'
  },
  madame_mystique: {
    shop: 'mystic_emporium',
    greeting: "*mysterious fog appears* I foresaw your arrival... and that you would buy something expensive.",
    farewell: "The spirits guide your path... mostly toward more purchases. Return soon!",
    personality: 'mysterious'
  },
  martha_anvil: {
    shop: 'blacksmith_forge',
    greeting: "What needs fixin'? Speak up, I've heard too many anvils to hear quiet voices.",
    farewell: "Don't break what I just fixed. Or do. More business for me.",
    personality: 'gruff'
  },
  chef_crustacean: {
    shop: 'galley_kitchen',
    greeting: "AH! Another hungry soul! My kitchen awaits! The fish fear my pan! AS THEY SHOULD!",
    farewell: "Return when you're hungry! I'll be here, creating MASTERPIECES!",
    personality: 'passionate'
  },
  rosie_stormglass: {
    shop: 'salty_barnacle',
    greeting: "Well, well! Pull up a chair. Drinks are cold, food's hot, and secrets are... negotiable.",
    farewell: "Don't be a stranger. And if you hear anything interesting, you know where to find me.",
    personality: 'shrewd'
  },
  curator_coral: {
    shop: 'aquarium_shop',
    greeting: "Welcome to the Grand Aquarium! Every fish here has a story. Shall I introduce you?",
    farewell: "Visit the exhibits before you go! And consider adopting a fish. They make wonderful companions.",
    personality: 'caring'
  },
  event_coordinator_eva: {
    shop: 'event_pavilion',
    greeting: "OH! A visitor! Are you here for the event? Which event? ALL THE EVENTS! There's so much happening!",
    farewell: "Mark your calendar! Or don't, I'll remind you! CONSTANTLY! Bye for now!",
    personality: 'hyperactive'
  }
};

export default {
  INTEGRATED_LOCATIONS,
  LOCATION_CATEGORIES,
  STORE_INVENTORIES,
  SHOP_NPCS
};
