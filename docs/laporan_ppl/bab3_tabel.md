# BAB III: DESKRIPSI APLIKASI PROKER TRACKER

## 3.1 Arsitektur Aplikasi

| Komponen Arsitektur | Deskripsi | Tanggung Jawab |
|---------------------|-----------|----------------|
| **API Gateway** | Middleware berbasis Next.js | Menangani routing permintaan ke microservices yang sesuai, mengumpulkan metrik API, dan menerapkan autentikasi |
| **Auth Service** | Microservice berbasis Supabase Auth | Mengelola autentikasi, otorisasi, dan keamanan berbasis JWT |
| **User Service** | Microservice domain pengguna | Mengelola profil pengguna, preferensi, dan informasi akun |
| **Organization Service** | Microservice domain organisasi | Mengelola data organisasi, departemen, dan struktur hierarki |
| **Program Service** | Microservice domain program kerja | Mengelola program kerja, timeline, dan status kemajuan |
| **Task Service** | Microservice domain tugas | Mengelola tugas-tugas dalam program kerja, penugasan, dan status |
| **Metrics System** | Sistem monitoring dan analitik | Mengumpulkan metrik performa API, menghasilkan visualisasi, dan menyediakan insight operasional |
| **Database Layer** | PostgreSQL via Supabase | Menyimpan data aplikasi dengan skema yang dioptimalkan dan Row Level Security |
| **Frontend Layer** | Next.js 14 dengan App Router | Menyajikan antarmuka pengguna responsif dengan rendering server-side dan client-side |

## 3.2 Fitur Utama Aplikasi

| Kategori Fitur | Fitur | Deskripsi |
|----------------|-------|-----------|
| **Manajemen Program Kerja** | Pembuatan Program | Membuat program kerja baru dengan detail lengkap |
|  | Timeline & Milestone | Menetapkan timeline dan milestone program kerja |
|  | Status & Tracking | Memantau status dan kemajuan program kerja |
|  | Evaluasi Program | Mengevaluasi keberhasilan program kerja |
| **Manajemen Tugas** | Pembuatan Tugas | Membagi program kerja menjadi tugas-tugas kecil |
|  | Penugasan | Menetapkan anggota yang bertanggung jawab |
|  | Prioritas & Deadline | Mengatur prioritas dan tenggat waktu tugas |
|  | Status Tugas | Melacak status penyelesaian tugas |
| **Manajemen Anggota** | Profil Anggota | Mengelola profil dan informasi anggota |
|  | Peran & Hak Akses | Menetapkan peran dan hak akses berdasarkan jabatan |
|  | Departemen | Mengorganisir anggota berdasarkan departemen |
|  | Kinerja Anggota | Melacak kontribusi dan kinerja anggota |
| **Dashboard & Analitik** | Dashboard Interaktif | Menyajikan visualisasi status program kerja |
|  | Metrik Kinerja | Menampilkan metrik kinerja organisasi |
|  | Grafik & Chart | Visualisasi data dengan berbagai jenis grafik |
|  | Filtering & Sorting | Memfilter dan mengurutkan data sesuai kebutuhan |
| **Laporan & Dokumentasi** | Laporan Program | Menghasilkan laporan program kerja |
|  | Ekspor Data | Mengekspor data dalam berbagai format |
|  | Dokumentasi Kegiatan | Mendokumentasikan kegiatan program kerja |
|  | Arsip Program | Mengarsipkan program kerja yang telah selesai |
| **Sistem Notifikasi** | Email Notifications | Mengirim notifikasi melalui email |
|  | In-App Notifications | Menampilkan notifikasi dalam aplikasi |
|  | Reminder | Mengingatkan tenggat waktu dan tugas penting |
|  | Activity Feed | Menampilkan aktivitas terbaru dalam organisasi |
| **Keamanan & Administrasi** | Autentikasi | Sistem login dan registrasi yang aman |
|  | Role-Based Access | Kontrol akses berdasarkan peran |
|  | Audit Trail | Melacak perubahan pada data penting |
|  | Backup & Restore | Mencadangkan dan memulihkan data |
