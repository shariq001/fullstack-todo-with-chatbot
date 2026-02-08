"""Business logic for task operations with user isolation."""

from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from ..models.task import Task
from ..schemas.task_schemas import TaskCreate, TaskUpdate


def get_tasks_by_user_id(db_session: Session, user_id: str) -> List[Task]:
    """
    Get all tasks for a specific user with strict user_id filtering.

    Args:
        db_session: Database session
        user_id: The ID of the user whose tasks to retrieve

    Returns:
        List of tasks belonging to the specified user
    """
    statement = select(Task).where(Task.user_id == user_id)
    tasks = db_session.exec(statement).all()
    return tasks


def get_task_by_id_and_user(db_session: Session, task_id: str, user_id: str) -> Optional[Task]:
    """
    Get a specific task that belongs to a specific user.

    Args:
        db_session: Database session
        task_id: The ID of the task to retrieve
        user_id: The ID of the user who should own the task

    Returns:
        The task if it exists and belongs to the user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = db_session.exec(statement).first()
    return task


def create_task_for_user(db_session: Session, **kwargs) -> Task:
    """
    Create a new task for a specific user.

    Args:
        db_session: Database session
        **kwargs: Task properties including user_id

    Returns:
        The created task
    """
    # Ensure updated_at is set to current time when creating
    kwargs['updated_at'] = datetime.utcnow()

    task = Task(**kwargs)
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


def update_task_by_id_and_user(
    db_session: Session,
    task_id: str,
    user_id: str,
    **kwargs
) -> Optional[Task]:
    """
    Update a specific task that belongs to a specific user.

    Args:
        db_session: Database session
        task_id: The ID of the task to update
        user_id: The ID of the user who owns the task
        **kwargs: Task properties to update

    Returns:
        The updated task if it exists and belongs to the user, None otherwise
    """
    # Get the task to ensure it exists and belongs to the user
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = db_session.exec(statement).first()

    if not task:
        return None

    # Update the task properties
    for key, value in kwargs.items():
        setattr(task, key, value)

    # Update the updated_at timestamp
    task.updated_at = datetime.utcnow()

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


def delete_task_by_id_and_user(db_session: Session, task_id: str, user_id: str) -> bool:
    """
    Delete a specific task that belongs to a specific user.

    Args:
        db_session: Database session
        task_id: The ID of the task to delete
        user_id: The ID of the user who owns the task

    Returns:
        True if the task existed and was deleted, False otherwise
    """
    # Get the task to ensure it exists and belongs to the user
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = db_session.exec(statement).first()

    if not task:
        return False

    db_session.delete(task)
    db_session.commit()
    return True