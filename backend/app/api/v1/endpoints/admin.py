from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime, timedelta
from bson import ObjectId

from app.core.security import get_admin_user
from app.core.database import get_database

router = APIRouter()

@router.get("/dashboard", response_model=Dict[str, Any])
async def admin_dashboard(
    admin_user = Depends(get_admin_user),
    db = Depends(get_database)
):
    """
    Tableau de bord administrateur avec statistiques générales
    """
    # Récupération des statistiques
    total_users = await db["users"].count_documents({})
    total_projects = await db["projects"].count_documents({})
    total_completed_projects = await db["user_progress"].count_documents({"is_completed": True})
    
    # Utilisateurs récents (7 derniers jours)
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_users = await db["users"].count_documents({"created_at": {"$gte": week_ago}})
    
    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "total_completed_projects": total_completed_projects,
        "new_users_last_week": new_users,
        "admin_name": admin_user.get("full_name", admin_user.get("username", "Admin"))
    }

@router.get("/users", response_model=List[Dict[str, Any]])
async def list_all_users(
    admin_user = Depends(get_admin_user),
    db = Depends(get_database),
    skip: int = 0,
    limit: int = 100
):
    """
    Liste tous les utilisateurs (réservé aux administrateurs)
    """
    users = await db["users"].find().skip(skip).limit(limit).to_list(None)
    return users

@router.put("/users/{user_id}/toggle-admin", response_model=Dict[str, Any])
async def toggle_admin_status(
    user_id: str,
    admin_user = Depends(get_admin_user),
    db = Depends(get_database)
):
    """
    Active ou désactive le statut d'administrateur d'un utilisateur
    """
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="ID utilisateur invalide")
    
    # Vérifier si l'utilisateur existe
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Empêcher un admin de se retirer ses propres droits
    if str(user["_id"]) == str(admin_user["_id"]):
        raise HTTPException(
            status_code=400, 
            detail="Vous ne pouvez pas modifier votre propre statut d'administrateur"
        )
    
    # Inverser le statut d'administrateur
    new_status = not user.get("is_admin", False)
    
    # Mettre à jour l'utilisateur
    await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_admin": new_status, "updated_at": datetime.utcnow()}}
    )
    
    return {
        "user_id": str(user["_id"]),
        "username": user.get("username", ""),
        "is_admin": new_status,
        "message": f"Statut administrateur {'activé' if new_status else 'désactivé'}"
    }

@router.get("/projects", response_model=List[Dict[str, Any]])
async def list_all_projects(
    admin_user = Depends(get_admin_user),
    db = Depends(get_database),
    skip: int = 0,
    limit: int = 100
):
    """
    Liste tous les projets (réservé aux administrateurs)
    """
    projects = await db["projects"].find().skip(skip).limit(limit).to_list(None)
    return projects
