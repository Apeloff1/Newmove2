import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// INGREDIENT DROP SYSTEM - Auto-grants cooking ingredients from catches
// Connects fishing gameplay to cooking progression
// ========================================================================

// ==================== FISH TO INGREDIENT MAPPING ====================
const FISH_INGREDIENT_DROPS = {
  // Common fish
  minnow: {
    guaranteed: [{ id: 'minnow_fillet', amount: 1 }],
    chance: [
      { id: 'fish_bones', amount: 1, chance: 0.3 },
      { id: 'sea_salt', amount: 1, chance: 0.2 },
    ]
  },
  perch: {
    guaranteed: [{ id: 'perch_fillet', amount: 1 }],
    chance: [
      { id: 'fish_scales', amount: 2, chance: 0.4 },
      { id: 'sea_salt', amount: 1, chance: 0.25 },
    ]
  },
  // Uncommon fish
  bass: {
    guaranteed: [{ id: 'bass_fillet', amount: 1 }],
    chance: [
      { id: 'fish_oil', amount: 1, chance: 0.35 },
      { id: 'herbs', amount: 1, chance: 0.2 },
      { id: 'lemon', amount: 1, chance: 0.15 },
    ]
  },
  catfish: {
    guaranteed: [{ id: 'catfish_fillet', amount: 1 }],
    chance: [
      { id: 'whiskers', amount: 1, chance: 0.5 },
      { id: 'garlic', amount: 1, chance: 0.25 },
      { id: 'breadcrumbs', amount: 2, chance: 0.3 },
    ]
  },
  // Rare fish
  pike: {
    guaranteed: [{ id: 'pike_fillet', amount: 1 }],
    chance: [
      { id: 'truffle_oil', amount: 1, chance: 0.15 },
      { id: 'butter', amount: 2, chance: 0.4 },
      { id: 'herbs', amount: 2, chance: 0.35 },
    ]
  },
  trout: {
    guaranteed: [{ id: 'trout_fillet', amount: 1 }],
    chance: [
      { id: 'roe', amount: 1, chance: 0.2 },
      { id: 'lemon', amount: 2, chance: 0.35 },
      { id: 'dill', amount: 1, chance: 0.25 },
    ]
  },
  salmon: {
    guaranteed: [{ id: 'salmon_fillet', amount: 1 }, { id: 'roe', amount: 1 }],
    chance: [
      { id: 'omega_oil', amount: 1, chance: 0.3 },
      { id: 'rice', amount: 2, chance: 0.25 },
    ]
  },
  // Epic fish
  tuna: {
    guaranteed: [{ id: 'tuna_steak', amount: 2 }],
    chance: [
      { id: 'wasabi', amount: 1, chance: 0.4 },
      { id: 'nori', amount: 2, chance: 0.5 },
      { id: 'soy_sauce', amount: 1, chance: 0.35 },
    ]
  },
  swordfish: {
    guaranteed: [{ id: 'swordfish_steak', amount: 2 }],
    chance: [
      { id: 'pearl', amount: 1, chance: 0.1 },
      { id: 'dragon_spice', amount: 1, chance: 0.08 },
      { id: 'truffle_oil', amount: 1, chance: 0.2 },
    ]
  },
  // Legendary fish
  golden_koi: {
    guaranteed: [
      { id: 'golden_koi_fillet', amount: 1 },
      { id: 'golden_scale', amount: 1 },
    ],
    chance: [
      { id: 'mermaid_tear', amount: 1, chance: 0.25 },
      { id: 'dragon_spice', amount: 1, chance: 0.3 },
      { id: 'pearl', amount: 2, chance: 0.4 },
    ]
  },
  // Additional fish types
  carp: {
    guaranteed: [{ id: 'carp_fillet', amount: 1 }],
    chance: [
      { id: 'seaweed', amount: 2, chance: 0.5 },
      { id: 'kelp', amount: 1, chance: 0.35 },
    ]
  },
  cod: {
    guaranteed: [{ id: 'cod_fillet', amount: 1 }],
    chance: [
      { id: 'fish_liver', amount: 1, chance: 0.3 },
      { id: 'butter', amount: 1, chance: 0.4 },
    ]
  },
  mackerel: {
    guaranteed: [{ id: 'mackerel_fillet', amount: 1 }],
    chance: [
      { id: 'omega_oil', amount: 1, chance: 0.45 },
      { id: 'lemon', amount: 1, chance: 0.3 },
    ]
  },
  eel: {
    guaranteed: [{ id: 'eel_meat', amount: 1 }],
    chance: [
      { id: 'electric_essence', amount: 1, chance: 0.2 },
      { id: 'soy_sauce', amount: 1, chance: 0.4 },
    ]
  },
  anglerfish: {
    guaranteed: [{ id: 'angler_meat', amount: 1 }, { id: 'bioluminescent_orb', amount: 1 }],
    chance: [
      { id: 'deep_sea_salt', amount: 1, chance: 0.5 },
      { id: 'ocean_mushroom', amount: 1, chance: 0.25 },
    ]
  },
};

