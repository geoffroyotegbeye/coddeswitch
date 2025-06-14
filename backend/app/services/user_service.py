from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from app.models.user import UserCreate, UserInDB, User, UserUpdate, UserResponse
from app.core.security import get_password_hash, verify_password

class UserService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.users

    def _user_to_response(self, user_doc: dict) -> UserResponse:
        """Convertir un document MongoDB en UserResponse"""
        user_doc["id"] = str(user_doc.pop("_id"))
        return UserResponse(**user_doc)

    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """Créer un nouvel utilisateur"""
        # Hacher le mot de passe
        hashed_password = get_password_hash(user_data.password)
        
        # Créer l'objet utilisateur
        user_dict = {
            "username": user_data.username,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "hashed_password": hashed_password,
            "xp": 0,
            "level": 1,
            "badges": [],
            "completed_projects": [],
            "avatar_url": None,
            "is_active": True,
            "is_admin": False,  # Par défaut, les nouveaux utilisateurs ne sont pas administrateurs
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insérer en base
        result = await self.collection.insert_one(user_dict)
        
        # Retourner l'utilisateur créé
        created_user = await self.collection.find_one({"_id": result.inserted_id})
        return self._user_to_response(created_user)

    async def get_by_email(self, email: str) -> Optional[UserInDB]:
        """Récupérer un utilisateur par email"""
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            return UserInDB(**user_doc)
        return None

    async def get_by_username(self, username: str) -> Optional[UserInDB]:
        """Récupérer un utilisateur par nom d'utilisateur"""
        user_doc = await self.collection.find_one({"username": username})
        if user_doc:
            return UserInDB(**user_doc)
        return None

    async def get_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Récupérer un utilisateur par ID"""
        if not ObjectId.is_valid(user_id):
            return None
            
        user_doc = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user_doc:
            return self._user_to_response(user_doc)
        return None

    async def authenticate_user(self, email_or_username: str, password: str) -> Optional[UserResponse]:
        """Authentifier un utilisateur"""
        # Chercher par email ou username
        user_doc = await self.collection.find_one({
            "$or": [
                {"email": email_or_username},
                {"username": email_or_username}
            ]
        })
        
        if not user_doc:
            return None
            
        # Vérifier le mot de passe
        if not verify_password(password, user_doc["hashed_password"]):
            return None
            
        return self._user_to_response(user_doc)

    async def update_user(self, user_id: str, user_update: UserUpdate) -> Optional[UserResponse]:
        """Mettre à jour un utilisateur"""
        if not ObjectId.is_valid(user_id):
            return None
            
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count:
            return await self.get_by_id(user_id)
        return None

    async def add_xp(self, user_id: str, xp_amount: int) -> Optional[UserResponse]:
        """Ajouter de l'XP à un utilisateur"""
        if not ObjectId.is_valid(user_id):
            return None
            
        # Récupérer l'utilisateur actuel
        user = await self.get_by_id(user_id)
        if not user:
            return None
            
        new_xp = user.xp + xp_amount
        new_level = self._calculate_level(new_xp)
        
        # Mettre à jour
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "xp": new_xp,
                    "level": new_level,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return await self.get_by_id(user_id)

    def _calculate_level(self, xp: int) -> int:
        """Calculer le niveau basé sur l'XP"""
        # Formule simple: niveau = racine carrée de (XP / 100)
        import math
        return max(1, int(math.sqrt(xp / 100)) + 1)