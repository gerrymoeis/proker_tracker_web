"""
Skrip pengujian sederhana untuk fungsionalitas pembuatan program kerja Proker Tracker.
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
    """Fungsi utama untuk menjalankan pengujian pembuatan program kerja."""
    print("Memulai pengujian pembuatan program kerja...")
    
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
            
            try:
                await page.goto("http://localhost:3000/login", wait_until="load")
                await page.wait_for_load_state("networkidle")
                
                # Ambil screenshot halaman login
                screenshot_path = os.path.join("test-results/screenshots", f"login_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Isi email (menggunakan email yang benar)
                await highlight_element(page, "#email")
                await page.fill("#email", "23091397164@student.unesa.ac.id")
                await asyncio.sleep(1)
                
                # Isi password (menggunakan password yang salah untuk memastikan gagal login)
                await highlight_element(page, "#password")
                await page.fill("#password", "23091397164")
                await asyncio.sleep(1)
                
                # Klik tombol login
                await highlight_element(page, "button[type='submit']")
                await page.click("button[type='submit']")
                await asyncio.sleep(2)
                
                # Verifikasi login berhasil
                current_url = page.url
                if "dashboard" in current_url:
                    print("Login berhasil, diarahkan ke dashboard.")
                    langkah.append("Login berhasil, diarahkan ke dashboard.")
                else:
                    print(f"Login gagal, diarahkan ke {current_url}")
                    langkah.append(f"Login gagal, diarahkan ke {current_url}")
                    
                    # Ambil screenshot hasil login
                    screenshot_path = os.path.join("test-results/screenshots", f"login_result_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Jika login gagal, berhenti
                    await browser.close()
                    buat_laporan_html(langkah, screenshots, error="Login gagal")
                    return
            except Exception as e:
                print(f"Error selama login: {e}")
                langkah.append(f"Error selama login: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 2: Navigasi ke halaman pembuatan program kerja
            print("Langkah 2: Navigasi ke halaman pembuatan program kerja...")
            langkah.append("Navigasi ke halaman pembuatan program kerja")
            
            try:
                # Navigasi langsung ke URL pembuatan program kerja
                await page.goto("http://localhost:3000/dashboard/programs/create")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman pembuatan program kerja
                screenshot_path = os.path.join("test-results/screenshots", f"buat_proker_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
            except Exception as e:
                print(f"Error saat navigasi ke halaman pembuatan program kerja: {e}")
                langkah.append(f"Error saat navigasi ke halaman pembuatan program kerja: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 3: Isi form pembuatan program kerja
            print("Langkah 3: Mengisi form pembuatan program kerja...")
            langkah.append("Mengisi form pembuatan program kerja")
            
            # Data untuk program kerja baru
            nomor_random = random.randint(100, 999)
            nama_program = f"Program Kerja Test {nomor_random}"
            deskripsi_program = f"Ini adalah deskripsi program kerja test {nomor_random} yang dibuat secara otomatis oleh pengujian."
            
            try:
                # Isi nama program
                await highlight_element(page, "input#name")
                await page.fill("input#name", nama_program)
                print(f"Mengisi Nama Program: {nama_program}")
                langkah.append(f"Mengisi Nama Program: {nama_program}")
                
                # Isi deskripsi program
                await highlight_element(page, "textarea#description")
                await page.fill("textarea#description", deskripsi_program)
                print(f"Mengisi Deskripsi: {deskripsi_program}")
                langkah.append(f"Mengisi Deskripsi: {deskripsi_program}")
                
                # Isi tanggal mulai (hari ini)
                today = datetime.datetime.now().strftime("%Y-%m-%d")
                await highlight_element(page, "input#startDate")
                await page.fill("input#startDate", today)
                print(f"Mengisi Tanggal Mulai: {today}")
                langkah.append(f"Mengisi Tanggal Mulai: {today}")
                
                # Isi tanggal selesai (30 hari dari sekarang)
                end_date = (datetime.datetime.now() + datetime.timedelta(days=30)).strftime("%Y-%m-%d")
                await highlight_element(page, "input#endDate")
                await page.fill("input#endDate", end_date)
                print(f"Mengisi Tanggal Selesai: {end_date}")
                langkah.append(f"Mengisi Tanggal Selesai: {end_date}")
                
                # Pilih departemen dari dropdown
                try:
                    # Klik dropdown departemen
                    await highlight_element(page, "div.space-y-2:has(label[for='departmentId']) button")
                    await page.click("div.space-y-2:has(label[for='departmentId']) button")
                    await asyncio.sleep(1)
                    
                    # Pilih departemen pertama dari daftar
                    first_dept = await page.query_selector(".select-content .select-item:first-child")
                    if first_dept:
                        await highlight_element(page, first_dept)
                        await first_dept.click()
                        print("Memilih departemen dari dropdown")
                        langkah.append("Memilih departemen dari dropdown")
                    else:
                        print("Tidak dapat menemukan departemen dalam dropdown")
                        langkah.append("Tidak dapat menemukan departemen dalam dropdown")
                except Exception as e:
                    print(f"Error saat memilih departemen: {e}")
                    langkah.append(f"Error saat memilih departemen: {e}")
                
                # Pilih penanggung jawab dari dropdown
                try:
                    # Klik dropdown penanggung jawab
                    await highlight_element(page, "div.space-y-2:has(label[for='picId']) button")
                    await page.click("div.space-y-2:has(label[for='picId']) button")
                    await asyncio.sleep(1)
                    
                    # Pilih penanggung jawab pertama dari daftar
                    first_pic = await page.query_selector(".select-content .select-item:first-child")
                    if first_pic:
                        await highlight_element(page, first_pic)
                        await first_pic.click()
                        print("Memilih penanggung jawab dari dropdown")
                        langkah.append("Memilih penanggung jawab dari dropdown")
                    else:
                        print("Tidak dapat menemukan penanggung jawab dalam dropdown")
                        langkah.append("Tidak dapat menemukan penanggung jawab dalam dropdown")
                except Exception as e:
                    print(f"Error saat memilih penanggung jawab: {e}")
                    langkah.append(f"Error saat memilih penanggung jawab: {e}")
                
                # Isi anggaran
                anggaran = str(random.randint(1000000, 10000000))
                await highlight_element(page, "input#budget")
                await page.fill("input#budget", anggaran)
                print(f"Mengisi Anggaran: Rp {anggaran}")
                langkah.append(f"Mengisi Anggaran: Rp {anggaran}")
                
                # Pilih status dari dropdown
                try:
                    # Klik dropdown status
                    await highlight_element(page, "div.space-y-2:has(label[for='status']) button")
                    await page.click("div.space-y-2:has(label[for='status']) button")
                    await asyncio.sleep(1)
                    
                    # Pilih status "Dalam Progres"
                    status_option = await page.query_selector(".select-content .select-item[value='dalam_progres']")
                    if status_option:
                        await highlight_element(page, status_option)
                        await status_option.click()
                        print("Memilih status: Dalam Progres")
                        langkah.append("Memilih status: Dalam Progres")
                    else:
                        print("Tidak dapat menemukan status dalam dropdown")
                        langkah.append("Tidak dapat menemukan status dalam dropdown")
                except Exception as e:
                    print(f"Error saat memilih status: {e}")
                    langkah.append(f"Error saat memilih status: {e}")
                
                # Ambil screenshot setelah mengisi form
                screenshot_path = os.path.join("test-results/screenshots", f"form_filled_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
            except Exception as e:
                print(f"Error saat mengisi form: {e}")
                langkah.append(f"Error saat mengisi form: {e}")
            
            # Langkah 4: Submit form pembuatan program kerja
            print("Langkah 4: Submit form pembuatan program kerja...")
            langkah.append("Submit form pembuatan program kerja")
            
            try:
                # Cari tombol submit
                submit_button = await page.query_selector("button[type='submit']")
                
                if submit_button:
                    await highlight_element(page, submit_button)
                    print("Tombol submit ditemukan")
                    langkah.append("Tombol submit ditemukan")
                    
                    # Ambil screenshot sebelum submit
                    screenshot_path = os.path.join("test-results/screenshots", f"pre_submit_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Klik tombol submit
                    await submit_button.click()
                    await asyncio.sleep(5)  # Tunggu lebih lama untuk proses submit selesai
                else:
                    print("Tidak dapat menemukan tombol submit")
                    langkah.append("Tidak dapat menemukan tombol submit")
            except Exception as e:
                print(f"Error saat submit form: {e}")
                langkah.append(f"Error saat submit form: {e}")
            
            # Langkah 5: Verifikasi hasil submit
            print("Langkah 5: Verifikasi hasil submit...")
            langkah.append("Verifikasi hasil submit")
            
            try:
                # Ambil screenshot hasil submit
                screenshot_path = os.path.join("test-results/screenshots", f"submit_result_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Cek apakah ada pesan error
                error_message = await page.query_selector(".bg-destructive\\/15, .text-destructive")
                if error_message:
                    error_text = await error_message.text_content()
                    print(f"Pesan error ditemukan: {error_text}")
                    langkah.append(f"Pesan error ditemukan: {error_text}")
                else:
                    # Cek apakah ada pesan sukses
                    success_message = await page.query_selector(".bg-green-100, .text-green-800")
                    if success_message:
                        success_text = await success_message.text_content()
                        print(f"Pesan sukses ditemukan: {success_text}")
                        langkah.append(f"Pesan sukses ditemukan: {success_text}")
                        
                        # Tunggu redirect ke halaman detail program
                        await asyncio.sleep(2)
                        
                        current_url = page.url
                        if "dashboard/programs/" in current_url and not current_url.endswith("create"):
                            print(f"Berhasil diarahkan ke halaman detail program: {current_url}")
                            langkah.append(f"Berhasil diarahkan ke halaman detail program: {current_url}")
                            
                            # Ambil screenshot halaman detail program
                            screenshot_path = os.path.join("test-results/screenshots", f"program_detail_{len(screenshots)}.png")
                            await page.screenshot(path=screenshot_path)
                            screenshots.append(screenshot_path)
                            
                            # Verifikasi nama program muncul di halaman detail
                            if await page.is_visible(f"text={nama_program}"):
                                print(f"Program kerja baru '{nama_program}' ditemukan di halaman detail")
                                langkah.append(f"Program kerja baru '{nama_program}' ditemukan di halaman detail")
                            else:
                                print(f"Program kerja baru '{nama_program}' tidak ditemukan di halaman detail")
                                langkah.append(f"Program kerja baru '{nama_program}' tidak ditemukan di halaman detail")
                        else:
                            print(f"Tidak diarahkan ke halaman detail program, URL saat ini: {current_url}")
                            langkah.append(f"Tidak diarahkan ke halaman detail program, URL saat ini: {current_url}")
                    else:
                        print("Tidak ada pesan sukses atau error yang ditemukan")
                        langkah.append("Tidak ada pesan sukses atau error yang ditemukan")
            except Exception as e:
                print(f"Error saat verifikasi hasil: {e}")
                langkah.append(f"Error saat verifikasi hasil: {e}")
            
            # Tutup browser
            await browser.close()
            
            # Buat laporan HTML
            buat_laporan_html(langkah, screenshots)
            
    except Exception as e:
        print(f"Error selama pengujian pembuatan program kerja: {e}")
        buat_laporan_html(langkah, screenshots, error=str(e))

async def highlight_element(page, selector):
    """Highlight elemen pada halaman untuk visualisasi."""
    try:
        # Jika selector adalah elemen, gunakan evaluateHandle
        if hasattr(selector, "evaluate"):
            await selector.evaluate("""element => {
                const originalStyle = element.style.border;
                element.style.border = '2px solid red';
                element.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                setTimeout(() => {
                    element.style.border = originalStyle;
                    element.style.backgroundColor = '';
                }, 1000);
            }""")
        else:
            # Jika selector adalah string, gunakan querySelector
            await page.evaluate("""selector => {
                const element = document.querySelector(selector);
                if (element) {
                    const originalStyle = element.style.border;
                    element.style.border = '2px solid red';
                    element.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                    setTimeout(() => {
                        element.style.border = originalStyle;
                        element.style.backgroundColor = '';
                    }, 1000);
                }
            }""", selector)
    except Exception as e:
        print(f"Error saat highlight elemen: {e}")

def buat_laporan_html(langkah, screenshots, error=None):
    """Buat laporan HTML untuk hasil pengujian."""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    nama_file = f"test-results/buat-proker-test-report-{timestamp}.html"
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Pembuatan Program Kerja Proker Tracker</title>
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
                background-color: #dff0d8;
                color: #3c763d;
            }}
            .error {{
                background-color: #f2dede;
                color: #a94442;
            }}
            .steps {{
                margin-bottom: 30px;
            }}
            .step {{
                margin-bottom: 15px;
                padding: 10px;
                background-color: #f5f5f5;
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
                display: block;
                margin-bottom: 10px;
            }}
            .error-details {{
                background-color: #f2dede;
                color: #a94442;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Laporan Pengujian Pembuatan Program Kerja</h1>
                <div class="status {{'error' if error else 'success'}}">
                    {{'GAGAL' if error else 'BERHASIL'}}
                </div>
            </div>
            
            <div class="info">
                <p><strong>Tanggal & Waktu:</strong> {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
                <p><strong>URL:</strong> http://localhost:3000</p>
            </div>
            
            {f'<div class="error-details"><h3>Error:</h3><p>{error}</p></div>' if error else ''}
            
            <div class="steps">
                <h2>Langkah-langkah Pengujian</h2>
                {''.join([f'<div class="step"><p>{i+1}. {step}</p></div>' for i, step in enumerate(langkah)])}
            </div>
            
            <div class="screenshots">
                <h2>Screenshots</h2>
                <div class="screenshots-grid">
                    {''.join([f'<div class="screenshot"><img src="{os.path.relpath(screenshot, "test-results")}" alt="Screenshot {i+1}"><p>Screenshot {i+1}</p></div>' for i, screenshot in enumerate(screenshots)])}
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    with open(nama_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Laporan pengujian dibuat: {nama_file}")

if __name__ == "__main__":
    asyncio.run(main())
