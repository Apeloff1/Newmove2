/**
 * OPEN WORLD PIRATE RPG - CHARACTER SYSTEM
 * Character creation, customization, and progression
 */

// ============================================================================
// CHARACTER CLASSES & BACKGROUNDS
// ============================================================================

export const CHARACTER_GENDERS = {
  male: {
    id: 'male',
    name: 'Male',
    pronouns: { subject: 'he', object: 'him', possessive: 'his' },
    portraits: ['👨', '👨‍🦱', '👨‍🦰', '👨‍🦳', '🧔'],
    titles: {
      default: 'Lad',
      pirate: 'Pirate',
      captain: 'Captain',
      legend: 'Sea Lord'
    }
  },
  female: {
    id: 'female', 
    name: 'Female',
    pronouns: { subject: 'she', object: 'her', possessive: 'her' },
    portraits: ['👩', '👩‍🦱', '👩‍🦰', '👩‍🦳', '👱‍♀️'],
    titles: {
      default: 'Lass',
      pirate: 'Pirate',
      captain: 'Captain',
      legend: 'Sea Queen'
    }
  }
};

export const CHARACTER_BACKGROUNDS = [
  {
    id: 'sailor',
    name: 'Former Sailor',
    description: 'You served on merchant ships before seeking fortune. You know the sea.',
    icon: '⛵',
    bonuses: { sailing: 2, fishing: 1, trading: 0, combat: 0 },
    startingItems: ['rope_piece', 'sailors_compass', 'hardtack'],
    startingGold: 50,
    loreIntro: "The merchant fleet was never your calling. The sea whispered of adventure, not cargo manifests."
  },
  {
    id: 'fisher',
    name: 'Village Fisher',
    description: 'You grew up with a rod in hand. Fish are your friends... and your dinner.',
    icon: '🎣',
    bonuses: { sailing: 0, fishing: 3, trading: 0, combat: 0 },
    startingItems: ['basic_rod', 'worm_bait', 'fish_encyclopedia'],
    startingGold: 30,
    loreIntro: "The village pond was too small for dreams this big. The ocean called your name."
  },
  {
    id: 'merchant',
    name: 'Traveling Merchant',
    description: 'You can sell sand to beach crabs. Haggling is in your blood.',
    icon: '💰',
    bonuses: { sailing: 0, fishing: 0, trading: 3, combat: 0 },
    startingItems: ['merchant_ledger', 'gold_scales', 'lucky_coin'],
    startingGold: 150,
    loreIntro: "Profit margins on land grew thin. The pirate trade routes promise... opportunity."
  },
  {
    id: 'runaway',
    name: 'Noble Runaway',
    description: 'You fled a life of luxury for freedom. Your etiquette is excellent.',
    icon: '👑',
    bonuses: { sailing: 0, fishing: 0, trading: 1, combat: 1, charm: 1 },
    startingItems: ['fancy_clothes', 'family_ring', 'perfumed_letter'],
    startingGold: 200,
    loreIntro: "The gilded cage of nobility suffocated you. Freedom tastes like salt air."
  },
  {
    id: 'orphan',
    name: 'Dockside Orphan',
    description: 'The streets raised you. You survive. You adapt. You overcome.',
    icon: '🌟',
    bonuses: { sailing: 1, fishing: 1, trading: 0, combat: 0, luck: 2 },
    startingItems: ['lockpicks', 'torn_map', 'lucky_pebble'],
    startingGold: 10,
    loreIntro: "No family, no home, no rules. Just you, the docks, and infinite possibility."
  }
];

export const CHARACTER_APPEARANCES = {
  skinTones: ['🏻', '🏼', '🏽', '🏾', '🏿'],
  hairColors: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'],
  accessories: [
    { id: 'none', name: 'None', icon: '' },
    { id: 'eyepatch', name: 'Eyepatch', icon: '🏴‍☠️' },
    { id: 'bandana', name: 'Bandana', icon: '🎀' },
    { id: 'hat', name: 'Tricorn Hat', icon: '🎩' },
    { id: 'earring', name: 'Gold Earring', icon: '💍' },
    { id: 'scar', name: 'Battle Scar', icon: '⚔️' }
  ]
};

// ============================================================================
// CHARACTER STATS & SKILLS
// ============================================================================

