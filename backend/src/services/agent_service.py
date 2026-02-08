"""Agent orchestration service for the Todo AI Chatbot.

Handles Gemini API client lifecycle, agent creation, conversation management,
and message persistence. All operations are stateless — context is
loaded from the database on each request.

Uses Google Generative AI (Gemini) for agent orchestration instead of
OpenAI Agents SDK. MCP tools remain the same and are passed as Gemini tools.
"""
import json
import logging
import os
import time
from datetime import datetime
from typing import Optional, Tuple, Any
import re

import google.generativeai as genai
from sqlmodel import Session, select

from ..models.base import engine
from ..models.conversation import Conversation
from ..models.message import Message

logger = logging.getLogger(__name__)

# System prompt for the Todo Assistant agent (from research.md R4)
SYSTEM_PROMPT = (
    "You are a helpful Todo Assistant. You manage tasks using the provided "
    "tools. When a user asks you to add, list, update, complete, or delete "
    "tasks, use the appropriate tool. Always respond in natural language. "
    "If the user's message doesn't relate to task management, respond "
    "conversationally. Never expose raw tool outputs or error details to "
    "the user — always translate them into friendly language."
)

# Maximum number of messages to load for context (from research.md R3)
MAX_HISTORY_MESSAGES = 50

# Gemini model configuration
GEMINI_MODEL = "gemini-2.0-flash"


