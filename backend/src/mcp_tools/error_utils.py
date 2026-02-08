"""
Structured error handling utilities for MCP tools.

This module provides standardized error responses for various
failure scenarios in MCP tools, ensuring consistent error
messages for the AI agent and end users.
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


def create_error_response(error_message: str) -> Dict[str, Any]:
    """
    Create a structured error response for MCP tools.

    Args:
        error_message: Human-readable error message

    Returns:
        Dictionary with error structure expected by the MCP client
    """
    return {"error": error_message}


def create_success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a success response for MCP tools.

    Args:
        data: Success data to return

    Returns:
        Dictionary with success data
    """
    return data


def handle_database_error(original_error: Exception) -> Dict[str, Any]:
    """
    Handle database errors and return a user-friendly error response.

    Args:
        original_error: The original database error

    Returns:
        Dictionary with user-friendly error message
    """
    logger.error("Database error in MCP tool: %s", original_error, exc_info=True)

    return create_error_response(
        "Temporary database error. Please try again."
    )


def handle_validation_error(field_name: str, reason: str = "") -> Dict[str, Any]:
    """
    Handle validation errors and return a structured response.

    Args:
        field_name: Name of the field that failed validation
        reason: Specific reason for validation failure

    Returns:
        Dictionary with validation error message
    """
    if field_name.lower() == "title":
        return create_error_response("Title is required")
    elif field_name.lower() == "user_id":
        return create_error_response("Valid user ID is required")
    elif field_name.lower() == "task_id":
        return create_error_response("Valid task ID is required")
    else:
        return create_error_response(f"Invalid {field_name}: {reason}" if reason else f"Invalid {field_name}")


def handle_not_found_error(item_type: str = "item") -> Dict[str, Any]:
    """
    Handle 'not found' errors and return a standard response.

    Args:
        item_type: Type of item that wasn't found (e.g., "task", "user")

    Returns:
        Dictionary with not-found error message
    """
    return create_error_response(f"{item_type.capitalize()} not found")


def handle_access_denied_error() -> Dict[str, Any]:
    """
    Handle access denied errors (for security).

    Returns:
        Dictionary with access denied error message
        (Using same message as not found to avoid information disclosure)
    """
    return handle_not_found_error("item")


def handle_unexpected_error(error: Exception) -> Dict[str, Any]:
    """
    Handle unexpected errors and return a safe error response.

    Args:
        error: The unexpected error

    Returns:
        Dictionary with generic error message
    """
    logger.error("Unexpected error in MCP tool: %s", error, exc_info=True)

    return create_error_response(
        "An unexpected error occurred. Please try again."
    )
