"""
Skrip pengujian sederhana untuk fungsionalitas login Proker Tracker.
"""
import os
import sys
import asyncio
import datetime
from playwright.async_api import async_playwright

# Buat direktori hasil pengujian jika belum ada
os.makedirs("test-results", exist_ok=True)
os.makedirs("test-results/screenshots", exist_ok=True)

async def main():
    """Fungsi utama untuk menjalankan pengujian login."""
    print("Memulai pengujian login...")
    
    # Catat langkah-langkah pengujian
    langkah = []
    screenshots = []
    
    try:
        async with async_playwright() as p:
            # Luncurkan browser dengan mode headless=False agar bisa dilihat
            browser = await p.chromium.launch(headless=False)
            
            # Buat konteks browser baru
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Navigasi ke halaman login
            print("Langkah 1: Navigasi ke halaman login...")
            langkah.append("Navigasi ke halaman login")
            await page.goto("http://localhost:3000/login", wait_until="load")
            await page.wait_for_load_state("networkidle")
            
            # Ambil screenshot setelah navigasi
            screenshot_path = f"test-results/screenshots/login-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Langkah 2: Masukkan email
            print("Langkah 2: Memasukkan email...")
            langkah.append("Memasukkan email")
            
            # Highlight elemen email untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalStyle = element.getAttribute('style') || '';
                        element.setAttribute('style', originalStyle + '; border: 2px solid red; background-color: rgba(255, 0, 0, 0.1);');
                        setTimeout(() => {
                            element.setAttribute('style', originalStyle);
                        }, 1000);
                    }
                }
            """, "#email")
            
            await page.fill("#email", "23091397164@student.unesa.ac.id")
            await asyncio.sleep(1)  # Jeda singkat untuk visualisasi
            
            # Langkah 3: Masukkan password
            print("Langkah 3: Memasukkan password...")
            langkah.append("Memasukkan password")
            
            # Highlight elemen password untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalStyle = element.getAttribute('style') || '';
                        element.setAttribute('style', originalStyle + '; border: 2px solid red; background-color: rgba(255, 0, 0, 0.1);');
                        setTimeout(() => {
                            element.setAttribute('style', originalStyle);
                        }, 1000);
                    }
                }
            """, "#password")
            
            await page.fill("#password", "23091397164")
            await asyncio.sleep(1)  # Jeda singkat untuk visualisasi
            
            # Langkah 4: Klik tombol login
            print("Langkah 4: Mengklik tombol login...")
            langkah.append("Mengklik tombol login")
            
            # Highlight tombol login untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalStyle = element.getAttribute('style') || '';
                        element.setAttribute('style', originalStyle + '; border: 2px solid red; background-color: rgba(255, 0, 0, 0.1);');
                        setTimeout(() => {
                            element.setAttribute('style', originalStyle);
                        }, 1000);
                    }
                }
            """, "button[type='submit']")
            
            await page.click("button[type='submit']")
            
            # Tunggu hasil login (berhasil atau pesan error)
            await page.wait_for_function("""
                () => {
                    return window.location.pathname.includes('/dashboard') || 
                           document.querySelector('[class*="bg-destructive"]') !== null;
                }
            """, timeout=10000)
            
            # Ambil screenshot setelah login
            screenshot_path = f"test-results/screenshots/after-login-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Periksa hasil login
            is_at_dashboard = await page.evaluate("window.location.pathname.includes('/dashboard')")
            
            if is_at_dashboard:
                print("Login berhasil. Diarahkan ke dashboard.")
                langkah.append("Login berhasil")
            else:
                error_message = await page.evaluate("""
                    () => {
                        const errorElement = document.querySelector('[class*="bg-destructive"]');
                        return errorElement ? errorElement.textContent.trim() : 'Pesan error tidak ditemukan';
                    }
                """)
                print(f"Login gagal. Pesan error: {error_message}")
                langkah.append(f"Login gagal: {error_message}")
            
            # Tutup browser
            await browser.close()
            
            # Buat laporan pengujian
            buat_laporan_html(langkah, screenshots)
            
    except Exception as e:
        print(f"Error selama pengujian login: {e}")
        langkah.append(f"Error: {e}")
        buat_laporan_html(langkah, screenshots, error=str(e))


def buat_laporan_html(langkah, screenshots, error=None):
    """Buat laporan HTML untuk hasil pengujian."""
    waktu_sekarang = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    nama_file = f"test-results/login-test-report-{waktu_sekarang}.html"
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Login Proker Tracker</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                color: #333;
            }}
            .container {{
                max-width: 1000px;
                margin: 0 auto;
                background: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }}
            h1, h2, h3 {{
                color: #2c3e50;
            }}
            .header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }}
            .status {{
                padding: 5px 10px;
                border-radius: 3px;
                font-weight: bold;
            }}
            .success {{
                background-color: #d4edda;
                color: #155724;
            }}
            .failure {{
                background-color: #f8d7da;
                color: #721c24;
            }}
            .steps {{
                margin-bottom: 20px;
            }}
            .step {{
                padding: 10px;
                margin-bottom: 5px;
                background-color: #f1f1f1;
                border-left: 3px solid #2c3e50;
            }}
            .screenshots {{
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }}
            .screenshot {{
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
            }}
            .screenshot img {{
                max-width: 100%;
                height: auto;
                border-radius: 3px;
            }}
            .error {{
                background-color: #f8d7da;
                color: #721c24;
                padding: 10px;
                border-radius: 3px;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Laporan Pengujian Login Proker Tracker</h1>
                <div>
                    <span class="status {'failure' if error else 'success'}">
                        {('GAGAL' if error else 'BERHASIL')}
                    </span>
                </div>
                <div>
                    <h3>Tanggal & Waktu</h3>
                    <div>{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
                </div>
            </div>
            
            <h2>Langkah-langkah Pengujian</h2>
            <div class="steps">
    """
    
    for i, step in enumerate(langkah, 1):
        html_content += f'<div class="step">Langkah {i}: {step}</div>\n'
    
    html_content += """
            </div>
            
            <h2>Screenshot</h2>
            <div class="screenshots">
    """
    
    for i, screenshot in enumerate(screenshots, 1):
        html_content += f"""
            <div class="screenshot">
                <h3>Screenshot {i}</h3>
                <img src="../{screenshot}" alt="Screenshot {i}">
            </div>
        """
    
    if error:
        html_content += f"""
            <div class="error">
                <h3>Error</h3>
                <pre>{error}</pre>
            </div>
        """
    
    html_content += """
            </div>
        </div>
    </body>
    </html>
    """
    
    with open(nama_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Laporan pengujian dibuat: {nama_file}")
    return nama_file


if __name__ == "__main__":
    asyncio.run(main())
