/**
 * ============================================================================
 * NPC PATHING SYSTEM - 2000+ Lines of NPC Behavior & Movement
 * ============================================================================
 * Comprehensive NPC pathing, schedules, behaviors, and AI systems
 * for creating a living, breathing world where NPCs have daily routines
 * ============================================================================
 */

// ============================================================================
// SECTION 1: PATH NODE DEFINITIONS
// ============================================================================

export const PATH_NODES = {
  // Barnacle Bay Plaza nodes
  barnacle_bay: {
    plaza_center: { x: 500, y: 300, type: 'hub', connections: ['plaza_north', 'plaza_south', 'plaza_east', 'plaza_west'] },
    plaza_north: { x: 500, y: 200, type: 'path', connections: ['plaza_center', 'market_entrance', 'tavern_door'] },
    plaza_south: { x: 500, y: 400, type: 'path', connections: ['plaza_center', 'dock_entrance', 'beach_path'] },
    plaza_east: { x: 600, y: 300, type: 'path', connections: ['plaza_center', 'blacksmith', 'general_store'] },
    plaza_west: { x: 400, y: 300, type: 'path', connections: ['plaza_center', 'church', 'mansion_gate'] },
    market_entrance: { x: 500, y: 100, type: 'entrance', connections: ['plaza_north', 'market_stall_1'] },
    tavern_door: { x: 550, y: 150, type: 'entrance', connections: ['plaza_north', 'tavern_interior'] },
    dock_entrance: { x: 500, y: 500, type: 'entrance', connections: ['plaza_south', 'dock_main'] },
    beach_path: { x: 450, y: 450, type: 'path', connections: ['plaza_south', 'beach_main'] },
    blacksmith: { x: 700, y: 300, type: 'shop', connections: ['plaza_east'] },
    general_store: { x: 650, y: 350, type: 'shop', connections: ['plaza_east'] },
    church: { x: 300, y: 300, type: 'building', connections: ['plaza_west'] },
    mansion_gate: { x: 350, y: 250, type: 'entrance', connections: ['plaza_west', 'mansion_grounds'] },
  },
  
  // Wobbly Pier District nodes
  wobbly_pier: {
    dock_main: { x: 500, y: 600, type: 'hub', connections: ['dock_entrance', 'pier_1', 'pier_2', 'fish_market'] },
    pier_1: { x: 400, y: 650, type: 'fishing_spot', connections: ['dock_main', 'pier_end_1'] },
    pier_2: { x: 600, y: 650, type: 'fishing_spot', connections: ['dock_main', 'pier_end_2'] },
    pier_end_1: { x: 350, y: 700, type: 'fishing_spot', connections: ['pier_1'] },
    pier_end_2: { x: 650, y: 700, type: 'fishing_spot', connections: ['pier_2'] },
    fish_market: { x: 550, y: 550, type: 'shop', connections: ['dock_main', 'ice_storage'] },
    ice_storage: { x: 600, y: 520, type: 'storage', connections: ['fish_market'] },
    boat_rental: { x: 450, y: 580, type: 'shop', connections: ['dock_main'] },
    lighthouse_path: { x: 700, y: 600, type: 'path', connections: ['dock_main', 'lighthouse_base'] },
    lighthouse_base: { x: 750, y: 550, type: 'landmark', connections: ['lighthouse_path', 'lighthouse_top'] },
    lighthouse_top: { x: 750, y: 450, type: 'viewpoint', connections: ['lighthouse_base'] },
  },
  
  // Tavern interior nodes
  tavern_interior: {
    entrance: { x: 100, y: 200, type: 'entrance', connections: ['tavern_door', 'main_hall'] },
    main_hall: { x: 200, y: 200, type: 'hub', connections: ['entrance', 'bar', 'fireplace', 'stage', 'stairs'] },
    bar: { x: 300, y: 150, type: 'service', connections: ['main_hall', 'kitchen_door'] },
    fireplace: { x: 150, y: 250, type: 'rest', connections: ['main_hall'] },
    stage: { x: 250, y: 300, type: 'entertainment', connections: ['main_hall'] },
    stairs: { x: 350, y: 200, type: 'transition', connections: ['main_hall', 'upstairs'] },
    kitchen_door: { x: 350, y: 100, type: 'entrance', connections: ['bar', 'kitchen'] },
    kitchen: { x: 400, y: 100, type: 'work', connections: ['kitchen_door', 'back_door'] },
    back_door: { x: 450, y: 150, type: 'exit', connections: ['kitchen'] },
    upstairs: { x: 350, y: 50, type: 'hub', connections: ['stairs', 'room_1', 'room_2', 'room_3'] },
    room_1: { x: 300, y: 30, type: 'private', connections: ['upstairs'] },
    room_2: { x: 350, y: 30, type: 'private', connections: ['upstairs'] },
    room_3: { x: 400, y: 30, type: 'private', connections: ['upstairs'] },
  },
  
  // Market district nodes
  market_district: {
    market_entrance_main: { x: 500, y: 100, type: 'entrance', connections: ['market_entrance', 'market_center'] },
    market_center: { x: 500, y: 50, type: 'hub', connections: ['market_entrance_main', 'stall_row_1', 'stall_row_2'] },
    stall_row_1: { x: 400, y: 50, type: 'path', connections: ['market_center', 'fish_stall', 'fruit_stall', 'bread_stall'] },
    stall_row_2: { x: 600, y: 50, type: 'path', connections: ['market_center', 'gear_stall', 'bait_stall', 'trinket_stall'] },
    fish_stall: { x: 350, y: 30, type: 'shop', connections: ['stall_row_1'] },
    fruit_stall: { x: 400, y: 30, type: 'shop', connections: ['stall_row_1'] },
    bread_stall: { x: 450, y: 30, type: 'shop', connections: ['stall_row_1'] },
    gear_stall: { x: 550, y: 30, type: 'shop', connections: ['stall_row_2'] },
    bait_stall: { x: 600, y: 30, type: 'shop', connections: ['stall_row_2'] },
    trinket_stall: { x: 650, y: 30, type: 'shop', connections: ['stall_row_2'] },
  },
  
  // Beach area nodes
  beach_area: {
    beach_main: { x: 450, y: 500, type: 'hub', connections: ['beach_path', 'shoreline', 'dunes', 'tidal_pools'] },
    shoreline: { x: 400, y: 550, type: 'fishing_spot', connections: ['beach_main', 'water_edge'] },
    water_edge: { x: 350, y: 600, type: 'wade', connections: ['shoreline'] },
    dunes: { x: 500, y: 480, type: 'rest', connections: ['beach_main', 'hidden_cove_path'] },
    tidal_pools: { x: 550, y: 520, type: 'explore', connections: ['beach_main'] },
    hidden_cove_path: { x: 550, y: 450, type: 'secret', connections: ['dunes', 'hidden_cove'] },
    hidden_cove: { x: 600, y: 400, type: 'secret_area', connections: ['hidden_cove_path'] },
  },
};

