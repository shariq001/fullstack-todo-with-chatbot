"""Health check endpoint."""
from fastapi import APIRouter, status
from typing import Dict
from sqlmodel import Session, text
from ..models.base import engine
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["health"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    """Health check endpoint to verify the system is operational."""
    try:
        # Try to connect with a short timeout
        with Session(engine) as session:
            session.exec(text("SELECT 1"))
        logger.info("✓ Health check: database connected")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.warning(f"⚠ Health check: database connection failed: {type(e).__name__}")
        # Still return 200 because app is running, just database is unavailable
        return {"status": "degraded", "database": "disconnected", "error": type(e).__name__}


@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check() -> Dict[str, str]:
    """Readiness check endpoint."""
    return {"status": "ready"}


@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_check() -> Dict[str, str]:
    """Liveness check endpoint."""
    return {"status": "alive"}
