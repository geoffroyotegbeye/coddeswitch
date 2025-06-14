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

class StepProgress(BaseModel):
    step_id: str
    completed: bool = False
    code: Optional[str] = None
    completed_at: Optional[datetime] = None

class UserProgressBase(BaseModel):
    user_id: str
    project_id: str
    current_step: int = 0
    steps_progress: List[StepProgress] = []
    is_completed: bool = False

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressUpdate(BaseModel):
    current_step: Optional[int] = None
    steps_progress: Optional[List[StepProgress]] = None
    is_completed: Optional[bool] = None

class UserProgressInDB(UserProgressBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserProgress(UserProgressBase):
    id: str
    started_at: datetime
    completed_at: Optional[datetime]
    updated_at: datetime

class UserProgressResponse(BaseModel):
    id: str
    project_id: str
    current_step: int
    steps_progress: List[StepProgress]
    is_completed: bool
    progress_percentage: float
    started_at: datetime
    completed_at: Optional[datetime]