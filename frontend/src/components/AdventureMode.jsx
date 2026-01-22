import React, { useState, useMemo } from 'react';
import { useAdventure, AdventureProvider } from '../context/AdventureContext';
import { AdventureScene } from './AdventureScene';
import { DialogueOverlay } from './DialogueOverlay';
import { InventoryPanel } from './InventoryPanel';
import { QuestLog } from './AdventureQuestLog';
import { AdventureMap } from './AdventureMap';
import CharacterCreation from './CharacterCreation';
import { FishMemoryGame, FishTimingGame, FishQuizGame, FishSortingGame } from './MiniGames';
import { ShopUI } from './ShopUI';
import { EnhancedTacklebox } from './EnhancedTacklebox';
import { FishingCompetition } from './FishingCompetition';
import { useGameStore } from '../store/gameStore';
import { Toaster } from 'sonner';
import { 
  Map, Backpack, Scroll, X, Compass, Anchor, 
  Volume2, VolumeX, Settings, RotateCcw, User, Star, ShoppingBag, Swords 
} from 'lucide-react';
import { CHARACTER_GENDERS, CHARACTER_BACKGROUNDS, getCharacterTitle } from '../lib/characterSystem';
import '../adventureMode.css';

// Pre-generated random positions for background particles (stable across renders)
const PARTICLE_POSITIONS = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 17) % 100),
  top: ((i * 23) % 100),
  delay: (i * 0.25) % 5,
  size: 1 + ((i * 7) % 15) / 10,
  icon: ['⚓', '🏴‍☠️', '🗺️', '💎', '🐠', '⭐'][i % 6]
}));

// ============================================================================
// ADVENTURE MODE - Main Hub Component
// ============================================================================

