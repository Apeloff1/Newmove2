import React, { useState } from 'react';
import { useAdventure } from '../context/AdventureContext';
import { X, Trash2, Info, Star, Sparkles, Gem, Crown } from 'lucide-react';

// ============================================================================
// INVENTORY PANEL - Item Management
// ============================================================================

export const InventoryPanel = ({ onClose }) => {
  const { 
    getInventoryItems, 
    removeItem, 
    gold 
  } = useAdventure();

  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const items = getInventoryItems();

  // Filter items
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  // Get rarity color
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-900/50';
      case 'uncommon': return 'border-green-400 bg-green-900/30';
      case 'rare': return 'border-blue-400 bg-blue-900/30';
      case 'epic': return 'border-purple-400 bg-purple-900/30';
      case 'legendary': return 'border-amber-400 bg-amber-900/30 animate-pulse';
      default: return 'border-gray-400 bg-gray-900/50';
    }
  };

  // Get rarity icon
  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'uncommon': return <Star className="w-3 h-3 text-green-400" />;
      case 'rare': return <Sparkles className="w-3 h-3 text-blue-400" />;
      case 'epic': return <Gem className="w-3 h-3 text-purple-400" />;
      case 'legendary': return <Crown className="w-3 h-3 text-amber-400" />;
      default: return null;
    }
  };

  return (
    <div 
      className="adventure-modal-backdrop"
      onClick={onClose}
      data-testid="inventory-panel"
    >
      <div 
        className="inventory-panel animate-scale-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="inventory-header">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎒</span>
            <h2 className="font-pixel text-2xl text-gold">Inventory</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-900/50 px-3 py-1 rounded-full">
              <span className="text-xl">💰</span>
              <span className="font-bold text-gold">{gold}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              data-testid="close-inventory-btn"
            >
              <X className="w-6 h-6 text-amber-200" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="inventory-filters">
          {['all', 'quest', 'crafting', 'treasure', 'consumable', 'misc'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`inventory-filter-btn ${filter === type ? 'active' : ''}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="inventory-grid">
          {filteredItems.length === 0 ? (
            <div className="col-span-4 text-center py-12 text-amber-200/60">
              <span className="text-4xl mb-4 block">📦</span>
              <p>No items found</p>
              <p className="text-sm mt-2">Explore the world to find treasures!</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => setSelectedItem(item)}
                className={`inventory-slot ${getRarityColor(item.rarity)} ${
                  selectedItem?.id === item.id ? 'ring-2 ring-gold' : ''
                }`}
                data-testid={`inventory-item-${item.id}`}
              >
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-xs text-center truncate w-full text-amber-200">
                  {item.name}
                </div>
                {getRarityIcon(item.rarity) && (
                  <div className="absolute top-1 right-1">
                    {getRarityIcon(item.rarity)}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Selected item details */}
        {selectedItem && (
          <div className="inventory-details animate-slide-up">
            <div className="flex items-start gap-4">
              <div className={`inventory-detail-icon ${getRarityColor(selectedItem.rarity)}`}>
                <span className="text-4xl">{selectedItem.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-pixel text-lg text-gold">{selectedItem.name}</h3>
                  {getRarityIcon(selectedItem.rarity)}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedItem.rarity === 'legendary' ? 'bg-amber-500/30 text-amber-300' :
                    selectedItem.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300' :
                    selectedItem.rarity === 'rare' ? 'bg-blue-500/30 text-blue-300' :
                    selectedItem.rarity === 'uncommon' ? 'bg-green-500/30 text-green-300' :
                    'bg-gray-500/30 text-gray-300'
                  }`}>
                    {selectedItem.rarity}
                  </span>
                </div>
                <p className="text-sm text-amber-100/80 mb-3">
                  {selectedItem.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-200/60">
                  <span className="px-2 py-1 bg-black/30 rounded">
                    Type: {selectedItem.type}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {selectedItem.type === 'consumable' && (
                <button className="flex-1 py-2 bg-green-600/50 hover:bg-green-600 rounded-lg text-white flex items-center justify-center gap-2 transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Use
                </button>
              )}
              {selectedItem.type === 'junk' && (
                <button 
                  onClick={() => {
                    removeItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-2 bg-red-600/50 hover:bg-red-600 rounded-lg text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Discard
                </button>
              )}
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-black/30 hover:bg-black/50 rounded-lg text-amber-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Capacity indicator */}
        <div className="inventory-capacity">
          <div className="text-sm text-amber-200/60">
            {items.length} / 50 items
          </div>
          <div className="w-32 h-2 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-gold"
              style={{ width: `${(items.length / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
