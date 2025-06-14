from pydantic import BaseModel
from typing import Optional
from app.models.user import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserResponse] = None

class TokenData(BaseModel):
    email: Optional[str] = None
    user_type: Optional[str] = "user"  # "user" ou "guest"