import React, { useState } from 'react';
import { useAdventure } from '../context/AdventureContext';
import { X, CheckCircle, Circle, ChevronRight, Trophy, Star } from 'lucide-react';

// ============================================================================
// ADVENTURE QUEST LOG - Journal Style Quest Tracker
// ============================================================================

export const AdventureQuestLog = ({ onClose }) => {
  const { 
    activeQuests, 
    completedQuests, 
    quests,
    gameFlags 
  } = useAdventure();

  const [selectedQuest, setSelectedQuest] = useState(null);
  const [tab, setTab] = useState('active');

  // Get quest data with progress
  const getQuestData = (questId) => {
    const quest = quests[questId];
    if (!quest) return null;

    // Check which stages are complete based on game flags
    const stagesWithProgress = quest.stages.map(stage => ({
      ...stage,
      completed: gameFlags[`quest_${questId}_stage_${stage.id}`] || false
    }));

    const completedStages = stagesWithProgress.filter(s => s.completed).length;
    const progress = (completedStages / quest.stages.length) * 100;

    return {
      ...quest,
      stages: stagesWithProgress,
      progress,
      completedStages
    };
  };

  const activeQuestData = activeQuests.map(getQuestData).filter(Boolean);
  const completedQuestData = completedQuests.map(id => quests[id]).filter(Boolean);

  return (
    <div 
      className="adventure-modal-backdrop"
      onClick={onClose}
      data-testid="adventure-quest-log"
    >
      <div 
        className="quest-log-panel animate-scale-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative header */}
        <div className="quest-log-header">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <h2 className="font-pixel text-2xl text-amber-900">Captain's Log</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-900/20 rounded-full transition-colors"
            data-testid="close-quest-log-btn"
          >
            <X className="w-6 h-6 text-amber-900" />
          </button>
        </div>

        {/* Tabs */}
        <div className="quest-log-tabs">
          <button
            onClick={() => setTab('active')}
            className={`quest-log-tab ${tab === 'active' ? 'active' : ''}`}
          >
            <Circle className="w-4 h-4" />
            Active ({activeQuests.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`quest-log-tab ${tab === 'completed' ? 'active' : ''}`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed ({completedQuests.length})
          </button>
        </div>

        {/* Quest list */}
        <div className="quest-log-content">
          {tab === 'active' && (
            <div className="space-y-3">
              {activeQuestData.length === 0 ? (
                <div className="text-center py-12 text-amber-800/60">
                  <span className="text-4xl mb-4 block">🧭</span>
                  <p className="font-pixel">No Active Quests</p>
                  <p className="text-sm mt-2">Talk to the locals to find adventure!</p>
                </div>
              ) : (
                activeQuestData.map(quest => (
                  <button
                    key={quest.id}
                    onClick={() => setSelectedQuest(quest)}
                    className={`quest-log-item ${selectedQuest?.id === quest.id ? 'active' : ''}`}
                    data-testid={`quest-${quest.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`quest-type-badge ${quest.type}`}>
                        {quest.type === 'main' ? '⭐' : '📋'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-pixel text-sm text-amber-900 truncate">
                          {quest.name}
                        </h3>
                        <p className="text-xs text-amber-800/70 truncate">
                          {quest.description}
                        </p>
                        {/* Progress bar */}
                        <div className="mt-2">
                          <div className="h-1.5 bg-amber-900/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                              style={{ width: `${quest.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-amber-800/50 mt-1">
                            {quest.completedStages}/{quest.stages.length} objectives
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-800/50" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {tab === 'completed' && (
            <div className="space-y-3">
              {completedQuestData.length === 0 ? (
                <div className="text-center py-12 text-amber-800/60">
                  <span className="text-4xl mb-4 block">📚</span>
                  <p className="font-pixel">No Completed Quests</p>
                  <p className="text-sm mt-2">Your story is just beginning!</p>
                </div>
              ) : (
                completedQuestData.map(quest => (
                  <div
                    key={quest.id}
                    className="quest-log-item completed"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-amber-600" />
                      <div className="flex-1">
                        <h3 className="font-pixel text-sm text-amber-900 line-through opacity-70">
                          {quest.name}
                        </h3>
                        <p className="text-xs text-amber-800/50">
                          Rewards claimed!
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected quest details */}
        {selectedQuest && (
          <div className="quest-log-details animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-600" />
              <h3 className="font-pixel text-lg text-amber-900">{selectedQuest.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedQuest.type === 'main' 
                  ? 'bg-amber-500/30 text-amber-800' 
                  : 'bg-blue-500/30 text-blue-800'
              }`}>
                {selectedQuest.type}
              </span>
            </div>
            
            <p className="text-sm text-amber-800/80 mb-4 italic">
              "{selectedQuest.description}"
            </p>

            {/* Objectives */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-bold text-amber-900/60 uppercase tracking-wider">
                Objectives
              </h4>
              {selectedQuest.stages.map((stage, index) => (
                <div 
                  key={stage.id}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    stage.completed 
                      ? 'bg-green-100/50 text-green-800' 
                      : 'bg-amber-100/50 text-amber-800'
                  }`}
                >
                  {stage.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${stage.completed ? 'line-through opacity-70' : ''}`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Rewards preview */}
            <div className="quest-rewards">
              <h4 className="text-xs font-bold text-amber-900/60 uppercase tracking-wider mb-2">
                Rewards
              </h4>
              <div className="flex items-center gap-4 text-sm">
                {selectedQuest.rewards.gold && (
                  <span className="flex items-center gap-1">
                    <span className="text-lg">💰</span>
                    <span className="text-amber-800">{selectedQuest.rewards.gold}</span>
                  </span>
                )}
                {selectedQuest.rewards.xp && (
                  <span className="flex items-center gap-1">
                    <span className="text-lg">⭐</span>
                    <span className="text-amber-800">{selectedQuest.rewards.xp} XP</span>
                  </span>
                )}
                {selectedQuest.rewards.item && (
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🎁</span>
                    <span className="text-amber-800">Special Item</span>
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={() => setSelectedQuest(null)}
              className="mt-4 w-full py-2 bg-amber-900/20 hover:bg-amber-900/30 rounded-lg text-amber-900 text-sm transition-colors"
            >
              Close Details
            </button>
          </div>
        )}

        {/* Decorative elements */}
        <div className="quest-log-decoration top-right">⚓</div>
        <div className="quest-log-decoration bottom-left">🧭</div>
      </div>
    </div>
  );
};

// Export with alias for the AdventureMode import
export { AdventureQuestLog as QuestLog };
export default AdventureQuestLog;
