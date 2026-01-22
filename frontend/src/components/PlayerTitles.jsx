import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// PLAYER TITLES & BADGES SYSTEM
// Earnable titles from achievements with display customization
// ========================================================================

// ==================== TITLE CATEGORIES ====================
const TITLE_CATEGORIES = {
  FISHING: { id: 'fishing', name: 'Fishing', icon: '🎣', color: 'from-blue-500 to-cyan-500' },
  COLLECTION: { id: 'collection', name: 'Collection', icon: '📚', color: 'from-green-500 to-emerald-500' },
  SKILL: { id: 'skill', name: 'Skill', icon: '⭐', color: 'from-yellow-500 to-amber-500' },
  COOKING: { id: 'cooking', name: 'Cooking', icon: '🍳', color: 'from-orange-500 to-red-500' },
  EXPLORATION: { id: 'exploration', name: 'Exploration', icon: '🗺️', color: 'from-cyan-500 to-teal-500' },
  LEGENDARY: { id: 'legendary', name: 'Legendary', icon: '👑', color: 'from-yellow-400 to-orange-500' },
  SPECIAL: { id: 'special', name: 'Special', icon: '✨', color: 'from-pink-500 to-purple-500' },
};

// ==================== COMPLETE TITLES DATABASE ====================
const PLAYER_TITLES = {
  // ========== FISHING TITLES ==========
  novice_angler: {
    id: 'novice_angler',
    name: 'Novice Angler',
    category: 'FISHING',
    rarity: 'common',
    icon: '🎣',
    description: 'Just starting your journey',
    requirement: { type: 'catches', value: 1 },
    prefix: '',
    suffix: 'the Novice',
  },
  dedicated_fisher: {
    id: 'dedicated_fisher',
    name: 'Dedicated Fisher',
    category: 'FISHING',
    rarity: 'common',
    icon: '🐟',
    description: '50 fish caught',
    requirement: { type: 'catches', value: 50 },
    prefix: '',
    suffix: 'the Dedicated',
  },
  seasoned_angler: {
    id: 'seasoned_angler',
    name: 'Seasoned Angler',
    category: 'FISHING',
    rarity: 'uncommon',
    icon: '🏅',
    description: '200 fish caught',
    requirement: { type: 'catches', value: 200 },
    prefix: '',
    suffix: 'the Seasoned',
  },
  master_angler: {
    id: 'master_angler',
    name: 'Master Angler',
    category: 'FISHING',
    rarity: 'rare',
    icon: '🏆',
    description: '500 fish caught',
    requirement: { type: 'catches', value: 500 },
    prefix: 'Master',
    suffix: '',
  },
  legendary_fisher: {
    id: 'legendary_fisher',
    name: 'Legendary Fisher',
    category: 'FISHING',
    rarity: 'epic',
    icon: '👑',
    description: '1000 fish caught',
    requirement: { type: 'catches', value: 1000 },
    prefix: 'Legendary',
    suffix: '',
  },
  fishing_god: {
    id: 'fishing_god',
    name: 'Fishing God',
    category: 'LEGENDARY',
    rarity: 'legendary',
    icon: '🌟',
    description: '5000 fish caught',
    requirement: { type: 'catches', value: 5000 },
    prefix: '',
    suffix: 'the Fishing God',
  },
  
  // ========== SKILL TITLES ==========
  precision_caster: {
    id: 'precision_caster',
    name: 'Precision Caster',
    category: 'SKILL',
    rarity: 'uncommon',
    icon: '🎯',
    description: '25 perfect catches',
    requirement: { type: 'perfect', value: 25 },
    prefix: 'Precise',
    suffix: '',
  },
  flawless_fisher: {
    id: 'flawless_fisher',
    name: 'Flawless Fisher',
    category: 'SKILL',
    rarity: 'rare',
    icon: '💎',
    description: '100 perfect catches',
    requirement: { type: 'perfect', value: 100 },
    prefix: 'Flawless',
    suffix: '',
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'The Perfectionist',
    category: 'SKILL',
    rarity: 'epic',
    icon: '✨',
    description: '500 perfect catches',
    requirement: { type: 'perfect', value: 500 },
    prefix: '',
    suffix: 'the Perfectionist',
  },
  combo_starter: {
    id: 'combo_starter',
    name: 'Combo Starter',
    category: 'SKILL',
    rarity: 'uncommon',
    icon: '🔥',
    description: 'Reach 10x combo',
    requirement: { type: 'combo', value: 10 },
    prefix: '',
    suffix: 'of the Flame',
  },
  combo_master: {
    id: 'combo_master',
    name: 'Combo Master',
    category: 'SKILL',
    rarity: 'rare',
    icon: '⚡',
    description: 'Reach 25x combo',
    requirement: { type: 'combo', value: 25 },
    prefix: 'Combo',
    suffix: '',
  },
  combo_god: {
    id: 'combo_god',
    name: 'Combo God',
    category: 'LEGENDARY',
    rarity: 'legendary',
    icon: '💥',
    description: 'Reach 50x combo',
    requirement: { type: 'combo', value: 50 },
    prefix: '',
    suffix: 'the Unstoppable',
  },
  
  // ========== COLLECTION TITLES ==========
  fish_collector: {
    id: 'fish_collector',
    name: 'Fish Collector',
    category: 'COLLECTION',
    rarity: 'common',
    icon: '📚',
    description: 'Catch 10 species',
    requirement: { type: 'species', value: 10 },
    prefix: '',
    suffix: 'the Collector',
  },
  ichthyologist: {
    id: 'ichthyologist',
    name: 'Ichthyologist',
    category: 'COLLECTION',
    rarity: 'rare',
    icon: '🔬',
    description: 'Catch 25 species',
    requirement: { type: 'species', value: 25 },
    prefix: 'Dr.',
    suffix: '',
  },
  master_collector: {
    id: 'master_collector',
    name: 'Master Collector',
    category: 'COLLECTION',
    rarity: 'epic',
    icon: '🏛️',
    description: 'Catch all species',
    requirement: { type: 'species', value: 50 },
    prefix: '',
    suffix: 'the Encyclopedic',
  },
  rare_finder: {
    id: 'rare_finder',
    name: 'Rare Finder',
    category: 'COLLECTION',
    rarity: 'rare',
    icon: '💙',
    description: 'Catch 25 rare fish',
    requirement: { type: 'rare_count', value: 25 },
    prefix: '',
    suffix: 'of the Deep',
  },
  epic_hunter: {
    id: 'epic_hunter',
    name: 'Epic Hunter',
    category: 'COLLECTION',
    rarity: 'epic',
    icon: '💜',
    description: 'Catch 10 epic fish',
    requirement: { type: 'epic_count', value: 10 },
    prefix: 'Epic',
    suffix: '',
  },
  legend_seeker: {
    id: 'legend_seeker',
    name: 'Legend Seeker',
    category: 'LEGENDARY',
    rarity: 'legendary',
    icon: '👑',
    description: 'Catch 5 legendary fish',
    requirement: { type: 'legendary_count', value: 5 },
    prefix: '',
    suffix: 'the Legend Seeker',
  },
  
  // ========== COOKING TITLES ==========
  home_cook: {
    id: 'home_cook',
    name: 'Home Cook',
    category: 'COOKING',
    rarity: 'common',
    icon: '🍳',
    description: 'Cook 10 dishes',
    requirement: { type: 'dishes', value: 10 },
    prefix: '',
    suffix: 'the Cook',
  },
  sous_chef: {
    id: 'sous_chef',
    name: 'Sous Chef',
    category: 'COOKING',
    rarity: 'uncommon',
    icon: '👨‍🍳',
    description: 'Cook 50 dishes',
    requirement: { type: 'dishes', value: 50 },
    prefix: 'Chef',
    suffix: '',
  },
  executive_chef: {
    id: 'executive_chef',
    name: 'Executive Chef',
    category: 'COOKING',
    rarity: 'rare',
    icon: '⭐',
    description: 'Cook 200 dishes',
    requirement: { type: 'dishes', value: 200 },
    prefix: 'Executive Chef',
    suffix: '',
  },
  master_chef: {
    id: 'master_chef',
    name: 'Master Chef',
    category: 'COOKING',
    rarity: 'epic',
    icon: '👑',
    description: 'Cook 500 dishes',
    requirement: { type: 'dishes', value: 500 },
    prefix: 'Master Chef',
    suffix: '',
  },
  culinary_legend: {
    id: 'culinary_legend',
    name: 'Culinary Legend',
    category: 'LEGENDARY',
    rarity: 'legendary',
    icon: '🌟',
    description: 'Cook all legendary recipes',
    requirement: { type: 'legendary_dishes', value: 5 },
    prefix: '',
    suffix: 'the Culinary Legend',
  },
  
  // ========== EXPLORATION TITLES ==========
  wanderer: {
    id: 'wanderer',
    name: 'Wanderer',
    category: 'EXPLORATION',
    rarity: 'common',
    icon: '🧭',
    description: 'Visit 2 locations',
    requirement: { type: 'locations', value: 2 },
    prefix: '',
    suffix: 'the Wanderer',
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    category: 'EXPLORATION',
    rarity: 'uncommon',
    icon: '🗺️',
    description: 'Visit all locations',
    requirement: { type: 'locations', value: 4 },
    prefix: '',
    suffix: 'the Explorer',
  },
  night_fisher: {
    id: 'night_fisher',
    name: 'Night Fisher',
    category: 'EXPLORATION',
    rarity: 'uncommon',
    icon: '🌙',
    description: '50 night catches',
    requirement: { type: 'night_catches', value: 50 },
    prefix: '',
    suffix: 'of the Night',
  },
  storm_chaser: {
    id: 'storm_chaser',
    name: 'Storm Chaser',
    category: 'EXPLORATION',
    rarity: 'rare',
    icon: '⛈️',
    description: '25 storm catches',
    requirement: { type: 'storm_catches', value: 25 },
    prefix: '',
    suffix: 'Stormborn',
  },
  deep_diver: {
    id: 'deep_diver',
    name: 'Deep Diver',
    category: 'EXPLORATION',
    rarity: 'rare',
    icon: '🤿',
    description: 'Catch deep sea fish',
    requirement: { type: 'deep_sea_catches', value: 10 },
    prefix: '',
    suffix: 'of the Depths',
  },
  
  // ========== SPECIAL TITLES ==========
  early_adopter: {
    id: 'early_adopter',
    name: 'Early Adopter',
    category: 'SPECIAL',
    rarity: 'rare',
    icon: '🚀',
    description: 'Played during launch',
    requirement: { type: 'special', value: 'early_adopter' },
    prefix: '',
    suffix: '[Early Adopter]',
  },
  golden_master: {
    id: 'golden_master',
    name: 'Golden Master',
    category: 'LEGENDARY',
    rarity: 'legendary',
    icon: '✨',
    description: 'Catch the Golden Koi',
    requirement: { type: 'special_fish', value: 'golden_koi' },
    prefix: 'Golden',
    suffix: '',
  },
  season_champion: {
    id: 'season_champion',
    name: 'Season Champion',
    category: 'SPECIAL',
    rarity: 'epic',
    icon: '🏆',
    description: 'Win a seasonal event',
    requirement: { type: 'event', value: 'season_win' },
    prefix: 'Champion',
    suffix: '',
  },
  millionaire: {
    id: 'millionaire',
    name: 'Millionaire',
    category: 'SPECIAL',
    rarity: 'epic',
    icon: '💰',
    description: 'Earn 1,000,000 points',
    requirement: { type: 'total_score', value: 1000000 },
    prefix: '',
    suffix: 'the Rich',
  },
  ultimate_legend: {
    id: 'ultimate_legend',
    name: 'Ultimate Legend',
    category: 'LEGENDARY',
    rarity: 'legendary',
    icon: '🌟',
    description: 'Unlock all other titles',
    requirement: { type: 'titles', value: 30 },
    prefix: '',
    suffix: 'the Ultimate Legend',
  },
};

