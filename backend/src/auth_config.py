"""Authentication configuration."""
from .config.settings import settings

BETTER_AUTH_SECRET = settings.better_auth_secret
BASE_URLS = ["http://localhost:3000", "http://localhost:3002"]
