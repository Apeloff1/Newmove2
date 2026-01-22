/**
 * ============================================================================
 * OPEN WORLD ASSETS - 3000+ Lines of World Building Content
 * ============================================================================
 * A comprehensive collection of assets for creating a vibrant, living world
 * including environmental objects, wildlife, weather, ships, treasures, and more
 * ============================================================================
 */

// ============================================================================
// SECTION 1: ENVIRONMENTAL OBJECTS & DECORATIONS
// ============================================================================

export const ENVIRONMENTAL_OBJECTS = {
  // Trees and vegetation
  trees: [
    { id: 'palm_tree_tall', name: 'Tall Palm Tree', icon: '🌴', height: 'tall', swaySpeed: 0.8, dropsShadow: true, canClimb: true },
    { id: 'palm_tree_short', name: 'Short Palm Tree', icon: '🌴', height: 'short', swaySpeed: 1.2, dropsShadow: true, canClimb: false },
    { id: 'coconut_palm', name: 'Coconut Palm', icon: '🥥', height: 'tall', swaySpeed: 0.6, dropsShadow: true, canClimb: true, dropsItem: 'coconut' },
    { id: 'banana_tree', name: 'Banana Tree', icon: '🍌', height: 'medium', swaySpeed: 1.0, dropsShadow: true, dropsItem: 'banana' },
    { id: 'mangrove', name: 'Mangrove Tree', icon: '🌳', height: 'medium', swaySpeed: 0.4, inWater: true, hidesFish: true },
    { id: 'dead_tree', name: 'Dead Tree', icon: '🪵', height: 'medium', swaySpeed: 0, dropsShadow: true, spooky: true },
    { id: 'willow', name: 'Weeping Willow', icon: '🌳', height: 'tall', swaySpeed: 1.5, dropsShadow: true, romantic: true },
    { id: 'oak_ancient', name: 'Ancient Oak', icon: '🌳', height: 'massive', swaySpeed: 0.2, dropsShadow: true, hasSecret: true },
  ],
  
  // Rocks and geological features
  rocks: [
    { id: 'boulder_large', name: 'Large Boulder', icon: '🪨', size: 'large', climbable: true, hidesItems: true },
    { id: 'boulder_small', name: 'Small Boulder', icon: '🪨', size: 'small', climbable: false, kickable: true },
    { id: 'rock_formation', name: 'Rock Formation', icon: '⛰️', size: 'massive', climbable: true, hasView: true },
    { id: 'coral_rock', name: 'Coral Rock', icon: '🪸', size: 'medium', underwater: true, attractsFish: true },
    { id: 'volcanic_rock', name: 'Volcanic Rock', icon: '🌋', size: 'large', warm: true, glows: true },
    { id: 'crystal_formation', name: 'Crystal Formation', icon: '💎', size: 'medium', glows: true, magical: true },
    { id: 'moss_rock', name: 'Moss-Covered Rock', icon: '🪨', size: 'medium', slippery: true, ancient: true },
    { id: 'tide_pool_rock', name: 'Tide Pool Rock', icon: '🪨', size: 'large', hasTidePool: true, containsCreatures: true },
  ],
  
  // Beach and coastal objects
  coastal: [
    { id: 'driftwood_large', name: 'Large Driftwood', icon: '🪵', size: 'large', sittable: true, collectible: false },
    { id: 'driftwood_small', name: 'Small Driftwood', icon: '🪵', size: 'small', collectible: true, fuelValue: 5 },
    { id: 'seashell_pile', name: 'Seashell Pile', icon: '🐚', size: 'small', collectible: true, value: 2 },
    { id: 'sand_castle', name: 'Sand Castle', icon: '🏰', size: 'medium', destructible: true, madeBy: 'child_npc' },
    { id: 'beach_umbrella', name: 'Beach Umbrella', icon: '⛱️', size: 'medium', provideShade: true, colorVariants: 5 },
    { id: 'beach_chair', name: 'Beach Chair', icon: '🪑', size: 'small', sittable: true, relaxing: true },
    { id: 'fishing_net_drying', name: 'Drying Fishing Net', icon: '🕸️', size: 'large', decorative: true, smell: 'fishy' },
    { id: 'anchor_old', name: 'Old Anchor', icon: '⚓', size: 'large', rusted: true, historical: true },
    { id: 'rowboat_beached', name: 'Beached Rowboat', icon: '🚣', size: 'large', repairable: true, usable: false },
    { id: 'message_bottle', name: 'Message in a Bottle', icon: '🍾', size: 'tiny', collectible: true, startsQuest: true },
  ],
  
  // Port and dock structures
  port: [
    { id: 'wooden_dock', name: 'Wooden Dock', icon: '🪵', size: 'large', walkable: true, fishingSpot: true },
    { id: 'stone_pier', name: 'Stone Pier', icon: '🧱', size: 'massive', walkable: true, shipsCanDock: true },
    { id: 'mooring_post', name: 'Mooring Post', icon: '🪵', size: 'small', tiesRope: true, birds: true },
    { id: 'cargo_crate', name: 'Cargo Crate', icon: '📦', size: 'medium', stackable: true, breakable: true, loot: true },
    { id: 'barrel_fish', name: 'Fish Barrel', icon: '🛢️', size: 'medium', smelly: true, attractsCats: true },
    { id: 'barrel_rum', name: 'Rum Barrel', icon: '🛢️', size: 'medium', drinkable: true, valuable: true },
    { id: 'rope_coil', name: 'Coiled Rope', icon: '🪢', size: 'small', collectible: true, usefulItem: true },
    { id: 'lantern_post', name: 'Lantern Post', icon: '🏮', size: 'tall', lightsAtNight: true, attractsMoths: true },
    { id: 'crane_cargo', name: 'Cargo Crane', icon: '🏗️', size: 'massive', animated: true, liftsThings: true },
    { id: 'fishmonger_stall', name: 'Fishmonger Stall', icon: '🐟', size: 'large', sellsFish: true, hasNpc: true },
    { id: 'fruit_stand', name: 'Fruit Stand', icon: '🍎', size: 'medium', sellsFood: true, colorful: true },
    { id: 'tavern_sign', name: 'Tavern Sign', icon: '🪧', size: 'small', swings: true, creaks: true },
  ],
  
  // Buildings and structures
  buildings: [
    { id: 'lighthouse', name: 'Lighthouse', icon: '🗼', size: 'massive', rotatingLight: true, climbable: true, hasKeeper: true },
    { id: 'watchtower', name: 'Watchtower', icon: '🗼', size: 'large', climbable: true, hasGuard: true, seesFar: true },
    { id: 'fisherman_hut', name: 'Fisherman Hut', icon: '🛖', size: 'medium', enterable: true, hasNpc: true, smellsFishy: true },
    { id: 'tavern', name: 'The Salty Mermaid Tavern', icon: '🍺', size: 'large', enterable: true, hasMusic: true, servesFood: true },
    { id: 'blacksmith', name: 'Blacksmith Forge', icon: '⚒️', size: 'medium', enterable: true, sellsGear: true, sparks: true },
    { id: 'general_store', name: 'General Store', icon: '🏪', size: 'medium', enterable: true, sellsEverything: true },
    { id: 'mansion_governor', name: 'Governor Mansion', icon: '🏛️', size: 'massive', enterable: true, fancy: true, hasGuards: true },
    { id: 'church_small', name: 'Small Chapel', icon: '⛪', size: 'large', enterable: true, peaceful: true, heals: true },
    { id: 'windmill', name: 'Old Windmill', icon: '🌀', size: 'large', rotating: true, grainStorage: true, haunted: true },
    { id: 'shipyard', name: 'Shipyard', icon: '🚢', size: 'massive', buildsShips: true, busy: true, hasWorkers: true },
    { id: 'jail', name: 'Town Jail', icon: '🏚️', size: 'medium', enterable: true, depressing: true, hasGuard: true },
    { id: 'market_square', name: 'Market Square', icon: '🏪', size: 'massive', openAir: true, manyNpcs: true, busy: true },
  ],
};

