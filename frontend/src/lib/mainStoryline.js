/**
 * MAIN STORYLINE & RIVAL SYSTEM
 * The epic tale of becoming the greatest fisher in the Seven Seas
 * Featuring: Your rival "Razor" Ricky - the most annoying pirate you'll ever meet
 */

// ============================================================================
// RIVAL CHARACTER - "Razor" Ricky Sharkbait  
// ============================================================================

export const RIVAL_NPC = {
  id: 'razor_ricky',
  name: '"Razor" Ricky Sharkbait',
  title: 'Your Insufferably Perfect Rival',
  portrait: '🦈',
  personality: 'arrogant_competitive',
  description: "Hair: perfect. Teeth: suspiciously white. Ego: visible from space. He's determined to out-fish you in EVERYTHING.",
  
  // Rival appears in every major city/area
  appearances: {
    harbor_square: { x: 85, y: 35, phase: 'intro' },
    merchant_quarter: { x: 60, y: 45, phase: 'chapter1' },
    governors_manor: { x: 65, y: 55, phase: 'chapter2' },
    lighthouse: { x: 55, y: 65, phase: 'chapter3' },
    mermaid_lagoon: { x: 45, y: 40, phase: 'chapter4' },
    treasure_chamber: { x: 50, y: 30, phase: 'finale' }
  },
  
  // Rival dialogues change based on story progress
  dialogues: {
    intro: {
      text: "*hair flips in nonexistent wind* Oh LOOK. A new fisher. How... quaint. I'm Ricky. 'Razor' Ricky Sharkbait. Memorize it - you'll be yelling it in frustration VERY soon.",
      options: [
        { text: "I'll make YOU memorize MY name when I win.", nextDialogue: 'challenge_accepted', mood: 'confident', relationshipChange: -5 },
        { text: "Your hair moved. There's no wind...", nextDialogue: 'polite_response', mood: 'neutral' },
        { text: "Why 'Razor'? Did you cut yourself shaving?", nextDialogue: 'razor_origin', mood: 'curious' },
        { text: "*walks away dramatically*", nextDialogue: null, mood: 'dismissive' }
      ]
    },
    challenge_accepted: {
      text: "*laughs* Oh, I LIKE you! You've got spirit. Too bad spirit doesn't catch fish. Tell you what - beat my catch record at any fishing spot, and I'll admit you're... not completely terrible.",
      startsQuest: 'rival_challenge_1',
      options: [
        { text: "You're on!", nextDialogue: 'goodbye_rival', mood: 'determined' },
        { text: "What's the record?", nextDialogue: 'record_info', mood: 'strategic' }
      ]
    },
    polite_response: {
      text: "Polite? How boring. Where's your FIRE? Your PASSION? Your completely irrational confidence? ...Fine, be nice. See where it gets you. Spoiler: nowhere I haven't already been.",
      options: [
        { text: "Maybe I'll surprise you.", nextDialogue: 'challenge_accepted', mood: 'mysterious' },
        { text: "We'll see.", nextDialogue: 'goodbye_rival', mood: 'calm' }
      ]
    },
    razor_origin: {
      text: "*poses dramatically* Because I'm SHARP! Quick reflexes, quicker wit, and I cut through the competition like... well, a razor. Also, I once caught a shark bare-handed. That helped.",
      options: [
        { text: "Impressive. But can you beat ME?", nextDialogue: 'challenge_accepted', mood: 'competitive' },
        { text: "A shark? Really?", nextDialogue: 'shark_story', mood: 'skeptical' }
      ]
    },
    shark_story: {
      text: "Would I lie? *pause* Yes. But not about THIS. Ask anyone at the Salty Barnacle. Ask the shark! Well, he's a rug now, but the point stands.",
      options: [
        { text: "I'm going to check that story.", nextDialogue: 'goodbye_rival', mood: 'investigative' },
        { text: "Whatever. Let's compete.", nextDialogue: 'challenge_accepted', mood: 'dismissive' }
      ]
    },
    // Chapter 1 - After player's first victory
    chapter1_loss: {
      text: "*jaw drops* You... you actually beat my record?! That's... that's... BEGINNER'S LUCK! Obviously! Next time, I'll be ready!",
      advancesStory: 'chapter2',
      options: [
        { text: "Luck? I'm just better.", nextDialogue: 'taunt_back', mood: 'smug' },
        { text: "Good game, Ricky.", nextDialogue: 'sportsmanship', mood: 'gracious' }
      ]
    },
    chapter1_win: {
      text: "*polishes nails* See? Easy. Don't feel bad - most people can't keep up. Maybe try knitting? I hear it's relaxing.",
      options: [
        { text: "Rematch. Now.", nextDialogue: 'rematch_request', mood: 'angry' },
        { text: "I'll beat you next time.", nextDialogue: 'goodbye_rival', mood: 'determined' }
      ]
    },
    // Chapter 2 - Merchant Quarter encounter
    chapter2_encounter: {
      text: "*counting gold coins* Oh, it's you again! Here to watch how a REAL fisher does business? Marina here gives ME the best prices. We have... an arrangement.",
      options: [
        { text: "What kind of arrangement?", nextDialogue: 'arrangement_reveal', mood: 'suspicious' },
        { text: "I'll earn better prices through skill.", nextDialogue: 'skill_response', mood: 'confident' },
        { text: "Are you bribing shopkeepers?", nextDialogue: 'bribe_accusation', mood: 'accusatory' }
      ]
    },
    arrangement_reveal: {
      text: "*whispers* Between us? I bring her rare fish first. She gives me discounts. It's not cheating - it's... NETWORKING. You should try it. Oh wait, you don't have rare fish to offer!",
      givesHint: 'rare_fish_trading',
      options: [
        { text: "I'll find rarer fish than you ever have.", nextDialogue: 'goodbye_rival', mood: 'determined' }
      ]
    },
    // Chapter 3 - Lighthouse
    chapter3_encounter: {
      text: "*looking through telescope* The stars never lie, you know. And they're telling me something interesting... There's a legendary fish out there. And I'M going to catch it first.",
      advancesQuest: 'legendary_fish_hunt',
      options: [
        { text: "What legendary fish?", nextDialogue: 'legendary_info', mood: 'interested' },
        { text: "Not if I catch it first!", nextDialogue: 'race_begins', mood: 'competitive' }
      ]
    },
    legendary_info: {
      text: "The Starlight Leviathan. Appears once every blue moon in the deepest waters. Worth more than this entire island. Eleanor here has been tracking its pattern... haven't you, dear?",
      options: [
        { text: "Eleanor, is this true?", nextDialogue: 'eleanor_confirm', mood: 'seeking_confirmation' },
        { text: "That fish is MINE.", nextDialogue: 'race_begins', mood: 'determined' }
      ]
    },
    // Chapter 4 - Mermaid Lagoon
    chapter4_encounter: {
      text: "*dripping wet, seaweed in hair* Don't. Say. A word. The mermaids and I had a... disagreement. About who's more beautiful. I maintain my position.",
      options: [
        { text: "*laughs uncontrollably*", nextDialogue: 'laugh_response', mood: 'amused' },
        { text: "Need help?", nextDialogue: 'offer_help', mood: 'helpful' },
        { text: "What did you learn about the Heart?", nextDialogue: 'heart_info', mood: 'focused' }
      ]
    },
    laugh_response: {
      text: "*glares* Fine. Laugh. But I learned something while being 'escorted' out. The Mermaid's Heart? It's real. And it's NOT where everyone thinks. Good luck finding it without my intel!",
      options: [
        { text: "Tell me what you know.", nextDialogue: 'heart_trade', mood: 'serious' },
        { text: "I'll find it myself.", nextDialogue: 'goodbye_rival', mood: 'independent' }
      ]
    },
    offer_help: {
      text: "*surprised* You'd... help me? *suspicious* What's the angle? Nobody helps 'Razor' Ricky without wanting something... *softens slightly* ...Fine. Maybe you're not completely terrible. MAYBE.",
      relationshipChange: 10,
      options: [
        { text: "No angle. Just being decent.", nextDialogue: 'kindness_response', mood: 'sincere' }
      ]
    },
    kindness_response: {
      text: "*awkward silence* ...The Heart is in the underwater caves. But you need the mermaids' blessing to enter. I was trying to... charm my way in. Apparently my charm is 'lacking.' Their words.",
      advancesQuest: 'mermaids_heart_quest',
      givesItem: 'ricky_map_fragment',
      options: [
        { text: "Thanks, Ricky. Good luck drying off.", nextDialogue: 'goodbye_rival', mood: 'friendly' }
      ]
    },
    // Finale - Treasure Chamber
    finale_encounter: {
      text: "*standing before the final treasure* Well. Here we are. Both of us. After everything... you actually made it. I'm impressed. I HATE being impressed.",
      options: [
        { text: "We don't have to fight over this.", nextDialogue: 'peace_offer', mood: 'diplomatic' },
        { text: "Only one of us is leaving with that treasure.", nextDialogue: 'final_competition', mood: 'competitive' },
        { text: "How about we share?", nextDialogue: 'share_proposal', mood: 'generous' }
      ]
    },
    peace_offer: {
      text: "*considers* You know what? You've earned my respect. Not many people can say that. *extends hand* Truce? There's enough glory in these seas for both of us. Maybe.",
      relationshipChange: 20,
      endsRivalry: 'friendship',
      options: [
        { text: "*shakes hand* Truce.", nextDialogue: 'friendship_ending', mood: 'warm' }
      ]
    },
    final_competition: {
      text: "*grins* NOW we're talking! One final fishing contest. Right here, right now. Winner takes the treasure. Loser buys drinks. FOR LIFE.",
      startsQuest: 'final_showdown',
      options: [
        { text: "Deal!", nextDialogue: 'final_battle_start', mood: 'excited' }
      ]
    },
    share_proposal: {
      text: "*blinks* Share? SHARE?! That's the most... *pauses* ...mature thing anyone's ever suggested to me. I hate it. But also... I respect it. *sighs* Fine. Partners?",
      relationshipChange: 15,
      endsRivalry: 'partnership',
      options: [
        { text: "Partners.", nextDialogue: 'partnership_ending', mood: 'agreeable' }
      ]
    },
    goodbye_rival: {
      text: "*flips hair dramatically* Until next time! Try to keep up! ...Please. The competition is what keeps me going. *vulnerable moment* I mean— BYE!",
      options: []
    }
  }
};

