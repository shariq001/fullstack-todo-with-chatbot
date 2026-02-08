"""
MCP Task Management Tools.

This module implements the 5 required task management tools for the MCP server:
- add_task: Create new tasks
- list_tasks: Retrieve user's tasks
- update_task: Modify task fields
- complete_task: Mark tasks as completed
- delete_task: Remove tasks permanently

All tools enforce user isolation via user_id validation and return
structured responses for the AI agent.
"""
import logging
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

from sqlmodel import Session, select

from ..models.task import Task
from ..models.user import User
from ..models.base import engine

from .helpers import (
    serialize_task,
    validate_user_exists,
    validate_title,
    get_task_by_id_and_user,
    get_tasks_for_user,
    validate_required_fields,
)
from .error_utils import (
    create_error_response,
    handle_database_error,
    handle_validation_error,
    handle_not_found_error,
    handle_access_denied_error,
)

logger = logging.getLogger(__name__)


def add_task(user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """
    Add a new task for the specified user. Use this when the user wants
    to create, add, or make a new todo item. Requires a title. Optionally
    accepts a description for additional details.
    """
    start_time = time.time()
    logger.info("add_task called: user_id=%s, title=%r", user_id, title)
    try:
        # Validate required fields
        if not validate_title(title):
            duration = time.time() - start_time
            logger.info("add_task validation failed after %.3fs: user_id=%s, title=%r", duration, user_id, title)
            return handle_validation_error("title", "cannot be empty")

        with Session(engine) as session:
            # Validate user exists
            if not validate_user_exists(session, user_id):
                duration = time.time() - start_time
                logger.info("add_task user validation failed after %.3fs: user_id=%s", duration, user_id)
                return handle_not_found_error("user")

            # Create new task
            task = Task(
                title=title,
                description=description,
                user_id=user_id,
                is_completed=False
            )

            session.add(task)
            session.commit()
            session.refresh(task)

            duration = time.time() - start_time
            logger.info("Task created: id=%s for user_id=%s (took %.3fs)", task.id, user_id, duration)
            return serialize_task(task)

    except Exception as e:
        duration = time.time() - start_time
        logger.error("add_task failed after %.3fs: user_id=%s, error=%s", duration, user_id, str(e))
        return handle_database_error(e)


def list_tasks(user_id: str) -> List[Dict[str, Any]]:
    """
    List all tasks for the specified user. Use this when the user wants
    to see, view, show, or check their todos. Returns all tasks ordered
    by creation date (newest first). Returns an empty list if no tasks
    exist.
    """
    start_time = time.time()
    logger.info("list_tasks called: user_id=%s", user_id)
    try:
        with Session(engine) as session:
            tasks = get_tasks_for_user(session, user_id)
            duration = time.time() - start_time
            logger.info("Listed %d tasks for user_id=%s (took %.3fs)", len(tasks), user_id, duration)
            return [serialize_task(task) for task in tasks]

    except Exception as e:
        duration = time.time() - start_time
        logger.error("list_tasks failed after %.3fs: user_id=%s, error=%s", duration, user_id, str(e))
        return handle_database_error(e)


def update_task(user_id: str, task_id: str, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Update an existing task's title or description. Use this when the
    user wants to rename, edit, change, or modify a task. At least one
    of title or description must be provided. Does not change completion
    status — use complete_task for that.
    """
    logger.info("update_task called: user_id=%s, task_id=%s", user_id, task_id)
    try:
        # At least one field to update must be provided
        if title is None and description is None:
            return create_error_response("Either title or description must be provided for update")

        with Session(engine) as session:
            # Get the task and validate ownership
            task = get_task_by_id_and_user(session, task_id, user_id)
            if not task:
                return handle_access_denied_error()

            # Update provided fields
            if title is not None:
                if not validate_title(title):
                    return handle_validation_error("title", "cannot be empty")
                task.title = title

            if description is not None:
                task.description = description

            # Set updated_at timestamp
            task.updated_at = datetime.now()

            session.add(task)
            session.commit()
            session.refresh(task)

            logger.info("Task updated: id=%s for user_id=%s", task_id, user_id)
            return serialize_task(task)

    except Exception as e:
        return handle_database_error(e)


def complete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Mark a task as completed. Use this when the user says they finished,
    completed, or are done with a task. This operation is idempotent —
    completing an already-completed task succeeds without error.
    """
    logger.info("complete_task called: user_id=%s, task_id=%s", user_id, task_id)
    try:
        with Session(engine) as session:
            # Get the task and validate ownership
            task = get_task_by_id_and_user(session, task_id, user_id)
            if not task:
                return handle_access_denied_error()

            # Update completion status and timestamp
            task.is_completed = True
            task.updated_at = datetime.now()

            session.add(task)
            session.commit()
            session.refresh(task)

            logger.info("Task completed: id=%s for user_id=%s", task_id, user_id)
            return serialize_task(task)

    except Exception as e:
        return handle_database_error(e)


def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Permanently delete a task. Use this when the user wants to remove,
    delete, or get rid of a task. This action cannot be undone. The task
    is permanently removed from the database.
    """
    logger.info("delete_task called: user_id=%s, task_id=%s", user_id, task_id)
    try:
        with Session(engine) as session:
            # Get the task and validate ownership
            task = get_task_by_id_and_user(session, task_id, user_id)
            if not task:
                return handle_access_denied_error()

            # Delete the task
            session.delete(task)
            session.commit()

            logger.info("Task deleted: id=%s for user_id=%s", task_id, user_id)
            return {
                "deleted": True,
                "task_id": task_id
            }

    except Exception as e:
        return handle_database_error(e)