// ============================================================================
// SECTION 2: WILDLIFE & CREATURES
// ============================================================================

export const WILDLIFE = {
  // Sea creatures (visible in water)
  seaCreatures: [
    { id: 'dolphin', name: 'Playful Dolphin', icon: '🐬', behavior: 'playful', jumps: true, friendly: true, rare: false, points: 50 },
    { id: 'whale', name: 'Majestic Whale', icon: '🐋', behavior: 'majestic', jumps: true, friendly: true, rare: true, points: 500 },
    { id: 'shark', name: 'Reef Shark', icon: '🦈', behavior: 'patrol', dangerous: true, rare: false, scaresFish: true },
    { id: 'shark_great_white', name: 'Great White Shark', icon: '🦈', behavior: 'hunt', dangerous: true, rare: true, terrifying: true },
    { id: 'sea_turtle', name: 'Sea Turtle', icon: '🐢', behavior: 'slow', friendly: true, rare: false, wise: true, points: 100 },
    { id: 'octopus', name: 'Giant Octopus', icon: '🐙', behavior: 'curious', intelligent: true, rare: true, canHelp: true },
    { id: 'jellyfish', name: 'Jellyfish Swarm', icon: '🪼', behavior: 'drift', dangerous: true, glows: true, beautiful: true },
    { id: 'manta_ray', name: 'Manta Ray', icon: '🦈', behavior: 'glide', friendly: true, rare: true, graceful: true, points: 200 },
    { id: 'seahorse', name: 'Seahorse', icon: '🦑', behavior: 'hover', tiny: true, collectible: false, cute: true },
    { id: 'starfish', name: 'Starfish', icon: '⭐', behavior: 'stationary', collectible: true, colorful: true, value: 5 },
    { id: 'crab', name: 'Scuttling Crab', icon: '🦀', behavior: 'scuttle', pinches: true, collectible: true, value: 10 },
    { id: 'lobster', name: 'Lobster', icon: '🦞', behavior: 'hide', valuable: true, rare: false, delicious: true, value: 25 },
    { id: 'seal', name: 'Harbor Seal', icon: '🦭', behavior: 'playful', friendly: true, barks: true, cute: true },
    { id: 'eel', name: 'Moray Eel', icon: '🐍', behavior: 'lurk', dangerous: true, hides: true, scary: true },
    { id: 'squid', name: 'Squid', icon: '🦑', behavior: 'jet', fast: true, inksWhenScared: true, edible: true },
    { id: 'clam', name: 'Giant Clam', icon: '🐚', behavior: 'stationary', hasPearl: true, rare: true, value: 100 },
  ],
  
  // Birds
  birds: [
    { id: 'seagull', name: 'Seagull', icon: '🐦', behavior: 'scavenge', annoying: true, stealsFood: true, common: true },
    { id: 'pelican', name: 'Pelican', icon: '🐦', behavior: 'fish', bigBeak: true, friendly: false, swallowsFish: true },
    { id: 'albatross', name: 'Albatross', icon: '🦅', behavior: 'soar', majestic: true, rare: true, goodOmen: true },
    { id: 'parrot', name: 'Parrot', icon: '🦜', behavior: 'perch', talks: true, colorful: true, canOwn: true },
    { id: 'crow', name: 'Crow', icon: '🐦‍⬛', behavior: 'watch', intelligent: true, creepy: true, remembersYou: true },
    { id: 'heron', name: 'Blue Heron', icon: '🦩', behavior: 'fish', elegant: true, patient: true, rare: false },
    { id: 'flamingo', name: 'Flamingo', icon: '🦩', behavior: 'stand', pink: true, stands1Leg: true, tropical: true },
    { id: 'eagle', name: 'Sea Eagle', icon: '🦅', behavior: 'hunt', majestic: true, powerful: true, rare: true },
    { id: 'owl', name: 'Owl', icon: '🦉', behavior: 'nocturnal', wise: true, hootsAtNight: true, rare: false },
    { id: 'toucan', name: 'Toucan', icon: '🦜', behavior: 'perch', colorful: true, bigBeak: true, tropical: true },
  ],
  
  // Land animals
  landAnimals: [
    { id: 'cat_stray', name: 'Stray Cat', icon: '🐱', behavior: 'wander', pettable: true, lovesFish: true, adoptable: true },
    { id: 'cat_ships', name: 'Ship Cat', icon: '🐱', behavior: 'patrol', catchesMice: true, lucky: true, friendly: true },
    { id: 'dog_loyal', name: 'Loyal Dog', icon: '🐕', behavior: 'follow', pettable: true, canAdopt: true, helpful: true },
    { id: 'dog_stray', name: 'Stray Dog', icon: '🐕', behavior: 'wander', hungry: true, adoptable: true, sad: true },
    { id: 'rat', name: 'Rat', icon: '🐀', behavior: 'scurry', pest: true, stealsFood: true, common: true },
    { id: 'monkey', name: 'Mischievous Monkey', icon: '🐒', behavior: 'mischief', stealsItems: true, funny: true, trainable: true },
    { id: 'iguana', name: 'Iguana', icon: '🦎', behavior: 'bask', lazy: true, tropical: true, harmless: true },
    { id: 'snake', name: 'Snake', icon: '🐍', behavior: 'slither', dangerous: true, scary: true, rare: false },
    { id: 'goat', name: 'Wild Goat', icon: '🐐', behavior: 'climb', eatsEverything: true, stubborn: true },
    { id: 'chicken', name: 'Chicken', icon: '🐔', behavior: 'peck', laysEggs: true, noisy: true, common: true },
    { id: 'pig', name: 'Pig', icon: '🐷', behavior: 'root', smelly: true, finds Truffles: true, cute: true },
    { id: 'horse', name: 'Horse', icon: '🐴', behavior: 'graze', rideable: true, fast: true, valuable: true },
    { id: 'donkey', name: 'Stubborn Donkey', icon: '🫏', behavior: 'stand', stubborn: true, carriesCargo: true },
    { id: 'hermit_crab', name: 'Hermit Crab', icon: '🦀', behavior: 'scuttle', changesShells: true, cute: true },
  ],
  
  // Mythical/rare creatures (Easter eggs)
  mythical: [
    { id: 'mermaid', name: 'Mermaid', icon: '🧜‍♀️', behavior: 'sing', rare: true, magical: true, grantsWish: true, sighting: 0.001 },
    { id: 'sea_serpent', name: 'Sea Serpent', icon: '🐉', behavior: 'lurk', legendary: true, dangerous: true, sighting: 0.0005 },
    { id: 'kraken', name: 'Kraken', icon: '🦑', behavior: 'sleep', legendary: true, terrifying: true, sighting: 0.0001 },
    { id: 'ghost_ship', name: 'Ghost Ship', icon: '👻', behavior: 'drift', supernatural: true, scary: true, sighting: 0.002 },
    { id: 'flying_dutchman', name: 'Flying Dutchman', icon: '🚢', behavior: 'sail', legendary: true, cursed: true, sighting: 0.0001 },
    { id: 'will_o_wisp', name: 'Will-o-Wisp', icon: '✨', behavior: 'float', mysterious: true, misleading: true, sighting: 0.01 },
    { id: 'golden_fish', name: 'Golden Fish', icon: '🐠', behavior: 'swim', magical: true, grantsWish: true, sighting: 0.0005 },
    { id: 'phoenix_feather', name: 'Phoenix Feather', icon: '🪶', behavior: 'drift', magical: true, collectible: true, sighting: 0.001 },
  ],
};

