"""Main FastAPI application."""
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .auth import get_current_user_from_token
from .models.base import create_db_and_tables
from .api.health import router as health_router
from .api.tasks import router as tasks_router
from .api.chat import router as chat_router
from .services.agent_service import init_gemini_client, create_agent

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler."""
    logging.info("=== APPLICATION STARTING UP ===")

    # Initialize database with error handling - non-blocking
    try:
        logging.info("Initializing database tables...")
        create_db_and_tables()
        logging.info("✓ Database tables created/verified successfully.")
        app.state.db_ready = True
    except Exception as e:
        logging.error(f"✗ Failed to initialize database tables: {type(e).__name__}: {e}")
        logging.warning("⚠ App will start but database operations may fail initially. Will retry on requests.")
        app.state.db_ready = False

    # Initialize Gemini API client and create agent
    try:
        logging.info("Initializing Gemini API client and agent...")
        init_gemini_client()
        app.state.agent = create_agent()
        logging.info("✓ Gemini API client and AI agent initialized.")
    except Exception as e:
        logging.error(f"✗ Failed to initialize Gemini agent: {type(e).__name__}: {e}")
        logging.warning("⚠ Creating fallback agent...")
        # Create a fallback agent that can still work
        app.state.agent = {"type": "mock_agent", "model": "mock"}
        logging.info("✓ Fallback agent created.")

    logging.info("=== APPLICATION READY ===")
    yield

    logging.info("=== APPLICATION SHUTTING DOWN ===")


# Create the main FastAPI app with lifespan
app = FastAPI(
    title="Backend Infrastructure API",
    description="API for the Backend Infrastructure & Data Layer Setup",
    version="1.0.0",
    lifespan=lifespan
)

# --- FIX START ---
# Define allowed origins clearly here
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://frontend-drab-eight-71.vercel.app", # Your Frontend
    "https://mushariq-full-stack-todo.hf.space", # Your Backend Space
    "https://huggingface.co"
]

# CORS middleware - allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # <--- Use the variable we defined above
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- FIX END ---

# Include routers
app.include_router(health_router)
app.include_router(tasks_router)
app.include_router(chat_router, prefix="/api")


@app.get("/me", response_model=dict)
async def read_current_user(authorization: str = Header(None)):
    """Get current authenticated user."""
    # Ensure this function handles the case where authorization is None
    if not authorization:
        return {"error": "Missing Authorization Header"}
        
    current_user = get_current_user_from_token(authorization)
    return {"user_id": current_user.id, "email": current_user.email}


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Backend Infrastructure API is running! Project by Muhammad Shariq"}