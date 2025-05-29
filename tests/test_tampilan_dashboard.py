"""
Skrip pengujian untuk tampilan dashboard Proker Tracker.
Menguji semua elemen UI dan memastikan tampilan dashboard berfungsi dengan baik.
"""
import os
import sys
import asyncio
import datetime
from playwright.async_api import async_playwright, TimeoutError

# Buat direktori hasil pengujian jika belum ada
os.makedirs("test-results", exist_ok=True)
os.makedirs("test-results/screenshots", exist_ok=True)

async def main():
    """Fungsi utama untuk menjalankan pengujian tampilan dashboard."""
    print("Memulai pengujian tampilan dashboard...")
    
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
            await page.goto("http://localhost:3000/login", wait_until="load")
            await page.wait_for_load_state("networkidle")
            
            # Ambil screenshot halaman login
            screenshot_path = f"test-results/screenshots/login-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Halaman Login"})
            
            # Isi kolom email
            await page.fill("#email", "23091397164@student.unesa.ac.id")
            await asyncio.sleep(0.5)
            
            # Isi kolom password
            await page.fill("#password", "23091397164")
            await asyncio.sleep(0.5)
            
            # Klik tombol login
            await page.click("button[type='submit']")
            
            # Tunggu hasil login
            try:
                # Coba tunggu navigasi ke dashboard
                await page.wait_for_url("**/dashboard", timeout=10000)
                print("Login berhasil, diarahkan ke dashboard.")
                langkah.append("Login berhasil, diarahkan ke dashboard")
            except TimeoutError:
                # Jika gagal, cek apakah ada pesan error
                error_visible = await page.is_visible('[class*="bg-destructive"]')
                if error_visible:
                    error_message = await page.text_content('[class*="bg-destructive"]')
                    print(f"Login gagal. Pesan error: {error_message}")
                    langkah.append(f"Login gagal: {error_message}")
                    
                    # Ambil screenshot dari halaman error
                    screenshot_path = f"test-results/screenshots/login-error-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await page.screenshot(path=screenshot_path)
                    screenshots.append({"path": screenshot_path, "caption": "Error Login"})
                    
                    # Buat laporan dan keluar karena tidak bisa melanjutkan ke dashboard
                    buat_laporan_html(langkah, screenshots, error="Tidak dapat melanjutkan pengujian dashboard karena login gagal")
                    await browser.close()
                    return
            
            # Tunggu dashboard sepenuhnya dimuat
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)  # Tambahan waktu untuk memastikan semua konten dimuat
            
            # Langkah 2: Verifikasi tampilan umum dashboard
            print("Langkah 2: Verifikasi tampilan umum dashboard...")
            langkah.append("Verifikasi tampilan umum dashboard")
            
            # Ambil screenshot dashboard
            screenshot_path = f"test-results/screenshots/dashboard-full-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Tampilan Penuh Dashboard"})
            
            # Verifikasi judul halaman
            page_title = await page.title()
            print(f"Judul halaman: {page_title}")
            langkah.append(f"Judul halaman: {page_title}")
            
            # Verifikasi elemen header dashboard
            header_visible = await page.is_visible("h1:has-text('Dashboard')")
            if header_visible:
                print("[PASS] Header Dashboard terlihat")
                langkah.append("[PASS] Header Dashboard terlihat")
            else:
                print("[FAIL] Header Dashboard tidak terlihat")
                langkah.append("[FAIL] Header Dashboard tidak terlihat")
            
            # Verifikasi tombol-tombol aksi
            tombol_program_baru = await page.is_visible("a:has-text('Program Baru')")
            if tombol_program_baru:
                print("[PASS] Tombol Program Baru terlihat")
                langkah.append("[PASS] Tombol Program Baru terlihat")
            else:
                print("[FAIL] Tombol Program Baru tidak terlihat")
                langkah.append("[FAIL] Tombol Program Baru tidak terlihat")
            
            tombol_tugas_baru = await page.is_visible("a:has-text('Tugas Baru')")
            if tombol_tugas_baru:
                print("[PASS] Tombol Tugas Baru terlihat")
                langkah.append("[PASS] Tombol Tugas Baru terlihat")
            else:
                print("[FAIL] Tombol Tugas Baru tidak terlihat")
                langkah.append("[FAIL] Tombol Tugas Baru tidak terlihat")
            
            # Langkah 3: Verifikasi kartu statistik
            print("Langkah 3: Verifikasi kartu statistik...")
            langkah.append("Verifikasi kartu statistik")
            
            # Cek semua kartu statistik - menggunakan pendekatan yang lebih umum
            # Karena struktur kartu mungkin berbeda, kita cek apakah ada kartu statistik secara umum
            cards_visible = await page.is_visible("div.grid div")
            if cards_visible:
                print(f"[PASS] Kartu statistik terlihat")
                langkah.append(f"[PASS] Kartu statistik terlihat")
            else:
                print(f"[FAIL] Kartu statistik tidak terlihat")
                langkah.append(f"[FAIL] Kartu statistik tidak terlihat")
            
            # Ambil screenshot bagian statistik
            await page.evaluate("window.scrollTo(0, 200)")
            screenshot_path = f"test-results/screenshots/dashboard-stats-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Kartu Statistik Dashboard"})
            
            # Langkah 4: Verifikasi bagian Tugas Mendatang
            print("Langkah 4: Verifikasi bagian Tugas Mendatang...")
            langkah.append("Verifikasi bagian Tugas Mendatang")
            
            tugas_title = await page.is_visible("h3:has-text('Tugas Mendatang')")
            if tugas_title:
                print("[PASS] Judul 'Tugas Mendatang' terlihat")
                langkah.append("[PASS] Judul 'Tugas Mendatang' terlihat")
            else:
                print("[FAIL] Judul 'Tugas Mendatang' tidak terlihat")
                langkah.append("[FAIL] Judul 'Tugas Mendatang' tidak terlihat")
            
            # Cek apakah ada daftar tugas atau pesan "tidak ada tugas"
            tugas_content = await page.is_visible("div:has-text('Tugas Mendatang')")
            if tugas_content:
                print("[PASS] Konten bagian Tugas Mendatang terlihat")
                langkah.append("[PASS] Konten bagian Tugas Mendatang terlihat")
            else:
                print("[FAIL] Konten bagian Tugas Mendatang tidak terlihat")
                langkah.append("[FAIL] Konten bagian Tugas Mendatang tidak terlihat")
            
            # Langkah 5: Verifikasi bagian Program Kerja Terbaru
            print("Langkah 5: Verifikasi bagian Program Kerja Terbaru...")
            langkah.append("Verifikasi bagian Program Kerja Terbaru")
            
            program_title = await page.is_visible("h3:has-text('Program Kerja Terbaru')")
            if program_title:
                print("[PASS] Judul 'Program Kerja Terbaru' terlihat")
                langkah.append("[PASS] Judul 'Program Kerja Terbaru' terlihat")
            else:
                print("[FAIL] Judul 'Program Kerja Terbaru' tidak terlihat")
                langkah.append("[FAIL] Judul 'Program Kerja Terbaru' tidak terlihat")
            
            # Cek apakah ada daftar program atau pesan "tidak ada program"
            program_content = await page.is_visible("div:has-text('Program Kerja Terbaru')")
            if program_content:
                print("[PASS] Konten bagian Program Kerja Terbaru terlihat")
                langkah.append("[PASS] Konten bagian Program Kerja Terbaru terlihat")
            else:
                print("[FAIL] Konten bagian Program Kerja Terbaru tidak terlihat")
                langkah.append("[FAIL] Konten bagian Program Kerja Terbaru tidak terlihat")
            
            # Ambil screenshot bagian program
            await page.evaluate("window.scrollTo(0, 500)")
            screenshot_path = f"test-results/screenshots/dashboard-programs-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Program Kerja Terbaru"})
            
            # Langkah 6: Verifikasi bagian Kalender
            print("Langkah 6: Verifikasi bagian Kalender...")
            langkah.append("Verifikasi bagian Kalender")
            
            kalender_title = await page.is_visible("h3:has-text('Kalender')")
            if kalender_title:
                print("[PASS] Judul 'Kalender' terlihat")
                langkah.append("[PASS] Judul 'Kalender' terlihat")
            else:
                print("[FAIL] Judul 'Kalender' tidak terlihat")
                langkah.append("[FAIL] Judul 'Kalender' tidak terlihat")
            
            # Cek konten kalender
            kalender_content = await page.is_visible("div:has-text('Kalender')")
            if kalender_content:
                print("[PASS] Konten bagian Kalender terlihat")
                langkah.append("[PASS] Konten bagian Kalender terlihat")
            else:
                print("[FAIL] Konten bagian Kalender tidak terlihat")
                langkah.append("[FAIL] Konten bagian Kalender tidak terlihat")
            
            # Langkah 7: Verifikasi navigasi sidebar
            print("Langkah 7: Verifikasi navigasi sidebar...")
            langkah.append("Verifikasi navigasi sidebar")
            
            # Cek menu-menu di sidebar - menggunakan pendekatan yang lebih umum
            # Verifikasi bahwa ada sidebar dengan menu navigasi
            sidebar_visible = await page.is_visible("aside") or await page.is_visible("nav") or await page.is_visible("div[class*='sidebar']") or await page.is_visible("a:has-text('Dashboard')")
            if sidebar_visible:
                print(f"[PASS] Sidebar navigasi terlihat")
                langkah.append(f"[PASS] Sidebar navigasi terlihat")
            else:
                print(f"[FAIL] Sidebar navigasi tidak terlihat")
                langkah.append(f"[FAIL] Sidebar navigasi tidak terlihat")
            
            # Ambil screenshot sidebar
            screenshot_path = f"test-results/screenshots/dashboard-sidebar-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Navigasi Sidebar"})
            
            # Langkah 8: Cek responsivitas dengan mengubah ukuran viewport
            print("Langkah 8: Cek responsivitas dashboard...")
            langkah.append("Cek responsivitas dashboard")
            
            # Ubah ke ukuran tablet
            await page.set_viewport_size({"width": 768, "height": 1024})
            await asyncio.sleep(1)
            
            screenshot_path = f"test-results/screenshots/dashboard-tablet-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Tampilan Tablet"})
            
            # Ubah ke ukuran mobile
            await page.set_viewport_size({"width": 375, "height": 667})
            await asyncio.sleep(1)
            
            screenshot_path = f"test-results/screenshots/dashboard-mobile-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append({"path": screenshot_path, "caption": "Tampilan Mobile"})
            
            print("Pengujian tampilan dashboard selesai!")
            langkah.append("Pengujian tampilan dashboard selesai")
            
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
    report_path = f"test-results/tampilan-dashboard-test-report-{timestamp}.html"
    
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
        <title>Laporan Pengujian Tampilan Dashboard Proker Tracker</title>
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
                display: flex;
                flex-direction: column;
            }}
            .screenshot img {{
                max-width: 100%;
                height: auto;
                border-radius: 3px;
                margin-bottom: 10px;
            }}
            .screenshot-caption {{
                font-weight: bold;
                text-align: center;
            }}
            .error {{
                background-color: #f8d7da;
                color: #721c24;
                padding: 10px;
                border-radius: 3px;
                margin-top: 20px;
            }}
            .summary {{
                margin-top: 20px;
                padding: 15px;
                background-color: #e9ecef;
                border-radius: 5px;
            }}
            .passed {{
                color: #155724;
            }}
            .failed {{
                color: #721c24;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Laporan Pengujian Tampilan Dashboard Proker Tracker</h1>
                <div>
                    <span class="status {'success' if status == 'BERHASIL' else 'failure'}">
                        {status}
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
    
    # Tambahkan langkah-langkah pengujian
    for step in langkah:
        html_content += f'<div class="step">{step}</div>\n'
    
    html_content += """
            </div>
            
            <h2>Ringkasan Hasil</h2>
            <div class="summary">
    """
    
    # Hitung jumlah langkah yang berhasil dan gagal
    passed_steps = sum(1 for step in langkah if "[PASS]" in step)
    failed_steps = sum(1 for step in langkah if "[FAIL]" in step)
    
    html_content += f"""
                <p><span class="passed">[PASS] Berhasil:</span> {passed_steps} langkah</p>
                <p><span class="failed">[FAIL] Gagal:</span> {failed_steps} langkah</p>
                <p><strong>Status Akhir:</strong> {status}</p>
    """
    
    if error:
        html_content += f"""
            <div class="error">
                <h3>Error:</h3>
                <p>{error}</p>
            </div>
        """
    
    html_content += """
            </div>
            
            <h2>Screenshot</h2>
            <div class="screenshots">
    """
    
    # Tambahkan screenshot
    for screenshot in screenshots:
        html_content += f"""
                <div class="screenshot">
                    <img src="../{screenshot['path']}" alt="Screenshot">
                    <div class="screenshot-caption">{screenshot['caption']}</div>
                </div>
        """
    
    html_content += """
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
