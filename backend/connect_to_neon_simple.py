#!/usr/bin/env python3
"""Simple script to connect to Neon PostgreSQL database and create tables."""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, MetaData, Table, Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

# Load environment variables from backend/.env
load_dotenv('.env')

# Get database URL from environment
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment variables")
    sys.exit(1)

print(f"Connecting to Neon database: {DATABASE_URL}")

# Create the database engine with pg8000 driver
try:
    # Update the database URL to use pg8000 driver if needed
    updated_url = DATABASE_URL
    if updated_url.startswith('postgresql://'):
        # Replace with pg8000 driver
        updated_url = updated_url.replace('postgresql://', 'postgresql+pg8000://', 1)

    # Remove unsupported parameters for pg8000
    params_to_remove = ['channel_binding=require', 'sslmode=require']
    for param in params_to_remove:
        if param in updated_url:
            # Split URL and parameters
            if '?' in updated_url:
                base_url, query_string = updated_url.split('?', 1)
                params = query_string.split('&')
                # Filter out unwanted parameters
                params = [p for p in params if p != param]
                # Reconstruct URL
                if params:
                    updated_url = f"{base_url}?{'&'.join(params)}"
                else:
                    updated_url = base_url

    engine = create_engine(updated_url)
    print("Engine created successfully")
except Exception as e:
    print(f"Error creating engine: {e}")
    sys.exit(1)

# Test the connection
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Successfully connected to Neon database")
except Exception as e:
    print(f"Connection test failed: {e}")
    sys.exit(1)

# Define tables using SQLAlchemy directly
metadata = MetaData()

# Users table
users_table = Table(
    'user',
    metadata,
    Column('id', String, primary_key=True),
    Column('email', String, unique=True, nullable=False),
    Column('created_at', DateTime, nullable=False),
    Column('updated_at', DateTime)
)

# Tasks table
tasks_table = Table(
    'task',
    metadata,
    Column('id', String, primary_key=True),
    Column('title', String, nullable=False),
    Column('description', String),
    Column('is_completed', Boolean, default=False),
    Column('user_id', String, ForeignKey('user.id'), nullable=False),
    Column('created_at', DateTime, nullable=False),
    Column('updated_at', DateTime)
)

print("Defined table schemas")

# Create all tables
try:
    print("\nCreating tables...")
    metadata.create_all(engine)
    print("Tables created successfully!")

    # Verify tables exist
    with engine.connect() as connection:
        # Check if users table exists
        result = connection.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'user'
            );
        """))
        user_table_exists = result.scalar()

        # Check if tasks table exists
        result = connection.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'task'
            );
        """))
        task_table_exists = result.scalar()

        print(f"Users table exists: {user_table_exists}")
        print(f"Tasks table exists: {task_table_exists}")

        if user_table_exists and task_table_exists:
            print("\nDatabase setup completed successfully!")
            print("Tables created:")
            print("   - user: Stores user account information")
            print("   - task: Stores task information with user_id foreign key")
            print("\nData isolation is configured via user_id foreign key")
        else:
            print("\nSome tables were not created properly")

except Exception as e:
    print(f"Error creating tables: {e}")
    sys.exit(1)

print("\nNeon PostgreSQL database is ready for use!")