from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.models.auth import TokenData
from app.core.database import get_database

# Configuration du hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuration OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifier un mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hacher un mot de passe"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Créer un token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    """Vérifier et décoder un token JWT"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_type: str = payload.get("type", "user")
        
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token_data = TokenData(email=email, user_type=user_type)
        return token_data
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user_token(token: str = Depends(oauth2_scheme)) -> TokenData:
    """Obtenir les données du token utilisateur actuel"""
    return verify_token(token)

async def get_current_user(token_data: TokenData = Depends(get_current_user_token), db = Depends(get_database)):
    """Obtenir l'utilisateur actuel à partir du token"""
    if token_data.user_type == "guest":
        # Pour les invités, retourner un utilisateur invité fictif
        return {
            "_id": "guest",
            "email": "guest@codeswitch.com",
            "username": "guest",
            "full_name": "Utilisateur Invité",
            "is_guest": True,
            "is_active": True,
            "is_admin": False,
            "created_at": datetime.utcnow()
        }
    
    # Pour les utilisateurs normaux, chercher dans la base de données
    user = await db["users"].find_one({"email": token_data.email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return user

async def get_admin_user(current_user = Depends(get_current_user)):
    """Vérifier si l'utilisateur actuel est un administrateur"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    return current_user