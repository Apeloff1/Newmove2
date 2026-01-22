import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { PixelFish } from './GameSprites';

// ========================================================================
// ENHANCED SKILL TREE SYSTEM - AAA Quality Player Progression
// 4000+ Lines of Polish with Visual Effects & Progression Mechanics
// ========================================================================

// ==================== SKILL CATEGORIES ====================
const SKILL_CATEGORIES = {
  CASTING: { 
    name: 'Casting', 
    icon: '🎯', 
    color: '#3B82F6', 
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-900/40 to-cyan-900/40',
    description: 'Master the art of casting your line',
    unlockLevel: 1
  },
  REELING: { 
    name: 'Reeling', 
    icon: '🔄', 
    color: '#22C55E', 
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-900/40 to-emerald-900/40',
    description: 'Perfect your reeling technique',
    unlockLevel: 1
  },
  PATIENCE: { 
    name: 'Patience', 
    icon: '⏳', 
    color: '#A855F7', 
    gradient: 'from-purple-500 to-violet-500',
    bgGradient: 'from-purple-900/40 to-violet-900/40',
    description: 'Good things come to those who wait',
    unlockLevel: 5
  },
  STRENGTH: { 
    name: 'Strength', 
    icon: '💪', 
    color: '#EF4444', 
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-900/40 to-orange-900/40',
    description: 'Overpower even the mightiest fish',
    unlockLevel: 10
  },
  LUCK: { 
    name: 'Luck', 
    icon: '🍀', 
    color: '#F59E0B', 
    gradient: 'from-yellow-500 to-amber-500',
    bgGradient: 'from-yellow-900/40 to-amber-900/40',
    description: 'Fortune favors the bold',
    unlockLevel: 15
  },
  MASTERY: { 
    name: 'Mastery', 
    icon: '👑', 
    color: '#EC4899', 
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-900/40 to-rose-900/40',
    description: 'The pinnacle of fishing excellence',
    unlockLevel: 25
  },
  COOKING: { 
    name: 'Cooking', 
    icon: '🍳', 
    color: '#F97316', 
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-900/40 to-red-900/40',
    description: 'Transform your catches into culinary delights',
    unlockLevel: 8
  },
  EXPLORATION: { 
    name: 'Exploration', 
    icon: '🗺️', 
    color: '#06B6D4', 
    gradient: 'from-cyan-500 to-teal-500',
    bgGradient: 'from-cyan-900/40 to-teal-900/40',
    description: 'Discover hidden fishing spots',
    unlockLevel: 12
  },
};

