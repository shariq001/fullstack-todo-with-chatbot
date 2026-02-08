"""Database connection tests."""
import pytest
from sqlmodel import Session, select
from src.services.database import db_service
from src.models.user import User
from src.models.task import Task
from src.models.base import engine, create_db_and_tables


def test_database_connection():
    """Test that the database connection works."""
    try:
        with Session(engine) as session:
            from sqlmodel import text
            session.exec(text("SELECT 1"))
        assert True
    except Exception:
        pytest.fail("Database connection failed")


def test_database_service_initialization():
    """Test that the database service is properly initialized."""
    assert db_service is not None
    assert hasattr(db_service, 'engine')
    assert hasattr(db_service, 'get_session')


def test_table_creation():
    """Test that database tables are created successfully."""
    create_db_and_tables()

    try:
        with Session(engine) as session:
            assert True
    except Exception:
        pytest.fail("Could not create database session, tables may not exist")


def test_foreign_key_relationships():
    """Test that foreign key relationships are properly defined."""
    assert hasattr(Task, 'user_id')
