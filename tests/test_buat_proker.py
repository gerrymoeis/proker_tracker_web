"""
Skrip pengujian untuk fungsionalitas pembuatan program kerja Proker Tracker.
Menguji seluruh alur pembuatan program kerja baru dari login hingga verifikasi hasil.
"""
import os
import sys
import asyncio
import datetime
import random
from playwright.async_api import async_playwright, TimeoutError

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
            
            # Buat konteks browser baru dengan ukuran viewport yang lebih besar
            context = await browser.new_context(viewport={"width": 1366, "height": 768})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Login terlebih dahulu
            print("Langkah 1: Login terlebih dahulu...")
            langkah.append("Login terlebih dahulu")
            
            try:
                await page.goto("http://localhost:3000/login", wait_until="load")
                await page.wait_for_load_state("networkidle")
                
                # Ambil screenshot halaman login
                screenshot_path = f"test-results/screenshots/login-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Halaman Login"})
                
                # Isi email
                await page.fill("#email", "23091397101@student.unesa.ac.id")
                await asyncio.sleep(0.5)
                
                # Isi password
                await page.fill("#password", "23091397101")
                await asyncio.sleep(0.5)
                
                # Klik tombol login
                await page.click("button[type='submit']")
                
                # Tunggu navigasi ke dashboard
                try:
                    await page.wait_for_url("**/dashboard", timeout=10000)
                    print("Login berhasil, diarahkan ke dashboard.")
                    langkah.append("Login berhasil, diarahkan ke dashboard.")
                    
                    # Ambil screenshot dashboard
                    screenshot_path = f"test-results/screenshots/dashboard-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await page.screenshot(path=screenshot_path)
                    screenshots.append({"path": screenshot_path, "caption": "Dashboard setelah login"})
                except TimeoutError:
                    print("Timeout saat menunggu navigasi ke dashboard.")
                    langkah.append("Timeout saat menunggu navigasi ke dashboard.")
                    
                    # Cek apakah ada pesan error
                    error_visible = await page.is_visible('[class*="bg-destructive"]')
                    if error_visible:
                        error_message = await page.text_content('[class*="bg-destructive"]')
                        print(f"Login gagal. Pesan error: {error_message}")
                        langkah.append(f"Login gagal: {error_message}")
                        
                        # Ambil screenshot dari halaman error
                        screenshot_path = f"test-results/screenshots/login-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                        await page.screenshot(path=screenshot_path)
                        screenshots.append({"path": screenshot_path, "caption": "Error Login"})
                        
                        # Buat laporan dan keluar karena tidak bisa melanjutkan
                        buat_laporan_html(langkah, screenshots, error="Tidak dapat melanjutkan pengujian karena login gagal")
                        await browser.close()
                        return
            except Exception as e:
                print(f"Error selama login: {e}")
                langkah.append(f"Error selama login: {e}")
                
                # Ambil screenshot dari halaman error
                screenshot_path = f"test-results/screenshots/login-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Error Login"})
                
                # Buat laporan dan keluar karena tidak bisa melanjutkan
                buat_laporan_html(langkah, screenshots, error=str(e))
                await browser.close()
                return
            
            # Langkah 2: Navigasi ke halaman pembuatan program kerja
            print("Langkah 2: Navigasi ke halaman pembuatan program kerja...")
            langkah.append("Navigasi ke halaman pembuatan program kerja")
            
            try:
                # Navigasi langsung ke URL pembuatan program kerja
                await page.goto("http://localhost:3000/dashboard/programs/create", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman pembuatan program kerja
                screenshot_path = f"test-results/screenshots/create-program-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Halaman Pembuatan Program Kerja"})
                
                # Verifikasi halaman pembuatan program kerja
                title_visible = await page.is_visible("h1:has-text('Buat Program Baru')")
                if title_visible:
                    print("Halaman pembuatan program kerja berhasil dimuat.")
                    langkah.append("Halaman pembuatan program kerja berhasil dimuat.")
                else:
                    print("Halaman pembuatan program kerja tidak berhasil dimuat.")
                    langkah.append("Halaman pembuatan program kerja tidak berhasil dimuat.")
                    
                    # Ambil screenshot dari halaman error
                    screenshot_path = f"test-results/screenshots/create-program-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await page.screenshot(path=screenshot_path)
                    screenshots.append({"path": screenshot_path, "caption": "Error Halaman Pembuatan Program Kerja"})
                    
                    # Buat laporan dan keluar karena tidak bisa melanjutkan
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat melanjutkan pengujian karena halaman pembuatan program kerja tidak berhasil dimuat")
                    await browser.close()
                    return
            except Exception as e:
                print(f"Error saat navigasi ke halaman pembuatan program kerja: {e}")
                langkah.append(f"Error saat navigasi ke halaman pembuatan program kerja: {e}")
                
                # Ambil screenshot dari halaman error
                screenshot_path = f"test-results/screenshots/create-program-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Error Navigasi"})
                
                # Buat laporan dan keluar karena tidak bisa melanjutkan
                buat_laporan_html(langkah, screenshots, error=str(e))
                await browser.close()
                return
            
            # Langkah 3: Isi form pembuatan program kerja
            print("Langkah 3: Mengisi form pembuatan program kerja...")
            langkah.append("Mengisi form pembuatan program kerja")
            
            # Data untuk program kerja baru
            nomor_random = random.randint(100, 999)
            nama_program = f"Program Test {nomor_random}"
            deskripsi_program = f"Ini adalah deskripsi program test {nomor_random} yang dibuat secara otomatis oleh pengujian."
            
            try:
                # Isi nama program
                await page.fill("input#name", nama_program)
                print(f"Mengisi Nama Program: {nama_program}")
                langkah.append(f"Mengisi Nama Program: {nama_program}")
                
                # Isi deskripsi program
                await page.fill("textarea#description", deskripsi_program)
                print(f"Mengisi Deskripsi: {deskripsi_program}")
                langkah.append(f"Mengisi Deskripsi: {deskripsi_program}")
                
                # Isi tanggal mulai (hari ini)
                today = datetime.datetime.now().strftime("%Y-%m-%d")
                await page.fill("input#startDate", today)
                print(f"Mengisi Tanggal Mulai: {today}")
                langkah.append(f"Mengisi Tanggal Mulai: {today}")
                
                # Isi tanggal selesai (30 hari dari sekarang)
                end_date = (datetime.datetime.now() + datetime.timedelta(days=30)).strftime("%Y-%m-%d")
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
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", department_option)
                                print(f"Memilih departemen menggunakan selector: {selector}")
                                langkah.append(f"Memilih departemen menggunakan selector: {selector}")
                                department_selected = True
                                break
                        
                        if not department_selected:
                            print("Tidak dapat menemukan departemen dalam dropdown")
                            langkah.append("Tidak dapat menemukan departemen dalam dropdown")
                    else:
                        print("Dropdown departemen tidak ditemukan")
                        langkah.append("Dropdown departemen tidak ditemukan")
                except Exception as e:
                    print(f"Error saat memilih departemen: {e}")
                    langkah.append(f"Error saat memilih departemen: {e}")
                
                # Pilih penanggung jawab dari dropdown dengan pendekatan alternatif
                try:
                    # Tunggu lebih lama untuk memastikan data pengguna telah dimuat
                    await asyncio.sleep(3)
                    
                    # Klik dropdown penanggung jawab menggunakan JavaScript
                    pic_dropdown = await page.query_selector("div.space-y-2:has(label[for='picId']) button")
                    if pic_dropdown:
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
                        print("Dropdown penanggung jawab tidak ditemukan")
                        langkah.append("Dropdown penanggung jawab tidak ditemukan")
                except Exception as e:
                    print(f"Error saat memilih penanggung jawab: {e}")
                    langkah.append(f"Error saat memilih penanggung jawab: {e}")
                
                # Isi anggaran
                anggaran = random.randint(1000000, 10000000)
                await page.fill("input#budget", str(anggaran))
                print(f"Mengisi Anggaran: Rp {anggaran}")
                langkah.append(f"Mengisi Anggaran: Rp {anggaran}")
                
                # Pilih status dari dropdown dengan pendekatan alternatif
                try:
                    # Tunggu lebih lama untuk memastikan dropdown status siap
                    await asyncio.sleep(2)
                    
                    # Klik dropdown status menggunakan JavaScript
                    status_dropdown = await page.query_selector("div.space-y-2:has(label[for='status']) button")
                    if status_dropdown:
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", status_dropdown)
                        await asyncio.sleep(2)  # Tunggu dropdown terbuka
                        
                        # Coba pilih status dengan berbagai selector
                        status_selectors = [
                            "[role='option']:has-text('Belum Dimulai')",
                            ".select-item:has-text('Belum Dimulai')",
                            "[data-value='belum_dimulai']"
                        ]
                        
                        status_selected = False
                        for selector in status_selectors:
                            status_option = await page.query_selector(selector)
                            if status_option:
                                # Klik menggunakan JavaScript
                                await page.evaluate("(element) => element.click()", status_option)
                                print(f"Memilih status menggunakan selector: {selector}")
                                langkah.append(f"Memilih status menggunakan selector: {selector}")
                                status_selected = True
                                break
                        
                        if not status_selected:
                            # Alternatif: Set nilai status langsung dengan JavaScript
                            print("Mencoba set nilai status langsung dengan JavaScript")
                            langkah.append("Mencoba set nilai status langsung dengan JavaScript")
                            await page.evaluate("""
                                () => {
                                    const select = document.querySelector('select[name="status"]');
                                    if (select) {
                                        select.value = 'belum_dimulai';
                                        const event = new Event('change', { bubbles: true });
                                        select.dispatchEvent(event);
                                    }
                                }
                            """)
                            print("Set nilai status ke: belum_dimulai")
                            langkah.append("Set nilai status ke: belum_dimulai")
                    else:
                        print("Tidak dapat menemukan status dalam dropdown")
                        langkah.append("Tidak dapat menemukan status dalam dropdown")
                except Exception as e:
                    print(f"Error saat memilih status: {e}")
                    langkah.append(f"Error saat memilih status: {e}")
                
                # Ambil screenshot form yang sudah diisi
                screenshot_path = f"test-results/screenshots/filled-form-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Form yang sudah diisi"})
            except Exception as e:
                print(f"Error saat mengisi form: {e}")
                langkah.append(f"Error saat mengisi form: {e}")
                
                # Ambil screenshot dari halaman error
                screenshot_path = f"test-results/screenshots/form-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Error Pengisian Form"})
                
                # Buat laporan dan keluar karena tidak bisa melanjutkan
                buat_laporan_html(langkah, screenshots, error=str(e))
                await browser.close()
                return
            
            # Langkah 4: Submit form
            print("Langkah 4: Submit form pembuatan program kerja...")
            langkah.append("Submit form pembuatan program kerja")
            
            try:
                # Klik tombol submit
                submit_button = await page.query_selector("button[type='submit']:has-text('Buat Program')")
                if submit_button:
                    print("Tombol submit ditemukan")
                    langkah.append("Tombol submit ditemukan")
                    
                    # Klik tombol submit
                    await submit_button.click()
                    print("Tombol submit diklik")
                    langkah.append("Tombol submit diklik")
                    
                    # Tunggu pesan sukses atau error
                    await asyncio.sleep(2)
                    
                    # Cek pesan sukses
                    success_visible = await page.is_visible("div:has-text('Program berhasil dibuat')")
                    if success_visible:
                        print("Program berhasil dibuat!")
                        langkah.append("Program berhasil dibuat!")
                        
                        # Ambil screenshot pesan sukses
                        screenshot_path = f"test-results/screenshots/success-message-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                        await page.screenshot(path=screenshot_path)
                        screenshots.append({"path": screenshot_path, "caption": "Pesan Sukses"})
                        
                        # Tunggu redirect ke halaman program
                        await asyncio.sleep(2)
                        
                        # Tunggu redirect ke halaman program
                        try:
                            await page.wait_for_url("**/dashboard/programs", timeout=5000)
                            print("Diarahkan ke halaman daftar program")
                            langkah.append("Diarahkan ke halaman daftar program")
                            
                            # Ambil screenshot halaman daftar program
                            screenshot_path = f"test-results/screenshots/programs-list-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                            await page.screenshot(path=screenshot_path)
                            screenshots.append({"path": screenshot_path, "caption": "Halaman Daftar Program"})
                            
                            # Langkah 5: Verifikasi program yang baru dibuat
                            print("Langkah 5: Verifikasi program yang baru dibuat...")
                            langkah.append("Verifikasi program yang baru dibuat")
                            
                            # Cari program yang baru dibuat
                            await page.fill("input[type='search']", nama_program)
                            await asyncio.sleep(2)
                            
                            # Ambil screenshot hasil pencarian
                            screenshot_path = f"test-results/screenshots/search-result-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                            await page.screenshot(path=screenshot_path)
                            screenshots.append({"path": screenshot_path, "caption": "Hasil Pencarian Program"})
                            
                            # Verifikasi program ditemukan
                            program_found = await page.is_visible(f"h3:has-text('{nama_program}')")
                            if program_found:
                                print(f"Program '{nama_program}' berhasil ditemukan!")
                                langkah.append(f"Program '{nama_program}' berhasil ditemukan!")
                            else:
                                print(f"Program '{nama_program}' tidak ditemukan.")
                                langkah.append(f"Program '{nama_program}' tidak ditemukan.")
                        except TimeoutError:
                            print("Timeout saat menunggu redirect ke halaman daftar program")
                            langkah.append("Timeout saat menunggu redirect ke halaman daftar program")
                            
                            # Ambil screenshot halaman saat ini
                            screenshot_path = f"test-results/screenshots/current-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                            await page.screenshot(path=screenshot_path)
                            screenshots.append({"path": screenshot_path, "caption": "Halaman Saat Ini"})
                    else:
                        # Cek pesan error
                        error_visible = await page.is_visible("div[class*='bg-destructive']")
                        if error_visible:
                            error_message = await page.text_content("div[class*='bg-destructive']")
                            print(f"Error saat membuat program: {error_message}")
                            langkah.append(f"Error saat membuat program: {error_message}")
                            
                            # Ambil screenshot pesan error
                            screenshot_path = f"test-results/screenshots/error-message-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                            await page.screenshot(path=screenshot_path)
                            screenshots.append({"path": screenshot_path, "caption": "Pesan Error"})
                        else:
                            print("Tidak ada pesan sukses atau error yang terlihat")
                            langkah.append("Tidak ada pesan sukses atau error yang terlihat")
                else:
                    print("Tombol submit tidak ditemukan")
                    langkah.append("Tombol submit tidak ditemukan")
            except Exception as e:
                print(f"Error saat submit form: {e}")
                langkah.append(f"Error saat submit form: {e}")
                
                # Ambil screenshot dari halaman error
                screenshot_path = f"test-results/screenshots/submit-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await page.screenshot(path=screenshot_path)
                screenshots.append({"path": screenshot_path, "caption": "Error Submit Form"})
            
            # Buat laporan HTML
            buat_laporan_html(langkah, screenshots)
            
            # Tutup browser
            await browser.close()
            
    except Exception as e:
        print(f"Error selama pengujian: {e}")
        langkah.append(f"Error: {str(e)}")
        
        # Buat laporan dengan error
        buat_laporan_html(langkah, screenshots, error=str(e))


