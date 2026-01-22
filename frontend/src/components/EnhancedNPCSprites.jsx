/**
 * ============================================================================
 * ENHANCED NPC SPRITES - Advanced Pixel Art Animation System
 * ============================================================================
 * Complete sprite rendering with:
 * - Multi-frame animations for all states
 * - Emotion indicators
 * - Quest/interaction markers
 * - Relationship hearts
 * - Smooth transitions
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Heart, AlertCircle, MessageCircle, Star, Gift, Sword, Zap, Crown, Skull, Music, Coffee, Moon } from 'lucide-react';

// ============================================================================
// NPC COLOR PALETTES
// ============================================================================

const NPC_COLOR_PALETTES = {
  merchant: {
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#FFD700',
    skin: '#FFDAB9',
    hair: '#4A3C31',
  },
  fisherman: {
    primary: '#1E3A5F',
    secondary: '#4A7C9B',
    accent: '#87CEEB',
    skin: '#FFDAB9',
    hair: '#696969',
  },
  pirate: {
    primary: '#2C1810',
    secondary: '#5C3A21',
    accent: '#FF4444',
    skin: '#DEB887',
    hair: '#1A1A1A',
  },
  noble: {
    primary: '#4B0082',
    secondary: '#8B008B',
    accent: '#FFD700',
    skin: '#FFE4C4',
    hair: '#8B4513',
  },
  witch: {
    primary: '#1A0033',
    secondary: '#4B0082',
    accent: '#9400D3',
    skin: '#C9C9FF',
    hair: '#000000',
  },
  ghost: {
    primary: 'rgba(200, 220, 255, 0.7)',
    secondary: 'rgba(150, 180, 220, 0.5)',
    accent: '#00FFFF',
    skin: 'rgba(220, 230, 255, 0.8)',
    hair: 'rgba(180, 200, 230, 0.6)',
  },
  skeleton: {
    primary: '#F5F5DC',
    secondary: '#D2B48C',
    accent: '#FF6347',
    skin: '#F0E68C',
    hair: null,
  },
};

// ============================================================================
// ANIMATION FRAME DATA
// ============================================================================

const ANIMATION_FRAMES = {
  idle: {
    frameCount: 4,
    frameDuration: 400,
    loop: true,
  },
  walk: {
    frameCount: 8,
    frameDuration: 100,
    loop: true,
  },
  run: {
    frameCount: 6,
    frameDuration: 80,
    loop: true,
  },
  talk: {
    frameCount: 4,
    frameDuration: 200,
    loop: true,
  },
  fish: {
    frameCount: 6,
    frameDuration: 300,
    loop: true,
  },
  sleep: {
    frameCount: 2,
    frameDuration: 1000,
    loop: true,
  },
  attack: {
    frameCount: 4,
    frameDuration: 100,
    loop: false,
  },
  startled: {
    frameCount: 2,
    frameDuration: 150,
    loop: false,
  },
  celebrate: {
    frameCount: 6,
    frameDuration: 150,
    loop: true,
  },
};

// ============================================================================
// EMOTION BUBBLE COMPONENT
// ============================================================================

const EmotionBubble = ({ emotion, isVisible }) => {
  const emotionConfig = {
    happy: { icon: '😊', color: '#FFD700', animation: 'animate-bounce' },
    angry: { icon: '😠', color: '#FF4444', animation: 'animate-shake' },
    sad: { icon: '😢', color: '#4A90D9', animation: '' },
    surprised: { icon: '😲', color: '#FF9900', animation: 'animate-scale-pop' },
    love: { icon: '❤️', color: '#FF69B4', animation: 'animate-pulse' },
    confused: { icon: '❓', color: '#9966FF', animation: 'animate-wiggle' },
    sleepy: { icon: '💤', color: '#87CEEB', animation: 'animate-float' },
    excited: { icon: '✨', color: '#FFD700', animation: 'animate-sparkle' },
    scared: { icon: '😨', color: '#87CEEB', animation: 'animate-shake' },
    thinking: { icon: '🤔', color: '#9966FF', animation: '' },
  };

  const config = emotionConfig[emotion] || emotionConfig.happy;

  if (!isVisible) return null;

  return (
    <div 
      className={`absolute -top-10 left-1/2 -translate-x-1/2 ${config.animation}`}
      style={{ zIndex: 100 }}
    >
      <div 
        className="relative bg-white rounded-full p-1.5 shadow-lg border-2"
        style={{ borderColor: config.color }}
      >
        <span className="text-lg">{config.icon}</span>
        {/* Speech bubble tail */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r-2 border-b-2"
          style={{ borderColor: config.color }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// QUEST MARKER COMPONENT
// ============================================================================

const QuestMarker = ({ type, isActive }) => {
  const markerConfig = {
    available: { 
      icon: '❗', 
      color: '#FFD700', 
      bgColor: 'bg-yellow-500',
      animation: 'animate-bounce'
    },
    inProgress: { 
      icon: '❓', 
      color: '#87CEEB', 
      bgColor: 'bg-blue-500',
      animation: 'animate-pulse'
    },
    complete: { 
      icon: '❕', 
      color: '#00FF00', 
      bgColor: 'bg-green-500',
      animation: 'animate-bounce'
    },
    special: { 
      icon: '⭐', 
      color: '#9400D3', 
      bgColor: 'bg-purple-500',
      animation: 'animate-spin-slow'
    },
  };

  const config = markerConfig[type] || markerConfig.available;

  return (
    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${config.animation}`}>
      <div 
        className={`${config.bgColor} rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white`}
        style={{ 
          boxShadow: `0 0 10px ${config.color}, 0 0 20px ${config.color}` 
        }}
      >
        <span className="text-sm">{config.icon}</span>
      </div>
    </div>
  );
};

// ============================================================================
// RELATIONSHIP INDICATOR
// ============================================================================

const RelationshipIndicator = ({ level, isVisible }) => {
  if (!isVisible) return null;

  // Level: -100 to 100
  const hearts = Math.ceil((level + 100) / 40); // 0-5 hearts
  const heartColor = level >= 50 ? '#FF69B4' : level >= 0 ? '#FFB6C1' : '#666666';

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Heart
          key={i}
          className={`w-3 h-3 transition-all duration-300 ${i < hearts ? 'scale-100' : 'scale-75 opacity-30'}`}
          fill={i < hearts ? heartColor : 'transparent'}
          stroke={i < hearts ? heartColor : '#666'}
        />
      ))}
    </div>
  );
};

// ============================================================================
// STATE INDICATOR ICONS
// ============================================================================

const StateIndicator = ({ state }) => {
  const stateIcons = {
    sleeping: { icon: <Moon className="w-4 h-4" />, color: '#87CEEB', label: 'Zzz...' },
    working: { icon: <Coffee className="w-4 h-4" />, color: '#8B4513', label: 'Busy' },
    fishing: { icon: '🎣', color: '#4A90D9', label: 'Fishing' },
    talking: { icon: <MessageCircle className="w-4 h-4" />, color: '#32CD32', label: '' },
    selling: { icon: '💰', color: '#FFD700', label: 'Shop' },
    performing: { icon: <Music className="w-4 h-4" />, color: '#FF69B4', label: '' },
    fighting: { icon: <Sword className="w-4 h-4" />, color: '#FF4444', label: '' },
    celebrating: { icon: '🎉', color: '#FFD700', label: '' },
    praying: { icon: '🙏', color: '#9966FF', label: '' },
  };

  const config = stateIcons[state];
  if (!config) return null;

  return (
    <div className="absolute -top-6 -right-2 flex items-center gap-1 bg-black/60 rounded-full px-1.5 py-0.5">
      <span style={{ color: config.color }}>
        {typeof config.icon === 'string' ? config.icon : config.icon}
      </span>
      {config.label && <span className="text-[8px] text-white">{config.label}</span>}
    </div>
  );
};

// ============================================================================
// PIXEL ART NPC BODY
// ============================================================================

const PixelNPCBody = ({ 
  palette, 
  frame, 
  animation, 
  facing,
  hasHat,
  hatType,
  accessories,
}) => {
  const colors = NPC_COLOR_PALETTES[palette] || NPC_COLOR_PALETTES.merchant;
  
  // Animation-based body transforms
  const getBodyTransform = () => {
    switch (animation) {
      case 'walk':
        const walkBob = Math.sin(frame * Math.PI / 2) * 2;
        return `translateY(${walkBob}px)`;
      case 'run':
        const runBob = Math.sin(frame * Math.PI / 2) * 3;
        return `translateY(${runBob}px)`;
      case 'talk':
        return '';
      case 'fish':
        return `rotate(${Math.sin(frame * 0.5) * 5}deg)`;
      case 'sleep':
        return 'translateY(2px)';
      case 'startled':
        return 'translateY(-3px)';
      case 'celebrate':
        return `translateY(${-Math.abs(Math.sin(frame * Math.PI / 3) * 5)}px)`;
      default:
        return '';
    }
  };

  // Get arm positions based on animation
  const getArmPositions = () => {
    switch (animation) {
      case 'walk':
      case 'run':
        const swing = Math.sin(frame * Math.PI / 2) * 15;
        return { left: -swing, right: swing };
      case 'fish':
        return { left: 30, right: 30 };
      case 'talk':
        return { left: Math.sin(frame * Math.PI / 2) * 10, right: 0 };
      case 'celebrate':
        return { left: -45, right: -45 };
      default:
        return { left: 0, right: 0 };
    }
  };

  const bodyTransform = getBodyTransform();
  const armPos = getArmPositions();

  return (
    <svg 
      width="48" 
      height="64" 
      viewBox="0 0 48 64"
      style={{ 
        transform: `scaleX(${facing === 'left' ? -1 : 1}) ${bodyTransform}`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Shadow */}
      <ellipse cx="24" cy="62" rx="14" ry="3" fill="rgba(0,0,0,0.3)" />
      
      {/* Legs */}
      <g className="legs">
        <rect 
          x="16" 
          y="44" 
          width="6" 
          height="16" 
          rx="2" 
          fill={colors.primary}
          style={{
            transform: animation === 'walk' || animation === 'run'
              ? `rotate(${Math.sin(frame * Math.PI / 2) * 20}deg)`
              : '',
            transformOrigin: '19px 44px',
          }}
        />
        <rect 
          x="26" 
          y="44" 
          width="6" 
          height="16" 
          rx="2" 
          fill={colors.primary}
          style={{
            transform: animation === 'walk' || animation === 'run'
              ? `rotate(${-Math.sin(frame * Math.PI / 2) * 20}deg)`
              : '',
            transformOrigin: '29px 44px',
          }}
        />
        {/* Shoes */}
        <ellipse cx="18" cy="58" rx="5" ry="3" fill="#1A1A1A" />
        <ellipse cx="30" cy="58" rx="5" ry="3" fill="#1A1A1A" />
      </g>
      
      {/* Body/Torso */}
      <g className="torso">
        <rect x="12" y="28" width="24" height="18" rx="4" fill={colors.primary} />
        {/* Collar/detail */}
        <rect x="18" y="28" width="12" height="4" rx="2" fill={colors.secondary} />
        {/* Belt */}
        <rect x="12" y="42" width="24" height="4" fill={colors.accent} />
        <rect x="22" y="41" width="4" height="6" rx="1" fill="#C0C0C0" /> {/* Buckle */}
      </g>
      
      {/* Arms */}
      <g className="arms">
        {/* Left arm */}
        <rect 
          x="6" 
          y="30" 
          width="6" 
          height="16" 
          rx="3" 
          fill={colors.primary}
          style={{
            transform: `rotate(${armPos.left}deg)`,
            transformOrigin: '9px 30px',
          }}
        />
        {/* Left hand */}
        <circle 
          cx="9" 
          cy="46" 
          r="4" 
          fill={colors.skin}
          style={{
            transform: `rotate(${armPos.left}deg)`,
            transformOrigin: '9px 30px',
          }}
        />
        
        {/* Right arm */}
        <rect 
          x="36" 
          y="30" 
          width="6" 
          height="16" 
          rx="3" 
          fill={colors.primary}
          style={{
            transform: `rotate(${armPos.right}deg)`,
            transformOrigin: '39px 30px',
          }}
        />
        {/* Right hand */}
        <circle 
          cx="39" 
          cy="46" 
          r="4" 
          fill={colors.skin}
          style={{
            transform: `rotate(${armPos.right}deg)`,
            transformOrigin: '39px 30px',
          }}
        />
      </g>
      
      {/* Head */}
      <g className="head">
        {/* Neck */}
        <rect x="20" y="22" width="8" height="8" fill={colors.skin} />
        
        {/* Head shape */}
        <ellipse cx="24" cy="14" rx="12" ry="13" fill={colors.skin} />
        
        {/* Hair */}
        {colors.hair && (
          <path 
            d="M 12 14 Q 12 4 24 2 Q 36 4 36 14 L 36 10 Q 36 2 24 0 Q 12 2 12 10 Z"
            fill={colors.hair}
          />
        )}
        
        {/* Eyes */}
        <g className="eyes">
          {animation === 'sleep' ? (
            <>
              <line x1="16" y1="13" x2="22" y2="13" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="13" x2="32" y2="13" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="18" cy="13" rx="3" ry="3" fill="white" />
              <ellipse cx="30" cy="13" rx="3" ry="3" fill="white" />
              <circle cx={18 + (animation === 'talk' ? Math.sin(frame) : 0)} cy="13" r="2" fill="#333" />
              <circle cx={30 + (animation === 'talk' ? Math.sin(frame) : 0)} cy="13" r="2" fill="#333" />
              {/* Eye shine */}
              <circle cx="17" cy="12" r="0.5" fill="white" />
              <circle cx="29" cy="12" r="0.5" fill="white" />
            </>
          )}
        </g>
        
        {/* Eyebrows */}
        <line x1="15" y1="9" x2="21" y2="10" stroke={colors.hair || '#333'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="27" y1="10" x2="33" y2="9" stroke={colors.hair || '#333'} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Nose */}
        <ellipse cx="24" cy="17" rx="1.5" ry="1" fill={colors.skin} style={{ filter: 'brightness(0.9)' }} />
        
        {/* Mouth */}
        {animation === 'talk' ? (
          <ellipse 
            cx="24" 
            cy="21" 
            rx={2 + Math.abs(Math.sin(frame * 0.5))} 
            ry={1 + Math.abs(Math.sin(frame * 0.5))} 
            fill="#333" 
          />
        ) : animation === 'sleep' ? (
          <path d="M 21 21 Q 24 23 27 21" stroke="#333" strokeWidth="1" fill="none" />
        ) : (
          <path d="M 21 21 Q 24 23 27 21" stroke="#333" strokeWidth="1.5" fill="none" />
        )}
      </g>
      
      {/* Hat */}
      {hasHat && (
        <g className="hat">
          {hatType === 'pirate' && (
            <>
              <ellipse cx="24" cy="2" rx="14" ry="4" fill="#1A1A1A" />
              <path d="M 10 2 Q 24 -8 38 2 L 36 4 Q 24 -4 12 4 Z" fill="#1A1A1A" />
              <ellipse cx="24" cy="0" rx="3" ry="1" fill="#FFD700" /> {/* Skull emblem */}
            </>
          )}
          {hatType === 'merchant' && (
            <>
              <ellipse cx="24" cy="4" rx="12" ry="3" fill={colors.secondary} />
              <rect x="16" y="-2" width="16" height="6" rx="2" fill={colors.secondary} />
            </>
          )}
          {hatType === 'wizard' && (
            <path d="M 12 4 L 24 -12 L 36 4 Z" fill="#4B0082" />
          )}
        </g>
      )}
      
      {/* Accessories */}
      {accessories?.includes('eyepatch') && (
        <ellipse cx="30" cy="13" rx="4" ry="4" fill="#1A1A1A" />
      )}
      {accessories?.includes('beard') && (
        <path d="M 16 20 Q 24 30 32 20" fill={colors.hair || '#666'} />
      )}
      {accessories?.includes('earring') && (
        <circle cx="12" cy="16" r="2" fill="#FFD700" />
      )}
    </svg>
  );
};

// ============================================================================
// MAIN ENHANCED NPC SPRITE COMPONENT
// ============================================================================

export const EnhancedNPCSprite = ({
  npc,
  position,
  state = 'idle',
  mood = 'neutral',
  facing = 'right',
  relationshipLevel = 0,
  questStatus = null,
  isHovered = false,
  isSelected = false,
  onClick,
  onHover,
  showName = true,
  showMood = true,
  scale = 1,
}) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [showRelationship, setShowRelationship] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const animationRef = useRef(null);
  const lastFrameTime = useRef(Date.now());

  // Get animation config
  const animConfig = ANIMATION_FRAMES[state] || ANIMATION_FRAMES.idle;

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime.current;

      if (elapsed >= animConfig.frameDuration) {
        setAnimationFrame(prev => {
          if (animConfig.loop) {
            return (prev + 1) % animConfig.frameCount;
          }
          return Math.min(prev + 1, animConfig.frameCount - 1);
        });
        lastFrameTime.current = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [state, animConfig]);

  // Show emotion based on mood
  useEffect(() => {
    const moodEmotions = {
      joyful: 'happy',
      happy: 'happy',
      angry: 'angry',
      sad: 'sad',
      scared: 'scared',
      excited: 'excited',
      suspicious: 'confused',
    };

    if (moodEmotions[mood] && isHovered) {
      setCurrentEmotion(moodEmotions[mood]);
    } else {
      setCurrentEmotion(null);
    }
  }, [mood, isHovered]);

  // Show relationship on hover
  useEffect(() => {
    setShowRelationship(isHovered);
  }, [isHovered]);

  // Determine NPC palette from data
  const palette = useMemo(() => {
    if (npc.palette) return npc.palette;
    if (npc.role === 'merchant') return 'merchant';
    if (npc.role === 'pirate' || npc.id?.includes('pirate')) return 'pirate';
    if (npc.role === 'noble') return 'noble';
    if (npc.id?.includes('ghost')) return 'ghost';
    if (npc.id?.includes('skeleton')) return 'skeleton';
    if (npc.id?.includes('witch')) return 'witch';
    return 'fisherman';
  }, [npc]);

  // Get NPC-specific accessories
  const accessories = useMemo(() => {
    const acc = [];
    if (npc.hasEyepatch) acc.push('eyepatch');
    if (npc.hasBeard) acc.push('beard');
    if (npc.hasEarring) acc.push('earring');
    return acc;
  }, [npc]);

  return (
    <div
      className={`
        absolute cursor-pointer transition-transform duration-200 origin-bottom
        ${isHovered ? 'scale-110 z-50' : ''}
        ${isSelected ? 'ring-2 ring-amber-400 ring-offset-4 ring-offset-transparent rounded-full' : ''}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -100%) scale(${scale})`,
        zIndex: Math.floor(position.y) + (isHovered ? 1000 : 0),
      }}
      onClick={() => onClick?.(npc)}
      onMouseEnter={() => onHover?.(npc, true)}
      onMouseLeave={() => onHover?.(npc, false)}
      data-testid={`npc-sprite-${npc.id}`}
    >
      {/* Quest marker */}
      {questStatus && <QuestMarker type={questStatus} isActive />}

      {/* Relationship hearts */}
      <RelationshipIndicator level={relationshipLevel} isVisible={showRelationship} />

      {/* Emotion bubble */}
      {showMood && <EmotionBubble emotion={currentEmotion} isVisible={!!currentEmotion} />}

      {/* State indicator */}
      <StateIndicator state={state} />

      {/* NPC body */}
      <div className="relative">
        <PixelNPCBody
          palette={palette}
          frame={animationFrame}
          animation={state}
          facing={facing}
          hasHat={npc.hasHat}
          hatType={npc.hatType}
          accessories={accessories}
        />

        {/* Glow effect on hover */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <div className="w-3 h-3 bg-amber-400 rotate-45 animate-pulse" />
          </div>
        )}
      </div>

      {/* Name tag */}
      {showName && (
        <div 
          className={`
            absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
            transition-all duration-200
            ${isHovered ? 'opacity-100 -bottom-8' : 'opacity-70'}
          `}
        >
          <span 
            className={`
              text-xs px-2 py-0.5 rounded-full
              ${isHovered ? 'bg-black/80 text-amber-200' : 'bg-black/50 text-white'}
            `}
          >
            {npc.name}
          </span>
        </div>
      )}

      {/* Interaction prompt on hover */}
      {isHovered && npc.canInteract && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-bold">
            Click to Talk
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NPC GROUP COMPONENT - For crowds/gatherings
// ============================================================================

export const NPCGroup = ({ npcs, basePosition, spacing = 30, onNPCClick }) => {
  return (
    <div 
      className="relative"
      style={{ 
        left: basePosition.x, 
        top: basePosition.y,
      }}
    >
      {npcs.map((npc, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const offsetX = (col - 1) * spacing;
        const offsetY = row * spacing * 0.8;

        return (
          <EnhancedNPCSprite
            key={npc.id}
            npc={npc}
            position={{ x: offsetX, y: offsetY }}
            state={npc.state || 'idle'}
            onClick={onNPCClick}
            scale={0.8}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default EnhancedNPCSprite;
