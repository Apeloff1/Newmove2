# ========== GO FISH! MUSIC & ANALYTICS SYSTEM API ==========
# Dynamic music control, player analytics, and statistics
# ~400+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random

router = APIRouter(prefix="/api", tags=["music_analytics"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== MUSIC CONFIGURATION ==========

MUSIC_TRACKS = {
    "menu": {
        "id": "menu",
        "name": "Sunny Day Fishing",
        "context": "menu",
        "bpm": 110,
        "mood": "upbeat",
        "description": "Main menu theme",
    },
    "fishing_calm": {
        "id": "fishing_calm",
        "name": "Peaceful Waters",
        "context": "gameplay",
        "bpm": 95,
        "mood": "calm",
        "weather": ["clear", "cloudy"],
        "time_of_day": ["day", "dusk"],
    },
    "fishing_upbeat": {
        "id": "fishing_upbeat",
        "name": "Big Catch Energy",
        "context": "gameplay",
        "bpm": 130,
        "mood": "energetic",
        "trigger": "combo_5",
    },
    "night_fishing": {
        "id": "night_fishing",
        "name": "Moonlit Waters",
        "context": "gameplay",
        "bpm": 85,
        "mood": "mysterious",
        "time_of_day": ["night"],
    },
    "storm_fishing": {
        "id": "storm_fishing",
        "name": "Storm Chaser",
        "context": "gameplay",
        "bpm": 150,
        "mood": "intense",
        "weather": ["storm", "rain"],
    },
    "victory": {
        "id": "victory",
        "name": "Trophy Catch!",
        "context": "catch",
        "bpm": 140,
        "mood": "triumphant",
        "trigger": "legendary_catch",
    },
    "breeding_lab": {
        "id": "breeding_lab",
        "name": "Lab Discovery",
        "context": "feature",
        "bpm": 105,
        "mood": "curious",
        "feature": "breeding",
    },
    "aquarium": {
        "id": "aquarium",
        "name": "Aquarium Dreams",
        "context": "feature",
        "bpm": 80,
        "mood": "relaxing",
        "feature": "aquarium",
    },
    "shop": {
        "id": "shop",
        "name": "Shopping Spree",
        "context": "feature",
        "bpm": 115,
        "mood": "cheerful",
        "feature": "shop",
    },
    "minigame": {
        "id": "minigame",
        "name": "Game Time!",
        "context": "feature",
        "bpm": 135,
        "mood": "fun",
        "feature": "minigame",
    },
    "tournament": {
        "id": "tournament",
        "name": "Competition",
        "context": "feature",
        "bpm": 140,
        "mood": "competitive",
        "feature": "tournament",
    },
}

SOUND_EFFECTS = {
    "cast": {"id": "cast", "name": "Cast Line", "category": "fishing"},
    "splash": {"id": "splash", "name": "Water Splash", "category": "fishing"},
    "bite": {"id": "bite", "name": "Fish Bite", "category": "fishing"},
    "reel": {"id": "reel", "name": "Reel Sound", "category": "fishing"},
    "catch": {"id": "catch", "name": "Fish Caught", "category": "fishing"},
    "perfect": {"id": "perfect", "name": "Perfect Catch", "category": "fishing"},
    "miss": {"id": "miss", "name": "Fish Escaped", "category": "fishing"},
    "levelup": {"id": "levelup", "name": "Level Up", "category": "progress"},
    "achievement": {"id": "achievement", "name": "Achievement Unlock", "category": "progress"},
    "coin": {"id": "coin", "name": "Coin Collect", "category": "reward"},
    "purchase": {"id": "purchase", "name": "Purchase", "category": "ui"},
    "menu_select": {"id": "menu_select", "name": "Menu Select", "category": "ui"},
    "menu_hover": {"id": "menu_hover", "name": "Menu Hover", "category": "ui"},
    "error": {"id": "error", "name": "Error", "category": "ui"},
    "rare_catch": {"id": "rare_catch", "name": "Rare Discovery", "category": "special"},
    "legendary_catch": {"id": "legendary_catch", "name": "Legendary!", "category": "special"},
    "breeding_complete": {"id": "breeding_complete", "name": "Breeding Done", "category": "special"},
}


# ========== REQUEST MODELS ==========

class UpdateMusicSettingsRequest(BaseModel):
    user_id: str
    music_enabled: bool = True
    music_volume: float = 0.5
    sfx_enabled: bool = True
    sfx_volume: float = 0.8


class GetRecommendedTrackRequest(BaseModel):
    user_id: str
    context: str  # "gameplay", "menu", "feature"
    weather: Optional[str] = None
    time_of_day: Optional[str] = None
    feature: Optional[str] = None
    combo: Optional[int] = None
    caught_legendary: Optional[bool] = None


class RecordSessionRequest(BaseModel):
    user_id: str
    session_duration_seconds: int
    fish_caught: int
    score_earned: int
    perfect_catches: int
    max_combo: int
    stage_played: int


class RecordAchievementRequest(BaseModel):
    user_id: str
    achievement_id: str


# ========== MUSIC ENDPOINTS ==========

@router.get("/music/tracks")
async def get_all_tracks():
    """Get all available music tracks"""
    return {"tracks": list(MUSIC_TRACKS.values())}


@router.get("/music/sfx")
async def get_all_sfx():
    """Get all sound effects"""
    return {"sound_effects": list(SOUND_EFFECTS.values())}


@router.get("/music/settings/{user_id}")
async def get_music_settings(user_id: str):
    """Get user's music settings"""
    settings = await db.player_settings.find_one({"user_id": user_id}, {"_id": 0})
    
    if not settings:
        settings = {
            "user_id": user_id,
            "music_enabled": True,
            "music_volume": 0.5,
            "sfx_enabled": True,
            "sfx_volume": 0.8,
            "current_track": "menu",
        }
        await db.player_settings.insert_one(settings)
    
    return settings


@router.post("/music/settings")
async def update_music_settings(request: UpdateMusicSettingsRequest):
    """Update music settings"""
    await db.player_settings.update_one(
        {"user_id": request.user_id},
        {
            "$set": {
                "music_enabled": request.music_enabled,
                "music_volume": request.music_volume,
                "sfx_enabled": request.sfx_enabled,
                "sfx_volume": request.sfx_volume,
            }
        },
        upsert=True
    )
    
    return {"success": True}


@router.post("/music/recommend")
async def get_recommended_track(request: GetRecommendedTrackRequest):
    """Get recommended track based on context"""
    
    # Priority-based track selection
    recommended = "fishing_calm"  # Default
    
    # Check for legendary catch
    if request.caught_legendary:
        recommended = "victory"
    
    # Check for high combo
    elif request.combo and request.combo >= 5:
        recommended = "fishing_upbeat"
    
    # Check for feature context
    elif request.feature:
        feature_tracks = {
            "breeding": "breeding_lab",
            "aquarium": "aquarium",
            "shop": "shop",
            "minigame": "minigame",
            "tournament": "tournament",
        }
        recommended = feature_tracks.get(request.feature, "menu")
    
    # Check weather
    elif request.weather in ["storm", "rain"]:
        recommended = "storm_fishing"
    
    # Check time of day
    elif request.time_of_day == "night":
        recommended = "night_fishing"
    
    # Context-based
    elif request.context == "menu":
        recommended = "menu"
    
    track = MUSIC_TRACKS.get(recommended, MUSIC_TRACKS["menu"])
    
    return {"recommended_track": track}


@router.post("/music/set-current/{user_id}/{track_id}")
async def set_current_track(user_id: str, track_id: str):
    """Set currently playing track"""
    if track_id not in MUSIC_TRACKS:
        raise HTTPException(status_code=404, detail="Track not found")
    
    await db.player_settings.update_one(
        {"user_id": user_id},
        {"$set": {"current_track": track_id}},
        upsert=True
    )
    
    return {"success": True, "track": MUSIC_TRACKS[track_id]}


# ========== ANALYTICS ENDPOINTS ==========

@router.post("/analytics/session")
async def record_session(request: RecordSessionRequest):
    """Record a play session for analytics"""
    session = {
        "id": str(uuid.uuid4()),
        "user_id": request.user_id,
        "duration_seconds": request.session_duration_seconds,
        "fish_caught": request.fish_caught,
        "score_earned": request.score_earned,
        "perfect_catches": request.perfect_catches,
        "max_combo": request.max_combo,
        "stage_played": request.stage_played,
        "session_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.player_sessions.insert_one(session)
    
    # Update cumulative stats
    await db.player_stats.update_one(
        {"user_id": request.user_id},
        {
            "$inc": {
                "total_sessions": 1,
                "total_playtime_seconds": request.session_duration_seconds,
                "total_fish_caught": request.fish_caught,
                "total_score": request.score_earned,
                "total_perfect_catches": request.perfect_catches,
            },
            "$max": {
                "best_session_score": request.score_earned,
                "best_combo": request.max_combo,
                "highest_stage": request.stage_played,
            }
        },
        upsert=True
    )
    
    return {"success": True, "session_id": session["id"]}


@router.get("/analytics/stats/{user_id}")
async def get_player_stats(user_id: str):
    """Get comprehensive player statistics"""
    stats = await db.player_stats.find_one({"user_id": user_id}, {"_id": 0})
    
    if not stats:
        stats = {
            "user_id": user_id,
            "total_sessions": 0,
            "total_playtime_seconds": 0,
            "total_fish_caught": 0,
            "total_score": 0,
            "total_perfect_catches": 0,
            "best_session_score": 0,
            "best_combo": 0,
            "highest_stage": 0,
        }
    
    # Calculate derived stats
    stats["average_session_minutes"] = round(
        (stats["total_playtime_seconds"] / max(stats["total_sessions"], 1)) / 60, 1
    )
    stats["average_fish_per_session"] = round(
        stats["total_fish_caught"] / max(stats["total_sessions"], 1), 1
    )
    stats["perfect_catch_rate"] = round(
        (stats["total_perfect_catches"] / max(stats["total_fish_caught"], 1)) * 100, 1
    )
    
    return {"stats": stats}


@router.get("/analytics/history/{user_id}")
async def get_session_history(user_id: str, days: int = 7):
    """Get session history for last N days"""
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    
    sessions = await db.player_sessions.find(
        {"user_id": user_id, "started_at": {"$gte": cutoff}},
        {"_id": 0}
    ).sort("started_at", -1).to_list(100)
    
    # Group by day
    daily_stats = {}
    for session in sessions:
        date = session["session_date"]
        if date not in daily_stats:
            daily_stats[date] = {
                "date": date,
                "sessions": 0,
                "playtime": 0,
                "fish_caught": 0,
                "score": 0,
            }
        daily_stats[date]["sessions"] += 1
        daily_stats[date]["playtime"] += session["duration_seconds"]
        daily_stats[date]["fish_caught"] += session["fish_caught"]
        daily_stats[date]["score"] += session["score_earned"]
    
    return {
        "sessions": sessions,
        "daily_stats": list(daily_stats.values()),
    }


@router.get("/analytics/leaderboard")
async def get_global_leaderboard(stat: str = "total_score", limit: int = 100):
    """Get global leaderboard for a stat"""
    valid_stats = ["total_score", "total_fish_caught", "best_combo", "total_playtime_seconds"]
    
    if stat not in valid_stats:
        raise HTTPException(status_code=400, detail=f"Invalid stat. Use: {valid_stats}")
    
    entries = await db.player_stats.find(
        {},
        {"_id": 0, "user_id": 1, stat: 1}
    ).sort(stat, -1).limit(limit).to_list(limit)
    
    # Enrich with usernames
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1
        user = await db.users.find_one({"id": entry["user_id"]}, {"_id": 0, "username": 1})
        entry["username"] = user.get("username", "Unknown") if user else "Unknown"
        entry["value"] = entry.get(stat, 0)
    
    return {"leaderboard": entries, "stat": stat}


@router.post("/analytics/achievement")
async def record_achievement(request: RecordAchievementRequest):
    """Record achievement unlock for analytics"""
    await db.achievement_analytics.insert_one({
        "user_id": request.user_id,
        "achievement_id": request.achievement_id,
        "unlocked_at": datetime.now(timezone.utc).isoformat(),
    })
    
    # Update achievement stats
    await db.achievement_stats.update_one(
        {"achievement_id": request.achievement_id},
        {"$inc": {"unlock_count": 1}},
        upsert=True
    )
    
    return {"success": True}


@router.get("/analytics/achievements/popular")
async def get_popular_achievements():
    """Get most commonly unlocked achievements"""
    popular = await db.achievement_stats.find(
        {},
        {"_id": 0}
    ).sort("unlock_count", -1).limit(10).to_list(10)
    
    return {"popular_achievements": popular}


@router.get("/analytics/daily-active/{days}")
async def get_daily_active_users(days: int = 7):
    """Get daily active user counts"""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    
    pipeline = [
        {"$match": {"started_at": {"$gte": cutoff.isoformat()}}},
        {"$group": {
            "_id": "$session_date",
            "unique_users": {"$addToSet": "$user_id"},
            "total_sessions": {"$sum": 1},
        }},
        {"$project": {
            "date": "$_id",
            "dau": {"$size": "$unique_users"},
            "sessions": "$total_sessions",
        }},
        {"$sort": {"date": 1}},
    ]
    
    results = await db.player_sessions.aggregate(pipeline).to_list(days)
    
    return {"daily_stats": results}


# ========== USER OPTIMIZATION ENDPOINTS ==========

@router.get("/user/profile/{user_id}")
async def get_full_user_profile(user_id: str):
    """Get comprehensive user profile with all stats"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get related data
    stats = await db.player_stats.find_one({"user_id": user_id}, {"_id": 0})
    vip = await db.player_vip.find_one({"user_id": user_id}, {"_id": 0})
    titles = await db.player_titles.find_one({"user_id": user_id}, {"_id": 0})
    
    # Get tacklebox count
    tacklebox_count = await db.tacklebox.count_documents({"user_id": user_id})
    
    # Get achievements count
    achievements_count = len(user.get("achievements", []))
    
    return {
        "user": user,
        "stats": stats or {},
        "vip": vip or {"tier": 0, "is_active": False},
        "titles": titles or {"titles": [], "active_title": None},
        "tacklebox_count": tacklebox_count,
        "achievements_count": achievements_count,
    }


@router.post("/user/title/set")
async def set_active_title(user_id: str, title: str):
    """Set user's active title"""
    titles = await db.player_titles.find_one({"user_id": user_id}, {"_id": 0})
    
    if not titles or title not in titles.get("titles", []):
        raise HTTPException(status_code=400, detail="Title not owned")
    
    await db.player_titles.update_one(
        {"user_id": user_id},
        {"$set": {"active_title": title}}
    )
    
    return {"success": True, "active_title": title}


@router.get("/user/online-status")
async def get_online_users():
    """Get currently online user count (last 5 minutes)"""
    cutoff = (datetime.now(timezone.utc) - timedelta(minutes=5)).isoformat()
    
    online_count = await db.player_sessions.count_documents({
        "started_at": {"$gte": cutoff}
    })
    
    return {"online_users": online_count}
