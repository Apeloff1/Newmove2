import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAdventure } from '../context/AdventureContext';
import { INTEGRATED_LOCATIONS, LOCATION_CATEGORIES, STORE_INVENTORIES, SHOP_NPCS } from '../lib/openWorldIntegration';
import { CHARACTER_GENDERS, getCharacterTitle } from '../lib/characterSystem';
import { 
  X, MapPin, Store, Coins, ShoppingBag, ChevronRight, 
  Package, Sparkles, Lock, Info, ArrowLeft, Check 
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * STORE INTERFACE COMPONENT
 * Buy and sell items at various shops in the open world
 */

export const StoreInterface = ({ locationId, onClose }) => {
  const { character, addCharacterGold, updateCharacter } = useGameStore();
  const location = INTEGRATED_LOCATIONS[locationId];
  const storeData = STORE_INVENTORIES[locationId] || STORE_INVENTORIES[location?.gameMode];
  const npcData = SHOP_NPCS[location?.npc];
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab, setTab] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [showNpcDialogue, setShowNpcDialogue] = useState(true);
  
  const playerGold = character?.gold || 0;
  const playerInventory = character?.inventory || [];
  
  // Calculate total price
  const totalPrice = selectedItem ? selectedItem.price * quantity : 0;
  const canAfford = playerGold >= totalPrice;
  
  // Handle purchase
  const handleBuy = () => {
    if (!selectedItem || !canAfford) return;
    
    // Deduct gold
    addCharacterGold(-totalPrice);
    
    // Add item to inventory (simplified - just track by id)
    const newInventory = [...playerInventory];
    const itemQty = selectedItem.quantity || 1;
    for (let i = 0; i < quantity * itemQty; i++) {
      newInventory.push({ 
        id: selectedItem.id, 
        name: selectedItem.name,
        icon: selectedItem.icon,
        purchasedAt: Date.now()
      });
    }
    updateCharacter({ inventory: newInventory });
    
    toast.success(`Purchased ${quantity}x ${selectedItem.name}!`, {
      icon: selectedItem.icon
    });
    
    setSelectedItem(null);
    setQuantity(1);
  };
  
  // Handle selling fish/items
  const handleSell = (item) => {
    const sellPrice = Math.floor((item.value || 10) * (storeData?.sellMultiplier || 0.5));
    addCharacterGold(sellPrice);
    
    // Remove from inventory
    const newInventory = playerInventory.filter((inv, idx) => {
      if (inv.id === item.id) {
        return idx !== playerInventory.findIndex(i => i.id === item.id);
      }
      return true;
    });
    updateCharacter({ inventory: newInventory });
    
    toast.success(`Sold ${item.name} for ${sellPrice}g!`, {
      icon: '💰'
    });
  };
  
  if (!location || !storeData) {
    return (
      <div className="store-interface-backdrop" onClick={onClose}>
        <div className="store-interface" onClick={e => e.stopPropagation()}>
          <p className="text-white text-center">Store not available yet!</p>
          <button onClick={onClose} className="adventure-btn-secondary mt-4 w-full">Close</button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      data-testid="store-interface"
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-b from-amber-900/95 to-stone-900/95 border-2 border-gold/40 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Store Header */}
        <div className="p-4 border-b border-gold/30 bg-black/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{location.icon}</span>
              <div>
                <h2 className="font-pixel text-xl text-gold">{storeData.name}</h2>
                <p className="text-amber-200/60 text-sm">{location.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Player Gold */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 rounded-full">
              <Coins className="w-5 h-5 text-gold" />
              <span className="font-bold text-gold">{playerGold}g</span>
            </div>
            {storeData.specialFeature && (
              <div className="text-xs text-amber-300/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {storeData.specialFeature}
              </div>
            )}
          </div>
        </div>
        
        {/* NPC Greeting */}
        {showNpcDialogue && npcData && (
          <div className="p-3 bg-amber-950/50 border-b border-gold/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{location.icon}</span>
              <div className="flex-1">
                <p className="text-amber-100 text-sm italic">"{npcData.greeting}"</p>
                <button 
                  onClick={() => setShowNpcDialogue(false)}
                  className="text-xs text-amber-300/50 hover:text-amber-300 mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gold/20">
          <button
            onClick={() => setTab('buy')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              tab === 'buy' 
                ? 'bg-gold/20 text-gold border-b-2 border-gold' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Buy
          </button>
          <button
            onClick={() => setTab('sell')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              tab === 'sell' 
                ? 'bg-gold/20 text-gold border-b-2 border-gold' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            Sell
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {tab === 'buy' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {storeData.buyItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItem(item); setQuantity(1); }}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedItem?.id === item.id
                      ? 'bg-gold/20 border-gold'
                      : 'bg-black/30 border-white/10 hover:border-white/30'
                  } ${playerGold < item.price ? 'opacity-60' : ''}`}
                  data-testid={`buy-item-${item.id}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm truncate">{item.name}</div>
                      <div className="text-xs text-white/50 truncate">{item.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-bold ${
                          playerGold >= item.price ? 'text-gold' : 'text-red-400'
                        }`}>
                          💰 {item.price}g
                        </span>
                        {item.quantity && (
                          <span className="text-xs text-white/40">x{item.quantity}</span>
                        )}
                      </div>
                    </div>
                    {playerGold < item.price && (
                      <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {tab === 'sell' && (
            <div className="space-y-2">
              {playerInventory.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items to sell</p>
                  <p className="text-xs mt-1">Catch some fish or find items to sell!</p>
                </div>
              ) : (
                playerInventory.slice(0, 20).map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`}
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/10"
                  >
                    <span className="text-2xl">{item.icon || '📦'}</span>
                    <div className="flex-1">
                      <div className="text-white text-sm font-bold">{item.name}</div>
                      <div className="text-xs text-white/50">
                        Sell for: {Math.floor((item.value || 10) * (storeData?.sellMultiplier || 0.5))}g
                      </div>
                    </div>
                    <button
                      onClick={() => handleSell(item)}
                      className="px-3 py-1.5 bg-green-600/50 hover:bg-green-600 rounded-lg text-white text-sm font-bold transition-colors"
                    >
                      Sell
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Purchase Panel */}
        {selectedItem && tab === 'buy' && (
          <div className="p-4 border-t border-gold/30 bg-black/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedItem.icon}</span>
                <div>
                  <div className="font-bold text-white">{selectedItem.name}</div>
                  <div className="text-gold text-sm">💰 {selectedItem.price}g each</div>
                </div>
              </div>
              
              {/* Quantity selector */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-white font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={handleBuy}
              disabled={!canAfford}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                canAfford
                  ? 'bg-gradient-to-r from-gold to-amber-500 text-black hover:from-gold/90 hover:to-amber-400'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              data-testid="confirm-purchase-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {canAfford ? `Buy for ${totalPrice}g` : `Need ${totalPrice - playerGold}g more`}
            </button>
          </div>
        )}
        
        {/* NPC Farewell */}
        {npcData && (
          <div className="p-3 border-t border-gold/20 text-center">
            <p className="text-amber-200/40 text-xs italic">"{npcData.farewell}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * OPEN WORLD HUB COMPONENT
 * The main map showing all integrated game locations
 */

export const OpenWorldHub = ({ onOpenLocation, onClose }) => {
  const { character } = useGameStore();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showStore, setShowStore] = useState(null);
  
  const playerLevel = character?.level || 1;
  const genderData = character ? CHARACTER_GENDERS[character.gender] : null;
  
  // Check if location is unlocked
  const isLocationUnlocked = (location) => {
    if (!location.unlocked) return false;
    if (location.requiresLevel && playerLevel < location.requiresLevel) return false;
    return true;
  };
  
  const handleLocationClick = (locationId) => {
    const location = INTEGRATED_LOCATIONS[locationId];
    if (!isLocationUnlocked(location)) {
      toast.error(`Requires Level ${location.requiresLevel}!`);
      return;
    }
    setSelectedLocation(location);
  };
  
  const handleEnterLocation = () => {
    if (!selectedLocation) return;
    
    // Check if this is a store location
    if (STORE_INVENTORIES[selectedLocation.id] || STORE_INVENTORIES[selectedLocation.gameMode]) {
      setShowStore(selectedLocation.id);
    } else {
      // Open the game mode
      onOpenLocation(selectedLocation.gameMode);
    }
  };
  
  // Store interface
  if (showStore) {
    return <StoreInterface locationId={showStore} onClose={() => setShowStore(null)} />;
  }
  
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a3a5c 0%, #0a1628 100%)' }}
      data-testid="open-world-hub"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-black/30 border-b border-gold/20">
        <div className="flex items-center gap-3">
          {character && genderData && (
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/50">
              <span className="text-xl">{genderData.portraits[character.appearance?.portrait || 0]}</span>
            </div>
          )}
          <div>
            <h1 className="font-pixel text-lg text-gold">Port Fortune</h1>
            <p className="text-xs text-white/60">Explore the open world</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gold/20 rounded-full">
            <span className="text-gold font-bold">💰 {character?.gold || 0}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 p-3 bg-black/20 border-b border-white/10">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            !selectedCategory ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All Locations
        </button>
        {Object.entries(LOCATION_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-colors ${
              selectedCategory === key ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* Locations Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(INTEGRATED_LOCATIONS)
            .filter(([id, loc]) => !selectedCategory || LOCATION_CATEGORIES[selectedCategory]?.locations.includes(id))
            .map(([id, location]) => {
              const unlocked = isLocationUnlocked(location);
              const isSelected = selectedLocation?.id === id;
              
              return (
                <button
                  key={id}
                  onClick={() => handleLocationClick(id)}
                  disabled={!unlocked}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-gold/20 border-gold scale-105 shadow-lg shadow-gold/20'
                      : unlocked
                        ? 'bg-black/40 border-white/20 hover:border-white/40 hover:bg-black/60'
                        : 'bg-black/20 border-white/10 opacity-50 cursor-not-allowed'
                  }`}
                  data-testid={`location-${id}`}
                >
                  <div className="text-3xl mb-2">{location.icon}</div>
                  <div className="font-bold text-white text-sm truncate">{location.name}</div>
                  <div className="text-xs text-white/50 truncate mt-1">{location.description}</div>
                  
                  {!unlocked && location.requiresLevel && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                      <Lock className="w-3 h-3" />
                      Lvl {location.requiresLevel}
                    </div>
                  )}
                  
                  {unlocked && STORE_INVENTORIES[id] && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                      <Store className="w-3 h-3" />
                      Shop
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </div>
      
      {/* Selected Location Panel */}
      {selectedLocation && (
        <div className="p-4 bg-black/60 border-t border-gold/30 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{selectedLocation.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-pixel text-xl text-gold">{selectedLocation.name}</h3>
              <p className="text-white/70 text-sm mt-1">{selectedLocation.lore}</p>
              
              {/* Activities */}
              {selectedLocation.activities && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedLocation.activities.map(activity => (
                    <span 
                      key={activity}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                    >
                      {activity.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleEnterLocation}
            className="w-full mt-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-black font-bold rounded-xl flex items-center justify-center gap-2"
            data-testid="enter-location-btn"
          >
            <MapPin className="w-5 h-5" />
            {STORE_INVENTORIES[selectedLocation.id] ? 'Enter Shop' : 'Enter Location'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OpenWorldHub;
