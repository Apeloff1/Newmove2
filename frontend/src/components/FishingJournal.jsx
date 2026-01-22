import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// ========================================================================
// FISHING JOURNAL SYSTEM
// Complete catch logging with statistics, collections, and discoveries
// ========================================================================

// ==================== JOURNAL CATEGORIES ====================
const JOURNAL_CATEGORIES = {
  ALL: { id: 'all', name: 'All Entries', icon: '📖', color: 'from-slate-500 to-slate-600' },
  CATCHES: { id: 'catches', name: 'Catches', icon: '🐟', color: 'from-blue-500 to-cyan-500' },
  PERFECT: { id: 'perfect', name: 'Perfect', icon: '⭐', color: 'from-yellow-500 to-amber-500' },
  RARE: { id: 'rare', name: 'Rare Finds', icon: '💎', color: 'from-purple-500 to-pink-500' },
  LEGENDARY: { id: 'legendary', name: 'Legendary', icon: '👑', color: 'from-yellow-400 to-orange-500' },
  MILESTONES: { id: 'milestones', name: 'Milestones', icon: '🏆', color: 'from-green-500 to-emerald-500' },
};

// ==================== FISH COLLECTION DATA ====================
const FISH_COLLECTIONS = {
  freshwater_basics: {
    id: 'freshwater_basics',
    name: 'Freshwater Basics',
    icon: '🏞️',
    description: 'Common lake and river fish',
    fish: ['minnow', 'perch', 'bass', 'catfish', 'carp'],
    reward: { type: 'recipe', id: 'fish_soup_special', name: 'Secret Fish Soup' },
  },
  predator_pack: {
    id: 'predator_pack',
    name: 'Predator Pack',
    icon: '🦈',
    description: 'Top of the food chain',
    fish: ['pike', 'bass', 'catfish', 'trout'],
    reward: { type: 'recipe', id: 'predator_stew', name: 'Predator Stew' },
  },
  deep_sea_collection: {
    id: 'deep_sea_collection',
    name: 'Deep Sea Collection',
    icon: '🌊',
    description: 'Creatures of the deep',
    fish: ['anglerfish', 'swordfish', 'tuna', 'eel'],
    reward: { type: 'recipe', id: 'deep_sea_platter', name: 'Abyssal Platter' },
  },
  sushi_grade: {
    id: 'sushi_grade',
    name: 'Sushi Grade',
    icon: '🍣',
    description: 'Premium raw fish',
    fish: ['salmon', 'tuna', 'eel', 'mackerel'],
    reward: { type: 'recipe', id: 'master_omakase', name: 'Master Omakase' },
  },
  golden_collection: {
    id: 'golden_collection',
    name: 'Golden Collection',
    icon: '✨',
    description: 'The rarest of the rare',
    fish: ['golden_koi', 'golden_trout', 'golden_bass'],
    reward: { type: 'title', id: 'golden_master', name: 'Golden Master' },
  },
  night_dwellers: {
    id: 'night_dwellers',
    name: 'Night Dwellers',
    icon: '🌙',
    description: 'Nocturnal catches only',
    fish: ['catfish', 'eel', 'anglerfish', 'carp'],
    reward: { type: 'recipe', id: 'midnight_feast', name: 'Midnight Feast' },
  },
  legendary_beasts: {
    id: 'legendary_beasts',
    name: 'Legendary Beasts',
    icon: '🐉',
    description: 'Mythical sea creatures',
    fish: ['golden_koi', 'leviathan', 'sea_serpent', 'kraken'],
    reward: { type: 'title', id: 'legend_hunter', name: 'Legend Hunter' },
  },
};

