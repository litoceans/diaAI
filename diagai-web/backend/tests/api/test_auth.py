import pytest
from httpx import AsyncClient
from fastapi import status

async def test_signup(client, db, test_user):
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "firebase_token": "valid_token",  # Mock token
            "email": test_user["email"],
            "name": test_user["name"]
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_user["email"]
    
    # Check database
    user = await db.users.find_one({"email": test_user["email"]})
    assert user is not None
    assert user["credits"] == 10  # Default credits

async def test_login(client, db, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        json={"firebase_token": "valid_token"}  # Mock token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_user["email"]

async def test_refresh_token(client, user_token):
    response = await client.post(
        "/api/v1/auth/refresh-token",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data

async def test_invalid_token(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"firebase_token": "invalid_token"}
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
