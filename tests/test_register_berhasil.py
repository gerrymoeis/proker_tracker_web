"""
Skrip pengujian untuk fungsionalitas registrasi berhasil pada Proker Tracker.
Pengujian ini mencoba mendaftar dengan email baru dan kemudian login dengan kredensial yang sama.
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
    """Fungsi utama untuk menjalankan pengujian registrasi berhasil."""
    print("Memulai pengujian registrasi berhasil...")
    
    # Catat langkah-langkah pengujian
    langkah = []
    screenshots = []
    
    # Generate email unik untuk pengujian
    random_num = random.randint(1000, 9999)
    test_email = f"test{random_num}@example.com"
    test_password = "password123456"
    test_name = f"Pengguna Test {random_num}"
    
    print(f"Email pengujian: {test_email}")
    print(f"Password pengujian: {test_password}")
    print(f"Nama pengujian: {test_name}")
    
    langkah.append(f"Email pengujian: {test_email}")
    langkah.append(f"Password pengujian: {test_password}")
    langkah.append(f"Nama pengujian: {test_name}")
    
    try:
        async with async_playwright() as p:
            # Luncurkan browser dengan mode headless=False agar bisa dilihat
            browser = await p.chromium.launch(headless=False)
            
            # Buat konteks browser baru
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Navigasi ke halaman registrasi
            print("Langkah 1: Navigasi ke halaman registrasi...")
            langkah.append("Navigasi ke halaman registrasi")
            
            try:
                await page.goto("http://localhost:3000/register", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman registrasi
                screenshot_path = os.path.join("test-results/screenshots", f"register_page_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                print("Halaman registrasi berhasil dimuat")
                langkah.append("Halaman registrasi berhasil dimuat")
            except Exception as e:
                print(f"Error saat navigasi ke halaman registrasi: {e}")
                langkah.append(f"Error saat navigasi ke halaman registrasi: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 2: Isi form registrasi dan submit
            print("Langkah 2: Isi form registrasi dan submit...")
            langkah.append("Isi form registrasi dan submit")
            
            try:
                # Isi nama lengkap
                await highlight_element(page, "#name")
                await page.fill("#name", test_name)
                await asyncio.sleep(1)
                print(f"Mengisi nama: {test_name}")
                langkah.append(f"Mengisi nama: {test_name}")
                
                # Isi email baru
                await highlight_element(page, "#email")
                await page.fill("#email", test_email)
                await asyncio.sleep(1)
                print(f"Mengisi email: {test_email}")
                langkah.append(f"Mengisi email: {test_email}")
                
                # Isi password
                await highlight_element(page, "#password")
                await page.fill("#password", test_password)
                await asyncio.sleep(1)
                print(f"Mengisi password: {test_password}")
                langkah.append(f"Mengisi password: {test_password}")
                
                # Isi konfirmasi password
                await highlight_element(page, "#confirmPassword")
                await page.fill("#confirmPassword", test_password)
                await asyncio.sleep(1)
                print("Mengisi konfirmasi password")
                langkah.append("Mengisi konfirmasi password")
                
                # Pilih organisasi (default Himafortic)
                print("Menggunakan organisasi default: Himafortic")
                langkah.append("Menggunakan organisasi default: Himafortic")
                
                # Ambil screenshot sebelum submit
                screenshot_path = os.path.join("test-results/screenshots", f"register_form_filled_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol daftar menggunakan JavaScript
                register_button = await page.query_selector("button[type='submit']")
                if register_button:
                    await highlight_element(page, register_button)
                    await page.evaluate("(element) => element.click()", register_button)
                    print("Tombol daftar diklik")
                    langkah.append("Tombol daftar diklik")
                else:
                    print("Tidak dapat menemukan tombol daftar")
                    langkah.append("Tidak dapat menemukan tombol daftar")
                
                # Tunggu untuk respons dan redirect
                await asyncio.sleep(5)
                
                # Ambil screenshot hasil
                screenshot_path = os.path.join("test-results/screenshots", f"register_result_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi hasil registrasi
                current_url = page.url
                print(f"URL setelah registrasi: {current_url}")
                langkah.append(f"URL setelah registrasi: {current_url}")
                
                # Periksa apakah ada pesan error
                error_message = await page.query_selector(".bg-destructive\\/15")
                if error_message:
                    error_text = await error_message.text_content()
                    print(f"Pesan error ditemukan: {error_text}")
                    langkah.append(f"Pesan error ditemukan: {error_text}")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error=f"Registrasi gagal: {error_text}")
                    return
                
                # Periksa apakah diarahkan ke halaman login atau dashboard
                if "/login" in current_url:
                    print("Registrasi berhasil: Diarahkan ke halaman login")
                    langkah.append("Registrasi berhasil: Diarahkan ke halaman login")
                elif "/dashboard" in current_url:
                    print("Registrasi berhasil: Diarahkan langsung ke dashboard")
                    langkah.append("Registrasi berhasil: Diarahkan langsung ke dashboard")
                    # Jika sudah di dashboard, pengujian selesai
                    await browser.close()
                    buat_laporan_html(langkah, screenshots)
                    return
                else:
                    print(f"Registrasi mungkin gagal: URL tidak dikenali: {current_url}")
                    langkah.append(f"Registrasi mungkin gagal: URL tidak dikenali: {current_url}")
                    # Tetap lanjutkan untuk mencoba login
            except Exception as e:
                print(f"Error saat registrasi: {e}")
                langkah.append(f"Error saat registrasi: {e}")
                # Tetap lanjutkan untuk mencoba login jika mungkin
            
            # Langkah 3: Login dengan kredensial yang baru dibuat
            print("Langkah 3: Login dengan kredensial yang baru dibuat...")
            langkah.append("Login dengan kredensial yang baru dibuat")
            
            try:
                # Jika belum di halaman login, navigasi ke halaman login
                if "/login" not in page.url:
                    await page.goto("http://localhost:3000/login", wait_until="load")
                    await page.wait_for_load_state("networkidle")
                    await asyncio.sleep(2)
                
                # Ambil screenshot halaman login
                screenshot_path = os.path.join("test-results/screenshots", f"login_page_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Isi email
                await highlight_element(page, "#email")
                await page.fill("#email", test_email)
                await asyncio.sleep(1)
                print(f"Mengisi email login: {test_email}")
                langkah.append(f"Mengisi email login: {test_email}")
                
                # Isi password
                await highlight_element(page, "#password")
                await page.fill("#password", test_password)
                await asyncio.sleep(1)
                print(f"Mengisi password login: {test_password}")
                langkah.append(f"Mengisi password login: {test_password}")
                
                # Ambil screenshot sebelum login
                screenshot_path = os.path.join("test-results/screenshots", f"login_form_filled_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol login menggunakan JavaScript
                login_button = await page.query_selector("button[type='submit']")
                if login_button:
                    await highlight_element(page, login_button)
                    await page.evaluate("(element) => element.click()", login_button)
                    print("Tombol login diklik")
                    langkah.append("Tombol login diklik")
                else:
                    print("Tidak dapat menemukan tombol login")
                    langkah.append("Tidak dapat menemukan tombol login")
                
                # Tunggu untuk respons dan redirect
                await asyncio.sleep(5)
                
                # Ambil screenshot hasil login
                screenshot_path = os.path.join("test-results/screenshots", f"login_result_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi hasil login
                current_url = page.url
                print(f"URL setelah login: {current_url}")
                langkah.append(f"URL setelah login: {current_url}")
                
                # Periksa apakah ada pesan error
                error_message = await page.query_selector(".bg-destructive\\/15")
                if error_message:
                    error_text = await error_message.text_content()
                    print(f"Pesan error login ditemukan: {error_text}")
                    langkah.append(f"Pesan error login ditemukan: {error_text}")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error=f"Login gagal: {error_text}")
                    return
                
                # Periksa apakah diarahkan ke dashboard
                if "/dashboard" in current_url:
                    print("Login berhasil: Diarahkan ke dashboard")
                    langkah.append("Login berhasil: Diarahkan ke dashboard")
                    
                    # Ambil screenshot dashboard
                    screenshot_path = os.path.join("test-results/screenshots", f"dashboard_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Verifikasi nama pengguna muncul di dashboard
                    try:
                        # Cari elemen yang mungkin berisi nama pengguna
                        user_name_element = await page.query_selector(".user-profile, .user-info, .user-name")
                        if user_name_element:
                            user_name_text = await user_name_element.text_content()
                            print(f"Nama pengguna di dashboard: {user_name_text}")
                            langkah.append(f"Nama pengguna di dashboard: {user_name_text}")
                            
                            if test_name in user_name_text:
                                print("Verifikasi nama pengguna berhasil")
                                langkah.append("Verifikasi nama pengguna berhasil")
                            else:
                                print(f"Nama pengguna tidak sesuai harapan: {user_name_text}")
                                langkah.append(f"Nama pengguna tidak sesuai harapan: {user_name_text}")
                        else:
                            print("Elemen nama pengguna tidak ditemukan di dashboard")
                            langkah.append("Elemen nama pengguna tidak ditemukan di dashboard")
                    except Exception as e:
                        print(f"Error saat verifikasi nama pengguna: {e}")
                        langkah.append(f"Error saat verifikasi nama pengguna: {e}")
                    
                    print("Pengujian registrasi dan login berhasil")
                    langkah.append("Pengujian registrasi dan login berhasil")
                else:
                    print(f"Login gagal: Tidak diarahkan ke dashboard, URL saat ini: {current_url}")
                    langkah.append(f"Login gagal: Tidak diarahkan ke dashboard, URL saat ini: {current_url}")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Login gagal: Tidak diarahkan ke dashboard")
                    return
            except Exception as e:
                print(f"Error saat login: {e}")
                langkah.append(f"Error saat login: {e}")
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
    report_filename = f"test-results/register-berhasil-test-report-{timestamp}.html"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Registrasi Berhasil</title>
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
            <h1>Laporan Pengujian Registrasi Berhasil</h1>
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
