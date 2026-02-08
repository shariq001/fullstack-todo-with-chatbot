"""
Database helper functions for MCP tools.

This module provides utility functions for database operations
used by the MCP tools, including serialization and validation helpers.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional

from sqlmodel import Session, select
from ..models.task import Task
from ..models.user import User


def serialize_task(task: Task) -> Dict[str, Any]:
    """
    Serialize a Task model instance to a dictionary for MCP tool responses.

    Args:
        task: The Task model instance to serialize

    Returns:
        Dictionary representation of the task with proper field mappings
    """
    return {
        "id": str(task.id),
        "title": task.title,
        "description": task.description,
        "is_completed": task.is_completed,
        "user_id": str(task.user_id),
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
    }


def validate_user_exists(session: Session, user_id: str) -> bool:
    """
    Validate that a user exists in the database.

    Args:
        session: Database session
        user_id: The user ID to validate

    Returns:
        True if user exists, False otherwise
    """
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    return user is not None


def get_task_by_id_and_user(session: Session, task_id: str, user_id: str) -> Optional[Task]:
    """
    Get a task by its ID and ensure it belongs to the specified user.

    Args:
        session: Database session
        task_id: The task ID to look up
        user_id: The user ID to validate ownership

    Returns:
        The Task instance if found and owned by user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return session.exec(statement).first()


def get_tasks_for_user(session: Session, user_id: str) -> List[Task]:
    """
    Get all tasks for a specific user.

    Args:
        session: Database session
        user_id: The user ID to filter tasks

    Returns:
        List of Task instances belonging to the user, ordered by creation date (newest first)
    """
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    return session.exec(statement).all()


def validate_title(title: str) -> bool:
    """
    Validate that a title is not empty or just whitespace.

    Args:
        title: The title to validate

    Returns:
        True if title is valid, False otherwise
    """
    return title and title.strip() != ""


def validate_required_fields(**kwargs) -> Dict[str, bool]:
    """
    Validate required fields for MCP tool operations.

    Args:
        **kwargs: Field name-value pairs to validate

    Returns:
        Dictionary mapping field names to validation results
    """
    results = {}
    for field_name, value in kwargs.items():
        if value is None or (isinstance(value, str) and not value.strip()):
            results[field_name] = False
        else:
            results[field_name] = True
    return results
