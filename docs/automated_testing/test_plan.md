# Test Plan Proker Tracker

## Pendahuluan

Dokumen ini menjelaskan rencana pengujian otomatis untuk aplikasi Proker Tracker menggunakan Playwright. Test plan ini mencakup detail test case untuk setiap fitur utama aplikasi, termasuk input yang diperlukan, langkah-langkah pengujian, dan hasil yang diharapkan.

## Persiapan Lingkungan Testing

Sebelum menjalankan test, pastikan lingkungan testing telah disiapkan dengan benar:

1. **Instalasi Playwright**:
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Struktur Direktori**:
   ```
   tests/
   ├── fixtures/    # Data test
   ├── pages/       # Page objects
   ├── utils/       # Utility functions
   ├── visual/      # Visual testing helpers
   └── specs/       # Test specifications
   ```

3. **Konfigurasi Playwright**:
   ```typescript
   // playwright.config.ts
   import { PlaywrightTestConfig } from '@playwright/test';

   const config: PlaywrightTestConfig = {
     testDir: './tests/specs',
     timeout: 30000,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     use: {
       headless: false,
       viewport: { width: 1280, height: 720 },
       ignoreHTTPSErrors: true,
       video: 'on-first-retry',
       screenshot: 'only-on-failure',
       trace: 'on-first-retry',
     },
     projects: [
       {
         name: 'chromium',
         use: { browserName: 'chromium' },
       },
     ],
   };

   export default config;
   ```

## Test Cases

### 1. Modul Autentikasi

#### 1.1 Login Pengguna

**ID Test**: AUTH-001  
**Deskripsi**: Memverifikasi bahwa pengguna dapat login dengan kredensial yang valid  
**Prasyarat**: Pengguna sudah terdaftar di sistem  

**Langkah-langkah**:
1. Buka halaman login
2. Masukkan email yang valid
3. Masukkan password yang valid
4. Klik tombol "Masuk"
5. Verifikasi redirect ke halaman dashboard

**Data Test**:
- Email: `admin@example.com`
- Password: `password123`

**Hasil yang Diharapkan**:
- Pengguna berhasil login
- Redirect ke halaman dashboard
- Nama pengguna ditampilkan di header

**Implementasi**:
```typescript
test('Login dengan kredensial valid', async ({ page }) => {
  // Highlight untuk visualisasi
  const visualHelper = new VisualHelper(page);
  
  // Tampilkan progress
  await visualHelper.showProgress(1, 5, 'Membuka halaman login');
  
  // Buka halaman login
  await page.goto('/login');
  
  // Highlight form login
  await visualHelper.highlightElement('form');
  
  // Update progress
  await visualHelper.showProgress(2, 5, 'Mengisi email');
  
  // Isi email
  await page.fill('#email', 'admin@example.com');
  await visualHelper.highlightElement('#email');
  
  // Update progress
  await visualHelper.showProgress(3, 5, 'Mengisi password');
  
  // Isi password
  await page.fill('#password', 'password123');
  await visualHelper.highlightElement('#password');
  
  // Update progress
  await visualHelper.showProgress(4, 5, 'Klik tombol login');
  
  // Klik tombol login
  await visualHelper.highlightElement('button[type="submit"]');
  await page.click('button[type="submit"]');
  
  // Update progress
  await visualHelper.showProgress(5, 5, 'Verifikasi redirect ke dashboard');
  
  // Verifikasi redirect ke dashboard
  await page.waitForURL('**/dashboard');
  
  // Verifikasi nama pengguna ditampilkan
  const userNameVisible = await page.isVisible('text=Admin User');
  expect(userNameVisible).toBeTruthy();
  
  // Ambil screenshot hasil
  await visualHelper.takeScreenshot('login-success');
});
```

#### 1.2 Login dengan Kredensial Invalid

**ID Test**: AUTH-002  
**Deskripsi**: Memverifikasi bahwa sistem menampilkan pesan error saat login dengan kredensial yang tidak valid  

**Langkah-langkah**:
1. Buka halaman login
2. Masukkan email yang valid
3. Masukkan password yang tidak valid
4. Klik tombol "Masuk"
5. Verifikasi pesan error ditampilkan