// ============================================================================
// MAIN STORY ARC - The Legend of Saltbeard's Legacy
// ============================================================================

export const MAIN_STORY = {
  title: "The Legend of Saltbeard's Legacy",
  
  prologue: {
    id: 'prologue',
    name: "A Fisher's Beginning",
    description: "Every legend starts somewhere. Yours starts in Saltbeard's Cove, with nothing but a dream and a borrowed fishing rod.",
    objectives: [
      { id: 'arrive', text: "Arrive at Saltbeard's Cove", completed: false },
      { id: 'meet_finley', text: "Meet Finley the Fish Merchant", completed: false },
      { id: 'first_catch', text: "Catch your first fish", completed: false },
      { id: 'meet_rival', text: "Encounter your rival, 'Razor' Ricky", completed: false }
    ],
    rewards: { gold: 100, xp: 500, item: 'apprentice_rod' },
    nextChapter: 'chapter1'
  },
  
  chapter1: {
    id: 'chapter1',
    name: "Rising Tides",
    description: "Word spreads of your fishing skills. But to prove yourself, you must beat Ricky's legendary catch record.",
    objectives: [
      { id: 'beat_record', text: "Beat Ricky's catch record at Sunny Lake", completed: false },
      { id: 'earn_reputation', text: "Earn reputation with the Harbor merchants", completed: false },
      { id: 'discover_secret', text: "Discover the secret of the old lighthouse", completed: false },
      { id: 'gather_intel', text: "Gather information about Saltbeard's treasure", completed: false }
    ],
    rivalEncounter: {
      location: 'merchant_quarter',
      condition: 'after_beat_record'
    },
    rewards: { gold: 500, xp: 2000, item: 'journeyman_rod' },
    nextChapter: 'chapter2'
  },
  
  chapter2: {
    id: 'chapter2',
    name: "Depths of Deception",
    description: "The Governor is hiding something, and Ricky seems involved. Unravel the conspiracy while chasing legendary catches.",
    objectives: [
      { id: 'infiltrate_manor', text: "Investigate the Governor's Manor", completed: false },
      { id: 'shadow_meeting', text: "Witness the shadow merchant's meeting", completed: false },
      { id: 'legendary_hunt', text: "Begin the hunt for the Starlight Leviathan", completed: false },
      { id: 'rival_race', text: "Race Ricky to the legendary fish", completed: false }
    ],
    rivalEncounter: {
      location: 'lighthouse',
      condition: 'after_shadow_meeting'
    },
    rewards: { gold: 1000, xp: 5000, item: 'master_rod' },
    nextChapter: 'chapter3'
  },
  
  chapter3: {
    id: 'chapter3',
    name: "The Mermaid's Bargain",
    description: "The path to the ultimate treasure leads through Mermaid Lagoon. But the mermaids don't give their secrets freely...",
    objectives: [
      { id: 'reach_lagoon', text: "Find the path to Mermaid Lagoon", completed: false },
      { id: 'earn_blessing', text: "Earn the mermaids' blessing", completed: false },
      { id: 'help_rival', text: "Decide: Help or abandon Ricky", completed: false },
      { id: 'learn_truth', text: "Learn the truth about Saltbeard's curse", completed: false }
    ],
    rivalEncounter: {
      location: 'mermaid_lagoon',
      condition: 'after_reach_lagoon'
    },
    rewards: { gold: 2000, xp: 10000, item: 'mermaid_blessed_rod' },
    nextChapter: 'finale'
  },
  
  finale: {
    id: 'finale',
    name: "Legacy of the Sea",
    description: "The treasure chamber awaits. But what you find there will change everything you thought you knew about being a legend.",
    objectives: [
      { id: 'enter_chamber', text: "Enter the Treasure Chamber", completed: false },
      { id: 'final_choice', text: "Make your final choice with Ricky", completed: false },
      { id: 'claim_legacy', text: "Claim Saltbeard's true legacy", completed: false },
      { id: 'become_legend', text: "Become a legend of the seas", completed: false }
    ],
    rivalEncounter: {
      location: 'treasure_chamber',
      condition: 'after_enter_chamber'
    },
    rewards: { gold: 10000, xp: 50000, item: 'legendary_saltbeard_rod' },
    nextChapter: 'epilogue'
  }
};

