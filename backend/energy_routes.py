# ========== GO FISH! ENERGY SYSTEM API ==========
# Stamina management, regeneration, and energy boosters
# ~400+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import math

router = APIRouter(prefix="/api/energy", tags=["energy"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== ENERGY CONFIGURATION ==========

ENERGY_CONFIG = {
    "max_energy": 100,
    "regen_rate_per_minute": 1,
    "cast_cost": 1,
    "perfect_catch_refund": 1,
    "level_bonus_per_10_levels": 10,
    "vip_bonus_multiplier": 1.5,
    "energy_per_ad": 10,
    "energy_per_gem": 5,
    "gem_cost_per_refill": 50,
}

ENERGY_BOOSTERS = {
    "small_energy_drink": {
        "id": "small_energy_drink",
        "name": "Small Energy Drink",
        "energy_restore": 25,
        "cost": {"coins": 500},
        "duration": None,
        "icon": "⚡",
    },
    "medium_energy_drink": {
        "id": "medium_energy_drink",
        "name": "Medium Energy Drink",
        "energy_restore": 50,
        "cost": {"coins": 900},
        "duration": None,
        "icon": "🔋",
    },
    "large_energy_drink": {
        "id": "large_energy_drink",
        "name": "Large Energy Drink",
        "energy_restore": 100,
        "cost": {"coins": 1500},
        "duration": None,
        "icon": "⚡⚡",
    },
    "infinite_energy_1h": {
        "id": "infinite_energy_1h",
        "name": "Infinite Energy (1 Hour)",
        "energy_restore": 0,
        "infinite_duration_minutes": 60,
        "cost": {"gems": 25},
        "icon": "♾️",
    },
    "double_regen_30m": {
        "id": "double_regen_30m",
        "name": "Double Regen (30 Min)",
        "energy_restore": 0,
        "regen_multiplier": 2.0,
        "duration_minutes": 30,
        "cost": {"gems": 15},
        "icon": "⏫",
    },
}


# ========== REQUEST MODELS ==========

class UseEnergyRequest(BaseModel):
    user_id: str
    amount: int = 1
    action: str = "cast"


class RestoreEnergyRequest(BaseModel):
    user_id: str
    method: str  # "ad", "gems", "booster", "refill"
    booster_id: Optional[str] = None


class ActivateBoosterRequest(BaseModel):
    user_id: str
    booster_id: str


# ========== HELPER FUNCTIONS ==========

async def get_player_energy(user_id: str) -> dict:
    """Get or create player energy record with regeneration"""
    energy_record = await db.player_energy.find_one({"user_id": user_id}, {"_id": 0})
    
    if not energy_record:
        # Initialize new energy record
        energy_record = {
            "user_id": user_id,
            "current_energy": ENERGY_CONFIG["max_energy"],
            "max_energy": ENERGY_CONFIG["max_energy"],
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "active_boosters": [],
            "infinite_until": None,
            "regen_multiplier": 1.0,
            "regen_multiplier_until": None,
            "total_energy_spent": 0,
            "total_energy_restored": 0,
            "ads_watched_today": 0,
            "last_ad_watch": None,
        }
        await db.player_energy.insert_one(energy_record)
        return energy_record
    
    # Calculate regenerated energy since last update
    now = datetime.now(timezone.utc)
    last_update = datetime.fromisoformat(energy_record["last_updated"])
    time_diff = now - last_update
    minutes_passed = time_diff.total_seconds() / 60
    
    # Check for active regen booster
    regen_multiplier = 1.0
    if energy_record.get("regen_multiplier_until"):
        regen_until = datetime.fromisoformat(energy_record["regen_multiplier_until"])
        if regen_until > now:
            regen_multiplier = energy_record.get("regen_multiplier", 1.0)
        else:
            # Expired, reset
            await db.player_energy.update_one(
                {"user_id": user_id},
                {"$set": {"regen_multiplier": 1.0, "regen_multiplier_until": None}}
            )
    
    # Calculate energy to regenerate
    regen_rate = ENERGY_CONFIG["regen_rate_per_minute"] * regen_multiplier
    energy_to_add = int(minutes_passed * regen_rate)
    
    # Check for infinite energy mode
    if energy_record.get("infinite_until"):
        infinite_until = datetime.fromisoformat(energy_record["infinite_until"])
        if infinite_until > now:
            energy_record["current_energy"] = energy_record["max_energy"]
            energy_record["is_infinite"] = True
        else:
            # Expired
            await db.player_energy.update_one(
                {"user_id": user_id},
                {"$set": {"infinite_until": None}}
            )
            energy_record["is_infinite"] = False
    else:
        energy_record["is_infinite"] = False
    
    if energy_to_add > 0 and not energy_record.get("is_infinite"):
        new_energy = min(
            energy_record["current_energy"] + energy_to_add,
            energy_record["max_energy"]
        )
        
        if new_energy != energy_record["current_energy"]:
            energy_record["current_energy"] = new_energy
            energy_record["last_updated"] = now.isoformat()
            
            await db.player_energy.update_one(
                {"user_id": user_id},
                {
                    "$set": {
                        "current_energy": new_energy,
                        "last_updated": now.isoformat()
                    }
                }
            )
    
    # Calculate time to full energy
    if energy_record["current_energy"] < energy_record["max_energy"]:
        energy_needed = energy_record["max_energy"] - energy_record["current_energy"]
        minutes_to_full = math.ceil(energy_needed / (ENERGY_CONFIG["regen_rate_per_minute"] * regen_multiplier))
        energy_record["minutes_to_full"] = minutes_to_full
    else:
        energy_record["minutes_to_full"] = 0
    
    return energy_record


async def get_max_energy_for_user(user_id: str) -> int:
    """Calculate max energy based on level and VIP status"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "level": 1})
    vip = await db.player_vip.find_one({"user_id": user_id}, {"_id": 0})
    
    base_max = ENERGY_CONFIG["max_energy"]
    level = user.get("level", 1) if user else 1
    
    # Level bonus: +10 max energy per 10 levels
    level_bonus = (level // 10) * ENERGY_CONFIG["level_bonus_per_10_levels"]
    
    # VIP bonus
    vip_bonus = 0
    if vip and vip.get("is_active"):
        vip_bonus = int(base_max * (ENERGY_CONFIG["vip_bonus_multiplier"] - 1))
    
    return base_max + level_bonus + vip_bonus


# ========== ENERGY ENDPOINTS ==========

@router.get("/{user_id}")
async def get_energy(user_id: str):
    """Get current energy status"""
    energy = await get_player_energy(user_id)
    
    # Update max energy based on user stats
    max_energy = await get_max_energy_for_user(user_id)
    if max_energy != energy.get("max_energy"):
        await db.player_energy.update_one(
            {"user_id": user_id},
            {"$set": {"max_energy": max_energy}}
        )
        energy["max_energy"] = max_energy
    
    return {
        "current": energy["current_energy"],
        "max": energy["max_energy"],
        "minutes_to_full": energy.get("minutes_to_full", 0),
        "is_infinite": energy.get("is_infinite", False),
        "infinite_until": energy.get("infinite_until"),
        "regen_multiplier": energy.get("regen_multiplier", 1.0),
        "regen_until": energy.get("regen_multiplier_until"),
        "config": ENERGY_CONFIG,
    }


@router.post("/use")
async def use_energy(request: UseEnergyRequest):
    """Consume energy for an action"""
    energy = await get_player_energy(request.user_id)
    
    # Check for infinite energy
    if energy.get("is_infinite"):
        return {
            "success": True,
            "energy_used": 0,
            "current_energy": energy["max_energy"],
            "is_infinite": True
        }
    
    # Check if enough energy
    if energy["current_energy"] < request.amount:
        raise HTTPException(
            status_code=400, 
            detail=f"Not enough energy. Have: {energy['current_energy']}, Need: {request.amount}"
        )
    
    # Deduct energy
    new_energy = energy["current_energy"] - request.amount
    
    await db.player_energy.update_one(
        {"user_id": request.user_id},
        {
            "$set": {
                "current_energy": new_energy,
                "last_updated": datetime.now(timezone.utc).isoformat()
            },
            "$inc": {"total_energy_spent": request.amount}
        }
    )
    
    return {
        "success": True,
        "energy_used": request.amount,
        "current_energy": new_energy,
        "action": request.action
    }


@router.post("/restore")
async def restore_energy(request: RestoreEnergyRequest):
    """Restore energy via various methods"""
    energy = await get_player_energy(request.user_id)
    now = datetime.now(timezone.utc)
    
    if request.method == "ad":
        # Check daily ad limit
        today = now.strftime("%Y-%m-%d")
        if energy.get("last_ad_watch") and energy["last_ad_watch"].startswith(today):
            if energy.get("ads_watched_today", 0) >= 10:
                raise HTTPException(status_code=400, detail="Daily ad limit reached")
        else:
            # New day, reset counter
            energy["ads_watched_today"] = 0
        
        # Add energy from ad
        energy_to_add = ENERGY_CONFIG["energy_per_ad"]
        new_energy = min(energy["current_energy"] + energy_to_add, energy["max_energy"])
        
        await db.player_energy.update_one(
            {"user_id": request.user_id},
            {
                "$set": {
                    "current_energy": new_energy,
                    "last_ad_watch": now.isoformat(),
                    "last_updated": now.isoformat()
                },
                "$inc": {
                    "ads_watched_today": 1,
                    "total_energy_restored": energy_to_add
                }
            }
        )
        
        return {
            "success": True,
            "method": "ad",
            "energy_restored": energy_to_add,
            "current_energy": new_energy,
            "ads_remaining": 10 - (energy.get("ads_watched_today", 0) + 1)
        }
    
    elif request.method == "gems":
        # Check user gems
        user = await db.users.find_one({"id": request.user_id}, {"_id": 0, "gems": 1})
        gems = user.get("gems", 0) if user else 0
        
        if gems < ENERGY_CONFIG["gem_cost_per_refill"]:
            raise HTTPException(status_code=400, detail="Not enough gems")
        
        # Deduct gems and refill energy
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"gems": -ENERGY_CONFIG["gem_cost_per_refill"]}}
        )
        
        await db.player_energy.update_one(
            {"user_id": request.user_id},
            {
                "$set": {
                    "current_energy": energy["max_energy"],
                    "last_updated": now.isoformat()
                },
                "$inc": {"total_energy_restored": energy["max_energy"] - energy["current_energy"]}
            }
        )
        
        return {
            "success": True,
            "method": "gems",
            "gems_spent": ENERGY_CONFIG["gem_cost_per_refill"],
            "current_energy": energy["max_energy"],
            "energy_restored": energy["max_energy"] - energy["current_energy"]
        }
    
    elif request.method == "booster":
        if not request.booster_id:
            raise HTTPException(status_code=400, detail="Booster ID required")
        
        booster = ENERGY_BOOSTERS.get(request.booster_id)
        if not booster:
            raise HTTPException(status_code=404, detail="Booster not found")
        
        # Check if user has this booster in inventory
        inventory = await db.player_inventory.find_one({"user_id": request.user_id}, {"_id": 0})
        booster_count = inventory.get("boosters", {}).get(request.booster_id, 0) if inventory else 0
        
        if booster_count <= 0:
            raise HTTPException(status_code=400, detail="You don't have this booster")
        
        # Use booster
        update_ops = {"$inc": {f"boosters.{request.booster_id}": -1}}
        await db.player_inventory.update_one({"user_id": request.user_id}, update_ops)
        
        # Apply booster effect
        if booster.get("energy_restore"):
            new_energy = min(energy["current_energy"] + booster["energy_restore"], energy["max_energy"])
            await db.player_energy.update_one(
                {"user_id": request.user_id},
                {
                    "$set": {"current_energy": new_energy, "last_updated": now.isoformat()},
                    "$inc": {"total_energy_restored": booster["energy_restore"]}
                }
            )
            return {
                "success": True,
                "method": "booster",
                "booster": booster["name"],
                "energy_restored": booster["energy_restore"],
                "current_energy": new_energy
            }
        
        elif booster.get("infinite_duration_minutes"):
            infinite_until = now + timedelta(minutes=booster["infinite_duration_minutes"])
            await db.player_energy.update_one(
                {"user_id": request.user_id},
                {"$set": {"infinite_until": infinite_until.isoformat()}}
            )
            return {
                "success": True,
                "method": "booster",
                "booster": booster["name"],
                "infinite_until": infinite_until.isoformat(),
                "duration_minutes": booster["infinite_duration_minutes"]
            }
        
        elif booster.get("regen_multiplier"):
            regen_until = now + timedelta(minutes=booster["duration_minutes"])
            await db.player_energy.update_one(
                {"user_id": request.user_id},
                {
                    "$set": {
                        "regen_multiplier": booster["regen_multiplier"],
                        "regen_multiplier_until": regen_until.isoformat()
                    }
                }
            )
            return {
                "success": True,
                "method": "booster",
                "booster": booster["name"],
                "regen_multiplier": booster["regen_multiplier"],
                "until": regen_until.isoformat()
            }
    
    raise HTTPException(status_code=400, detail="Invalid restore method")


@router.get("/boosters/available")
async def get_available_boosters():
    """Get list of all energy boosters"""
    return {"boosters": list(ENERGY_BOOSTERS.values())}


@router.post("/boosters/purchase")
async def purchase_booster(user_id: str, booster_id: str, quantity: int = 1):
    """Purchase an energy booster"""
    booster = ENERGY_BOOSTERS.get(booster_id)
    if not booster:
        raise HTTPException(status_code=404, detail="Booster not found")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate total cost
    cost = booster["cost"]
    total_cost = {k: v * quantity for k, v in cost.items()}
    
    # Check if user can afford
    for currency, amount in total_cost.items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct currency
    update_ops = {}
    for currency, amount in total_cost.items():
        update_ops[f"$inc"] = update_ops.get("$inc", {})
        update_ops["$inc"][currency] = -amount
    
    await db.users.update_one({"id": user_id}, update_ops)
    
    # Add booster to inventory
    await db.player_inventory.update_one(
        {"user_id": user_id},
        {"$inc": {f"boosters.{booster_id}": quantity}},
        upsert=True
    )
    
    return {
        "success": True,
        "booster": booster["name"],
        "quantity": quantity,
        "cost": total_cost
    }


@router.post("/perfect-catch-refund/{user_id}")
async def perfect_catch_energy_refund(user_id: str):
    """Refund energy for a perfect catch"""
    energy = await get_player_energy(user_id)
    
    if energy.get("is_infinite"):
        return {"success": True, "refunded": 0, "current_energy": energy["max_energy"]}
    
    refund = ENERGY_CONFIG["perfect_catch_refund"]
    new_energy = min(energy["current_energy"] + refund, energy["max_energy"])
    
    await db.player_energy.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "current_energy": new_energy,
                "last_updated": datetime.now(timezone.utc).isoformat()
            },
            "$inc": {"total_energy_restored": refund}
        }
    )
    
    return {
        "success": True,
        "refunded": refund,
        "current_energy": new_energy
    }


@router.get("/stats/{user_id}")
async def get_energy_stats(user_id: str):
    """Get energy usage statistics"""
    energy = await get_player_energy(user_id)
    
    return {
        "total_energy_spent": energy.get("total_energy_spent", 0),
        "total_energy_restored": energy.get("total_energy_restored", 0),
        "ads_watched_today": energy.get("ads_watched_today", 0),
        "current_energy": energy["current_energy"],
        "max_energy": energy["max_energy"],
        "efficiency_ratio": round(
            energy.get("total_energy_spent", 0) / max(energy.get("total_energy_restored", 1), 1), 
            2
        )
    }
