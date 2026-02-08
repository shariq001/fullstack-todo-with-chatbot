"""
Unit tests for MCP task management tools.

This module tests all 5 MCP tools directly by importing and calling
the tool functions as plain Python functions, bypassing the MCP transport layer.
Tests use an in-memory SQLite database for isolation and speed.
"""
import pytest
from unittest.mock import patch
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from src.models.user import User
from src.models.task import Task
from src.mcp_tools.task_tools import (
    add_task,
    list_tasks,
    update_task,
    complete_task,
    delete_task,
)


# Create a test engine with in-memory SQLite
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture(scope="function")
def db_session():
    """Create a test database session with tables."""
    # Create tables
    SQLModel.metadata.create_all(test_engine)

    with Session(test_engine) as session:
        # Patch the engine used by task_tools so tools use test DB
        with patch("src.mcp_tools.task_tools.engine", test_engine):
            yield session

    # Drop tables after test
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture(scope="function")
def sample_user(db_session):
    """Create a sample user for testing."""
    user = User(
        email="test@example.com",
        name="Test User",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def sample_task(db_session, sample_user):
    """Create a sample task for testing."""
    task = Task(
        title="Test Task",
        description="Test Description",
        user_id=sample_user.id,
        is_completed=False
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


# ── US1: add_task ──────────────────────────────────────────────────

class TestAddTask:
    """Tests for the add_task MCP tool."""

    def test_add_task_success(self, db_session, sample_user):
        """Contract: add_task returns task dict on valid input."""
        result = add_task(
            user_id=str(sample_user.id),
            title="New Task",
            description="New Description"
        )

        assert "id" in result
        assert result["title"] == "New Task"
        assert result["description"] == "New Description"
        assert result["user_id"] == str(sample_user.id)
        assert result["is_completed"] is False

    def test_add_task_missing_title(self, db_session, sample_user):
        """Contract: add_task returns error for empty title."""
        result = add_task(
            user_id=str(sample_user.id),
            title="",
            description="Description"
        )

        assert "error" in result
        assert "Title is required" in result["error"]

    def test_add_task_nonexistent_user(self, db_session):
        """Contract: add_task returns error for invalid user_id."""
        result = add_task(
            user_id="nonexistent-user-id",
            title="New Task",
            description="Description"
        )

        assert "error" in result
        assert "not found" in result["error"].lower()

    def test_add_task_default_description(self, db_session, sample_user):
        """Integration: add_task with no description defaults to empty string."""
        result = add_task(
            user_id=str(sample_user.id),
            title="Task Without Description"
        )

        assert "id" in result
        assert result["title"] == "Task Without Description"
        assert result["description"] == ""


# ── US2: list_tasks ────────────────────────────────────────────────

class TestListTasks:
    """Tests for the list_tasks MCP tool."""

    def test_list_tasks_empty(self, db_session, sample_user):
        """Contract: list_tasks returns empty list for user with no tasks."""
        result = list_tasks(user_id=str(sample_user.id))

        assert isinstance(result, list)
        assert len(result) == 0

    def test_list_tasks_with_data(self, db_session, sample_user):
        """Contract: list_tasks returns all tasks, newest first."""
        add_task(str(sample_user.id), "Task 1", "First task")
        add_task(str(sample_user.id), "Task 2", "Second task")

        result = list_tasks(user_id=str(sample_user.id))

        assert isinstance(result, list)
        assert len(result) == 2
        # Newest first
        assert result[0]["title"] == "Task 2"
        assert result[1]["title"] == "Task 1"

    def test_list_tasks_user_isolation(self, db_session, sample_user):
        """Integration: list_tasks only returns tasks for the specified user."""
        # Create a second user
        other_user = User(email="other@example.com", name="Other", is_active=True)
        db_session.add(other_user)
        db_session.commit()
        db_session.refresh(other_user)

        # Seed tasks for both users
        add_task(str(sample_user.id), "My Task", "")
        add_task(str(other_user.id), "Their Task", "")

        my_tasks = list_tasks(str(sample_user.id))
        their_tasks = list_tasks(str(other_user.id))

        assert len(my_tasks) == 1
        assert my_tasks[0]["title"] == "My Task"
        assert len(their_tasks) == 1
        assert their_tasks[0]["title"] == "Their Task"

    def test_list_tasks_nonexistent_user(self, db_session):
        """Contract: list_tasks returns empty list for unknown user_id."""
        result = list_tasks(user_id="nonexistent-user-id")
        assert isinstance(result, list)
        assert len(result) == 0


# ── US3: update_task ───────────────────────────────────────────────

class TestUpdateTask:
    """Tests for the update_task MCP tool."""

    def test_update_task_title(self, db_session, sample_user, sample_task):
        """Contract: update_task changes title and returns updated dict."""
        result = update_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id),
            title="Updated Title"
        )

        assert result["id"] == str(sample_task.id)
        assert result["title"] == "Updated Title"
        assert result["description"] == sample_task.description

    def test_update_task_description(self, db_session, sample_user, sample_task):
        """Contract: update_task changes description."""
        result = update_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id),
            description="Updated Description"
        )

        assert result["id"] == str(sample_task.id)
        assert result["description"] == "Updated Description"

    def test_update_task_both_fields(self, db_session, sample_user, sample_task):
        """Contract: update_task changes both title and description."""
        result = update_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id),
            title="Updated Title",
            description="Updated Description"
        )

        assert result["id"] == str(sample_task.id)
        assert result["title"] == "Updated Title"
        assert result["description"] == "Updated Description"

    def test_update_task_sets_updated_at(self, db_session, sample_user, sample_task):
        """Integration: update_task sets updated_at timestamp."""
        result = update_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id),
            title="Changed"
        )

        assert result["updated_at"] is not None

    def test_update_task_wrong_user(self, db_session, sample_user):
        """Contract: update_task returns 'not found' for wrong user (security)."""
        other_user = User(email="other@example.com", name="Other User", is_active=True)
        db_session.add(other_user)
        db_session.commit()

        other_task_result = add_task(str(other_user.id), "Other Task", "Other Description")
        other_task_id = other_task_result["id"]

        result = update_task(
            user_id=str(sample_user.id),
            task_id=other_task_id,
            title="Hacked Title"
        )

        assert "error" in result
        assert "not found" in result["error"].lower()

    def test_update_task_invalid_title(self, db_session, sample_user, sample_task):
        """Contract: update_task rejects empty title."""
        result = update_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id),
            title=""
        )

        assert "error" in result
        assert "Title is required" in result["error"]

    def test_update_task_no_fields(self, db_session, sample_user, sample_task):
        """Contract: update_task returns error when no fields provided."""
        result = update_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id)
        )

        assert "error" in result


