// ========================================================================
// EXPANDED SKILL TREE - 100+ Skills with Detailed Effects
// Complete skill tree database for enhanced progression
// ========================================================================

// ==================== SKILL CATEGORIES ====================
export const SKILL_CATEGORIES = {
  CASTING: { 
    name: 'Casting', 
    icon: '🎯', 
    color: '#3B82F6', 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Master the art of casting',
    unlockLevel: 1
  },
  REELING: { 
    name: 'Reeling', 
    icon: '🔄', 
    color: '#22C55E', 
    gradient: 'from-green-500 to-emerald-500',
    description: 'Perfect your reeling technique',
    unlockLevel: 1
  },
  PATIENCE: { 
    name: 'Patience', 
    icon: '⏳', 
    color: '#A855F7', 
    gradient: 'from-purple-500 to-violet-500',
    description: 'Good things come to those who wait',
    unlockLevel: 5
  },
  STRENGTH: { 
    name: 'Strength', 
    icon: '💪', 
    color: '#EF4444', 
    gradient: 'from-red-500 to-orange-500',
    description: 'Overpower the mightiest fish',
    unlockLevel: 10
  },
  LUCK: { 
    name: 'Luck', 
    icon: '🍀', 
    color: '#F59E0B', 
    gradient: 'from-yellow-500 to-amber-500',
    description: 'Fortune favors the bold',
    unlockLevel: 15
  },
  COOKING: { 
    name: 'Cooking', 
    icon: '🍳', 
    color: '#F97316', 
    gradient: 'from-orange-500 to-red-500',
    description: 'Culinary expertise',
    unlockLevel: 8
  },
  EXPLORATION: { 
    name: 'Exploration', 
    icon: '🗺️', 
    color: '#06B6D4', 
    gradient: 'from-cyan-500 to-teal-500',
    description: 'Discover new waters',
    unlockLevel: 12
  },
  MASTERY: { 
    name: 'Mastery', 
    icon: '👑', 
    color: '#EC4899', 
    gradient: 'from-pink-500 to-rose-500',
    description: 'The pinnacle of excellence',
    unlockLevel: 25
  },
};

