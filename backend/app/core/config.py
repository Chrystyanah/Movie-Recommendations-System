from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT_DIR / ".env", extra="ignore")

    app_env: str = "development"
    port: int = 8000
    cors_origins: str = "http://localhost:3000"
    tmdb_api_key: str = ""
    database_url: str = ""
    chroma_host: str = "localhost"
    chroma_port: int = 8001

settings = Settings()