import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// ENHANCED ACHIEVEMENT SYSTEM - AAA Quality
// Comprehensive achievements with progress tracking, rewards & notifications
// ========================================================================

// ==================== ACHIEVEMENT CATEGORIES ====================
const ACHIEVEMENT_CATEGORIES = {
  FISHING: { id: 'FISHING', name: 'Fishing', icon: '🎣', color: 'from-blue-500 to-cyan-500', description: 'Master the art of fishing' },
  COLLECTION: { id: 'COLLECTION', name: 'Collection', icon: '🐟', color: 'from-green-500 to-emerald-500', description: 'Catch all fish species' },
  PROGRESSION: { id: 'PROGRESSION', name: 'Progression', icon: '📈', color: 'from-purple-500 to-pink-500', description: 'Level up and grow' },
  SKILL: { id: 'SKILL', name: 'Skill', icon: '⭐', color: 'from-yellow-500 to-orange-500', description: 'Perfect your technique' },
  COOKING: { id: 'COOKING', name: 'Cooking', icon: '🍳', color: 'from-orange-500 to-red-500', description: 'Culinary achievements' },
  EXPLORATION: { id: 'EXPLORATION', name: 'Exploration', icon: '🗺️', color: 'from-cyan-500 to-teal-500', description: 'Discover new waters' },
  SOCIAL: { id: 'SOCIAL', name: 'Social', icon: '👥', color: 'from-indigo-500 to-blue-500', description: 'Community achievements' },
  SECRET: { id: 'SECRET', name: 'Secret', icon: '🔮', color: 'from-purple-900 to-pink-900', description: 'Hidden mysteries' },
  SPECIAL: { id: 'SPECIAL', name: 'Special', icon: '✨', color: 'from-yellow-400 to-pink-500', description: 'Limited time events' },
};