// ============================================================================
// SECTION 2: NPC SCHEDULE TEMPLATES
// ============================================================================

export const SCHEDULE_TEMPLATES = {
  // Merchant schedule (early riser, works market)
  merchant: {
    name: 'Merchant Schedule',
    timeline: [
      { time: '05:00', action: 'wake_up', location: 'home', duration: 30 },
      { time: '05:30', action: 'breakfast', location: 'home', duration: 30 },
      { time: '06:00', action: 'travel', destination: 'market_stall' },
      { time: '06:30', action: 'setup_shop', location: 'market_stall', duration: 30 },
      { time: '07:00', action: 'work', location: 'market_stall', duration: 300, interruptible: true },
      { time: '12:00', action: 'lunch_break', location: 'market_stall', duration: 30 },
      { time: '12:30', action: 'work', location: 'market_stall', duration: 240, interruptible: true },
      { time: '16:30', action: 'close_shop', location: 'market_stall', duration: 30 },
      { time: '17:00', action: 'travel', destination: 'tavern' },
      { time: '17:30', action: 'socialize', location: 'tavern', duration: 120 },
      { time: '19:30', action: 'travel', destination: 'home' },
      { time: '20:00', action: 'dinner', location: 'home', duration: 60 },
      { time: '21:00', action: 'relax', location: 'home', duration: 60 },
      { time: '22:00', action: 'sleep', location: 'home', duration: 420 },
    ],
    variations: {
      rainy: [{ time: '12:00', action: 'shelter', location: 'tavern', duration: 60 }],
      festival: [{ time: '17:00', action: 'attend_festival', location: 'plaza_center', duration: 180 }],
    },
  },
  
  // Fisherman schedule (very early, works docks)
  fisherman: {
    name: 'Fisherman Schedule',
    timeline: [
      { time: '04:00', action: 'wake_up', location: 'home', duration: 20 },
      { time: '04:20', action: 'quick_breakfast', location: 'home', duration: 20 },
      { time: '04:40', action: 'travel', destination: 'dock_main' },
      { time: '05:00', action: 'prepare_boat', location: 'dock_main', duration: 30 },
      { time: '05:30', action: 'fishing', location: 'pier_end_1', duration: 360, interruptible: false },
      { time: '11:30', action: 'return_catch', location: 'fish_market', duration: 60 },
      { time: '12:30', action: 'lunch', location: 'tavern', duration: 60 },
      { time: '13:30', action: 'repair_nets', location: 'dock_main', duration: 120 },
      { time: '15:30', action: 'afternoon_fishing', location: 'pier_end_2', duration: 180 },
      { time: '18:30', action: 'clean_boat', location: 'dock_main', duration: 30 },
      { time: '19:00', action: 'travel', destination: 'tavern' },
      { time: '19:30', action: 'dinner_drinks', location: 'tavern', duration: 150 },
      { time: '22:00', action: 'travel', destination: 'home' },
      { time: '22:30', action: 'sleep', location: 'home', duration: 330 },
    ],
    variations: {
      stormy: [{ time: '05:30', action: 'stay_home', location: 'home', duration: 360 }],
      good_catch: [{ time: '19:30', action: 'celebrate', location: 'tavern', duration: 240 }],
    },
  },
  
  // Tavern keeper schedule (late nights)
  tavern_keeper: {
    name: 'Tavern Keeper Schedule',
    timeline: [
      { time: '09:00', action: 'wake_up', location: 'room_1', duration: 30 },
      { time: '09:30', action: 'breakfast', location: 'kitchen', duration: 30 },
      { time: '10:00', action: 'clean_tavern', location: 'main_hall', duration: 120 },
      { time: '12:00', action: 'prepare_food', location: 'kitchen', duration: 120 },
      { time: '14:00', action: 'open_tavern', location: 'bar', duration: 30 },
      { time: '14:30', action: 'serve_customers', location: 'bar', duration: 180, interruptible: true },
      { time: '17:30', action: 'happy_hour', location: 'bar', duration: 90, interruptible: true },
      { time: '19:00', action: 'dinner_rush', location: 'bar', duration: 180, interruptible: true },
      { time: '22:00', action: 'evening_crowd', location: 'bar', duration: 120, interruptible: true },
      { time: '00:00', action: 'last_call', location: 'bar', duration: 60 },
      { time: '01:00', action: 'close_tavern', location: 'main_hall', duration: 60 },
      { time: '02:00', action: 'sleep', location: 'room_1', duration: 420 },
    ],
    variations: {
      festival: [{ time: '14:00', action: 'extended_hours', location: 'bar', duration: 720 }],
    },
  },
  
  // Guard schedule (patrol routes)
  guard: {
    name: 'Guard Schedule',
    timeline: [
      { time: '06:00', action: 'wake_up', location: 'barracks', duration: 30 },
      { time: '06:30', action: 'breakfast', location: 'barracks', duration: 30 },
      { time: '07:00', action: 'patrol', route: 'morning_patrol', duration: 180 },
      { time: '10:00', action: 'guard_post', location: 'mansion_gate', duration: 120 },
      { time: '12:00', action: 'lunch', location: 'barracks', duration: 60 },
      { time: '13:00', action: 'patrol', route: 'afternoon_patrol', duration: 180 },
      { time: '16:00', action: 'training', location: 'barracks', duration: 120 },
      { time: '18:00', action: 'dinner', location: 'barracks', duration: 60 },
      { time: '19:00', action: 'evening_patrol', route: 'evening_patrol', duration: 180 },
      { time: '22:00', action: 'night_watch', location: 'dock_main', duration: 240 },
      { time: '02:00', action: 'off_duty', location: 'barracks', duration: 240 },
    ],
    variations: {
      alert: [{ time: '00:00', action: 'extended_patrol', route: 'full_patrol', duration: 480 }],
    },
  },
  
  // Child schedule (playful, school)
  child: {
    name: 'Child Schedule',
    timeline: [
      { time: '07:00', action: 'wake_up', location: 'home', duration: 30 },
      { time: '07:30', action: 'breakfast', location: 'home', duration: 30 },
      { time: '08:00', action: 'travel', destination: 'church' },
      { time: '08:30', action: 'school', location: 'church', duration: 180 },
      { time: '11:30', action: 'lunch', location: 'home', duration: 60 },
      { time: '12:30', action: 'play', location: 'beach_main', duration: 180, behavior: 'playful' },
      { time: '15:30', action: 'chores', location: 'home', duration: 90 },
      { time: '17:00', action: 'play', location: 'plaza_center', duration: 120, behavior: 'playful' },
      { time: '19:00', action: 'dinner', location: 'home', duration: 60 },
      { time: '20:00', action: 'bedtime_story', location: 'home', duration: 30 },
      { time: '20:30', action: 'sleep', location: 'home', duration: 630 },
    ],
    variations: {
      summer: [{ time: '08:00', action: 'play', location: 'beach_main', duration: 420 }],
      rainy: [{ time: '12:30', action: 'play_indoors', location: 'home', duration: 180 }],
    },
  },
  
  // Noble schedule (lazy, privileged)
  noble: {
    name: 'Noble Schedule',
    timeline: [
      { time: '10:00', action: 'wake_up', location: 'mansion_bedroom', duration: 30 },
      { time: '10:30', action: 'breakfast_served', location: 'mansion_dining', duration: 60 },
      { time: '11:30', action: 'morning_stroll', route: 'mansion_grounds', duration: 60 },
      { time: '12:30', action: 'meet_visitors', location: 'mansion_parlor', duration: 120, interruptible: true },
      { time: '14:30', action: 'lunch', location: 'mansion_dining', duration: 90 },
      { time: '16:00', action: 'afternoon_tea', location: 'mansion_garden', duration: 60 },
      { time: '17:00', action: 'business', location: 'mansion_study', duration: 120 },
      { time: '19:00', action: 'travel', destination: 'tavern' },
      { time: '19:30', action: 'fine_dining', location: 'tavern', duration: 120 },
      { time: '21:30', action: 'entertainment', location: 'tavern', duration: 90 },
      { time: '23:00', action: 'travel', destination: 'mansion' },
      { time: '23:30', action: 'nightcap', location: 'mansion_study', duration: 30 },
      { time: '00:00', action: 'sleep', location: 'mansion_bedroom', duration: 600 },
    ],
    variations: {
      festival: [{ time: '17:00', action: 'host_party', location: 'mansion', duration: 360 }],
    },
  },
  
  // Blacksmith schedule (hard worker)
  blacksmith: {
    name: 'Blacksmith Schedule',
    timeline: [
      { time: '05:30', action: 'wake_up', location: 'home', duration: 30 },
      { time: '06:00', action: 'hearty_breakfast', location: 'home', duration: 30 },
      { time: '06:30', action: 'travel', destination: 'blacksmith' },
      { time: '07:00', action: 'light_forge', location: 'blacksmith', duration: 30 },
      { time: '07:30', action: 'work', location: 'blacksmith', duration: 270, interruptible: true, sounds: ['hammering'] },
      { time: '12:00', action: 'lunch', location: 'blacksmith', duration: 30 },
      { time: '12:30', action: 'work', location: 'blacksmith', duration: 270, interruptible: true, sounds: ['hammering'] },
      { time: '17:00', action: 'close_shop', location: 'blacksmith', duration: 30 },
      { time: '17:30', action: 'travel', destination: 'tavern' },
      { time: '18:00', action: 'dinner_drinks', location: 'tavern', duration: 120 },
      { time: '20:00', action: 'arm_wrestling', location: 'tavern', duration: 60, behavior: 'competitive' },
      { time: '21:00', action: 'travel', destination: 'home' },
      { time: '21:30', action: 'sleep', location: 'home', duration: 480 },
    ],
  },
  
  // Wanderer/Traveler schedule (unpredictable)
  wanderer: {
    name: 'Wanderer Schedule',
    timeline: [
      { time: '08:00', action: 'wake_up', location: 'random_outdoor', duration: 30 },
      { time: '08:30', action: 'forage_breakfast', location: 'random_outdoor', duration: 60 },
      { time: '09:30', action: 'wander', route: 'random_exploration', duration: 180 },
      { time: '12:30', action: 'rest', location: 'random_scenic', duration: 60 },
      { time: '13:30', action: 'wander', route: 'random_exploration', duration: 180 },
      { time: '16:30', action: 'busking', location: 'plaza_center', duration: 120, interruptible: true },
      { time: '18:30', action: 'seek_shelter', location: 'tavern', duration: 30 },
      { time: '19:00', action: 'tell_stories', location: 'tavern', duration: 180, interruptible: true },
      { time: '22:00', action: 'find_sleeping_spot', location: 'random_outdoor', duration: 30 },
      { time: '22:30', action: 'sleep', location: 'random_outdoor', duration: 570 },
    ],
    variations: {
      rainy: [{ time: '09:30', action: 'shelter', location: 'tavern', duration: 480 }],
    },
  },
};