// ============================================================================
// SECTION 3: WEATHER SYSTEMS & EFFECTS
// ============================================================================

export const WEATHER_SYSTEMS = {
  // Weather types with full parameters
  types: {
    clear: {
      id: 'clear',
      name: 'Clear Skies',
      icon: '☀️',
      description: 'Perfect fishing weather',
      skyColor: '#87CEEB',
      lightIntensity: 1.0,
      windSpeed: 0.2,
      waveHeight: 0.3,
      visibility: 1.0,
      fishActivity: 1.0,
      npcMood: 'happy',
      ambientSounds: ['seagulls', 'gentle_waves', 'distant_chatter'],
      particles: [],
      duration: { min: 120, max: 480 },
      transitionsTo: ['partly_cloudy', 'windy'],
    },
    partly_cloudy: {
      id: 'partly_cloudy',
      name: 'Partly Cloudy',
      icon: '⛅',
      description: 'Some clouds, still nice',
      skyColor: '#B0C4DE',
      lightIntensity: 0.85,
      windSpeed: 0.4,
      waveHeight: 0.5,
      visibility: 0.9,
      fishActivity: 1.1,
      npcMood: 'neutral',
      ambientSounds: ['wind_light', 'waves', 'birds'],
      particles: ['cloud_shadows'],
      duration: { min: 60, max: 240 },
      transitionsTo: ['clear', 'cloudy', 'windy'],
    },
    cloudy: {
      id: 'cloudy',
      name: 'Overcast',
      icon: '☁️',
      description: 'Grey skies overhead',
      skyColor: '#708090',
      lightIntensity: 0.6,
      windSpeed: 0.5,
      waveHeight: 0.6,
      visibility: 0.75,
      fishActivity: 1.2,
      npcMood: 'neutral',
      ambientSounds: ['wind_medium', 'waves', 'creaking_wood'],
      particles: ['cloud_shadows'],
      duration: { min: 60, max: 180 },
      transitionsTo: ['partly_cloudy', 'drizzle', 'rain'],
    },
    drizzle: {
      id: 'drizzle',
      name: 'Light Drizzle',
      icon: '🌦️',
      description: 'Light rain, still fishable',
      skyColor: '#696969',
      lightIntensity: 0.5,
      windSpeed: 0.4,
      waveHeight: 0.7,
      visibility: 0.6,
      fishActivity: 1.3,
      npcMood: 'grumpy',
      ambientSounds: ['light_rain', 'dripping', 'puddles'],
      particles: ['rain_light', 'ripples'],
      duration: { min: 30, max: 120 },
      transitionsTo: ['cloudy', 'rain', 'clearing'],
    },
    rain: {
      id: 'rain',
      name: 'Rainy',
      icon: '🌧️',
      description: 'Steady rain',
      skyColor: '#4A4A4A',
      lightIntensity: 0.4,
      windSpeed: 0.6,
      waveHeight: 1.0,
      visibility: 0.4,
      fishActivity: 1.4,
      npcMood: 'seeking_shelter',
      ambientSounds: ['rain_medium', 'thunder_distant', 'splashing'],
      particles: ['rain_medium', 'ripples', 'puddle_splashes'],
      duration: { min: 30, max: 90 },
      transitionsTo: ['drizzle', 'storm', 'clearing'],
    },
    storm: {
      id: 'storm',
      name: 'Storm',
      icon: '⛈️',
      description: 'Dangerous storm conditions',
      skyColor: '#2F2F2F',
      lightIntensity: 0.2,
      windSpeed: 1.0,
      waveHeight: 2.0,
      visibility: 0.2,
      fishActivity: 0.5,
      npcMood: 'sheltering',
      ambientSounds: ['rain_heavy', 'thunder_close', 'wind_howling', 'waves_crashing'],
      particles: ['rain_heavy', 'lightning', 'debris', 'sea_spray'],
      duration: { min: 15, max: 45 },
      transitionsTo: ['rain', 'clearing'],
      dangerous: true,
      canFish: false,
    },
    foggy: {
      id: 'foggy',
      name: 'Foggy',
      icon: '🌫️',
      description: 'Thick fog rolls in',
      skyColor: '#C0C0C0',
      lightIntensity: 0.5,
      windSpeed: 0.1,
      waveHeight: 0.3,
      visibility: 0.15,
      fishActivity: 0.8,
      npcMood: 'cautious',
      ambientSounds: ['fog_horn', 'muffled_sounds', 'dripping', 'eerie_silence'],
      particles: ['fog_thick', 'mist'],
      duration: { min: 60, max: 180 },
      transitionsTo: ['clearing', 'drizzle'],
      spooky: true,
    },
    windy: {
      id: 'windy',
      name: 'Windy',
      icon: '💨',
      description: 'Strong winds',
      skyColor: '#87CEEB',
      lightIntensity: 0.9,
      windSpeed: 0.9,
      waveHeight: 1.2,
      visibility: 0.85,
      fishActivity: 0.7,
      npcMood: 'holding_hats',
      ambientSounds: ['wind_strong', 'flags_flapping', 'waves_choppy'],
      particles: ['leaves', 'dust', 'sea_spray'],
      duration: { min: 30, max: 120 },
      transitionsTo: ['clear', 'storm', 'cloudy'],
    },
    heatwave: {
      id: 'heatwave',
      name: 'Heat Wave',
      icon: '🥵',
      description: 'Scorching hot day',
      skyColor: '#FFE4B5',
      lightIntensity: 1.2,
      windSpeed: 0.1,
      waveHeight: 0.2,
      visibility: 0.8,
      fishActivity: 0.6,
      npcMood: 'seeking_shade',
      ambientSounds: ['cicadas', 'heat_shimmer', 'panting'],
      particles: ['heat_waves', 'dust_motes'],
      duration: { min: 120, max: 360 },
      transitionsTo: ['clear', 'storm'],
      drainStamina: true,
    },
    rainbow: {
      id: 'rainbow',
      name: 'Rainbow',
      icon: '🌈',
      description: 'Beautiful rainbow appears',
      skyColor: '#ADD8E6',
      lightIntensity: 0.9,
      windSpeed: 0.3,
      waveHeight: 0.4,
      visibility: 1.0,
      fishActivity: 1.5,
      npcMood: 'delighted',
      ambientSounds: ['birds_singing', 'gentle_breeze', 'children_playing'],
      particles: ['sparkles', 'butterflies'],
      duration: { min: 10, max: 30 },
      transitionsTo: ['clear', 'partly_cloudy'],
      lucky: true,
      rare: true,
    },
  },
  
  // Time of day effects
  timeOfDay: {
    dawn: {
      id: 'dawn',
      name: 'Dawn',
      icon: '🌅',
      hours: { start: 5, end: 7 },
      skyGradient: ['#FF6B6B', '#FFE66D', '#87CEEB'],
      lightIntensity: 0.6,
      fishActivity: 1.3,
      npcActivity: 'waking_up',
      ambientSounds: ['roosters', 'birds_dawn_chorus', 'church_bells'],
      description: 'The world awakens',
    },
    morning: {
      id: 'morning',
      name: 'Morning',
      icon: '🌤️',
      hours: { start: 7, end: 12 },
      skyGradient: ['#87CEEB', '#B0E0E6'],
      lightIntensity: 0.9,
      fishActivity: 1.1,
      npcActivity: 'working',
      ambientSounds: ['market_bustle', 'hammering', 'conversations'],
      description: 'Busy morning at the port',
    },
    afternoon: {
      id: 'afternoon',
      name: 'Afternoon',
      icon: '☀️',
      hours: { start: 12, end: 17 },
      skyGradient: ['#87CEEB', '#FFE4B5'],
      lightIntensity: 1.0,
      fishActivity: 0.8,
      npcActivity: 'slowing_down',
      ambientSounds: ['lazy_afternoon', 'seagulls', 'distant_music'],
      description: 'Hot afternoon sun',
    },
    evening: {
      id: 'evening',
      name: 'Evening',
      icon: '🌆',
      hours: { start: 17, end: 20 },
      skyGradient: ['#FFE4B5', '#FF6B6B', '#4A4A8A'],
      lightIntensity: 0.7,
      fishActivity: 1.2,
      npcActivity: 'relaxing',
      ambientSounds: ['tavern_music', 'laughter', 'clinking_glasses'],
      description: 'Golden hour fishing',
    },
    dusk: {
      id: 'dusk',
      name: 'Dusk',
      icon: '🌇',
      hours: { start: 20, end: 21 },
      skyGradient: ['#4A4A8A', '#2F2F4F', '#1A1A2E'],
      lightIntensity: 0.4,
      fishActivity: 1.4,
      npcActivity: 'heading_home',
      ambientSounds: ['crickets_start', 'lanterns_lighting', 'doors_closing'],
      description: 'The twilight hour',
    },
    night: {
      id: 'night',
      name: 'Night',
      icon: '🌙',
      hours: { start: 21, end: 5 },
      skyGradient: ['#1A1A2E', '#0D0D1A'],
      lightIntensity: 0.15,
      fishActivity: 1.0,
      npcActivity: 'sleeping',
      ambientSounds: ['crickets', 'owl_hoots', 'waves_gentle', 'distant_singing'],
      description: 'Stars twinkle above',
      specialCreatures: ['bioluminescent_fish', 'fireflies'],
    },
  },
  
  // Seasonal effects
  seasons: {
    spring: {
      id: 'spring',
      name: 'Spring',
      icon: '🌸',
      months: [3, 4, 5],
      baseTemperature: 18,
      weatherWeights: { clear: 0.3, partly_cloudy: 0.3, rain: 0.25, windy: 0.15 },
      specialEvents: ['cherry_blossom_festival', 'fishing_tournament_spring'],
      fishSpawning: true,
      plantGrowth: 'fast',
      npcMood: 'optimistic',
      particles: ['cherry_blossoms', 'butterflies', 'pollen'],
      description: 'New beginnings and blooming flowers',
    },
    summer: {
      id: 'summer',
      name: 'Summer',
      icon: '☀️',
      months: [6, 7, 8],
      baseTemperature: 28,
      weatherWeights: { clear: 0.5, heatwave: 0.2, storm: 0.15, partly_cloudy: 0.15 },
      specialEvents: ['summer_festival', 'shark_week', 'treasure_hunt'],
      touristSeason: true,
      longerDays: true,
      npcMood: 'relaxed',
      particles: ['fireflies', 'heat_waves'],
      description: 'Hot days and busy ports',
    },
    autumn: {
      id: 'autumn',
      name: 'Autumn',
      icon: '🍂',
      months: [9, 10, 11],
      baseTemperature: 15,
      weatherWeights: { cloudy: 0.3, windy: 0.25, rain: 0.2, foggy: 0.15, clear: 0.1 },
      specialEvents: ['harvest_festival', 'ghost_ship_sightings', 'fishing_tournament_fall'],
      fishMigration: true,
      plantGrowth: 'slow',
      npcMood: 'nostalgic',
      particles: ['falling_leaves', 'mist'],
      description: 'Colorful leaves and cooler winds',
    },
    winter: {
      id: 'winter',
      name: 'Winter',
      icon: '❄️',
      months: [12, 1, 2],
      baseTemperature: 8,
      weatherWeights: { cloudy: 0.35, rain: 0.25, storm: 0.2, foggy: 0.15, clear: 0.05 },
      specialEvents: ['winter_festival', 'new_year', 'ice_fishing_challenge'],
      shorterDays: true,
      fishDeeper: true,
      npcMood: 'cozy',
      particles: ['rain', 'mist', 'breath_visible'],
      description: 'Cold seas and warm taverns',
    },
  },
};

