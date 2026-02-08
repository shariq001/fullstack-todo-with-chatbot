"""Task model definition."""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Task(SQLModel, table=True):
    """Task model for the application."""

    id: str = Field(default_factory=generate_uuid, primary_key=True)
    title: str = Field(sa_column_kwargs={"nullable": False})
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    user_id: str = Field(foreign_key="user.id")
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default=None)