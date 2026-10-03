from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.api.v1 import auth, recommendations, user_actions
from app.services.tmdb import fetch_and_seed_movies

# Create all database tables across imported models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Startup routine
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        fetch_and_seed_movies(db)
    finally:
        db.close()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
if hasattr(auth, 'router'):
    app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])

app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}/recommendations", tags=["Recommendations"])
app.include_router(user_actions.router, prefix=f"{settings.API_V1_STR}/user", tags=["User Actions"])

@app.get("/")
def root():
    return {"message": "Welcome to AI Movie Recommender API", "docs": "/docs"}
