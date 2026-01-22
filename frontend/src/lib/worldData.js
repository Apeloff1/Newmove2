/**
 * OPEN WORLD PIRATE RPG - EXPANDED WORLD DATA
 * Part 1: Regions, Cities, and Locations
 * 
 * The Seven Seas contain:
 * - 5 Major Regions
 * - 12 Cities/Towns
 * - 50+ Locations
 * - 125+ NPCs
 */

// ============================================================================
// WORLD REGIONS
// ============================================================================

export const WORLD_REGIONS = {
  saltbeard_cove: {
    id: 'saltbeard_cove',
    name: "Saltbeard's Cove",
    description: "The starting region. A bustling pirate haven with a rich history.",
    icon: '🏴‍☠️',
    theme: 'pirate_classic',
    dangerLevel: 1,
    cities: ['port_fortune'],
    locations: ['harbor_square', 'docks', 'lighthouse', 'smugglers_cave', 'mermaid_lagoon'],
    unlockRequirement: null
  },
  
  coral_archipelago: {
    id: 'coral_archipelago',
    name: "Coral Archipelago",
    description: "A chain of tropical islands teeming with exotic fish and ancient ruins.",
    icon: '🏝️',
    theme: 'tropical',
    dangerLevel: 2,
    cities: ['coral_city', 'palm_haven'],
    locations: ['rainbow_reef', 'sunken_temple', 'turtle_beach', 'volcano_isle'],
    unlockRequirement: { level: 5, quest: 'first_voyage' }
  },
  
  frozen_north: {
    id: 'frozen_north',
    name: "The Frozen North",
    description: "Icy waters where only the hardiest sailors venture. Legendary fish swim here.",
    icon: '❄️',
    theme: 'arctic',
    dangerLevel: 4,
    cities: ['frostport', 'glacier_outpost'],
    locations: ['iceberg_maze', 'frozen_caverns', 'whale_graveyard', 'aurora_fishing_grounds'],
    unlockRequirement: { level: 15, quest: 'northern_passage' }
  },
  
  cursed_waters: {
    id: 'cursed_waters',
    name: "The Cursed Waters",
    description: "Haunted seas where ghost ships sail and cursed treasures await.",
    icon: '👻',
    theme: 'spooky',
    dangerLevel: 5,
    cities: ['shadow_port'],
    locations: ['ghost_ship_graveyard', 'skeleton_isle', 'kraken_depths', 'cursed_lighthouse'],
    unlockRequirement: { level: 25, quest: 'face_your_fears' }
  },
  
  golden_empire: {
    id: 'golden_empire',
    name: "The Golden Empire",
    description: "Rich merchant kingdoms with the finest goods and fiercest competition.",
    icon: '👑',
    theme: 'wealthy',
    dangerLevel: 3,
    cities: ['grand_bazaar', 'noble_harbor', 'trade_winds_port'],
    locations: ['emperors_fishing_grounds', 'jade_lagoon', 'silk_road_docks', 'treasury_island'],
    unlockRequirement: { level: 10, reputation: { merchants: 3 } }
  }
};

// ============================================================================
// CITIES & TOWNS
// ============================================================================

