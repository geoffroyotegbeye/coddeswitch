from typing import List, Optional, Dict
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import re

from app.models.project import (
    ProjectCreate, ProjectUpdate, ProjectInDB, Project, ProjectResponse
)

class ProjectService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.projects

    async def get_projects(
        self,
        skip: int = 0,
        limit: int = 20,
        language: Optional[str] = None,
        difficulty: Optional[str] = None,
        project_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[ProjectResponse]:
        """Récupérer les projets avec filtres"""
        query = {"is_published": True}
        
        if language:
            query["language"] = language
            
        if difficulty:
            query["difficulty"] = difficulty
            
        if project_type:
            query["type"] = project_type
            
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [re.compile(search, re.IGNORECASE)]}}
            ]

        cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        projects = await cursor.to_list(length=limit)
        
        return [self._project_to_response(project) for project in projects]

    async def get_project_by_id(self, project_id: str) -> Optional[Project]:
        """Récupérer un projet complet par ID"""
        if not ObjectId.is_valid(project_id):
            return None
            
        project_doc = await self.collection.find_one({"_id": ObjectId(project_id)})
        if project_doc:
            return self._project_to_full(project_doc)
        return None

    async def create_project(self, project_data: ProjectCreate, creator_email: str) -> Project:
        """Créer un nouveau projet"""
        project_dict = {
            **project_data.dict(),
            "completed_by": 0,
            "created_by": creator_email,
            "is_published": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.collection.insert_one(project_dict)
        created_project = await self.collection.find_one({"_id": result.inserted_id})
        return self._project_to_full(created_project)

    async def update_project(self, project_id: str, project_data: ProjectUpdate, creator_email: str) -> Optional[Project]:
        """Mettre à jour un projet"""
        if not ObjectId.is_valid(project_id):
            return None

        update_data = {k: v for k, v in project_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {"_id": ObjectId(project_id), "created_by": creator_email},
            {"$set": update_data}
        )

        if result.modified_count:
            return await self.get_project_by_id(project_id)
        return None

    async def increment_completed(self, project_id: str):
        """Incrémenter le nombre de complétions"""
        if ObjectId.is_valid(project_id):
            await self.collection.update_one(
                {"_id": ObjectId(project_id)},
                {"$inc": {"completed_by": 1}}
            )

    async def get_languages(self) -> List[str]:
        """Récupérer tous les langages"""
        languages = await self.collection.distinct("language", {"is_published": True})
        return sorted(languages)

    async def get_categories(self) -> List[str]:
        """Récupérer toutes les catégories"""
        categories = await self.collection.distinct("type", {"is_published": True})
        return sorted(categories)

    def _project_to_response(self, project_doc: dict) -> ProjectResponse:
        """Convertir un document projet en réponse simple"""
        return ProjectResponse(
            id=str(project_doc["_id"]),
            title=project_doc["title"],
            description=project_doc["description"],
            language=project_doc["language"],
            difficulty=project_doc["difficulty"],
            type=project_doc["type"],
            xp_reward=project_doc["xp_reward"],
            estimated_time=project_doc["estimated_time"],
            tags=project_doc.get("tags", []),
            thumbnail_url=project_doc.get("thumbnail_url"),
            completed_by=project_doc.get("completed_by", 0),
            created_at=project_doc["created_at"]
        )

    def _project_to_full(self, project_doc: dict) -> Project:
        """Convertir un document projet en projet complet"""
        return Project(
            id=str(project_doc["_id"]),
            title=project_doc["title"],
            description=project_doc["description"],
            language=project_doc["language"],
            difficulty=project_doc["difficulty"],
            type=project_doc["type"],
            xp_reward=project_doc["xp_reward"],
            estimated_time=project_doc["estimated_time"],
            tags=project_doc.get("tags", []),
            thumbnail_url=project_doc.get("thumbnail_url"),
            learning_objectives=project_doc.get("learning_objectives", []),
            prerequisites=project_doc.get("prerequisites", []),
            steps=project_doc["steps"],
            completed_by=project_doc.get("completed_by", 0),
            created_by=project_doc["created_by"],
            is_published=project_doc.get("is_published", False),
            created_at=project_doc["created_at"],
            updated_at=project_doc["updated_at"]
        )