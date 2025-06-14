from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId

from app.models.user import UserInDB, UserResponse, UserUpdate
from app.core.security import get_current_user
from app.core.database import get_database

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """
    Récupère les informations de l'utilisateur connecté
    """
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: str, db = Depends(get_database)):
    """
    Récupère un utilisateur par son ID
    """
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="ID utilisateur invalide")
    
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    return user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Met à jour les informations de l'utilisateur connecté
    """
    user_data = user_update.dict(exclude_unset=True)
    
    if user_data:
        update_result = await db["users"].update_one(
            {"_id": current_user["_id"]}, {"$set": user_data}
        )
        if update_result.modified_count == 1:
            return {**current_user, **user_data}
    
    return current_user
