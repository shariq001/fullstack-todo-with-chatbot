"""Base SQLModel class with database engine setup."""
from sqlmodel import SQLModel, create_engine
from ..config.settings import settings

# SQLite needs different engine configuration than PostgreSQL
if settings.database_url.startswith("sqlite"):
    engine = create_engine(
        settings.database_url,
        echo=settings.debug,
        connect_args={"check_same_thread": False},
    )
else:
    from sqlalchemy.pool import NullPool
    # Use NullPool for Neon serverless to avoid connection pooling issues
    engine = create_engine(
        settings.database_url,
        poolclass=NullPool,
        echo=settings.debug,
        connect_args={
            "connect_timeout": 10,
            "keepalives": 1,
            "keepalives_idle": 30,
        }
    )


def create_db_and_tables():
    """Create database tables based on models."""
    # Import models to register them with SQLModel metadata
    from .user import User  # noqa: F401
    from .task import Task  # noqa: F401
    from .conversation import Conversation  # noqa: F401
    from .message import Message  # noqa: F401
    SQLModel.metadata.create_all(engine)
