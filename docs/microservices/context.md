# Konteks Proyek Proker Tracker

## Tentang Proker Tracker

Proker Tracker adalah aplikasi manajemen program kerja untuk organisasi mahasiswa yang dikembangkan untuk membantu pengelolaan dan pemantauan program kerja dengan lebih efisien. Aplikasi ini memungkinkan organisasi untuk membuat, melacak, dan mengevaluasi program kerja mereka, serta mengelola anggota dan tugas-tugas terkait.

## Fitur Utama

- **Manajemen Pengguna**: Registrasi, login, dan manajemen profil pengguna
- **Manajemen Organisasi**: Pengelolaan data organisasi dan departemen
- **Manajemen Program Kerja**: Pembuatan, pengeditan, dan pelacakan program kerja
- **Manajemen Tugas**: Penugasan dan pemantauan tugas-tugas dalam program kerja
- **Dashboard**: Visualisasi status dan progres program kerja

## Status Pengembangan Saat Ini

Proyek Proker Tracker saat ini telah mencapai tahap pengembangan yang cukup matang dengan fitur-fitur utama yang sudah diimplementasikan. Beberapa pencapaian penting meliputi:

1. **Frontend**: Implementasi antarmuka pengguna dengan Next.js dan Tailwind CSS
2. **Backend**: Implementasi API dengan Next.js API Routes
3. **Database**: Integrasi dengan database MySQL
4. **Autentikasi**: Sistem login, registrasi, dan manajemen sesi
5. **Testing**: Implementasi pengujian otomatis untuk fitur-fitur utama

## Struktur Proyek Saat Ini

Proyek saat ini menggunakan arsitektur monolitik dengan struktur sebagai berikut:

```
/proker_tracker_v16
  /src
    /app             # Next.js App Router
      /api           # API Routes
      /dashboard     # Dashboard pages
      /auth          # Authentication pages
    /components      # React components
    /lib             # Utility functions
  /public            # Static assets
  /tests             # Automated tests
```

## Motivasi Implementasi Microservices

Implementasi microservices pada proyek Proker Tracker bertujuan untuk:

1. **Skalabilitas**: Memungkinkan pengembangan dan penskalaan komponen secara independen
2. **Pemisahan Concern**: Memisahkan tanggung jawab berdasarkan domain bisnis
3. **Ketahanan**: Meningkatkan ketahanan sistem dengan isolasi kegagalan
4. **Pengembangan Paralel**: Memungkinkan tim untuk bekerja pada layanan yang berbeda secara bersamaan
5. **Teknologi yang Tepat**: Memungkinkan penggunaan teknologi yang paling sesuai untuk setiap layanan

## Pendekatan Implementasi

Implementasi microservices untuk Proker Tracker akan menggunakan pendekatan Rapid Application Development (RAD) dengan fokus pada:

1. **Monorepo dengan Domain-Driven Design**: Satu repositori dengan pemisahan kode berdasarkan domain bisnis
2. **Supabase sebagai Backend**: Memanfaatkan Supabase untuk database, autentikasi, dan serverless functions
3. **Next.js untuk Frontend dan API Gateway**: Menggunakan Next.js sebagai frontend dan API gateway
4. **Netlify untuk Deployment**: Deployment sederhana dan otomatis ke Netlify

Pendekatan ini dipilih untuk menyeimbangkan manfaat microservices dengan kompleksitas pengembangan, sehingga cocok untuk konteks akademis dan demonstrasi konsep.