// ============================================================================
// SECTION 4: SHIPS & VESSELS
// ============================================================================

export const SHIPS = {
  // Player-ownable boats
  playerBoats: [
    {
      id: 'rowboat',
      name: 'Old Rowboat',
      icon: '🚣',
      description: 'A simple rowboat. It floats. Mostly.',
      price: 0,
      speed: 1,
      capacity: 2,
      durability: 50,
      fishingBonus: 0,
      storageSlots: 5,
      requirements: null,
      upgrades: ['oars_better', 'seat_cushion'],
    },
    {
      id: 'fishing_boat',
      name: 'Fishing Boat',
      icon: '🚤',
      description: 'A proper fishing vessel with rod holders',
      price: 500,
      speed: 2,
      capacity: 4,
      durability: 100,
      fishingBonus: 0.2,
      storageSlots: 15,
      requirements: { level: 5 },
      upgrades: ['fish_finder', 'better_nets', 'ice_box'],
    },
    {
      id: 'sailboat',
      name: 'Small Sailboat',
      icon: '⛵',
      description: 'Harness the wind for free travel',
      price: 1500,
      speed: 4,
      capacity: 6,
      durability: 120,
      fishingBonus: 0.1,
      storageSlots: 20,
      requirements: { level: 10, skill: 'sailing_basic' },
      upgrades: ['larger_sail', 'cabin', 'anchor_winch'],
    },
    {
      id: 'sloop',
      name: 'Merchant Sloop',
      icon: '🚢',
      description: 'A fast trading vessel',
      price: 5000,
      speed: 6,
      capacity: 10,
      durability: 200,
      fishingBonus: 0.15,
      storageSlots: 50,
      requirements: { level: 20, reputation: 'merchant_guild' },
      upgrades: ['cargo_hold', 'speed_sails', 'navigation_tools'],
    },
    {
      id: 'schooner',
      name: 'Fishing Schooner',
      icon: '🚢',
      description: 'Professional fishing vessel',
      price: 10000,
      speed: 5,
      capacity: 15,
      durability: 250,
      fishingBonus: 0.4,
      storageSlots: 80,
      requirements: { level: 30, fishCaught: 1000 },
      upgrades: ['processing_deck', 'crew_quarters', 'fishing_crane'],
    },
    {
      id: 'galleon',
      name: 'Galleon',
      icon: '🚢',
      description: 'A mighty ship fit for a captain',
      price: 50000,
      speed: 4,
      capacity: 50,
      durability: 500,
      fishingBonus: 0.3,
      storageSlots: 200,
      requirements: { level: 50, reputation: 'sea_legend' },
      upgrades: ['cannons', 'treasure_room', 'captains_quarters'],
      legendary: true,
    },
  ],
  
  // NPC/ambient ships
  ambientShips: [
    { id: 'merchant_ship', name: 'Merchant Vessel', icon: '🚢', behavior: 'trade_route', speed: 3, canInteract: true },
    { id: 'fishing_trawler', name: 'Fishing Trawler', icon: '🚢', behavior: 'fishing', speed: 2, canInteract: true },
    { id: 'navy_ship', name: 'Navy Ship', icon: '⚓', behavior: 'patrol', speed: 5, canInteract: false, authoritative: true },
    { id: 'pirate_ship', name: 'Pirate Ship', icon: '🏴‍☠️', behavior: 'hunt', speed: 6, dangerous: true, rare: true },
    { id: 'pleasure_yacht', name: 'Pleasure Yacht', icon: '🛥️', behavior: 'cruise', speed: 4, fancy: true },
    { id: 'cargo_barge', name: 'Cargo Barge', icon: '🚢', behavior: 'slow_trade', speed: 1, huge: true },
    { id: 'whaling_ship', name: 'Whaling Ship', icon: '🚢', behavior: 'hunt_whales', speed: 3, controversial: true },
    { id: 'research_vessel', name: 'Research Vessel', icon: '🚢', behavior: 'study', speed: 2, scientific: true },
    { id: 'ferry', name: 'Island Ferry', icon: '⛴️', behavior: 'scheduled_route', speed: 4, rideable: true, cost: 10 },
    { id: 'gondola', name: 'Gondola', icon: '🛶', behavior: 'romantic_tour', speed: 1, romantic: true, cost: 25 },
  ],
  
  // Shipwrecks (explorable)
  shipwrecks: [
    {
      id: 'wreck_merchant',
      name: 'Sunken Merchant Ship',
      icon: '🚢',
      depth: 'shallow',
      loot: ['gold_coins', 'trade_goods', 'maps'],
      difficulty: 'easy',
      story: 'A merchant ship that ran aground during a storm 50 years ago',
    },
    {
      id: 'wreck_pirate',
      name: 'Blackbeard\'s Revenge',
      icon: '🏴‍☠️',
      depth: 'medium',
      loot: ['treasure_chest', 'cursed_gold', 'pirate_gear'],
      difficulty: 'medium',
      story: 'The infamous pirate ship, sunk by the navy in a legendary battle',
      haunted: true,
    },
    {
      id: 'wreck_ancient',
      name: 'Ancient Galley',
      icon: '⚓',
      depth: 'deep',
      loot: ['ancient_artifacts', 'rare_gems', 'historical_documents'],
      difficulty: 'hard',
      story: 'A ship from a forgotten civilization, holding secrets of the past',
      mysterious: true,
    },
    {
      id: 'wreck_navy',
      name: 'HMS Indomitable',
      icon: '⚓',
      depth: 'medium',
      loot: ['naval_weapons', 'uniforms', 'ship_logs'],
      difficulty: 'medium',
      story: 'A proud navy vessel lost in the great storm of 1823',
    },
    {
      id: 'wreck_ghost',
      name: 'The Spectral Maiden',
      icon: '👻',
      depth: 'deep',
      loot: ['ghost_essence', 'cursed_items', 'spirit_gems'],
      difficulty: 'extreme',
      story: 'A ship that exists between worlds, appearing only on foggy nights',
      supernatural: true,
      onlyVisibleDuring: 'foggy_night',
    },
  ],
};

