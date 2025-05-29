"""
Main script to run automated tests with Playwright.
This script provides a convenient way to run tests with visual feedback
and comprehensive reporting.
"""
import os
import sys
import argparse
import asyncio
import pytest
from datetime import datetime


def ensure_test_directories():
    """
    Ensure that all necessary directories for test results exist.
    """
    dirs = [
        "test-results",
        "test-results/screenshots",
        "test-results/reports",
        "test-results/videos"
    ]
    
    for directory in dirs:
        os.makedirs(directory, exist_ok=True)
    
    print("Test directories created/verified.")


def run_tests(test_path=None, headless=False):
    """
    Run the specified tests using pytest.
    
    Args:
        test_path: Path to specific test file or directory
        headless: Whether to run tests in headless mode
    """
    # Set environment variables for test configuration
    os.environ["PLAYWRIGHT_HEADLESS"] = str(headless).lower()
    
    # Build pytest arguments
    pytest_args = [
        "-v"                  # Verbose output
    ]
    
    # Add test path if specified
    if test_path:
        pytest_args.append(test_path)
    else:
        pytest_args.append("specs")  # Default to all specs
    
    # Run tests with pytest
    print(f"Running tests with arguments: {pytest_args}")
    result = pytest.main(pytest_args)
    
    return result


def main():
    """
    Main entry point for the test runner.
    """
    parser = argparse.ArgumentParser(description="Run automated tests for Proker Tracker")
    
    parser.add_argument(
        "--test", 
        help="Specific test file or directory to run (default: all tests)",
        default=None
    )
    
    parser.add_argument(
        "--headless",
        help="Run tests in headless mode (no browser UI)",
        action="store_true",
        default=False
    )
    
    args = parser.parse_args()
    
    # Print test run information
    print("=" * 80)
    print(f"Proker Tracker Automated Tests - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    print(f"Test path: {args.test or 'All tests'}")
    print(f"Headless mode: {'Enabled' if args.headless else 'Disabled'}")
    print("-" * 80)
    
    # Ensure test directories exist
    ensure_test_directories()
    
    # Run tests
    result = run_tests(args.test, args.headless)
    
    # Print summary
    print("=" * 80)
    print(f"Test run completed with exit code: {result}")
    print("=" * 80)
    
    return result


if __name__ == "__main__":
    sys.exit(main())
