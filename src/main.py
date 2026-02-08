#!/usr/bin/env python3
"""
Main entry point for the CLI Todo App.

This module initializes and runs the command-line interface for the todo application.
"""

from ui.cli import CLI


def main():
    """Main function to run the Todo App."""
    try:
        cli = CLI()
        cli.run()
    except KeyboardInterrupt:
        print("\n\nApplication interrupted by user. Goodbye!")
        exit(0)
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")
        print("Please try again or contact support if the problem persists.")
        exit(1)


if __name__ == "__main__":
    main()