"""
Authentication dependencies for FastAPI endpoints.
This module contains the get_current_user dependency required for the implementation.
"""

from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .jwt import TokenData, jwt_handler, security


def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """
    FastAPI dependency that retrieves and verifies the current user from the JWT token.

    This dependency:
    1. Extracts the JWT token from the Authorization header (Bearer scheme)
    2. Verifies the token signature using the shared BETTER_AUTH_SECRET
    3. Decodes the user information (ID, Email) from the token
    4. Returns the user information for use in route handlers

    Args:
        token: The authorization credentials from the request header

    Returns:
        TokenData object containing user_id and email

    Raises:
        HTTPException: With status 401 if token is invalid, expired, or missing
    """
    token_data = jwt_handler.decode_token(token.credentials)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_data


def get_current_user_optional(token: HTTPAuthorizationCredentials = Depends(security)) -> Optional[TokenData]:
    """
    Optional version of get_current_user that doesn't raise an exception for invalid tokens.

    Args:
        token: The authorization credentials from the request header

    Returns:
        TokenData object if token is valid, None otherwise
    """
    try:
        token_data = jwt_handler.decode_token(token.credentials)
        return token_data
    except:
        return None