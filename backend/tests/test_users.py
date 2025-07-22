import pytest
from httpx import AsyncClient
from app.core.config import settings
from app.main import app

pytestmark = pytest.mark.asyncio


async def test_create_user(client: AsyncClient):
    response = await client.post(
        f"{settings.API_V1_STR}/users/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "password" not in data


async def test_login(client: AsyncClient):
    # First create a user
    await client.post(
        f"{settings.API_V1_STR}/users/register",
        json={
            "email": "login@example.com",
            "password": "testpassword123",
            "full_name": "Login Test User",
        },
    )

    # Try to login
    response = await client.post(
        f"{settings.API_V1_STR}/users/login",
        data={"username": "login@example.com", "password": "testpassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