export const CHARACTER_STATS = {
  // Primary Stats
  strength: { name: 'Strength', icon: '💪', description: 'Physical power. Affects reeling and combat.' },
  agility: { name: 'Agility', icon: '⚡', description: 'Speed and reflexes. Affects casting and dodging.' },
  wisdom: { name: 'Wisdom', icon: '🧠', description: 'Knowledge and intuition. Affects fish finding and lore.' },
  charisma: { name: 'Charisma', icon: '✨', description: 'Social prowess. Affects NPC interactions and prices.' },
  luck: { name: 'Luck', icon: '🍀', description: 'Fortune favors you. Affects rare catches and loot.' },
  endurance: { name: 'Endurance', icon: '❤️', description: 'Stamina and health. Affects exploration time.' }
};

export const CHARACTER_SKILLS = {
  // Fishing Skills
  casting: { name: 'Casting', icon: '🎯', stat: 'agility', maxLevel: 10 },
  reeling: { name: 'Reeling', icon: '🔄', stat: 'strength', maxLevel: 10 },
  baitcraft: { name: 'Bait Craft', icon: '🪱', stat: 'wisdom', maxLevel: 10 },
  fishLore: { name: 'Fish Lore', icon: '📚', stat: 'wisdom', maxLevel: 10 },
  
  // Sailing Skills  
  navigation: { name: 'Navigation', icon: '🧭', stat: 'wisdom', maxLevel: 10 },
  shipHandling: { name: 'Ship Handling', icon: '⛵', stat: 'agility', maxLevel: 10 },
  weatherReading: { name: 'Weather Reading', icon: '🌤️', stat: 'wisdom', maxLevel: 10 },
  
  // Social Skills
  haggling: { name: 'Haggling', icon: '💬', stat: 'charisma', maxLevel: 10 },
  persuasion: { name: 'Persuasion', icon: '🗣️', stat: 'charisma', maxLevel: 10 },
  intimidation: { name: 'Intimidation', icon: '😠', stat: 'strength', maxLevel: 10 },
  
  // Exploration Skills
  treasure: { name: 'Treasure Sense', icon: '💎', stat: 'luck', maxLevel: 10 },
  cartography: { name: 'Cartography', icon: '🗺️', stat: 'wisdom', maxLevel: 10 },
  survival: { name: 'Survival', icon: '🏕️', stat: 'endurance', maxLevel: 10 }
};

// ============================================================================
// REPUTATION SYSTEM
// ============================================================================

export const REPUTATION_FACTIONS = {
  pirates: {
    id: 'pirates',
    name: "The Freebooters",
    icon: '🏴‍☠️',
    description: 'The loose alliance of pirates who rule the outer islands.',
    ranks: ['Landlubber', 'Deckhand', 'Sailor', 'First Mate', 'Captain', 'Admiral', 'Pirate King/Queen'],
    perks: {
      1: 'Access to black market',
      3: 'Discount at pirate shops',
      5: 'Own a pirate ship',
      7: 'Command a fleet'
    }
  },
  merchants: {
    id: 'merchants',
    name: "The Trade Guild",
    icon: '⚖️',
    description: 'The powerful merchants who control legitimate commerce.',
    ranks: ['Nobody', 'Vendor', 'Trader', 'Merchant', 'Magnate', 'Tycoon', 'Trade Prince/Princess'],
    perks: {
      1: 'Better shop prices',
      3: 'Exclusive rare items',
      5: 'Own a trading post',
      7: 'Control trade routes'
    }
  },
  navy: {
    id: 'navy',
    name: "The Royal Navy",
    icon: '⚓',
    description: 'The official naval forces that patrol the waters.',
    ranks: ['Civilian', 'Recruit', 'Sailor', 'Ensign', 'Lieutenant', 'Commander', 'Admiral'],
    perks: {
      1: 'Legal protection',
      3: 'Naval equipment access',
      5: 'Bounty hunter license',
      7: 'Own a warship'
    }
  },
  merfolk: {
    id: 'merfolk',
    name: "The Coral Court",
    icon: '🧜',
    description: 'The mysterious merfolk who dwell beneath the waves.',
    ranks: ['Unknown', 'Curious', 'Tolerated', 'Welcomed', 'Friend', 'Champion', 'Honorary Merfolk'],
    perks: {
      1: 'Underwater breathing potion recipes',
      3: 'Access to underwater locations',
      5: 'Mermaid companion',
      7: 'The Mermaid\'s Heart'
    }
  },
  mystics: {
    id: 'mystics',
    name: "The Tide Weavers",
    icon: '🔮',
    description: 'Sea witches and mystics who wield oceanic magic.',
    ranks: ['Skeptic', 'Curious', 'Initiate', 'Adept', 'Mystic', 'Arcane', 'Tide Master'],
    perks: {
      1: 'Basic enchantments',
      3: 'Weather manipulation',
      5: 'Magical equipment',
      7: 'Legendary spells'
    }
  }
};

