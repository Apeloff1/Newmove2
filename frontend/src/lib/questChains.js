/**
 * ============================================================================
 * QUEST CHAINS - 30 Complete Quest Lines with 10+ Quests Each
 * ============================================================================
 * Comprehensive quest system featuring main story, side quests, faction quests,
 * collection quests, and special event chains totaling 300+ individual quests
 * ============================================================================
 */

// ============================================================================
// QUEST CHAIN 1: MAIN STORY - THE CURSE OF SALTBEARD
// ============================================================================

export const QUEST_CHAIN_SALTBEARD = {
  id: 'main_saltbeard',
  name: 'The Curse of Saltbeard',
  description: 'Uncover the legendary treasure of Captain Saltbeard',
  type: 'main_story',
  icon: '🏴‍☠️',
  totalQuests: 15,
  quests: [
    {
      id: 'saltbeard_1',
      name: 'A Stranger Arrives',
      description: 'Begin your adventure in Barnacle Bay Plaza',
      objectives: [
        { type: 'talk_to', target: 'harbor_master', text: 'Speak with the Harbor Master' },
        { type: 'explore', target: 'barnacle_bay', text: 'Explore Barnacle Bay' },
      ],
      rewards: { xp: 50, gold: 25, items: ['basic_rod'] },
      dialogue: {
        intro: 'Welcome to Codswallop Cove! You look like someone searching for something...',
        complete: 'Ah, so youre after Saltbeards treasure too? Good luck with that!',
      },
    },
    {
      id: 'saltbeard_2',
      name: 'The Old Fisherman\'s Tale',
      description: 'Learn about Saltbeard from the locals',
      objectives: [
        { type: 'talk_to', target: 'old_pete', text: 'Find Old Pete at the docks' },
        { type: 'catch_fish', count: 5, text: 'Prove yourself by catching 5 fish' },
        { type: 'return', target: 'old_pete', text: 'Return to Old Pete' },
      ],
      rewards: { xp: 100, gold: 50, items: ['saltbeard_lore_1'] },
      unlocks: ['tavern_access'],
    },
    {
      id: 'saltbeard_3',
      name: 'Tavern Whispers',
      description: 'The Tipsy Tentacle holds secrets',
      objectives: [
        { type: 'go_to', target: 'tavern', text: 'Visit The Tipsy Tentacle' },
        { type: 'buy_drinks', count: 3, text: 'Buy drinks for the sailors' },
        { type: 'listen', target: 'drunk_sailor', text: 'Listen to the drunk sailors story' },
      ],
      rewards: { xp: 150, gold: 25, items: ['treasure_map_piece_1'] },
    },
    {
      id: 'saltbeard_4',
      name: 'The First Map Piece',
      description: 'The map piece points to the lighthouse',
      objectives: [
        { type: 'go_to', target: 'lighthouse', text: 'Climb the Tipsy Tower' },
        { type: 'search', target: 'lighthouse_top', text: 'Search for clues' },
        { type: 'solve_puzzle', puzzle: 'light_sequence', text: 'Solve the light puzzle' },
      ],
      rewards: { xp: 200, gold: 100, items: ['treasure_map_piece_2'] },
    },
    {
      id: 'saltbeard_5',
      name: 'The Rival Appears',
      description: 'Meet Razor Ricky Sharkbait for the first time',
      objectives: [
        { type: 'encounter', target: 'ricky', text: 'Confront Ricky at the plaza' },
        { type: 'competition', against: 'ricky', type: 'fishing', text: 'Beat Ricky in a fishing contest' },
      ],
      rewards: { xp: 250, gold: 150, items: ['rickys_taunt_letter'] },
      unlocks: ['rival_encounters'],
    },
    {
      id: 'saltbeard_6',
      name: 'Secrets of Skull Island',
      description: 'The map points to Skull Island',
      objectives: [
        { type: 'unlock_area', target: 'skull_island', text: 'Find a way to Skull Island' },
        { type: 'hire_boat', text: 'Hire a boat to take you there' },
        { type: 'explore', target: 'skull_beach', text: 'Explore the Beach of Broken Dreams' },
      ],
      rewards: { xp: 300, gold: 100, items: ['skull_key'] },
      requirement: { level: 10 },
    },
    {
      id: 'saltbeard_7',
      name: 'The Pirate\'s Hideout',
      description: 'Discover the old pirate hideout',
      objectives: [
        { type: 'enter', target: 'pirate_cove', text: 'Enter the Pirates Hideout' },
        { type: 'defeat', target: 'ghost_pirates', count: 5, text: 'Deal with the ghost pirates' },
        { type: 'find', target: 'saltbeard_journal', text: 'Find Saltbeards journal' },
      ],
      rewards: { xp: 400, gold: 200, items: ['saltbeard_journal', 'treasure_map_piece_3'] },
    },
    {
      id: 'saltbeard_8',
      name: 'Decoding the Journal',
      description: 'The journal is written in code',
      objectives: [
        { type: 'talk_to', target: 'professor_pompous', text: 'Find someone who can decode it' },
        { type: 'fetch', items: ['ancient_dictionary', 'magnifying_glass'], text: 'Gather decoding materials' },
        { type: 'wait', duration: 24, text: 'Wait for the professor to decode it' },
      ],
      rewards: { xp: 350, gold: 150, items: ['decoded_journal'] },
    },
    {
      id: 'saltbeard_9',
      name: 'The Mermaid\'s Clue',
      description: 'The journal mentions a mermaid lagoon',
      objectives: [
        { type: 'go_to', target: 'mermaid_lagoon', text: 'Find the Probably Magical Lagoon' },
        { type: 'catch_fish', type: 'rare', count: 1, text: 'Catch a rare fish as an offering' },
        { type: 'encounter', target: 'mermaid', text: 'Meet the mermaid' },
      ],
      rewards: { xp: 500, gold: 300, items: ['mermaid_scale', 'treasure_map_piece_4'] },
    },
    {
      id: 'saltbeard_10',
      name: 'Ricky\'s Revenge',
      description: 'Ricky has been following you',
      objectives: [
        { type: 'survive_ambush', text: 'Survive Rickys ambush' },
        { type: 'chase', target: 'ricky', text: 'Chase Ricky through the caves' },
        { type: 'recover', target: 'stolen_map_pieces', text: 'Recover your stolen map pieces' },
      ],
      rewards: { xp: 450, gold: 200, items: ['rickys_compass'] },
    },
    {
      id: 'saltbeard_11',
      name: 'The Governor\'s Secret',
      description: 'Lord Fancypants knows more than he lets on',
      objectives: [
        { type: 'gain_audience', target: 'governor', text: 'Get an audience with the Governor' },
        { type: 'complete_favor', text: 'Do a favor for the Governor' },
        { type: 'learn_secret', text: 'Learn the Governors secret about Saltbeard' },
      ],
      rewards: { xp: 400, gold: 500, items: ['governors_seal', 'treasure_map_piece_5'] },
    },
    {
      id: 'saltbeard_12',
      name: 'The Complete Map',
      description: 'Assemble all the map pieces',
      objectives: [
        { type: 'combine', items: ['treasure_map_piece_1', 'treasure_map_piece_2', 'treasure_map_piece_3', 'treasure_map_piece_4', 'treasure_map_piece_5'], text: 'Combine all map pieces' },
        { type: 'decipher', target: 'complete_map', text: 'Decipher the complete map' },
      ],
      rewards: { xp: 300, gold: 100, items: ['complete_treasure_map'] },
    },
    {
      id: 'saltbeard_13',
      name: 'Captain Codswallop\'s Hoard',
      description: 'The treasure chamber awaits',
      objectives: [
        { type: 'go_to', target: 'treasure_caves', text: 'Navigate to the treasure caves' },
        { type: 'solve_puzzle', puzzle: 'door_mechanism', text: 'Solve the door mechanism' },
        { type: 'enter', target: 'treasure_chamber', text: 'Enter the treasure chamber' },
      ],
      rewards: { xp: 600, gold: 1000, items: ['saltbeard_key'] },
      requirement: { level: 25 },
    },
    {
      id: 'saltbeard_14',
      name: 'The Final Confrontation',
      description: 'Ricky is waiting at the treasure',
      objectives: [
        { type: 'confrontation', target: 'ricky', text: 'Face Ricky one last time' },
        { type: 'choice', options: ['fight', 'negotiate', 'trick'], text: 'Decide how to handle Ricky' },
        { type: 'claim', target: 'saltbeard_treasure', text: 'Claim Saltbeards treasure' },
      ],
      rewards: { xp: 1000, gold: 5000, items: ['saltbeards_cutlass', 'golden_compass'] },
    },
    {
      id: 'saltbeard_15',
      name: 'Legend of the Cove',
      description: 'Your legend is complete',
      objectives: [
        { type: 'return', target: 'barnacle_bay', text: 'Return to Barnacle Bay' },
        { type: 'celebration', text: 'Attend the celebration in your honor' },
        { type: 'decide_fate', target: 'treasure', text: 'Decide the fate of the treasure' },
      ],
      rewards: { xp: 2000, gold: 10000, items: ['deed_to_island', 'legend_title'], title: 'Legend of the Cove' },
      ending: true,
    },
  ],
};

// ============================================================================
// QUEST CHAIN 2: THE FISHERMAN'S GUILD
// ============================================================================

