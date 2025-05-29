"""
Simple script to run the login tests directly.
This avoids the import issues by importing the test functions directly.
"""
import os
import sys
import asyncio
import pytest
from datetime import datetime

# Add the parent directory to the Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import the test functions directly
from specs.auth.test_login import test_login_with_valid_credentials, test_login_with_invalid_password

async def run_tests():
    """Run the login tests directly."""
    print("=" * 80)
    print(f"Proker Tracker Login Tests - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Ensure test directories exist
    os.makedirs("test-results", exist_ok=True)
    os.makedirs("test-results/screenshots", exist_ok=True)
    os.makedirs("test-results/reports", exist_ok=True)
    
    print("Running test_login_with_valid_credentials...")
    try:
        await test_login_with_valid_credentials()
        print("[PASS] Valid credentials test passed")
    except Exception as e:
        print(f"[FAIL] Valid credentials test failed: {e}")
    
    print("\nRunning test_login_with_invalid_password...")
    try:
        await test_login_with_invalid_password()
        print("[PASS] Invalid password test passed")
    except Exception as e:
        print(f"[FAIL] Invalid password test failed: {e}")
    
    print("=" * 80)
    print("Tests completed")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_tests())