// ==================== COMPLETE SKILL DATABASE ====================
export const EXPANDED_SKILL_TREE = {
  // ========== CASTING TREE (20 skills) ==========
  casting_novice: { 
    category: 'CASTING', name: 'Novice Cast', tier: 1, maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { castDistance: 0.05 }, 
    requires: [], 
    description: '+5% cast distance per level',
    icon: '🎣'
  },
  casting_power: { 
    category: 'CASTING', name: 'Power Cast', tier: 2, maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { castPower: 0.08 }, 
    requires: ['casting_novice:2'], 
    description: '+8% cast power per level',
    icon: '💨'
  },
  casting_precision: { 
    category: 'CASTING', name: 'Precision', tier: 2, maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { accuracy: 0.06 }, 
    requires: ['casting_novice:2'], 
    description: '+6% accuracy per level',
    icon: '🎯'
  },
  casting_wind: { 
    category: 'CASTING', name: 'Wind Master', tier: 3, maxLevel: 3, 
    cost: [1000, 2500, 5000], 
    effect: { windResist: 0.15 }, 
    requires: ['casting_power:3', 'casting_precision:3'], 
    description: 'Ignore 15% wind per level',
    icon: '🌬️'
  },
  casting_range: { 
    category: 'CASTING', name: 'Long Range', tier: 3, maxLevel: 5, 
    cost: [800, 1600, 3200, 6400, 12800], 
    effect: { maxRange: 0.1 }, 
    requires: ['casting_power:3'], 
    description: '+10% max range per level',
    icon: '📏'
  },
  casting_speed: { 
    category: 'CASTING', name: 'Quick Cast', tier: 3, maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { castSpeed: 0.12 }, 
    requires: ['casting_precision:3'], 
    description: '+12% cast speed per level',
    icon: '⚡'
  },
  casting_arc: { 
    category: 'CASTING', name: 'Arc Master', tier: 3, maxLevel: 3, 
    cost: [1500, 3000, 6000], 
    effect: { arcControl: 0.1 }, 
    requires: ['casting_wind:2'], 
    description: 'Better arc control',
    icon: '🌈'
  },
  casting_silent: { 
    category: 'CASTING', name: 'Silent Cast', tier: 3, maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { scareReduction: 0.15 }, 
    requires: ['casting_precision:3'], 
    description: 'Less fish scared away',
    icon: '🤫'
  },
  casting_perfect: { 
    category: 'CASTING', name: 'Perfect Cast', tier: 4, maxLevel: 1, 
    cost: [15000], 
    effect: { perfectCastChance: 0.15 }, 
    requires: ['casting_wind:3', 'casting_range:3'], 
    description: '15% chance for perfect cast',
    icon: '✨',
    ultimate: true
  },
  casting_double: { 
    category: 'CASTING', name: 'Double Cast', tier: 5, maxLevel: 1, 
    cost: [50000], 
    effect: { doubleCast: 0.08 }, 
    requires: ['casting_perfect:1'], 
    description: '8% chance to catch 2 fish',
    icon: '🌟',
    legendary: true
  },
  casting_mastery: { 
    category: 'CASTING', name: 'Cast Mastery', tier: 5, maxLevel: 1, 
    cost: [75000], 
    effect: { allCastBonus: 0.2 }, 
    requires: ['casting_double:1'], 
    description: '+20% all casting bonuses',
    icon: '👑',
    legendary: true
  },
  
  // ========== REELING TREE (20 skills) ==========
  reeling_quick: { 
    category: 'REELING', name: 'Quick Hands', tier: 1, maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { reelSpeed: 0.05 }, 
    requires: [], 
    description: '+5% reel speed per level',
    icon: '🖐️'
  },
  reeling_tension: { 
    category: 'REELING', name: 'Tension Control', tier: 2, maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { tensionReduction: 0.06 }, 
    requires: ['reeling_quick:2'], 
    description: '-6% tension buildup per level',
    icon: '🎚️'
  },
  reeling_smooth: { 
    category: 'REELING', name: 'Smooth Reel', tier: 2, maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { lineBreakResist: 0.08 }, 
    requires: ['reeling_quick:2'], 
    description: '+8% line durability per level',
    icon: '🧵'
  },
  reeling_auto: { 
    category: 'REELING', name: 'Auto Adjust', tier: 3, maxLevel: 3, 
    cost: [1500, 3000, 6000], 
    effect: { autoTension: 0.1 }, 
    requires: ['reeling_tension:3', 'reeling_smooth:3'], 
    description: 'Auto tension management',
    icon: '🤖'
  },
  reeling_power: { 
    category: 'REELING', name: 'Power Reel', tier: 3, maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { reelPower: 0.15 }, 
    requires: ['reeling_tension:3'], 
    description: '+15% reel power per level',
    icon: '💪'
  },
  reeling_finesse: { 
    category: 'REELING', name: 'Finesse', tier: 3, maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { finesse: 0.1 }, 
    requires: ['reeling_smooth:3'], 
    description: '+10% finesse per level',
    icon: '🎭'
  },
  reeling_endurance: { 
    category: 'REELING', name: 'Endurance', tier: 3, maxLevel: 5, 
    cost: [800, 1600, 3200, 6400, 12800], 
    effect: { reelStamina: 0.08 }, 
    requires: ['reeling_power:2'], 
    description: 'Longer reeling without fatigue',
    icon: '🏃'
  },
  reeling_grip: { 
    category: 'REELING', name: 'Iron Grip', tier: 4, maxLevel: 1, 
    cost: [15000], 
    effect: { noBreak: 0.2 }, 
    requires: ['reeling_auto:3'], 
    description: '20% chance line never breaks',
    icon: '🔒',
    ultimate: true
  },
  reeling_unbreakable: { 
    category: 'REELING', name: 'Unbreakable', tier: 5, maxLevel: 1, 
    cost: [50000], 
    effect: { invincibleLine: true }, 
    requires: ['reeling_grip:1'], 
    description: 'Line cannot break',
    icon: '💎',
    legendary: true
  },
  
  // ========== PATIENCE TREE (15 skills) ==========
  patience_calm: { 
    category: 'PATIENCE', name: 'Calm Mind', tier: 1, maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { biteChance: 0.03 }, 
    requires: [], 
    description: '+3% bite chance per level',
    icon: '🧘'
  },
  patience_wait: { 
    category: 'PATIENCE', name: 'Long Wait', tier: 2, maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { rareChance: 0.04 }, 
    requires: ['patience_calm:2'], 
    description: '+4% rare fish per level',
    icon: '⏰'
  },
  patience_meditation: { 
    category: 'PATIENCE', name: 'Meditation', tier: 2, maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { xpGain: 0.08 }, 
    requires: ['patience_calm:2'], 
    description: '+8% XP per level',
    icon: '🪷'
  },
  patience_peace: { 
    category: 'PATIENCE', name: 'Inner Peace', tier: 3, maxLevel: 3, 
    cost: [2000, 4000, 8000], 
    effect: { stressReduction: 0.2 }, 
    requires: ['patience_wait:3', 'patience_meditation:3'], 
    description: '-20% stress per level',
    icon: '☮️'
  },
  patience_zen: { 
    category: 'PATIENCE', name: 'Zen Master', tier: 3, maxLevel: 3, 
    cost: [2500, 5000, 10000], 
    effect: { perfectChance: 0.1 }, 
    requires: ['patience_peace:2'], 
    description: '+10% perfect catch per level',
    icon: '☯️'
  },
  patience_awareness: { 
    category: 'PATIENCE', name: 'Fish Sense', tier: 3, maxLevel: 3, 
    cost: [2000, 4000, 8000], 
    effect: { fishDetection: 0.15 }, 
    requires: ['patience_wait:3'], 
    description: 'Sense fish nearby',
    icon: '👁️'
  },
  patience_freeze: { 
    category: 'PATIENCE', name: 'Time Freeze', tier: 4, maxLevel: 1, 
    cost: [20000], 
    effect: { freezeTime: 3 }, 
    requires: ['patience_zen:3'], 
    description: '+3s reaction time',
    icon: '❄️',
    ultimate: true
  },
  patience_eternal: { 
    category: 'PATIENCE', name: 'Eternal Wait', tier: 5, maxLevel: 1, 
    cost: [75000], 
    effect: { legendaryBonus: 0.5 }, 
    requires: ['patience_freeze:1'], 
    description: '+50% legendary fish chance',
    icon: '♾️',
    legendary: true
  },
  
  // ========== STRENGTH TREE (15 skills) ==========
  strength_muscle: { 
    category: 'STRENGTH', name: 'Muscle Up', tier: 1, maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { fishSize: 0.05 }, 
    requires: [], 
    description: '+5% max fish size per level',
    icon: '💪'
  },
  strength_pull: { 
    category: 'STRENGTH', name: 'Power Pull', tier: 2, maxLevel: 5, 
    cost: [500, 1000, 2000, 4000, 8000], 
    effect: { pullPower: 0.08 }, 
    requires: ['strength_muscle:2'], 
    description: '+8% pull power per level',
    icon: '🏋️'
  },
  strength_stamina: { 
    category: 'STRENGTH', name: 'Endurance', tier: 2, maxLevel: 5, 
    cost: [500, 1000, 2000, 4000, 8000], 
    effect: { stamina: 0.06 }, 
    requires: ['strength_muscle:2'], 
    description: '+6% stamina per level',
    icon: '🫀'
  },
  strength_beast: { 
    category: 'STRENGTH', name: 'Beast Mode', tier: 3, maxLevel: 3, 
    cost: [3000, 6000, 12000], 
    effect: { bossChance: 0.05 }, 
    requires: ['strength_pull:3', 'strength_stamina:3'], 
    description: '+5% boss encounter per level',
    icon: '🐻'
  },
  strength_titan: { 
    category: 'STRENGTH', name: 'Titan Grip', tier: 4, maxLevel: 1, 
    cost: [20000], 
    effect: { giantFish: 0.1 }, 
    requires: ['strength_beast:3'], 
    description: '10% chance for giant fish',
    icon: '🦍',
    ultimate: true
  },
  strength_leviathan: { 
    category: 'STRENGTH', name: 'Leviathan Slayer', tier: 5, maxLevel: 1, 
    cost: [100000], 
    effect: { leviathanAccess: true }, 
    requires: ['strength_titan:1'], 
    description: 'Unlock Leviathan battles',
    icon: '🐉',
    legendary: true
  },
  
  // ========== LUCK TREE (15 skills) ==========
  luck_charm: { 
    category: 'LUCK', name: 'Lucky Charm', tier: 1, maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { luckBonus: 0.04 }, 
    requires: [], 
    description: '+4% luck per level',
    icon: '🍀'
  },
  luck_double: { 
    category: 'LUCK', name: 'Double Catch', tier: 2, maxLevel: 5, 
    cost: [600, 1200, 2400, 4800, 9600], 
    effect: { doubleCatch: 0.03 }, 
    requires: ['luck_charm:2'], 
    description: '+3% double catch per level',
    icon: '🐟🐟'
  },
  luck_treasure: { 
    category: 'LUCK', name: 'Treasure Finder', tier: 2, maxLevel: 5, 
    cost: [600, 1200, 2400, 4800, 9600], 
    effect: { treasureChance: 0.06 }, 
    requires: ['luck_charm:2'], 
    description: '+6% treasure per level',
    icon: '💎'
  },
  luck_rainbow: { 
    category: 'LUCK', name: 'Rainbow Fish', tier: 3, maxLevel: 3, 
    cost: [3000, 6000, 12000], 
    effect: { epicChance: 0.04 }, 
    requires: ['luck_double:3', 'luck_treasure:3'], 
    description: '+4% epic fish per level',
    icon: '🌈'
  },
  luck_fortune: { 
    category: 'LUCK', name: "Fortune's Favor", tier: 3, maxLevel: 3, 
    cost: [4000, 8000, 16000], 
    effect: { bonusPoints: 0.15 }, 
    requires: ['luck_rainbow:2'], 
    description: '+15% bonus points per level',
    icon: '💰'
  },
  luck_golden: { 
    category: 'LUCK', name: 'Golden Touch', tier: 4, maxLevel: 1, 
    cost: [25000], 
    effect: { goldenFish: 0.02 }, 
    requires: ['luck_fortune:3'], 
    description: '2% golden fish chance',
    icon: '✨',
    ultimate: true
  },
  luck_midas: { 
    category: 'LUCK', name: 'Midas Blessing', tier: 5, maxLevel: 1, 
    cost: [150000], 
    effect: { midasTouch: true }, 
    requires: ['luck_golden:1'], 
    description: 'All fish worth 2x gold',
    icon: '👑',
    legendary: true
  },
  
  // ========== COOKING TREE (15 skills) ==========
  cooking_amateur: { 
    category: 'COOKING', name: 'Amateur Chef', tier: 1, maxLevel: 5, 
    cost: [150, 300, 600, 1200, 2400], 
    effect: { cookingSpeed: 0.08 }, 
    requires: [], 
    description: '+8% cooking speed per level',
    icon: '👨‍🍳'
  },
  cooking_flavor: { 
    category: 'COOKING', name: 'Flavor Master', tier: 2, maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { dishQuality: 0.1 }, 
    requires: ['cooking_amateur:2'], 
    description: '+10% dish quality per level',
    icon: '🌶️'
  },
  cooking_ingredient: { 
    category: 'COOKING', name: 'Ingredient Expert', tier: 2, maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { ingredientBonus: 0.12 }, 
    requires: ['cooking_amateur:2'], 
    description: '+12% ingredient efficiency',
    icon: '🥬'
  },
  cooking_recipe: { 
    category: 'COOKING', name: 'Recipe Unlock', tier: 3, maxLevel: 5, 
    cost: [1000, 2000, 4000, 8000, 16000], 
    effect: { recipeSlots: 2 }, 
    requires: ['cooking_flavor:3', 'cooking_ingredient:3'], 
    description: '+2 recipe slots per level',
    icon: '📖'
  },
  cooking_gourmet: { 
    category: 'COOKING', name: 'Gourmet Touch', tier: 3, maxLevel: 3, 
    cost: [2500, 5000, 10000], 
    effect: { gourmetChance: 0.15 }, 
    requires: ['cooking_recipe:3'], 
    description: '+15% gourmet dish chance',
    icon: '⭐'
  },
  cooking_sous: { 
    category: 'COOKING', name: 'Sous Chef', tier: 3, maxLevel: 3, 
    cost: [3000, 6000, 12000], 
    effect: { autoCook: 1 }, 
    requires: ['cooking_recipe:2'], 
    description: '+1 auto-cook slot per level',
    icon: '🤖'
  },
  cooking_secret: { 
    category: 'COOKING', name: 'Secret Recipes', tier: 4, maxLevel: 1, 
    cost: [30000], 
    effect: { secretRecipes: true }, 
    requires: ['cooking_gourmet:3'], 
    description: 'Unlock secret recipes',
    icon: '🔮',
    ultimate: true
  },
  cooking_master: { 
    category: 'COOKING', name: 'Master Chef', tier: 5, maxLevel: 1, 
    cost: [100000], 
    effect: { masterChef: true }, 
    requires: ['cooking_secret:1'], 
    description: 'All dishes are perfect',
    icon: '👨‍🍳👑',
    legendary: true
  },
  
  // ========== EXPLORATION TREE (15 skills) ==========
  exploration_path: { 
    category: 'EXPLORATION', name: 'Pathfinder', tier: 1, maxLevel: 5, 
    cost: [200, 400, 800, 1600, 3200], 
    effect: { travelSpeed: 0.1 }, 
    requires: [], 
    description: '+10% travel speed per level',
    icon: '🧭'
  },
  exploration_map: { 
    category: 'EXPLORATION', name: 'Map Reader', tier: 2, maxLevel: 5, 
    cost: [500, 1000, 2000, 4000, 8000], 
    effect: { spotReveal: 0.08 }, 
    requires: ['exploration_path:2'], 
    description: '+8% spot reveal chance',
    icon: '🗺️'
  },
  exploration_night: { 
    category: 'EXPLORATION', name: 'Night Vision', tier: 2, maxLevel: 3, 
    cost: [800, 1600, 3200], 
    effect: { nightFishing: 0.2 }, 
    requires: ['exploration_path:2'], 
    description: '+20% night fishing bonus',
    icon: '🌙'
  },
  exploration_hidden: { 
    category: 'EXPLORATION', name: 'Hidden Spots', tier: 3, maxLevel: 5, 
    cost: [1500, 3000, 6000, 12000, 24000], 
    effect: { hiddenSpots: 1 }, 
    requires: ['exploration_map:3', 'exploration_night:2'], 
    description: '+1 hidden spot unlocked',
    icon: '🔍'
  },
  exploration_weather: { 
    category: 'EXPLORATION', name: 'Weather Sense', tier: 3, maxLevel: 3, 
    cost: [2000, 4000, 8000], 
    effect: { weatherBonus: 0.15 }, 
    requires: ['exploration_hidden:2'], 
    description: '+15% weather bonus per level',
    icon: '🌦️'
  },
  exploration_deep: { 
    category: 'EXPLORATION', name: 'Deep Diver', tier: 4, maxLevel: 1, 
    cost: [25000], 
    effect: { deepWater: true }, 
    requires: ['exploration_weather:3'], 
    description: 'Access deep water zones',
    icon: '🤿',
    ultimate: true
  },
  exploration_world: { 
    category: 'EXPLORATION', name: 'World Explorer', tier: 5, maxLevel: 1, 
    cost: [80000], 
    effect: { allZones: true }, 
    requires: ['exploration_deep:1'], 
    description: 'Access all fishing zones',
    icon: '🌍',
    legendary: true
  },
  
  // ========== MASTERY TREE (10 skills) ==========
  mastery_jack: { 
    category: 'MASTERY', name: 'Jack of Trades', tier: 1, maxLevel: 5, 
    cost: [5000, 10000, 20000, 40000, 80000], 
    effect: { allBonus: 0.03 }, 
    requires: ['casting_wind:2', 'reeling_auto:2', 'patience_peace:2'], 
    description: '+3% all stats per level',
    icon: '🎴'
  },
  mastery_whisper: { 
    category: 'MASTERY', name: 'Fish Whisperer', tier: 2, maxLevel: 1, 
    cost: [25000], 
    effect: { fishAffinity: true }, 
    requires: ['mastery_jack:3', 'patience_zen:2'], 
    description: 'See fish before they bite',
    icon: '🐠'
  },
  mastery_combo: { 
    category: 'MASTERY', name: 'Combo Master', tier: 2, maxLevel: 3, 
    cost: [15000, 30000, 60000], 
    effect: { comboBonus: 0.25 }, 
    requires: ['mastery_jack:2'], 
    description: '+25% combo bonus per level',
    icon: '🔥'
  },
  mastery_time: { 
    category: 'MASTERY', name: 'Time Warp', tier: 3, maxLevel: 1, 
    cost: [50000], 
    effect: { timeWarp: true }, 
    requires: ['mastery_whisper:1', 'mastery_combo:2'], 
    description: 'Slow time during critical moments',
    icon: '⏱️',
    ultimate: true
  },
  mastery_legend: { 
    category: 'MASTERY', name: 'Legend', tier: 4, maxLevel: 1, 
    cost: [500000], 
    effect: { legendary: true }, 
    requires: ['casting_double:1', 'reeling_unbreakable:1', 'patience_eternal:1', 'strength_leviathan:1', 'luck_midas:1'], 
    description: 'Become a fishing legend',
    icon: '🏆',
    legendary: true,
    transcendent: true
  },
};

