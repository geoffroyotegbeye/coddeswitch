from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import UserCreate, UserResponse
from app.models.auth import Token, TokenData
from app.services.user_service import UserService
from app.core.database import get_database

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db=Depends(get_database)):
    """Inscription d'un nouvel utilisateur"""
    user_service = UserService(db)
    
    # Vérifier si l'utilisateur existe déjà
    existing_user = await user_service.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà"
        )
    
    existing_username = await user_service.get_by_username(user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce nom d'utilisateur est déjà pris"
        )
    
    # Créer l'utilisateur
    user = await user_service.create_user(user_data)
    return user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)):
    """Connexion utilisateur"""
    user_service = UserService(db)
    
    # Authentifier l'utilisateur (email ou username)
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email/nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Créer le token d'accès
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # S'assurer que is_admin est correctement inclus dans la réponse
    user_dict = user.dict()
    # Ajouter un log pour déboguer
    print(f"User data sent to frontend: {user_dict}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }

@router.post("/guest", response_model=dict)
async def guest_access():
    """Accès invité temporaire"""
    # Créer un token temporaire pour l'accès invité
    access_token_expires = timedelta(hours=24)  # 24h pour les invités
    access_token = create_access_token(
        data={"sub": "guest", "type": "guest"}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": "guest",
        "expires_in": 24 * 60 * 60  # 24h en secondes
    }