"""add user_resumes table

Revision ID: 0002_user_resumes
Revises: 0001_initial_schema
Create Date: 2026-03-15 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0002_user_resumes"
down_revision: Union[str, None] = "0001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_resumes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("template_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content", postgresql.JSONB, nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["template_id"], ["templates.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "template_id", name="uq_user_resumes_user_template"),
    )
    op.create_index("ix_user_resumes_user_id", "user_resumes", ["user_id"])
    op.create_index("ix_user_resumes_template_id", "user_resumes", ["template_id"])


def downgrade() -> None:
    op.drop_index("ix_user_resumes_template_id", table_name="user_resumes")
    op.drop_index("ix_user_resumes_user_id", table_name="user_resumes")
    op.drop_table("user_resumes")
