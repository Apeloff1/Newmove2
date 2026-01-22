# ========== GO FISH! FISH BREEDING SYSTEM API ==========
# Genetic breeding, evolution, and rare fish creation
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

router = APIRouter(prefix="/api/breeding", tags=["breeding"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]


# ========== FISH GENETICS SYSTEM ==========

FISH_TRAITS = {
    "color": ["red", "blue", "green", "gold", "silver", "purple", "rainbow", "black", "white", "orange"],
    "pattern": ["solid", "striped", "spotted", "gradient", "iridescent", "camouflage"],
    "fin_type": ["normal", "long", "short", "fan", "sail", "ribbon"],
    "size_gene": ["tiny", "small", "medium", "large", "giant"],
    "speed_gene": ["slow", "normal", "fast", "lightning"],
    "rarity_gene": ["common", "uncommon", "rare", "epic", "legendary"],
}

FISH_SPECIES = {
    "minnow": {"base_value": 10, "breed_time_hours": 1, "compatible": ["perch", "guppy"]},
    "perch": {"base_value": 25, "breed_time_hours": 2, "compatible": ["minnow", "bass"]},
    "bass": {"base_value": 40, "breed_time_hours": 3, "compatible": ["perch", "pike"]},
    "catfish": {"base_value": 80, "breed_time_hours": 4, "compatible": ["bass", "carp"]},
    "pike": {"base_value": 120, "breed_time_hours": 6, "compatible": ["bass", "muskie"]},
    "carp": {"base_value": 60, "breed_time_hours": 4, "compatible": ["catfish", "koi"]},
    "koi": {"base_value": 200, "breed_time_hours": 8, "compatible": ["carp", "goldfish"]},
    "goldfish": {"base_value": 150, "breed_time_hours": 6, "compatible": ["koi", "guppy"]},
    "guppy": {"base_value": 15, "breed_time_hours": 1, "compatible": ["minnow", "goldfish"]},
    "muskie": {"base_value": 180, "breed_time_hours": 10, "compatible": ["pike"]},
    "golden_koi": {"base_value": 500, "breed_time_hours": 24, "compatible": ["koi"], "legendary": True},
}

SPECIAL_BREEDS = [
    {
        "id": "rainbow_bass",
        "name": "Rainbow Bass",
        "parents": ["bass", "koi"],
        "required_traits": {"color": "rainbow"},
        "rarity": "rare",
        "value": 300,
        "description": "A beautiful bass with rainbow scales",
    },
    {
        "id": "ghost_catfish",
        "name": "Ghost Catfish",
        "parents": ["catfish", "catfish"],
        "required_traits": {"color": "white", "pattern": "iridescent"},
        "rarity": "epic",
        "value": 400,
        "description": "A translucent catfish that glows in darkness",
    },
    {
        "id": "emperor_koi",
        "name": "Emperor Koi",
        "parents": ["koi", "golden_koi"],
        "required_traits": {"color": "gold", "size_gene": "giant"},
        "rarity": "legendary",
        "value": 1000,
        "description": "The king of all koi fish",
    },
    {
        "id": "shadow_pike",
        "name": "Shadow Pike",
        "parents": ["pike", "muskie"],
        "required_traits": {"color": "black", "speed_gene": "lightning"},
        "rarity": "epic",
        "value": 450,
        "description": "A pike that moves faster than the eye can see",
    },
]


# ========== REQUEST MODELS ==========

class AddToLabRequest(BaseModel):
    user_id: str
    fish_id: str  # From tacklebox


class StartBreedingRequest(BaseModel):
    user_id: str
    parent1_slot: int
    parent2_slot: int


class CollectOffspringRequest(BaseModel):
    user_id: str
    breeding_slot: int


class ReleaseFishRequest(BaseModel):
    user_id: str
    fish_id: str


# ========== HELPER FUNCTIONS ==========

def generate_fish_traits(parent1_traits: dict = None, parent2_traits: dict = None) -> dict:
    """Generate traits for offspring based on parents"""
    traits = {}
    
    for trait_name, possible_values in FISH_TRAITS.items():
        if parent1_traits and parent2_traits:
            # Inherit from parents with mutation chance
            parent1_trait = parent1_traits.get(trait_name)
            parent2_trait = parent2_traits.get(trait_name)
            
            if random.random() < 0.1:  # 10% mutation
                traits[trait_name] = random.choice(possible_values)
            else:
                traits[trait_name] = random.choice([parent1_trait, parent2_trait]) if parent1_trait and parent2_trait else random.choice(possible_values)
        else:
            traits[trait_name] = random.choice(possible_values)
    
    return traits


def calculate_fish_value(species: str, traits: dict) -> int:
    """Calculate fish value based on species and traits"""
    species_data = FISH_SPECIES.get(species, {"base_value": 50})
    base_value = species_data["base_value"]
    
    multiplier = 1.0
    
    # Rarity bonus
    rarity_multipliers = {"common": 1.0, "uncommon": 1.5, "rare": 2.5, "epic": 4.0, "legendary": 10.0}
    multiplier *= rarity_multipliers.get(traits.get("rarity_gene", "common"), 1.0)
    
    # Size bonus
    size_multipliers = {"tiny": 0.5, "small": 0.8, "medium": 1.0, "large": 1.5, "giant": 2.0}
    multiplier *= size_multipliers.get(traits.get("size_gene", "medium"), 1.0)
    
    # Special color bonus
    if traits.get("color") in ["rainbow", "gold"]:
        multiplier *= 1.5
    
    # Special pattern bonus
    if traits.get("pattern") in ["iridescent", "rainbow"]:
        multiplier *= 1.3
    
    return int(base_value * multiplier)


def check_special_breed(parent1_species: str, parent2_species: str, offspring_traits: dict) -> Optional[dict]:
    """Check if offspring is a special breed"""
    parents = sorted([parent1_species, parent2_species])
    
    for special in SPECIAL_BREEDS:
        required_parents = sorted(special["parents"])
        if parents == required_parents:
            # Check trait requirements
            traits_match = True
            for trait, value in special.get("required_traits", {}).items():
                if offspring_traits.get(trait) != value:
                    traits_match = False
                    break
            
            if traits_match or random.random() < 0.05:  # 5% chance even without exact traits
                return special
    
    return None


async def get_breeding_lab(user_id: str) -> dict:
    """Get or create player's breeding lab"""
    lab = await db.breeding_lab.find_one({"user_id": user_id}, {"_id": 0})
    
    if not lab:
        lab = {
            "user_id": user_id,
            "parent_slots": [None, None, None, None],  # 4 slots for parents
            "breeding_slots": [None, None],  # 2 breeding slots
            "max_parent_slots": 4,
            "max_breeding_slots": 2,
            "total_fish_bred": 0,
            "rare_discoveries": [],
            "breeding_level": 1,
            "breeding_xp": 0,
        }
        await db.breeding_lab.insert_one(lab)
    
    # Check breeding completion
    now = datetime.now(timezone.utc)
    updated = False
    
    for i, slot in enumerate(lab["breeding_slots"]):
        if slot and slot.get("status") == "breeding":
            complete_time = datetime.fromisoformat(slot["complete_at"])
            if now >= complete_time:
                lab["breeding_slots"][i]["status"] = "complete"
                updated = True
    
    if updated:
        await db.breeding_lab.update_one(
            {"user_id": user_id},
            {"$set": {"breeding_slots": lab["breeding_slots"]}}
        )
    
    return lab


# ========== BREEDING ENDPOINTS ==========

@router.get("/lab/{user_id}")
async def get_lab(user_id: str):
    """Get breeding lab status"""
    lab = await get_breeding_lab(user_id)
    
    return {
        "parent_slots": lab["parent_slots"],
        "breeding_slots": lab["breeding_slots"],
        "max_parent_slots": lab["max_parent_slots"],
        "max_breeding_slots": lab["max_breeding_slots"],
        "breeding_level": lab.get("breeding_level", 1),
        "breeding_xp": lab.get("breeding_xp", 0),
        "total_bred": lab.get("total_fish_bred", 0),
        "rare_discoveries": lab.get("rare_discoveries", []),
    }


@router.get("/species")
async def get_breedable_species():
    """Get all breedable fish species"""
    species = []
    for species_id, data in FISH_SPECIES.items():
        species.append({
            "id": species_id,
            "name": species_id.replace("_", " ").title(),
            "base_value": data["base_value"],
            "breed_time_hours": data["breed_time_hours"],
            "compatible_species": data["compatible"],
            "is_legendary": data.get("legendary", False),
        })
    return {"species": species}


@router.get("/special-breeds")
async def get_special_breeds():
    """Get all discoverable special breeds"""
    return {"special_breeds": SPECIAL_BREEDS}


@router.post("/add-fish")
async def add_fish_to_lab(request: AddToLabRequest):
    """Add a fish from tacklebox to breeding lab"""
    lab = await get_breeding_lab(request.user_id)
    
    # Find fish in tacklebox
    fish = await db.tacklebox.find_one({
        "user_id": request.user_id,
        "id": request.fish_id
    }, {"_id": 0})
    
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found in tacklebox")
    
    # Find empty slot
    empty_slot = None
    for i, slot in enumerate(lab["parent_slots"]):
        if slot is None:
            empty_slot = i
            break
    
    if empty_slot is None:
        raise HTTPException(status_code=400, detail="No empty parent slots")
    
    # Add to lab
    lab_fish = {
        "id": fish["id"],
        "species": fish.get("name", "Unknown").lower().replace(" ", "_"),
        "traits": fish.get("traits", generate_fish_traits()),
        "size": fish.get("size", 50),
        "added_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.breeding_lab.update_one(
        {"user_id": request.user_id},
        {"$set": {f"parent_slots.{empty_slot}": lab_fish}}
    )
    
    # Remove from tacklebox
    await db.tacklebox.delete_one({"id": request.fish_id})
    
    return {
        "success": True,
        "slot": empty_slot,
        "fish": lab_fish
    }


@router.post("/start")
async def start_breeding(request: StartBreedingRequest):
    """Start breeding two fish"""
    lab = await get_breeding_lab(request.user_id)
    
    # Validate slots
    if request.parent1_slot >= len(lab["parent_slots"]) or request.parent2_slot >= len(lab["parent_slots"]):
        raise HTTPException(status_code=400, detail="Invalid parent slot")
    
    parent1 = lab["parent_slots"][request.parent1_slot]
    parent2 = lab["parent_slots"][request.parent2_slot]
    
    if not parent1 or not parent2:
        raise HTTPException(status_code=400, detail="Both parent slots must have fish")
    
    # Check compatibility
    species1 = parent1["species"]
    species2 = parent2["species"]
    
    species1_data = FISH_SPECIES.get(species1, {"compatible": []})
    species2_data = FISH_SPECIES.get(species2, {"compatible": []})
    
    compatible = (
        species1 == species2 or 
        species2 in species1_data.get("compatible", []) or
        species1 in species2_data.get("compatible", [])
    )
    
    if not compatible:
        raise HTTPException(status_code=400, detail="These fish species are not compatible for breeding")
    
    # Find empty breeding slot
    breeding_slot = None
    for i, slot in enumerate(lab["breeding_slots"]):
        if slot is None:
            breeding_slot = i
            break
    
    if breeding_slot is None:
        raise HTTPException(status_code=400, detail="No empty breeding slots")
    
    # Calculate breed time
    breed_hours = max(
        species1_data.get("breed_time_hours", 4),
        species2_data.get("breed_time_hours", 4)
    )
    
    now = datetime.now(timezone.utc)
    complete_at = now + timedelta(hours=breed_hours)
    
    breeding_job = {
        "parent1": parent1,
        "parent2": parent2,
        "parent1_slot": request.parent1_slot,
        "parent2_slot": request.parent2_slot,
        "started_at": now.isoformat(),
        "complete_at": complete_at.isoformat(),
        "status": "breeding",
    }
    
    # Clear parent slots and add breeding job
    await db.breeding_lab.update_one(
        {"user_id": request.user_id},
        {
            "$set": {
                f"parent_slots.{request.parent1_slot}": None,
                f"parent_slots.{request.parent2_slot}": None,
                f"breeding_slots.{breeding_slot}": breeding_job,
            }
        }
    )
    
    return {
        "success": True,
        "breeding_slot": breeding_slot,
        "complete_at": complete_at.isoformat(),
        "breed_time_hours": breed_hours
    }


@router.post("/collect")
async def collect_offspring(request: CollectOffspringRequest):
    """Collect bred offspring"""
    lab = await get_breeding_lab(request.user_id)
    
    if request.breeding_slot >= len(lab["breeding_slots"]):
        raise HTTPException(status_code=400, detail="Invalid breeding slot")
    
    breeding_job = lab["breeding_slots"][request.breeding_slot]
    
    if not breeding_job:
        raise HTTPException(status_code=400, detail="No breeding in this slot")
    
    if breeding_job["status"] != "complete":
        raise HTTPException(status_code=400, detail="Breeding not complete")
    
    parent1 = breeding_job["parent1"]
    parent2 = breeding_job["parent2"]
    
    # Generate offspring
    offspring_traits = generate_fish_traits(
        parent1.get("traits", {}),
        parent2.get("traits", {})
    )
    
    # Determine species
    species1 = parent1["species"]
    species2 = parent2["species"]
    
    if species1 == species2:
        offspring_species = species1
    else:
        offspring_species = random.choice([species1, species2])
    
    # Check for special breed
    special_breed = check_special_breed(species1, species2, offspring_traits)
    
    is_new_discovery = False
    if special_breed:
        offspring_species = special_breed["id"]
        offspring_traits["rarity_gene"] = special_breed["rarity"]
        
        if special_breed["id"] not in lab.get("rare_discoveries", []):
            is_new_discovery = True
            await db.breeding_lab.update_one(
                {"user_id": request.user_id},
                {"$push": {"rare_discoveries": special_breed["id"]}}
            )
    
    # Calculate value
    value = calculate_fish_value(offspring_species, offspring_traits)
    
    # Create offspring
    offspring = {
        "id": str(uuid.uuid4()),
        "user_id": request.user_id,
        "species": offspring_species,
        "name": (special_breed["name"] if special_breed else offspring_species.replace("_", " ").title()),
        "traits": offspring_traits,
        "size": (parent1.get("size", 50) + parent2.get("size", 50)) / 2 * random.uniform(0.8, 1.2),
        "value": value,
        "bred": True,
        "parents": [species1, species2],
        "bred_at": datetime.now(timezone.utc).isoformat(),
        "is_special_breed": special_breed is not None,
    }
    
    # Add to tacklebox
    await db.tacklebox.insert_one(offspring)
    
    # Clear breeding slot and update stats
    xp_reward = 10 + (50 if special_breed else 0)
    
    await db.breeding_lab.update_one(
        {"user_id": request.user_id},
        {
            "$set": {f"breeding_slots.{request.breeding_slot}": None},
            "$inc": {"total_fish_bred": 1, "breeding_xp": xp_reward}
        }
    )
    
    # Check level up
    updated_lab = await db.breeding_lab.find_one({"user_id": request.user_id}, {"_id": 0})
    current_xp = updated_lab.get("breeding_xp", 0)
    current_level = updated_lab.get("breeding_level", 1)
    xp_needed = current_level * 150
    
    leveled_up = False
    if current_xp >= xp_needed:
        await db.breeding_lab.update_one(
            {"user_id": request.user_id},
            {"$inc": {"breeding_level": 1}, "$set": {"breeding_xp": current_xp - xp_needed}}
        )
        leveled_up = True
    
    return {
        "success": True,
        "offspring": {k: v for k, v in offspring.items() if k != "_id"},
        "is_special": special_breed is not None,
        "special_breed": special_breed,
        "is_new_discovery": is_new_discovery,
        "xp_earned": xp_reward,
        "leveled_up": leveled_up
    }


@router.post("/speed-up")
async def speed_up_breeding(user_id: str, breeding_slot: int):
    """Speed up breeding with gems"""
    lab = await get_breeding_lab(user_id)
    
    if breeding_slot >= len(lab["breeding_slots"]):
        raise HTTPException(status_code=400, detail="Invalid slot")
    
    breeding_job = lab["breeding_slots"][breeding_slot]
    
    if not breeding_job or breeding_job["status"] == "complete":
        raise HTTPException(status_code=400, detail="No active breeding")
    
    # Calculate gem cost
    now = datetime.now(timezone.utc)
    complete_at = datetime.fromisoformat(breeding_job["complete_at"])
    remaining_hours = max(0, (complete_at - now).total_seconds() / 3600)
    
    gem_cost = max(5, int(remaining_hours * 5))  # 5 gems per hour
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "gems": 1})
    if user.get("gems", 0) < gem_cost:
        raise HTTPException(status_code=400, detail=f"Not enough gems. Need {gem_cost}")
    
    await db.users.update_one({"id": user_id}, {"$inc": {"gems": -gem_cost}})
    
    await db.breeding_lab.update_one(
        {"user_id": user_id},
        {"$set": {f"breeding_slots.{breeding_slot}.status": "complete"}}
    )
    
    return {"success": True, "gems_spent": gem_cost}