export const WORLD_CITIES = {
  // SALTBEARD'S COVE REGION
  port_fortune: {
    id: 'port_fortune',
    name: "Port Fortune",
    region: 'saltbeard_cove',
    description: "The main hub of Saltbeard's Cove. Pirates, merchants, and dreamers all find their way here.",
    population: 5000,
    icon: '🏴‍☠️',
    ambiance: 'bustling_pirate',
    districts: ['harbor_district', 'market_square', 'tavern_row', 'residential', 'governors_hill'],
    stores: ['general_store', 'bait_shop', 'fish_market', 'tavern', 'blacksmith'],
    services: ['inn', 'bank', 'bounty_board', 'ship_repairs'],
    specialFeatures: ['pirate_auction', 'underground_fighting']
  },
  
  // CORAL ARCHIPELAGO REGION
  coral_city: {
    id: 'coral_city',
    name: "Coral City",
    region: 'coral_archipelago',
    description: "A vibrant city built on and around living coral reefs. Half above water, half below.",
    population: 3000,
    icon: '🪸',
    ambiance: 'tropical_magical',
    districts: ['upper_reef', 'lower_reef', 'pearl_district', 'tourist_beach'],
    stores: ['exotic_fish_emporium', 'pearl_trader', 'coral_crafts', 'tropical_outfitter'],
    services: ['diving_school', 'mermaid_embassy', 'reef_tours'],
    specialFeatures: ['underwater_market', 'bioluminescent_nightlife']
  },
  
  palm_haven: {
    id: 'palm_haven',
    name: "Palm Haven",
    region: 'coral_archipelago', 
    description: "A peaceful resort town where wealthy pirates retire. Very relaxed. Very expensive.",
    population: 800,
    icon: '🌴',
    ambiance: 'luxury_tropical',
    districts: ['beach_villas', 'spa_quarter', 'yacht_club'],
    stores: ['luxury_goods', 'fine_dining', 'exclusive_tackle'],
    services: ['spa', 'yacht_rentals', 'personal_chef'],
    specialFeatures: ['retired_pirate_stories', 'secret_treasure_maps']
  },
  
  // FROZEN NORTH REGION
  frostport: {
    id: 'frostport',
    name: "Frostport",
    region: 'frozen_north',
    description: "A hardy settlement that thrives despite the eternal cold. Known for ice fishing expertise.",
    population: 1500,
    icon: '🏔️',
    ambiance: 'arctic_survival',
    districts: ['warming_hall', 'ice_docks', 'fur_market', 'hunters_lodge'],
    stores: ['fur_trader', 'ice_fishing_supplies', 'warming_potions', 'sled_dogs'],
    services: ['ice_breaker_hire', 'guide_services', 'thermal_baths'],
    specialFeatures: ['aurora_viewing', 'ice_sculpture_contest']
  },
  
  glacier_outpost: {
    id: 'glacier_outpost',
    name: "Glacier Outpost",
    region: 'frozen_north',
    description: "The last stop before the endless ice. Only the brave come here.",
    population: 200,
    icon: '🧊',
    ambiance: 'extreme_frontier',
    districts: ['survival_camp', 'expedition_base'],
    stores: ['expedition_supplies', 'emergency_gear'],
    services: ['rescue_team', 'map_maker'],
    specialFeatures: ['legendary_fish_sightings', 'ancient_ice_caves']
  },
  
  // CURSED WATERS REGION
  shadow_port: {
    id: 'shadow_port',
    name: "Shadow Port",
    region: 'cursed_waters',
    description: "A city that exists between life and death. The living and the dead trade here.",
    population: '???',
    icon: '💀',
    ambiance: 'ghostly',
    districts: ['living_quarter', 'spirit_market', 'bone_yard', 'veil_crossing'],
    stores: ['cursed_artifacts', 'ghost_bait', 'necromancer_supplies', 'soul_trader'],
    services: ['medium_services', 'curse_removal', 'ghost_ship_tours'],
    specialFeatures: ['speak_with_dead', 'cursed_treasure_hunts']
  },
  
  // GOLDEN EMPIRE REGION
  grand_bazaar: {
    id: 'grand_bazaar',
    name: "The Grand Bazaar",
    region: 'golden_empire',
    description: "The largest marketplace in the Seven Seas. If it exists, it's sold here.",
    population: 15000,
    icon: '🏛️',
    ambiance: 'wealthy_exotic',
    districts: ['silk_row', 'spice_quarter', 'jewel_market', 'exotic_pets', 'black_market'],
    stores: ['everything'], // Special - has all store types
    services: ['banking_houses', 'insurance', 'shipping', 'customs'],
    specialFeatures: ['auction_house', 'rare_fish_competition']
  },
  
  noble_harbor: {
    id: 'noble_harbor',
    name: "Noble Harbor",
    region: 'golden_empire',
    description: "Where the aristocracy keeps their yachts. Exclusive, expensive, and extraordinarily snooty.",
    population: 2000,
    icon: '⚜️',
    ambiance: 'aristocratic',
    districts: ['royal_marina', 'noble_estates', 'officers_club'],
    stores: ['prestigious_outfitter', 'royal_fishmonger', 'aristocrat_accessories'],
    services: ['butler_hire', 'yacht_club', 'nobility_registration'],
    specialFeatures: ['royal_fishing_tournament', 'secret_society']
  },
  
  trade_winds_port: {
    id: 'trade_winds_port',
    name: "Trade Winds Port",
    region: 'golden_empire',
    description: "The commercial heart of the empire. Ships from every nation dock here.",
    population: 8000,
    icon: '⛵',
    ambiance: 'international_trade',
    districts: ['foreign_quarters', 'warehouse_district', 'trading_floor', 'sailors_rest'],
    stores: ['international_goods', 'bulk_fish_market', 'ship_chandlery', 'import_export'],
    services: ['customs', 'translation', 'international_banking', 'shipping_contracts'],
    specialFeatures: ['trade_route_missions', 'diplomatic_quests']
  }
};

// ============================================================================
// STORES & SHOPS
// ============================================================================

