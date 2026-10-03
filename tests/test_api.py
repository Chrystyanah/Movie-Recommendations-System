import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome to AI Movie Recommender API"

def test_recommendations_endpoint():
    response = client.get("/api/v1/recommendations/search?query=space adventure")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_user_watchlist_flow():
    # Test getting watchlist
    get_res = client.get("/api/v1/user/watchlist")
    assert get_res.status_code == 200

def test_rate_movie_flow():
    # Test rating
    payload = {"movie_id": 1, "rating": 4.5}
    response = client.post("/api/v1/user/ratings", json=payload)
    # Returns 201 or 404 depending on seeded movie IDs
    assert response.status_code in [201, 404]
