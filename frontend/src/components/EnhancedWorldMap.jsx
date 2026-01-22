/**
 * ============================================================================
 * ENHANCED WORLD MAP - Interactive Map with Legend & Region Travel
 * ============================================================================
 * Features:
 * - Full world map with all 5 regions
 * - Interactive map legend
 * - NPC locations by region
 * - Ship routes and travel paths
 * - Progressive region unlocking
 * - Zoom and pan controls
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Map, Compass, Anchor, Ship, Skull, Snowflake, 
  Gem, Fish, Star, AlertTriangle, Lock, Unlock,
  ZoomIn, ZoomOut, Home, Navigation, Users, Store,
  Swords, Heart, HelpCircle, X, ChevronRight, MapPin
} from 'lucide-react';
import { 
  WORLD_REGIONS, 
  MAP_LEGEND, 
  PORTS, 
  ISLANDS, 
  NPC_DISTRIBUTION,
  SHIPS 
} from '../lib/pirateWorldAssets';

// ============================================================================
// MAP LEGEND PANEL
// ============================================================================

const MapLegendPanel = ({ isOpen, onClose, activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'locations', name: 'Locations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'npcs', name: 'NPCs', icon: <Users className="w-4 h-4" /> },
    { id: 'resources', name: 'Resources', icon: <Fish className="w-4 h-4" /> },
    { id: 'travel', name: 'Travel', icon: <Ship className="w-4 h-4" /> },
    { id: 'dangers', name: 'Dangers', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'special', name: 'Special', icon: <Star className="w-4 h-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="absolute left-4 top-20 w-72 bg-black/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 overflow-hidden z-50 animate-slide-up"
      data-testid="map-legend-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-amber-900/20">
        <h3 className="font-pixel text-amber-400 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          MAP LEGEND
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-amber-500/10">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              activeCategory === cat.id 
                ? 'bg-amber-500/30 text-amber-300' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Legend items */}
      <div className="p-3 max-h-64 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          {MAP_LEGEND[activeCategory] && Object.entries(MAP_LEGEND[activeCategory]).map(([key, item]) => (
            <div 
              key={key}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold">{item.name}</div>
                <div className="text-white/50 text-[10px] truncate">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REGION INFO PANEL
// ============================================================================

