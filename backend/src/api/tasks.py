"""Task API routes with authentication and data isolation."""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List
from datetime import datetime

from ..auth import get_current_user_from_token
from ..schemas.task_schemas import TaskCreate, TaskRead, TaskUpdate
from ..services.task_service import (
    get_tasks_by_user_id,
    get_task_by_id_and_user,
    create_task_for_user,
    update_task_by_id_and_user,
    delete_task_by_id_and_user
)
from ..services.database import get_db_session
from sqlmodel import Session

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=List[TaskRead])
async def get_tasks(
    authorization: str = Header(None),
    db_session: Session = Depends(get_db_session)
):
    """
    Retrieve all tasks belonging to the authenticated user.

    Args:
        authorization: The authorization header with Bearer token
        db_session: Database session

    Returns:
        List of tasks belonging to the authenticated user
    """
    current_user = get_current_user_from_token(authorization)
    tasks = get_tasks_by_user_id(db_session, current_user.id)
    return tasks


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: str,
    authorization: str = Header(None),
    db_session: Session = Depends(get_db_session)
):
    """
    Retrieve a specific task owned by the authenticated user.

    Args:
        task_id: The ID of the task to retrieve
        authorization: The authorization header with Bearer token
        db_session: Database session

    Returns:
        The task if it exists and belongs to the authenticated user

    Raises:
        HTTPException: 404 if task doesn't exist or doesn't belong to user
    """
    current_user = get_current_user_from_token(authorization)
    task = get_task_by_id_and_user(db_session, task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )
    return task


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    authorization: str = Header(None),
    db_session: Session = Depends(get_db_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        task_create: Task creation request data
        authorization: The authorization header with Bearer token
        db_session: Database session

    Returns:
        The created task

    Raises:
        HTTPException: 422 if validation fails
    """
    current_user = get_current_user_from_token(authorization)
    task_data = task_create.model_dump()
    task_data['user_id'] = current_user.id
    task_data['created_at'] = datetime.utcnow()

    created_task = create_task_for_user(db_session, **task_data)
    return created_task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    authorization: str = Header(None),
    db_session: Session = Depends(get_db_session)
):
    """
    Update an existing task owned by the authenticated user.

    Args:
        task_id: The ID of the task to update
        task_update: Task update request data
        authorization: The authorization header with Bearer token
        db_session: Database session

    Returns:
        The updated task if it exists and belongs to the authenticated user

    Raises:
        HTTPException: 404 if task doesn't exist or doesn't belong to user
        HTTPException: 422 if validation fails
    """
    # Get current user from token
    current_user = get_current_user_from_token(authorization)

    # Check if the task exists and belongs to the user
    existing_task = get_task_by_id_and_user(db_session, task_id, current_user.id)
    if not existing_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )

    # Prepare update data, excluding unset fields
    update_data = task_update.model_dump(exclude_unset=True)

    # Perform the update
    updated_task = update_task_by_id_and_user(
        db_session,
        task_id,
        current_user.id,
        **update_data
    )

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task could not be updated"
        )

    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    authorization: str = Header(None),
    db_session: Session = Depends(get_db_session)
):
    """
    Delete an existing task owned by the authenticated user.

    Args:
        task_id: The ID of the task to delete
        authorization: The authorization header with Bearer token
        db_session: Database session

    Returns:
        204 No Content on success

    Raises:
        HTTPException: 404 if task doesn't exist or doesn't belong to user
    """
    current_user = get_current_user_from_token(authorization)
    success = delete_task_by_id_and_user(db_session, task_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to authenticated user"
        )
    # Return 204 No Content as specified