export const STORE_TYPES = {
  general_store: {
    id: 'general_store',
    name: "General Store",
    icon: '🏪',
    description: "Basic supplies for the everyday adventurer.",
    categories: ['supplies', 'tools', 'consumables'],
    priceModifier: 1.0
  },
  
  bait_shop: {
    id: 'bait_shop',
    name: "Bait & Tackle",
    icon: '🪱',
    description: "Everything you need to catch fish.",
    categories: ['bait', 'lures', 'fishing_gear', 'rods'],
    priceModifier: 1.0
  },
  
  fish_market: {
    id: 'fish_market',
    name: "Fish Market",
    icon: '🐟',
    description: "Buy and sell fish. Fresh daily!",
    categories: ['fish', 'seafood', 'fish_recipes'],
    priceModifier: 0.9, // Slightly better prices for fish
    specialFeature: 'sell_fish'
  },
  
  tavern: {
    id: 'tavern',
    name: "Tavern",
    icon: '🍺',
    description: "Drinks, food, and rumors.",
    categories: ['drinks', 'food', 'rumors'],
    priceModifier: 1.2,
    specialFeature: 'gather_rumors'
  },
  
  blacksmith: {
    id: 'blacksmith',
    name: "Blacksmith",
    icon: '⚒️',
    description: "Metal goods and repairs.",
    categories: ['tools', 'weapons', 'repairs', 'upgrades'],
    priceModifier: 1.1,
    specialFeature: 'upgrade_equipment'
  },
  
  exotic_fish_emporium: {
    id: 'exotic_fish_emporium',
    name: "Exotic Fish Emporium",
    icon: '🐠',
    description: "Rare and unusual aquatic specimens.",
    categories: ['exotic_fish', 'rare_bait', 'aquarium_supplies'],
    priceModifier: 1.5,
    specialFeature: 'special_orders'
  },
  
  pearl_trader: {
    id: 'pearl_trader',
    name: "Pearl Trader",
    icon: '🫧',
    description: "Pearls, shells, and ocean treasures.",
    categories: ['pearls', 'shells', 'jewelry', 'treasures'],
    priceModifier: 1.3
  },
  
  cursed_artifacts: {
    id: 'cursed_artifacts',
    name: "Ye Olde Cursed Shoppe",
    icon: '💀',
    description: "Dangerous items. No refunds. No returns. No survivors... just kidding. Mostly.",
    categories: ['cursed_items', 'dark_magic', 'ghost_supplies'],
    priceModifier: 2.0,
    specialFeature: 'curse_identification'
  },
  
  luxury_goods: {
    id: 'luxury_goods',
    name: "Luxury Emporium",
    icon: '💎',
    description: "Only the finest for those who can afford it.",
    categories: ['luxury', 'rare_items', 'prestige_goods'],
    priceModifier: 3.0,
    specialFeature: 'exclusive_items'
  },
  
  potion_shop: {
    id: 'potion_shop',
    name: "Mystic Potions",
    icon: '🧪',
    description: "Magical brews and enchanted elixirs.",
    categories: ['potions', 'ingredients', 'enchantments'],
    priceModifier: 1.4,
    specialFeature: 'custom_brewing'
  },
  
  ship_chandlery: {
    id: 'ship_chandlery',
    name: "Ship Chandlery",
    icon: '⚓',
    description: "Everything for your vessel.",
    categories: ['ship_supplies', 'navigation', 'repairs', 'upgrades'],
    priceModifier: 1.2,
    specialFeature: 'ship_customization'
  }
};

// ============================================================================
// SHOP INVENTORIES (Sample Items)
// ============================================================================

