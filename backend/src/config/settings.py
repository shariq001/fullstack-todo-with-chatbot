"""Configuration settings using python-dotenv."""
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os
from pathlib import Path

# Resolve the backend root directory for .env file
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    database_url: str
    environment: str = "development"
    debug: bool = False
    better_auth_secret: str
    google_api_key: str = ""

    @field_validator('database_url')
    @classmethod
    def validate_database_url(cls, v):
        """Validate that the database URL is properly formatted."""
        if not v or v.strip() == "":
            raise ValueError('DATABASE_URL cannot be empty')

        if not (v.startswith('postgresql://') or v.startswith('postgresql+pg8000://') or v.startswith('sqlite:///')):
            raise ValueError('DATABASE_URL must start with postgresql:// or sqlite:///')

        return v

    @field_validator('better_auth_secret')
    @classmethod
    def validate_auth_secret(cls, v):
        """Validate that the auth secret is properly formatted."""
        if not v or v.strip() == "":
            raise ValueError('BETTER_AUTH_SECRET cannot be empty')

        if len(v.strip()) < 32:
            raise ValueError('BETTER_AUTH_SECRET must be at least 32 characters long for security')

        return v.strip()

    class Config:
        env_file = str(BACKEND_DIR / ".env")
        env_file_encoding = "utf-8"


# Create a single instance of settings
settings = Settings()
