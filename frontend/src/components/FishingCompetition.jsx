import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAdventure } from '../context/AdventureContext';
import { X, Trophy, Fish, Timer, Zap, Crown, Anchor, Skull } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// FISHING COMPETITION - Rivalry Showdown System
// Face off against "Razor" Ricky in real-time fishing battles!
// ============================================================================

const COMPETITION_FISH = [
  { name: 'Sassy Sardine', points: 10, rarity: 0, icon: '🐟', catchTime: [1, 3] },
  { name: 'Grumpy Grouper', points: 25, rarity: 1, icon: '🐠', catchTime: [2, 4] },
  { name: 'Melodramatic Mackerel', points: 40, rarity: 1, icon: '🐡', catchTime: [2, 5] },
  { name: 'Theatrical Tuna', points: 75, rarity: 2, icon: '🎭', catchTime: [3, 6] },
  { name: 'Pompous Pike', points: 100, rarity: 2, icon: '👑', catchTime: [4, 7] },
  { name: 'Existential Eel', points: 150, rarity: 3, icon: '🌀', catchTime: [5, 8] },
  { name: 'Legendary Leviathan Jr.', points: 300, rarity: 4, icon: '🐉', catchTime: [8, 12] }
];

const RICKY_TAUNTS = {
  catching: [
    "Oh look, I caught ANOTHER one!",
    "Is that the best you can do?",
    "My grandmother fishes faster!",
    "I'm not even trying yet!",
    "Yawn... too easy.",
    "Watch and learn, rookie!",
    "That's going in my trophy case!"
  ],
  losing: [
    "Lucky cast! Won't happen again!",
    "The fish must be confused today...",
    "My line was tangled! Doesn't count!",
    "I MEANT to let that one go!",
    "The sun was in my eyes!",
    "This rod is defective!"
  ],
  winning: [
    "As expected! I'm simply better!",
    "Thanks for the entertainment!",
    "Better luck next century!",
    "Tell everyone who the REAL fisher is!",
    "Don't feel bad - I'm a natural!"
  ],
  playerWinning: [
    "This... this is IMPOSSIBLE!",
    "You must be cheating somehow!",
    "The fish are clearly biased!",
    "I DEMAND a rematch!",
    "Beginner's luck! DEFINITELY beginner's luck!"
  ]
};

