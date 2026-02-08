"""Integration tests for database operations."""
import pytest
from sqlmodel import Session, select
from src.models.user import User
from src.models.task import Task
from src.models.base import engine, create_db_and_tables


def test_complete_user_task_workflow():
    """Test a complete workflow of creating a user and tasks."""
    create_db_and_tables()

    with Session(engine) as session:
        # Create a new user
        new_user = User(email="integration@test.com", hashed_password="")
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        assert new_user.id is not None
        assert new_user.email == "integration@test.com"

        # Create a task for this user
        new_task = Task(
            title="Integration Test Task",
            description="A task created during integration testing",
            user_id=new_user.id
        )
        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        assert new_task.id is not None
        assert new_task.user_id == new_user.id
        assert new_task.title == "Integration Test Task"

        # Query for the user's tasks
        statement = select(Task).where(Task.user_id == new_user.id)
        tasks = session.exec(statement).all()

        assert len(tasks) >= 1

        # Clean up
        for task in tasks:
            session.delete(task)
        session.delete(new_user)
        session.commit()


def test_task_operations():
    """Test basic CRUD operations for tasks."""
    create_db_and_tables()

    with Session(engine) as session:
        # Create a test user
        user = User(email="task.test@example.com", hashed_password="")
        session.add(user)
        session.commit()
        session.refresh(user)

        # Create a task
        task = Task(title="Test Task", user_id=user.id)
        session.add(task)
        session.commit()
        session.refresh(task)

        assert task.id is not None
        assert task.title == "Test Task"
        assert task.user_id == user.id

        # Update the task
        task.title = "Updated Test Task"
        task.is_completed = True
        session.add(task)
        session.commit()
        session.refresh(task)

        assert task.title == "Updated Test Task"
        assert task.is_completed is True

        # Delete the task
        session.delete(task)
        session.commit()

        # Verify deletion
        statement = select(Task).where(Task.id == task.id)
        deleted_task = session.exec(statement).first()
        assert deleted_task is None

        # Clean up
        session.delete(user)
        session.commit()


def test_user_task_relationship():
    """Test the relationship between User and Task models."""
    create_db_and_tables()

    with Session(engine) as session:
        # Create a user
        user = User(email="relationship@test.com", hashed_password="")
        session.add(user)
        session.commit()
        session.refresh(user)

        # Create multiple tasks for this user
        task1 = Task(title="First Task", user_id=user.id)
        task2 = Task(title="Second Task", user_id=user.id, is_completed=True)
        session.add(task1)
        session.add(task2)
        session.commit()

        # Query tasks for the user
        statement = select(Task).where(Task.user_id == user.id)
        user_tasks = session.exec(statement).all()

        assert len(user_tasks) >= 2
        titles = [task.title for task in user_tasks]
        assert "First Task" in titles
        assert "Second Task" in titles

        for task in user_tasks:
            assert task.user_id == user.id

        # Clean up
        for task in user_tasks:
            session.delete(task)
        session.delete(user)
        session.commit()
