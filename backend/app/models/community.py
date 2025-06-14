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

class PostTypeEnum(str, Enum):
    QUESTION = "question"
    SHOWCASE = "showcase"
    DISCUSSION = "discussion"
    CHALLENGE = "challenge"

class AuthorInfo(BaseModel):
    name: str
    avatar: str
    level: int
    badge: str

class CommunityPostBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=10, max_length=5000)
    post_type: PostTypeEnum
    category: str
    tags: List[str] = []
    image: Optional[str] = None

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image: Optional[str] = None

class CommunityPostInDB(CommunityPostBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author_email: str
    author_info: AuthorInfo
    likes: int = 0
    replies: int = 0
    views: int = 0
    liked_by: List[str] = []
    is_pinned: bool = False
    is_solved: bool = False
    is_trending: bool = False
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CommunityPostResponse(BaseModel):
    id: str
    title: str
    content: str
    post_type: str
    category: str
    tags: List[str]
    image: Optional[str]
    author_info: AuthorInfo
    likes: int
    replies: int
    views: int
    is_pinned: bool
    is_solved: bool
    is_trending: bool
    last_activity: datetime
    created_at: datetime

class CommunityCommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    parent_id: Optional[str] = None

class CommunityCommentCreate(CommunityCommentBase):
    pass

class CommunityCommentInDB(CommunityCommentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    post_id: str
    author_email: str
    author_name: str
    author_avatar: str
    author_level: int
    likes: int = 0
    liked_by: List[str] = []
    replies_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CommunityCommentResponse(BaseModel):
    id: str
    content: str
    parent_id: Optional[str]
    author_name: str
    author_avatar: str
    author_level: int
    likes: int
    replies_count: int
    created_at: datetime