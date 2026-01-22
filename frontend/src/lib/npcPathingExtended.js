/**
 * ============================================================================
 * NPC PATHING EXTENDED - Additional 600+ Lines
 * ============================================================================
 * Extended NPC behaviors, dialogue trees, and interaction systems
 * ============================================================================
 */

// ============================================================================
// SECTION 1: EXTENDED NPC DEFINITIONS
// ============================================================================

export const NPC_DEFINITIONS = {
  // Main story NPCs
  story_npcs: {
    harbor_master_hank: {
      id: 'harbor_master_hank',
      name: 'Harbor Master Hank',
      title: 'Harbor Master',
      icon: '⚓',
      description: 'The gruff but fair overseer of Barnacle Bay docks',
      personality: ['gruff', 'fair', 'experienced', 'protective'],
      schedule: 'merchant',
      home: 'harbor_office',
      workplace: 'dock_main',
      relationships: { player: 'neutral', governor: 'respectful', ricky: 'disapproving' },
      questGiver: true,
      shopkeeper: false,
      dialoguePool: 'harbor_master',
      voiceType: 'deep_gravelly',
      appearance: {
        age: 'elderly',
        build: 'stocky',
        hair: 'grey_balding',
        features: ['weathered_face', 'anchor_tattoo', 'pipe'],
        outfit: 'harbor_master_uniform',
      },
    },
    
    old_pete: {
      id: 'old_pete',
      name: 'Old Pete',
      title: 'Legendary Fisherman',
      icon: '🎣',
      description: 'The oldest and wisest fisherman in the cove',
      personality: ['wise', 'patient', 'storyteller', 'mysterious'],
      schedule: 'fisherman',
      home: 'fisherman_hut_1',
      workplace: 'pier_end_1',
      relationships: { player: 'mentor', saltbeard: 'knows_secret' },
      questGiver: true,
      shopkeeper: false,
      dialoguePool: 'old_fisherman',
      voiceType: 'raspy_old',
      appearance: {
        age: 'ancient',
        build: 'thin',
        hair: 'long_white',
        features: ['eye_patch', 'missing_teeth', 'fishing_hat'],
        outfit: 'tattered_fisher_clothes',
      },
      secrets: ['knows_saltbeard_location', 'taught_ricky'],
    },
    
    razor_ricky: {
      id: 'razor_ricky',
      name: 'Razor Ricky Sharkbait',
      title: 'Champion Fisher / Rival',
      icon: '🦈',
      description: 'Your arrogant rival who thinks he is the best',
      personality: ['arrogant', 'competitive', 'secretly_insecure', 'skilled'],
      schedule: 'rival',
      home: 'fancy_boat',
      workplace: 'varies',
      relationships: { player: 'rival', old_pete: 'former_student', governor: 'sycophant' },
      questGiver: false,
      shopkeeper: false,
      dialoguePool: 'rival',
      voiceType: 'cocky',
      appearance: {
        age: 'young_adult',
        build: 'athletic',
        hair: 'slicked_back_black',
        features: ['shark_tooth_necklace', 'smirk', 'expensive_watch'],
        outfit: 'designer_fishing_gear',
      },
      rivalry: {
        currentScore: { player: 0, ricky: 0 },
        competitionTypes: ['fishing', 'races', 'treasure_hunting'],
        respectThreshold: 10,
      },
    },
    
    governor_fancypants: {
      id: 'governor_fancypants',
      name: 'Lord Reginald Fancypants III',
      title: 'Governor of Codswallop Cove',
      icon: '👑',
      description: 'The pompous but ultimately good-hearted governor',
      personality: ['pompous', 'secretly_kind', 'collector', 'anxious'],
      schedule: 'noble',
      home: 'governor_mansion',
      workplace: 'governor_mansion',
      relationships: { player: 'dismissive_to_friendly', saltbeard: 'knows_history' },
      questGiver: true,
      shopkeeper: false,
      dialoguePool: 'noble',
      voiceType: 'posh_british',
      appearance: {
        age: 'middle_aged',
        build: 'portly',
        hair: 'powdered_wig',
        features: ['monocle', 'handlebar_mustache', 'rings'],
        outfit: 'governor_finery',
      },
    },
    
    mermaid_queen_coralia: {
      id: 'mermaid_queen_coralia',
      name: 'Queen Coralia',
      title: 'Queen of the Merfolk',
      icon: '🧜‍♀️',
      description: 'The mystical ruler of the underwater realm',
      personality: ['regal', 'mysterious', 'ancient', 'playful'],
      schedule: 'mermaid',
      home: 'underwater_palace',
      workplace: 'probably_magical_lagoon',
      relationships: { player: 'curious', sea_god: 'daughter' },
      questGiver: true,
      shopkeeper: true,
      dialoguePool: 'mystical',
      voiceType: 'ethereal',
      appearance: {
        age: 'ageless',
        build: 'graceful',
        hair: 'flowing_sea_green',
        features: ['scales', 'crown', 'glowing_eyes'],
        outfit: 'seashell_regalia',
      },
      specialAbilities: ['grant_underwater_breathing', 'summon_sea_creatures'],
    },
    
    sea_witch_morgana: {
      id: 'sea_witch_morgana',
      name: 'Morgana',
      title: 'The Sea Witch',
      icon: '🧙‍♀️',
      description: 'A mysterious witch who lives in a hidden cove',
      personality: ['cryptic', 'helpful', 'mischievous', 'lonely'],
      schedule: 'hermit',
      home: 'sea_witch_hut',
      workplace: 'sea_witch_hut',
      relationships: { player: 'neutral', mermaid_queen: 'rival' },
      questGiver: true,
      shopkeeper: true,
      dialoguePool: 'witch',
      voiceType: 'cackling',
      appearance: {
        age: 'ancient',
        build: 'hunched',
        hair: 'wild_grey',
        features: ['warts', 'glowing_eyes', 'tentacle_pet'],
        outfit: 'seaweed_robes',
      },
      services: ['curses', 'blessings', 'potions', 'fortunes'],
    },
  },
  
  // Town NPCs
  town_npcs: {
    barkeep_bella: {
      id: 'barkeep_bella',
      name: 'Bella Barrelhouse',
      title: 'Tavern Keeper',
      icon: '🍺',
      personality: ['friendly', 'gossip', 'protective', 'flirty'],
      schedule: 'tavern_keeper',
      home: 'room_1',
      workplace: 'tavern',
      questGiver: true,
      shopkeeper: true,
      dialoguePool: 'tavern_keeper',
    },
    
    blacksmith_bruno: {
      id: 'blacksmith_bruno',
      name: 'Bruno Ironarm',
      title: 'Master Blacksmith',
      icon: '⚒️',
      personality: ['strong_silent', 'perfectionist', 'kind'],
      schedule: 'blacksmith',
      home: 'blacksmith_quarters',
      workplace: 'blacksmith',
      questGiver: true,
      shopkeeper: true,
      dialoguePool: 'craftsman',
    },
    
    merchant_marco: {
      id: 'merchant_marco',
      name: 'Marco Goldtooth',
      title: 'Merchant Prince',
      icon: '💰',
      personality: ['shrewd', 'charismatic', 'greedy', 'fair'],
      schedule: 'merchant',
      home: 'merchant_house',
      workplace: 'market_district',
      questGiver: true,
      shopkeeper: true,
      dialoguePool: 'merchant',
    },
    
    fishmonger_fiona: {
      id: 'fishmonger_fiona',
      name: 'Fiona Fishwife',
      title: 'Fish Market Owner',
      icon: '🐟',
      personality: ['loud', 'honest', 'hardworking', 'motherly'],
      schedule: 'merchant',
      home: 'fishmonger_house',
      workplace: 'fish_market',
      questGiver: true,
      shopkeeper: true,
      dialoguePool: 'fishmonger',
    },
    
    priest_patrick: {
      id: 'priest_patrick',
      name: 'Father Patrick',
      title: 'Town Priest',
      icon: '⛪',
      personality: ['kind', 'wise', 'conflicted', 'forgiving'],
      schedule: 'priest',
      home: 'church_quarters',
      workplace: 'church',
      questGiver: true,
      shopkeeper: false,
      dialoguePool: 'religious',
      services: ['blessing', 'confession', 'wedding'],
    },
    
    guard_captain_gordon: {
      id: 'guard_captain_gordon',
      name: 'Captain Gordon',
      title: 'Captain of the Guard',
      icon: '⚔️',
      personality: ['dutiful', 'stern', 'honorable', 'tired'],
      schedule: 'guard_captain',
      home: 'barracks',
      workplace: 'varies',
      questGiver: true,
      shopkeeper: false,
      dialoguePool: 'guard',
    },
  },
  
  // Random/ambient NPCs
  ambient_npcs: {
    fisher_types: ['eager_novice', 'grumpy_veteran', 'lucky_amateur', 'unlucky_pro'],
    merchant_types: ['honest_seller', 'sneaky_dealer', 'exotic_trader', 'struggling_vendor'],
    sailor_types: ['jolly_sailor', 'superstitious_sailor', 'retired_pirate', 'navy_deserter'],
    child_types: ['adventurous', 'shy', 'troublemaker', 'dreamer'],
    tourist_types: ['wealthy_tourist', 'backpacker', 'researcher', 'artist'],
  },
};

