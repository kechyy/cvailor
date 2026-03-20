"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-03-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Pre-defined enum type references (create_type=False = don't emit CREATE TYPE)
userplan = postgresql.ENUM("free", "pro", "enterprise", name="userplan", create_type=False)
oauthprovider = postgresql.ENUM("google", "github", "linkedin", name="oauthprovider", create_type=False)
templatelayout = postgresql.ENUM("single", "sidebar-left", "sidebar-right", name="templatelayout", create_type=False)
cvstatus = postgresql.ENUM("draft", "active", "archived", name="cvstatus", create_type=False)
exportformat = postgresql.ENUM("pdf", "docx", name="exportformat", create_type=False)
exportstatus = postgresql.ENUM("pending", "processing", "completed", "failed", name="exportstatus", create_type=False)
suggestiontype = postgresql.ENUM(
    "summary", "experience_bullet", "tailor_cv", "cover_letter",
    "extract_keywords", "template_recommendation",
    name="suggestiontype", create_type=False,
)
jobmatchstatus = postgresql.ENUM("pending", "completed", "failed", name="jobmatchstatus", create_type=False)


def upgrade() -> None:
    # --- Create enum types via raw SQL (DO block makes retries idempotent) ---
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE userplan AS ENUM ('free', 'pro', 'enterprise');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE oauthprovider AS ENUM ('google', 'github', 'linkedin');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE templatelayout AS ENUM ('single', 'sidebar-left', 'sidebar-right');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE cvstatus AS ENUM ('draft', 'active', 'archived');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE exportformat AS ENUM ('pdf', 'docx');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE exportstatus AS ENUM ('pending', 'processing', 'completed', 'failed');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE suggestiontype AS ENUM ('summary', 'experience_bullet', 'tailor_cv', 'cover_letter', 'extract_keywords', 'template_recommendation');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE jobmatchstatus AS ENUM ('pending', 'completed', 'failed');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$
    """)

    # --- templates ---
    op.create_table(
        "templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("primary_category", sa.String(100), nullable=False),
        sa.Column("categories", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("experience_levels", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("tags", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("accent_color", sa.String(20), nullable=False, server_default="#000000"),
        sa.Column("layout", templatelayout, nullable=False),
        sa.Column("preview_image_url", sa.String(2048), nullable=True),
        sa.Column("thumbnail_url", sa.String(2048), nullable=True),
        sa.Column("ats_score", sa.Integer, nullable=False, server_default="90"),
        sa.Column("industry_reason", sa.Text, nullable=False, server_default=""),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("extra_meta", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_templates_slug", "templates", ["slug"])
    op.create_index("ix_templates_primary_category", "templates", ["primary_category"])

    # --- users ---
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(320), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("avatar_url", sa.String(2048), nullable=True),
        sa.Column("plan", userplan, nullable=False, server_default="free"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])

    # --- user_oauth_accounts ---
    op.create_table(
        "user_oauth_accounts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("provider", oauthprovider, nullable=False),
        sa.Column("provider_user_id", sa.String(255), nullable=False),
        sa.Column("access_token", sa.String(2048), nullable=True),
        sa.Column("refresh_token", sa.String(2048), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_user_oauth_accounts_user_id", "user_oauth_accounts", ["user_id"])

    # --- cvs ---
    op.create_table(
        "cvs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("template_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("templates.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(300), nullable=False, server_default="Untitled CV"),
        sa.Column("slug", sa.String(350), nullable=True),
        sa.Column("content", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("status", cvstatus, nullable=False, server_default="draft"),
        sa.Column("ats_score", sa.Integer, nullable=True),
        sa.Column("current_version", sa.Integer, nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_cvs_user_id", "cvs", ["user_id"])
    op.create_index("ix_cvs_slug", "cvs", ["slug"])
    op.create_index("ix_cvs_status", "cvs", ["status"])

    # --- cv_versions ---
    op.create_table(
        "cv_versions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("cv_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("version_number", sa.Integer, nullable=False),
        sa.Column("content", postgresql.JSONB, nullable=False),
        sa.Column("change_summary", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_cv_versions_cv_id", "cv_versions", ["cv_id"])

    # --- ats_analysis_runs ---
    op.create_table(
        "ats_analysis_runs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("cv_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_description", sa.Text, nullable=True),
        sa.Column("ats_score", sa.Integer, nullable=False),
        sa.Column("score_breakdown", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("matched_keywords", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("missing_keywords", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("tips", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("analysis_version", sa.String(50), nullable=False, server_default="v1"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ats_analysis_runs_cv_id", "ats_analysis_runs", ["cv_id"])

    # --- export_jobs ---
    op.create_table(
        "export_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("cv_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("format", exportformat, nullable=False),
        sa.Column("status", exportstatus, nullable=False, server_default="pending"),
        sa.Column("file_url", sa.String(2048), nullable=True),
        sa.Column("file_size", sa.Integer, nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_export_jobs_cv_id", "export_jobs", ["cv_id"])
    op.create_index("ix_export_jobs_user_id", "export_jobs", ["user_id"])
    op.create_index("ix_export_jobs_status", "export_jobs", ["status"])

    # --- ai_suggestions ---
    op.create_table(
        "ai_suggestions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("cv_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cvs.id", ondelete="SET NULL"), nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("suggestion_type", suggestiontype, nullable=False),
        sa.Column("input_payload", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("output_payload", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("model_used", sa.String(100), nullable=False),
        sa.Column("tokens_used", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ai_suggestions_cv_id", "ai_suggestions", ["cv_id"])
    op.create_index("ix_ai_suggestions_user_id", "ai_suggestions", ["user_id"])
    op.create_index("ix_ai_suggestions_suggestion_type", "ai_suggestions", ["suggestion_type"])

    # --- job_match_runs ---
    op.create_table(
        "job_match_runs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("cv_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_title", sa.String(300), nullable=False),
        sa.Column("company_name", sa.String(300), nullable=True),
        sa.Column("job_description", sa.Text, nullable=False),
        sa.Column("match_score", sa.Integer, nullable=True),
        sa.Column("key_matches", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("gaps", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("tailored_content", postgresql.JSONB, nullable=True),
        sa.Column("status", jobmatchstatus, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_job_match_runs_cv_id", "job_match_runs", ["cv_id"])

    # --- recommendation_logs ---
    op.create_table(
        "recommendation_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("cv_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cvs.id", ondelete="SET NULL"), nullable=True),
        sa.Column("recommended_template_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("templates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("reason", sa.Text, nullable=False),
        sa.Column("score", sa.Float, nullable=False),
        sa.Column("confidence", sa.Float, nullable=False),
        sa.Column("input_factors", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("was_accepted", sa.Boolean, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_recommendation_logs_user_id", "recommendation_logs", ["user_id"])


def downgrade() -> None:
    op.drop_table("recommendation_logs")
    op.drop_table("job_match_runs")
    op.drop_table("ai_suggestions")
    op.drop_table("export_jobs")
    op.drop_table("ats_analysis_runs")
    op.drop_table("cv_versions")
    op.drop_table("cvs")
    op.drop_table("user_oauth_accounts")
    op.drop_table("users")
    op.drop_table("templates")

    op.execute("DROP TYPE IF EXISTS jobmatchstatus")
    op.execute("DROP TYPE IF EXISTS suggestiontype")
    op.execute("DROP TYPE IF EXISTS exportstatus")
    op.execute("DROP TYPE IF EXISTS exportformat")
    op.execute("DROP TYPE IF EXISTS cvstatus")
    op.execute("DROP TYPE IF EXISTS templatelayout")
    op.execute("DROP TYPE IF EXISTS oauthprovider")
    op.execute("DROP TYPE IF EXISTS userplan")
