import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// ACHIEVEMENT NOTIFICATION SYSTEM
// Real-time achievement unlock notifications during gameplay
// ========================================================================

// ==================== ACHIEVEMENT DEFINITIONS ====================
const ACHIEVEMENT_TRIGGERS = {
  // Fishing achievements
  catches: [
    { id: 'first_catch', value: 1, name: 'First Catch!', icon: '🐟', rarity: 'common' },
    { id: 'catch_10', value: 10, name: 'Getting Started', icon: '🎣', rarity: 'common' },
    { id: 'catch_50', value: 50, name: 'Dedicated Angler', icon: '🏅', rarity: 'uncommon' },
    { id: 'catch_100', value: 100, name: 'Century Fisher', icon: '🏆', rarity: 'rare' },
    { id: 'catch_500', value: 500, name: 'Master Angler', icon: '👑', rarity: 'epic' },
    { id: 'catch_1000', value: 1000, name: 'Fishing Legend', icon: '🌟', rarity: 'legendary' },
  ],
  
  // Perfect catch achievements
  perfect_catches: [
    { id: 'perfect_1', value: 1, name: 'Perfect!', icon: '✨', rarity: 'common' },
    { id: 'perfect_10', value: 10, name: 'Precision Fisher', icon: '🎯', rarity: 'uncommon' },
    { id: 'perfect_50', value: 50, name: 'Flawless Technique', icon: '💎', rarity: 'rare' },
    { id: 'perfect_100', value: 100, name: 'Perfectionist', icon: '🏅', rarity: 'epic' },
  ],
  
  // Combo achievements
  max_combo: [
    { id: 'combo_5', value: 5, name: 'Combo Starter', icon: '🔥', rarity: 'uncommon' },
    { id: 'combo_10', value: 10, name: 'On Fire!', icon: '🔥🔥', rarity: 'rare' },
    { id: 'combo_20', value: 20, name: 'Unstoppable', icon: '⚡', rarity: 'epic' },
    { id: 'combo_50', value: 50, name: 'Combo God', icon: '👑', rarity: 'legendary' },
  ],
  
  // Level achievements
  level: [
    { id: 'level_5', value: 5, name: 'Rising Star', icon: '⭐', rarity: 'common' },
    { id: 'level_10', value: 10, name: 'Skilled Fisher', icon: '🌟', rarity: 'uncommon' },
    { id: 'level_25', value: 25, name: 'Expert Angler', icon: '✨', rarity: 'rare' },
    { id: 'level_50', value: 50, name: 'Master Fisher', icon: '💫', rarity: 'epic' },
    { id: 'level_100', value: 100, name: 'Fishing God', icon: '👑', rarity: 'legendary' },
  ],
  
  // Score achievements
  score: [
    { id: 'score_1000', value: 1000, name: 'First Thousand', icon: '📊', rarity: 'common' },
    { id: 'score_10000', value: 10000, name: 'High Roller', icon: '💰', rarity: 'uncommon' },
    { id: 'score_100000', value: 100000, name: 'Point Master', icon: '💎', rarity: 'rare' },
    { id: 'score_1000000', value: 1000000, name: 'Millionaire', icon: '🤑', rarity: 'legendary' },
  ],
  
  // Cooking achievements (tracked separately)
  dishes_cooked: [
    { id: 'first_dish', value: 1, name: 'First Dish', icon: '🍳', rarity: 'common' },
    { id: 'cook_10', value: 10, name: 'Home Cook', icon: '👨‍🍳', rarity: 'uncommon' },
    { id: 'cook_50', value: 50, name: 'Restaurant Ready', icon: '🍽️', rarity: 'rare' },
  ],
};

// ==================== RARITY STYLES ====================
const RARITY_STYLES = {
  common: {
    bg: 'from-gray-600 to-gray-700',
    border: 'border-gray-400',
    glow: 'shadow-gray-500/50',
    text: 'text-gray-200',
  },
  uncommon: {
    bg: 'from-green-600 to-emerald-700',
    border: 'border-green-400',
    glow: 'shadow-green-500/50',
    text: 'text-green-200',
  },
  rare: {
    bg: 'from-blue-600 to-indigo-700',
    border: 'border-blue-400',
    glow: 'shadow-blue-500/50',
    text: 'text-blue-200',
  },
  epic: {
    bg: 'from-purple-600 to-pink-700',
    border: 'border-purple-400',
    glow: 'shadow-purple-500/50',
    text: 'text-purple-200',
  },
  legendary: {
    bg: 'from-yellow-500 to-orange-600',
    border: 'border-yellow-300',
    glow: 'shadow-yellow-500/70',
    text: 'text-yellow-100',
  },
};