// ============================================================================
// SIDE QUESTS - Additional Adventures
// ============================================================================

export const SIDE_QUESTS = {
  // Rival-related side quests
  rival_challenge_1: {
    id: 'rival_challenge_1',
    name: "First Blood",
    type: 'rival',
    giver: 'razor_ricky',
    description: "Beat Ricky's catch record at Sunny Lake to prove you're a real fisher.",
    objectives: [
      { id: 'reach_sunny', text: "Travel to Sunny Lake", completed: false },
      { id: 'catch_10', text: "Catch 10 fish", completed: false },
      { id: 'beat_score', text: "Beat Ricky's score of 500 points", completed: false }
    ],
    targetScore: 500,
    rewards: { gold: 200, xp: 800, reputation: { rival: 'respect' } }
  },
  
  rival_challenge_2: {
    id: 'rival_challenge_2',
    name: "Deep Waters",
    type: 'rival',
    giver: 'razor_ricky',
    description: "Ricky challenges you to catch a rare fish from the Deep Ocean.",
    objectives: [
      { id: 'reach_deep', text: "Unlock Deep Ocean stage", completed: false },
      { id: 'catch_rare', text: "Catch a Legendary-tier fish", completed: false },
      { id: 'return', text: "Show Ricky your catch", completed: false }
    ],
    rewards: { gold: 500, xp: 2000, item: 'ricky_lucky_lure' }
  },
  
  rival_challenge_3: {
    id: 'rival_challenge_3',
    name: "Storm Chasers",
    type: 'rival',
    giver: 'razor_ricky',
    description: "Fish during a storm. First to catch 5 storm fish wins.",
    objectives: [
      { id: 'wait_storm', text: "Wait for a storm at Storm Sea", completed: false },
      { id: 'catch_5_storm', text: "Catch 5 storm fish before Ricky", completed: false },
      { id: 'declare_winner', text: "Declare the winner", completed: false }
    ],
    rewards: { gold: 1000, xp: 4000, item: 'storm_rod' }
  },
  
  final_showdown: {
    id: 'final_showdown',
    name: "The Final Cast",
    type: 'rival',
    giver: 'razor_ricky',
    description: "The ultimate fishing competition. Winner takes Saltbeard's treasure.",
    objectives: [
      { id: 'prepare', text: "Prepare your best equipment", completed: false },
      { id: 'compete', text: "Outscore Ricky in the final competition", completed: false },
      { id: 'claim_prize', text: "Claim your prize", completed: false }
    ],
    targetScore: 5000,
    rewards: { gold: 5000, xp: 20000, item: 'champion_trophy', title: 'Sea Legend' }
  },

  // Shop-related quests
  supply_run: {
    id: 'supply_run',
    name: "Supply and Demand",
    type: 'shop',
    giver: 'marina_goldscale',
    description: "Help Marina restock her shop by catching specific fish.",
    objectives: [
      { id: 'catch_bass', text: "Catch 5 Bass", completed: false },
      { id: 'catch_salmon', text: "Catch 3 Salmon", completed: false },
      { id: 'deliver', text: "Deliver to Marina's shop", completed: false }
    ],
    rewards: { gold: 300, xp: 600, shopDiscount: 10 }
  },
  
  rare_ingredient: {
    id: 'rare_ingredient',
    name: "The Secret Recipe",
    type: 'shop',
    giver: 'chef_crustacean',
    description: "Chef Crustacean needs a rare glowing fish for his secret recipe.",
    objectives: [
      { id: 'find_glow', text: "Find a Glowing Anglerfish", completed: false },
      { id: 'deliver_chef', text: "Bring it to Chef Crustacean", completed: false }
    ],
    rewards: { gold: 500, xp: 1000, item: 'chefs_special_lure' }
  },
  
  // Minigame-related quests
  memory_master: {
    id: 'memory_master',
    name: "A Mind Like Steel",
    type: 'minigame',
    giver: 'old_barnacle_bill',
    description: "Old Bill believes memory skills are the key to finding treasure.",
    objectives: [
      { id: 'win_memory_3', text: "Win 3 memory games", completed: false },
      { id: 'perfect_score', text: "Get a perfect score once", completed: false },
      { id: 'learn_secret', text: "Learn Bill's treasure secret", completed: false }
    ],
    rewards: { gold: 400, xp: 800, item: 'memory_map_fragment' }
  },
  
  quiz_champion: {
    id: 'quiz_champion',
    name: "The Fish Scholar",
    type: 'minigame',
    giver: 'professor_pike',
    description: "Prove your fish knowledge to unlock the Professor's secret library.",
    objectives: [
      { id: 'win_quiz_5', text: "Win 5 quiz games", completed: false },
      { id: 'answer_legendary', text: "Answer a question about legendary fish", completed: false },
      { id: 'gain_access', text: "Gain access to the secret library", completed: false }
    ],
    rewards: { gold: 600, xp: 1200, item: 'fish_encyclopedia_vol2' }
  }
};

