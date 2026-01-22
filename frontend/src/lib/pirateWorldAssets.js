/**
 * ============================================================================
 * PIRATE WORLD ASSETS - 3000+ Lines of Open World Content
 * ============================================================================
 * Comprehensive pirate-themed assets including:
 * - 5 Major Regions with progressive difficulty
 * - Ships, ports, islands, houses, shops
 * - World travel items and navigation
 * - NPC distribution by region and difficulty
 * - Map legend system
 * - Interactive open world elements
 * ============================================================================
 */

// ============================================================================
// SECTION 1: WORLD REGIONS - 5 Major Areas with Progressive Difficulty
// ============================================================================

export const WORLD_REGIONS = {
  // Region 1: Starter Area (Difficulty 1-20)
  barnacle_bay: {
    id: 'barnacle_bay',
    name: 'Barnacle Bay',
    subtitle: 'The Beginner\'s Harbor',
    difficulty: { min: 1, max: 20, recommended: 1 },
    description: 'A peaceful cove where new adventurers learn the ropes. Friendly NPCs, easy fish, and minimal danger.',
    icon: '🏖️',
    color: '#4A90D9',
    unlocked: true,
    mapPosition: { x: 20, y: 60 },
    weather: ['sunny', 'cloudy', 'light_rain'],
    timeZone: 'tropical',
    music: 'peaceful_harbor',
    ambientSounds: ['seagulls', 'waves_gentle', 'market_chatter'],
    locations: [
      'harbor_square', 'docks', 'salty_barnacle_tavern', 
      'merchant_quarter', 'fisherman_village', 'sandy_beach'
    ],
    connectedRegions: ['coral_archipelago', 'merchants_route'],
    travelMethods: ['rowboat', 'ferry', 'swimming'],
    resources: {
      fish: ['common', 'uncommon'],
      treasures: ['copper_coins', 'seashells', 'driftwood'],
      materials: ['wood', 'rope', 'cloth']
    },
    dangers: [],
    features: [
      'Tutorial area',
      'Basic shops',
      'Friendly NPCs',
      'Safe fishing spots',
      'Beginner quests'
    ]
  },

  // Region 2: Intermediate Area (Difficulty 15-40)
  coral_archipelago: {
    id: 'coral_archipelago',
    name: 'Coral Archipelago',
    subtitle: 'The Rainbow Reefs',
    difficulty: { min: 15, max: 40, recommended: 20 },
    description: 'A chain of vibrant coral islands with exotic fish, underwater caves, and the mysterious Mermaid Lagoon.',
    icon: '🪸',
    color: '#FF6B9D',
    unlocked: false,
    unlockRequirement: { level: 10, quest: 'prove_your_worth' },
    mapPosition: { x: 45, y: 40 },
    weather: ['sunny', 'tropical_storm', 'rainbow'],
    timeZone: 'tropical',
    music: 'island_paradise',
    ambientSounds: ['tropical_birds', 'waves_medium', 'underwater_bubbles'],
    locations: [
      'mermaid_lagoon', 'rainbow_reef', 'turtle_beach', 
      'sunken_temple', 'palm_haven', 'coral_city'
    ],
    connectedRegions: ['barnacle_bay', 'golden_trade_route', 'cursed_waters'],
    travelMethods: ['sailing_ship', 'diving', 'sea_turtle_ride'],
    resources: {
      fish: ['uncommon', 'rare', 'exotic'],
      treasures: ['pearls', 'coral_gems', 'ancient_coins'],
      materials: ['coral', 'pearl_dust', 'sea_silk']
    },
    dangers: ['reef_sharks', 'jellyfish', 'riptides'],
    features: [
      'Underwater exploration',
      'Exotic fish species',
      'Mermaid encounters',
      'Diving mechanics',
      'Pearl diving'
    ]
  },

  // Region 3: Mid-Game Area (Difficulty 35-60)
  golden_trade_route: {
    id: 'golden_trade_route',
    name: 'Golden Trade Route',
    subtitle: 'The Merchant\'s Highway',
    difficulty: { min: 35, max: 60, recommended: 40 },
    description: 'Bustling trade ports, wealthy merchants, and cunning pirates. Fortune favors the bold here.',
    icon: '💰',
    color: '#FFD700',
    unlocked: false,
    unlockRequirement: { level: 25, gold: 5000, reputation: 'trusted' },
    mapPosition: { x: 70, y: 30 },
    weather: ['sunny', 'foggy', 'stormy'],
    timeZone: 'temperate',
    music: 'merchant_bustle',
    ambientSounds: ['ship_bells', 'market_noise', 'coin_clinking'],
    locations: [
      'grand_bazaar', 'noble_harbor', 'trade_winds_port',
      'auction_house', 'smugglers_den', 'merchant_guild'
    ],
    connectedRegions: ['coral_archipelago', 'frozen_north', 'cursed_waters'],
    travelMethods: ['merchant_ship', 'caravan', 'teleport_scroll'],
    resources: {
      fish: ['rare', 'legendary', 'golden'],
      treasures: ['gold_bars', 'gems', 'artifacts'],
      materials: ['silk', 'spices', 'rare_metals']
    },
    dangers: ['pirates', 'thieves', 'corrupt_guards'],
    features: [
      'Trading system',
      'Auction mechanics',
      'Reputation system',
      'Ship purchasing',
      'Smuggling quests'
    ]
  },

  // Region 4: Advanced Area (Difficulty 55-80)
  frozen_north: {
    id: 'frozen_north',
    name: 'Frozen North',
    subtitle: 'The Ice Fisher\'s Trial',
    difficulty: { min: 55, max: 80, recommended: 60 },
    description: 'Treacherous ice floes, legendary arctic fish, and the secrets of the Northern Lights. Only the strong survive.',
    icon: '❄️',
    color: '#87CEEB',
    unlocked: false,
    unlockRequirement: { level: 40, item: 'arctic_coat', quest: 'northern_passage' },
    mapPosition: { x: 50, y: 10 },
    weather: ['blizzard', 'aurora', 'ice_storm', 'clear_cold'],
    timeZone: 'arctic',
    music: 'frozen_wilderness',
    ambientSounds: ['howling_wind', 'cracking_ice', 'wolf_howls'],
    locations: [
      'frostport', 'glacier_outpost', 'ice_fishing_grounds',
      'aurora_peak', 'frozen_caverns', 'whale_graveyard'
    ],
    connectedRegions: ['golden_trade_route', 'cursed_waters'],
    travelMethods: ['ice_breaker_ship', 'dog_sled', 'ice_skating'],
    resources: {
      fish: ['legendary', 'mythical', 'ice_variants'],
      treasures: ['frozen_gems', 'mammoth_ivory', 'aurora_crystals'],
      materials: ['ice_steel', 'polar_fur', 'permafrost']
    },
    dangers: ['hypothermia', 'polar_bears', 'ice_cracks', 'blizzards'],
    features: [
      'Ice fishing mechanics',
      'Survival elements',
      'Aurora fishing bonus',
      'Legendary fish spawns',
      'Viking lore'
    ]
  },

  // Region 5: End-Game Area (Difficulty 75-100)
  cursed_waters: {
    id: 'cursed_waters',
    name: 'Cursed Waters',
    subtitle: 'The Realm of the Damned',
    difficulty: { min: 75, max: 100, recommended: 80 },
    description: 'Ghost ships, undead pirates, and fish that shouldn\'t exist. The final frontier for legendary anglers.',
    icon: '💀',
    color: '#800080',
    unlocked: false,
    unlockRequirement: { level: 60, quest: 'lift_the_curse', item: 'ghostly_compass' },
    mapPosition: { x: 80, y: 70 },
    weather: ['eternal_fog', 'green_storm', 'blood_moon', 'spirit_rain'],
    timeZone: 'cursed',
    music: 'haunted_seas',
    ambientSounds: ['ghostly_wails', 'chains_rattling', 'spectral_whispers'],
    locations: [
      'ghost_ship_graveyard', 'skeleton_isle', 'kraken_depths',
      'shadow_port', 'cursed_lighthouse', 'davy_jones_locker'
    ],
    connectedRegions: ['coral_archipelago', 'golden_trade_route', 'frozen_north'],
    travelMethods: ['ghost_ship', 'spectral_portal', 'kraken_summon'],
    resources: {
      fish: ['mythical', 'cursed', 'spectral', 'abyssal'],
      treasures: ['cursed_gold', 'soul_gems', 'legendary_artifacts'],
      materials: ['ectoplasm', 'void_essence', 'cursed_coral']
    },
    dangers: ['ghost_pirates', 'kraken', 'curse_effects', 'soul_drain'],
    features: [
      'Ghost NPC interactions',
      'Curse mechanics',
      'Ultimate boss fights',
      'Legendary equipment',
      'True ending content'
    ]
  }
};

// ============================================================================
// SECTION 2: MAP LEGEND SYSTEM
// ============================================================================