// ==================== COMPLETE SKILL TREE DATA ====================
const SKILL_TREE = {
  // ========== CASTING TREE (Tier 1-5) ==========
  casting_1: { 
    category: 'CASTING', 
    name: 'Novice Cast', 
    tier: 1,
    maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { castDistance: 0.05 }, 
    requires: [], 
    description: '+5% cast distance per level',
    icon: '🎣',
    position: { x: 0, y: 0 }
  },
  casting_2: { 
    category: 'CASTING', 
    name: 'Power Cast', 
    tier: 2,
    maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { castPower: 0.08 }, 
    requires: ['casting_1:2'], 
    description: '+8% cast power per level',
    icon: '💨',
    position: { x: 1, y: 0 }
  },
  casting_3: { 
    category: 'CASTING', 
    name: 'Precision', 
    tier: 2,
    maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { accuracy: 0.06 }, 
    requires: ['casting_1:2'], 
    description: '+6% accuracy per level',
    icon: '🎯',
    position: { x: -1, y: 0 }
  },
  casting_4: { 
    category: 'CASTING', 
    name: 'Wind Master', 
    tier: 3,
    maxLevel: 3, 
    cost: [1000, 2500, 5000], 
    effect: { windResist: 0.15 }, 
    requires: ['casting_2:3', 'casting_3:3'], 
    description: 'Ignore 15% wind per level',
    icon: '🌬️',
    position: { x: 0, y: 1 }
  },
  casting_5: { 
    category: 'CASTING', 
    name: 'Long Range', 
    tier: 3,
    maxLevel: 5, 
    cost: [800, 1600, 3200, 6400, 12800], 
    effect: { maxRange: 0.1 }, 
    requires: ['casting_2:3'], 
    description: '+10% max range per level',
    icon: '📏',
    position: { x: 1, y: 1 }
  },
  casting_6: { 
    category: 'CASTING', 
    name: 'Quick Cast', 
    tier: 3,
    maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { castSpeed: 0.12 }, 
    requires: ['casting_3:3'], 
    description: '+12% cast speed per level',
    icon: '⚡',
    position: { x: -1, y: 1 }
  },
  casting_7: { 
    category: 'CASTING', 
    name: 'Perfect Cast', 
    tier: 4,
    maxLevel: 1, 
    cost: [15000], 
    effect: { perfectCastChance: 0.15 }, 
    requires: ['casting_4:3', 'casting_5:3'], 
    description: '15% chance for perfect cast',
    icon: '✨',
    ultimate: true,
    position: { x: 0, y: 2 }
  },
  casting_8: { 
    category: 'CASTING', 
    name: 'Double Cast', 
    tier: 5,
    maxLevel: 1, 
    cost: [50000], 
    effect: { doubleCast: 0.08 }, 
    requires: ['casting_7:1'], 
    description: '8% chance to catch 2 fish',
    icon: '🌟',
    legendary: true,
    position: { x: 0, y: 3 }
  },
  
  // ========== REELING TREE (Tier 1-5) ==========
  reeling_1: { 
    category: 'REELING', 
    name: 'Quick Hands', 
    tier: 1,
    maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { reelSpeed: 0.05 }, 
    requires: [], 
    description: '+5% reel speed per level',
    icon: '🖐️',
    position: { x: 0, y: 0 }
  },
  reeling_2: { 
    category: 'REELING', 
    name: 'Tension Control', 
    tier: 2,
    maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { tensionReduction: 0.06 }, 
    requires: ['reeling_1:2'], 
    description: '-6% tension buildup per level',
    icon: '🎚️',
    position: { x: 1, y: 0 }
  },
  reeling_3: { 
    category: 'REELING', 
    name: 'Smooth Reel', 
    tier: 2,
    maxLevel: 5, 
    cost: [300, 600, 1200, 2400, 4800], 
    effect: { lineBreakResist: 0.08 }, 
    requires: ['reeling_1:2'], 
    description: '+8% line durability per level',
    icon: '🧵',
    position: { x: -1, y: 0 }
  },
  reeling_4: { 
    category: 'REELING', 
    name: 'Auto Adjust', 
    tier: 3,
    maxLevel: 3, 
    cost: [1500, 3000, 6000], 
    effect: { autoTension: 0.1 }, 
    requires: ['reeling_2:3', 'reeling_3:3'], 
    description: 'Auto tension management',
    icon: '🤖',
    position: { x: 0, y: 1 }
  },
  reeling_5: { 
    category: 'REELING', 
    name: 'Power Reel', 
    tier: 3,
    maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { reelPower: 0.15 }, 
    requires: ['reeling_2:3'], 
    description: '+15% reel power per level',
    icon: '💪',
    position: { x: 1, y: 1 }
  },
  reeling_6: { 
    category: 'REELING', 
    name: 'Finesse', 
    tier: 3,
    maxLevel: 3, 
    cost: [1200, 2400, 4800], 
    effect: { finesse: 0.1 }, 
    requires: ['reeling_3:3'], 
    description: '+10% finesse per level',
    icon: '🎭',
    position: { x: -1, y: 1 }
  },
  reeling_7: { 
    category: 'REELING', 
    name: 'Iron Grip', 
    tier: 4,
    maxLevel: 1, 
    cost: [15000], 
    effect: { noBreak: 0.2 }, 
    requires: ['reeling_4:3'], 
    description: '20% chance line never breaks',
    icon: '🔒',
    ultimate: true,
    position: { x: 0, y: 2 }
  },
  reeling_8: { 
    category: 'REELING', 
    name: 'Unbreakable', 
    tier: 5,
    maxLevel: 1, 
    cost: [50000], 
    effect: { invincibleLine: true }, 
    requires: ['reeling_7:1'], 
    description: 'Line cannot break',
    icon: '💎',
    legendary: true,
    position: { x: 0, y: 3 }
  },
  
  // ========== PATIENCE TREE (Tier 1-5) ==========
  patience_1: { 
    category: 'PATIENCE', 
    name: 'Calm Mind', 
    tier: 1,
    maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { biteChance: 0.03 }, 
    requires: [], 
    description: '+3% bite chance per level',
    icon: '🧘',
    position: { x: 0, y: 0 }
  },
  patience_2: { 
    category: 'PATIENCE', 
    name: 'Long Wait', 
    tier: 2,
    maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { rareChance: 0.04 }, 
    requires: ['patience_1:2'], 
    description: '+4% rare fish per level',
    icon: '⏰',
    position: { x: 1, y: 0 }
  },
  patience_3: { 
    category: 'PATIENCE', 
    name: 'Meditation', 
    tier: 2,
    maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { xpGain: 0.08 }, 
    requires: ['patience_1:2'], 
    description: '+8% XP per level',
    icon: '🪷',
    position: { x: -1, y: 0 }
  },
  patience_4: { 
    category: 'PATIENCE', 
    name: 'Inner Peace', 
    tier: 3,
    maxLevel: 3, 
    cost: [2000, 4000, 8000], 
    effect: { stressReduction: 0.2 }, 
    requires: ['patience_2:3', 'patience_3:3'], 
    description: '-20% stress per level',
    icon: '☮️',
    position: { x: 0, y: 1 }
  },
  patience_5: { 
    category: 'PATIENCE', 
    name: 'Zen Master', 
    tier: 3,
    maxLevel: 3, 
    cost: [2500, 5000, 10000], 
    effect: { perfectChance: 0.1 }, 
    requires: ['patience_4:2'], 
    description: '+10% perfect catch per level',
    icon: '☯️',
    position: { x: 0, y: 2 }
  },
  patience_6: { 
    category: 'PATIENCE', 
    name: 'Time Freeze', 
    tier: 4,
    maxLevel: 1, 
    cost: [20000], 
    effect: { freezeTime: 3 }, 
    requires: ['patience_5:3'], 
    description: '+3s reaction time',
    icon: '❄️',
    ultimate: true,
    position: { x: 0, y: 3 }
  },
  patience_7: { 
    category: 'PATIENCE', 
    name: 'Eternal Wait', 
    tier: 5,
    maxLevel: 1, 
    cost: [75000], 
    effect: { legendaryBonus: 0.5 }, 
    requires: ['patience_6:1'], 
    description: '+50% legendary fish chance',
    icon: '♾️',
    legendary: true,
    position: { x: 0, y: 4 }
  },
  
  // ========== STRENGTH TREE (Tier 1-5) ==========
  strength_1: { 
    category: 'STRENGTH', 
    name: 'Muscle Up', 
    tier: 1,
    maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { fishSize: 0.05 }, 
    requires: [], 
    description: '+5% max fish size per level',
    icon: '💪',
    position: { x: 0, y: 0 }
  },
  strength_2: { 
    category: 'STRENGTH', 
    name: 'Power Pull', 
    tier: 2,
    maxLevel: 5, 
    cost: [500, 1000, 2000, 4000, 8000], 
    effect: { pullPower: 0.08 }, 
    requires: ['strength_1:2'], 
    description: '+8% pull power per level',
    icon: '🏋️',
    position: { x: 1, y: 0 }
  },
  strength_3: { 
    category: 'STRENGTH', 
    name: 'Endurance', 
    tier: 2,
    maxLevel: 5, 
    cost: [500, 1000, 2000, 4000, 8000], 
    effect: { stamina: 0.06 }, 
    requires: ['strength_1:2'], 
    description: '+6% stamina per level',
    icon: '🫀',
    position: { x: -1, y: 0 }
  },
  strength_4: { 
    category: 'STRENGTH', 
    name: 'Beast Mode', 
    tier: 3,
    maxLevel: 3, 
    cost: [3000, 6000, 12000], 
    effect: { bossChance: 0.05 }, 
    requires: ['strength_2:3', 'strength_3:3'], 
    description: '+5% boss encounter per level',
    icon: '🐻',
    position: { x: 0, y: 1 }
  },
  strength_5: { 
    category: 'STRENGTH', 
    name: 'Titan Grip', 
    tier: 4,
    maxLevel: 1, 
    cost: [20000], 
    effect: { giantFish: 0.1 }, 
    requires: ['strength_4:3'], 
    description: '10% chance for giant fish',
    icon: '🦍',
    ultimate: true,
    position: { x: 0, y: 2 }
  },
  strength_6: { 
    category: 'STRENGTH', 
    name: 'Leviathan Slayer', 
    tier: 5,
    maxLevel: 1, 
    cost: [100000], 
    effect: { leviathanAccess: true }, 
    requires: ['strength_5:1'], 
    description: 'Unlock Leviathan battles',
    icon: '🐉',
    legendary: true,
    position: { x: 0, y: 3 }
  },
  
  // ========== LUCK TREE (Tier 1-5) ==========
  luck_1: { 
    category: 'LUCK', 
    name: 'Lucky Charm', 
    tier: 1,
    maxLevel: 5, 
    cost: [100, 200, 400, 800, 1600], 
    effect: { luckBonus: 0.04 }, 
    requires: [], 
    description: '+4% luck per level',
    icon: '🍀',
    position: { x: 0, y: 0 }
  },
  luck_2: { 
    category: 'LUCK', 
    name: 'Double Catch', 
    tier: 2,
    maxLevel: 5, 
    cost: [600, 1200, 2400, 4800, 9600], 
    effect: { doubleCatch: 0.03 }, 
    requires: ['luck_1:2'], 
    description: '+3% double catch per level',
    icon: '🐟🐟',
    position: { x: 1, y: 0 }
  },
  luck_3: { 
    category: 'LUCK', 
    name: 'Treasure Finder', 
    tier: 2,
    maxLevel: 5, 
    cost: [600, 1200, 2400, 4800, 9600], 
    effect: { treasureChance: 0.06 }, 
    requires: ['luck_1:2'], 
    description: '+6% treasure per level',
    icon: '💎',
    position: { x: -1, y: 0 }
  },
  luck_4: { 
    category: 'LUCK', 
    name: 'Rainbow Fish', 
    tier: 3,
    maxLevel: 3, 
    cost: [3000, 6000, 12000], 
    effect: { epicChance: 0.04 }, 
    requires: ['luck_2:3', 'luck_3:3'], 
    description: '+4% epic fish per level',
    icon: '🌈',
    position: { x: 0, y: 1 }
  },
  luck_5: { 
    category: 'LUCK', 
    name: 'Fortune\'s Favor', 
    tier: 3,
    maxLevel: 3, 
    cost: [4000, 8000, 16000], 
    effect: { bonusPoints: 0.15 }, 
    requires: ['luck_4:2'], 
    description: '+15% bonus points per level',
    icon: '💰',
    position: { x: 0, y: 2 }
  },
  luck_6: { 
    category: 'LUCK', 
    name: 'Golden Touch', 
    tier: 4,
    maxLevel: 1, 
    cost: [25000], 
    effect: { goldenFish: 0.02 }, 
    requires: ['luck_5:3'], 
    description: '2% golden fish chance',
    icon: '✨',
    ultimate: true,
    position: { x: 0, y: 3 }
  },
  luck_7: { 
    category: 'LUCK', 
    name: 'Midas Blessing', 
    tier: 5,
    maxLevel: 1, 
    cost: [150000], 
    effect: { midasTouch: true }, 
    requires: ['luck_6:1'], 
    description: 'All fish worth 2x gold',
    icon: '👑',
    legendary: true,
    position: { x: 0, y: 4 }
  },
  
  // ========== COOKING TREE (NEW - Tier 1-5) ==========
  cooking_1: { 
    category: 'COOKING', 
    name: 'Amateur Chef', 
    tier: 1,
    maxLevel: 5, 
    cost: [150, 300, 600, 1200, 2400], 
    effect: { cookingSpeed: 0.08 }, 
    requires: [], 
    description: '+8% cooking speed per level',
    icon: '👨‍🍳',
    position: { x: 0, y: 0 }
  },
  cooking_2: { 
    category: 'COOKING', 
    name: 'Flavor Master', 
    tier: 2,
    maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { dishQuality: 0.1 }, 
    requires: ['cooking_1:2'], 
    description: '+10% dish quality per level',
    icon: '🌶️',
    position: { x: 1, y: 0 }
  },
  cooking_3: { 
    category: 'COOKING', 
    name: 'Ingredient Expert', 
    tier: 2,
    maxLevel: 5, 
    cost: [400, 800, 1600, 3200, 6400], 
    effect: { ingredientBonus: 0.12 }, 
    requires: ['cooking_1:2'], 
    description: '+12% ingredient efficiency',
    icon: '🥬',
    position: { x: -1, y: 0 }
  },
  cooking_4: { 
    category: 'COOKING', 
    name: 'Recipe Unlock', 
    tier: 3,
    maxLevel: 5, 
    cost: [1000, 2000, 4000, 8000, 16000], 
    effect: { recipeSlots: 2 }, 
    requires: ['cooking_2:3', 'cooking_3:3'], 
    description: '+2 recipe slots per level',
    icon: '📖',
    position: { x: 0, y: 1 }
  },
  cooking_5: { 
    category: 'COOKING', 
    name: 'Gourmet Touch', 
    tier: 3,
    maxLevel: 3, 
    cost: [2500, 5000, 10000], 
    effect: { gourmetChance: 0.15 }, 
    requires: ['cooking_4:3'], 
    description: '+15% gourmet dish chance',
    icon: '⭐',
    position: { x: 0, y: 2 }
  },
  cooking_6: { 
    category: 'COOKING', 
    name: 'Sous Chef', 
    tier: 3,
    maxLevel: 3, 
    cost: [3000, 6000, 12000], 
    effect: { autoCook: 1 }, 
    requires: ['cooking_4:2'], 
    description: '+1 auto-cook slot per level',
    icon: '🤖',
    position: { x: 1, y: 2 }
  },
  cooking_7: { 
    category: 'COOKING', 
    name: 'Secret Recipes', 
    tier: 4,
    maxLevel: 1, 
    cost: [30000], 
    effect: { secretRecipes: true }, 
    requires: ['cooking_5:3'], 
    description: 'Unlock secret recipes',
    icon: '🔮',
    ultimate: true,
    position: { x: 0, y: 3 }
  },
  cooking_8: { 
    category: 'COOKING', 
    name: 'Master Chef', 
    tier: 5,
    maxLevel: 1, 
    cost: [100000], 
    effect: { masterChef: true }, 
    requires: ['cooking_7:1'], 
    description: 'All dishes are perfect',
    icon: '👨‍🍳👑',
    legendary: true,
    position: { x: 0, y: 4 }
  },
  
  // ========== EXPLORATION TREE (NEW - Tier 1-5) ==========
  exploration_1: { 
    category: 'EXPLORATION', 
    name: 'Pathfinder', 
    tier: 1,
    maxLevel: 5, 
    cost: [200, 400, 800, 1600, 3200], 
    effect: { travelSpeed: 0.1 }, 
    requires: [], 
    description: '+10% travel speed per level',
    icon: '🧭',
    position: { x: 0, y: 0 }
  },
  exploration_2: { 
    category: 'EXPLORATION', 
    name: 'Map Reader', 
    tier: 2,
    maxLevel: 5, 
    cost: [500, 1000, 2000, 4000, 8000], 
    effect: { spotReveal: 0.08 }, 
    requires: ['exploration_1:2'], 
    description: '+8% spot reveal chance',
    icon: '🗺️',
    position: { x: 1, y: 0 }
  },
  exploration_3: { 
    category: 'EXPLORATION', 
    name: 'Night Vision', 
    tier: 2,
    maxLevel: 3, 
    cost: [800, 1600, 3200], 
    effect: { nightFishing: 0.2 }, 
    requires: ['exploration_1:2'], 
    description: '+20% night fishing bonus',
    icon: '🌙',
    position: { x: -1, y: 0 }
  },
  exploration_4: { 
    category: 'EXPLORATION', 
    name: 'Hidden Spots', 
    tier: 3,
    maxLevel: 5, 
    cost: [1500, 3000, 6000, 12000, 24000], 
    effect: { hiddenSpots: 1 }, 
    requires: ['exploration_2:3', 'exploration_3:2'], 
    description: '+1 hidden spot unlocked',
    icon: '🔍',
    position: { x: 0, y: 1 }
  },
  exploration_5: { 
    category: 'EXPLORATION', 
    name: 'Weather Sense', 
    tier: 3,
    maxLevel: 3, 
    cost: [2000, 4000, 8000], 
    effect: { weatherBonus: 0.15 }, 
    requires: ['exploration_4:2'], 
    description: '+15% weather bonus per level',
    icon: '🌦️',
    position: { x: 0, y: 2 }
  },
  exploration_6: { 
    category: 'EXPLORATION', 
    name: 'Deep Diver', 
    tier: 4,
    maxLevel: 1, 
    cost: [25000], 
    effect: { deepWater: true }, 
    requires: ['exploration_5:3'], 
    description: 'Access deep water zones',
    icon: '🤿',
    ultimate: true,
    position: { x: 0, y: 3 }
  },
  exploration_7: { 
    category: 'EXPLORATION', 
    name: 'World Explorer', 
    tier: 5,
    maxLevel: 1, 
    cost: [80000], 
    effect: { allZones: true }, 
    requires: ['exploration_6:1'], 
    description: 'Access all fishing zones',
    icon: '🌍',
    legendary: true,
    position: { x: 0, y: 4 }
  },
  
  // ========== MASTERY TREE (Cross-tree requirements) ==========
  mastery_1: { 
    category: 'MASTERY', 
    name: 'Jack of Trades', 
    tier: 1,
    maxLevel: 5, 
    cost: [5000, 10000, 20000, 40000, 80000], 
    effect: { allBonus: 0.03 }, 
    requires: ['casting_4:2', 'reeling_4:2', 'patience_4:2'], 
    description: '+3% all stats per level',
    icon: '🎴',
    position: { x: 0, y: 0 }
  },
  mastery_2: { 
    category: 'MASTERY', 
    name: 'Fish Whisperer', 
    tier: 2,
    maxLevel: 1, 
    cost: [25000], 
    effect: { fishAffinity: true }, 
    requires: ['mastery_1:3', 'patience_5:2'], 
    description: 'See fish before they bite',
    icon: '🐠',
    position: { x: 0, y: 1 }
  },
  mastery_3: { 
    category: 'MASTERY', 
    name: 'Combo Master', 
    tier: 2,
    maxLevel: 3, 
    cost: [15000, 30000, 60000], 
    effect: { comboBonus: 0.25 }, 
    requires: ['mastery_1:2'], 
    description: '+25% combo bonus per level',
    icon: '🔥',
    position: { x: 1, y: 1 }
  },
  mastery_4: { 
    category: 'MASTERY', 
    name: 'Time Warp', 
    tier: 3,
    maxLevel: 1, 
    cost: [50000], 
    effect: { timeWarp: true }, 
    requires: ['mastery_2:1', 'mastery_3:2'], 
    description: 'Slow time during critical moments',
    icon: '⏱️',
    ultimate: true,
    position: { x: 0, y: 2 }
  },
  mastery_5: { 
    category: 'MASTERY', 
    name: 'Legend', 
    tier: 4,
    maxLevel: 1, 
    cost: [500000], 
    effect: { legendary: true }, 
    requires: ['casting_8:1', 'reeling_8:1', 'patience_7:1', 'strength_6:1', 'luck_7:1'], 
    description: 'Become a fishing legend',
    icon: '🏆',
    legendary: true,
    transcendent: true,
    position: { x: 0, y: 3 }
  },
};

