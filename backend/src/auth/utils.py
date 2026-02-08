"""
Authentication utilities for the backend application.
"""

from typing import Optional
from datetime import datetime, timedelta
from ..config.settings import settings
from .jwt import jwt_handler, TokenData


def create_access_token(user_id: str, email: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create an access token for a user.

    Args:
        user_id: The unique identifier for the user
        email: The user's email address
        expires_delta: Optional timedelta for custom expiration (defaults to 15 minutes)

    Returns:
        Encoded JWT token as string
    """
    return jwt_handler.encode_token(user_id, email, expires_delta)


def verify_access_token(token: str) -> Optional[TokenData]:
    """
    Verify an access token and return the user information.

    Args:
        token: The JWT token to verify

    Returns:
        TokenData object with user information if valid, None if invalid/expired
    """
    return jwt_handler.decode_token(token)


def is_token_expired(token: str) -> bool:
    """
    Check if a token is expired.

    Args:
        token: The JWT token to check

    Returns:
        True if token is expired, False otherwise
    """
    token_data = jwt_handler.decode_token(token)

    if token_data is None:
        # Token is invalid or expired
        return True

    if token_data.exp:
        # Compare expiration time with current time
        current_time = datetime.utcnow().timestamp()
        return token_data.exp < current_time

    # If there's no expiration, consider it expired
    return True


def get_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract the user ID from a JWT token.

    Args:
        token: The JWT token to extract user ID from

    Returns:
        User ID string if found and valid, None otherwise
    """
    token_data = jwt_handler.decode_token(token)
    return token_data.user_id if token_data else None


def get_email_from_token(token: str) -> Optional[str]:
    """
    Extract the email from a JWT token.

    Args:
        token: The JWT token to extract email from

    Returns:
        Email string if found and valid, None otherwise
    """
    token_data = jwt_handler.decode_token(token)
    return token_data.email if token_data else None