// ============================================================================
// SECTION 3: PATROL ROUTES
// ============================================================================

export const PATROL_ROUTES = {
  morning_patrol: {
    name: 'Morning Patrol',
    nodes: [
      { node: 'plaza_center', waitTime: 30, action: 'observe' },
      { node: 'market_entrance', waitTime: 60, action: 'check_stalls' },
      { node: 'dock_entrance', waitTime: 30, action: 'observe' },
      { node: 'dock_main', waitTime: 60, action: 'inspect_boats' },
      { node: 'plaza_south', waitTime: 30, action: 'observe' },
      { node: 'plaza_center', waitTime: 0, action: 'complete' },
    ],
    totalDuration: 180,
    alertLevel: 'normal',
  },
  
  afternoon_patrol: {
    name: 'Afternoon Patrol',
    nodes: [
      { node: 'mansion_gate', waitTime: 60, action: 'guard' },
      { node: 'plaza_west', waitTime: 30, action: 'observe' },
      { node: 'church', waitTime: 30, action: 'check' },
      { node: 'plaza_center', waitTime: 30, action: 'observe' },
      { node: 'tavern_door', waitTime: 30, action: 'check' },
      { node: 'mansion_gate', waitTime: 0, action: 'complete' },
    ],
    totalDuration: 180,
    alertLevel: 'normal',
  },
  
  evening_patrol: {
    name: 'Evening Patrol',
    nodes: [
      { node: 'tavern_door', waitTime: 60, action: 'monitor' },
      { node: 'plaza_center', waitTime: 30, action: 'observe' },
      { node: 'dock_main', waitTime: 60, action: 'check_warehouses' },
      { node: 'beach_path', waitTime: 30, action: 'scan_horizon' },
      { node: 'plaza_south', waitTime: 30, action: 'observe' },
      { node: 'tavern_door', waitTime: 0, action: 'complete' },
    ],
    totalDuration: 180,
    alertLevel: 'heightened',
    carriesLantern: true,
  },
  
  full_patrol: {
    name: 'Full Security Patrol',
    nodes: [
      { node: 'mansion_gate', waitTime: 30, action: 'secure' },
      { node: 'plaza_west', waitTime: 20, action: 'observe' },
      { node: 'plaza_center', waitTime: 30, action: 'announce' },
      { node: 'market_entrance', waitTime: 20, action: 'check' },
      { node: 'tavern_door', waitTime: 30, action: 'check_inside' },
      { node: 'dock_entrance', waitTime: 20, action: 'observe' },
      { node: 'dock_main', waitTime: 40, action: 'full_inspection' },
      { node: 'lighthouse_base', waitTime: 30, action: 'signal_check' },
      { node: 'beach_path', waitTime: 20, action: 'scan' },
      { node: 'plaza_south', waitTime: 20, action: 'observe' },
      { node: 'plaza_east', waitTime: 20, action: 'observe' },
      { node: 'blacksmith', waitTime: 20, action: 'check' },
      { node: 'mansion_gate', waitTime: 0, action: 'report' },
    ],
    totalDuration: 300,
    alertLevel: 'high',
    carriesLantern: true,
    carriesWeapon: true,
  },
  
  merchant_delivery: {
    name: 'Merchant Delivery Route',
    nodes: [
      { node: 'dock_main', waitTime: 60, action: 'load_goods' },
      { node: 'plaza_south', waitTime: 10, action: 'travel' },
      { node: 'plaza_center', waitTime: 10, action: 'travel' },
      { node: 'market_entrance', waitTime: 10, action: 'travel' },
      { node: 'market_center', waitTime: 30, action: 'unload_goods' },
      { node: 'fish_stall', waitTime: 20, action: 'deliver' },
      { node: 'gear_stall', waitTime: 20, action: 'deliver' },
      { node: 'market_center', waitTime: 0, action: 'complete' },
    ],
    totalDuration: 160,
    carriesCargo: true,
  },
  
  fisherman_route: {
    name: 'Fisherman Daily Route',
    nodes: [
      { node: 'dock_main', waitTime: 30, action: 'prepare' },
      { node: 'pier_1', waitTime: 10, action: 'walk' },
      { node: 'pier_end_1', waitTime: 180, action: 'fish' },
      { node: 'pier_1', waitTime: 10, action: 'walk' },
      { node: 'pier_2', waitTime: 10, action: 'walk' },
      { node: 'pier_end_2', waitTime: 120, action: 'fish' },
      { node: 'pier_2', waitTime: 10, action: 'walk' },
      { node: 'dock_main', waitTime: 30, action: 'clean_catch' },
      { node: 'fish_market', waitTime: 60, action: 'sell_fish' },
    ],
    totalDuration: 460,
    carriesFishingGear: true,
  },
  
  child_play_route: {
    name: 'Child Play Route',
    nodes: [
      { node: 'plaza_center', waitTime: 30, action: 'gather_friends' },
      { node: 'beach_path', waitTime: 10, action: 'run' },
      { node: 'beach_main', waitTime: 60, action: 'build_sandcastle' },
      { node: 'shoreline', waitTime: 30, action: 'splash_water' },
      { node: 'tidal_pools', waitTime: 45, action: 'explore' },
      { node: 'beach_main', waitTime: 30, action: 'play_tag' },
      { node: 'beach_path', waitTime: 10, action: 'walk' },
      { node: 'plaza_center', waitTime: 0, action: 'go_home' },
    ],
    totalDuration: 215,
    behavior: 'energetic',
    groupActivity: true,
  },
  
  romantic_stroll: {
    name: 'Romantic Evening Stroll',
    nodes: [
      { node: 'plaza_center', waitTime: 10, action: 'meet' },
      { node: 'beach_path', waitTime: 10, action: 'walk_together' },
      { node: 'beach_main', waitTime: 30, action: 'watch_sunset' },
      { node: 'shoreline', waitTime: 20, action: 'walk_hand_in_hand' },
      { node: 'hidden_cove_path', waitTime: 10, action: 'discover' },
      { node: 'hidden_cove', waitTime: 60, action: 'private_moment' },
      { node: 'beach_main', waitTime: 20, action: 'stargazing' },
      { node: 'plaza_center', waitTime: 0, action: 'part_ways' },
    ],
    totalDuration: 160,
    timeOfDay: 'evening',
    requiresPartner: true,
    mood: 'romantic',
  },
};

