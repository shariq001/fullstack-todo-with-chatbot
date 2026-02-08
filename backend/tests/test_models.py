"""Model validation tests."""
import pytest
from src.models.user import User
from src.models.task import Task
from datetime import datetime


def test_user_model_creation():
    """Test User model creation with valid data."""
    user = User(email="test@example.com", hashed_password="")
    assert user.email == "test@example.com"
    assert isinstance(user, User)


def test_task_model_creation():
    """Test Task model creation with valid data."""
    user_id = "some-user-id"
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "is_completed": False,
        "user_id": user_id
    }

    task = Task(**task_data)
    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.is_completed is False
    assert task.user_id == user_id


def test_user_default_values():
    """Test User model default values."""
    user = User(email="test@example.com", hashed_password="")

    assert user.id is not None
    assert isinstance(user.id, str)
    assert user.created_at is not None
    assert isinstance(user.created_at, datetime)


def test_task_default_values():
    """Test Task model default values."""
    user_id = "some-user-id"
    task = Task(title="Test Task", user_id=user_id)

    assert task.id is not None
    assert isinstance(task.id, str)
    assert task.is_completed is False
    assert task.description is None
    assert task.created_at is not None
    assert isinstance(task.created_at, datetime)


def test_task_completeness():
    """Test that the task model is properly completed."""
    user_id = "some-user-id"
    task = Task(
        title="Complete Task",
        description="Task with description",
        is_completed=True,
        user_id=user_id
    )

    assert task.title == "Complete Task"
    assert task.description == "Task with description"
    assert task.is_completed is True
    assert task.user_id == user_id