export const MAP_LEGEND = {
  // Location markers
  locations: {
    town: { icon: '🏘️', name: 'Town', description: 'Settlement with shops and NPCs', color: '#8B4513' },
    port: { icon: '⚓', name: 'Port', description: 'Harbor for ships and trade', color: '#1E90FF' },
    fishing_spot: { icon: '🎣', name: 'Fishing Spot', description: 'Prime fishing location', color: '#32CD32' },
    dungeon: { icon: '🏚️', name: 'Dungeon', description: 'Dangerous area with rewards', color: '#8B0000' },
    treasure: { icon: '💎', name: 'Treasure', description: 'Hidden treasure location', color: '#FFD700' },
    boss: { icon: '💀', name: 'Boss Area', description: 'Powerful enemy territory', color: '#FF4500' },
    safe_zone: { icon: '🏠', name: 'Safe Zone', description: 'No enemies, rest area', color: '#90EE90' },
    shop: { icon: '🏪', name: 'Shop', description: 'Buy and sell items', color: '#DDA0DD' },
    tavern: { icon: '🍺', name: 'Tavern', description: 'Rest, rumors, minigames', color: '#D2691E' },
    guild: { icon: '⚔️', name: 'Guild Hall', description: 'Join guilds, get quests', color: '#4169E1' },
    shrine: { icon: '⛩️', name: 'Shrine', description: 'Save point, buffs', color: '#FF69B4' },
    lighthouse: { icon: '🗼', name: 'Lighthouse', description: 'Navigation point', color: '#FFFF00' },
    shipyard: { icon: '🚢', name: 'Shipyard', description: 'Buy/upgrade ships', color: '#2F4F4F' },
  },

  // NPC markers
  npcs: {
    quest_available: { icon: '❗', name: 'Quest Available', description: 'NPC has a new quest', color: '#FFD700' },
    quest_complete: { icon: '❓', name: 'Quest Ready', description: 'Quest can be turned in', color: '#00FF00' },
    merchant: { icon: '💰', name: 'Merchant', description: 'Sells goods', color: '#FFD700' },
    trainer: { icon: '📚', name: 'Trainer', description: 'Teaches skills', color: '#9370DB' },
    healer: { icon: '💚', name: 'Healer', description: 'Restores health', color: '#00FF00' },
    quest_giver: { icon: '📜', name: 'Quest Giver', description: 'Offers quests', color: '#FF8C00' },
    companion: { icon: '🤝', name: 'Companion', description: 'Can join your crew', color: '#FF69B4' },
    enemy: { icon: '👹', name: 'Hostile', description: 'Will attack on sight', color: '#FF0000' },
    neutral: { icon: '😐', name: 'Neutral', description: 'Non-hostile NPC', color: '#808080' },
    friendly: { icon: '😊', name: 'Friendly', description: 'Helpful NPC', color: '#32CD32' },
    romance: { icon: '💕', name: 'Romanceable', description: 'Can develop relationship', color: '#FF1493' },
  },

  // Resource markers
  resources: {
    fish_common: { icon: '🐟', name: 'Common Fish', description: 'Easy to catch fish', color: '#808080' },
    fish_rare: { icon: '🐠', name: 'Rare Fish', description: 'Uncommon fish species', color: '#00BFFF' },
    fish_legendary: { icon: '🐡', name: 'Legendary Fish', description: 'Extremely rare fish', color: '#FFD700' },
    treasure_chest: { icon: '📦', name: 'Treasure Chest', description: 'Contains loot', color: '#8B4513' },
    ore_node: { icon: '⛏️', name: 'Ore Node', description: 'Mining spot', color: '#A0522D' },
    herb_patch: { icon: '🌿', name: 'Herb Patch', description: 'Gather herbs', color: '#228B22' },
    pearl_oyster: { icon: '🦪', name: 'Pearl Oyster', description: 'Pearl diving spot', color: '#FFF8DC' },
  },

  // Travel markers
  travel: {
    ship_route: { icon: '🚢', name: 'Ship Route', description: 'Regular ship service', color: '#4169E1', lineStyle: 'dashed' },
    ferry: { icon: '⛴️', name: 'Ferry', description: 'Short distance travel', color: '#20B2AA', lineStyle: 'solid' },
    portal: { icon: '🌀', name: 'Portal', description: 'Instant teleport', color: '#9400D3', lineStyle: 'dotted' },
    bridge: { icon: '🌉', name: 'Bridge', description: 'Land crossing', color: '#8B4513', lineStyle: 'solid' },
    underwater_tunnel: { icon: '🌊', name: 'Tunnel', description: 'Underwater passage', color: '#00CED1', lineStyle: 'wavy' },
  },

  // Danger markers
  dangers: {
    whirlpool: { icon: '🌀', name: 'Whirlpool', description: 'Dangerous waters', color: '#4169E1' },
    rocks: { icon: '🪨', name: 'Rocky Shoals', description: 'Ship hazard', color: '#696969' },
    sea_monster: { icon: '🐙', name: 'Sea Monster', description: 'Monster territory', color: '#8B0000' },
    pirates: { icon: '🏴‍☠️', name: 'Pirate Waters', description: 'Pirate activity', color: '#000000' },
    storm_zone: { icon: '⛈️', name: 'Storm Zone', description: 'Permanent storms', color: '#483D8B' },
    cursed_area: { icon: '☠️', name: 'Cursed', description: 'Supernatural danger', color: '#800080' },
  },

  // Special markers
  special: {
    event: { icon: '🎉', name: 'Event', description: 'Special event active', color: '#FF00FF' },
    boss_spawn: { icon: '👑', name: 'Boss Spawn', description: 'World boss location', color: '#FFD700' },
    hidden_area: { icon: '❔', name: 'Hidden', description: 'Secret location', color: '#A9A9A9' },
    daily_special: { icon: '⭐', name: 'Daily Special', description: 'Daily bonus location', color: '#FFD700' },
    competition: { icon: '🏆', name: 'Competition', description: 'Fishing competition', color: '#FF8C00' },
  }
};

// ============================================================================
// SECTION 3: SHIPS - Various vessels for world travel
// ============================================================================

export const SHIPS = {
  // Starter ships
  rowboat: {
    id: 'rowboat',
    name: 'Rickety Rowboat',
    description: 'Barely floats. Perfect for beginners and masochists.',
    icon: '🚣',
    tier: 1,
    price: 0,
    speed: 1,
    capacity: 2,
    durability: 50,
    cannons: 0,
    crew: 1,
    regions: ['barnacle_bay'],
    abilities: [],
    upgrades: ['oar_upgrade', 'seat_cushion'],
    unlockLevel: 1,
  },

  fishing_dinghy: {
    id: 'fishing_dinghy',
    name: 'Fishing Dinghy',
    description: 'A proper little fishing boat. Has a bait well and everything!',
    icon: '🛶',
    tier: 1,
    price: 500,
    speed: 2,
    capacity: 4,
    durability: 100,
    cannons: 0,
    crew: 2,
    regions: ['barnacle_bay', 'coral_archipelago'],
    abilities: ['bait_storage'],
    upgrades: ['better_nets', 'fish_finder'],
    unlockLevel: 5,
  },

  // Mid-tier ships
  sloop: {
    id: 'sloop',
    name: 'Swift Sloop',
    description: 'Fast and nimble. Great for quick getaways from questionable decisions.',
    icon: '⛵',
    tier: 2,
    price: 5000,
    speed: 4,
    capacity: 8,
    durability: 200,
    cannons: 2,
    crew: 4,
    regions: ['barnacle_bay', 'coral_archipelago', 'golden_trade_route'],
    abilities: ['quick_escape', 'shallow_draft'],
    upgrades: ['silk_sails', 'bronze_cannons'],
    unlockLevel: 15,
  },

  merchant_cog: {
    id: 'merchant_cog',
    name: 'Merchant Cog',
    description: 'Slow but spacious. Your fish will have room to contemplate their fate.',
    icon: '🚢',
    tier: 2,
    price: 8000,
    speed: 2,
    capacity: 20,
    durability: 300,
    cannons: 4,
    crew: 8,
    regions: ['barnacle_bay', 'coral_archipelago', 'golden_trade_route'],
    abilities: ['cargo_master', 'trade_connections'],
    upgrades: ['reinforced_hull', 'secret_compartments'],
    unlockLevel: 20,
  },

  // Advanced ships
  brigantine: {
    id: 'brigantine',
    name: 'Brigantine',
    description: 'Two masts of pure adventure. Pirates love these. So do we.',
    icon: '🚢',
    tier: 3,
    price: 25000,
    speed: 5,
    capacity: 15,
    durability: 400,
    cannons: 8,
    crew: 12,
    regions: ['coral_archipelago', 'golden_trade_route', 'frozen_north'],
    abilities: ['ramming_speed', 'broadside'],
    upgrades: ['iron_plating', 'chain_shot'],
    unlockLevel: 30,
  },

  ice_breaker: {
    id: 'ice_breaker',
    name: 'Northern Ice Breaker',
    description: 'Built for the frozen north. Crushes ice like your enemies\' dreams.',
    icon: '🚢',
    tier: 3,
    price: 35000,
    speed: 3,
    capacity: 12,
    durability: 600,
    cannons: 4,
    crew: 15,
    regions: ['frozen_north'],
    abilities: ['ice_break', 'heated_deck', 'cold_resistance'],
    upgrades: ['ice_ram', 'thermal_hull'],
    unlockLevel: 40,
    specialRequirement: 'arctic_voyage_quest',
  },

  // Elite ships
  galleon: {
    id: 'galleon',
    name: 'Royal Galleon',
    description: 'A floating fortress. When you absolutely need to make an entrance.',
    icon: '🚢',
    tier: 4,
    price: 75000,
    speed: 4,
    capacity: 30,
    durability: 800,
    cannons: 20,
    crew: 30,
    regions: ['golden_trade_route', 'frozen_north', 'cursed_waters'],
    abilities: ['fleet_command', 'ship_repair', 'intimidation'],
    upgrades: ['mithril_cannons', 'enchanted_sails'],
    unlockLevel: 50,
  },

  ghost_ship: {
    id: 'ghost_ship',
    name: 'The Spectral Wanderer',
    description: 'Neither living nor dead. Can sail between worlds. Spooky.',
    icon: '👻',
    tier: 5,
    price: 150000,
    speed: 7,
    capacity: 25,
    durability: 500,
    cannons: 12,
    crew: 'undead',
    regions: ['cursed_waters', 'all_regions'],
    abilities: ['phase_shift', 'ghost_crew', 'curse_immunity', 'spectral_fishing'],
    upgrades: ['soul_cannons', 'void_sails'],
    unlockLevel: 70,
    specialRequirement: 'defeat_ghost_captain',
  },

  kraken_hunter: {
    id: 'kraken_hunter',
    name: 'The Kraken\'s Bane',
    description: 'Legendary monster hunter. Built to fight things that shouldn\'t exist.',
    icon: '🐙',
    tier: 5,
    price: 200000,
    speed: 5,
    capacity: 20,
    durability: 1000,
    cannons: 16,
    crew: 25,
    regions: ['cursed_waters', 'all_regions'],
    abilities: ['kraken_bait', 'monster_hunter', 'legendary_lure'],
    upgrades: ['adamantine_hull', 'harpoon_launchers'],
    unlockLevel: 80,
    specialRequirement: 'kraken_hunter_title',
  },
};

