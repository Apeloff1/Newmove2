import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// ENHANCED COOKING/CRAFTING SYSTEM - AAA Quality
// Full cooking mini-games, extensive recipes, ingredient management
// ========================================================================

// ==================== INGREDIENT TYPES ====================
const INGREDIENTS = {
  // Fish ingredients (from catches)
  MINNOW_FILLET: { id: 'minnow_fillet', name: 'Minnow Fillet', icon: '🐟', rarity: 'common', type: 'fish', description: 'Small but flavorful', cookingValue: 5 },
  PERCH_FILLET: { id: 'perch_fillet', name: 'Perch Fillet', icon: '🐠', rarity: 'common', type: 'fish', description: 'Versatile white fish', cookingValue: 10 },
  BASS_FILLET: { id: 'bass_fillet', name: 'Bass Fillet', icon: '🐟', rarity: 'uncommon', type: 'fish', description: 'Rich and meaty', cookingValue: 20 },
  CATFISH_FILLET: { id: 'catfish_fillet', name: 'Catfish Fillet', icon: '🐡', rarity: 'uncommon', type: 'fish', description: 'Perfect for frying', cookingValue: 30 },
  PIKE_FILLET: { id: 'pike_fillet', name: 'Pike Fillet', icon: '🦈', rarity: 'rare', type: 'fish', description: 'Premium quality', cookingValue: 50 },
  GOLDEN_KOI_FILLET: { id: 'golden_koi_fillet', name: 'Golden Koi Fillet', icon: '✨', rarity: 'legendary', type: 'fish', description: 'Legendary ingredient', cookingValue: 200 },
  
  // Vegetables
  SEAWEED: { id: 'seaweed', name: 'Fresh Seaweed', icon: '🌿', rarity: 'common', type: 'vegetable', description: 'Ocean greens', cookingValue: 3 },
  KELP: { id: 'kelp', name: 'Giant Kelp', icon: '🥬', rarity: 'common', type: 'vegetable', description: 'Nutrient rich', cookingValue: 5 },
  SEA_LETTUCE: { id: 'sea_lettuce', name: 'Sea Lettuce', icon: '🥗', rarity: 'uncommon', type: 'vegetable', description: 'Crispy and fresh', cookingValue: 8 },
  OCEAN_MUSHROOM: { id: 'ocean_mushroom', name: 'Ocean Mushroom', icon: '🍄', rarity: 'rare', type: 'vegetable', description: 'Deep sea delicacy', cookingValue: 25 },
  
  // Seasonings
  SEA_SALT: { id: 'sea_salt', name: 'Sea Salt', icon: '🧂', rarity: 'common', type: 'seasoning', description: 'Essential seasoning', cookingValue: 2 },
  LEMON: { id: 'lemon', name: 'Fresh Lemon', icon: '🍋', rarity: 'common', type: 'seasoning', description: 'Adds zest', cookingValue: 4 },
  BUTTER: { id: 'butter', name: 'Creamy Butter', icon: '🧈', rarity: 'common', type: 'seasoning', description: 'Rich flavor', cookingValue: 5 },
  GARLIC: { id: 'garlic', name: 'Fresh Garlic', icon: '🧄', rarity: 'common', type: 'seasoning', description: 'Aromatic', cookingValue: 4 },
  HERBS: { id: 'herbs', name: 'Mixed Herbs', icon: '🌿', rarity: 'uncommon', type: 'seasoning', description: 'Fragrant blend', cookingValue: 8 },
  TRUFFLE_OIL: { id: 'truffle_oil', name: 'Truffle Oil', icon: '🫒', rarity: 'rare', type: 'seasoning', description: 'Luxury finish', cookingValue: 40 },
  DRAGON_SPICE: { id: 'dragon_spice', name: 'Dragon Spice', icon: '🌶️', rarity: 'epic', type: 'seasoning', description: 'Mythical heat', cookingValue: 100 },
  
  // Special ingredients
  PEARL: { id: 'pearl', name: 'Cooking Pearl', icon: '⚪', rarity: 'rare', type: 'special', description: 'Enhances any dish', cookingValue: 50 },
  MERMAID_TEAR: { id: 'mermaid_tear', name: 'Mermaid Tear', icon: '💧', rarity: 'epic', type: 'special', description: 'Magical essence', cookingValue: 150 },
  GOLDEN_SCALE: { id: 'golden_scale', name: 'Golden Scale', icon: '💛', rarity: 'legendary', type: 'special', description: 'Pure gold flavor', cookingValue: 300 },
  
  // Grains & Carbs
  RICE: { id: 'rice', name: 'Sushi Rice', icon: '🍚', rarity: 'common', type: 'carb', description: 'Sticky perfection', cookingValue: 5 },
  NORI: { id: 'nori', name: 'Nori Sheets', icon: '📃', rarity: 'common', type: 'carb', description: 'For wrapping', cookingValue: 4 },
  BREADCRUMBS: { id: 'breadcrumbs', name: 'Panko Crumbs', icon: '🍞', rarity: 'common', type: 'carb', description: 'Crispy coating', cookingValue: 3 },
  PASTA: { id: 'pasta', name: 'Fresh Pasta', icon: '🍝', rarity: 'uncommon', type: 'carb', description: 'Al dente ready', cookingValue: 8 },
};

