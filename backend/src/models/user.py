"""User model definition - merged schema for Better Auth + backend."""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(SQLModel, table=True):
    """User model shared by Better Auth (frontend) and FastAPI (backend).

    Better Auth columns: id, name, email, emailVerified, image, createdAt, updatedAt
    Backend columns: id, email, hashed_password, is_active
    """

    # Shared columns
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    email: str = Field(sa_column_kwargs={"unique": True, "nullable": False})

    # Better Auth columns (camelCase to match Better Auth's SQL queries)
    name: Optional[str] = Field(default="")
    emailVerified: bool = Field(default=False)
    image: Optional[str] = Field(default=None)
    createdAt: Optional[datetime] = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = Field(default=None)

    # Backend-only columns (nullable so Better Auth can insert without them)
    hashed_password: Optional[str] = Field(default="", sa_column_kwargs={"server_default": ""})
    is_active: Optional[bool] = Field(default=True, sa_column_kwargs={"server_default": "true"})
