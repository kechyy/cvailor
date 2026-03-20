import pytest
from httpx import AsyncClient


CV_PAYLOAD = {
    "title": "Google SWE 2025",
    "content": {
        "personal": {
            "fullName": "Sarah Mitchell",
            "jobTitle": "Senior Software Engineer",
            "email": "sarah@example.com",
            "phone": "+44 7700 000000",
            "location": "London, UK",
        },
        "experience": [
            {
                "id": "exp_1",
                "company": "Spotify",
                "role": "Senior Engineer",
                "startDate": "Jan 2022",
                "endDate": "",
                "current": True,
                "bullets": [
                    "Led redesign of recommendation engine serving 400M users",
                    "Reduced latency by 40% through async pipeline refactor",
                ],
            }
        ],
        "education": [
            {
                "id": "edu_1",
                "institution": "University of Manchester",
                "degree": "Bachelor's",
                "field": "Computer Science",
                "year": "2019",
            }
        ],
        "skills": ["Python", "TypeScript", "Kubernetes", "PostgreSQL"],
        "languages": ["English", "French"],
        "certifications": [],
        "jobContext": {
            "jobDescription": "",
            "targetCompany": "Google",
            "extractedKeywords": [],
        },
    },
}


@pytest.mark.asyncio
async def test_create_cv(client: AsyncClient):
    response = await client.post("/api/v1/cvs", json=CV_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Google SWE 2025"
    assert data["content"]["personal"]["fullName"] == "Sarah Mitchell"
    assert data["current_version"] == 1


@pytest.mark.asyncio
async def test_list_cvs(client: AsyncClient):
    await client.post("/api/v1/cvs", json=CV_PAYLOAD)
    response = await client.get("/api/v1/cvs")
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_get_cv(client: AsyncClient):
    create = await client.post("/api/v1/cvs", json=CV_PAYLOAD)
    cv_id = create.json()["id"]

    response = await client.get(f"/api/v1/cvs/{cv_id}")
    assert response.status_code == 200
    assert response.json()["id"] == cv_id


@pytest.mark.asyncio
async def test_update_cv_title(client: AsyncClient):
    create = await client.post("/api/v1/cvs", json=CV_PAYLOAD)
    cv_id = create.json()["id"]

    response = await client.patch(f"/api/v1/cvs/{cv_id}", json={"title": "Updated Title"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


@pytest.mark.asyncio
async def test_delete_cv(client: AsyncClient):
    create = await client.post("/api/v1/cvs", json=CV_PAYLOAD)
    cv_id = create.json()["id"]

    delete_response = await client.delete(f"/api/v1/cvs/{cv_id}")
    assert delete_response.status_code == 204

    get_response = await client.get(f"/api/v1/cvs/{cv_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_duplicate_cv(client: AsyncClient):
    create = await client.post("/api/v1/cvs", json=CV_PAYLOAD)
    cv_id = create.json()["id"]

    dupe = await client.post(f"/api/v1/cvs/{cv_id}/duplicate")
    assert dupe.status_code == 201
    assert "Copy" in dupe.json()["title"]
    assert dupe.json()["id"] != cv_id