def init_gemini_client() -> None:
    """Initialize Gemini API client with API key from environment.

    Raises:
        ValueError: If GOOGLE_API_KEY is not set in environment.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY environment variable not set. "
            "Get a free API key from https://aistudio.google.com/app/apikeys"
        )
    genai.configure(api_key=api_key)
    logger.info("Gemini API client initialized with model: %s", GEMINI_MODEL)


def get_mcp_tools_schema() -> list:
    """Get the MCP tools schema for Gemini.

    Returns a list of tool definitions in Gemini's tool schema format.
    These tools are the 5 task management tools exposed by the MCP server.
    """
    return [
        {
            "name": "add_task",
            "description": (
                "Add a new task for the user. Use when the user wants to create, "
                "add, or make a new todo item. Requires a title; optionally accepts "
                "a description."
            ),
            "input_schema": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID (automatically provided)"
                    },
                    "title": {
                        "type": "string",
                        "description": "Task title (required)"
                    },
                    "description": {
                        "type": "string",
                        "description": "Task description (optional)"
                    }
                },
                "required": ["user_id", "title"]
            }
        },
        {
            "name": "list_tasks",
            "description": (
                "List all tasks for the user. Use when the user wants to see, view, "
                "show, or check their todos. Returns all tasks ordered by creation "
                "date (newest first)."
            ),
            "input_schema": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID (automatically provided)"
                    }
                },
                "required": ["user_id"]
            }
        },
        {
            "name": "update_task",
            "description": (
                "Update an existing task's title or description. Use when the user "
                "wants to rename, edit, change, or modify a task. At least one of "
                "title or description must be provided."
            ),
            "input_schema": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID (automatically provided)"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "The task ID to update"
                    },
                    "title": {
                        "type": "string",
                        "description": "New task title (optional)"
                    },
                    "description": {
                        "type": "string",
                        "description": "New task description (optional)"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        },
        {
            "name": "complete_task",
            "description": (
                "Mark a task as completed. Use when the user says they finished, "
                "completed, or are done with a task. This operation is idempotent."
            ),
            "input_schema": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID (automatically provided)"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "The task ID to complete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        },
        {
            "name": "delete_task",
            "description": (
                "Permanently delete a task. Use when the user wants to remove, delete, "
                "or get rid of a task. This action cannot be undone."
            ),
            "input_schema": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID (automatically provided)"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "The task ID to delete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        }
    ]


def create_agent() -> Any:
    """Create a Gemini model instance configured with system prompt and tools.

    Returns:
        A configured GenerativeModel instance ready for chat.

    Note:
        The model itself doesn't execute tools; tool execution happens
        in process_chat_message() via the MCP server.
    """
    # Initialize Gemini client if not already done
    try:
        genai.get_model(GEMINI_MODEL)
    except:
        init_gemini_client()

    # Create and return the Gemini model with system instruction
    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        system_instruction=SYSTEM_PROMPT,
    )
    logger.info("Gemini agent created with model: %s", GEMINI_MODEL)
    return model


def load_conversation_history(conversation_id: str, limit: int = MAX_HISTORY_MESSAGES) -> list:
    """Load the most recent messages from a conversation.

    Args:
        conversation_id: The conversation to load history for.
        limit: Maximum number of messages to return (default 50).

    Returns:
        List of message dicts ordered by created_at ASC (oldest first).
    """
    with Session(engine) as session:
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        messages = session.exec(statement).all()
        return [
            {
                "role": msg.role if msg.role != "tool" else "assistant",
                "content": msg.content,
            }
            for msg in messages
        ]


async def execute_mcp_tool(tool_name: str, tool_args: dict, user_id: str) -> Any:
    """Execute an MCP tool and return the result.

    This function is a placeholder that will be implemented in the real MCP integration.
    For now, it delegates to the actual MCP tool implementations from task_tools.py.

    Args:
        tool_name: Name of the tool (e.g., "add_task", "list_tasks")
        tool_args: Tool arguments dict
        user_id: User ID (injected automatically)

    Returns:
        Tool execution result
    """
    # Import tool functions
    from ..mcp_tools.task_tools import (
        add_task,
        list_tasks,
        update_task,
        complete_task,
        delete_task,
    )

    # Map tool names to functions
    tools_map = {
        "add_task": add_task,
        "list_tasks": list_tasks,
        "update_task": update_task,
        "complete_task": complete_task,
        "delete_task": delete_task,
    }

    tool_func = tools_map.get(tool_name)
    if not tool_func:
        raise ValueError(f"Unknown tool: {tool_name}")

    # Inject user_id into args
    args_with_user = {"user_id": user_id, **tool_args}

    # Execute the tool
    try:
        result = tool_func(**args_with_user)
        return result
    except TypeError as e:
        # Handle missing required arguments
        logger.error("Tool %s execution failed: %s", tool_name, str(e))
        return {"error": f"Tool execution failed: {str(e)}"}


def extract_tool_calls(response_text: str) -> list:
    """Extract tool function calls from Gemini response.

    Gemini may include function calls in the response. This function
    extracts them and returns structured data.

    Args:
        response_text: Raw response from Gemini

    Returns:
        List of (tool_name, tool_args) tuples
    """
    # Look for function call patterns in the response
    # Pattern: <function_name>(arguments)
    pattern = r'<(\w+)\((.*?)\)>'
    matches = re.findall(pattern, response_text, re.DOTALL)

    tool_calls = []
    for func_name, args_str in matches:
        try:
            # Try to parse arguments as JSON
            args = json.loads(args_str)
            tool_calls.append((func_name, args))
        except json.JSONDecodeError:
            logger.warning("Failed to parse tool args for %s: %s", func_name, args_str)

    return tool_calls


async def process_chat_message(
    agent: Any,
    user_id: str,
    message: str,
    conversation_id: Optional[str] = None,
) -> Tuple[str, str]:
    """Process a chat message through the Gemini AI agent.

    This is the core orchestration function:
    1. Resolve or create conversation
    2. Save user message
    3. Load conversation history
    4. Send message to Gemini with tools available
    5. Execute any tool calls (via MCP tools)
    6. Save tool results and final response
    7. Return (conversation_id, response_text)

    Args:
        agent: The configured Gemini GenerativeModel instance.
        user_id: Authenticated user's ID.
        message: User's natural language message.
        conversation_id: Optional existing conversation ID to resume.

    Returns:
        Tuple of (conversation_id, response_text).

    Raises:
        ValueError: If conversation_id is invalid or belongs to another user.
    """
    start_time = time.time()
    logger.info("process_chat_message: user_id=%s, conversation_id=%s", user_id, conversation_id)

    with Session(engine) as session:
        # Step 1: Resolve or create conversation
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
            logger.info("Created new conversation: id=%s", conversation_id)

        # Step 2: Save user message
        user_msg = Message(
            conversation_id=conversation_id,
            role="user",
            content=message,
        )
        session.add(user_msg)
        session.commit()

    # Step 3: Load conversation history (outside the session to avoid long locks)
    history = load_conversation_history(conversation_id)

    # Step 4: Send message to Gemini
    response_text = None
    tool_calls_executed = []

    try:
        # Convert history to Gemini chat format
        chat_history = []
        for msg in history:
            chat_history.append({
                "role": msg["role"],
                "parts": [msg["content"]]
            })

        # Start a chat session with Gemini
        chat = agent.start_chat(history=chat_history)

        # Send the new message with tools enabled
        # Note: Gemini function calling happens automatically if tools are configured
        response = chat.send_message(
            message,
            tools=get_mcp_tools_schema()
        )

        # Extract response text
        if response.text:
            response_text = response.text
        else:
            # If no text, check for function calls
            response_text = "Processing your request..."

        # Handle function calls if Gemini made any
        if hasattr(response, 'tool_calls') and response.tool_calls:
            for tool_call in response.tool_calls:
                tool_name = tool_call.function_name
                tool_args = tool_call.args

                try:
                    # Execute the MCP tool
                    tool_result = await execute_mcp_tool(tool_name, tool_args, user_id)
                    tool_calls_executed.append({
                        "name": tool_name,
                        "result": tool_result
                    })
                    logger.info("Tool %s executed successfully", tool_name)
                except Exception as e:
                    logger.error("Tool %s execution failed: %s", tool_name, str(e))
                    tool_calls_executed.append({
                        "name": tool_name,
                        "error": str(e)
                    })

            # If tools were called, send results back to Gemini for final response
            if tool_calls_executed:
                # Build tool result message
                tool_results_text = "Tool results:\n"
                for tc in tool_calls_executed:
                    if "result" in tc:
                        tool_results_text += f"- {tc['name']}: {json.dumps(tc['result'])}\n"
                    else:
                        tool_results_text += f"- {tc['name']}: Error - {tc['error']}\n"

                # Get final response from Gemini
                final_response = chat.send_message(tool_results_text)
                if final_response.text:
                    response_text = final_response.text

        logger.info("Agent responded in %.3fs", time.time() - start_time)

    except Exception as e:
        logger.error("Agent failed after %.3fs: %s", time.time() - start_time, str(e))
        response_text = "I'm sorry, I encountered an error processing your request. Please try again."

    # Step 5: Save tool results and assistant response
    with Session(engine) as session:
        # Save tool call results
        for tool_call in tool_calls_executed:
            try:
                tool_msg = Message(
                    conversation_id=conversation_id,
                    role="tool",
                    content=json.dumps(tool_call.get("result") or tool_call.get("error", "")),
                    tool_name=tool_call["name"],
                    tool_result=json.dumps(tool_call.get("result")) if "result" in tool_call else None,
                )
                session.add(tool_msg)
            except Exception as e:
                logger.warning("Failed to save tool result: %s", str(e))

        # Save assistant response
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=response_text,
        )
        session.add(assistant_msg)

        # Update conversation timestamp
        conversation = session.get(Conversation, conversation_id)
        if conversation:
            conversation.updated_at = datetime.now()
            session.add(conversation)

        session.commit()

    duration = time.time() - start_time
    logger.info("process_chat_message completed in %.3fs: conversation_id=%s", duration, conversation_id)

    return conversation_id, response_text