const AdventureModeInner = ({ onClose }) => {
  const {
    adventureStarted,
    startAdventure,
    resetAdventure,
    isInDialogue,
    currentLocation,
    gold,
    experience,
    discoveredLocations,
    inventory,
    activeQuests,
    completedQuests,
    activeMinigame,
    clearMinigame,
    completeMinigame,
    activeShop,
    clearShop
  } = useAdventure();

  // Character from global store
  const { character, hasCreatedCharacter, setCharacter, resetCharacter } = useGameStore();

  const [showInventory, setShowInventory] = useState(false);
  const [showTacklebox, setShowTacklebox] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showCompetition, setShowCompetition] = useState(false);
  const [competitionType, setCompetitionType] = useState('standard');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  // Initialize character creation state based on whether character exists
  const [showCharacterCreation, setShowCharacterCreation] = useState(!hasCreatedCharacter);

  // Handle character creation complete
  const handleCharacterCreated = (newCharacter) => {
    setCharacter(newCharacter);
    setShowCharacterCreation(false);
  };

  // Handle minigame completion
  const handleMinigameComplete = (score) => {
    completeMinigame(score);
  };

  // Start fishing competition against rival
  const startCompetition = (type = 'standard') => {
    setCompetitionType(type);
    setShowCompetition(true);
  };

  // Calculate player level from character or experience
  const playerLevel = character?.level || Math.floor(experience / 1000) + 1;
  const playerGold = character?.gold || gold;
  const playerXP = character?.experience || experience;

  // Get character display info
  const genderData = character ? CHARACTER_GENDERS[character.gender] : null;
  const backgroundData = character ? CHARACTER_BACKGROUNDS.find(b => b.id === character.background) : null;
  const characterTitle = character ? getCharacterTitle(character) : 'Adventurer';

  // Render active minigame
  const renderMinigame = () => {
    if (!activeMinigame) return null;
    
    const minigameProps = {
      onComplete: handleMinigameComplete,
      onClose: clearMinigame
    };
    
    switch (activeMinigame) {
      case 'memory':
        return <FishMemoryGame {...minigameProps} />;
      case 'timing':
        return <FishTimingGame {...minigameProps} />;
      case 'quiz':
        return <FishQuizGame {...minigameProps} />;
      case 'sorting':
        return <FishSortingGame {...minigameProps} />;
      default:
        return null;
    }
  };

  // Show Character Creation if needed
  if (showCharacterCreation) {
    return (
      <CharacterCreation 
        onComplete={handleCharacterCreated}
        onBack={onClose}
      />
    );
  }

  // Intro screen for new players (after character creation)
  if (!adventureStarted && showIntro) {
    return (
      <div 
        className="adventure-intro fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #1a3a5c 50%, #0d2040 100%)' }}
        data-testid="adventure-intro"
      >
        <Toaster position="top-center" richColors />
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {PARTICLE_POSITIONS.map((particle, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                fontSize: `${particle.size}rem`
              }}
            >
              {particle.icon}
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl animate-scale-pop py-8 my-auto min-h-0">
          {/* Character Card */}
          {character && (
            <div className="glass-panel rounded-2xl p-4 mb-6 border-2 border-gold/40 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-amber-600/30 flex items-center justify-center border-2 border-gold/50">
                  <span className="text-4xl">
                    {genderData?.portraits[character.appearance?.portrait || 0]}
                  </span>
                </div>
                <div className="text-left flex-1">
                  <div className="font-pixel text-gold text-lg">{character.name}</div>
                  <div className="text-white/60 text-sm">{characterTitle} • {backgroundData?.name}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-green-400">Lvl {playerLevel}</span>
                    <span className="text-gold">💰 {playerGold}g</span>
                    <span className="text-purple-400">⭐ {playerXP} XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <h1 className="font-pixel text-3xl md:text-5xl text-gold mb-3 drop-shadow-lg animate-pulse">
              ADVENTURE MODE
            </h1>
            <p className="text-xl md:text-2xl text-amber-200 font-bold">
              The Curse of Saltbeard&apos;s Cove
            </p>
          </div>

          {/* Pirate ship silhouette */}
          <div className="text-7xl mb-6 animate-float">
            🏴‍☠️
          </div>

          {/* Story intro - personalized */}
          <div className="glass-panel rounded-2xl p-5 mb-6 text-left border-2 border-amber-500/30">
            {backgroundData && (
              <p className="text-amber-100 text-base leading-relaxed mb-3 italic border-l-4 border-gold/50 pl-3">
                &ldquo;{backgroundData.loreIntro}&rdquo;
              </p>
            )}
            <p className="text-amber-100/80 leading-relaxed mb-3">
              <span className="text-xl">🌊</span> The salty winds of <span className="text-gold font-bold">Saltbeard&apos;s Cove</span> whisper 
              of treasure, treachery, and really questionable fish deals.
            </p>
            <p className="text-amber-100/60 text-sm">
              Legendary pirate <span className="text-amber-300">Captain Saltbeard</span> hid his greatest 
              treasure somewhere on this island. Your adventure begins now, <span className="text-gold">{character?.name || 'adventurer'}</span>!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                startAdventure();
                setShowIntro(false);
              }}
              className="adventure-btn-primary w-full py-4 text-lg"
              data-testid="start-adventure-btn"
            >
              <Anchor className="w-6 h-6 mr-3" />
              Begin Adventure
            </button>
            
            <button
              onClick={onClose}
              className="adventure-btn-secondary w-full py-3"
              data-testid="back-to-game-btn"
            >
              <X className="w-5 h-5 mr-2" />
              Return to Fishing
            </button>
          </div>

          {/* Features preview */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center pb-4">
            <div className="glass-panel p-2 rounded-lg">
              <div className="text-xl mb-1">🗺️</div>
              <div className="text-[10px] text-amber-200">5 Regions</div>
            </div>
            <div className="glass-panel p-2 rounded-lg">
              <div className="text-xl mb-1">🏴‍☠️</div>
              <div className="text-[10px] text-amber-200">125+ NPCs</div>
            </div>
            <div className="glass-panel p-2 rounded-lg">
              <div className="text-xl mb-1">💬</div>
              <div className="text-[10px] text-amber-200">Branching Story</div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
          data-testid="close-intro-btn"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="adventure-mode fixed inset-0 z-50 overflow-hidden"
      data-testid="adventure-mode"
    >
      <Toaster position="top-center" richColors />
      
      {/* Main Scene */}
      <AdventureScene />

      {/* Dialogue Overlay */}
      {isInDialogue && <DialogueOverlay />}

      {/* Active Minigame Overlay */}
      {activeMinigame && renderMinigame()}

      {/* Active Shop Overlay */}
      {activeShop && <ShopUI shopId={activeShop} onClose={clearShop} />}

      {/* Enhanced Tacklebox Overlay */}
      {showTacklebox && <EnhancedTacklebox onClose={() => setShowTacklebox(false)} />}

      {/* Fishing Competition Overlay */}
      {showCompetition && (
        <FishingCompetition 
          competitionType={competitionType}
          onComplete={(result) => {
            setShowCompetition(false);
            // Could trigger quest completion here
          }}
          onClose={() => setShowCompetition(false)}
        />
      )}

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4">
        <div className="flex items-center justify-between">
          {/* Character Badge */}
          <button 
            onClick={() => setShowCharacterSheet(true)}
            className="flex items-center gap-2 adventure-stat-badge hover:border-gold/60 transition-colors cursor-pointer"
            data-testid="character-badge"
          >
            {character && genderData ? (
              <>
                <span className="text-xl">{genderData.portraits[character.appearance?.portrait || 0]}</span>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-gold">{character.name}</div>
                  <div className="text-[10px] text-white/60">{characterTitle}</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-xl">🏴‍☠️</span>
                <span className="font-bold">Lvl {playerLevel}</span>
              </>
            )}
          </button>
          
          {/* Stats */}
          <div className="flex items-center gap-2">
            <div className="adventure-stat-badge">
              <span className="text-lg">⭐</span>
              <span className="font-bold text-sm">{playerLevel}</span>
            </div>
            <div className="adventure-stat-badge">
              <span className="text-lg">💰</span>
              <span className="font-bold text-sm">{playerGold}</span>
            </div>
          </div>

          {/* Location Name */}
          <div className="adventure-location-badge">
            <Compass className="w-4 h-4" />
            <span>{currentLocation.replace(/_/g, ' ').toUpperCase()}</span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="adventure-close-btn"
            data-testid="close-adventure-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-4">
        <div className="flex items-center justify-center gap-3">
          {/* Map Button */}
          <button
            onClick={() => setShowMap(true)}
            className="adventure-action-btn"
            data-testid="open-map-btn"
          >
            <Map className="w-6 h-6" />
            <span className="hidden md:inline">Map</span>
            <span className="adventure-badge">{discoveredLocations.length}</span>
          </button>

          {/* Tacklebox Button */}
          <button
            onClick={() => setShowTacklebox(true)}
            className="adventure-action-btn"
            data-testid="open-tacklebox-btn"
          >
            <span className="text-xl">🧰</span>
            <span className="hidden md:inline">Tacklebox</span>
          </button>

          {/* Challenge Ricky Button */}
          <button
            onClick={() => startCompetition('standard')}
            className="adventure-action-btn bg-red-600/30 hover:bg-red-600/50 border-red-500/50"
            data-testid="challenge-rival-btn"
          >
            <Swords className="w-6 h-6 text-red-400" />
            <span className="hidden md:inline text-red-300">Battle Ricky!</span>
          </button>

          {/* Inventory Button */}
          <button
            onClick={() => setShowInventory(true)}
            className="adventure-action-btn"
            data-testid="open-inventory-btn"
          >
            <Backpack className="w-6 h-6" />
            <span className="hidden md:inline">Inventory</span>
            <span className="adventure-badge">{inventory.length}</span>
          </button>

          {/* Quest Log Button */}
          <button
            onClick={() => setShowQuestLog(true)}
            className="adventure-action-btn"
            data-testid="open-quests-btn"
          >
            <Scroll className="w-6 h-6" />
            <span className="hidden md:inline">Quests</span>
            {activeQuests.length > 0 && (
              <span className="adventure-badge animate-pulse">{activeQuests.length}</span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="adventure-action-btn"
            data-testid="open-settings-btn"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs text-amber-200/60 mb-1">
            <span>Adventure Progress</span>
            <span>{completedQuests.length} quests complete</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-gold transition-all duration-500"
              style={{ width: `${Math.min(100, (completedQuests.length / 6) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inventory Panel */}
      {showInventory && (
        <InventoryPanel onClose={() => setShowInventory(false)} />
      )}

      {/* Quest Log */}
      {showQuestLog && (
        <QuestLog onClose={() => setShowQuestLog(false)} />
      )}

      {/* Map */}
      {showMap && (
        <AdventureMap onClose={() => setShowMap(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="adventure-modal-backdrop" onClick={() => setShowSettings(false)}>
          <div 
            className="adventure-modal"
            onClick={e => e.stopPropagation()}
            data-testid="settings-modal"
          >
            <h2 className="font-pixel text-2xl text-gold mb-6">⚙️ Settings</h2>
            
            <div className="space-y-4">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <span className="text-white flex items-center gap-2">
                  {soundEnabled ? <Volume2 /> : <VolumeX />}
                  Sound Effects
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Reset Adventure */}
              <button
                onClick={() => {
                  if (window.confirm('Reset all adventure progress? This cannot be undone!')) {
                    resetAdventure();
                    setShowSettings(false);
                  }
                }}
                className="w-full p-3 bg-red-600/50 hover:bg-red-600 rounded-lg text-white flex items-center justify-center gap-2 transition-colors"
                data-testid="reset-adventure-btn"
              >
                <RotateCcw className="w-5 h-5" />
                Reset Adventure
              </button>
              
              {/* New Character */}
              <button
                onClick={() => {
                  if (window.confirm('Create a new character? Current progress will be reset!')) {
                    resetCharacter();
                    resetAdventure();
                    setShowSettings(false);
                    setShowCharacterCreation(true);
                  }
                }}
                className="w-full p-3 bg-purple-600/50 hover:bg-purple-600 rounded-lg text-white flex items-center justify-center gap-2 transition-colors"
              >
                <User className="w-5 h-5" />
                New Character
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="adventure-btn-secondary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Character Sheet Modal */}
      {showCharacterSheet && character && (
        <div className="adventure-modal-backdrop" onClick={() => setShowCharacterSheet(false)}>
          <div 
            className="adventure-modal max-w-md w-full"
            onClick={e => e.stopPropagation()}
            data-testid="character-sheet-modal"
          >
            {/* Header with portrait */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gold/30">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-amber-600/30 flex items-center justify-center border-3 border-gold/50">
                <span className="text-5xl">
                  {genderData?.portraits[character.appearance?.portrait || 0]}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-pixel text-xl text-gold">{character.name}</h2>
                <div className="text-white/60 text-sm">{characterTitle}</div>
                <div className="text-amber-300/70 text-xs mt-1">{backgroundData?.name}</div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <div className="text-2xl">⭐</div>
                <div className="text-gold font-bold">{playerLevel}</div>
                <div className="text-[10px] text-white/50">Level</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <div className="text-2xl">💰</div>
                <div className="text-gold font-bold">{playerGold}</div>
                <div className="text-[10px] text-white/50">Gold</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <div className="text-2xl">✨</div>
                <div className="text-purple-400 font-bold">{playerXP}</div>
                <div className="text-[10px] text-white/50">XP</div>
              </div>
            </div>
            
            {/* Character Stats */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white/60 mb-3">ATTRIBUTES</h3>
              <div className="grid grid-cols-2 gap-2">
                {character.stats && Object.entries(character.stats).map(([stat, value]) => (
                  <div key={stat} className="flex items-center gap-2 p-2 bg-black/20 rounded">
                    <span className="text-lg">
                      {stat === 'strength' ? '💪' : stat === 'agility' ? '⚡' : stat === 'wisdom' ? '🧠' : stat === 'charisma' ? '✨' : stat === 'luck' ? '🍀' : '❤️'}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs text-white/60 capitalize">{stat}</div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white font-bold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Background Bonuses */}
            {backgroundData && (
              <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{backgroundData.icon}</span>
                  <span className="text-amber-200 font-bold text-sm">{backgroundData.name} Bonuses</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(backgroundData.bonuses).map(([stat, val]) => val > 0 && (
                    <span key={stat} className="text-xs px-2 py-0.5 bg-green-500/30 text-green-300 rounded">
                      +{val} {stat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowCharacterSheet(false)}
              className="adventure-btn-secondary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// WRAPPED EXPORT WITH PROVIDER
// ============================================================================

export const AdventureMode = ({ onClose }) => {
  return (
    <AdventureProvider>
      <AdventureModeInner onClose={onClose} />
    </AdventureProvider>
  );
};

export default AdventureMode;
