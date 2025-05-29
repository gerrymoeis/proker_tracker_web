"""
Page model for the login page.
Implements the Page Object Model (POM) pattern to encapsulate
the interaction with the login page.
"""
from playwright.async_api import Page
from ..utils.visual_helper import VisualHelper


class LoginPage:
    """
    Class that represents the login page.
    """
    
    # URL of the login page
    BASE_URL = "http://localhost:3000"
    LOGIN_URL = "/login"
    
    # Selectors for elements on the page
    EMAIL_INPUT = "#email"
    PASSWORD_INPUT = "#password"
    LOGIN_BUTTON = "button[type='submit']"
    ERROR_MESSAGE = "[class*='bg-destructive']"
    LOGO = "img[alt='Proker Tracker Logo']"
    
    def __init__(self, page: Page):
        """
        Initialize the login page.
        
        Args:
            page: Playwright Page instance
        """
        self.page = page
        self.visual_helper = VisualHelper(page)
    
    async def navigate(self):
        """Navigate to the login page."""
        full_url = f"{self.BASE_URL}{self.LOGIN_URL}"
        await self.page.goto(full_url, wait_until="load")
        await self.visual_helper.show_progress("Navigating to login page")
        await self.page.wait_for_load_state("networkidle")
    
    async def login(self, email: str, password: str):
        """
        Perform the login process.
        
        Args:
            email: User email
            password: User password
        """
        # Highlight and fill email field
        await self.visual_helper.show_progress(2, 5, "Entering email")
        await self.visual_helper.highlight_element(self.EMAIL_INPUT)
        await self.page.fill(self.EMAIL_INPUT, email)
        
        # Highlight and fill password field
        await self.visual_helper.show_progress(3, 5, "Entering password")
        await self.visual_helper.highlight_element(self.PASSWORD_INPUT)
        await self.page.fill(self.PASSWORD_INPUT, password)
        
        # Highlight and click login button
        await self.visual_helper.show_progress(4, 5, "Clicking login button")
        await self.visual_helper.highlight_element(self.LOGIN_BUTTON)
        
        # Take screenshot before clicking
        await self.visual_helper.take_screenshot("login-before-click")
        
        # Click login button
        await self.page.click(self.LOGIN_BUTTON)
        
        # Wait for navigation to complete or error message to appear
        await self.visual_helper.show_progress(5, 5, "Verifying login result")
        
        try:
            # Wait for redirection to dashboard or error message to appear
            await self.page.wait_for_function("""
                () => {
                    return window.location.pathname.includes('/dashboard') || 
                           document.querySelector('.bg-destructive\/15') !== null;
                }
            """, timeout=10000)
        except Exception as e:
            print(f"Error waiting for redirection or error message: {e}")
        
        # Take screenshot after login
        await self.visual_helper.take_screenshot("login-after-click")
    
    async def is_error_visible(self) -> bool:
        """
        Check if an error message is visible.
        
        Returns:
            True if an error message is visible, False otherwise
        """
        return await self.page.is_visible(self.ERROR_MESSAGE)
    
    async def get_error_message(self) -> str:
        """
        Get the text of the error message.
        
        Returns:
            Error message text or empty string if no error
        """
        if await self.is_error_visible():
            return await self.page.text_content(self.ERROR_MESSAGE)
        return ""
    
    async def is_at_dashboard(self) -> bool:
        """
        Check if redirected to dashboard.
        
        Returns:
            True if redirected to dashboard, False otherwise
        """
        return self.page.url.endswith("/dashboard")