// ==================== RARITY STYLES ====================
const RARITY_STYLES = {
  common: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-200', border: 'border-gray-400', glow: '' },
  uncommon: { bg: 'from-green-500 to-emerald-600', text: 'text-green-200', border: 'border-green-400', glow: '' },
  rare: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-200', border: 'border-blue-400', glow: 'shadow-blue-500/30' },
  epic: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-200', border: 'border-purple-400', glow: 'shadow-purple-500/30' },
  legendary: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-200', border: 'border-yellow-300', glow: 'shadow-yellow-500/50 animate-pulse' },
};

// ==================== TITLE CARD COMPONENT ====================
const TitleCard = ({ title, isUnlocked, isEquipped, onEquip, progress }) => {
  const style = RARITY_STYLES[title.rarity];
  const category = TITLE_CATEGORIES[title.category];
  const progressPercent = progress ? Math.min(100, (progress / title.requirement.value) * 100) : 0;
  
  return (
    <div className={`
      p-4 rounded-xl border-2 transition-all cursor-pointer
      ${isEquipped 
        ? `border-yellow-400 bg-yellow-900/30 ring-2 ring-yellow-400 ${style.glow}` 
        : isUnlocked 
          ? `${style.border}/50 bg-gradient-to-br ${style.bg}/20 hover:scale-[1.02]` 
          : 'border-white/10 bg-white/5 opacity-60'}
    `}
    onClick={() => isUnlocked && onEquip?.(title.id)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl ${
          isUnlocked ? `bg-gradient-to-br ${style.bg}` : 'bg-gray-700'
        } flex items-center justify-center text-3xl shrink-0`}>
          {isUnlocked ? title.icon : '🔒'}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold ${isUnlocked ? style.text : 'text-gray-500'}`}>
              {title.name}
            </h4>
            {isEquipped && <span className="text-yellow-400 text-xs">✓ Equipped</span>}
          </div>
          
          <p className="text-xs text-white/50 mb-2">{title.description}</p>
          
          {/* Display format */}
          {isUnlocked && (
            <div className="bg-black/30 rounded-lg px-3 py-1.5 inline-block">
              <span className="text-xs text-white/70">
                {title.prefix && <span className="text-cyan-400">{title.prefix} </span>}
                <span className="text-white">PlayerName</span>
                {title.suffix && <span className="text-cyan-400"> {title.suffix}</span>}
              </span>
            </div>
          )}
          
          {/* Progress bar for locked titles */}
          {!isUnlocked && progress !== undefined && (
            <div className="mt-2">
              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">
                {progress}/{title.requirement.value}
              </p>
            </div>
          )}
          
          {/* Category & Rarity */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${category.color} text-white`}>
              {category.icon} {category.name}
            </span>
            <span className={`text-xs ${style.text} capitalize`}>{title.rarity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== TITLE DISPLAY BADGE ====================
const TitleBadge = ({ title, playerName, size = 'medium' }) => {
  if (!title) return null;
  
  const style = RARITY_STYLES[title.rarity];
  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-3 py-1.5',
    large: 'text-lg px-4 py-2',
  };
  
  return (
    <div className={`
      inline-flex items-center gap-2 rounded-xl
      bg-gradient-to-r ${style.bg}/30 border ${style.border}/50
      ${sizeClasses[size]} ${style.glow}
    `}>
      <span>{title.icon}</span>
      <span className={style.text}>
        {title.prefix && <span>{title.prefix} </span>}
        <span className="font-bold text-white">{playerName}</span>
        {title.suffix && <span> {title.suffix}</span>}
      </span>
    </div>
  );
};

// ==================== TITLE MANAGER HOOK ====================
const useTitleManager = () => {
  const store = useGameStore();
  const [unlockedTitles, setUnlockedTitles] = useState([]);
  const [equippedTitle, setEquippedTitle] = useState(null);
  const [titleProgress, setTitleProgress] = useState({});
  
  // Load saved data
  useEffect(() => {
    const savedUnlocked = localStorage.getItem('gofish_unlocked_titles');
    const savedEquipped = localStorage.getItem('gofish_equipped_title');
    
    if (savedUnlocked) setUnlockedTitles(JSON.parse(savedUnlocked));
    if (savedEquipped) setEquippedTitle(savedEquipped);
  }, []);
  
  // Calculate progress for all titles
  useEffect(() => {
    const progress = {};
    const stats = {
      catches: store.totalCatches || 0,
      perfect: store.perfectCatches || 0,
      combo: store.combo || 0,
      species: store.uniqueSpecies?.length || 0,
      dishes: store.dishesCoooked || 0,
    };
    
    Object.entries(PLAYER_TITLES).forEach(([id, title]) => {
      const req = title.requirement;
      if (req.type in stats) {
        progress[id] = stats[req.type];
      }
    });
    
    setTitleProgress(progress);
  }, [store]);
  
  // Check and unlock titles
  const checkTitleUnlocks = useCallback(() => {
    const newUnlocked = [...unlockedTitles];
    let hasNewUnlocks = false;
    
    Object.entries(PLAYER_TITLES).forEach(([id, title]) => {
      if (unlockedTitles.includes(id)) return;
      
      const req = title.requirement;
      const progress = titleProgress[id] || 0;
      
      if (progress >= req.value) {
        newUnlocked.push(id);
        hasNewUnlocks = true;
      }
    });
    
    if (hasNewUnlocks) {
      setUnlockedTitles(newUnlocked);
      localStorage.setItem('gofish_unlocked_titles', JSON.stringify(newUnlocked));
    }
    
    return hasNewUnlocks;
  }, [unlockedTitles, titleProgress]);
  
  // Equip title
  const equipTitle = useCallback((titleId) => {
    if (!unlockedTitles.includes(titleId)) return;
    setEquippedTitle(titleId);
    localStorage.setItem('gofish_equipped_title', titleId);
  }, [unlockedTitles]);
  
  // Get equipped title object
  const getEquippedTitle = useCallback(() => {
    return equippedTitle ? PLAYER_TITLES[equippedTitle] : null;
  }, [equippedTitle]);
  
  return {
    unlockedTitles,
    equippedTitle,
    titleProgress,
    checkTitleUnlocks,
    equipTitle,
    getEquippedTitle,
  };
};

// ==================== TITLES PANEL COMPONENT ====================
const TitlesPanel = ({ onClose }) => {
  const { unlockedTitles, equippedTitle, titleProgress, equipTitle } = useTitleManager();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [playerName, setPlayerName] = useState('Fisher');
  
  // Load player name
  useEffect(() => {
    const saved = localStorage.getItem('gofish_player_name');
    if (saved) setPlayerName(saved);
  }, []);
  
  // Filter titles
  const filteredTitles = useMemo(() => {
    const titles = Object.values(PLAYER_TITLES);
    if (!selectedCategory) return titles;
    return titles.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);
  
  const unlockedCount = unlockedTitles.length;
  const totalCount = Object.keys(PLAYER_TITLES).length;
  
  const equippedTitleObj = equippedTitle ? PLAYER_TITLES[equippedTitle] : null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" data-testid="titles-panel">
      <div className="w-full max-w-5xl max-h-[95vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden border-2 border-purple-500/40 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏅</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">TITLES & BADGES</h2>
              <p className="text-sm text-purple-200">Show off your achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-white/50">Unlocked</p>
              <p className="text-xl font-bold text-white">{unlockedCount}/{totalCount}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50">×</button>
          </div>
        </div>
        
        {/* Current title display */}
        <div className="px-6 py-4 bg-purple-900/20 border-b border-white/10">
          <p className="text-xs text-white/50 mb-2">Currently Equipped</p>
          {equippedTitleObj ? (
            <TitleBadge title={equippedTitleObj} playerName={playerName} size="large" />
          ) : (
            <p className="text-white/40">No title equipped</p>
          )}
        </div>
        
        {/* Category filters */}
        <div className="px-4 py-3 border-b border-white/10 flex gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              !selectedCategory ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            📋 All ({totalCount})
          </button>
          {Object.entries(TITLE_CATEGORIES).map(([key, cat]) => (
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
            </button>
          ))}
        </div>
        
        {/* Titles grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTitles.map(title => (
              <TitleCard
                key={title.id}
                title={title}
                isUnlocked={unlockedTitles.includes(title.id)}
                isEquipped={equippedTitle === title.id}
                onEquip={equipTitle}
                progress={titleProgress[title.id]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TitlesPanel, TitleBadge, useTitleManager, PLAYER_TITLES, TITLE_CATEGORIES };
export default TitlesPanel;