**Data Test**:
- Email: `admin@example.com`
- Password: `wrong_password`

**Hasil yang Diharapkan**:
- Pesan error ditampilkan
- Pengguna tetap berada di halaman login

#### 1.3 Registrasi Pengguna Baru

**ID Test**: AUTH-003  
**Deskripsi**: Memverifikasi bahwa pengguna baru dapat mendaftar dengan sukses  

**Langkah-langkah**:
1. Buka halaman registrasi
2. Isi semua field yang diperlukan
3. Klik tombol "Daftar"
4. Verifikasi redirect ke halaman login
5. Verifikasi pesan sukses ditampilkan

**Data Test**:
- Nama: `Test User`
- Email: `testuser@example.com`
- Password: `securepassword123`
- Konfirmasi Password: `securepassword123`

**Hasil yang Diharapkan**:
- Pengguna berhasil terdaftar
- Redirect ke halaman login
- Pesan sukses ditampilkan

### 2. Modul Dashboard

#### 2.1 Tampilan Dashboard

**ID Test**: DASH-001  
**Deskripsi**: Memverifikasi bahwa dashboard menampilkan semua komponen yang diperlukan  

**Langkah-langkah**:
1. Login sebagai pengguna
2. Verifikasi statistik ditampilkan
3. Verifikasi daftar program terbaru ditampilkan
4. Verifikasi daftar tugas mendatang ditampilkan

**Hasil yang Diharapkan**:
- Semua komponen dashboard ditampilkan dengan benar
- Data statistik sesuai dengan data di database
- Daftar program dan tugas sesuai dengan data pengguna

**Implementasi**:
```typescript
test('Tampilan dashboard menampilkan semua komponen', async ({ page }) => {
  const visualHelper = new VisualHelper(page);
  
  // Login terlebih dahulu
  await loginHelper.loginAsAdmin(page);
  
  // Tampilkan progress
  await visualHelper.showProgress(1, 4, 'Verifikasi halaman dashboard');
  
  // Verifikasi URL
  await page.waitForURL('**/dashboard');
  
  // Update progress
  await visualHelper.showProgress(2, 4, 'Verifikasi statistik');
  
  // Verifikasi statistik
  await visualHelper.highlightElement('.stats-cards');
  const statsCardsVisible = await page.isVisible('.stats-cards');
  expect(statsCardsVisible).toBeTruthy();
  
  // Update progress
  await visualHelper.showProgress(3, 4, 'Verifikasi daftar program');
  
  // Verifikasi daftar program
  await visualHelper.highlightElement('.recent-programs');
  const programsVisible = await page.isVisible('.recent-programs');
  expect(programsVisible).toBeTruthy();
  
  // Update progress
  await visualHelper.showProgress(4, 4, 'Verifikasi daftar tugas');
  
  // Verifikasi daftar tugas
  await visualHelper.highlightElement('.upcoming-tasks');
  const tasksVisible = await page.isVisible('.upcoming-tasks');
  expect(tasksVisible).toBeTruthy();
  
  // Ambil screenshot hasil
  await visualHelper.takeScreenshot('dashboard-components');
});
```

### 3. Modul Program Kerja

#### 3.1 Melihat Daftar Program

**ID Test**: PROG-001  
**Deskripsi**: Memverifikasi bahwa daftar program kerja ditampilkan dengan benar  

**Langkah-langkah**:
1. Login sebagai pengguna
2. Navigasi ke halaman program kerja
3. Verifikasi daftar program ditampilkan

**Hasil yang Diharapkan**:
- Daftar program kerja ditampilkan
- Informasi program (nama, status, tanggal) ditampilkan dengan benar

#### 3.2 Membuat Program Kerja Baru

**ID Test**: PROG-002  
**Deskripsi**: Memverifikasi bahwa pengguna dapat membuat program kerja baru  

**Langkah-langkah**:
1. Login sebagai pengguna
2. Navigasi ke halaman program kerja
3. Klik tombol "Program Baru"
4. Isi semua field yang diperlukan
5. Klik tombol "Simpan"
6. Verifikasi program baru ditampilkan di daftar

