"""Dependency management for API endpoints."""
from ..services.database import get_db_session

__all__ = ["get_db_session"]