// ============================================================================
// SECTION 2: DIALOGUE TREES
// ============================================================================

export const DIALOGUE_TREES = {
  old_pete_intro: {
    id: 'old_pete_intro',
    speaker: 'old_pete',
    nodes: {
      start: {
        text: 'Well, well... another young soul come to try their luck at fishing, eh? *squints* You have the look of someone searching for more than just fish.',
        responses: [
          { text: 'How did you know?', next: 'knows_things' },
          { text: 'I\'m just here to fish.', next: 'just_fishing' },
          { text: 'Tell me about Saltbeard\'s treasure.', next: 'saltbeard_direct', requires: { heard_rumor: true } },
        ],
      },
      knows_things: {
        text: '*chuckles* Old Pete knows many things. Been fishing these waters for sixty years. The sea tells me secrets. So... what brings you to Codswallop Cove?',
        responses: [
          { text: 'I heard there\'s treasure here.', next: 'treasure_mention' },
          { text: 'I want to become a great fisher.', next: 'fisher_path' },
          { text: 'Just passing through.', next: 'passing_through' },
        ],
      },
      just_fishing: {
        text: 'Hmph. If you say so. But I\'ve seen that look before. Tell you what - catch me five fish, any kind, and maybe I\'ll share some... wisdom.',
        responses: [
          { text: 'Deal! [Accept Quest]', next: 'quest_accepted', action: 'start_quest_saltbeard_2' },
          { text: 'What kind of wisdom?', next: 'wisdom_hint' },
          { text: 'Maybe later.', next: 'end' },
        ],
      },
      treasure_mention: {
        text: '*leans in* Treasure, you say? *looks around* Not here, lad. Too many ears. Prove yourself to me first. Bring me five fish - show me you\'ve got patience.',
        responses: [
          { text: 'I\'ll do it. [Accept Quest]', next: 'quest_accepted', action: 'start_quest_saltbeard_2' },
          { text: 'Why should I trust you?', next: 'trust_question' },
        ],
      },
      quest_accepted: {
        text: 'Good, good. The pier over there is a fine spot for beginners. Use this rod - it belonged to... an old friend. Come back when you\'ve caught five.',
        responses: [
          { text: 'Thank you, Pete.', next: 'end', action: 'give_item_basic_rod' },
        ],
        giveItem: 'basic_rod',
      },
      end: {
        text: 'Now off with you. The fish won\'t catch themselves. *returns to staring at the sea*',
        responses: [],
        endConversation: true,
      },
    },
  },
  
  ricky_first_encounter: {
    id: 'ricky_first_encounter',
    speaker: 'razor_ricky',
    nodes: {
      start: {
        text: '*looks you up and down* Well, well, well. What do we have here? Another wannabe fisher come to embarrass themselves?',
        responses: [
          { text: 'Who are you?', next: 'introduction' },
          { text: 'I could outfish you any day.', next: 'challenge_accepted' },
          { text: '*walk away*', next: 'walk_away' },
        ],
      },
      introduction: {
        text: '*flips hair* You don\'t know who I am? I\'m Razor Ricky Sharkbait, three-time Fishing Champion of Codswallop Cove! And you are... nobody.',
        responses: [
          { text: 'We\'ll see about that.', next: 'threat_noted' },
          { text: 'Nice to meet you, Ricky.', next: 'nice_response' },
          { text: 'Whatever.', next: 'dismissive' },
        ],
      },
      challenge_accepted: {
        text: '*laughs* Oh, this is rich! You? Outfish ME? Tell you what, newbie. One week from now. Pier fishing. Winner takes the loser\'s best rod. Deal?',
        responses: [
          { text: 'You\'re on! [Accept Challenge]', next: 'deal_made', action: 'schedule_competition' },
          { text: 'I need more time to prepare.', next: 'coward_response' },
          { text: 'What\'s in it for me?', next: 'stakes_discussion' },
        ],
      },
      threat_noted: {
        text: '*smirk widens* Oh, I like this one. Got some fire. But fire doesn\'t catch fish, sweetheart. Skill does. And I\'ve got plenty.',
        responses: [
          { text: 'Prove it. Challenge me.', next: 'challenge_accepted' },
          { text: 'We\'ll see who\'s laughing later.', next: 'end_confrontational' },
        ],
      },
      walk_away: {
        text: '*calls after you* That\'s right, walk away! Smart move! This town only has room for ONE fishing champion!',
        responses: [],
        endConversation: true,
        setFlag: 'ricky_walked_away',
      },
      end_confrontational: {
        text: '*watches you leave with a mix of amusement and something else... respect?* We\'ll see indeed...',
        responses: [],
        endConversation: true,
        setFlag: 'ricky_rival_established',
      },
    },
  },
  
  merchant_haggling: {
    id: 'merchant_haggling',
    speaker: 'merchant_marco',
    nodes: {
      start: {
        text: 'Ah, my friend! You have excellent taste! This [ITEM] is worth every gold piece. Only [PRICE] gold!',
        responses: [
          { text: 'I\'ll take it. [Pay Full Price]', next: 'full_price', action: 'purchase_full' },
          { text: 'That seems a bit high...', next: 'haggle_start', requires: { skill: 'haggling', level: 1 } },
          { text: 'No thanks.', next: 'decline' },
        ],
      },
      haggle_start: {
        text: '*clutches chest* You wound me! This is already below my cost! But... *sighs* ...for a valued customer, perhaps [PRICE-10%]?',
        responses: [
          { text: 'Still too much. [PRICE-20%]?', next: 'haggle_push', requires: { skill: 'haggling', level: 5 } },
          { text: 'Deal. [Pay Discounted]', next: 'haggle_accept', action: 'purchase_discount_10' },
          { text: 'Forget it.', next: 'haggle_walk_away' },
        ],
      },
      haggle_push: {
        text: '*sweating* My friend, you are killing me here! My children will starve! But... *grits teeth* ...FINE. [PRICE-15%]. Final offer!',
        responses: [
          { text: 'Perfect. [Pay]', next: 'haggle_success', action: 'purchase_discount_15' },
          { text: 'I can do better elsewhere.', next: 'haggle_bluff', skillCheck: { skill: 'haggling', difficulty: 15 } },
        ],
      },
      haggle_success: {
        text: '*hands over item* You drive a hard bargain, my friend. I respect that. Come back anytime... just not too often, eh?',
        responses: [],
        endConversation: true,
        relationshipChange: { merchant_marco: 5 },
      },
    },
  },
};