// ============================================================================
// SECTION 4: PORTS & HARBORS
// ============================================================================

export const PORTS = {
  // Barnacle Bay Ports
  barnacle_bay_harbor: {
    id: 'barnacle_bay_harbor',
    name: 'Barnacle Bay Main Harbor',
    region: 'barnacle_bay',
    description: 'The busiest harbor in the starter region. Smells like opportunity and fish.',
    icon: '⚓',
    position: { x: 50, y: 65 },
    services: ['ship_repair', 'fish_market', 'supplies', 'ferry_service'],
    dockingFee: 10,
    ships: ['rowboat', 'fishing_dinghy', 'sloop'],
    npcs: ['harbor_master_hank', 'dock_worker_dan', 'fish_merchant_fiona'],
    destinations: ['coral_harbor', 'merchants_dock'],
    travelCost: { coral_harbor: 100, merchants_dock: 250 },
    travelTime: { coral_harbor: '2 hours', merchants_dock: '4 hours' },
    dailySpecials: true,
    fishingAllowed: true,
    security: 'high',
  },

  fishermans_wharf: {
    id: 'fishermans_wharf',
    name: 'Fisherman\'s Wharf',
    region: 'barnacle_bay',
    description: 'Where the real fishers hang out. Tourists not welcome (but tolerated).',
    icon: '🎣',
    position: { x: 30, y: 70 },
    services: ['bait_shop', 'tackle_repair', 'fish_storage'],
    dockingFee: 5,
    ships: ['rowboat', 'fishing_dinghy'],
    npcs: ['old_pete', 'bait_betty', 'net_mender_ned'],
    destinations: ['barnacle_bay_harbor'],
    dailySpecials: true,
    fishingAllowed: true,
    security: 'medium',
    specialFeature: 'fishing_competition_weekly',
  },

  // Coral Archipelago Ports
  coral_harbor: {
    id: 'coral_harbor',
    name: 'Coral City Harbor',
    region: 'coral_archipelago',
    description: 'A stunning harbor built into living coral. Don\'t touch the walls.',
    icon: '🪸',
    position: { x: 45, y: 45 },
    services: ['ship_repair', 'diving_equipment', 'pearl_exchange', 'exotic_fish_market'],
    dockingFee: 50,
    ships: ['sloop', 'merchant_cog', 'brigantine'],
    npcs: ['reef_guardian_ray', 'pearl_diver_paco', 'queen_coraline_herald'],
    destinations: ['barnacle_bay_harbor', 'merchants_dock', 'shadow_dock'],
    travelCost: { barnacle_bay_harbor: 100, merchants_dock: 300, shadow_dock: 500 },
    dailySpecials: true,
    fishingAllowed: true,
    security: 'high',
    specialFeature: 'underwater_market',
  },

  turtle_cove: {
    id: 'turtle_cove',
    name: 'Turtle Cove Marina',
    region: 'coral_archipelago',
    description: 'Protected by giant sea turtles. They judge your parking.',
    icon: '🐢',
    position: { x: 55, y: 35 },
    services: ['turtle_rides', 'shell_shop', 'conservation_center'],
    dockingFee: 25,
    ships: ['rowboat', 'fishing_dinghy', 'sloop'],
    npcs: ['turtle_master_tara', 'shell_collector_shelly', 'marine_biologist_mike'],
    destinations: ['coral_harbor'],
    dailySpecials: true,
    fishingAllowed: true,
    security: 'very_high',
    specialFeature: 'turtle_racing',
  },

  // Golden Trade Route Ports
  merchants_dock: {
    id: 'merchants_dock',
    name: 'Grand Merchants\' Dock',
    region: 'golden_trade_route',
    description: 'Where fortunes are made and lost before breakfast. Wear your best clothes.',
    icon: '💰',
    position: { x: 70, y: 25 },
    services: ['auction_house', 'bank', 'insurance', 'customs', 'luxury_fish_market'],
    dockingFee: 200,
    ships: ['merchant_cog', 'brigantine', 'galleon'],
    npcs: ['trade_prince_prometheus', 'customs_officer_chen', 'banker_bartholomew'],
    destinations: ['coral_harbor', 'frostport', 'shadow_dock', 'barnacle_bay_harbor'],
    travelCost: { coral_harbor: 300, frostport: 800, shadow_dock: 600, barnacle_bay_harbor: 250 },
    dailySpecials: true,
    fishingAllowed: false,
    security: 'extreme',
    specialFeature: 'stock_exchange',
  },

  smugglers_cove: {
    id: 'smugglers_cove',
    name: 'Smuggler\'s Secret Cove',
    region: 'golden_trade_route',
    description: 'Hidden harbor for "alternative commerce". Cash only. No questions.',
    icon: '🏴‍☠️',
    position: { x: 65, y: 40 },
    services: ['black_market', 'illegal_upgrades', 'fence', 'forged_papers'],
    dockingFee: 0,
    membershipFee: 1000,
    ships: ['all'],
    npcs: ['the_shadow', 'fence_felix', 'forger_francois'],
    destinations: ['shadow_dock'],
    dailySpecials: true,
    fishingAllowed: true,
    security: 'none',
    specialFeature: 'smuggling_missions',
    hidden: true,
  },

  // Frozen North Ports
  frostport: {
    id: 'frostport',
    name: 'Frostport',
    region: 'frozen_north',
    description: 'The last civilized port before the eternal ice. Bundle up.',
    icon: '❄️',
    position: { x: 45, y: 10 },
    services: ['ice_ship_repair', 'fur_trader', 'hot_springs', 'arctic_equipment'],
    dockingFee: 100,
    ships: ['ice_breaker', 'brigantine', 'galleon'],
    npcs: ['chief_frostbeard', 'ice_fisher_ingrid', 'fur_trader_fjord'],
    destinations: ['merchants_dock', 'glacier_outpost', 'shadow_dock'],
    travelCost: { merchants_dock: 800, glacier_outpost: 300, shadow_dock: 1000 },
    dailySpecials: true,
    fishingAllowed: true,
    security: 'high',
    specialFeature: 'aurora_viewing',
    weatherHazard: 'blizzard',
  },

  glacier_outpost: {
    id: 'glacier_outpost',
    name: 'Glacier\'s Edge Outpost',
    region: 'frozen_north',
    description: 'The very edge of the known world. Turn back now, or don\'t.',
    icon: '🏔️',
    position: { x: 40, y: 5 },
    services: ['expedition_supplies', 'legendary_bait', 'rescue_beacon'],
    dockingFee: 200,
    ships: ['ice_breaker'],
    npcs: ['expedition_leader_erik', 'ice_witch_isolde', 'yeti_friend_yuri'],
    destinations: ['frostport'],
    dailySpecials: true,
    fishingAllowed: true,
    security: 'low',
    specialFeature: 'legendary_fish_spawns',
    weatherHazard: 'extreme_cold',
  },

  // Cursed Waters Ports
  shadow_dock: {
    id: 'shadow_dock',
    name: 'Shadow Dock',
    region: 'cursed_waters',
    description: 'A port that exists between worlds. Don\'t stay too long.',
    icon: '💀',
    position: { x: 85, y: 65 },
    services: ['curse_removal', 'spirit_binding', 'ghost_crew_hiring', 'soul_market'],
    dockingFee: 500,
    ships: ['ghost_ship', 'kraken_hunter', 'galleon'],
    npcs: ['boney_mcgee', 'witch_doctor_wanda', 'ghost_captain_graves'],
    destinations: ['coral_harbor', 'merchants_dock', 'frostport', 'skeleton_isle'],
    travelCost: { coral_harbor: 500, merchants_dock: 600, frostport: 1000, skeleton_isle: 250 },
    dailySpecials: true,
    fishingAllowed: true,
    security: 'supernatural',
    specialFeature: 'undead_market',
  },

  skeleton_isle: {
    id: 'skeleton_isle',
    name: 'Skeleton Isle Landing',
    region: 'cursed_waters',
    description: 'An island made of bones. Surprisingly good fishing.',
    icon: '☠️',
    position: { x: 90, y: 75 },
    services: ['bone_crafting', 'necromancy', 'cursed_equipment'],
    dockingFee: 'one_memory',
    ships: ['ghost_ship', 'kraken_hunter'],
    npcs: ['skeleton_merchant', 'bone_collector', 'the_first_pirate'],
    destinations: ['shadow_dock', 'kraken_depths'],
    dailySpecials: true,
    fishingAllowed: true,
    security: 'none',
    specialFeature: 'boss_raid',
  },
};

