"""
Utilities for visualizing automated tests.
This module provides functions to highlight elements, show progress,
and take screenshots during tests.
"""
import os
import time
from datetime import datetime
from playwright.async_api import Page


class VisualHelper:
    """
    Helper class for visualizing automated tests.
    """
    
    def __init__(self, page: Page):
        """
        Initialize the helper with a Playwright page.
        
        Args:
            page: Playwright Page instance
        """
        self.page = page
        self.screenshots_dir = os.path.join("test-results", "screenshots")
        
        # Create directory for screenshots if it doesn't exist
        os.makedirs(self.screenshots_dir, exist_ok=True)
    
    async def highlight_element(self, selector: str, duration: int = 1000):
        """
        Highlight an element on the page with a red border.
        
        Args:
            selector: CSS selector of the element to highlight
            duration: Duration of the highlight in milliseconds
        """
        await self.page.evaluate("""(selector, duration) => {
            const element = document.querySelector(selector);
            if (element) {
                // Save original style
                const originalStyle = element.getAttribute('style') || '';
                
                // Add red border
                element.setAttribute('style', `${originalStyle}; outline: 3px solid red; outline-offset: 2px;`);
                
                // Restore original style after specified duration
                setTimeout(() => {
                    element.setAttribute('style', originalStyle);
                }, duration);
            }
        }""", selector, duration)
        
        # Wait a moment for the highlight to be visible
        await self.page.wait_for_timeout(duration)
    
    async def show_progress(self, step: int, total_steps: int, message: str):
        """
        Show a progress indicator in the top right corner.
        
        Args:
            step: Current step
            total_steps: Total number of steps
            message: Message to display
        """
        await self.page.evaluate("""({ step, totalSteps, message }) => {
            // Check if indicator already exists
            let progressIndicator = document.getElementById('test-progress-indicator');
            
            if (!progressIndicator) {
                // Create indicator if it doesn't exist
                progressIndicator = document.createElement('div');
                progressIndicator.id = 'test-progress-indicator';
                progressIndicator.style.position = 'fixed';
                progressIndicator.style.top = '10px';
                progressIndicator.style.right = '10px';
                progressIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                progressIndicator.style.color = 'white';
                progressIndicator.style.padding = '10px';
                progressIndicator.style.borderRadius = '5px';
                progressIndicator.style.zIndex = '9999';
                progressIndicator.style.fontSize = '14px';
                progressIndicator.style.fontFamily = 'Arial, sans-serif';
                document.body.appendChild(progressIndicator);
            }
            
            // Update indicator content
            progressIndicator.innerHTML = `
                <div>Progress: ${step}/${totalSteps}</div>
                <div style="margin-top: 5px; font-weight: bold;">${message}</div>
                <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                    <div style="width: ${(step / totalSteps) * 100}%; background-color: #4F46E5; height: 100%; border-radius: 3px;"></div>
                </div>
            `;
        }""", {"step": step, "totalSteps": total_steps, "message": message})
    
    async def take_screenshot(self, name: str):
        """
        Take a screenshot with a specific name.
        
        Args:
            name: Base name for the screenshot
        
        Returns:
            Path to the screenshot
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.png"
        filepath = os.path.join(self.screenshots_dir, filename)
        
        await self.page.screenshot(path=filepath, full_page=True)
        return filepath
    
    async def remove_progress_indicator(self):
        """
        Remove the progress indicator from the page.
        """
        await self.page.evaluate("""() => {
            const progressIndicator = document.getElementById('test-progress-indicator');
            if (progressIndicator) {
                progressIndicator.remove();
            }
        }""")
