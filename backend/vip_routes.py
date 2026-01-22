# ========== GO FISH! VIP SUBSCRIPTION SYSTEM API ==========
# Premium membership with exclusive benefits
# ~400+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os

router = APIRouter(prefix="/api/vip", tags=["vip"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== VIP TIERS CONFIGURATION ==========

VIP_TIERS = {
    0: {
        "name": "Free",
        "color": "#888888",
        "icon": "👤",
        "benefits": [],
        "monthly_cost": 0,
    },
    1: {
        "name": "Bronze",
        "color": "#CD7F32",
        "icon": "🥉",
        "benefits": [
            {"type": "daily_gems", "amount": 10, "description": "10 free gems daily"},
            {"type": "energy_max_bonus", "percent": 10, "description": "+10% max energy"},
            {"type": "xp_bonus", "percent": 10, "description": "+10% XP gain"},
            {"type": "ad_free", "description": "Remove ads"},
        ],
        "monthly_cost_usd": 2.99,
        "gem_cost_monthly": 100,
    },
    2: {
        "name": "Silver",
        "color": "#C0C0C0",
        "icon": "🥈",
        "benefits": [
            {"type": "daily_gems", "amount": 25, "description": "25 free gems daily"},
            {"type": "daily_coins", "amount": 500, "description": "500 free coins daily"},
            {"type": "energy_max_bonus", "percent": 25, "description": "+25% max energy"},
            {"type": "energy_regen_bonus", "percent": 25, "description": "+25% energy regen"},
            {"type": "xp_bonus", "percent": 25, "description": "+25% XP gain"},
            {"type": "rare_fish_bonus", "percent": 15, "description": "+15% rare fish chance"},
            {"type": "ad_free", "description": "Remove ads"},
            {"type": "exclusive_lure", "lure_id": "silver_lure", "description": "Exclusive Silver Lure"},
        ],
        "monthly_cost_usd": 5.99,
        "gem_cost_monthly": 200,
    },
    3: {
        "name": "Gold",
        "color": "#FFD700",
        "icon": "🥇",
        "benefits": [
            {"type": "daily_gems", "amount": 50, "description": "50 free gems daily"},
            {"type": "daily_coins", "amount": 1500, "description": "1500 free coins daily"},
            {"type": "energy_max_bonus", "percent": 50, "description": "+50% max energy"},
            {"type": "energy_regen_bonus", "percent": 50, "description": "+50% energy regen"},
            {"type": "xp_bonus", "percent": 50, "description": "+50% XP gain"},
            {"type": "rare_fish_bonus", "percent": 30, "description": "+30% rare fish chance"},
            {"type": "legendary_fish_bonus", "percent": 15, "description": "+15% legendary chance"},
            {"type": "ad_free", "description": "Remove ads"},
            {"type": "exclusive_lure", "lure_id": "gold_lure", "description": "Exclusive Gold Lure"},
            {"type": "exclusive_rod", "rod_id": "gold_rod", "description": "Exclusive Gold Rod"},
            {"type": "priority_support", "description": "Priority customer support"},
        ],
        "monthly_cost_usd": 9.99,
        "gem_cost_monthly": 400,
    },
    4: {
        "name": "Diamond",
        "color": "#00FFFF",
        "icon": "💎",
        "benefits": [
            {"type": "daily_gems", "amount": 100, "description": "100 free gems daily"},
            {"type": "daily_coins", "amount": 3000, "description": "3000 free coins daily"},
            {"type": "energy_max_bonus", "percent": 100, "description": "+100% max energy"},
            {"type": "energy_regen_bonus", "percent": 100, "description": "+100% energy regen"},
            {"type": "xp_bonus", "percent": 100, "description": "+100% XP gain"},
            {"type": "coin_bonus", "percent": 25, "description": "+25% coins from catches"},
            {"type": "rare_fish_bonus", "percent": 50, "description": "+50% rare fish chance"},
            {"type": "legendary_fish_bonus", "percent": 30, "description": "+30% legendary chance"},
            {"type": "ad_free", "description": "Remove ads"},
            {"type": "exclusive_lure", "lure_id": "diamond_lure", "description": "Exclusive Diamond Lure"},
            {"type": "exclusive_rod", "rod_id": "diamond_rod", "description": "Exclusive Diamond Rod"},
            {"type": "exclusive_boat", "boat_id": "diamond_yacht", "description": "Exclusive Diamond Yacht"},
            {"type": "exclusive_title", "title": "Diamond Fisher", "description": "Diamond Fisher title"},
            {"type": "early_access", "description": "Early access to new features"},
            {"type": "priority_support", "description": "Priority customer support"},
            {"type": "monthly_mystery_box", "description": "Monthly mystery box"},
        ],
        "monthly_cost_usd": 19.99,
        "gem_cost_monthly": 800,
    },
}


# ========== REQUEST MODELS ==========

class SubscribeRequest(BaseModel):
    user_id: str
    tier: int
    payment_method: str = "gems"  # "gems", "usd", "trial"
    duration_months: int = 1


class ClaimDailyVIPRequest(BaseModel):
    user_id: str


class CancelSubscriptionRequest(BaseModel):
    user_id: str
    reason: Optional[str] = None


# ========== HELPER FUNCTIONS ==========

async def get_player_vip(user_id: str) -> dict:
    """Get or create player VIP record"""
    vip_record = await db.player_vip.find_one({"user_id": user_id}, {"_id": 0})
    
    if not vip_record:
        vip_record = {
            "user_id": user_id,
            "tier": 0,
            "is_active": False,
            "started_at": None,
            "expires_at": None,
            "auto_renew": False,
            "total_days_vip": 0,
            "last_daily_claim": None,
            "benefits_claimed": [],
        }
        await db.player_vip.insert_one(vip_record)
    
    # Check if VIP has expired
    if vip_record.get("expires_at"):
        expires = datetime.fromisoformat(vip_record["expires_at"])
        if expires < datetime.now(timezone.utc):
            # VIP expired
            vip_record["is_active"] = False
            vip_record["tier"] = 0
            await db.player_vip.update_one(
                {"user_id": user_id},
                {"$set": {"is_active": False, "tier": 0}}
            )
    
    return vip_record


def get_vip_benefits(tier: int) -> List[dict]:
    """Get list of benefits for a VIP tier"""
    tier_data = VIP_TIERS.get(tier, VIP_TIERS[0])
    return tier_data.get("benefits", [])


async def apply_vip_benefits(user_id: str, tier: int):
    """Apply permanent VIP benefits (exclusive items)"""
    benefits = get_vip_benefits(tier)
    
    for benefit in benefits:
        if benefit["type"] == "exclusive_lure":
            await db.player_inventory.update_one(
                {"user_id": user_id},
                {"$addToSet": {"items": benefit["lure_id"]}},
                upsert=True
            )
        elif benefit["type"] == "exclusive_rod":
            await db.player_inventory.update_one(
                {"user_id": user_id},
                {"$addToSet": {"items": benefit["rod_id"]}},
                upsert=True
            )
        elif benefit["type"] == "exclusive_boat":
            await db.player_inventory.update_one(
                {"user_id": user_id},
                {"$addToSet": {"items": benefit["boat_id"]}},
                upsert=True
            )
        elif benefit["type"] == "exclusive_title":
            await db.player_titles.update_one(
                {"user_id": user_id},
                {"$addToSet": {"titles": benefit["title"]}},
                upsert=True
            )


# ========== VIP ENDPOINTS ==========

@router.get("/status/{user_id}")
async def get_vip_status(user_id: str):
    """Get user's current VIP status"""
    vip = await get_player_vip(user_id)
    tier_data = VIP_TIERS.get(vip["tier"], VIP_TIERS[0])
    
    # Calculate days remaining
    days_remaining = 0
    if vip.get("expires_at") and vip["is_active"]:
        expires = datetime.fromisoformat(vip["expires_at"])
        days_remaining = max(0, (expires - datetime.now(timezone.utc)).days)
    
    # Check if daily rewards can be claimed
    can_claim_daily = False
    if vip["is_active"] and vip["tier"] > 0:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        if not vip.get("last_daily_claim") or not vip["last_daily_claim"].startswith(today):
            can_claim_daily = True
    
    return {
        "is_vip": vip["is_active"] and vip["tier"] > 0,
        "tier": vip["tier"],
        "tier_name": tier_data["name"],
        "tier_icon": tier_data["icon"],
        "tier_color": tier_data["color"],
        "benefits": tier_data.get("benefits", []),
        "expires_at": vip.get("expires_at"),
        "days_remaining": days_remaining,
        "auto_renew": vip.get("auto_renew", False),
        "can_claim_daily": can_claim_daily,
        "total_days_vip": vip.get("total_days_vip", 0),
    }


@router.get("/tiers")
async def get_vip_tiers():
    """Get all VIP tier information"""
    tiers = []
    for tier_id, tier_data in VIP_TIERS.items():
        if tier_id > 0:  # Skip free tier
            tiers.append({
                "tier": tier_id,
                "name": tier_data["name"],
                "icon": tier_data["icon"],
                "color": tier_data["color"],
                "benefits": tier_data["benefits"],
                "cost_usd": tier_data.get("monthly_cost_usd", 0),
                "cost_gems": tier_data.get("gem_cost_monthly", 0),
            })
    return {"tiers": tiers}


@router.post("/subscribe")
async def subscribe_to_vip(request: SubscribeRequest):
    """Subscribe to VIP tier"""
    if request.tier not in VIP_TIERS or request.tier == 0:
        raise HTTPException(status_code=400, detail="Invalid VIP tier")
    
    tier_data = VIP_TIERS[request.tier]
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    now = datetime.now(timezone.utc)
    duration_days = request.duration_months * 30
    
    # Process payment
    if request.payment_method == "gems":
        gem_cost = tier_data.get("gem_cost_monthly", 0) * request.duration_months
        if user.get("gems", 0) < gem_cost:
            raise HTTPException(status_code=400, detail="Not enough gems")
        
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"gems": -gem_cost}}
        )
    elif request.payment_method == "trial":
        # Check if already used trial
        vip = await get_player_vip(request.user_id)
        if vip.get("trial_used"):
            raise HTTPException(status_code=400, detail="Trial already used")
        
        duration_days = 3  # 3-day trial
        request.tier = 1  # Trial is always Bronze
        
        await db.player_vip.update_one(
            {"user_id": request.user_id},
            {"$set": {"trial_used": True}}
        )
    
    # Get current VIP status to handle upgrades/extensions
    current_vip = await get_player_vip(request.user_id)
    
    if current_vip["is_active"] and current_vip.get("expires_at"):
        # Extend existing subscription
        current_expires = datetime.fromisoformat(current_vip["expires_at"])
        if current_expires > now:
            new_expires = current_expires + timedelta(days=duration_days)
        else:
            new_expires = now + timedelta(days=duration_days)
    else:
        new_expires = now + timedelta(days=duration_days)
    
    # Update VIP status
    await db.player_vip.update_one(
        {"user_id": request.user_id},
        {
            "$set": {
                "tier": request.tier,
                "is_active": True,
                "started_at": now.isoformat() if not current_vip["is_active"] else current_vip.get("started_at", now.isoformat()),
                "expires_at": new_expires.isoformat(),
                "auto_renew": request.payment_method == "usd",
            },
            "$inc": {"total_days_vip": duration_days}
        },
        upsert=True
    )
    
    # Apply permanent benefits
    await apply_vip_benefits(request.user_id, request.tier)
    
    # Record subscription
    subscription_record = {
        "id": str(uuid.uuid4()),
        "user_id": request.user_id,
        "tier": request.tier,
        "duration_days": duration_days,
        "payment_method": request.payment_method,
        "amount": tier_data.get("gem_cost_monthly", 0) * request.duration_months if request.payment_method == "gems" else 0,
        "subscribed_at": now.isoformat(),
    }
    await db.vip_subscriptions.insert_one(subscription_record)
    
    return {
        "success": True,
        "tier": request.tier,
        "tier_name": tier_data["name"],
        "expires_at": new_expires.isoformat(),
        "duration_days": duration_days,
        "benefits": tier_data["benefits"]
    }


