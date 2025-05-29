"""
Skrip pengujian untuk fungsionalitas ubah password pada Proker Tracker.
"""
import os
import sys
import asyncio
import datetime
import random
from playwright.async_api import async_playwright

# Buat direktori hasil pengujian jika belum ada
os.makedirs("test-results", exist_ok=True)
os.makedirs("test-results/screenshots", exist_ok=True)

async def main():
    """Fungsi utama untuk menjalankan pengujian ubah password."""
    print("Memulai pengujian ubah password...")
    
    # Catat langkah-langkah pengujian
    langkah = []
    screenshots = []
    
    # Data pengujian
    email_login = "test@testing.com"
    password_lama = "testpw123"
    password_baru = f"newpw{random.randint(1000, 9999)}"
    
    print(f"Data pengujian: Email {email_login}, Password baru {password_baru}")
    langkah.append(f"Data pengujian: Email {email_login}, Password baru {password_baru}")
    
    try:
        async with async_playwright() as p:
            # Luncurkan browser dengan mode headless=False agar bisa dilihat
            browser = await p.chromium.launch(headless=False)
            
            # Buat konteks browser baru
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Buka halaman forgot password
            print("Langkah 1: Buka halaman forgot password...")
            langkah.append("Buka halaman forgot password")
            
            try:
                await page.goto("http://localhost:3000/forgot-password", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman forgot password
                screenshot_path = os.path.join("test-results/screenshots", f"forgot_password_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                print("Halaman forgot password berhasil dimuat")
                langkah.append("Halaman forgot password berhasil dimuat")
            except Exception as e:
                print(f"Error saat membuka halaman forgot password: {e}")
                langkah.append(f"Error saat membuka halaman forgot password: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 2: Masukkan email untuk verifikasi
            print("Langkah 2: Masukkan email untuk verifikasi...")
            langkah.append("Masukkan email untuk verifikasi")
            
            try:
                # Isi email
                await highlight_element(page, "#email")
                await page.fill("#email", email_login)
                await asyncio.sleep(1)
                print(f"Mengisi email: {email_login}")
                langkah.append(f"Mengisi email: {email_login}")
                
                # Ambil screenshot setelah mengisi email
                screenshot_path = os.path.join("test-results/screenshots", f"email_filled_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol lanjutkan
                submit_button = await page.query_selector("button[type='submit']")
                if submit_button:
                    await highlight_element(page, submit_button)
                    await submit_button.click()
                    print("Tombol Lanjutkan diklik")
                    langkah.append("Tombol Lanjutkan diklik")
                else:
                    print("Tidak dapat menemukan tombol Lanjutkan")
                    langkah.append("Tidak dapat menemukan tombol Lanjutkan")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan tombol Lanjutkan")
                    return
                
                # Tunggu untuk respons
                await asyncio.sleep(3)
                
                # Ambil screenshot hasil verifikasi email
                screenshot_path = os.path.join("test-results/screenshots", f"email_verification_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi hasil verifikasi email
                success_message = await page.query_selector("div.bg-green-100, div.text-green-800")
                if success_message:
                    success_text = await success_message.text_content()
                    print(f"Pesan sukses ditemukan: {success_text}")
                    langkah.append(f"Pesan sukses ditemukan: {success_text}")
                else:
                    error_message = await page.query_selector("div.bg-destructive\\/15, div.text-destructive")
                    if error_message:
                        error_text = await error_message.text_content()
                        print(f"Pesan error ditemukan: {error_text}")
                        langkah.append(f"Pesan error ditemukan: {error_text}")
                        await browser.close()
                        buat_laporan_html(langkah, screenshots, error=error_text)
                        return
            except Exception as e:
                print(f"Error saat verifikasi email: {e}")
                langkah.append(f"Error saat verifikasi email: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 3: Masukkan password baru
            print("Langkah 3: Masukkan password baru...")
            langkah.append("Masukkan password baru")
            
            try:
                # Isi password baru
                await highlight_element(page, "#newPassword")
                await page.fill("#newPassword", password_baru)
                await asyncio.sleep(1)
                print(f"Mengisi password baru: {password_baru}")
                langkah.append("Mengisi password baru")
                
                # Isi konfirmasi password baru
                await highlight_element(page, "#confirmPassword")
                await page.fill("#confirmPassword", password_baru)
                await asyncio.sleep(1)
                print("Mengisi konfirmasi password baru")
                langkah.append("Mengisi konfirmasi password baru")
                
                # Ambil screenshot setelah mengisi password baru
                screenshot_path = os.path.join("test-results/screenshots", f"password_filled_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol reset password
                reset_button = await page.query_selector("button[type='submit']")
                if reset_button:
                    await highlight_element(page, reset_button)
                    await reset_button.click()
                    print("Tombol Reset Password diklik")
                    langkah.append("Tombol Reset Password diklik")
                else:
                    print("Tidak dapat menemukan tombol Reset Password")
                    langkah.append("Tidak dapat menemukan tombol Reset Password")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan tombol Reset Password")
                    return
                
                # Tunggu untuk respons
                await asyncio.sleep(3)
                
                # Ambil screenshot hasil reset password
                screenshot_path = os.path.join("test-results/screenshots", f"password_reset_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi hasil reset password
                success_message = await page.query_selector("div.bg-green-100, div.text-green-800")
                if success_message:
                    success_text = await success_message.text_content()
                    print(f"Pesan sukses ditemukan: {success_text}")
                    langkah.append(f"Pesan sukses ditemukan: {success_text}")
                else:
                    error_message = await page.query_selector("div.bg-destructive\\/15, div.text-destructive")
                    if error_message:
                        error_text = await error_message.text_content()
                        print(f"Pesan error ditemukan: {error_text}")
                        langkah.append(f"Pesan error ditemukan: {error_text}")
                        await browser.close()
                        buat_laporan_html(langkah, screenshots, error=error_text)
                        return
                
                # Tunggu redirect ke halaman login
                await asyncio.sleep(5)
            except Exception as e:
                print(f"Error saat reset password: {e}")
                langkah.append(f"Error saat reset password: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 4: Login dengan password baru
            print("Langkah 4: Login dengan password baru...")
            langkah.append("Login dengan password baru")
            
            try:
                # Cek apakah sudah di halaman login
                if not page.url.endswith('/login'):
                    await page.goto("http://localhost:3000/login", wait_until="load")
                    await page.wait_for_load_state("networkidle")
                    await asyncio.sleep(2)
                
                # Ambil screenshot halaman login
                screenshot_path = os.path.join("test-results/screenshots", f"login_page_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Isi email
                await highlight_element(page, "#email")
                await page.fill("#email", email_login)
                await asyncio.sleep(1)
                print(f"Mengisi email login: {email_login}")
                langkah.append(f"Mengisi email login: {email_login}")
                
                # Isi password baru
                await highlight_element(page, "#password")
                await page.fill("#password", password_baru)
                await asyncio.sleep(1)
                print("Mengisi password baru")
                langkah.append("Mengisi password baru")
                
                # Ambil screenshot setelah mengisi form login
                screenshot_path = os.path.join("test-results/screenshots", f"login_filled_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol login
                login_button = await page.query_selector("button[type='submit']")
                if login_button:
                    await highlight_element(page, login_button)
                    await login_button.click()
                    print("Tombol Login diklik")
                    langkah.append("Tombol Login diklik")
                else:
                    print("Tidak dapat menemukan tombol Login")
                    langkah.append("Tidak dapat menemukan tombol Login")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan tombol Login")
                    return
                
                # Tunggu untuk proses login
                await asyncio.sleep(5)
                
                # Ambil screenshot hasil login
                screenshot_path = os.path.join("test-results/screenshots", f"login_result_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi hasil login
                if '/dashboard' in page.url:
                    print("Login berhasil, diarahkan ke dashboard")
                    langkah.append("Login berhasil, diarahkan ke dashboard")
                else:
                    error_message = await page.query_selector("div.bg-destructive\\/15, div.text-destructive")
                    if error_message:
                        error_text = await error_message.text_content()
                        print(f"Login gagal: {error_text}")
                        langkah.append(f"Login gagal: {error_text}")
                        await browser.close()
                        buat_laporan_html(langkah, screenshots, error=f"Login gagal: {error_text}")
                        return
                    else:
                        print(f"Login gagal: Tidak diarahkan ke dashboard. URL saat ini: {page.url}")
                        langkah.append(f"Login gagal: Tidak diarahkan ke dashboard. URL saat ini: {page.url}")
                        await browser.close()
                        buat_laporan_html(langkah, screenshots, error="Login gagal: Tidak diarahkan ke dashboard")
                        return
            except Exception as e:
                print(f"Error saat login dengan password baru: {e}")
                langkah.append(f"Error saat login dengan password baru: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Tutup browser
            await browser.close()
            
            # Buat laporan HTML
            buat_laporan_html(langkah, screenshots)
            
    except Exception as e:
        print(f"Error selama pengujian: {e}")
        buat_laporan_html(langkah, screenshots, error=str(e))

async def highlight_element(page, selector):
    """Highlight elemen pada halaman untuk visualisasi."""
    try:
        # Jika selector adalah string, cari elemen
        if isinstance(selector, str):
            element = await page.query_selector(selector)
        else:
            # Jika selector sudah berupa elemen
            element = selector
        
        if element:
            # Tambahkan border merah untuk highlight
            await page.evaluate("""
                (element) => {
                    const originalBorder = element.style.border;
                    const originalBoxShadow = element.style.boxShadow;
                    
                    element.style.border = '2px solid red';
                    element.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
                    
                    setTimeout(() => {
                        element.style.border = originalBorder;
                        element.style.boxShadow = originalBoxShadow;
                    }, 1000);
                }
            """, element)
            
            # Tunggu sebentar agar highlight terlihat
            await asyncio.sleep(0.5)
    except Exception as e:
        print(f"Error saat highlight elemen: {e}")

def buat_laporan_html(langkah, screenshots, error=None):
    """Buat laporan HTML untuk hasil pengujian."""
    # Buat nama file dengan timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"test-results/ubah-password-test-report-{timestamp}.html"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Ubah Password</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                color: #333;
            }}
            h1 {{
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }}
            h2 {{
                color: #2980b9;
                margin-top: 30px;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
            }}
            .status {{
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }}
            .success {{
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }}
            .error {{
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }}
            .step {{
                background-color: #f8f9fa;
                padding: 10px 15px;
                margin-bottom: 10px;
                border-radius: 5px;
                border-left: 4px solid #6c757d;
            }}
            .step-success {{
                border-left-color: #28a745;
            }}
            .step-error {{
                border-left-color: #dc3545;
            }}
            .screenshot {{
                margin: 20px 0;
                text-align: center;
            }}
            .screenshot img {{
                max-width: 100%;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            th, td {{
                padding: 12px 15px;
                border: 1px solid #ddd;
                text-align: left;
            }}
            th {{
                background-color: #f8f9fa;
            }}
            tr:nth-child(even) {{
                background-color: #f2f2f2;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Laporan Pengujian Ubah Password</h1>
            <p>Tanggal & Waktu: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
            
            <div class="status {'error' if error else 'success'}">
                <strong>Status: {f"GAGAL - {error}" if error else "BERHASIL"}</strong>
            </div>
            
            <h2>Langkah-langkah Pengujian</h2>
            <div class="steps">
    """
    
    # Tambahkan langkah-langkah
    for i, step in enumerate(langkah):
        html_content += f"""
                <div class="step">
                    <strong>{i+1}.</strong> {step}
                </div>
        """
    
    html_content += """
            </div>
            
            <h2>Screenshot</h2>
            <div class="screenshots">
    """
    
    # Tambahkan screenshot
    for i, screenshot in enumerate(screenshots):
        # Gunakan path relatif untuk screenshot
        rel_path = os.path.relpath(screenshot, os.path.dirname(report_filename))
        html_content += f"""
                <div class="screenshot">
                    <h3>Screenshot {i+1}</h3>
                    <img src="{rel_path}" alt="Screenshot {i+1}">
                </div>
        """
    
    html_content += """
            </div>
        </div>
    </body>
    </html>
    """
    
    # Tulis ke file
    with open(report_filename, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Laporan pengujian dibuat: {report_filename}")
    return report_filename

if __name__ == "__main__":
    asyncio.run(main())