// ============================================================================
// STORY NPCs - Characters tied to the main storyline
// ============================================================================

export const STORY_NPCS = {
  // Fishing Net Boat NPCs
  net_captain_jonas: {
    id: 'net_captain_jonas',
    name: "Captain Jonas Networth",
    title: "Fishing Fleet Master",
    portrait: '🚢',
    personality: 'gruff_but_fair',
    location: 'docks',
    description: "Commands the fishing fleet. If you want to use fishing nets, you need his permission.",
    dialogues: {
      greeting: {
        text: "*inspects you* Another landlubber wanting to use my nets? Those nets cost more than you, rookie. Prove yourself first.",
        options: [
          { text: "How do I prove myself?", nextDialogue: 'prove_quest', mood: 'eager' },
          { text: "I can pay.", nextDialogue: 'pay_option', mood: 'confident' },
          { text: "What's so special about your nets?", nextDialogue: 'net_info', mood: 'curious' }
        ]
      },
      prove_quest: {
        text: "Catch me 20 fish in one session without losing a single one. Do that, and you can rent my smallest net. Drop even ONE fish, and you start over.",
        startsQuest: 'net_trial',
        options: [
          { text: "Challenge accepted!", nextDialogue: 'goodbye', mood: 'determined' }
        ]
      },
      pay_option: {
        text: "*laughs* Money talks, sure. 500 gold for a day's rental. Or prove yourself and pay 50. Your choice, deep pockets.",
        options: [
          { text: "I'll prove myself.", nextDialogue: 'prove_quest', mood: 'determined' },
          { text: "Here's 500 gold.", nextDialogue: 'expensive_rental', cost: 500, mood: 'rich' }
        ]
      },
      net_info: {
        text: "These nets were woven by the mermaids themselves. They ATTRACT fish. Use one, and you'll catch twice as much in half the time. But mistreat it, and you'll never fish in this port again.",
        options: [
          { text: "Mermaid-woven? I need one!", nextDialogue: 'prove_quest', mood: 'excited' },
          { text: "That sounds valuable.", nextDialogue: 'goodbye', mood: 'impressed' }
        ]
      },
      expensive_rental: {
        text: "*takes gold* A person of means! Here's your net. Treat it well. And if you break it... *cracks knuckles* ...we'll have words.",
        givesItem: 'rental_fishing_net',
        options: [
          { text: "Thanks, Captain!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  },

  // Stage area NPCs
  sunny_lake_guard: {
    id: 'sunny_lake_guard',
    name: "Lazy Larry",
    title: "Lake Warden (Allegedly)",
    portrait: '😴',
    personality: 'sleepy',
    location: 'stage_sunny_lake',
    description: "Supposed to guard Sunny Lake. Mostly naps.",
    dialogues: {
      greeting: {
        text: "*yawns* Oh, a fisher. Yeah, go ahead, lake's open. Just don't... *yawns* ...don't wake the giant catfish. He gets grumpy.",
        options: [
          { text: "Giant catfish?!", nextDialogue: 'catfish_legend', mood: 'alarmed' },
          { text: "Any tips for this lake?", nextDialogue: 'tips', mood: 'curious' },
          { text: "You okay? You seem tired.", nextDialogue: 'tired', mood: 'concerned' }
        ]
      },
      catfish_legend: {
        text: "*more awake now* Old Whiskers! Bigger than a boat. Some say he's a hundred years old. Some say he ate a pirate ship whole. I say... let him sleep.",
        advancesQuest: 'legendary_fish_hunt',
        options: [
          { text: "I want to catch him!", nextDialogue: 'catch_whiskers', mood: 'ambitious' },
          { text: "I'll be quiet.", nextDialogue: 'goodbye', mood: 'cautious' }
        ]
      },
      tips: {
        text: "Early morning's best. Fish are sleepy too. Like me. *yawns* Also, the north shore has bigger fish. And bring snacks. I'm hungry. I mean, the fish are hungry.",
        options: [
          { text: "Thanks, Larry!", nextDialogue: 'goodbye', mood: 'grateful' },
          { text: "*gives snack*", nextDialogue: 'snack_reward', givesItem: 'snack', mood: 'generous' }
        ]
      },
      snack_reward: {
        text: "*eyes light up* You're alright! Here, take this. Found it while napping. Might be useful. Probably is. I dunno, I was half asleep.",
        givesItem: 'sleepy_lure',
        options: [
          { text: "Thanks!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  },

  deep_ocean_sage: {
    id: 'deep_ocean_sage',
    name: "Sage Coralia",
    title: "Ocean Whisperer",
    portrait: '🧜‍♀️',
    personality: 'mystical',
    location: 'stage_deep_ocean',
    description: "A half-mermaid who guides fishers to the deep. For a price.",
    dialogues: {
      greeting: {
        text: "*emerges from water* The deep calls to you, surface dweller. I can hear it in your heartbeat. But the abyss is not for the unprepared...",
        options: [
          { text: "What preparation do I need?", nextDialogue: 'preparation', mood: 'serious' },
          { text: "Are you... a mermaid?", nextDialogue: 'mermaid_truth', mood: 'curious' },
          { text: "Just let me fish.", nextDialogue: 'impatient', mood: 'impatient' }
        ]
      },
      preparation: {
        text: "The deep dwellers are ancient. They don't bite ordinary bait. You need something that glows with moonlight. Seek the Lunar Lure, crafted only during full moons.",
        advancesQuest: 'deep_fishing_prep',
        options: [
          { text: "Where can I find this lure?", nextDialogue: 'lure_location', mood: 'determined' }
        ]
      },
      mermaid_truth: {
        text: "*laughs like waves* Half, dear. My mother was a mermaid, my father a fisherman. Ironic, yes? I help fishers. The mermaids call me traitor. I call myself... balanced.",
        options: [
          { text: "Can you help me reach the Mermaid's Heart?", nextDialogue: 'heart_help', mood: 'hopeful' },
          { text: "That's fascinating.", nextDialogue: 'preparation', mood: 'interested' }
        ]
      },
      heart_help: {
        text: "*eyes widen* The Heart? You seek THAT? *looks around nervously* I can guide you... but my kin must never know. Do this quest, and I'll show you the hidden path.",
        startsQuest: 'coralia_secret',
        options: [
          { text: "What quest?", nextDialogue: 'secret_quest', mood: 'ready' }
        ]
      }
    }
  },

  storm_sea_veteran: {
    id: 'storm_sea_veteran',
    name: "One-Eye Pete",
    title: "Storm Survivor",
    portrait: '🏴‍☠️',
    personality: 'haunted',
    location: 'stage_storm_sea',
    description: "Lost his eye (and crew) to the storms. Now warns others... while secretly hoping someone finishes what he started.",
    dialogues: {
      greeting: {
        text: "*stares at the churning sea* They say the storm took my eye. Wrong. The storm took my FEAR. Now nothing scares me. Including you.",
        options: [
          { text: "What happened to your crew?", nextDialogue: 'crew_story', mood: 'gentle' },
          { text: "Any advice for storm fishing?", nextDialogue: 'storm_advice', mood: 'practical' },
          { text: "You seem intense.", nextDialogue: 'intense', mood: 'blunt' }
        ]
      },
      crew_story: {
        text: "*long pause* We chased the Storm Kraken. Legend said catching it would break the curse on these waters. We found it. We caught it. Then it... caught back. Only I escaped.",
        advancesQuest: 'kraken_hunt',
        options: [
          { text: "The Storm Kraken is real?", nextDialogue: 'kraken_real', mood: 'shocked' },
          { text: "I'm sorry for your loss.", nextDialogue: 'sympathy', mood: 'sympathetic' }
        ]
      },
      kraken_real: {
        text: "*shows massive scar* Real as this. It's still out there. Still waiting. And part of me... part of me wants to face it again. Finish what we started. Even if it finishes me.",
        options: [
          { text: "I'll help you.", nextDialogue: 'help_kraken', startsQuest: 'kraken_revenge', mood: 'heroic' },
          { text: "That sounds suicidal.", nextDialogue: 'caution', mood: 'worried' }
        ]
      },
      storm_advice: {
        text: "When lightning strikes, fish rise to the surface. That's your window. Cast fast, reel faster. And NEVER turn your back on the waves. Never.",
        givesHint: 'storm_fishing_technique',
        options: [
          { text: "Thanks, Pete.", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  }
};

// ============================================================================
// MINIGAME NPCs - Hosts for each minigame
// ============================================================================

export const MINIGAME_NPCS = {
  old_barnacle_bill: {
    id: 'old_barnacle_bill',
    name: "Old Barnacle Bill",
    title: "Memory Master",
    portrait: '🧠',
    personality: 'nostalgic',
    location: 'salty_barnacle_tavern',
    description: "Claims to remember every fish he ever caught. Challenges others to match his memory.",
    dialogues: {
      greeting: {
        text: "*taps head* The mind is the greatest fishing tool, young one. I remember the color of every fish, the time of every catch. Want to test YOUR memory?",
        options: [
          { text: "Let's play!", nextDialogue: 'start_game', startMinigame: 'memory', mood: 'excited' },
          { text: "Why is memory important for fishing?", nextDialogue: 'why_memory', mood: 'curious' },
          { text: "Maybe later.", nextDialogue: 'goodbye', mood: 'busy' }
        ]
      },
      why_memory: {
        text: "BECAUSE! A good fisher remembers where they caught fish before, what bait worked, what time was best. My memory games? Training for treasure hunting. Old Saltbeard used memory puzzles to hide his maps!",
        advancesQuest: 'memory_master',
        options: [
          { text: "Teach me!", nextDialogue: 'start_game', startMinigame: 'memory', mood: 'eager' }
        ]
      },
      after_win: {
        text: "*impressed whistle* You've got a good brain! Here's a hint for you: The treasure map isn't just ONE map. It's PIECES, scattered across memories. Find the pieces, remember their order, find the treasure!",
        givesHint: 'map_pieces_hint',
        options: [
          { text: "Thanks, Bill!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  },

  lightning_larry: {
    id: 'lightning_larry',
    name: "Lightning Larry",
    title: "The Fastest Hands at Sea",
    portrait: '⚡',
    personality: 'hyperactive',
    location: 'salty_barnacle_tavern',
    description: "Once caught a fish mid-jump. Now he trains others in reaction speed.",
    dialogues: {
      greeting: {
        text: "*fingers drumming constantly* Fast-fast-fast! That's the secret! The fish don't WAIT, so why should YOU? Test your speed against ME! Come on come on COME ON!",
        options: [
          { text: "Okay okay, let's go!", nextDialogue: 'start_game', startMinigame: 'timing', mood: 'rushed' },
          { text: "Calm down!", nextDialogue: 'calm_attempt', mood: 'concerned' },
          { text: "How fast are you really?", nextDialogue: 'speed_story', mood: 'skeptical' }
        ]
      },
      speed_story: {
        text: "HOW FAST?! *slaps table* I once caught a fish, cleaned it, cooked it, and served it before the RIPPLES hit the shore! Okay maybe exaggeration BUT NOT BY MUCH!",
        options: [
          { text: "*impressed* Train me!", nextDialogue: 'start_game', startMinigame: 'timing', mood: 'enthusiastic' }
        ]
      },
      after_win: {
        text: "*jaw drops* YOU'RE FAST! Almost as fast as ME! Here— *throws item before you can react* —take this! A lure that responds to QUICK reflexes! Perfect for YOU!",
        givesItem: 'quicksilver_lure',
        options: [
          { text: "Thanks!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  },

  professor_pike: {
    id: 'professor_pike',
    name: "Professor Pike",
    title: "Marine Biologist (Self-Appointed)",
    portrait: '❓',
    personality: 'scholarly',
    location: 'salty_barnacle_tavern',
    description: "Knows everything about fish. EVERYTHING. Will quiz you to prove it.",
    dialogues: {
      greeting: {
        text: "*adjusts imaginary spectacles* Ah, a student! Tell me - what is the average lifespan of a Golden Trout? No? What about the mating ritual of the Sunset Bass? NO?! Clearly you need my tutelage.",
        options: [
          { text: "Quiz me, Professor!", nextDialogue: 'start_game', startMinigame: 'quiz', mood: 'eager' },
          { text: "I prefer practical learning.", nextDialogue: 'practical_debate', mood: 'stubborn' },
          { text: "Who made you a professor?", nextDialogue: 'credentials', mood: 'suspicious' }
        ]
      },
      credentials: {
        text: "*huffs* I have read EVERY book on fish! I have TASTED every fish! I have SPOKEN to fish! The last one is unverified but the POINT stands! Knowledge is POWER!",
        options: [
          { text: "You've talked to fish?", nextDialogue: 'fish_talk', mood: 'curious' },
          { text: "Okay okay, quiz me.", nextDialogue: 'start_game', startMinigame: 'quiz', mood: 'relenting' }
        ]
      },
      fish_talk: {
        text: "*whispers* The Glowing Anglerfish. In the deep. They communicate through light patterns. I've learned some. They mostly complain about the pressure. Relatable, honestly.",
        advancesQuest: 'quiz_champion',
        options: [
          { text: "That's actually amazing.", nextDialogue: 'start_game', startMinigame: 'quiz', mood: 'impressed' }
        ]
      },
      after_win: {
        text: "*wipes tear* A TRUE scholar! You've earned access to my personal research! This journal contains secrets about EVERY legendary fish! Guard it with your LIFE!",
        givesItem: 'pike_research_journal',
        options: [
          { text: "I'm honored!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  },

  swift_sally: {
    id: 'swift_sally',
    name: "Swift Sally",
    title: "Sorting Speedster",
    portrait: '📊',
    personality: 'efficient',
    location: 'salty_barnacle_tavern',
    description: "Can sort a thousand fish by size in under a minute. Runs the sorting games.",
    dialogues: {
      greeting: {
        text: "*sorting coins while talking* Organization. Efficiency. These are the foundations of success. A fisher who can't sort is a fisher who wastes time. And time is FISH.",
        options: [
          { text: "Teach me to sort!", nextDialogue: 'start_game', startMinigame: 'sorting', mood: 'eager' },
          { text: "Why does sorting matter?", nextDialogue: 'sorting_importance', mood: 'skeptical' },
          { text: "You seem stressed.", nextDialogue: 'stress', mood: 'observant' }
        ]
      },
      sorting_importance: {
        text: "The merchants pay MORE for sorted catches! Big fish in one pile, small in another. Rare fish separated! Do THIS, and you earn DOUBLE. Don't do it, and you're leaving gold on the table.",
        givesHint: 'sorting_bonus_hint',
        options: [
          { text: "Show me how!", nextDialogue: 'start_game', startMinigame: 'sorting', mood: 'motivated' }
        ]
      },
      stress: {
        text: "*pauses* ...Stress? No. This is FOCUS. I watched my father lose his business because he couldn't organize. Never again. Now I sort EVERYTHING. Even my thoughts. They're alphabetized.",
        options: [
          { text: "That's... thorough.", nextDialogue: 'start_game', startMinigame: 'sorting', mood: 'impressed' },
          { text: "That sounds exhausting.", nextDialogue: 'goodbye', mood: 'sympathetic' }
        ]
      },
      after_win: {
        text: "*nods approvingly* Clean. Efficient. Proper. You've earned this - a Sorting Manifest. Shows exactly what's in your inventory at all times. Never lose track again!",
        givesItem: 'sorting_manifest',
        options: [
          { text: "Thank you, Sally!", nextDialogue: 'goodbye', mood: 'grateful' }
        ]
      }
    }
  }
};

export default {
  RIVAL_NPC,
  MAIN_STORY,
  SIDE_QUESTS,
  STORY_NPCS,
  MINIGAME_NPCS
};
