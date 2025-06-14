from typing import List, Optional, Dict
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import re

from app.models.messages import (
    ConversationCreate, ConversationInDB, ConversationResponse, ParticipantInfo,
    MessageCreate, MessageInDB, MessageResponse, MessageReaction,
    BastionCreate, BastionInDB, BastionResponse
)
from app.services.user_service import UserService

class MessageService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.conversations_collection = database.conversations
        self.messages_collection = database.messages
        self.bastions_collection = database.bastions
        self.user_service = UserService(database)

    # CONVERSATIONS DIRECTES
    async def get_user_conversations(self, user_email: str) -> List[ConversationResponse]:
        """Récupérer toutes les conversations de l'utilisateur"""
        cursor = self.conversations_collection.find(
            {"participants": user_email}
        ).sort("updated_at", -1)
        
        conversations = await cursor.to_list(length=None)
        responses = []
        
        for conv in conversations:
            participants_info = []
            for participant_email in conv["participants"]:
                if participant_email != user_email:  # Exclure l'utilisateur actuel
                    user = await self.user_service.get_by_email(participant_email)
                    if user:
                        participants_info.append(ParticipantInfo(
                            email=participant_email,
                            name=user.full_name,
                            avatar=user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
                            is_online=False  # Mock - en production, utiliser Redis
                        ))
            
            unread_count = conv.get("unread_count", {}).get(user_email, 0)
            
            responses.append(ConversationResponse(
                id=str(conv["_id"]),
                name=conv.get("name"),
                conversation_type=conv["conversation_type"],
                participants=participants_info,
                last_message=conv.get("last_message"),
                last_message_time=conv.get("last_message_time"),
                unread_count=unread_count,
                created_at=conv["created_at"]
            ))
        
        return responses

    async def create_conversation(self, conversation_data: ConversationCreate, creator_email: str) -> ConversationResponse:
        """Créer une nouvelle conversation directe"""
        # Vérifier que la conversation n'existe pas déjà
        existing = await self.conversations_collection.find_one({
            "conversation_type": "direct",
            "participants": {"$all": [creator_email] + conversation_data.participants}
        })
        
        if existing:
            return await self._conversation_to_response(existing, creator_email)

        conv_dict = {
            **conversation_data.dict(),
            "participants": [creator_email] + conversation_data.participants,
            "last_message": None,
            "last_message_time": None,
            "unread_count": {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.conversations_collection.insert_one(conv_dict)
        created_conv = await self.conversations_collection.find_one({"_id": result.inserted_id})
        
        return await self._conversation_to_response(created_conv, creator_email)

    async def get_conversation_messages(
        self, 
        conversation_id: str, 
        user_email: str, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[MessageResponse]:
        """Récupérer les messages d'une conversation"""
        # Vérifier que l'utilisateur fait partie de la conversation
        conv = await self.conversations_collection.find_one({
            "_id": ObjectId(conversation_id),
            "participants": user_email
        })
        
        if not conv:
            raise ValueError("Conversation non trouvée ou accès non autorisé")

        cursor = self.messages_collection.find(
            {"conversation_id": conversation_id}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        messages = await cursor.to_list(length=limit)
        
        # Marquer les messages comme lus
        await self._mark_messages_as_read(conversation_id, user_email)
        
        return [self._message_to_response(msg) for msg in reversed(messages)]

    async def send_message(self, conversation_id: str, message_data: MessageCreate, sender_email: str) -> MessageResponse:
        """Envoyer un message dans une conversation"""
        # Vérifier que l'utilisateur fait partie de la conversation
        conv = await self.conversations_collection.find_one({
            "_id": ObjectId(conversation_id),
            "participants": sender_email
        })
        
        if not conv:
            raise ValueError("Conversation non trouvée ou accès non autorisé")

        # Récupérer les infos de l'expéditeur
        user = await self.user_service.get_by_email(sender_email)
        if not user:
            raise ValueError("Utilisateur non trouvé")

        message_dict = {
            **message_data.dict(),
            "conversation_id": conversation_id,
            "sender_email": sender_email,
            "sender_name": user.full_name,
            "sender_avatar": user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
            "reactions": [],
            "created_at": datetime.utcnow(),
            "edited_at": None
        }

        result = await self.messages_collection.insert_one(message_dict)
        
        # Mettre à jour la conversation
        unread_updates = {}
        for participant in conv["participants"]:
            if participant != sender_email:
                current_unread = conv.get("unread_count", {}).get(participant, 0)
                unread_updates[f"unread_count.{participant}"] = current_unread + 1

        await self.conversations_collection.update_one(
            {"_id": ObjectId(conversation_id)},
            {
                "$set": {
                    "last_message": message_data.content[:100] + "..." if len(message_data.content) > 100 else message_data.content,
                    "last_message_time": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    **unread_updates
                }
            }
        )

        created_message = await self.messages_collection.find_one({"_id": result.inserted_id})
        return self._message_to_response(created_message)

    # BASTIONS
    async def get_available_bastions(
        self, 
        search: Optional[str] = None, 
        tags: Optional[List[str]] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[BastionResponse]:
        """Récupérer les bastions disponibles"""
        query = {"is_private": False}
        
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        
        if tags:
            query["tags"] = {"$in": tags}

        cursor = self.bastions_collection.find(query).sort("last_activity", -1).skip(skip).limit(limit)
        bastions = await cursor.to_list(length=limit)
        
        return [self._bastion_to_response(bastion) for bastion in bastions]

    async def get_user_bastions(self, user_email: str) -> List[BastionResponse]:
        """Récupérer les bastions de l'utilisateur"""
        cursor = self.bastions_collection.find(
            {"members": user_email}
        ).sort("last_activity", -1)
        
        bastions = await cursor.to_list(length=None)
        return [self._bastion_to_response(bastion) for bastion in bastions]

    async def create_bastion(self, bastion_data: BastionCreate, creator_email: str) -> BastionResponse:
        """Créer un nouveau bastion"""
        bastion_dict = {
            **bastion_data.dict(),
            "creator_email": creator_email,
            "members": [creator_email],  # Le créateur est automatiquement membre
            "avatar": "🏰",
            "last_activity": datetime.utcnow(),
            "created_at": datetime.utcnow()
        }

        result = await self.bastions_collection.insert_one(bastion_dict)
        created_bastion = await self.bastions_collection.find_one({"_id": result.inserted_id})
        
        return self._bastion_to_response(created_bastion)

    async def join_bastion(self, bastion_id: str, user_email: str) -> bool:
        """Rejoindre un bastion"""
        if not ObjectId.is_valid(bastion_id):
            return False

        bastion = await self.bastions_collection.find_one({"_id": ObjectId(bastion_id)})
        if not bastion:
            return False

        # Vérifier si l'utilisateur n'est pas déjà membre
        if user_email in bastion.get("members", []):
            return True

        # Vérifier si le bastion n'est pas plein
        if len(bastion.get("members", [])) >= bastion.get("max_members", 15):
            return False

        # Ajouter l'utilisateur
        result = await self.bastions_collection.update_one(
            {"_id": ObjectId(bastion_id)},
            {
                "$push": {"members": user_email},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )

        return result.modified_count > 0

    async def leave_bastion(self, bastion_id: str, user_email: str) -> bool:
        """Quitter un bastion"""
        if not ObjectId.is_valid(bastion_id):
            return False

        result = await self.bastions_collection.update_one(
            {"_id": ObjectId(bastion_id)},
            {
                "$pull": {"members": user_email},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )

        return result.modified_count > 0

    async def get_bastion_messages(
        self, 
        bastion_id: str, 
        user_email: str, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[MessageResponse]:
        """Récupérer les messages d'un bastion"""
        # Vérifier que l'utilisateur est membre du bastion
        bastion = await self.bastions_collection.find_one({
            "_id": ObjectId(bastion_id),
            "members": user_email
        })
        
        if not bastion:
            raise ValueError("Bastion non trouvé ou accès non autorisé")

        cursor = self.messages_collection.find(
            {"conversation_id": bastion_id}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        messages = await cursor.to_list(length=limit)
        return [self._message_to_response(msg) for msg in reversed(messages)]

    async def send_bastion_message(self, bastion_id: str, message_data: MessageCreate, sender_email: str) -> MessageResponse:
        """Envoyer un message dans un bastion"""
        # Vérifier que l'utilisateur est membre du bastion
        bastion = await self.bastions_collection.find_one({
            "_id": ObjectId(bastion_id),
            "members": sender_email
        })
        
        if not bastion:
            raise ValueError("Bastion non trouvé ou accès non autorisé")

        # Récupérer les infos de l'expéditeur
        user = await self.user_service.get_by_email(sender_email)
        if not user:
            raise ValueError("Utilisateur non trouvé")

        message_dict = {
            **message_data.dict(),
            "conversation_id": bastion_id,
            "sender_email": sender_email,
            "sender_name": user.full_name,
            "sender_avatar": user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
            "reactions": [],
            "created_at": datetime.utcnow(),
            "edited_at": None
        }

        result = await self.messages_collection.insert_one(message_dict)
        
        # Mettre à jour l'activité du bastion
        await self.bastions_collection.update_one(
            {"_id": ObjectId(bastion_id)},
            {"$set": {"last_activity": datetime.utcnow()}}
        )

        created_message = await self.messages_collection.find_one({"_id": result.inserted_id})
        return self._message_to_response(created_message)

    async def add_reaction(self, message_id: str, emoji: str, user_email: str) -> Dict[str, any]:
        """Ajouter une réaction à un message"""
        if not ObjectId.is_valid(message_id):
            raise ValueError("ID de message invalide")

        message = await self.messages_collection.find_one({"_id": ObjectId(message_id)})
        if not message:
            raise ValueError("Message non trouvé")

        reactions = message.get("reactions", [])
        
        # Chercher si la réaction existe déjà
        for reaction in reactions:
            if reaction["emoji"] == emoji:
                if user_email in reaction["users"]:
                    # Retirer la réaction
                    reaction["users"].remove(user_email)
                    reaction["count"] -= 1
                    if reaction["count"] == 0:
                        reactions.remove(reaction)
                else:
                    # Ajouter la réaction
                    reaction["users"].append(user_email)
                    reaction["count"] += 1
                break
        else:
            # Nouvelle réaction
            reactions.append({
                "emoji": emoji,
                "count": 1,
                "users": [user_email]
            })

        await self.messages_collection.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"reactions": reactions}}
        )

        return {"success": True, "reactions": reactions}

    async def _mark_messages_as_read(self, conversation_id: str, user_email: str):
        """Marquer les messages comme lus"""
        await self.conversations_collection.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$set": {f"unread_count.{user_email}": 0}}
        )

    async def _conversation_to_response(self, conv_doc: dict, user_email: str) -> ConversationResponse:
        """Convertir un document conversation en réponse"""
        participants_info = []
        for participant_email in conv_doc["participants"]:
            if participant_email != user_email:
                user = await self.user_service.get_by_email(participant_email)
                if user:
                    participants_info.append(ParticipantInfo(
                        email=participant_email,
                        name=user.full_name,
                        avatar=user.avatar_url or "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
                        is_online=False
                    ))
        
        unread_count = conv_doc.get("unread_count", {}).get(user_email, 0)
        
        return ConversationResponse(
            id=str(conv_doc["_id"]),
            name=conv_doc.get("name"),
            conversation_type=conv_doc["conversation_type"],
            participants=participants_info,
            last_message=conv_doc.get("last_message"),
            last_message_time=conv_doc.get("last_message_time"),
            unread_count=unread_count,
            created_at=conv_doc["created_at"]
        )

    def _message_to_response(self, msg_doc: dict) -> MessageResponse:
        """Convertir un document message en réponse"""
        return MessageResponse(
            id=str(msg_doc["_id"]),
            content=msg_doc["content"],
            message_type=msg_doc["message_type"],
            language=msg_doc.get("language"),
            sender_name=msg_doc["sender_name"],
            sender_avatar=msg_doc["sender_avatar"],
            reactions=[MessageReaction(**reaction) for reaction in msg_doc.get("reactions", [])],
            created_at=msg_doc["created_at"],
            edited_at=msg_doc.get("edited_at")
        )

    def _bastion_to_response(self, bastion_doc: dict) -> BastionResponse:
        """Convertir un document bastion en réponse"""
        return BastionResponse(
            id=str(bastion_doc["_id"]),
            name=bastion_doc["name"],
            description=bastion_doc["description"],
            is_private=bastion_doc["is_private"],
            max_members=bastion_doc["max_members"],
            tags=bastion_doc.get("tags", []),
            avatar=bastion_doc.get("avatar", "🏰"),
            members_count=len(bastion_doc.get("members", [])),
            last_activity=bastion_doc["last_activity"],
            created_at=bastion_doc["created_at"]
        )