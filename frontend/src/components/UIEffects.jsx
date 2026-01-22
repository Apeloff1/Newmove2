/**
 * ============================================================================
 * ADVANCED UI EFFECTS SYSTEM - Premium Visual Polish
 * ============================================================================
 * Complete effects library including:
 * - Dynamic particle systems
 * - Screen effects (shake, flash, glow)
 * - UI transitions and animations
 * - Weather overlays
 * - Achievement celebrations
 * - Reward popups
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================================================
// PARTICLE SYSTEM
// ============================================================================

const PARTICLE_TYPES = {
  sparkle: {
    emoji: '✨',
    colors: ['#FFD700', '#FFEC8B', '#FFF'],
    size: { min: 8, max: 16 },
    speed: { min: 1, max: 3 },
    lifetime: { min: 1000, max: 2000 },
    gravity: -0.1,
    spread: 360,
  },
  confetti: {
    shapes: ['square', 'circle', 'triangle'],
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'],
    size: { min: 6, max: 12 },
    speed: { min: 2, max: 5 },
    lifetime: { min: 2000, max: 4000 },
    gravity: 0.15,
    spread: 180,
    rotationSpeed: { min: 2, max: 8 },
  },
  coins: {
    emoji: '🪙',
    colors: ['#FFD700'],
    size: { min: 16, max: 24 },
    speed: { min: 3, max: 6 },
    lifetime: { min: 1500, max: 2500 },
    gravity: 0.2,
    spread: 120,
  },
  hearts: {
    emoji: '❤️',
    colors: ['#FF69B4', '#FF1493', '#FF6B6B'],
    size: { min: 12, max: 20 },
    speed: { min: 1, max: 2 },
    lifetime: { min: 2000, max: 3000 },
    gravity: -0.05,
    spread: 90,
  },
  stars: {
    emoji: '⭐',
    colors: ['#FFD700', '#FFA500', '#FFEC8B'],
    size: { min: 10, max: 18 },
    speed: { min: 2, max: 4 },
    lifetime: { min: 1500, max: 2500 },
    gravity: -0.1,
    spread: 360,
  },
  bubbles: {
    shapes: ['circle'],
    colors: ['rgba(100, 200, 255, 0.6)', 'rgba(150, 220, 255, 0.5)', 'rgba(200, 240, 255, 0.4)'],
    size: { min: 8, max: 20 },
    speed: { min: 0.5, max: 2 },
    lifetime: { min: 3000, max: 5000 },
    gravity: -0.15,
    spread: 60,
  },
  fire: {
    shapes: ['circle'],
    colors: ['#FF4500', '#FF6B00', '#FF8C00', '#FFD700'],
    size: { min: 8, max: 16 },
    speed: { min: 2, max: 4 },
    lifetime: { min: 500, max: 1000 },
    gravity: -0.3,
    spread: 30,
    fadeOut: true,
  },
  snow: {
    emoji: '❄️',
    colors: ['#FFF', '#E0E0E0'],
    size: { min: 8, max: 14 },
    speed: { min: 0.5, max: 1.5 },
    lifetime: { min: 5000, max: 10000 },
    gravity: 0.05,
    spread: 40,
    sway: true,
  },
  leaves: {
    emoji: '🍂',
    alternates: ['🍁', '🍃'],
    colors: ['#D2691E', '#8B4513', '#228B22'],
    size: { min: 12, max: 18 },
    speed: { min: 0.5, max: 1.5 },
    lifetime: { min: 4000, max: 8000 },
    gravity: 0.08,
    spread: 60,
    rotationSpeed: { min: 1, max: 3 },
    sway: true,
  },
  petals: {
    emoji: '🌸',
    colors: ['#FFB7C5', '#FFC0CB', '#FF69B4'],
    size: { min: 10, max: 16 },
    speed: { min: 0.3, max: 1 },
    lifetime: { min: 4000, max: 7000 },
    gravity: 0.06,
    spread: 50,
    sway: true,
  },
  xp: {
    shapes: ['text'],
    text: '+XP',
    colors: ['#9400D3', '#8A2BE2'],
    size: { min: 14, max: 18 },
    speed: { min: 1, max: 2 },
    lifetime: { min: 1500, max: 2000 },
    gravity: -0.1,
    spread: 45,
  },
};

class Particle {
  constructor(x, y, config, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.config = config;
    
    // Random values within config ranges
    this.size = this.randomRange(config.size.min, config.size.max);
    const speed = this.randomRange(config.speed.min, config.speed.max);
    
    // Calculate velocity based on spread angle
    const angleRange = config.spread * (Math.PI / 180);
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * angleRange;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    this.lifetime = this.randomRange(config.lifetime.min, config.lifetime.max);
    this.age = 0;
    this.opacity = 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = config.rotationSpeed 
      ? this.randomRange(config.rotationSpeed.min, config.rotationSpeed.max) * (Math.random() > 0.5 ? 1 : -1)
      : 0;
    
    // Visual properties
    if (config.emoji) {
      this.emoji = config.alternates && Math.random() > 0.6
        ? config.alternates[Math.floor(Math.random() * config.alternates.length)]
        : config.emoji;
    } else {
      this.shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
    }
    this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    this.text = config.text;
    
    // Sway properties
    this.swayOffset = Math.random() * Math.PI * 2;
    this.swayAmount = config.sway ? 2 : 0;
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  update(deltaTime) {
    this.age += deltaTime;
    
    // Apply gravity
    this.vy += this.config.gravity * (deltaTime / 16);
    
    // Apply sway
    if (this.swayAmount) {
      this.vx += Math.sin(this.age / 500 + this.swayOffset) * 0.1;
    }
    
    // Update position
    this.x += this.vx * (deltaTime / 16);
    this.y += this.vy * (deltaTime / 16);
    
    // Update rotation
    this.rotation += this.rotationSpeed * (deltaTime / 16);
    
    // Fade out
    if (this.config.fadeOut || this.age > this.lifetime * 0.7) {
      this.opacity = Math.max(0, 1 - (this.age - this.lifetime * 0.7) / (this.lifetime * 0.3));
    }
    
    return this.age < this.lifetime;
  }
}

// ============================================================================
// PARTICLE EMITTER COMPONENT
// ============================================================================

export const ParticleEmitter = ({
  type = 'sparkle',
  x,
  y,
  count = 20,
  duration = 0, // 0 = one-shot, >0 = continuous
  rate = 5, // particles per frame for continuous
  spread,
  onComplete,
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  const emitTimerRef = useRef(0);
  const isActiveRef = useRef(true);

  // Initialize lastTimeRef on first render
  useEffect(() => {
    lastTimeRef.current = Date.now();
  }, []);

  const config = useMemo(() => {
    const base = PARTICLE_TYPES[type] || PARTICLE_TYPES.sparkle;
    return spread ? { ...base, spread } : base;
  }, [type, spread]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initial burst
    if (duration === 0) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle(x, y, config, type));
      }
    }

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Emit new particles for continuous mode
      if (duration > 0 && isActiveRef.current) {
        emitTimerRef.current += deltaTime;
        const emitInterval = 1000 / rate;
        while (emitTimerRef.current >= emitInterval) {
          particlesRef.current.push(new Particle(x, y, config, type));
          emitTimerRef.current -= emitInterval;
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        const alive = particle.update(deltaTime);
        
        if (alive) {
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation * Math.PI / 180);

          if (particle.emoji) {
            ctx.font = `${particle.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(particle.emoji, 0, 0);
          } else if (particle.text) {
            ctx.font = `bold ${particle.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = particle.color;
            ctx.fillText(particle.text, 0, 0);
          } else {
            ctx.fillStyle = particle.color;
            
            switch (particle.shape) {
              case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
              case 'square':
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                break;
              case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -particle.size / 2);
                ctx.lineTo(particle.size / 2, particle.size / 2);
                ctx.lineTo(-particle.size / 2, particle.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
              default:
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            }
          }

          ctx.restore();
        }

        return alive;
      });

      // Check if should continue
      if (duration === 0 && particlesRef.current.length === 0) {
        onComplete?.();
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Auto-stop for duration mode
    let timeout;
    if (duration > 0) {
      timeout = setTimeout(() => {
        isActiveRef.current = false;
      }, duration);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (timeout) clearTimeout(timeout);
    };
  }, [x, y, count, duration, rate, config, type, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// ============================================================================
// SCREEN EFFECTS
// ============================================================================

export const ScreenShake = ({ intensity = 5, duration = 300, children }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const startTime = Date.now();
    
    const shake = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < duration) {
        const decay = 1 - elapsed / duration;
        const shakeX = (Math.random() - 0.5) * 2 * intensity * decay;
        const shakeY = (Math.random() - 0.5) * 2 * intensity * decay;
        setOffset({ x: shakeX, y: shakeY });
        requestAnimationFrame(shake);
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    shake();
  }, [intensity, duration]);

  return (
    <div style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
      {children}
    </div>
  );
};

export const ScreenFlash = ({ color = '#FFF', duration = 200, onComplete }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const startTime = Date.now();
    
    const fade = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < duration) {
        setOpacity(1 - elapsed / duration);
        requestAnimationFrame(fade);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(fade);
  }, [duration, onComplete]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ 
        backgroundColor: color, 
        opacity,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

export const VignetteEffect = ({ intensity = 0.5, color = '#000' }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, ${color} 100%)`,
        opacity: intensity,
      }}
    />
  );
};

export const GlowEffect = ({ x, y, color = '#FFD700', size = 100, pulse = true }) => {
  return (
    <div
      className={`fixed pointer-events-none ${pulse ? 'animate-pulse' : ''}`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
        borderRadius: '50%',
        zIndex: 50,
      }}
    />
  );
};

// ============================================================================
// REWARD POPUP
// ============================================================================

export const RewardPopup = ({ 
  rewards, 
  position = 'center', 
  onComplete,
  title = 'REWARDS!'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const positionStyles = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    top: 'top-20 left-1/2 -translate-x-1/2',
    bottom: 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <>
      {showConfetti && (
        <ParticleEmitter
          type="confetti"
          x={window.innerWidth / 2}
          y={window.innerHeight / 3}
          count={50}
          onComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div 
        className={`
          fixed ${positionStyles[position]} z-[1000]
          transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}
      >
        <div className="bg-gradient-to-b from-amber-900/95 to-amber-950/95 rounded-2xl p-6 border-4 border-amber-400 shadow-2xl min-w-[280px]">
          {/* Title */}
          <h2 className="text-2xl font-pixel text-amber-400 text-center mb-4 animate-pulse">
            {title}
          </h2>

          {/* Rewards Grid */}
          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-black/30 rounded-lg p-3 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-2xl">{reward.icon}</span>
                <div className="flex-1">
                  <div className="text-white font-bold">{reward.name}</div>
                  {reward.description && (
                    <div className="text-amber-200/60 text-xs">{reward.description}</div>
                  )}
                </div>
                {reward.amount && (
                  <span className="text-amber-400 font-bold">+{reward.amount}</span>
                )}
              </div>
            ))}
          </div>

          {/* Continue hint */}
          <div className="text-center mt-4 text-amber-200/50 text-sm animate-pulse">
            Click anywhere to continue
          </div>
        </div>
      </div>

      {/* Click to dismiss overlay */}
      <div 
        className="fixed inset-0 z-[999]"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onComplete?.(), 300);
        }}
      />
    </>
  );
};

