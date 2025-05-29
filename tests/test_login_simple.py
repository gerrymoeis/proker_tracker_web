"""
Simple test script to verify the login functionality.
This script uses Playwright to test the login process with visual feedback.
"""
import os
import sys
import asyncio
import datetime
from playwright.async_api import async_playwright

# Create test results directory if it doesn't exist
os.makedirs("test-results/screenshots", exist_ok=True)

async def test_login():
    """
    Test the login functionality with visual feedback.
    """
    print("Starting login test...")
    
    async with async_playwright() as playwright:
        # Launch browser with headless=False to see the browser window
        browser = await playwright.chromium.launch(headless=False)
        
        # Create a new browser context
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720}
        )
        
        # Create a new page
        page = await context.new_page()
        
        # Step 1: Navigate to login page
        print("Step 1: Navigating to login page...")
        await page.goto("http://localhost:3000/login")
        
        # Add visual indicator for test progress
        await page.evaluate("""() => {
            const indicator = document.createElement('div');
            indicator.id = 'test-progress-indicator';
            indicator.style.position = 'fixed';
            indicator.style.top = '10px';
            indicator.style.right = '10px';
            indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            indicator.style.color = 'white';
            indicator.style.padding = '10px';
            indicator.style.borderRadius = '5px';
            indicator.style.zIndex = '9999';
            indicator.style.fontSize = '14px';
            indicator.style.fontFamily = 'Arial, sans-serif';
            indicator.innerHTML = `
                <div>Test Progress: 1/4</div>
                <div style="margin-top: 5px; font-weight: bold;">Navigating to login page</div>
                <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                    <div style="width: 25%; background-color: #4F46E5; height: 100%; border-radius: 3px;"></div>
                </div>
            `;
            document.body.appendChild(indicator);
        }""")
        
        # Take screenshot of login page
        await page.screenshot(path="test-results/screenshots/login-page.png")
        
        # Step 2: Enter email
        print("Step 2: Entering email...")
        await page.evaluate("""() => {
            document.getElementById('test-progress-indicator').innerHTML = `
                <div>Test Progress: 2/4</div>
                <div style="margin-top: 5px; font-weight: bold;">Entering email</div>
                <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                    <div style="width: 50%; background-color: #4F46E5; height: 100%; border-radius: 3px;"></div>
                </div>
            `;
        }""")
        
        # Highlight email field
        await page.evaluate("""() => {
            const element = document.querySelector('#email');
            if (element) {
                const originalStyle = element.getAttribute('style') || '';
                element.setAttribute('style', `${originalStyle}; outline: 3px solid red; outline-offset: 2px;`);
                setTimeout(() => {
                    element.setAttribute('style', originalStyle);
                }, 1000);
            }
        }""")
        
        await page.fill('#email', 'admin@example.com')
        await page.wait_for_timeout(1000)  # Wait for visual feedback
        
        # Step 3: Enter password
        print("Step 3: Entering password...")
        await page.evaluate("""() => {
            document.getElementById('test-progress-indicator').innerHTML = `
                <div>Test Progress: 3/4</div>
                <div style="margin-top: 5px; font-weight: bold;">Entering password</div>
                <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                    <div style="width: 75%; background-color: #4F46E5; height: 100%; border-radius: 3px;"></div>
                </div>
            `;
        }""")
        
        # Highlight password field
        await page.evaluate("""() => {
            const element = document.querySelector('#password');
            if (element) {
                const originalStyle = element.getAttribute('style') || '';
                element.setAttribute('style', `${originalStyle}; outline: 3px solid red; outline-offset: 2px;`);
                setTimeout(() => {
                    element.setAttribute('style', originalStyle);
                }, 1000);
            }
        }""")
        
        await page.fill('#password', 'password123')
        await page.wait_for_timeout(1000)  # Wait for visual feedback
        
        # Take screenshot before clicking login
        await page.screenshot(path="test-results/screenshots/login-form-filled.png")
        
        # Step 4: Click login button
        print("Step 4: Clicking login button...")
        await page.evaluate("""() => {
            document.getElementById('test-progress-indicator').innerHTML = `
                <div>Test Progress: 4/4</div>
                <div style="margin-top: 5px; font-weight: bold;">Clicking login button</div>
                <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                    <div style="width: 100%; background-color: #4F46E5; height: 100%; border-radius: 3px;"></div>
                </div>
            `;
        }""")
        
        # Highlight login button
        await page.evaluate("""() => {
            const element = document.querySelector('button[type="submit"]');
            if (element) {
                const originalStyle = element.getAttribute('style') || '';
                element.setAttribute('style', `${originalStyle}; outline: 3px solid red; outline-offset: 2px;`);
                setTimeout(() => {
                    element.setAttribute('style', originalStyle);
                }, 1000);
            }
        }""")
        
        await page.wait_for_timeout(1000)  # Wait for visual feedback
        
        # Click login button
        await page.click('button[type="submit"]')
        
        # Wait for navigation to complete
        try:
            # Wait for either dashboard navigation or error message
            await page.wait_for_function("""
                () => {
                    return window.location.pathname.includes('/dashboard') || 
                           document.querySelector('[class*="bg-destructive"]') !== null;
                }
            """, timeout=10000)
            
            # Check if login was successful
            current_url = page.url
            if '/dashboard' in current_url:
                print("Login successful! Redirected to dashboard.")
                
                # Update progress indicator with success message
                await page.evaluate("""() => {
                    document.getElementById('test-progress-indicator').innerHTML = `
                        <div>Test Completed</div>
                        <div style="margin-top: 5px; font-weight: bold; color: #10B981;">Login Successful!</div>
                        <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                            <div style="width: 100%; background-color: #10B981; height: 100%; border-radius: 3px;"></div>
                        </div>
                    `;
                }""")
                
                # Take screenshot of dashboard
                await page.screenshot(path="test-results/screenshots/dashboard-after-login.png")
                
                # Generate test report
                await generate_test_report(page, True)
            else:
                print("Login failed. Error message displayed.")
                
                # Update progress indicator with failure message
                await page.evaluate("""() => {
                    document.getElementById('test-progress-indicator').innerHTML = `
                        <div>Test Completed</div>
                        <div style="margin-top: 5px; font-weight: bold; color: #EF4444;">Login Failed!</div>
                        <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                            <div style="width: 100%; background-color: #EF4444; height: 100%; border-radius: 3px;"></div>
                        </div>
                    `;
                }""")
                
                # Take screenshot of error message
                await page.screenshot(path="test-results/screenshots/login-error.png")
                
                # Generate test report
                await generate_test_report(page, False)
        except Exception as e:
            print(f"Error during login test: {e}")
            
            # Update progress indicator with error message
            await page.evaluate("""() => {
                document.getElementById('test-progress-indicator').innerHTML = `
                    <div>Test Error</div>
                    <div style="margin-top: 5px; font-weight: bold; color: #EF4444;">Error during test!</div>
                    <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
                        <div style="width: 100%; background-color: #EF4444; height: 100%; border-radius: 3px;"></div>
                    </div>
                `;
            }""")
            
            # Take screenshot of error state
            await page.screenshot(path="test-results/screenshots/login-test-error.png")
            
            # Generate test report
            await generate_test_report(page, False, str(e))
        
        # Wait for a moment to see the final state
        await page.wait_for_timeout(3000)
        
        # Close the browser
        await browser.close()

