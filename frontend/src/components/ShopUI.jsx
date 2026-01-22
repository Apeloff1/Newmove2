import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, ShoppingBag, Coins, Star, Lock, ChevronRight, Package, ArrowUpCircle, Sparkles, Anchor } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// SHOP INVENTORY DATA
// ============================================================================

export const SHOP_INVENTORY = {
  // Bait & Tackle Shop
  tackle_shop: {
    name: "Hooky McHookface's Bait Emporium",
    keeper: { name: "Hooky McHookface", portrait: '🪝', greeting: "FINEST HOOKS! Well, second finest. Third on Tuesdays. HOOKS!" },
    categories: {
      bait: [
        { id: 'worm_bait', name: 'Wiggly Worm Wad', price: 10, icon: '🪱', quantity: 10, description: 'Worms! They wiggle! Fish get confused and bite!', effect: 'Standard catch rate' },
        { id: 'shrimp_bait', name: 'Fancy Shrimp Surprise', price: 25, icon: '🦐', quantity: 10, description: 'Shrimp so fancy they wear tiny monocles.', effect: '+10% catch size' },
        { id: 'glow_bait', name: 'Radioactive Rave Bait', price: 50, icon: '✨', quantity: 5, description: 'Glows! May cause fish to develop disco moves.', effect: 'Required for deep fish' },
        { id: 'legendary_bait', name: 'Golden Unicorn Tears (Bait)', price: 200, icon: '🌟', quantity: 3, description: 'Not actually from unicorns. Probably.', effect: '+25% legendary chance', requiresLevel: 10 }
      ],
      lures: [
        { id: 'basic_lure', name: 'Spinny Thing', price: 50, icon: '🎯', description: 'It spins! Fish are easily impressed.', effect: 'Standard attraction' },
        { id: 'silver_lure', name: 'Disco Ball Jr.', price: 150, icon: '💿', description: 'Brings the party to the fish. They love parties.', effect: '+15% catch rate', requiresLevel: 5 },
        { id: 'golden_lure', name: 'The Hypno-Wiggler', price: 400, icon: '🥇', description: 'Wiggles hypnotically. Fish cant look away.', effect: '+25% catch rate', requiresLevel: 10 },
        { id: 'mermaid_lure', name: 'Smooch of the Sea', price: 1000, icon: '💋', description: 'Allegedly kissed by a mermaid. She denies it.', effect: '+50% rare chance', requiresLevel: 20, legendary: true }
      ],
      equipment: [
        { id: 'tackle_box_upgrade', name: 'Bigger Box of Stuff', price: 500, icon: '🧰', description: 'More space for more things you might not need!', effect: '+100 capacity', oneTime: true },
        { id: 'fish_finder', name: 'Fish Stalker 3000', price: 800, icon: '📡', description: 'Find fish before they find you looking for them.', effect: 'See fish before casting', requiresLevel: 15, oneTime: true },
        { id: 'auto_reeler', name: 'Lazy Fishers Friend', price: 1200, icon: '⚙️', description: 'For when reeling is too much work.', effect: '-20% tension buildup', requiresLevel: 25, oneTime: true }
      ]
    }
  },

  // Rod & Reel Shop
  rod_shop: {
    name: "Angry Ingrid's Hammer Hut",
    keeper: { name: "Angry Ingrid", portrait: '⚒️', greeting: "*CLANG* WHAT?! Oh, a customer. *CLANG* These rods won't break. Unlike YOUR SPIRIT if you keep staring." },
    categories: {
      rods: [
        { id: 'bamboo_rod', name: 'Bendy Bamboo Bonker', price: 100, icon: '🎋', stats: { power: 10, durability: 50, luck: 5 }, description: 'Flexible like your morals. Wait, I mean fishing.' },
        { id: 'oak_rod', name: 'Oaky McOakface', price: 300, icon: '🪵', stats: { power: 25, durability: 80, luck: 10 }, description: 'Sturdy. Reliable. Has a name.', requiresLevel: 5 },
        { id: 'steel_rod', name: 'The Overcompensator', price: 700, icon: '⚔️', stats: { power: 50, durability: 100, luck: 15 }, description: 'Big rod energy.', requiresLevel: 15 },
        { id: 'mithril_rod', name: 'Definitely Not Stolen Artifact', price: 2000, icon: '✨', stats: { power: 80, durability: 150, luck: 30 }, description: 'Found it. In a totally public place.', requiresLevel: 30, legendary: true },
        { id: 'legendary_rod', name: 'Captain Codswallops Legacy', price: 10000, icon: '👑', stats: { power: 100, durability: 200, luck: 50 }, description: 'THE rod. THE LEGENDARY ROD.', requiresLevel: 50, legendary: true, questRequired: 'main_story_complete' }
      ],
      upgrades: [
        { id: 'rod_reinforce', name: 'Tape and Hope', price: 200, icon: '🔧', description: 'Makes rod slightly less breakable.', effect: '+25 durability', consumable: true },
        { id: 'lucky_charm', name: 'Questionable Clover', price: 150, icon: '🍀', description: 'May or may not be lucky. No refunds.', effect: '+5% luck', consumable: true },
        { id: 'power_grip', name: 'Power Grip', price: 300, icon: '💪', description: '+10 power to current rod.', effect: '+10 power', consumable: true, requiresLevel: 10 }
      ]
    }
  },

  // Potion & Magic Shop  
  magic_shop: {
    name: "Madame Mystique's Emporium",
    keeper: { name: "Madame Mystique", portrait: '🔮', greeting: "I foresaw your arrival... and your empty wallet. Let's fix that." },
    categories: {
      potions: [
        { id: 'luck_potion', name: 'Liquid Luck', price: 100, icon: '🍀', duration: '5 min', description: '+20% luck for 5 minutes.', effect: '+20% luck' },
        { id: 'speed_potion', name: 'Quicksilver Tonic', price: 100, icon: '⚡', duration: '5 min', description: '+30% reel speed.', effect: '+30% reel speed' },
        { id: 'calm_potion', name: 'Calm Waters', price: 150, icon: '🌊', duration: '10 min', description: 'Reduces fish aggression.', effect: '-25% tension', requiresLevel: 10 },
        { id: 'sight_potion', name: 'Eagle Eye', price: 200, icon: '👁️', duration: '10 min', description: 'See rare fish locations.', effect: 'Highlights rare fish', requiresLevel: 15 }
      ],
      enchantments: [
        { id: 'water_breathing', name: 'Water Breathing Charm', price: 500, icon: '💨', description: 'Fish longer in deep areas.', effect: 'No oxygen limit', oneTime: true, requiresLevel: 20 },
        { id: 'fish_whisper', name: 'Fish Whisper Enchant', price: 800, icon: '🐟', description: 'Understand what fish want.', effect: 'Shows preferred bait', oneTime: true, requiresLevel: 25 },
        { id: 'storm_ward', name: 'Storm Ward', price: 1000, icon: '⛈️', description: 'Protection during storms.', effect: 'Fish safely in storms', oneTime: true, requiresLevel: 30 }
      ]
    }
  },

  // General Store
  general_store: {
    name: "Marina's Mercantile",
    keeper: { name: "Marina Goldscale", portrait: '🏪', greeting: "Everything a fisher needs, and some things they don't!" },
    categories: {
      supplies: [
        { id: 'repair_kit', name: 'Repair Kit', price: 50, icon: '🔧', description: 'Repair rod durability.', effect: 'Full durability restore', consumable: true },
        { id: 'cooler_box', name: 'Cooler Box', price: 100, icon: '🧊', description: 'Keeps fish fresh longer.', effect: '+10% fish value', oneTime: true },
        { id: 'fish_scale', name: 'Accurate Fish Scale', price: 200, icon: '⚖️', description: 'Know exact fish weight.', effect: 'Shows fish stats', oneTime: true }
      ],
      consumables: [
        { id: 'sandwich', name: 'Fisher\'s Sandwich', price: 15, icon: '🥪', description: 'Restores energy.', effect: 'Restore stamina', consumable: true },
        { id: 'coffee', name: 'Strong Coffee', price: 20, icon: '☕', description: '+10% alertness.', effect: '+10% reaction speed', consumable: true },
        { id: 'rum', name: 'Captain\'s Rum', price: 50, icon: '🍾', description: '+15% luck, -10% precision.', effect: 'Luck boost, accuracy drop', consumable: true }
      ],
      special: [
        { id: 'treasure_map', name: 'Mystery Map', price: 500, icon: '🗺️', description: 'Leads to hidden treasure.', effect: 'Unlocks secret area', oneTime: true, requiresLevel: 15 },
        { id: 'fishing_net', name: 'Basic Fishing Net', price: 1000, icon: '🕸️', description: 'Catch multiple fish at once!', effect: 'Multi-catch ability', oneTime: true, requiresLevel: 20 },
        { id: 'boat_ticket', name: 'Boat Ticket', price: 200, icon: '🎫', description: 'Access offshore fishing.', effect: 'Unlock boat fishing', oneTime: true, requiresLevel: 10 }
      ]
    }
  }
};