// ==================== RECIPE DATABASE ====================
const RECIPES = {
  // === BEGINNER RECIPES (Tier 1) ===
  grilled_minnow: {
    id: 'grilled_minnow',
    name: 'Grilled Minnow',
    icon: '🐟🔥',
    tier: 1,
    rarity: 'common',
    description: 'Simple but tasty grilled fish',
    ingredients: [
      { id: 'minnow_fillet', amount: 2 },
      { id: 'sea_salt', amount: 1 },
    ],
    cookingTime: 5,
    difficulty: 'easy',
    reward: { points: 50, xp: 10 },
    unlockLevel: 1,
    miniGame: 'timing',
  },
  fish_soup: {
    id: 'fish_soup',
    name: 'Simple Fish Soup',
    icon: '🥣',
    tier: 1,
    rarity: 'common',
    description: 'Warm and comforting soup',
    ingredients: [
      { id: 'minnow_fillet', amount: 1 },
      { id: 'seaweed', amount: 2 },
      { id: 'sea_salt', amount: 1 },
    ],
    cookingTime: 8,
    difficulty: 'easy',
    reward: { points: 75, xp: 15 },
    unlockLevel: 1,
    miniGame: 'stirring',
  },
  fried_perch: {
    id: 'fried_perch',
    name: 'Fried Perch',
    icon: '🍳',
    tier: 1,
    rarity: 'common',
    description: 'Crispy fried delight',
    ingredients: [
      { id: 'perch_fillet', amount: 1 },
      { id: 'breadcrumbs', amount: 2 },
      { id: 'butter', amount: 1 },
    ],
    cookingTime: 10,
    difficulty: 'easy',
    reward: { points: 100, xp: 20 },
    unlockLevel: 2,
    miniGame: 'flipping',
  },
  
  // === INTERMEDIATE RECIPES (Tier 2) ===
  lemon_bass: {
    id: 'lemon_bass',
    name: 'Lemon Butter Bass',
    icon: '🍋🐟',
    tier: 2,
    rarity: 'uncommon',
    description: 'Elegant citrus fish dish',
    ingredients: [
      { id: 'bass_fillet', amount: 1 },
      { id: 'lemon', amount: 2 },
      { id: 'butter', amount: 2 },
      { id: 'herbs', amount: 1 },
    ],
    cookingTime: 15,
    difficulty: 'medium',
    reward: { points: 200, xp: 40 },
    unlockLevel: 5,
    miniGame: 'seasoning',
  },
  fish_tacos: {
    id: 'fish_tacos',
    name: 'Fish Tacos',
    icon: '🌮',
    tier: 2,
    rarity: 'uncommon',
    description: 'Crispy fish in soft shells',
    ingredients: [
      { id: 'perch_fillet', amount: 2 },
      { id: 'sea_lettuce', amount: 2 },
      { id: 'lemon', amount: 1 },
      { id: 'sea_salt', amount: 1 },
    ],
    cookingTime: 12,
    difficulty: 'medium',
    reward: { points: 175, xp: 35 },
    unlockLevel: 4,
    miniGame: 'assembly',
  },
  sushi_roll: {
    id: 'sushi_roll',
    name: 'Basic Sushi Roll',
    icon: '🍣',
    tier: 2,
    rarity: 'uncommon',
    description: 'Fresh maki roll',
    ingredients: [
      { id: 'bass_fillet', amount: 1 },
      { id: 'rice', amount: 2 },
      { id: 'nori', amount: 1 },
      { id: 'seaweed', amount: 1 },
    ],
    cookingTime: 18,
    difficulty: 'medium',
    reward: { points: 250, xp: 50 },
    unlockLevel: 6,
    miniGame: 'rolling',
  },
  catfish_gumbo: {
    id: 'catfish_gumbo',
    name: 'Catfish Gumbo',
    icon: '🍲',
    tier: 2,
    rarity: 'uncommon',
    description: 'Rich Southern stew',
    ingredients: [
      { id: 'catfish_fillet', amount: 2 },
      { id: 'kelp', amount: 2 },
      { id: 'garlic', amount: 2 },
      { id: 'herbs', amount: 1 },
    ],
    cookingTime: 25,
    difficulty: 'medium',
    reward: { points: 300, xp: 60 },
    unlockLevel: 7,
    miniGame: 'stirring',
  },
  
  // === ADVANCED RECIPES (Tier 3) ===
  pike_en_croute: {
    id: 'pike_en_croute',
    name: 'Pike en Croûte',
    icon: '🥧🐟',
    tier: 3,
    rarity: 'rare',
    description: 'French pastry-wrapped pike',
    ingredients: [
      { id: 'pike_fillet', amount: 1 },
      { id: 'butter', amount: 3 },
      { id: 'herbs', amount: 2 },
      { id: 'breadcrumbs', amount: 2 },
    ],
    cookingTime: 30,
    difficulty: 'hard',
    reward: { points: 500, xp: 100 },
    unlockLevel: 10,
    miniGame: 'precision',
  },
  seafood_paella: {
    id: 'seafood_paella',
    name: 'Seafood Paella',
    icon: '🥘',
    tier: 3,
    rarity: 'rare',
    description: 'Spanish rice masterpiece',
    ingredients: [
      { id: 'bass_fillet', amount: 1 },
      { id: 'catfish_fillet', amount: 1 },
      { id: 'rice', amount: 3 },
      { id: 'garlic', amount: 2 },
      { id: 'herbs', amount: 2 },
    ],
    cookingTime: 35,
    difficulty: 'hard',
    reward: { points: 600, xp: 120 },
    unlockLevel: 12,
    miniGame: 'timing',
  },
  truffle_pike: {
    id: 'truffle_pike',
    name: 'Truffle-Crusted Pike',
    icon: '🍄🐟',
    tier: 3,
    rarity: 'rare',
    description: 'Luxurious truffle experience',
    ingredients: [
      { id: 'pike_fillet', amount: 1 },
      { id: 'truffle_oil', amount: 1 },
      { id: 'butter', amount: 2 },
      { id: 'sea_salt', amount: 1 },
    ],
    cookingTime: 25,
    difficulty: 'hard',
    reward: { points: 750, xp: 150 },
    unlockLevel: 15,
    miniGame: 'seasoning',
  },
  sashimi_platter: {
    id: 'sashimi_platter',
    name: 'Premium Sashimi',
    icon: '🍱',
    tier: 3,
    rarity: 'rare',
    description: 'Artisan raw fish display',
    ingredients: [
      { id: 'bass_fillet', amount: 1 },
      { id: 'pike_fillet', amount: 1 },
      { id: 'seaweed', amount: 2 },
      { id: 'garlic', amount: 1 },
    ],
    cookingTime: 20,
    difficulty: 'hard',
    reward: { points: 550, xp: 110 },
    unlockLevel: 11,
    miniGame: 'slicing',
  },
  
  // === EXPERT RECIPES (Tier 4) ===
  dragons_feast: {
    id: 'dragons_feast',
    name: "Dragon's Feast",
    icon: '🐉🔥',
    tier: 4,
    rarity: 'epic',
    description: 'Legendary spicy dish',
    ingredients: [
      { id: 'pike_fillet', amount: 2 },
      { id: 'dragon_spice', amount: 1 },
      { id: 'truffle_oil', amount: 1 },
      { id: 'herbs', amount: 3 },
    ],
    cookingTime: 45,
    difficulty: 'expert',
    reward: { points: 1500, xp: 300 },
    unlockLevel: 20,
    miniGame: 'precision',
    specialEffect: { buff: 'fire_resistance', duration: 300 },
  },
  pearl_consomme: {
    id: 'pearl_consomme',
    name: 'Pearl Consommé',
    icon: '⚪🥣',
    tier: 4,
    rarity: 'epic',
    description: 'Crystal clear perfection',
    ingredients: [
      { id: 'bass_fillet', amount: 2 },
      { id: 'pearl', amount: 1 },
      { id: 'kelp', amount: 3 },
      { id: 'herbs', amount: 2 },
    ],
    cookingTime: 50,
    difficulty: 'expert',
    reward: { points: 1200, xp: 250 },
    unlockLevel: 18,
    miniGame: 'stirring',
    specialEffect: { buff: 'clarity', duration: 600 },
  },
  mermaids_blessing: {
    id: 'mermaids_blessing',
    name: "Mermaid's Blessing",
    icon: '🧜‍♀️✨',
    tier: 4,
    rarity: 'epic',
    description: 'Enchanted seafood delicacy',
    ingredients: [
      { id: 'pike_fillet', amount: 1 },
      { id: 'mermaid_tear', amount: 1 },
      { id: 'sea_lettuce', amount: 2 },
      { id: 'lemon', amount: 2 },
    ],
    cookingTime: 40,
    difficulty: 'expert',
    reward: { points: 2000, xp: 400 },
    unlockLevel: 22,
    miniGame: 'precision',
    specialEffect: { buff: 'luck_boost', duration: 900 },
  },
  
  // === LEGENDARY RECIPES (Tier 5) ===
  golden_feast: {
    id: 'golden_feast',
    name: 'Golden Feast',
    icon: '👑🍽️',
    tier: 5,
    rarity: 'legendary',
    description: 'The ultimate culinary achievement',
    ingredients: [
      { id: 'golden_koi_fillet', amount: 1 },
      { id: 'golden_scale', amount: 1 },
      { id: 'truffle_oil', amount: 2 },
      { id: 'dragon_spice', amount: 1 },
      { id: 'mermaid_tear', amount: 1 },
    ],
    cookingTime: 120,
    difficulty: 'legendary',
    reward: { points: 10000, xp: 2000 },
    unlockLevel: 30,
    miniGame: 'masterChef',
    specialEffect: { buff: 'golden_aura', duration: 1800 },
  },
  poseidons_platter: {
    id: 'poseidons_platter',
    name: "Poseidon's Platter",
    icon: '🔱🦑',
    tier: 5,
    rarity: 'legendary',
    description: 'Fit for a sea god',
    ingredients: [
      { id: 'golden_koi_fillet', amount: 1 },
      { id: 'pike_fillet', amount: 2 },
      { id: 'pearl', amount: 2 },
      { id: 'ocean_mushroom', amount: 2 },
      { id: 'truffle_oil', amount: 1 },
    ],
    cookingTime: 90,
    difficulty: 'legendary',
    reward: { points: 8000, xp: 1600 },
    unlockLevel: 28,
    miniGame: 'masterChef',
    specialEffect: { buff: 'ocean_mastery', duration: 1200 },
  },
};