// ============================================================================
// DEFAULT CHARACTER TEMPLATE
// ============================================================================

export const createDefaultCharacter = () => ({
  // Identity
  name: '',
  gender: null,
  background: null,
  appearance: {
    skinTone: 0,
    hairColor: 0,
    accessory: 'none',
    portrait: 0
  },
  
  // Stats (base values, modified by background)
  stats: {
    strength: 5,
    agility: 5,
    wisdom: 5,
    charisma: 5,
    luck: 5,
    endurance: 5
  },
  
  // Skills (all start at 0, gain through play)
  skills: Object.fromEntries(
    Object.keys(CHARACTER_SKILLS).map(k => [k, 0])
  ),
  
  // Reputation (all start neutral)
  reputation: Object.fromEntries(
    Object.keys(REPUTATION_FACTIONS).map(k => [k, 0])
  ),
  
  // Progress
  level: 1,
  experience: 0,
  gold: 100,
  
  // Inventory
  inventory: [],
  equippedItems: {
    rod: null,
    hat: null,
    outfit: null,
    accessory: null,
    ship: null
  },
  
  // Story flags for branching narrative
  storyFlags: {},
  completedQuests: [],
  activeQuests: [],
  
  // Relationships with specific NPCs
  relationships: {},
  
  // Timestamps
  createdAt: null,
  lastPlayed: null,
  totalPlayTime: 0
});

// ============================================================================
// CHARACTER CREATION HELPERS
// ============================================================================

export const applyBackgroundBonuses = (character, backgroundId) => {
  const background = CHARACTER_BACKGROUNDS.find(b => b.id === backgroundId);
  if (!background) return character;
  
  const newCharacter = { ...character };
  
  // Apply stat bonuses
  Object.entries(background.bonuses).forEach(([stat, bonus]) => {
    if (newCharacter.stats[stat] !== undefined) {
      newCharacter.stats[stat] += bonus;
    }
  });
  
  // Add starting items
  newCharacter.inventory = [...background.startingItems];
  newCharacter.gold = background.startingGold;
  newCharacter.background = backgroundId;
  
  return newCharacter;
};

export const getCharacterTitle = (character) => {
  const gender = CHARACTER_GENDERS[character.gender];
  if (!gender) return 'Adventurer';
  
  const level = character.level || 1;
  if (level >= 50) return gender.titles.legend;
  if (level >= 25) return gender.titles.captain;
  if (level >= 10) return gender.titles.pirate;
  return gender.titles.default;
};

export const getCharacterPronouns = (character) => {
  const gender = CHARACTER_GENDERS[character.gender];
  return gender?.pronouns || { subject: 'they', object: 'them', possessive: 'their' };
};

// ============================================================================
// EXPERIENCE & LEVELING
// ============================================================================

export const XP_PER_LEVEL = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,      // 1-10
  4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20200, // 11-20
  23000, 26000, 29200, 32600, 36200, 40000, 44000, 48200, 52600, 57200, // 21-30
  62000, 67000, 72200, 77600, 83200, 89000, 95000, 101200, 107600, 114200, // 31-40
  121000, 128000, 135200, 142600, 150200, 158000, 166000, 174200, 182600, 191200 // 41-50
];

export const calculateLevel = (totalXP) => {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (totalXP >= XP_PER_LEVEL[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const getXPForNextLevel = (currentLevel) => {
  if (currentLevel >= XP_PER_LEVEL.length) return Infinity;
  return XP_PER_LEVEL[currentLevel];
};

export const getLevelProgress = (totalXP, currentLevel) => {
  const currentLevelXP = XP_PER_LEVEL[currentLevel - 1] || 0;
  const nextLevelXP = XP_PER_LEVEL[currentLevel] || currentLevelXP + 1000;
  const progress = (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP);
  return Math.min(1, Math.max(0, progress));
};

export default {
  CHARACTER_GENDERS,
  CHARACTER_BACKGROUNDS,
  CHARACTER_APPEARANCES,
  CHARACTER_STATS,
  CHARACTER_SKILLS,
  REPUTATION_FACTIONS,
  createDefaultCharacter,
  applyBackgroundBonuses,
  getCharacterTitle,
  getCharacterPronouns,
  calculateLevel,
  getXPForNextLevel,
  getLevelProgress
};
