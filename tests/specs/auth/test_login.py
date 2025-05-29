"""
Test cases for the login functionality.
"""
import time
import pytest
import asyncio
from playwright.async_api import async_playwright, Page

# Configure pytest to handle asyncio tests
pytest_plugins = ['pytest_asyncio']

from tests.pages.login_page import LoginPage
from tests.utils.visual_helper import VisualHelper
from tests.utils.test_reporter import TestReporter
from tests.fixtures.auth_data import LOGIN_TEST_DATA


@pytest.mark.asyncio
async def test_login_with_valid_credentials():
    """
    Test login with valid credentials.
    Verifies that a user can successfully log in with valid credentials.
    """
    # Initialize test reporter
    reporter = TestReporter()
    
    # Test steps for reporting
    steps = [
        "Navigate to the login page",
        "Enter valid email",
        "Enter valid password",
        "Click the login button",
        "Verify redirection to dashboard"
    ]
    
    # Start time for duration calculation
    start_time = time.time()
    
    # Test data
    test_data = LOGIN_TEST_DATA["valid_credentials"]
    screenshots = []
    error = None
    
    try:
        async with async_playwright() as playwright:
            # Launch browser with headless=False to see the browser window
            browser = await playwright.chromium.launch(headless=False)
            
            # Create a new browser context
            context = await browser.new_context(
                viewport={"width": 1280, "height": 720}
            )
            
            # Create a new page
            page = await context.new_page()
            
            # Initialize login page
            login_page = LoginPage(page)
            
            # Navigate to login page
            await login_page.navigate()
            
            # Take screenshot after navigation
            screenshot_path = await login_page.visual_helper.take_screenshot("login-page")
            screenshots.append(screenshot_path)
            
            # Perform login
            await login_page.login(test_data["email"], test_data["password"])
            
            # Wait for navigation to complete
            await page.wait_for_load_state("networkidle")
            
            # Take screenshot after login attempt
            screenshot_path = await login_page.visual_helper.take_screenshot("after-login")
            screenshots.append(screenshot_path)
            
            # Verify redirection to dashboard
            is_at_dashboard = await login_page.is_at_dashboard()
            assert is_at_dashboard, "User was not redirected to dashboard after login"
            
            # Close the browser
            await browser.close()
            
            # Test passed
            status = "success"
            
    except Exception as e:
        # Test failed
        status = "failure"
        error = str(e)
        print(f"Test failed: {e}")
    
    # Calculate test duration
    end_time = time.time()
    duration = int((end_time - start_time) * 1000)  # Convert to milliseconds
    
    # Add test result to reporter
    reporter.add_test_result(
        name="Login with valid credentials",
        status=status,
        duration=duration,
        steps=steps,
        screenshots=screenshots,
        error=error
    )
    
    # Save report
    report_path = reporter.save_report()
    print(f"Test report saved to: {report_path}")
    
    # Show report in browser if test failed
    if status == "failure":
        await reporter.show_report()
    
    # Assert test passed
    assert status == "success", f"Test failed: {error}"


@pytest.mark.asyncio
async def test_login_with_invalid_password():
    """
    Test login with invalid password.
    Verifies that an error message is displayed when logging in with an invalid password.
    """
    # Initialize test reporter
    reporter = TestReporter()
    
    # Test steps for reporting
    steps = [
        "Navigate to the login page",
        "Enter valid email",
        "Enter invalid password",
        "Click the login button",
        "Verify error message is displayed"
    ]
    
    # Start time for duration calculation
    start_time = time.time()
    
    # Test data
    test_data = LOGIN_TEST_DATA["invalid_password"]
    screenshots = []
    error = None
    
    try:
        async with async_playwright() as playwright:
            # Launch browser with headless=False to see the browser window
            browser = await playwright.chromium.launch(headless=False)
            
            # Create a new browser context
            context = await browser.new_context(
                viewport={"width": 1280, "height": 720}
            )
            
            # Create a new page
            page = await context.new_page()
            
            # Initialize login page
            login_page = LoginPage(page)
            
            # Navigate to login page
            await login_page.navigate()
            
            # Take screenshot after navigation
            screenshot_path = await login_page.visual_helper.take_screenshot("invalid-password-login-page")
            screenshots.append(screenshot_path)
            
            # Perform login
            await login_page.login(test_data["email"], test_data["password"])
            
            # Wait for error message to appear
            await page.wait_for_load_state("networkidle")
            
            # Take screenshot after login attempt
            screenshot_path = await login_page.visual_helper.take_screenshot("invalid-password-after-login")
            screenshots.append(screenshot_path)
            
            # Verify error message is displayed
            is_error_visible = await login_page.is_error_visible()
            assert is_error_visible, "Error message was not displayed after login with invalid password"
            
            # Verify error message content
            error_message = await login_page.get_error_message()
            assert test_data["expected_error"] in error_message, f"Expected error message '{test_data['expected_error']}' not found in '{error_message}'"
            
            # Close the browser
            await browser.close()
            
            # Test passed
            status = "success"
            
    except Exception as e:
        # Test failed
        status = "failure"
        error = str(e)
        print(f"Test failed: {e}")
    
    # Calculate test duration
    end_time = time.time()
    duration = int((end_time - start_time) * 1000)  # Convert to milliseconds
    
    # Add test result to reporter
    reporter.add_test_result(
        name="Login with invalid password",
        status=status,
        duration=duration,
        steps=steps,
        screenshots=screenshots,
        error=error
    )
    
    # Save report
    report_path = reporter.save_report()
    print(f"Test report saved to: {report_path}")
    
    # Show report in browser if test failed
    if status == "failure":
        await reporter.show_report()
    
    # Assert test passed
    assert status == "success", f"Test failed: {error}"
