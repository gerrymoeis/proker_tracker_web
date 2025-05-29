"""Skrip pengujian untuk fungsionalitas logout dari Proker Tracker."""
import os
import sys
import asyncio
import datetime
from playwright.async_api import async_playwright

# Buat direktori hasil pengujian jika belum ada
os.makedirs("test-results", exist_ok=True)
os.makedirs("test-results/screenshots", exist_ok=True)

async def main():
    """Fungsi utama untuk menjalankan pengujian logout."""
    print("Memulai pengujian logout...")
    
    # Catat langkah-langkah pengujian
    langkah = []
    screenshots = []
    error = None
    
    try:
        async with async_playwright() as p:
            # Luncurkan browser dengan mode headless=False agar bisa dilihat
            browser = await p.chromium.launch(headless=False)
            
            # Buat konteks browser baru
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Navigasi ke halaman login
            print("Langkah 1: Navigasi ke halaman login...")
            langkah.append("Navigasi ke halaman login")
            await page.goto("http://localhost:3000/login", wait_until="load")
            await page.wait_for_load_state("networkidle")
            
            # Ambil screenshot setelah navigasi
            screenshot_path = f"test-results/screenshots/login-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Langkah 2: Masukkan email
            print("Langkah 2: Memasukkan email...")
            langkah.append("Memasukkan email")
            
            # Highlight elemen email untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalBackground = element.style.backgroundColor;
                        const originalBorder = element.style.border;
                        
                        element.style.backgroundColor = '#ffffcc';
                        element.style.border = '2px solid red';
                        
                        setTimeout(() => {
                            element.style.backgroundColor = originalBackground;
                            element.style.border = originalBorder;
                        }, 2000);
                    }
                }
            """, "#email")
            
            # Isi field email
            await page.fill("#email", "23091397164@student.unesa.ac.id")
            
            # Ambil screenshot setelah mengisi email
            screenshot_path = f"test-results/screenshots/email-filled-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Langkah 3: Masukkan password
            print("Langkah 3: Memasukkan password...")
            langkah.append("Memasukkan password")
            
            # Highlight elemen password untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalBackground = element.style.backgroundColor;
                        const originalBorder = element.style.border;
                        
                        element.style.backgroundColor = '#ffffcc';
                        element.style.border = '2px solid red';
                        
                        setTimeout(() => {
                            element.style.backgroundColor = originalBackground;
                            element.style.border = originalBorder;
                        }, 2000);
                    }
                }
            """, "#password")
            
            # Isi field password
            await page.fill("#password", "23091397164")
            
            # Ambil screenshot setelah mengisi password
            screenshot_path = f"test-results/screenshots/password-filled-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Langkah 4: Klik tombol login
            print("Langkah 4: Klik tombol login...")
            langkah.append("Klik tombol login")
            
            # Highlight tombol login untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalBackground = element.style.backgroundColor;
                        const originalBorder = element.style.border;
                        
                        element.style.backgroundColor = '#ffffcc';
                        element.style.border = '2px solid red';
                        
                        setTimeout(() => {
                            element.style.backgroundColor = originalBackground;
                            element.style.border = originalBorder;
                        }, 2000);
                    }
                }
            """, "button[type='submit']")
            
            # Klik tombol login
            await page.click("button[type='submit']")
            
            # Tunggu sampai navigasi selesai dan halaman dashboard dimuat
            print("Langkah 5: Menunggu redirect ke dashboard...")
            langkah.append("Menunggu redirect ke dashboard")
            await page.wait_for_url("**/dashboard**")
            await page.wait_for_load_state("networkidle")
            
            # Ambil screenshot halaman dashboard
            screenshot_path = f"test-results/screenshots/dashboard-page-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Langkah 6: Klik avatar pengguna untuk membuka dropdown
            print("Langkah 6: Klik avatar pengguna...")
            langkah.append("Klik avatar pengguna")
            
            # Highlight avatar pengguna untuk visualisasi
            await page.evaluate("""
                (selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const originalBackground = element.style.backgroundColor;
                        const originalBorder = element.style.border;
                        
                        element.style.backgroundColor = '#ffffcc';
                        element.style.border = '2px solid red';
                        
                        setTimeout(() => {
                            element.style.backgroundColor = originalBackground;
                            element.style.border = originalBorder;
                        }, 2000);
                    }
                }
            """, "button.rounded-full")
            
            # Klik avatar pengguna
            await page.click("button.rounded-full")
            await page.wait_for_timeout(1000)  # Tunggu dropdown muncul
            
            # Ambil screenshot setelah dropdown muncul
            screenshot_path = f"test-results/screenshots/dropdown-opened-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Langkah 7: Klik tombol logout
            print("Langkah 7: Klik tombol logout...")
            langkah.append("Klik tombol logout")
            
            # Tunggu sebentar untuk memastikan dropdown telah dimuat sepenuhnya
            await page.wait_for_timeout(1000)
            
            # Cari tombol logout dengan JavaScript yang lebih fleksibel
            logout_button = await page.evaluate("""
                () => {
                    // Cari elemen yang mengandung teks 'Keluar'
                    const elements = Array.from(document.querySelectorAll('*'));
                    const logoutElement = elements.find(el => 
                        el.textContent && 
                        el.textContent.trim() === 'Keluar' && 
                        (el.closest('[role="menuitem"]') || el.closest('[data-radix-collection-item]'))
                    );
                    
                    // Jika ditemukan, highlight elemen
                    if (logoutElement) {
                        const targetElement = logoutElement.closest('[role="menuitem"]') || 
                                           logoutElement.closest('[data-radix-collection-item]') || 
                                           logoutElement;
                        
                        const rect = targetElement.getBoundingClientRect();
                        return {
                            found: true,
                            x: rect.x + rect.width / 2,
                            y: rect.y + rect.height / 2
                        };
                    }
                    return { found: false };
                }
            """)
            
            # Ambil screenshot sebelum klik logout
            screenshot_path = f"test-results/screenshots/before-logout-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Klik tombol logout jika ditemukan
            if logout_button and logout_button.get('found'):
                print("Tombol logout ditemukan, melakukan klik pada koordinat")
                # Klik pada koordinat yang ditemukan
                await page.mouse.click(logout_button['x'], logout_button['y'])
            else:
                # Jika tidak ditemukan dengan JavaScript, coba pendekatan alternatif
                print("Mencoba pendekatan alternatif untuk klik tombol logout")
                # Coba beberapa selector yang mungkin untuk tombol logout
                selectors = [
                    "text=Keluar",
                    "span:has-text('Keluar')",
                    "[role=menuitem]:has-text('Keluar')",
                    "[data-radix-collection-item]:has-text('Keluar')"
                ]
                
                for selector in selectors:
                    try:
                        await page.click(selector, timeout=1000)
                        print(f"Berhasil mengklik dengan selector: {selector}")
                        break
                    except Exception as e:
                        print(f"Gagal mengklik dengan selector: {selector}")
                        continue
            
            # Langkah 8: Verifikasi redirect ke halaman login
            print("Langkah 8: Verifikasi redirect ke halaman login...")
            langkah.append("Verifikasi redirect ke halaman login")
            
            # Tunggu sampai URL berubah ke halaman login dengan parameter returnUrl
            await page.wait_for_url("**/login?returnUrl=%2Fdashboard**")
            await page.wait_for_load_state("networkidle")
            
            # Ambil screenshot halaman login setelah logout
            screenshot_path = f"test-results/screenshots/login-after-logout-{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)
            
            # Verifikasi URL redirect
            current_url = page.url
            expected_url_pattern = "http://localhost:3000/login?returnUrl=%2Fdashboard"
            
            if expected_url_pattern in current_url:
                print("[BERHASIL] Pengujian logout berhasil!")
                langkah.append("Pengujian logout berhasil")
            else:
                error_message = f"URL redirect tidak sesuai. Diharapkan: {expected_url_pattern}, Aktual: {current_url}"
                print(f"[GAGAL] {error_message}")
                langkah.append(f"Pengujian logout gagal: {error_message}")
                error = error_message
            
            # Tutup browser
            await browser.close()
    
    except Exception as e:
        error_message = f"Pengujian logout gagal: {str(e)}"
        print(f"[GAGAL] {error_message}")
        langkah.append(error_message)
        error = error_message
    
    # Buat laporan HTML untuk hasil pengujian
    buat_laporan_html(langkah, screenshots, error)

def buat_laporan_html(langkah, screenshots, error=None):
    """Buat laporan HTML untuk hasil pengujian."""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"test-results/laporan-logout-{timestamp}.html"
    
    # Status pengujian
    status = "BERHASIL" if error is None else "GAGAL"
    status_color = "green" if status == "BERHASIL" else "red"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Logout - Proker Tracker</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }}
            h1 {{ color: #2c3e50; text-align: center; margin-bottom: 30px; }}
            h2 {{ color: #3498db; margin-top: 30px; }}
            .status {{ display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; color: white; background-color: {status_color}; }}
            .container {{ max-width: 1200px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
            .step {{ margin-bottom: 15px; padding: 15px; background-color: #fff; border-left: 4px solid #3498db; border-radius: 4px; }}
            .step-number {{ font-weight: bold; color: #3498db; }}
            .screenshot {{ margin-top: 20px; text-align: center; }}
            .screenshot img {{ max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 0 5px rgba(0,0,0,0.1); }}
            .error {{ background-color: #ffecec; color: #f44336; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0; }}
            .info {{ display: flex; justify-content: space-between; margin-bottom: 20px; }}
            .info-item {{ flex: 1; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }}
            th {{ background-color: #3498db; color: white; }}
            tr:hover {{ background-color: #f5f5f5; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Laporan Pengujian Logout - Proker Tracker</h1>
            
            <div class="info">
                <div class="info-item">
                    <p><strong>Tanggal Pengujian:</strong> {datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')}</p>
                    <p><strong>Status:</strong> <span class="status">{status}</span></p>
                </div>
                <div class="info-item">
                    <p><strong>Browser:</strong> Chromium</p>
                    <p><strong>Tester:</strong> Automated Test</p>
                </div>
            </div>
            
            <h2>Ringkasan Pengujian</h2>
            <p>Pengujian ini menguji fungsionalitas logout dari aplikasi Proker Tracker. Pengguna login dengan kredensial yang valid, kemudian melakukan logout dan memverifikasi bahwa pengguna diarahkan kembali ke halaman login.</p>
            
    """
    
    # Tambahkan bagian error jika ada
    if error:
        html_content += f"""
            <div class="error">
                <h3>Error:</h3>
                <p>{error}</p>
            </div>
        """
    
    # Tambahkan langkah-langkah pengujian
    html_content += """
            <h2>Langkah-langkah Pengujian</h2>
            <table>
                <tr>
                    <th>No.</th>
                    <th>Deskripsi</th>
                </tr>
    """
    
    for i, step in enumerate(langkah, 1):
        html_content += f"""
                <tr>
                    <td>{i}</td>
                    <td>{step}</td>
                </tr>
        """
    
    html_content += """
            </table>
            
            <h2>Screenshot</h2>
    """
    
    # Tambahkan screenshot
    for i, screenshot in enumerate(screenshots, 1):
        screenshot_name = os.path.basename(screenshot)
        html_content += f"""
            <div class="screenshot">
                <h3>Screenshot {i}: {screenshot_name}</h3>
                <img src="../screenshots/{screenshot_name}" alt="Screenshot {i}">
            </div>
        """
    
    # Tutup HTML
    html_content += """
        </div>
    </body>
    </html>
    """
    
    # Tulis ke file
    with open(report_filename, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Laporan pengujian telah disimpan di: {report_filename}")
    return report_filename


if __name__ == "__main__":
    asyncio.run(main())
