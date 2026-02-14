"""Base SQLModel class with database engine setup."""
from sqlmodel import SQLModel, create_engine
from ..config.settings import settings
import logging

logger = logging.getLogger(__name__)

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
            "connect_timeout": 60,  # Increased to 60 seconds for serverless
            "keepalives": 1,
            "keepalives_idle": 30,
        },
        pool_pre_ping=True,  # Test connection before using
    )


def create_db_and_tables():
    """Create database tables based on models with timeout handling."""
    try:
        # Import models to register them with SQLModel metadata
        from .user import User  # noqa: F401
        from .task import Task  # noqa: F401
        from .conversation import Conversation  # noqa: F401
        from .message import Message  # noqa: F401

        logger.info("Creating database tables...")
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created/verified successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        # Don't crash on table creation errors
        raise