// ============================================================================
// SECTION 5: TREASURE & COLLECTIBLES
// ============================================================================

export const TREASURES = {
  // Buried treasure types
  buriedTreasure: [
    {
      id: 'common_chest',
      name: 'Weathered Chest',
      icon: '📦',
      rarity: 'common',
      contents: { gold: { min: 10, max: 50 }, items: ['fishing_supplies', 'basic_gear'] },
      xpReward: 25,
      digTime: 3,
    },
    {
      id: 'pirates_stash',
      name: 'Pirate\'s Stash',
      icon: '💰',
      rarity: 'uncommon',
      contents: { gold: { min: 50, max: 200 }, items: ['rum', 'pirate_gear', 'maps'] },
      xpReward: 100,
      digTime: 5,
      hasMap: true,
    },
    {
      id: 'merchants_cache',
      name: 'Merchant\'s Cache',
      icon: '📦',
      rarity: 'uncommon',
      contents: { gold: { min: 100, max: 300 }, items: ['trade_goods', 'exotic_items'] },
      xpReward: 150,
      digTime: 5,
    },
    {
      id: 'royal_treasure',
      name: 'Royal Treasure Chest',
      icon: '👑',
      rarity: 'rare',
      contents: { gold: { min: 500, max: 1000 }, items: ['crown_jewels', 'royal_artifacts', 'rare_gems'] },
      xpReward: 500,
      digTime: 10,
      requiresKey: 'royal_key',
    },
    {
      id: 'captains_hoard',
      name: 'Captain\'s Hoard',
      icon: '🏴‍☠️',
      rarity: 'rare',
      contents: { gold: { min: 300, max: 800 }, items: ['legendary_fishing_rod', 'captain_hat', 'treasure_map'] },
      xpReward: 400,
      digTime: 8,
      trapped: true,
    },
    {
      id: 'ancient_reliquary',
      name: 'Ancient Reliquary',
      icon: '🏺',
      rarity: 'epic',
      contents: { gold: { min: 1000, max: 3000 }, items: ['ancient_artifact', 'magical_item', 'historical_document'] },
      xpReward: 1000,
      digTime: 15,
      requiresQuest: 'ancient_mystery',
    },
    {
      id: 'saltbeards_treasure',
      name: 'Saltbeard\'s Legendary Treasure',
      icon: '⭐',
      rarity: 'legendary',
      contents: { gold: { min: 10000, max: 10000 }, items: ['saltbeards_cutlass', 'golden_compass', 'deed_to_island'] },
      xpReward: 5000,
      digTime: 30,
      requiresQuest: 'main_story_complete',
      oneTimeOnly: true,
    },
  ],
  
  // Collectible items scattered around world
  collectibles: {
    seashells: [
      { id: 'shell_common', name: 'Common Shell', icon: '🐚', rarity: 'common', value: 1, found: 'beaches' },
      { id: 'shell_spiral', name: 'Spiral Shell', icon: '🐚', rarity: 'uncommon', value: 5, found: 'rocky_shores' },
      { id: 'shell_conch', name: 'Conch Shell', icon: '🐚', rarity: 'rare', value: 25, found: 'hidden_coves', canBlowHorn: true },
      { id: 'shell_rainbow', name: 'Rainbow Shell', icon: '🐚', rarity: 'epic', value: 100, found: 'after_rainbow', magical: true },
      { id: 'shell_golden', name: 'Golden Shell', icon: '🐚', rarity: 'legendary', value: 500, found: 'mermaid_lagoon', wishGranting: true },
    ],
    bottles: [
      { id: 'bottle_empty', name: 'Empty Bottle', icon: '🍾', rarity: 'common', value: 1, craftingMaterial: true },
      { id: 'bottle_message', name: 'Message in a Bottle', icon: '🍾', rarity: 'uncommon', value: 10, containsClue: true },
      { id: 'bottle_map', name: 'Bottle with Map', icon: '🍾', rarity: 'rare', value: 50, containsTreasureMap: true },
      { id: 'bottle_genie', name: 'Suspicious Glowing Bottle', icon: '🍾', rarity: 'legendary', value: 1000, containsSpirit: true },
    ],
    artifacts: [
      { id: 'coin_old', name: 'Old Coin', icon: '🪙', rarity: 'common', value: 5, historical: true },
      { id: 'coin_pirate', name: 'Pirate Doubloon', icon: '🪙', rarity: 'uncommon', value: 25, pirateHistory: true },
      { id: 'coin_ancient', name: 'Ancient Coin', icon: '🪙', rarity: 'rare', value: 100, ancientCivilization: true },
      { id: 'idol_small', name: 'Small Idol', icon: '🗿', rarity: 'rare', value: 200, mysterious: true },
      { id: 'idol_cursed', name: 'Cursed Idol', icon: '🗿', rarity: 'epic', value: 500, cursed: true, quest: true },
      { id: 'crown_lost', name: 'Lost Crown', icon: '👑', rarity: 'legendary', value: 2500, royalHistory: true },
    ],
    flotsam: [
      { id: 'driftwood', name: 'Driftwood', icon: '🪵', rarity: 'common', value: 2, craftingMaterial: true },
      { id: 'rope_old', name: 'Old Rope', icon: '🪢', rarity: 'common', value: 3, craftingMaterial: true },
      { id: 'net_torn', name: 'Torn Fishing Net', icon: '🕸️', rarity: 'common', value: 5, repairable: true },
      { id: 'barrel_piece', name: 'Barrel Piece', icon: '🪵', rarity: 'common', value: 2, craftingMaterial: true },
      { id: 'ships_wheel', name: 'Ship\'s Wheel', icon: '☸️', rarity: 'rare', value: 75, decorative: true },
      { id: 'figurehead', name: 'Ship Figurehead', icon: '🗿', rarity: 'epic', value: 250, decorative: true, lucky: true },
    ],
  },
  
  // Treasure maps
  treasureMaps: [
    {
      id: 'map_beginner',
      name: 'Faded Treasure Map',
      difficulty: 'easy',
      clues: 3,
      reward: 'pirates_stash',
      region: 'barnacle_bay',
      description: 'An old map with simple markings',
    },
    {
      id: 'map_pirate',
      name: 'Pirate\'s Treasure Map',
      difficulty: 'medium',
      clues: 5,
      reward: 'captains_hoard',
      region: 'skull_island',
      description: 'X marks the spot... but where?',
    },
    {
      id: 'map_ancient',
      name: 'Ancient Parchment',
      difficulty: 'hard',
      clues: 7,
      reward: 'ancient_reliquary',
      region: 'forgotten_shores',
      description: 'Written in a forgotten language',
      requiresTranslation: true,
    },
    {
      id: 'map_saltbeard',
      name: 'Saltbeard\'s Final Map',
      difficulty: 'legendary',
      clues: 10,
      reward: 'saltbeards_treasure',
      region: 'all_regions',
      description: 'The legendary captain\'s ultimate secret',
      requiresAllMapPieces: true,
    },
  ],
};

