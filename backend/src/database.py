"""Database engine and session management."""
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL.startswith('sqlite:///'):
    # For SQLite, use StaticPool and check_same_thread=False
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # For other databases
    engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    """Create database tables."""
    SQLModel.metadata.create_all(engine)