// ============================================================================
// SECTION 5: ISLANDS - Explorable Land Masses
// ============================================================================

export const ISLANDS = {
  // Barnacle Bay Islands
  starter_island: {
    id: 'starter_island',
    name: 'Codswallop Cove Island',
    region: 'barnacle_bay',
    description: 'The main island of Barnacle Bay. Home sweet fishy home.',
    size: 'large',
    terrain: ['beach', 'forest', 'town', 'cliffs'],
    position: { x: 25, y: 60 },
    locations: ['harbor_square', 'docks', 'salty_barnacle_tavern', 'merchant_quarter'],
    secrets: 3,
    treasures: 5,
    dungeons: 1,
    difficulty: 1,
  },

  pelican_point: {
    id: 'pelican_point',
    name: 'Pelican Point',
    region: 'barnacle_bay',
    description: 'A small island overrun by pelicans. They\'ve formed a society.',
    size: 'tiny',
    terrain: ['beach', 'rocks'],
    position: { x: 15, y: 55 },
    locations: ['pelican_colony', 'hidden_nest'],
    secrets: 1,
    treasures: 2,
    dungeons: 0,
    difficulty: 5,
    specialNPC: 'king_pelican',
  },

  // Coral Archipelago Islands
  rainbow_reef_island: {
    id: 'rainbow_reef_island',
    name: 'Rainbow Reef',
    region: 'coral_archipelago',
    description: 'An island surrounded by the most colorful coral in the world.',
    size: 'medium',
    terrain: ['coral_beach', 'jungle', 'underwater_caves'],
    position: { x: 50, y: 40 },
    locations: ['coral_city', 'rainbow_reef', 'sunken_temple_entrance'],
    secrets: 5,
    treasures: 8,
    dungeons: 2,
    difficulty: 20,
  },

  mermaid_isle: {
    id: 'mermaid_isle',
    name: 'Mermaid\'s Sanctuary',
    region: 'coral_archipelago',
    description: 'Sacred island of the merfolk. Humans rarely visit. And return.',
    size: 'medium',
    terrain: ['lagoon', 'grotto', 'underwater_palace'],
    position: { x: 40, y: 35 },
    locations: ['mermaid_lagoon', 'queen_coralines_throne'],
    secrets: 7,
    treasures: 10,
    dungeons: 1,
    difficulty: 35,
    restricted: true,
    requiresReputation: 'merfolk_ally',
  },

  volcano_isle: {
    id: 'volcano_isle',
    name: 'Mount Magma',
    region: 'coral_archipelago',
    description: 'An active volcano island. Hot fishing spots. Literally.',
    size: 'medium',
    terrain: ['volcanic_beach', 'lava_fields', 'hot_springs'],
    position: { x: 60, y: 45 },
    locations: ['volcano_fishing_spot', 'fire_temple', 'hot_spring_village'],
    secrets: 4,
    treasures: 6,
    dungeons: 2,
    difficulty: 40,
    hazard: 'volcanic_activity',
  },

  // Golden Trade Route Islands
  merchants_paradise: {
    id: 'merchants_paradise',
    name: 'Merchant\'s Paradise',
    region: 'golden_trade_route',
    description: 'The wealthiest island in the seas. Everything has a price tag.',
    size: 'large',
    terrain: ['harbor', 'mansions', 'gardens', 'vault_district'],
    position: { x: 72, y: 28 },
    locations: ['grand_bazaar', 'noble_harbor', 'auction_house'],
    secrets: 10,
    treasures: 15,
    dungeons: 3,
    difficulty: 45,
  },

  pirate_haven: {
    id: 'pirate_haven',
    name: 'Pirate\'s Haven',
    region: 'golden_trade_route',
    description: 'The infamous pirate republic. Laws are... suggestions.',
    size: 'medium',
    terrain: ['coves', 'fortress', 'shipwrecks'],
    position: { x: 60, y: 35 },
    locations: ['pirate_fortress', 'black_market', 'dueling_grounds'],
    secrets: 8,
    treasures: 12,
    dungeons: 2,
    difficulty: 50,
    pvpZone: true,
  },

  // Frozen North Islands
  frost_giant_isle: {
    id: 'frost_giant_isle',
    name: 'Frost Giant\'s Rest',
    region: 'frozen_north',
    description: 'Legends say a frozen giant sleeps here. Don\'t wake it.',
    size: 'large',
    terrain: ['ice_fields', 'frozen_forest', 'giant_ruins'],
    position: { x: 55, y: 8 },
    locations: ['glacier_outpost', 'frozen_caverns', 'giants_throne'],
    secrets: 6,
    treasures: 8,
    dungeons: 3,
    difficulty: 65,
    boss: 'frost_giant_king',
  },

  aurora_island: {
    id: 'aurora_island',
    name: 'Aurora Island',
    region: 'frozen_north',
    description: 'The Northern Lights dance permanently above this mystical place.',
    size: 'small',
    terrain: ['ice_crystals', 'aurora_shrine', 'magical_springs'],
    position: { x: 48, y: 5 },
    locations: ['aurora_peak', 'crystal_caverns', 'light_temple'],
    secrets: 10,
    treasures: 5,
    dungeons: 1,
    difficulty: 70,
    buff: 'aurora_blessing',
    legendaryFish: 'aurora_whale',
  },

  // Cursed Waters Islands
  ghost_island: {
    id: 'ghost_island',
    name: 'Ghost Island',
    region: 'cursed_waters',
    description: 'An island frozen in time. Its inhabitants don\'t know they\'re dead.',
    size: 'large',
    terrain: ['ruined_town', 'haunted_forest', 'graveyard'],
    position: { x: 82, y: 70 },
    locations: ['ghost_ship_graveyard', 'shadow_port', 'cursed_lighthouse'],
    secrets: 15,
    treasures: 20,
    dungeons: 4,
    difficulty: 80,
    curse: 'time_loop',
  },

  kraken_island: {
    id: 'kraken_island',
    name: 'Kraken\'s Domain',
    region: 'cursed_waters',
    description: 'The territory of the legendary Kraken. Final fishing ground.',
    size: 'massive',
    terrain: ['abyssal_trenches', 'tentacle_forest', 'bone_reefs'],
    position: { x: 95, y: 80 },
    locations: ['kraken_depths', 'davy_jones_locker', 'abyss_edge'],
    secrets: 20,
    treasures: 25,
    dungeons: 5,
    difficulty: 100,
    finalBoss: 'the_kraken',
    legendaryFish: 'void_leviathan',
  },
};

// ============================================================================
// SECTION 6: NPC DISTRIBUTION BY REGION & DIFFICULTY
// ============================================================================

