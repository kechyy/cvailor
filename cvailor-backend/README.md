# Cvailor Backend

> FastAPI backend for Cvailor — AI-powered CV tailoring, ATS scoring, GPT-4 optimization, async PDF export, and JWT authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.111 + Python 3.11+ |
| Database | PostgreSQL 16 + SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Task Queue | Celery + Redis |
| AI — CV Tailoring | OpenAI GPT-4 Turbo |
| AI — Summaries / Rewrites | Anthropic Claude (Haiku / Sonnet) |
| File Storage | AWS S3 (pre-signed URLs) |
| Auth | JWT (python-jose) + Bcrypt |
| Validation | Pydantic v2 |
| Logging | structlog |
| Testing | pytest + pytest-asyncio + Factory Boy |
| Code Quality | ruff + mypy |

---

## Features

- **Authentication** — JWT access/refresh tokens, email/password registration, OAuth provider support (Google, GitHub, LinkedIn)
- **CV Management** — full CRUD with automatic immutable versioning on every save
- **AI CV Tailoring (GPT-4)** — rewrites summary, experience bullets, and skills to match a job description; returns ATS score, matched/missing keywords, improvements, and suggestions; rate-limited per user
- **AI Features (Claude)** — professional summary generation, XYZ-formula experience rewrites, keyword extraction, template recommendations
- **ATS Analysis** — rule-based ATS scoring across four dimensions (keywords match, experience fit, skills alignment, summary strength); persists full analysis history
- **PDF Export** — async Celery job pipeline; returns a pre-signed S3 URL on completion
- **CV Templates** — seeded catalog of 8 templates (Classic, Modern, Professional, Executive, Creative, Academic, Healthcare, Minimal)
- **Dashboard** — overview stats, recent CVs, AI-generated insights

---

## Project Structure

```
cvailor-backend/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── api/v1/                  # Route handlers
│   │   ├── auth.py              # Register, login, refresh, logout, me
│   │   ├── cvs.py               # CV CRUD, versioning, duplication
│   │   ├── cv_tailor.py         # GPT-4 tailoring endpoint
│   │   ├── ats.py               # ATS review and analysis history
│   │   ├── ai.py                # Summary, rewrite, keyword, template AI
│   │   ├── templates.py         # Template catalog
│   │   ├── dashboard.py         # Overview, recent CVs, insights
│   │   ├── exports.py           # PDF export job creation & status
│   │   └── resumes.py           # Resume upload & parsing
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/                # Business logic layer
│   ├── repositories/            # Data access layer
│   ├── core/                    # Config, DB, JWT, dependencies, exceptions
│   └── workers/                 # Celery app + background task definitions
├── tests/                       # pytest test suite
├── seeds/                       # Database seed scripts (templates)
├── alembic/                     # DB migration files
├── Dockerfile
├── pyproject.toml
└── .env.example
```

---

## API Overview

Base URL: `http://localhost:8000/api/v1`

| Prefix | Description |
|---|---|
| `/auth` | Register, login, token refresh, logout |
| `/users` | User profile |
| `/cvs` | CV CRUD, versioning, template selection |
| `/cv/tailor` | GPT-4 CV tailoring (rate-limited) |
| `/ats` | ATS analysis — run and retrieve history |
| `/ai` | Summary generation, experience rewrite, keyword extraction |
| `/templates` | Template catalog |
| `/dashboard` | Overview stats, recent CVs, insights |
| `/exports` | Async PDF export jobs |
| `/resumes` | Resume upload |

Interactive docs available at `http://localhost:8000/docs` when running locally.

---

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL 16
- Redis
- (Optional) Docker & Docker Compose

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Key variables:

```env
DATABASE_URL=postgresql+asyncpg://cvailor:cvailor@localhost:5432/cvailor
JWT_SECRET_KEY=your-secret-key
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=cvailor-exports
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CV_TAILOR_DAILY_LIMIT=10
```

### Run with Docker (recommended)

```bash
# From the repo root
docker-compose up
```

Services started:

| Service | URL |
|---|---|
| API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Celery Flower | http://localhost:5555 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Run locally

```bash
cd cvailor-backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install with dev dependencies
pip install -e ".[dev]"

# Run migrations
alembic upgrade head

# Seed template catalog
python -m seeds.templates

# Start API server
uvicorn app.main:app --reload

# Start Celery worker (separate terminal)
celery -A app.workers.celery_app worker --loglevel=info
```

---

## Database Schema

Key tables:

| Table | Description |
|---|---|
| `users` | Accounts with plan (free / pro / enterprise) |
| `cvs` | CV records — content stored as JSONB, ATS score cached |
| `cv_versions` | Immutable snapshots created on every save |
| `cv_tailor_history` | Audit trail of every GPT-4 tailoring session |
| `ats_analysis_runs` | Full ATS scoring history per CV |
| `ai_suggestions` | Log of all AI-assisted actions |
| `templates` | Seeded template catalog |
| `export_jobs` | PDF export job tracking (pending → completed) |
| `user_resumes` | Uploaded resume text and metadata |
| `job_matches` | Job application tracking |

---

## ATS Scoring

ATS analysis runs against four weighted dimensions:

| Dimension | Weight | Description |
|---|---|---|
| Keywords Match | 40% | Overlap between CV tokens and job description tokens |
| Experience Fit | 25% | Experience entry count and bullet depth |
| Skills Alignment | 20% | Skills list overlap with job description keywords |
| Summary Strength | 15% | Presence and length of professional summary |

Results are persisted to `ats_analysis_runs` and the overall score is cached on the CV record.

---

## Testing

```bash
pytest                        # Run all tests
pytest tests/test_auth.py     # Auth tests only
pytest -v                     # Verbose output
```

Tests use an in-memory async session and factory-boy fixtures — no running database required.

---

## CV Tailoring Rate Limits

GPT-4 tailoring is rate-limited per user per day (default: 10 requests). Configure via `CV_TAILOR_DAILY_LIMIT` in `.env`. Exceeding the limit returns HTTP 429.

---

## Security

- Passwords hashed with Bcrypt
- JWT access tokens expire in 30 minutes (configurable)
- Refresh tokens are rotated on use
- All CV/ATS endpoints are scoped to the authenticated user — no cross-user data access
- S3 export URLs are pre-signed with a 1-hour expiry
