"""Test authentication endpoint for verifying JWT token decoding."""

from fastapi import APIRouter, Header
from ..auth import get_current_user_from_token

router = APIRouter(tags=["test-auth"])


@router.get("/test-auth",
            summary="Test Authentication Endpoint",
            description="Verify that the backend correctly decodes the User ID from the JWT token.")
async def test_auth(authorization: str = Header(None)):
    """Test endpoint that verifies the authentication system is working correctly."""
    current_user = get_current_user_from_token(authorization)
    return {
        "authenticated": True,
        "user_id": current_user.id,
        "email": current_user.email,
        "message": "Authentication successful - user ID and email extracted from token"
    }