// ==================== NOTIFICATION QUEUE ====================
let notificationQueue = [];
let isProcessingQueue = false;

const queueNotification = (achievement, callback) => {
  notificationQueue.push({ achievement, callback });
  processQueue();
};

const processQueue = () => {
  if (isProcessingQueue || notificationQueue.length === 0) return;
  
  isProcessingQueue = true;
  const { achievement, callback } = notificationQueue.shift();
  
  callback(achievement);
  
  // Wait for notification to complete before processing next
  setTimeout(() => {
    isProcessingQueue = false;
    processQueue();
  }, 3500);
};

// ==================== MINI NOTIFICATION COMPONENT ====================
const AchievementMiniNotification = ({ achievement, position = 'top-right', onComplete }) => {
  const [phase, setPhase] = useState('entering');
  const rarity = RARITY_STYLES[achievement?.rarity || 'common'];
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('visible'), 100),
      setTimeout(() => setPhase('exiting'), 2500),
      setTimeout(() => {
        setPhase('done');
        onComplete?.();
      }, 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);
  
  if (!achievement || phase === 'done') return null;
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  
  return (
    <div 
      className={`
        fixed ${positionClasses[position]} z-[90]
        transition-all duration-500 ease-out
        ${phase === 'entering' ? 'opacity-0 translate-y-[-20px] scale-90' : ''}
        ${phase === 'visible' ? 'opacity-100 translate-y-0 scale-100' : ''}
        ${phase === 'exiting' ? 'opacity-0 translate-y-[-20px] scale-90' : ''}
      `}
      data-testid="achievement-mini-notification"
    >
      <div className={`
        flex items-center gap-3 px-5 py-4 rounded-2xl
        bg-gradient-to-r ${rarity.bg}
        border-2 ${rarity.border}
        shadow-lg ${rarity.glow}
        backdrop-blur-sm
      `}>
        {/* Icon with pulse */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-50">
            <span className="text-3xl">{achievement.icon}</span>
          </div>
          <span className="text-3xl relative">{achievement.icon}</span>
        </div>
        
        {/* Content */}
        <div>
          <p className="text-[10px] text-white/70 uppercase tracking-wider">Achievement Unlocked!</p>
          <p className={`font-bold ${rarity.text}`}>{achievement.name}</p>
        </div>
        
        {/* Sparkles */}
        <div className="absolute -top-1 -right-1 animate-spin-slow">
          <span className="text-xl">✨</span>
        </div>
      </div>
    </div>
  );
};