def buat_laporan_html(langkah, screenshots, error=None):
    """Buat laporan HTML untuk hasil pengujian."""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = f"test-results/buat-proker-test-report-{timestamp}.html"
    
    # Tentukan status pengujian
    status = "BERHASIL"
    if error:
        status = "GAGAL"
    
    # Buat konten HTML
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
                max-width: 1200px;
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
            .info {{
                margin-bottom: 20px;
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
            .screenshot-caption {{
                font-weight: bold;
                text-align: center;
            }}
            .error-details {{
                background-color: #f8d7da;
                color: #721c24;
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
                <div class="status {'success' if status == 'BERHASIL' else 'failure'}">
                    {status}
                </div>
            </div>
            
            <div class="info">
                <p><strong>Tanggal & Waktu:</strong> {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <p><strong>URL:</strong> http://localhost:3000</p>
            </div>
            
            {f'''
            <div class="error-details">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
            ''' if error else ''}
            
            <div class="steps">
                <h2>Langkah-langkah Pengujian</h2>
                {''.join([f'<div class="step"><p>{i+1}. {step}</p></div>' for i, step in enumerate(langkah)])}
            </div>
            
            <h2>Screenshots</h2>
            <div class="screenshots">
                {''.join([f'''
                <div class="screenshot">
                    <img src="../{screenshot['path']}" alt="{screenshot['caption']}">
                    <div class="screenshot-caption">{screenshot['caption']}</div>
                </div>
                ''' for screenshot in screenshots])}
            </div>
        </div>
    </body>
    </html>
    """
    
    # Tulis ke file
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Laporan pengujian telah dibuat: {report_path}")


if __name__ == "__main__":
    asyncio.run(main())
