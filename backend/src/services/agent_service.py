"""Agent orchestration service - Gemini API integration with mock fallback. V2.0"""
import logging
import os
import time
from datetime import datetime
from typing import Optional, Tuple
from sqlmodel import Session, select

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

from ..models.base import engine
from ..models.conversation import Conversation
from ..models.message import Message
from ..models.user import User

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = "You are a helpful Todo Assistant. You manage tasks using simple logic."
GEMINI_MODEL = "gemini-2.0-flash"
MAX_HISTORY_MESSAGES = 50

# Global agent reference
_gemini_agent = None
_use_mock_mode = False


def init_gemini_client() -> None:
    """Initialize Gemini API client or fall back to mock mode."""
    global _use_mock_mode

    logger.info(">>> AGENT_SERVICE V2.0 INIT STARTING")

    api_key = os.getenv("GOOGLE_API_KEY", "").strip()

    if not api_key:
        logger.warning("⚠ GOOGLE_API_KEY not found in environment. Using MOCK MODE")
        _use_mock_mode = True
        logger.info("✓ MOCK MODE: Agent ready (no API key provided)")
        return

    if not GEMINI_AVAILABLE:
        logger.warning("⚠ google.generativeai not installed. Using MOCK MODE")
        _use_mock_mode = True
        logger.info("✓ MOCK MODE: Agent ready (library not available)")
        return

    try:
        genai.configure(api_key=api_key)
        _use_mock_mode = False
        logger.info(">>> GEMINI API CLIENT CONFIGURED - REAL MODE ENABLED")
        logger.info("✓ Gemini API client initialized successfully")
    except Exception as e:
        logger.error(f"✗ Failed to initialize Gemini API: {e}. Falling back to MOCK MODE")
        _use_mock_mode = True
        logger.info("✓ MOCK MODE: Agent ready (initialization failed)")


def create_agent() -> dict:
    """Create a Gemini agent or return mock agent."""
    logger.info(f">>> CREATE_AGENT: _use_mock_mode = {_use_mock_mode}")

    if _use_mock_mode:
        logger.info("✓ MOCK MODE: Chat agent created")
        return {"type": "mock_agent", "model": "mock"}

    try:
        logger.info(f">>> CREATING GEMINI AGENT WITH MODEL: {GEMINI_MODEL}")
        client = genai.GenerativeModel(GEMINI_MODEL)
        logger.info("✓ Gemini Chat agent created")
        return {
            "type": "gemini_agent",
            "model": GEMINI_MODEL,
            "client": client
        }
    except Exception as e:
        logger.error(f"✗ Failed to create Gemini agent: {e}. Using MOCK MODE")
        return {"type": "mock_agent", "model": "mock"}


def load_conversation_history(conversation_id: str, limit: int = MAX_HISTORY_MESSAGES) -> list:
    """Load conversation history from database."""
    with Session(engine) as session:
        messages = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
            .limit(limit)
        ).all()
        return [
            {
                "role": m.role,
                "content": m.content,
                "tool_name": m.tool_name,
                "tool_result": m.tool_result,
            }
            for m in messages
        ]


def generate_gemini_response(message: str, history: list) -> str:
    """Generate response using real Gemini API."""
    logger.info(">>> GENERATE_GEMINI_RESPONSE CALLED")
    try:
        agent = create_agent()
        logger.info(f">>> Agent type: {agent['type']}")

        if agent["type"] != "gemini_agent":
            logger.warning(">>> NOT A GEMINI AGENT, RETURNING MOCK")
            return generate_mock_response(message, "")

        client = agent["client"]
        logger.info(">>> SENDING MESSAGE TO GEMINI")

        # Build conversation history for context
        chat = client.start_chat(history=[
            {"role": m["role"], "parts": m["content"]}
            for m in history if m.get("role") in ["user", "assistant"]
        ])

        # Send message and get response
        response = chat.send_message(message)
        logger.info(">>> GEMINI RESPONSE RECEIVED")
        return response.text
    except Exception as e:
        logger.error(f"✗✗✗ GEMINI API ERROR: {type(e).__name__}: {e}. FALLING BACK TO MOCK")
        import traceback
        logger.error(traceback.format_exc())
        return generate_mock_response(message, "")


def generate_mock_response(message: str, user_id: str) -> str:
    """Generate a mock response based on user message."""
    msg_lower = message.lower()

    # Task-related responses
    if any(word in msg_lower for word in ["add", "create", "new", "make"]):
        return (
            "I'd love to help you add a task! Please describe what task you'd like to create, "
            "and I'll help you manage it through the dashboard."
        )
    elif any(word in msg_lower for word in ["list", "show", "get", "all", "tasks"]):
        return (
            "I can help you view your tasks. You can see all your tasks organized by status "
            "in the dashboard interface. Would you like me to help you with anything specific?"
        )
    elif any(word in msg_lower for word in ["complete", "done", "finish", "mark"]):
        return (
            "I can help mark tasks as complete! Tell me which task you'd like to mark as done, "
            "and you can update it in the dashboard."
        )
    elif any(word in msg_lower for word in ["delete", "remove"]):
        return (
            "I can help you delete tasks. Let me know which task you'd like to remove, "
            "and you can manage this from the dashboard."
        )
    else:
        return (
            "Hello! I'm your Todo AI Assistant. I can help you manage your tasks using natural language. "
            "Feel free to ask me to add, list, complete, or delete tasks. How can I help you today?"
        )


async def process_chat_message(
    agent: dict,
    user_id: str,
    message: str,
    conversation_id: Optional[str] = None,
) -> Tuple[str, str]:
    """Process a chat message and return response."""
    start_time = time.time()
    logger.info("Chat: user=%s, msg='%s'", user_id, message[:50])

    with Session(engine) as session:
        # Ensure user exists
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            user = User(id=user_id, email=f"{user_id}@local", is_active=True)
            session.add(user)
            session.commit()
            logger.info("Auto-created user: %s", user_id)

        # Handle conversation
        if conversation_id:
            conversation = session.exec(
                select(Conversation).where(
                    Conversation.id == conversation_id,
                    Conversation.user_id == user_id,
                )
            ).first()
            if not conversation:
                raise ValueError("Conversation not found")
        else:
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
            conversation_id = conversation.id
            logger.info("New conversation: %s", conversation_id)

        # Save user message
        user_msg = Message(
            id=__import__('uuid').uuid4().__str__(),
            conversation_id=conversation_id,
            role="user",
            content=message,
        )
        session.add(user_msg)
        session.commit()

        # Load conversation history
        history = load_conversation_history(conversation_id)

        # Generate response (try real Gemini, fallback to mock)
        if _use_mock_mode:
            response_text = generate_mock_response(message, user_id)
        else:
            response_text = generate_gemini_response(message, history)

        # Save assistant message
        assistant_msg = Message(
            id=__import__('uuid').uuid4().__str__(),
            conversation_id=conversation_id,
            role="assistant",
            content=response_text,
        )
        session.add(assistant_msg)
        session.commit()

        # Update conversation
        conversation.updated_at = datetime.now()
        session.add(conversation)
        session.commit()

    duration = time.time() - start_time
    logger.info("Response in %.2fs", duration)
    return conversation_id, response_text