// ============================================================================
// SECTION 4: NPC BEHAVIOR STATES
// ============================================================================

export const BEHAVIOR_STATES = {
  // Idle behaviors
  idle: {
    standing: {
      animations: ['idle_stand', 'look_around', 'scratch_head', 'stretch'],
      duration: { min: 5, max: 30 },
      transitions: ['walking', 'sitting', 'interacting'],
    },
    sitting: {
      animations: ['idle_sit', 'cross_legs', 'lean_back'],
      duration: { min: 30, max: 180 },
      transitions: ['standing', 'sleeping'],
      requiresSeat: true,
    },
    leaning: {
      animations: ['lean_wall', 'lean_post', 'arms_crossed'],
      duration: { min: 10, max: 60 },
      transitions: ['standing', 'walking'],
      requiresSurface: true,
    },
  },
  
  // Movement behaviors
  movement: {
    walking: {
      speed: 1.0,
      animations: ['walk_normal', 'walk_casual'],
      canInterrupt: true,
      avoidObstacles: true,
    },
    running: {
      speed: 2.0,
      animations: ['run_normal', 'run_urgent'],
      canInterrupt: false,
      avoidObstacles: true,
      stamina: -1,
    },
    sneaking: {
      speed: 0.5,
      animations: ['sneak_crouch', 'sneak_careful'],
      canInterrupt: true,
      reducedDetection: true,
    },
    swimming: {
      speed: 0.8,
      animations: ['swim_normal', 'swim_float'],
      requiresWater: true,
      stamina: -0.5,
    },
    climbing: {
      speed: 0.3,
      animations: ['climb_ladder', 'climb_rope'],
      requiresClimbable: true,
      stamina: -2,
    },
  },
  
  // Work behaviors
  working: {
    fishing: {
      animations: ['cast_line', 'wait_bite', 'reel_in', 'catch_fish'],
      duration: { min: 60, max: 300 },
      interruptible: false,
      producesItem: 'fish',
      sounds: ['splash', 'reel'],
    },
    hammering: {
      animations: ['hammer_strike', 'inspect_work', 'wipe_brow'],
      duration: { min: 30, max: 120 },
      interruptible: true,
      sounds: ['hammer_metal', 'forge_fire'],
      particles: ['sparks'],
    },
    cooking: {
      animations: ['stir_pot', 'chop_ingredients', 'taste_food'],
      duration: { min: 30, max: 90 },
      interruptible: true,
      sounds: ['sizzle', 'chop'],
      particles: ['steam'],
    },
    selling: {
      animations: ['wave_customers', 'show_wares', 'count_coins'],
      duration: { min: 10, max: 60 },
      interruptible: true,
      dialogue: 'merchant_pitch',
    },
    cleaning: {
      animations: ['sweep_floor', 'wipe_table', 'scrub'],
      duration: { min: 30, max: 120 },
      interruptible: true,
      sounds: ['sweeping'],
    },
    repairing: {
      animations: ['examine_item', 'use_tools', 'test_repair'],
      duration: { min: 60, max: 180 },
      interruptible: false,
      sounds: ['tools'],
    },
  },
  
  // Social behaviors
  social: {
    talking: {
      animations: ['gesture_talk', 'nod', 'laugh', 'think'],
      duration: { min: 30, max: 300 },
      interruptible: true,
      requiresPartner: true,
      dialogue: 'casual_conversation',
    },
    arguing: {
      animations: ['gesture_angry', 'point_accusingly', 'throw_hands'],
      duration: { min: 30, max: 120 },
      interruptible: false,
      requiresPartner: true,
      dialogue: 'argument',
      mood: 'angry',
    },
    flirting: {
      animations: ['wink', 'hair_flip', 'lean_close'],
      duration: { min: 30, max: 180 },
      interruptible: true,
      requiresPartner: true,
      dialogue: 'flirty',
      mood: 'romantic',
    },
    gossiping: {
      animations: ['whisper', 'look_around_suspicious', 'giggle'],
      duration: { min: 60, max: 180 },
      interruptible: true,
      requiresPartner: true,
      dialogue: 'gossip',
      mood: 'secretive',
    },
    celebrating: {
      animations: ['cheer', 'dance', 'raise_glass'],
      duration: { min: 30, max: 120 },
      interruptible: true,
      sounds: ['cheering'],
      mood: 'happy',
    },
  },
  
  // Resting behaviors
  resting: {
    sleeping: {
      animations: ['sleep_bed', 'sleep_snore', 'turn_over'],
      duration: { min: 240, max: 480 },
      interruptible: false,
      restores: 'energy',
      sounds: ['snoring'],
    },
    napping: {
      animations: ['doze_sit', 'head_bob'],
      duration: { min: 30, max: 90 },
      interruptible: true,
      restores: 'energy',
    },
    eating: {
      animations: ['eat_food', 'drink', 'wipe_mouth'],
      duration: { min: 15, max: 45 },
      interruptible: true,
      restores: 'hunger',
      sounds: ['eating'],
    },
    drinking: {
      animations: ['drink_mug', 'drink_bottle', 'belch'],
      duration: { min: 5, max: 20 },
      interruptible: true,
      restores: 'thirst',
      sounds: ['drinking', 'gulp'],
    },
  },
  
  // Alert behaviors
  alert: {
    investigating: {
      animations: ['look_around', 'crouch_examine', 'scratch_chin'],
      duration: { min: 30, max: 120 },
      interruptible: false,
      moveSpeed: 0.7,
    },
    chasing: {
      animations: ['run_chase', 'reach_grab'],
      duration: { min: 10, max: 60 },
      interruptible: false,
      moveSpeed: 2.5,
    },
    fleeing: {
      animations: ['run_scared', 'look_back'],
      duration: { min: 10, max: 60 },
      interruptible: false,
      moveSpeed: 2.0,
      mood: 'scared',
    },
    hiding: {
      animations: ['crouch_hide', 'peek'],
      duration: { min: 30, max: 180 },
      interruptible: true,
      reducedVisibility: true,
    },
    fighting: {
      animations: ['punch', 'block', 'dodge'],
      duration: { min: 10, max: 60 },
      interruptible: false,
      sounds: ['fighting'],
    },
  },
  
  // Special behaviors
  special: {
    dancing: {
      animations: ['dance_jig', 'dance_spin', 'dance_clap'],
      duration: { min: 30, max: 180 },
      interruptible: true,
      sounds: ['music'],
      mood: 'happy',
    },
    singing: {
      animations: ['sing_belt', 'sing_sway'],
      duration: { min: 60, max: 180 },
      interruptible: true,
      sounds: ['singing'],
      mood: 'happy',
    },
    praying: {
      animations: ['kneel_pray', 'hands_together'],
      duration: { min: 60, max: 300 },
      interruptible: false,
      location: 'church',
      mood: 'peaceful',
    },
    meditating: {
      animations: ['sit_lotus', 'breathe_deep'],
      duration: { min: 120, max: 360 },
      interruptible: false,
      restores: 'energy',
      mood: 'peaceful',
    },
    performing: {
      animations: ['juggle', 'magic_trick', 'tell_joke'],
      duration: { min: 60, max: 180 },
      interruptible: true,
      drawsCrowd: true,
      sounds: ['crowd_react'],
    },
  },
};

