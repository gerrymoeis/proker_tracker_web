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
                await page.fill("#email", "23091397101@student.unesa.ac.id")
                await asyncio.sleep(1)
                
                # Isi password (menggunakan password yang benar)
                await highlight_element(page, "#password")
                await page.fill("#password", "23091397101")
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
                
                # Pilih departemen dari dropdown dengan pendekatan alternatif
                try:
                    # Tunggu lebih lama untuk memastikan data departemen telah dimuat
                    await asyncio.sleep(3)
                    
                    # Klik dropdown departemen menggunakan JavaScript
                    department_dropdown = await page.query_selector("div.space-y-2:has(label[for='departmentId']) button")
                    if department_dropdown:
                        await highlight_element(page, department_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", department_dropdown)
                        await asyncio.sleep(3)  # Tunggu lebih lama untuk dropdown terbuka
                        
                        # Coba pilih departemen dengan berbagai selector
                        selectors = [
                            ".select-content .select-item:first-child",
                            ".select-content .select-item",
                            "[role='option']",
                            "li[role='option']",
                            ".select-item"
                        ]
                        
                        department_selected = False
                        for selector in selectors:
                            department_option = await page.query_selector(selector)
                            if department_option:
                                await highlight_element(page, department_option)
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", department_option)
                                print(f"Memilih departemen menggunakan selector: {selector}")
                                langkah.append(f"Memilih departemen menggunakan selector: {selector}")
                                department_selected = True
                                break
                        
                        if not department_selected:
                            # Alternatif: Coba set nilai langsung dengan JavaScript
                            print("Mencoba set nilai departemen langsung dengan JavaScript")
                            langkah.append("Mencoba set nilai departemen langsung dengan JavaScript")
                            # Coba dapatkan ID departemen pertama dari halaman
                            department_id = await page.evaluate("""
                                () => {
                                    const select = document.querySelector('select[name="departmentId"]');
                                    return select && select.options.length > 0 ? select.options[0].value : null;
                                }
                            """)
                            
                            if department_id:
                                await page.evaluate(f"""
                                    () => {{
                                        const select = document.querySelector('select[name="departmentId"]');
                                        if (select) select.value = '{department_id}';
                                        const event = new Event('change', {{ bubbles: true }});
                                        select.dispatchEvent(event);
                                    }}
                                """)
                                print(f"Set nilai departemen ke ID: {department_id}")
                                langkah.append(f"Set nilai departemen ke ID: {department_id}")
                            else:
                                print("Tidak dapat menemukan ID departemen")
                                langkah.append("Tidak dapat menemukan ID departemen")
                    else:
                        print("Tidak dapat menemukan dropdown departemen")
                        langkah.append("Tidak dapat menemukan dropdown departemen")
                except Exception as e:
                    print(f"Error saat memilih departemen: {e}")
                    langkah.append(f"Error saat memilih departemen: {e}")
                
                # Pilih penanggung jawab dari dropdown dengan pendekatan alternatif
                try:
                    # Tunggu lebih lama untuk memastikan data penanggung jawab telah dimuat
                    await asyncio.sleep(3)
                    
                    # Klik dropdown penanggung jawab menggunakan JavaScript
                    pic_dropdown = await page.query_selector("div.space-y-2:has(label[for='picId']) button")
                    if pic_dropdown:
                        await highlight_element(page, pic_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", pic_dropdown)
                        await asyncio.sleep(3)  # Tunggu lebih lama untuk dropdown terbuka
                        
                        # Coba pilih penanggung jawab dengan berbagai selector
                        selectors = [
                            ".select-content .select-item:first-child",
                            ".select-content .select-item",
                            "[role='option']",
                            "li[role='option']",
                            ".select-item"
                        ]
                        
                        pic_selected = False
                        for selector in selectors:
                            pic_option = await page.query_selector(selector)
                            if pic_option:
                                await highlight_element(page, pic_option)
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", pic_option)
                                print(f"Memilih penanggung jawab menggunakan selector: {selector}")
                                langkah.append(f"Memilih penanggung jawab menggunakan selector: {selector}")
                                pic_selected = True
                                break
                        
                        if not pic_selected:
                            # Alternatif: Coba set nilai langsung dengan JavaScript
                            print("Mencoba set nilai penanggung jawab langsung dengan JavaScript")
                            langkah.append("Mencoba set nilai penanggung jawab langsung dengan JavaScript")
                            # Coba dapatkan ID penanggung jawab pertama dari halaman
                            pic_id = await page.evaluate("""
                                () => {
                                    const select = document.querySelector('select[name="picId"]');
                                    return select && select.options.length > 0 ? select.options[0].value : null;
                                }
                            """)
                            
                            if pic_id:
                                await page.evaluate(f"""
                                    () => {{
                                        const select = document.querySelector('select[name="picId"]');
                                        if (select) select.value = '{pic_id}';
                                        const event = new Event('change', {{ bubbles: true }});
                                        select.dispatchEvent(event);
                                    }}
                                """)
                                print(f"Set nilai penanggung jawab ke ID: {pic_id}")
                                langkah.append(f"Set nilai penanggung jawab ke ID: {pic_id}")
                            else:
                                print("Tidak dapat menemukan ID penanggung jawab")
                                langkah.append("Tidak dapat menemukan ID penanggung jawab")
                    else:
                        print("Tidak dapat menemukan dropdown penanggung jawab")
                        langkah.append("Tidak dapat menemukan dropdown penanggung jawab")
                except Exception as e:
                    print(f"Error saat memilih penanggung jawab: {e}")
                    langkah.append(f"Error saat memilih penanggung jawab: {e}")
                
                # Isi anggaran
                anggaran = str(random.randint(1000000, 10000000))
                await highlight_element(page, "input#budget")
                await page.fill("input#budget", anggaran)
                print(f"Mengisi Anggaran: Rp {anggaran}")
                langkah.append(f"Mengisi Anggaran: Rp {anggaran}")
                
                # Pilih status dari dropdown menggunakan JavaScript
                try:
                    # Klik dropdown status menggunakan JavaScript
                    status_dropdown = await page.query_selector("div.space-y-2:has(label[for='status']) button")
                    if status_dropdown:
                        await highlight_element(page, status_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", status_dropdown)
                        await asyncio.sleep(2)
                        
                        # Pilih status "Dalam Progres"
                        status_option = await page.query_selector(".select-content .select-item[value='dalam_progres']")
                        if status_option:
                            await highlight_element(page, status_option)
                            # Klik menggunakan JavaScript
                            await page.evaluate("(element) => element.click()", status_option)
                            print("Memilih status: Dalam Progres")
                            langkah.append("Memilih status: Dalam Progres")
                        else:
                            # Coba pilih opsi pertama jika tidak dapat menemukan "Dalam Progres"
                            first_status = await page.query_selector(".select-content .select-item:first-child")
                            if first_status:
                                await highlight_element(page, first_status)
                                await page.evaluate("(element) => element.click()", first_status)
                                print("Memilih status pertama dari dropdown")
                                langkah.append("Memilih status pertama dari dropdown")
                            else:
                                print("Tidak dapat menemukan status dalam dropdown")
                                langkah.append("Tidak dapat menemukan status dalam dropdown")
                    else:
                        print("Tidak dapat menemukan dropdown status")
                        langkah.append("Tidak dapat menemukan dropdown status")
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
            
            # Langkah 4: Submit form pembuatan program kerja menggunakan JavaScript
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
                    
                    # Klik tombol submit menggunakan JavaScript untuk menghindari masalah pointer events
                    await page.evaluate("(element) => element.click()", submit_button)
                    print("Tombol submit diklik menggunakan JavaScript")
                    langkah.append("Tombol submit diklik menggunakan JavaScript")
                    
                    # Tunggu lebih lama untuk proses submit selesai
                    await asyncio.sleep(5)
                else:
                    # Alternatif: coba submit form langsung menggunakan JavaScript
                    print("Mencoba submit form menggunakan JavaScript")
                    langkah.append("Mencoba submit form menggunakan JavaScript")
                    await page.evaluate("document.querySelector('form').submit()")
                    await asyncio.sleep(5)
            except Exception as e:
                print(f"Error saat submit form: {e}")
                langkah.append(f"Error saat submit form: {e}")
            
            # Langkah 5: Verifikasi hasil submit dengan timeout yang lebih pendek
            print("Langkah 5: Verifikasi hasil submit...")
            langkah.append("Verifikasi hasil submit")
            
            try:
                # Tunggu sebentar untuk memastikan halaman telah diperbarui
                await asyncio.sleep(3)
                
                # Ambil screenshot hasil submit
                try:
                    screenshot_path = os.path.join("test-results/screenshots", f"submit_result_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                except Exception as screenshot_error:
                    print(f"Error saat mengambil screenshot: {screenshot_error}")
                    langkah.append(f"Error saat mengambil screenshot: {screenshot_error}")
                
                # Cek URL saat ini
                current_url = page.url
                print(f"URL saat ini: {current_url}")
                langkah.append(f"URL saat ini: {current_url}")
                
                # Cek apakah ada pesan error
                try:
                    error_message = await page.query_selector(".bg-destructive\/15, .text-destructive, [role='alert']")
                    if error_message:
                        error_text = await error_message.text_content()
                        print(f"Pesan error ditemukan: {error_text}")
                        langkah.append(f"Pesan error ditemukan: {error_text}")
                    else:
                        # Cek apakah ada pesan sukses
                        success_message = await page.query_selector(".bg-green-100, .text-green-800, .text-green-400")
                        if success_message:
                            success_text = await success_message.text_content()
                            print(f"Pesan sukses ditemukan: {success_text}")
                            langkah.append(f"Pesan sukses ditemukan: {success_text}")
                        else:
                            print("Tidak ada pesan sukses atau error yang ditemukan")
                            langkah.append("Tidak ada pesan sukses atau error yang ditemukan")
                except Exception as selector_error:
                    print(f"Error saat mencari pesan: {selector_error}")
                    langkah.append(f"Error saat mencari pesan: {selector_error}")
                
                # Cek apakah telah diarahkan ke halaman detail program
                if "dashboard/programs/" in current_url and not current_url.endswith("create"):
                    print(f"Berhasil diarahkan ke halaman detail program: {current_url}")
                    langkah.append(f"Berhasil diarahkan ke halaman detail program: {current_url}")
                    
                    # Coba ambil screenshot halaman detail program
                    try:
                        screenshot_path = os.path.join("test-results/screenshots", f"program_detail_{len(screenshots)}.png")
                        await page.screenshot(path=screenshot_path)
                        screenshots.append(screenshot_path)
                    except Exception as detail_screenshot_error:
                        print(f"Error saat mengambil screenshot detail: {detail_screenshot_error}")
                        langkah.append(f"Error saat mengambil screenshot detail: {detail_screenshot_error}")
                    
                    # Verifikasi nama program muncul di halaman detail
                    try:
                        if await page.is_visible(f"text={nama_program}"):
                            print(f"Program kerja baru '{nama_program}' ditemukan di halaman detail")
                            langkah.append(f"Program kerja baru '{nama_program}' ditemukan di halaman detail")
                        else:
                            print(f"Program kerja baru '{nama_program}' tidak ditemukan di halaman detail")
                            langkah.append(f"Program kerja baru '{nama_program}' tidak ditemukan di halaman detail")
                    except Exception as visibility_error:
                        print(f"Error saat memeriksa nama program: {visibility_error}")
                        langkah.append(f"Error saat memeriksa nama program: {visibility_error}")
                else:
                    print(f"Tidak diarahkan ke halaman detail program, URL saat ini: {current_url}")
                    langkah.append(f"Tidak diarahkan ke halaman detail program, URL saat ini: {current_url}")
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
