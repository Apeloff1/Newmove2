import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// CROSS-SYSTEM BONUS MANAGER
// Integrates Skills, Cooking, and Achievements for synergistic bonuses
// ========================================================================

// ==================== BONUS CONTEXT ====================
const BonusContext = createContext(null);

// ==================== SKILL BONUS DEFINITIONS ====================
const SKILL_BONUSES = {
  // Casting bonuses
  casting: {
    effect: 'castDistance',
    perLevel: 0.05,
    description: 'Increases cast distance',
  },
  castPower: {
    effect: 'biteChance',
    perLevel: 0.03,
    description: 'Higher bite chance',
  },
  
  // Reeling bonuses
  reeling: {
    effect: 'reelSpeed',
    perLevel: 0.04,
    description: 'Faster reeling',
  },
  tensionControl: {
    effect: 'tensionReduction',
    perLevel: 0.05,
    description: 'Less tension buildup',
  },
  
  // Patience bonuses
  patience: {
    effect: 'rareChance',
    perLevel: 0.02,
    description: 'Better rare fish odds',
  },
  meditation: {
    effect: 'xpBonus',
    perLevel: 0.08,
    description: 'More XP per catch',
  },
  
  // Strength bonuses
  strength: {
    effect: 'fishSizeBonus',
    perLevel: 0.05,
    description: 'Catch bigger fish',
  },
  
  // Luck bonuses
  luck: {
    effect: 'luckMultiplier',
    perLevel: 0.04,
    description: 'Better overall luck',
  },
  treasureFind: {
    effect: 'treasureChance',
    perLevel: 0.03,
    description: 'Find treasures while fishing',
  },
  
  // Cooking bonuses
  cookingSpeed: {
    effect: 'cookTime',
    perLevel: -0.05, // Negative = reduction
    description: 'Faster cooking',
  },
  dishQuality: {
    effect: 'qualityBonus',
    perLevel: 0.08,
    description: 'Better dish quality',
  },
  ingredientBonus: {
    effect: 'ingredientMultiplier',
    perLevel: 0.06,
    description: 'More ingredients from fish',
  },
  
  // Exploration bonuses
  exploration: {
    effect: 'spotBonus',
    perLevel: 0.05,
    description: 'Better fishing spots',
  },
  nightVision: {
    effect: 'nightBonus',
    perLevel: 0.1,
    description: 'Better night fishing',
  },
};

// ==================== ACHIEVEMENT BONUSES ====================
const ACHIEVEMENT_BONUSES = {
  // Fishing achievements
  catch_100: { effect: 'catchBonus', value: 0.05, description: '+5% catch bonus' },
  catch_500: { effect: 'catchBonus', value: 0.1, description: '+10% catch bonus' },
  catch_1000: { effect: 'catchBonus', value: 0.2, description: '+20% catch bonus' },
  
  // Perfect catch achievements
  perfect_10: { effect: 'perfectMultiplier', value: 0.1, description: '+10% perfect bonus' },
  perfect_50: { effect: 'perfectMultiplier', value: 0.2, description: '+20% perfect bonus' },
  perfect_100: { effect: 'perfectMultiplier', value: 0.35, description: '+35% perfect bonus' },
  
  // Combo achievements
  combo_10: { effect: 'comboMultiplier', value: 0.15, description: '+15% combo bonus' },
  combo_20: { effect: 'comboMultiplier', value: 0.25, description: '+25% combo bonus' },
  combo_50: { effect: 'comboMultiplier', value: 0.5, description: '+50% combo bonus' },
  
  // Collection achievements
  collect_rare: { effect: 'rareChance', value: 0.02, description: '+2% rare chance' },
  collect_epic: { effect: 'epicChance', value: 0.01, description: '+1% epic chance' },
  collect_legendary: { effect: 'legendaryChance', value: 0.005, description: '+0.5% legendary chance' },
  
  // Cooking achievements
  cook_10: { effect: 'cookingXP', value: 0.1, description: '+10% cooking XP' },
  cook_50: { effect: 'cookingXP', value: 0.2, description: '+20% cooking XP' },
  perfect_dish: { effect: 'perfectDishChance', value: 0.1, description: '+10% perfect dish chance' },
  legendary_dish: { effect: 'legendaryRecipeBonus', value: 0.3, description: '+30% legendary dish bonus' },
  
  // Level achievements
  level_10: { effect: 'xpGain', value: 0.05, description: '+5% XP gain' },
  level_25: { effect: 'xpGain', value: 0.1, description: '+10% XP gain' },
  level_50: { effect: 'xpGain', value: 0.2, description: '+20% XP gain' },
  level_100: { effect: 'xpGain', value: 0.5, description: '+50% XP gain' },
};