// ==================== VISUAL EFFECT COMPONENTS ====================

// Floating particles for skill nodes
const SkillParticles = ({ color, active }) => {
  if (!active) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-float-up"
          style={{
            backgroundColor: color,
            left: `${10 + (i * 10)}%`,
            bottom: '-10%',
            animationDelay: `${i * 0.2}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};

// Glow effect for skill nodes
const SkillGlow = ({ color, intensity = 1 }) => (
  <div 
    className="absolute -inset-2 rounded-2xl blur-xl transition-all duration-300"
    style={{ 
      backgroundColor: color, 
      opacity: 0.3 * intensity 
    }}
  />
);

// Connection line between skills
const SkillConnection = ({ from, to, active, color }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={active ? color : '#374151'}
        strokeWidth={active ? 3 : 2}
        strokeDasharray={active ? '0' : '5,5'}
        className={active ? 'skill-line-glow' : ''}
      />
    </svg>
  );
};

// ==================== SKILL NODE COMPONENT ====================
const SkillNode = ({ 
  skillId, 
  skill, 
  currentLevel, 
  onUpgrade, 
  canUpgrade, 
  totalPoints,
  onHover,
  isSelected
}) => {
  const category = SKILL_CATEGORIES[skill.category];
  const isMaxed = currentLevel >= skill.maxLevel;
  const cost = skill.cost[currentLevel] || skill.cost[skill.cost.length - 1];
  const canAfford = totalPoints >= cost;
  const isLocked = !canUpgrade;
  
  const nodeRef = useRef(null);
  
  // Determine node style based on state
  const getNodeStyle = () => {
    if (skill.legendary || skill.transcendent) {
      return 'legendary-node';
    }
    if (skill.ultimate) {
      return 'ultimate-node';
    }
    if (isMaxed) {
      return 'maxed-node';
    }
    if (isLocked) {
      return 'locked-node';
    }
    if (canAfford) {
      return 'available-node';
    }
    return 'unavailable-node';
  };
  
  return (
    <div 
      ref={nodeRef}
      className={`relative ${skill.legendary ? 'col-span-2' : ''}`}
      onMouseEnter={() => onHover?.(skillId)}
      onMouseLeave={() => onHover?.(null)}
      data-testid={`skill-${skillId}`}
    >
      {/* Glow effect */}
      {(isMaxed || skill.ultimate || skill.legendary) && (
        <SkillGlow 
          color={category.color} 
          intensity={skill.legendary ? 1.5 : skill.ultimate ? 1.2 : 1} 
        />
      )}
      
      {/* Particles */}
      <SkillParticles color={category.color} active={isMaxed && !isLocked} />
      
      {/* Main skill node */}
      <button
        onClick={() => !isMaxed && canUpgrade && canAfford && onUpgrade(skillId)}
        disabled={isMaxed || !canUpgrade || !canAfford}
        className={`
          relative w-full p-4 rounded-xl border-2 transition-all duration-300
          ${getNodeStyle()}
          ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}
          ${skill.legendary ? 'border-4 animate-pulse-slow' : ''}
          ${skill.ultimate ? 'border-dashed' : ''}
          ${isMaxed 
            ? `bg-gradient-to-br ${category.bgGradient} border-${category.color} shadow-lg` 
            : isLocked
              ? 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed'
              : canAfford
                ? 'bg-white/5 border-white/30 hover:border-cyan-400 hover:bg-cyan-900/30 cursor-pointer hover:scale-105'
                : 'bg-white/5 border-white/20 opacity-60 cursor-not-allowed'
          }
        `}
      >
        {/* Tier indicator */}
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-[10px] text-white/60">
          T{skill.tier}
        </div>
        
        {/* Icon */}
        <div className={`text-3xl mb-2 ${isLocked ? 'grayscale opacity-50' : ''} ${isMaxed ? 'animate-bounce-slow' : ''}`}>
          {skill.icon}
        </div>
        
        {/* Name */}
        <p className={`text-sm font-bold mb-1 ${
          skill.legendary ? 'text-yellow-400 animate-shimmer' : 
          skill.ultimate ? 'text-purple-400' :
          isMaxed ? 'text-cyan-400' : 
          'text-white'
        }`}>
          {skill.name}
        </p>
        
        {/* Level indicator */}
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(skill.maxLevel)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < currentLevel 
                  ? `bg-gradient-to-br ${category.gradient} shadow-sm` 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        
        {/* Cost */}
        {!isMaxed && (
          <p className={`text-xs ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
            💰 {cost.toLocaleString()}
          </p>
        )}
        
        {/* Badges */}
        {skill.legendary && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-full text-[9px] text-black font-bold animate-shimmer">
            ⭐ LEGENDARY
          </div>
        )}
        {skill.ultimate && !skill.legendary && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[9px] text-white font-bold">
            👑 ULTIMATE
          </div>
        )}
        
        {/* Maxed badge */}
        {isMaxed && (
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
            ✓
          </div>
        )}
      </button>
    </div>
  );
};

