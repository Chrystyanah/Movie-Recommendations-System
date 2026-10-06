from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Movie Recommendation System API")

# Configure CORS to allow Vercel production frontend & local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://movie-recommendations-system-tau.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI backend is running"}
