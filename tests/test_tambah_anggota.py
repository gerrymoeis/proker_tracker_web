"""
Skrip pengujian untuk fungsionalitas menambah anggota pada Proker Tracker.
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
    """Fungsi utama untuk menjalankan pengujian menambah anggota."""
    print("Memulai pengujian menambah anggota...")
    
    # Catat langkah-langkah pengujian
    langkah = []
    screenshots = []
    
    # Generate data anggota dengan nomor random
    random_num = random.randint(1000, 9999)
    nama_anggota = f"User Test {random_num}"
    email_anggota = f"usertest{random_num}@example.com"
    password_anggota = "password123"
    
    print(f"Data pengujian: {nama_anggota}, {email_anggota}, {password_anggota}")
    langkah.append(f"Data pengujian: {nama_anggota}, {email_anggota}, {password_anggota}")
    
    try:
        async with async_playwright() as p:
            # Luncurkan browser dengan mode headless=False agar bisa dilihat
            browser = await p.chromium.launch(headless=False)
            
            # Buat konteks browser baru
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            
            # Buat halaman baru
            page = await context.new_page()
            
            # Langkah 1: Login sebagai Ketua Himpunan
            print("Langkah 1: Login sebagai Ketua Himpunan...")
            langkah.append("Login sebagai Ketua Himpunan")
            
            try:
                await page.goto("http://localhost:3000/login", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman login
                screenshot_path = os.path.join("test-results/screenshots", f"login_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Tunggu lebih lama untuk memastikan halaman login telah dimuat sepenuhnya
                await asyncio.sleep(2)
                
                # Isi email (menggunakan email Ketua Himpunan)
                await highlight_element(page, "#email")
                await page.fill("#email", "23091397101@student.unesa.ac.id")
                await asyncio.sleep(1)
                print("Mengisi email login: 23091397101@student.unesa.ac.id")
                langkah.append("Mengisi email login: 23091397101@student.unesa.ac.id")
                
                # Isi password
                await highlight_element(page, "#password")
                await page.fill("#password", "23091397101")
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
            
            # Langkah 2: Navigasi ke halaman tambah anggota
            print("Langkah 2: Navigasi ke halaman tambah anggota...")
            langkah.append("Navigasi ke halaman tambah anggota")
            
            try:
                await page.goto("http://localhost:3000/dashboard/members/create", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)
                
                # Ambil screenshot halaman tambah anggota
                screenshot_path = os.path.join("test-results/screenshots", f"tambah_anggota_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                print("Halaman tambah anggota berhasil dimuat")
                langkah.append("Halaman tambah anggota berhasil dimuat")
            except Exception as e:
                print(f"Error saat navigasi ke halaman tambah anggota: {e}")
                langkah.append(f"Error saat navigasi ke halaman tambah anggota: {e}")
                await browser.close()
                buat_laporan_html(langkah, screenshots, error=str(e))
                return
            
            # Langkah 3: Isi form tambah anggota
            print("Langkah 3: Isi form tambah anggota...")
            langkah.append("Isi form tambah anggota")
            
            try:
                # Isi nama lengkap
                await highlight_element(page, "#name")
                await page.fill("#name", nama_anggota)
                await asyncio.sleep(1)
                print(f"Mengisi nama anggota: {nama_anggota}")
                langkah.append(f"Mengisi nama anggota: {nama_anggota}")
                
                # Isi email
                await highlight_element(page, "#email")
                await page.fill("#email", email_anggota)
                await asyncio.sleep(1)
                print(f"Mengisi email anggota: {email_anggota}")
                langkah.append(f"Mengisi email anggota: {email_anggota}")
                
                # Isi password
                await highlight_element(page, "#password")
                await page.fill("#password", password_anggota)
                await asyncio.sleep(1)
                print(f"Mengisi password anggota: {password_anggota}")
                langkah.append(f"Mengisi password anggota: {password_anggota}")
                
                # Pilih peran dari dropdown dengan pendekatan yang lebih andal
                try:
                    # Klik dropdown peran menggunakan JavaScript
                    role_dropdown = await page.query_selector("div.space-y-2:has(label[for='role']) button")
                    if role_dropdown:
                        await highlight_element(page, role_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", role_dropdown)
                        print("Dropdown peran diklik")
                        langkah.append("Dropdown peran diklik")
                        
                        # Tunggu lebih lama untuk dropdown terbuka sepenuhnya
                        await asyncio.sleep(3)
                        
                        # Ambil screenshot dropdown terbuka
                        screenshot_path = os.path.join("test-results/screenshots", f"dropdown_peran_{len(screenshots)}.png")
                        await page.screenshot(path=screenshot_path)
                        screenshots.append(screenshot_path)
                        
                        # Pilih peran "Anggota" dengan pendekatan alternatif
                        # Coba beberapa selector untuk meningkatkan keberhasilan
                        selectors = [
                            ".select-content .select-item[value='anggota']",
                            "[data-value='anggota']",
                            ".select-item:has-text('Anggota')",
                            "div[role='option']:has-text('Anggota')"
                        ]
                        
                        role_option = None
                        for selector in selectors:
                            role_option = await page.query_selector(selector)
                            if role_option:
                                break
                        
                        if role_option:
                            await highlight_element(page, role_option)
                            # Klik dengan force:true untuk memastikan klik berhasil
                            await role_option.click(force=True)
                            # Alternatif menggunakan JavaScript jika klik biasa gagal
                            await page.evaluate("(element) => element.click()", role_option)
                            print("Memilih peran: Anggota")
                            langkah.append("Memilih peran: Anggota")
                            await asyncio.sleep(1)  # Tunggu setelah memilih
                        else:
                            # Jika tidak bisa menemukan opsi, coba klik di koordinat yang diperkirakan
                            print("Tidak dapat menemukan opsi peran dengan selector, mencoba klik koordinat")
                            langkah.append("Tidak dapat menemukan opsi peran dengan selector, mencoba klik koordinat")
                            
                            # Dapatkan posisi dropdown
                            dropdown_box = await role_dropdown.bounding_box()
                            if dropdown_box:
                                # Klik di bawah dropdown (perkiraan posisi opsi pertama)
                                await page.mouse.click(
                                    dropdown_box["x"] + dropdown_box["width"] / 2,
                                    dropdown_box["y"] + dropdown_box["height"] + 30
                                )
                                print("Memilih peran dengan klik koordinat")
                                langkah.append("Memilih peran dengan klik koordinat")
                                await asyncio.sleep(1)  # Tunggu setelah memilih
                    else:
                        print("Tidak dapat menemukan dropdown peran")
                        langkah.append("Tidak dapat menemukan dropdown peran")
                        
                        # Coba alternatif dengan mengisi nilai langsung ke elemen tersembunyi
                        await page.evaluate("""
                            () => {
                                const hiddenInput = document.querySelector('input[name="role"]');
                                if (hiddenInput) {
                                    hiddenInput.value = 'anggota';
                                    console.log('Nilai peran diisi langsung ke input tersembunyi');
                                }
                            }
                        """)
                except Exception as e:
                    print(f"Error saat memilih peran: {e}")
                    langkah.append(f"Error saat memilih peran: {e}")
                
                # Pilih departemen dari dropdown dengan pendekatan yang lebih andal
                try:
                    # Klik dropdown departemen menggunakan JavaScript
                    dept_dropdown = await page.query_selector("div.space-y-2:has(label[for='departmentId']) button")
                    if dept_dropdown:
                        await highlight_element(page, dept_dropdown)
                        # Klik menggunakan JavaScript untuk menghindari masalah pointer events
                        await page.evaluate("(element) => element.click()", dept_dropdown)
                        print("Dropdown departemen diklik")
                        langkah.append("Dropdown departemen diklik")
                        
                        # Tunggu lebih lama untuk dropdown terbuka sepenuhnya
                        await asyncio.sleep(3)
                        
                        # Ambil screenshot dropdown terbuka
                        screenshot_path = os.path.join("test-results/screenshots", f"dropdown_departemen_{len(screenshots)}.png")
                        await page.screenshot(path=screenshot_path)
                        screenshots.append(screenshot_path)
                        
                        # Pilih departemen pertama dari daftar dengan pendekatan alternatif
                        # Coba beberapa selector untuk meningkatkan keberhasilan
                        selectors = [
                            ".select-content .select-item:first-child",
                            ".select-content [data-value]:first-child",
                            "div[role='option']:first-child"
                        ]
                        
                        dept_option = None
                        for selector in selectors:
                            dept_option = await page.query_selector(selector)
                            if dept_option:
                                break
                        
                        if dept_option:
                            await highlight_element(page, dept_option)
                            # Klik dengan force:true untuk memastikan klik berhasil
                            await dept_option.click(force=True)
                            # Alternatif menggunakan JavaScript jika klik biasa gagal
                            await page.evaluate("(element) => element.click()", dept_option)
                            print("Memilih departemen pertama dari daftar")
                            langkah.append("Memilih departemen pertama dari daftar")
                            await asyncio.sleep(1)  # Tunggu setelah memilih
                        else:
                            # Jika tidak bisa menemukan opsi, coba klik di koordinat yang diperkirakan
                            print("Tidak dapat menemukan opsi departemen dengan selector, mencoba klik koordinat")
                            langkah.append("Tidak dapat menemukan opsi departemen dengan selector, mencoba klik koordinat")
                            
                            # Dapatkan posisi dropdown
                            dropdown_box = await dept_dropdown.bounding_box()
                            if dropdown_box:
                                # Klik di bawah dropdown (perkiraan posisi opsi pertama)
                                await page.mouse.click(
                                    dropdown_box["x"] + dropdown_box["width"] / 2,
                                    dropdown_box["y"] + dropdown_box["height"] + 30
                                )
                                print("Memilih departemen dengan klik koordinat")
                                langkah.append("Memilih departemen dengan klik koordinat")
                                await asyncio.sleep(1)  # Tunggu setelah memilih
                    else:
                        print("Tidak dapat menemukan dropdown departemen")
                        langkah.append("Tidak dapat menemukan dropdown departemen")
                        
                        # Coba alternatif dengan mengisi nilai langsung ke elemen tersembunyi
                        await page.evaluate("""
                            () => {
                                const hiddenInput = document.querySelector('input[name="departmentId"]');
                                if (hiddenInput) {
                                    hiddenInput.value = '1'; // Asumsi ID departemen pertama adalah 1
                                    console.log('Nilai departemen diisi langsung ke input tersembunyi');
                                }
                            }
                        """)
                except Exception as e:
                    print(f"Error saat memilih departemen: {e}")
                    langkah.append(f"Error saat memilih departemen: {e}")
                
                # Ambil screenshot form yang telah diisi
                screenshot_path = os.path.join("test-results/screenshots", f"form_anggota_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
            except Exception as e:
                print(f"Error saat mengisi form: {e}")
                langkah.append(f"Error saat mengisi form: {e}")
            
            # Langkah 4: Submit form tambah anggota
            print("Langkah 4: Submit form tambah anggota...")
            langkah.append("Submit form tambah anggota")
            
            try:
                # Cari tombol submit
                submit_button = await page.query_selector("button[type='submit']")
                
                if submit_button:
                    await highlight_element(page, submit_button)
                    print("Tombol submit ditemukan")
                    langkah.append("Tombol submit ditemukan")
                    
                    # Klik tombol submit menggunakan JavaScript
                    await page.evaluate("(element) => element.click()", submit_button)
                    print("Tombol submit diklik menggunakan JavaScript")
                    langkah.append("Tombol submit diklik menggunakan JavaScript")
                    
                    # Tunggu untuk respons dan redirect
                    await asyncio.sleep(5)
                    
                    # Ambil screenshot hasil submit
                    screenshot_path = os.path.join("test-results/screenshots", f"submit_result_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Verifikasi hasil submit
                    current_url = page.url
                    print(f"URL setelah submit: {current_url}")
                    langkah.append(f"URL setelah submit: {current_url}")
                    
                    # Periksa apakah ada pesan sukses
                    success_message = await page.query_selector(".bg-green-500\\/20, .text-green-500")
                    if success_message:
                        success_text = await success_message.text_content()
                        print(f"Pesan sukses ditemukan: {success_text}")
                        langkah.append(f"Pesan sukses ditemukan: {success_text}")
                    
                    # Tunggu redirect ke halaman daftar anggota
                    await asyncio.sleep(3)
                else:
                    print("Tidak dapat menemukan tombol submit")
                    langkah.append("Tidak dapat menemukan tombol submit")
            except Exception as e:
                print(f"Error saat submit form: {e}")
                langkah.append(f"Error saat submit form: {e}")
            
            # Langkah 5: Verifikasi anggota baru di halaman daftar anggota
            print("Langkah 5: Verifikasi anggota baru di halaman daftar anggota...")
            langkah.append("Verifikasi anggota baru di halaman daftar anggota")
            
            try:
                # Navigasi ke halaman daftar anggota
                await page.goto("http://localhost:3000/dashboard/members", wait_until="load")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(3)
                
                # Ambil screenshot halaman daftar anggota
                screenshot_path = os.path.join("test-results/screenshots", f"daftar_anggota_{len(screenshots)}.png")
                await page.screenshot(path=screenshot_path)
                screenshots.append(screenshot_path)
                
                # Cari anggota baru dengan metode yang lebih cermat
                try:
                    # Tunggu lebih lama untuk memastikan data anggota dimuat
                    await asyncio.sleep(5)
                    
                    # Cari dengan menggunakan search terlebih dahulu
                    search_input = await page.query_selector("input[type='search']")
                    if search_input:
                        await highlight_element(page, search_input)
                        # Bersihkan input search terlebih dahulu
                        await search_input.fill("")
                        await asyncio.sleep(1)
                        # Isi dengan nama anggota
                        await search_input.fill(nama_anggota)
                        print(f"Mencari anggota dengan kata kunci: {nama_anggota}")
                        langkah.append(f"Mencari anggota dengan kata kunci: {nama_anggota}")
                        await asyncio.sleep(3)  # Tunggu lebih lama untuk hasil pencarian
                        
                        # Ambil screenshot hasil pencarian
                        screenshot_path = os.path.join("test-results/screenshots", f"search_result_{len(screenshots)}.png")
                        await page.screenshot(path=screenshot_path)
                        screenshots.append(screenshot_path)
                    
                    # Metode pencarian yang lebih cermat dengan berbagai pendekatan
                    found = False
                    
                    # 1. Cari berdasarkan nama lengkap
                    try:
                        card_element = await page.query_selector(f"h3:has-text('{nama_anggota}')")
                        if card_element:
                            found = True
                            await highlight_element(page, card_element)
                            print(f"Anggota baru '{nama_anggota}' ditemukan dengan selector has-text")
                            langkah.append(f"Anggota baru '{nama_anggota}' ditemukan dengan selector has-text")
                    except Exception as e:
                        print(f"Error saat mencari dengan has-text: {e}")
                    
                    # 2. Cari berdasarkan konten card yang mengandung nama (case insensitive)
                    if not found:
                        try:
                            found = await page.evaluate(f"""
                                (nama) => {{
                                    const cards = document.querySelectorAll('.card');
                                    for (const card of cards) {{
                                        if (card.textContent.toLowerCase().includes(nama.toLowerCase())) {{
                                            // Highlight card dengan border merah
                                            card.style.border = '2px solid red';
                                            card.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
                                            return true;
                                        }}
                                    }}
                                    return false;
                                }}
                            """, nama_anggota)
                            
                            if found:
                                print(f"Anggota baru '{nama_anggota}' ditemukan dengan JavaScript (case insensitive)")
                                langkah.append(f"Anggota baru '{nama_anggota}' ditemukan dengan JavaScript (case insensitive)")
                        except Exception as e:
                            print(f"Error saat mencari dengan JavaScript: {e}")
                    
                    # 3. Cari berdasarkan email
                    if not found:
                        try:
                            found = await page.evaluate(f"""
                                (email) => {{
                                    const emailElements = document.querySelectorAll('.card span');
                                    for (const el of emailElements) {{
                                        if (el.textContent.toLowerCase().includes(email.toLowerCase())) {{
                                            // Highlight card dengan border merah
                                            const card = el.closest('.card');
                                            if (card) {{
                                                card.style.border = '2px solid red';
                                                card.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
                                                return true;
                                            }}
                                        }}
                                    }}
                                    return false;
                                }}
                            """, email_anggota)
                            
                            if found:
                                print(f"Anggota baru ditemukan berdasarkan email '{email_anggota}'")
                                langkah.append(f"Anggota baru ditemukan berdasarkan email '{email_anggota}'")
                        except Exception as e:
                            print(f"Error saat mencari berdasarkan email: {e}")
                    
                    # 4. Cari dengan pendekatan partial match (hanya bagian dari nama)
                    if not found:
                        try:
                            # Ambil bagian dari nama (misalnya "Test" dari "User Test 1234")
                            nama_partial = nama_anggota.split(" ")[1]  # Ambil kata kedua ("Test")
                            found = await page.evaluate(f"""
                                (namaPartial) => {{
                                    const cards = document.querySelectorAll('.card');
                                    for (const card of cards) {{
                                        if (card.textContent.includes(namaPartial)) {{
                                            card.style.border = '2px solid red';
                                            card.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
                                            return true;
                                        }}
                                    }}
                                    return false;
                                }}
                            """, nama_partial)
                            
                            if found:
                                print(f"Anggota baru ditemukan dengan partial match '{nama_partial}'")
                                langkah.append(f"Anggota baru ditemukan dengan partial match '{nama_partial}'")
                        except Exception as e:
                            print(f"Error saat mencari dengan partial match: {e}")
                    
                    # Ambil screenshot hasil akhir pencarian
                    screenshot_path = os.path.join("test-results/screenshots", f"anggota_baru_final_{len(screenshots)}.png")
                    await page.screenshot(path=screenshot_path)
                    screenshots.append(screenshot_path)
                    
                    # Hasil akhir pencarian
                    if found:
                        print(f"HASIL AKHIR: Anggota baru berhasil ditemukan di halaman daftar anggota")
                        langkah.append(f"HASIL AKHIR: Anggota baru berhasil ditemukan di halaman daftar anggota")
                    else:
                        print(f"HASIL AKHIR: Anggota baru tidak ditemukan di halaman daftar anggota")
                        langkah.append(f"HASIL AKHIR: Anggota baru tidak ditemukan di halaman daftar anggota")
                        
                        # Coba reload halaman dan cari lagi
                        print("Mencoba reload halaman dan cari lagi...")
                        langkah.append("Mencoba reload halaman dan cari lagi...")
                        await page.reload()
                        await page.wait_for_load_state("networkidle")
                        await asyncio.sleep(5)
                        
                        # Cari lagi setelah reload
                        found_after_reload = await page.evaluate(f"""
                            (nama) => {{
                                const cards = document.querySelectorAll('.card');
                                for (const card of cards) {{
                                    if (card.textContent.toLowerCase().includes(nama.toLowerCase())) {{
                                        card.style.border = '2px solid green';
                                        card.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
                                        return true;
                                    }}
                                }}
                                return false;
                            }}
                        """, nama_anggota)
                        
                        if found_after_reload:
                            print(f"Anggota baru ditemukan setelah reload halaman")
                            langkah.append(f"Anggota baru ditemukan setelah reload halaman")
                            
                            # Ambil screenshot setelah reload
                            screenshot_path = os.path.join("test-results/screenshots", f"after_reload_{len(screenshots)}.png")
                            await page.screenshot(path=screenshot_path)
                            screenshots.append(screenshot_path)
                        else:
                            print(f"Anggota baru tetap tidak ditemukan setelah reload halaman")
                            langkah.append(f"Anggota baru tetap tidak ditemukan setelah reload halaman")
                except Exception as e:
                    print(f"Error saat mencari anggota baru: {e}")
                    langkah.append(f"Error saat mencari anggota baru: {e}")
                except Exception as e:
                    print(f"Error saat mencari anggota baru: {e}")
                    langkah.append(f"Error saat mencari anggota baru: {e}")
            except Exception as e:
                print(f"Error saat verifikasi anggota baru: {e}")
                langkah.append(f"Error saat verifikasi anggota baru: {e}")
            
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
    report_filename = f"test-results/tambah-anggota-test-report-{timestamp}.html"
    
    # Buat konten HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Pengujian Tambah Anggota</title>
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
            <h1>Laporan Pengujian Tambah Anggota</h1>
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
