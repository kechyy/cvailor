"""
Template seed data — directly derived from the frontend templatesMock.ts.

Run: python -m seeds.templates
Or call seed_templates() from a startup hook.
"""
import asyncio
import json

from sqlalchemy import text

from app.core.database import AsyncSessionLocal

TEMPLATE_SEED_DATA = [
    {
        "slug": "classic",
        "name": "Classic",
        "description": "Clean, traditional single-column layout trusted in finance, law, and consulting.",
        "primary_category": "finance",
        "categories": ["finance", "general", "executive"],
        "experience_levels": ["mid", "senior", "executive"],
        "tags": ["ATS-Optimised", "Traditional", "Single Column", "Serif"],
        "accent_color": "#1a1a1a",
        "layout": "single",
        "ats_score": 99,
        "industry_reason": (
            "Serif fonts and single-column structure maximise ATS parse accuracy. "
            "The format most expected by finance and legal recruiters."
        ),
        "is_active": True,
        "sort_order": 1,
        "extra_meta": {},
    },
    {
        "slug": "modern",
        "name": "Modern",
        "description": "Clean sans-serif layout with metrics-first bullet formatting. Built for FAANG applications.",
        "primary_category": "tech",
        "categories": ["tech", "general"],
        "experience_levels": ["entry", "mid", "senior"],
        "tags": ["AI Recommended", "ATS-Optimised", "Tech-Focused", "FAANG Ready"],
        "accent_color": "#2563eb",
        "layout": "single",
        "ats_score": 98,
        "industry_reason": (
            "Metrics-first bullet format aligns with FAANG hiring criteria. "
            "Clean sans-serif typography parses cleanly in ATS systems like Greenhouse and Lever."
        ),
        "is_active": True,
        "sort_order": 2,
        "extra_meta": {"is_ai_recommended": True},
    },
    {
        "slug": "professional",
        "name": "Professional",
        "description": "Sidebar layout that balances readability and skills visibility. Ideal for sales and general roles.",
        "primary_category": "general",
        "categories": ["general", "finance", "tech"],
        "experience_levels": ["entry", "mid", "senior"],
        "tags": ["Sidebar Layout", "Balanced", "Versatile"],
        "accent_color": "#0f766e",
        "layout": "sidebar-left",
        "ats_score": 93,
        "industry_reason": (
            "Left sidebar highlights skills upfront — critical for roles where "
            "tools and certifications are evaluated before experience."
        ),
        "is_active": True,
        "sort_order": 3,
        "extra_meta": {},
    },
    {
        "slug": "executive",
        "name": "Executive",
        "description": "Two-panel gravitas layout designed for director and C-suite applications.",
        "primary_category": "executive",
        "categories": ["executive", "finance", "general"],
        "experience_levels": ["senior", "executive"],
        "tags": ["Executive", "Leadership", "C-Suite", "Two-Panel"],
        "accent_color": "#1e293b",
        "layout": "sidebar-right",
        "ats_score": 95,
        "industry_reason": (
            "The two-panel design separates leadership achievements from core competencies, "
            "matching how executive recruiters evaluate senior profiles."
        ),
        "is_active": True,
        "sort_order": 4,
        "extra_meta": {},
    },
    {
        "slug": "academic",
        "name": "Academic",
        "description": "Education-first, dense information layout for research, academia, and PhD applications.",
        "primary_category": "academic",
        "categories": ["academic", "general"],
        "experience_levels": ["entry", "mid", "senior"],
        "tags": ["Academic", "Research", "Education-First", "Publications"],
        "accent_color": "#7c3aed",
        "layout": "single",
        "ats_score": 99,
        "industry_reason": (
            "Puts education, research, and publications at the top — exactly what "
            "academic hiring committees and university ATS systems prioritise."
        ),
        "is_active": True,
        "sort_order": 5,
        "extra_meta": {},
    },
    {
        "slug": "healthcare",
        "name": "Healthcare",
        "description": "Certifications-first layout built for clinical, nursing, and allied health roles.",
        "primary_category": "healthcare",
        "categories": ["healthcare", "general"],
        "experience_levels": ["entry", "mid", "senior"],
        "tags": ["Healthcare", "Clinical", "Certifications", "NHS Ready"],
        "accent_color": "#0891b2",
        "layout": "single",
        "ats_score": 97,
        "industry_reason": (
            "Licence numbers, certifications, and clinical experience placed prominently — "
            "matches the evaluation criteria used by NHS and hospital ATS systems."
        ),
        "is_active": True,
        "sort_order": 6,
        "extra_meta": {},
    },
    {
        "slug": "creative",
        "name": "Creative",
        "description": "Bold visual design for portfolios, design agencies, and UX/creative roles.",
        "primary_category": "creative",
        "categories": ["creative", "general"],
        "experience_levels": ["entry", "mid", "senior"],
        "tags": ["Creative", "Portfolio", "Design-Forward", "UX/UI"],
        "accent_color": "#db2777",
        "layout": "sidebar-left",
        "ats_score": 82,
        "industry_reason": (
            "Visual impact over ATS optimisation — best for agencies and studios that "
            "review CVs as designed PDFs rather than through automated parsing."
        ),
        "is_active": True,
        "sort_order": 7,
        "extra_meta": {},
    },
]

# Raw SQL upsert — bypasses ORM enum coercion so layout values like
# "sidebar-left" are sent as literal strings with an explicit ::templatelayout cast.
_UPSERT_SQL = text("""
    INSERT INTO templates (
        id, slug, name, description, primary_category,
        categories, experience_levels, tags, accent_color,
        layout, ats_score, industry_reason, is_active, sort_order, extra_meta
    ) VALUES (
        gen_random_uuid(), :slug, :name, :description, :primary_category,
        CAST(:categories AS jsonb), CAST(:experience_levels AS jsonb),
        CAST(:tags AS jsonb), :accent_color,
        CAST(:layout AS templatelayout), :ats_score, :industry_reason,
        :is_active, :sort_order, CAST(:extra_meta AS jsonb)
    )
    ON CONFLICT (slug) DO UPDATE SET
        name             = EXCLUDED.name,
        description      = EXCLUDED.description,
        primary_category = EXCLUDED.primary_category,
        categories       = EXCLUDED.categories,
        experience_levels= EXCLUDED.experience_levels,
        tags             = EXCLUDED.tags,
        accent_color     = EXCLUDED.accent_color,
        layout           = EXCLUDED.layout,
        ats_score        = EXCLUDED.ats_score,
        industry_reason  = EXCLUDED.industry_reason,
        is_active        = EXCLUDED.is_active,
        sort_order       = EXCLUDED.sort_order,
        extra_meta       = EXCLUDED.extra_meta,
        updated_at       = now()
""")


async def seed_templates() -> None:
    """Upsert all seed templates by slug — safe to run multiple times."""
    async with AsyncSessionLocal() as session:
        for data in TEMPLATE_SEED_DATA:
            await session.execute(_UPSERT_SQL, {
                **data,
                "categories":       json.dumps(data["categories"]),
                "experience_levels": json.dumps(data["experience_levels"]),
                "tags":             json.dumps(data["tags"]),
                "extra_meta":       json.dumps(data["extra_meta"]),
            })
        await session.commit()
        print(f"✓ Seeded {len(TEMPLATE_SEED_DATA)} templates")


if __name__ == "__main__":
    asyncio.run(seed_templates())
