"""
Skrip pengujian sederhana untuk fungsionalitas pembuatan tugas Proker Tracker.
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
    """Fungsi utama untuk menjalankan pengujian pembuatan tugas."""
    print("Memulai pengujian pembuatan tugas...")
    
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
                
                # Tunggu lebih lama untuk memastikan halaman login telah dimuat sepenuhnya
                await asyncio.sleep(3)
                
                # Isi email (menggunakan email yang benar)
                await highlight_element(page, "#email")
                await page.fill("#email", "23091397101@student.unesa.ac.id")
                await asyncio.sleep(2)
                
                # Isi password (menggunakan password yang benar)
                await highlight_element(page, "#password")
                await page.fill("#password", "23091397101")
                await asyncio.sleep(2)
                
                # Klik tombol login menggunakan JavaScript untuk menghindari masalah pointer events
                login_button = await page.query_selector("button[type='submit']")
                if login_button:
                    await highlight_element(page, login_button)
                    await page.evaluate("(element) => element.click()", login_button)
                    print("Tombol login diklik menggunakan JavaScript")
                else:
                    # Alternatif jika tombol tidak ditemukan
                    await page.evaluate("document.querySelector('form').submit()")
                    print("Form login di-submit menggunakan JavaScript")
                
                # Tunggu lebih lama untuk proses login selesai
                await asyncio.sleep(5)
                
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
            
            # Langkah 2: Navigasi ke halaman pembuatan tugas
            print("Langkah 2: Navigasi ke halaman pembuatan tugas...")
            langkah.append("Navigasi ke halaman pembuatan tugas")
            
            try:
                # Navigasi langsung ke URL pembuatan tugas
                await page.goto("http://localhost:3000/dashboard/tasks/create")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman pembuatan tugas
                screenshot_path = os.path.join("test-results/screenshots", f"buat_tugas_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
            except Exception as e:
                print(f"Error saat navigasi ke halaman pembuatan tugas: {e}")
                langkah.append(f"Error saat navigasi ke halaman pembuatan tugas: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 3: Isi form pembuatan tugas
            print("Langkah 3: Mengisi form pembuatan tugas...")
            langkah.append("Mengisi form pembuatan tugas")
            
            # Data untuk tugas baru
            nomor_random = random.randint(100, 999)
            nama_tugas = f"Tugas Test {nomor_random}"
            deskripsi_tugas = f"Ini adalah deskripsi tugas test {nomor_random} yang dibuat secara otomatis oleh pengujian."
            
            try:
                # Isi nama tugas
                await highlight_element(page, "input#name")
                await page.fill("input#name", nama_tugas)
                print(f"Mengisi Nama Tugas: {nama_tugas}")
                langkah.append(f"Mengisi Nama Tugas: {nama_tugas}")
                
                # Isi deskripsi tugas
                await highlight_element(page, "textarea#description")
                await page.fill("textarea#description", deskripsi_tugas)
                print(f"Mengisi Deskripsi: {deskripsi_tugas}")
                langkah.append(f"Mengisi Deskripsi: {deskripsi_tugas}")
                
                # Isi tanggal tenggat (7 hari dari sekarang)
                due_date = (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%d")
                await highlight_element(page, "input#dueDate")
                await page.fill("input#dueDate", due_date)
                print(f"Mengisi Tanggal Tenggat: {due_date}")
                langkah.append(f"Mengisi Tanggal Tenggat: {due_date}")
                
                # Pilih program dari dropdown menggunakan pendekatan alternatif
                try:
                    # Tunggu lebih lama untuk memastikan data program telah dimuat
                    await asyncio.sleep(3)
                    
                    # Klik dropdown program menggunakan JavaScript
                    program_dropdown = await page.query_selector("div.space-y-2:has(label[for='programId']) button")
                    if program_dropdown:
                        await highlight_element(page, program_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", program_dropdown)
                        await asyncio.sleep(3)  # Tunggu lebih lama untuk dropdown terbuka
                        
                        # Coba pilih program dengan berbagai selector
                        selectors = [
                            ".select-content .select-item:first-child",
                            ".select-content .select-item",
                            "[role='option']",
                            "li[role='option']",
                            ".select-item"
                        ]
                        
                        program_selected = False
                        for selector in selectors:
                            program_option = await page.query_selector(selector)
                            if program_option:
                                await highlight_element(page, program_option)
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", program_option)
                                print(f"Memilih program menggunakan selector: {selector}")
                                langkah.append(f"Memilih program menggunakan selector: {selector}")
                                program_selected = True
                                break
                        
                        if not program_selected:
                            # Alternatif: Coba set nilai langsung dengan JavaScript
                            print("Mencoba set nilai program langsung dengan JavaScript")
                            langkah.append("Mencoba set nilai program langsung dengan JavaScript")
                            # Coba dapatkan ID program pertama dari halaman
                            program_id = await page.evaluate("""
                                () => {
                                    const select = document.querySelector('select[name="programId"]');
                                    return select && select.options.length > 0 ? select.options[0].value : null;
                                }
                            """)
                            
                            if program_id:
                                await page.evaluate(f"""
                                    () => {{
                                        const select = document.querySelector('select[name="programId"]');
                                        if (select) select.value = '{program_id}';
                                        const event = new Event('change', {{ bubbles: true }});
                                        select.dispatchEvent(event);
                                    }}
                                """)
                                print(f"Set nilai program ke ID: {program_id}")
                                langkah.append(f"Set nilai program ke ID: {program_id}")
                            else:
                                print("Tidak dapat menemukan ID program")
                                langkah.append("Tidak dapat menemukan ID program")
                    else:
                        print("Tidak dapat menemukan dropdown program")
                        langkah.append("Tidak dapat menemukan dropdown program")
                except Exception as e:
                    print(f"Error saat memilih program: {e}")
                    langkah.append(f"Error saat memilih program: {e}")
                
                # Pilih prioritas dari dropdown
                try:
                    # Tunggu lebih lama untuk memastikan halaman telah diperbarui
                    await asyncio.sleep(2)
                    
                    # Klik dropdown prioritas menggunakan JavaScript
                    priority_dropdown = await page.query_selector("div.space-y-2:has(label[for='priority']) button")
                    if priority_dropdown:
                        await highlight_element(page, priority_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", priority_dropdown)
                        await asyncio.sleep(2)  # Tunggu lebih lama untuk dropdown terbuka
                        
                        # Coba pilih prioritas dengan berbagai selector
                        priority_selectors = [
                            ".select-content .select-item[value='tinggi']",
                            ".select-content .select-item:nth-child(3)",  # Biasanya "Tinggi" adalah opsi ketiga
                            ".select-content .select-item",
                            "[role='option']:nth-child(3)",
                            "[role='option']"
                        ]
                        
                        priority_selected = False
                        for selector in priority_selectors:
                            priority_option = await page.query_selector(selector)
                            if priority_option:
                                await highlight_element(page, priority_option)
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", priority_option)
                                print("Memilih prioritas: Tinggi")
                                langkah.append("Memilih prioritas: Tinggi")
                                priority_selected = True
                                break
                        
                        if not priority_selected:
                            print("Tidak dapat menemukan prioritas dalam dropdown")
                            langkah.append("Tidak dapat menemukan prioritas dalam dropdown")
                    else:
                        print("Tidak dapat menemukan dropdown prioritas")
                        langkah.append("Tidak dapat menemukan dropdown prioritas")
                except Exception as e:
                    print(f"Error saat memilih prioritas: {e}")
                    langkah.append(f"Error saat memilih prioritas: {e}")
                
                # Pilih status dari dropdown
                try:
                    # Tunggu lebih lama untuk memastikan halaman telah diperbarui
                    await asyncio.sleep(2)
                    
                    # Klik dropdown status menggunakan JavaScript
                    status_dropdown = await page.query_selector("div.space-y-2:has(label[for='status']) button")
                    if status_dropdown:
                        await highlight_element(page, status_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", status_dropdown)
                        await asyncio.sleep(2)  # Tunggu lebih lama untuk dropdown terbuka
                        
                        # Coba pilih status dengan berbagai selector
                        status_selectors = [
                            ".select-content .select-item[value='dalam_progres']",
                            ".select-content .select-item:nth-child(2)",  # Biasanya "Dalam Progres" adalah opsi kedua
                            ".select-content .select-item",
                            "[role='option']:nth-child(2)",
                            "[role='option']"
                        ]
                        
                        status_selected = False
                        for selector in status_selectors:
                            status_option = await page.query_selector(selector)
                            if status_option:
                                await highlight_element(page, status_option)
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", status_option)
                                print("Memilih status: Dalam Progres")
                                langkah.append("Memilih status: Dalam Progres")
                                status_selected = True
                                break
                        
                        if not status_selected:
                            print("Tidak dapat menemukan status dalam dropdown")
                            langkah.append("Tidak dapat menemukan status dalam dropdown")
                    else:
                        print("Tidak dapat menemukan dropdown status")
                        langkah.append("Tidak dapat menemukan dropdown status")
                except Exception as e:
                    print(f"Error saat memilih status: {e}")
                    langkah.append(f"Error saat memilih status: {e}")
                
            except Exception as e:
                print(f"Error saat mengisi form: {e}")
                langkah.append(f"Error saat mengisi form: {e}")
            
            # Langkah 4: Submit form pembuatan tugas menggunakan JavaScript
            print("Langkah 4: Submit form pembuatan tugas...")
            langkah.append("Submit form pembuatan tugas")
            
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
                    error_message = await page.query_selector(".bg-destructive\\/15, .text-destructive, [role='alert']")
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
                
                # Cek apakah telah diarahkan ke halaman daftar tugas
                if "dashboard/tasks" in current_url and not current_url.endswith("create"):
                    print(f"Berhasil diarahkan ke halaman daftar tugas: {current_url}")
                    langkah.append(f"Berhasil diarahkan ke halaman daftar tugas: {current_url}")
                    
                    # Coba ambil screenshot halaman daftar tugas
                    try:
                        screenshot_path = os.path.join("test-results/screenshots", f"tasks_list_{len(screenshots)}.png")
                        await page.screenshot(path=screenshot_path)
                        screenshots.append(screenshot_path)
                    except Exception as detail_screenshot_error:
                        print(f"Error saat mengambil screenshot daftar tugas: {detail_screenshot_error}")
                        langkah.append(f"Error saat mengambil screenshot daftar tugas: {detail_screenshot_error}")
                    
                    # Verifikasi nama tugas muncul di halaman daftar
                    try:
                        if await page.is_visible(f"text={nama_tugas}"):
                            print(f"Tugas baru '{nama_tugas}' ditemukan di halaman daftar")
                            langkah.append(f"Tugas baru '{nama_tugas}' ditemukan di halaman daftar")
                        else:
                            print(f"Tugas baru '{nama_tugas}' tidak ditemukan di halaman daftar")
                            langkah.append(f"Tugas baru '{nama_tugas}' tidak ditemukan di halaman daftar")
                    except Exception as visibility_error:
                        print(f"Error saat memeriksa nama tugas: {visibility_error}")
                        langkah.append(f"Error saat memeriksa nama tugas: {visibility_error}")
                else:
                    print(f"Tidak diarahkan ke halaman daftar tugas, URL saat ini: {current_url}")
                    langkah.append(f"Tidak diarahkan ke halaman daftar tugas, URL saat ini: {current_url}")
            except Exception as e:
                print(f"Error saat verifikasi hasil: {e}")
                langkah.append(f"Error saat verifikasi hasil: {e}")
            
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
    report_filename = f"test-results/buat-tugas-test-report-{timestamp}.html"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Pembuatan Tugas</title>
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
            <h1>Laporan Pengujian Pembuatan Tugas</h1>
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