export const NPC_DISTRIBUTION = {
  barnacle_bay: {
    difficulty_range: { min: 1, max: 20 },
    total_npcs: 35,
    npc_types: {
      merchants: [
        { id: 'finley_scales', name: 'Finley Scales', difficulty: 1, role: 'fish_merchant', friendly: true },
        { id: 'barnaby_hooks', name: 'Barnaby Hooks', difficulty: 1, role: 'tackle_shop', friendly: true },
        { id: 'percival_goods', name: 'Percival T. Goods', difficulty: 3, role: 'general_store', friendly: true },
        { id: 'madame_mystique', name: 'Madame Mystique', difficulty: 5, role: 'potion_shop', mysterious: true },
        { id: 'martha_anvil', name: 'Martha Iron Anvil', difficulty: 8, role: 'blacksmith', grumpy: true },
      ],
      quest_givers: [
        { id: 'captain_goldbeard', name: 'Cap\'n Goldbeard', difficulty: 5, role: 'retired_pirate', quests: ['rowboat_repairs', 'pirate_stories'] },
        { id: 'rosie_stormglass', name: 'Rosie Stormglass', difficulty: 8, role: 'tavern_owner', quests: ['gather_rumors', 'find_informant'] },
        { id: 'eleanor_brightspark', name: 'Eleanor Brightspark', difficulty: 10, role: 'lighthouse_keeper', quests: ['star_charts', 'lighthouse_mystery'] },
        { id: 'professor_plankton', name: 'Professor Plankton', difficulty: 12, role: 'marine_biologist', quests: ['study_fish', 'discover_species'] },
        { id: 'treasure_hunter_tess', name: 'Treasure Hunter Tess', difficulty: 15, role: 'adventurer', quests: ['treasure_leads', 'ancient_map'] },
      ],
      trainers: [
        { id: 'old_pete', name: 'Old Pete', difficulty: 1, skill: 'basic_fishing', teaches: ['casting', 'reeling'] },
        { id: 'net_captain_jonas', name: 'Net Captain Jonas', difficulty: 5, skill: 'net_fishing', teaches: ['net_throwing', 'mending'] },
      ],
      companions: [
        { id: 'mumblin_pete', name: 'Mumblin\' Pete', difficulty: 8, class: 'information', companion_type: 'temporary' },
      ],
      ambient: [
        { id: 'dock_master_drake', difficulty: 3, role: 'dock_authority' },
        { id: 'nellie_nets', difficulty: 2, role: 'net_mender' },
        { id: 'crane_operator_crane', difficulty: 2, role: 'cargo_handler' },
        { id: 'sergeant_snooze', difficulty: 5, role: 'guard' },
        { id: 'private_pepper', difficulty: 3, role: 'rookie_guard' },
        { id: 'message_boy_max', difficulty: 1, role: 'courier' },
        { id: 'complaining_carl', difficulty: 4, role: 'pessimist' },
        { id: 'old_salty', difficulty: 6, role: 'dried_goods' },
      ],
      tavern_regulars: [
        { id: 'lucky_lucy', difficulty: 10, role: 'card_shark', minigame: 'cards' },
        { id: 'three_finger_tim', difficulty: 8, role: 'arm_wrestler', minigame: 'arm_wrestling' },
        { id: 'songbird_sally', difficulty: 5, role: 'singer', entertainment: true },
      ],
      rivals: [
        { id: 'razor_ricky', name: 'Razor Ricky', difficulty: 15, role: 'fishing_rival', recurring: true },
      ],
      secrets: [
        { id: 'shadow_merchant', name: 'The Shadow', difficulty: 18, role: 'black_market', hidden: true },
        { id: 'patches_the_cat', name: 'Patches', difficulty: 1, role: 'mysterious_cat', secret_keeper: true },
      ],
    },
  },

  coral_archipelago: {
    difficulty_range: { min: 15, max: 40 },
    total_npcs: 30,
    npc_types: {
      merchants: [
        { id: 'chef_crustacean', name: 'Chef Crustacean', difficulty: 20, role: 'fine_dining', proud: true },
        { id: 'shell_collector_shelly', name: 'Shell Collector Shelly', difficulty: 18, role: 'shell_shop', eccentric: true },
        { id: 'tropical_trader_tiki', name: 'Trader Tiki', difficulty: 25, role: 'exotic_goods', mysterious: true },
      ],
      quest_givers: [
        { id: 'queen_coraline', name: 'Queen Coraline', difficulty: 35, role: 'merfolk_queen', quests: ['audience_with_queen', 'mermaids_heart'] },
        { id: 'reef_guide_ray', name: 'Reef Guide Ray', difficulty: 20, role: 'coral_expert', quests: ['reef_tour', 'save_coral'] },
        { id: 'captain_tsunami', name: 'Captain Tsunami', difficulty: 30, role: 'storm_rider', quests: ['storm_voyage', 'racing_challenge'] },
        { id: 'retired_admiral_anchor', name: 'Admiral Anchor', difficulty: 28, role: 'naval_commander', quests: ['naval_history', 'find_old_ship'] },
        { id: 'volcano_hermit', name: 'Ignis the Hermit', difficulty: 38, role: 'fire_sage', quests: ['volcano_fish', 'hermits_riddles'] },
      ],
      trainers: [
        { id: 'pearl_diver_paco', name: 'Pearl Diver Paco', difficulty: 22, skill: 'diving', teaches: ['breath_holding', 'deep_diving'] },
      ],
      guardians: [
        { id: 'sunken_temple_guardian', name: 'The Guardian', difficulty: 40, role: 'temple_protector', boss: true },
      ],
      companions: [
        { id: 'mermaid_melody', name: 'Melody', difficulty: 30, class: 'support', companion_type: 'permanent', unlock: 'merfolk_trusted' },
      ],
      ambient: [
        { id: 'turtle_master_tara', difficulty: 20, role: 'turtle_handler' },
        { id: 'marine_biologist_mike', difficulty: 18, role: 'researcher' },
        { id: 'coral_gardener', difficulty: 15, role: 'conservationist' },
        { id: 'beach_vendor', difficulty: 16, role: 'souvenir_seller' },
      ],
    },
  },

  golden_trade_route: {
    difficulty_range: { min: 35, max: 60 },
    total_npcs: 35,
    npc_types: {
      merchants: [
        { id: 'trade_prince_prometheus', name: 'Trade Prince Prometheus', difficulty: 55, role: 'merchant_king', quests: ['merchant_favor', 'trade_war'] },
        { id: 'silk_merchant_sasha', name: 'Silk Merchant Sasha', difficulty: 45, role: 'luxury_goods', proud: true },
        { id: 'spice_trader_samir', name: 'Spice Trader Samir', difficulty: 40, role: 'spices', friendly: true },
        { id: 'jeweler_jasmine', name: 'Jeweler Jasmine', difficulty: 48, role: 'gems', cunning: true },
      ],
      quest_givers: [
        { id: 'auctioneer_augustus', name: 'Auctioneer Augustus', difficulty: 50, role: 'auction_master', quests: ['auction_quest', 'rare_item_bid'] },
        { id: 'duchess_diamond', name: 'Duchess Diamond', difficulty: 55, role: 'noble', quests: ['noble_favor', 'diamond_heist'] },
        { id: 'shipping_tycoon_tang', name: 'Shipping Tycoon Tang', difficulty: 52, role: 'fleet_owner', quests: ['shipping_contract', 'pirate_protection'] },
      ],
      services: [
        { id: 'butler_bartholomew', name: 'Butler Bartholomew', difficulty: 42, role: 'information_broker' },
        { id: 'customs_officer_chen', name: 'Customs Officer Chen', difficulty: 45, role: 'customs', bribeable: true },
        { id: 'translator_tao', name: 'Translator Tao', difficulty: 38, role: 'translator' },
        { id: 'banker_belle', name: 'Banker Belle', difficulty: 50, role: 'bank' },
      ],
      underworld: [
        { id: 'pirate_lord_blackheart', name: 'Lord Blackheart', difficulty: 58, role: 'pirate_king', boss: true },
        { id: 'fence_felix', name: 'Fence Felix', difficulty: 40, role: 'stolen_goods', hidden: true },
        { id: 'forger_francois', name: 'Forger Francois', difficulty: 45, role: 'documents', hidden: true },
      ],
      rivals: [
        { id: 'rival_merchant_marcus', name: 'Merchant Marcus', difficulty: 48, role: 'trade_rival', recurring: true },
      ],
    },
  },

  frozen_north: {
    difficulty_range: { min: 55, max: 80 },
    total_npcs: 25,
    npc_types: {
      merchants: [
        { id: 'fur_trader_fjord', name: 'Fur Trader Fjord', difficulty: 58, role: 'furs', cunning: true },
        { id: 'ice_equipment_vendor', name: 'Frosty Frieda', difficulty: 60, role: 'arctic_gear', helpful: true },
      ],
      quest_givers: [
        { id: 'chief_frostbeard', name: 'Chief Frostbeard', difficulty: 70, role: 'leader', quests: ['earn_trust', 'beast_hunt', 'northern_passage'] },
        { id: 'expedition_leader_erik', name: 'Expedition Leader Erik', difficulty: 68, role: 'explorer', quests: ['glacier_expedition', 'find_lost_explorer'] },
        { id: 'ice_witch_isolde', name: 'Ice Witch Isolde', difficulty: 75, role: 'sorceress', quests: ['ice_magic', 'frost_heart'] },
        { id: 'whale_caller_wilhelm', name: 'Whale Caller Wilhelm', difficulty: 65, role: 'whisperer', quests: ['call_the_whales', 'leviathan_hunt'] },
      ],
      trainers: [
        { id: 'ice_fisher_ingrid', name: 'Ice Fisher Ingrid', difficulty: 60, skill: 'ice_fishing', teaches: ['ice_drilling', 'cold_resistance'] },
        { id: 'sled_master_sven', name: 'Sled Master Sven', difficulty: 58, skill: 'transport', teaches: ['sled_driving'] },
      ],
      special: [
        { id: 'aurora_watcher_astrid', name: 'Aurora Watcher Astrid', difficulty: 72, role: 'mystic', quests: ['aurora_prophecy', 'sky_fish'] },
        { id: 'yeti_friend_yuri', name: 'Yeti Friend Yuri', difficulty: 78, role: 'cryptid_expert', quests: ['find_yeti', 'befriend_beast'] },
        { id: 'hot_springs_helga', name: 'Hot Springs Helga', difficulty: 56, role: 'rest_point', heals: true },
      ],
      bosses: [
        { id: 'frost_giant_king', name: 'Frost Giant King', difficulty: 80, role: 'world_boss', legendary: true },
      ],
    },
  },

  cursed_waters: {
    difficulty_range: { min: 75, max: 100 },
    total_npcs: 30,
    npc_types: {
      merchants: [
        { id: 'witch_doctor_wanda', name: 'Witch Doctor Wanda', difficulty: 80, role: 'curses', quests: ['curse_item', 'dark_ritual'] },
        { id: 'skeleton_merchant', name: 'Rattles', difficulty: 78, role: 'bone_shop', friendly: true },
        { id: 'zombie_chef_zack', name: 'Zombie Chef Zack', difficulty: 75, role: 'undead_food', friendly: true },
      ],
      quest_givers: [
        { id: 'ghost_captain_graves', name: 'Captain Graves', difficulty: 90, role: 'phantom', quests: ['face_the_ghost', 'lift_curse'] },
        { id: 'kraken_keeper', name: 'The Kraken Keeper', difficulty: 95, role: 'monster_warden', quests: ['kraken_hunt', 'kraken_pact'] },
        { id: 'boney_mcgee', name: 'Boney McGee', difficulty: 78, role: 'skeleton_friend', quests: ['boney_freedom', 'rest_in_peace'] },
        { id: 'banshee_beatrice', name: 'Banshee Beatrice', difficulty: 82, role: 'doom_singer', quests: ['silence_banshee', 'find_love'] },
      ],
      trainers: [
        { id: 'vampire_fisherman', name: 'Count Fins', difficulty: 85, skill: 'night_fishing', teaches: ['blood_bait', 'vampire_catch'] },
        { id: 'ghost_angler', name: 'Phantom Phil', difficulty: 88, skill: 'spectral_fishing', teaches: ['ghost_lure', 'spirit_hook'] },
      ],
      special: [
        { id: 'medium_miranda', name: 'Medium Miranda', difficulty: 80, role: 'spirit_talker', quests: ['contact_dead', 'medium_mystery'] },
        { id: 'possessed_parrot', name: 'Polly (Possessed)', difficulty: 76, role: 'demon_bird', quests: ['exorcise_parrot', 'parrot_secrets'] },
        { id: 'the_ferryman', name: 'Charon\'s Cousin', difficulty: 85, role: 'soul_transport', required_for_travel: true },
      ],
      bosses: [
        { id: 'the_kraken', name: 'The Kraken', difficulty: 100, role: 'final_boss', legendary: true },
        { id: 'davy_jones', name: 'Davy Jones', difficulty: 98, role: 'secret_boss', legendary: true, hidden: true },
      ],
      companions: [
        { id: 'ghost_pirate_companion', name: 'One-Eyed Jack', difficulty: 85, class: 'fighter', companion_type: 'permanent', undead: true },
      ],
    },
  },
};