// ==================== SYNERGY BONUSES ====================
const SYNERGY_BONUSES = {
  // Fishing + Cooking synergy
  angler_chef: {
    requires: { skills: ['casting_4', 'cooking_4'], achievements: ['catch_100', 'cook_10'] },
    effect: { ingredientMultiplier: 0.25, cookingXP: 0.15 },
    name: 'Angler Chef',
    description: 'Master of both rod and pan',
    icon: '👨‍🍳🎣',
  },
  
  // Patience + Luck synergy
  fortune_seeker: {
    requires: { skills: ['patience_3', 'luck_3'], achievements: ['collect_rare'] },
    effect: { rareChance: 0.1, treasureChance: 0.05 },
    name: 'Fortune Seeker',
    description: 'Patience reveals treasures',
    icon: '🍀⏳',
  },
  
  // Strength + Reeling synergy
  beast_tamer: {
    requires: { skills: ['strength_4', 'reeling_4'], achievements: ['catch_500'] },
    effect: { fishSizeBonus: 0.2, tensionReduction: 0.15 },
    name: 'Beast Tamer',
    description: 'No fish is too big',
    icon: '💪🐋',
  },
  
  // All skills synergy
  master_angler: {
    requires: { skills: ['casting_5', 'reeling_5', 'patience_5', 'strength_5', 'luck_5'] },
    effect: { allBonus: 0.15 },
    name: 'Master Angler',
    description: 'True fishing mastery',
    icon: '👑🎣',
  },
  
  // Cooking mastery
  culinary_legend: {
    requires: { skills: ['cooking_6', 'cooking_7'], achievements: ['cook_50', 'perfect_dish'] },
    effect: { qualityBonus: 0.4, cookTime: -0.3 },
    name: 'Culinary Legend',
    description: 'Kitchen virtuoso',
    icon: '👨‍🍳⭐',
  },
  
  // Explorer synergy
  world_explorer: {
    requires: { skills: ['exploration_4', 'exploration_5'], achievements: ['all_stages'] },
    effect: { spotBonus: 0.3, nightBonus: 0.2, stormBonus: 0.2 },
    name: 'World Explorer',
    description: 'No waters unexplored',
    icon: '🗺️🌍',
  },
  
  // Combo master
  combo_king: {
    requires: { skills: ['reeling_3', 'patience_3'], achievements: ['combo_20'] },
    effect: { comboMultiplier: 0.3, comboMaintain: 0.2 },
    name: 'Combo King',
    description: 'Unstoppable combo chains',
    icon: '🔥👑',
  },
  
  // Perfect catcher
  perfectionist: {
    requires: { skills: ['casting_4', 'reeling_4'], achievements: ['perfect_50'] },
    effect: { perfectChance: 0.15, perfectMultiplier: 0.25 },
    name: 'Perfectionist',
    description: 'Every catch is perfect',
    icon: '✨💎',
  },
  
  // Legendary hunter
  legend_hunter: {
    requires: { skills: ['patience_6', 'luck_6'], achievements: ['golden_koi'] },
    effect: { legendaryChance: 0.05, legendaryPoints: 0.5 },
    name: 'Legend Hunter',
    description: 'Seeker of mythical fish',
    icon: '🏆🐉',
  },
  
  // Night master
  night_lord: {
    requires: { skills: ['exploration_3', 'patience_4'], achievements: ['night_fisher_10'] },
    effect: { nightBonus: 0.4, rareChance: 0.08 },
    name: 'Night Lord',
    description: 'Master of nocturnal waters',
    icon: '🌙🦉',
  },
};