// ============================================================================
// SECTION 6: AMBIENT EVENTS & WORLD EVENTS
// ============================================================================

export const WORLD_EVENTS = {
  // Random ambient events
  ambientEvents: [
    {
      id: 'seagull_steals_food',
      name: 'Seagull Theft',
      icon: '🐦',
      description: 'A seagull swoops down and steals food!',
      chance: 0.05,
      trigger: 'player_eating',
      effect: { loseItem: 'food' },
      funny: true,
    },
    {
      id: 'dolphin_show',
      name: 'Dolphin Show',
      icon: '🐬',
      description: 'A pod of dolphins performs tricks nearby',
      chance: 0.02,
      trigger: 'on_boat',
      effect: { moodBoost: 20, xp: 10 },
      beautiful: true,
    },
    {
      id: 'whale_sighting',
      name: 'Whale Sighting',
      icon: '🐋',
      description: 'A majestic whale breaches the surface!',
      chance: 0.005,
      trigger: 'deep_water',
      effect: { xp: 100, achievement: 'whale_watcher' },
      rare: true,
    },
    {
      id: 'shooting_star',
      name: 'Shooting Star',
      icon: '⭐',
      description: 'A shooting star streaks across the sky',
      chance: 0.01,
      trigger: 'night_time',
      effect: { luck: 50, duration: 300 },
      makeWish: true,
    },
    {
      id: 'rainbow_appears',
      name: 'Rainbow',
      icon: '🌈',
      description: 'A beautiful rainbow appears',
      chance: 0.1,
      trigger: 'after_rain',
      effect: { fishBonus: 0.5, duration: 600 },
      beautiful: true,
    },
    {
      id: 'message_bottle_wash',
      name: 'Message Washes Ashore',
      icon: '🍾',
      description: 'A message in a bottle washes up nearby',
      chance: 0.01,
      trigger: 'on_beach',
      effect: { giveItem: 'bottle_message' },
      startsQuest: true,
    },
    {
      id: 'fish_jumping',
      name: 'Fish Jumping',
      icon: '🐟',
      description: 'Fish are jumping out of the water!',
      chance: 0.08,
      trigger: 'fishing',
      effect: { fishBonus: 0.3, duration: 120 },
      goodOmen: true,
    },
    {
      id: 'storm_brewing',
      name: 'Storm Brewing',
      icon: '⛈️',
      description: 'Dark clouds gather on the horizon...',
      chance: 0.02,
      trigger: 'any',
      effect: { weatherChange: 'storm', delay: 300 },
      warning: true,
    },
    {
      id: 'bioluminescence',
      name: 'Bioluminescent Night',
      icon: '✨',
      description: 'The water glows with bioluminescent creatures',
      chance: 0.03,
      trigger: 'night_clear',
      effect: { visibility: 1.5, beautifulScene: true, xp: 50 },
      magical: true,
    },
    {
      id: 'sea_turtle_nesting',
      name: 'Sea Turtle Nesting',
      icon: '🐢',
      description: 'Sea turtles are nesting on the beach',
      chance: 0.01,
      trigger: 'night_beach',
      effect: { xp: 75, cantDisturb: true },
      seasonal: 'summer',
    },
  ],
  
  // Scheduled world events
  scheduledEvents: [
    {
      id: 'morning_market',
      name: 'Morning Fish Market',
      icon: '🐟',
      time: { start: 6, end: 10 },
      location: 'harbor_square',
      description: 'Fresh fish sold at better prices',
      effect: { sellBonus: 0.2 },
      daily: true,
    },
    {
      id: 'afternoon_siesta',
      name: 'Afternoon Siesta',
      icon: '😴',
      time: { start: 13, end: 15 },
      location: 'all_shops',
      description: 'Shops close for siesta',
      effect: { shopsClosed: true },
      daily: true,
      cultural: true,
    },
    {
      id: 'sunset_gathering',
      name: 'Sunset Gathering',
      icon: '🌅',
      time: { start: 18, end: 20 },
      location: 'lighthouse_point',
      description: 'Locals gather to watch the sunset',
      effect: { socialBonus: true, gossip: true },
      daily: true,
    },
    {
      id: 'tavern_happy_hour',
      name: 'Happy Hour',
      icon: '🍺',
      time: { start: 17, end: 19 },
      location: 'tavern',
      description: 'Drinks are half price!',
      effect: { drinkDiscount: 0.5 },
      daily: true,
    },
    {
      id: 'midnight_ghost_stories',
      name: 'Midnight Ghost Stories',
      icon: '👻',
      time: { start: 0, end: 2 },
      location: 'tavern',
      description: 'Old sailors share spooky tales',
      effect: { loreUnlock: true },
      daily: true,
      spooky: true,
    },
  ],
  
  // Special seasonal/yearly events
  specialEvents: [
    {
      id: 'fishing_tournament',
      name: 'Grand Fishing Tournament',
      icon: '🏆',
      duration: 3, // days
      season: 'summer',
      description: 'Annual fishing competition with big prizes',
      rewards: ['trophy', 'gold_1000', 'legendary_rod'],
      participants: 'all_fishers',
    },
    {
      id: 'pirate_festival',
      name: 'Pirate Festival',
      icon: '🏴‍☠️',
      duration: 7,
      month: 9,
      description: 'Celebrate the town\'s pirate heritage',
      activities: ['costume_contest', 'treasure_hunt', 'ship_parade'],
      rewards: ['pirate_outfit', 'gold_500'],
    },
    {
      id: 'ghost_ship_nights',
      name: 'Ghost Ship Nights',
      icon: '👻',
      duration: 3,
      month: 10,
      description: 'The ghost ship appears more frequently',
      spookyMultiplier: 3,
      ghostEncounters: true,
    },
    {
      id: 'winter_feast',
      name: 'Winter Feast',
      icon: '🎄',
      duration: 7,
      month: 12,
      description: 'The whole town celebrates together',
      activities: ['gift_exchange', 'feast', 'caroling'],
      rewards: ['festive_outfit', 'special_recipes'],
    },
    {
      id: 'new_year_fireworks',
      name: 'New Year\'s Celebration',
      icon: '🎆',
      duration: 1,
      date: '01-01',
      description: 'Fireworks and festivities!',
      activities: ['countdown', 'fireworks_show', 'new_year_fish'],
      rewards: ['firework_rod', 'gold_100'],
    },
    {
      id: 'migration_season',
      name: 'Great Fish Migration',
      icon: '🐟',
      duration: 14,
      season: 'autumn',
      description: 'Rare fish pass through these waters',
      rareFishBonus: 3,
      specialFish: ['golden_tuna', 'silver_marlin', 'rainbow_trout'],
    },
    {
      id: 'full_moon_fishing',
      name: 'Full Moon Fishing Night',
      icon: '🌕',
      duration: 1,
      frequency: 'monthly',
      description: 'Fish are more active under the full moon',
      nightFishingBonus: 2,
      mysticalCreatures: true,
    },
  ],
};

