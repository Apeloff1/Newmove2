# ========== GO FISH! SHOP & IAP SYSTEM API ==========
# In-app purchases, shop items, bundles, and daily deals
# ~500+ lines of backend polish

from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
import os
import random
import hashlib

router = APIRouter(prefix="/api/shop", tags=["shop"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== SHOP ITEMS DATABASE ==========

CURRENCY_PACKS = [
    {
        "id": "coins_small",
        "name": "Pocket Change",
        "type": "currency",
        "currency": "coins",
        "amount": 1000,
        "price_usd": 0.99,
        "bonus_percent": 0,
        "icon": "💰",
        "popular": False,
    },
    {
        "id": "coins_medium",
        "name": "Fisher's Wallet",
        "type": "currency",
        "currency": "coins",
        "amount": 5500,
        "price_usd": 4.99,
        "bonus_percent": 10,
        "icon": "💰💰",
        "popular": True,
    },
    {
        "id": "coins_large",
        "name": "Treasure Chest",
        "type": "currency",
        "currency": "coins",
        "amount": 12000,
        "price_usd": 9.99,
        "bonus_percent": 20,
        "icon": "💰💰💰",
        "popular": False,
    },
    {
        "id": "coins_mega",
        "name": "Pirate's Hoard",
        "type": "currency",
        "currency": "coins",
        "amount": 65000,
        "price_usd": 49.99,
        "bonus_percent": 30,
        "icon": "🏴‍☠️💰",
        "popular": False,
    },
    {
        "id": "gems_small",
        "name": "Gem Pouch",
        "type": "currency",
        "currency": "gems",
        "amount": 50,
        "price_usd": 0.99,
        "bonus_percent": 0,
        "icon": "💎",
        "popular": False,
    },
    {
        "id": "gems_medium",
        "name": "Gem Bag",
        "type": "currency",
        "currency": "gems",
        "amount": 280,
        "price_usd": 4.99,
        "bonus_percent": 12,
        "icon": "💎💎",
        "popular": True,
    },
    {
        "id": "gems_large",
        "name": "Gem Vault",
        "type": "currency",
        "currency": "gems",
        "amount": 600,
        "price_usd": 9.99,
        "bonus_percent": 20,
        "icon": "💎💎💎",
        "popular": False,
    },
    {
        "id": "gems_mega",
        "name": "Royal Treasury",
        "type": "currency",
        "currency": "gems",
        "amount": 3500,
        "price_usd": 49.99,
        "bonus_percent": 40,
        "icon": "👑💎",
        "popular": False,
    },
]

SHOP_ITEMS = [
    {
        "id": "rod_bamboo",
        "name": "Bamboo Rod",
        "type": "rod",
        "description": "A light and flexible rod for beginners",
        "cost": {"coins": 500},
        "stats": {"cast_distance": 1.1, "reel_speed": 1.0, "durability": 0.9},
        "icon": "🎣",
        "unlock_level": 1,
    },
    {
        "id": "rod_carbon",
        "name": "Carbon Fiber Rod",
        "type": "rod",
        "description": "Professional grade rod with excellent strength",
        "cost": {"coins": 2500},
        "stats": {"cast_distance": 1.3, "reel_speed": 1.2, "durability": 1.1},
        "icon": "🎣",
        "unlock_level": 10,
    },
    {
        "id": "rod_titanium",
        "name": "Titanium Master",
        "type": "rod",
        "description": "Legendary rod used by champions",
        "cost": {"gems": 200},
        "stats": {"cast_distance": 1.5, "reel_speed": 1.4, "durability": 1.3},
        "icon": "🎣✨",
        "unlock_level": 25,
    },
    {
        "id": "lure_spinner",
        "name": "Spinner Lure",
        "type": "lure",
        "description": "Attracts fish with spinning motion",
        "cost": {"coins": 300},
        "stats": {"attraction": 1.2, "rare_chance": 1.0},
        "icon": "🪝",
        "unlock_level": 1,
    },
    {
        "id": "lure_golden",
        "name": "Golden Lure",
        "type": "lure",
        "description": "Increases chance of rare fish",
        "cost": {"gems": 100},
        "stats": {"attraction": 1.3, "rare_chance": 1.5},
        "icon": "🪝✨",
        "unlock_level": 15,
    },
    {
        "id": "lure_legendary",
        "name": "Legendary Lure",
        "type": "lure",
        "description": "Significantly boosts legendary fish chance",
        "cost": {"gems": 500},
        "stats": {"attraction": 1.5, "rare_chance": 2.0, "legendary_chance": 1.8},
        "icon": "🪝👑",
        "unlock_level": 50,
    },
    {
        "id": "bait_worm",
        "name": "Worm Bait (x10)",
        "type": "bait",
        "description": "Standard bait for all fish types",
        "cost": {"coins": 100},
        "quantity": 10,
        "effect": {"catch_rate": 1.1},
        "icon": "🪱",
        "unlock_level": 1,
    },
    {
        "id": "bait_premium",
        "name": "Premium Bait (x10)",
        "type": "bait",
        "description": "High quality bait with better attraction",
        "cost": {"coins": 300},
        "quantity": 10,
        "effect": {"catch_rate": 1.3, "rare_chance": 1.2},
        "icon": "🪱✨",
        "unlock_level": 5,
    },
    {
        "id": "bait_legendary",
        "name": "Legendary Bait (x5)",
        "type": "bait",
        "description": "Attracts legendary fish",
        "cost": {"gems": 50},
        "quantity": 5,
        "effect": {"catch_rate": 1.5, "rare_chance": 1.5, "legendary_chance": 2.0},
        "icon": "🪱👑",
        "unlock_level": 20,
    },
    {
        "id": "boat_small",
        "name": "Small Fishing Boat",
        "type": "boat",
        "description": "Access new fishing spots",
        "cost": {"coins": 5000},
        "unlock": ["sunset_river", "crystal_lake"],
        "icon": "🚣",
        "unlock_level": 10,
    },
    {
        "id": "boat_medium",
        "name": "Motor Boat",
        "type": "boat",
        "description": "Travel to deep water locations",
        "cost": {"gems": 300},
        "unlock": ["deep_ocean", "coral_reef"],
        "icon": "🚤",
        "unlock_level": 25,
    },
    {
        "id": "aquarium_expansion",
        "name": "Aquarium Expansion",
        "type": "upgrade",
        "description": "Increase aquarium capacity by 10",
        "cost": {"coins": 2000},
        "effect": {"aquarium_slots": 10},
        "icon": "🐠",
        "unlock_level": 5,
    },
    {
        "id": "tackle_box_upgrade",
        "name": "Tackle Box Upgrade",
        "type": "upgrade",
        "description": "Store more equipment",
        "cost": {"coins": 1500},
        "effect": {"inventory_slots": 20},
        "icon": "🧰",
        "unlock_level": 3,
    },
]

BUNDLES = [
    {
        "id": "starter_pack",
        "name": "Starter Pack",
        "description": "Everything you need to begin your fishing journey!",
        "items": [
            {"type": "coins", "amount": 5000},
            {"type": "gems", "amount": 100},
            {"type": "item", "item_id": "rod_bamboo"},
            {"type": "item", "item_id": "lure_spinner"},
            {"type": "bait", "bait_id": "bait_worm", "quantity": 50},
        ],
        "price_usd": 4.99,
        "original_value_usd": 12.99,
        "discount_percent": 62,
        "one_time_only": True,
        "icon": "🎁",
        "featured": True,
    },
    {
        "id": "pro_fisher_pack",
        "name": "Pro Fisher Pack",
        "description": "Upgrade to professional equipment",
        "items": [
            {"type": "coins", "amount": 15000},
            {"type": "gems", "amount": 300},
            {"type": "item", "item_id": "rod_carbon"},
            {"type": "item", "item_id": "lure_golden"},
            {"type": "bait", "bait_id": "bait_premium", "quantity": 100},
        ],
        "price_usd": 14.99,
        "original_value_usd": 39.99,
        "discount_percent": 63,
        "one_time_only": True,
        "icon": "🎣💎",
        "featured": False,
    },
    {
        "id": "legendary_pack",
        "name": "Legendary Fisher Pack",
        "description": "The ultimate fishing package",
        "items": [
            {"type": "coins", "amount": 50000},
            {"type": "gems", "amount": 1000},
            {"type": "item", "item_id": "rod_titanium"},
            {"type": "item", "item_id": "lure_legendary"},
            {"type": "bait", "bait_id": "bait_legendary", "quantity": 50},
            {"type": "vip", "days": 30},
        ],
        "price_usd": 49.99,
        "original_value_usd": 149.99,
        "discount_percent": 67,
        "one_time_only": True,
        "icon": "👑🎣",
        "featured": True,
    },
    {
        "id": "weekly_booster",
        "name": "Weekly Booster",
        "description": "Extra resources every week",
        "items": [
            {"type": "coins", "amount": 10000},
            {"type": "gems", "amount": 150},
            {"type": "energy", "amount": 100},
        ],
        "price_usd": 2.99,
        "original_value_usd": 7.99,
        "discount_percent": 63,
        "one_time_only": False,
        "cooldown_days": 7,
        "icon": "📦",
        "featured": False,
    },
]


# ========== REQUEST MODELS ==========

class PurchaseItemRequest(BaseModel):
    user_id: str
    item_id: str
    quantity: int = 1


class PurchaseIAPRequest(BaseModel):
    user_id: str
    product_id: str
    receipt_data: Optional[str] = None
    platform: str = "web"


class ClaimDailyDealRequest(BaseModel):
    user_id: str
    deal_id: str


# ========== HELPER FUNCTIONS ==========

def generate_daily_deals(user_id: str) -> List[dict]:
    """Generate personalized daily deals"""
    # Use user_id + date as seed for consistent deals per day per user
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    seed = int(hashlib.md5(f"{user_id}{today}".encode()).hexdigest()[:8], 16)
    random.seed(seed)
    
    deals = []
    
    # Select 3-4 random items for deals
    available_items = [item for item in SHOP_ITEMS if item["unlock_level"] <= 30]
    selected_items = random.sample(available_items, min(3, len(available_items)))
    
    for item in selected_items:
        discount = random.choice([20, 30, 40, 50])
        deal = {
            "id": f"deal_{item['id']}_{today}",
            "item": item,
            "discount_percent": discount,
            "original_cost": item["cost"],
            "discounted_cost": {
                k: int(v * (100 - discount) / 100) 
                for k, v in item["cost"].items()
            },
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat(),
            "claimed": False,
        }
        deals.append(deal)
    
    # Add a special currency deal
    currency_deal = random.choice(CURRENCY_PACKS[:4])  # Coins deals only
    special_discount = random.choice([25, 35, 50])
    deals.append({
        "id": f"deal_currency_{today}",
        "item": currency_deal,
        "discount_percent": special_discount,
        "type": "currency",
        "expires_at": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat(),
        "claimed": False,
    })
    
    random.seed()  # Reset seed
    return deals


# ========== SHOP ENDPOINTS ==========

@router.get("/items")
async def get_shop_items(user_id: Optional[str] = None):
    """Get all available shop items"""
    items = SHOP_ITEMS.copy()
    
    # If user provided, mark owned items
    if user_id:
        inventory = await db.player_inventory.find_one({"user_id": user_id}, {"_id": 0})
        owned_items = inventory.get("items", []) if inventory else []
        
        for item in items:
            item["owned"] = item["id"] in owned_items
    
    return {"items": items}


@router.get("/currency")
async def get_currency_packs():
    """Get all currency purchase options"""
    return {"currency_packs": CURRENCY_PACKS}


@router.get("/bundles")
async def get_bundles(user_id: Optional[str] = None):
    """Get available bundles"""
    bundles = BUNDLES.copy()
    
    if user_id:
        # Check which one-time bundles have been purchased
        purchases = await db.purchases.find({"user_id": user_id, "type": "bundle"}, {"_id": 0}).to_list(100)
        purchased_ids = [p["product_id"] for p in purchases]
        
        for bundle in bundles:
            if bundle["one_time_only"]:
                bundle["purchased"] = bundle["id"] in purchased_ids
                bundle["available"] = bundle["id"] not in purchased_ids
            else:
                # Check cooldown
                last_purchase = await db.purchases.find_one(
                    {"user_id": user_id, "product_id": bundle["id"]},
                    sort=[("purchased_at", -1)]
                )
                if last_purchase and bundle.get("cooldown_days"):
                    last_time = datetime.fromisoformat(last_purchase["purchased_at"])
                    cooldown_end = last_time + timedelta(days=bundle["cooldown_days"])
                    bundle["available"] = datetime.now(timezone.utc) > cooldown_end
                    bundle["cooldown_until"] = cooldown_end.isoformat() if not bundle["available"] else None
                else:
                    bundle["available"] = True
    
    return {"bundles": bundles}


@router.get("/daily-deals/{user_id}")
async def get_daily_deals(user_id: str):
    """Get personalized daily deals"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check cached deals
    cached = await db.daily_deals.find_one({"user_id": user_id, "date": today}, {"_id": 0})
    
    if cached:
        return {"deals": cached["deals"], "date": today}
    
    # Generate new deals
    deals = generate_daily_deals(user_id)
    
    # Cache them
    await db.daily_deals.update_one(
        {"user_id": user_id, "date": today},
        {"$set": {"deals": deals, "date": today}},
        upsert=True
    )
    
    return {"deals": deals, "date": today}


@router.post("/purchase/item")
async def purchase_item(request: PurchaseItemRequest):
    """Purchase a shop item with in-game currency"""
    item = next((i for i in SHOP_ITEMS if i["id"] == request.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check level requirement
    if user.get("level", 1) < item.get("unlock_level", 1):
        raise HTTPException(status_code=400, detail=f"Requires level {item['unlock_level']}")
    
    # Check if already owned (for non-consumable items)
    if item["type"] in ["rod", "lure", "boat"]:
        inventory = await db.player_inventory.find_one({"user_id": request.user_id}, {"_id": 0})
        if inventory and request.item_id in inventory.get("items", []):
            raise HTTPException(status_code=400, detail="Item already owned")
    
    # Calculate total cost
    total_cost = {k: v * request.quantity for k, v in item["cost"].items()}
    
    # Verify funds
    for currency, amount in total_cost.items():
        if user.get(currency, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {currency}")
    
    # Deduct currency
    update_ops = {"$inc": {}}
    for currency, amount in total_cost.items():
        update_ops["$inc"][currency] = -amount
    await db.users.update_one({"id": request.user_id}, update_ops)
    
    # Add item to inventory
    if item["type"] == "bait":
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$inc": {f"baits.{request.item_id}": item.get("quantity", 1) * request.quantity}},
            upsert=True
        )
    elif item["type"] in ["rod", "lure", "boat"]:
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$addToSet": {"items": request.item_id}},
            upsert=True
        )
    elif item["type"] == "upgrade":
        # Apply upgrade effect
        if "aquarium_slots" in item.get("effect", {}):
            await db.player_aquarium.update_one(
                {"user_id": request.user_id},
                {"$inc": {"max_capacity": item["effect"]["aquarium_slots"]}},
                upsert=True
            )
        if "inventory_slots" in item.get("effect", {}):
            await db.player_inventory.update_one(
                {"user_id": request.user_id},
                {"$inc": {"max_slots": item["effect"]["inventory_slots"]}},
                upsert=True
            )
    
    # Record purchase
    purchase_record = {
        "id": str(uuid.uuid4()),
        "user_id": request.user_id,
        "type": "item",
        "product_id": request.item_id,
        "quantity": request.quantity,
        "cost": total_cost,
        "purchased_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.purchases.insert_one(purchase_record)
    
    return {
        "success": True,
        "item": item["name"],
        "quantity": request.quantity,
        "cost": total_cost
    }


@router.post("/purchase/bundle")
async def purchase_bundle(request: PurchaseIAPRequest):
    """Purchase a bundle (simulated IAP)"""
    bundle = next((b for b in BUNDLES if b["id"] == request.product_id), None)
    if not bundle:
        raise HTTPException(status_code=404, detail="Bundle not found")
    
    # Check one-time purchase status
    if bundle["one_time_only"]:
        existing = await db.purchases.find_one({
            "user_id": request.user_id,
            "product_id": request.product_id,
            "type": "bundle"
        })
        if existing:
            raise HTTPException(status_code=400, detail="Bundle already purchased")
    
    # Process bundle items
    for item in bundle["items"]:
        if item["type"] == "coins":
            await db.users.update_one(
                {"id": request.user_id},
                {"$inc": {"coins": item["amount"]}}
            )
        elif item["type"] == "gems":
            await db.users.update_one(
                {"id": request.user_id},
                {"$inc": {"gems": item["amount"]}}
            )
        elif item["type"] == "item":
            await db.player_inventory.update_one(
                {"user_id": request.user_id},
                {"$addToSet": {"items": item["item_id"]}},
                upsert=True
            )
        elif item["type"] == "bait":
            await db.player_inventory.update_one(
                {"user_id": request.user_id},
                {"$inc": {f"baits.{item['bait_id']}": item["quantity"]}},
                upsert=True
            )
        elif item["type"] == "energy":
            await db.player_energy.update_one(
                {"user_id": request.user_id},
                {"$inc": {"current_energy": item["amount"]}},
                upsert=True
            )
        elif item["type"] == "vip":
            # Grant VIP days
            from vip_routes import grant_vip_days
            # This would call the VIP system
            pass
    
    # Record purchase
    purchase_record = {
        "id": str(uuid.uuid4()),
        "user_id": request.user_id,
        "type": "bundle",
        "product_id": request.product_id,
        "price_usd": bundle["price_usd"],
        "platform": request.platform,
        "purchased_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.purchases.insert_one(purchase_record)
    
    return {
        "success": True,
        "bundle": bundle["name"],
        "items_received": bundle["items"]
    }


@router.post("/daily-deals/claim")
async def claim_daily_deal(request: ClaimDailyDealRequest):
    """Claim a daily deal"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    deals_doc = await db.daily_deals.find_one({"user_id": request.user_id, "date": today})
    if not deals_doc:
        raise HTTPException(status_code=404, detail="No deals found for today")
    
    deal = next((d for d in deals_doc["deals"] if d["id"] == request.deal_id), None)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if deal.get("claimed"):
        raise HTTPException(status_code=400, detail="Deal already claimed")
    
    # Process purchase at discounted price
    if deal.get("type") == "currency":
        # Currency deals require real purchase - for now just mark as claimed
        pass
    else:
        # Item deals can be purchased with in-game currency
        user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
        
        for currency, amount in deal["discounted_cost"].items():
            if user.get(currency, 0) < amount:
                raise HTTPException(status_code=400, detail=f"Not enough {currency}")
        
        # Deduct currency
        update_ops = {"$inc": {}}
        for currency, amount in deal["discounted_cost"].items():
            update_ops["$inc"][currency] = -amount
        await db.users.update_one({"id": request.user_id}, update_ops)
        
        # Add item
        await db.player_inventory.update_one(
            {"user_id": request.user_id},
            {"$addToSet": {"items": deal["item"]["id"]}},
            upsert=True
        )
    
    # Mark deal as claimed
    await db.daily_deals.update_one(
        {"user_id": request.user_id, "date": today, "deals.id": request.deal_id},
        {"$set": {"deals.$.claimed": True}}
    )
    
    return {"success": True, "deal_claimed": deal["id"]}


@router.get("/purchase-history/{user_id}")
async def get_purchase_history(user_id: str, limit: int = 50):
    """Get user's purchase history"""
    purchases = await db.purchases.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("purchased_at", -1).limit(limit).to_list(limit)
    
    total_spent = sum(p.get("price_usd", 0) for p in purchases if p.get("price_usd"))
    
    return {
        "purchases": purchases,
        "total_purchases": len(purchases),
        "total_spent_usd": total_spent
    }
