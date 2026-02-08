"""
Authentication-related schemas for request/response validation.
"""

from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    """
    Schema for JWT token response.
    """
    access_token: str
    token_type: str = "bearer"


class TokenDataSchema(BaseModel):
    """
    Schema for token data contained in JWT payload.
    """
    user_id: str
    email: str
    exp: Optional[int] = None
    iat: Optional[int] = None
    type: Optional[str] = "access"


class UserIdentity(BaseModel):
    """
    Schema for user identity information.
    """
    id: str
    email: str


class AuthResponse(BaseModel):
    """
    Schema for authentication response.
    """
    user: UserIdentity
    token: Token


class AuthError(BaseModel):
    """
    Schema for authentication error responses.
    """
    detail: str