// ============================================================================
// SECTION 7: HOUSES & BUILDINGS
// ============================================================================

export const BUILDINGS = {
  // Residential
  fisherman_cottage: {
    id: 'fisherman_cottage',
    name: 'Fisherman\'s Cottage',
    description: 'A humble home that smells permanently of fish. Cozy though.',
    icon: '🏠',
    size: 'small',
    regions: ['barnacle_bay'],
    features: ['bed', 'storage', 'fish_drying_rack'],
    purchasable: true,
    price: 2000,
    upgrades: ['larger_storage', 'fish_tank', 'trophy_wall'],
  },

  beach_shack: {
    id: 'beach_shack',
    name: 'Beach Shack',
    description: 'Basically a fancy shed. But it\'s YOUR fancy shed.',
    icon: '🛖',
    size: 'tiny',
    regions: ['barnacle_bay', 'coral_archipelago'],
    features: ['hammock', 'basic_storage'],
    purchasable: true,
    price: 500,
    upgrades: ['roof_repair', 'fishing_spot'],
  },

  merchant_house: {
    id: 'merchant_house',
    name: 'Merchant\'s Townhouse',
    description: 'A respectable establishment for respectable fish dealers.',
    icon: '🏘️',
    size: 'medium',
    regions: ['golden_trade_route'],
    features: ['bedroom', 'office', 'vault', 'storage'],
    purchasable: true,
    price: 25000,
    upgrades: ['secret_vault', 'display_room', 'servant_quarters'],
  },

  island_villa: {
    id: 'island_villa',
    name: 'Island Villa',
    description: 'Living the dream. Tropical paradise with a private dock.',
    icon: '🏝️',
    size: 'large',
    regions: ['coral_archipelago'],
    features: ['master_suite', 'pool', 'private_dock', 'aquarium'],
    purchasable: true,
    price: 75000,
    upgrades: ['diving_platform', 'pearl_farm', 'mermaid_fountain'],
  },

  ice_fortress: {
    id: 'ice_fortress',
    name: 'Ice Fortress',
    description: 'A castle made of eternal ice. Never melts. Always impressive.',
    icon: '🏰',
    size: 'massive',
    regions: ['frozen_north'],
    features: ['throne_room', 'ice_storage', 'hot_spring', 'trophy_hall'],
    purchasable: true,
    price: 150000,
    unlockRequirement: { reputation: 'northern_hero', level: 50 },
    upgrades: ['aurora_observatory', 'ice_dragon_stable', 'legendary_vault'],
  },

  haunted_manor: {
    id: 'haunted_manor',
    name: 'Haunted Manor',
    description: 'Comes with free ghost roommates. They\'re mostly friendly.',
    icon: '🏚️',
    size: 'large',
    regions: ['cursed_waters'],
    features: ['crypts', 'seance_room', 'ghost_staff', 'cursed_artifacts'],
    purchasable: true,
    price: 100000,
    unlockRequirement: { quest: 'befriend_the_dead', level: 60 },
    upgrades: ['necromancy_lab', 'spirit_portal', 'bone_throne'],
  },

  // Commercial Buildings
  fish_market_stall: {
    id: 'fish_market_stall',
    name: 'Fish Market Stall',
    description: 'Your own spot in the market. Sell fish, yell at customers!',
    icon: '🏪',
    size: 'tiny',
    regions: ['all'],
    features: ['display_case', 'ice_box', 'cash_register'],
    purchasable: true,
    price: 1500,
    income: { daily: 50, fish_bonus: 1.1 },
    upgrades: ['better_display', 'premium_section', 'advertising'],
  },

  tackle_shop_franchise: {
    id: 'tackle_shop_franchise',
    name: 'Tackle Shop Franchise',
    description: 'Open your own bait and tackle empire. Hooks for everyone!',
    icon: '🪝',
    size: 'small',
    regions: ['barnacle_bay', 'coral_archipelago', 'golden_trade_route'],
    features: ['bait_tanks', 'rod_display', 'repair_bench'],
    purchasable: true,
    price: 10000,
    income: { daily: 150, player_discount: 0.85 },
    upgrades: ['rare_bait_section', 'custom_rods', 'training_area'],
  },

  auction_house_seat: {
    id: 'auction_house_seat',
    name: 'Auction House Seat',
    description: 'Reserved seating at the auction. Feel important.',
    icon: '🔨',
    size: 'none',
    regions: ['golden_trade_route'],
    features: ['priority_bidding', 'rare_listings', 'insider_info'],
    purchasable: true,
    price: 50000,
    income: { auction_fee_reduction: 0.9, early_access: true },
  },

  // Special Buildings
  lighthouse_ownership: {
    id: 'lighthouse_ownership',
    name: 'Personal Lighthouse',
    description: 'Own a lighthouse. Guide ships. Or confuse them. Your choice.',
    icon: '🗼',
    size: 'large',
    regions: ['all'],
    features: ['beacon', 'observation_deck', 'lighthouse_keeper_suite'],
    purchasable: true,
    price: 80000,
    unlockRequirement: { level: 40, quest: 'lighthouse_legacy' },
    bonuses: { ship_speed: 1.1, navigation: 1.2, rare_fish_spawn: 1.05 },
  },

  ship_in_a_bottle_workshop: {
    id: 'ship_in_a_bottle_workshop',
    name: 'Ship-in-a-Bottle Workshop',
    description: 'Craft miniature ships. Mysterious and profitable.',
    icon: '🍾',
    size: 'small',
    regions: ['barnacle_bay', 'golden_trade_route'],
    features: ['crafting_bench', 'bottle_storage', 'miniature_supplies'],
    purchasable: true,
    price: 15000,
    income: { crafting_bonus: 1.25, rare_craft_chance: 0.1 },
  },
};

// ============================================================================
// SECTION 8: SHOPS - Detailed Shop Data
// ============================================================================