// ==================== BONUS INGREDIENTS BY CONDITION ====================
const CONDITION_BONUSES = {
  perfect_catch: {
    multiplier: 2, // Double all drops
    bonus: [{ id: 'star_essence', amount: 1, chance: 0.3 }]
  },
  combo_5: {
    bonus: [{ id: 'combo_spice', amount: 1, chance: 0.5 }]
  },
  combo_10: {
    bonus: [
      { id: 'combo_spice', amount: 2, chance: 0.7 },
      { id: 'fire_essence', amount: 1, chance: 0.3 }
    ]
  },
  night_fishing: {
    bonus: [{ id: 'moonstone_powder', amount: 1, chance: 0.2 }]
  },
  storm_fishing: {
    bonus: [{ id: 'lightning_essence', amount: 1, chance: 0.15 }]
  },
  full_moon: {
    bonus: [{ id: 'lunar_essence', amount: 1, chance: 0.4 }]
  },
};

// ==================== INGREDIENT METADATA ====================
const INGREDIENT_METADATA = {
  // Fish Fillets
  minnow_fillet: { name: 'Minnow Fillet', icon: '🐟', rarity: 'common', category: 'fish' },
  perch_fillet: { name: 'Perch Fillet', icon: '🐠', rarity: 'common', category: 'fish' },
  bass_fillet: { name: 'Bass Fillet', icon: '🐟', rarity: 'uncommon', category: 'fish' },
  catfish_fillet: { name: 'Catfish Fillet', icon: '🐡', rarity: 'uncommon', category: 'fish' },
  pike_fillet: { name: 'Pike Fillet', icon: '🦈', rarity: 'rare', category: 'fish' },
  trout_fillet: { name: 'Trout Fillet', icon: '🐟', rarity: 'rare', category: 'fish' },
  salmon_fillet: { name: 'Salmon Fillet', icon: '🍣', rarity: 'rare', category: 'fish' },
  tuna_steak: { name: 'Tuna Steak', icon: '🥩', rarity: 'epic', category: 'fish' },
  swordfish_steak: { name: 'Swordfish Steak', icon: '⚔️', rarity: 'epic', category: 'fish' },
  golden_koi_fillet: { name: 'Golden Koi Fillet', icon: '✨', rarity: 'legendary', category: 'fish' },
  carp_fillet: { name: 'Carp Fillet', icon: '🐟', rarity: 'common', category: 'fish' },
  cod_fillet: { name: 'Cod Fillet', icon: '🐟', rarity: 'common', category: 'fish' },
  mackerel_fillet: { name: 'Mackerel Fillet', icon: '🐟', rarity: 'uncommon', category: 'fish' },
  eel_meat: { name: 'Eel Meat', icon: '🐍', rarity: 'rare', category: 'fish' },
  angler_meat: { name: 'Anglerfish Meat', icon: '🔦', rarity: 'epic', category: 'fish' },
  
  // Fish Parts
  fish_bones: { name: 'Fish Bones', icon: '🦴', rarity: 'common', category: 'parts' },
  fish_scales: { name: 'Fish Scales', icon: '💎', rarity: 'common', category: 'parts' },
  fish_oil: { name: 'Fish Oil', icon: '💧', rarity: 'uncommon', category: 'parts' },
  fish_liver: { name: 'Fish Liver', icon: '🫀', rarity: 'uncommon', category: 'parts' },
  whiskers: { name: 'Catfish Whiskers', icon: '〰️', rarity: 'uncommon', category: 'parts' },
  roe: { name: 'Fish Roe', icon: '🟠', rarity: 'rare', category: 'parts' },
  omega_oil: { name: 'Omega Oil', icon: '💊', rarity: 'rare', category: 'parts' },
  golden_scale: { name: 'Golden Scale', icon: '💛', rarity: 'legendary', category: 'parts' },
  bioluminescent_orb: { name: 'Bio-luminescent Orb', icon: '💡', rarity: 'epic', category: 'parts' },
  electric_essence: { name: 'Electric Essence', icon: '⚡', rarity: 'epic', category: 'parts' },
  
  // Seasonings
  sea_salt: { name: 'Sea Salt', icon: '🧂', rarity: 'common', category: 'seasoning' },
  deep_sea_salt: { name: 'Deep Sea Salt', icon: '🧂', rarity: 'rare', category: 'seasoning' },
  lemon: { name: 'Fresh Lemon', icon: '🍋', rarity: 'common', category: 'seasoning' },
  butter: { name: 'Creamy Butter', icon: '🧈', rarity: 'common', category: 'seasoning' },
  garlic: { name: 'Fresh Garlic', icon: '🧄', rarity: 'common', category: 'seasoning' },
  herbs: { name: 'Mixed Herbs', icon: '🌿', rarity: 'uncommon', category: 'seasoning' },
  dill: { name: 'Fresh Dill', icon: '🌱', rarity: 'uncommon', category: 'seasoning' },
  wasabi: { name: 'Fresh Wasabi', icon: '🟢', rarity: 'rare', category: 'seasoning' },
  soy_sauce: { name: 'Soy Sauce', icon: '🫗', rarity: 'uncommon', category: 'seasoning' },
  truffle_oil: { name: 'Truffle Oil', icon: '🫒', rarity: 'rare', category: 'seasoning' },
  dragon_spice: { name: 'Dragon Spice', icon: '🌶️', rarity: 'epic', category: 'seasoning' },
  
  // Vegetables
  seaweed: { name: 'Fresh Seaweed', icon: '🌿', rarity: 'common', category: 'vegetable' },
  kelp: { name: 'Giant Kelp', icon: '🥬', rarity: 'common', category: 'vegetable' },
  ocean_mushroom: { name: 'Ocean Mushroom', icon: '🍄', rarity: 'rare', category: 'vegetable' },
  
  // Carbs
  rice: { name: 'Sushi Rice', icon: '🍚', rarity: 'common', category: 'carb' },
  nori: { name: 'Nori Sheets', icon: '📃', rarity: 'common', category: 'carb' },
  breadcrumbs: { name: 'Panko Crumbs', icon: '🍞', rarity: 'common', category: 'carb' },
  
  // Special ingredients
  pearl: { name: 'Cooking Pearl', icon: '⚪', rarity: 'rare', category: 'special' },
  mermaid_tear: { name: 'Mermaid Tear', icon: '💧', rarity: 'epic', category: 'special' },
  star_essence: { name: 'Star Essence', icon: '⭐', rarity: 'rare', category: 'special' },
  combo_spice: { name: 'Combo Spice', icon: '🔥', rarity: 'uncommon', category: 'special' },
  fire_essence: { name: 'Fire Essence', icon: '🔥', rarity: 'rare', category: 'special' },
  moonstone_powder: { name: 'Moonstone Powder', icon: '🌙', rarity: 'rare', category: 'special' },
  lightning_essence: { name: 'Lightning Essence', icon: '⚡', rarity: 'epic', category: 'special' },
  lunar_essence: { name: 'Lunar Essence', icon: '🌕', rarity: 'epic', category: 'special' },
};

