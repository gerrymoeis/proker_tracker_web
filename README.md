# Proker Tracker

<p align="center">
  <img src="public/logo.png" alt="Proker Tracker Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Aplikasi Manajemen Program Kerja untuk Organisasi Mahasiswa</strong>
</p>

<p align="center">
  <a href="#fitur">Fitur</a> •
  <a href="#teknologi">Teknologi</a> •
  <a href="#arsitektur">Arsitektur</a> •
  <a href="#instalasi">Instalasi</a> •
  <a href="#penggunaan">Penggunaan</a> •
  <a href="#dokumentasi-api">Dokumentasi API</a> •
  <a href="#tim-pengembang">Tim Pengembang</a> •
  <a href="#lisensi">Lisensi</a>
</p>

## Deskripsi

Proker Tracker adalah aplikasi manajemen program kerja yang dirancang khusus untuk organisasi mahasiswa. Aplikasi ini membantu organisasi dalam merencanakan, melaksanakan, dan mengevaluasi program kerja mereka dengan lebih efektif dan efisien.

Dikembangkan sebagai bagian dari tugas Mata Kuliah Sistem Informasi Manajemen di Program Studi D4 Manajemen Informatika, Fakultas Vokasi, Universitas Negeri Surabaya.

**Update Terbaru (30 Mei 2025)**: Proker Tracker kini mengimplementasikan arsitektur microservices untuk meningkatkan skalabilitas, pemeliharaan, dan ketahanan aplikasi.

## Fitur

- **Manajemen Program Kerja**: Buat, kelola, dan evaluasi program kerja organisasi
- **Manajemen Tugas**: Bagi program kerja menjadi tugas-tugas kecil dan tetapkan kepada anggota
- **Manajemen Anggota**: Kelola anggota organisasi dan peran mereka
- **Dashboard Interaktif**: Pantau kemajuan program kerja dan tugas secara real-time
- **Laporan**: Hasilkan laporan untuk evaluasi program kerja
- **Autentikasi Pengguna**: Sistem login dan registrasi yang aman
- **Antarmuka Responsif**: Berfungsi dengan baik di desktop dan perangkat mobile
- **Arsitektur Microservices**: Pemisahan layanan berdasarkan domain bisnis untuk skalabilitas dan pemeliharaan yang lebih baik
- **API Terdokumentasi**: Swagger documentation untuk semua endpoint API
- **Monitoring Service**: Dashboard untuk memantau kesehatan dan kinerja microservices

## Teknologi

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **API**: Next.js API Routes dengan arsitektur microservices
- **Autentikasi**: Supabase Auth, JWT (JSON Web Tokens)
- **Styling**: Shadcn UI, Tailwind CSS
- **Deployment**: Netlify (Frontend dan API Gateway), Supabase (Backend Services)
- **Dokumentasi API**: Swagger/OpenAPI
- **Monitoring**: Custom Dashboard dengan Chart.js

## Arsitektur

Proker Tracker mengimplementasikan arsitektur microservices dengan pendekatan Domain-Driven Design (DDD) dalam struktur monorepo. Arsitektur ini memisahkan aplikasi menjadi beberapa layanan berdasarkan domain bisnis:

- **Auth Service**: Menangani autentikasi dan otorisasi
- **User Service**: Mengelola data pengguna dan profil
- **Organization Service**: Mengelola data organisasi dan departemen
- **Program Service**: Mengelola program kerja
- **Task Service**: Mengelola tugas-tugas dalam program kerja

Komunikasi antar service dilakukan melalui:
- **Synchronous**: API calls melalui API Gateway
- **Asynchronous**: Event-driven menggunakan Supabase Realtime

Untuk detail lebih lanjut, lihat dokumentasi arsitektur di folder `docs/microservices/`.

## Instalasi

### Prasyarat

- Node.js (versi 18.x atau lebih tinggi)
- Akun Supabase (gratis)
- Akun Netlify (gratis)

### Langkah-langkah

1. Clone repositori ini

```bash
git clone https://github.com/username/proker-tracker.git
cd proker-tracker
```

2. Instal dependensi

```bash
npm install
```

3. Buat proyek Supabase baru di [https://supabase.com](https://supabase.com)

4. Buat file `.env.local` di root proyek dan tambahkan variabel lingkungan berikut:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

5. Jalankan migrasi database

```bash
npm run supabase:migrate
```

6. Jalankan server pengembangan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda untuk melihat aplikasi.

## Penggunaan

### Login dan Registrasi

- Buka halaman registrasi untuk membuat akun baru
- Masukkan informasi organisasi Anda
- Login dengan kredensial yang telah dibuat

### Mengelola Program Kerja

- Buat program kerja baru dari dashboard
- Tetapkan tanggal mulai dan selesai
- Tambahkan deskripsi dan penanggung jawab

### Mengelola Tugas

- Buat tugas baru dalam program kerja
- Tetapkan anggota yang bertanggung jawab
- Tetapkan tenggat waktu dan prioritas

### Melihat Laporan

- Akses halaman laporan untuk melihat kemajuan program kerja
- Filter laporan berdasarkan departemen atau status
- Ekspor laporan jika diperlukan

### Monitoring Microservices

- Akses dashboard admin untuk memantau status microservices
- Lihat metrik performa dan kesehatan setiap service
- Identifikasi dan atasi masalah secara cepat

## Dokumentasi API

Proker Tracker menyediakan API yang terdokumentasi dengan baik untuk integrasi dengan sistem lain. Dokumentasi API tersedia di:

- **Swagger UI**: `/api/docs` (saat menjalankan aplikasi secara lokal)
- **Dokumentasi Statis**: Lihat folder `docs/microservices/api-endpoints.md`

Semua endpoint API menggunakan autentikasi Bearer Token dan mengembalikan respons dalam format JSON.

## Tim Pengembang

Aplikasi ini dikembangkan oleh Kelompok 7, Kelas 2023E, Prodi D4 Manajemen Informatika:

- Gerry Moeis Mahardika Dwi Putra - 23091397164
- Ahmad Aryobimo - 23091397151
- Zaidan Dhiya Ulhaq - 23091397152
- Umar Faruq - 23091397157
- Adip Setiaputra - 23091397158

Dosen Pengampu Mata Kuliah:
Salamun Rohman Nudin, S.Kom., M.Kom.

## Lisensi

Hak Cipta © 2025 Kelompok 7 SIM. Hak Cipta Dilindungi.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

### Netlify

Proker Tracker dioptimalkan untuk deployment di Netlify:

1. Hubungkan repositori GitHub Anda ke Netlify
2. Konfigurasi build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Tambahkan variabel lingkungan yang diperlukan
4. Deploy!

### Supabase

1. Buat proyek Supabase baru
2. Jalankan migrasi database menggunakan Supabase CLI
3. Konfigurasi Row Level Security (RLS) untuk keamanan data
4. Deploy Edge Functions jika diperlukan

Untuk panduan deployment lengkap, lihat `docs/microservices/implementation-guide.md`.
