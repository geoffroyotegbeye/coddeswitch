from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
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

class LanguageEnum(str, Enum):
    HTML = "html"
    CSS = "css"
    JAVASCRIPT = "javascript"
    REACT = "react"
    PYTHON = "python"

class DifficultyEnum(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ProjectTypeEnum(str, Enum):
    GUIDED = "guided"
    CHALLENGE = "challenge"
    COMMUNITY = "community"

class ProjectStep(BaseModel):
    id: str
    title: str
    description: str
    instructions: str
    starter_code: str
    expected_output: Optional[str] = None
    hints: List[str] = []
    order: int

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=1000)
    language: LanguageEnum
    difficulty: DifficultyEnum
    type: ProjectTypeEnum
    xp_reward: int = Field(..., ge=10, le=1000)
    estimated_time: str
    tags: List[str] = []
    thumbnail_url: Optional[str] = None
    learning_objectives: List[str] = []
    prerequisites: List[str] = []

class ProjectCreate(ProjectBase):
    steps: List[ProjectStep]

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[LanguageEnum] = None
    difficulty: Optional[DifficultyEnum] = None
    type: Optional[ProjectTypeEnum] = None
    xp_reward: Optional[int] = None
    estimated_time: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    steps: Optional[List[ProjectStep]] = None

class ProjectInDB(ProjectBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    steps: List[ProjectStep]
    completed_by: int = 0
    created_by: str  # User ID
    is_published: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Project(ProjectBase):
    id: str
    steps: List[ProjectStep]
    completed_by: int
    created_by: str
    is_published: bool
    created_at: datetime
    updated_at: datetime

class ProjectResponse(BaseModel):
    id: str
    title: str
    description: str
    language: str
    difficulty: str
    type: str
    xp_reward: int
    estimated_time: str
    tags: List[str]
    thumbnail_url: Optional[str]
    completed_by: int
    created_at: datetime