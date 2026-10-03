from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Movie Recommender API"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./sql_app.db"
    
    # Vector DB
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    
    # External APIs
    TMDB_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