// ==================== BUFF SYSTEM ====================
const ACTIVE_BUFFS = {
  // Food buffs from cooking
  grilled_minnow_buff: {
    effect: { castDistance: 0.05 },
    duration: 300, // 5 minutes
    icon: '🐟',
    name: 'Simple Meal',
  },
  lemon_bass_buff: {
    effect: { biteChance: 0.1, reelSpeed: 0.05 },
    duration: 600,
    icon: '🍋',
    name: 'Citrus Boost',
  },
  dragons_feast_buff: {
    effect: { allBonus: 0.15, rareChance: 0.1 },
    duration: 900,
    icon: '🐉',
    name: "Dragon's Power",
  },
  golden_feast_buff: {
    effect: { legendaryChance: 0.03, allBonus: 0.25, xpGain: 0.5 },
    duration: 1800,
    icon: '👑',
    name: 'Golden Aura',
  },
  poseidons_platter_buff: {
    effect: { allBonus: 0.2, treasureChance: 0.15, perfectChance: 0.1 },
    duration: 1200,
    icon: '🔱',
    name: "Poseidon's Blessing",
  },
  
  // Combo buffs (automatically applied)
  combo_fire: {
    effect: { comboMultiplier: 0.1 },
    duration: 60,
    icon: '🔥',
    name: 'Combo Fire',
  },
  
  // Event buffs
  double_xp: {
    effect: { xpGain: 1.0 },
    duration: 3600,
    icon: '✨',
    name: 'Double XP',
  },
  lucky_hour: {
    effect: { luckMultiplier: 0.5, treasureChance: 0.1 },
    duration: 3600,
    icon: '🍀',
    name: 'Lucky Hour',
  },
};

// ==================== BONUS CALCULATOR ====================
const calculateTotalBonuses = (skills = {}, achievements = [], activeBuffs = []) => {
  const bonuses = {};
  
  // Add skill bonuses
  Object.entries(skills).forEach(([skillId, level]) => {
    if (level > 0) {
      const skillDef = SKILL_BONUSES[skillId];
      if (skillDef) {
        const effectKey = skillDef.effect;
        bonuses[effectKey] = (bonuses[effectKey] || 0) + (skillDef.perLevel * level);
      }
    }
  });
  
  // Add achievement bonuses
  achievements.forEach(achId => {
    const achBonus = ACHIEVEMENT_BONUSES[achId];
    if (achBonus) {
      bonuses[achBonus.effect] = (bonuses[achBonus.effect] || 0) + achBonus.value;
    }
  });
  
  // Check and add synergy bonuses
  Object.entries(SYNERGY_BONUSES).forEach(([synergyId, synergy]) => {
    let meetsRequirements = true;
    
    // Check skill requirements
    if (synergy.requires.skills) {
      synergy.requires.skills.forEach(skillReq => {
        const [skillId, reqLevel] = skillReq.includes('_') 
          ? [skillReq.slice(0, skillReq.lastIndexOf('_')), parseInt(skillReq.slice(skillReq.lastIndexOf('_') + 1))]
          : [skillReq, 1];
        if ((skills[skillId] || 0) < reqLevel) {
          meetsRequirements = false;
        }
      });
    }
    
    // Check achievement requirements
    if (synergy.requires.achievements) {
      synergy.requires.achievements.forEach(achId => {
        if (!achievements.includes(achId)) {
          meetsRequirements = false;
        }
      });
    }
    
    // Apply synergy bonuses
    if (meetsRequirements) {
      Object.entries(synergy.effect).forEach(([effectKey, value]) => {
        bonuses[effectKey] = (bonuses[effectKey] || 0) + value;
      });
      bonuses._synergies = bonuses._synergies || [];
      bonuses._synergies.push(synergyId);
    }
  });
  
  // Add active buff bonuses
  activeBuffs.forEach(buff => {
    const buffDef = ACTIVE_BUFFS[buff.id];
    if (buffDef && buff.remaining > 0) {
      Object.entries(buffDef.effect).forEach(([effectKey, value]) => {
        bonuses[effectKey] = (bonuses[effectKey] || 0) + value;
      });
      bonuses._buffs = bonuses._buffs || [];
      bonuses._buffs.push(buff.id);
    }
  });
  
  return bonuses;
};