// ==================== COMPLETE ACHIEVEMENT DATABASE ====================
const ACHIEVEMENTS = {
  // ========== FISHING ACHIEVEMENTS ==========
  first_catch: { 
    id: 'first_catch', 
    name: 'First Catch!', 
    desc: 'Catch your very first fish', 
    category: 'FISHING', 
    icon: '🐟', 
    points: 10, 
    rarity: 'common',
    requirement: { type: 'catches', value: 1 },
    reward: { coins: 50, item: null }
  },
  catch_10: { 
    id: 'catch_10', 
    name: 'Getting Started', 
    desc: 'Catch 10 fish', 
    category: 'FISHING', 
    icon: '🎣', 
    points: 25, 
    rarity: 'common',
    requirement: { type: 'catches', value: 10 },
    reward: { coins: 100, item: 'basic_lure' }
  },
  catch_50: { 
    id: 'catch_50', 
    name: 'Dedicated Angler', 
    desc: 'Catch 50 fish', 
    category: 'FISHING', 
    icon: '🏅', 
    points: 50, 
    rarity: 'uncommon',
    requirement: { type: 'catches', value: 50 },
    reward: { coins: 250, item: null }
  },
  catch_100: { 
    id: 'catch_100', 
    name: 'Century Fisher', 
    desc: 'Catch 100 fish', 
    category: 'FISHING', 
    icon: '🏆', 
    points: 100, 
    rarity: 'rare',
    requirement: { type: 'catches', value: 100 },
    reward: { coins: 500, item: 'shiny_lure' }
  },
  catch_500: { 
    id: 'catch_500', 
    name: 'Master Angler', 
    desc: 'Catch 500 fish', 
    category: 'FISHING', 
    icon: '👑', 
    points: 250, 
    rarity: 'epic',
    requirement: { type: 'catches', value: 500 },
    reward: { coins: 2500, item: 'golden_rod' }
  },
  catch_1000: { 
    id: 'catch_1000', 
    name: 'Fishing Legend', 
    desc: 'Catch 1000 fish', 
    category: 'FISHING', 
    icon: '🌟', 
    points: 500, 
    rarity: 'legendary',
    requirement: { type: 'catches', value: 1000 },
    reward: { coins: 10000, item: 'legendary_badge' }
  },
  catch_5000: { 
    id: 'catch_5000', 
    name: 'Ocean Conqueror', 
    desc: 'Catch 5000 fish', 
    category: 'FISHING', 
    icon: '🌊', 
    points: 1000, 
    rarity: 'legendary',
    requirement: { type: 'catches', value: 5000 },
    reward: { coins: 50000, item: 'ocean_crown' }
  },
  
  // ========== SKILL ACHIEVEMENTS ==========
  perfect_1: { 
    id: 'perfect_1', 
    name: 'Perfect!', 
    desc: 'Get your first perfect catch', 
    category: 'SKILL', 
    icon: '✨', 
    points: 25, 
    rarity: 'common',
    requirement: { type: 'perfect_catches', value: 1 },
    reward: { coins: 75, item: null }
  },
  perfect_10: { 
    id: 'perfect_10', 
    name: 'Precision Fisher', 
    desc: 'Get 10 perfect catches', 
    category: 'SKILL', 
    icon: '🎯', 
    points: 75, 
    rarity: 'uncommon',
    requirement: { type: 'perfect_catches', value: 10 },
    reward: { coins: 200, item: null }
  },
  perfect_50: { 
    id: 'perfect_50', 
    name: 'Flawless Technique', 
    desc: 'Get 50 perfect catches', 
    category: 'SKILL', 
    icon: '💎', 
    points: 200, 
    rarity: 'rare',
    requirement: { type: 'perfect_catches', value: 50 },
    reward: { coins: 750, item: 'precision_gloves' }
  },
  perfect_100: { 
    id: 'perfect_100', 
    name: 'Perfectionist', 
    desc: 'Get 100 perfect catches', 
    category: 'SKILL', 
    icon: '🏅', 
    points: 400, 
    rarity: 'epic',
    requirement: { type: 'perfect_catches', value: 100 },
    reward: { coins: 2000, item: null }
  },
  combo_5: { 
    id: 'combo_5', 
    name: 'Combo Starter', 
    desc: 'Get a 5x combo', 
    category: 'SKILL', 
    icon: '🔥', 
    points: 50, 
    rarity: 'uncommon',
    requirement: { type: 'max_combo', value: 5 },
    reward: { coins: 150, item: null }
  },
  combo_10: { 
    id: 'combo_10', 
    name: 'On Fire!', 
    desc: 'Get a 10x combo', 
    category: 'SKILL', 
    icon: '🔥🔥', 
    points: 150, 
    rarity: 'rare',
    requirement: { type: 'max_combo', value: 10 },
    reward: { coins: 500, item: 'fire_lure' }
  },
  combo_20: { 
    id: 'combo_20', 
    name: 'Unstoppable', 
    desc: 'Get a 20x combo', 
    category: 'SKILL', 
    icon: '⚡', 
    points: 400, 
    rarity: 'epic',
    requirement: { type: 'max_combo', value: 20 },
    reward: { coins: 2000, item: null }
  },
  combo_50: { 
    id: 'combo_50', 
    name: 'Combo God', 
    desc: 'Get a 50x combo', 
    category: 'SKILL', 
    icon: '👑', 
    points: 1000, 
    rarity: 'legendary',
    requirement: { type: 'max_combo', value: 50 },
    reward: { coins: 10000, item: 'combo_master_badge' }
  },
  
  // ========== COLLECTION ACHIEVEMENTS ==========
  collect_uncommon: { 
    id: 'collect_uncommon', 
    name: 'Not So Common', 
    desc: 'Catch an uncommon fish', 
    category: 'COLLECTION', 
    icon: '💚', 
    points: 20, 
    rarity: 'common',
    requirement: { type: 'fish_rarity', value: 'uncommon' },
    reward: { coins: 50, item: null }
  },
  collect_rare: { 
    id: 'collect_rare', 
    name: 'Rare Find', 
    desc: 'Catch a rare fish', 
    category: 'COLLECTION', 
    icon: '💙', 
    points: 50, 
    rarity: 'uncommon',
    requirement: { type: 'fish_rarity', value: 'rare' },
    reward: { coins: 200, item: null }
  },
  collect_epic: { 
    id: 'collect_epic', 
    name: 'Epic Discovery', 
    desc: 'Catch an epic fish', 
    category: 'COLLECTION', 
    icon: '💜', 
    points: 150, 
    rarity: 'rare',
    requirement: { type: 'fish_rarity', value: 'epic' },
    reward: { coins: 500, item: 'rare_finder' }
  },
  collect_legendary: { 
    id: 'collect_legendary', 
    name: 'Legendary Hunter', 
    desc: 'Catch a legendary fish', 
    category: 'COLLECTION', 
    icon: '💛', 
    points: 500, 
    rarity: 'epic',
    requirement: { type: 'fish_rarity', value: 'legendary' },
    reward: { coins: 2500, item: null }
  },
  golden_koi: { 
    id: 'golden_koi', 
    name: 'Golden Prize', 
    desc: 'Catch the elusive Golden Koi', 
    category: 'COLLECTION', 
    icon: '✨🐟', 
    points: 1000, 
    rarity: 'legendary',
    requirement: { type: 'specific_fish', value: 'golden_koi' },
    reward: { coins: 5000, item: 'golden_trophy' }
  },
  collect_10_types: { 
    id: 'collect_10_types', 
    name: 'Collector', 
    desc: 'Catch 10 different fish species', 
    category: 'COLLECTION', 
    icon: '📚', 
    points: 75, 
    rarity: 'uncommon',
    requirement: { type: 'unique_fish', value: 10 },
    reward: { coins: 300, item: null }
  },
  collect_25_types: { 
    id: 'collect_25_types', 
    name: 'Fish Enthusiast', 
    desc: 'Catch 25 different fish species', 
    category: 'COLLECTION', 
    icon: '📖', 
    points: 200, 
    rarity: 'rare',
    requirement: { type: 'unique_fish', value: 25 },
    reward: { coins: 1000, item: 'encyclopedia_badge' }
  },
  collect_all: { 
    id: 'collect_all', 
    name: 'Complete Encyclopedia', 
    desc: 'Catch all fish species', 
    category: 'COLLECTION', 
    icon: '📕', 
    points: 2000, 
    rarity: 'legendary',
    requirement: { type: 'unique_fish', value: 50 },
    reward: { coins: 25000, item: 'master_collector_title' }
  },
  
  // ========== PROGRESSION ACHIEVEMENTS ==========
  level_5: { 
    id: 'level_5', 
    name: 'Rising Star', 
    desc: 'Reach level 5', 
    category: 'PROGRESSION', 
    icon: '⭐', 
    points: 25, 
    rarity: 'common',
    requirement: { type: 'level', value: 5 },
    reward: { coins: 100, item: null }
  },
  level_10: { 
    id: 'level_10', 
    name: 'Skilled Fisher', 
    desc: 'Reach level 10', 
    category: 'PROGRESSION', 
    icon: '🌟', 
    points: 75, 
    rarity: 'uncommon',
    requirement: { type: 'level', value: 10 },
    reward: { coins: 300, item: 'level_10_rod' }
  },
  level_25: { 
    id: 'level_25', 
    name: 'Expert Angler', 
    desc: 'Reach level 25', 
    category: 'PROGRESSION', 
    icon: '✨', 
    points: 200, 
    rarity: 'rare',
    requirement: { type: 'level', value: 25 },
    reward: { coins: 1000, item: null }
  },
  level_50: { 
    id: 'level_50', 
    name: 'Master Fisher', 
    desc: 'Reach level 50', 
    category: 'PROGRESSION', 
    icon: '💫', 
    points: 500, 
    rarity: 'epic',
    requirement: { type: 'level', value: 50 },
    reward: { coins: 5000, item: 'master_badge' }
  },
  level_100: { 
    id: 'level_100', 
    name: 'Fishing God', 
    desc: 'Reach level 100', 
    category: 'PROGRESSION', 
    icon: '👑', 
    points: 1500, 
    rarity: 'legendary',
    requirement: { type: 'level', value: 100 },
    reward: { coins: 25000, item: 'divine_rod' }
  },
  score_1000: { 
    id: 'score_1000', 
    name: 'First Thousand', 
    desc: 'Score 1,000 points', 
    category: 'PROGRESSION', 
    icon: '📊', 
    points: 25, 
    rarity: 'common',
    requirement: { type: 'score', value: 1000 },
    reward: { coins: 50, item: null }
  },
  score_10000: { 
    id: 'score_10000', 
    name: 'High Roller', 
    desc: 'Score 10,000 points', 
    category: 'PROGRESSION', 
    icon: '💰', 
    points: 100, 
    rarity: 'uncommon',
    requirement: { type: 'score', value: 10000 },
    reward: { coins: 500, item: null }
  },
  score_100000: { 
    id: 'score_100000', 
    name: 'Point Master', 
    desc: 'Score 100,000 points', 
    category: 'PROGRESSION', 
    icon: '💎', 
    points: 300, 
    rarity: 'rare',
    requirement: { type: 'score', value: 100000 },
    reward: { coins: 2500, item: null }
  },
  score_1000000: { 
    id: 'score_1000000', 
    name: 'Millionaire', 
    desc: 'Score 1,000,000 points', 
    category: 'PROGRESSION', 
    icon: '🤑', 
    points: 1000, 
    rarity: 'legendary',
    requirement: { type: 'score', value: 1000000 },
    reward: { coins: 50000, item: 'millionaire_badge' }
  },
  
  // ========== COOKING ACHIEVEMENTS ==========
  first_dish: { 
    id: 'first_dish', 
    name: 'First Dish', 
    desc: 'Cook your first dish', 
    category: 'COOKING', 
    icon: '🍳', 
    points: 15, 
    rarity: 'common',
    requirement: { type: 'dishes_cooked', value: 1 },
    reward: { coins: 50, item: null }
  },
  cook_10: { 
    id: 'cook_10', 
    name: 'Home Cook', 
    desc: 'Cook 10 dishes', 
    category: 'COOKING', 
    icon: '👨‍🍳', 
    points: 50, 
    rarity: 'uncommon',
    requirement: { type: 'dishes_cooked', value: 10 },
    reward: { coins: 200, item: 'chef_hat' }
  },
  cook_50: { 
    id: 'cook_50', 
    name: 'Restaurant Ready', 
    desc: 'Cook 50 dishes', 
    category: 'COOKING', 
    icon: '🍽️', 
    points: 150, 
    rarity: 'rare',
    requirement: { type: 'dishes_cooked', value: 50 },
    reward: { coins: 750, item: null }
  },
  perfect_dish: { 
    id: 'perfect_dish', 
    name: 'Perfect Dish', 
    desc: 'Cook a dish with 100% quality', 
    category: 'COOKING', 
    icon: '⭐⭐⭐', 
    points: 100, 
    rarity: 'rare',
    requirement: { type: 'perfect_dishes', value: 1 },
    reward: { coins: 500, item: 'golden_spatula' }
  },
  legendary_dish: { 
    id: 'legendary_dish', 
    name: 'Legendary Chef', 
    desc: 'Cook a legendary recipe', 
    category: 'COOKING', 
    icon: '👑🍳', 
    points: 500, 
    rarity: 'legendary',
    requirement: { type: 'legendary_dishes', value: 1 },
    reward: { coins: 5000, item: 'master_chef_title' }
  },
  
  // ========== EXPLORATION ACHIEVEMENTS ==========
  all_stages: { 
    id: 'all_stages', 
    name: 'World Traveler', 
    desc: 'Fish in all stages', 
    category: 'EXPLORATION', 
    icon: '🌍', 
    points: 100, 
    rarity: 'uncommon',
    requirement: { type: 'stages_visited', value: 4 },
    reward: { coins: 400, item: null }
  },
  night_fisher_10: { 
    id: 'night_fisher_10', 
    name: 'Night Owl', 
    desc: 'Catch 10 fish at night', 
    category: 'EXPLORATION', 
    icon: '🦉', 
    points: 75, 
    rarity: 'uncommon',
    requirement: { type: 'night_catches', value: 10 },
    reward: { coins: 250, item: 'night_vision_lure' }
  },
  storm_fisher_10: { 
    id: 'storm_fisher_10', 
    name: 'Storm Chaser', 
    desc: 'Catch 10 fish during storms', 
    category: 'EXPLORATION', 
    icon: '⛈️', 
    points: 150, 
    rarity: 'rare',
    requirement: { type: 'storm_catches', value: 10 },
    reward: { coins: 600, item: null }
  },
  deep_water: { 
    id: 'deep_water', 
    name: 'Deep Diver', 
    desc: 'Unlock deep water fishing', 
    category: 'EXPLORATION', 
    icon: '🤿', 
    points: 200, 
    rarity: 'rare',
    requirement: { type: 'deep_water_unlocked', value: true },
    reward: { coins: 1000, item: 'diving_gear' }
  },
  
  // ========== SECRET ACHIEVEMENTS ==========
  lucky_day: { 
    id: 'lucky_day', 
    name: 'Lucky Day', 
    desc: 'Catch 3 rare+ fish in one session', 
    category: 'SECRET', 
    icon: '🍀', 
    points: 200, 
    rarity: 'rare',
    requirement: { type: 'rare_streak', value: 3 },
    reward: { coins: 1000, item: 'lucky_charm' },
    hidden: true
  },
  speed_demon: { 
    id: 'speed_demon', 
    name: 'Speed Demon', 
    desc: 'Catch 10 fish in under 2 minutes', 
    category: 'SECRET', 
    icon: '💨', 
    points: 200, 
    rarity: 'rare',
    requirement: { type: 'speed_catches', value: 10 },
    reward: { coins: 1000, item: null },
    hidden: true
  },
  patient_fisher: { 
    id: 'patient_fisher', 
    name: 'Patience Pays', 
    desc: 'Wait 30 seconds for a single catch', 
    category: 'SECRET', 
    icon: '⏰', 
    points: 50, 
    rarity: 'uncommon',
    requirement: { type: 'patient_catch', value: 30 },
    reward: { coins: 200, item: null },
    hidden: true
  },
  whale_watcher: { 
    id: 'whale_watcher', 
    name: 'Whale Watcher', 
    desc: 'See the whale 10 times', 
    category: 'SECRET', 
    icon: '🐋', 
    points: 150, 
    rarity: 'rare',
    requirement: { type: 'whale_sightings', value: 10 },
    reward: { coins: 750, item: 'whale_figurine' },
    hidden: true
  },
  full_moon: { 
    id: 'full_moon', 
    name: 'Lunar Luck', 
    desc: 'Catch a legendary during full moon', 
    category: 'SECRET', 
    icon: '🌕', 
    points: 300, 
    rarity: 'epic',
    requirement: { type: 'full_moon_legendary', value: 1 },
    reward: { coins: 2000, item: 'moonstone_lure' },
    hidden: true
  },
  
  // ========== SPECIAL/LIMITED ACHIEVEMENTS ==========
  early_adopter: { 
    id: 'early_adopter', 
    name: 'Early Adopter', 
    desc: 'Play during the launch period', 
    category: 'SPECIAL', 
    icon: '🚀', 
    points: 100, 
    rarity: 'rare',
    requirement: { type: 'special', value: 'early_adopter' },
    reward: { coins: 500, item: 'early_bird_badge' },
    limited: true
  },
  holiday_fisher: { 
    id: 'holiday_fisher', 
    name: 'Holiday Spirit', 
    desc: 'Fish during a holiday event', 
    category: 'SPECIAL', 
    icon: '🎄', 
    points: 75, 
    rarity: 'uncommon',
    requirement: { type: 'special', value: 'holiday_event' },
    reward: { coins: 300, item: 'holiday_lure' },
    limited: true
  },
};

