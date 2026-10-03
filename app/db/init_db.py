from app.db.session import engine, Base
import app.models.models  # Register models with SQLAlchemy metadata

def init_db():
    print("Connecting to PostgreSQL and creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
