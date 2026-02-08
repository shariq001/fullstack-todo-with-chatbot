import sys
from typing import Optional
from services.manager import TaskManager


class CLI:
    """
    Command-Line Interface for the Todo App.

    Handles user input, menu display, and interaction with the TaskManager.
    """

    def __init__(self):
        """Initialize the CLI with a TaskManager instance."""
        self.task_manager = TaskManager()

    def display_menu(self) -> None:
        """Display the main menu options to the user."""
        print("\n" + "="*50)
        print("           TODO LIST MANAGER")
        print("="*50)
        print("1. Add a new task")
        print("2. View all tasks")
        print("3. Update a task")
        print("4. Delete a task")
        print("5. Mark task as complete")
        print("6. Mark task as incomplete")
        print("7. Exit")
        print("-"*50)

    def capture_input(self, prompt: str) -> str:
        """
        Capture user input with a prompt.

        Args:
            prompt: Message to display to the user

        Returns:
            User input as string
        """
        try:
            return input(prompt).strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nOperation cancelled by user.")
            return ""

    def render_task_list(self, tasks) -> None:
        """
        Display tasks in a formatted way.

        Args:
            tasks: List of tasks to display
        """
        if not tasks:
            print("\nNo tasks found.")
            return

        print(f"\n{'ID':<4} {'Status':<10} {'Title':<20} {'Description'}")
        print("-" * 60)

        for task in tasks:
            status = "✓ Done" if task.completed else "○ Pending"
            title = task.title[:18] + ".." if len(task.title) > 18 else task.title
            description = task.description[:25] + ".." if len(task.description) > 25 else task.description
            print(f"{task.id:<4} {status:<10} {title:<20} {description}")

    def handle_add_task(self) -> None:
        """Handle the add task functionality."""
        print("\n--- Add New Task ---")
        title = self.capture_input("Enter task title: ")

        if not title:
            print("Task title cannot be empty.")
            return

        description = self.capture_input("Enter task description (optional): ")

        try:
            task = self.task_manager.add_task(title, description)
            print(f"Task '{task.title}' added successfully with ID {task.id}.")
        except ValueError as e:
            print(f"Error adding task: {e}")

    def handle_view_tasks(self) -> None:
        """Handle the view tasks functionality."""
        print("\n--- All Tasks ---")
        tasks = self.task_manager.get_all_tasks()
        self.render_task_list(tasks)

    def handle_update_task(self) -> None:
        """Handle the update task functionality."""
        print("\n--- Update Task ---")
        task_id_str = self.capture_input("Enter task ID to update: ")

        if not task_id_str:
            print("Task ID cannot be empty.")
            return

        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Invalid task ID. Please enter a number.")
            return

        # Check if task exists
        task = self.task_manager.get_task_by_id(task_id)
        if not task:
            print(f"No task found with ID {task_id}.")
            return

        print(f"Current task: {task.title}")
        new_title = self.capture_input(f"Enter new title (current: '{task.title}', press Enter to keep): ")
        new_description = self.capture_input(f"Enter new description (current: '{task.description}', press Enter to keep): ")

        # Use existing values if user pressed Enter
        title_to_update = new_title if new_title else None
        description_to_update = new_description if new_description else None

        if self.task_manager.update_task(task_id, title_to_update, description_to_update):
            print(f"Task with ID {task_id} updated successfully.")
        else:
            print(f"Failed to update task with ID {task_id}.")

    def handle_delete_task(self) -> None:
        """Handle the delete task functionality."""
        print("\n--- Delete Task ---")
        task_id_str = self.capture_input("Enter task ID to delete: ")

        if not task_id_str:
            print("Task ID cannot be empty.")
            return

        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Invalid task ID. Please enter a number.")
            return

        # Check if task exists before deletion
        task = self.task_manager.get_task_by_id(task_id)
        if not task:
            print(f"No task found with ID {task_id}.")
            return

        confirmation = self.capture_input(f"Are you sure you want to delete task '{task.title}'? (y/N): ").lower()
        if confirmation in ['y', 'yes']:
            if self.task_manager.remove_task(task_id):
                print(f"Task with ID {task_id} deleted successfully.")
            else:
                print(f"Failed to delete task with ID {task_id}.")
        else:
            print("Deletion cancelled.")

    def handle_mark_complete(self) -> None:
        """Handle marking a task as complete."""
        print("\n--- Mark Task Complete ---")
        task_id_str = self.capture_input("Enter task ID to mark complete: ")

        if not task_id_str:
            print("Task ID cannot be empty.")
            return

        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Invalid task ID. Please enter a number.")
            return

        if self.task_manager.mark_complete(task_id):
            print(f"Task with ID {task_id} marked as complete.")
        else:
            print(f"No task found with ID {task_id} or failed to update.")

    def handle_mark_incomplete(self) -> None:
        """Handle marking a task as incomplete."""
        print("\n--- Mark Task Incomplete ---")
        task_id_str = self.capture_input("Enter task ID to mark incomplete: ")

        if not task_id_str:
            print("Task ID cannot be empty.")
            return

        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Invalid task ID. Please enter a number.")
            return

        if self.task_manager.mark_incomplete(task_id):
            print(f"Task with ID {task_id} marked as incomplete.")
        else:
            print(f"No task found with ID {task_id} or failed to update.")

    def run(self) -> None:
        """Run the main application loop."""
        print("Welcome to the Todo List Manager!")
        print("Manage your tasks efficiently with this simple CLI tool.")

        while True:
            self.display_menu()
            choice = self.capture_input("Select an option (1-7): ")

            if choice == "1":
                self.handle_add_task()
            elif choice == "2":
                self.handle_view_tasks()
            elif choice == "3":
                self.handle_update_task()
            elif choice == "4":
                self.handle_delete_task()
            elif choice == "5":
                self.handle_mark_complete()
            elif choice == "6":
                self.handle_mark_incomplete()
            elif choice == "7" or choice.lower() in ["q", "quit", "exit"]:
                print("Thank you for using the Todo List Manager. Goodbye!")
                sys.exit(0)
            else:
                print("Invalid option. Please select a number between 1 and 7.")