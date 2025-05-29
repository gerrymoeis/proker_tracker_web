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
  <a href="#instalasi">Instalasi</a> •
  <a href="#penggunaan">Penggunaan</a> •
  <a href="#tim-pengembang">Tim Pengembang</a> •
  <a href="#lisensi">Lisensi</a>
</p>

## Deskripsi

Proker Tracker adalah aplikasi manajemen program kerja yang dirancang khusus untuk organisasi mahasiswa. Aplikasi ini membantu organisasi dalam merencanakan, melaksanakan, dan mengevaluasi program kerja mereka dengan lebih efektif dan efisien.

Dikembangkan sebagai bagian dari tugas Mata Kuliah Sistem Informasi Manajemen di Program Studi D4 Manajemen Informatika, Fakultas Vokasi, Universitas Negeri Surabaya.

## Fitur

- **Manajemen Program Kerja**: Buat, kelola, dan evaluasi program kerja organisasi
- **Manajemen Tugas**: Bagi program kerja menjadi tugas-tugas kecil dan tetapkan kepada anggota
- **Manajemen Anggota**: Kelola anggota organisasi dan peran mereka
- **Dashboard Interaktif**: Pantau kemajuan program kerja dan tugas secara real-time
- **Laporan**: Hasilkan laporan untuk evaluasi program kerja
- **Autentikasi Pengguna**: Sistem login dan registrasi yang aman
- **Antarmuka Responsif**: Berfungsi dengan baik di desktop dan perangkat mobile

## Teknologi

- **Frontend**: Next.js 13 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MySQL
- **Autentikasi**: JWT (JSON Web Tokens)
- **Styling**: Shadcn UI, Tailwind CSS
- **Deployment**: Netlify

## Instalasi

### Prasyarat

- Node.js (versi 18.x atau lebih tinggi)
- MySQL (versi 8.x atau lebih tinggi)

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

3. Buat file `.env.local` di root proyek dan tambahkan variabel lingkungan berikut:

```
DATABASE_URL=mysql://username:password@localhost:3306/proker_tracker_web
JWT_SECRET=your_jwt_secret_key
```

4. Jalankan migrasi database (pastikan database MySQL Anda sudah berjalan)

```bash
npm run migrate
```

5. Jalankan server pengembangan

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