**Data Test**:
- Nama Program: `Program Test Automation`
- Deskripsi: `Program untuk testing otomatis`
- Tanggal Mulai: `2025-06-01`
- Tanggal Selesai: `2025-06-30`
- Departemen: `Departemen Pendidikan dan Riset Teknologi`
- Status: `Belum Dimulai`

**Hasil yang Diharapkan**:
- Program kerja baru berhasil dibuat
- Program baru muncul di daftar program
- Notifikasi sukses ditampilkan

**Implementasi**:
```typescript
test('Membuat program kerja baru', async ({ page }) => {
  const visualHelper = new VisualHelper(page);
  
  // Login terlebih dahulu
  await loginHelper.loginAsAdmin(page);
  
  // Tampilkan progress
  await visualHelper.showProgress(1, 7, 'Navigasi ke halaman program');
  
  // Navigasi ke halaman program
  await page.click('text=Program Kerja');
  await page.waitForURL('**/dashboard/programs');
  
  // Update progress
  await visualHelper.showProgress(2, 7, 'Klik tombol Program Baru');
  
  // Klik tombol Program Baru
  await visualHelper.highlightElement('text=Program Baru');
  await page.click('text=Program Baru');
  
  // Tunggu form muncul
  await page.waitForSelector('form');
  
  // Update progress
  await visualHelper.showProgress(3, 7, 'Mengisi nama program');
  
  // Isi nama program
  await visualHelper.highlightElement('#name');
  await page.fill('#name', 'Program Test Automation');
  
  // Update progress
  await visualHelper.showProgress(4, 7, 'Mengisi deskripsi program');
  
  // Isi deskripsi
  await visualHelper.highlightElement('#description');
  await page.fill('#description', 'Program untuk testing otomatis');
  
  // Update progress
  await visualHelper.showProgress(5, 7, 'Mengisi tanggal program');
  
  // Isi tanggal
  await visualHelper.highlightElement('#start_date');
  await page.fill('#start_date', '2025-06-01');
  
  await visualHelper.highlightElement('#end_date');
  await page.fill('#end_date', '2025-06-30');
  
  // Update progress
  await visualHelper.showProgress(6, 7, 'Memilih departemen dan status');
  
  // Pilih departemen
  await visualHelper.highlightElement('#department_id');
  await page.selectOption('#department_id', { label: 'Departemen Pendidikan dan Riset Teknologi' });
  
  // Pilih status
  await visualHelper.highlightElement('#status');
  await page.selectOption('#status', { value: 'belum_dimulai' });
  
  // Update progress
  await visualHelper.showProgress(7, 7, 'Menyimpan program');
  
  // Klik tombol simpan
  await visualHelper.highlightElement('button[type="submit"]');
  await page.click('button[type="submit"]');
  
  // Verifikasi notifikasi sukses
  await page.waitForSelector('.success-notification');
  
  // Verifikasi program baru muncul di daftar
  await page.waitForSelector('text=Program Test Automation');
  
  // Ambil screenshot hasil
  await visualHelper.takeScreenshot('create-program-success');
});
```

### 4. Modul Tugas

#### 4.1 Melihat Daftar Tugas

**ID Test**: TASK-001  
**Deskripsi**: Memverifikasi bahwa daftar tugas ditampilkan dengan benar  

**Langkah-langkah**:
1. Login sebagai pengguna
2. Navigasi ke halaman tugas
3. Verifikasi daftar tugas ditampilkan

**Hasil yang Diharapkan**:
- Daftar tugas ditampilkan
- Informasi tugas (nama, status, tenggat waktu) ditampilkan dengan benar

#### 4.2 Membuat Tugas Baru

**ID Test**: TASK-002  
**Deskripsi**: Memverifikasi bahwa pengguna dapat membuat tugas baru  

**Langkah-langkah**:
1. Login sebagai pengguna
2. Navigasi ke halaman tugas
3. Klik tombol "Tugas Baru"
4. Isi semua field yang diperlukan
5. Klik tombol "Simpan"
6. Verifikasi tugas baru ditampilkan di daftar