// ==================== MILESTONE DEFINITIONS ====================
const MILESTONES = {
  first_catch: { id: 'first_catch', name: 'First Catch', icon: '🎣', requirement: { catches: 1 }, reward: 50 },
  dozen_fish: { id: 'dozen_fish', name: 'A Dozen Fish', icon: '🐟', requirement: { catches: 12 }, reward: 100 },
  century_angler: { id: 'century_angler', name: 'Century Angler', icon: '💯', requirement: { catches: 100 }, reward: 500 },
  thousand_club: { id: 'thousand_club', name: 'Thousand Club', icon: '🏅', requirement: { catches: 1000 }, reward: 2500 },
  
  first_perfect: { id: 'first_perfect', name: 'First Perfect', icon: '⭐', requirement: { perfect: 1 }, reward: 75 },
  perfect_ten: { id: 'perfect_ten', name: 'Perfect Ten', icon: '🌟', requirement: { perfect: 10 }, reward: 250 },
  perfectionist: { id: 'perfectionist', name: 'Perfectionist', icon: '💎', requirement: { perfect: 100 }, reward: 1500 },
  
  rare_finder: { id: 'rare_finder', name: 'Rare Finder', icon: '💙', requirement: { rare: 1 }, reward: 150 },
  rare_collector: { id: 'rare_collector', name: 'Rare Collector', icon: '💜', requirement: { rare: 25 }, reward: 750 },
  
  epic_encounter: { id: 'epic_encounter', name: 'Epic Encounter', icon: '💜', requirement: { epic: 1 }, reward: 300 },
  epic_hunter: { id: 'epic_hunter', name: 'Epic Hunter', icon: '🔮', requirement: { epic: 10 }, reward: 1500 },
  
  legendary_catch: { id: 'legendary_catch', name: 'Legendary!', icon: '👑', requirement: { legendary: 1 }, reward: 1000 },
  legend_master: { id: 'legend_master', name: 'Legend Master', icon: '🏆', requirement: { legendary: 5 }, reward: 5000 },
  
  combo_starter: { id: 'combo_starter', name: 'Combo Starter', icon: '🔥', requirement: { maxCombo: 5 }, reward: 100 },
  combo_master: { id: 'combo_master', name: 'Combo Master', icon: '⚡', requirement: { maxCombo: 20 }, reward: 1000 },
  combo_god: { id: 'combo_god', name: 'Combo God', icon: '💥', requirement: { maxCombo: 50 }, reward: 5000 },
  
  early_bird: { id: 'early_bird', name: 'Early Bird', icon: '🌅', requirement: { morning: 10 }, reward: 200 },
  night_owl: { id: 'night_owl', name: 'Night Owl', icon: '🦉', requirement: { night: 25 }, reward: 400 },
  storm_chaser: { id: 'storm_chaser', name: 'Storm Chaser', icon: '⛈️', requirement: { storm: 10 }, reward: 500 },
  
  species_5: { id: 'species_5', name: 'Budding Collector', icon: '📚', requirement: { species: 5 }, reward: 150 },
  species_15: { id: 'species_15', name: 'Fish Enthusiast', icon: '📖', requirement: { species: 15 }, reward: 500 },
  species_30: { id: 'species_30', name: 'Master Collector', icon: '📕', requirement: { species: 30 }, reward: 2000 },
};

// ==================== RARITY STYLES ====================
const RARITY_STYLES = {
  common: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-200', border: 'border-gray-400' },
  uncommon: { bg: 'from-green-500 to-emerald-600', text: 'text-green-200', border: 'border-green-400' },
  rare: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-200', border: 'border-blue-400' },
  epic: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-200', border: 'border-purple-400' },
  legendary: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-200', border: 'border-yellow-400' },
};