export const SHOPS = {
  // Barnacle Bay Shops
  hooky_mchookface: {
    id: 'hooky_mchookface',
    name: 'Hooky McHookface\'s Tackle Emporium',
    region: 'barnacle_bay',
    owner: 'barnaby_hooks',
    description: 'Best hooks in town! Also the only hooks in town!',
    icon: '🪝',
    position: { x: 25, y: 45 },
    type: 'tackle',
    priceModifier: 1.0,
    inventory: [
      { item: 'basic_hook', price: 10, stock: 'unlimited' },
      { item: 'silver_hook', price: 50, stock: 20 },
      { item: 'golden_hook', price: 200, stock: 5, daily_reset: true },
      { item: 'basic_line', price: 15, stock: 'unlimited' },
      { item: 'reinforced_line', price: 75, stock: 15 },
      { item: 'basic_rod', price: 100, stock: 10 },
      { item: 'decent_rod', price: 500, stock: 5 },
    ],
    dailySpecial: true,
    buyback: 0.5,
    reputation_discount: { friend: 0.9, best_friend: 0.8 },
    quests_available: ['hook_challenge', 'lost_tackle'],
  },

  finnegans_fish_market: {
    id: 'finnegans_fish_market',
    name: 'Finnegan\'s Fresh Fish',
    region: 'barnacle_bay',
    owner: 'finley_scales',
    description: 'Fresh fish! Ish. Freshish fish!',
    icon: '🐟',
    position: { x: 15, y: 60 },
    type: 'fish_market',
    priceModifier: 1.0,
    buysFrom: ['common_fish', 'uncommon_fish'],
    sellsTo: ['cooked_fish', 'fish_bait'],
    buyPrices: {
      common_fish: 1.0,
      uncommon_fish: 1.1,
      rare_fish: 0.8, // Doesn't specialize in rare
    },
    dailySpecial: true,
    reputation_bonus: { friend: 1.1, best_friend: 1.2 },
    quests_available: ['big_catch', 'fish_delivery'],
  },

  madames_mystical_potions: {
    id: 'madames_mystical_potions',
    name: 'Madame Mystique\'s Mystical Emporium',
    region: 'barnacle_bay',
    owner: 'madame_mystique',
    description: 'Potions, predictions, and probably some scams.',
    icon: '🔮',
    position: { x: 35, y: 35 },
    type: 'potion',
    priceModifier: 1.15,
    inventory: [
      { item: 'luck_potion', price: 100, stock: 5 },
      { item: 'bait_enhancer', price: 75, stock: 10 },
      { item: 'fish_attractant', price: 150, stock: 3 },
      { item: 'fortune_reading', price: 50, stock: 1, daily_reset: true },
      { item: 'curse_removal_basic', price: 200, stock: 2 },
    ],
    dailySpecial: true,
    mystery_item: { price: 300, pool: ['rare_potion', 'useless_trinket', 'legendary_bait', 'cursed_hook'] },
    quests_available: ['rare_ingredients', 'test_potion'],
  },

  // Coral Archipelago Shops
  shell_collectors_paradise: {
    id: 'shell_collectors_paradise',
    name: 'Shelly\'s Shell Shack',
    region: 'coral_archipelago',
    owner: 'shell_collector_shelly',
    description: 'She remembers every shell\'s name. All 10,000 of them.',
    icon: '🐚',
    position: { x: 55, y: 40 },
    type: 'collectibles',
    priceModifier: 1.0,
    inventory: [
      { item: 'decorative_shell', price: 25, stock: 50 },
      { item: 'rare_conch', price: 500, stock: 3 },
      { item: 'pearl_oyster_map', price: 200, stock: 5, daily_reset: true },
      { item: 'shell_horn', price: 1000, stock: 1, unique: true },
    ],
    buysShells: true,
    shellPrices: { common: 5, uncommon: 25, rare: 100, legendary: 500 },
    quests_available: ['rare_shell', 'shell_collection'],
  },

  coral_city_exotic_fish: {
    id: 'coral_city_exotic_fish',
    name: 'Tiki\'s Exotic Fish Emporium',
    region: 'coral_archipelago',
    owner: 'tropical_trader_tiki',
    description: 'Fish from places that aren\'t on any map. Yet.',
    icon: '🐠',
    position: { x: 48, y: 38 },
    type: 'exotic_fish_market',
    priceModifier: 1.2,
    buysFrom: ['rare_fish', 'exotic_fish', 'legendary_fish'],
    buyPrices: {
      rare_fish: 1.3,
      exotic_fish: 1.5,
      legendary_fish: 2.0,
    },
    sellsExoticBait: true,
    inventory: [
      { item: 'tropical_bait', price: 100, stock: 20 },
      { item: 'deep_sea_lure', price: 300, stock: 10 },
      { item: 'mermaid_scale_bait', price: 1000, stock: 2, daily_reset: true },
    ],
    quests_available: ['exotic_fish_hunt', 'traders_secret'],
  },

  // Golden Trade Route Shops
  grand_bazaar_auction: {
    id: 'grand_bazaar_auction',
    name: 'Augustus\'s Grand Auction House',
    region: 'golden_trade_route',
    owner: 'auctioneer_augustus',
    description: 'Where fortunes change hands faster than you can blink.',
    icon: '🔨',
    position: { x: 70, y: 28 },
    type: 'auction',
    priceModifier: 'variable',
    auctionTimes: ['10:00', '14:00', '18:00', '22:00'],
    itemCategories: ['legendary_fish', 'rare_equipment', 'treasure', 'collectibles'],
    buyerFee: 0.1,
    sellerFee: 0.15,
    minimumBid: 100,
    reservePrice: true,
    quests_available: ['auction_quest', 'rare_item_bid', 'auction_heist'],
  },

  silk_and_spice: {
    id: 'silk_and_spice',
    name: 'Sasha & Samir\'s Silk and Spice',
    region: 'golden_trade_route',
    owner: ['silk_merchant_sasha', 'spice_trader_samir'],
    description: 'Luxury goods for discerning fish traders.',
    icon: '🧵',
    position: { x: 68, y: 32 },
    type: 'luxury',
    priceModifier: 1.5,
    inventory: [
      { item: 'silk_fishing_line', price: 1000, stock: 5 },
      { item: 'spiced_bait', price: 200, stock: 20 },
      { item: 'perfumed_lure', price: 500, stock: 10 },
      { item: 'noble_fishing_outfit', price: 5000, stock: 1, unique: true },
    ],
    reputation_required: 'merchant_acquaintance',
    quests_available: ['rare_spice', 'silk_delivery'],
  },

  // Frozen North Shops
  frosts_survival_gear: {
    id: 'frosts_survival_gear',
    name: 'Frosty Frieda\'s Survival Supplies',
    region: 'frozen_north',
    owner: 'ice_equipment_vendor',
    description: 'Everything you need to not die in the cold. Mostly.',
    icon: '❄️',
    position: { x: 45, y: 12 },
    type: 'survival',
    priceModifier: 1.3,
    inventory: [
      { item: 'arctic_coat', price: 2000, stock: 5 },
      { item: 'ice_drill', price: 500, stock: 10 },
      { item: 'heated_gloves', price: 800, stock: 8 },
      { item: 'blizzard_goggles', price: 600, stock: 10 },
      { item: 'emergency_flare', price: 100, stock: 30 },
      { item: 'hot_cocoa_flask', price: 50, stock: 'unlimited' },
    ],
    survival_kit: { price: 3500, includes: ['arctic_coat', 'ice_drill', 'heated_gloves', 'blizzard_goggles'] },
    quests_available: ['survival_test', 'lost_expedition_gear'],
  },

  aurora_crystal_shop: {
    id: 'aurora_crystal_shop',
    name: 'Astrid\'s Aurora Artifacts',
    region: 'frozen_north',
    owner: 'aurora_watcher_astrid',
    description: 'Crystals charged by the Northern Lights. Magical and shiny.',
    icon: '🌌',
    position: { x: 48, y: 8 },
    type: 'magical',
    priceModifier: 2.0,
    inventory: [
      { item: 'aurora_crystal', price: 5000, stock: 3 },
      { item: 'star_map', price: 1000, stock: 5 },
      { item: 'aurora_fishing_rod', price: 25000, stock: 1, legendary: true },
      { item: 'northern_light_lure', price: 2000, stock: 5, daily_reset: true },
    ],
    onlyOpenDuring: 'aurora',
    quests_available: ['aurora_prophecy', 'light_magic'],
  },

  // Cursed Waters Shops
  wandas_curses_and_cures: {
    id: 'wandas_curses_and_cures',
    name: 'Wanda\'s Curses & Cures',
    region: 'cursed_waters',
    owner: 'witch_doctor_wanda',
    description: 'Curse your enemies! Cure your friends! Mix-ups are rare!',
    icon: '🪬',
    position: { x: 82, y: 68 },
    type: 'curse_shop',
    priceModifier: 1.0,
    inventory: [
      { item: 'curse_removal', price: 1000, stock: 10 },
      { item: 'blessing_bottle', price: 500, stock: 15 },
      { item: 'ghost_repellent', price: 300, stock: 20 },
      { item: 'soul_anchor', price: 5000, stock: 2 },
      { item: 'curse_of_bad_fishing', price: 200, stock: 'unlimited' },
      { item: 'voodoo_fish_doll', price: 1500, stock: 5 },
    ],
    cursedItems: { price: 'varies', risk: 'high', reward: 'very_high' },
    quests_available: ['curse_item', 'lift_curse', 'dark_ritual'],
  },

  skeleton_bone_emporium: {
    id: 'skeleton_bone_emporium',
    name: 'Rattles\' Bone Emporium',
    region: 'cursed_waters',
    owner: 'skeleton_merchant',
    description: 'Bones for sale! His own sometimes. They grow back.',
    icon: '💀',
    position: { x: 88, y: 72 },
    type: 'bones',
    priceModifier: 0.8,
    inventory: [
      { item: 'bone_fishing_rod', price: 3000, stock: 3 },
      { item: 'skull_lantern', price: 500, stock: 10 },
      { item: 'bone_hook', price: 100, stock: 30 },
      { item: 'skeleton_crew_contract', price: 10000, stock: 1, weekly_reset: true },
      { item: 'necrotic_bait', price: 400, stock: 15 },
    ],
    acceptsBones: true,
    boneExchange: { common: 10, rare: 100, legendary: 1000 },
    quests_available: ['bone_collection', 'skeleton_army'],
  },
};

// ============================================================================
// SECTION 9: WORLD TRAVEL ITEMS
// ============================================================================