// ============================================================================
// SECTION 7: AMBIENT SOUNDS & MUSIC
// ============================================================================

export const AUDIO_ASSETS = {
  // Ambient sound layers
  ambientSounds: {
    beach: [
      { id: 'waves_gentle', volume: 0.6, loop: true, fadeIn: 2 },
      { id: 'seagulls_distant', volume: 0.3, loop: true, randomInterval: { min: 5, max: 15 } },
      { id: 'sand_footsteps', volume: 0.4, trigger: 'walking' },
      { id: 'wind_coastal', volume: 0.2, loop: true },
    ],
    port: [
      { id: 'harbor_bustle', volume: 0.5, loop: true, timeOfDay: 'day' },
      { id: 'ship_bells', volume: 0.3, randomInterval: { min: 30, max: 120 } },
      { id: 'seagulls_close', volume: 0.4, loop: true },
      { id: 'rope_creaking', volume: 0.2, loop: true },
      { id: 'water_lapping', volume: 0.4, loop: true },
      { id: 'merchants_calling', volume: 0.3, timeOfDay: 'morning' },
    ],
    tavern: [
      { id: 'tavern_chatter', volume: 0.5, loop: true },
      { id: 'glasses_clinking', volume: 0.3, randomInterval: { min: 3, max: 10 } },
      { id: 'laughter', volume: 0.3, randomInterval: { min: 10, max: 30 } },
      { id: 'fire_crackling', volume: 0.4, loop: true },
      { id: 'accordion_music', volume: 0.3, timeOfDay: 'evening' },
    ],
    ocean: [
      { id: 'ocean_waves', volume: 0.7, loop: true },
      { id: 'wind_ocean', volume: 0.4, loop: true },
      { id: 'dolphin_calls', volume: 0.2, randomInterval: { min: 60, max: 180 } },
      { id: 'ship_creaking', volume: 0.3, loop: true, onBoat: true },
    ],
    forest: [
      { id: 'birds_singing', volume: 0.5, loop: true, timeOfDay: 'day' },
      { id: 'leaves_rustling', volume: 0.3, loop: true },
      { id: 'insects', volume: 0.2, loop: true, timeOfDay: 'evening' },
      { id: 'owl_hooting', volume: 0.3, timeOfDay: 'night', randomInterval: { min: 30, max: 90 } },
    ],
    storm: [
      { id: 'rain_heavy', volume: 0.8, loop: true },
      { id: 'thunder', volume: 0.9, randomInterval: { min: 5, max: 20 } },
      { id: 'wind_howling', volume: 0.6, loop: true },
      { id: 'lightning_crack', volume: 1.0, trigger: 'lightning' },
    ],
  },
  
  // Music tracks
  musicTracks: {
    exploration: [
      { id: 'sea_shanty_calm', mood: 'peaceful', tempo: 'slow' },
      { id: 'adventure_theme', mood: 'exciting', tempo: 'medium' },
      { id: 'mysterious_cove', mood: 'mysterious', tempo: 'slow' },
      { id: 'sunny_harbor', mood: 'happy', tempo: 'upbeat' },
    ],
    fishing: [
      { id: 'patient_waiting', mood: 'relaxed', tempo: 'very_slow' },
      { id: 'the_catch', mood: 'exciting', tempo: 'fast', trigger: 'fish_bite' },
      { id: 'perfect_catch', mood: 'triumphant', tempo: 'medium', trigger: 'perfect_catch' },
    ],
    combat: [
      { id: 'rival_battle', mood: 'competitive', tempo: 'fast' },
      { id: 'boss_fight', mood: 'intense', tempo: 'very_fast' },
    ],
    story: [
      { id: 'emotional_moment', mood: 'touching', tempo: 'slow' },
      { id: 'victory_fanfare', mood: 'triumphant', tempo: 'medium' },
      { id: 'sad_farewell', mood: 'melancholy', tempo: 'slow' },
      { id: 'mystery_revealed', mood: 'mysterious', tempo: 'medium' },
    ],
    seasonal: [
      { id: 'spring_melody', season: 'spring', mood: 'hopeful' },
      { id: 'summer_vibes', season: 'summer', mood: 'relaxed' },
      { id: 'autumn_winds', season: 'autumn', mood: 'nostalgic' },
      { id: 'winter_warmth', season: 'winter', mood: 'cozy' },
    ],
  },
};

// ============================================================================
// SECTION 8: DECORATIVE PARTICLES & EFFECTS
// ============================================================================

export const PARTICLE_EFFECTS = {
  // Environmental particles
  environmental: {
    cherry_blossoms: {
      id: 'cherry_blossoms',
      icon: '🌸',
      count: 50,
      speed: { min: 0.5, max: 1.5 },
      sway: true,
      fadeOut: true,
      season: 'spring',
    },
    falling_leaves: {
      id: 'falling_leaves',
      icons: ['🍂', '🍁', '🍃'],
      count: 30,
      speed: { min: 0.3, max: 1.0 },
      sway: true,
      rotation: true,
      season: 'autumn',
    },
    snowflakes: {
      id: 'snowflakes',
      icon: '❄️',
      count: 100,
      speed: { min: 0.2, max: 0.8 },
      sway: true,
      season: 'winter',
    },
    fireflies: {
      id: 'fireflies',
      icon: '✨',
      count: 20,
      speed: { min: 0.1, max: 0.3 },
      glow: true,
      pulse: true,
      timeOfDay: 'night',
    },
    butterflies: {
      id: 'butterflies',
      icons: ['🦋'],
      count: 10,
      speed: { min: 0.5, max: 1.5 },
      erratic: true,
      season: 'spring',
    },
    bubbles: {
      id: 'bubbles',
      icon: '🫧',
      count: 30,
      speed: { min: 0.5, max: 2.0 },
      rise: true,
      pop: true,
      location: 'underwater',
    },
    dust_motes: {
      id: 'dust_motes',
      icon: '·',
      count: 50,
      speed: { min: 0.05, max: 0.2 },
      float: true,
      location: 'interior',
    },
    sea_spray: {
      id: 'sea_spray',
      icon: '💧',
      count: 40,
      speed: { min: 2, max: 5 },
      direction: 'wind',
      weather: ['windy', 'storm'],
    },
  },
  
  // Action effects
  actionEffects: {
    splash: {
      id: 'splash',
      icons: ['💧', '💦'],
      count: 15,
      speed: { min: 3, max: 6 },
      gravity: true,
      duration: 0.5,
      trigger: 'cast_line',
    },
    sparkle: {
      id: 'sparkle',
      icon: '✨',
      count: 10,
      speed: { min: 1, max: 3 },
      fadeOut: true,
      duration: 1,
      trigger: 'level_up',
    },
    coins: {
      id: 'coins',
      icon: '🪙',
      count: 20,
      speed: { min: 2, max: 4 },
      gravity: true,
      bounce: true,
      duration: 2,
      trigger: 'treasure_found',
    },
    hearts: {
      id: 'hearts',
      icon: '❤️',
      count: 5,
      speed: { min: 0.5, max: 1 },
      rise: true,
      fadeOut: true,
      duration: 1.5,
      trigger: 'npc_relationship_up',
    },
    confetti: {
      id: 'confetti',
      icons: ['🎊', '🎉', '✨'],
      count: 50,
      speed: { min: 2, max: 5 },
      gravity: true,
      rotation: true,
      duration: 3,
      trigger: 'achievement',
    },
    fish_jump: {
      id: 'fish_jump',
      icon: '🐟',
      count: 1,
      speed: { min: 3, max: 5 },
      arc: true,
      splash: true,
      duration: 1,
      trigger: 'fish_spotted',
    },
  },
};

