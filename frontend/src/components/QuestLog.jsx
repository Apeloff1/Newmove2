/**
 * ============================================================================
 * QUEST LOG UI COMPONENT - Complete Quest Tracking System
 * ============================================================================
 * A comprehensive quest log with tracking, progress, rewards preview,
 * and quest chain visualization
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Book, ChevronRight, ChevronDown, Check, Clock, Star, 
  Trophy, Gift, Map, Users, Compass, Crown, Skull,
  Fish, Shell, Gem, ScrollText, Heart, Zap, Target,
  Lock, Unlock, Filter, Search, X, AlertCircle,
  CheckCircle, Circle, ArrowRight, Sparkles
} from 'lucide-react';

// Import quest data
import { ALL_QUEST_CHAINS, QUEST_STATISTICS } from '../lib/questChains';
import EXTENDED_QUEST_CHAINS from '../lib/questChainsExtended';

// Combine all quest chains
const COMBINED_QUEST_CHAINS = { ...ALL_QUEST_CHAINS, ...EXTENDED_QUEST_CHAINS };

// Quest type icons
const QUEST_TYPE_ICONS = {
  main_story: { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  faction: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  rival: { icon: Skull, color: 'text-red-400', bg: 'bg-red-400/20' },
  exploration: { icon: Compass, color: 'text-green-400', bg: 'bg-green-400/20' },
  collection: { icon: Gem, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  location: { icon: Map, color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
  npc: { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/20' },
  seasonal: { icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-400/20' },
  lore: { icon: ScrollText, color: 'text-amber-400', bg: 'bg-amber-400/20' },
  romance: { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/20' },
  challenge: { icon: Zap, color: 'text-yellow-300', bg: 'bg-yellow-300/20' },
  meta: { icon: Trophy, color: 'text-indigo-400', bg: 'bg-indigo-400/20' },
  profession: { icon: Target, color: 'text-teal-400', bg: 'bg-teal-400/20' },
  companion: { icon: Heart, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  supernatural: { icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-400/20' },
  skill: { icon: Zap, color: 'text-sky-400', bg: 'bg-sky-400/20' },
};

// Quest status colors
const QUEST_STATUS = {
  locked: { color: 'text-gray-500', bg: 'bg-gray-500/20', icon: Lock },
  available: { color: 'text-blue-400', bg: 'bg-blue-400/20', icon: Circle },
  active: { color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: Clock },
  completed: { color: 'text-green-400', bg: 'bg-green-400/20', icon: CheckCircle },
};

// ============================================================================
// QUEST CHAIN CARD COMPONENT
// ============================================================================

const QuestChainCard = ({ chain, progress, onSelect, isSelected }) => {
  const typeConfig = QUEST_TYPE_ICONS[chain.type] || QUEST_TYPE_ICONS.exploration;
  const Icon = typeConfig.icon;
  
  const completedQuests = progress?.completedQuests || 0;
  const totalQuests = chain.quests?.length || chain.totalQuests || 10;
  const progressPercent = (completedQuests / totalQuests) * 100;
  
  const isComplete = completedQuests >= totalQuests;
  const isStarted = completedQuests > 0;
  
  return (
    <div
      onClick={() => onSelect(chain)}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-white/20 border-2 border-amber-400 shadow-lg shadow-amber-400/20' 
          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
      data-testid={`quest-chain-${chain.id}`}
    >
      {/* Completion badge */}
      {isComplete && (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
          <Icon className={`w-5 h-5 ${typeConfig.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{chain.name}</h3>
          <p className="text-xs text-white/60 capitalize">{chain.type?.replace('_', ' ')}</p>
        </div>
        <span className="text-2xl">{chain.icon}</span>
      </div>
      
      {/* Description */}
      <p className="text-sm text-white/70 mb-3 line-clamp-2">{chain.description}</p>
      
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-white/60">Progress</span>
          <span className={isComplete ? 'text-green-400' : 'text-amber-400'}>
            {completedQuests}/{totalQuests}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          isComplete ? 'bg-green-500/20 text-green-400' :
          isStarted ? 'bg-amber-500/20 text-amber-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {isComplete ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
        </span>
        <ChevronRight className="w-4 h-4 text-white/40" />
      </div>
    </div>
  );
};

// ============================================================================
// QUEST ITEM COMPONENT
// ============================================================================

const QuestItem = ({ quest, chainId, status, onSelect, isActive }) => {
  const statusConfig = QUEST_STATUS[status] || QUEST_STATUS.available;
  const StatusIcon = statusConfig.icon;
  
  return (
    <div
      onClick={() => status !== 'locked' && onSelect(quest)}
      className={`
        p-3 rounded-lg transition-all duration-200
        ${status === 'locked' 
          ? 'bg-white/5 opacity-50 cursor-not-allowed' 
          : isActive
            ? 'bg-amber-500/20 border border-amber-400'
            : 'bg-white/5 hover:bg-white/10 cursor-pointer border border-transparent'
        }
      `}
      data-testid={`quest-item-${quest.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className={`p-1.5 rounded-full ${statusConfig.bg}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
        </div>
        
        {/* Quest info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${status === 'completed' ? 'text-white/60 line-through' : 'text-white'}`}>
            {quest.name}
          </h4>
          <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{quest.description}</p>
          
          {/* Objectives preview */}
          {status === 'active' && quest.objectives && (
            <div className="mt-2 space-y-1">
              {quest.objectives.slice(0, 2).map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="truncate">{obj.text}</span>
                </div>
              ))}
              {quest.objectives.length > 2 && (
                <span className="text-xs text-white/40">+{quest.objectives.length - 2} more</span>
              )}
            </div>
          )}
        </div>
        
        {/* Rewards preview */}
        {quest.rewards && (
          <div className="flex items-center gap-1 text-xs">
            {quest.rewards.xp && (
              <span className="text-purple-400">+{quest.rewards.xp}xp</span>
            )}
            {quest.rewards.gold && (
              <span className="text-yellow-400">+{quest.rewards.gold}g</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// QUEST DETAIL PANEL
// ============================================================================

const QuestDetailPanel = ({ quest, chain, onClose, onStartQuest, onCompleteObjective }) => {
  if (!quest) return null;
  
  const typeConfig = QUEST_TYPE_ICONS[chain?.type] || QUEST_TYPE_ICONS.exploration;
  
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{chain?.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{quest.name}</h2>
            <p className="text-sm text-white/60">{chain?.name}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white/80 mb-2">Description</h3>
        <p className="text-white/70">{quest.description}</p>
      </div>
      
      {/* Dialogue */}
      {quest.dialogue?.intro && (
        <div className="mb-6 p-4 bg-white/5 rounded-xl border-l-4 border-amber-400">
          <p className="text-white/80 italic">"{quest.dialogue.intro}"</p>
        </div>
      )}
      
      {/* Objectives */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Objectives
        </h3>
        <div className="space-y-2">
          {quest.objectives?.map((obj, i) => (
            <div 
              key={i}
              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
            >
              <button
                onClick={() => onCompleteObjective(quest.id, i)}
                className="mt-0.5 p-1 rounded-full border border-white/20 hover:border-amber-400 hover:bg-amber-400/20 transition-colors"
              >
                <div className="w-3 h-3 rounded-full" />
              </button>
              <div className="flex-1">
                <p className="text-white/90">{obj.text}</p>
                {obj.count && (
                  <p className="text-xs text-white/50 mt-1">0/{obj.count}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rewards */}
      {quest.rewards && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Rewards
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quest.rewards.xp && (
              <div className="p-3 bg-purple-500/20 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-400">+{quest.rewards.xp}</p>
                <p className="text-xs text-purple-300">Experience</p>
              </div>
            )}
            {quest.rewards.gold && (
              <div className="p-3 bg-yellow-500/20 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-400">+{quest.rewards.gold}</p>
                <p className="text-xs text-yellow-300">Gold</p>
              </div>
            )}
            {quest.rewards.items?.map((item, i) => (
              <div key={i} className="p-3 bg-white/10 rounded-lg text-center">
                <p className="text-sm font-medium text-white">{item.replace(/_/g, ' ')}</p>
                <p className="text-xs text-white/50">Item</p>
              </div>
            ))}
            {quest.rewards.title && (
              <div className="p-3 bg-amber-500/20 rounded-lg text-center col-span-2">
                <p className="text-sm font-bold text-amber-400">🏆 {quest.rewards.title}</p>
                <p className="text-xs text-amber-300">Title Unlocked</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Requirements */}
      {quest.requirement && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Requirements
          </h3>
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            {quest.requirement.level && (
              <p className="text-white/70">Level {quest.requirement.level} required</p>
            )}
            {quest.requirement.quest && (
              <p className="text-white/70">Complete: {quest.requirement.quest}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Action button */}
      <button
        onClick={() => onStartQuest(quest)}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all"
        data-testid="start-quest-btn"
      >
        Start Quest
      </button>
    </div>
  );
};

// ============================================================================
// MAIN QUEST LOG COMPONENT
// ============================================================================

const QuestLog = ({ isOpen, onClose, playerProgress = {} }) => {
  const [selectedChain, setSelectedChain] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chains'); // 'chains', 'active', 'completed'
  
  // Get all quest chains as array
  const questChains = useMemo(() => {
    return Object.values(COMBINED_QUEST_CHAINS).filter(chain => chain && chain.id);
  }, []);
  
  // Filter quest chains
  const filteredChains = useMemo(() => {
    return questChains.filter(chain => {
      // Type filter
      if (filter !== 'all' && chain.type !== filter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          chain.name?.toLowerCase().includes(query) ||
          chain.description?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [questChains, filter, searchQuery]);
  
  // Get unique quest types
  const questTypes = useMemo(() => {
    const types = new Set(questChains.map(c => c.type).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [questChains]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    const totalQuests = questChains.reduce((sum, chain) => 
      sum + (chain.quests?.length || chain.totalQuests || 0), 0
    );
    const completedQuests = Object.values(playerProgress).reduce((sum, p) => 
      sum + (p.completedQuests || 0), 0
    );
    return {
      totalChains: questChains.length,
      completedChains: Object.values(playerProgress).filter(p => p.completed).length,
      totalQuests,
      completedQuests,
      progressPercent: totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0,
    };
  }, [questChains, playerProgress]);
  
  // Handle quest start
  const handleStartQuest = useCallback((quest) => {
    console.log('Starting quest:', quest);
    // TODO: Integrate with game state
  }, []);
  
  // Handle objective completion
  const handleCompleteObjective = useCallback((questId, objectiveIndex) => {
    console.log('Completing objective:', questId, objectiveIndex);
    // TODO: Integrate with game state
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      data-testid="quest-log-modal"
    >
      <div className="w-full max-w-6xl h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Book className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Quest Log</h1>
                <p className="text-white/60">Track your adventures</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              data-testid="close-quest-log"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-white">{stats.totalChains}</p>
              <p className="text-xs text-white/60">Quest Chains</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-green-400">{stats.completedChains}</p>
              <p className="text-xs text-white/60">Chains Completed</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-amber-400">{stats.completedQuests}/{stats.totalQuests}</p>
              <p className="text-xs text-white/60">Quests Done</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-purple-400">{stats.progressPercent.toFixed(1)}%</p>
              </div>
              <p className="text-xs text-white/60">Overall Progress</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2">
          {['chains', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Search and filter */}
        <div className="px-6 py-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
          >
            {questTypes.map(type => (
              <option key={type} value={type} className="bg-slate-800">
                {type === 'all' ? 'All Types' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Quest chains list */}
          <div className="w-1/2 p-4 overflow-y-auto border-r border-white/10">
            <div className="grid gap-4">
              {filteredChains.map(chain => (
                <QuestChainCard
                  key={chain.id}
                  chain={chain}
                  progress={playerProgress[chain.id]}
                  onSelect={setSelectedChain}
                  isSelected={selectedChain?.id === chain.id}
                />
              ))}
              {filteredChains.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>No quest chains found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Quest detail or chain quests */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selectedQuest ? (
              <QuestDetailPanel
                quest={selectedQuest}
                chain={selectedChain}
                onClose={() => setSelectedQuest(null)}
                onStartQuest={handleStartQuest}
                onCompleteObjective={handleCompleteObjective}
              />
            ) : selectedChain ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{selectedChain.name}</h2>
                  <button
                    onClick={() => setSelectedChain(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-white/70 mb-4">{selectedChain.description}</p>
                
                {/* Quest list */}
                <div className="space-y-2">
                  {selectedChain.quests?.map((quest, index) => {
                    const progress = playerProgress[selectedChain.id];
                    const completedQuests = progress?.completedQuests || 0;
                    let status = 'available';
                    if (index < completedQuests) status = 'completed';
                    else if (index > completedQuests) status = 'locked';
                    else status = progress?.activeQuest === quest.id ? 'active' : 'available';
                    
                    return (
                      <QuestItem
                        key={quest.id}
                        quest={quest}
                        chainId={selectedChain.id}
                        status={status}
                        onSelect={setSelectedQuest}
                        isActive={progress?.activeQuest === quest.id}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-white/40">
                <div className="text-center">
                  <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a quest chain to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestLog;
