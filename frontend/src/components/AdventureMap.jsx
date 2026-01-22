import React, { useState } from 'react';
import { useAdventure } from '../context/AdventureContext';
import { X, MapPin, Lock, Check, Navigation } from 'lucide-react';

// ============================================================================
// ADVENTURE MAP - World Navigation
// ============================================================================

export const AdventureMap = ({ onClose }) => {
  const { 
    discoveredLocations, 
    currentLocation, 
    travelTo,
    locations 
  } = useAdventure();

  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Map layout positions (percentage based)
  const mapPositions = {
    harbor_square: { x: 35, y: 55, connections: ['docks', 'salty_barnacle_tavern', 'shady_alley', 'merchant_quarter', 'shipwreck_beach'] },
    docks: { x: 55, y: 50, connections: ['harbor_square', 'lighthouse'] },
    salty_barnacle_tavern: { x: 30, y: 40, connections: ['harbor_square'] },
    shady_alley: { x: 20, y: 55, connections: ['harbor_square'] },
    lighthouse: { x: 70, y: 35, connections: ['docks', 'windswept_cliffs'] },
    windswept_cliffs: { x: 80, y: 25, connections: ['lighthouse', 'smugglers_cave'] },
    smugglers_cave: { x: 85, y: 40, connections: ['windswept_cliffs', 'treasure_chamber'] },
    treasure_chamber: { x: 90, y: 55, connections: ['smugglers_cave'] },
    merchant_quarter: { x: 25, y: 35, connections: ['harbor_square', 'governors_manor'] },
    governors_manor: { x: 15, y: 25, connections: ['merchant_quarter'] },
    shipwreck_beach: { x: 45, y: 75, connections: ['harbor_square', 'mermaid_lagoon'] },
    mermaid_lagoon: { x: 60, y: 85, connections: ['shipwreck_beach'] }
  };

  const handleLocationClick = (locationId) => {
    if (!discoveredLocations.includes(locationId)) return;
    
    if (locationId === currentLocation) {
      setSelectedLocation(locations[locationId]);
    } else {
      setSelectedLocation(locations[locationId]);
    }
  };

  const handleTravel = () => {
    if (selectedLocation && selectedLocation.id !== currentLocation) {
      travelTo(selectedLocation.id);
      onClose();
    }
  };

  return (
    <div 
      className="adventure-modal-backdrop"
      onClick={onClose}
      data-testid="adventure-map"
    >
      <div 
        className="adventure-map-panel animate-scale-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="adventure-map-header">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗺️</span>
            <h2 className="font-pixel text-2xl text-gold">Saltbeard's Cove</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            data-testid="close-map-btn"
          >
            <X className="w-6 h-6 text-amber-200" />
          </button>
        </div>

        {/* Map Area */}
        <div className="adventure-map-area">
          {/* Background ocean */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 rounded-xl overflow-hidden">
            {/* Wave pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="waves" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0 5 Q 2.5 0, 5 5 Q 7.5 10, 10 5" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#waves)"/>
            </svg>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            {Object.entries(mapPositions).map(([locId, pos]) => (
              pos.connections?.map(connId => {
                const connPos = mapPositions[connId];
                if (!connPos) return null;
                const discovered = discoveredLocations.includes(locId) && discoveredLocations.includes(connId);
                return (
                  <line
                    key={`${locId}-${connId}`}
                    x1={`${pos.x}%`}
                    y1={`${pos.y}%`}
                    x2={`${connPos.x}%`}
                    y2={`${connPos.y}%`}
                    stroke={discovered ? '#ffd700' : '#4a5568'}
                    strokeWidth="2"
                    strokeDasharray={discovered ? 'none' : '5,5'}
                    opacity={discovered ? 0.6 : 0.3}
                  />
                );
              })
            ))}
          </svg>

          {/* Location markers */}
          {Object.entries(mapPositions).map(([locId, pos]) => {
            const location = locations[locId];
            const isDiscovered = discoveredLocations.includes(locId);
            const isCurrent = currentLocation === locId;
            const isHovered = hoveredLocation === locId;
            const isSelected = selectedLocation?.id === locId;

            return (
              <button
                key={locId}
                className={`adventure-map-marker ${isDiscovered ? 'discovered' : 'undiscovered'} ${
                  isCurrent ? 'current' : ''
                } ${isSelected ? 'selected' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                onClick={() => handleLocationClick(locId)}
                onMouseEnter={() => setHoveredLocation(locId)}
                onMouseLeave={() => setHoveredLocation(null)}
                disabled={!isDiscovered}
                data-testid={`map-location-${locId}`}
              >
                {/* Marker icon */}
                <div className={`marker-icon ${isCurrent ? 'animate-bounce' : ''}`}>
                  {!isDiscovered ? (
                    <Lock className="w-4 h-4 text-gray-500" />
                  ) : isCurrent ? (
                    <Navigation className="w-5 h-5 text-gold" />
                  ) : (
                    <MapPin className="w-5 h-5 text-amber-300" />
                  )}
                </div>

                {/* Current location indicator */}
                {isCurrent && (
                  <div className="current-pulse" />
                )}

                {/* Hover/Selected tooltip */}
                {(isHovered || isSelected) && isDiscovered && location && (
                  <div className="marker-tooltip">
                    <h4 className="font-pixel text-sm text-gold">{location.name}</h4>
                    {isCurrent && (
                      <span className="text-xs text-green-400">📍 You are here</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Decorative elements */}
          <div className="absolute top-5 left-5 text-4xl opacity-30 rotate-12">🏴‍☠️</div>
          <div className="absolute bottom-5 right-5 text-3xl opacity-30 -rotate-12">⚓</div>
          <div className="absolute top-1/2 right-10 text-2xl opacity-20">🐙</div>
        </div>

        {/* Selected location panel */}
        {selectedLocation && (
          <div className="adventure-map-details animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="text-4xl">
                {selectedLocation.hotspots?.[0]?.icon || '📍'}
              </div>
              <div className="flex-1">
                <h3 className="font-pixel text-lg text-gold">{selectedLocation.name}</h3>
                <p className="text-sm text-amber-100/70 mt-1">
                  {selectedLocation.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-amber-200/50">
                  <span>🏴‍☠️ {selectedLocation.hotspots?.filter(h => h.type === 'npc').length || 0} NPCs</span>
                  <span>🎯 {selectedLocation.hotspots?.filter(h => h.type === 'interact').length || 0} Points of Interest</span>
                </div>
              </div>
            </div>

            {/* Travel button */}
            {selectedLocation.id !== currentLocation ? (
              <button
                onClick={handleTravel}
                className="adventure-btn-primary w-full mt-4"
                data-testid="travel-btn"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Travel to {selectedLocation.name}
              </button>
            ) : (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span>You are here!</span>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="adventure-map-legend">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gold" />
            <span className="text-xs text-amber-200/60">Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300" />
            <span className="text-xs text-amber-200/60">Discovered</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-amber-200/60">Undiscovered</span>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center text-xs text-amber-200/40 mt-2">
          {discoveredLocations.length} / {Object.keys(mapPositions).length} locations discovered
        </div>
      </div>
    </div>
  );
};

export default AdventureMap;
