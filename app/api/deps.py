from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.session import get_db
from app.models.models import User, Profile

DEFAULT_GUEST_EMAIL = "guest@example.com"

def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    MVP Mode: Automatically assigns all requests to a shared Guest User.
    Allows testing full features (ratings, watchlists) without login headers.
    """
    user = db.query(User).filter(User.email == DEFAULT_GUEST_EMAIL).first()
    
    if not user:
        # Auto-create guest user if it doesn't exist in DB
        user = User(
            email=DEFAULT_GUEST_EMAIL,
            hashed_password="guest_mode_no_password"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create guest profile
        profile = Profile(
            user_id=user.id,
            favorite_genres=["Action", "Sci-Fi"],
            bio="Guest User Profile"
        )
        db.add(profile)
        db.commit()

    return user
