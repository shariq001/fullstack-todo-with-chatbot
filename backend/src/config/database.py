"""Database configuration settings."""
from .settings import settings
from typing import Optional


class DatabaseConfig:
    """Database-specific configuration."""

    @property
    def database_url(self) -> str:
        """Return the database URL from settings."""
        return settings.database_url

    @property
    def pool_size(self) -> int:
        """Return the database connection pool size."""
        return 20

    @property
    def max_overflow(self) -> int:
        """Return the maximum overflow for connection pool."""
        return 30

    @property
    def pool_timeout(self) -> int:
        """Return the pool timeout."""
        return 30

    @property
    def pool_recycle(self) -> int:
        """Return the pool recycle time."""
        return 3600


# Create a single instance of database config
db_config = DatabaseConfig()