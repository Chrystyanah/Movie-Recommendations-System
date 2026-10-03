from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProfileResponse(BaseModel):
    favorite_genres: Optional[List[str]] = []
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True