// ============================================================================
// SECTION 3: NPC REACTION SYSTEM
// ============================================================================

export const NPC_REACTIONS = {
  // Reactions to player actions
  player_actions: {
    caught_legendary_fish: {
      nearby_reaction: 'amazed',
      dialogue: ['By the sea! Is that a [FISH]?!', 'I\'ve never seen one that big!', 'The legends were true!'],
      relationshipBoost: 5,
      spreadGossip: true,
    },
    won_competition: {
      nearby_reaction: 'impressed',
      dialogue: ['Well done!', 'A new champion rises!', 'Incredible performance!'],
      relationshipBoost: 10,
      rivalReaction: 'bitter',
    },
    helped_npc: {
      target_reaction: 'grateful',
      dialogue: ['Thank you so much!', 'I won\'t forget this!', 'You\'re a true friend!'],
      relationshipBoost: 15,
    },
    stole_item: {
      witness_reaction: 'shocked',
      dialogue: ['Thief! Someone stop them!', 'I saw that!', 'Guards! GUARDS!'],
      relationshipPenalty: 30,
      alertGuards: true,
    },
    fell_in_water: {
      nearby_reaction: 'amused',
      dialogue: ['Hahaha! Watch your step!', '*points and laughs*', 'Need a hand there, friend?'],
      relationshipChange: -2,
    },
  },
  
  // Reactions to world events
  world_events: {
    storm_approaching: {
      reaction: 'concerned',
      actions: ['seek_shelter', 'secure_belongings', 'warn_others'],
      dialogue: ['Storm\'s coming! Best get inside!', 'Dark clouds on the horizon...'],
    },
    festival_day: {
      reaction: 'excited',
      actions: ['attend_festival', 'celebrate', 'dance'],
      dialogue: ['What a wonderful day!', 'Have you tried the festival food?'],
    },
    ghost_ship_sighting: {
      reaction: 'fearful',
      actions: ['flee_docks', 'pray', 'hide'],
      dialogue: ['Did you see that?!', 'The ghost ship! It\'s real!', 'We\'re all doomed!'],
    },
  },
  
  // Reactions based on relationship level
  relationship_based: {
    stranger: {
      greeting_chance: 0.2,
      help_chance: 0.1,
      share_secret_chance: 0.0,
      default_mood: 'neutral',
    },
    acquaintance: {
      greeting_chance: 0.5,
      help_chance: 0.3,
      share_secret_chance: 0.05,
      default_mood: 'friendly',
    },
    friend: {
      greeting_chance: 0.8,
      help_chance: 0.6,
      share_secret_chance: 0.2,
      default_mood: 'warm',
      gifts_allowed: true,
    },
    close_friend: {
      greeting_chance: 1.0,
      help_chance: 0.9,
      share_secret_chance: 0.5,
      default_mood: 'happy',
      gifts_allowed: true,
      special_dialogue: true,
    },
    romantic: {
      greeting_chance: 1.0,
      help_chance: 1.0,
      share_secret_chance: 0.8,
      default_mood: 'loving',
      gifts_allowed: true,
      special_dialogue: true,
      date_options: true,
    },
  },
};