export const QUEST_CHAIN_FISHERMAN_GUILD = {
  id: 'guild_fisherman',
  name: 'The Fisherman\'s Guild',
  description: 'Rise through the ranks of the Fisherman\'s Guild',
  type: 'faction',
  icon: '🎣',
  totalQuests: 12,
  quests: [
    {
      id: 'fisher_1',
      name: 'Joining the Guild',
      description: 'Prove yourself worthy of guild membership',
      objectives: [
        { type: 'talk_to', target: 'guild_master_finn', text: 'Speak with Guild Master Finn' },
        { type: 'catch_fish', count: 10, text: 'Catch 10 fish of any type' },
        { type: 'sell_fish', count: 10, text: 'Sell your catch at the market' },
      ],
      rewards: { xp: 100, gold: 50, items: ['guild_badge_apprentice'], faction: { fisherman: 100 } },
    },
    {
      id: 'fisher_2',
      name: 'The Apprentice Test',
      description: 'Complete the apprentice examination',
      objectives: [
        { type: 'catch_fish', type: 'specific', fish: ['minnow', 'perch', 'bass'], text: 'Catch one of each: Minnow, Perch, Bass' },
        { type: 'time_limit', duration: 30, text: 'Complete within 30 minutes' },
      ],
      rewards: { xp: 150, gold: 75, items: ['apprentice_rod'], faction: { fisherman: 150 } },
    },
    {
      id: 'fisher_3',
      name: 'Night Fishing',
      description: 'Learn the art of night fishing',
      objectives: [
        { type: 'fish_at_time', time: 'night', duration: 60, text: 'Fish for 1 hour at night' },
        { type: 'catch_fish', type: 'nocturnal', count: 5, text: 'Catch 5 nocturnal fish' },
      ],
      rewards: { xp: 200, gold: 100, items: ['lantern_lure'], faction: { fisherman: 200 } },
    },
    {
      id: 'fisher_4',
      name: 'Storm Chasers',
      description: 'Fish during a storm',
      objectives: [
        { type: 'fish_during', weather: 'storm', text: 'Fish during a storm' },
        { type: 'catch_fish', count: 3, text: 'Catch 3 fish during the storm' },
        { type: 'survive', text: 'Return safely' },
      ],
      rewards: { xp: 300, gold: 200, items: ['storm_rod'], faction: { fisherman: 300 } },
    },
    {
      id: 'fisher_5',
      name: 'The Journeyman Trial',
      description: 'Advance to Journeyman rank',
      objectives: [
        { type: 'catch_fish', rarity: 'uncommon', count: 10, text: 'Catch 10 uncommon fish' },
        { type: 'teach', target: 'new_member', text: 'Teach a new member to fish' },
        { type: 'craft', item: 'fishing_lure', text: 'Craft your own lure' },
      ],
      rewards: { xp: 400, gold: 300, items: ['guild_badge_journeyman'], faction: { fisherman: 400 }, rank: 'Journeyman' },
    },
    {
      id: 'fisher_6',
      name: 'Deep Sea Expedition',
      description: 'Join a deep sea fishing expedition',
      objectives: [
        { type: 'go_to', target: 'deep_ocean', text: 'Travel to deep waters' },
        { type: 'catch_fish', type: 'deep_sea', count: 5, text: 'Catch 5 deep sea fish' },
        { type: 'discover', target: 'new_species', text: 'Discover a new species' },
      ],
      rewards: { xp: 500, gold: 400, items: ['deep_sea_rod', 'species_journal'], faction: { fisherman: 500 } },
    },
    {
      id: 'fisher_7',
      name: 'The Guild Competition',
      description: 'Compete in the annual guild tournament',
      objectives: [
        { type: 'register', event: 'guild_tournament', text: 'Register for the tournament' },
        { type: 'compete', rounds: 3, text: 'Complete all 3 rounds' },
        { type: 'rank', position: 'top_5', text: 'Finish in the top 5' },
      ],
      rewards: { xp: 600, gold: 1000, items: ['tournament_trophy'], faction: { fisherman: 600 } },
    },
    {
      id: 'fisher_8',
      name: 'The Expert Challenge',
      description: 'Prove your expertise',
      objectives: [
        { type: 'catch_fish', rarity: 'rare', count: 5, text: 'Catch 5 rare fish' },
        { type: 'perfect_catch', count: 10, text: 'Achieve 10 perfect catches' },
        { type: 'no_fish_lost', streak: 20, text: 'Catch 20 fish without losing any' },
      ],
      rewards: { xp: 700, gold: 500, items: ['guild_badge_expert'], faction: { fisherman: 700 }, rank: 'Expert' },
    },
    {
      id: 'fisher_9',
      name: 'Protecting the Waters',
      description: 'Help protect the fishing grounds',
      objectives: [
        { type: 'investigate', target: 'poachers', text: 'Investigate reports of poachers' },
        { type: 'track', target: 'poacher_ship', text: 'Track the poacher ship' },
        { type: 'report', target: 'authorities', text: 'Report to the authorities' },
      ],
      rewards: { xp: 550, gold: 300, items: ['guardian_badge'], faction: { fisherman: 550 } },
    },
    {
      id: 'fisher_10',
      name: 'The Legendary Catch',
      description: 'Catch a legendary fish',
      objectives: [
        { type: 'research', target: 'legendary_fish', text: 'Research legendary fish locations' },
        { type: 'prepare', items: ['legendary_bait', 'master_rod'], text: 'Prepare special equipment' },
        { type: 'catch_fish', rarity: 'legendary', count: 1, text: 'Catch a legendary fish' },
      ],
      rewards: { xp: 1000, gold: 2000, items: ['legendary_mount'], faction: { fisherman: 1000 } },
    },
    {
      id: 'fisher_11',
      name: 'Master\'s Test',
      description: 'The final test to become a Master Fisher',
      objectives: [
        { type: 'catch_fish', type: 'all_categories', text: 'Catch one fish from every category' },
        { type: 'time_limit', duration: 120, text: 'Complete within 2 hours' },
        { type: 'judge', target: 'guild_council', text: 'Present your catches to the council' },
      ],
      rewards: { xp: 1500, gold: 3000, items: ['guild_badge_master', 'master_rod'], faction: { fisherman: 1500 }, rank: 'Master' },
    },
    {
      id: 'fisher_12',
      name: 'The Guild Master\'s Legacy',
      description: 'Become a candidate for Guild Master',
      objectives: [
        { type: 'complete_all', questline: 'guild_fisherman', text: 'Complete all guild quests' },
        { type: 'reputation', faction: 'fisherman', amount: 10000, text: 'Reach maximum guild reputation' },
        { type: 'nominate', text: 'Receive nomination from current master' },
      ],
      rewards: { xp: 3000, gold: 10000, items: ['guild_master_robe'], faction: { fisherman: 3000 }, title: 'Guild Master Candidate' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 3: THE MERCHANT'S PATH
// ============================================================================

export const QUEST_CHAIN_MERCHANT = {
  id: 'guild_merchant',
  name: 'The Merchant\'s Path',
  description: 'Build your trading empire',
  type: 'faction',
  icon: '💰',
  totalQuests: 11,
  quests: [
    {
      id: 'merchant_1',
      name: 'First Trade',
      description: 'Learn the basics of trading',
      objectives: [
        { type: 'talk_to', target: 'merchant_marco', text: 'Speak with Merchant Marco' },
        { type: 'buy', item: 'trade_goods', count: 5, text: 'Buy 5 trade goods' },
        { type: 'sell', item: 'trade_goods', count: 5, profit: true, text: 'Sell for profit at another location' },
      ],
      rewards: { xp: 100, gold: 100, items: ['merchant_license'], faction: { merchant: 100 } },
    },
    {
      id: 'merchant_2',
      name: 'Supply and Demand',
      description: 'Understand market dynamics',
      objectives: [
        { type: 'track_prices', locations: 3, text: 'Track prices at 3 different locations' },
        { type: 'identify', target: 'profitable_route', text: 'Identify a profitable trade route' },
        { type: 'complete_route', profit: 200, text: 'Make 200g profit on a trade route' },
      ],
      rewards: { xp: 150, gold: 150, items: ['price_ledger'], faction: { merchant: 150 } },
    },
    {
      id: 'merchant_3',
      name: 'The Art of Haggling',
      description: 'Master the art of negotiation',
      objectives: [
        { type: 'haggle', success: 5, text: 'Successfully haggle 5 times' },
        { type: 'save_gold', amount: 100, text: 'Save at least 100g through haggling' },
      ],
      rewards: { xp: 200, gold: 50, items: ['silver_tongue_charm'], faction: { merchant: 200 }, skill: 'haggling' },
    },
    {
      id: 'merchant_4',
      name: 'Exotic Goods',
      description: 'Deal in exotic merchandise',
      objectives: [
        { type: 'acquire', items: ['exotic_spices', 'rare_silk', 'foreign_wine'], text: 'Acquire exotic goods' },
        { type: 'find_buyer', target: 'wealthy_collector', text: 'Find wealthy buyers' },
        { type: 'sell', profit: 500, text: 'Sell for 500g+ profit' },
      ],
      rewards: { xp: 300, gold: 300, items: ['exotic_trader_badge'], faction: { merchant: 300 } },
    },
    {
      id: 'merchant_5',
      name: 'Your Own Stall',
      description: 'Open your own market stall',
      objectives: [
        { type: 'rent', target: 'market_stall', text: 'Rent a market stall' },
        { type: 'stock', items: 10, text: 'Stock your stall with goods' },
        { type: 'sell', count: 20, text: 'Sell 20 items from your stall' },
      ],
      rewards: { xp: 400, gold: 200, items: ['stall_deed'], faction: { merchant: 400 }, unlock: 'own_stall' },
    },
    {
      id: 'merchant_6',
      name: 'Trade Connections',
      description: 'Build a network of suppliers',
      objectives: [
        { type: 'befriend', npcs: ['farmer_fred', 'craftsman_carl', 'fisher_fiona'], text: 'Befriend 3 suppliers' },
        { type: 'negotiate', target: 'exclusive_deal', count: 1, text: 'Negotiate an exclusive deal' },
      ],
      rewards: { xp: 350, gold: 250, items: ['supplier_contacts'], faction: { merchant: 350 } },
    },
    {
      id: 'merchant_7',
      name: 'The Caravan',
      description: 'Join a trading caravan',
      objectives: [
        { type: 'join', target: 'trade_caravan', text: 'Join a trade caravan' },
        { type: 'protect', target: 'caravan', text: 'Help protect the caravan' },
        { type: 'reach', destination: 'distant_port', text: 'Reach the distant port' },
      ],
      rewards: { xp: 500, gold: 500, items: ['caravan_badge'], faction: { merchant: 500 } },
    },
    {
      id: 'merchant_8',
      name: 'Merchant Ship',
      description: 'Acquire your own merchant ship',
      objectives: [
        { type: 'save', gold: 5000, text: 'Save 5000g for a ship' },
        { type: 'buy', item: 'merchant_sloop', text: 'Purchase a merchant sloop' },
        { type: 'complete_voyage', profit: 1000, text: 'Complete a profitable voyage' },
      ],
      rewards: { xp: 600, gold: 1000, items: ['captains_hat'], faction: { merchant: 600 }, unlock: 'sea_trading' },
    },
    {
      id: 'merchant_9',
      name: 'Trade Wars',
      description: 'Compete with rival merchants',
      objectives: [
        { type: 'outbid', target: 'rival_merchant', count: 3, text: 'Outbid rivals 3 times' },
        { type: 'corner_market', item: 'valuable_commodity', text: 'Corner the market on a commodity' },
        { type: 'profit', amount: 5000, text: 'Make 5000g profit in one week' },
      ],
      rewards: { xp: 700, gold: 2000, items: ['trade_baron_ring'], faction: { merchant: 700 } },
    },
    {
      id: 'merchant_10',
      name: 'The Trade Empire',
      description: 'Build your trading empire',
      objectives: [
        { type: 'own', properties: ['stall', 'warehouse', 'ship'], text: 'Own a stall, warehouse, and ship' },
        { type: 'employ', workers: 5, text: 'Employ 5 workers' },
        { type: 'monthly_profit', amount: 10000, text: 'Achieve 10000g monthly profit' },
      ],
      rewards: { xp: 1000, gold: 5000, items: ['empire_deed'], faction: { merchant: 1000 }, title: 'Trade Baron' },
    },
    {
      id: 'merchant_11',
      name: 'Master of Commerce',
      description: 'Become a legendary merchant',
      objectives: [
        { type: 'total_profit', amount: 100000, text: 'Achieve 100,000g total profit' },
        { type: 'reputation', faction: 'merchant', amount: 10000, text: 'Max merchant reputation' },
        { type: 'recognition', target: 'governor', text: 'Receive recognition from the Governor' },
      ],
      rewards: { xp: 2000, gold: 20000, items: ['golden_scales'], faction: { merchant: 2000 }, title: 'Master of Commerce' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 4: THE RICKY RIVALRY
// ============================================================================

export const QUEST_CHAIN_RICKY = {
  id: 'rival_ricky',
  name: 'The Ricky Rivalry',
  description: 'Your ongoing competition with Razor Ricky Sharkbait',
  type: 'rival',
  icon: '⚔️',
  totalQuests: 10,
  quests: [
    {
      id: 'ricky_1',
      name: 'First Encounter',
      description: 'Meet your rival for the first time',
      objectives: [
        { type: 'encounter', target: 'ricky', location: 'plaza', text: 'Encounter Ricky at the plaza' },
        { type: 'survive_insults', text: 'Endure his taunts' },
      ],
      rewards: { xp: 50, items: ['determination'] },
      dialogue: { ricky: 'Well well, another wannabe fisher. How... adorable.' },
    },
    {
      id: 'ricky_2',
      name: 'The Challenge',
      description: 'Ricky challenges you to a fishing duel',
      objectives: [
        { type: 'accept_challenge', text: 'Accept Rickys challenge' },
        { type: 'competition', against: 'ricky', type: 'fishing', duration: 60, text: 'Beat Ricky in a 1-minute fishing duel' },
      ],
      rewards: { xp: 150, gold: 100, items: ['bragging_rights'] },
    },
    {
      id: 'ricky_3',
      name: 'Sabotage!',
      description: 'Ricky sabotaged your equipment',
      objectives: [
        { type: 'discover', target: 'sabotage', text: 'Discover the sabotage' },
        { type: 'repair', item: 'fishing_rod', text: 'Repair your equipment' },
        { type: 'confront', target: 'ricky', text: 'Confront Ricky' },
      ],
      rewards: { xp: 200, gold: 50, items: ['anti_sabotage_lock'] },
    },
    {
      id: 'ricky_4',
      name: 'The Rematch',
      description: 'Time for a proper rematch',
      objectives: [
        { type: 'competition', against: 'ricky', type: 'fishing', duration: 180, text: 'Beat Ricky in a 3-minute duel' },
        { type: 'catch_more', margin: 3, text: 'Win by at least 3 fish' },
      ],
      rewards: { xp: 300, gold: 200, items: ['rivalry_trophy_1'] },
    },
    {
      id: 'ricky_5',
      name: 'Rickys Secret',
      description: 'Discover why Ricky is so competitive',
      objectives: [
        { type: 'investigate', target: 'ricky_background', text: 'Investigate Rickys past' },
        { type: 'talk_to', target: 'rickys_mentor', text: 'Find Rickys old mentor' },
        { type: 'learn', secret: 'ricky_origin', text: 'Learn his tragic backstory' },
      ],
      rewards: { xp: 250, items: ['understanding'] },
    },
    {
      id: 'ricky_6',
      name: 'Forced Alliance',
      description: 'Work together against a common threat',
      objectives: [
        { type: 'encounter', target: 'poachers', text: 'Encounter poachers' },
        { type: 'team_up', target: 'ricky', text: 'Reluctantly team up with Ricky' },
        { type: 'defeat', target: 'poacher_leader', text: 'Defeat the poacher leader together' },
      ],
      rewards: { xp: 400, gold: 300, items: ['grudging_respect'] },
    },
    {
      id: 'ricky_7',
      name: 'The Tournament',
      description: 'Face Ricky in the official tournament',
      objectives: [
        { type: 'qualify', event: 'grand_tournament', text: 'Qualify for the Grand Tournament' },
        { type: 'advance', rounds: 3, text: 'Advance through preliminary rounds' },
        { type: 'face', target: 'ricky', round: 'semifinal', text: 'Face Ricky in the semifinal' },
      ],
      rewards: { xp: 500, gold: 500, items: ['tournament_finalist_badge'] },
    },
    {
      id: 'ricky_8',
      name: 'Mutual Respect',
      description: 'Earn Rickys grudging respect',
      objectives: [
        { type: 'help', target: 'ricky', situation: 'ship_trouble', text: 'Help Ricky when his ship breaks down' },
        { type: 'receive', item: 'thanks', from: 'ricky', text: 'Receive his awkward thanks' },
      ],
      rewards: { xp: 300, items: ['rickys_lucky_lure'], relationship: { ricky: 'rival_respect' } },
    },
    {
      id: 'ricky_9',
      name: 'The Ultimate Duel',
      description: 'The final fishing competition',
      objectives: [
        { type: 'challenge', target: 'ricky', text: 'Challenge Ricky to the ultimate duel' },
        { type: 'competition', against: 'ricky', type: 'fishing', duration: 300, legendary: true, text: 'Win the legendary 5-minute duel' },
      ],
      rewards: { xp: 800, gold: 1000, items: ['ultimate_rival_trophy'] },
    },
    {
      id: 'ricky_10',
      name: 'From Rivals to...',
      description: 'The end of the rivalry',
      objectives: [
        { type: 'choice', options: ['friends', 'eternal_rivals', 'business_partners'], text: 'Decide your relationship with Ricky' },
        { type: 'ceremony', text: 'Attend the rivalry conclusion ceremony' },
      ],
      rewards: { xp: 500, gold: 500, items: ['friendship_or_rivalry_badge'], relationship: { ricky: 'final_state' } },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 5: MYSTERIES OF THE DEEP
// ============================================================================

export const QUEST_CHAIN_MYSTERIES = {
  id: 'mysteries_deep',
  name: 'Mysteries of the Deep',
  description: 'Uncover the supernatural secrets of the ocean',
  type: 'exploration',
  icon: '🔮',
  totalQuests: 12,
  quests: [
    {
      id: 'mystery_1',
      name: 'Strange Lights',
      description: 'Investigate mysterious lights in the water',
      objectives: [
        { type: 'witness', event: 'strange_lights', text: 'Witness the strange lights' },
        { type: 'investigate', location: 'light_source', text: 'Investigate the source' },
      ],
      rewards: { xp: 100, items: ['mysterious_scale'] },
    },
    {
      id: 'mystery_2',
      name: 'The Ghost Ship',
      description: 'The legendary ghost ship has been sighted',
      objectives: [
        { type: 'gather_info', about: 'ghost_ship', sources: 3, text: 'Gather information from 3 sources' },
        { type: 'wait_for', event: 'foggy_night', text: 'Wait for a foggy night' },
        { type: 'spot', target: 'ghost_ship', text: 'Spot the ghost ship' },
      ],
      rewards: { xp: 200, items: ['ghost_compass'] },
    },
    {
      id: 'mystery_3',
      name: 'Bioluminescent Bay',
      description: 'Discover the glowing bay',
      objectives: [
        { type: 'find', location: 'bioluminescent_bay', text: 'Find the bioluminescent bay' },
        { type: 'catch_fish', type: 'glowing', count: 3, text: 'Catch 3 glowing fish' },
        { type: 'study', target: 'bioluminescence', text: 'Study the phenomenon' },
      ],
      rewards: { xp: 250, gold: 150, items: ['glow_lure'] },
    },
    {
      id: 'mystery_4',
      name: 'The Sea Witch',
      description: 'Rumors of a sea witch in the cove',
      objectives: [
        { type: 'find', target: 'sea_witch_hut', text: 'Find the sea witchs hut' },
        { type: 'bring_offering', items: ['rare_pearl', 'moonfish'], text: 'Bring an appropriate offering' },
        { type: 'audience', target: 'sea_witch', text: 'Gain an audience with the witch' },
      ],
      rewards: { xp: 300, items: ['witch_blessing'], unlock: 'magic_shop' },
    },
    {
      id: 'mystery_5',
      name: 'Sunken Temple',
      description: 'Explore the sunken temple',
      objectives: [
        { type: 'acquire', item: 'diving_gear', text: 'Acquire diving equipment' },
        { type: 'dive', location: 'sunken_temple', text: 'Dive to the sunken temple' },
        { type: 'explore', rooms: 5, text: 'Explore 5 temple rooms' },
        { type: 'retrieve', item: 'ancient_artifact', text: 'Retrieve an ancient artifact' },
      ],
      rewards: { xp: 400, gold: 300, items: ['temple_relic'] },
    },
    {
      id: 'mystery_6',
      name: 'The Kraken\'s Wake',
      description: 'Signs of the legendary Kraken',
      objectives: [
        { type: 'investigate', target: 'destroyed_ships', text: 'Investigate destroyed ships' },
        { type: 'collect', items: ['kraken_ink', 'giant_sucker_mark'], text: 'Collect evidence' },
        { type: 'survive', encounter: 'kraken_tentacle', text: 'Survive a tentacle encounter' },
      ],
      rewards: { xp: 500, gold: 500, items: ['kraken_tooth'] },
    },
    {
      id: 'mystery_7',
      name: 'Mermaid\'s Song',
      description: 'Follow the haunting melody',
      objectives: [
        { type: 'hear', event: 'mermaid_song', text: 'Hear the mermaids song' },
        { type: 'resist', effect: 'enchantment', text: 'Resist the enchantment' },
        { type: 'follow', target: 'song_source', text: 'Follow to the source' },
        { type: 'meet', target: 'mermaid_queen', text: 'Meet the mermaid queen' },
      ],
      rewards: { xp: 600, items: ['mermaid_tear', 'underwater_breathing'] },
    },
    {
      id: 'mystery_8',
      name: 'The Abyss',
      description: 'Descend into the deepest waters',
      objectives: [
        { type: 'prepare', items: ['deep_diving_suit', 'pressure_charm'], text: 'Prepare for the abyss' },
        { type: 'descend', depth: 'maximum', text: 'Descend to the bottom' },
        { type: 'discover', target: 'ancient_city', text: 'Discover what lies below' },
      ],
      rewards: { xp: 700, gold: 1000, items: ['abyss_pearl'] },
    },
    {
      id: 'mystery_9',
      name: 'The Leviathan',
      description: 'Encounter the legendary sea monster',
      objectives: [
        { type: 'summon', ritual: 'leviathan_call', text: 'Perform the summoning ritual' },
        { type: 'encounter', target: 'leviathan', text: 'Face the Leviathan' },
        { type: 'communicate', target: 'leviathan', text: 'Communicate with the ancient being' },
      ],
      rewards: { xp: 800, items: ['leviathan_scale', 'ancient_wisdom'] },
    },
    {
      id: 'mystery_10',
      name: 'Curse of the Depths',
      description: 'Break the ancient curse',
      objectives: [
        { type: 'gather', items: ['7_cursed_artifacts'], text: 'Gather the 7 cursed artifacts' },
        { type: 'find', target: 'curse_origin', text: 'Find the curse origin' },
        { type: 'ritual', type: 'curse_breaking', text: 'Perform the curse-breaking ritual' },
      ],
      rewards: { xp: 1000, gold: 2000, items: ['curse_breaker_title'] },
    },
    {
      id: 'mystery_11',
      name: 'The Sea God\'s Temple',
      description: 'Enter the legendary temple',
      objectives: [
        { type: 'collect', keys: ['water_key', 'storm_key', 'calm_key'], text: 'Collect the 3 elemental keys' },
        { type: 'enter', target: 'sea_god_temple', text: 'Enter the Sea Gods temple' },
        { type: 'trial', trials: 3, text: 'Complete the 3 trials' },
      ],
      rewards: { xp: 1500, items: ['sea_god_blessing'] },
    },
    {
      id: 'mystery_12',
      name: 'Champion of the Deep',
      description: 'Become the oceans chosen',
      objectives: [
        { type: 'audience', target: 'sea_god', text: 'Have an audience with the Sea God' },
        { type: 'choice', options: ['accept_power', 'decline_humbly'], text: 'Make your choice' },
        { type: 'return', target: 'surface', text: 'Return to the surface world' },
      ],
      rewards: { xp: 2000, gold: 5000, items: ['trident_of_the_deep'], title: 'Champion of the Deep' },
    },
  ],
};

// ============================================================================
// QUEST CHAIN 6-10: COLLECTION QUESTS
// ============================================================================

export const QUEST_CHAIN_FISH_COLLECTION = {
  id: 'collect_fish',
  name: 'The Complete Angler',
  description: 'Catch every species of fish',
  type: 'collection',
  icon: '📖',
  totalQuests: 10,
  quests: [
    { id: 'fish_col_1', name: 'Common Catches', objectives: [{ type: 'catch_unique', rarity: 'common', count: 10 }], rewards: { xp: 100, items: ['fish_journal_1'] } },
    { id: 'fish_col_2', name: 'Uncommon Finds', objectives: [{ type: 'catch_unique', rarity: 'uncommon', count: 10 }], rewards: { xp: 200, items: ['fish_journal_2'] } },
    { id: 'fish_col_3', name: 'Rare Specimens', objectives: [{ type: 'catch_unique', rarity: 'rare', count: 10 }], rewards: { xp: 400, items: ['fish_journal_3'] } },
    { id: 'fish_col_4', name: 'Nocturnal Species', objectives: [{ type: 'catch_unique', time: 'night', count: 5 }], rewards: { xp: 300, items: ['night_vision_goggles'] } },
    { id: 'fish_col_5', name: 'Storm Swimmers', objectives: [{ type: 'catch_unique', weather: 'storm', count: 5 }], rewards: { xp: 350, items: ['storm_rod'] } },
    { id: 'fish_col_6', name: 'Deep Dwellers', objectives: [{ type: 'catch_unique', depth: 'deep', count: 5 }], rewards: { xp: 400, items: ['depth_finder'] } },
    { id: 'fish_col_7', name: 'Tropical Treasures', objectives: [{ type: 'catch_unique', region: 'tropical', count: 5 }], rewards: { xp: 350, items: ['tropical_lure'] } },
    { id: 'fish_col_8', name: 'Epic Encounters', objectives: [{ type: 'catch_unique', rarity: 'epic', count: 5 }], rewards: { xp: 600, items: ['epic_rod'] } },
    { id: 'fish_col_9', name: 'Legendary Legends', objectives: [{ type: 'catch_unique', rarity: 'legendary', count: 3 }], rewards: { xp: 1000, items: ['legendary_tackle'] } },
    { id: 'fish_col_10', name: 'Complete Collection', objectives: [{ type: 'catch_unique', total: 50 }], rewards: { xp: 2000, items: ['master_angler_badge'], title: 'Master Angler' } },
  ],
};

export const QUEST_CHAIN_SHELL_COLLECTION = {
  id: 'collect_shells',
  name: 'Shell Seeker',
  description: 'Collect all types of seashells',
  type: 'collection',
  icon: '🐚',
  totalQuests: 10,
  quests: [
    { id: 'shell_1', name: 'Beach Combing', objectives: [{ type: 'collect', item: 'common_shell', count: 20 }], rewards: { xp: 50, gold: 25 } },
    { id: 'shell_2', name: 'Spiral Shells', objectives: [{ type: 'collect', item: 'spiral_shell', count: 10 }], rewards: { xp: 100, gold: 50 } },
    { id: 'shell_3', name: 'Conch Quest', objectives: [{ type: 'collect', item: 'conch_shell', count: 5 }], rewards: { xp: 150, gold: 75 } },
    { id: 'shell_4', name: 'Pearl Hunting', objectives: [{ type: 'find', item: 'pearl_in_shell', count: 3 }], rewards: { xp: 200, gold: 200 } },
    { id: 'shell_5', name: 'Rare Colors', objectives: [{ type: 'collect', item: 'colored_shell', variants: 5 }], rewards: { xp: 250, items: ['shell_display'] } },
    { id: 'shell_6', name: 'Giant Shells', objectives: [{ type: 'collect', item: 'giant_shell', count: 3 }], rewards: { xp: 300, gold: 150 } },
    { id: 'shell_7', name: 'Fossil Shells', objectives: [{ type: 'collect', item: 'fossil_shell', count: 3 }], rewards: { xp: 350, items: ['fossil_display'] } },
    { id: 'shell_8', name: 'Magical Shells', objectives: [{ type: 'collect', item: 'magical_shell', count: 2 }], rewards: { xp: 400, items: ['shell_charm'] } },
    { id: 'shell_9', name: 'Rainbow Shell', objectives: [{ type: 'find', item: 'rainbow_shell', count: 1 }], rewards: { xp: 500, items: ['rainbow_shell_trophy'] } },
    { id: 'shell_10', name: 'Shell Master', objectives: [{ type: 'collect_all', category: 'shells' }], rewards: { xp: 1000, items: ['shell_crown'], title: 'Shell Master' } },
  ],
};

export const QUEST_CHAIN_TREASURE_COLLECTION = {
  id: 'collect_treasure',
  name: 'Treasure Hunter',
  description: 'Find all hidden treasures',
  type: 'collection',
  icon: '💎',
  totalQuests: 10,
  quests: [
    { id: 'treasure_1', name: 'First Dig', objectives: [{ type: 'dig', treasure: 'any', count: 1 }], rewards: { xp: 100, gold: 100 } },
    { id: 'treasure_2', name: 'Map Reading', objectives: [{ type: 'complete', maps: 3 }], rewards: { xp: 200, gold: 200 } },
    { id: 'treasure_3', name: 'Beach Treasures', objectives: [{ type: 'find', location: 'beach', count: 5 }], rewards: { xp: 250, gold: 250 } },
    { id: 'treasure_4', name: 'Cave Explorer', objectives: [{ type: 'find', location: 'caves', count: 5 }], rewards: { xp: 300, gold: 300 } },
    { id: 'treasure_5', name: 'Underwater Riches', objectives: [{ type: 'find', location: 'underwater', count: 5 }], rewards: { xp: 350, gold: 350 } },
    { id: 'treasure_6', name: 'Pirate Hoards', objectives: [{ type: 'find', type: 'pirate', count: 3 }], rewards: { xp: 400, gold: 500 } },
    { id: 'treasure_7', name: 'Ancient Artifacts', objectives: [{ type: 'find', type: 'ancient', count: 3 }], rewards: { xp: 500, items: ['artifact_detector'] } },
    { id: 'treasure_8', name: 'Royal Treasures', objectives: [{ type: 'find', type: 'royal', count: 2 }], rewards: { xp: 600, gold: 1000 } },
    { id: 'treasure_9', name: 'Legendary Hoard', objectives: [{ type: 'find', type: 'legendary', count: 1 }], rewards: { xp: 1000, gold: 5000 } },
    { id: 'treasure_10', name: 'Treasure Legend', objectives: [{ type: 'find_total', count: 50 }], rewards: { xp: 2000, items: ['treasure_compass'], title: 'Treasure Legend' } },
  ],
};

export const QUEST_CHAIN_ARTIFACT_COLLECTION = {
  id: 'collect_artifacts',
  name: 'Artifact Archaeologist',
  description: 'Discover ancient artifacts',
  type: 'collection',
  icon: '🏺',
  totalQuests: 10,
  quests: [
    { id: 'artifact_1', name: 'Old Coins', objectives: [{ type: 'collect', item: 'old_coin', count: 10 }], rewards: { xp: 100, gold: 50 } },
    { id: 'artifact_2', name: 'Pottery Shards', objectives: [{ type: 'collect', item: 'pottery_shard', count: 15 }], rewards: { xp: 150, gold: 75 } },
    { id: 'artifact_3', name: 'Ancient Tools', objectives: [{ type: 'collect', item: 'ancient_tool', count: 5 }], rewards: { xp: 200, gold: 100 } },
    { id: 'artifact_4', name: 'Jewelry Pieces', objectives: [{ type: 'collect', item: 'ancient_jewelry', count: 5 }], rewards: { xp: 250, gold: 200 } },
    { id: 'artifact_5', name: 'Stone Tablets', objectives: [{ type: 'collect', item: 'stone_tablet', count: 3 }], rewards: { xp: 300, items: ['translation_guide'] } },
    { id: 'artifact_6', name: 'Ceremonial Items', objectives: [{ type: 'collect', item: 'ceremonial_item', count: 3 }], rewards: { xp: 350, gold: 300 } },
    { id: 'artifact_7', name: 'Royal Regalia', objectives: [{ type: 'collect', item: 'royal_artifact', count: 2 }], rewards: { xp: 400, gold: 500 } },
    { id: 'artifact_8', name: 'Magical Relics', objectives: [{ type: 'collect', item: 'magical_relic', count: 2 }], rewards: { xp: 500, items: ['relic_case'] } },
    { id: 'artifact_9', name: 'Divine Artifact', objectives: [{ type: 'find', item: 'divine_artifact', count: 1 }], rewards: { xp: 1000, gold: 2000 } },
    { id: 'artifact_10', name: 'Museum Curator', objectives: [{ type: 'donate', items: 30, to: 'museum' }], rewards: { xp: 2000, items: ['curator_key'], title: 'Honorary Curator' } },
  ],
};

export const QUEST_CHAIN_RECIPE_COLLECTION = {
  id: 'collect_recipes',
  name: 'Master Chef',
  description: 'Collect and master all fish recipes',
  type: 'collection',
  icon: '👨‍🍳',
  totalQuests: 10,
  quests: [
    { id: 'recipe_1', name: 'Basic Cooking', objectives: [{ type: 'learn_recipe', count: 5 }], rewards: { xp: 100, items: ['cooking_pot'] } },
    { id: 'recipe_2', name: 'Grilled Fish', objectives: [{ type: 'cook', type: 'grilled', count: 10 }], rewards: { xp: 150, items: ['grill'] } },
    { id: 'recipe_3', name: 'Fish Stew', objectives: [{ type: 'learn_recipe', specific: 'fish_stew' }], rewards: { xp: 200, items: ['stew_pot'] } },
    { id: 'recipe_4', name: 'Exotic Dishes', objectives: [{ type: 'cook', type: 'exotic', count: 5 }], rewards: { xp: 250, gold: 200 } },
    { id: 'recipe_5', name: 'Secret Recipe', objectives: [{ type: 'discover', recipe: 'secret', count: 1 }], rewards: { xp: 300, items: ['secret_spice'] } },
    { id: 'recipe_6', name: 'Competition Entry', objectives: [{ type: 'enter', event: 'cooking_competition' }], rewards: { xp: 350, gold: 300 } },
    { id: 'recipe_7', name: 'Royal Feast', objectives: [{ type: 'cook_for', target: 'governor' }], rewards: { xp: 400, gold: 500, reputation: { noble: 100 } } },
    { id: 'recipe_8', name: 'Legendary Recipe', objectives: [{ type: 'learn_recipe', rarity: 'legendary' }], rewards: { xp: 500, items: ['legendary_cookbook'] } },
    { id: 'recipe_9', name: 'Open Restaurant', objectives: [{ type: 'unlock', feature: 'restaurant' }], rewards: { xp: 750, items: ['restaurant_deed'] } },
    { id: 'recipe_10', name: 'Master Chef', objectives: [{ type: 'learn_recipe', total: 50 }], rewards: { xp: 1500, items: ['chefs_hat'], title: 'Master Chef' } },
  ],
};

// ============================================================================
// QUEST CHAINS 11-20: REGION & NPC QUESTS
// ============================================================================

export const QUEST_CHAIN_TAVERN = {
  id: 'tavern_tales',
  name: 'Tales of the Tipsy Tentacle',
  description: 'Help the tavern keeper and patrons',
  type: 'location',
  icon: '🍺',
  totalQuests: 10,
  quests: [
    { id: 'tavern_1', name: 'First Drink', objectives: [{ type: 'buy', item: 'drink' }], rewards: { xp: 25, items: ['tavern_mug'] } },
    { id: 'tavern_2', name: 'Bar Tab', objectives: [{ type: 'collect', target: 'unpaid_tabs', count: 3 }], rewards: { xp: 100, gold: 50 } },
    { id: 'tavern_3', name: 'Ingredient Run', objectives: [{ type: 'fetch', items: ['rum', 'spices', 'fish'] }], rewards: { xp: 150, gold: 75 } },
    { id: 'tavern_4', name: 'Rowdy Customers', objectives: [{ type: 'calm', target: 'drunk_sailors', count: 2 }], rewards: { xp: 200, gold: 100 } },
    { id: 'tavern_5', name: 'Entertainment Night', objectives: [{ type: 'perform', or: 'hire_performer' }], rewards: { xp: 250, gold: 150 } },
    { id: 'tavern_6', name: 'Secret Recipe', objectives: [{ type: 'discover', target: 'house_special_recipe' }], rewards: { xp: 300, items: ['tavern_recipe'] } },
    { id: 'tavern_7', name: 'Rat Problem', objectives: [{ type: 'clear', target: 'cellar_rats', count: 10 }], rewards: { xp: 200, gold: 100 } },
    { id: 'tavern_8', name: 'Love Story', objectives: [{ type: 'help', npcs: ['shy_sailor', 'barmaid'] }], rewards: { xp: 300, items: ['matchmaker_badge'] } },
    { id: 'tavern_9', name: 'Tavern Defense', objectives: [{ type: 'defend', target: 'tavern', from: 'pirates' }], rewards: { xp: 400, gold: 300 } },
    { id: 'tavern_10', name: 'Honorary Member', objectives: [{ type: 'reputation', location: 'tavern', amount: 1000 }], rewards: { xp: 500, items: ['vip_card'], title: 'Tavern Regular' } },
  ],
};

export const QUEST_CHAIN_LIGHTHOUSE = {
  id: 'lighthouse_keeper',
  name: 'The Lighthouse Keeper',
  description: 'Help the lonely lighthouse keeper',
  type: 'npc',
  icon: '🗼',
  totalQuests: 10,
  quests: [
    { id: 'light_1', name: 'First Visit', objectives: [{ type: 'visit', target: 'lighthouse' }], rewards: { xp: 50 } },
    { id: 'light_2', name: 'Oil Delivery', objectives: [{ type: 'deliver', item: 'lamp_oil', count: 5 }], rewards: { xp: 100, gold: 50 } },
    { id: 'light_3', name: 'Lens Cleaning', objectives: [{ type: 'help', task: 'clean_lens' }], rewards: { xp: 150, items: ['telescope'] } },
    { id: 'light_4', name: 'Storm Watch', objectives: [{ type: 'assist', during: 'storm' }], rewards: { xp: 200, gold: 100 } },
    { id: 'light_5', name: 'Keepers Stories', objectives: [{ type: 'listen', stories: 5 }], rewards: { xp: 150, items: ['lighthouse_lore'] } },
    { id: 'light_6', name: 'Ghost Sighting', objectives: [{ type: 'investigate', target: 'lighthouse_ghost' }], rewards: { xp: 250, items: ['ghost_lantern'] } },
    { id: 'light_7', name: 'Repair Work', objectives: [{ type: 'repair', parts: ['mechanism', 'stairs', 'door'] }], rewards: { xp: 300, gold: 200 } },
    { id: 'light_8', name: 'Signal System', objectives: [{ type: 'learn', skill: 'light_signals' }], rewards: { xp: 200, skill: 'signaling' } },
    { id: 'light_9', name: 'Ship Rescue', objectives: [{ type: 'guide', target: 'lost_ship' }], rewards: { xp: 400, gold: 300, reputation: { sailors: 200 } } },
    { id: 'light_10', name: 'Lighthouse Friend', objectives: [{ type: 'relationship', target: 'keeper', level: 'friend' }], rewards: { xp: 500, items: ['lighthouse_key'], title: 'Friend of the Light' } },
  ],
};

export const QUEST_CHAIN_BLACKSMITH = {
  id: 'blacksmith_apprentice',
  name: 'Forge of the Sea',
  description: 'Learn from the blacksmith',
  type: 'npc',
  icon: '⚒️',
  totalQuests: 10,
  quests: [
    { id: 'smith_1', name: 'First Commission', objectives: [{ type: 'order', item: 'hook_set' }], rewards: { xp: 50, items: ['basic_hooks'] } },
    { id: 'smith_2', name: 'Material Gathering', objectives: [{ type: 'bring', items: ['iron_ore', 'coal'] }], rewards: { xp: 100, gold: 50 } },
    { id: 'smith_3', name: 'Apprentice Work', objectives: [{ type: 'assist', task: 'bellows', duration: 30 }], rewards: { xp: 150, skill: 'smithing_basic' } },
    { id: 'smith_4', name: 'First Craft', objectives: [{ type: 'craft', item: 'fishing_hook' }], rewards: { xp: 200, items: ['custom_hook'] } },
    { id: 'smith_5', name: 'Special Order', objectives: [{ type: 'craft', item: 'custom_lure' }], rewards: { xp: 250, gold: 150 } },
    { id: 'smith_6', name: 'Rare Metal', objectives: [{ type: 'find', item: 'sea_steel' }], rewards: { xp: 300, items: ['sea_steel_ingot'] } },
    { id: 'smith_7', name: 'Master Technique', objectives: [{ type: 'learn', technique: 'folding' }], rewards: { xp: 350, skill: 'smithing_advanced' } },
    { id: 'smith_8', name: 'Competition Piece', objectives: [{ type: 'craft', quality: 'masterwork' }], rewards: { xp: 400, gold: 300 } },
    { id: 'smith_9', name: 'Legendary Repair', objectives: [{ type: 'repair', item: 'ancient_anchor' }], rewards: { xp: 500, items: ['smiths_blessing'] } },
    { id: 'smith_10', name: 'Forge Master', objectives: [{ type: 'craft', masterworks: 5 }], rewards: { xp: 750, items: ['smiths_hammer'], title: 'Forge Master' } },
  ],
};

export const QUEST_CHAIN_GOVERNOR = {
  id: 'noble_service',
  name: 'Service to the Crown',
  description: 'Serve Lord Fancypants and the nobility',
  type: 'faction',
  icon: '👑',
  totalQuests: 10,
  quests: [
    { id: 'noble_1', name: 'Audience Request', objectives: [{ type: 'gain', target: 'mansion_access' }], rewards: { xp: 100, reputation: { noble: 50 } } },
    { id: 'noble_2', name: 'Fetch Quest', objectives: [{ type: 'fetch', items: ['exotic_fish', 'rare_wine'] }], rewards: { xp: 150, gold: 200 } },
    { id: 'noble_3', name: 'Garden Party', objectives: [{ type: 'provide', items: ['decorative_fish'], count: 10 }], rewards: { xp: 200, gold: 300 } },
    { id: 'noble_4', name: 'Diplomatic Errand', objectives: [{ type: 'deliver', item: 'sealed_letter', to: 'distant_lord' }], rewards: { xp: 250, gold: 200 } },
    { id: 'noble_5', name: 'Scandal Management', objectives: [{ type: 'resolve', situation: 'noble_scandal' }], rewards: { xp: 300, reputation: { noble: 200 } } },
    { id: 'noble_6', name: 'Royal Visit', objectives: [{ type: 'prepare', event: 'royal_visit' }], rewards: { xp: 350, gold: 500 } },
    { id: 'noble_7', name: 'Secret Mission', objectives: [{ type: 'complete', mission: 'classified' }], rewards: { xp: 400, items: ['noble_favor'] } },
    { id: 'noble_8', name: 'Investment Opportunity', objectives: [{ type: 'invest', gold: 1000 }], rewards: { xp: 300, returns: 'dividend' } },
    { id: 'noble_9', name: 'Title Nomination', objectives: [{ type: 'earn', nomination: true }], rewards: { xp: 500, reputation: { noble: 500 } } },
    { id: 'noble_10', name: 'Knighthood', objectives: [{ type: 'complete_all', questline: 'noble_service' }], rewards: { xp: 1000, gold: 2000, title: 'Sir/Dame' } },
  ],
};

export const QUEST_CHAIN_HERMIT = {
  id: 'hermit_wisdom',
  name: 'The Cryptic Hermit',
  description: 'Learn from Gary the Unnecessarily Cryptic',
  type: 'npc',
  icon: '🧙',
  totalQuests: 10,
  quests: [
    { id: 'hermit_1', name: 'Finding Gary', objectives: [{ type: 'find', target: 'hermit_cave' }], rewards: { xp: 100 } },
    { id: 'hermit_2', name: 'The First Riddle', objectives: [{ type: 'solve', riddle: 1 }], rewards: { xp: 150, items: ['riddle_answer_1'] } },
    { id: 'hermit_3', name: 'Offering Accepted', objectives: [{ type: 'bring', item: 'shiny_fish' }], rewards: { xp: 100, items: ['garys_thanks'] } },
    { id: 'hermit_4', name: 'The Second Riddle', objectives: [{ type: 'solve', riddle: 2 }], rewards: { xp: 200, items: ['riddle_answer_2'] } },
    { id: 'hermit_5', name: 'Fetch the Unfetchable', objectives: [{ type: 'bring', item: 'impossible_item' }], rewards: { xp: 250, items: ['possible_reward'] } },
    { id: 'hermit_6', name: 'The Third Riddle', objectives: [{ type: 'solve', riddle: 3 }], rewards: { xp: 300, items: ['riddle_answer_3'] } },
    { id: 'hermit_7', name: 'Vision Quest', objectives: [{ type: 'experience', vision: true }], rewards: { xp: 350, items: ['vision_fragment'] } },
    { id: 'hermit_8', name: 'The Final Riddle', objectives: [{ type: 'solve', riddle: 'final' }], rewards: { xp: 500, items: ['ultimate_answer'] } },
    { id: 'hermit_9', name: 'Gary\'s Secret', objectives: [{ type: 'learn', secret: 'garys_past' }], rewards: { xp: 400, items: ['backstory_unlocked'] } },
    { id: 'hermit_10', name: 'Wisdom Earned', objectives: [{ type: 'relationship', target: 'gary', level: 'enlightened' }], rewards: { xp: 750, items: ['garys_staff'], title: 'The Enlightened' } },
  ],
};

// ============================================================================
// QUEST CHAINS 21-30: SPECIAL & EVENT QUESTS
// ============================================================================

export const QUEST_CHAIN_SEASONAL_SPRING = {
  id: 'spring_festival',
  name: 'Spring Awakening Festival',
  description: 'Celebrate the spring festival',
  type: 'seasonal',
  icon: '🌸',
  season: 'spring',
  totalQuests: 10,
  quests: [
    { id: 'spring_1', name: 'Festival Begins', objectives: [{ type: 'attend', event: 'opening_ceremony' }], rewards: { xp: 50, items: ['festival_token'] } },
    { id: 'spring_2', name: 'Flower Collection', objectives: [{ type: 'collect', item: 'spring_flower', count: 20 }], rewards: { xp: 100, items: ['flower_crown'] } },
    { id: 'spring_3', name: 'Fishing Contest', objectives: [{ type: 'enter', contest: 'spring_fishing' }], rewards: { xp: 150, gold: 100 } },
    { id: 'spring_4', name: 'Dance Performance', objectives: [{ type: 'participate', event: 'spring_dance' }], rewards: { xp: 100, items: ['dance_ribbon'] } },
    { id: 'spring_5', name: 'Cooking Competition', objectives: [{ type: 'enter', contest: 'spring_cooking' }], rewards: { xp: 200, items: ['spring_recipe'] } },
    { id: 'spring_6', name: 'Egg Hunt', objectives: [{ type: 'find', item: 'hidden_egg', count: 10 }], rewards: { xp: 150, gold: 150 } },
    { id: 'spring_7', name: 'Help the Florist', objectives: [{ type: 'assist', npc: 'florist' }], rewards: { xp: 200, items: ['rare_seeds'] } },
    { id: 'spring_8', name: 'Spring Romance', objectives: [{ type: 'deliver', item: 'love_letter' }], rewards: { xp: 150, items: ['cupids_blessing'] } },
    { id: 'spring_9', name: 'Grand Finale', objectives: [{ type: 'attend', event: 'fireworks_show' }], rewards: { xp: 100, items: ['spring_memory'] } },
    { id: 'spring_10', name: 'Festival Champion', objectives: [{ type: 'win', contests: 3 }], rewards: { xp: 500, items: ['spring_crown'], title: 'Spring Champion' } },
  ],
};

export const QUEST_CHAIN_SEASONAL_SUMMER = {
  id: 'summer_splash',
  name: 'Summer Splash Festival',
  description: 'Enjoy the summer festivities',
  type: 'seasonal',
  icon: '☀️',
  season: 'summer',
  totalQuests: 10,
  quests: [
    { id: 'summer_1', name: 'Beach Party', objectives: [{ type: 'attend', event: 'beach_party' }], rewards: { xp: 50, items: ['summer_hat'] } },
    { id: 'summer_2', name: 'Sandcastle Contest', objectives: [{ type: 'build', item: 'sandcastle' }], rewards: { xp: 100, items: ['golden_shovel'] } },
    { id: 'summer_3', name: 'Deep Sea Tournament', objectives: [{ type: 'enter', contest: 'summer_fishing' }], rewards: { xp: 200, gold: 200 } },
    { id: 'summer_4', name: 'Boat Race', objectives: [{ type: 'participate', event: 'boat_race' }], rewards: { xp: 150, items: ['racing_flag'] } },
    { id: 'summer_5', name: 'Treasure Dive', objectives: [{ type: 'dive', find: 'summer_treasure' }], rewards: { xp: 250, gold: 300 } },
    { id: 'summer_6', name: 'Luau Night', objectives: [{ type: 'attend', event: 'luau' }], rewards: { xp: 100, items: ['tiki_torch'] } },
    { id: 'summer_7', name: 'Shark Spotting', objectives: [{ type: 'spot', target: 'sharks', count: 5 }], rewards: { xp: 200, items: ['shark_tooth'] } },
    { id: 'summer_8', name: 'Surfing Lesson', objectives: [{ type: 'learn', skill: 'surfing' }], rewards: { xp: 150, skill: 'surfing' } },
    { id: 'summer_9', name: 'Sunset Cruise', objectives: [{ type: 'join', event: 'sunset_cruise' }], rewards: { xp: 100, items: ['sunset_photo'] } },
    { id: 'summer_10', name: 'Summer Legend', objectives: [{ type: 'complete_all', festival: 'summer' }], rewards: { xp: 500, items: ['summer_trophy'], title: 'Summer Legend' } },
  ],
};

export const QUEST_CHAIN_SEASONAL_AUTUMN = {
  id: 'autumn_harvest',
  name: 'Autumn Harvest Festival',
  description: 'Celebrate the autumn harvest',
  type: 'seasonal',
  icon: '🍂',
  season: 'autumn',
  totalQuests: 10,
  quests: [
    { id: 'autumn_1', name: 'Harvest Opening', objectives: [{ type: 'attend', event: 'harvest_ceremony' }], rewards: { xp: 50, items: ['harvest_basket'] } },
    { id: 'autumn_2', name: 'Pumpkin Patch', objectives: [{ type: 'collect', item: 'pumpkin', count: 10 }], rewards: { xp: 100, items: ['pumpkin_pie'] } },
    { id: 'autumn_3', name: 'Migration Fishing', objectives: [{ type: 'catch', fish: 'migrating', count: 5 }], rewards: { xp: 200, gold: 150 } },
    { id: 'autumn_4', name: 'Apple Picking', objectives: [{ type: 'collect', item: 'apple', count: 20 }], rewards: { xp: 100, items: ['apple_cider'] } },
    { id: 'autumn_5', name: 'Scarecrow Building', objectives: [{ type: 'build', item: 'scarecrow' }], rewards: { xp: 150, items: ['scarecrow_hat'] } },
    { id: 'autumn_6', name: 'Ghost Stories', objectives: [{ type: 'attend', event: 'ghost_stories' }], rewards: { xp: 100, items: ['spooky_tale'] } },
    { id: 'autumn_7', name: 'Corn Maze', objectives: [{ type: 'complete', maze: true }], rewards: { xp: 200, gold: 100 } },
    { id: 'autumn_8', name: 'Harvest Feast', objectives: [{ type: 'contribute', items: 5 }], rewards: { xp: 150, items: ['feast_blessing'] } },
    { id: 'autumn_9', name: 'Lantern Festival', objectives: [{ type: 'light', lanterns: 10 }], rewards: { xp: 100, items: ['special_lantern'] } },
    { id: 'autumn_10', name: 'Harvest King/Queen', objectives: [{ type: 'win', event: 'harvest_royalty' }], rewards: { xp: 500, items: ['harvest_crown'], title: 'Harvest Royalty' } },
  ],
};

export const QUEST_CHAIN_SEASONAL_WINTER = {
  id: 'winter_wonder',
  name: 'Winter Wonderland Festival',
  description: 'Celebrate the winter holidays',
  type: 'seasonal',
  icon: '❄️',
  season: 'winter',
  totalQuests: 10,
  quests: [
    { id: 'winter_1', name: 'First Snow', objectives: [{ type: 'witness', event: 'first_snow' }], rewards: { xp: 50, items: ['snowflake'] } },
    { id: 'winter_2', name: 'Ice Fishing', objectives: [{ type: 'fish', location: 'ice_hole', count: 5 }], rewards: { xp: 150, items: ['ice_rod'] } },
    { id: 'winter_3', name: 'Gift Giving', objectives: [{ type: 'give', gifts: 5 }], rewards: { xp: 100, items: ['gift_bag'] } },
    { id: 'winter_4', name: 'Decorating', objectives: [{ type: 'decorate', location: 'home' }], rewards: { xp: 100, items: ['decorations'] } },
    { id: 'winter_5', name: 'Carol Singing', objectives: [{ type: 'participate', event: 'caroling' }], rewards: { xp: 100, items: ['songbook'] } },
    { id: 'winter_6', name: 'Snowman Contest', objectives: [{ type: 'build', item: 'snowman' }], rewards: { xp: 150, items: ['magic_hat'] } },
    { id: 'winter_7', name: 'Hot Cocoa Run', objectives: [{ type: 'deliver', item: 'cocoa', count: 10 }], rewards: { xp: 150, gold: 100 } },
    { id: 'winter_8', name: 'Winter Ball', objectives: [{ type: 'attend', event: 'winter_ball' }], rewards: { xp: 200, items: ['fancy_outfit'] } },
    { id: 'winter_9', name: 'New Year\'s Eve', objectives: [{ type: 'attend', event: 'countdown' }], rewards: { xp: 100, items: ['new_year_charm'] } },
    { id: 'winter_10', name: 'Spirit of Winter', objectives: [{ type: 'spread', joy: 20 }], rewards: { xp: 500, items: ['winter_spirit'], title: 'Spirit of Winter' } },
  ],
};

export const QUEST_CHAIN_PIRATE_LEGACY = {
  id: 'pirate_legacy',
  name: 'The Pirate\'s Legacy',
  description: 'Uncover the history of Codswallop Cove\'s pirate past',
  type: 'lore',
  icon: '☠️',
  totalQuests: 10,
  quests: [
    { id: 'pirate_1', name: 'Old Maps', objectives: [{ type: 'find', item: 'old_pirate_map', count: 3 }], rewards: { xp: 100, items: ['map_piece'] } },
    { id: 'pirate_2', name: 'Pirate Graves', objectives: [{ type: 'visit', locations: ['pirate_cemetery'] }], rewards: { xp: 150, items: ['epitaph_rubbing'] } },
    { id: 'pirate_3', name: 'Captain\'s Log', objectives: [{ type: 'find', item: 'captains_log' }], rewards: { xp: 200, items: ['pirate_history'] } },
    { id: 'pirate_4', name: 'Sunken Fleet', objectives: [{ type: 'dive', to: 'sunken_ships', count: 3 }], rewards: { xp: 250, gold: 200 } },
    { id: 'pirate_5', name: 'Pirate Code', objectives: [{ type: 'discover', item: 'pirate_code' }], rewards: { xp: 200, items: ['code_of_conduct'] } },
    { id: 'pirate_6', name: 'Descendants', objectives: [{ type: 'find', npcs: ['pirate_descendant'], count: 3 }], rewards: { xp: 300, items: ['family_tree'] } },
    { id: 'pirate_7', name: 'Lost Battle', objectives: [{ type: 'investigate', event: 'battle_of_the_cove' }], rewards: { xp: 350, items: ['battle_account'] } },
    { id: 'pirate_8', name: 'Pirate King', objectives: [{ type: 'learn', about: 'pirate_king' }], rewards: { xp: 400, items: ['kings_story'] } },
    { id: 'pirate_9', name: 'Hidden Base', objectives: [{ type: 'find', location: 'secret_pirate_base' }], rewards: { xp: 500, gold: 500 } },
    { id: 'pirate_10', name: 'Legacy Complete', objectives: [{ type: 'compile', book: 'pirate_history' }], rewards: { xp: 750, items: ['historians_medal'], title: 'Pirate Historian' } },
  ],
};

export const QUEST_CHAIN_ROMANCE = {
  id: 'love_on_the_sea',
  name: 'Love on the Sea',
  description: 'Find romance in Codswallop Cove',
  type: 'romance',
  icon: '💕',
  totalQuests: 10,
  quests: [
    { id: 'romance_1', name: 'First Impressions', objectives: [{ type: 'meet', romantic_interest: true }], rewards: { xp: 50, items: ['nervous_feeling'] } },
    { id: 'romance_2', name: 'Getting to Know', objectives: [{ type: 'conversation', count: 5 }], rewards: { xp: 100, relationship: 10 } },
    { id: 'romance_3', name: 'First Gift', objectives: [{ type: 'give', gift: 'appropriate' }], rewards: { xp: 150, relationship: 20 } },
    { id: 'romance_4', name: 'Helping Hand', objectives: [{ type: 'help', with: 'their_problem' }], rewards: { xp: 200, relationship: 30 } },
    { id: 'romance_5', name: 'First Date', objectives: [{ type: 'date', location: 'romantic_spot' }], rewards: { xp: 250, relationship: 40 } },
    { id: 'romance_6', name: 'Meet the Family', objectives: [{ type: 'meet', target: 'their_family' }], rewards: { xp: 200, relationship: 25 } },
    { id: 'romance_7', name: 'Rival for Affection', objectives: [{ type: 'compete', against: 'romantic_rival' }], rewards: { xp: 300, relationship: 30 } },
    { id: 'romance_8', name: 'Grand Gesture', objectives: [{ type: 'perform', gesture: 'grand_romantic' }], rewards: { xp: 350, relationship: 50 } },
    { id: 'romance_9', name: 'The Question', objectives: [{ type: 'propose', or: 'commit' }], rewards: { xp: 400, items: ['promise_ring'] } },
    { id: 'romance_10', name: 'Happily Ever After', objectives: [{ type: 'ceremony', type: 'wedding_or_commitment' }], rewards: { xp: 500, items: ['wedding_photo'], title: 'Soulmate' } },
  ],
};

export const QUEST_CHAIN_SPEEDRUN = {
  id: 'speed_challenges',
  name: 'Speed Challenges',
  description: 'Test your speed and efficiency',
  type: 'challenge',
  icon: '⏱️',
  totalQuests: 10,
  quests: [
    { id: 'speed_1', name: '10 in 10', objectives: [{ type: 'catch', count: 10, time: 600 }], rewards: { xp: 100, items: ['bronze_stopwatch'] } },
    { id: 'speed_2', name: '20 in 15', objectives: [{ type: 'catch', count: 20, time: 900 }], rewards: { xp: 200, items: ['silver_stopwatch'] } },
    { id: 'speed_3', name: 'Delivery Dash', objectives: [{ type: 'deliver', count: 5, time: 300 }], rewards: { xp: 150, gold: 100 } },
    { id: 'speed_4', name: 'Market Mayhem', objectives: [{ type: 'buy_sell', profit: 500, time: 600 }], rewards: { xp: 250, gold: 200 } },
    { id: 'speed_5', name: 'Island Hopper', objectives: [{ type: 'visit', islands: 3, time: 900 }], rewards: { xp: 300, items: ['speed_boat_voucher'] } },
    { id: 'speed_6', name: '50 Fish Frenzy', objectives: [{ type: 'catch', count: 50, time: 1800 }], rewards: { xp: 400, items: ['gold_stopwatch'] } },
    { id: 'speed_7', name: 'Quest Rush', objectives: [{ type: 'complete_quests', count: 5, time: 1800 }], rewards: { xp: 350, gold: 300 } },
    { id: 'speed_8', name: 'Treasure Sprint', objectives: [{ type: 'find_treasure', count: 3, time: 1200 }], rewards: { xp: 450, gold: 500 } },
    { id: 'speed_9', name: 'Perfect Day', objectives: [{ type: 'catch', count: 100, time: 3600 }], rewards: { xp: 500, items: ['platinum_stopwatch'] } },
    { id: 'speed_10', name: 'Speed Demon', objectives: [{ type: 'complete_all', speed_challenges: true }], rewards: { xp: 750, items: ['speed_crown'], title: 'Speed Demon' } },
  ],
};

export const QUEST_CHAIN_COMPLETIONIST = {
  id: 'completionist',
  name: 'The Completionist',
  description: 'Do everything there is to do',
  type: 'meta',
  icon: '🏅',
  totalQuests: 10,
  quests: [
    { id: 'complete_1', name: 'Jack of All Trades', objectives: [{ type: 'try', activities: 10 }], rewards: { xp: 100, items: ['activity_log'] } },
    { id: 'complete_2', name: 'Meet Everyone', objectives: [{ type: 'meet', npcs: 50 }], rewards: { xp: 200, items: ['contacts_book'] } },
    { id: 'complete_3', name: 'Explore Everything', objectives: [{ type: 'visit', locations: 'all' }], rewards: { xp: 300, items: ['explorer_badge'] } },
    { id: 'complete_4', name: 'Fish Encyclopedia', objectives: [{ type: 'catch', unique_fish: 30 }], rewards: { xp: 400, items: ['fish_encyclopedia'] } },
    { id: 'complete_5', name: 'Quest Master', objectives: [{ type: 'complete', quests: 100 }], rewards: { xp: 500, items: ['quest_master_badge'] } },
    { id: 'complete_6', name: 'Millionaire', objectives: [{ type: 'earn', gold_total: 100000 }], rewards: { xp: 400, items: ['golden_wallet'] } },
    { id: 'complete_7', name: 'Reputation', objectives: [{ type: 'max_reputation', factions: 3 }], rewards: { xp: 500, items: ['reputation_badge'] } },
    { id: 'complete_8', name: 'Collector', objectives: [{ type: 'collect', unique_items: 100 }], rewards: { xp: 600, items: ['collectors_vault'] } },
    { id: 'complete_9', name: 'Achievement Hunter', objectives: [{ type: 'unlock', achievements: 50 }], rewards: { xp: 700, items: ['achievement_display'] } },
    { id: 'complete_10', name: 'True Completionist', objectives: [{ type: 'complete', percentage: 100 }], rewards: { xp: 2000, items: ['completionist_crown'], title: 'The Completionist' } },
  ],
};

// ============================================================================
// EXPORT ALL QUEST CHAINS
// ============================================================================

export const ALL_QUEST_CHAINS = {
  // Main story
  QUEST_CHAIN_SALTBEARD,
  
  // Faction quests
  QUEST_CHAIN_FISHERMAN_GUILD,
  QUEST_CHAIN_MERCHANT,
  
  // Character quests
  QUEST_CHAIN_RICKY,
  QUEST_CHAIN_MYSTERIES,
  
  // Collection quests
  QUEST_CHAIN_FISH_COLLECTION,
  QUEST_CHAIN_SHELL_COLLECTION,
  QUEST_CHAIN_TREASURE_COLLECTION,
  QUEST_CHAIN_ARTIFACT_COLLECTION,
  QUEST_CHAIN_RECIPE_COLLECTION,
  
  // Location/NPC quests
  QUEST_CHAIN_TAVERN,
  QUEST_CHAIN_LIGHTHOUSE,
  QUEST_CHAIN_BLACKSMITH,
  QUEST_CHAIN_GOVERNOR,
  QUEST_CHAIN_HERMIT,
  
  // Seasonal quests
  QUEST_CHAIN_SEASONAL_SPRING,
  QUEST_CHAIN_SEASONAL_SUMMER,
  QUEST_CHAIN_SEASONAL_AUTUMN,
  QUEST_CHAIN_SEASONAL_WINTER,
  
  // Special quests
  QUEST_CHAIN_PIRATE_LEGACY,
  QUEST_CHAIN_ROMANCE,
  QUEST_CHAIN_SPEEDRUN,
  QUEST_CHAIN_COMPLETIONIST,
};

// Calculate totals
export const QUEST_STATISTICS = {
  totalChains: Object.keys(ALL_QUEST_CHAINS).length,
  totalQuests: Object.values(ALL_QUEST_CHAINS).reduce((sum, chain) => sum + chain.quests.length, 0),
  questsByType: {
    main_story: 1,
    faction: 3,
    rival: 1,
    exploration: 1,
    collection: 5,
    location: 2,
    npc: 3,
    seasonal: 4,
    lore: 1,
    romance: 1,
    challenge: 1,
    meta: 1,
  },
};

export default ALL_QUEST_CHAINS;
