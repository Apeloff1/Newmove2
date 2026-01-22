import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// SEASONAL EVENTS & RECIPES SYSTEM
// Time-limited events with exclusive recipes and rewards
// ========================================================================

// ==================== SEASON DEFINITIONS ====================
const SEASONS = {
  SPRING: { 
    id: 'spring', 
    name: 'Spring', 
    icon: '🌸', 
    months: [3, 4, 5], // March, April, May
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-900/40 to-rose-900/40',
    theme: 'Cherry Blossom Festival',
    description: 'The waters awaken with new life'
  },
  SUMMER: { 
    id: 'summer', 
    name: 'Summer', 
    icon: '☀️', 
    months: [6, 7, 8],
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-900/40 to-orange-900/40',
    theme: 'Beach Bonanza',
    description: 'Hot days and big catches'
  },
  AUTUMN: { 
    id: 'autumn', 
    name: 'Autumn', 
    icon: '🍂', 
    months: [9, 10, 11],
    color: 'from-orange-500 to-amber-600',
    bgColor: 'from-orange-900/40 to-amber-900/40',
    theme: 'Harvest Moon Festival',
    description: 'Fish gather before winter'
  },
  WINTER: { 
    id: 'winter', 
    name: 'Winter', 
    icon: '❄️', 
    months: [12, 1, 2],
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-900/40 to-blue-900/40',
    theme: 'Frosty Fishing',
    description: 'Brave the cold for rare catches'
  },
};

// ==================== SEASONAL FISH ====================
const SEASONAL_FISH = {
  spring: [
    { id: 'cherry_blossom_koi', name: 'Cherry Blossom Koi', icon: '🌸🐟', rarity: 'rare', points: 500, description: 'Pink-tinted koi found only in spring' },
    { id: 'spring_trout', name: 'Rainbow Trout', icon: '🌈🐟', rarity: 'uncommon', points: 200, description: 'Vibrant spring colors' },
    { id: 'petal_fish', name: 'Petal Fish', icon: '🌷🐠', rarity: 'rare', points: 450, description: 'Swims among fallen petals' },
  ],
  summer: [
    { id: 'sunfish', name: 'Golden Sunfish', icon: '☀️🐟', rarity: 'uncommon', points: 250, description: 'Basking in summer warmth' },
    { id: 'tropical_marlin', name: 'Tropical Marlin', icon: '🏝️🦈', rarity: 'rare', points: 600, description: 'The summer trophy catch' },
    { id: 'coral_beauty', name: 'Coral Beauty', icon: '🪸🐠', rarity: 'rare', points: 400, description: 'Colorful reef dweller' },
  ],
  autumn: [
    { id: 'maple_salmon', name: 'Maple Salmon', icon: '🍁🐟', rarity: 'rare', points: 550, description: 'Upstream migration season' },
    { id: 'harvest_carp', name: 'Harvest Carp', icon: '🎃🐟', rarity: 'uncommon', points: 200, description: 'Fattened for winter' },
    { id: 'moon_bass', name: 'Harvest Moon Bass', icon: '🌕🐟', rarity: 'epic', points: 800, description: 'Only appears under the harvest moon' },
  ],
  winter: [
    { id: 'ice_fish', name: 'Crystal Ice Fish', icon: '🧊🐟', rarity: 'rare', points: 500, description: 'Transparent winter beauty' },
    { id: 'snow_crab', name: 'Snow King Crab', icon: '❄️🦀', rarity: 'epic', points: 750, description: 'Premium winter delicacy' },
    { id: 'frost_pike', name: 'Frost Pike', icon: '🥶🦈', rarity: 'rare', points: 600, description: 'Thrives in icy waters' },
  ],
};