@router.post("/release")
async def release_fish_from_lab(request: ReleaseFishRequest):
    """Release a fish from lab back to tacklebox"""
    lab = await get_breeding_lab(request.user_id)
    
    # Find fish in parent slots
    for i, slot in enumerate(lab["parent_slots"]):
        if slot and slot.get("id") == request.fish_id:
            # Return to tacklebox
            fish_data = {
                "id": slot["id"],
                "user_id": request.user_id,
                "name": slot["species"].replace("_", " ").title(),
                "size": slot.get("size", 50),
                "traits": slot.get("traits", {}),
            }
            await db.tacklebox.insert_one(fish_data)
            
            # Clear slot
            await db.breeding_lab.update_one(
                {"user_id": request.user_id},
                {"$set": {f"parent_slots.{i}": None}}
            )
            
            return {"success": True, "released_from": "parent_slot", "slot": i}
    
    raise HTTPException(status_code=404, detail="Fish not found in breeding lab")


@router.post("/upgrade-slot/{user_id}")
async def upgrade_breeding_slot(user_id: str, slot_type: str = "breeding"):
    """Upgrade breeding or parent slots"""
    lab = await get_breeding_lab(user_id)
    
    if slot_type == "breeding":
        max_slots = 4
        current = lab["max_breeding_slots"]
        gem_cost = 200 * current
    else:
        max_slots = 8
        current = lab["max_parent_slots"]
        gem_cost = 100 * current
    
    if current >= max_slots:
        raise HTTPException(status_code=400, detail="Maximum slots reached")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "gems": 1})
    if user.get("gems", 0) < gem_cost:
        raise HTTPException(status_code=400, detail=f"Not enough gems. Need {gem_cost}")
    
    await db.users.update_one({"id": user_id}, {"$inc": {"gems": -gem_cost}})
    
    if slot_type == "breeding":
        lab["breeding_slots"].append(None)
        await db.breeding_lab.update_one(
            {"user_id": user_id},
            {
                "$set": {"breeding_slots": lab["breeding_slots"]},
                "$inc": {"max_breeding_slots": 1}
            }
        )
    else:
        lab["parent_slots"].append(None)
        await db.breeding_lab.update_one(
            {"user_id": user_id},
            {
                "$set": {"parent_slots": lab["parent_slots"]},
                "$inc": {"max_parent_slots": 1}
            }
        )
    
    return {"success": True, "new_slot_count": current + 1, "gems_spent": gem_cost}
