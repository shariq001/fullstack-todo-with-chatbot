"""Chat API route — POST /api/chat endpoint."""
import logging
import time

from fastapi import APIRouter, Header, HTTPException, Request, status

from ..auth import get_current_user_from_token
from ..schemas.chat_schemas import ChatRequest, ChatResponse
from ..services.agent_service import process_chat_message

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
    except Exception:
        logger.exception("Unexpected error in chat endpoint")
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
