"""add cv_tailor_history table

Revision ID: 0003_cv_tailor_history
Revises: 0002_user_resumes
Create Date: 2026-03-17 00:00:00.000000

Stores an immutable record of every GPT-4 tailoring session.
Both original and tailored CV content are preserved so neither version is lost.
The created_at column is used to enforce the daily per-user rate limit.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003_cv_tailor_history"
down_revision: Union[str, None] = "0002_user_resumes"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cv_tailor_history",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("template_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "original_cv_content",
            postgresql.JSONB,
            nullable=False,
        ),
        sa.Column(
            "tailored_cv_content",
            postgresql.JSONB,
            nullable=False,
        ),
        sa.Column("job_description", sa.Text, nullable=False),
        sa.Column("ats_score", sa.Integer, nullable=False),
        sa.Column(
            "matched_keywords",
            postgresql.JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "missing_keywords",
            postgresql.JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "improvements_made",
            postgresql.JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "suggestions",
            postgresql.JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["template_id"], ["templates.id"], ondelete="SET NULL"
        ),
    )
    op.create_index("ix_cv_tailor_history_user_id", "cv_tailor_history", ["user_id"])
    op.create_index(
        "ix_cv_tailor_history_created_at", "cv_tailor_history", ["created_at"]
    )


def downgrade() -> None:
    op.drop_index("ix_cv_tailor_history_created_at", table_name="cv_tailor_history")
    op.drop_index("ix_cv_tailor_history_user_id", table_name="cv_tailor_history")
    op.drop_table("cv_tailor_history")
