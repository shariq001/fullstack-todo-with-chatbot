"""
HuggingFace Spaces Entry Point for Todo AI Backend
This file allows HF Spaces to discover and run the FastAPI application.
"""
import os
import sys
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add backend to path so we can import from it
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Load environment variables from .env file in backend directory
from dotenv import load_dotenv
backend_env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
load_dotenv(backend_env_path)

logger.info("Environment variables loaded from backend/.env")
logger.info(f"ENVIRONMENT={os.getenv('ENVIRONMENT', 'development')}")

# Import the FastAPI app
try:
    from src.main import app
    logger.info("✓ FastAPI app imported successfully from backend/src/main.py")
except ImportError as e:
    logger.error(f"✗ Failed to import FastAPI app: {e}")
    raise

# HF Spaces configuration
# The app will be exposed on the default HF Spaces port (7860)
# But FastAPI will run on the specified port
if __name__ == "__main__":
    import uvicorn

    # Get port from environment, default to 7860 for HF Spaces
    port = int(os.getenv("PORT", 7860))
    host = "0.0.0.0"  # Important: must listen on 0.0.0.0 for HF Spaces

    logger.info(f"Starting FastAPI server on {host}:{port}")
    logger.info("For HF Spaces: Application will be available at the space URL")

    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info",
        access_log=True
    )
