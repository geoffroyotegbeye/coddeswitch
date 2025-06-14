from typing import List, Optional, Dict
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import re

from app.models.blog import (
    BlogPostCreate, BlogPostUpdate, BlogPostInDB, BlogPostResponse,
    CommentCreate, CommentInDB, CommentResponse, AuthorInfo
)
from app.services.user_service import UserService

class BlogService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.posts_collection = database.blog_posts
        self.comments_collection = database.blog_comments
        self.user_service = UserService(database)

    async def get_posts(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        category: Optional[str] = None,
        search: Optional[str] = None,
        featured_only: bool = False
    ) -> List[BlogPostResponse]:
        """Récupérer les articles de blog avec filtres"""
        query = {"published": True}
        
        if category:
            query["category"] = category
            
        if featured_only:
            query["featured"] = True
            
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"excerpt": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [re.compile(search, re.IGNORECASE)]}}
            ]

        cursor = self.posts_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        posts = await cursor.to_list(length=limit)
        
        return [self._post_to_response(post) for post in posts]

    async def get_post_by_id(self, post_id: str) -> Optional[BlogPostResponse]:
        """Récupérer un article par ID"""
        if not ObjectId.is_valid(post_id):
            return None
            
        post_doc = await self.posts_collection.find_one({"_id": ObjectId(post_id)})
        if post_doc:
            return self._post_to_response(post_doc)
        return None

    async def create_post(self, post_data: BlogPostCreate, author_email: str) -> BlogPostResponse:
        """Créer un nouvel article"""
        # Récupérer les infos de l'auteur
        user = await self.user_service.get_by_email(author_email)
        if not user:
            raise ValueError("Utilisateur non trouvé")

        author_info = AuthorInfo(
            name=user.full_name,
            avatar=user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
            role="Développeur",
            bio=f"Membre niveau {user.level} avec {user.xp} XP"
        )

        # Calculer le temps de lecture (approximatif)
        word_count = len(post_data.content.split())
        read_time = f"{max(1, word_count // 200)} min"

        post_dict = {
            **post_data.dict(),
            "author_email": author_email,
            "author_info": author_info.dict(),
            "read_time": read_time,
            "likes": 0,
            "comments_count": 0,
            "views": 0,
            "liked_by": [],
            "bookmarked_by": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.posts_collection.insert_one(post_dict)
        created_post = await self.posts_collection.find_one({"_id": result.inserted_id})
        return self._post_to_response(created_post)

    async def update_post(self, post_id: str, post_data: BlogPostUpdate, author_email: str) -> Optional[BlogPostResponse]:
        """Mettre à jour un article"""
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
        """Liker/unliker un article"""
        if not ObjectId.is_valid(post_id):
            raise ValueError("ID d'article invalide")

        post = await self.posts_collection.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise ValueError("Article non trouvé")

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
                    "$inc": {"likes": 1}
                }
            )
            return {"liked": True, "total_likes": post["likes"] + 1}

    async def toggle_bookmark(self, post_id: str, user_email: str) -> Dict[str, bool]:
        """Sauvegarder/retirer un article des favoris"""
        if not ObjectId.is_valid(post_id):
            raise ValueError("ID d'article invalide")

        post = await self.posts_collection.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise ValueError("Article non trouvé")

        bookmarked_by = post.get("bookmarked_by", [])
        
        if user_email in bookmarked_by:
            # Retirer des favoris
            await self.posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {"$pull": {"bookmarked_by": user_email}}
            )
            return {"bookmarked": False}
        else:
            # Ajouter aux favoris
            await self.posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {"$push": {"bookmarked_by": user_email}}
            )
            return {"bookmarked": True}

    async def get_comments(self, post_id: str, skip: int = 0, limit: int = 50) -> List[CommentResponse]:
        """Récupérer les commentaires d'un article"""
        cursor = self.comments_collection.find(
            {"post_id": post_id, "parent_id": None}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        comments = await cursor.to_list(length=limit)
        return [self._comment_to_response(comment) for comment in comments]

    async def create_comment(self, post_id: str, comment_data: CommentCreate, author_email: str) -> CommentResponse:
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
        
        # Incrémenter le compteur de commentaires de l'article
        await self.posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$inc": {"comments_count": 1}}
        )

        created_comment = await self.comments_collection.find_one({"_id": result.inserted_id})
        return self._comment_to_response(created_comment)

    async def toggle_comment_like(self, comment_id: str, user_email: str) -> Dict[str, any]:
        """Liker/unliker un commentaire"""
        if not ObjectId.is_valid(comment_id):
            raise ValueError("ID de commentaire invalide")

        comment = await self.comments_collection.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            raise ValueError("Commentaire non trouvé")

        liked_by = comment.get("liked_by", [])
        
        if user_email in liked_by:
            # Retirer le like
            await self.comments_collection.update_one(
                {"_id": ObjectId(comment_id)},
                {
                    "$pull": {"liked_by": user_email},
                    "$inc": {"likes": -1}
                }
            )
            return {"liked": False, "total_likes": comment["likes"] - 1}
        else:
            # Ajouter le like
            await self.comments_collection.update_one(
                {"_id": ObjectId(comment_id)},
                {
                    "$push": {"liked_by": user_email},
                    "$inc": {"likes": 1}
                }
            )
            return {"liked": True, "total_likes": comment["likes"] + 1}

    async def get_categories(self) -> List[str]:
        """Récupérer toutes les catégories"""
        categories = await self.posts_collection.distinct("category", {"published": True})
        return sorted(categories)

    def _post_to_response(self, post_doc: dict) -> BlogPostResponse:
        """Convertir un document post en réponse"""
        return BlogPostResponse(
            id=str(post_doc["_id"]),
            title=post_doc["title"],
            excerpt=post_doc["excerpt"],
            content=post_doc["content"],
            category=post_doc["category"],
            tags=post_doc.get("tags", []),
            image=post_doc.get("image"),
            featured=post_doc.get("featured", False),
            published=post_doc.get("published", True),
            author_info=AuthorInfo(**post_doc["author_info"]),
            read_time=post_doc["read_time"],
            likes=post_doc.get("likes", 0),
            comments_count=post_doc.get("comments_count", 0),
            views=post_doc.get("views", 0),
            created_at=post_doc["created_at"],
            updated_at=post_doc["updated_at"]
        )

    def _comment_to_response(self, comment_doc: dict) -> CommentResponse:
        """Convertir un document commentaire en réponse"""
        return CommentResponse(
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