# Aturan Pengembangan Proker Tracker

## Aturan Umum

1. **Bahasa**: Seluruh antarmuka pengguna dan konten aplikasi harus menggunakan Bahasa Indonesia.

2. **Komponen UI**: Semua komponen UI harus menggunakan Shadcn UI, tidak diperbolehkan membuat komponen dari awal (scratch).
   - Gunakan komponen Shadcn UI yang tersedia
   - Sesuaikan tema dan styling menggunakan konfigurasi Shadcn UI
   - Pastikan konsistensi visual di seluruh aplikasi

3. **Database**: Implementasi database menggunakan MySQL melalui XAMPP PhpMyAdmin.
   - Tidak menggunakan ORM seperti Prisma (kecuali jika diperlukan)
   - Gunakan koneksi database langsung dengan MySQL
   - Pastikan skema database dirancang dengan baik dan dioptimalkan

4. **Data Testing**: Tidak diperbolehkan menggunakan data dummy.
   - Pengujian harus dilakukan dengan konfigurasi database langsung
   - Uji coba fitur harus dilakukan dengan proses registrasi pengguna nyata
   - Implementasikan validasi data yang ketat

5. **Palet Warna**: Tidak boleh menggunakan gradien default atau kombinasi biru-merah-pink.
   - Gunakan palet warna dengan tone biru profesional yang sesuai dengan logo
   - Pastikan kontras warna memenuhi standar aksesibilitas
   - Implementasikan tema warna yang konsisten di seluruh aplikasi

6. **Struktur Database**: Minimal harus memiliki 5 tabel database.
   - Pastikan relasi antar tabel dirancang dengan baik
   - Implementasikan kunci asing dan indeks yang diperlukan
   - Dokumentasikan skema database dengan jelas

7. **Deployment**: Aplikasi harus di-deploy ke Netlify.
   - Konfigurasi build yang tepat untuk Next.js
   - Pastikan environment variables dikonfigurasi dengan benar
   - Implementasikan CI/CD untuk deployment otomatis

8. **Halaman Minimal**: Aplikasi harus memiliki minimal 5 halaman.
   - Pastikan navigasi antar halaman berfungsi dengan baik
   - Implementasikan routing yang tepat dengan Next.js
   - Pastikan semua fitur dan proses berjalan dengan baik dan tepat

## Aturan Teknis Tambahan

1. **Kode Bersih**: Kode harus bersih, terstruktur, dan mengikuti praktik terbaik.
   - Gunakan ESLint dan Prettier untuk konsistensi kode
   - Implementasikan pemisahan komponen yang baik
   - Dokumentasikan fungsi dan komponen dengan jelas

2. **Responsivitas**: Aplikasi harus responsif dan berfungsi dengan baik di semua ukuran layar.
   - Gunakan fitur responsif Tailwind CSS
   - Uji aplikasi di berbagai perangkat dan ukuran layar
   - Pastikan pengalaman pengguna konsisten di semua perangkat

3. **Performa**: Aplikasi harus memiliki performa yang baik.
   - Optimalkan loading time dan interaktivitas
   - Implementasikan lazy loading untuk komponen berat
   - Gunakan fitur optimasi Next.js seperti Image Optimization

4. **Keamanan**: Implementasikan praktik keamanan yang baik.
   - Validasi input di sisi klien dan server
   - Implementasikan autentikasi dan otorisasi yang aman
   - Lindungi terhadap serangan umum seperti SQL Injection dan XSS

5. **Aksesibilitas**: Aplikasi harus memenuhi standar aksesibilitas dasar.
   - Gunakan atribut ARIA yang tepat
   - Pastikan kontras warna memadai
   - Implementasikan navigasi keyboard yang baik

6. **Versioning**: Gunakan Git untuk version control.
   - Commit message harus deskriptif
   - Gunakan branching strategy yang tepat
   - Dokumentasikan perubahan penting
