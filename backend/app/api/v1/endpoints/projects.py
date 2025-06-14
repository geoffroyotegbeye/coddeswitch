from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.core.security import get_current_user_token
from app.models.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, Project
)
from app.services.project_service import ProjectService

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    language: Optional[str] = None,
    difficulty: Optional[str] = None,
    project_type: Optional[str] = None,
    search: Optional[str] = None,
    db=Depends(get_database)
):
    """Récupérer la liste des projets avec filtres"""
    project_service = ProjectService(db)
    return await project_service.get_projects(
        skip=skip,
        limit=limit,
        language=language,
        difficulty=difficulty,
        project_type=project_type,
        search=search
    )

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, db=Depends(get_database)):
    """Récupérer un projet par ID avec toutes ses étapes"""
    project_service = ProjectService(db)
    project = await project_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projet non trouvé"
        )
    return project

@router.post("/", response_model=Project)
async def create_project(
    project_data: ProjectCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Créer un nouveau projet (admin seulement)"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Accès non autorisé"
        )
    
    project_service = ProjectService(db)
    return await project_service.create_project(project_data, current_user.email)

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Mettre à jour un projet"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Accès non autorisé"
        )
    
    project_service = ProjectService(db)
    project = await project_service.update_project(project_id, project_data, current_user.email)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projet non trouvé"
        )
    return project

@router.get("/languages/")
async def get_languages(db=Depends(get_database)):
    """Récupérer tous les langages disponibles"""
    project_service = ProjectService(db)
    return await project_service.get_languages()

@router.get("/categories/")
async def get_categories(db=Depends(get_database)):
    """Récupérer toutes les catégories de projets"""
    project_service = ProjectService(db)
    return await project_service.get_categories()