// ==================== RARITY COLORS ====================
const RARITY_COLORS = {
  common: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-300', border: 'border-gray-400' },
  uncommon: { bg: 'from-green-500 to-emerald-600', text: 'text-green-300', border: 'border-green-400' },
  rare: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-300', border: 'border-blue-400' },
  epic: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-300', border: 'border-purple-400' },
  legendary: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-300', border: 'border-yellow-400' },
};

// ==================== DROP CALCULATION ====================
const calculateDrops = (fishType, conditions = {}) => {
  const drops = [];
  const fishName = fishType?.name?.toLowerCase().replace(/\s+/g, '_') || 'minnow';
  const dropTable = FISH_INGREDIENT_DROPS[fishName] || FISH_INGREDIENT_DROPS.minnow;
  
  // Multiplier from conditions
  let multiplier = 1;
  if (conditions.perfect) {
    multiplier = CONDITION_BONUSES.perfect_catch.multiplier;
  }
  
  // Add guaranteed drops
  dropTable.guaranteed.forEach(item => {
    drops.push({
      ...item,
      amount: item.amount * multiplier,
      metadata: INGREDIENT_METADATA[item.id] || { name: item.id, icon: '❓', rarity: 'common' }
    });
  });
  
  // Roll for chance drops
  dropTable.chance.forEach(item => {
    if (Math.random() < item.chance) {
      drops.push({
        ...item,
        amount: item.amount * multiplier,
        metadata: INGREDIENT_METADATA[item.id] || { name: item.id, icon: '❓', rarity: 'common' }
      });
    }
  });
  
  // Add condition bonuses
  if (conditions.perfect && CONDITION_BONUSES.perfect_catch.bonus) {
    CONDITION_BONUSES.perfect_catch.bonus.forEach(item => {
      if (Math.random() < item.chance) {
        drops.push({
          ...item,
          metadata: INGREDIENT_METADATA[item.id] || { name: item.id, icon: '❓', rarity: 'rare' }
        });
      }
    });
  }
  
  if (conditions.combo >= 5) {
    const comboBonus = conditions.combo >= 10 ? CONDITION_BONUSES.combo_10 : CONDITION_BONUSES.combo_5;
    comboBonus.bonus.forEach(item => {
      if (Math.random() < item.chance) {
        drops.push({
          ...item,
          metadata: INGREDIENT_METADATA[item.id] || { name: item.id, icon: '❓', rarity: 'uncommon' }
        });
      }
    });
  }
  
  if (conditions.night && CONDITION_BONUSES.night_fishing) {
    CONDITION_BONUSES.night_fishing.bonus.forEach(item => {
      if (Math.random() < item.chance) {
        drops.push({
          ...item,
          metadata: INGREDIENT_METADATA[item.id] || { name: item.id, icon: '❓', rarity: 'rare' }
        });
      }
    });
  }
  
  return drops;
};