// ==================== SEASONAL RECIPES ====================
const SEASONAL_RECIPES = {
  spring: [
    {
      id: 'sakura_sashimi',
      name: 'Sakura Sashimi',
      icon: '🌸🍣',
      tier: 3,
      rarity: 'rare',
      description: 'Delicate spring platter with cherry blossom garnish',
      ingredients: [
        { id: 'cherry_blossom_koi', amount: 1, special: true },
        { id: 'rice', amount: 2 },
        { id: 'wasabi', amount: 1 },
      ],
      reward: { points: 1500, xp: 300 },
      seasonal: true,
    },
    {
      id: 'spring_awakening',
      name: 'Spring Awakening Soup',
      icon: '🌱🥣',
      tier: 2,
      rarity: 'uncommon',
      description: 'Light and refreshing seasonal broth',
      ingredients: [
        { id: 'spring_trout', amount: 1, special: true },
        { id: 'herbs', amount: 2 },
        { id: 'lemon', amount: 1 },
      ],
      reward: { points: 600, xp: 120 },
      seasonal: true,
    },
    {
      id: 'petal_parfait',
      name: 'Petal Fish Parfait',
      icon: '🌷✨',
      tier: 3,
      rarity: 'rare',
      description: 'Elegant spring celebration dish',
      ingredients: [
        { id: 'petal_fish', amount: 1, special: true },
        { id: 'butter', amount: 2 },
        { id: 'herbs', amount: 2 },
      ],
      reward: { points: 1200, xp: 240 },
      seasonal: true,
    },
  ],
  summer: [
    {
      id: 'beach_bbq',
      name: 'Beach BBQ Platter',
      icon: '🏖️🍖',
      tier: 3,
      rarity: 'rare',
      description: 'Summer grilling at its finest',
      ingredients: [
        { id: 'tropical_marlin', amount: 1, special: true },
        { id: 'lemon', amount: 2 },
        { id: 'garlic', amount: 2 },
      ],
      reward: { points: 1800, xp: 360 },
      seasonal: true,
    },
    {
      id: 'sunshine_ceviche',
      name: 'Sunshine Ceviche',
      icon: '☀️🥗',
      tier: 2,
      rarity: 'uncommon',
      description: 'Citrus-cured summer delight',
      ingredients: [
        { id: 'sunfish', amount: 1, special: true },
        { id: 'lemon', amount: 3 },
        { id: 'herbs', amount: 1 },
      ],
      reward: { points: 700, xp: 140 },
      seasonal: true,
    },
    {
      id: 'coral_feast',
      name: 'Coral Reef Feast',
      icon: '🪸🍽️',
      tier: 3,
      rarity: 'rare',
      description: 'Tropical underwater flavors',
      ingredients: [
        { id: 'coral_beauty', amount: 1, special: true },
        { id: 'seaweed', amount: 2 },
        { id: 'rice', amount: 2 },
      ],
      reward: { points: 1100, xp: 220 },
      seasonal: true,
    },
  ],
  autumn: [
    {
      id: 'harvest_feast',
      name: 'Harvest Moon Feast',
      icon: '🌕🍽️',
      tier: 4,
      rarity: 'epic',
      description: 'The ultimate autumn celebration',
      ingredients: [
        { id: 'moon_bass', amount: 1, special: true },
        { id: 'maple_salmon', amount: 1, special: true },
        { id: 'herbs', amount: 3 },
        { id: 'butter', amount: 2 },
      ],
      reward: { points: 3000, xp: 600 },
      seasonal: true,
    },
    {
      id: 'maple_glazed_salmon',
      name: 'Maple Glazed Salmon',
      icon: '🍁🍣',
      tier: 3,
      rarity: 'rare',
      description: 'Sweet autumn classic',
      ingredients: [
        { id: 'maple_salmon', amount: 1, special: true },
        { id: 'butter', amount: 2 },
        { id: 'herbs', amount: 1 },
      ],
      reward: { points: 1400, xp: 280 },
      seasonal: true,
    },
    {
      id: 'pumpkin_carp_stew',
      name: 'Pumpkin Carp Stew',
      icon: '🎃🍲',
      tier: 2,
      rarity: 'uncommon',
      description: 'Hearty autumn comfort food',
      ingredients: [
        { id: 'harvest_carp', amount: 2, special: true },
        { id: 'garlic', amount: 2 },
        { id: 'herbs', amount: 2 },
      ],
      reward: { points: 800, xp: 160 },
      seasonal: true,
    },
  ],
  winter: [
    {
      id: 'winter_wonderland',
      name: 'Winter Wonderland Platter',
      icon: '❄️🍽️',
      tier: 4,
      rarity: 'epic',
      description: 'A frosty masterpiece',
      ingredients: [
        { id: 'ice_fish', amount: 1, special: true },
        { id: 'snow_crab', amount: 1, special: true },
        { id: 'butter', amount: 3 },
        { id: 'herbs', amount: 2 },
      ],
      reward: { points: 3500, xp: 700 },
      seasonal: true,
    },
    {
      id: 'ice_crystal_sashimi',
      name: 'Ice Crystal Sashimi',
      icon: '🧊🍣',
      tier: 3,
      rarity: 'rare',
      description: 'Frozen perfection',
      ingredients: [
        { id: 'ice_fish', amount: 1, special: true },
        { id: 'wasabi', amount: 1 },
        { id: 'soy_sauce', amount: 1 },
      ],
      reward: { points: 1300, xp: 260 },
      seasonal: true,
    },
    {
      id: 'snow_crab_feast',
      name: 'Snow Crab Royal Feast',
      icon: '🦀👑',
      tier: 3,
      rarity: 'rare',
      description: 'Premium winter indulgence',
      ingredients: [
        { id: 'snow_crab', amount: 1, special: true },
        { id: 'butter', amount: 3 },
        { id: 'lemon', amount: 2 },
      ],
      reward: { points: 2000, xp: 400 },
      seasonal: true,
    },
    {
      id: 'frost_pike_soup',
      name: 'Frost Pike Chowder',
      icon: '🥶🥣',
      tier: 2,
      rarity: 'uncommon',
      description: 'Warming winter soup',
      ingredients: [
        { id: 'frost_pike', amount: 1, special: true },
        { id: 'butter', amount: 2 },
        { id: 'garlic', amount: 1 },
      ],
      reward: { points: 900, xp: 180 },
      seasonal: true,
    },
  ],
};

