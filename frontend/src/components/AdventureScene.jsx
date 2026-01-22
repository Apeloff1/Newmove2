import React, { useState, useEffect } from 'react';
import { useAdventure } from '../context/AdventureContext';
import { Hand, MessageCircle, MapPin, Fish, Gamepad2, Sparkles } from 'lucide-react';

// ============================================================================
// ADVENTURE SCENE - The Main Play Area
// ============================================================================

export const AdventureScene = () => {
  const { 
    getCurrentLocation, 
    interactWithHotspot,
    discoveredLocations
  } = useAdventure();
  
  const location = getCurrentLocation();
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Spawn ambient particles
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newParticle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          type: ['✨', '💫', '🌊', '🐚'][Math.floor(Math.random() * 4)]
        };
        setParticles(prev => [...prev.slice(-10), newParticle]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle hotspot interaction
  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === 'travel') {
      setIsTransitioning(true);
      setTimeout(() => {
        interactWithHotspot(hotspot);
        setIsTransitioning(false);
      }, 500);
    } else {
      interactWithHotspot(hotspot);
    }
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
    <div 
      className={`adventure-scene relative w-full h-full overflow-hidden transition-opacity duration-500 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: location.background }}
      data-testid={`scene-${location.id}`}
    >
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
        
        {/* Ambient particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute animate-float-up text-2xl opacity-40"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          >
            {particle.type}
          </div>
        ))}
      </div>

      {/* Scene Description Banner */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 max-w-xl">
        <div className="adventure-description-banner">
          <h2 className="font-pixel text-xl text-gold mb-2">{location.name}</h2>
          <p className="text-sm text-amber-100/80 leading-relaxed">
            {location.description}
          </p>
        </div>
      </div>

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
            onClick={() => handleHotspotClick(hotspot)}
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

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette" />
    </div>
  );
};

export default AdventureScene;
