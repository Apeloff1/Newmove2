import React, { useState, useEffect, useMemo } from 'react';
import { useAdventure } from '../context/AdventureContext';
import { Hand, MessageCircle, MapPin, Fish, Gamepad2, Sparkles, Compass, Eye, Volume2 } from 'lucide-react';
import { NPCWorldProvider, NPCWorldRenderer } from './EnhancedNPCWorld';
import { WeatherOverlay, VignetteEffect, ParticleEmitter } from './UIEffects';

// ============================================================================
// ADVENTURE SCENE - The Main Play Area with Enhanced NPC System
// ============================================================================

// Pre-generated particle positions
const AMBIENT_PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: ((i * 17 + 7) % 90) + 5,
  y: ((i * 23 + 11) % 80) + 10,
  delay: (i * 0.4) % 3,
  icon: ['✨', '💫', '🌊', '🐚', '⚓', '🦀'][i % 6],
  scale: 0.8 + (i % 3) * 0.2,
}));

// Weather types by location
const LOCATION_WEATHER = {
  docks: { type: null, intensity: 0 },
  mermaid_lagoon: { type: 'bubbles', intensity: 0.5 },
  shipwreck_beach: { type: 'leaves', intensity: 0.3 },
  treasure_cave: { type: null, intensity: 0 },
  pirates_tavern: { type: null, intensity: 0 },
  frozen_harbor: { type: 'snow', intensity: 0.8 },
};