export const TRAVEL_ITEMS = {
  // Basic Travel
  map_barnacle_bay: {
    id: 'map_barnacle_bay',
    name: 'Map of Barnacle Bay',
    description: 'A basic map of the starter region. Has coffee stains.',
    icon: '🗺️',
    type: 'map',
    region: 'barnacle_bay',
    price: 50,
    reveals: ['all_locations', 'fishing_spots', 'shops'],
    unlockLevel: 1,
  },

  map_coral_archipelago: {
    id: 'map_coral_archipelago',
    name: 'Coral Archipelago Charts',
    description: 'Detailed underwater charts. Waterproof, surprisingly.',
    icon: '🗺️',
    type: 'map',
    region: 'coral_archipelago',
    price: 500,
    reveals: ['all_locations', 'underwater_caves', 'pearl_spots'],
    unlockLevel: 10,
  },

  map_golden_route: {
    id: 'map_golden_route',
    name: 'Golden Trade Route Maps',
    description: 'Trade route maps with profit margins noted.',
    icon: '🗺️',
    type: 'map',
    region: 'golden_trade_route',
    price: 2000,
    reveals: ['all_locations', 'trade_posts', 'smuggler_routes'],
    unlockLevel: 25,
  },

  map_frozen_north: {
    id: 'map_frozen_north',
    name: 'Northern Ice Charts',
    description: 'Maps that update with ice floe movements. Magic!',
    icon: '🗺️',
    type: 'map',
    region: 'frozen_north',
    price: 5000,
    reveals: ['all_locations', 'safe_passages', 'legendary_spots'],
    unlockLevel: 40,
    magical: true,
  },

  map_cursed_waters: {
    id: 'map_cursed_waters',
    name: 'Cursed Sea Charts',
    description: 'Written in blood. Shows things that shouldn\'t exist.',
    icon: '🗺️',
    type: 'map',
    region: 'cursed_waters',
    price: 15000,
    reveals: ['all_locations', 'ghost_ships', 'kraken_territory'],
    unlockLevel: 60,
    cursed: true,
    sideEffect: 'occasional_nightmares',
  },

  // Special Travel Items
  ferry_pass: {
    id: 'ferry_pass',
    name: 'Ferry Pass',
    description: 'Unlimited ferry rides for a week. Very economical.',
    icon: '🎫',
    type: 'pass',
    duration: '7_days',
    price: 200,
    regions: ['barnacle_bay', 'coral_archipelago'],
    savings: 'approximately_50%',
  },

  merchant_passage: {
    id: 'merchant_passage',
    name: 'Merchant\'s Travel Pass',
    description: 'Travel on merchant ships. Includes meals.',
    icon: '🎫',
    type: 'pass',
    duration: '30_days',
    price: 2000,
    regions: ['all_except_cursed'],
    perks: ['free_meals', 'cargo_space', 'trade_info'],
  },

  ghostly_compass: {
    id: 'ghostly_compass',
    name: 'Ghostly Compass',
    description: 'Points to the Cursed Waters. Also occasionally screams.',
    icon: '🧭',
    type: 'navigation',
    price: 10000,
    unlocks: ['cursed_waters_access'],
    effect: 'navigate_cursed_waters',
    sideEffect: 'attracts_ghosts',
    quest_item: true,
  },

  teleport_scroll_home: {
    id: 'teleport_scroll_home',
    name: 'Homeward Scroll',
    description: 'Instantly return home. Single use.',
    icon: '📜',
    type: 'teleport',
    price: 100,
    uses: 1,
    destination: 'player_home',
  },

  teleport_stone: {
    id: 'teleport_stone',
    name: 'Waystone',
    description: 'Set a location, teleport back later. Reusable.',
    icon: '💎',
    type: 'teleport',
    price: 5000,
    uses: 'unlimited',
    cooldown: '24_hours',
    destination: 'marked_location',
  },

  captains_spyglass: {
    id: 'captains_spyglass',
    name: 'Captain\'s Spyglass',
    description: 'See far-off islands and ships. Great for planning.',
    icon: '🔭',
    type: 'navigation',
    price: 1000,
    effect: 'reveal_distant_locations',
    bonus: { ship_detection: 1.5, weather_prediction: true },
  },

  kraken_caller: {
    id: 'kraken_caller',
    name: 'Kraken Caller',
    description: 'Summon a kraken for fast travel. Use with extreme caution.',
    icon: '🐙',
    type: 'summon',
    price: 50000,
    uses: 3,
    destination: 'any_ocean_location',
    sideEffect: 'might_attack_you',
    legendary: true,
  },
};

// ============================================================================
// SECTION 10: DAILY SPECIALS SYSTEM (Enhancement Feature)
// ============================================================================

export const DAILY_SPECIALS_SYSTEM = {
  description: 'Each merchant NPC has rotating discounted items based on relationship level',
  
  tiers: {
    stranger: { discount: 0, specialItems: 0 },
    acquaintance: { discount: 0.05, specialItems: 1 },
    friend: { discount: 0.10, specialItems: 2 },
    close_friend: { discount: 0.15, specialItems: 3 },
    best_friend: { discount: 0.20, specialItems: 5, exclusiveItems: true },
  },

  rotationSchedule: {
    monday: { theme: 'fishing_gear', bonus: 1.2 },
    tuesday: { theme: 'bait_and_lures', bonus: 1.15 },
    wednesday: { theme: 'boat_supplies', bonus: 1.25 },
    thursday: { theme: 'potions_and_buffs', bonus: 1.3 },
    friday: { theme: 'rare_items', bonus: 1.1 },
    saturday: { theme: 'everything', bonus: 1.05 },
    sunday: { theme: 'legendary_deals', bonus: 2.0, rareChance: 0.1 },
  },

  specialEvents: {
    full_moon: { allDiscounts: 1.5, curseItemsAvailable: true },
    new_moon: { shadowMerchantAppears: true, blackMarketDeals: true },
    fishing_festival: { allFishPrices: 2.0, competitionBonuses: true },
    pirate_day: { pirateGearDiscounts: 0.5, treasureMapsAvailable: true },
  },

  merchantSpecialties: {
    finley_scales: {
      specialty: 'fish_buying',
      bestDays: ['monday', 'friday'],
      exclusiveItem: 'golden_fish_trophy',
      friendBonus: { fishSellPrice: 1.3 },
    },
    barnaby_hooks: {
      specialty: 'tackle',
      bestDays: ['tuesday', 'thursday'],
      exclusiveItem: 'legendary_hook_set',
      friendBonus: { tackleDiscount: 0.25 },
    },
    madame_mystique: {
      specialty: 'potions',
      bestDays: ['wednesday', 'sunday'],
      exclusiveItem: 'fortune_telling_crystal',
      friendBonus: { potionEffectiveness: 1.5 },
    },
    // ... continues for all merchants
  },

  loyaltyRewards: {
    visits_10: { reward: 'loyalty_discount_card', effect: 'permanent_5%_discount' },
    visits_50: { reward: 'vip_customer_badge', effect: 'early_access_to_specials' },
    visits_100: { reward: 'legendary_customer_title', effect: 'exclusive_item_access' },
    spent_10000: { reward: 'gold_customer_card', effect: 'free_delivery' },
    spent_100000: { reward: 'platinum_patron', effect: 'personal_shopper_npc' },
  },
};

// ============================================================================
// SECTION 11: INTERACTABLE WORLD OBJECTS
// ============================================================================

export const WORLD_OBJECTS = {
  // Fishing Related
  fishing_spots: {
    shallow_water: { fish_types: ['common'], difficulty: 1, icon: '🌊' },
    deep_water: { fish_types: ['common', 'uncommon'], difficulty: 2, icon: '🌊' },
    reef_edge: { fish_types: ['uncommon', 'rare'], difficulty: 3, icon: '🪸' },
    underwater_cave: { fish_types: ['rare', 'exotic'], difficulty: 4, icon: '🕳️' },
    abyss: { fish_types: ['legendary', 'mythical'], difficulty: 5, icon: '⬛' },
  },

  // Treasure Locations
  treasure_spots: {
    buried_chest: { loot_table: 'common_treasure', requires: 'shovel', icon: '📦' },
    sunken_ship: { loot_table: 'shipwreck_treasure', requires: 'diving_gear', icon: '🚢' },
    hidden_cave: { loot_table: 'cave_treasure', requires: 'torch', icon: '🕯️' },
    ancient_ruins: { loot_table: 'ancient_treasure', requires: 'puzzle_solving', icon: '🏛️' },
    cursed_vault: { loot_table: 'cursed_treasure', requires: 'curse_immunity', icon: '☠️' },
  },

  // Interactive Environment
  rest_points: {
    campfire: { heal: 50, save: true, cook: true, icon: '🔥' },
    inn_bed: { heal: 100, save: true, buff: 'well_rested', icon: '🛏️' },
    hot_spring: { heal: 100, buff: 'relaxed', region: 'frozen_north', icon: '♨️' },
    meditation_spot: { mana: 100, buff: 'focused', icon: '🧘' },
  },

  // Crafting Stations
  crafting: {
    workbench: { crafts: ['basic_gear', 'repairs'], icon: '🔧' },
    forge: { crafts: ['metal_items', 'weapons'], requires: 'blacksmith_access', icon: '⚒️' },
    alchemy_table: { crafts: ['potions', 'bait'], requires: 'recipe', icon: '⚗️' },
    enchanting_altar: { crafts: ['enchantments'], requires: 'magic_skill', icon: '✨' },
    bone_workstation: { crafts: ['bone_items'], region: 'cursed_waters', icon: '🦴' },
  },

  // Navigation Points
  navigation: {
    lighthouse: { effect: 'reveal_area', range: 'large', icon: '🗼' },
    watchtower: { effect: 'reveal_enemies', range: 'medium', icon: '🏰' },
    signpost: { effect: 'show_directions', icon: '🪧' },
    ancient_map_stone: { effect: 'reveal_secrets', requires: 'translation', icon: '🗿' },
  },

  // Environmental Hazards
  hazards: {
    whirlpool: { damage: 50, escape_dc: 15, icon: '🌀' },
    quicksand: { damage: 0, trap: true, escape_dc: 12, icon: '⚠️' },
    poison_gas: { damage: 10, per_second: true, icon: '☁️' },
    cursed_ground: { effect: 'curse', duration: 'until_removed', icon: '💀' },
    thin_ice: { collapse_chance: 0.3, damage: 75, region: 'frozen_north', icon: '🧊' },
  },
};

// ============================================================================
// SECTION 12: EXPORT ALL
// ============================================================================

export default {
  WORLD_REGIONS,
  MAP_LEGEND,
  SHIPS,
  PORTS,
  ISLANDS,
  NPC_DISTRIBUTION,
  BUILDINGS,
  SHOPS,
  TRAVEL_ITEMS,
  DAILY_SPECIALS_SYSTEM,
  WORLD_OBJECTS,
};
