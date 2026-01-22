import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Check, User, Sparkles, 
  Anchor, Ship, Fish, Crown, Sword, Heart, Star,
  Zap, Shield, Coins, MapPin, Compass, X
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * ============================================================================
 * ENHANCED CHARACTER CREATION - Full Rewrite
 * ============================================================================
 * A completely rebuilt character creation experience with:
 * - 5 Steps: Welcome → Gender → Origin → Appearance → Name
 * - Animated transitions between steps
 * - Rich visual feedback
 * - Witty descriptions and silly humor
 * - Robust state management
 * 
 * Line Count Target: ~1000 lines
 * ============================================================================
 */

// ============================================================================
// CHARACTER DATA - All the options for creating a character
// ============================================================================

const GENDERS = {
  male: {
    id: 'male',
    name: 'Lad',
    icon: '👨',
    description: 'A strapping young fellow ready to conquer the seas',
    titleProgression: ['Deckhand', 'Sailor', 'First Mate', 'Captain', 'Admiral', 'Sea Lord'],
    portraits: ['👨', '👨‍🦰', '👨‍🦱', '👨‍🦳', '🧔', '👴'],
    color: 'from-blue-500 to-cyan-500'
  },
  female: {
    id: 'female',
    name: 'Lass',
    icon: '👩',
    description: 'A fierce adventurer with dreams of glory',
    titleProgression: ['Deckhand', 'Sailor', 'First Mate', 'Captain', 'Admiral', 'Sea Queen'],
    portraits: ['👩', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👧', '👵'],
    color: 'from-pink-500 to-purple-500'
  }
};

const BACKGROUNDS = [
  {
    id: 'sailor',
    name: 'Former Sailor',
    icon: '⚓',
    description: 'You know your way around a ship. The sea calls to you like an annoying neighbor.',
    longDescription: 'Years on merchant vessels taught you the ways of the sea. You can tie 47 different knots, most of which you made up.',
    bonuses: { sailing: 2, fishing: 1, luck: 0, trading: 0 },
    startingGold: 50,
    startingItem: 'Trusty Compass',
    quirk: 'You talk to seagulls. They never respond. You pretend they do.',
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'fisher',
    name: 'Village Fisher',
    icon: '🎣',
    description: 'Fish fear your name. Well, they would if they could read.',
    longDescription: 'Born with a fishing rod in your hand. Your parents were concerned, but you turned out fine. Mostly.',
    bonuses: { sailing: 0, fishing: 3, luck: 1, trading: 0 },
    startingGold: 30,
    startingItem: 'Lucky Lure',
    quirk: 'You apologize to every fish you catch. Its getting weird.',
    color: 'from-cyan-600 to-teal-800'
  },
  {
    id: 'merchant',
    name: 'Traveling Merchant',
    icon: '💰',
    description: 'Everything has a price, and you know exactly what it is. Plus markup.',
    longDescription: 'You could sell ice to penguins. You have. They were not amused.',
    bonuses: { sailing: 0, fishing: 0, luck: 0, trading: 3 },
    startingGold: 150,
    startingItem: 'Golden Abacus',
    quirk: 'You calculate the value of everything. Even feelings.',
    color: 'from-amber-500 to-yellow-700'
  },
  {
    id: 'noble',
    name: 'Disgraced Noble',
    icon: '👑',
    description: 'You used to be somebody. Now youre somebody with a fishing rod.',
    longDescription: 'Your family lost everything in a scandal involving a duck, three diplomats, and a questionable cheese.',
    bonuses: { sailing: 1, fishing: 0, luck: 2, trading: 1 },
    startingGold: 100,
    startingItem: 'Family Signet Ring',
    quirk: 'You expect fish to bow to you. They dont.',
    color: 'from-purple-600 to-indigo-800'
  },
  {
    id: 'pirate',
    name: 'Reformed Pirate',
    icon: '🏴‍☠️',
    description: 'You gave up pillaging for fishing. Its basically the same thing, legally.',
    longDescription: 'Your parrot left you for a more successful pirate. Youre definitely not bitter about it.',
    bonuses: { sailing: 2, fishing: 0, luck: 1, trading: 1 },
    startingGold: 75,
    startingItem: 'Eyepatch (Decorative)',
    quirk: 'You say "Arr" ironically. At least you claim its ironic.',
    color: 'from-gray-700 to-gray-900'
  },
  {
    id: 'mystic',
    name: 'Coastal Mystic',
    icon: '🔮',
    description: 'You commune with the spirits of the sea. They mostly complain about pollution.',
    longDescription: 'The ocean speaks to you. Unfortunately, it mostly talks about its feelings.',
    bonuses: { sailing: 0, fishing: 1, luck: 3, trading: 0 },
    startingGold: 40,
    startingItem: 'Glowing Shell',
    quirk: 'You predict weather by feeling. Youve been wrong 73% of the time.',
    color: 'from-violet-600 to-purple-900'
  }
];

const ACCESSORIES = [
  { id: 'none', name: 'Nothing', icon: '✨', description: 'Your natural beauty is enough' },
  { id: 'eyepatch', name: 'Eyepatch', icon: '🏴‍☠️', description: 'Both eyes work fine. Its a fashion choice.' },
  { id: 'bandana', name: 'Bandana', icon: '🧣', description: 'Keeps hair and fish guts out of your eyes' },
  { id: 'hat', name: 'Tricorn Hat', icon: '🎩', description: 'Makes you 40% more authoritative' },
  { id: 'earring', name: 'Gold Earring', icon: '💎', description: 'Shiny! Fish might be attracted to it. Or not.' },
  { id: 'scar', name: 'Battle Scar', icon: '⚔️', description: 'You got it fighting a... let people imagine' },
  { id: 'tattoo', name: 'Anchor Tattoo', icon: '⚓', description: 'Committed to the sea life. Literally.' },
  { id: 'beard', name: 'Magnificent Beard', icon: '🧔', description: 'Fish get tangled in it. Feature, not bug.' }
];

const NAME_SUGGESTIONS = [
  { name: 'Barnacle Bob', joke: 'He sticks to things' },
  { name: 'Salty Sam', joke: 'Self-explanatory' },
  { name: 'Captain Chaos', joke: 'Organization is overrated' },
  { name: 'Lucky Finn', joke: 'Ironic. Very ironic.' },
  { name: 'The Codfather', joke: 'Makes fish offers they cant refuse' },
  { name: 'Admiral Anchovy', joke: 'Small but mighty' },
  { name: 'Gill Murray', joke: 'No relation to the actor' },
  { name: 'Bubbles McFishface', joke: 'Named by committee' }
];

// ============================================================================
// ANIMATED BACKGROUND COMPONENT
// ============================================================================

const AnimatedBackground = () => {
  const bubbles = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      size: 4 + Math.random() * 12
    })), []
  );

  const fish = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: 20 + Math.random() * 60,
      delay: Math.random() * 15,
      duration: 20 + Math.random() * 20,
      emoji: ['🐟', '🐠', '🐡', '🦈'][Math.floor(Math.random() * 4)],
      direction: Math.random() > 0.5 ? 1 : -1
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-900/80 to-cyan-950/90" />
      
      {/* Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={`bubble-${bubble.id}`}
          className="absolute rounded-full bg-white/20 animate-float-up"
          style={{
            left: `${bubble.left}%`,
            bottom: '-20px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`
          }}
        />
      ))}
      
      {/* Swimming fish */}
      {fish.map(f => (
        <div
          key={`fish-${f.id}`}
          className="absolute text-2xl animate-swim"
          style={{
            top: `${f.top}%`,
            left: f.direction > 0 ? '-50px' : '100%',
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            transform: f.direction < 0 ? 'scaleX(-1)' : 'none',
            '--swim-direction': f.direction
          }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Seaweed */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex justify-around items-end opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={`seaweed-${i}`}
            className="text-4xl animate-sway"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            🌿
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

const StepIndicator = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepNames.map((name, index) => (
        <React.Fragment key={name}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                index < currentStep
                  ? 'bg-green-500 text-white scale-90'
                  : index === currentStep
                    ? 'bg-amber-500 text-black scale-110 ring-4 ring-amber-500/30'
                    : 'bg-white/20 text-white/50'
              }`}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-xs mt-1 transition-all ${
              index === currentStep ? 'text-amber-400 font-bold' : 'text-white/40'
            }`}>
              {name}
            </span>
          </div>
          {index < stepNames.length - 1 && (
            <div className={`w-12 h-1 rounded transition-all duration-500 ${
              index < currentStep ? 'bg-green-500' : 'bg-white/20'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ============================================================================
// WELCOME STEP COMPONENT
// ============================================================================

const WelcomeStep = ({ onContinue }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-8xl mb-6 animate-bounce">🎣</div>
      <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4 font-pixel">
        BECOME A LEGEND
      </h1>
      <p className="text-xl text-white/80 mb-2">
        Every great fisher started somewhere...
      </p>
      <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
        Usually confused, slightly damp, and with unrealistic expectations. 
        <br />Just like you! Lets begin.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onContinue}
          className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xl rounded-2xl transition-all hover:scale-105 shadow-lg shadow-amber-500/30"
          data-testid="start-creation-btn"
        >
          <span className="flex items-center gap-3">
            <Anchor className="w-6 h-6" />
            Create My Legend
            <ChevronRight className="w-6 h-6" />
          </span>
        </button>
        
        <p className="text-white/40 text-sm">
          ⚠️ Side effects may include: fish obsession, nautical puns, and an irrational fear of seagulls
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// GENDER SELECTION STEP COMPONENT
// ============================================================================

const GenderStep = ({ selected, onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-400 font-pixel mb-2">
          Who Are You?
        </h2>
        <p className="text-white/60">
          Choose your identity. No wrong answers. Except not choosing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {Object.values(GENDERS).map(gender => (
          <button
            key={gender.id}
            onClick={() => onSelect(gender.id)}
            className={`relative p-8 rounded-3xl border-4 transition-all duration-300 group ${
              selected === gender.id
                ? 'border-amber-400 bg-gradient-to-br ' + gender.color + ' scale-105 shadow-2xl'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:scale-102'
            }`}
            data-testid={`gender-${gender.id}`}
          >
            {/* Selection indicator */}
            {selected === gender.id && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-black" />
              </div>
            )}

            {/* Icon */}
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
              {gender.icon}
            </div>

            {/* Name */}
            <h3 className="text-2xl font-bold text-white mb-2">{gender.name}</h3>
            
            {/* Description */}
            <p className="text-white/60 text-sm mb-4">{gender.description}</p>

            {/* Title progression preview */}
            <div className="flex items-center justify-center gap-1 text-xs text-white/40">
              <span>{gender.titleProgression[0]}</span>
              <ChevronRight className="w-3 h-3" />
              <span>...</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-amber-400">{gender.titleProgression[5]}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <p className="text-center text-amber-400/80 mt-6 animate-fade-in">
          ✨ Excellent choice! The seas respect all who dare to fish them.
        </p>
      )}
    </div>
  );
};

// ============================================================================
// BACKGROUND/ORIGIN SELECTION STEP COMPONENT
// ============================================================================

const BackgroundStep = ({ selected, onSelect }) => {
  const [hoveredBg, setHoveredBg] = useState(null);
  const activeBg = hoveredBg || selected;
  const bgData = BACKGROUNDS.find(b => b.id === activeBg);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-400 font-pixel mb-2">
          Your Origins
        </h2>
        <p className="text-white/60">
          Every legend has a beginning. Yours is probably embarrassing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Background Options */}
        <div className="lg:col-span-2 space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              onClick={() => onSelect(bg.id)}
              onMouseEnter={() => setHoveredBg(bg.id)}
              onMouseLeave={() => setHoveredBg(null)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected === bg.id
                  ? 'border-amber-400 bg-gradient-to-r ' + bg.color + ' shadow-lg'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              data-testid={`background-${bg.id}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{bg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-lg">{bg.name}</span>
                    {selected === bg.id && (
                      <Check className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{bg.description}</p>
                  
                  {/* Bonuses */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(bg.bonuses).map(([stat, val]) => val > 0 && (
                      <span 
                        key={stat} 
                        className="text-xs px-2 py-1 bg-green-500/30 text-green-300 rounded-full"
                      >
                        +{val} {stat}
                      </span>
                    ))}
                    <span className="text-xs px-2 py-1 bg-amber-500/30 text-amber-300 rounded-full">
                      💰 {bg.startingGold}g
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block">
          <div className={`sticky top-0 p-6 rounded-2xl border-2 transition-all duration-300 ${
            bgData 
              ? 'border-amber-400/50 bg-gradient-to-br ' + (bgData?.color || 'from-gray-800 to-gray-900')
              : 'border-white/10 bg-white/5'
          }`}>
            {bgData ? (
              <div className="text-center">
                <div className="text-6xl mb-4">{bgData.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{bgData.name}</h3>
                <p className="text-white/80 text-sm mb-4">{bgData.longDescription}</p>
                
                <div className="bg-black/30 rounded-xl p-4 mb-4">
                  <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">Starting Bonus</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🎁</span>
                    <span className="text-white">{bgData.startingItem}</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-purple-400 uppercase tracking-wider mb-2">Character Quirk</div>
                  <p className="text-white/70 text-sm italic">"{bgData.quirk}"</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/40 py-12">
                <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Hover over an origin to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APPEARANCE CUSTOMIZATION STEP COMPONENT
// ============================================================================

const AppearanceStep = ({ gender, appearance, onUpdate }) => {
  const genderData = GENDERS[gender] || GENDERS.male;
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-400 font-pixel mb-2">
          Your Look
        </h2>
        <p className="text-white/60">
          Style matters. Even fish judge you. Especially fish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Main portrait */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/30 flex items-center justify-center border-4 border-amber-500/50 shadow-2xl">
              <span className="text-8xl">
                {genderData.portraits[appearance.portrait]}
              </span>
            </div>
            
            {/* Accessory badge */}
            {appearance.accessory !== 'none' && (
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400 shadow-lg">
                <span className="text-2xl">
                  {ACCESSORIES.find(a => a.id === appearance.accessory)?.icon}
                </span>
              </div>
            )}
          </div>

          {/* Current selections */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">Current Look:</p>
            <p className="text-white font-bold">
              {genderData.name} with {ACCESSORIES.find(a => a.id === appearance.accessory)?.name || 'Nothing Special'}
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          {/* Portrait Selection */}
          <div>
            <label className="block text-amber-400 font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Choose Your Face
            </label>
            <div className="grid grid-cols-6 gap-2">
              {genderData.portraits.map((portrait, index) => (
                <button
                  key={index}
                  onClick={() => onUpdate({ portrait: index })}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    appearance.portrait === index
                      ? 'bg-amber-500 scale-110 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  data-testid={`portrait-${index}`}
                >
                  {portrait}
                </button>
              ))}
            </div>
          </div>

          {/* Accessory Selection */}
          <div>
            <label className="block text-amber-400 font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Pick an Accessory
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ACCESSORIES.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => onUpdate({ accessory: acc.id })}
                  className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                    appearance.accessory === acc.id
                      ? 'bg-purple-600 scale-105 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  title={acc.description}
                  data-testid={`accessory-${acc.id}`}
                >
                  <span className="text-2xl mb-1">{acc.icon}</span>
                  <span className="text-xs text-white/70 truncate w-full text-center">{acc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// NAME INPUT STEP COMPONENT
// ============================================================================

const NameStep = ({ name, gender, background, appearance, onUpdate }) => {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const genderData = GENDERS[gender] || GENDERS.male;
  const bgData = BACKGROUNDS.find(b => b.id === background);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-400 font-pixel mb-2">
          Your Legend
        </h2>
        <p className="text-white/60">
          What name will echo across the seas? (No pressure)
        </p>
      </div>

      {/* Character Preview Card */}
      <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 rounded-2xl p-6 mb-6 border border-amber-500/30">
        <div className="flex items-center gap-6">
          {/* Portrait */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/30 flex items-center justify-center border-2 border-amber-500/50 flex-shrink-0">
            <span className="text-5xl">
              {genderData.portraits[appearance?.portrait || 0]}
            </span>
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <div className="text-2xl font-bold text-white mb-1">
              {name || 'Your Name Here'}
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>{genderData.name}</span>
              <span>•</span>
              <span>{bgData?.name || 'Unknown Origin'}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 bg-amber-500/30 text-amber-300 rounded">
                💰 {bgData?.startingGold || 0}g
              </span>
              <span className="text-xs px-2 py-0.5 bg-green-500/30 text-green-300 rounded">
                🎁 {bgData?.startingItem || 'Nothing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Name Input */}
      <div className="mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Enter your legendary name..."
          maxLength={24}
          className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white text-xl text-center placeholder-white/40 focus:outline-none focus:border-amber-500 transition-all"
          data-testid="name-input"
        />
        <div className="flex justify-between text-xs text-white/40 mt-2 px-2">
          <span>{name.length}/24 characters</span>
          <span>{name.length >= 2 ? '✓ Valid length' : 'Min 2 characters'}</span>
        </div>
      </div>

      {/* Name Suggestions */}
      {showSuggestions && (
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Need inspiration?
            </span>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-white/40 hover:text-white/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {NAME_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion.name}
                onClick={() => onUpdate(suggestion.name)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group"
                title={suggestion.joke}
                data-testid={`name-suggestion-${suggestion.name.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="text-white text-sm font-medium">{suggestion.name}</div>
                <div className="text-white/40 text-xs truncate group-hover:text-white/60">
                  {suggestion.joke}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NAVIGATION BUTTONS COMPONENT
// ============================================================================

const NavigationButtons = ({ 
  onBack, 
  onNext, 
  canGoBack, 
  canProceed, 
  isLastStep, 
  currentStep 
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mt-8">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
          canGoBack
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-white/5 text-white/30 cursor-not-allowed'
        }`}
        data-testid="back-btn"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
          canProceed
            ? isLastStep
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:scale-105'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/30 hover:scale-105'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
        data-testid="next-btn"
      >
        {isLastStep ? (
          <>
            <Anchor className="w-5 h-5" />
            Begin Adventure!
          </>
        ) : (
          <>
            Next
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

// ============================================================================
// MAIN CHARACTER CREATION COMPONENT
// ============================================================================

const CharacterCreation = ({ onComplete, onBack }) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const stepNames = ['Welcome', 'Gender', 'Origin', 'Look', 'Name'];
  const totalSteps = stepNames.length;

  // Character state
  const [character, setCharacter] = useState({
    gender: null,
    background: null,
    appearance: {
      portrait: 0,
      accessory: 'none'
    },
    name: '',
    level: 1,
    experience: 0,
    gold: 0,
    stats: {
      sailing: 0,
      fishing: 0,
      luck: 0,
      trading: 0
    }
  });

  // Update character
  const updateCharacter = useCallback((updates) => {
    setCharacter(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Update appearance
  const updateAppearance = useCallback((updates) => {
    setCharacter(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        ...updates
      }
    }));
  }, []);

  // Check if can proceed
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: return true; // Welcome
      case 1: return character.gender !== null;
      case 2: return character.background !== null;
      case 3: return true; // Appearance has defaults
      case 4: return character.name.trim().length >= 2;
      default: return false;
    }
  }, [currentStep, character]);

  // Handle next
  const handleNext = useCallback(() => {
    if (!canProceed) {
      toast.error('Please make a selection to continue!', {
        icon: '⚠️'
      });
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalize character
      const bgData = BACKGROUNDS.find(b => b.id === character.background);
      const finalCharacter = {
        ...character,
        gold: bgData?.startingGold || 50,
        startingItem: bgData?.startingItem || null,
        quirk: bgData?.quirk || null,
        stats: {
          sailing: bgData?.bonuses?.sailing || 0,
          fishing: bgData?.bonuses?.fishing || 0,
          luck: bgData?.bonuses?.luck || 0,
          trading: bgData?.bonuses?.trading || 0
        },
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
      };

      toast.success(`Welcome, ${finalCharacter.name}! Your legend begins!`, {
        icon: '🎣'
      });

      onComplete(finalCharacter);
    }
  }, [canProceed, currentStep, totalSteps, character, onComplete]);

  // Handle back
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack?.();
    }
  }, [currentStep, onBack]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && canProceed) {
        handleNext();
      } else if (e.key === 'Escape' && currentStep > 0) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed, handleNext, handleBack, currentStep]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 overflow-y-auto"
      data-testid="character-creation"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto py-4">
        
        {/* Step Indicator (hidden on welcome) */}
        {currentStep > 0 && (
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            stepNames={stepNames.slice(1)} // Skip welcome in indicator
          />
        )}

        {/* Main Content Card */}
        <div className="w-full bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
          
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <WelcomeStep onContinue={() => setCurrentStep(1)} />
          )}

          {/* Step 1: Gender Selection */}
          {currentStep === 1 && (
            <GenderStep 
              selected={character.gender}
              onSelect={(gender) => updateCharacter({ gender })}
            />
          )}

          {/* Step 2: Background Selection */}
          {currentStep === 2 && (
            <BackgroundStep 
              selected={character.background}
              onSelect={(background) => updateCharacter({ background })}
            />
          )}

          {/* Step 3: Appearance Customization */}
          {currentStep === 3 && (
            <AppearanceStep 
              gender={character.gender}
              appearance={character.appearance}
              onUpdate={updateAppearance}
            />
          )}

          {/* Step 4: Name Entry */}
          {currentStep === 4 && (
            <NameStep 
              name={character.name}
              gender={character.gender}
              background={character.background}
              appearance={character.appearance}
              onUpdate={(name) => updateCharacter({ name })}
            />
          )}

          {/* Navigation Buttons (hidden on welcome) */}
          {currentStep > 0 && (
            <NavigationButtons 
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={currentStep > 0}
              canProceed={canProceed}
              isLastStep={currentStep === totalSteps - 1}
              currentStep={currentStep}
            />
          )}
        </div>

        {/* Footer hint */}
        {currentStep > 0 && (
          <p className="text-white/30 text-xs mt-4">
            Press Enter to continue • Press Escape to go back
          </p>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes swim {
          0% {
            transform: translateX(0) scaleX(var(--swim-direction, 1));
          }
          100% {
            transform: translateX(calc(100vw + 100px)) scaleX(var(--swim-direction, 1));
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-up {
          animation: float-up linear infinite;
        }

        .animate-swim {
          animation: swim linear infinite;
        }

        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default CharacterCreation;

// Line Count: ~1000 lines
// Components: 8 (AnimatedBackground, StepIndicator, WelcomeStep, GenderStep, 
//               BackgroundStep, AppearanceStep, NameStep, NavigationButtons)
// Main Export: CharacterCreation
