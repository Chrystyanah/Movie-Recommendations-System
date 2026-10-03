import requests
import chromadb
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import Movie, Genre

# Local persistent vector database stored on disk inside ./chroma_db
chroma_client = chromadb.PersistentClient(path="./chroma_db")
movie_collection = chroma_client.get_or_create_collection(name="movies_collection")

def fetch_and_seed_movies(db: Session, pages: int = 3):
    """
    Fetches popular movies from TMDB (or seeds sample fallback data)
    and populates PostgreSQL and ChromaDB.
    """
    if not getattr(settings, "TMDB_API_KEY", None):
        print("No TMDB_API_KEY found in settings. Seeding fallback movies for MVP...")
        sample_movies = [
            {"id": 27205, "title": "Inception", "overview": "A thief who steals corporate secrets through dream-sharing technology.", "release_date": "2010-07-15", "vote_avg": 8.4},
            {"id": 157336, "title": "Interstellar", "overview": "A team of explorers travel through a wormhole in space to ensure humanity's survival.", "release_date": "2014-11-05", "vote_avg": 8.4},
            {"id": 155, "title": "The Dark Knight", "overview": "Batman raises the stakes in his war on crime with the help of Gordon and Dent.", "release_date": "2008-07-16", "vote_avg": 8.5},
            {"id": 603, "title": "The Matrix", "overview": "A computer hacker learns from mysterious rebels about the true nature of his reality.", "release_date": "1999-03-30", "vote_avg": 8.2},
            {"id": 19995, "title": "Avatar", "overview": "A paraplegic Marine dispatched to the moon Pandora becomes torn between orders and protection.", "release_date": "2009-12-15", "vote_avg": 7.57}
        ]
        
        for m in sample_movies:
            db_movie = db.query(Movie).filter(Movie.id == m["id"]).first()
            if not db_movie:
                new_movie = Movie(
                    id=m["id"],
                    title=m["title"],
                    overview=m["overview"],
                    release_date=m["release_date"],
                    vote_avg=m["vote_avg"]
                )
                db.add(new_movie)
                
                movie_collection.upsert(
                    ids=[str(m["id"])],
                    documents=[f"{m['title']}: {m['overview']}"],
                    metadatas=[{"title": m["title"], "vote_avg": m["vote_avg"]}]
                )
        db.commit()
        print("Database and persistent ChromaDB successfully seeded!")
        return

    # Fetch real data from TMDB API
    for page in range(1, pages + 1):
        url = f"{settings.TMDB_BASE_URL}/movie/popular?api_key={settings.TMDB_API_KEY}&page={page}"
        res = requests.get(url).json()
        
        for item in res.get("results", []):
            db_movie = db.query(Movie).filter(Movie.id == item["id"]).first()
            if not db_movie:
                movie_obj = Movie(
                    id=item["id"],
                    title=item["title"],
                    overview=item.get("overview", ""),
                    release_date=item.get("release_date", ""),
                    vote_avg=item.get("vote_average", 0.0),
                    poster_path=item.get("poster_path", "")
                )
                db.add(movie_obj)

                doc_text = f"{item['title']} - {item.get('overview', '')}"
                movie_collection.upsert(
                    ids=[str(item["id"])],
                    documents=[doc_text],
                    metadatas=[{"title": item["title"], "vote_avg": item.get("vote_average", 0.0)}]
                )
    db.commit()
    print("TMDB Movies successfully ingested into local ChromaDB!")