// ============================================================================
// SECTION 5: NPC INTERACTION TRIGGERS
// ============================================================================

export const INTERACTION_TRIGGERS = {
  // Player proximity triggers
  proximity: {
    greeting: {
      distance: 50,
      cooldown: 300,
      chance: 0.5,
      dialogue: 'greeting',
      animation: 'wave',
    },
    notice_player: {
      distance: 100,
      cooldown: 60,
      chance: 0.3,
      action: 'look_at_player',
    },
    offer_help: {
      distance: 30,
      cooldown: 600,
      chance: 0.2,
      dialogue: 'offer_help',
      requires: { questsAvailable: true },
    },
    merchant_pitch: {
      distance: 40,
      cooldown: 120,
      chance: 0.7,
      dialogue: 'merchant_pitch',
      requires: { npcType: 'merchant' },
    },
  },
  
  // Time-based triggers
  temporal: {
    morning_greeting: {
      timeRange: { start: 6, end: 10 },
      chance: 0.8,
      dialogue: 'good_morning',
    },
    lunch_invitation: {
      timeRange: { start: 11, end: 13 },
      chance: 0.3,
      dialogue: 'lunch_together',
      requires: { relationship: 'friend' },
    },
    evening_gossip: {
      timeRange: { start: 18, end: 22 },
      chance: 0.5,
      dialogue: 'evening_gossip',
      location: 'tavern',
    },
    late_night_secrets: {
      timeRange: { start: 23, end: 2 },
      chance: 0.2,
      dialogue: 'secrets',
      requires: { relationship: 'close_friend' },
    },
  },
  
  // Event triggers
  event: {
    fish_caught: {
      trigger: 'player_catches_fish',
      distance: 100,
      dialogue: 'comment_on_catch',
      chance: 0.4,
    },
    rare_fish_caught: {
      trigger: 'player_catches_rare_fish',
      distance: 200,
      dialogue: 'amazed_at_catch',
      chance: 0.9,
      animation: 'amazed',
    },
    player_falls: {
      trigger: 'player_falls_water',
      distance: 80,
      dialogue: 'laugh_at_player',
      chance: 0.7,
      animation: 'laugh',
    },
    storm_starts: {
      trigger: 'weather_storm',
      dialogue: 'warn_about_storm',
      chance: 1.0,
      animation: 'point_sky',
    },
    fight_nearby: {
      trigger: 'combat_nearby',
      distance: 100,
      action: 'flee_or_watch',
      chance: 1.0,
    },
  },
  
  // Relationship triggers
  relationship: {
    stranger: {
      greetingChance: 0.2,
      helpChance: 0.1,
      dialogueDepth: 'shallow',
    },
    acquaintance: {
      greetingChance: 0.5,
      helpChance: 0.3,
      dialogueDepth: 'normal',
      shareGossip: true,
    },
    friend: {
      greetingChance: 0.8,
      helpChance: 0.6,
      dialogueDepth: 'personal',
      shareGossip: true,
      giveGifts: true,
    },
    close_friend: {
      greetingChance: 1.0,
      helpChance: 0.9,
      dialogueDepth: 'deep',
      shareSecrets: true,
      giveGifts: true,
      questLines: true,
    },
    rival: {
      greetingChance: 0.3,
      helpChance: 0.0,
      dialogueDepth: 'confrontational',
      insults: true,
      competitions: true,
    },
    enemy: {
      greetingChance: 0.0,
      helpChance: 0.0,
      dialogueDepth: 'hostile',
      attacks: true,
      avoids: true,
    },
  },
};