// ==================== RARITY CONFIGURATION ====================
const RARITY_CONFIG = {
  common: { 
    bg: 'from-gray-500 to-gray-600', 
    text: 'text-gray-300', 
    border: 'border-gray-400',
    glow: 'shadow-gray-400/30',
    label: 'Common'
  },
  uncommon: { 
    bg: 'from-green-500 to-emerald-600', 
    text: 'text-green-300', 
    border: 'border-green-400',
    glow: 'shadow-green-400/30',
    label: 'Uncommon'
  },
  rare: { 
    bg: 'from-blue-500 to-indigo-600', 
    text: 'text-blue-300', 
    border: 'border-blue-400',
    glow: 'shadow-blue-400/30',
    label: 'Rare'
  },
  epic: { 
    bg: 'from-purple-500 to-pink-600', 
    text: 'text-purple-300', 
    border: 'border-purple-400',
    glow: 'shadow-purple-400/30',
    label: 'Epic'
  },
  legendary: { 
    bg: 'from-yellow-500 to-orange-600', 
    text: 'text-yellow-300', 
    border: 'border-yellow-400',
    glow: 'shadow-yellow-400/50',
    label: 'Legendary'
  },
};

// ==================== CONFETTI COMPONENT ====================
const Confetti = ({ count = 50 }) => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F59E0B', '#EC4899', '#22C55E'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: colors[i % colors.length],
            animationDelay: `${i * 0.05}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// ==================== ACHIEVEMENT UNLOCK ANIMATION ====================
const AchievementUnlockAnimation = ({ achievement, onComplete }) => {
  const [stage, setStage] = useState(0);
  const rarity = RARITY_CONFIG[achievement?.rarity || 'common'];
  const category = ACHIEVEMENT_CATEGORIES[achievement?.category || 'FISHING'];
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 500),
      setTimeout(() => setStage(3), 1000),
      setTimeout(() => setStage(4), 4000),
      setTimeout(() => onComplete?.(), 4500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);
  
  if (!achievement) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none" data-testid="achievement-unlock-animation">
      {/* Background overlay */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${stage >= 1 ? 'opacity-85' : 'opacity-0'}`} />
      
      {/* Confetti */}
      {stage >= 2 && <Confetti count={60} />}
      
      {/* Radial glow */}
      {stage >= 1 && (
        <div className={`absolute w-[500px] h-[500px] rounded-full bg-gradient-radial ${rarity.bg} opacity-20 animate-pulse`} />
      )}
      
      {/* Main card */}
      <div className={`relative transition-all duration-700 ${
        stage >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      } ${stage >= 4 ? 'scale-75 opacity-0' : ''}`}>
        
        {/* Burst rays */}
        {stage >= 2 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-32 bg-gradient-to-t ${rarity.bg} rounded-full`}
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  animation: 'burstRay 0.6s ease-out forwards',
                  animationDelay: `${i * 0.03}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Card */}
        <div className={`relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 border-4 ${rarity.border} shadow-2xl ${rarity.glow} min-w-[350px] max-w-[450px]`}>
          
          {/* Category badge */}
          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r ${category.color} text-white text-xs font-bold shadow-lg`}>
            {category.icon} {category.name}
          </div>
          
          {/* Header */}
          <div className="text-center mb-6 mt-2">
            <p className={`text-sm uppercase tracking-widest ${rarity.text} mb-2 font-bold`}>
              🏆 Achievement Unlocked!
            </p>
          </div>
          
          {/* Trophy icon */}
          <div className="flex justify-center mb-6">
            <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${rarity.bg} flex items-center justify-center shadow-xl trophy-bounce`}>
              <span className="text-6xl">{achievement.icon}</span>
              <div className="absolute -top-2 -right-2 text-2xl animate-ping">✨</div>
              <div className="absolute -bottom-1 -left-1 text-xl animate-ping" style={{ animationDelay: '0.3s' }}>✨</div>
              <div className="absolute top-0 right-6 text-lg animate-ping" style={{ animationDelay: '0.6s' }}>✨</div>
            </div>
          </div>
          
          {/* Name */}
          <h2 className={`text-2xl font-bold text-center mb-3 ${rarity.text} font-pixel`}>
            {achievement.name}
          </h2>
          
          {/* Description */}
          <p className="text-white/70 text-center text-sm mb-6">
            {achievement.desc}
          </p>
          
          {/* Rewards */}
          <div className="flex justify-center gap-6 bg-black/30 rounded-xl py-3 px-6 mb-4">
            <div className="text-center">
              <span className="text-yellow-400 text-2xl">🪙</span>
              <p className="text-yellow-400 font-bold text-lg">+{achievement.reward?.coins || 0}</p>
            </div>
            <div className="text-center">
              <span className="text-purple-400 text-2xl">⭐</span>
              <p className="text-purple-400 font-bold text-lg">+{achievement.points}</p>
            </div>
            {achievement.reward?.item && (
              <div className="text-center">
                <span className="text-cyan-400 text-2xl">🎁</span>
                <p className="text-cyan-400 font-bold text-sm">Reward!</p>
              </div>
            )}
          </div>
          
          {/* Rarity badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${rarity.bg} text-white text-sm font-bold uppercase tracking-wider shadow-lg`}>
              {rarity.label}
            </span>
          </div>
        </div>
      </div>
      
      {/* CSS */}
      <style>{`
        @keyframes burstRay {
          0% { height: 0; opacity: 1; }
          100% { height: 200px; opacity: 0; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          animation: confettiFall 4s ease-out forwards;
        }
        .trophy-bounce {
          animation: trophyBounce 0.6s ease-out;
        }
        @keyframes trophyBounce {
          0% { transform: scale(0) rotate(-30deg); }
          50% { transform: scale(1.2) rotate(10deg); }
          70% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

// ==================== ACHIEVEMENT PROGRESS CARD ====================
const AchievementProgressCard = ({ achievement, progress, unlocked, onClick }) => {
  const rarity = RARITY_CONFIG[achievement.rarity];
  const category = ACHIEVEMENT_CATEGORIES[achievement.category];
  const progressPercent = Math.min(100, (progress / achievement.requirement.value) * 100);
  
  return (
    <button
      onClick={() => onClick?.(achievement)}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        unlocked
          ? `${rarity.border} bg-gradient-to-br ${rarity.bg}/20 ${rarity.glow} shadow-lg`
          : achievement.hidden && !unlocked
            ? 'border-white/10 bg-white/5 opacity-60'
            : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
      data-testid={`achievement-${achievement.id}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 ${
          unlocked ? `bg-gradient-to-br ${rarity.bg}` : 'bg-gray-800'
        }`}>
          {achievement.hidden && !unlocked ? '❓' : achievement.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-sm ${unlocked ? rarity.text : 'text-white/80'} truncate`}>
              {achievement.hidden && !unlocked ? '???' : achievement.name}
            </h3>
            {unlocked && <span className="text-green-400 text-xs">✓</span>}
            {achievement.limited && <span className="text-xs text-pink-400">⏰</span>}
          </div>
          
          <p className="text-xs text-white/50 mb-2 line-clamp-1">
            {achievement.hidden && !unlocked ? 'Secret achievement' : achievement.desc}
          </p>
          
          {/* Progress bar */}
          {!unlocked && !achievement.hidden && (
            <div className="mb-2">
              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${rarity.bg} transition-all`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">
                {progress}/{achievement.requirement.value}
              </p>
            </div>
          )}
          
          {/* Footer */}
          <div className="flex items-center gap-3 text-xs">
            <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${rarity.bg}/50 ${rarity.text}`}>
              {rarity.label}
            </span>
            <span className="text-yellow-400">+{achievement.points}</span>
            <span className="text-white/30">{category.icon}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

// ==================== ACHIEVEMENT DETAIL MODAL ====================
const AchievementDetailModal = ({ achievement, progress, unlocked, onClose }) => {
  const rarity = RARITY_CONFIG[achievement.rarity];
  const category = ACHIEVEMENT_CATEGORIES[achievement.category];
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div 
        className={`w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 border-2 ${rarity.border} ${rarity.glow} shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`-mt-10 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${rarity.bg} flex items-center justify-center text-4xl shadow-xl`}>
          {achievement.icon}
        </div>
        
        <div className="text-center mt-4">
          <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-xs font-bold mb-2`}>
            {category.icon} {category.name}
          </span>
          <h2 className={`text-2xl font-bold ${rarity.text} font-pixel`}>{achievement.name}</h2>
          <p className="text-white/60 mt-2">{achievement.desc}</p>
        </div>
        
        {/* Progress */}
        <div className="my-6">
          {unlocked ? (
            <div className="text-center py-4 bg-green-900/30 rounded-xl border border-green-500/30">
              <span className="text-4xl">✅</span>
              <p className="text-green-400 font-bold mt-2">Achievement Unlocked!</p>
            </div>
          ) : (
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/50">Progress</span>
                <span className={rarity.text}>{progress}/{achievement.requirement.value}</span>
              </div>
              <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${rarity.bg} transition-all`}
                  style={{ width: `${Math.min(100, (progress / achievement.requirement.value) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Rewards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-yellow-900/20 rounded-xl p-3 text-center border border-yellow-500/30">
            <span className="text-2xl">🪙</span>
            <p className="text-yellow-400 font-bold">{achievement.reward?.coins || 0}</p>
            <p className="text-xs text-white/40">Coins</p>
          </div>
          <div className="bg-purple-900/20 rounded-xl p-3 text-center border border-purple-500/30">
            <span className="text-2xl">⭐</span>
            <p className="text-purple-400 font-bold">{achievement.points}</p>
            <p className="text-xs text-white/40">Points</p>
          </div>
        </div>
        
        {/* Rarity & Close */}
        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-xl bg-gradient-to-r ${rarity.bg} text-white text-sm font-bold uppercase`}>
            {rarity.label}
          </span>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN ACHIEVEMENT LIST COMPONENT ====================
const EnhancedAchievementList = ({ onClose }) => {
  const store = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [sortBy, setSortBy] = useState('category');
  
  // Get unlocked achievements from store or localStorage
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievementProgress, setAchievementProgress] = useState({});
  
  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('gofish_achievements_v2');
    if (saved) {
      const data = JSON.parse(saved);
      setUnlockedAchievements(data.unlocked || []);
      setAchievementProgress(data.progress || {});
    }
    
    // Merge with store achievements
    if (store.achievements) {
      setUnlockedAchievements(prev => [...new Set([...prev, ...store.achievements])]);
    }
  }, [store.achievements]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = unlockedAchievements.length;
    const totalPoints = Object.values(ACHIEVEMENTS).reduce((sum, a) => sum + a.points, 0);
    const earnedPoints = unlockedAchievements.reduce((sum, id) => sum + (ACHIEVEMENTS[id]?.points || 0), 0);
    
    return { total, unlocked, totalPoints, earnedPoints };
  }, [unlockedAchievements]);
  
  // Filter and sort achievements
  const filteredAchievements = useMemo(() => {
    let achievements = Object.values(ACHIEVEMENTS);
    
    if (selectedCategory) {
      achievements = achievements.filter(a => a.category === selectedCategory);
    }
    
    if (sortBy === 'rarity') {
      const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
      achievements.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
    } else if (sortBy === 'points') {
      achievements.sort((a, b) => b.points - a.points);
    } else if (sortBy === 'progress') {
      achievements.sort((a, b) => {
        const progressA = (achievementProgress[a.id] || 0) / a.requirement.value;
        const progressB = (achievementProgress[b.id] || 0) / b.requirement.value;
        return progressB - progressA;
      });
    }
    
    return achievements;
  }, [selectedCategory, sortBy, achievementProgress]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" data-testid="enhanced-achievement-list">
      <div className="w-full max-w-5xl max-h-[95vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden border-2 border-yellow-500/40 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-bounce">🏆</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">ACHIEVEMENTS</h2>
              <p className="text-sm text-yellow-200">Track your fishing legacy</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-white/50">Unlocked</p>
              <p className="text-xl font-bold text-white">{stats.unlocked}/{stats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50">Points</p>
              <p className="text-xl font-bold text-yellow-300">{stats.earnedPoints}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50 transition-all">×</button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="px-6 py-4 bg-black/30 border-b border-white/10 shrink-0">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Overall Progress</span>
            <span className="text-yellow-400">{Math.round((stats.unlocked / stats.total) * 100)}%</span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
              style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="px-4 py-3 border-b border-white/10 overflow-x-auto shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                !selectedCategory ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              📋 All ({stats.total})
            </button>
            {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => {
              const count = Object.values(ACHIEVEMENTS).filter(a => a.category === key).length;
              const unlockedCount = unlockedAchievements.filter(id => ACHIEVEMENTS[id]?.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                    selectedCategory === key 
                      ? `bg-gradient-to-r ${cat.color} text-white` 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.icon} {cat.name}
                  <span className="text-xs opacity-60">{unlockedCount}/{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Sort options */}
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 shrink-0">
          <span className="text-xs text-white/50">Sort:</span>
          {['category', 'rarity', 'points', 'progress'].map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                sortBy === sort ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
        
        {/* Achievement grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAchievements.map(achievement => (
              <AchievementProgressCard
                key={achievement.id}
                achievement={achievement}
                progress={achievementProgress[achievement.id] || 0}
                unlocked={unlockedAchievements.includes(achievement.id)}
                onClick={setSelectedAchievement}
              />
            ))}
          </div>
        </div>
        
        {/* Detail modal */}
        {selectedAchievement && (
          <AchievementDetailModal
            achievement={selectedAchievement}
            progress={achievementProgress[selectedAchievement.id] || 0}
            unlocked={unlockedAchievements.includes(selectedAchievement.id)}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </div>
    </div>
  );
};

// ==================== EXPORTS ====================
export { 
  AchievementUnlockAnimation, 
  EnhancedAchievementList, 
  ACHIEVEMENTS, 
  ACHIEVEMENT_CATEGORIES, 
  RARITY_CONFIG 
};
export default EnhancedAchievementList;
