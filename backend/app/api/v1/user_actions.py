from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Movie, Watchlist, Rating, User
from app.schemas.user_actions import WatchlistAdd, WatchlistResponse, RatingCreate, RatingResponse

router = APIRouter()

def get_demo_user(db: Session) -> User:
    user = db.query(User).first()
    if not user:
        user = User(email="demo@example.com", hashed_password="demo_password_hash")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/watchlist", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    payload: WatchlistAdd, 
    db: Session = Depends(get_db)
):
    user = get_demo_user(db)
    movie = db.query(Movie).filter(Movie.id == payload.movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = db.query(Watchlist).filter(
        Watchlist.user_id == user.id, Watchlist.movie_id == payload.movie_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Movie already in watchlist")

    watchlist_item = Watchlist(user_id=user.id, movie_id=payload.movie_id)
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)

    return WatchlistResponse(
        id=watchlist_item.id,
        movie_id=movie.id,
        title=movie.title,
        overview=movie.overview,
        poster_path=movie.poster_path,
        added_at=watchlist_item.added_at
    )

@router.get("/watchlist", response_model=List[WatchlistResponse])
def get_watchlist(
    db: Session = Depends(get_db)
):
    user = get_demo_user(db)
    items = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()
    results = []
    for item in items:
        movie = db.query(Movie).filter(Movie.id == item.movie_id).first()
        if movie:
            results.append(
                WatchlistResponse(
                    id=item.id,
                    movie_id=movie.id,
                    title=movie.title,
                    overview=movie.overview,
                    poster_path=movie.poster_path,
                    added_at=item.added_at
                )
            )
    return results

@router.post("/ratings", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def rate_movie(
    payload: RatingCreate, 
    db: Session = Depends(get_db)
):
    user = get_demo_user(db)
    movie = db.query(Movie).filter(Movie.id == payload.movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing_rating = db.query(Rating).filter(
        Rating.user_id == user.id, Rating.movie_id == payload.movie_id
    ).first()

    if existing_rating:
        existing_rating.rating = payload.rating
        db.commit()
        db.refresh(existing_rating)
        return existing_rating

    new_rating = Rating(user_id=user.id, movie_id=payload.movie_id, rating=payload.rating)
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return new_rating
