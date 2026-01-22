import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// RECIPE DISCOVERY SYSTEM
// Unlock secret recipes from rare catches and special conditions
// ========================================================================

// ==================== DISCOVERY CONDITIONS ====================
const DISCOVERY_CONDITIONS = {
  // Fish-based discoveries
  catch_golden_koi: {
    id: 'catch_golden_koi',
    name: 'Golden Fortune',
    description: 'Catch a Golden Koi',
    type: 'fish',
    fish: 'golden_koi',
    recipes: ['golden_feast', 'golden_soup'],
    discovered: false,
  },
  catch_anglerfish: {
    id: 'catch_anglerfish',
    name: 'Deep Sea Light',
    description: 'Catch an Anglerfish',
    type: 'fish',
    fish: 'anglerfish',
    recipes: ['anglerfish_lantern', 'bioluminescent_stew'],
    discovered: false,
  },
  catch_eel: {
    id: 'catch_eel',
    name: 'Slippery Secret',
    description: 'Catch an Electric Eel',
    type: 'fish',
    fish: 'eel',
    recipes: ['dragon_roll', 'electric_soup'],
    discovered: false,
  },
  catch_leviathan: {
    id: 'catch_leviathan',
    name: 'Leviathan Conquered',
    description: 'Defeat a Leviathan',
    type: 'fish',
    fish: 'leviathan',
    recipes: ['leviathan_steak', 'sea_god_feast'],
    discovered: false,
  },
  
  // Rarity-based discoveries
  catch_5_legendary: {
    id: 'catch_5_legendary',
    name: 'Legendary Collection',
    description: 'Catch 5 legendary fish',
    type: 'count',
    rarity: 'legendary',
    count: 5,
    recipes: ['poseidons_platter', 'legendary_feast'],
    discovered: false,
  },
  catch_25_epic: {
    id: 'catch_25_epic',
    name: 'Epic Hunter',
    description: 'Catch 25 epic fish',
    type: 'count',
    rarity: 'epic',
    count: 25,
    recipes: ['mermaids_blessing', 'epic_stew'],
    discovered: false,
  },
  
  // Perfect catch discoveries
  perfect_streak_10: {
    id: 'perfect_streak_10',
    name: 'Perfect Ten',
    description: 'Get 10 perfect catches in a row',
    type: 'perfect_streak',
    count: 10,
    recipes: ['perfect_sashimi', 'master_sushi'],
    discovered: false,
  },
  perfect_50: {
    id: 'perfect_50',
    name: 'Perfectionist Path',
    description: 'Get 50 total perfect catches',
    type: 'perfect_total',
    count: 50,
    recipes: ['perfection_platter', 'flawless_fry'],
    discovered: false,
  },
  
  // Combo discoveries
  combo_25: {
    id: 'combo_25',
    name: 'Combo Flame',
    description: 'Reach a 25x combo',
    type: 'combo',
    count: 25,
    recipes: ['inferno_fish', 'blazing_bowl'],
    discovered: false,
  },
  combo_50: {
    id: 'combo_50',
    name: 'Combo Inferno',
    description: 'Reach a 50x combo',
    type: 'combo',
    count: 50,
    recipes: ['combo_kings_feast', 'fire_and_scales'],
    discovered: false,
  },
  
  // Time-based discoveries
  night_catch_25: {
    id: 'night_catch_25',
    name: 'Night Hunter',
    description: 'Catch 25 fish at night',
    type: 'time',
    time: 'night',
    count: 25,
    recipes: ['midnight_catch', 'moonlight_maki'],
    discovered: false,
  },
  storm_catch_10: {
    id: 'storm_catch_10',
    name: 'Storm Rider',
    description: 'Catch 10 fish during storms',
    type: 'time',
    time: 'storm',
    count: 10,
    recipes: ['storm_survivor', 'thunder_fish'],
    discovered: false,
  },
  dawn_catch_15: {
    id: 'dawn_catch_15',
    name: 'Early Riser',
    description: 'Catch 15 fish at dawn',
    type: 'time',
    time: 'dawn',
    count: 15,
    recipes: ['sunrise_special', 'morning_catch'],
    discovered: false,
  },
  
  // Season discoveries
  all_seasons: {
    id: 'all_seasons',
    name: 'Year-Round Angler',
    description: 'Catch fish in all seasons',
    type: 'seasons',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    recipes: ['four_seasons_platter', 'seasonal_special'],
    discovered: false,
  },
  
  // Location discoveries
  all_stages: {
    id: 'all_stages',
    name: 'World Traveler',
    description: 'Fish in all locations',
    type: 'locations',
    locations: ['lake', 'river', 'ocean', 'deep_sea'],
    recipes: ['world_tour_feast', 'global_catch'],
    discovered: false,
  },
  
  // Collection discoveries
  complete_freshwater: {
    id: 'complete_freshwater',
    name: 'Freshwater Master',
    description: 'Catch all freshwater fish',
    type: 'collection',
    collection: 'freshwater_basics',
    recipes: ['lake_legend', 'river_royal'],
    discovered: false,
  },
  complete_predators: {
    id: 'complete_predators',
    name: 'Apex Predator',
    description: 'Catch all predator fish',
    type: 'collection',
    collection: 'predator_pack',
    recipes: ['predator_stew', 'apex_feast'],
    discovered: false,
  },
  
  // Level discoveries
  level_25: {
    id: 'level_25',
    name: 'Expert Unlocked',
    description: 'Reach level 25',
    type: 'level',
    level: 25,
    recipes: ['expert_selection', 'level_up_special'],
    discovered: false,
  },
  level_50: {
    id: 'level_50',
    name: 'Master Unlocked',
    description: 'Reach level 50',
    type: 'level',
    level: 50,
    recipes: ['masters_choice', 'elite_entree'],
    discovered: false,
  },
  
  // Special discoveries
  triple_rare: {
    id: 'triple_rare',
    name: 'Triple Threat',
    description: 'Catch 3 rare+ fish in one session',
    type: 'session',
    rarity: 'rare',
    count: 3,
    recipes: ['triple_treat', 'rare_trio'],
    discovered: false,
  },
  giant_catch: {
    id: 'giant_catch',
    name: 'Monster Hunter',
    description: 'Catch a fish over 100 lbs',
    type: 'size',
    weight: 100,
    recipes: ['monster_meal', 'giant_grill'],
    discovered: false,
  },
};

