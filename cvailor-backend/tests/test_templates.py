import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template, TemplateLayout


@pytest_asyncio_fixture = pytest.fixture


async def seed_templates(db: AsyncSession):
    """Insert template fixture data for tests."""
    templates = [
        Template(
            slug="modern",
            name="Modern",
            description="Clean tech template",
            primary_category="tech",
            categories=["tech", "general"],
            experience_levels=["entry", "mid", "senior"],
            tags=["ATS-Optimised", "Tech"],
            accent_color="#2563eb",
            layout=TemplateLayout.single,
            ats_score=98,
            industry_reason="Best for FAANG",
            is_active=True,
            sort_order=1,
            metadata={},
        ),
        Template(
            slug="classic",
            name="Classic",
            description="Traditional finance template",
            primary_category="finance",
            categories=["finance", "general"],
            experience_levels=["mid", "senior"],
            tags=["Traditional"],
            accent_color="#1a1a1a",
            layout=TemplateLayout.single,
            ats_score=99,
            industry_reason="Best for finance",
            is_active=True,
            sort_order=2,
            metadata={},
        ),
    ]
    for t in templates:
        db.add(t)
    await db.flush()
    return templates


@pytest.mark.asyncio
async def test_list_templates(client: AsyncClient, db: AsyncSession):
    await seed_templates(db)
    response = await client.get("/api/v1/templates")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 2


@pytest.mark.asyncio
async def test_list_templates_by_category(client: AsyncClient, db: AsyncSession):
    await seed_templates(db)
    response = await client.get("/api/v1/templates?category=tech")
    assert response.status_code == 200
    items = response.json()["items"]
    assert all("tech" in item["categories"] for item in items)


@pytest.mark.asyncio
async def test_get_template_by_id(client: AsyncClient, db: AsyncSession):
    templates = await seed_templates(db)
    template_id = str(templates[0].id)

    response = await client.get(f"/api/v1/templates/{template_id}")
    assert response.status_code == 200
    assert response.json()["slug"] == "modern"


@pytest.mark.asyncio
async def test_get_template_not_found(client: AsyncClient):
    response = await client.get("/api/v1/templates/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
