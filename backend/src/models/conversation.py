"""Conversation model definition."""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Conversation(SQLModel, table=True):
    """Conversation model — represents a chat session between a user and the AI assistant."""

    id: str = Field(default_factory=generate_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False, index=True)
    title: Optional[str] = Field(default=None)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default=None)
