from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema, **kwargs):
        field_schema.update(type="string")
        return field_schema

class Badge(BaseModel):
    id: str
    name: str
    description: str
    image_url: str
    earned_at: datetime

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    xp: int = 0
    level: int = 1
    badges: List[Badge] = []
    completed_projects: List[str] = []
    avatar_url: Optional[str] = None
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class User(UserBase):
    id: str
    xp: int
    level: int
    badges: List[Badge]
    completed_projects: List[str]
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    xp: int
    level: int
    badges: List[Badge]
    completed_projects: List[str]
    avatar_url: Optional[str] = None
    is_admin: bool = False

    class Config:
        json_encoders = {ObjectId: str}