// ==================== SECRET RECIPES ====================
const SECRET_RECIPES = {
  // Golden recipes
  golden_feast: {
    id: 'golden_feast',
    name: 'Golden Feast',
    icon: '👑🐟',
    tier: 5,
    rarity: 'legendary',
    description: 'The most luxurious fish dish',
    reward: { points: 10000, xp: 2000 },
    secret: true,
  },
  golden_soup: {
    id: 'golden_soup',
    name: 'Liquid Gold Soup',
    icon: '✨🥣',
    tier: 4,
    rarity: 'epic',
    description: 'Shimmering golden broth',
    reward: { points: 3000, xp: 600 },
    secret: true,
  },
  
  // Deep sea recipes
  anglerfish_lantern: {
    id: 'anglerfish_lantern',
    name: 'Anglerfish Lantern',
    icon: '🔦🐟',
    tier: 4,
    rarity: 'epic',
    description: 'Glowing deep sea delicacy',
    reward: { points: 2500, xp: 500 },
    secret: true,
  },
  bioluminescent_stew: {
    id: 'bioluminescent_stew',
    name: 'Glowing Stew',
    icon: '💡🍲',
    tier: 4,
    rarity: 'epic',
    description: 'A stew that lights up',
    reward: { points: 2000, xp: 400 },
    secret: true,
  },
  
  // Dragon recipes
  dragon_roll: {
    id: 'dragon_roll',
    name: 'Dragon Roll',
    icon: '🐉🍣',
    tier: 3,
    rarity: 'rare',
    description: 'Majestic eel roll',
    reward: { points: 800, xp: 160 },
    secret: true,
  },
  electric_soup: {
    id: 'electric_soup',
    name: 'Electric Soup',
    icon: '⚡🥣',
    tier: 3,
    rarity: 'rare',
    description: 'Tingles your taste buds',
    reward: { points: 750, xp: 150 },
    secret: true,
  },
  
  // Legendary recipes
  leviathan_steak: {
    id: 'leviathan_steak',
    name: 'Leviathan Steak',
    icon: '🐋🥩',
    tier: 5,
    rarity: 'legendary',
    description: 'Meat from a sea god',
    reward: { points: 8000, xp: 1600 },
    secret: true,
  },
  sea_god_feast: {
    id: 'sea_god_feast',
    name: 'Sea God Feast',
    icon: '🔱🍽️',
    tier: 5,
    rarity: 'legendary',
    description: 'Worthy of Poseidon',
    reward: { points: 12000, xp: 2400 },
    secret: true,
  },
  poseidons_platter: {
    id: 'poseidons_platter',
    name: "Poseidon's Platter",
    icon: '🔱🐟',
    tier: 5,
    rarity: 'legendary',
    description: 'Blessed by the sea',
    reward: { points: 9000, xp: 1800 },
    secret: true,
  },
  legendary_feast: {
    id: 'legendary_feast',
    name: 'Legendary Feast',
    icon: '👑🍽️',
    tier: 5,
    rarity: 'legendary',
    description: 'Fit for royalty',
    reward: { points: 7500, xp: 1500 },
    secret: true,
  },
  
  // Perfect recipes
  perfect_sashimi: {
    id: 'perfect_sashimi',
    name: 'Perfect Sashimi',
    icon: '💎🍣',
    tier: 4,
    rarity: 'epic',
    description: 'Flawlessly sliced',
    reward: { points: 2200, xp: 440 },
    secret: true,
  },
  master_sushi: {
    id: 'master_sushi',
    name: 'Master Sushi',
    icon: '⭐🍣',
    tier: 4,
    rarity: 'epic',
    description: 'Sushi perfection',
    reward: { points: 2500, xp: 500 },
    secret: true,
  },
  perfection_platter: {
    id: 'perfection_platter',
    name: 'Perfection Platter',
    icon: '✨🍽️',
    tier: 4,
    rarity: 'epic',
    description: 'Every piece is perfect',
    reward: { points: 3000, xp: 600 },
    secret: true,
  },
  
  // Combo recipes
  inferno_fish: {
    id: 'inferno_fish',
    name: 'Inferno Fish',
    icon: '🔥🐟',
    tier: 3,
    rarity: 'rare',
    description: 'Burns with combo power',
    reward: { points: 1200, xp: 240 },
    secret: true,
  },
  blazing_bowl: {
    id: 'blazing_bowl',
    name: 'Blazing Bowl',
    icon: '🔥🥣',
    tier: 3,
    rarity: 'rare',
    description: 'Hot combo energy',
    reward: { points: 1000, xp: 200 },
    secret: true,
  },
  combo_kings_feast: {
    id: 'combo_kings_feast',
    name: "Combo King's Feast",
    icon: '🔥👑',
    tier: 4,
    rarity: 'epic',
    description: 'For the combo master',
    reward: { points: 4000, xp: 800 },
    secret: true,
  },
  
  // Time-based recipes
  midnight_catch: {
    id: 'midnight_catch',
    name: 'Midnight Catch',
    icon: '🌙🐟',
    tier: 4,
    rarity: 'epic',
    description: 'Caught under moonlight',
    reward: { points: 2000, xp: 400 },
    secret: true,
  },
  moonlight_maki: {
    id: 'moonlight_maki',
    name: 'Moonlight Maki',
    icon: '🌙🍣',
    tier: 3,
    rarity: 'rare',
    description: 'Rolled under the stars',
    reward: { points: 900, xp: 180 },
    secret: true,
  },
  storm_survivor: {
    id: 'storm_survivor',
    name: 'Storm Survivor',
    icon: '⛈️🐟',
    tier: 4,
    rarity: 'epic',
    description: 'Caught in lightning',
    reward: { points: 2200, xp: 440 },
    secret: true,
  },
  thunder_fish: {
    id: 'thunder_fish',
    name: 'Thunder Fish',
    icon: '⚡🐟',
    tier: 3,
    rarity: 'rare',
    description: 'Electrifying taste',
    reward: { points: 1100, xp: 220 },
    secret: true,
  },
  sunrise_special: {
    id: 'sunrise_special',
    name: 'Sunrise Special',
    icon: '🌅🍳',
    tier: 2,
    rarity: 'uncommon',
    description: 'Fresh as dawn',
    reward: { points: 500, xp: 100 },
    secret: true,
  },
  
  // Season recipes
  four_seasons_platter: {
    id: 'four_seasons_platter',
    name: 'Four Seasons Platter',
    icon: '🌸☀️🍂❄️',
    tier: 4,
    rarity: 'epic',
    description: 'A year on a plate',
    reward: { points: 3500, xp: 700 },
    secret: true,
  },
  
  // World recipes
  world_tour_feast: {
    id: 'world_tour_feast',
    name: 'World Tour Feast',
    icon: '🌍🍽️',
    tier: 4,
    rarity: 'epic',
    description: 'Fish from everywhere',
    reward: { points: 3000, xp: 600 },
    secret: true,
  },
};

