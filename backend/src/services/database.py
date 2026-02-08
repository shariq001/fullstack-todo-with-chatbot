"""Database service module for connection management."""
from sqlmodel import Session
from typing import Generator
from ..models.base import engine
import logging


def get_db_session() -> Generator[Session, None, None]:
    """Dependency to get database session for FastAPI."""
    with Session(engine) as session:
        yield session


class DatabaseService:
    """Database service for connection management and operations."""

    def __init__(self):
        self.engine = engine

    def get_session(self) -> Generator[Session, None, None]:
        """Get a database session."""
        with Session(self.engine) as session:
            yield session

    def initialize_tables(self):
        """Initialize database tables."""
        from ..models.base import create_db_and_tables
        create_db_and_tables()

    def close_engine(self):
        """Close the database engine."""
        self.engine.dispose()


db_service = DatabaseService()