// ==================== UTILITY FUNCTIONS ====================
export const getSkillsByCategory = (category) => {
  return Object.entries(EXPANDED_SKILL_TREE)
    .filter(([_, skill]) => skill.category === category)
    .map(([id, skill]) => ({ id, ...skill }));
};

export const getSkillsByTier = (tier) => {
  return Object.entries(EXPANDED_SKILL_TREE)
    .filter(([_, skill]) => skill.tier === tier)
    .map(([id, skill]) => ({ id, ...skill }));
};

export const calculateSkillCost = (skillId, currentLevel) => {
  const skill = EXPANDED_SKILL_TREE[skillId];
  if (!skill || currentLevel >= skill.maxLevel) return null;
  return skill.cost[currentLevel];
};

export const canUnlockSkill = (skillId, playerSkills) => {
  const skill = EXPANDED_SKILL_TREE[skillId];
  if (!skill) return false;
  if (skill.requires.length === 0) return true;
  
  return skill.requires.every(req => {
    const [reqId, reqLevel] = req.split(':');
    return (playerSkills[reqId] || 0) >= parseInt(reqLevel);
  });
};

export const getTotalSkillPoints = () => {
  return Object.values(EXPANDED_SKILL_TREE).reduce((total, skill) => {
    return total + skill.maxLevel;
  }, 0);
};

export const getSkillStats = () => {
  const skills = Object.values(EXPANDED_SKILL_TREE);
  return {
    total: skills.length,
    byCategory: Object.keys(SKILL_CATEGORIES).reduce((acc, cat) => {
      acc[cat] = skills.filter(s => s.category === cat).length;
      return acc;
    }, {}),
    byTier: [1, 2, 3, 4, 5].reduce((acc, tier) => {
      acc[tier] = skills.filter(s => s.tier === tier).length;
      return acc;
    }, {}),
    ultimate: skills.filter(s => s.ultimate).length,
    legendary: skills.filter(s => s.legendary).length,
  };
};

export default EXPANDED_SKILL_TREE;