// ==================== SEASONAL EVENTS ====================
const SEASONAL_EVENTS = {
  spring_festival: {
    id: 'spring_festival',
    name: 'Cherry Blossom Festival',
    season: 'spring',
    icon: '🌸',
    description: 'Catch cherry-themed fish and earn exclusive rewards',
    bonuses: { rareChance: 0.15, xpBonus: 0.25, specialFishChance: 0.1 },
    rewards: [
      { type: 'title', id: 'spring_champion', name: 'Spring Champion' },
      { type: 'recipe', id: 'sakura_special', name: 'Sakura Special' },
      { type: 'badge', id: 'cherry_blossom', name: 'Cherry Blossom Badge' },
    ],
    milestones: [
      { catches: 25, reward: { points: 1000 } },
      { catches: 50, reward: { points: 2500, item: 'spring_lure' } },
      { catches: 100, reward: { points: 5000, title: 'spring_champion' } },
    ],
  },
  summer_splash: {
    id: 'summer_splash',
    name: 'Beach Bonanza',
    season: 'summer',
    icon: '🏖️',
    description: 'Summer fishing competition with tropical prizes',
    bonuses: { rareChance: 0.1, pointsBonus: 0.2, doubleCatch: 0.05 },
    rewards: [
      { type: 'title', id: 'summer_king', name: 'Summer King' },
      { type: 'recipe', id: 'tropical_special', name: 'Tropical Special' },
      { type: 'badge', id: 'beach_master', name: 'Beach Master Badge' },
    ],
    milestones: [
      { catches: 30, reward: { points: 1500 } },
      { catches: 75, reward: { points: 3500, item: 'tropical_lure' } },
      { catches: 150, reward: { points: 7500, title: 'summer_king' } },
    ],
  },
  harvest_moon: {
    id: 'harvest_moon',
    name: 'Harvest Moon Festival',
    season: 'autumn',
    icon: '🌕',
    description: 'Fish under the harvest moon for legendary catches',
    bonuses: { legendaryChance: 0.03, epicChance: 0.08, nightBonus: 0.5 },
    rewards: [
      { type: 'title', id: 'harvest_lord', name: 'Harvest Lord' },
      { type: 'recipe', id: 'harvest_special', name: 'Harvest Special' },
      { type: 'badge', id: 'moon_fisher', name: 'Moon Fisher Badge' },
    ],
    milestones: [
      { catches: 20, reward: { points: 2000 } },
      { catches: 50, reward: { points: 5000, item: 'moon_lure' } },
      { catches: 100, reward: { points: 10000, title: 'harvest_lord' } },
    ],
  },
  winter_frost: {
    id: 'winter_frost',
    name: 'Frosty Fishing Festival',
    season: 'winter',
    icon: '❄️',
    description: 'Brave the cold for exclusive winter rewards',
    bonuses: { epicChance: 0.1, ingredientBonus: 0.3, comboBonus: 0.2 },
    rewards: [
      { type: 'title', id: 'ice_master', name: 'Ice Master' },
      { type: 'recipe', id: 'winter_special', name: 'Winter Special' },
      { type: 'badge', id: 'frost_angler', name: 'Frost Angler Badge' },
    ],
    milestones: [
      { catches: 25, reward: { points: 1500 } },
      { catches: 60, reward: { points: 4000, item: 'frost_lure' } },
      { catches: 120, reward: { points: 8000, title: 'ice_master' } },
    ],
  },
};

