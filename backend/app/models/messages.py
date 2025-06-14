from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from bson import ObjectId
from enum import Enum

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema, **kwargs):
        field_schema.update(type="string")
        return field_schema

class MessageTypeEnum(str, Enum):
    TEXT = "text"
    CODE = "code"
    FILE = "file"
    SYSTEM = "system"

class ConversationTypeEnum(str, Enum):
    DIRECT = "direct"
    BASTION = "bastion"

class ParticipantInfo(BaseModel):
    email: str
    name: str
    avatar: str
    is_online: bool = False

class MessageReaction(BaseModel):
    emoji: str
    count: int
    users: List[str]

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    message_type: MessageTypeEnum = MessageTypeEnum.TEXT
    language: Optional[str] = None  # Pour les messages de code

class MessageCreate(MessageBase):
    pass

class MessageInDB(MessageBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversation_id: str
    sender_email: str
    sender_name: str
    sender_avatar: str
    reactions: List[MessageReaction] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    edited_at: Optional[datetime] = None

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class MessageResponse(BaseModel):
    id: str
    content: str
    message_type: str
    language: Optional[str]
    sender_name: str
    sender_avatar: str
    reactions: List[MessageReaction]
    created_at: datetime
    edited_at: Optional[datetime]

class ConversationBase(BaseModel):
    name: Optional[str] = None
    conversation_type: ConversationTypeEnum
    participants: List[str]  # Liste d'emails

class ConversationCreate(ConversationBase):
    pass

class ConversationInDB(ConversationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: Dict[str, int] = {}  # email -> count
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ConversationResponse(BaseModel):
    id: str
    name: Optional[str]
    conversation_type: str
    participants: List[ParticipantInfo]
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int
    created_at: datetime

class BastionBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=10, max_length=200)
    is_private: bool = False
    max_members: int = Field(15, ge=5, le=15)
    tags: List[str] = []

class BastionCreate(BastionBase):
    pass

class BastionInDB(BastionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    creator_email: str
    members: List[str] = []  # Liste d'emails
    avatar: str = "🏰"  # Emoji par défaut
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BastionResponse(BaseModel):
    id: str
    name: str
    description: str
    is_private: bool
    max_members: int
    tags: List[str]
    avatar: str
    members_count: int
    last_activity: datetime
    created_at: datetime

class BastionJoinRequest(BaseModel):
    message: Optional[str] = None