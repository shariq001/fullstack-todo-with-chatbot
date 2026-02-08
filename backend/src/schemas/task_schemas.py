"""Pydantic schemas for task models."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskBase(BaseModel):
    """Base schema for task with common fields."""
    title: str
    description: Optional[str] = None
    is_completed: bool = False


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    title: str

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive documentation for the project",
                "is_completed": False
            }
        }


class TaskUpdate(TaskBase):
    """Schema for updating an existing task."""
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Updated task title",
                "description": "Updated task description",
                "is_completed": True
            }
        }


class TaskRead(TaskBase):
    """Schema for reading a task with additional fields."""
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Complete project documentation",
                "description": "Write comprehensive documentation for the project",
                "is_completed": False,
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z"
            }
        }


# Export all task schemas
__all__ = ["TaskCreate", "TaskRead", "TaskUpdate"]