@router.post("/claim-daily")
async def claim_daily_vip_rewards(request: ClaimDailyVIPRequest):
    """Claim daily VIP rewards"""
    vip = await get_player_vip(request.user_id)
    
    if not vip["is_active"] or vip["tier"] == 0:
        raise HTTPException(status_code=400, detail="Not a VIP member")
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    if vip.get("last_daily_claim") and vip["last_daily_claim"].startswith(today):
        raise HTTPException(status_code=400, detail="Already claimed today")
    
    benefits = get_vip_benefits(vip["tier"])
    rewards = {}
    
    for benefit in benefits:
        if benefit["type"] == "daily_gems":
            rewards["gems"] = benefit["amount"]
            await db.users.update_one(
                {"id": request.user_id},
                {"$inc": {"gems": benefit["amount"]}}
            )
        elif benefit["type"] == "daily_coins":
            rewards["coins"] = benefit["amount"]
            await db.users.update_one(
                {"id": request.user_id},
                {"$inc": {"coins": benefit["amount"]}}
            )
    
    # Update last claim
    await db.player_vip.update_one(
        {"user_id": request.user_id},
        {"$set": {"last_daily_claim": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {
        "success": True,
        "rewards": rewards,
        "tier": vip["tier"]
    }


@router.post("/cancel")
async def cancel_vip_subscription(request: CancelSubscriptionRequest):
    """Cancel VIP subscription auto-renewal"""
    vip = await get_player_vip(request.user_id)
    
    if not vip["is_active"]:
        raise HTTPException(status_code=400, detail="No active subscription")
    
    await db.player_vip.update_one(
        {"user_id": request.user_id},
        {"$set": {"auto_renew": False}}
    )
    
    # Log cancellation
    await db.vip_cancellations.insert_one({
        "user_id": request.user_id,
        "tier": vip["tier"],
        "reason": request.reason,
        "cancelled_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": vip.get("expires_at"),
    })
    
    return {
        "success": True,
        "message": "Auto-renewal cancelled. VIP benefits will continue until expiration.",
        "expires_at": vip.get("expires_at")
    }


@router.get("/bonuses/{user_id}")
async def get_active_vip_bonuses(user_id: str):
    """Get active VIP bonuses for gameplay calculations"""
    vip = await get_player_vip(user_id)
    
    if not vip["is_active"] or vip["tier"] == 0:
        return {"has_vip": False, "bonuses": {}}
    
    benefits = get_vip_benefits(vip["tier"])
    bonuses = {
        "xp_multiplier": 1.0,
        "coin_multiplier": 1.0,
        "energy_max_bonus": 0,
        "energy_regen_bonus": 0,
        "rare_fish_bonus": 0,
        "legendary_fish_bonus": 0,
        "ad_free": False,
    }
    
    for benefit in benefits:
        if benefit["type"] == "xp_bonus":
            bonuses["xp_multiplier"] = 1 + (benefit["percent"] / 100)
        elif benefit["type"] == "coin_bonus":
            bonuses["coin_multiplier"] = 1 + (benefit["percent"] / 100)
        elif benefit["type"] == "energy_max_bonus":
            bonuses["energy_max_bonus"] = benefit["percent"]
        elif benefit["type"] == "energy_regen_bonus":
            bonuses["energy_regen_bonus"] = benefit["percent"]
        elif benefit["type"] == "rare_fish_bonus":
            bonuses["rare_fish_bonus"] = benefit["percent"]
        elif benefit["type"] == "legendary_fish_bonus":
            bonuses["legendary_fish_bonus"] = benefit["percent"]
        elif benefit["type"] == "ad_free":
            bonuses["ad_free"] = True
    
    return {
        "has_vip": True,
        "tier": vip["tier"],
        "bonuses": bonuses
    }


@router.get("/history/{user_id}")
async def get_vip_history(user_id: str):
    """Get VIP subscription history"""
    subscriptions = await db.vip_subscriptions.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("subscribed_at", -1).to_list(50)
    
    total_gems_spent = sum(s.get("amount", 0) for s in subscriptions if s.get("payment_method") == "gems")
    total_days = sum(s.get("duration_days", 0) for s in subscriptions)
    
    return {
        "subscriptions": subscriptions,
        "total_subscriptions": len(subscriptions),
        "total_days_vip": total_days,
        "total_gems_spent": total_gems_spent
    }


# ========== GRANT VIP FUNCTION (for bundles/rewards) ==========

async def grant_vip_days(user_id: str, days: int, tier: int = 1):
    """Grant VIP days to a user (called from rewards/purchases)"""
    now = datetime.now(timezone.utc)
    current_vip = await get_player_vip(user_id)
    
    if current_vip["is_active"] and current_vip.get("expires_at"):
        current_expires = datetime.fromisoformat(current_vip["expires_at"])
        if current_expires > now:
            new_expires = current_expires + timedelta(days=days)
        else:
            new_expires = now + timedelta(days=days)
    else:
        new_expires = now + timedelta(days=days)
    
    # Set tier to max of current or granted
    new_tier = max(current_vip.get("tier", 0), tier)
    
    await db.player_vip.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "tier": new_tier,
                "is_active": True,
                "expires_at": new_expires.isoformat(),
            },
            "$inc": {"total_days_vip": days}
        },
        upsert=True
    )
    
    await apply_vip_benefits(user_id, new_tier)
    
    return {"granted_days": days, "tier": new_tier, "expires_at": new_expires.isoformat()}