export const SHOP_ITEMS = {
  // Basic Supplies
  basic_supplies: [
    { id: 'rope', name: 'Rope (50ft)', price: 10, icon: '🪢', category: 'supplies' },
    { id: 'lantern', name: 'Oil Lantern', price: 25, icon: '🏮', category: 'supplies' },
    { id: 'compass', name: 'Basic Compass', price: 50, icon: '🧭', category: 'tools' },
    { id: 'map_kit', name: 'Cartography Kit', price: 100, icon: '🗺️', category: 'tools' },
    { id: 'rations', name: 'Trail Rations (7 days)', price: 15, icon: '🍖', category: 'consumables' },
    { id: 'water_flask', name: 'Water Flask', price: 5, icon: '🫗', category: 'supplies' },
    { id: 'first_aid', name: 'First Aid Kit', price: 30, icon: '🩹', category: 'consumables' },
    { id: 'fishing_net', name: 'Fishing Net', price: 40, icon: '🕸️', category: 'tools' }
  ],
  
  // Bait & Tackle
  bait_tackle: [
    { id: 'worms', name: 'Fresh Worms', price: 5, icon: '🪱', category: 'bait', effectiveness: 1.0 },
    { id: 'minnows', name: 'Live Minnows', price: 15, icon: '🐟', category: 'bait', effectiveness: 1.3 },
    { id: 'shrimp', name: 'Fresh Shrimp', price: 20, icon: '🦐', category: 'bait', effectiveness: 1.5 },
    { id: 'squid', name: 'Squid Strips', price: 35, icon: '🦑', category: 'bait', effectiveness: 1.8 },
    { id: 'magic_bait', name: 'Enchanted Bait', price: 100, icon: '✨', category: 'bait', effectiveness: 2.5 },
    { id: 'basic_lure', name: 'Basic Lure', price: 25, icon: '🎣', category: 'lures', durability: 10 },
    { id: 'spinner', name: 'Spinner Lure', price: 50, icon: '🌀', category: 'lures', durability: 20 },
    { id: 'golden_lure', name: 'Golden Lure', price: 500, icon: '🌟', category: 'lures', durability: 100 }
  ],
  
  // Fishing Rods
  fishing_rods: [
    { id: 'bamboo_rod', name: 'Bamboo Rod', price: 50, icon: '🎋', category: 'rods', power: 1, durability: 50 },
    { id: 'oak_rod', name: 'Oak Rod', price: 150, icon: '🪵', category: 'rods', power: 2, durability: 100 },
    { id: 'steel_rod', name: 'Steel Rod', price: 400, icon: '🔩', category: 'rods', power: 3, durability: 200 },
    { id: 'master_rod', name: "Master's Rod", price: 1000, icon: '⚡', category: 'rods', power: 5, durability: 500 },
    { id: 'legendary_rod', name: "Poseidon's Trident Rod", price: 10000, icon: '🔱', category: 'rods', power: 10, durability: 1000 }
  ],
  
  // Potions
  potions: [
    { id: 'health_potion', name: 'Health Tonic', price: 50, icon: '❤️', category: 'potions', effect: 'restore_health' },
    { id: 'luck_potion', name: 'Lucky Brew', price: 100, icon: '🍀', category: 'potions', effect: 'boost_luck', duration: 30 },
    { id: 'speed_potion', name: 'Swift Fin Elixir', price: 75, icon: '💨', category: 'potions', effect: 'boost_speed', duration: 20 },
    { id: 'vision_potion', name: 'Fish Sight Potion', price: 150, icon: '👁️', category: 'potions', effect: 'see_fish', duration: 15 },
    { id: 'breathing_potion', name: 'Water Breathing', price: 200, icon: '🫧', category: 'potions', effect: 'underwater_breathing', duration: 60 },
    { id: 'strength_potion', name: 'Kraken Strength', price: 250, icon: '💪', category: 'potions', effect: 'boost_strength', duration: 10 }
  ],
  
  // Food & Drinks
  food_drinks: [
    { id: 'grog', name: 'Pirate Grog', price: 5, icon: '🍺', category: 'drinks', effect: 'restore_stamina_small' },
    { id: 'rum', name: "Captain's Rum", price: 15, icon: '🥃', category: 'drinks', effect: 'boost_charisma', duration: 10 },
    { id: 'fish_stew', name: 'Hearty Fish Stew', price: 20, icon: '🍲', category: 'food', effect: 'restore_health_medium' },
    { id: 'grilled_fish', name: 'Grilled Fish', price: 10, icon: '🐟', category: 'food', effect: 'restore_stamina' },
    { id: 'lobster', name: 'Butter Lobster', price: 100, icon: '🦞', category: 'food', effect: 'restore_all_medium' },
    { id: 'mystery_meat', name: 'Mystery Meat', price: 3, icon: '🍖', category: 'food', effect: 'random' }
  ]
};

// ============================================================================
// LOCATION TEMPLATES
// ============================================================================

export const LOCATION_TYPES = {
  city: { icon: '🏘️', canFish: false, hasShops: true, hasNPCs: true },
  harbor: { icon: '⚓', canFish: true, hasShops: true, hasNPCs: true },
  fishing_spot: { icon: '🎣', canFish: true, hasShops: false, hasNPCs: false },
  cave: { icon: '🕳️', canFish: true, hasShops: false, hasNPCs: true },
  ruins: { icon: '🏛️', canFish: false, hasShops: false, hasNPCs: true },
  island: { icon: '🏝️', canFish: true, hasShops: false, hasNPCs: true },
  ship: { icon: '🚢', canFish: true, hasShops: true, hasNPCs: true },
  underwater: { icon: '🌊', canFish: true, hasShops: false, hasNPCs: true }
};

export default {
  WORLD_REGIONS,
  WORLD_CITIES,
  STORE_TYPES,
  SHOP_ITEMS,
  LOCATION_TYPES
};
