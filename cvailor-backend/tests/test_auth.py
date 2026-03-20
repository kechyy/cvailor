import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_success(unauthed_client: AsyncClient):
    response = await unauthed_client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@cvailor.com",
            "password": "StrongPass1!",
            "full_name": "New User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "tokens" in data
    assert data["tokens"]["access_token"]
    assert data["user"]["email"] == "newuser@cvailor.com"


@pytest.mark.asyncio
async def test_register_duplicate_email(unauthed_client: AsyncClient):
    payload = {
        "email": "dupe@cvailor.com",
        "password": "StrongPass1!",
        "full_name": "Dupe User",
    }
    await unauthed_client.post("/api/v1/auth/register", json=payload)
    response = await unauthed_client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_register_weak_password(unauthed_client: AsyncClient):
    response = await unauthed_client.post(
        "/api/v1/auth/register",
        json={
            "email": "weak@cvailor.com",
            "password": "weakpass",
            "full_name": "Weak User",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(unauthed_client: AsyncClient):
    await unauthed_client.post(
        "/api/v1/auth/register",
        json={"email": "login@cvailor.com", "password": "LoginPass1!", "full_name": "Login User"},
    )
    response = await unauthed_client.post(
        "/api/v1/auth/login",
        json={"email": "login@cvailor.com", "password": "LoginPass1!"},
    )
    assert response.status_code == 200
    assert response.json()["tokens"]["access_token"]


@pytest.mark.asyncio
async def test_login_wrong_password(unauthed_client: AsyncClient):
    response = await unauthed_client.post(
        "/api/v1/auth/login",
        json={"email": "test@cvailor.com", "password": "wrong"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_authenticated(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == "test@cvailor.com"


@pytest.mark.asyncio
async def test_me_unauthenticated(unauthed_client: AsyncClient):
    response = await unauthed_client.get("/api/v1/auth/me")
    assert response.status_code == 401