// ============================================================================
// SECTION 6: GROUP BEHAVIORS
// ============================================================================

export const GROUP_BEHAVIORS = {
  // Crowd formations
  crowd: {
    watching_performer: {
      formation: 'semicircle',
      spacing: 20,
      maxSize: 15,
      behaviors: ['clap', 'cheer', 'throw_coin'],
      duration: { min: 60, max: 300 },
    },
    market_browsing: {
      formation: 'scattered',
      spacing: 30,
      maxSize: 25,
      behaviors: ['look_at_goods', 'haggle', 'walk_between_stalls'],
      duration: { min: 30, max: 180 },
    },
    emergency_crowd: {
      formation: 'cluster',
      spacing: 10,
      maxSize: 30,
      behaviors: ['point', 'gasp', 'discuss'],
      duration: { min: 30, max: 120 },
      trigger: 'emergency_event',
    },
    parade_watching: {
      formation: 'line',
      spacing: 15,
      maxSize: 50,
      behaviors: ['wave', 'cheer', 'catch_thrown_items'],
      duration: { min: 120, max: 300 },
      trigger: 'parade_event',
    },
  },
  
  // Small group activities
  smallGroup: {
    friends_chatting: {
      size: { min: 2, max: 4 },
      formation: 'circle',
      spacing: 15,
      behaviors: ['talk', 'laugh', 'gesture'],
      duration: { min: 60, max: 300 },
      movesTogether: true,
    },
    fishing_buddies: {
      size: { min: 2, max: 3 },
      formation: 'line',
      spacing: 30,
      behaviors: ['fish', 'compare_catches', 'share_bait'],
      duration: { min: 120, max: 360 },
      location: 'pier',
    },
    patrol_unit: {
      size: 2,
      formation: 'pair',
      spacing: 10,
      behaviors: ['patrol', 'check_areas', 'communicate'],
      duration: { min: 60, max: 180 },
      synchronized: true,
    },
    romantic_couple: {
      size: 2,
      formation: 'close',
      spacing: 5,
      behaviors: ['hold_hands', 'whisper', 'kiss'],
      duration: { min: 60, max: 180 },
      timeOfDay: ['evening', 'night'],
    },
    drinking_buddies: {
      size: { min: 2, max: 5 },
      formation: 'table',
      spacing: 20,
      behaviors: ['drink', 'toast', 'tell_stories', 'argue_playfully'],
      duration: { min: 90, max: 300 },
      location: 'tavern',
    },
    children_playing: {
      size: { min: 3, max: 6 },
      formation: 'scattered',
      spacing: 25,
      behaviors: ['run', 'tag', 'hide', 'seek', 'laugh'],
      duration: { min: 60, max: 180 },
      energetic: true,
    },
  },
  
  // Work crews
  workCrew: {
    dock_workers: {
      size: { min: 4, max: 8 },
      formation: 'task_based',
      behaviors: ['lift_crates', 'carry_cargo', 'load_ship', 'coordinate'],
      duration: { min: 180, max: 480 },
      sounds: ['grunting', 'commands'],
      location: 'dock',
    },
    construction_crew: {
      size: { min: 3, max: 6 },
      formation: 'work_site',
      behaviors: ['hammer', 'saw', 'measure', 'pass_materials'],
      duration: { min: 240, max: 480 },
      sounds: ['construction'],
    },
    fishing_boat_crew: {
      size: { min: 2, max: 4 },
      formation: 'boat',
      behaviors: ['row', 'cast_nets', 'pull_nets', 'sort_fish'],
      duration: { min: 180, max: 360 },
      vehicle: 'fishing_boat',
    },
  },
};

