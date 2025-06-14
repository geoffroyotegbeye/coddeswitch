from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from bson import ObjectId

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

class AuthorInfo(BaseModel):
    name: str
    avatar: str
    role: str
    bio: Optional[str] = None

class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    excerpt: str = Field(..., min_length=10, max_length=500)
    content: str = Field(..., min_length=50)
    category: str
    tags: List[str] = []
    image: Optional[str] = None
    featured: bool = False
    published: bool = True

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None

class BlogPostInDB(BlogPostBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author_email: str
    author_info: AuthorInfo
    read_time: str
    likes: int = 0
    comments_count: int = 0
    views: int = 0
    liked_by: List[str] = []
    bookmarked_by: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BlogPostResponse(BaseModel):
    id: str
    title: str
    excerpt: str
    content: str
    category: str
    tags: List[str]
    image: Optional[str]
    featured: bool
    published: bool
    author_info: AuthorInfo
    read_time: str
    likes: int
    comments_count: int
    views: int
    created_at: datetime
    updated_at: datetime

class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    parent_id: Optional[str] = None  # Pour les réponses

class CommentCreate(CommentBase):
    pass

class CommentInDB(CommentBase):
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

class CommentResponse(BaseModel):
    id: str
    content: str
    parent_id: Optional[str]
    author_name: str
    author_avatar: str
    author_level: int
    likes: int
    replies_count: int
    created_at: datetime