export const FishingCompetition = ({ competitionType = 'standard', onComplete, onClose }) => {
  const { character, addCharacterGold, addCharacterXP } = useGameStore();
  const [gamePhase, setGamePhase] = useState('intro'); // intro, fishing, results
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerScore, setPlayerScore] = useState(0);
  const [rickyScore, setRickyScore] = useState(0);
  const [playerCatches, setPlayerCatches] = useState([]);
  const [rickyCatches, setRickyCatches] = useState([]);
  const [currentFish, setCurrentFish] = useState(null);
  const [fishProgress, setFishProgress] = useState(0);
  const [isCasting, setIsCasting] = useState(false);
  const [isReeling, setIsReeling] = useState(false);
  const [rickyTaunt, setRickyTaunt] = useState('');
  const [comboCount, setComboCount] = useState(0);

  // Competition settings based on type
  const settings = {
    standard: { time: 60, targetScore: 500, reward: 200 },
    advanced: { time: 90, targetScore: 1000, reward: 500 },
    championship: { time: 120, targetScore: 2000, reward: 1500 },
    final_showdown: { time: 180, targetScore: 5000, reward: 5000 }
  }[competitionType];

  // Spawn a fish to catch
  const spawnFish = useCallback(() => {
    const rarityRoll = Math.random();
    let fishPool;
    if (rarityRoll > 0.95) fishPool = COMPETITION_FISH.filter(f => f.rarity === 4);
    else if (rarityRoll > 0.85) fishPool = COMPETITION_FISH.filter(f => f.rarity === 3);
    else if (rarityRoll > 0.65) fishPool = COMPETITION_FISH.filter(f => f.rarity === 2);
    else if (rarityRoll > 0.35) fishPool = COMPETITION_FISH.filter(f => f.rarity === 1);
    else fishPool = COMPETITION_FISH.filter(f => f.rarity === 0);
    
    const fish = fishPool[Math.floor(Math.random() * fishPool.length)];
    setCurrentFish(fish);
    setFishProgress(0);
  }, []);

  // Ricky's AI fishing
  useEffect(() => {
    if (gamePhase !== 'fishing') return;
    
    const rickyInterval = setInterval(() => {
      // Ricky catches fish at variable speed based on competition type
      const catchChance = competitionType === 'final_showdown' ? 0.15 : 0.1;
      
      if (Math.random() < catchChance) {
        const rarityRoll = Math.random();
        let fishPool;
        if (rarityRoll > 0.9) fishPool = COMPETITION_FISH.filter(f => f.rarity >= 2);
        else if (rarityRoll > 0.5) fishPool = COMPETITION_FISH.filter(f => f.rarity === 1);
        else fishPool = COMPETITION_FISH.filter(f => f.rarity === 0);
        
        const fish = fishPool[Math.floor(Math.random() * fishPool.length)];
        setRickyScore(prev => prev + fish.points);
        setRickyCatches(prev => [...prev, fish]);
        
        // Ricky taunts
        const tauntType = rickyScore > playerScore ? 'catching' : 'losing';
        const taunts = RICKY_TAUNTS[tauntType];
        setRickyTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
        setTimeout(() => setRickyTaunt(''), 3000);
      }
    }, 1000);
    
    return () => clearInterval(rickyInterval);
  }, [gamePhase, competitionType, rickyScore, playerScore]);

  // Game timer
  useEffect(() => {
    if (gamePhase !== 'fishing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGamePhase('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gamePhase]);

  // Initialize game
  useEffect(() => {
    if (gamePhase === 'fishing' && !currentFish) {
      spawnFish();
    }
  }, [gamePhase, currentFish, spawnFish]);

  // Handle casting
  const handleCast = () => {
    if (isCasting || isReeling || !currentFish) return;
    setIsCasting(true);
    
    setTimeout(() => {
      setIsCasting(false);
      setIsReeling(true);
    }, 500);
  };

  // Handle reeling (click to progress)
  const handleReel = () => {
    if (!isReeling || !currentFish) return;
    
    const progress = fishProgress + 15 + Math.random() * 10;
    setFishProgress(progress);
    
    if (progress >= 100) {
      // Caught the fish!
      const bonusMultiplier = 1 + (comboCount * 0.1);
      const points = Math.floor(currentFish.points * bonusMultiplier);
      
      setPlayerScore(prev => prev + points);
      setPlayerCatches(prev => [...prev, { ...currentFish, bonusPoints: points }]);
      setComboCount(prev => prev + 1);
      setIsReeling(false);
      
      toast.success(`Caught ${currentFish.name}! +${points} pts`, { icon: currentFish.icon });
      
      // Spawn new fish after brief delay
      setTimeout(() => {
        spawnFish();
      }, 500);
    }
  };

  // Handle fish escape (if not reeling fast enough)
  useEffect(() => {
    if (!isReeling || !currentFish) return;
    
    const escapeTimer = setInterval(() => {
      setFishProgress(prev => {
        const newProgress = prev - 5;
        if (newProgress <= 0) {
          // Fish escaped!
          toast.error(`${currentFish.name} escaped!`, { icon: '💨' });
          setIsReeling(false);
          setComboCount(0);
          setTimeout(() => spawnFish(), 500);
          return 0;
        }
        return newProgress;
      });
    }, 500);
    
    return () => clearInterval(escapeTimer);
  }, [isReeling, currentFish, spawnFish]);

  // Start game
  const startCompetition = () => {
    setGamePhase('fishing');
    setTimeLeft(settings.time);
    setPlayerScore(0);
    setRickyScore(0);
    setPlayerCatches([]);
    setRickyCatches([]);
    setComboCount(0);
    spawnFish();
  };

  // Handle completion
  const handleComplete = () => {
    const won = playerScore > rickyScore;
    const reward = won ? settings.reward : Math.floor(settings.reward * 0.2);
    const xpReward = won ? settings.reward : Math.floor(settings.reward * 0.3);
    
    addCharacterGold(reward);
    addCharacterXP(xpReward);
    
    if (onComplete) {
      onComplete({
        won,
        playerScore,
        rickyScore,
        catches: playerCatches,
        reward,
        xpReward
      });
    }
    onClose();
  };

  const playerWinning = playerScore > rickyScore;
  const scoreDiff = Math.abs(playerScore - rickyScore);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
      data-testid="fishing-competition"
    >
      <div className="w-full max-w-4xl bg-gradient-to-b from-blue-950 to-indigo-950 rounded-3xl border-4 border-amber-500/50 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚔️</span>
            <div>
              <h2 className="font-pixel text-xl text-white">FISHING SHOWDOWN</h2>
              <p className="text-amber-200/70 text-sm">
                {competitionType === 'final_showdown' ? 'THE FINAL BATTLE' : `${competitionType.toUpperCase()} COMPETITION`}
              </p>
            </div>
          </div>
          {gamePhase !== 'results' && (
            <button onClick={onClose} className="p-2 bg-red-600/50 hover:bg-red-600 rounded-full">
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* INTRO PHASE */}
        {gamePhase === 'intro' && (
          <div className="p-8 text-center">
            <div className="flex justify-center items-center gap-8 mb-8">
              {/* Player */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-blue-600/30 border-4 border-blue-400 flex items-center justify-center text-5xl mb-2">
                  {character?.gender === 'male' ? '👨‍🎣' : '👩‍🎣'}
                </div>
                <div className="font-bold text-blue-300">{character?.name || 'You'}</div>
                <div className="text-xs text-blue-400/60">Challenger</div>
              </div>
              
              {/* VS */}
              <div className="text-4xl font-pixel text-amber-400 animate-pulse">VS</div>
              
              {/* Ricky */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-red-600/30 border-4 border-red-400 flex items-center justify-center text-5xl mb-2">
                  🦈
                </div>
                <div className="font-bold text-red-300">"Razor" Ricky</div>
                <div className="text-xs text-red-400/60">Reigning Champion</div>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <p className="text-amber-200 italic mb-4">
                "So you think you can out-fish ME? Let's settle this once and for all. 
                First to {settings.targetScore} points wins... or whoever has more when time runs out!"
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-2">
                  <Timer className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                  <div className="text-white font-bold">{settings.time}s</div>
                  <div className="text-white/50 text-xs">Time Limit</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <Trophy className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                  <div className="text-white font-bold">{settings.targetScore}</div>
                  <div className="text-white/50 text-xs">Target Score</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <Crown className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                  <div className="text-white font-bold">{settings.reward}g</div>
                  <div className="text-white/50 text-xs">Prize</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={startCompetition}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-white text-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105"
              data-testid="start-competition-btn"
            >
              🎣 LET'S FISH! 🎣
            </button>
          </div>
        )}

        {/* FISHING PHASE */}
        {gamePhase === 'fishing' && (
          <div className="p-4">
            {/* Score Header */}
            <div className="flex justify-between items-center mb-4">
              {/* Player Score */}
              <div className={`flex-1 p-3 rounded-xl ${playerWinning ? 'bg-green-600/30 border-2 border-green-400' : 'bg-blue-600/20'}`}>
                <div className="text-sm text-white/60">You</div>
                <div className="text-3xl font-bold text-white">{playerScore}</div>
                <div className="text-xs text-white/50">{playerCatches.length} catches</div>
              </div>
              
              {/* Timer */}
              <div className="px-6 text-center">
                <div className={`text-4xl font-pixel ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                  {timeLeft}s
                </div>
                {comboCount > 1 && (
                  <div className="text-xs text-amber-300 animate-bounce">
                    🔥 {comboCount}x COMBO!
                  </div>
                )}
              </div>
              
              {/* Ricky Score */}
              <div className={`flex-1 p-3 rounded-xl text-right ${!playerWinning ? 'bg-red-600/30 border-2 border-red-400' : 'bg-red-600/20'}`}>
                <div className="text-sm text-white/60">Ricky</div>
                <div className="text-3xl font-bold text-white">{rickyScore}</div>
                <div className="text-xs text-white/50">{rickyCatches.length} catches</div>
              </div>
            </div>

            {/* Ricky Taunt */}
            {rickyTaunt && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-2 mb-4 text-center">
                <span className="text-2xl mr-2">🦈</span>
                <span className="text-red-200 italic">"{rickyTaunt}"</span>
              </div>
            )}

            {/* Fishing Area */}
            <div className="relative bg-gradient-to-b from-blue-800/50 to-blue-900/50 rounded-2xl p-6 min-h-[300px] overflow-hidden">
              {/* Water animation */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-cyan-500/20 to-blue-900/20 animate-pulse" />
              </div>
              
              {/* Current Fish */}
              {currentFish && (
                <div className="relative z-10 text-center">
                  <div className={`text-8xl mb-4 transition-transform ${isReeling ? 'animate-bounce' : ''}`}>
                    {currentFish.icon}
                  </div>
                  <div className="text-xl text-white font-bold mb-2">{currentFish.name}</div>
                  <div className="text-amber-400">+{currentFish.points} pts</div>
                  
                  {/* Progress bar */}
                  {isReeling && (
                    <div className="mt-4 max-w-xs mx-auto">
                      <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-200"
                          style={{ width: `${fishProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-white/60 mt-1">Click fast to reel in!</div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                {!isReeling ? (
                  <button
                    onClick={handleCast}
                    disabled={isCasting}
                    className={`px-12 py-6 rounded-full font-bold text-2xl transition-all ${
                      isCasting 
                        ? 'bg-gray-600 text-gray-400' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/30 hover:scale-105'
                    }`}
                    data-testid="cast-btn"
                  >
                    {isCasting ? 'Casting...' : '🎣 CAST'}
                  </button>
                ) : (
                  <button
                    onClick={handleReel}
                    className="px-12 py-6 rounded-full font-bold text-2xl bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black shadow-lg shadow-green-500/30 hover:scale-105 animate-pulse"
                    data-testid="reel-btn"
                  >
                    🌀 REEL! REEL! 🌀
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS PHASE */}
        {gamePhase === 'results' && (
          <div className="p-8 text-center">
            {/* Winner Banner */}
            <div className={`text-6xl mb-4 ${playerWinning ? 'animate-bounce' : 'animate-pulse'}`}>
              {playerWinning ? '🏆' : '😤'}
            </div>
            <h2 className={`text-3xl font-pixel mb-2 ${playerWinning ? 'text-amber-400' : 'text-red-400'}`}>
              {playerWinning ? 'VICTORY!' : 'DEFEAT...'}
            </h2>
            
            {/* Ricky's reaction */}
            <div className="bg-black/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <span className="text-3xl mr-2">🦈</span>
              <span className="text-white/80 italic">
                "{playerWinning 
                  ? RICKY_TAUNTS.playerWinning[Math.floor(Math.random() * RICKY_TAUNTS.playerWinning.length)]
                  : RICKY_TAUNTS.winning[Math.floor(Math.random() * RICKY_TAUNTS.winning.length)]
                }"
              </span>
            </div>

            {/* Final Scores */}
            <div className="flex justify-center gap-8 mb-6">
              <div className={`p-4 rounded-xl ${playerWinning ? 'bg-green-600/30 border-2 border-green-400' : 'bg-white/10'}`}>
                <div className="text-white/60 text-sm">Your Score</div>
                <div className="text-4xl font-bold text-white">{playerScore}</div>
                <div className="text-xs text-white/50">{playerCatches.length} fish caught</div>
              </div>
              <div className={`p-4 rounded-xl ${!playerWinning ? 'bg-red-600/30 border-2 border-red-400' : 'bg-white/10'}`}>
                <div className="text-white/60 text-sm">Ricky's Score</div>
                <div className="text-4xl font-bold text-white">{rickyScore}</div>
                <div className="text-xs text-white/50">{rickyCatches.length} fish caught</div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-amber-900/30 rounded-xl p-4 mb-6 max-w-sm mx-auto">
              <div className="text-amber-400 font-bold mb-2">Rewards Earned:</div>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-white font-bold">
                    +{playerWinning ? settings.reward : Math.floor(settings.reward * 0.2)}g
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-white font-bold">
                    +{playerWinning ? settings.reward : Math.floor(settings.reward * 0.3)} XP
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-xl font-bold text-white text-xl"
              data-testid="complete-competition-btn"
            >
              {playerWinning ? '🎉 Claim Victory!' : '😤 Next Time...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FishingCompetition;