**Data Test**:
- Nama Tugas: `Tugas Test Automation`
- Deskripsi: `Tugas untuk testing otomatis`
- Tanggal Tenggat: `2025-06-15`
- Program: `Program Test Automation`
- Prioritas: `Tinggi`
- Status: `Belum Dimulai`

**Hasil yang Diharapkan**:
- Tugas baru berhasil dibuat
- Tugas baru muncul di daftar tugas
- Notifikasi sukses ditampilkan

#### 4.3 Menandai Tugas Selesai

**ID Test**: TASK-003  
**Deskripsi**: Memverifikasi bahwa pengguna dapat menandai tugas sebagai selesai  

**Langkah-langkah**:
1. Login sebagai pengguna
2. Navigasi ke halaman tugas
3. Temukan tugas yang akan ditandai selesai
4. Klik tombol aksi dan pilih "Tandai Selesai"
5. Verifikasi status tugas berubah menjadi "Selesai"

**Hasil yang Diharapkan**:
- Status tugas berubah menjadi "Selesai"
- Notifikasi sukses ditampilkan

### 5. Modul Anggota

#### 5.1 Melihat Daftar Anggota

**ID Test**: MEMB-001  
**Deskripsi**: Memverifikasi bahwa daftar anggota ditampilkan dengan benar  

**Langkah-langkah**:
1. Login sebagai admin
2. Navigasi ke halaman anggota
3. Verifikasi daftar anggota ditampilkan

**Hasil yang Diharapkan**:
- Daftar anggota ditampilkan
- Informasi anggota (nama, email, peran) ditampilkan dengan benar

#### 5.2 Menambah Anggota Baru

**ID Test**: MEMB-002  
**Deskripsi**: Memverifikasi bahwa admin dapat menambahkan anggota baru  

**Langkah-langkah**:
1. Login sebagai admin
2. Navigasi ke halaman anggota
3. Klik tombol "Tambah Anggota"
4. Isi semua field yang diperlukan
5. Klik tombol "Simpan"
6. Verifikasi anggota baru ditampilkan di daftar

**Data Test**:
- Nama: `Anggota Test`
- Email: `anggota.test@example.com`
- Peran: `Anggota`
- Departemen: `Departemen Pendidikan dan Riset Teknologi`

**Hasil yang Diharapkan**:
- Anggota baru berhasil ditambahkan
- Anggota baru muncul di daftar anggota
- Notifikasi sukses ditampilkan

## Strategi Eksekusi

Untuk memaksimalkan efektivitas dan efisiensi testing, kita akan mengadopsi strategi eksekusi berikut:

1. **Urutan Eksekusi**:
   - Mulai dari test autentikasi
   - Lanjutkan ke test dashboard
   - Kemudian test program kerja
   - Dilanjutkan dengan test tugas
   - Terakhir test anggota

2. **Dependensi Test**:
   - Beberapa test memiliki dependensi pada test lain
   - Misalnya, test membuat tugas baru memerlukan program kerja yang sudah ada
   - Gunakan fixtures untuk mengatasi dependensi

3. **Data Test**:
   - Gunakan data test yang konsisten
   - Reset database sebelum menjalankan suite test
   - Gunakan data mock untuk test yang memerlukan data eksternal

## Laporan Hasil

Setelah menjalankan semua test, laporan hasil akan ditampilkan dalam format yang mudah dibaca, mencakup:

1. **Ringkasan Hasil**:
   - Jumlah test yang berhasil, gagal, dan dilewati
   - Waktu eksekusi total

2. **Detail Test**:
   - Hasil untuk setiap test case
   - Screenshot untuk test yang gagal
   - Langkah-langkah yang dieksekusi

3. **Rekomendasi**:
   - Saran untuk perbaikan jika ditemukan masalah

## Kesimpulan

Test plan ini memberikan panduan komprehensif untuk mengimplementasikan automated testing pada aplikasi Proker Tracker menggunakan Playwright. Dengan mengikuti test plan ini, kita dapat memastikan kualitas aplikasi dan memberikan feedback visual yang jelas tentang proses testing.