// ============================================================================
// SECTION 4: NPC GIFT PREFERENCES
// ============================================================================

export const NPC_GIFT_PREFERENCES = {
  old_pete: {
    loved: ['legendary_fish', 'old_fishing_lure', 'sea_stories_book', 'aged_rum'],
    liked: ['any_rare_fish', 'fishing_supplies', 'warm_soup'],
    neutral: ['common_fish', 'bread', 'fruit'],
    disliked: ['modern_gadgets', 'loud_things'],
    hated: ['pollution', 'motorboat_fuel'],
    dialogue: {
      loved: 'Well I\'ll be... this brings back memories. Thank you, truly.',
      liked: 'Ah, very thoughtful of you. Much appreciated.',
      neutral: 'Hmm. Thanks, I suppose.',
      disliked: 'This... isn\'t really my thing.',
      hated: 'Get this away from me. The sea doesn\'t approve.',
    },
  },
  
  barkeep_bella: {
    loved: ['rare_wine', 'exotic_spices', 'romantic_novel', 'gold_jewelry'],
    liked: ['any_alcohol', 'flowers', 'fresh_fish', 'cooking_ingredients'],
    neutral: ['common_items', 'coins'],
    disliked: ['smelly_fish', 'weapons'],
    hated: ['rotten_food', 'cheap_booze'],
    dialogue: {
      loved: 'Oh my! You really know how to make a girl smile!',
      liked: 'How sweet of you! This\'ll come in handy.',
      neutral: 'Oh, thanks.',
      disliked: 'Um... thanks? I guess?',
      hated: 'What is this garbage? Get it out of my tavern!',
    },
  },
  
  razor_ricky: {
    loved: ['legendary_fishing_rod', 'championship_trophy', 'expensive_cologne', 'gold_watch'],
    liked: ['high_quality_gear', 'rare_fish', 'expensive_items'],
    neutral: ['average_gear', 'common_items'],
    disliked: ['cheap_items', 'second_hand_goods'],
    hated: ['anything_better_than_his', 'participation_trophies'],
    dialogue: {
      loved: '*tries to hide being impressed* ...Not bad. Not bad at all.',
      liked: 'Hm. Acceptable.',
      neutral: 'Is this supposed to impress me?',
      disliked: '*scoffs* You expect me to accept THIS?',
      hated: 'Are you MOCKING me?!',
    },
  },
  
  governor_fancypants: {
    loved: ['rare_artifact', 'exotic_fish_mounted', 'fine_art', 'royal_correspondence'],
    liked: ['expensive_items', 'collectibles', 'fine_wine'],
    neutral: ['decent_quality_items'],
    disliked: ['common_items', 'dirty_things'],
    hated: ['peasant_food', 'manual_labor_tools'],
    dialogue: {
      loved: 'Exquisite! This shall have a place of honor in my collection!',
      liked: 'Hmm, not bad. I suppose you have SOME taste.',
      neutral: 'How... adequate.',
      disliked: 'Is this a joke?',
      hated: 'How DARE you present this to a man of my station!',
    },
  },
};

// Export all
export default {
  NPC_DEFINITIONS,
  DIALOGUE_TREES,
  NPC_REACTIONS,
  NPC_GIFT_PREFERENCES,
};
