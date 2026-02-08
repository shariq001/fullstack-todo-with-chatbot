"""Main FastAPI application."""
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from contextlib import AsyncExitStack
import logging

from .auth import get_current_user_from_token
from .models.base import create_db_and_tables
from .api.health import router as health_router
from .api.tasks import router as tasks_router
from .api.chat import router as chat_router
from .config.logging import setup_logging
from .mcp_server import get_mcp_app
from .services.agent_service import init_gemini_client, create_agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler."""
    logging.info("Application starting up...")
    create_db_and_tables()
    logging.info("Database tables created/verified.")

    # Initialize Gemini API client and create agent
    try:
        init_gemini_client()
        app.state.agent = create_agent()
        logging.info("Gemini API client and AI agent initialized.")
    except ValueError as e:
        logging.error("Failed to initialize Gemini agent: %s", str(e))
        raise

    yield

    logging.info("Application shutting down...")


# Create the main FastAPI app with lifespan
app = FastAPI(
    title="Backend Infrastructure API",
    description="API for the Backend Infrastructure & Data Layer Setup",
    version="1.0.0",
    lifespan=lifespan
)

# Get the MCP server app
mcp_app = get_mcp_app()

# Mount the MCP server at /mcp path
app.mount("/mcp", mcp_app)

# CORS middleware - allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3002",
        "https://full-stack-todo-hazel.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(tasks_router)
app.include_router(chat_router, prefix="/api")


@app.get("/me", response_model=dict)
async def read_current_user(authorization: str = Header(None)):
    """Get current authenticated user."""
    current_user = get_current_user_from_token(authorization)
    return {"user_id": current_user.id, "email": current_user.email}


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Backend Infrastructure API is running!"}
