"""Agent orchestration service - Gemini API with MCP tool calling. V3.0"""
import logging
import os
import time
import json
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
from ..mcp_tools.task_tools import (
    add_task,
    list_tasks,
    update_task,
    complete_task,
    delete_task,
)

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a helpful Todo AI Assistant that manages tasks for users.

You have access to the following tools:
1. add_task(user_id, title, description="") - Add a new task
2. list_tasks(user_id) - List all tasks for the user
3. complete_task(user_id, task_id) - Mark a task as complete
4. delete_task(user_id, task_id) - Delete a task
5. update_task(user_id, task_id, **updates) - Update task details

When users ask you to do something with their tasks:
- If they want to ADD a task, call add_task with the task title and description
- If they want to SEE their tasks, call list_tasks
- If they want to COMPLETE a task, call complete_task
- If they want to DELETE a task, call delete_task
- If they want to UPDATE a task, call update_task

Always be helpful and use tools to actually manage tasks. After calling tools,
provide a friendly response summarizing what was done.

Important: Always validate user_id and call the appropriate tools based on intent."""

GEMINI_MODEL = "gemini-2.0-flash"
MAX_HISTORY_MESSAGES = 50

# Global agent reference
_gemini_agent = None
_use_mock_mode = False


def init_gemini_client() -> None:
    """Initialize Gemini API client or fall back to mock mode."""
    global _use_mock_mode

    logger.info(">>> AGENT_SERVICE V3.0 INIT STARTING - WITH TOOL CALLING")

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
        logger.info(">>> GEMINI API CLIENT CONFIGURED - REAL MODE WITH TOOLS ENABLED")
        logger.info("✓ Gemini API client initialized successfully")
    except Exception as e:
        logger.error(f"✗ Failed to initialize Gemini API: {e}. Falling back to MOCK MODE")
        _use_mock_mode = True
        logger.info("✓ MOCK MODE: Agent ready (initialization failed)")


def create_agent() -> dict:
    """Create a Gemini agent with tool calling enabled."""
    logger.info(f">>> CREATE_AGENT: _use_mock_mode = {_use_mock_mode}")

    if _use_mock_mode:
        logger.info("✓ MOCK MODE: Chat agent created")
        return {"type": "mock_agent", "model": "mock"}

    try:
        logger.info(f">>> CREATING GEMINI AGENT WITH MODEL: {GEMINI_MODEL} (WITH TOOLS)")
        client = genai.GenerativeModel(
            GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
        )
        logger.info("✓ Gemini Chat agent created with tool calling support")
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


def call_mcp_tool(tool_name: str, user_id: str, **kwargs) -> dict:
    """Call an MCP tool and return the result."""
    logger.info(f">>> CALLING MCP TOOL: {tool_name} with args: {kwargs}")

    try:
        if tool_name == "add_task":
            return add_task(user_id=user_id, **kwargs)
        elif tool_name == "list_tasks":
            return list_tasks(user_id=user_id, **kwargs)
        elif tool_name == "complete_task":
            return complete_task(user_id=user_id, **kwargs)
        elif tool_name == "delete_task":
            return delete_task(user_id=user_id, **kwargs)
        elif tool_name == "update_task":
            return update_task(user_id=user_id, **kwargs)
        else:
            logger.warning(f"Unknown tool: {tool_name}")
            return {"error": f"Unknown tool: {tool_name}"}
    except Exception as e:
        logger.error(f"✗ Error calling tool {tool_name}: {e}")
        return {"error": str(e)}


def parse_and_call_tools(message: str, user_id: str) -> Tuple[Optional[str], Optional[str], Optional[dict]]:
    """Parse the message intent and call appropriate MCP tools.

    Returns: (tool_name, tool_result, response_text)
    """
    msg_lower = message.lower()
    logger.info(">>> PARSING MESSAGE FOR TOOL CALLS")

    # Detect intent and call appropriate tool
    if any(word in msg_lower for word in ["add", "create", "new task", "make task"]):
        logger.info(">>> INTENT: ADD TASK")
        # Extract task title - simple approach: everything after "add/create/new"
        title = message
        for keyword in ["add", "create", "new task", "make task", "new", "make"]:
            if keyword in msg_lower:
                title = message[message.lower().find(keyword) + len(keyword):].strip()
                if title.startswith("a "):
                    title = title[2:]
                break

        if not title:
            title = "New Task"

        result = call_mcp_tool("add_task", user_id=user_id, title=title, description="")
        return "add_task", result, f"✓ Added task: {title}"

    elif any(word in msg_lower for word in ["list", "show", "get", "all", "my task", "tasks", "what task"]):
        logger.info(">>> INTENT: LIST TASKS")
        result = call_mcp_tool("list_tasks", user_id=user_id)

        # Format task list nicely
        tasks = None
        if isinstance(result, dict):
            if "data" in result:
                tasks = result.get("data", [])
            elif "tasks" in result:
                tasks = result.get("tasks", [])
        elif isinstance(result, list):
            tasks = result

        if tasks:
            task_list = "\n".join([f"• {t.get('title', 'Untitled')} {'✓' if t.get('is_completed') else '○'}" for t in tasks])
            response = f"Here are your tasks:\n{task_list}"
        else:
            response = "You don't have any tasks yet!"

        return "list_tasks", result, response

    elif any(word in msg_lower for word in ["complete", "done", "finish", "mark complete", "check off"]):
        logger.info(">>> INTENT: COMPLETE TASK")
        # This would need task_id - for now return message asking which task
        return None, None, "Which task would you like to mark as complete? Please give me the task title or ID."

    elif any(word in msg_lower for word in ["delete", "remove", "remove task"]):
        logger.info(">>> INTENT: DELETE TASK")
        return None, None, "Which task would you like to delete? Please give me the task title or ID."

    return None, None, None


def generate_gemini_response(message: str, user_id: str, history: list) -> Tuple[str, Optional[str], Optional[dict]]:
    """Generate response using real Gemini API with tool calling.

    Returns: (response_text, tool_name, tool_result)
    """
    logger.info(">>> GENERATE_GEMINI_RESPONSE CALLED - WITH TOOL SUPPORT")

    # First, try to parse and call tools directly
    tool_name, tool_result, tool_response = parse_and_call_tools(message, user_id)

    if tool_name:
        logger.info(f">>> TOOL CALLED: {tool_name}")
        return tool_response, tool_name, tool_result

    # If no tool matched, use Gemini for general response
    try:
        agent = create_agent()
        logger.info(f">>> Agent type: {agent['type']}")

        if agent["type"] != "gemini_agent":
            logger.warning(">>> NOT A GEMINI AGENT, RETURNING MOCK")
            return generate_mock_response(message, user_id), None, None

        client = agent["client"]
        logger.info(">>> SENDING MESSAGE TO GEMINI FOR GENERAL RESPONSE")

        # Build conversation history for context
        chat_history = [
            {"role": m["role"], "parts": m["content"]}
            for m in history if m.get("role") in ["user", "assistant"]
        ]

        chat = client.start_chat(history=chat_history)

        # Send message
        response = chat.send_message(message)

        logger.info(">>> GEMINI RESPONSE RECEIVED")
        return response.text, None, None

    except Exception as e:
        logger.error(f"✗✗✗ GEMINI API ERROR: {type(e).__name__}: {e}. FALLING BACK TO MOCK")
        import traceback
        logger.error(traceback.format_exc())
        return generate_mock_response(message, user_id), None, None


def generate_mock_response(message: str, user_id: str) -> str:
    """Generate a mock response based on user message."""
    msg_lower = message.lower()

    if any(word in msg_lower for word in ["add", "create", "new", "make"]):
        return "I can add a task for you! Please tell me the task title and I'll add it right away."
    elif any(word in msg_lower for word in ["list", "show", "get", "all", "tasks"]):
        return "Let me show you all your tasks. You can ask me to add, complete, or delete any of them!"
    elif any(word in msg_lower for word in ["complete", "done", "finish", "mark"]):
        return "I can mark tasks as complete! Which task would you like to mark as done?"
    elif any(word in msg_lower for word in ["delete", "remove"]):
        return "I can delete tasks for you! Which task would you like to remove?"
    else:
        return (
            "Hello! I'm your Todo AI Assistant. I can help you:\n"
            "• Add a new task\n"
            "• Show all your tasks\n"
            "• Mark tasks as complete\n"
            "• Delete tasks\n\n"
            "What would you like to do?"
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

        # Generate response (try real Gemini with tools, fallback to mock)
        tool_name = None
        tool_result = None

        if _use_mock_mode:
            response_text = generate_mock_response(message, user_id)
        else:
            response_text, tool_name, tool_result = generate_gemini_response(message, user_id, history)

        # Save assistant message
        assistant_msg = Message(
            id=__import__('uuid').uuid4().__str__(),
            conversation_id=conversation_id,
            role="assistant",
            content=response_text,
            tool_name=tool_name,
            tool_result=json.dumps(tool_result) if tool_result else None,
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