// ==================== FULL NOTIFICATION COMPONENT ====================
const AchievementFullNotification = ({ achievement, onComplete }) => {
  const [phase, setPhase] = useState(0);
  const rarity = RARITY_STYLES[achievement?.rarity || 'common'];
  
  useEffect(() => {
    if (!achievement) return;
    
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => {
        setPhase(4);
        onComplete?.();
      }, 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [achievement, onComplete]);
  
  if (!achievement || phase === 4) return null;
  
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center pointer-events-none" data-testid="achievement-full-notification">
      {/* Background overlay */}
      <div className={`
        absolute inset-0 bg-black transition-opacity duration-500
        ${phase >= 1 ? 'opacity-80' : 'opacity-0'}
      `} />
      
      {/* Confetti particles */}
      {phase >= 2 && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F59E0B'][i % 5],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Radial burst */}
      {phase >= 1 && (
        <div className={`
          absolute w-96 h-96 rounded-full
          bg-gradient-radial ${rarity.bg}
          opacity-30 animate-pulse-fast
        `} />
      )}
      
      {/* Main card */}
      <div className={`
        relative transition-all duration-700
        ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${phase >= 3 ? 'scale-90 opacity-0' : ''}
      `}>
        <div className={`
          bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8
          border-4 ${rarity.border}
          shadow-2xl ${rarity.glow}
          min-w-[320px]
        `}>
          {/* Header */}
          <div className="text-center mb-4">
            <p className={`text-sm uppercase tracking-widest ${rarity.text} font-bold`}>
              🏆 Achievement Unlocked!
            </p>
          </div>
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`
              relative w-24 h-24 rounded-full
              bg-gradient-to-br ${rarity.bg}
              flex items-center justify-center
              animate-bounce-slow
            `}>
              <span className="text-5xl">{achievement.icon}</span>
              <div className="absolute -top-2 -right-2 text-2xl animate-ping">✨</div>
              <div className="absolute -bottom-1 -left-1 text-xl animate-ping" style={{ animationDelay: '0.3s' }}>✨</div>
            </div>
          </div>
          
          {/* Name */}
          <h2 className={`text-2xl font-bold text-center ${rarity.text} font-pixel mb-2`}>
            {achievement.name}
          </h2>
          
          {/* Rarity badge */}
          <div className="flex justify-center">
            <span className={`
              px-4 py-1.5 rounded-full
              bg-gradient-to-r ${rarity.bg}
              ${rarity.text} text-sm font-bold uppercase
            `}>
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ACHIEVEMENT TRACKER HOOK ====================
const useAchievementTracker = () => {
  const store = useGameStore();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('mini'); // 'mini' or 'full'
  const previousValues = useRef({});
  
  // Load unlocked achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem('gofish_unlocked_achievements');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Check and unlock achievements
  const checkAchievements = useCallback((stat, value) => {
    const triggers = ACHIEVEMENT_TRIGGERS[stat];
    if (!triggers) return;
    
    triggers.forEach(achievement => {
      if (value >= achievement.value && !unlockedAchievements.includes(achievement.id)) {
        // Unlock achievement
        setUnlockedAchievements(prev => {
          const updated = [...prev, achievement.id];
          localStorage.setItem('gofish_unlocked_achievements', JSON.stringify(updated));
          return updated;
        });
        
        // Add to store
        store.addAchievement?.(achievement.id);
        
        // Queue notification
        const showFull = achievement.rarity === 'epic' || achievement.rarity === 'legendary';
        queueNotification(achievement, (ach) => {
          setNotificationType(showFull ? 'full' : 'mini');
          setCurrentNotification(ach);
        });
      }
    });
  }, [unlockedAchievements, store]);
  
  // Track store changes
  useEffect(() => {
    const statsToTrack = {
      catches: store.totalCatches,
      perfect_catches: store.perfectCatches || 0,
      max_combo: store.combo,
      level: store.level,
      score: store.score,
    };
    
    Object.entries(statsToTrack).forEach(([stat, value]) => {
      if (previousValues.current[stat] !== value) {
        checkAchievements(stat, value);
        previousValues.current[stat] = value;
      }
    });
  }, [store.totalCatches, store.perfectCatches, store.combo, store.level, store.score, checkAchievements]);
  
  const handleNotificationComplete = useCallback(() => {
    setCurrentNotification(null);
  }, []);
  
  // Manual achievement unlock
  const unlockAchievement = useCallback((achievementId) => {
    // Find achievement definition
    let achievement = null;
    Object.values(ACHIEVEMENT_TRIGGERS).forEach(triggers => {
      const found = triggers.find(a => a.id === achievementId);
      if (found) achievement = found;
    });
    
    if (achievement && !unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => {
        const updated = [...prev, achievementId];
        localStorage.setItem('gofish_unlocked_achievements', JSON.stringify(updated));
        return updated;
      });
      store.addAchievement?.(achievementId);
      
      const showFull = achievement.rarity === 'epic' || achievement.rarity === 'legendary';
      queueNotification(achievement, (ach) => {
        setNotificationType(showFull ? 'full' : 'mini');
        setCurrentNotification(ach);
      });
    }
  }, [unlockedAchievements, store]);
  
  return {
    currentNotification,
    notificationType,
    handleNotificationComplete,
    unlockedAchievements,
    checkAchievements,
    unlockAchievement,
  };
};

// ==================== ACHIEVEMENT NOTIFICATION MANAGER ====================
const AchievementNotificationManager = ({ position = 'top-right' }) => {
  const {
    currentNotification,
    notificationType,
    handleNotificationComplete,
  } = useAchievementTracker();
  
  if (!currentNotification) return null;
  
  if (notificationType === 'full') {
    return (
      <AchievementFullNotification
        achievement={currentNotification}
        onComplete={handleNotificationComplete}
      />
    );
  }
  
  return (
    <AchievementMiniNotification
      achievement={currentNotification}
      position={position}
      onComplete={handleNotificationComplete}
    />
  );
};

// ==================== CSS ANIMATIONS ====================
const AchievementNotificationStyles = () => (
  <style>{`
    @keyframes confetti-fall {
      0% {
        transform: translateY(-10vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    .animate-confetti-fall {
      animation: confetti-fall ease-out forwards;
    }
    
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
    
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-bounce-slow {
      animation: bounce-slow 1s ease-in-out infinite;
    }
    
    @keyframes pulse-fast {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.5; }
    }
    .animate-pulse-fast {
      animation: pulse-fast 1s ease-in-out infinite;
    }
  `}</style>
);

export {
  AchievementNotificationManager,
  AchievementMiniNotification,
  AchievementFullNotification,
  AchievementNotificationStyles,
  useAchievementTracker,
  ACHIEVEMENT_TRIGGERS,
  RARITY_STYLES,
};
