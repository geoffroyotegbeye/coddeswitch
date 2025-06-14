from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.core.security import get_current_user_token
from app.models.messages import (
    ConversationCreate, ConversationResponse, MessageCreate, MessageResponse,
    BastionCreate, BastionResponse, BastionJoinRequest
)
from app.services.message_service import MessageService

router = APIRouter()

# CONVERSATIONS DIRECTES
@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Récupérer toutes les conversations de l'utilisateur"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.get_user_conversations(current_user.email)

@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Créer une nouvelle conversation directe"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.create_conversation(conversation_data, current_user.email)

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Récupérer les messages d'une conversation"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.get_conversation_messages(
        conversation_id, current_user.email, skip, limit
    )

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    message_data: MessageCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Envoyer un message dans une conversation"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.send_message(conversation_id, message_data, current_user.email)

# BASTIONS (GROUPES)
@router.get("/bastions", response_model=List[BastionResponse])
async def get_available_bastions(
    search: Optional[str] = None,
    tags: Optional[List[str]] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_database)
):
    """Récupérer les bastions disponibles"""
    message_service = MessageService(db)
    return await message_service.get_available_bastions(search, tags, skip, limit)

@router.get("/bastions/my", response_model=List[BastionResponse])
async def get_my_bastions(
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Récupérer les bastions de l'utilisateur"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.get_user_bastions(current_user.email)

@router.post("/bastions", response_model=BastionResponse)
async def create_bastion(
    bastion_data: BastionCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Créer un nouveau bastion"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.create_bastion(bastion_data, current_user.email)

@router.post("/bastions/{bastion_id}/join")
async def join_bastion(
    bastion_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Rejoindre un bastion"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    result = await message_service.join_bastion(bastion_id, current_user.email)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de rejoindre ce bastion"
        )
    return {"joined": True}

@router.post("/bastions/{bastion_id}/leave")
async def leave_bastion(
    bastion_id: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Quitter un bastion"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    result = await message_service.leave_bastion(bastion_id, current_user.email)
    return {"left": result}

@router.get("/bastions/{bastion_id}/messages", response_model=List[MessageResponse])
async def get_bastion_messages(
    bastion_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Récupérer les messages d'un bastion"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.get_bastion_messages(
        bastion_id, current_user.email, skip, limit
    )

@router.post("/bastions/{bastion_id}/messages", response_model=MessageResponse)
async def send_bastion_message(
    bastion_id: str,
    message_data: MessageCreate,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Envoyer un message dans un bastion"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.send_bastion_message(
        bastion_id, message_data, current_user.email
    )

@router.post("/messages/{message_id}/react")
async def add_message_reaction(
    message_id: str,
    emoji: str,
    current_user=Depends(get_current_user_token),
    db=Depends(get_database)
):
    """Ajouter une réaction à un message"""
    if current_user.user_type == "guest":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Connexion requise"
        )
    
    message_service = MessageService(db)
    return await message_service.add_reaction(message_id, emoji, current_user.email)