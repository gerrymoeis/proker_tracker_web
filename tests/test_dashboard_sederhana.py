"""
Skrip pengujian sederhana untuk fungsionalitas dashboard Proker Tracker.
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
    """Fungsi utama untuk menjalankan pengujian dashboard."""
    print("Memulai pengujian dashboard...")
    
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
            
            # Langkah 1: Login terlebih dahulu
            print("Langkah 1: Login terlebih dahulu...")
            langkah.append("Login terlebih dahulu")
            await page.goto("http://localhost:3000/login", wait_until="load")
            await page.wait_for_load_state("networkidle")
            
            # Highlight dan isi kolom email
            await highlight_element(page, "#email")
            await page.fill("#email", "23091397164@student.unesa.ac.id")
            await asyncio.sleep(1)
            
            # Highlight dan isi kolom password
            await highlight_element(page, "#password")
            await page.fill("#password", "23091397164")
            await asyncio.sleep(1)
            
            # Highlight dan klik tombol login
            await highlight_element(page, "button[type='submit']")
            await page.click("button[type='submit']")
            
            # Tunggu hasil login
            try:
                # Coba tunggu navigasi ke dashboard
                await page.wait_for_url("**/dashboard", timeout=5000)
                print("Login berhasil, diarahkan ke dashboard.")
                langkah.append("Login berhasil")
            except Exception:
                # Jika gagal, cek apakah ada pesan error
                error_visible = await page.is_visible('[class*="bg-destructive"]')
                if error_visible:
                    error_message = await page.text_content('[class*="bg-destructive"]')
                    print(f"Login gagal. Pesan error: {error_message}")
                    langkah.append(f"Login gagal: {error_message}")
                    
                    # Ambil screenshot dari halaman error
                    screenshot_path = f"test-results/screenshots/login-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Buat laporan dan keluar karena tidak bisa melanjutkan ke dashboard
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat melanjutkan pengujian dashboard karena login gagal")
                    await browser.close()
                    return
            
            # Langkah 2: Verifikasi elemen-elemen di dashboard
            print("Langkah 2: Verifikasi elemen-elemen di dashboard...")
            langkah.append("Verifikasi elemen-elemen di dashboard")
            
            # Ambil screenshot dashboard
            screenshot_path = f"test-results/screenshots/dashboard-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Verifikasi judul halaman
            page_title = await page.title()
            print(f"Judul halaman: {page_title}")
            langkah.append(f"Judul halaman: {page_title}")
            
            # Verifikasi elemen-elemen penting di dashboard
            elements_to_check = [
                {"selector": "h1", "name": "Dashboard"},
                {"selector": "h3", "name": "Program Kerja Terbaru"}
            ]
            
            for element in elements_to_check:
                try:
                    await highlight_element(page, element["selector"])
                    is_visible = await page.is_visible(element["selector"])
                    if is_visible:
                        print(f"{element['name']} terlihat di halaman")
                        langkah.append(f"{element['name']} terlihat di halaman")
                    else:
                        print(f"{element['name']} tidak terlihat di halaman")
                        langkah.append(f"{element['name']} tidak terlihat di halaman")
                except Exception as e:
                    print(f"Error saat memeriksa {element['name']}: {e}")
                    langkah.append(f"Error saat memeriksa {element['name']}: {e}")
            
            # Langkah 3: Coba klik salah satu program kerja (jika ada)
            print("Langkah 3: Coba klik salah satu program kerja...")
            langkah.append("Coba klik salah satu program kerja")
            
            try:
                proker_item = await page.query_selector("h3")
                if proker_item:
                    await highlight_element(page, "h3")
                    await proker_item.click()
                    await page.wait_for_load_state("networkidle")
                    
                    # Ambil screenshot setelah klik program kerja
                    screenshot_path = f"test-results/screenshots/proker-detail-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    print("Berhasil membuka detail program kerja")
                    langkah.append("Berhasil membuka detail program kerja")
                else:
                    print("Tidak ada program kerja yang tersedia untuk diklik")
                    langkah.append("Tidak ada program kerja yang tersedia untuk diklik")
            except Exception as e:
                print(f"Error saat mencoba klik program kerja: {e}")
                langkah.append(f"Error saat mencoba klik program kerja: {e}")
            
            # Tutup browser
            await browser.close()
            
            # Buat laporan pengujian
            buat_laporan_html(langkah, screenshots)
            
    except Exception as e:
        print(f"Error selama pengujian dashboard: {e}")
        langkah.append(f"Error: {e}")
        buat_laporan_html(langkah, screenshots, error=str(e))


async def highlight_element(page, selector, duration=1000):
    """Highlight elemen pada halaman untuk visualisasi."""
    await page.evaluate("""
        (selector, duration) => {
            const element = document.querySelector(selector);
            if (element) {
                const originalStyle = element.getAttribute('style') || '';
                element.setAttribute('style', originalStyle + '; border: 2px solid red; background-color: rgba(255, 0, 0, 0.1);');
                setTimeout(() => {
                    element.setAttribute('style', originalStyle);
                }, duration);
            }
        }
    """, selector, duration)
    await asyncio.sleep(duration / 1000)  # Tunggu selama durasi highlight


def buat_laporan_html(langkah, screenshots, error=None):
    """Buat laporan HTML untuk hasil pengujian."""
    waktu_sekarang = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    nama_file = f"test-results/dashboard-test-report-{waktu_sekarang}.html"
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Dashboard Proker Tracker</title>
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
                <h1>Laporan Pengujian Dashboard Proker Tracker</h1>
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