// ============================================================================
// SECTION 7: NPC MEMORY SYSTEM
// ============================================================================

export const NPC_MEMORY = {
  // Memory types
  memoryTypes: {
    witnessed_event: {
      duration: 604800, // 1 week in seconds
      affectsDialogue: true,
      canShare: true,
      decayRate: 0.1,
    },
    player_interaction: {
      duration: 2592000, // 30 days
      affectsRelationship: true,
      affectsDialogue: true,
      decayRate: 0.05,
    },
    received_gift: {
      duration: 604800,
      affectsRelationship: true,
      affectsDialogue: true,
      decayRate: 0.0,
    },
    was_helped: {
      duration: 2592000,
      affectsRelationship: true,
      affectsDialogue: true,
      decayRate: 0.02,
    },
    was_wronged: {
      duration: 5184000, // 60 days
      affectsRelationship: true,
      affectsDialogue: true,
      decayRate: 0.01,
    },
    gossip_heard: {
      duration: 259200, // 3 days
      canShare: true,
      decayRate: 0.2,
    },
    quest_related: {
      duration: -1, // Permanent
      affectsDialogue: true,
      questFlag: true,
      decayRate: 0.0,
    },
  },
  
  // Memory triggers
  memoryTriggers: {
    player_caught_big_fish: {
      type: 'witnessed_event',
      importance: 0.5,
      dialogueUnlock: 'impressive_catch',
    },
    player_won_competition: {
      type: 'witnessed_event',
      importance: 0.8,
      dialogueUnlock: 'competition_winner',
      relationshipChange: 5,
    },
    player_gave_gift: {
      type: 'received_gift',
      importance: 0.6,
      dialogueUnlock: 'grateful_for_gift',
      relationshipChange: 10,
    },
    player_helped_quest: {
      type: 'was_helped',
      importance: 0.9,
      dialogueUnlock: 'grateful_helper',
      relationshipChange: 20,
    },
    player_stole_item: {
      type: 'was_wronged',
      importance: 1.0,
      dialogueUnlock: 'thief_confrontation',
      relationshipChange: -30,
    },
    heard_gossip_about_player: {
      type: 'gossip_heard',
      importance: 0.3,
      dialogueUnlock: 'gossip_mention',
    },
  },
  
  // Gossip propagation
  gossipSystem: {
    spreadChance: 0.3,
    spreadRadius: 200,
    spreadDelay: { min: 3600, max: 86400 },
    distortionChance: 0.2,
    topicDecay: 86400,
    maxGossipChain: 5,
  },
};

// ============================================================================
// SECTION 8: PATHFINDING UTILITIES
// ============================================================================

export const PATHFINDING = {
  // A* pathfinding configuration
  config: {
    gridSize: 10,
    diagonalMovement: true,
    smoothing: true,
    avoidanceRadius: 15,
    recalculateThreshold: 50,
  },
  
  // Movement costs
  terrainCosts: {
    road: 1.0,
    grass: 1.2,
    sand: 1.5,
    water_shallow: 2.0,
    water_deep: 10.0,
    rock: 3.0,
    stairs: 1.5,
    crowd: 2.5,
  },
  
  // Dynamic obstacle handling
  dynamicObstacles: {
    other_npcs: { radius: 15, avoidance: 'steer_around' },
    player: { radius: 20, avoidance: 'maintain_distance' },
    vehicles: { radius: 50, avoidance: 'wait_or_reroute' },
    temporary_objects: { radius: 10, avoidance: 'reroute' },
  },
  
  // Path smoothing
  smoothingConfig: {
    cornerCutting: false,
    bezierCurves: true,
    controlPointDistance: 0.3,
    minSegmentLength: 5,
  },
};

/**
 * Calculate path between two nodes
 */
export const calculatePath = (startNode, endNode, regionNodes) => {
  const openSet = [startNode];
  const closedSet = [];
  const cameFrom = {};
  const gScore = { [startNode]: 0 };
  const fScore = { [startNode]: heuristic(startNode, endNode, regionNodes) };
  
  while (openSet.length > 0) {
    const current = openSet.reduce((min, node) => 
      fScore[node] < fScore[min] ? node : min
    );
    
    if (current === endNode) {
      return reconstructPath(cameFrom, current);
    }
    
    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);
    
    const neighbors = regionNodes[current]?.connections || [];
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor)) continue;
      
      const tentativeGScore = gScore[current] + getDistance(current, neighbor, regionNodes);
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[neighbor]) {
        continue;
      }
      
      cameFrom[neighbor] = current;
      gScore[neighbor] = tentativeGScore;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, endNode, regionNodes);
    }
  }
  
  return null; // No path found
};

const heuristic = (nodeA, nodeB, nodes) => {
  const a = nodes[nodeA];
  const b = nodes[nodeB];
  if (!a || !b) return Infinity;
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};

const getDistance = (nodeA, nodeB, nodes) => {
  return heuristic(nodeA, nodeB, nodes);
};

const reconstructPath = (cameFrom, current) => {
  const path = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    path.unshift(current);
  }
  return path;
};

// ============================================================================
// SECTION 9: NPC STATE MACHINE
// ============================================================================

export class NPCStateMachine {
  constructor(npcId, initialState = 'idle') {
    this.npcId = npcId;
    this.currentState = initialState;
    this.previousState = null;
    this.stateData = {};
    this.transitions = [];
    this.stateTime = 0;
  }
  
  setState(newState, data = {}) {
    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateData = data;
    this.stateTime = 0;
    this.transitions.push({
      from: this.previousState,
      to: newState,
      time: Date.now(),
      data,
    });
  }
  
  update(deltaTime) {
    this.stateTime += deltaTime;
    return {
      state: this.currentState,
      stateTime: this.stateTime,
      data: this.stateData,
    };
  }
  
