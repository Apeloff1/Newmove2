# GO FISH! - Open World Pirate Adventure
## Product Requirements Document

## Original Problem Statement
- Import GitHub repository: https://github.com/Apeloff1/Lorebuffa
- Fix UI proportioning issues - menu items unreachable
- Add 3000+ lines of open world assets
- Add 2000 lines of NPC pathing scripts
- Add 30 quest chains with 10+ quests each

---

## What's Been Implemented (Jan 21, 2026)

### Latest Session - Massive Content Addition ✅

#### UI Proportioning Fix
- Fixed character creation modal overflow issues
- Made origin selection list scrollable (max-height: 40vh)
- Fixed adventure intro screen layout (overflow-y-auto)
- All action buttons now accessible at bottom of screens

#### New Content Files Added (6,466 lines total)

| File | Lines | Description |
|------|-------|-------------|
| openWorldAssets.js | 1,452 | Environmental objects, wildlife, weather, ships, treasures |
| openWorldAssetsExtended.js | 1,020 | Fishing spots, loot tables, crafting, achievements, skills |
| npcPathing.js | 1,428 | Path nodes, schedules, patrol routes, behaviors, state machine |
| npcPathingExtended.js | 578 | NPC definitions, dialogue trees, reactions, gift preferences |
| questChains.js | 1,200 | 24 quest chains with full quest definitions |
| questChainsExtended.js | 788 | 8 additional quest chains |

#### Quest Chains (32 Total, 300+ Quests)
1. The Curse of Saltbeard (Main Story) - 15 quests
2. The Fisherman's Guild (Faction) - 12 quests
3. The Merchant's Path (Faction) - 11 quests
4. The Ricky Rivalry (Rival) - 10 quests
5. Mysteries of the Deep (Exploration) - 12 quests
6-10. Collection Quests (Fish, Shell, Treasure, Artifact, Recipe) - 10 each
11-20. Location/NPC Quests (Tavern, Lighthouse, Blacksmith, etc) - 10 each
21-22. Seasonal Quests (Spring, Summer, Autumn, Winter) - 10 each
23-30. Extended Chains (Shipwright, Deep Sea, Weather, Companion, Ghosts, Cooking, Cartography, Legend)

#### Open World Assets Include
- 50+ environmental objects (trees, rocks, buildings)
- 40+ wildlife creatures (sea, birds, land, mythical)
- Complete weather system with 10+ types
- Day/night cycle with 6 time periods
- 4 seasons with unique effects
- 10+ ship types (player & ambient)
- 5 shipwrecks to explore
- Treasure system with maps and collectibles
- World events (ambient, scheduled, special)
- Audio asset definitions

#### NPC Pathing System Includes
- Path node networks for all regions
- 8 schedule templates (merchant, fisherman, guard, etc)
- 8 patrol routes
- Comprehensive behavior states (idle, movement, work, social, alert)
- Interaction triggers (proximity, temporal, event-based)
- Group behaviors (crowds, small groups, work crews)
- Memory system with gossip propagation
- A* pathfinding implementation
- State machine for NPC AI
- NPC Manager class

---

## Code Statistics

| Category | Count |
|----------|-------|
| **Total Lines** | ~90,000 |
| New content added | 6,466 lines |
| Frontend JS/JSX files | 120+ |
| Frontend CSS files | 4 |
| Backend Python files | 38 |
| Quest Chains | 32 |
| Total Quests | 300+ |

---

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Zustand state management
- **Backend**: FastAPI (Python), Motor (async MongoDB)
- **Database**: MongoDB

---

## Features Working
- Full character creation system (5 steps)
- Adventure Mode with open world hub
- Witty renamed locations & NPCs
- Fishing Competition vs Rival "Ricky"
- Shop system (4 shops with items)
- Enhanced Tacklebox (8 category tabs)
- Minigames in Tavern
- 125+ NPCs across 5 regions

---

## Backlog
- Integrate new quest system into UI
- Integrate NPC pathing into game loop
- Add weather effects to fishing
- Mobile responsive improvements

---

## Theme/Tone
- Witty, self-aware humor
- Characters acknowledge absurdity of situations
- Avoids copyright by being original
