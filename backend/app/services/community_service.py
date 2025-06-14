from typing import List, Optional, Dict
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timedelta
import re

from app.models.community import (
    CommunityPostCreate, CommunityPostUpdate, CommunityPostInDB, CommunityPostResponse,
    CommunityCommentCreate, CommunityCommentInDB, CommunityCommentResponse, AuthorInfo
)
from app.services.user_service import UserService

class CommunityService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.posts_collection = database.community_posts
        self.comments_collection = database.community_comments
        self.user_service = UserService(database)

    async def get_posts(
        self,
        skip: int = 0,
        limit: int = 20,
        post_type: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        trending_only: bool = False,
        unanswered_only: bool = False,
        solved_only: bool = False
    ) -> List[CommunityPostResponse]:
        """Récupérer les posts de la communauté avec filtres"""
        query = {}
        
        if post_type:
            query["post_type"] = post_type
            
        if category:
            query["category"] = category
            
        if trending_only:
            query["is_trending"] = True
            
        if unanswered_only:
            query["replies"] = 0
            
        if solved_only:
            query["is_solved"] = True
            
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [re.compile(search, re.IGNORECASE)]}}
            ]

        # Tri : épinglés en premier, puis par activité récente
        sort_criteria = [("is_pinned", -1), ("last_activity", -1)]
        
        cursor = self.posts_collection.find(query).sort(sort_criteria).skip(skip).limit(limit)
        posts = await cursor.to_list(length=limit)
        
        return [self._post_to_response(post) for post in posts]

    async def get_post_by_id(self, post_id: str) -> Optional[CommunityPostResponse]:
        """Récupérer un post par ID"""
        if not ObjectId.is_valid(post_id):
            return None
            
        post_doc = await self.posts_collection.find_one({"_id": ObjectId(post_id)})
        if post_doc:
            return self._post_to_response(post_doc)
        return None

    async def create_post(self, post_data: CommunityPostCreate, author_email: str) -> CommunityPostResponse:
        """Créer un nouveau post"""
        # Récupérer les infos de l'auteur
        user = await self.user_service.get_by_email(author_email)
        if not user:
            raise ValueError("Utilisateur non trouvé")

        author_info = AuthorInfo(
            name=user.full_name,
            avatar=user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
            level=user.level,
            badge=self._get_user_badge(user.level, user.xp)
        )

        post_dict = {
            **post_data.dict(),
            "author_email": author_email,
            "author_info": author_info.dict(),
            "likes": 0,
            "replies": 0,
            "views": 0,
            "liked_by": [],
            "is_pinned": False,
            "is_solved": False,
            "is_trending": False,
            "last_activity": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.posts_collection.insert_one(post_dict)
        created_post = await self.posts_collection.find_one({"_id": result.inserted_id})
        
        # Mettre à jour le trending si nécessaire
        await self._update_trending_status()
        
        return self._post_to_response(created_post)

    async def update_post(self, post_id: str, post_data: CommunityPostUpdate, author_email: str) -> Optional[CommunityPostResponse]:
        """Mettre à jour un post"""
        if not ObjectId.is_valid(post_id):
            return None

        update_data = {k: v for k, v in post_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()

        result = await self.posts_collection.update_one(
            {"_id": ObjectId(post_id), "author_email": author_email},
            {"$set": update_data}
        )

        if result.modified_count:
            return await self.get_post_by_id(post_id)
        return None

    async def increment_views(self, post_id: str):
        """Incrémenter le nombre de vues"""
        if ObjectId.is_valid(post_id):
            await self.posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {"$inc": {"views": 1}}
            )

    async def toggle_like(self, post_id: str, user_email: str) -> Dict[str, any]:
        """Liker/unliker un post"""
        if not ObjectId.is_valid(post_id):
            raise ValueError("ID de post invalide")

        post = await self.posts_collection.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise ValueError("Post non trouvé")

        liked_by = post.get("liked_by", [])
        
        if user_email in liked_by:
            # Retirer le like
            await self.posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {
                    "$pull": {"liked_by": user_email},
                    "$inc": {"likes": -1}
                }
            )
            return {"liked": False, "total_likes": post["likes"] - 1}
        else:
            # Ajouter le like
            await self.posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {
                    "$push": {"liked_by": user_email},
                    "$inc": {"likes": 1},
                    "$set": {"last_activity": datetime.utcnow()}
                }
            )
            return {"liked": True, "total_likes": post["likes"] + 1}

    async def mark_solved(self, post_id: str, author_email: str) -> bool:
        """Marquer un post comme résolu"""
        if not ObjectId.is_valid(post_id):
            return False

        result = await self.posts_collection.update_one(
            {"_id": ObjectId(post_id), "author_email": author_email, "post_type": "question"},
            {"$set": {"is_solved": True, "last_activity": datetime.utcnow()}}
        )

        return result.modified_count > 0

    async def get_comments(self, post_id: str, skip: int = 0, limit: int = 50) -> List[CommunityCommentResponse]:
        """Récupérer les commentaires d'un post"""
        cursor = self.comments_collection.find(
            {"post_id": post_id, "parent_id": None}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        comments = await cursor.to_list(length=limit)
        return [self._comment_to_response(comment) for comment in comments]

    async def create_comment(self, post_id: str, comment_data: CommunityCommentCreate, author_email: str) -> CommunityCommentResponse:
        """Créer un commentaire"""
        # Récupérer les infos de l'auteur
        user = await self.user_service.get_by_email(author_email)
        if not user:
            raise ValueError("Utilisateur non trouvé")

        comment_dict = {
            **comment_data.dict(),
            "post_id": post_id,
            "author_email": author_email,
            "author_name": user.full_name,
            "author_avatar": user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
            "author_level": user.level,
            "likes": 0,
            "liked_by": [],
            "replies_count": 0,
            "created_at": datetime.utcnow()
        }

        result = await self.comments_collection.insert_one(comment_dict)
        
        # Incrémenter le compteur de réponses du post et mettre à jour l'activité
        await self.posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {
                "$inc": {"replies": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )

        created_comment = await self.comments_collection.find_one({"_id": result.inserted_id})
        return self._comment_to_response(created_comment)

    async def get_stats(self) -> Dict[str, int]:
        """Récupérer les statistiques de la communauté"""
        total_posts = await self.posts_collection.count_documents({})
        total_members = await self.db.users.count_documents({})
        solved_today = await self.posts_collection.count_documents({
            "is_solved": True,
            "updated_at": {"$gte": datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)}
        })
        
        return {
            "total_posts": total_posts,
            "total_members": total_members,
            "online_now": 234,  # Mock - en production, utiliser Redis ou WebSocket
            "solved_today": solved_today
        }

    async def get_categories(self) -> List[str]:
        """Récupérer toutes les catégories"""
        categories = await self.posts_collection.distinct("category")
        return sorted(categories)

    async def _update_trending_status(self):
        """Mettre à jour le statut trending des posts"""
        # Posts avec beaucoup d'activité récente
        recent_time = datetime.utcnow() - timedelta(hours=24)
        
        # Réinitialiser tous les trending
        await self.posts_collection.update_many({}, {"$set": {"is_trending": False}})
        
        # Marquer comme trending les posts avec beaucoup d'activité
        pipeline = [
            {"$match": {"last_activity": {"$gte": recent_time}}},
            {"$addFields": {"activity_score": {"$add": ["$likes", {"$multiply": ["$replies", 2]}, {"$divide": ["$views", 10]}]}}},
            {"$match": {"activity_score": {"$gte": 10}}},
            {"$sort": {"activity_score": -1}},
            {"$limit": 10}
        ]
        
        trending_posts = await self.posts_collection.aggregate(pipeline).to_list(length=10)
        trending_ids = [post["_id"] for post in trending_posts]
        
        if trending_ids:
            await self.posts_collection.update_many(
                {"_id": {"$in": trending_ids}},
                {"$set": {"is_trending": True}}
            )

    def _get_user_badge(self, level: int, xp: int) -> str:
        """Déterminer le badge de l'utilisateur"""
        if level >= 20:
            return "Expert"
        elif level >= 15:
            return "Advanced"
        elif level >= 10:
            return "Intermediate"
        elif level >= 5:
            return "Beginner"
        else:
            return "Newcomer"

    def _post_to_response(self, post_doc: dict) -> CommunityPostResponse:
        """Convertir un document post en réponse"""
        return CommunityPostResponse(
            id=str(post_doc["_id"]),
            title=post_doc["title"],
            content=post_doc["content"],
            post_type=post_doc["post_type"],
            category=post_doc["category"],
            tags=post_doc.get("tags", []),
            image=post_doc.get("image"),
            author_info=AuthorInfo(**post_doc["author_info"]),
            likes=post_doc.get("likes", 0),
            replies=post_doc.get("replies", 0),
            views=post_doc.get("views", 0),
            is_pinned=post_doc.get("is_pinned", False),
            is_solved=post_doc.get("is_solved", False),
            is_trending=post_doc.get("is_trending", False),
            last_activity=post_doc["last_activity"],
            created_at=post_doc["created_at"]
        )

    def _comment_to_response(self, comment_doc: dict) -> CommunityCommentResponse:
        """Convertir un document commentaire en réponse"""
        return CommunityCommentResponse(
            id=str(comment_doc["_id"]),
            content=comment_doc["content"],
            parent_id=comment_doc.get("parent_id"),
            author_name=comment_doc["author_name"],
            author_avatar=comment_doc["author_avatar"],
            author_level=comment_doc["author_level"],
            likes=comment_doc.get("likes", 0),
            replies_count=comment_doc.get("replies_count", 0),
            created_at=comment_doc["created_at"]
        )