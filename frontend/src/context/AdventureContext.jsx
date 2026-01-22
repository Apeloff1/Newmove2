import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  ADVENTURE_LOCATIONS, 
  ADVENTURE_NPCS, 
  ADVENTURE_ITEMS, 
  ADVENTURE_QUESTS,
  getRandomDescription,
  getRandomTravelMessage 
} from '../lib/adventureData';
import { toast } from 'sonner';

// ============================================================================
// ADVENTURE STATE CONTEXT
// ============================================================================

const AdventureContext = createContext(null);

const STORAGE_KEY = 'pirate_adventure_state';

const initialState = {
  currentLocation: 'harbor_square',
  previousLocation: null,
  inventory: ['old_coin'],
  activeQuests: [],
  completedQuests: [],
  discoveredLocations: ['harbor_square'],
  npcRelationships: {},
  gameFlags: {},
  gold: 100,
  experience: 0,
  playerTitle: 'Landlubber',
  dialogueHistory: [],
  currentDialogue: null,
  isInDialogue: false,
  adventureStarted: false,
  totalPlayTime: 0
};

export const AdventureProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch {
      return initialState;
    }
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ========== LOCATION MANAGEMENT ==========
  const travelTo = useCallback((locationId) => {
    const location = ADVENTURE_LOCATIONS[locationId];
    if (!location) {
      toast.error("That location doesn't exist... yet!");
      return false;
    }

    setState(prev => {
      const isFirstVisit = !prev.discoveredLocations.includes(locationId);
      
      if (isFirstVisit) {
        toast.success(`📍 Discovered: ${location.name}!`, {
          description: location.description.slice(0, 80) + '...'
        });
      }

      return {
        ...prev,
        previousLocation: prev.currentLocation,
        currentLocation: locationId,
        discoveredLocations: isFirstVisit 
          ? [...prev.discoveredLocations, locationId]
          : prev.discoveredLocations
      };
    });

    return true;
  }, []);

  const getCurrentLocation = useCallback(() => {
    return ADVENTURE_LOCATIONS[state.currentLocation] || ADVENTURE_LOCATIONS.harbor_square;
  }, [state.currentLocation]);

  // ========== INVENTORY MANAGEMENT ==========
  const addItem = useCallback((itemId) => {
    const item = ADVENTURE_ITEMS[itemId];
    if (!item) return false;

    setState(prev => {
      if (prev.inventory.includes(itemId)) {
        toast.info(`You already have ${item.name}`);
        return prev;
      }

      toast.success(`🎒 Obtained: ${item.name}!`, {
        description: item.description.slice(0, 60) + '...',
        icon: item.icon
      });

      return {
        ...prev,
        inventory: [...prev.inventory, itemId]
      };
    });

    return true;
  }, []);

  const removeItem = useCallback((itemId) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(id => id !== itemId)
    }));
  }, []);

  const hasItem = useCallback((itemId) => {
    return state.inventory.includes(itemId);
  }, [state.inventory]);

  const getInventoryItems = useCallback(() => {
    return state.inventory.map(id => ADVENTURE_ITEMS[id]).filter(Boolean);
  }, [state.inventory]);

  // ========== DIALOGUE SYSTEM ==========
  const startDialogue = useCallback((npcId) => {
    const npc = ADVENTURE_NPCS[npcId];
    if (!npc) return false;

    setState(prev => ({
      ...prev,
      isInDialogue: true,
      currentDialogue: {
        npcId,
        npc,
        currentNode: 'greeting',
        dialogue: npc.dialogues.greeting
      }
    }));

    return true;
  }, []);

  const selectDialogueOption = useCallback((optionIndex) => {
    setState(prev => {
      if (!prev.currentDialogue) return prev;

      const option = prev.currentDialogue.dialogue.options[optionIndex];
      if (!option) return prev;

      const npc = prev.currentDialogue.npc;
      const nextDialogue = npc.dialogues[option.nextDialogue];

      // Handle special effects
      let newState = { ...prev };

      // Give item
      if (option.givesItem) {
        const item = ADVENTURE_ITEMS[option.givesItem];
        if (item && !prev.inventory.includes(option.givesItem)) {
          newState.inventory = [...prev.inventory, option.givesItem];
          toast.success(`🎒 Received: ${item.name}!`, { icon: item.icon });
        }
      }

      // Cost gold
      if (option.cost && prev.gold >= option.cost) {
        newState.gold = prev.gold - option.cost;
        toast.info(`💰 Spent ${option.cost} gold`);
      }

      // Start quest
      if (option.startsQuest) {
        const quest = ADVENTURE_QUESTS[option.startsQuest];
        if (quest && !prev.activeQuests.includes(option.startsQuest)) {
          newState.activeQuests = [...prev.activeQuests, option.startsQuest];
          toast.success(`📜 New Quest: ${quest.name}!`, {
            description: quest.description.slice(0, 60) + '...'
          });
        }
      }

      // Advance quest
      if (prev.currentDialogue.dialogue.advancesQuest) {
        const questId = prev.currentDialogue.dialogue.advancesQuest;
        // Mark quest progress (simplified for now)
        newState.gameFlags = {
          ...prev.gameFlags,
          [`quest_${questId}_advanced`]: true
        };
      }

      // End dialogue or continue
      if (!nextDialogue || nextDialogue.options?.length === 0) {
        return {
          ...newState,
          isInDialogue: false,
          currentDialogue: null,
          dialogueHistory: [
            ...prev.dialogueHistory,
            { npcId: prev.currentDialogue.npcId, timestamp: Date.now() }
          ]
        };
      }

      return {
        ...newState,
        currentDialogue: {
          ...prev.currentDialogue,
          currentNode: option.nextDialogue,
          dialogue: nextDialogue
        }
      };
    });
  }, []);

  const closeDialogue = useCallback(() => {
    setState(prev => ({
      ...prev,
      isInDialogue: false,
      currentDialogue: null
    }));
  }, []);

  // ========== QUEST MANAGEMENT ==========
  const startQuest = useCallback((questId) => {
    const quest = ADVENTURE_QUESTS[questId];
    if (!quest) return false;

    setState(prev => {
      if (prev.activeQuests.includes(questId)) return prev;

      toast.success(`📜 Quest Started: ${quest.name}!`);
      return {
        ...prev,
        activeQuests: [...prev.activeQuests, questId]
      };
    });

    return true;
  }, []);

  const completeQuest = useCallback((questId) => {
    const quest = ADVENTURE_QUESTS[questId];
    if (!quest) return false;

    setState(prev => {
      if (!prev.activeQuests.includes(questId)) return prev;

      toast.success(`🏆 Quest Complete: ${quest.name}!`, {
        description: `Rewards: ${quest.rewards.gold} gold, ${quest.rewards.xp} XP`
      });

      return {
        ...prev,
        activeQuests: prev.activeQuests.filter(id => id !== questId),
        completedQuests: [...prev.completedQuests, questId],
        gold: prev.gold + (quest.rewards.gold || 0),
        experience: prev.experience + (quest.rewards.xp || 0)
      };
    });

    return true;
  }, []);

  const getActiveQuests = useCallback(() => {
    return state.activeQuests.map(id => ADVENTURE_QUESTS[id]).filter(Boolean);
  }, [state.activeQuests]);

  // ========== INTERACTION HANDLERS ==========
  const interactWithHotspot = useCallback((hotspot) => {
    switch (hotspot.type) {
      case 'npc':
        startDialogue(hotspot.npcId);
        break;
      case 'travel':
        if (hotspot.requiresItem && !hasItem(hotspot.requiresItem)) {
          const item = ADVENTURE_ITEMS[hotspot.requiresItem];
          toast.error(`You need ${item?.name || 'something'} to go there!`);
          return false;
        }
        toast.info(getRandomTravelMessage());
        travelTo(hotspot.destination);
        break;
      case 'interact':
        if (hotspot.requiresItem && !hasItem(hotspot.requiresItem)) {
          toast.error("You can't interact with that yet...");
          return false;
        }
        toast.info(getRandomDescription());
        // Check for hidden items at location
        const location = getCurrentLocation();
        if (location.items && location.items.length > 0) {
          const randomItem = location.items[Math.floor(Math.random() * location.items.length)];
          if (!hasItem(randomItem) && Math.random() > 0.5) {
            addItem(randomItem);
          }
        }
        break;
      case 'fishing':
        toast.info("🎣 You cast your line into the water...");
        return { type: 'fishing', hotspot };
      case 'boat_fishing':
        if (hotspot.requiresItem && !hasItem(hotspot.requiresItem)) {
          toast.error("🕸️ You need a fishing net to use the boat!");
          return false;
        }
        toast.info("🚢 Boarding the fishing boat with nets...");
        return { type: 'boat_fishing', hotspot };
      case 'shop':
        setState(prev => ({
          ...prev,
          activeShop: hotspot.shopId,
          shopHotspot: hotspot
        }));
        toast.info(`🏪 Welcome to the shop!`);
        return { type: 'shop', shopId: hotspot.shopId, hotspot };
      case 'minigame':
        setState(prev => ({
          ...prev,
          activeMinigame: hotspot.minigameId || 'memory',
          minigameHotspot: hotspot
        }));
        toast.info(`🎮 ${hotspot.description || 'Starting mini-game...'}`);
        return { type: 'minigame', minigameId: hotspot.minigameId, hotspot };
      default:
        toast.info(getRandomDescription());
    }
    return true;
  }, [startDialogue, travelTo, hasItem, getCurrentLocation, addItem]);

  // ========== GAME STATE ==========
  const startAdventure = useCallback(() => {
    setState(prev => ({
      ...prev,
      adventureStarted: true
    }));
    toast.success("🏴‍☠️ Your adventure begins!", {
      description: "Welcome to Saltbeard's Cove!"
    });
  }, []);

  const resetAdventure = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Adventure reset! Fresh start!");
  }, []);

  // ========== NPC RELATIONSHIPS ==========
  const improveRelationship = useCallback((npcId, amount = 5) => {
    setState(prev => ({
      ...prev,
      npcRelationships: {
        ...prev.npcRelationships,
        [npcId]: (prev.npcRelationships[npcId] || 0) + amount
      }
    }));
  }, []);

  // Clear active minigame
  const clearMinigame = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeMinigame: null,
      minigameHotspot: null
    }));
  }, []);

  // Clear active shop
  const clearShop = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeShop: null,
      shopHotspot: null
    }));
  }, []);

  // Handle minigame completion with rewards
  const completeMinigame = useCallback((score) => {
    const goldReward = Math.floor(score / 2);
    const xpReward = Math.floor(score / 5);
    
    setState(prev => ({
      ...prev,
      gold: prev.gold + goldReward,
      experience: prev.experience + xpReward,
      activeMinigame: null,
      minigameHotspot: null
    }));
    
    toast.success(`🎮 Mini-game complete! +${goldReward}💰 +${xpReward}⭐`);
  }, []);

  const value = {
    // State
    ...state,
    
    // Location
    travelTo,
    getCurrentLocation,
    
    // Inventory
    addItem,
    removeItem,
    hasItem,
    getInventoryItems,
    
    // Dialogue
    startDialogue,
    selectDialogueOption,
    closeDialogue,
    
    // Quests
    startQuest,
    completeQuest,
    getActiveQuests,
    
    // Interactions
    interactWithHotspot,
    
    // Minigames
    clearMinigame,
    completeMinigame,
    
    // Shops
    clearShop,
    
    // Game state
    startAdventure,
    resetAdventure,
    
    // Relationships
    improveRelationship,
    
    // Data access
    locations: ADVENTURE_LOCATIONS,
    npcs: ADVENTURE_NPCS,
    items: ADVENTURE_ITEMS,
    quests: ADVENTURE_QUESTS
  };

  return (
    <AdventureContext.Provider value={value}>
      {children}
    </AdventureContext.Provider>
  );
};

export const useAdventure = () => {
  const context = useContext(AdventureContext);
  if (!context) {
    throw new Error('useAdventure must be used within AdventureProvider');
  }
  return context;
};

export default AdventureContext;
