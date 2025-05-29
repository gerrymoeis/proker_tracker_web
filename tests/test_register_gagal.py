"""
Skrip pengujian untuk fungsionalitas registrasi gagal pada Proker Tracker.
Pengujian ini mencoba mendaftar dengan email yang sudah terdaftar dan password yang terlalu pendek.
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
    """Fungsi utama untuk menjalankan pengujian registrasi gagal."""
    print("Memulai pengujian registrasi gagal...")
    
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
            
            # Langkah 2: Pengujian registrasi dengan email yang sudah terdaftar
            print("Langkah 2: Pengujian registrasi dengan email yang sudah terdaftar...")
            langkah.append("Pengujian registrasi dengan email yang sudah terdaftar")
            
            try:
                # Isi nama lengkap
                await highlight_element(page, "#name")
                await page.fill("#name", "Pengguna Test")
                await asyncio.sleep(1)
                
                # Isi email yang sudah terdaftar
                await highlight_element(page, "#email")
                await page.fill("#email", "23091397164@student.unesa.ac.id")
                await asyncio.sleep(1)
                
                # Isi password
                await highlight_element(page, "#password")
                await page.fill("#password", "password123")
                await asyncio.sleep(1)
                
                # Isi konfirmasi password
                await highlight_element(page, "#confirmPassword")
                await page.fill("#confirmPassword", "password123")
                await asyncio.sleep(1)
                
                # Pilih organisasi (default Himafortic)
                
                # Ambil screenshot sebelum submit
                screenshot_path = os.path.join("test-results/screenshots", f"register_email_terdaftar_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol daftar menggunakan JavaScript
                register_button = await page.query_selector("button[type='submit']")
                if register_button:
                    await highlight_element(page, register_button)
                    await page.evaluate("(element) => element.click()", register_button)
                    print("Tombol daftar diklik untuk pengujian email terdaftar")
                    langkah.append("Tombol daftar diklik untuk pengujian email terdaftar")
                else:
                    print("Tidak dapat menemukan tombol daftar")
                    langkah.append("Tidak dapat menemukan tombol daftar")
                
                # Tunggu untuk respons
                await asyncio.sleep(3)
                
                # Ambil screenshot hasil
                screenshot_path = os.path.join("test-results/screenshots", f"register_email_terdaftar_result_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi pesan error email sudah terdaftar
                error_message = await page.query_selector(".bg-destructive\\/15.p-3.text-sm.text-destructive, .bg-destructive\\/15")
                if error_message:
                    error_text = await error_message.text_content()
                    print(f"Pesan error ditemukan: {error_text}")
                    langkah.append(f"Pesan error ditemukan: {error_text}")
                    
                    if "Email sudah terdaftar" in error_text:
                        print("Pengujian email terdaftar berhasil: Pesan error yang diharapkan muncul")
                        langkah.append("Pengujian email terdaftar berhasil: Pesan error yang diharapkan muncul")
                    else:
                        print(f"Pengujian email terdaftar gagal: Pesan error tidak sesuai harapan: {error_text}")
                        langkah.append(f"Pengujian email terdaftar gagal: Pesan error tidak sesuai harapan: {error_text}")
                else:
                    print("Pengujian email terdaftar gagal: Tidak ada pesan error yang muncul")
                    langkah.append("Pengujian email terdaftar gagal: Tidak ada pesan error yang muncul")
            except Exception as e:
                print(f"Error saat pengujian email terdaftar: {e}")
                langkah.append(f"Error saat pengujian email terdaftar: {e}")
            
            # Langkah 3: Pengujian registrasi dengan password terlalu pendek
            print("Langkah 3: Pengujian registrasi dengan password terlalu pendek...")
            langkah.append("Pengujian registrasi dengan password terlalu pendek")
            
            try:
                # Refresh halaman untuk pengujian baru
                await page.reload()
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Isi nama lengkap
                await highlight_element(page, "#name")
                await page.fill("#name", "Pengguna Test")
                await asyncio.sleep(1)
                
                # Isi email baru
                await highlight_element(page, "#email")
                await page.fill("#email", "test_pendek@example.com")
                await asyncio.sleep(1)
                
                # Isi password pendek (kurang dari 8 karakter)
                await highlight_element(page, "#password")
                await page.fill("#password", "123")
                await asyncio.sleep(1)
                
                # Isi konfirmasi password pendek
                await highlight_element(page, "#confirmPassword")
                await page.fill("#confirmPassword", "123")
                await asyncio.sleep(1)
                
                # Ambil screenshot sebelum submit
                screenshot_path = os.path.join("test-results/screenshots", f"register_password_pendek_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Klik tombol daftar menggunakan JavaScript
                register_button = await page.query_selector("button[type='submit']")
                if register_button:
                    await highlight_element(page, register_button)
                    await page.evaluate("(element) => element.click()", register_button)
                    print("Tombol daftar diklik untuk pengujian password pendek")
                    langkah.append("Tombol daftar diklik untuk pengujian password pendek")
                else:
                    print("Tidak dapat menemukan tombol daftar")
                    langkah.append("Tidak dapat menemukan tombol daftar")
                
                # Tunggu untuk respons
                await asyncio.sleep(3)
                
                # Ambil screenshot hasil
                screenshot_path = os.path.join("test-results/screenshots", f"register_password_pendek_result_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Verifikasi pesan error password terlalu pendek
                password_error = await page.query_selector(".text-xs.text-destructive")
                if password_error:
                    error_text = await password_error.text_content()
                    print(f"Pesan error password ditemukan: {error_text}")
                    langkah.append(f"Pesan error password ditemukan: {error_text}")
                    
                    if "Password minimal 8 karakter" in error_text:
                        print("Pengujian password pendek berhasil: Pesan error yang diharapkan muncul")
                        langkah.append("Pengujian password pendek berhasil: Pesan error yang diharapkan muncul")
                    else:
                        print(f"Pengujian password pendek gagal: Pesan error tidak sesuai harapan: {error_text}")
                        langkah.append(f"Pengujian password pendek gagal: Pesan error tidak sesuai harapan: {error_text}")
                else:
                    print("Pengujian password pendek gagal: Tidak ada pesan error yang muncul")
                    langkah.append("Pengujian password pendek gagal: Tidak ada pesan error yang muncul")
            except Exception as e:
                print(f"Error saat pengujian password pendek: {e}")
                langkah.append(f"Error saat pengujian password pendek: {e}")
            
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
    report_filename = f"test-results/register-gagal-test-report-{timestamp}.html"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Registrasi Gagal</title>
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
            <h1>Laporan Pengujian Registrasi Gagal</h1>
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
