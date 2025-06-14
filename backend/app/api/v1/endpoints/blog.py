from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.core.security import get_current_user_token
from app.models.blog import (
    BlogPostCreate, BlogPostUpdate, BlogPostResponse, 
    BlogPostInDB, CommentCreate, CommentResponse
)
from app.services.blog_service import BlogService

router = APIRouter()

@router.get("/posts", response_model=List[BlogPostResponse])
async def get_blog_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    db=Depends(get_database)
):
    """Récupérer la liste des articles de blog"""
    blog_service = BlogService(db)
    return await blog_service.get_posts(
        skip=skip, 
        limit=limit, 
        category=category, 
        search=search,
        featured_only=featured_only
    )

@router.get("/posts/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(post_id: str, db=Depends(get_database)):
    """Récupérer un article de blog par ID"""
    blog_service = BlogService(db)
    post = await blog_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article non trouvé"
        )
    
    # Incrémenter les vues
    await blog_service.increment_views(post_id)
    return post

@router.post("/posts", response_model=BlogPostResponse)
async def create_blog_post(
    post_data: BlogPostCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Créer un nouvel article de blog (admin seulement)"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Accès non autorisé"
        )
    
    blog_service = BlogService(db)
    return await blog_service.create_post(post_data, current_user.email)

@router.put("/posts/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    post_data: BlogPostUpdate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Mettre à jour un article de blog"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Accès non autorisé"
        )
    
    blog_service = BlogService(db)
    post = await blog_service.update_post(post_id, post_data, current_user.email)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article non trouvé"
        )
    return post

@router.post("/posts/{post_id}/like")
async def like_blog_post(
    post_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Liker/unliker un article"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour liker"
        )
    
    blog_service = BlogService(db)
    result = await blog_service.toggle_like(post_id, current_user.email)
    return {"liked": result["liked"], "total_likes": result["total_likes"]}

@router.post("/posts/{post_id}/bookmark")
async def bookmark_blog_post(
    post_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Sauvegarder/retirer un article des favoris"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour sauvegarder"
        )
    
    blog_service = BlogService(db)
    result = await blog_service.toggle_bookmark(post_id, current_user.email)
    return {"bookmarked": result["bookmarked"]}

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(
    post_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db=Depends(get_database)
):
    """Récupérer les commentaires d'un article"""
    blog_service = BlogService(db)
    return await blog_service.get_comments(post_id, skip, limit)

@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: str,
    comment_data: CommentCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Ajouter un commentaire à un article"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour commenter"
        )
    
    blog_service = BlogService(db)
    return await blog_service.create_comment(post_id, comment_data, current_user.email)

@router.post("/comments/{comment_id}/like")
async def like_comment(
    comment_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Liker/unliker un commentaire"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise pour liker"
        )
    
    blog_service = BlogService(db)
    result = await blog_service.toggle_comment_like(comment_id, current_user.email)
    return {"liked": result["liked"], "total_likes": result["total_likes"]}

@router.get("/categories")
async def get_blog_categories(db=Depends(get_database)):
    """Récupérer toutes les catégories de blog"""
    blog_service = BlogService(db)
    return await blog_service.get_categories()