async def generate_test_report(page, success, error_message=None):
    """
    Generate a simple test report page.
    
    Args:
        page: Playwright page object
        success: Whether the test was successful
        error_message: Optional error message
    """
    # Create a new page for the report
    context = page.context
    report_page = await context.new_page()
    
    # Generate HTML for the report
    status = "Success" if success else "Failure"
    status_color = "#10B981" if success else "#EF4444"
    
    error_html = ""
    if error_message:
        error_html = f"""
            <div class="error-message">
                <h3>Error Message:</h3>
                <p>{error_message}</p>
            </div>
        """
    
    report_html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Test Report</title>
            <style>
                body {{
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f7fa;
                }}
                h1, h2, h3 {{
                    color: #0F52BA;
                }}
                .summary {{
                    display: flex;
                    gap: 20px;
                    margin-bottom: 30px;
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .status {{
                    font-size: 24px;
                    font-weight: bold;
                    color: {status_color};
                }}
                .steps {{
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .step {{
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }}
                .step:last-child {{
                    border-bottom: none;
                }}
                .screenshots {{
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .screenshot {{
                    margin-bottom: 20px;
                }}
                .screenshot img {{
                    max-width: 100%;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }}
                .error-message {{
                    background: #FEF2F2;
                    border: 1px solid #EF4444;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                    color: #B91C1C;
                }}
            </style>
        </head>
        <body>
            <h1>Login Test Report</h1>
            
            <div class="summary">
                <div>
                    <h3>Test Status</h3>
                    <div class="status">{status}</div>
                </div>
                <div>
                    <h3>Date & Time</h3>
                    <div>{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
                </div>
            </div>
            
            {error_html}
            
            <div class="steps">
                <h2>Test Steps</h2>
                <div class="step">
                    <h3>Step 1: Navigate to Login Page</h3>
                    <p>Navigated to http://localhost:3000/login</p>
                </div>
                <div class="step">
                    <h3>Step 2: Enter Email</h3>
                    <p>Entered email: admin@example.com</p>
                </div>
                <div class="step">
                    <h3>Step 3: Enter Password</h3>
                    <p>Entered password: ******</p>
                </div>
                <div class="step">
                    <h3>Step 4: Click Login Button</h3>
                    <p>Clicked the login button</p>
                </div>
                <div class="step">
                    <h3>Step 5: Verify Result</h3>
                    <p>Result: {status}</p>
                </div>
            </div>
            
            <div class="screenshots">
                <h2>Screenshots</h2>
                <div class="screenshot">
                    <h3>Login Page</h3>
                    <img src="screenshots/login-page.png" alt="Login Page">
                </div>
                <div class="screenshot">
                    <h3>Login Form Filled</h3>
                    <img src="screenshots/login-form-filled.png" alt="Login Form Filled">
                </div>
                <div class="screenshot">
                    <h3>After Login Attempt</h3>
                    <img src="screenshots/{('dashboard-after-login.png' if success else 'login-error.png')}" alt="After Login">
                </div>
            </div>
        </body>
        </html>
    """
    
    # Set the content of the report page
    await report_page.set_content(report_html)
    
    # Save the report
    await report_page.pdf(path="test-results/login-test-report.pdf")
    
    print(f"Test report generated: test-results/login-test-report.pdf")

# Run the test when script is executed directly
if __name__ == "__main__":
    asyncio.run(test_login())
