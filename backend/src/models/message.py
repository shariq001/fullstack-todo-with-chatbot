"""Message model definition."""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Message(SQLModel, table=True):
    """Message model — represents a single turn in a conversation.

    Roles:
      - "user": User's input message
      - "assistant": AI agent's response
      - "tool": Tool invocation result (includes tool_name and tool_result)
    """

    id: str = Field(default_factory=generate_uuid, primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", nullable=False, index=True)
    role: str = Field(nullable=False)
    content: str = Field(nullable=False)
    tool_name: Optional[str] = Field(default=None)
    tool_result: Optional[str] = Field(default=None)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