// ==================== RARITY COLORS ====================
const RARITY_COLORS = {
  common: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-300', border: 'border-gray-400', glow: 'shadow-gray-500/30' },
  uncommon: { bg: 'from-green-500 to-emerald-600', text: 'text-green-300', border: 'border-green-400', glow: 'shadow-green-500/30' },
  rare: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-300', border: 'border-blue-400', glow: 'shadow-blue-500/30' },
  epic: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-300', border: 'border-purple-400', glow: 'shadow-purple-500/30' },
  legendary: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-300', border: 'border-yellow-400', glow: 'shadow-yellow-500/30' },
};

const DIFFICULTY_COLORS = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-orange-400',
  expert: 'text-red-400',
  legendary: 'text-purple-400',
};

// ==================== MINI-GAME COMPONENT ====================
const CookingMiniGame = ({ type, onComplete, recipe }) => {
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [target, setTarget] = useState(null);
  const [hits, setHits] = useState(0);
  const [progress, setProgress] = useState(0);
  const gameRef = useRef(null);
  
  // Start game
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setTimer(t => {
          if (t <= 0) {
            setGameState('complete');
            return 0;
          }
          return t - 0.1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState]);
  
  // Complete callback
  useEffect(() => {
    if (gameState === 'complete') {
      const qualityScore = Math.min(100, score);
      setTimeout(() => onComplete(qualityScore), 1000);
    }
  }, [gameState, score, onComplete]);
  
  // Generate targets for timing game
  useEffect(() => {
    if (gameState === 'playing' && type === 'timing') {
      const interval = setInterval(() => {
        setTarget({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          active: true,
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [gameState, type]);
  
  const handleTimingClick = (e) => {
    if (!target?.active) return;
    const rect = gameRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    const dist = Math.sqrt(Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2));
    
    if (dist < 15) {
      setScore(s => s + 20);
      setHits(h => h + 1);
      setTarget({ ...target, active: false });
    }
  };
  
  // Stirring mini-game
  const [stirAngle, setStirAngle] = useState(0);
  const [stirSpeed, setStirSpeed] = useState(0);
  
  const handleStir = (e) => {
    if (gameState !== 'playing') return;
    const rect = gameRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const angleDiff = Math.abs(newAngle - stirAngle);
    
    if (angleDiff > 0.1) {
      setStirAngle(newAngle);
      setStirSpeed(s => Math.min(100, s + 2));
      setProgress(p => Math.min(100, p + 1));
      setScore(s => s + 1);
    }
  };
  
  // Flipping mini-game
  const [flipPhase, setFlipPhase] = useState(0);
  const [flipPower, setFlipPower] = useState(0);
  
  const handleFlip = () => {
    if (gameState !== 'playing') return;
    
    if (flipPhase === 0) {
      setFlipPhase(1);
      const powerInterval = setInterval(() => {
        setFlipPower(p => {
          if (p >= 100) {
            clearInterval(powerInterval);
            return 100;
          }
          return p + 5;
        });
      }, 50);
    } else if (flipPhase === 1) {
      const accuracy = 100 - Math.abs(50 - flipPower);
      setScore(s => s + accuracy);
      setHits(h => h + 1);
      setFlipPower(0);
      setFlipPhase(0);
      
      if (hits >= 2) {
        setGameState('complete');
      }
    }
  };
  
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimer(10);
    setHits(0);
    setProgress(0);
  };
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90" data-testid="cooking-minigame">
      <div className="w-full max-w-lg bg-gradient-to-b from-amber-900 to-orange-900 rounded-3xl p-6 border-4 border-orange-500/50">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white font-pixel">
            {type === 'timing' ? '⏱️ PERFECT TIMING' : 
             type === 'stirring' ? '🥄 KEEP STIRRING' :
             type === 'flipping' ? '🍳 FLIP IT!' :
             '👨‍🍳 COOKING CHALLENGE'}
          </h3>
          <p className="text-sm text-orange-200">Making: {recipe?.name}</p>
        </div>
        
        {/* Game Area */}
        <div 
          ref={gameRef}
          className="relative w-full h-64 bg-black/40 rounded-2xl overflow-hidden mb-4 cursor-pointer"
          onClick={type === 'timing' ? handleTimingClick : type === 'flipping' ? handleFlip : undefined}
          onMouseMove={type === 'stirring' ? handleStir : undefined}
        >
          {gameState === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white text-lg mb-4">
                {type === 'timing' ? 'Click the targets!' :
                 type === 'stirring' ? 'Move mouse in circles!' :
                 type === 'flipping' ? 'Click to flip at the right power!' :
                 'Complete the challenge!'}
              </p>
              <button 
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
              >
                START
              </button>
            </div>
          )}
          
          {gameState === 'playing' && type === 'timing' && target?.active && (
            <div 
              className="absolute w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse flex items-center justify-center text-2xl"
              style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              🎯
            </div>
          )}
          
          {gameState === 'playing' && type === 'stirring' && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-32 h-32 border-4 border-dashed border-white/30 rounded-full"
                  style={{ transform: `rotate(${stirAngle}rad)` }}
                >
                  <div className="absolute top-0 left-1/2 w-4 h-4 bg-orange-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          )}
          
          {gameState === 'playing' && type === 'flipping' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4" style={{ transform: flipPhase === 1 ? 'rotateY(180deg)' : 'none', transition: 'transform 0.3s' }}>
                🐟
              </div>
              <div className="w-48 h-6 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all"
                  style={{ width: `${flipPower}%` }}
                />
              </div>
              <p className="text-white mt-2">
                {flipPhase === 0 ? 'Click to charge!' : 'Click at 50% for perfect flip!'}
              </p>
            </div>
          )}
          
          {gameState === 'complete' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <p className="text-4xl mb-2">
                {score >= 80 ? '⭐⭐⭐' : score >= 50 ? '⭐⭐' : '⭐'}
              </p>
              <p className="text-2xl font-bold text-white">
                {score >= 80 ? 'PERFECT!' : score >= 50 ? 'GREAT!' : 'GOOD!'}
              </p>
              <p className="text-lg text-orange-300">Quality: {Math.min(100, score)}%</p>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex justify-between text-white">
          <div>
            <p className="text-xs text-white/50">Time</p>
            <p className="text-xl font-bold">{timer.toFixed(1)}s</p>
          </div>
          <div>
            <p className="text-xs text-white/50">Score</p>
            <p className="text-xl font-bold text-yellow-400">{score}</p>
          </div>
          <div>
            <p className="text-xs text-white/50">Hits</p>
            <p className="text-xl font-bold text-green-400">{hits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== INGREDIENT CARD ====================
const IngredientCard = ({ ingredient, count, needed, compact = false }) => {
  const ing = INGREDIENTS[ingredient?.toUpperCase()] || INGREDIENTS[ingredient];
  const hasEnough = count >= (needed || 0);
  const rarity = RARITY_COLORS[ing?.rarity || 'common'];
  
  if (compact) {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${hasEnough ? 'bg-green-900/30' : 'bg-red-900/30'} border ${hasEnough ? 'border-green-500/30' : 'border-red-500/30'}`}>
        <span className="text-lg">{ing?.icon || '❓'}</span>
        <span className={`text-xs ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
          {count}/{needed}
        </span>
      </div>
    );
  }
  
  return (
    <div className={`p-3 rounded-xl ${hasEnough ? 'bg-green-900/20' : 'bg-red-900/20'} border ${hasEnough ? 'border-green-500/30' : 'border-red-500/30'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rarity.bg} flex items-center justify-center text-xl`}>
          {ing?.icon || '❓'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{ing?.name || ingredient}</p>
          <p className="text-xs text-white/50">{ing?.type}</p>
        </div>
        <div className={`text-sm font-bold ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
          {count}/{needed}
        </div>
      </div>
    </div>
  );
};

// ==================== RECIPE CARD ====================
const RecipeCard = ({ recipe, inventory, onCook, isCooking, cookingLevel }) => {
  const rarity = RARITY_COLORS[recipe.rarity];
  const isUnlocked = cookingLevel >= recipe.unlockLevel;
  
  const canCraft = isUnlocked && recipe.ingredients.every(
    mat => (inventory[mat.id] || 0) >= mat.amount
  );
  
  return (
    <div className={`rounded-2xl border-2 ${rarity.border} bg-gradient-to-br ${rarity.bg}/20 p-4 transition-all hover:scale-[1.02] ${!isUnlocked ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rarity.bg} flex items-center justify-center text-3xl ${rarity.glow} shadow-lg`}>
          {recipe.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${rarity.text}`}>{recipe.name}</h3>
          <p className="text-xs text-white/50 line-clamp-1">{recipe.description}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${rarity.bg} text-white uppercase`}>
              {recipe.rarity}
            </span>
            <span className={`text-[10px] ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            <span className="text-[10px] text-white/40">Tier {recipe.tier}</span>
          </div>
        </div>
      </div>
      
      {/* Ingredients */}
      <div className="flex flex-wrap gap-1 mb-3">
        {recipe.ingredients.map((mat, i) => (
          <IngredientCard
            key={i}
            ingredient={mat.id}
            count={inventory[mat.id] || 0}
            needed={mat.amount}
            compact
          />
        ))}
      </div>
      
      {/* Rewards */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        <span className="text-yellow-400">💰 {recipe.reward.points}</span>
        <span className="text-cyan-400">✨ {recipe.reward.xp} XP</span>
        <span className="text-white/40">⏱️ {recipe.cookingTime}s</span>
      </div>
      
      {/* Special Effect */}
      {recipe.specialEffect && (
        <div className="mb-3 px-2 py-1 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <p className="text-xs text-purple-300">
            ✨ Grants: {recipe.specialEffect.buff} ({recipe.specialEffect.duration}s)
          </p>
        </div>
      )}
      
      {/* Cook Button */}
      <button
        onClick={() => onCook(recipe)}
        disabled={!canCraft || isCooking}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          !isUnlocked
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : canCraft && !isCooking
              ? `bg-gradient-to-r ${rarity.bg} text-white hover:opacity-90 hover:scale-[1.02]`
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {!isUnlocked 
          ? `🔒 Unlock at Lv.${recipe.unlockLevel}` 
          : isCooking 
            ? '⏳ Cooking...' 
            : `🍳 Cook (${recipe.cookingTime}s)`}
      </button>
    </div>
  );
};

// ==================== COOKING PROGRESS ====================
const CookingProgress = ({ recipe, progress, quality, onCancel }) => {
  const rarity = RARITY_COLORS[recipe.rarity];
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-5 border-2 border-orange-500/50 shadow-2xl z-50">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rarity.bg} flex items-center justify-center text-3xl animate-bounce`}>
          {recipe.icon}
        </div>
        <div className="flex-1">
          <p className={`font-bold ${rarity.text}`}>{recipe.name}</p>
          <p className="text-xs text-white/50">Cooking in progress...</p>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-red-500/50 hover:bg-red-500 text-white text-xl font-bold"
        >
          ×
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-4 bg-black/40 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full bg-gradient-to-r ${rarity.bg} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs">
        <span className="text-white/50">{Math.round(progress)}%</span>
        {quality > 0 && (
          <span className="text-yellow-400">Quality: {quality}%</span>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN COOKING SYSTEM ====================
const EnhancedCookingSystem = ({ onClose }) => {
  const store = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cookingLevel, setCookingLevel] = useState(15); // Demo level
  const [cookingXP, setCookingXP] = useState(450);
  const [xpToNextLevel, setXpToNextLevel] = useState(1000);
  
  // Inventory state (demo data)
  const [inventory, setInventory] = useState({
    minnow_fillet: 50,
    perch_fillet: 30,
    bass_fillet: 15,
    catfish_fillet: 10,
    pike_fillet: 5,
    golden_koi_fillet: 1,
    seaweed: 40,
    kelp: 25,
    sea_lettuce: 15,
    ocean_mushroom: 3,
    sea_salt: 60,
    lemon: 30,
    butter: 40,
    garlic: 25,
    herbs: 20,
    truffle_oil: 2,
    dragon_spice: 1,
    pearl: 2,
    mermaid_tear: 1,
    golden_scale: 0,
    rice: 35,
    nori: 20,
    breadcrumbs: 30,
    pasta: 15,
  });
  
  const [cookingItem, setCookingItem] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [cookingQuality, setCookingQuality] = useState(0);
  const [cookedDishes, setCookedDishes] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  
  // Load saved cooking data
  useEffect(() => {
    const saved = localStorage.getItem('gofish_cooking_v2');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.level) setCookingLevel(data.level);
      if (data.xp) setCookingXP(data.xp);
      if (data.inventory) setInventory({ ...inventory, ...data.inventory });
    }
  }, []);
  
  // Save cooking data
  const saveData = useCallback(() => {
    localStorage.setItem('gofish_cooking_v2', JSON.stringify({
      level: cookingLevel,
      xp: cookingXP,
      inventory,
    }));
  }, [cookingLevel, cookingXP, inventory]);
  
  // Filter recipes
  const filteredRecipes = useMemo(() => {
    const recipes = Object.values(RECIPES);
    if (selectedCategory === 'all') return recipes;
    if (selectedCategory === 'unlocked') return recipes.filter(r => cookingLevel >= r.unlockLevel);
    return recipes.filter(r => r.tier === parseInt(selectedCategory));
  }, [selectedCategory, cookingLevel]);
  
  // Start cooking
  const handleCook = useCallback((recipe) => {
    setCurrentRecipe(recipe);
    setShowMiniGame(true);
  }, []);
  
  // Mini-game complete
  const handleMiniGameComplete = useCallback((quality) => {
    setShowMiniGame(false);
    setCookingQuality(quality);
    
    // Deduct ingredients
    const newInventory = { ...inventory };
    currentRecipe.ingredients.forEach(mat => {
      newInventory[mat.id] -= mat.amount;
    });
    setInventory(newInventory);
    
    // Start cooking progress
    setCookingItem(currentRecipe.id);
    setCookingProgress(0);
    
    const interval = setInterval(() => {
      setCookingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Calculate rewards based on quality
          const qualityMult = 0.5 + (quality / 100);
          const points = Math.round(currentRecipe.reward.points * qualityMult);
          const xp = Math.round(currentRecipe.reward.xp * qualityMult);
          
          store.addScore(points);
          setCookingXP(prev => {
            const newXP = prev + xp;
            if (newXP >= xpToNextLevel) {
              setCookingLevel(l => l + 1);
              setXpToNextLevel(x => Math.round(x * 1.5));
              return newXP - xpToNextLevel;
            }
            return newXP;
          });
          
          setCookedDishes(prev => [...prev, { ...currentRecipe, quality }]);
          setCookingItem(null);
          setCurrentRecipe(null);
          setCookingQuality(0);
          saveData();
          
          return 0;
        }
        return prev + (100 / currentRecipe.cookingTime);
      });
    }, 1000);
  }, [currentRecipe, inventory, store, xpToNextLevel, saveData]);
  
  // Cancel cooking
  const handleCancelCook = useCallback(() => {
    setCookingItem(null);
    setCookingProgress(0);
    setCurrentRecipe(null);
  }, []);
  
  const categories = [
    { id: 'all', name: '📋 All', count: Object.keys(RECIPES).length },
    { id: 'unlocked', name: '✅ Unlocked', count: Object.values(RECIPES).filter(r => cookingLevel >= r.unlockLevel).length },
    { id: '1', name: '⭐ Tier 1' },
    { id: '2', name: '⭐⭐ Tier 2' },
    { id: '3', name: '⭐⭐⭐ Tier 3' },
    { id: '4', name: '💎 Tier 4' },
    { id: '5', name: '👑 Tier 5' },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" data-testid="enhanced-cooking">
      <div className="w-full max-w-6xl max-h-[95vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-bounce">🍳</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">COOKING STATION</h2>
              <p className="text-sm text-orange-200">Transform catches into culinary masterpieces</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-white/50">Chef Level</p>
              <p className="text-xl font-bold text-white">{cookingLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50">XP</p>
              <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                  style={{ width: `${(cookingXP / xpToNextLevel) * 100}%` }}
                />
              </div>
              <p className="text-xs text-orange-300">{cookingXP}/{xpToNextLevel}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50">×</button>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="p-4 bg-black/30 border-b border-white/10 flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-xs text-white/50">Dishes Cooked</p>
              <p className="text-lg font-bold text-white">{cookedDishes.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-xs text-white/50">Recipes Unlocked</p>
              <p className="text-lg font-bold text-cyan-400">
                {Object.values(RECIPES).filter(r => cookingLevel >= r.unlockLevel).length}/{Object.keys(RECIPES).length}
              </p>
            </div>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-all"
          >
            🎒 {showInventory ? 'Hide' : 'Show'} Inventory
          </button>
        </div>
        
        {/* Inventory panel */}
        {showInventory && (
          <div className="p-4 bg-amber-900/20 border-b border-orange-500/20 max-h-40 overflow-y-auto shrink-0">
            <p className="text-xs text-orange-400 mb-2 font-bold uppercase">Your Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(inventory).filter(([_, v]) => v > 0).map(([key, value]) => {
                const ing = INGREDIENTS[key.toUpperCase()] || INGREDIENTS[key];
                if (!ing) return null;
                return (
                  <div key={key} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-xs">
                    <span>{ing.icon}</span>
                    <span className="text-white/70">{ing.name}</span>
                    <span className="text-yellow-400 font-bold">×{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Category tabs */}
        <div className="p-4 border-b border-white/10 overflow-x-auto shrink-0">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {cat.name}
                {cat.count !== undefined && (
                  <span className="ml-1 text-xs opacity-60">({cat.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Recipe grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                inventory={inventory}
                onCook={handleCook}
                isCooking={cookingItem === recipe.id}
                cookingLevel={cookingLevel}
              />
            ))}
          </div>
        </div>
        
        {/* Recent dishes */}
        {cookedDishes.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-green-900/20 shrink-0">
            <p className="text-xs text-green-400 mb-2 uppercase tracking-wider font-bold">Recently Cooked</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {cookedDishes.slice(-8).reverse().map((dish, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-16 h-16 rounded-xl bg-green-900/50 flex flex-col items-center justify-center"
                  title={`${dish.name} (${dish.quality}% quality)`}
                >
                  <span className="text-2xl">{dish.icon}</span>
                  <span className="text-[10px] text-yellow-400">
                    {dish.quality >= 80 ? '⭐⭐⭐' : dish.quality >= 50 ? '⭐⭐' : '⭐'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Cooking progress overlay */}
        {cookingItem && currentRecipe && (
          <CookingProgress
            recipe={currentRecipe}
            progress={cookingProgress}
            quality={cookingQuality}
            onCancel={handleCancelCook}
          />
        )}
        
        {/* Mini-game overlay */}
        {showMiniGame && currentRecipe && (
          <CookingMiniGame
            type={currentRecipe.miniGame}
            recipe={currentRecipe}
            onComplete={handleMiniGameComplete}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedCookingSystem;
export { INGREDIENTS, RECIPES, RARITY_COLORS };
