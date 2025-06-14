from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.core.security import get_current_user_token
from app.models.community import (
    CommunityPostCreate, CommunityPostUpdate, CommunityPostResponse,
    CommunityCommentCreate, CommunityCommentResponse
)
from app.services.community_service import CommunityService

router = APIRouter()

@router.get("/posts", response_model=List[CommunityPostResponse])
async def get_community_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    post_type: Optional[str] = None,  # question, showcase, discussion, challenge
    category: Optional[str] = None,
    search: Optional[str] = None,
    trending_only: bool = False,
    unanswered_only: bool = False,
    solved_only: bool = False,
    db=Depends(get_database)
):
    """Récupérer les posts de la communauté"""
    community_service = CommunityService(db)
    return await community_service.get_posts(
        skip=skip,
        limit=limit,
        post_type=post_type,
        category=category,
        search=search,
        trending_only=trending_only,
        unanswered_only=unanswered_only,
        solved_only=solved_only
    )

@router.get("/posts/{post_id}", response_model=CommunityPostResponse)
async def get_community_post(post_id: str, db=Depends(get_database)):
    """Récupérer un post de communauté par ID"""
    community_service = CommunityService(db)
    post = await community_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post non trouvé"
        )
    
    # Incrémenter les vues
    await community_service.increment_views(post_id)
    return post

@router.post("/posts", response_model=CommunityPostResponse)
async def create_community_post(
    post_data: CommunityPostCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Créer un nouveau post dans la communauté"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour poster"
        )
    
    community_service = CommunityService(db)
    return await community_service.create_post(post_data, current_user.email)

@router.put("/posts/{post_id}", response_model=CommunityPostResponse)
async def update_community_post(
    post_id: str,
    post_data: CommunityPostUpdate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Mettre à jour un post de communauté"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    community_service = CommunityService(db)
    post = await community_service.update_post(post_id, post_data, current_user.email)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post non trouvé ou non autorisé"
        )
    return post

@router.post("/posts/{post_id}/like")
async def like_community_post(
    post_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Liker/unliker un post de communauté"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour liker"
        )
    
    community_service = CommunityService(db)
    result = await community_service.toggle_like(post_id, current_user.email)
    return {"liked": result["liked"], "total_likes": result["total_likes"]}

@router.post("/posts/{post_id}/solve")
async def mark_post_solved(
    post_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Marquer un post comme résolu (auteur seulement)"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    community_service = CommunityService(db)
    result = await community_service.mark_solved(post_id, current_user.email)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul l'auteur peut marquer comme résolu"
        )
    return {"solved": True}

@router.get("/posts/{post_id}/comments", response_model=List[CommunityCommentResponse])
async def get_post_comments(
    post_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db=Depends(get_database)
):
    """Récupérer les commentaires d'un post"""
    community_service = CommunityService(db)
    return await community_service.get_comments(post_id, skip, limit)

@router.post("/posts/{post_id}/comments", response_model=CommunityCommentResponse)
async def create_comment(
    post_id: str,
    comment_data: CommunityCommentCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Ajouter un commentaire à un post"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour commenter"
        )
    
    community_service = CommunityService(db)
    return await community_service.create_comment(post_id, comment_data, current_user.email)

@router.get("/stats")
async def get_community_stats(db=Depends(get_database)):
    """Récupérer les statistiques de la communauté"""
    community_service = CommunityService(db)
    return await community_service.get_stats()

@router.get("/categories")
async def get_community_categories(db=Depends(get_database)):
    """Récupérer toutes les catégories de la communauté"""
    community_service = CommunityService(db)
    return await community_service.get_categories()