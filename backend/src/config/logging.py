"""Logging configuration for the application."""
import logging
from .settings import settings


def setup_logging():
    """Configure the application logging."""
    level = logging.DEBUG if settings.debug else logging.INFO

    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler()
        ]
    )


# Set up logging when module is imported
setup_logging()