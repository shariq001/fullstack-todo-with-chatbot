"""
JWT utility module for encoding/decoding tokens using the shared secret.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, ValidationError
from ..config.settings import settings


# Initialize the security scheme for bearer token
security = HTTPBearer()


class TokenData(BaseModel):
    """Data contained in a JWT token."""
    user_id: str
    email: str
    exp: Optional[int] = None


class JWTHandler:
    """Class to handle JWT encoding and decoding using the shared secret."""

    def __init__(self):
        """Initialize with the shared secret from settings."""
        self.secret = settings.better_auth_secret
        self.algorithm = "HS256"

    def encode_token(self, user_id: str, email: str, expires_delta: Optional[timedelta] = None) -> str:
        """
        Encode a JWT token with user information.

        Args:
            user_id: The user's unique identifier
            email: The user's email address
            expires_delta: Optional timedelta for custom expiration (defaults to 15 minutes)

        Returns:
            Encoded JWT token as string
        """
        if expires_delta is None:
            expires_delta = timedelta(minutes=15)  # Default to 15 minutes

        expire = datetime.utcnow() + expires_delta
        to_encode = {
            "user_id": user_id,
            "email": email,
            "exp": expire.timestamp(),
            "iat": datetime.utcnow().timestamp(),  # issued at time
            "type": "access"  # token type
        }

        encoded_token = jwt.encode(to_encode, self.secret, algorithm=self.algorithm)
        return encoded_token

    def decode_token(self, token: str) -> Optional[TokenData]:
        """
        Decode a JWT token and return the user information.

        Args:
            token: The JWT token to decode

        Returns:
            TokenData object with user information, or None if invalid
        """
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])

            # Validate required fields
            user_id: str = payload.get("user_id")
            email: str = payload.get("email")

            if user_id is None or email is None:
                return None

            # Check if token is expired (pyjwt handles this automatically, but we'll verify)
            token_data = TokenData(
                user_id=user_id,
                email=email,
                exp=payload.get("exp")
            )

            return token_data

        except jwt.ExpiredSignatureError:
            # Token has expired
            return None
        except jwt.JWTError:
            # Invalid token
            return None
        except Exception:
            # Other errors
            return None


# Create a global instance of JWTHandler
jwt_handler = JWTHandler()


def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """
    FastAPI dependency to get the current user from the JWT token.

    This function extracts and verifies the JWT token from the Authorization header,
    then returns the user information contained in the token.

    Args:
        token: The authorization credentials from the request header

    Returns:
        TokenData object with user information

    Raises:
        HTTPException: If token is invalid, expired, or missing
    """
    token_data = jwt_handler.decode_token(token.credentials)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_data


def verify_token_optional(token: HTTPAuthorizationCredentials = Depends(security)) -> Optional[TokenData]:
    """
    Optional token verification - doesn't raise an exception for invalid tokens.

    Args:
        token: The authorization credentials from the request header

    Returns:
        TokenData object if valid, None if invalid
    """
    try:
        token_data = jwt_handler.decode_token(token.credentials)
        return token_data
    except Exception:
        return None