// ==================== BONUS PROVIDER ====================
const BonusProvider = ({ children }) => {
  const store = useGameStore();
  const [skills, setSkills] = useState({});
  const [activeBuffs, setActiveBuffs] = useState([]);
  
  // Load skills from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gofish_skills_v2');
    if (saved) {
      setSkills(JSON.parse(saved));
    }
  }, []);
  
  // Load buffs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gofish_buffs_v2');
    if (saved) {
      const buffs = JSON.parse(saved);
      // Filter out expired buffs
      const now = Date.now();
      const validBuffs = buffs.filter(b => b.expiresAt > now);
      setActiveBuffs(validBuffs.map(b => ({
        ...b,
        remaining: Math.ceil((b.expiresAt - now) / 1000)
      })));
    }
  }, []);
  
  // Tick down buff timers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBuffs(prev => {
        const updated = prev
          .map(b => ({ ...b, remaining: b.remaining - 1 }))
          .filter(b => b.remaining > 0);
        localStorage.setItem('gofish_buffs_v2', JSON.stringify(
          updated.map(b => ({ id: b.id, expiresAt: Date.now() + b.remaining * 1000 }))
        ));
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Add a buff
  const addBuff = useCallback((buffId, durationOverride = null) => {
    const buffDef = ACTIVE_BUFFS[buffId];
    if (!buffDef) return;
    
    const duration = durationOverride || buffDef.duration;
    setActiveBuffs(prev => {
      // Remove existing buff of same type
      const filtered = prev.filter(b => b.id !== buffId);
      const newBuff = {
        id: buffId,
        remaining: duration,
        expiresAt: Date.now() + duration * 1000
      };
      const updated = [...filtered, newBuff];
      localStorage.setItem('gofish_buffs_v2', JSON.stringify(
        updated.map(b => ({ id: b.id, expiresAt: b.expiresAt }))
      ));
      return updated;
    });
  }, []);
  
  // Calculate current bonuses
  const bonuses = useMemo(() => {
    return calculateTotalBonuses(skills, store.achievements || [], activeBuffs);
  }, [skills, store.achievements, activeBuffs]);
  
  // Get specific bonus value
  const getBonus = useCallback((effectKey, defaultValue = 0) => {
    return bonuses[effectKey] || defaultValue;
  }, [bonuses]);
  
  // Apply bonus to a value
  const applyBonus = useCallback((baseValue, effectKey) => {
    const bonus = bonuses[effectKey] || 0;
    return baseValue * (1 + bonus);
  }, [bonuses]);
  
  const value = {
    skills,
    setSkills,
    activeBuffs,
    addBuff,
    bonuses,
    getBonus,
    applyBonus,
  };
  
  return (
    <BonusContext.Provider value={value}>
      {children}
    </BonusContext.Provider>
  );
};

// ==================== HOOK ====================
const useBonuses = () => {
  const context = useContext(BonusContext);
  if (!context) {
    throw new Error('useBonuses must be used within BonusProvider');
  }
  return context;
};

