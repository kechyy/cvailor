from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import Connection

from app.core.config import settings
from app.models.base import Base  # noqa: F401 — registers all models
import app.models  # noqa: F401 — ensure all models are imported

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use psycopg2 (sync) for migrations — asyncpg cannot be used in a sync context
config.set_main_option(
    "sqlalchemy.url",
    settings.DATABASE_URL.replace("+asyncpg", "+psycopg2"),
)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        do_run_migrations(connection)
    connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
