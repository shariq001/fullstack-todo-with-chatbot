"""Chat API route — POST /api/chat endpoint and GET for conversation history."""
import logging
import time

from fastapi import APIRouter, Header, HTTPException, Request, status, Query
from sqlmodel import Session, select

from ..auth import get_current_user_from_token
from ..schemas.chat_schemas import ChatRequest, ChatResponse
from ..services.agent_service import process_chat_message
from ..models.base import engine
from ..models.conversation import Conversation
from ..models.message import Message

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: Request,
    body: ChatRequest,
    authorization: str = Header(None),
):
    """Send a message to the AI Todo Assistant.

    Accepts a natural language message and optional conversation_id.
    The agent autonomously selects MCP tools based on user intent
    and returns a natural language response.
    """
    start_time = time.time()

    # Authenticate user
    current_user = get_current_user_from_token(authorization)
    user_id = current_user.id
    logger.info("Chat request received: user_id=%s, conversation_id=%s", user_id, body.conversation_id)

    # Validate message is non-empty
    if not body.message or not body.message.strip():
        logger.warning("Empty message rejected: user_id=%s", user_id)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty",
        )

    # Get agent from app state
    agent = request.app.state.agent

    # Process the message
    try:
        conversation_id, response_text = await process_chat_message(
            agent=agent,
            user_id=user_id,
            message=body.message.strip(),
            conversation_id=body.conversation_id,
        )
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        error_msg = str(e)

        # Handle database connection errors gracefully
        if "connection" in error_msg.lower() or "server closed" in error_msg.lower():
            logger.warning("Database connection error, retrying...")
            # Retry once
            try:
                conversation_id, response_text = await process_chat_message(
                    agent=agent,
                    user_id=user_id,
                    message=body.message.strip(),
                    conversation_id=body.conversation_id,
                )
            except Exception as retry_error:
                logger.error(f"Retry failed: {retry_error}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database service temporarily unavailable. Please try again.",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="I'm sorry, I encountered an error processing your request. Please try again.",
            )

    duration = time.time() - start_time
    logger.info("Chat response in %.3fs: conversation_id=%s", duration, conversation_id)

    return ChatResponse(
        conversation_id=conversation_id,
        response=response_text,
    )


@router.get("/chat")
async def load_conversation_history(
    conversation_id: str = Query(..., description="ID of conversation to load"),
    authorization: str = Header(None),
):
    """Load conversation history (all messages in a conversation).

    Args:
        conversation_id: ID of conversation to load
        authorization: JWT authorization header

    Returns:
        JSON with conversation metadata and messages list
    """
    # Authenticate user
    current_user = get_current_user_from_token(authorization)
    user_id = current_user.id
    logger.info("Load conversation request: user_id=%s, conversation_id=%s", user_id, conversation_id)

    # Get conversation from database
    with Session(engine) as session:
        # Verify conversation belongs to user
        conversation = session.exec(
            select(Conversation).where(Conversation.id == conversation_id)
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        if conversation.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this conversation"
            )

        # Get all messages for the conversation
        messages = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        ).all()

        return {
            "conversation_id": conversation.id,
            "createdAt": conversation.created_at.isoformat(),
            "lastMessageAt": max(
                (m.created_at for m in messages),
                default=conversation.created_at
            ).isoformat(),
            "messages": [
                {
                    "id": m.id,
                    "role": m.role,
                    "content": m.content,
                    "toolName": m.tool_name,
                    "toolResult": m.tool_result,
                    "createdAt": m.created_at.isoformat(),
                    "isLoading": False,
                }
                for m in messages
            ]
        }