# ── US4: complete_task ─────────────────────────────────────────────

class TestCompleteTask:
    """Tests for the complete_task MCP tool."""

    def test_complete_task_success(self, db_session, sample_user, sample_task):
        """Contract: complete_task sets is_completed to True."""
        result = complete_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id)
        )

        assert result["id"] == str(sample_task.id)
        assert result["is_completed"] is True

    def test_complete_task_sets_updated_at(self, db_session, sample_user, sample_task):
        """Integration: complete_task sets updated_at timestamp."""
        result = complete_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id)
        )

        assert result["updated_at"] is not None

    def test_complete_already_completed_task(self, db_session, sample_user, sample_task):
        """Contract: completing already-completed task is idempotent."""
        complete_task(str(sample_user.id), str(sample_task.id))
        result = complete_task(str(sample_user.id), str(sample_task.id))

        assert result["id"] == str(sample_task.id)
        assert result["is_completed"] is True

    def test_complete_task_wrong_user(self, db_session, sample_user):
        """Contract: complete_task returns 'not found' for wrong user."""
        other_user = User(email="other@example.com", name="Other User", is_active=True)
        db_session.add(other_user)
        db_session.commit()

        other_task_result = add_task(str(other_user.id), "Other Task", "Other Description")
        other_task_id = other_task_result["id"]

        result = complete_task(
            user_id=str(sample_user.id),
            task_id=other_task_id
        )

        assert "error" in result
        assert "not found" in result["error"].lower()

    def test_complete_task_nonexistent(self, db_session, sample_user):
        """Contract: complete_task returns error for bad task_id."""
        result = complete_task(
            user_id=str(sample_user.id),
            task_id="nonexistent-id"
        )

        assert "error" in result
        assert "not found" in result["error"].lower()


# ── US5: delete_task ───────────────────────────────────────────────

class TestDeleteTask:
    """Tests for the delete_task MCP tool."""

    def test_delete_task_success(self, db_session, sample_user, sample_task):
        """Contract: delete_task returns confirmation and removes task."""
        result = delete_task(
            user_id=str(sample_user.id),
            task_id=str(sample_task.id)
        )

        assert result["deleted"] is True
        assert result["task_id"] == str(sample_task.id)

        # Verify task is gone
        list_result = list_tasks(str(sample_user.id))
        assert len(list_result) == 0

    def test_delete_task_wrong_user(self, db_session, sample_user):
        """Contract: delete_task returns 'not found' for wrong user."""
        other_user = User(email="other@example.com", name="Other User", is_active=True)
        db_session.add(other_user)
        db_session.commit()

        other_task_result = add_task(str(other_user.id), "Other Task", "Other Description")
        other_task_id = other_task_result["id"]

        result = delete_task(
            user_id=str(sample_user.id),
            task_id=other_task_id
        )

        assert "error" in result
        assert "not found" in result["error"].lower()

        # Original task should still exist
        other_user_tasks = list_tasks(str(other_user.id))
        assert len(other_user_tasks) == 1

    def test_delete_task_nonexistent(self, db_session, sample_user):
        """Contract: delete_task returns error for bad task_id."""
        result = delete_task(
            user_id=str(sample_user.id),
            task_id="nonexistent-id"
        )

        assert "error" in result
        assert "not found" in result["error"].lower()