const RegionInfoPanel = ({ region, onClose, onTravel, playerLevel = 1 }) => {
  if (!region) return null;

  const regionData = WORLD_REGIONS[region];
  if (!regionData) return null;

  const isUnlocked = regionData.unlocked || playerLevel >= (regionData.unlockRequirement?.level || 0);
  const npcData = NPC_DISTRIBUTION[region];

  return (
    <div 
      className="absolute right-4 top-20 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 overflow-hidden z-50 animate-slide-up"
      data-testid="region-info-panel"
    >
      {/* Header with region color */}
      <div 
        className="p-4 border-b border-white/10"
        style={{ background: `linear-gradient(135deg, ${regionData.color}30 0%, transparent 100%)` }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{regionData.icon}</span>
              <div>
                <h3 className="font-pixel text-white text-sm">{regionData.name}</h3>
                <p className="text-white/60 text-xs">{regionData.subtitle}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lock status */}
        {!isUnlocked && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-red-500/20 rounded-lg border border-red-500/30">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-xs">
              Requires Level {regionData.unlockRequirement?.level}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="p-4 border-b border-white/10">
        <p className="text-white/70 text-sm leading-relaxed">{regionData.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/10">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-amber-400 font-bold">
            Lv. {regionData.difficulty.min}-{regionData.difficulty.max}
          </div>
          <div className="text-white/50 text-xs">Difficulty</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-green-400 font-bold">{npcData?.total_npcs || '?'}</div>
          <div className="text-white/50 text-xs">NPCs</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-blue-400 font-bold">{regionData.locations?.length || '?'}</div>
          <div className="text-white/50 text-xs">Locations</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-purple-400 font-bold">
            {regionData.resources?.fish?.length || '?'}
          </div>
          <div className="text-white/50 text-xs">Fish Types</div>
        </div>
      </div>

      {/* Features */}
      <div className="p-4 border-b border-white/10">
        <h4 className="text-white/60 text-xs font-bold mb-2">FEATURES</h4>
        <div className="flex flex-wrap gap-1">
          {regionData.features?.slice(0, 5).map((feature, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-white/10 rounded text-white/70 text-xs"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Dangers */}
      {regionData.dangers?.length > 0 && (
        <div className="p-4 border-b border-white/10">
          <h4 className="text-red-400/80 text-xs font-bold mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            DANGERS
          </h4>
          <div className="flex flex-wrap gap-1">
            {regionData.dangers.map((danger, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 bg-red-500/20 rounded text-red-300 text-xs"
              >
                {danger.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Travel button */}
      <div className="p-4">
        <button
          onClick={() => onTravel(region)}
          disabled={!isUnlocked}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
            isUnlocked
              ? 'bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 border border-amber-500/50'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed border border-gray-500/30'
          }`}
        >
          {isUnlocked ? (
            <>
              <Navigation className="w-4 h-4" />
              Travel to {regionData.name}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Region Locked
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// REGION MAP NODE
// ============================================================================

const RegionNode = ({ 
  region, 
  position, 
  isSelected, 
  isUnlocked, 
  playerLevel,
  npcCount,
  onClick,
  onHover 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const regionData = WORLD_REGIONS[region];
  if (!regionData) return null;

  const unlocked = isUnlocked || playerLevel >= (regionData.unlockRequirement?.level || 0);

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ${
        isSelected ? 'z-30' : isHovered ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onClick(region)}
      onMouseEnter={() => { setIsHovered(true); onHover?.(region, true); }}
      onMouseLeave={() => { setIsHovered(false); onHover?.(region, false); }}
      data-testid={`region-node-${region}`}
    >
      {/* Glow effect */}
      {(isSelected || isHovered) && unlocked && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${regionData.color}60 0%, transparent 70%)`,
            transform: 'scale(2)',
          }}
        />
      )}

      {/* Main node */}
      <div 
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isSelected ? 'scale-125' : isHovered ? 'scale-110' : 'scale-100'
        } ${unlocked ? '' : 'grayscale opacity-60'}`}
        style={{
          background: `linear-gradient(135deg, ${regionData.color} 0%, ${regionData.color}80 100%)`,
          border: isSelected ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.3)',
          boxShadow: unlocked ? `0 0 20px ${regionData.color}60` : 'none',
        }}
      >
        <span className="text-2xl">{regionData.icon}</span>

        {/* Lock overlay */}
        {!unlocked && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white/80" />
          </div>
        )}

        {/* NPC count badge */}
        {unlocked && npcCount > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-black">
            {npcCount > 99 ? '99+' : npcCount}
          </div>
        )}

        {/* Difficulty badge */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: unlocked ? 'rgba(0,0,0,0.8)' : 'rgba(50,50,50,0.8)',
            color: unlocked ? '#FFD700' : '#888',
          }}
        >
          Lv.{regionData.difficulty.min}-{regionData.difficulty.max}
        </div>
      </div>

      {/* Region name */}
      <div 
        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-opacity duration-300 ${
          isHovered || isSelected ? 'opacity-100' : 'opacity-70'
        }`}
      >
        <div className="font-pixel text-white text-xs">{regionData.name}</div>
        {isHovered && (
          <div className="text-white/50 text-[10px]">{regionData.subtitle}</div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// TRAVEL ROUTES
// ============================================================================

const TravelRoutes = ({ regions, selectedRegion }) => {
  const routes = useMemo(() => {
    const connections = [];
    
    Object.entries(WORLD_REGIONS).forEach(([regionId, region]) => {
      region.connectedRegions?.forEach(connectedId => {
        // Avoid duplicate routes
        if (regionId < connectedId) {
          const fromPos = region.mapPosition;
          const toRegion = WORLD_REGIONS[connectedId];
          const toPos = toRegion?.mapPosition;
          
          if (fromPos && toPos) {
            connections.push({
              from: regionId,
              to: connectedId,
              fromPos,
              toPos,
              isHighlighted: selectedRegion === regionId || selectedRegion === connectedId,
            });
          }
        }
      });
    });
    
    return connections;
  }, [selectedRegion]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#FFD70080" />
        </marker>
      </defs>
      
      {routes.map((route, index) => (
        <g key={index}>
          {/* Route line */}
          <line
            x1={`${route.fromPos.x}%`}
            y1={`${route.fromPos.y}%`}
            x2={`${route.toPos.x}%`}
            y2={`${route.toPos.y}%`}
            stroke={route.isHighlighted ? '#FFD700' : '#FFFFFF30'}
            strokeWidth={route.isHighlighted ? 3 : 1}
            strokeDasharray={route.isHighlighted ? '0' : '5,5'}
            className="transition-all duration-300"
          />
          
          {/* Ship icon on highlighted routes */}
          {route.isHighlighted && (
            <text
              x={`${(route.fromPos.x + route.toPos.x) / 2}%`}
              y={`${(route.fromPos.y + route.toPos.y) / 2}%`}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg animate-pulse"
            >
              ⛵
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

// ============================================================================
// PORT MARKERS
// ============================================================================

const PortMarkers = ({ onPortClick, selectedRegion }) => {
  const visiblePorts = useMemo(() => {
    if (!selectedRegion) return [];
    return Object.values(PORTS).filter(port => port.region === selectedRegion);
  }, [selectedRegion]);

  if (visiblePorts.length === 0) return null;

  return (
    <>
      {visiblePorts.map(port => (
        <div
          key={port.id}
          className="absolute cursor-pointer z-20 group"
          style={{
            left: `${port.position.x}%`,
            top: `${port.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => onPortClick(port)}
          data-testid={`port-marker-${port.id}`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/80 border-2 border-white/50 flex items-center justify-center text-sm group-hover:scale-125 transition-transform">
            {port.icon}
          </div>
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
            {port.name}
          </div>
        </div>
      ))}
    </>
  );
};

// ============================================================================
// MAIN ENHANCED WORLD MAP COMPONENT
// ============================================================================

export const EnhancedWorldMap = ({ 
  onClose, 
  onTravel, 
  playerLevel = 1,
  currentRegion = 'barnacle_bay',
  discoveredRegions = ['barnacle_bay'],
}) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [legendCategory, setLegendCategory] = useState('locations');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Calculate NPC counts per region
  const npcCounts = useMemo(() => {
    const counts = {};
    Object.keys(WORLD_REGIONS).forEach(regionId => {
      counts[regionId] = NPC_DISTRIBUTION[regionId]?.total_npcs || 0;
    });
    return counts;
  }, []);

  // Handle region click
  const handleRegionClick = useCallback((regionId) => {
    setSelectedRegion(prev => prev === regionId ? null : regionId);
  }, []);

  // Handle travel
  const handleTravel = useCallback((regionId) => {
    onTravel?.(regionId);
    onClose?.();
  }, [onTravel, onClose]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-b from-blue-950 to-black"
      data-testid="enhanced-world-map"
    >
      {/* Background ocean texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0, 100, 200, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 150, 200, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0, 80, 150, 0.4) 0%, transparent 70%)
          `,
        }}
      />

      {/* Map header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="font-pixel text-amber-400 text-xl flex items-center gap-2">
              <Compass className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '10s' }} />
              WORLD MAP
            </h1>
            <div className="text-white/60 text-sm">
              Current: <span className="text-amber-300">{WORLD_REGIONS[currentRegion]?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Legend toggle */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`p-2 rounded-lg transition-colors ${
                showLegend ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              data-testid="toggle-legend-btn"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
              <button 
                onClick={handleZoomOut}
                className="p-1.5 rounded hover:bg-white/10 text-white/70"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white/60 text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={handleZoomIn}
                className="p-1.5 rounded hover:bg-white/10 text-white/70"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleReset}
                className="p-1.5 rounded hover:bg-white/10 text-white/70"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map content */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ paddingTop: '60px', paddingBottom: '80px' }}
      >
        <div 
          className="relative w-full h-full transition-transform duration-300"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* Travel routes */}
          <TravelRoutes 
            regions={WORLD_REGIONS} 
            selectedRegion={selectedRegion || hoveredRegion}
          />

          {/* Region nodes */}
          {Object.entries(WORLD_REGIONS).map(([regionId, region]) => (
            <RegionNode
              key={regionId}
              region={regionId}
              position={region.mapPosition}
              isSelected={selectedRegion === regionId}
              isUnlocked={discoveredRegions.includes(regionId)}
              playerLevel={playerLevel}
              npcCount={npcCounts[regionId]}
              onClick={handleRegionClick}
              onHover={(id, isHovered) => setHoveredRegion(isHovered ? id : null)}
            />
          ))}

          {/* Port markers (when region selected) */}
          <PortMarkers 
            selectedRegion={selectedRegion}
            onPortClick={(port) => console.log('Port clicked:', port)}
          />

          {/* Current location indicator */}
          <div
            className="absolute z-40 pointer-events-none"
            style={{
              left: `${WORLD_REGIONS[currentRegion]?.mapPosition?.x}%`,
              top: `${WORLD_REGIONS[currentRegion]?.mapPosition?.y}%`,
              transform: 'translate(-50%, -150%)',
            }}
          >
            <div className="flex flex-col items-center animate-bounce">
              <div className="text-2xl">📍</div>
              <div className="text-amber-400 text-xs font-bold">YOU</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend panel */}
      <MapLegendPanel
        isOpen={showLegend}
        onClose={() => setShowLegend(false)}
        activeCategory={legendCategory}
        setActiveCategory={setLegendCategory}
      />

      {/* Region info panel */}
      <RegionInfoPanel
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
        onTravel={handleTravel}
        playerLevel={playerLevel}
      />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Region stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-400" />
              <span className="text-white/60 text-sm">
                <span className="text-white font-bold">{Object.keys(WORLD_REGIONS).length}</span> Regions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-white/60 text-sm">
                <span className="text-white font-bold">
                  {Object.values(npcCounts).reduce((a, b) => a + b, 0)}
                </span> NPCs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-amber-400" />
              <span className="text-white/60 text-sm">
                <span className="text-white font-bold">{Object.keys(PORTS).length}</span> Ports
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-purple-400" />
              <span className="text-white/60 text-sm">
                <span className="text-white font-bold">{Object.keys(SHIPS).length}</span> Ships
              </span>
            </div>
          </div>

          {/* Quick travel hint */}
          <div className="text-white/40 text-xs">
            Click a region to see details • Double-click to travel
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWorldMap;
