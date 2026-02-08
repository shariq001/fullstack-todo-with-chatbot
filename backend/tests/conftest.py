"""Pytest configuration file."""
import pytest
from sqlmodel import create_engine
import sys
import os

# Add the src directory to the path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.models.base import engine


@pytest.fixture(scope="session")
def db_engine():
    """Create a test database engine."""
    yield engine


@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a test database session."""
    connection = db_engine.connect()
    transaction = connection.begin()

    # Yield the session
    yield connection

    # Rollback the transaction after the test
    transaction.rollback()
    connection.close()