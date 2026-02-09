"""
HuggingFace Spaces Entry Point for Todo AI Backend
This file allows HF Spaces to discover and run the FastAPI application.
"""
import os
import sys
import logging

# Setup logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("===== HUGGINGFACE SPACES STARTUP =====")

# Get the absolute path to the project root
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT = os.path.join(PROJECT_ROOT, 'backend')

logger.info(f"Project root: {PROJECT_ROOT}")
logger.info(f"Backend root: {BACKEND_ROOT}")

# Add both project root and backend to Python path
sys.path.insert(0, PROJECT_ROOT)
sys.path.insert(0, BACKEND_ROOT)

# Load environment variables from .env file in backend directory
logger.info("Loading environment variables...")
from dotenv import load_dotenv

backend_env_path = os.path.join(BACKEND_ROOT, '.env')
logger.info(f"Looking for .env at: {backend_env_path}")

if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path)
    logger.info(f"✓ Loaded .env from {backend_env_path}")
else:
    logger.warning(f"⚠ .env not found at {backend_env_path}, using system environment variables")

logger.info(f"ENVIRONMENT={os.getenv('ENVIRONMENT', 'development')}")
logger.info(f"DEBUG={os.getenv('DEBUG', 'False')}")

# Import the FastAPI app with better error handling
logger.info("Attempting to import FastAPI app...")
try:
    # Try importing from backend/src/main.py
    from backend.src.main import app
    logger.info("✓ FastAPI app imported successfully from backend.src.main")
except ImportError as e:
    logger.error(f"✗ Failed to import from backend.src.main: {e}")
    try:
        # Fallback: try importing from src/main.py (if paths are configured differently)
        from src.main import app
        logger.info("✓ FastAPI app imported successfully from src.main (fallback)")
    except ImportError as e2:
        logger.error(f"✗ Fallback import also failed: {e2}")
        logger.error("Cannot import FastAPI app. Exiting.")
        raise

logger.info("✓ FastAPI app imported successfully!")
logger.info("===== STARTUP COMPLETE =====")

# HF Spaces configuration
if __name__ == "__main__":
    import uvicorn

    # Get port from environment, default to 7860 for HF Spaces
    port = int(os.getenv("PORT", 7860))
    host = "0.0.0.0"  # Important: must listen on 0.0.0.0 for HF Spaces

    logger.info(f"Starting FastAPI server on {host}:{port}")
    logger.info("HF Spaces will expose this at: https://mushariq-full-stack-todo.hf.space")

    try:
        uvicorn.run(
            app,
            host=host,
            port=port,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        logger.error(f"✗ Failed to start server: {e}")
        raise
