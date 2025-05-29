"""
Skrip pengujian untuk fungsionalitas edit profil pada Proker Tracker.
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
    """Fungsi utama untuk menjalankan pengujian edit profil."""
    print("Memulai pengujian edit profil...")
    
    # Catat langkah-langkah pengujian
    langkah = []
    screenshots = []
    
    # Data pengujian
    email_login = "usertest7083@example.com"
    password_login = "password123"
    
    # Data untuk update profil
    nama_baru = f"Test User {random.randint(1000, 9999)}"
    
    print(f"Data pengujian: Login dengan {email_login}, ubah nama menjadi {nama_baru}")
    langkah.append(f"Data pengujian: Login dengan {email_login}, ubah nama menjadi {nama_baru}")
    
    try:
        async with async_playwright() as p:
            # Luncurkan browser dengan mode headless=False agar bisa dilihat
            browser = await p.chromium.launch(headless=False)
            
            # Buat konteks browser baru
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Login dengan akun test
            print("Langkah 1: Login dengan akun test...")
            langkah.append("Login dengan akun test")
            
            try:
                await page.goto("http://localhost:3000/login", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman login
                screenshot_path = os.path.join("test-results/screenshots", f"login_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Isi email
                await highlight_element(page, "#email")
                await page.fill("#email", email_login)
                await asyncio.sleep(1)
                print(f"Mengisi email login: {email_login}")
                langkah.append(f"Mengisi email login: {email_login}")
                
                # Isi password
                await highlight_element(page, "#password")
                await page.fill("#password", password_login)
                await asyncio.sleep(1)
                print("Mengisi password login")
                langkah.append("Mengisi password login")
                
                # Klik tombol login menggunakan JavaScript
                login_button = await page.query_selector("button[type='submit']")
                if login_button:
                    await highlight_element(page, login_button)
                    await page.evaluate("(element) => element.click()", login_button)
                    print("Tombol login diklik menggunakan JavaScript")
                    langkah.append("Tombol login diklik menggunakan JavaScript")
                else:
                    # Alternatif jika tombol tidak ditemukan
                    await page.evaluate("document.querySelector('form').submit()")
                    print("Form login di-submit menggunakan JavaScript")
                    langkah.append("Form login di-submit menggunakan JavaScript")
                
                # Tunggu lebih lama untuk proses login selesai
                await asyncio.sleep(5)
                
                # Verifikasi login berhasil
                current_url = page.url
                if "dashboard" in current_url:
                    print("Login berhasil, diarahkan ke dashboard")
                    langkah.append("Login berhasil, diarahkan ke dashboard")
                    
                    # Ambil screenshot dashboard
                    screenshot_path = os.path.join("test-results/screenshots", f"dashboard_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                else:
                    print(f"Login gagal, diarahkan ke {current_url}")
                    langkah.append(f"Login gagal, diarahkan ke {current_url}")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Login gagal")
                    return
            except Exception as e:
                print(f"Error selama login: {e}")
                langkah.append(f"Error selama login: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 2: Navigasi ke halaman profil
            print("Langkah 2: Navigasi ke halaman profil...")
            langkah.append("Navigasi ke halaman profil")
            
            try:
                await page.goto("http://localhost:3000/profile", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(3)
                
                # Ambil screenshot halaman profil
                screenshot_path = os.path.join("test-results/screenshots", f"profil_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                print("Halaman profil berhasil dimuat")
                langkah.append("Halaman profil berhasil dimuat")
                
                # Verifikasi halaman profil
                profile_title = await page.query_selector("h1:has-text('Profil Pengguna')")
                if profile_title:
                    print("Halaman profil terverifikasi")
                    langkah.append("Halaman profil terverifikasi")
                else:
                    print("Tidak dapat memverifikasi halaman profil")
                    langkah.append("Tidak dapat memverifikasi halaman profil")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat memverifikasi halaman profil")
                    return
            except Exception as e:
                print(f"Error saat navigasi ke halaman profil: {e}")
                langkah.append(f"Error saat navigasi ke halaman profil: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 3: Klik tombol Edit Profil
            print("Langkah 3: Klik tombol Edit Profil...")
            langkah.append("Klik tombol Edit Profil")
            
            try:
                # Cari tombol Edit Profil
                edit_button = await page.query_selector("button:has-text('Edit Profil')")
                
                if edit_button:
                    await highlight_element(page, edit_button)
                    print("Tombol Edit Profil ditemukan")
                    langkah.append("Tombol Edit Profil ditemukan")
                    
                    # Klik tombol Edit Profil
                    await edit_button.click()
                    await asyncio.sleep(2)
                    print("Tombol Edit Profil diklik")
                    langkah.append("Tombol Edit Profil diklik")
                    
                    # Ambil screenshot mode edit
                    screenshot_path = os.path.join("test-results/screenshots", f"edit_mode_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                else:
                    print("Tidak dapat menemukan tombol Edit Profil")
                    langkah.append("Tidak dapat menemukan tombol Edit Profil")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan tombol Edit Profil")
                    return
            except Exception as e:
                print(f"Error saat klik tombol Edit Profil: {e}")
                langkah.append(f"Error saat klik tombol Edit Profil: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 4: Edit nama profil
            print("Langkah 4: Edit nama profil...")
            langkah.append("Edit nama profil")
            
            try:
                # Cari field nama
                name_input = await page.query_selector("input#name")
                
                if name_input:
                    await highlight_element(page, name_input)
                    print("Field nama ditemukan")
                    langkah.append("Field nama ditemukan")
                    
                    # Simpan nama asli untuk verifikasi
                    nama_asli = await name_input.input_value()
                    print(f"Nama asli: {nama_asli}")
                    langkah.append(f"Nama asli: {nama_asli}")
                    
                    # Bersihkan field nama
                    await name_input.fill("")
                    await asyncio.sleep(1)
                    
                    # Isi dengan nama baru
                    await name_input.fill(nama_baru)
                    await asyncio.sleep(1)
                    print(f"Mengubah nama menjadi: {nama_baru}")
                    langkah.append(f"Mengubah nama menjadi: {nama_baru}")
                    
                    # Ambil screenshot setelah edit nama
                    screenshot_path = os.path.join("test-results/screenshots", f"edit_nama_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                else:
                    print("Tidak dapat menemukan field nama")
                    langkah.append("Tidak dapat menemukan field nama")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan field nama")
                    return
            except Exception as e:
                print(f"Error saat edit nama profil: {e}")
                langkah.append(f"Error saat edit nama profil: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 5: Submit perubahan
            print("Langkah 5: Submit perubahan...")
            langkah.append("Submit perubahan")
            
            try:
                # Cari tombol submit
                submit_button = await page.query_selector("button[type='submit']:has-text('Simpan Perubahan')")
                
                if submit_button:
                    await highlight_element(page, submit_button)
                    print("Tombol Simpan Perubahan ditemukan")
                    langkah.append("Tombol Simpan Perubahan ditemukan")
                    
                    # Klik tombol submit
                    await submit_button.click()
                    print("Tombol Simpan Perubahan diklik")
                    langkah.append("Tombol Simpan Perubahan diklik")
                    
                    # Tunggu untuk respons
                    await asyncio.sleep(5)
                    
                    # Ambil screenshot hasil submit
                    screenshot_path = os.path.join("test-results/screenshots", f"submit_result_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Verifikasi hasil submit
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
                else:
                    print("Tidak dapat menemukan tombol Simpan Perubahan")
                    langkah.append("Tidak dapat menemukan tombol Simpan Perubahan")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan tombol Simpan Perubahan")
                    return
            except Exception as e:
                print(f"Error saat submit perubahan: {e}")
                langkah.append(f"Error saat submit perubahan: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 6: Verifikasi perubahan nama
            print("Langkah 6: Verifikasi perubahan nama...")
            langkah.append("Verifikasi perubahan nama")
            
            try:
                # Tunggu beberapa saat untuk memastikan perubahan sudah diterapkan
                await asyncio.sleep(3)
                
                # Cari nama yang ditampilkan di profil
                profile_name = await page.query_selector("h3.text-xl.font-bold, div.text-center h3")
                
                if profile_name:
                    displayed_name = await profile_name.text_content()
                    print(f"Nama yang ditampilkan di profil: {displayed_name}")
                    langkah.append(f"Nama yang ditampilkan di profil: {displayed_name}")
                    
                    # Verifikasi nama baru sudah diterapkan
                    if nama_baru in displayed_name:
                        print(f"Verifikasi berhasil: Nama berhasil diubah menjadi {nama_baru}")
                        langkah.append(f"Verifikasi berhasil: Nama berhasil diubah menjadi {nama_baru}")
                    else:
                        print(f"Verifikasi gagal: Nama tidak berhasil diubah menjadi {nama_baru}")
                        langkah.append(f"Verifikasi gagal: Nama tidak berhasil diubah menjadi {nama_baru}")
                        await browser.close()
                        buat_laporan_html(langkah, screenshots, error=f"Verifikasi gagal: Nama tidak berhasil diubah")
                        return
                    
                    # Ambil screenshot hasil verifikasi
                    screenshot_path = os.path.join("test-results/screenshots", f"verifikasi_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                else:
                    print("Tidak dapat menemukan nama profil untuk verifikasi")
                    langkah.append("Tidak dapat menemukan nama profil untuk verifikasi")
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat menemukan nama profil untuk verifikasi")
                    return
            except Exception as e:
                print(f"Error saat verifikasi perubahan nama: {e}")
                langkah.append(f"Error saat verifikasi perubahan nama: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 7: Uji tab Keamanan untuk mengubah password
            print("Langkah 7: Uji tab Keamanan untuk mengubah password...")
            langkah.append("Uji tab Keamanan untuk mengubah password")
            
            try:
                # Klik tab Keamanan
                security_tab = await page.query_selector("button:has-text('Keamanan')")
                
                if security_tab:
                    await highlight_element(page, security_tab)
                    print("Tab Keamanan ditemukan")
                    langkah.append("Tab Keamanan ditemukan")
                    
                    # Klik tab Keamanan
                    await security_tab.click()
                    await asyncio.sleep(2)
                    print("Tab Keamanan diklik")
                    langkah.append("Tab Keamanan diklik")
                    
                    # Ambil screenshot tab Keamanan
                    screenshot_path = os.path.join("test-results/screenshots", f"tab_keamanan_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Verifikasi form ubah password
                    current_password_input = await page.query_selector("input#currentPassword")
                    new_password_input = await page.query_selector("input#newPassword")
                    confirm_password_input = await page.query_selector("input#confirmPassword")
                    
                    if current_password_input and new_password_input and confirm_password_input:
                        print("Form ubah password terverifikasi")
                        langkah.append("Form ubah password terverifikasi")
                    else:
                        print("Tidak dapat memverifikasi form ubah password")
                        langkah.append("Tidak dapat memverifikasi form ubah password")
                else:
                    print("Tidak dapat menemukan tab Keamanan")
                    langkah.append("Tidak dapat menemukan tab Keamanan")
            except Exception as e:
                print(f"Error saat uji tab Keamanan: {e}")
                langkah.append(f"Error saat uji tab Keamanan: {e}")
            
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
    report_filename = f"test-results/edit-profil-test-report-{timestamp}.html"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Edit Profil</title>
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
            <h1>Laporan Pengujian Edit Profil</h1>
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