// ==================== RARITY STYLES ====================
const RARITY_STYLES = {
  common: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-200', border: 'border-gray-400' },
  uncommon: { bg: 'from-green-500 to-emerald-600', text: 'text-green-200', border: 'border-green-400' },
  rare: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-200', border: 'border-blue-400' },
  epic: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-200', border: 'border-purple-400' },
  legendary: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-200', border: 'border-yellow-400' },
};

// ==================== UTILITY FUNCTIONS ====================
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  for (const [key, season] of Object.entries(SEASONS)) {
    if (season.months.includes(month)) {
      return { key, ...season };
    }
  }
  return { key: 'SPRING', ...SEASONS.SPRING };
};

const getSeasonalEvent = () => {
  const season = getCurrentSeason();
  return Object.values(SEASONAL_EVENTS).find(e => e.season === season.id);
};

// ==================== SEASONAL RECIPE CARD ====================
const SeasonalRecipeCard = ({ recipe, season, canCook, onCook }) => {
  const style = RARITY_STYLES[recipe.rarity];
  const seasonStyle = SEASONS[season.toUpperCase()];
  
  return (
    <div className={`
      p-4 rounded-xl border-2 ${style.border}/50
      bg-gradient-to-br ${style.bg}/20
      transition-all hover:scale-[1.02]
    `}>
      <div className="flex items-start gap-3">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-3xl shrink-0`}>
          {recipe.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold ${style.text}`}>{recipe.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${seasonStyle.color} text-white`}>
              {seasonStyle.icon} {seasonStyle.name}
            </span>
          </div>
          <p className="text-xs text-white/50 mb-2">{recipe.description}</p>
          
          {/* Ingredients */}
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.ingredients.map((ing, i) => (
              <span 
                key={i}
                className={`text-xs px-2 py-0.5 rounded-lg ${
                  ing.special ? 'bg-yellow-900/50 text-yellow-400' : 'bg-white/10 text-white/70'
                }`}
              >
                {ing.special && '⭐ '}{ing.id.replace(/_/g, ' ')} ×{ing.amount}
              </span>
            ))}
          </div>
          
          {/* Rewards */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-yellow-400">+{recipe.reward.points} pts</span>
            <span className="text-cyan-400">+{recipe.reward.xp} XP</span>
            <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${style.bg} text-white capitalize`}>
              {recipe.rarity}
            </span>
          </div>
        </div>
      </div>
      
      {/* Cook button */}
      <button
        onClick={() => onCook?.(recipe)}
        disabled={!canCook}
        className={`w-full mt-3 py-2 rounded-xl font-bold text-sm transition-all ${
          canCook
            ? `bg-gradient-to-r ${seasonStyle.color} text-white hover:opacity-90`
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canCook ? '🍳 Cook' : '🔒 Missing Ingredients'}
      </button>
    </div>
  );
};

// ==================== SEASONAL EVENT BANNER ====================
const SeasonalEventBanner = ({ event, season, progress, onViewEvent }) => {
  const seasonStyle = SEASONS[season.toUpperCase()];
  const currentMilestone = event.milestones.find(m => progress < m.catches) || event.milestones[event.milestones.length - 1];
  const progressPercent = currentMilestone ? Math.min(100, (progress / currentMilestone.catches) * 100) : 100;
  
  return (
    <div className={`
      p-5 rounded-2xl border-2 ${seasonStyle.color.replace('from-', 'border-').split(' ')[0]}/50
      bg-gradient-to-br ${seasonStyle.bgColor}
      cursor-pointer hover:scale-[1.01] transition-all
    `}
    onClick={onViewEvent}
    >
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${seasonStyle.color} flex items-center justify-center text-4xl animate-bounce`}>
          {event.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">{event.name}</h3>
            <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full animate-pulse">ACTIVE</span>
          </div>
          <p className="text-sm text-white/70">{event.description}</p>
          
          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">Event Progress</span>
              <span className="text-white">{progress}/{currentMilestone?.catches || 'MAX'}</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${seasonStyle.color} transition-all`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Bonuses */}
        <div className="text-right">
          <p className="text-xs text-white/50 mb-1">Active Bonuses</p>
          <div className="space-y-1">
            {event.bonuses.rareChance && (
              <span className="text-xs text-blue-400 block">+{event.bonuses.rareChance * 100}% Rare</span>
            )}
            {event.bonuses.xpBonus && (
              <span className="text-xs text-green-400 block">+{event.bonuses.xpBonus * 100}% XP</span>
            )}
            {event.bonuses.pointsBonus && (
              <span className="text-xs text-yellow-400 block">+{event.bonuses.pointsBonus * 100}% Points</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== SEASONAL EVENTS PANEL ====================
const SeasonalEventsPanel = ({ onClose }) => {
  const store = useGameStore();
  const [selectedTab, setSelectedTab] = useState('event');
  const [eventProgress, setEventProgress] = useState(0);
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  
  const currentSeason = getCurrentSeason();
  const currentEvent = getSeasonalEvent();
  const seasonFish = SEASONAL_FISH[currentSeason.id] || [];
  const seasonRecipes = SEASONAL_RECIPES[currentSeason.id] || [];
  
  // Load event progress
  useEffect(() => {
    const saved = localStorage.getItem('gofish_seasonal_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setEventProgress(data.progress || 0);
      setClaimedMilestones(data.claimed || []);
    }
  }, []);
  
  // Claim milestone
  const handleClaimMilestone = useCallback((milestone, index) => {
    if (claimedMilestones.includes(index)) return;
    
    store.addScore(milestone.reward.points);
    const newClaimed = [...claimedMilestones, index];
    setClaimedMilestones(newClaimed);
    
    localStorage.setItem('gofish_seasonal_progress', JSON.stringify({
      progress: eventProgress,
      claimed: newClaimed,
    }));
  }, [claimedMilestones, eventProgress, store]);
  
  const tabs = [
    { id: 'event', name: 'Event', icon: '🎉' },
    { id: 'fish', name: 'Seasonal Fish', icon: '🐟' },
    { id: 'recipes', name: 'Recipes', icon: '📜' },
    { id: 'rewards', name: 'Rewards', icon: '🎁' },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" data-testid="seasonal-events">
      <div className={`w-full max-w-5xl max-h-[95vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden border-2 border-opacity-50 flex flex-col`}
        style={{ borderColor: currentSeason.color.includes('pink') ? '#ec4899' : currentSeason.color.includes('yellow') ? '#eab308' : currentSeason.color.includes('orange') ? '#f97316' : '#06b6d4' }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentSeason.color} p-5 flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl animate-bounce">{currentSeason.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">{currentSeason.theme.toUpperCase()}</h2>
              <p className="text-sm text-white/80">{currentSeason.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center bg-black/20 rounded-xl px-4 py-2">
              <p className="text-xs text-white/60">Season</p>
              <p className="text-xl font-bold text-white">{currentSeason.name}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50">×</button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4 py-3 border-b border-white/10 flex gap-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                selectedTab === tab.id
                  ? `bg-gradient-to-r ${currentSeason.color} text-white`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* Event Tab */}
          {selectedTab === 'event' && currentEvent && (
            <div className="space-y-6">
              {/* Event banner */}
              <SeasonalEventBanner 
                event={currentEvent}
                season={currentSeason.id}
                progress={eventProgress}
                onViewEvent={() => {}}
              />
              
              {/* Milestones */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">🎯 Event Milestones</h3>
                <div className="space-y-3">
                  {currentEvent.milestones.map((milestone, i) => {
                    const isComplete = eventProgress >= milestone.catches;
                    const isClaimed = claimedMilestones.includes(i);
                    
                    return (
                      <div 
                        key={i}
                        className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                          isClaimed 
                            ? 'border-green-500/50 bg-green-900/20' 
                            : isComplete 
                              ? 'border-yellow-400 bg-yellow-900/20' 
                              : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${
                            isClaimed ? 'bg-green-600' : isComplete ? 'bg-yellow-500' : 'bg-white/10'
                          } flex items-center justify-center text-2xl`}>
                            {isClaimed ? '✓' : isComplete ? '🎁' : '🎯'}
                          </div>
                          <div>
                            <p className={`font-bold ${isClaimed ? 'text-green-400' : isComplete ? 'text-yellow-400' : 'text-white'}`}>
                              {milestone.catches} Catches
                            </p>
                            <p className="text-xs text-white/50">
                              +{milestone.reward.points} points
                              {milestone.reward.item && ` + ${milestone.reward.item}`}
                              {milestone.reward.title && ` + Title`}
                            </p>
                          </div>
                        </div>
                        
                        {isComplete && !isClaimed && (
                          <button
                            onClick={() => handleClaimMilestone(milestone, i)}
                            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400"
                          >
                            Claim!
                          </button>
                        )}
                        {isClaimed && (
                          <span className="text-green-400 font-bold">Claimed!</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {/* Fish Tab */}
          {selectedTab === 'fish' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">🐟 {currentSeason.name} Seasonal Fish</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {seasonFish.map(fish => {
                  const style = RARITY_STYLES[fish.rarity];
                  return (
                    <div 
                      key={fish.id}
                      className={`p-4 rounded-xl border-2 ${style.border}/50 bg-gradient-to-br ${style.bg}/20`}
                    >
                      <div className="text-center">
                        <span className="text-5xl">{fish.icon}</span>
                        <h4 className={`font-bold ${style.text} mt-2`}>{fish.name}</h4>
                        <p className="text-xs text-white/50 mb-2">{fish.description}</p>
                        <div className="flex justify-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${style.bg} text-white capitalize`}>
                            {fish.rarity}
                          </span>
                          <span className="text-xs text-yellow-400">+{fish.points} pts</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Recipes Tab */}
          {selectedTab === 'recipes' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">📜 {currentSeason.name} Seasonal Recipes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seasonRecipes.map(recipe => (
                  <SeasonalRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    season={currentSeason.id}
                    canCook={false}
                    onCook={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Rewards Tab */}
          {selectedTab === 'rewards' && currentEvent && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">🎁 Event Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentEvent.rewards.map((reward, i) => (
                  <div 
                    key={i}
                    className={`p-5 rounded-xl border-2 border-yellow-500/50 bg-yellow-900/20 text-center`}
                  >
                    <span className="text-5xl">{
                      reward.type === 'title' ? '🏅' : reward.type === 'recipe' ? '📜' : '🎖️'
                    }</span>
                    <h4 className="font-bold text-yellow-400 mt-2">{reward.name}</h4>
                    <p className="text-xs text-white/50 capitalize">{reward.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { 
  SeasonalEventsPanel, 
  SeasonalEventBanner, 
  getCurrentSeason, 
  getSeasonalEvent,
  SEASONS,
  SEASONAL_FISH,
  SEASONAL_RECIPES,
  SEASONAL_EVENTS 
};
export default SeasonalEventsPanel;