// ============================================================================
// SECTION 9: WORLD REGIONS & AREAS
// ============================================================================

export const WORLD_REGIONS = {
  barnacle_bay: {
    id: 'barnacle_bay',
    name: 'Barnacle Bay',
    icon: '🏖️',
    description: 'The heart of Codswallop Cove, bustling with activity',
    subLocations: [
      { id: 'harbor_square', name: 'Barnacle Bay Plaza', type: 'social', npcs: 15 },
      { id: 'wobbly_pier', name: 'Wobbly Pier District', type: 'fishing', fishTypes: 'common' },
      { id: 'market_district', name: 'Overpriced Boulevard', type: 'shopping', shops: 8 },
      { id: 'tavern_district', name: 'The Tipsy Tentacle', type: 'social', entertainment: true },
      { id: 'lighthouse', name: 'The Tipsy Tower', type: 'landmark', climbable: true },
    ],
    weather: 'mild',
    dangerLevel: 0,
    unlocked: true,
  },
  skull_island: {
    id: 'skull_island',
    name: 'Skull Island',
    icon: '💀',
    description: 'A mysterious island shaped like a skull',
    subLocations: [
      { id: 'skull_beach', name: 'Beach of Broken Dreams', type: 'exploration', secrets: 5 },
      { id: 'pirate_cove', name: 'Pirates\' Hideout', type: 'dungeon', enemies: true },
      { id: 'treasure_caves', name: 'Captain Codswallop\'s Hoard', type: 'treasure', locked: true },
      { id: 'cursed_lagoon', name: 'The Probably Magical Lagoon', type: 'fishing', rareFish: true },
    ],
    weather: 'foggy',
    dangerLevel: 3,
    unlocked: false,
    requiresLevel: 10,
  },
  coral_reef: {
    id: 'coral_reef',
    name: 'Rainbow Reef',
    icon: '🪸',
    description: 'A vibrant underwater paradise',
    subLocations: [
      { id: 'shallow_reef', name: 'Shallow Waters', type: 'fishing', beginner: true },
      { id: 'deep_reef', name: 'The Abyss Lite', type: 'fishing', rareFish: true },
      { id: 'underwater_cave', name: 'Glowy Cave', type: 'exploration', bioluminescent: true },
      { id: 'shipwreck_graveyard', name: 'Ship Cemetery', type: 'treasure', shipwrecks: 5 },
    ],
    weather: 'clear_underwater',
    dangerLevel: 2,
    unlocked: false,
    requiresLevel: 15,
    requiresItem: 'diving_gear',
  },
  stormy_peaks: {
    id: 'stormy_peaks',
    name: 'Stormy Peaks',
    icon: '⛰️',
    description: 'Treacherous cliffs battered by eternal storms',
    subLocations: [
      { id: 'cliff_fishing', name: 'Cliff\'s Edge', type: 'fishing', dangerous: true, rareFish: true },
      { id: 'hermit_cave', name: 'Gary\'s Unnecessarily Cryptic Hideout', type: 'npc', wise: true },
      { id: 'eagle_nest', name: 'Eagle\'s Nest', type: 'viewpoint', seesAll: true },
      { id: 'storm_shrine', name: 'Storm Shrine', type: 'mystical', weatherControl: true },
    ],
    weather: 'stormy',
    dangerLevel: 4,
    unlocked: false,
    requiresLevel: 25,
  },
  forgotten_shores: {
    id: 'forgotten_shores',
    name: 'Forgotten Shores',
    icon: '🏚️',
    description: 'Ruins of an ancient civilization',
    subLocations: [
      { id: 'ancient_harbor', name: 'Ancient Harbor', type: 'exploration', artifacts: true },
      { id: 'temple_ruins', name: 'Temple of the Sea God', type: 'dungeon', boss: true },
      { id: 'ghost_town', name: 'Ghost Town', type: 'spooky', ghosts: true },
      { id: 'final_fishing_spot', name: 'The Legendary Spot', type: 'fishing', legendaryFish: true },
    ],
    weather: 'mystical',
    dangerLevel: 5,
    unlocked: false,
    requiresLevel: 40,
    requiresQuest: 'uncover_the_past',
  },
};

// ============================================================================
// SECTION 10: UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a random ambient event based on current conditions
 */
export const getRandomAmbientEvent = (conditions) => {
  const { timeOfDay, weather, location, playerState } = conditions;
  const eligibleEvents = WORLD_EVENTS.ambientEvents.filter(event => {
    if (event.trigger === 'any') return true;
    if (event.trigger === 'night_time' && timeOfDay !== 'night') return false;
    if (event.trigger === 'on_boat' && !playerState.onBoat) return false;
    if (event.trigger === 'after_rain' && weather !== 'clearing') return false;
    if (event.trigger === 'fishing' && !playerState.isFishing) return false;
    return Math.random() < event.chance;
  });
  
  if (eligibleEvents.length === 0) return null;
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
};

/**
 * Get weather transition
 */
export const getNextWeather = (currentWeather) => {
  const weatherData = WEATHER_SYSTEMS.types[currentWeather];
  if (!weatherData) return 'clear';
  const transitions = weatherData.transitionsTo;
  return transitions[Math.floor(Math.random() * transitions.length)];
};

/**
 * Get wildlife for a location
 */
export const getWildlifeForLocation = (locationId, timeOfDay) => {
  const location = WORLD_REGIONS[locationId] || {};
  const wildlife = [];
  
  // Add sea creatures if near water
  if (location.type === 'fishing' || location.type === 'beach') {
    wildlife.push(...WILDLIFE.seaCreatures.filter(c => 
      timeOfDay === 'night' ? !c.diurnal : !c.nocturnal
    ));
  }
  
  // Add birds
  wildlife.push(...WILDLIFE.birds.filter(b => 
    timeOfDay === 'night' ? b.behavior === 'nocturnal' : b.behavior !== 'nocturnal'
  ));
  
  // Add land animals
  wildlife.push(...WILDLIFE.landAnimals.slice(0, 5));
  
  return wildlife;
};

/**
 * Generate treasure based on rarity
 */
export const generateTreasure = (rarity = 'common') => {
  const treasures = TREASURES.buriedTreasure.filter(t => t.rarity === rarity);
  if (treasures.length === 0) return TREASURES.buriedTreasure[0];
  return treasures[Math.floor(Math.random() * treasures.length)];
};

/**
 * Get current season
 */
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  for (const [id, season] of Object.entries(WEATHER_SYSTEMS.seasons)) {
    if (season.months.includes(month)) return id;
  }
  return 'summer';
};

/**
 * Get time of day
 */
export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  for (const [id, time] of Object.entries(WEATHER_SYSTEMS.timeOfDay)) {
    if (hour >= time.hours.start && hour < time.hours.end) return id;
    if (time.hours.start > time.hours.end) { // Handle overnight (night)
      if (hour >= time.hours.start || hour < time.hours.end) return id;
    }
  }
  return 'day';
};

// Export everything
export default {
  ENVIRONMENTAL_OBJECTS,
  WILDLIFE,
  WEATHER_SYSTEMS,
  SHIPS,
  TREASURES,
  WORLD_EVENTS,
  AUDIO_ASSETS,
  PARTICLE_EFFECTS,
  WORLD_REGIONS,
  getRandomAmbientEvent,
  getNextWeather,
  getWildlifeForLocation,
  generateTreasure,
  getCurrentSeason,
  getTimeOfDay,
};
