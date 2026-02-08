#!/usr/bin/env python3
"""Simple script to run database initialization."""
import os
import sys
import subprocess

# Run the database initialization script
if __name__ == "__main__":
    # Change to the backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)

    # Run the initialization script
    result = subprocess.run([sys.executable, "scripts/init_neon_tables.py"])

    if result.returncode == 0:
        print("\n+ Database initialization completed successfully!")
    else:
        print(f"\n- Database initialization failed with return code: {result.returncode}")
        sys.exit(result.returncode)