// ==================== JOURNAL ENTRY COMPONENT ====================
const JournalEntry = ({ entry, index }) => {
  const rarity = entry.rarity || 'common';
  const style = RARITY_STYLES[rarity];
  
  return (
    <div 
      className={`
        p-4 rounded-xl border-2 ${style.border}/50
        bg-gradient-to-r ${style.bg}/20
        transition-all hover:scale-[1.02] cursor-pointer
      `}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start gap-3">
        {/* Fish icon */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-3xl shrink-0`}>
          {entry.icon || '🐟'}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold ${style.text}`}>{entry.name}</h3>
            {entry.isPerfect && <span className="text-yellow-400 text-sm">⭐ Perfect</span>}
          </div>
          
          <p className="text-xs text-white/50 mb-2">
            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
          </p>
          
          <div className="flex items-center gap-3 text-xs">
            <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${style.bg} text-white capitalize`}>
              {rarity}
            </span>
            <span className="text-yellow-400">+{entry.points} pts</span>
            {entry.combo > 1 && <span className="text-orange-400">🔥 {entry.combo}x</span>}
            {entry.ingredients?.length > 0 && (
              <span className="text-green-400">🥬 {entry.ingredients.length} drops</span>
            )}
          </div>
        </div>
        
        {/* Size/Weight */}
        <div className="text-right">
          <p className="text-lg font-bold text-white">{entry.size || '??'}"</p>
          <p className="text-xs text-white/50">{entry.weight || '??'} lbs</p>
        </div>
      </div>
    </div>
  );
};

// ==================== COLLECTION CARD COMPONENT ====================
const CollectionCard = ({ collection, caughtFish, onClaim }) => {
  const progress = collection.fish.filter(f => caughtFish.includes(f)).length;
  const total = collection.fish.length;
  const isComplete = progress >= total;
  
  return (
    <div className={`
      p-5 rounded-2xl border-2 transition-all
      ${isComplete 
        ? 'border-yellow-400 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 shadow-lg shadow-yellow-500/20' 
        : 'border-white/20 bg-white/5'}
    `}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-14 h-14 rounded-xl ${isComplete ? 'bg-gradient-to-br from-yellow-500 to-amber-600' : 'bg-white/10'} flex items-center justify-center text-3xl`}>
          {collection.icon}
        </div>
        <div>
          <h3 className={`font-bold ${isComplete ? 'text-yellow-400' : 'text-white'}`}>{collection.name}</h3>
          <p className="text-xs text-white/50">{collection.description}</p>
        </div>
      </div>
      
      {/* Fish list */}
      <div className="flex flex-wrap gap-2 mb-4">
        {collection.fish.map(fish => {
          const caught = caughtFish.includes(fish);
          return (
            <div 
              key={fish}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                caught 
                  ? 'bg-green-900/50 text-green-400 border border-green-500/30' 
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {caught ? '✓' : '?'} {fish.replace(/_/g, ' ')}
            </div>
          );
        })}
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/50">Progress</span>
          <span className={isComplete ? 'text-yellow-400' : 'text-white/70'}>{progress}/{total}</span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${isComplete ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Reward */}
      <div className={`p-3 rounded-xl ${isComplete ? 'bg-yellow-900/30 border border-yellow-500/30' : 'bg-black/20'}`}>
        <p className="text-xs text-white/50 mb-1">Reward</p>
        <div className="flex items-center gap-2">
          <span className="text-xl">{collection.reward.type === 'recipe' ? '📜' : '🏅'}</span>
          <span className={`font-bold ${isComplete ? 'text-yellow-400' : 'text-white/60'}`}>
            {collection.reward.name}
          </span>
        </div>
      </div>
      
      {/* Claim button */}
      {isComplete && (
        <button
          onClick={() => onClaim(collection)}
          className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all"
        >
          🎁 Claim Reward
        </button>
      )}
    </div>
  );
};

