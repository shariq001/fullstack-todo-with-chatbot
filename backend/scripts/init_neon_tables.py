#!/usr/bin/env python3
"""Script to initialize tables in NEON PostgreSQL database."""
import sys
import os
import inspect

# Add the backend directory to the Python path
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from src.models.base import create_db_and_tables
from src.models.user import User
from src.models.task import Task
from sqlmodel import select
from src.services.database import db_service
from sqlalchemy import text


def main():
    """Initialize tables in NEON database."""
    print("Connecting to NEON PostgreSQL database...")

    # Test the connection first
    try:
        is_connected = db_service.test_connection()
        if is_connected:
            print("+ Successfully connected to NEON database")
        else:
            print("- Failed to connect to NEON database")
            sys.exit(1)
    except Exception as e:
        print(f"- Connection test failed: {e}")
        sys.exit(1)

    # Create tables
    print("\nCreating tables in NEON database...")
    try:
        create_db_and_tables()
        print("+ Tables created successfully")
    except Exception as e:
        print(f"- Table creation failed: {e}")
        sys.exit(1)

    # Verify tables exist by trying to query them
    print("\nVerifying table creation...")
    try:
        with db_service.get_session_context() as session:
            # Test if User table exists by counting records
            user_count = session.query(User).count()
            print(f"+ User table exists (contains {user_count} records)")

            # Test if Task table exists by counting records
            task_count = session.query(Task).count()
            print(f"+ Task table exists (contains {task_count} records)")

        print("\n+ All tables verified successfully!")

        # Show table information
        print("\nTable Information:")
        print("- Users: Stores user account information (id, email, timestamps)")
        print("- Tasks: Stores task information (id, title, description, completion status, user_id)")
        print("- Foreign Key: Task.user_id references User.id for data isolation")

    except Exception as e:
        print(f"- Table verification failed: {e}")
        sys.exit(1)

    print("\n+ NEON database initialization completed successfully!")
    print("+ User and Task tables are ready for use")
    print("+ Data isolation through user_id foreign key is configured")


if __name__ == "__main__":
    main()