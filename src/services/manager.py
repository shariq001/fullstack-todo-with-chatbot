from typing import List, Optional
from models.task import Task


class TaskManager:
    """
    Manages a collection of tasks in memory.

    This class provides methods to add, remove, update, and retrieve tasks.
    All data is stored in memory and will be lost when the application exits.
    """

    def __init__(self):
        """Initialize the TaskManager with an empty task list."""
        self._tasks: List[Task] = []
        self._next_id: int = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Add a new task to the task list.

        Args:
            title: The title of the task
            description: The description of the task (optional)

        Returns:
            The created Task object

        Raises:
            ValueError: If the title is empty or invalid
        """
        if not isinstance(title, str) or not title.strip():
            raise ValueError(f"Task title must be a non-empty string, got {title}")

        task = Task(id=self._next_id, title=title.strip(), description=description.strip())
        self._tasks.append(task)
        self._next_id += 1
        return task

    def remove_task(self, task_id: int) -> bool:
        """
        Remove a task by its ID.

        Args:
            task_id: The ID of the task to remove

        Returns:
            True if the task was found and removed, False otherwise
        """
        if not isinstance(task_id, int) or task_id <= 0:
            return False

        for i, task in enumerate(self._tasks):
            if task.id == task_id:
                del self._tasks[i]
                return True
        return False

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """
        Update a task's information by its ID.

        Args:
            task_id: The ID of the task to update
            title: The new title for the task (optional)
            description: The new description for the task (optional)

        Returns:
            True if the task was found and updated, False otherwise
        """
        if not isinstance(task_id, int) or task_id <= 0:
            return False

        for task in self._tasks:
            if task.id == task_id:
                try:
                    task.update(title=title, description=description)
                    return True
                except ValueError:
                    return False
        return False

    def get_all_tasks(self) -> List[Task]:
        """
        Get all tasks in the task list.

        Returns:
            A list of all Task objects
        """
        return self._tasks.copy()

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Get a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task object if found, None otherwise
        """
        if not isinstance(task_id, int) or task_id <= 0:
            return None

        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def mark_complete(self, task_id: int) -> bool:
        """
        Mark a task as complete by its ID.

        Args:
            task_id: The ID of the task to mark complete

        Returns:
            True if the task was found and marked complete, False otherwise
        """
        if not isinstance(task_id, int) or task_id <= 0:
            return False

        for task in self._tasks:
            if task.id == task_id:
                task.mark_complete()
                return True
        return False

    def mark_incomplete(self, task_id: int) -> bool:
        """
        Mark a task as incomplete by its ID.

        Args:
            task_id: The ID of the task to mark incomplete

        Returns:
            True if the task was found and marked incomplete, False otherwise
        """
        if not isinstance(task_id, int) or task_id <= 0:
            return False

        for task in self._tasks:
            if task.id == task_id:
                task.mark_incomplete()
                return True
        return False