// ==================== INGREDIENT DROP ANIMATION ====================
const IngredientDropAnimation = ({ drops, onComplete }) => {
  const [visibleDrops, setVisibleDrops] = useState([]);
  const [phase, setPhase] = useState('entering');
  
  useEffect(() => {
    // Stagger the drops
    drops.forEach((drop, i) => {
      setTimeout(() => {
        setVisibleDrops(prev => [...prev, { ...drop, id: i }]);
      }, i * 200);
    });
    
    // Complete after all drops shown
    const totalTime = drops.length * 200 + 2000;
    setTimeout(() => {
      setPhase('exiting');
      setTimeout(() => onComplete?.(), 500);
    }, totalTime);
  }, [drops, onComplete]);
  
  if (drops.length === 0) return null;
  
  return (
    <div className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center" data-testid="ingredient-drops">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className={`text-center mb-4 transition-all duration-500 ${phase === 'exiting' ? 'opacity-0 translate-y-[-20px]' : 'opacity-100'}`}>
          <span className="text-2xl">🎁</span>
          <h3 className="text-xl font-bold text-white font-pixel">INGREDIENTS!</h3>
        </div>
        
        {/* Drops container */}
        <div className="flex flex-wrap justify-center gap-3">
          {visibleDrops.map((drop, index) => {
            const rarity = RARITY_COLORS[drop.metadata?.rarity || 'common'];
            return (
              <div
                key={drop.id}
                className={`
                  ingredient-drop-item
                  px-4 py-3 rounded-xl
                  bg-gradient-to-br ${rarity.bg}
                  border-2 ${rarity.border}
                  shadow-lg
                  transform transition-all duration-500
                  ${phase === 'exiting' ? 'opacity-0 scale-50' : 'animate-ingredient-pop'}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{drop.metadata?.icon || '❓'}</span>
                  <div>
                    <p className="text-white text-sm font-bold">{drop.metadata?.name || drop.id}</p>
                    <p className="text-white/70 text-xs">×{drop.amount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes ingredientPop {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-ingredient-pop {
          animation: ingredientPop 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// ==================== INGREDIENT INVENTORY MANAGER ====================
const useIngredientInventory = () => {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('gofish_ingredients_v2');
    return saved ? JSON.parse(saved) : {};
  });
  
  const addIngredients = useCallback((drops) => {
    setInventory(prev => {
      const newInventory = { ...prev };
      drops.forEach(drop => {
        newInventory[drop.id] = (newInventory[drop.id] || 0) + drop.amount;
      });
      localStorage.setItem('gofish_ingredients_v2', JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);
  
  const removeIngredient = useCallback((id, amount) => {
    setInventory(prev => {
      const newInventory = { ...prev };
      newInventory[id] = Math.max(0, (newInventory[id] || 0) - amount);
      localStorage.setItem('gofish_ingredients_v2', JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);
  
  const getIngredient = useCallback((id) => {
    return inventory[id] || 0;
  }, [inventory]);
  
  return { inventory, addIngredients, removeIngredient, getIngredient };
};

// ==================== INGREDIENT PANEL COMPONENT ====================
const IngredientPanel = ({ onClose }) => {
  const { inventory } = useIngredientInventory();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('amount');
  
  const categories = ['all', 'fish', 'parts', 'seasoning', 'vegetable', 'carb', 'special'];
  
  const filteredIngredients = Object.entries(inventory)
    .filter(([id, amount]) => amount > 0)
    .map(([id, amount]) => ({
      id,
      amount,
      metadata: INGREDIENT_METADATA[id] || { name: id, icon: '❓', rarity: 'common', category: 'special' }
    }))
    .filter(item => selectedCategory === 'all' || item.metadata.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'rarity') {
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        return rarityOrder[a.metadata.rarity] - rarityOrder[b.metadata.rarity];
      }
      return a.metadata.name.localeCompare(b.metadata.name);
    });
  
  const totalIngredients = Object.values(inventory).reduce((sum, v) => sum + v, 0);
  const uniqueIngredients = Object.keys(inventory).filter(k => inventory[k] > 0).length;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" data-testid="ingredient-panel">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl overflow-hidden border-2 border-amber-500/40 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎒</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">INGREDIENTS</h2>
              <p className="text-sm text-amber-200">Your cooking supplies</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-white/50">Total</p>
              <p className="text-xl font-bold text-white">{totalIngredients}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50">Types</p>
              <p className="text-xl font-bold text-amber-300">{uniqueIngredients}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50 transition-all">×</button>
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="px-4 py-3 border-b border-white/10 flex gap-2 overflow-x-auto shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat === 'all' ? '📦 All' : cat}
            </button>
          ))}
        </div>
        
        {/* Sort options */}
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 shrink-0">
          <span className="text-xs text-white/50">Sort:</span>
          {['amount', 'rarity', 'name'].map(sort => (
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
        
        {/* Ingredients grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredIngredients.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">🎣</span>
              <p className="text-white/50 mt-4">No ingredients yet!</p>
              <p className="text-white/30 text-sm">Catch fish to collect ingredients</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredIngredients.map(item => {
                const rarity = RARITY_COLORS[item.metadata.rarity];
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl bg-gradient-to-br ${rarity.bg}/20 border ${rarity.border}/50 transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rarity.bg} flex items-center justify-center text-2xl`}>
                        {item.metadata.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${rarity.text} truncate`}>{item.metadata.name}</p>
                        <p className="text-xs text-white/50 capitalize">{item.metadata.category}</p>
                        <p className="text-lg font-bold text-white">×{item.amount}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { 
  calculateDrops, 
  IngredientDropAnimation, 
  IngredientPanel, 
  useIngredientInventory,
  FISH_INGREDIENT_DROPS,
  INGREDIENT_METADATA,
  RARITY_COLORS 
};