  canTransition(targetState) {
    const currentBehavior = BEHAVIOR_STATES[this.currentState];
    if (!currentBehavior) return true;
    
    const stateConfig = Object.values(currentBehavior).find(s => 
      s.transitions?.includes(targetState)
    );
    
    return !!stateConfig;
  }
  
  getHistory(count = 10) {
    return this.transitions.slice(-count);
  }
}

// ============================================================================
// SECTION 10: NPC MANAGER CLASS
// ============================================================================

export class NPCPathingManager {
  constructor() {
    this.npcs = new Map();
    this.activePatrols = new Map();
    this.groupActivities = new Map();
    this.scheduleOverrides = new Map();
  }
  
  registerNPC(npcId, config) {
    this.npcs.set(npcId, {
      id: npcId,
      config,
      stateMachine: new NPCStateMachine(npcId),
      currentPath: [],
      pathIndex: 0,
      schedule: config.schedule || 'wanderer',
      position: config.startPosition || { x: 0, y: 0 },
      destination: null,
      speed: config.speed || 1.0,
      memories: [],
      relationships: {},
    });
  }
  
  updateNPC(npcId, deltaTime) {
    const npc = this.npcs.get(npcId);
    if (!npc) return null;
    
    // Update state machine
    const stateInfo = npc.stateMachine.update(deltaTime);
    
    // Check schedule
    const currentTime = this.getCurrentGameTime();
    const scheduleAction = this.getScheduledAction(npc.schedule, currentTime);
    
    // Update position if moving
    if (npc.currentPath.length > 0) {
      this.moveAlongPath(npc, deltaTime);
    }
    
    // Check for interactions
    const interactions = this.checkInteractions(npc);
    
    return {
      npcId,
      state: stateInfo,
      position: npc.position,
      scheduledAction: scheduleAction,
      interactions,
    };
  }
  
  moveAlongPath(npc, deltaTime) {
    if (npc.pathIndex >= npc.currentPath.length) {
      npc.currentPath = [];
      npc.pathIndex = 0;
      return;
    }
    
    const targetNode = npc.currentPath[npc.pathIndex];
    const target = this.getNodePosition(targetNode);
    
    const dx = target.x - npc.position.x;
    const dy = target.y - npc.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      npc.pathIndex++;
    } else {
      const moveDistance = npc.speed * deltaTime * 50;
      npc.position.x += (dx / distance) * moveDistance;
      npc.position.y += (dy / distance) * moveDistance;
    }
  }
  
  setDestination(npcId, destinationNode) {
    const npc = this.npcs.get(npcId);
    if (!npc) return false;
    
    const region = this.getRegionForNode(destinationNode);
    const regionNodes = PATH_NODES[region];
    
    if (!regionNodes) return false;
    
    const startNode = this.getNearestNode(npc.position, regionNodes);
    const path = calculatePath(startNode, destinationNode, regionNodes);
    
    if (path) {
      npc.currentPath = path;
      npc.pathIndex = 0;
      npc.destination = destinationNode;
      npc.stateMachine.setState('walking');
      return true;
    }
    
    return false;
  }
  
  startPatrol(npcId, routeId) {
    const npc = this.npcs.get(npcId);
    const route = PATROL_ROUTES[routeId];
    
    if (!npc || !route) return false;
    
    this.activePatrols.set(npcId, {
      routeId,
      currentNodeIndex: 0,
      startTime: Date.now(),
    });
    
    npc.stateMachine.setState('patrolling', { route: routeId });
    this.setDestination(npcId, route.nodes[0].node);
    
    return true;
  }
  
  joinGroup(npcId, groupId) {
    const npc = this.npcs.get(npcId);
    if (!npc) return false;
    
    let group = this.groupActivities.get(groupId);
    if (!group) {
      group = {
        id: groupId,
        members: [],
        activity: null,
        formation: null,
      };
      this.groupActivities.set(groupId, group);
    }
    
    group.members.push(npcId);
    return true;
  }
  
  addMemory(npcId, memoryType, data) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;
    
    const memoryConfig = NPC_MEMORY.memoryTypes[memoryType];
    if (!memoryConfig) return;
    
    npc.memories.push({
      type: memoryType,
      data,
      timestamp: Date.now(),
      importance: data.importance || 0.5,
      duration: memoryConfig.duration,
    });
    
    // Cleanup old memories
    npc.memories = npc.memories.filter(m => 
      m.duration === -1 || (Date.now() - m.timestamp) < m.duration * 1000
    );
  }
  
  getCurrentGameTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  
  getScheduledAction(scheduleId, time) {
    const schedule = SCHEDULE_TEMPLATES[scheduleId];
    if (!schedule) return null;
    
    const timeMinutes = this.timeToMinutes(time);
    
    for (let i = schedule.timeline.length - 1; i >= 0; i--) {
      const action = schedule.timeline[i];
      if (this.timeToMinutes(action.time) <= timeMinutes) {
        return action;
      }
    }
    
    return schedule.timeline[0];
  }
  
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  getNodePosition(nodeId) {
    for (const region of Object.values(PATH_NODES)) {
      if (region[nodeId]) {
        return { x: region[nodeId].x, y: region[nodeId].y };
      }
    }
    return { x: 0, y: 0 };
  }
  
  getRegionForNode(nodeId) {
    for (const [regionId, region] of Object.entries(PATH_NODES)) {
      if (region[nodeId]) return regionId;
    }
    return null;
  }
  
  getNearestNode(position, regionNodes) {
    let nearestNode = null;
    let nearestDistance = Infinity;
    
    for (const [nodeId, node] of Object.entries(regionNodes)) {
      const distance = Math.sqrt(
        Math.pow(node.x - position.x, 2) + 
        Math.pow(node.y - position.y, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestNode = nodeId;
      }
    }
    
    return nearestNode;
  }
  
  checkInteractions(npc) {
    // Placeholder for interaction checking
    return [];
  }
}

// Export singleton instance
export const npcManager = new NPCPathingManager();

// Export everything
export default {
  PATH_NODES,
  SCHEDULE_TEMPLATES,
  PATROL_ROUTES,
  BEHAVIOR_STATES,
  INTERACTION_TRIGGERS,
  GROUP_BEHAVIORS,
  NPC_MEMORY,
  PATHFINDING,
  NPCStateMachine,
  NPCPathingManager,
  npcManager,
  calculatePath,
};