// ==================== MILESTONE CARD COMPONENT ====================
const MilestoneCard = ({ milestone, stats, claimed, onClaim }) => {
  const [requirementKey, requirementValue] = Object.entries(milestone.requirement)[0];
  const currentValue = stats[requirementKey] || 0;
  const isComplete = currentValue >= requirementValue;
  const isClaimed = claimed.includes(milestone.id);
  
  return (
    <div className={`
      p-4 rounded-xl border-2 transition-all
      ${isClaimed 
        ? 'border-green-500/50 bg-green-900/20' 
        : isComplete 
          ? 'border-yellow-400 bg-yellow-900/20 animate-pulse' 
          : 'border-white/10 bg-white/5'}
    `}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${
          isClaimed ? 'bg-green-600' : isComplete ? 'bg-yellow-500' : 'bg-white/10'
        } flex items-center justify-center text-2xl`}>
          {isClaimed ? '✓' : milestone.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${isClaimed ? 'text-green-400' : isComplete ? 'text-yellow-400' : 'text-white'}`}>
            {milestone.name}
          </h4>
          <p className="text-xs text-white/50">
            {currentValue}/{requirementValue} {requirementKey}
          </p>
        </div>
        <div className="text-right">
          {isClaimed ? (
            <span className="text-green-400 text-sm">Claimed!</span>
          ) : isComplete ? (
            <button
              onClick={() => onClaim(milestone)}
              className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg text-sm hover:bg-yellow-400"
            >
              +{milestone.reward}
            </button>
          ) : (
            <span className="text-yellow-400 text-sm">+{milestone.reward}</span>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      {!isClaimed && (
        <div className="mt-3 h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${isComplete ? 'bg-yellow-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(100, (currentValue / requirementValue) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

// ==================== STATISTICS PANEL ====================
const StatisticsPanel = ({ stats }) => {
  const statItems = [
    { label: 'Total Catches', value: stats.catches || 0, icon: '🐟', color: 'text-blue-400' },
    { label: 'Perfect Catches', value: stats.perfect || 0, icon: '⭐', color: 'text-yellow-400' },
    { label: 'Rare+ Catches', value: (stats.rare || 0) + (stats.epic || 0) + (stats.legendary || 0), icon: '💎', color: 'text-purple-400' },
    { label: 'Max Combo', value: stats.maxCombo || 0, icon: '🔥', color: 'text-orange-400' },
    { label: 'Species Found', value: stats.species || 0, icon: '📚', color: 'text-green-400' },
    { label: 'Total Points', value: stats.totalPoints || 0, icon: '💰', color: 'text-amber-400' },
    { label: 'Time Fishing', value: `${Math.floor((stats.fishingTime || 0) / 60)}h`, icon: '⏱️', color: 'text-cyan-400' },
    { label: 'Favorite Spot', value: stats.favoriteSpot || 'N/A', icon: '📍', color: 'text-red-400' },
  ];
  
  return (
    <div className="grid grid-cols-4 gap-3">
      {statItems.map(stat => (
        <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
          <span className="text-2xl">{stat.icon}</span>
          <p className={`text-xl font-bold ${stat.color} mt-1`}>
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </p>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

// ==================== MAIN FISHING JOURNAL COMPONENT ====================
const FishingJournal = ({ onClose }) => {
  const store = useGameStore();
  const [selectedTab, setSelectedTab] = useState('entries');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [journalEntries, setJournalEntries] = useState([]);
  const [caughtSpecies, setCaughtSpecies] = useState([]);
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedCollections, setClaimedCollections] = useState([]);
  const [stats, setStats] = useState({});
  
  // Load journal data
  useEffect(() => {
    const savedEntries = localStorage.getItem('gofish_journal_entries');
    const savedMilestones = localStorage.getItem('gofish_claimed_milestones');
    const savedCollections = localStorage.getItem('gofish_claimed_collections');
    const savedStats = localStorage.getItem('gofish_journal_stats');
    
    if (savedEntries) setJournalEntries(JSON.parse(savedEntries));
    if (savedMilestones) setClaimedMilestones(JSON.parse(savedMilestones));
    if (savedCollections) setClaimedCollections(JSON.parse(savedCollections));
    if (savedStats) setStats(JSON.parse(savedStats));
    
    // Extract unique species
    const entries = savedEntries ? JSON.parse(savedEntries) : [];
    const species = [...new Set(entries.map(e => e.fishType?.toLowerCase().replace(/\s+/g, '_')))];
    setCaughtSpecies(species);
  }, []);
  
  // Calculate stats from store
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      catches: store.totalCatches || 0,
      perfect: store.perfectCatches || 0,
      maxCombo: Math.max(prev.maxCombo || 0, store.combo || 0),
      species: caughtSpecies.length,
      totalPoints: store.score || 0,
    }));
  }, [store.totalCatches, store.perfectCatches, store.combo, store.score, caughtSpecies.length]);
  
  // Filter entries
  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'ALL') return journalEntries;
    
    return journalEntries.filter(entry => {
      switch (selectedCategory) {
        case 'PERFECT': return entry.isPerfect;
        case 'RARE': return entry.rarity === 'rare';
        case 'LEGENDARY': return entry.rarity === 'legendary' || entry.rarity === 'epic';
        case 'MILESTONES': return entry.type === 'milestone';
        default: return true;
      }
    });
  }, [journalEntries, selectedCategory]);
  
  // Claim milestone
  const handleClaimMilestone = useCallback((milestone) => {
    store.addScore(milestone.reward);
    const newClaimed = [...claimedMilestones, milestone.id];
    setClaimedMilestones(newClaimed);
    localStorage.setItem('gofish_claimed_milestones', JSON.stringify(newClaimed));
  }, [claimedMilestones, store]);
  
  // Claim collection
  const handleClaimCollection = useCallback((collection) => {
    const newClaimed = [...claimedCollections, collection.id];
    setClaimedCollections(newClaimed);
    localStorage.setItem('gofish_claimed_collections', JSON.stringify(newClaimed));
    
    // Add recipe or title
    if (collection.reward.type === 'recipe') {
      const unlockedRecipes = JSON.parse(localStorage.getItem('gofish_unlocked_recipes') || '[]');
      unlockedRecipes.push(collection.reward.id);
      localStorage.setItem('gofish_unlocked_recipes', JSON.stringify(unlockedRecipes));
    } else if (collection.reward.type === 'title') {
      const unlockedTitles = JSON.parse(localStorage.getItem('gofish_unlocked_titles') || '[]');
      unlockedTitles.push(collection.reward.id);
      localStorage.setItem('gofish_unlocked_titles', JSON.stringify(unlockedTitles));
    }
  }, [claimedCollections]);
  
  const tabs = [
    { id: 'entries', name: 'Journal', icon: '📖' },
    { id: 'collections', name: 'Collections', icon: '🏆' },
    { id: 'milestones', name: 'Milestones', icon: '🎯' },
    { id: 'statistics', name: 'Statistics', icon: '📊' },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" data-testid="fishing-journal">
      <div className="w-full max-w-6xl max-h-[95vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden border-2 border-amber-500/40 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-700 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📔</span>
            <div>
              <h2 className="text-2xl font-bold text-white font-pixel">FISHING JOURNAL</h2>
              <p className="text-sm text-amber-200">Your personal fishing diary</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-white/50">Entries</p>
              <p className="text-xl font-bold text-white">{journalEntries.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50">Species</p>
              <p className="text-xl font-bold text-amber-300">{caughtSpecies.length}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-xl bg-black/30 text-white font-bold text-xl hover:bg-black/50 transition-all">×</button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4 py-3 border-b border-white/10 flex gap-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Journal Entries Tab */}
          {selectedTab === 'entries' && (
            <>
              {/* Category filters */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {Object.entries(JOURNAL_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                      selectedCategory === key
                        ? `bg-gradient-to-r ${cat.color} text-white`
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Entries list */}
              {filteredEntries.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-6xl">📖</span>
                  <p className="text-white/50 mt-4 text-lg">Your journal is empty</p>
                  <p className="text-white/30 text-sm">Start fishing to record your catches!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEntries.slice().reverse().map((entry, i) => (
                    <JournalEntry key={entry.id || i} entry={entry} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
          
          {/* Collections Tab */}
          {selectedTab === 'collections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(FISH_COLLECTIONS).map(collection => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  caughtFish={caughtSpecies}
                  onClaim={handleClaimCollection}
                />
              ))}
            </div>
          )}
          
          {/* Milestones Tab */}
          {selectedTab === 'milestones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(MILESTONES).map(milestone => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  stats={stats}
                  claimed={claimedMilestones}
                  onClaim={handleClaimMilestone}
                />
              ))}
            </div>
          )}
          
          {/* Statistics Tab */}
          {selectedTab === 'statistics' && (
            <StatisticsPanel stats={stats} />
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== JOURNAL ENTRY CREATOR (for App.js integration) ====================
const createJournalEntry = (fish, isPerfect, points, combo, ingredients = []) => {
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name: fish.name || 'Unknown Fish',
    fishType: fish.name,
    icon: fish.emoji || '🐟',
    rarity: fish.rarity < 0.3 ? 'legendary' : fish.rarity < 0.5 ? 'epic' : fish.rarity < 0.7 ? 'rare' : fish.rarity < 0.85 ? 'uncommon' : 'common',
    size: Math.round((fish.basePoints / 10) + Math.random() * 20),
    weight: Math.round(((fish.basePoints / 5) + Math.random() * 10) * 10) / 10,
    isPerfect,
    points,
    combo,
    ingredients,
    location: fish.habitat || 'Unknown',
  };
  
  // Save to localStorage
  const entries = JSON.parse(localStorage.getItem('gofish_journal_entries') || '[]');
  entries.push(entry);
  localStorage.setItem('gofish_journal_entries', JSON.stringify(entries));
  
  return entry;
};

export { FishingJournal, createJournalEntry, FISH_COLLECTIONS, MILESTONES };
export default FishingJournal;
