from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.tmdb import movie_collection
from app.models.models import Movie
from typing import List, Dict, Any

router = APIRouter()

@router.get("/search", response_model=List[Dict[str, Any]])
def recommend_movies(
    prompt: str = Query(..., description="e.g. 'mind-bending sci-fi movie with dreams and space travel'"),
    top_k: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """
    Semantic search over movies using ChromaDB vector embeddings.
    """
    results = movie_collection.query(
        query_texts=[prompt],
        n_results=top_k
    )

    if not results or not results["ids"] or not results["ids"][0]:
        return []

    movie_ids = [int(id_str) for id_str in results["ids"][0]]
    movies = db.query(Movie).filter(Movie.id.in_(movie_ids)).all()

    # Map results in order of vector distance score
    movie_dict = {m.id: m for m in movies}
    ordered_results = []
    
    for idx, m_id in enumerate(movie_ids):
        if m_id in movie_dict:
            m = movie_dict[m_id]
            ordered_results.append({
                "id": m.id,
                "title": m.title,
                "overview": m.overview,
                "vote_avg": m.vote_avg,
                "release_date": m.release_date,
                "distance_score": results["distances"][0][idx] if "distances" in results else None
            })

    return ordered_results
