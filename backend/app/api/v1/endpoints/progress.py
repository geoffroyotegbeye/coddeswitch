from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime

from app.models.progress import UserProgress, UserProgressCreate, UserProgressUpdate
from app.core.security import get_current_user
from app.core.database import get_database

router = APIRouter()

@router.get("/", response_model=List[UserProgress])
async def get_user_progress(
    current_user = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Récupère toutes les progressions de l'utilisateur connecté
    """
    if current_user.get("is_guest", False):
        return []
    
    user_progress = await db["user_progress"].find({"user_id": str(current_user["_id"])}).to_list(None)
    return user_progress

@router.get("/{project_id}", response_model=UserProgress)
async def get_project_progress(
    project_id: str,
    current_user = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Récupère la progression d'un utilisateur pour un projet spécifique
    """
    if current_user.get("is_guest", False):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Les invités n'ont pas de progression sauvegardée"
        )
    
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="ID de projet invalide")
    
    progress = await db["user_progress"].find_one({
        "user_id": str(current_user["_id"]),
        "project_id": project_id
    })
    
    if progress is None:
        raise HTTPException(status_code=404, detail="Progression non trouvée")
    
    return progress

@router.post("/", response_model=UserProgress)
async def create_progress(
    progress_data: UserProgressCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Crée une nouvelle progression pour un projet
    """
    if current_user.get("is_guest", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Les invités ne peuvent pas sauvegarder leur progression"
        )
    
    # Vérifier si une progression existe déjà
    existing = await db["user_progress"].find_one({
        "user_id": str(current_user["_id"]),
        "project_id": progress_data.project_id
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Une progression existe déjà pour ce projet"
        )
    
    # Créer la nouvelle progression
    now = datetime.utcnow()
    new_progress = {
        **progress_data.dict(),
        "user_id": str(current_user["_id"]),
        "started_at": now,
        "updated_at": now
    }
    
    result = await db["user_progress"].insert_one(new_progress)
    
    # Récupérer la progression créée
    created_progress = await db["user_progress"].find_one({"_id": result.inserted_id})
    return created_progress

@router.put("/{project_id}", response_model=UserProgress)
async def update_progress(
    project_id: str,
    progress_update: UserProgressUpdate,
    current_user = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Met à jour la progression d'un utilisateur pour un projet spécifique
    """
    if current_user.get("is_guest", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Les invités ne peuvent pas sauvegarder leur progression"
        )
    
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="ID de projet invalide")
    
    # Vérifier si la progression existe
    progress = await db["user_progress"].find_one({
        "user_id": str(current_user["_id"]),
        "project_id": project_id
    })
    
    if progress is None:
        raise HTTPException(status_code=404, detail="Progression non trouvée")
    
    # Mettre à jour la progression
    update_data = progress_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Si tous les steps sont complétés, marquer le projet comme complété
    if progress_update.completed:
        update_data["completed_at"] = datetime.utcnow()
    
    await db["user_progress"].update_one(
        {"_id": progress["_id"]},
        {"$set": update_data}
    )
    
    # Récupérer la progression mise à jour
    updated_progress = await db["user_progress"].find_one({"_id": progress["_id"]})
    return updated_progress