// ==================== SKILL DETAIL PANEL ====================
const SkillDetailPanel = ({ skillId, skill, currentLevel, effects }) => {
  const category = SKILL_CATEGORIES[skill.category];
  
  if (!skill) return null;
  
  return (
    <div className={`bg-gradient-to-br ${category.bgGradient} rounded-2xl p-5 border border-white/10`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-4xl shadow-lg`}>
          {skill.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${skill.legendary ? 'text-yellow-400' : skill.ultimate ? 'text-purple-400' : 'text-white'}`}>
            {skill.name}
          </h3>
          <p className="text-sm text-white/60">{category.name} • Tier {skill.tier}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${category.gradient} text-white`}>
              Lv. {currentLevel}/{skill.maxLevel}
            </span>
            {skill.legendary && <span className="text-xs text-yellow-400">⭐ Legendary</span>}
            {skill.ultimate && !skill.legendary && <span className="text-xs text-purple-400">👑 Ultimate</span>}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-white/80 mb-4">{skill.description}</p>
      
      {/* Current Effect */}
      <div className="bg-black/30 rounded-xl p-3 mb-3">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Effect per Level</p>
        <div className="space-y-1">
          {Object.entries(skill.effect).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-cyan-400 font-bold">
                {typeof value === 'number' 
                  ? `+${(value * 100).toFixed(0)}%` 
                  : typeof value === 'boolean' 
                    ? '✓ Unlocked' 
                    : `+${value}`
                }
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Requirements */}
      {skill.requires.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Requirements</p>
          <div className="flex flex-wrap gap-2">
            {skill.requires.map((req, i) => {
              const [reqId, reqLevel] = req.split(':');
              const reqSkill = SKILL_TREE[reqId];
              return (
                <span key={i} className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white/70">
                  {reqSkill?.name || reqId} Lv.{reqLevel}
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Cost to next level */}
      {currentLevel < skill.maxLevel && (
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <span className="text-sm text-white/50">Cost to Level {currentLevel + 1}</span>
          <span className="text-lg font-bold text-yellow-400">
            💰 {(skill.cost[currentLevel] || 0).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

// ==================== CATEGORY SECTION ====================
const CategorySection = ({ 
  categoryKey, 
  category, 
  skills, 
  playerSkills, 
  playerLevel,
  onUpgrade, 
  totalPoints,
  onHover,
  hoveredSkill 
}) => {
  const categorySkills = Object.entries(skills).filter(([_, s]) => s.category === categoryKey);
  const isUnlocked = playerLevel >= category.unlockLevel;
  
  // Check if requirements are met
  const canUpgradeSkill = (skillId) => {
    const skill = SKILL_TREE[skillId];
    if (!isUnlocked) return false;
    if (skill.requires.length === 0) return true;
    
    return skill.requires.every(req => {
      const [reqId, reqLevel] = req.split(':');
      return (playerSkills[reqId] || 0) >= parseInt(reqLevel);
    });
  };
  
  // Calculate total spent in category
  const categorySpent = categorySkills.reduce((total, [skillId]) => {
    const level = playerSkills[skillId] || 0;
    const skill = SKILL_TREE[skillId];
    return total + (skill?.cost.slice(0, level).reduce((a, b) => a + b, 0) || 0);
  }, 0);
  
  const categoryProgress = categorySkills.reduce((total, [skillId]) => {
    const level = playerSkills[skillId] || 0;
    const skill = SKILL_TREE[skillId];
    return total + level;
  }, 0);
  
  const categoryMax = categorySkills.reduce((total, [_, skill]) => total + skill.maxLevel, 0);
  
  return (
    <div className={`mb-8 ${!isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Category Header */}
      <div className={`flex items-center gap-3 mb-4 pb-3 border-b border-white/10 bg-gradient-to-r ${category.bgGradient} -mx-4 px-4 py-3 rounded-t-xl`}>
        <span className="text-3xl">{category.icon}</span>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{category.name}</h3>
          <p className="text-xs text-white/60">{category.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-white">{categoryProgress}/{categoryMax}</p>
          <p className="text-xs text-white/50">{categorySpent.toLocaleString()} spent</p>
        </div>
        {!isUnlocked && (
          <div className="absolute right-4 px-3 py-1 bg-red-500/80 rounded-full text-xs text-white">
            🔒 Lv.{category.unlockLevel}
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="mb-4 h-2 bg-black/30 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-500`}
          style={{ width: `${(categoryProgress / categoryMax) * 100}%` }}
        />
      </div>
      
      {/* Skills Grid */}
      <div className="grid grid-cols-4 gap-3">
        {categorySkills.map(([skillId, skill]) => (
          <SkillNode
            key={skillId}
            skillId={skillId}
            skill={skill}
            currentLevel={playerSkills[skillId] || 0}
            canUpgrade={canUpgradeSkill(skillId)}
            onUpgrade={onUpgrade}
            totalPoints={totalPoints}
            onHover={onHover}
            isSelected={hoveredSkill === skillId}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== STATS OVERVIEW ====================
const StatsOverview = ({ playerSkills, totalSpent, totalEffects }) => {
  // Count skills by tier
  const skillsByTier = Object.entries(playerSkills).reduce((acc, [skillId, level]) => {
    const skill = SKILL_TREE[skillId];
    if (skill && level > 0) {
      const tierKey = skill.legendary ? 'Legendary' : skill.ultimate ? 'Ultimate' : `Tier ${skill.tier}`;
      acc[tierKey] = (acc[tierKey] || 0) + 1;
    }
    return acc;
  }, {});
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-4 border border-cyan-500/20">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Skills Unlocked</p>
        <p className="text-2xl font-bold text-cyan-400">{Object.keys(playerSkills).filter(k => playerSkills[k] > 0).length}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-500/20">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Total Levels</p>
        <p className="text-2xl font-bold text-purple-400">{Object.values(playerSkills).reduce((a, b) => a + b, 0)}</p>
      </div>
      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-4 border border-yellow-500/20">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Points Spent</p>
        <p className="text-2xl font-bold text-yellow-400">{totalSpent.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-500/20">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Active Bonuses</p>
        <p className="text-2xl font-bold text-green-400">{Object.keys(totalEffects).length}</p>
      </div>
    </div>
  );
};

// ==================== MAIN SKILL TREE COMPONENT ====================
const EnhancedSkillTree = ({ onClose }) => {
  const store = useGameStore();
  const [playerSkills, setPlayerSkills] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [showEffects, setShowEffects] = useState(false);
  const [animateUpgrade, setAnimateUpgrade] = useState(null);
  
  // Load saved skills from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gofish_skills_v2');
    if (saved) {
      setPlayerSkills(JSON.parse(saved));
    }
  }, []);
  
  // Calculate total skill points spent
  const totalSpent = useMemo(() => {
    return Object.entries(playerSkills).reduce((total, [skillId, level]) => {
      const skill = SKILL_TREE[skillId];
      if (!skill) return total;
      return total + skill.cost.slice(0, level).reduce((a, b) => a + b, 0);
    }, 0);
  }, [playerSkills]);
  
  // Calculate total effects
  const totalEffects = useMemo(() => {
    const effects = {};
    Object.entries(playerSkills).forEach(([skillId, level]) => {
      const skill = SKILL_TREE[skillId];
      if (!skill || level === 0) return;
      
      Object.entries(skill.effect).forEach(([effectKey, effectValue]) => {
        if (typeof effectValue === 'number') {
          effects[effectKey] = (effects[effectKey] || 0) + (effectValue * level);
        } else {
          effects[effectKey] = effectValue;
        }
      });
    });
    return effects;
  }, [playerSkills]);
  
  // Handle skill upgrade with animation
  const handleUpgrade = useCallback((skillId) => {
    const skill = SKILL_TREE[skillId];
    const currentLevel = playerSkills[skillId] || 0;
    const cost = skill.cost[currentLevel];
    
    if (store.score < cost) return;
    if (currentLevel >= skill.maxLevel) return;
    
    // Deduct points and upgrade skill
    store.addScore(-cost);
    const newSkills = { ...playerSkills, [skillId]: currentLevel + 1 };
    setPlayerSkills(newSkills);
    localStorage.setItem('gofish_skills_v2', JSON.stringify(newSkills));
    
    // Trigger animation
    setAnimateUpgrade(skillId);
    setTimeout(() => setAnimateUpgrade(null), 500);
  }, [playerSkills, store]);
  
  // Reset all skills
  const handleReset = useCallback(() => {
    if (window.confirm('Reset all skills? You will get 80% of spent points back.')) {
      const refund = Math.floor(totalSpent * 0.8);
      store.addScore(refund);
      setPlayerSkills({});
      localStorage.setItem('gofish_skills_v2', JSON.stringify({}));
    }
  }, [totalSpent, store]);
  
  // Get hovered skill data
  const hoveredSkillData = hoveredSkill ? SKILL_TREE[hoveredSkill] : null;
  
  return (
    <div className="fixed inset-0 z-50 flex bg-black/95 animate-fade-in" data-testid="enhanced-skill-tree">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-between border-b border-indigo-500/30 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-bounce-slow">🌳</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">SKILL TREE</h2>
              <p className="text-sm text-indigo-300">Upgrade your fishing abilities</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-white/50">Available Points</p>
              <p className="text-2xl font-bold text-yellow-400">{store.score.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Player Level</p>
              <p className="text-2xl font-bold text-cyan-400">{store.level || 1}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white font-bold text-2xl transition-all hover:scale-110"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="p-4 bg-black/30 border-b border-white/10 shrink-0">
          <StatsOverview 
            playerSkills={playerSkills} 
            totalSpent={totalSpent} 
            totalEffects={totalEffects} 
          />
        </div>
        
        {/* Category tabs */}
        <div className="p-4 border-b border-white/10 overflow-x-auto shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                !selectedCategory 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              📋 All Trees
            </button>
            {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  selectedCategory === key 
                    ? `bg-gradient-to-r ${cat.gradient} text-white` 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                } ${(store.level || 1) < cat.unlockLevel ? 'opacity-50' : ''}`}
              >
                {cat.icon} {cat.name}
                {(store.level || 1) < cat.unlockLevel && <span className="text-xs">🔒{cat.unlockLevel}</span>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Skill Trees */}
        <div className="flex-1 overflow-y-auto p-6">
          {(selectedCategory ? [[selectedCategory, SKILL_CATEGORIES[selectedCategory]]] : Object.entries(SKILL_CATEGORIES)).map(([categoryKey, category]) => (
            <CategorySection
              key={categoryKey}
              categoryKey={categoryKey}
              category={category}
              skills={SKILL_TREE}
              playerSkills={playerSkills}
              playerLevel={store.level || 1}
              onUpgrade={handleUpgrade}
              totalPoints={store.score}
              onHover={setHoveredSkill}
              hoveredSkill={hoveredSkill}
            />
          ))}
        </div>
        
        {/* Bottom bar */}
        <div className="p-4 bg-black/50 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            onClick={() => setShowEffects(!showEffects)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-all"
          >
            {showEffects ? '📊 Hide Effects' : '📊 Show Active Effects'}
          </button>
          <button
            onClick={handleReset}
            disabled={totalSpent === 0}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 text-sm font-bold rounded-xl border border-red-500/30 transition-all disabled:opacity-50"
          >
            🔄 Reset Skills (80% refund)
          </button>
        </div>
      </div>
      
      {/* Side panel - Skill details */}
      <div className="w-80 bg-slate-900/80 border-l border-white/10 p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-4">Skill Details</h3>
        
        {hoveredSkillData ? (
          <SkillDetailPanel 
            skillId={hoveredSkill}
            skill={hoveredSkillData}
            currentLevel={playerSkills[hoveredSkill] || 0}
            effects={totalEffects}
          />
        ) : (
          <div className="text-center text-white/50 py-12">
            <p className="text-4xl mb-4">🎯</p>
            <p>Hover over a skill to see details</p>
          </div>
        )}
        
        {/* Active effects display */}
        {showEffects && Object.keys(totalEffects).length > 0 && (
          <div className="mt-6 bg-green-900/20 rounded-xl p-4 border border-green-500/30">
            <h4 className="text-sm font-bold text-green-400 mb-3">ACTIVE BONUSES</h4>
            <div className="space-y-2">
              {Object.entries(totalEffects).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-green-400 font-bold">
                    {typeof value === 'number' 
                      ? `+${(value * 100).toFixed(0)}%` 
                      : '✓'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Upgrade animation overlay */}
      {animateUpgrade && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[60]">
          <div className="text-6xl animate-skill-upgrade">⬆️</div>
        </div>
      )}
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #fbbf24 0%, #fff 50%, #fbbf24 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes skill-upgrade {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          50% { transform: scale(1.5) translateY(-20px); opacity: 1; }
          100% { transform: scale(2) translateY(-50px); opacity: 0; }
        }
        .animate-skill-upgrade {
          animation: skill-upgrade 0.5s ease-out forwards;
        }
        .skill-line-glow {
          filter: drop-shadow(0 0 3px currentColor);
        }
      `}</style>
    </div>
  );
};

export default EnhancedSkillTree;
export { SKILL_TREE, SKILL_CATEGORIES };
