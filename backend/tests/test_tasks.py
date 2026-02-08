"""Tests for task endpoints with authentication and data isolation."""

import pytest
import sys
import os
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from unittest.mock import patch, MagicMock
from uuid import uuid4

# Add the src directory to the path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.main import app
from src.models.task import Task
from src.models.user import User
from src.models.base import engine, create_db_and_tables
from src.auth import TokenData


@pytest.fixture
def client():
    """Create a test client for the API."""
    create_db_and_tables()
    with TestClient(app) as c:
        yield c


@pytest.fixture
def mock_user_id():
    return str(uuid4())


def make_mock_user(user_id: str, email: str = "test@example.com"):
    """Create a mock User object."""
    user = MagicMock()
    user.id = user_id
    user.email = email
    return user


def test_unauthorized_access(client):
    """Test that unauthorized access is prevented."""
    response = client.get("/tasks/")
    assert response.status_code == 401

    response = client.post("/tasks/", json={"title": "Test"})
    assert response.status_code == 401

    response = client.get("/tasks/some-id")
    assert response.status_code == 401

    response = client.put("/tasks/some-id", json={"title": "Updated"})
    assert response.status_code == 401

    response = client.delete("/tasks/some-id")
    assert response.status_code == 401


def test_create_task_success(client, mock_user_id):
    """Test creating a task successfully."""
    mock_user = make_mock_user(mock_user_id)

    with patch('src.api.tasks.get_current_user_from_token', return_value=mock_user):
        task_data = {
            "title": "Test Task",
            "description": "This is a test task",
            "is_completed": False
        }

        response = client.post(
            "/tasks/",
            json=task_data,
            headers={"Authorization": "Bearer fake-token"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["description"] == "This is a test task"
        assert data["user_id"] == mock_user_id
        assert "id" in data

        # Clean up
        with Session(engine) as session:
            task = session.exec(select(Task).where(Task.id == data["id"])).first()
            if task:
                session.delete(task)
                session.commit()


def test_get_tasks(client, mock_user_id):
    """Test getting tasks for authenticated user."""
    mock_user = make_mock_user(mock_user_id)

    with patch('src.api.tasks.get_current_user_from_token', return_value=mock_user):
        # Create a task first
        create_resp = client.post(
            "/tasks/",
            json={"title": "Task to Get", "is_completed": False},
            headers={"Authorization": "Bearer fake-token"}
        )
        assert create_resp.status_code == 201
        created_id = create_resp.json()["id"]

        # Get all tasks
        response = client.get(
            "/tasks/",
            headers={"Authorization": "Bearer fake-token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert any(t["id"] == created_id for t in data)

        # Clean up
        with Session(engine) as session:
            task = session.exec(select(Task).where(Task.id == created_id)).first()
            if task:
                session.delete(task)
                session.commit()


def test_data_isolation(client):
    """Test that users cannot access tasks belonging to other users."""
    user1_id = str(uuid4())
    user2_id = str(uuid4())

    mock_user1 = make_mock_user(user1_id)
    mock_user2 = make_mock_user(user2_id, "user2@example.com")

    # Create a task as user1
    with patch('src.api.tasks.get_current_user_from_token', return_value=mock_user1):
        create_resp = client.post(
            "/tasks/",
            json={"title": "User1 Task", "is_completed": False},
            headers={"Authorization": "Bearer fake-token"}
        )
        assert create_resp.status_code == 201
        task_id = create_resp.json()["id"]

    # Try to access as user2
    with patch('src.api.tasks.get_current_user_from_token', return_value=mock_user2):
        response = client.get(
            f"/tasks/{task_id}",
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == 404

    # Clean up
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id)).first()
        if task:
            session.delete(task)
            session.commit()
