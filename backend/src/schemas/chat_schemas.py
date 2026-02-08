"""Pydantic schemas for chat API."""
from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """Request schema for POST /api/chat."""
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response schema for POST /api/chat."""
    conversation_id: str
    response: str