// ==================== RARITY STYLES ====================
const RARITY_STYLES = {
  common: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-300', border: 'border-gray-400' },
  uncommon: { bg: 'from-green-500 to-emerald-600', text: 'text-green-300', border: 'border-green-400' },
  rare: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-300', border: 'border-blue-400' },
  epic: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-300', border: 'border-purple-400' },
  legendary: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-300', border: 'border-yellow-400' },
};

// ==================== DISCOVERY NOTIFICATION ====================
const RecipeDiscoveryNotification = ({ discovery, recipes, onComplete }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => onComplete?.(), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);
  
  if (!discovery) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none" data-testid="recipe-discovery">
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${phase >= 1 ? 'opacity-85' : 'opacity-0'}`} />
      
      {/* Sparkle particles */}
      {phase >= 2 && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main card */}
      <div className={`
        relative transition-all duration-700
        ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        ${phase >= 3 ? 'scale-75 opacity-0' : ''}
      `}>
        <div className="bg-gradient-to-b from-amber-900 to-orange-900 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl shadow-yellow-500/50 min-w-[400px]">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-6xl animate-bounce inline-block">📜</span>
            <h2 className="text-2xl font-bold text-yellow-400 font-pixel mt-2">RECIPE DISCOVERED!</h2>
            <p className="text-white/70 text-sm">{discovery.name}</p>
          </div>
          
          {/* Discovered recipes */}
          <div className="space-y-3">
            {recipes.map(recipe => {
              const style = RARITY_STYLES[recipe.rarity];
              return (
                <div 
                  key={recipe.id}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${style.bg}/30 border ${style.border}/50`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-3xl`}>
                    {recipe.icon}
                  </div>
                  <div>
                    <p className={`font-bold ${style.text}`}>{recipe.name}</p>
                    <p className="text-xs text-white/50">{recipe.description}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${style.bg} text-white uppercase mt-1 inline-block`}>
                      {recipe.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Points display */}
          <div className="mt-6 text-center">
            <p className="text-yellow-400 font-bold">
              🎉 {recipes.length} new recipe{recipes.length > 1 ? 's' : ''} unlocked!
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// ==================== DISCOVERY TRACKER HOOK ====================
const useRecipeDiscovery = () => {
  const store = useGameStore();
  const [discoveries, setDiscoveries] = useState({});
  const [pendingNotification, setPendingNotification] = useState(null);
  const [stats, setStats] = useState({
    legendaryCount: 0,
    epicCount: 0,
    perfectStreak: 0,
    perfectTotal: 0,
    maxCombo: 0,
    nightCatches: 0,
    stormCatches: 0,
    dawnCatches: 0,
    seasonsPlayed: [],
    locationsVisited: [],
    sessionRareCount: 0,
  });
  
  // Load discoveries
  useEffect(() => {
    const saved = localStorage.getItem('gofish_discoveries');
    if (saved) {
      setDiscoveries(JSON.parse(saved));
    }
    const savedStats = localStorage.getItem('gofish_discovery_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);
  
  // Check discovery conditions
  const checkDiscovery = useCallback((conditionId) => {
    const condition = DISCOVERY_CONDITIONS[conditionId];
    if (!condition || discoveries[conditionId]) return false;
    
    // Get recipes for this discovery
    const recipes = condition.recipes
      .map(id => SECRET_RECIPES[id])
      .filter(Boolean);
    
    if (recipes.length > 0) {
      // Mark as discovered
      const newDiscoveries = { ...discoveries, [conditionId]: true };
      setDiscoveries(newDiscoveries);
      localStorage.setItem('gofish_discoveries', JSON.stringify(newDiscoveries));
      
      // Unlock recipes
      const unlockedRecipes = JSON.parse(localStorage.getItem('gofish_unlocked_recipes') || '[]');
      condition.recipes.forEach(id => {
        if (!unlockedRecipes.includes(id)) {
          unlockedRecipes.push(id);
        }
      });
      localStorage.setItem('gofish_unlocked_recipes', JSON.stringify(unlockedRecipes));
      
      // Show notification
      setPendingNotification({ discovery: condition, recipes });
      
      return true;
    }
    return false;
  }, [discoveries]);
  
  // Update stats and check discoveries on catch
  const onFishCaught = useCallback((fish, isPerfect, combo, timeOfDay, weather, season, location) => {
    const newStats = { ...stats };
    
    // Update rarity counts
    if (fish.rarity < 0.3) {
      newStats.legendaryCount = (newStats.legendaryCount || 0) + 1;
      newStats.sessionRareCount = (newStats.sessionRareCount || 0) + 1;
    } else if (fish.rarity < 0.5) {
      newStats.epicCount = (newStats.epicCount || 0) + 1;
      newStats.sessionRareCount = (newStats.sessionRareCount || 0) + 1;
    } else if (fish.rarity < 0.7) {
      newStats.sessionRareCount = (newStats.sessionRareCount || 0) + 1;
    }
    
    // Update perfect stats
    if (isPerfect) {
      newStats.perfectStreak = (newStats.perfectStreak || 0) + 1;
      newStats.perfectTotal = (newStats.perfectTotal || 0) + 1;
    } else {
      newStats.perfectStreak = 0;
    }
    
    // Update combo
    newStats.maxCombo = Math.max(newStats.maxCombo || 0, combo);
    
    // Update time-based catches
    if (timeOfDay === 'night') newStats.nightCatches = (newStats.nightCatches || 0) + 1;
    if (timeOfDay === 'dawn') newStats.dawnCatches = (newStats.dawnCatches || 0) + 1;
    if (weather === 'storm') newStats.stormCatches = (newStats.stormCatches || 0) + 1;
    
    // Update seasons and locations
    if (season && !newStats.seasonsPlayed?.includes(season)) {
      newStats.seasonsPlayed = [...(newStats.seasonsPlayed || []), season];
    }
    if (location && !newStats.locationsVisited?.includes(location)) {
      newStats.locationsVisited = [...(newStats.locationsVisited || []), location];
    }
    
    setStats(newStats);
    localStorage.setItem('gofish_discovery_stats', JSON.stringify(newStats));
    
    // Check fish-based discoveries
    const fishType = fish.name?.toLowerCase().replace(/\s+/g, '_');
    Object.entries(DISCOVERY_CONDITIONS).forEach(([id, condition]) => {
      if (condition.type === 'fish' && condition.fish === fishType) {
        checkDiscovery(id);
      }
      if (condition.type === 'count' && condition.rarity === 'legendary' && newStats.legendaryCount >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'count' && condition.rarity === 'epic' && newStats.epicCount >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'perfect_streak' && newStats.perfectStreak >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'perfect_total' && newStats.perfectTotal >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'combo' && newStats.maxCombo >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'time' && condition.time === 'night' && newStats.nightCatches >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'time' && condition.time === 'storm' && newStats.stormCatches >= condition.count) {
        checkDiscovery(id);
      }
      if (condition.type === 'session' && newStats.sessionRareCount >= condition.count) {
        checkDiscovery(id);
      }
    });
  }, [stats, checkDiscovery]);
  
  // Check level-based discoveries
  useEffect(() => {
    Object.entries(DISCOVERY_CONDITIONS).forEach(([id, condition]) => {
      if (condition.type === 'level' && store.level >= condition.level) {
        checkDiscovery(id);
      }
    });
  }, [store.level, checkDiscovery]);
  
  const handleNotificationComplete = useCallback(() => {
    setPendingNotification(null);
  }, []);
  
  // Reset session stats
  const resetSession = useCallback(() => {
    setStats(prev => ({ ...prev, sessionRareCount: 0 }));
  }, []);
  
  return {
    discoveries,
    stats,
    onFishCaught,
    resetSession,
    pendingNotification,
    handleNotificationComplete,
    checkDiscovery,
  };
};

// ==================== RECIPE DISCOVERY PANEL ====================
const RecipeDiscoveryPanel = ({ onClose }) => {
  const [discoveries, setDiscoveries] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    const saved = localStorage.getItem('gofish_discoveries');
    if (saved) setDiscoveries(JSON.parse(saved));
  }, []);
  
  const categories = [
    { id: 'all', name: 'All', icon: '📜' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'perfect', name: 'Perfect', icon: '⭐' },
    { id: 'combo', name: 'Combo', icon: '🔥' },
    { id: 'time', name: 'Time', icon: '⏰' },
    { id: 'special', name: 'Special', icon: '✨' },
  ];
  
  const filteredConditions = Object.values(DISCOVERY_CONDITIONS).filter(c => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'fish') return c.type === 'fish';
    if (selectedCategory === 'perfect') return c.type.includes('perfect');
    if (selectedCategory === 'combo') return c.type === 'combo';
    if (selectedCategory === 'time') return c.type === 'time' || c.type === 'seasons';
    return c.type === 'collection' || c.type === 'level' || c.type === 'session' || c.type === 'size';
  });
  
  const discoveredCount = Object.keys(discoveries).length;
  const totalCount = Object.keys(DISCOVERY_CONDITIONS).length;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" data-testid="recipe-discovery-panel">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden border-2 border-amber-500/40 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-700 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📜</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">SECRET RECIPES</h2>
              <p className="text-sm text-amber-200">Discover hidden culinary secrets</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-white/50">Discovered</p>
              <p className="text-xl font-bold text-white">{discoveredCount}/{totalCount}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50">×</button>
          </div>
        </div>
        
        {/* Progress */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="h-3 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all"
              style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="px-4 py-3 border-b border-white/10 flex gap-2 overflow-x-auto shrink-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        
        {/* Discoveries grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredConditions.map(condition => {
              const isDiscovered = discoveries[condition.id];
              const recipes = condition.recipes.map(id => SECRET_RECIPES[id]).filter(Boolean);
              
              return (
                <div 
                  key={condition.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isDiscovered
                      ? 'border-yellow-500/50 bg-yellow-900/20'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${
                      isDiscovered ? 'bg-yellow-600' : 'bg-white/10'
                    } flex items-center justify-center text-2xl`}>
                      {isDiscovered ? '✓' : '?'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${isDiscovered ? 'text-yellow-400' : 'text-white/60'}`}>
                        {isDiscovered ? condition.name : '???'}
                      </h4>
                      <p className="text-xs text-white/50">
                        {isDiscovered ? condition.description : 'Hidden requirement'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipes.map(recipe => (
                          <span 
                            key={recipe.id}
                            className={`text-xs px-2 py-0.5 rounded-lg ${
                              isDiscovered 
                                ? 'bg-yellow-900/50 text-yellow-400' 
                                : 'bg-white/10 text-white/30'
                            }`}
                          >
                            {isDiscovered ? recipe.name : '???'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  RecipeDiscoveryNotification,
  RecipeDiscoveryPanel,
  useRecipeDiscovery,
  DISCOVERY_CONDITIONS,
  SECRET_RECIPES,
};
export default RecipeDiscoveryPanel;
