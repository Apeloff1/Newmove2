/**
 * ============================================================================
 * ENHANCED NPC WORLD SYSTEM - Living Breathing World
 * ============================================================================
 * Complete world-level NPC management with:
 * - All NPCs using advanced AI
 * - Real-time pathfinding
 * - Dynamic interactions
 * - Event system for world events
 * - Save/load system
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { NPCAIController, NPCWorldManager, NPC_STATES, NPC_MOODS } from '../lib/npcAI';
import { EnhancedNPCSprite, NPCGroup } from './EnhancedNPCSprites';
import { 
  ParticleEmitter, 
  FloatingText, 
  GlowEffect,
  RewardPopup,
} from './UIEffects';
import { ALL_NPCS, NPC_PERSONALITIES } from '../lib/npcDatabase';

// ============================================================================
// NPC WORLD CONTEXT
// ============================================================================

const NPCWorldContext = createContext(null);

export const useNPCWorld = () => {
  const context = useContext(NPCWorldContext);
  if (!context) {
    throw new Error('useNPCWorld must be used within NPCWorldProvider');
  }
  return context;
};

// ============================================================================
// ENHANCED DIALOGUE SYSTEM
// ============================================================================

const EnhancedDialogueBox = ({ 
  npc, 
  dialogue, 
  mood,
  onResponse, 
  onClose,
  relationshipLevel = 0,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentNode, setCurrentNode] = useState('start');
  const typewriterRef = useRef(null);

  // Get current dialogue node
  const node = dialogue?.nodes?.[currentNode];
  const text = node?.text || '';

  // Typewriter effect
  useEffect(() => {
    if (!text) return;
    
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;

    const type = () => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
        typewriterRef.current = setTimeout(type, 25);
      } else {
        setIsTyping(false);
      }
    };

    type();

    return () => clearTimeout(typewriterRef.current);
  }, [text, currentNode]);

  // Skip typing
  const skipTyping = () => {
    if (isTyping) {
      clearTimeout(typewriterRef.current);
      setDisplayedText(text);
      setIsTyping(false);
    }
  };

  // Handle response
  const handleResponse = (response, index) => {
    onResponse?.(response, index);
    
    if (response.next === 'end' || !response.next) {
      onClose();
    } else {
      setCurrentNode(response.next);
    }
  };

  if (!node) return null;

  // Get mood-based styling
  const moodConfig = NPC_MOODS[mood?.toUpperCase()] || NPC_MOODS.NEUTRAL;
  const moodBorderColor = {
    joyful: 'border-yellow-400',
    happy: 'border-green-400',
    angry: 'border-red-400',
    sad: 'border-blue-400',
    scared: 'border-purple-400',
    excited: 'border-amber-400',
  }[mood] || 'border-white/20';

  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
      data-testid="enhanced-dialogue-box"
    >
      <div className={`bg-gradient-to-b from-black/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border-2 ${moodBorderColor} overflow-hidden shadow-2xl`}>
        {/* NPC Header */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-900/30 to-transparent border-b border-white/10">
          {/* Portrait with mood glow */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-3xl border-2 border-amber-400/50">
              {npc.portrait || '👤'}
            </div>
            {/* Mood indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center text-sm border border-white/20">
              {moodConfig.icon}
            </div>
          </div>

          {/* Name and title */}
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              {npc.name}
              {/* Relationship hearts */}
              <span className="text-xs text-amber-400/60">
                {'❤️'.repeat(Math.max(1, Math.ceil((relationshipLevel + 100) / 40)))}
              </span>
            </h3>
            <p className="text-xs text-white/60">{npc.title}</p>
          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            ✕
          </button>
        </div>

        {/* Dialogue text */}
        <div 
          className="p-6 min-h-[100px] cursor-pointer"
          onClick={skipTyping}
        >
          <p className="text-white text-lg leading-relaxed font-serif italic">
            &ldquo;{displayedText}&rdquo;
            {isTyping && <span className="animate-pulse ml-1">▌</span>}
          </p>
        </div>

        {/* Response options */}
        {!isTyping && node.responses && node.responses.length > 0 && (
          <div className="p-4 border-t border-white/10 space-y-2">
            {node.responses.map((response, index) => {
              const isLocked = response.requires && !response.satisfied;
              
              return (
                <button
                  key={index}
                  onClick={() => !isLocked && handleResponse(response, index)}
                  disabled={isLocked}
                  className={`
                    w-full p-3 text-left rounded-xl transition-all
                    ${isLocked 
                      ? 'opacity-50 cursor-not-allowed bg-gray-800/50' 
                      : 'hover:bg-amber-500/20 hover:border-amber-400/50 bg-white/5'
                    }
                    border border-white/10
                  `}
                >
                  <span className="text-amber-400 mr-2 font-bold">{index + 1}.</span>
                  <span className="text-white">{response.text}</span>
                  {isLocked && (
                    <span className="text-xs text-red-400/80 ml-2">
                      🔒 {response.requiresText || 'Locked'}
                    </span>
                  )}
                  {response.effect && (
                    <span className={`text-xs ml-2 ${
                      response.effect > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {response.effect > 0 ? `♥+${response.effect}` : `♥${response.effect}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* End conversation */}
        {!isTyping && (!node.responses || node.responses.length === 0) && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full p-3 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-300 font-bold transition-colors"
            >
              End Conversation
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-2 px-4 pb-4">
          <button className="flex-1 p-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-pink-300 text-sm transition-colors">
            🎁 Give Gift
          </button>
          <button className="flex-1 p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 text-sm transition-colors">
            📖 Ask About
          </button>
          <button className="flex-1 p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 text-sm transition-colors">
            📜 Quest
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// NPC INFO PANEL (Enhanced)
// ============================================================================

const EnhancedNPCInfoPanel = ({ npc, controller, onTalk, onGift, onClose }) => {
  if (!npc || !controller) return null;

  const relationshipTier = controller.memory.getRelationshipTier();
  const relationshipLevel = controller.memory.relationshipLevel;
  const mood = controller.mood;

  const tierColors = {
    best_friend: 'from-pink-500/30 to-pink-600/30 border-pink-400',
    close_friend: 'from-purple-500/30 to-purple-600/30 border-purple-400',
    friend: 'from-blue-500/30 to-blue-600/30 border-blue-400',
    acquaintance: 'from-green-500/30 to-green-600/30 border-green-400',
    neutral: 'from-gray-500/30 to-gray-600/30 border-gray-400',
    disliked: 'from-orange-500/30 to-orange-600/30 border-orange-400',
    enemy: 'from-red-500/30 to-red-600/30 border-red-400',
  };

  return (
    <div 
      className="fixed right-4 top-1/2 -translate-y-1/2 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden z-40 animate-slide-up"
      data-testid="npc-info-panel"
    >
      {/* Header with portrait */}
      <div className={`p-4 bg-gradient-to-r ${tierColors[relationshipTier]} border-b border-white/10`}>
        <div className="flex items-start gap-3">
          <div className="w-20 h-20 rounded-xl bg-black/40 flex items-center justify-center text-4xl border border-white/20">
            {npc.portrait || '👤'}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-lg">{npc.name}</h2>
            <p className="text-sm text-white/60">{npc.title}</p>
            
            {/* Relationship badge */}
            <div className="flex items-center gap-1 mt-2">
              <span className="text-lg">{mood?.icon || '😐'}</span>
              <span className="text-xs text-white/60 capitalize">{mood?.name || 'neutral'}</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-4">
        {/* Relationship meter */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">Relationship</span>
            <span className="text-amber-400 capitalize">{relationshipTier.replace('_', ' ')}</span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-amber-500 transition-all duration-500"
              style={{ width: `${(relationshipLevel + 100) / 2}%` }}
            />
          </div>
        </div>

        {/* Personality traits */}
        {npc.personality && (
          <div>
            <div className="text-xs text-white/60 mb-2">Personality</div>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(npc.personality) ? npc.personality : [npc.personality]).map((trait, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-white/70"
                >
                  {typeof trait === 'string' ? trait.replace('_', ' ') : trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gift preferences hint */}
        <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
          <div className="text-xs text-pink-300 font-bold mb-1">💝 Gift Hint</div>
          <p className="text-xs text-pink-200/70">
            {relationshipTier === 'best_friend' || relationshipTier === 'close_friend'
              ? `${npc.name} loves rare fish and treasures!`
              : `Try giving gifts to learn ${npc.name}'s preferences.`
            }
          </p>
        </div>

        {/* Current state */}
        <div className="text-xs text-white/40">
          Currently: {controller.state.replace('_', ' ')}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 grid grid-cols-2 gap-2 border-t border-white/10">
        <button
          onClick={() => onTalk(npc)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-300 transition-colors"
        >
          💬 Talk
        </button>
        <button
          onClick={() => onGift(npc)}
          className="flex items-center justify-center gap-2 p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl text-pink-300 transition-colors"
        >
          🎁 Gift
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// NPC WORLD PROVIDER
// ============================================================================

export const NPCWorldProvider = ({ children, region = 'port_fortune' }) => {
  const [worldManager] = useState(() => new NPCWorldManager());
  const [npcUpdates, setNpcUpdates] = useState([]);
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [dialogueNPC, setDialogueNPC] = useState(null);
  const [hoveredNPC, setHoveredNPC] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [activeReward, setActiveReward] = useState(null);
  const [worldTime, setWorldTime] = useState(() => Date.now());
  
  const updateIntervalRef = useRef(null);

  // Initialize NPCs for region
  useEffect(() => {
    // Get NPCs for this region
    const regionNPCs = Object.values(ALL_NPCS).filter(npc => {
      // You can add region filtering logic here
      return true; // For now, add all NPCs
    }).slice(0, 30); // Limit to 30 for performance

    // Add NPCs to world manager
    regionNPCs.forEach((npc, index) => {
      // Stagger positions
      const row = Math.floor(index / 5);
      const col = index % 5;
      const position = {
        x: 150 + col * 150 + Math.random() * 50,
        y: 200 + row * 100 + Math.random() * 30,
      };

      worldManager.addNPC(npc.id, npc, position);
    });

    // Start update loop
    updateIntervalRef.current = setInterval(() => {
      const updates = worldManager.update({ currentTime: Date.now() });
      setNpcUpdates(updates);
      setWorldTime(Date.now());
    }, 100);

    return () => {
      clearInterval(updateIntervalRef.current);
    };
  }, [region, worldManager]);

  // Handle NPC click
  const handleNPCClick = useCallback((npc) => {
    const controller = worldManager.getNPC(npc.id);
    if (controller) {
      setSelectedNPC({ npc, controller });
    }
  }, [worldManager]);

  // Handle NPC hover
  const handleNPCHover = useCallback((npc, isHovered) => {
    setHoveredNPC(isHovered ? npc : null);
  }, []);

  // Start dialogue
  const startDialogue = useCallback((npc, dialogueTree) => {
    const controller = worldManager.getNPC(npc.id);
    if (controller) {
      controller.setState(NPC_STATES.TALKING);
      setDialogueNPC({ npc, controller, dialogue: dialogueTree });
      setSelectedNPC(null);
    }
  }, [worldManager]);

  // End dialogue
  const endDialogue = useCallback(() => {
    if (dialogueNPC) {
      dialogueNPC.controller.setState(NPC_STATES.IDLE);
      setDialogueNPC(null);
    }
  }, [dialogueNPC]);

  // Give gift
  const giveGift = useCallback((npc, item) => {
    const controller = worldManager.getNPC(npc.id);
    if (!controller) return;

    // Process gift
    const result = controller.giveGift?.(item) || { reaction: 'neutral', pointChange: 5 };
    
    // Show floating text
    const floatText = {
      id: Date.now(),
      text: result.pointChange > 0 ? `+${result.pointChange} ❤️` : `${result.pointChange} ❤️`,
      x: controller.position.x,
      y: controller.position.y - 50,
      color: result.pointChange > 0 ? '#FF69B4' : '#FF6B6B',
    };
    setFloatingTexts(prev => [...prev, floatText]);

    // Update relationship
    controller.memory.recordInteraction(`gift_${result.reaction}`, { item });

    return result;
  }, [worldManager]);

  // Context value
  const contextValue = {
    worldManager,
    npcUpdates,
    selectedNPC,
    dialogueNPC,
    hoveredNPC,
    worldTime,
    handleNPCClick,
    handleNPCHover,
    startDialogue,
    endDialogue,
    giveGift,
    setSelectedNPC,
    setActiveReward,
  };

  return (
    <NPCWorldContext.Provider value={contextValue}>
      {children}

      {/* Floating texts */}
      {floatingTexts.map(ft => (
        <FloatingText
          key={ft.id}
          text={ft.text}
          x={ft.x}
          y={ft.y}
          color={ft.color}
          onComplete={() => {
            setFloatingTexts(prev => prev.filter(f => f.id !== ft.id));
          }}
        />
      ))}

      {/* Reward popup */}
      {activeReward && (
        <RewardPopup
          rewards={activeReward.rewards}
          title={activeReward.title}
          onComplete={() => setActiveReward(null)}
        />
      )}
    </NPCWorldContext.Provider>
  );
};

// ============================================================================
// NPC WORLD RENDERER
// ============================================================================

export const NPCWorldRenderer = ({ playerPosition }) => {
  const { 
    npcUpdates, 
    selectedNPC, 
    dialogueNPC,
    hoveredNPC,
    handleNPCClick, 
    handleNPCHover,
    startDialogue,
    endDialogue,
    giveGift,
    setSelectedNPC,
    worldManager,
  } = useNPCWorld();

  // Get sample dialogue for testing
  const getSampleDialogue = (npc) => ({
    nodes: {
      start: {
        text: `Ahoy there, traveler! I'm ${npc.name}. What brings you to these waters?`,
        responses: [
          { text: "I'm looking for adventure!", next: 'adventure', effect: 5 },
          { text: "Just passing through.", next: 'passing', effect: 0 },
          { text: "Tell me about yourself.", next: 'about', effect: 3 },
          { text: "Goodbye.", next: 'end', effect: 0 },
        ],
      },
      adventure: {
        text: "Adventure, eh? You've come to the right place! These waters are full of mysteries and treasures waiting to be discovered.",
        responses: [
          { text: "Tell me more about the treasures!", next: 'treasure', effect: 5 },
          { text: "What kind of mysteries?", next: 'mysteries', effect: 3 },
          { text: "Maybe another time.", next: 'end', effect: 0 },
        ],
      },
      passing: {
        text: "Fair enough. Safe travels, friend. Come back if you need anything!",
        responses: [
          { text: "Thanks!", next: 'end', effect: 2 },
        ],
      },
      about: {
        text: `Well, I've been ${npc.title} for many years now. Seen a lot of strange things in my time. Friendly folk around here, for the most part.`,
        responses: [
          { text: "Interesting! Tell me more.", next: 'lore', effect: 5 },
          { text: "Thanks for sharing.", next: 'end', effect: 3 },
        ],
      },
      treasure: {
        text: "Legend speaks of Captain Saltbeard's hidden treasure! Many have searched, but none have found it. Perhaps you'll be the one!",
        responses: [
          { text: "I'll find it!", next: 'end', effect: 8 },
          { text: "Sounds dangerous.", next: 'end', effect: 2 },
        ],
      },
      mysteries: {
        text: "Strange lights at night, phantom ships on the horizon, fish that glow in the dark... This island holds many secrets.",
        responses: [
          { text: "I want to investigate!", next: 'end', effect: 8 },
          { text: "Spooky!", next: 'end', effect: 2 },
        ],
      },
      lore: {
        text: "This island was once home to the greatest pirate fleet the world has ever seen. Now? Just us simple folk, fishing and trading.",
        responses: [
          { text: "Fascinating!", next: 'end', effect: 5 },
        ],
      },
      end: {
        text: "Until we meet again, friend!",
        responses: [],
      },
    },
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* NPC sprites layer */}
      <div className="pointer-events-auto">
        {npcUpdates.map(update => {
          const npcData = ALL_NPCS[update.id] || { 
            id: update.id, 
            name: update.id.replace(/_/g, ' '),
            portrait: '👤',
          };

          return (
            <EnhancedNPCSprite
              key={update.id}
              npc={npcData}
              position={update.position}
              state={update.animation || 'idle'}
              mood={update.mood?.name || 'neutral'}
              facing={update.facing || 'right'}
              relationshipLevel={0} // Would come from memory
              questStatus={npcData.quests?.length > 0 ? 'available' : null}
              isHovered={hoveredNPC?.id === update.id}
              isSelected={selectedNPC?.npc?.id === update.id}
              onClick={handleNPCClick}
              onHover={handleNPCHover}
            />
          );
        })}
      </div>

      {/* Selected NPC info panel */}
      {selectedNPC && !dialogueNPC && (
        <div className="pointer-events-auto">
          <EnhancedNPCInfoPanel
            npc={selectedNPC.npc}
            controller={selectedNPC.controller}
            onTalk={(npc) => startDialogue(npc, getSampleDialogue(npc))}
            onGift={(npc) => {
              giveGift(npc, 'test_item');
            }}
            onClose={() => setSelectedNPC(null)}
          />
        </div>
      )}

      {/* Dialogue overlay */}
      {dialogueNPC && (
        <div className="pointer-events-auto">
          <EnhancedDialogueBox
            npc={dialogueNPC.npc}
            dialogue={dialogueNPC.dialogue}
            mood={dialogueNPC.controller.mood?.name}
            relationshipLevel={dialogueNPC.controller.memory.relationshipLevel}
            onResponse={(response) => {
              // Handle dialogue response
              if (response.effect && dialogueNPC.controller) {
                dialogueNPC.controller.memory.updateRelationship('conversation_good', { impact: response.effect });
              }
            }}
            onClose={endDialogue}
          />
        </div>
      )}

      {/* Interaction hint for nearby NPCs */}
      {hoveredNPC && !selectedNPC && !dialogueNPC && (
        <GlowEffect
          x={worldManager.getNPC(hoveredNPC.id)?.position.x}
          y={worldManager.getNPC(hoveredNPC.id)?.position.y}
          color="#FFD700"
          size={80}
          pulse
        />
      )}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  NPCWorldProvider,
  NPCWorldRenderer,
  useNPCWorld,
  EnhancedDialogueBox,
  EnhancedNPCInfoPanel,
};