// ============================================================================
// SHOP UI COMPONENT
// ============================================================================

export const ShopUI = ({ shopId, onClose }) => {
  const { character, addCharacterGold, updateCharacter } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const shop = SHOP_INVENTORY[shopId];
  if (!shop) return null;

  const playerGold = character?.gold || 0;
  const playerLevel = character?.level || 1;
  const playerInventory = character?.inventory || [];

  // Get categories
  const categories = Object.entries(shop.categories);
  const activeCategory = selectedCategory || categories[0]?.[0];
  const items = shop.categories[activeCategory] || [];

  // Check if item can be purchased
  const canPurchase = (item) => {
    if (item.requiresLevel && playerLevel < item.requiresLevel) return false;
    if (item.oneTime && playerInventory.some(i => i.id === item.id)) return false;
    if (item.questRequired) return false; // TODO: Check quest completion
    return playerGold >= item.price * quantity;
  };

  // Get lock reason
  const getLockReason = (item) => {
    if (item.requiresLevel && playerLevel < item.requiresLevel) return `Requires Level ${item.requiresLevel}`;
    if (item.oneTime && playerInventory.some(i => i.id === item.id)) return 'Already owned';
    if (item.questRequired) return 'Quest required';
    if (playerGold < item.price) return 'Not enough gold';
    return null;
  };

  // Handle purchase
  const handlePurchase = () => {
    if (!selectedItem || !canPurchase(selectedItem)) return;

    const totalCost = selectedItem.price * quantity;
    
    // Deduct gold
    addCharacterGold(-totalCost);

    // Add item(s) to inventory
    const newInventory = [...playerInventory];
    for (let i = 0; i < quantity; i++) {
      newInventory.push({
        id: selectedItem.id,
        name: selectedItem.name,
        icon: selectedItem.icon,
        type: activeCategory,
        effect: selectedItem.effect,
        quantity: selectedItem.quantity || 1,
        purchasedAt: Date.now()
      });
    }
    updateCharacter({ inventory: newInventory });

    toast.success(`Purchased ${quantity}x ${selectedItem.name}!`, { icon: selectedItem.icon });
    
    setSelectedItem(null);
    setQuantity(1);
    setShowConfirm(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      data-testid="shop-ui"
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-amber-950 to-amber-900 rounded-3xl border-4 border-amber-600/50 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-700 p-4 flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{shop.keeper.portrait}</span>
            <div>
              <h2 className="font-pixel text-xl text-amber-100">{shop.name}</h2>
              <p className="text-amber-300/70 text-sm">{shop.keeper.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-900/50 px-4 py-2 rounded-full border border-amber-500/50">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-amber-200">{playerGold}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-red-600/50 hover:bg-red-600 rounded-full transition-colors"
              data-testid="close-shop-btn"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Shopkeeper Greeting */}
        <div className="bg-amber-950/50 p-3 border-b border-amber-700/50">
          <p className="text-amber-200/80 text-sm italic text-center">"{shop.keeper.greeting}"</p>
        </div>

        <div className="flex h-[calc(90vh-180px)]">
          {/* Categories Sidebar */}
          <div className="w-48 bg-amber-950/50 border-r border-amber-700/30 p-2 overflow-y-auto">
            {categories.map(([key, items]) => (
              <button
                key={key}
                onClick={() => { setSelectedCategory(key); setSelectedItem(null); }}
                className={`w-full p-3 rounded-xl mb-2 text-left transition-all ${
                  activeCategory === key 
                    ? 'bg-amber-600 text-amber-100' 
                    : 'bg-amber-900/30 text-amber-300 hover:bg-amber-900/50'
                }`}
                data-testid={`shop-category-${key}`}
              >
                <div className="font-bold capitalize">{key}</div>
                <div className="text-xs opacity-70">{items.length} items</div>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {items.map(item => {
                const lockReason = getLockReason(item);
                const isLocked = !!lockReason && lockReason !== 'Not enough gold';
                const cantAfford = playerGold < item.price;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => !isLocked && setSelectedItem(item)}
                    disabled={isLocked}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      selectedItem?.id === item.id
                        ? 'border-amber-400 bg-amber-800/50 ring-2 ring-amber-400/50'
                        : isLocked
                          ? 'border-gray-600 bg-gray-900/50 opacity-50 cursor-not-allowed'
                          : cantAfford
                            ? 'border-red-900/50 bg-amber-900/30 hover:bg-amber-900/50'
                            : 'border-amber-700/50 bg-amber-900/30 hover:bg-amber-900/50 hover:border-amber-600'
                    }`}
                    data-testid={`shop-item-${item.id}`}
                  >
                    {item.legendary && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-900" />
                      </div>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="text-center">
                          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <span className="text-xs text-gray-400">{lockReason}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-amber-100 truncate">{item.name}</div>
                        <div className="text-xs text-amber-300/60 line-clamp-2">{item.description}</div>
                        {item.stats && (
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-amber-600/30 px-1.5 py-0.5 rounded">⚔️{item.stats.power}</span>
                            <span className="text-[10px] bg-amber-600/30 px-1.5 py-0.5 rounded">🛡️{item.stats.durability}</span>
                            <span className="text-[10px] bg-amber-600/30 px-1.5 py-0.5 rounded">🍀{item.stats.luck}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-700/30">
                      <div className={`flex items-center gap-1 font-bold ${cantAfford ? 'text-red-400' : 'text-amber-400'}`}>
                        <Coins className="w-4 h-4" />
                        {item.price}
                      </div>
                      {item.quantity && (
                        <span className="text-xs text-amber-400/60">x{item.quantity}</span>
                      )}
                      {item.requiresLevel && (
                        <span className="text-xs text-amber-500/80">Lvl {item.requiresLevel}+</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Detail Panel */}
          {selectedItem && (
            <div className="w-72 bg-amber-950/80 border-l border-amber-700/30 p-4 flex flex-col">
              <div className="text-center mb-4">
                <span className="text-6xl block mb-2">{selectedItem.icon}</span>
                <h3 className="font-pixel text-lg text-amber-100">{selectedItem.name}</h3>
                {selectedItem.legendary && (
                  <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">
                    ✨ Legendary
                  </span>
                )}
              </div>

              <p className="text-amber-200/80 text-sm mb-4">{selectedItem.description}</p>

              {selectedItem.effect && (
                <div className="bg-amber-900/50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">Effect</div>
                  <div className="text-amber-200">{selectedItem.effect}</div>
                </div>
              )}

              {selectedItem.stats && (
                <div className="bg-amber-900/50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">Stats</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-300">⚔️ Power</span>
                      <span className="text-amber-100">{selectedItem.stats.power}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-300">🛡️ Durability</span>
                      <span className="text-amber-100">{selectedItem.stats.durability}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-300">🍀 Luck</span>
                      <span className="text-amber-100">{selectedItem.stats.luck}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.duration && (
                <div className="text-sm text-amber-400/70 mb-4">
                  Duration: {selectedItem.duration}
                </div>
              )}

              {/* Quantity selector */}
              {!selectedItem.oneTime && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-amber-700 hover:bg-amber-600 rounded-lg font-bold text-amber-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-amber-100 text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="w-10 h-10 bg-amber-700 hover:bg-amber-600 rounded-lg font-bold text-amber-100"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Total price */}
              <div className="bg-amber-900 rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300">Total:</span>
                  <span className={`text-xl font-bold flex items-center gap-1 ${
                    playerGold >= selectedItem.price * quantity ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    <Coins className="w-5 h-5" />
                    {selectedItem.price * quantity}
                  </span>
                </div>
              </div>

              {/* Purchase button */}
              <button
                onClick={handlePurchase}
                disabled={!canPurchase(selectedItem)}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  canPurchase(selectedItem)
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="purchase-btn"
              >
                <ShoppingBag className="w-5 h-5" />
                {canPurchase(selectedItem) ? 'Purchase' : getLockReason(selectedItem) || 'Cannot Purchase'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUICK SHOP BUTTON (For use in-game)
// ============================================================================

export const QuickShopButton = ({ shopId, onOpen }) => {
  const shop = SHOP_INVENTORY[shopId];
  if (!shop) return null;

  return (
    <button
      onClick={() => onOpen(shopId)}
      className="flex items-center gap-2 px-4 py-2 bg-amber-700/50 hover:bg-amber-700 rounded-xl text-amber-200 transition-all border border-amber-600/50"
      data-testid={`quick-shop-${shopId}`}
    >
      <span className="text-xl">{shop.keeper.portrait}</span>
      <span className="font-bold">{shop.name.split(' ')[0]}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
};

export default ShopUI;
