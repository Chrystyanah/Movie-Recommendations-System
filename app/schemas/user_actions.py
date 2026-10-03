from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WatchlistAdd(BaseModel):
    movie_id: int

class WatchlistResponse(BaseModel):
    id: int
    movie_id: int
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    added_at: datetime

    class Config:
        from_attributes = True

class RatingCreate(BaseModel):
    movie_id: int
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating between 1.0 and 5.0")

class RatingResponse(BaseModel):
    id: int
    movie_id: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True
