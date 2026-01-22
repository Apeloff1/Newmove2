/**
 * ============================================================================
 * NPC SYSTEM COMPONENT - Living World NPCs with AI Behaviors
 * ============================================================================
 * Complete NPC rendering, AI behavior, dialogue, and interaction system
 * ============================================================================
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MessageCircle, Heart, Gift, AlertCircle, User, MapPin, Clock } from 'lucide-react';

// Import NPC data
import { 
  PATH_NODES, 
  SCHEDULE_TEMPLATES, 
  PATROL_ROUTES,
  BEHAVIOR_STATES,
  INTERACTION_TRIGGERS,
  NPCPathingManager,
  calculatePath
} from '../lib/npcPathing';

import {
  NPC_DEFINITIONS,
  DIALOGUE_TREES,
  NPC_REACTIONS,
  NPC_GIFT_PREFERENCES
} from '../lib/npcPathingExtended';

// ============================================================================
// NPC SPRITE COMPONENT
// ============================================================================

const NPCSprite = ({ npc, position, state, direction, isInteracting, onClick }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Animation loop
  useEffect(() => {
    if (state === 'idle') return;
    
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 4);
    }, 200);
    
    return () => clearInterval(interval);
  }, [state]);
  
  // Get NPC appearance
  const appearance = useMemo(() => {
    const def = NPC_DEFINITIONS?.story_npcs?.[npc.id] || 
                NPC_DEFINITIONS?.town_npcs?.[npc.id] || {};
    return def.appearance || {};
  }, [npc.id]);
  
  // Get state-based animation class
  const animationClass = useMemo(() => {
    switch (state) {
      case 'walking': return 'animate-walk';
      case 'running': return 'animate-run';
      case 'fishing': return 'animate-fish';
      case 'talking': return 'animate-talk';
      case 'sleeping': return 'animate-sleep';
      case 'working': return 'animate-work';
      default: return 'animate-idle';
    }
  }, [state]);
  
  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${animationClass}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -100%) scaleX(${direction === 'left' ? -1 : 1})`,
        zIndex: Math.floor(position.y),
      }}
      onClick={() => onClick(npc)}
      data-testid={`npc-${npc.id}`}
    >
      {/* NPC body */}
      <div className="relative">
        {/* Shadow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"
        />
        
        {/* Character */}
        <div className={`
          w-12 h-16 rounded-t-full 
          ${isInteracting ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent' : ''}
          transition-all duration-200
        `}>
          {/* Body */}
          <div 
            className="w-full h-full rounded-t-full bg-gradient-to-b from-blue-400 to-blue-600 relative overflow-hidden"
            style={{
              backgroundColor: npc.color || '#4A90D9',
            }}
          >
            {/* Face */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FFDAB9] rounded-full">
              {/* Eyes */}
              <div className="absolute top-2 left-1 w-2 h-2 bg-black rounded-full" />
              <div className="absolute top-2 right-1 w-2 h-2 bg-black rounded-full" />
              {/* Mouth based on state */}
              {state === 'talking' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-black rounded-full" />
              )}
              {state !== 'talking' && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-black rounded-full" />
              )}
            </div>
          </div>
        </div>
        
        {/* State indicator */}
        {state === 'sleeping' && (
          <div className="absolute -top-4 -right-2 text-lg animate-bounce">💤</div>
        )}
        {state === 'fishing' && (
          <div className="absolute -top-2 -right-4 text-lg">🎣</div>
        )}
        {state === 'working' && (
          <div className="absolute -top-2 -right-2 text-sm animate-pulse">⚒️</div>
        )}
        
        {/* Interaction indicator */}
        {npc.hasQuest && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl animate-bounce">❗</div>
        )}
        {npc.canTalk && !npc.hasQuest && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm opacity-60">💬</div>
        )}
      </div>
      
      {/* Name tag */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-white bg-black/50 px-2 py-0.5 rounded-full">
          {npc.name}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// NPC DIALOGUE BOX COMPONENT
// ============================================================================

const NPCDialogueBox = ({ npc, dialogue, onResponse, onClose }) => {
  const [currentNode, setCurrentNode] = useState('start');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const dialogueTree = DIALOGUE_TREES[dialogue] || {};
  const node = dialogueTree.nodes?.[currentNode];
  
  // Typewriter effect
  useEffect(() => {
    if (!node?.text) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const text = node.text;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [currentNode, node?.text]);
  
  // Handle response selection
  const handleResponse = (response) => {
    if (response.action) {
      onResponse(response.action, response);
    }
    
    if (response.next === 'end' || !response.next) {
      onClose();
    } else {
      setCurrentNode(response.next);
    }
  };
  
  // Skip typing
  const skipTyping = () => {
    if (isTyping && node?.text) {
      setDisplayedText(node.text);
      setIsTyping(false);
    }
  };
  
  if (!node) return null;
  
  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
      data-testid="dialogue-box"
    >
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
        {/* NPC info */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl">
            {npc.icon || '👤'}
          </div>
          <div>
            <h3 className="font-bold text-white">{npc.name}</h3>
            <p className="text-xs text-white/60">{npc.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-auto p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Dialogue text */}
        <div 
          className="p-6 min-h-[120px] cursor-pointer"
          onClick={skipTyping}
        >
          <p className="text-white text-lg leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse">▌</span>}
          </p>
        </div>
        
        {/* Responses */}
        {!isTyping && node.responses && node.responses.length > 0 && (
          <div className="p-4 border-t border-white/10 space-y-2">
            {node.responses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleResponse(response)}
                className={`
                  w-full p-3 text-left rounded-xl transition-all
                  ${response.requires ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}
                  bg-white/5 border border-white/10
                `}
                disabled={response.requires}
              >
                <span className="text-amber-400 mr-2">{index + 1}.</span>
                <span className="text-white">{response.text}</span>
                {response.requires && (
                  <span className="text-xs text-red-400 ml-2">[Locked]</span>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* End conversation option */}
        {!isTyping && (!node.responses || node.responses.length === 0) && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              End Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// NPC INFO PANEL COMPONENT
// ============================================================================

const NPCInfoPanel = ({ npc, relationship, onGift, onTalk, onClose }) => {
  const npcDef = NPC_DEFINITIONS?.story_npcs?.[npc.id] || 
                 NPC_DEFINITIONS?.town_npcs?.[npc.id] || {};
  const giftPrefs = NPC_GIFT_PREFERENCES[npc.id] || {};
  
  // Relationship level display
  const relationshipLevel = useMemo(() => {
    const points = relationship?.points || 0;
    if (points >= 1000) return { name: 'Best Friend', color: 'text-pink-400', icon: '💕' };
    if (points >= 500) return { name: 'Close Friend', color: 'text-purple-400', icon: '💜' };
    if (points >= 200) return { name: 'Friend', color: 'text-blue-400', icon: '💙' };
    if (points >= 50) return { name: 'Acquaintance', color: 'text-green-400', icon: '💚' };
    return { name: 'Stranger', color: 'text-gray-400', icon: '🤍' };
  }, [relationship]);
  
  return (
    <div 
      className="fixed right-4 top-1/2 -translate-y-1/2 w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden z-40"
      data-testid="npc-info-panel"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl">
            {npcDef.icon || '👤'}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-lg">{npc.name}</h2>
            <p className="text-sm text-white/60">{npcDef.title}</p>
            <div className={`flex items-center gap-1 mt-1 ${relationshipLevel.color}`}>
              <span>{relationshipLevel.icon}</span>
              <span className="text-sm">{relationshipLevel.name}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Description */}
      <div className="p-4 border-b border-white/10">
        <p className="text-sm text-white/70">{npcDef.description}</p>
      </div>
      
      {/* Personality traits */}
      {npcDef.personality && (
        <div className="p-4 border-b border-white/10">
          <h3 className="text-xs font-semibold text-white/50 mb-2">PERSONALITY</h3>
          <div className="flex flex-wrap gap-2">
            {npcDef.personality.map((trait, i) => (
              <span 
                key={i}
                className="px-2 py-1 text-xs bg-white/10 rounded-full text-white/70"
              >
                {trait.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Relationship progress */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-xs font-semibold text-white/50 mb-2">RELATIONSHIP</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Points</span>
            <span className="text-white">{relationship?.points || 0}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min((relationship?.points || 0) / 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-white/40">
            {1000 - (relationship?.points || 0)} points to Best Friend
          </p>
        </div>
      </div>
      
      {/* Gift preferences hint */}
      {giftPrefs.loved && (
        <div className="p-4 border-b border-white/10">
          <h3 className="text-xs font-semibold text-white/50 mb-2">GIFT HINTS</h3>
          <p className="text-xs text-white/60">
            Loves: <span className="text-green-400">{giftPrefs.loved[0]?.replace(/_/g, ' ')}</span>
          </p>
          <p className="text-xs text-white/60">
            Hates: <span className="text-red-400">{giftPrefs.hated?.[0]?.replace(/_/g, ' ')}</span>
          </p>
        </div>
      )}
      
      {/* Actions */}
      <div className="p-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onTalk(npc)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Talk
        </button>
        <button
          onClick={() => onGift(npc)}
          className="flex items-center justify-center gap-2 p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl text-pink-400 transition-colors"
        >
          <Gift className="w-4 h-4" />
          Gift
        </button>
      </div>
      
      {/* Location & schedule */}
      <div className="p-4 bg-white/5">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <MapPin className="w-3 h-3" />
          <span>{npc.currentLocation || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
          <Clock className="w-3 h-3" />
          <span>Schedule: {npcDef.schedule || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// NPC MANAGER HOOK
// ============================================================================

export const useNPCManager = (worldRegion = 'barnacle_bay') => {
  const [npcs, setNPCs] = useState([]);
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [dialogueNPC, setDialogueNPC] = useState(null);
  const [relationships, setRelationships] = useState({});
  const managerRef = useRef(new NPCPathingManager());
  
  // Initialize NPCs
  useEffect(() => {
    const initialNPCs = [
      { id: 'harbor_master_hank', name: 'Harbor Master Hank', position: { x: 300, y: 400 }, state: 'idle', hasQuest: true },
      { id: 'old_pete', name: 'Old Pete', position: { x: 500, y: 600 }, state: 'fishing', canTalk: true },
      { id: 'barkeep_bella', name: 'Bella Barrelhouse', position: { x: 700, y: 350 }, state: 'working', canTalk: true },
      { id: 'merchant_marco', name: 'Marco Goldtooth', position: { x: 400, y: 300 }, state: 'idle', canTalk: true, hasQuest: true },
      { id: 'razor_ricky', name: 'Razor Ricky', position: { x: 600, y: 500 }, state: 'walking', canTalk: true },
    ];
    
    initialNPCs.forEach(npc => {
      managerRef.current.registerNPC(npc.id, {
        schedule: NPC_DEFINITIONS?.story_npcs?.[npc.id]?.schedule || 'wanderer',
        startPosition: npc.position,
      });
    });
    
    setNPCs(initialNPCs);
  }, [worldRegion]);
  
  // Update NPC positions
  useEffect(() => {
    const interval = setInterval(() => {
      setNPCs(prevNPCs => prevNPCs.map(npc => {
        const updateData = managerRef.current.updateNPC(npc.id, 0.1);
        if (updateData) {
          return {
            ...npc,
            position: updateData.position,
            state: updateData.state?.state || npc.state,
          };
        }
        return npc;
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle NPC interaction
  const interactWithNPC = useCallback((npc) => {
    setSelectedNPC(npc);
  }, []);
  
  // Start dialogue
  const startDialogue = useCallback((npc, dialogueId) => {
    setDialogueNPC({ npc, dialogueId: dialogueId || `${npc.id}_intro` });
    setSelectedNPC(null);
  }, []);
  
  // Give gift
  const giveGift = useCallback((npc, item) => {
    const prefs = NPC_GIFT_PREFERENCES[npc.id];
    let pointChange = 0;
    let reaction = 'neutral';
    
    if (prefs?.loved?.includes(item)) {
      pointChange = 50;
      reaction = 'loved';
    } else if (prefs?.liked?.includes(item)) {
      pointChange = 25;
      reaction = 'liked';
    } else if (prefs?.disliked?.includes(item)) {
      pointChange = -10;
      reaction = 'disliked';
    } else if (prefs?.hated?.includes(item)) {
      pointChange = -25;
      reaction = 'hated';
    } else {
      pointChange = 5;
    }
    
    setRelationships(prev => ({
      ...prev,
      [npc.id]: {
        ...prev[npc.id],
        points: (prev[npc.id]?.points || 0) + pointChange,
      }
    }));
    
    return { reaction, pointChange, dialogue: prefs?.dialogue?.[reaction] };
  }, []);
  
  // Close panels
  const closeDialogue = useCallback(() => setDialogueNPC(null), []);
  const closeInfo = useCallback(() => setSelectedNPC(null), []);
  
  return {
    npcs,
    selectedNPC,
    dialogueNPC,
    relationships,
    interactWithNPC,
    startDialogue,
    giveGift,
    closeDialogue,
    closeInfo,
  };
};

// ============================================================================
// MAIN NPC SYSTEM COMPONENT
// ============================================================================

const NPCSystem = ({ worldRegion, playerPosition, onQuestStart }) => {
  const {
    npcs,
    selectedNPC,
    dialogueNPC,
    relationships,
    interactWithNPC,
    startDialogue,
    giveGift,
    closeDialogue,
    closeInfo,
  } = useNPCManager(worldRegion);
  
  // Handle dialogue response actions
  const handleDialogueAction = useCallback((action, response) => {
    if (action.startsWith('start_quest_')) {
      const questId = action.replace('start_quest_', '');
      onQuestStart?.(questId);
    } else if (action.startsWith('give_item_')) {
      const itemId = action.replace('give_item_', '');
      console.log('Player received:', itemId);
    }
  }, [onQuestStart]);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* NPC sprites */}
      <div className="pointer-events-auto">
        {npcs.map(npc => (
          <NPCSprite
            key={npc.id}
            npc={npc}
            position={npc.position}
            state={npc.state}
            direction={npc.direction || 'right'}
            isInteracting={selectedNPC?.id === npc.id}
            onClick={interactWithNPC}
          />
        ))}
      </div>
      
      {/* NPC info panel */}
      {selectedNPC && !dialogueNPC && (
        <div className="pointer-events-auto">
          <NPCInfoPanel
            npc={selectedNPC}
            relationship={relationships[selectedNPC.id]}
            onGift={(npc) => {
              const result = giveGift(npc, 'test_item');
              console.log('Gift result:', result);
            }}
            onTalk={(npc) => startDialogue(npc)}
            onClose={closeInfo}
          />
        </div>
      )}
      
      {/* Dialogue box */}
      {dialogueNPC && (
        <div className="pointer-events-auto">
          <NPCDialogueBox
            npc={dialogueNPC.npc}
            dialogue={dialogueNPC.dialogueId}
            onResponse={handleDialogueAction}
            onClose={closeDialogue}
          />
        </div>
      )}
    </div>
  );
};

export { NPCSprite, NPCDialogueBox, NPCInfoPanel };
export default NPCSystem;
