from dataclasses import dataclass
from typing import Optional


@dataclass
class Task:
    """
    Represents a single task in the to-do list.

    Attributes:
        id (int): Unique identifier for the task
        title (str): Title of the task
        description (str): Optional description of the task
        completed (bool): Status indicating if the task is completed
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False

    def __post_init__(self):
        """Validate the task after initialization."""
        if not isinstance(self.id, int) or self.id <= 0:
            raise ValueError(f"Task ID must be a positive integer, got {self.id}")
        if not isinstance(self.title, str) or not self.title.strip():
            raise ValueError(f"Task title must be a non-empty string, got {self.title}")
        if not isinstance(self.description, str):
            raise ValueError(f"Task description must be a string, got {type(self.description)}")
        if not isinstance(self.completed, bool):
            raise ValueError(f"Task completed status must be a boolean, got {type(self.completed)}")

    def mark_complete(self) -> None:
        """Mark the task as complete."""
        self.completed = True

    def mark_incomplete(self) -> None:
        """Mark the task as incomplete."""
        self.completed = False

    def update(self, title: Optional[str] = None, description: Optional[str] = None) -> None:
        """
        Update the task with new information.

        Args:
            title: New title for the task (optional)
            description: New description for the task (optional)
        """
        if title is not None:
            if not isinstance(title, str) or not title.strip():
                raise ValueError(f"Task title must be a non-empty string, got {title}")
            self.title = title

        if description is not None:
            if not isinstance(description, str):
                raise ValueError(f"Task description must be a string, got {type(description)}")
            self.description = description