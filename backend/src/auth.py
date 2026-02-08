"""Authentication module - JWT verification for Better Auth tokens."""
from typing import Generator
from fastapi import HTTPException, status
from sqlmodel import Session
import jwt
from pydantic import BaseModel

from .auth_config import BETTER_AUTH_SECRET
from .models.base import engine
from .models.user import User


class TokenData(BaseModel):
    user_id: str
    email: str
    name: str = ""


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def verify_jwt_token(token: str) -> TokenData:
    """Verify the JWT token issued by Better Auth using the shared secret."""
    try:
        payload = jwt.decode(
            token,
            BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )

        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        name: str = payload.get("name", "")

        # Check alternative fields
        if not user_id:
            user_id = payload.get("user_id") or payload.get("id")
        if not email:
            email = payload.get("user_email")

        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        return TokenData(user_id=user_id, email=email, name=name)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )


def get_current_user_from_token(authorization: str = None) -> User:
    """Extract and verify user from authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    token = authorization[len("Bearer "):]
    token_data = verify_jwt_token(token)

    with Session(engine) as session:
        existing_user = session.query(User).filter(User.id == token_data.user_id).first()

        if not existing_user:
            # Auto-create user from JWT payload (registered via Better Auth on frontend)
            new_user = User(
                id=token_data.user_id,
                email=token_data.email,
                name=token_data.name,
                hashed_password="",
                is_active=True
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            return new_user
        else:
            return existing_user