export const AdventureScene = () => {
  const { 
    getCurrentLocation, 
    interactWithHotspot,
    discoveredLocations,
    currentTime,
  } = useAdventure();
  
  const location = getCurrentLocation();
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 });
  const [dayNightPhase, setDayNightPhase] = useState('day');
  const [activeEffects, setActiveEffects] = useState([]);

  // Get weather for current location
  const weather = useMemo(() => 
    LOCATION_WEATHER[location?.id] || { type: null, intensity: 0 },
    [location?.id]
  );

  // Day/Night cycle based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setDayNightPhase('day');
    } else if (hour >= 18 && hour < 20) {
      setDayNightPhase('evening');
    } else {
      setDayNightPhase('night');
    }
  }, [currentTime]);

  // Handle hotspot interaction
  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === 'travel') {
      setIsTransitioning(true);
      // Add transition effect
      setActiveEffects(prev => [...prev, { type: 'transition', id: Date.now() }]);
      setTimeout(() => {
        interactWithHotspot(hotspot);
        setIsTransitioning(false);
        setActiveEffects(prev => prev.filter(e => e.type !== 'transition'));
      }, 500);
    } else {
      interactWithHotspot(hotspot);
    }
  };

  // Handle player movement (click to move)
  const handleSceneClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlayerPosition({ x, y });
  };

  // Get icon for hotspot type
  const getHotspotIcon = (hotspot) => {
    switch (hotspot.type) {
      case 'npc': return <MessageCircle className="w-5 h-5" />;
      case 'travel': return <MapPin className="w-5 h-5" />;
      case 'fishing': return <Fish className="w-5 h-5" />;
      case 'minigame': return <Gamepad2 className="w-5 h-5" />;
      case 'interact': return <Hand className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <NPCWorldProvider region={location?.id || 'port_fortune'}>
      <div 
        className={`adventure-scene relative w-full h-full overflow-hidden transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ background: location.background }}
        onClick={handleSceneClick}
        data-testid={`scene-${location.id}`}
      >
        {/* Day/Night Overlay */}
        {dayNightPhase === 'night' && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 to-purple-950/30 pointer-events-none z-[5]" />
        )}
        {dayNightPhase === 'evening' && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-purple-900/20 pointer-events-none z-[5]" />
        )}

        {/* Weather Effects */}
        {weather.type && (
          <WeatherOverlay type={weather.type} intensity={weather.intensity} />
        )}

        {/* Ambient Background Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Water effect for maritime locations */}
          {['docks', 'mermaid_lagoon', 'shipwreck_beach'].includes(location.id) && (
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-900/50 to-transparent">
              <svg className="w-full h-full opacity-30" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path 
                  d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" 
                  fill="#1a4a6a"
                  className="animate-wave-slow"
                />
              </svg>
            </div>
          )}
          
          {/* Ambient particles - pre-generated for performance */}
          {AMBIENT_PARTICLES.map(particle => (
            <div
              key={particle.id}
              className="absolute animate-float text-2xl opacity-40"
              style={{ 
                left: `${particle.x}%`, 
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                transform: `scale(${particle.scale})`,
              }}
            >
              {particle.icon}
            </div>
          ))}
        </div>

        {/* Scene Description Banner */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 max-w-xl">
          <div className="adventure-description-banner animate-slide-up">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-gold animate-spin-slow" style={{ animationDuration: '10s' }} />
              <h2 className="font-pixel text-xl text-gold">{location.name}</h2>
            </div>
            <p className="text-sm text-amber-100/80 leading-relaxed">
              {location.description}
            </p>
            {/* Time indicator */}
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-amber-200/60">
              <span>{dayNightPhase === 'day' ? '☀️' : dayNightPhase === 'evening' ? '🌅' : '🌙'}</span>
              <span className="capitalize">{dayNightPhase}</span>
            </div>
          </div>
        </div>

        {/* Enhanced NPC World Layer */}
        <NPCWorldRenderer playerPosition={playerPosition} />

        {/* Interactive Hotspots */}
        <div className="absolute inset-0 z-10">
          {location.hotspots?.map((hotspot) => (
            <button
              key={hotspot.id}
              className={`adventure-hotspot ${
                hoveredHotspot === hotspot.id ? 'adventure-hotspot-active' : ''
              } ${hotspot.type === 'npc' ? 'adventure-hotspot-npc' : ''} ${
                hotspot.type === 'travel' ? 'adventure-hotspot-travel' : ''
              }`}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleHotspotClick(hotspot);
              }}
              onMouseEnter={() => setHoveredHotspot(hotspot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
              data-testid={`hotspot-${hotspot.id}`}
            >
              {/* Hotspot Icon */}
              <div className="adventure-hotspot-icon">
                <span className="text-2xl">{hotspot.icon}</span>
              </div>

              {/* Hotspot Label */}
              <div className={`adventure-hotspot-label ${
                hoveredHotspot === hotspot.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <div className="flex items-center gap-2">
                  {getHotspotIcon(hotspot)}
                  <span>{hotspot.name}</span>
                </div>
                {hotspot.requiresItem && (
                  <div className="text-xs text-red-400 mt-1">🔒 Requires item</div>
                )}
              </div>

              {/* Pulse effect for NPCs */}
              {hotspot.type === 'npc' && (
                <div className="adventure-hotspot-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Player Indicator */}
        <div 
          className="absolute w-8 h-8 pointer-events-none z-30 transition-all duration-300"
          style={{
            left: playerPosition.x,
            top: playerPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-full h-full bg-amber-400/30 rounded-full animate-ping" />
          <div className="absolute inset-0 w-full h-full bg-amber-400/60 rounded-full" />
        </div>

        {/* First Visit Message */}
        {location.firstVisitDialogue && !discoveredLocations.includes(location.id + '_visited') && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 animate-slide-up">
            <div className="adventure-first-visit-banner">
              <p className="text-amber-100 italic">"{location.firstVisitDialogue}"</p>
            </div>
          </div>
        )}

        {/* Ambient decorations based on location */}
        {location.ambiance === 'busy' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 text-4xl animate-float" style={{ animationDelay: '0s' }}>🕊️</div>
            <div className="absolute top-40 left-20 text-3xl animate-float" style={{ animationDelay: '1s' }}>🕊️</div>
          </div>
        )}

        {location.ambiance === 'maritime' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-30 right-20 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>⛵</div>
            <div className="absolute bottom-40 left-10 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🦀</div>
          </div>
        )}

        {location.ambiance === 'mystical' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float text-2xl opacity-50"
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* Mini-Map Toggle */}
        {showMiniMap && (
          <div className="mini-map shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-950/90" />
            <div className="absolute inset-2 border border-amber-500/30 rounded-lg" />
            {/* Player on mini-map */}
            <div 
              className="mini-map-player"
              style={{
                left: `${(playerPosition.x / 800) * 100}%`,
                top: `${(playerPosition.y / 600) * 100}%`,
              }}
            />
            {/* NPCs on mini-map */}
            {location.hotspots?.filter(h => h.type === 'npc').map((hotspot, i) => (
              <div
                key={hotspot.id}
                className="mini-map-npc"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                }}
              />
            ))}
            {/* Quest markers */}
            {location.hotspots?.filter(h => h.hasQuest).map((hotspot, i) => (
              <div
                key={`quest-${hotspot.id}`}
                className="mini-map-quest"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                }}
              />
            ))}
            {/* Location label */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-amber-200/70 whitespace-nowrap">
              {location.name}
            </div>
          </div>
        )}

        {/* Mini-map toggle button */}
        <button
          onClick={() => setShowMiniMap(!showMiniMap)}
          className="fixed bottom-[180px] right-6 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border border-amber-500/30 hover:border-amber-500/60 transition-colors z-50"
          data-testid="toggle-minimap"
        >
          <Eye className={`w-5 h-5 ${showMiniMap ? 'text-amber-400' : 'text-white/50'}`} />
        </button>

        {/* Vignette effect */}
        <VignetteEffect intensity={0.4} />
      </div>
    </NPCWorldProvider>
  );
};

export default AdventureScene;