// ==================== BONUS DISPLAY COMPONENT ====================
const BonusDisplay = ({ compact = false }) => {
  const { bonuses, activeBuffs } = useBonuses();
  const [expanded, setExpanded] = useState(false);
  
  const activeSynergies = bonuses._synergies || [];
  const activeBuffIds = bonuses._buffs || [];
  
  // Filter to show only significant bonuses
  const significantBonuses = Object.entries(bonuses)
    .filter(([key, value]) => !key.startsWith('_') && Math.abs(value) >= 0.01)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {activeBuffs.slice(0, 3).map(buff => {
          const def = ACTIVE_BUFFS[buff.id];
          return (
            <div 
              key={buff.id}
              className="px-2 py-1 bg-purple-900/50 rounded-lg border border-purple-500/30 flex items-center gap-1"
              title={`${def?.name}: ${Math.floor(buff.remaining / 60)}:${(buff.remaining % 60).toString().padStart(2, '0')}`}
            >
              <span>{def?.icon}</span>
              <span className="text-xs text-purple-300">{Math.floor(buff.remaining / 60)}m</span>
            </div>
          );
        })}
        {activeSynergies.length > 0 && (
          <div className="px-2 py-1 bg-yellow-900/50 rounded-lg border border-yellow-500/30">
            <span className="text-xs text-yellow-300">⚡{activeSynergies.length}</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>⚡</span> Active Bonuses
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-white/50 hover:text-white"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>
      
      {/* Active Buffs */}
      {activeBuffs.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-white/50 mb-2">Buffs</p>
          <div className="flex flex-wrap gap-2">
            {activeBuffs.map(buff => {
              const def = ACTIVE_BUFFS[buff.id];
              return (
                <div 
                  key={buff.id}
                  className="px-3 py-2 bg-black/30 rounded-lg border border-purple-500/30 flex items-center gap-2"
                >
                  <span className="text-xl">{def?.icon}</span>
                  <div>
                    <p className="text-xs text-white font-bold">{def?.name}</p>
                    <p className="text-xs text-purple-300">
                      {Math.floor(buff.remaining / 60)}:{(buff.remaining % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Active Synergies */}
      {activeSynergies.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-white/50 mb-2">Synergies</p>
          <div className="flex flex-wrap gap-2">
            {activeSynergies.map(synergyId => {
              const synergy = SYNERGY_BONUSES[synergyId];
              return (
                <div 
                  key={synergyId}
                  className="px-3 py-2 bg-yellow-900/30 rounded-lg border border-yellow-500/30 flex items-center gap-2"
                >
                  <span className="text-xl">{synergy.icon}</span>
                  <div>
                    <p className="text-xs text-yellow-300 font-bold">{synergy.name}</p>
                    <p className="text-[10px] text-white/50">{synergy.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Bonus Summary */}
      {expanded && significantBonuses.length > 0 && (
        <div>
          <p className="text-xs text-white/50 mb-2">Total Bonuses</p>
          <div className="grid grid-cols-2 gap-2">
            {significantBonuses.slice(0, 8).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                  {value > 0 ? '+' : ''}{(value * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {significantBonuses.length === 0 && activeBuffs.length === 0 && activeSynergies.length === 0 && (
        <p className="text-xs text-white/40 text-center py-2">No active bonuses</p>
      )}
    </div>
  );
};

// ==================== SYNERGY UNLOCK NOTIFICATION ====================
const SynergyUnlockNotification = ({ synergy, onClose }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => onClose?.(), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onClose]);
  
  if (!synergy) return null;
  const def = SYNERGY_BONUSES[synergy];
  if (!def) return null;
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
      <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${phase >= 1 ? 'opacity-70' : 'opacity-0'}`} />
      
      <div className={`
        relative bg-gradient-to-b from-yellow-900 to-amber-900 rounded-3xl p-8 border-4 border-yellow-500
        transition-all duration-500 shadow-2xl shadow-yellow-500/50
        ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        ${phase >= 3 ? 'scale-75 opacity-0' : ''}
      `}>
        <div className="text-center">
          <p className="text-xs text-yellow-400 uppercase tracking-widest mb-2">⚡ Synergy Unlocked!</p>
          <div className="text-6xl mb-4">{def.icon}</div>
          <h2 className="text-2xl font-bold text-yellow-300 font-pixel mb-2">{def.name}</h2>
          <p className="text-white/70 text-sm mb-4">{def.description}</p>
          <div className="bg-black/30 rounded-xl p-3">
            <p className="text-xs text-white/50 mb-2">Bonuses:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(def.effect).map(([key, value]) => (
                <span key={key} className="px-2 py-1 bg-green-900/50 rounded-lg text-green-400 text-xs">
                  +{(value * 100).toFixed(0)}% {key.replace(/([A-Z])/g, ' $1')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  BonusProvider,
  useBonuses,
  BonusDisplay,
  SynergyUnlockNotification,
  calculateTotalBonuses,
  SKILL_BONUSES,
  ACHIEVEMENT_BONUSES,
  SYNERGY_BONUSES,
  ACTIVE_BUFFS,
};
