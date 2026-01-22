"""
Captain's Log System - Personal journal for the player
Features:
- Automatic logging of discoveries
- Personal notes
- Quest log
- NPC interaction history
- Location discoveries
- Fish catches
- Lore discoveries
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid

router = APIRouter(prefix="/api/captains-log", tags=["captains_log"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# ============================================================================
# LOG ENTRY TYPES
# ============================================================================

LOG_TYPES = {
    "discovery": "Discovery",
    "quest": "Quest",
    "npc": "NPC Encounter",
    "catch": "Notable Catch",
    "voyage": "Voyage",
    "achievement": "Achievement",
    "personal": "Personal Note",
    "lore": "Lore",
    "danger": "Danger Survived",
    "trade": "Trade",
    "reputation": "Reputation Change"
}

# ============================================================================
# AUTO-GENERATED LOG TEMPLATES
# ============================================================================

LOG_TEMPLATES = {
    "first_fish": {
        "title": "My First Catch",
        "template": "Today I caught my first fish - a {fish_name}! The feeling of the line going taut, the struggle, the victory... I think I'm hooked. This is just the beginning.",
        "type": "catch",
        "importance": "milestone"
    },
    "new_location": {
        "title": "New Waters Discovered",
        "template": "I've discovered a new fishing location: {location_name}. {location_description} The waters here hold promise.",
        "type": "discovery",
        "importance": "normal"
    },
    "npc_first_meeting": {
        "title": "Met {npc_name}",
        "template": "Today I met {npc_name}, {npc_title}. {first_impression}",
        "type": "npc",
        "importance": "normal"
    },
    "legendary_catch": {
        "title": "Legendary Catch!",
        "template": "I can barely believe it - I caught a {fish_name}! A legendary fish! {catch_story}",
        "type": "catch",
        "importance": "legendary"
    },
    "quest_started": {
        "title": "New Quest: {quest_name}",
        "template": "I've accepted a new quest: {quest_name}. {quest_description} May the seas favor me.",
        "type": "quest",
        "importance": "normal"
    },
    "quest_completed": {
        "title": "Quest Complete: {quest_name}",
        "template": "I've completed the quest '{quest_name}'! {completion_notes} Rewards: {rewards}",
        "type": "quest",
        "importance": "achievement"
    },
    "storm_survived": {
        "title": "Survived the Storm",
        "template": "The storm hit without warning. Waves as tall as buildings, wind that screamed like the damned. But I survived. My ship survived. We made it through.",
        "type": "danger",
        "importance": "normal"
    },
    "pirate_encounter": {
        "title": "Pirate Encounter",
        "template": "Encountered pirates today near {location}. {outcome}. Note to self: {lesson_learned}",
        "type": "danger",
        "importance": "normal"
    },
    "lore_discovery": {
        "title": "Learned: {lore_title}",
        "template": "I've learned something fascinating: {lore_content}",
        "type": "lore",
        "importance": "knowledge"
    },
    "reputation_milestone": {
        "title": "{faction} Reputation: {level}",
        "template": "My standing with {faction} has reached {level}. {implications}",
        "type": "reputation",
        "importance": "milestone"
    },
    "new_boat": {
        "title": "New Vessel: {boat_name}",
        "template": "I've acquired a new vessel - the {boat_name}! {boat_description} A fine ship that will serve me well.",
        "type": "voyage",
        "importance": "milestone"
    },
    "voyage_completed": {
        "title": "Voyage to {destination}",
        "template": "Completed a voyage to {destination}. Stages visited: {stages}. Fish caught: {fish_count}. Gold earned: {gold}. {memorable_moment}",
        "type": "voyage",
        "importance": "normal"
    },
    "near_death": {
        "title": "A Close Call",
        "template": "I nearly died today. {near_death_story}. I'm writing this as a reminder to be more careful... or perhaps more brave.",
        "type": "danger",
        "importance": "milestone"
    },
    "secret_discovered": {
        "title": "Secret Found",
        "template": "I've discovered a secret: {secret_description}. This knowledge may prove valuable.",
        "type": "discovery",
        "importance": "secret"
    }
}

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class LogEntry(BaseModel):
    entry_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    content: str
    log_type: str
    importance: str = "normal"
    location: Optional[str] = None
    related_entities: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    in_game_date: Optional[str] = None
    is_auto_generated: bool = False
    is_pinned: bool = False

class PersonalNote(BaseModel):
    user_id: str
    title: str
    content: str
    tags: List[str] = Field(default_factory=list)

class LogFilter(BaseModel):
    log_type: Optional[str] = None
    importance: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    search_text: Optional[str] = None

# ============================================================================
# API ROUTES
# ============================================================================

@router.get("/types")
async def get_log_types():
    """Get all log entry types"""
    return LOG_TYPES

@router.get("/user/{user_id}")
async def get_captains_log(user_id: str, limit: int = 50, skip: int = 0):
    """Get user's captain's log entries"""
    entries = await db.captains_log.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    total = await db.captains_log.count_documents({"user_id": user_id})
    
    return {
        "entries": entries,
        "total": total,
        "page": skip // limit + 1,
        "pages": (total + limit - 1) // limit
    }

@router.get("/user/{user_id}/by-type/{log_type}")
async def get_log_by_type(user_id: str, log_type: str, limit: int = 50):
    """Get log entries filtered by type"""
    entries = await db.captains_log.find(
        {"user_id": user_id, "log_type": log_type},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    return {"entries": entries, "type": log_type}

@router.get("/user/{user_id}/pinned")
async def get_pinned_entries(user_id: str):
    """Get user's pinned log entries"""
    entries = await db.captains_log.find(
        {"user_id": user_id, "is_pinned": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"entries": entries}

@router.get("/user/{user_id}/milestones")
async def get_milestones(user_id: str):
    """Get user's milestone entries"""
    entries = await db.captains_log.find(
        {"user_id": user_id, "importance": {"$in": ["milestone", "legendary", "achievement"]}},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"entries": entries}

@router.post("/add")
async def add_log_entry(entry: LogEntry):
    """Add a new log entry"""
    await db.captains_log.insert_one(entry.model_dump())
    return {"message": "Entry added", "entry_id": entry.entry_id}

@router.post("/personal-note")
async def add_personal_note(note: PersonalNote):
    """Add a personal note to the log"""
    entry = LogEntry(
        user_id=note.user_id,
        title=note.title,
        content=note.content,
        log_type="personal",
        importance="personal",
        tags=note.tags,
        is_auto_generated=False
    )
    await db.captains_log.insert_one(entry.model_dump())
    return {"message": "Personal note added", "entry_id": entry.entry_id}

@router.post("/auto-log/{template_id}")
async def auto_generate_log(template_id: str, user_id: str, variables: Dict):
    """Auto-generate a log entry from a template"""
    template = LOG_TEMPLATES.get(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Fill in template
    title = template["title"].format(**variables)
    content = template["template"].format(**variables)
    
    entry = LogEntry(
        user_id=user_id,
        title=title,
        content=content,
        log_type=template["type"],
        importance=template["importance"],
        is_auto_generated=True,
        related_entities=list(variables.keys())
    )
    
    await db.captains_log.insert_one(entry.model_dump())
    return {"message": "Auto-log created", "entry": entry.model_dump()}

@router.put("/pin/{entry_id}")
async def toggle_pin(entry_id: str, user_id: str):
    """Toggle pin status on an entry"""
    entry = await db.captains_log.find_one(
        {"entry_id": entry_id, "user_id": user_id}
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    new_status = not entry.get("is_pinned", False)
    await db.captains_log.update_one(
        {"entry_id": entry_id},
        {"$set": {"is_pinned": new_status}}
    )
    
    return {"pinned": new_status}

@router.delete("/{entry_id}")
async def delete_entry(entry_id: str, user_id: str):
    """Delete a log entry (personal notes only)"""
    entry = await db.captains_log.find_one(
        {"entry_id": entry_id, "user_id": user_id}
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if entry.get("is_auto_generated"):
        raise HTTPException(status_code=400, detail="Cannot delete auto-generated entries")
    
    await db.captains_log.delete_one({"entry_id": entry_id})
    return {"message": "Entry deleted"}

@router.get("/user/{user_id}/search")
async def search_log(user_id: str, query: str, limit: int = 20):
    """Search log entries"""
    entries = await db.captains_log.find(
        {
            "user_id": user_id,
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"content": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}}
            ]
        },
        {"_id": 0}
    ).limit(limit).to_list(limit)
    
    return {"entries": entries, "query": query}

@router.get("/user/{user_id}/statistics")
async def get_log_statistics(user_id: str):
    """Get statistics about user's log"""
    total = await db.captains_log.count_documents({"user_id": user_id})
    
    # Count by type
    by_type = {}
    for log_type in LOG_TYPES.keys():
        count = await db.captains_log.count_documents(
            {"user_id": user_id, "log_type": log_type}
        )
        by_type[log_type] = count
    
    # Count by importance
    milestones = await db.captains_log.count_documents(
        {"user_id": user_id, "importance": "milestone"}
    )
    legendary = await db.captains_log.count_documents(
        {"user_id": user_id, "importance": "legendary"}
    )
    
    return {
        "total_entries": total,
        "by_type": by_type,
        "milestones": milestones,
        "legendary_moments": legendary
    }

@router.get("/user/{user_id}/timeline")
async def get_timeline(user_id: str, year: Optional[int] = None, month: Optional[int] = None):
    """Get log entries organized by date"""
    query = {"user_id": user_id}
    
    if year:
        query["created_at"] = {"$regex": f"^{year}"}
        if month:
            query["created_at"] = {"$regex": f"^{year}-{month:02d}"}
    
    entries = await db.captains_log.find(
        query,
        {"_id": 0}
    ).sort("created_at", 1).to_list(500)
    
    # Group by date
    timeline = {}
    for entry in entries:
        date = entry["created_at"][:10]
        if date not in timeline:
            timeline[date] = []
        timeline[date].append(entry)
    
    return {"timeline": timeline}
