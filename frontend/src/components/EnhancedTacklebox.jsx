import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAdventure } from '../context/AdventureContext';
import { 
  X, Package, Fish, Sparkles, Zap, Star, Crown, 
  Trash2, ArrowUpCircle, Filter, Search, Grid, List,
  ShoppingBag, Anchor, Gem, Coins, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// ENHANCED TACKLEBOX COMPONENT
// Full inventory management with shop items, upgrades, and fish catches
// ============================================================================

export const EnhancedTacklebox = ({ onClose }) => {
  const { character, updateCharacter, addCharacterGold, tacklebox, getTackleboxStats } = useGameStore();
  const [activeTab, setActiveTab] = useState('fish');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterRarity, setFilterRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const playerInventory = character?.inventory || [];
  const playerGold = character?.gold || 0;
  const stats = getTackleboxStats();

  // Categorize inventory items
  const categorizedItems = useMemo(() => {
    const categories = {
      fish: tacklebox?.items || [],
      bait: playerInventory.filter(i => i.type === 'bait'),
      lures: playerInventory.filter(i => i.type === 'lures'),
      equipment: playerInventory.filter(i => i.type === 'equipment'),
      potions: playerInventory.filter(i => i.type === 'potions'),
      supplies: playerInventory.filter(i => i.type === 'supplies' || i.type === 'consumables'),
      quest: playerInventory.filter(i => i.type === 'quest'),
      special: playerInventory.filter(i => i.type === 'special' || i.type === 'treasure')
    };
    return categories;
  }, [tacklebox, playerInventory]);

  // Filter and sort items for current tab
  const displayItems = useMemo(() => {
    let items = [...(categorizedItems[activeTab] || [])];

    // Search filter
    if (searchQuery) {
      items = items.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rarity filter (for fish)
    if (activeTab === 'fish' && filterRarity !== 'all') {
      const rarityMap = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
      items = items.filter(item => item.rarity === rarityMap[filterRarity]);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'rarity':
        items.sort((a, b) => (b.rarity || 0) - (a.rarity || 0));
        break;
      case 'value':
        items.sort((a, b) => (b.points || b.value || 0) - (a.points || a.value || 0));
        break;
      case 'size':
        items.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      case 'recent':
      default:
        items.sort((a, b) => new Date(b.caughtAt || b.purchasedAt || 0) - new Date(a.caughtAt || a.purchasedAt || 0));
    }

    return items;
  }, [categorizedItems, activeTab, searchQuery, filterRarity, sortBy]);

  // Get rarity info
  const getRarityInfo = (rarity) => {
    const rarities = {
      0: { name: 'Common', color: 'gray', bg: 'bg-gray-600/30', border: 'border-gray-500' },
      1: { name: 'Uncommon', color: 'green', bg: 'bg-green-600/30', border: 'border-green-500' },
      2: { name: 'Rare', color: 'blue', bg: 'bg-blue-600/30', border: 'border-blue-500' },
      3: { name: 'Epic', color: 'purple', bg: 'bg-purple-600/30', border: 'border-purple-500' },
      4: { name: 'Legendary', color: 'amber', bg: 'bg-amber-600/30', border: 'border-amber-500 animate-pulse' }
    };
    return rarities[rarity] || rarities[0];
  };

  // Handle using consumable items
  const handleUseItem = (item) => {
    if (!item.consumable && item.type !== 'consumables' && item.type !== 'supplies') {
      toast.error("This item cannot be used directly.");
      return;
    }

    // Apply effect based on item
    let message = `Used ${item.name}!`;
    
    if (item.effect?.includes('luck')) {
      message = `${item.name} activated! Luck increased!`;
    } else if (item.effect?.includes('speed')) {
      message = `${item.name} consumed! Speed boost active!`;
    } else if (item.effect?.includes('durability')) {
      message = `Rod repaired with ${item.name}!`;
    }

    // Remove item from inventory
    const newInventory = playerInventory.filter(i => i !== item);
    updateCharacter({ inventory: newInventory });
    
    toast.success(message, { icon: item.icon });
    setSelectedItem(null);
  };

  // Handle selling fish
  const handleSellFish = (fish) => {
    const sellPrice = Math.floor((fish.points || 10) * 0.8);
    addCharacterGold(sellPrice);
    
    // Remove from tacklebox - this would need a store function
    toast.success(`Sold ${fish.name} for ${sellPrice}g!`, { icon: '💰' });
    setSelectedItem(null);
  };

  // Handle equipping items
  const handleEquip = (item) => {
    if (item.type === 'lures' || item.type === 'rods') {
      toast.success(`Equipped ${item.name}!`, { icon: item.icon });
      // Update equipped item in character
      updateCharacter({ 
        equipped: { 
          ...character?.equipped, 
          [item.type === 'lures' ? 'lure' : 'rod']: item 
        }
      });
    }
    setSelectedItem(null);
  };

  const tabs = [
    { id: 'fish', name: 'Fish', icon: Fish, count: categorizedItems.fish.length },
    { id: 'bait', name: 'Bait', icon: Package, count: categorizedItems.bait.length },
    { id: 'lures', name: 'Lures', icon: Sparkles, count: categorizedItems.lures.length },
    { id: 'equipment', name: 'Gear', icon: Anchor, count: categorizedItems.equipment.length },
    { id: 'potions', name: 'Potions', icon: Zap, count: categorizedItems.potions.length },
    { id: 'supplies', name: 'Supplies', icon: ShoppingBag, count: categorizedItems.supplies.length },
    { id: 'quest', name: 'Quest', icon: Star, count: categorizedItems.quest.length },
    { id: 'special', name: 'Special', icon: Crown, count: categorizedItems.special.length }
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      data-testid="enhanced-tacklebox"
    >
      <div 
        className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl border-2 border-cyan-500/30 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 flex items-center justify-between border-b border-cyan-500/30">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🧰</span>
            <div>
              <h2 className="font-pixel text-2xl text-cyan-100">TACKLEBOX</h2>
              <p className="text-cyan-300/60 text-sm">Your fishing inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Stats overview */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-cyan-900/50 px-3 py-1.5 rounded-lg">
                <Fish className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-200 text-sm">{stats.totalFishCaught}</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-900/50 px-3 py-1.5 rounded-lg">
                <Gem className="w-4 h-4 text-purple-400" />
                <span className="text-purple-200 text-sm">{stats.rareFishCount}</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-900/50 px-3 py-1.5 rounded-lg">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-amber-200 text-sm">{playerGold}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-red-600/50 hover:bg-red-600 rounded-full transition-colors"
              data-testid="close-tacklebox-btn"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Tabs Sidebar */}
          <div className="w-20 md:w-32 bg-slate-900/50 border-r border-cyan-500/20 p-2 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedItem(null); }}
                className={`w-full p-2 md:p-3 rounded-xl mb-2 transition-all flex flex-col items-center ${
                  activeTab === tab.id 
                    ? 'bg-cyan-600 text-cyan-100' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
                data-testid={`tacklebox-tab-${tab.id}`}
              >
                <tab.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold hidden md:block">{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 rounded-full mt-1 ${
                    activeTab === tab.id ? 'bg-cyan-700' : 'bg-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 border-b border-cyan-500/20 flex flex-wrap gap-3 items-center bg-slate-900/30">
              {/* Search */}
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-sm"
                />
              </div>

              {/* Filters for fish tab */}
              {activeTab === 'fish' && (
                <select
                  value={filterRarity}
                  onChange={e => setFilterRarity(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              )}

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="rarity">Rarity</option>
                <option value="value">Value</option>
                {activeTab === 'fish' && <option value="size">Size</option>}
              </select>

              {/* View Toggle */}
              <div className="flex bg-slate-800 rounded-lg border border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-cyan-600' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-cyan-600' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items Display */}
            <div className="flex-1 overflow-y-auto p-4">
              {displayItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Package className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">No items found</p>
                  <p className="text-sm">
                    {activeTab === 'fish' ? 'Catch some fish!' : 'Visit the shops to buy items!'}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {displayItems.map((item, idx) => {
                    const rarity = getRarityInfo(item.rarity);
                    return (
                      <button
                        key={item.id || idx}
                        onClick={() => setSelectedItem(item)}
                        className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                          selectedItem === item 
                            ? 'ring-2 ring-cyan-400 border-cyan-400' 
                            : `${rarity.border} ${rarity.bg}`
                        }`}
                        data-testid={`item-${item.id || idx}`}
                      >
                        <div className="text-3xl mb-1">{item.icon || (activeTab === 'fish' ? '🐟' : '📦')}</div>
                        <div className="text-xs text-slate-300 truncate">{item.name}</div>
                        {item.size && (
                          <div className="text-[10px] text-slate-500">{item.size}cm</div>
                        )}
                        {item.quantity && item.quantity > 1 && (
                          <div className="absolute top-1 right-1 bg-slate-700 text-xs px-1.5 rounded-full">
                            x{item.quantity}
                          </div>
                        )}
                        {item.rarity >= 3 && (
                          <div className="absolute -top-1 -left-1">
                            <Sparkles className={`w-4 h-4 ${item.rarity === 4 ? 'text-amber-400' : 'text-purple-400'}`} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayItems.map((item, idx) => {
                    const rarity = getRarityInfo(item.rarity);
                    return (
                      <button
                        key={item.id || idx}
                        onClick={() => setSelectedItem(item)}
                        className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-4 ${
                          selectedItem === item 
                            ? 'ring-2 ring-cyan-400 border-cyan-400' 
                            : `${rarity.border} ${rarity.bg}`
                        }`}
                      >
                        <span className="text-3xl">{item.icon || '🐟'}</span>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-slate-200">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {item.size && `${item.size}cm • `}
                            {item.points && `${item.points} pts • `}
                            {rarity.name}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedItem && (
            <div className="w-72 bg-slate-900/80 border-l border-cyan-500/20 p-4 flex flex-col">
              <div className="text-center mb-4">
                <span className="text-6xl block mb-2">{selectedItem.icon || '🐟'}</span>
                <h3 className="font-pixel text-lg text-cyan-100">{selectedItem.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityInfo(selectedItem.rarity).bg}`}>
                  {getRarityInfo(selectedItem.rarity).name}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                {selectedItem.size && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Size</span>
                    <span className="text-slate-200">{selectedItem.size} cm</span>
                  </div>
                )}
                {selectedItem.points && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Points</span>
                    <span className="text-slate-200">{selectedItem.points}</span>
                  </div>
                )}
                {selectedItem.caughtAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Caught</span>
                    <span className="text-slate-200">{new Date(selectedItem.caughtAt).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedItem.effect && (
                  <div className="bg-cyan-900/30 rounded-lg p-2 mt-2">
                    <div className="text-xs text-cyan-400 uppercase">Effect</div>
                    <div className="text-sm text-cyan-200">{selectedItem.effect}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-2">
                {activeTab === 'fish' && (
                  <button
                    onClick={() => handleSellFish(selectedItem)}
                    className="w-full py-3 bg-amber-600/50 hover:bg-amber-600 rounded-xl text-amber-100 font-bold flex items-center justify-center gap-2"
                  >
                    <Coins className="w-5 h-5" />
                    Sell for {Math.floor((selectedItem.points || 10) * 0.8)}g
                  </button>
                )}
                
                {(activeTab === 'lures' || activeTab === 'equipment') && (
                  <button
                    onClick={() => handleEquip(selectedItem)}
                    className="w-full py-3 bg-cyan-600/50 hover:bg-cyan-600 rounded-xl text-cyan-100 font-bold flex items-center justify-center gap-2"
                  >
                    <ArrowUpCircle className="w-5 h-5" />
                    Equip
                  </button>
                )}
                
                {(activeTab === 'potions' || activeTab === 'supplies') && (
                  <button
                    onClick={() => handleUseItem(selectedItem)}
                    className="w-full py-3 bg-green-600/50 hover:bg-green-600 rounded-xl text-green-100 font-bold flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Use
                  </button>
                )}

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="bg-slate-900 border-t border-cyan-500/20 p-3 flex justify-between items-center text-sm">
          <div className="text-slate-400">
            Showing {displayItems.length} items
          </div>
          <div className="text-slate-400">
            Capacity: {stats.totalItems || 0} / {tacklebox?.capacity || 10000}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTacklebox;