// ============================================================================
// ACHIEVEMENT CELEBRATION
// ============================================================================

export const AchievementCelebration = ({ 
  achievement,
  onComplete,
}) => {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('show'), 100),
      setTimeout(() => setPhase('exit'), 4000),
      setTimeout(() => onComplete?.(), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <>
      {/* Background particles */}
      <ParticleEmitter
        type="stars"
        x={window.innerWidth / 2}
        y={150}
        count={30}
      />

      {/* Screen flash */}
      {phase === 'enter' && <ScreenFlash color="#FFD700" duration={200} />}

      {/* Achievement banner */}
      <div 
        className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-[1000]
          transition-all duration-500
          ${phase === 'enter' ? 'opacity-0 -translate-y-10 scale-90' : ''}
          ${phase === 'show' ? 'opacity-100 translate-y-0 scale-100' : ''}
          ${phase === 'exit' ? 'opacity-0 translate-y-10 scale-90' : ''}
        `}
      >
        <div className="relative">
          {/* Glow behind */}
          <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full transform scale-150" />

          {/* Main card */}
          <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-xl p-1">
            <div className="bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg p-4 flex items-center gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl animate-bounce">
                {achievement.icon}
              </div>

              {/* Text */}
              <div>
                <div className="text-amber-300 text-xs font-bold tracking-widest">
                  ACHIEVEMENT UNLOCKED
                </div>
                <div className="text-white text-xl font-bold mt-1">
                  {achievement.name}
                </div>
                <div className="text-amber-200/70 text-sm">
                  {achievement.description}
                </div>
              </div>

              {/* Points */}
              {achievement.points && (
                <div className="text-amber-400 font-bold text-xl">
                  +{achievement.points}
                </div>
              )}
            </div>
          </div>

          {/* Sparkle corners */}
          <div className="absolute -top-2 -left-2 text-xl animate-spin-slow">✨</div>
          <div className="absolute -top-2 -right-2 text-xl animate-spin-slow" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute -bottom-2 -left-2 text-xl animate-spin-slow" style={{ animationDelay: '0.25s' }}>✨</div>
          <div className="absolute -bottom-2 -right-2 text-xl animate-spin-slow" style={{ animationDelay: '0.75s' }}>✨</div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// FLOATING TEXT
// ============================================================================

export const FloatingText = ({
  text,
  x,
  y,
  color = '#FFD700',
  fontSize = 24,
  duration = 1500,
  onComplete,
}) => {
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < duration) {
        setOffset(-elapsed * 0.05);
        setOpacity(1 - elapsed / duration);
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();
  }, [duration, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-[1000] font-bold"
      style={{
        left: x,
        top: y + offset,
        color,
        fontSize,
        textShadow: `0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.5)`,
        opacity,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {text}
    </div>
  );
};

// ============================================================================
// COMBO INDICATOR
// ============================================================================

export const ComboIndicator = ({ combo, x, y }) => {
  if (combo < 2) return null;

  const getComboColor = () => {
    if (combo >= 10) return '#FF00FF'; // Purple for 10+
    if (combo >= 7) return '#FF4500';  // Red-orange for 7+
    if (combo >= 5) return '#FF6B00';  // Orange for 5+
    if (combo >= 3) return '#FFD700';  // Gold for 3+
    return '#FFF';
  };

  const getComboScale = () => {
    return 1 + Math.min(combo * 0.1, 0.5);
  };

  return (
    <div
      className="fixed pointer-events-none z-[500] animate-pulse"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${getComboScale()})`,
      }}
    >
      <div 
        className="font-pixel text-center"
        style={{ 
          color: getComboColor(),
          textShadow: `0 0 20px ${getComboColor()}, 0 0 40px ${getComboColor()}`,
        }}
      >
        <div className="text-sm opacity-80">COMBO</div>
        <div className="text-4xl font-bold">×{combo}</div>
        {combo >= 5 && (
          <div className="text-xs mt-1 animate-bounce">
            {combo >= 10 ? '🔥 ON FIRE! 🔥' : combo >= 7 ? '⚡ AMAZING! ⚡' : '✨ GREAT! ✨'}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// LEVEL UP CELEBRATION
// ============================================================================

export const LevelUpCelebration = ({ newLevel, onComplete }) => {
  const [phase, setPhase] = useState('burst');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('show'), 500),
      setTimeout(() => setPhase('exit'), 3500),
      setTimeout(() => onComplete?.(), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <>
      {/* Full screen flash */}
      {phase === 'burst' && (
        <>
          <ScreenFlash color="#FFD700" duration={300} />
          <ScreenShake intensity={10} duration={500}>
            <div />
          </ScreenShake>
        </>
      )}

      {/* Particles */}
      <ParticleEmitter
        type="sparkle"
        x={window.innerWidth / 2}
        y={window.innerHeight / 2}
        count={60}
      />
      <ParticleEmitter
        type="confetti"
        x={window.innerWidth / 2}
        y={window.innerHeight / 3}
        count={40}
      />

      {/* Level up text */}
      <div 
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]
          transition-all duration-500
          ${phase === 'burst' ? 'opacity-0 scale-200' : ''}
          ${phase === 'show' ? 'opacity-100 scale-100' : ''}
          ${phase === 'exit' ? 'opacity-0 scale-50 translate-y-20' : ''}
        `}
      >
        <div className="text-center">
          <div 
            className="text-6xl md:text-8xl font-pixel text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 animate-pulse"
            style={{ 
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5)',
              WebkitTextStroke: '2px #FFD700',
            }}
          >
            LEVEL UP!
          </div>
          <div className="text-4xl md:text-6xl font-bold text-white mt-4 animate-bounce">
            Level {newLevel}
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// WEATHER OVERLAY
// ============================================================================

export const WeatherOverlay = ({ type, intensity = 1 }) => {
  if (type === 'rain') {
    return (
      <>
        <ParticleEmitter
          type="bubbles"
          x={window.innerWidth / 2}
          y={0}
          count={0}
          duration={-1}
          rate={intensity * 10}
          spread={180}
        />
        <div 
          className="fixed inset-0 pointer-events-none z-[50]"
          style={{
            background: 'linear-gradient(180deg, rgba(50, 80, 120, 0.3) 0%, transparent 100%)',
          }}
        />
      </>
    );
  }

  if (type === 'snow') {
    return (
      <ParticleEmitter
        type="snow"
        x={window.innerWidth / 2}
        y={-20}
        count={0}
        duration={-1}
        rate={intensity * 5}
        spread={180}
      />
    );
  }

  if (type === 'leaves') {
    return (
      <ParticleEmitter
        type="leaves"
        x={window.innerWidth / 2}
        y={-20}
        count={0}
        duration={-1}
        rate={intensity * 2}
        spread={180}
      />
    );
  }

  if (type === 'petals') {
    return (
      <ParticleEmitter
        type="petals"
        x={window.innerWidth / 2}
        y={-20}
        count={0}
        duration={-1}
        rate={intensity * 3}
        spread={180}
      />
    );
  }

  return null;
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  ParticleEmitter,
  ScreenShake,
  ScreenFlash,
  VignetteEffect,
  GlowEffect,
  RewardPopup,
  AchievementCelebration,
  FloatingText,
  ComboIndicator,
  LevelUpCelebration,
  WeatherOverlay,
};
