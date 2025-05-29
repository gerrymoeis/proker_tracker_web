# Panduan Desain Proker Tracker

## Identitas Visual

### Palet Warna
Proker Tracker akan menggunakan palet warna dengan tone biru profesional yang sesuai dengan logo. Palet warna utama:

- **Biru Primer**: `#0F52BA` - Warna utama untuk elemen-elemen penting, header, dan tombol utama
- **Biru Sekunder**: `#1E88E5` - Warna untuk aksen dan elemen interaktif
- **Biru Tersier**: `#64B5F6` - Warna untuk highlight dan elemen sekunder
- **Navy**: `#0A2463` - Warna untuk footer dan area yang membutuhkan kedalaman
- **Abu-abu Terang**: `#F5F7FA` - Warna latar belakang utama
- **Abu-abu Gelap**: `#4A5568` - Warna teks utama
- **Putih**: `#FFFFFF` - Warna untuk latar belakang kartu dan elemen kontras

### Tipografi
- **Font Utama**: Inter - Font sans-serif modern untuk teks utama, paragraf, dan UI
- **Font Heading**: Montserrat - Font untuk judul dan heading dengan keterbacaan tinggi
- **Font Aksen**: Poppins - Font untuk elemen yang membutuhkan penekanan khusus

### Ikonografi
- Gunakan set ikon yang konsisten dari Lucide Icons (terintegrasi dengan Shadcn UI)
- Pastikan ukuran ikon konsisten di seluruh aplikasi
- Gunakan warna ikon yang sesuai dengan palet warna

## Komponen UI

### Tombol
- **Tombol Primer**: Latar belakang biru primer dengan teks putih
- **Tombol Sekunder**: Outline biru primer dengan teks biru primer
- **Tombol Tersier**: Latar belakang transparan dengan teks biru primer
- **Tombol Bahaya**: Latar belakang merah dengan teks putih

### Kartu
- Latar belakang putih dengan bayangan halus
- Border radius konsisten (8px)
- Padding internal yang konsisten (16px-24px)
- Heading dengan warna biru primer

### Formulir
- Label di atas input field
- Validasi dengan pesan error yang jelas
- Indikator field wajib yang konsisten
- Spacing yang konsisten antar field

### Navigasi
- Sidebar dengan highlight item aktif
- Navbar dengan logo dan akses cepat ke fitur utama
- Breadcrumb untuk navigasi hierarkis
- Dropdown menu untuk aksi kontekstual

### Tabel
- Header dengan latar belakang biru primer dan teks putih
- Baris bergantian dengan latar belakang abu-abu sangat terang
- Pagination yang jelas dan konsisten
- Aksi kontekstual per baris

## Layout Halaman

### Halaman Utama (Dashboard)
- Header dengan logo dan navigasi utama
- Sidebar untuk navigasi sekunder
- Area konten utama dengan kartu statistik
- Timeline visual program kerja
- Daftar tugas yang harus diselesaikan
- Widget kalender dengan highlight acara penting

### Halaman Program Kerja
- Header dengan judul program dan status
- Timeline visual dengan bagan Gantt
- Daftar milestone dengan indikator status
- Daftar tugas dengan filter dan sorting
- Area diskusi dan komentar

### Halaman Profil Pengguna
- Header dengan foto profil dan nama
- Tab untuk informasi berbeda (personal, organisasi, aktivitas)
- Daftar program dan tugas yang ditugaskan
- Statistik aktivitas dan kontribusi
- Pengaturan profil dan preferensi

### Halaman Manajemen Organisasi
- Header dengan logo dan nama organisasi
- Tab untuk berbagai aspek (anggota, program, struktur)
- Visualisasi struktur organisasi
- Daftar anggota dengan peran dan departemen
- Daftar program kerja dengan status

### Halaman Evaluasi
- Header dengan judul program yang dievaluasi
- Metrik dan KPI dengan visualisasi
- Formulir evaluasi dengan berbagai parameter
- Perbandingan target vs. realisasi
- Area untuk dokumentasi post-mortem

## Prinsip Desain

### Konsistensi
- Gunakan komponen UI yang konsisten di seluruh aplikasi
- Pertahankan spacing, warna, dan tipografi yang konsisten
- Pastikan pola interaksi yang konsisten

### Hierarki Visual
- Gunakan ukuran, warna, dan kontras untuk menunjukkan hierarki
- Prioritaskan informasi penting dengan penempatan strategis
- Gunakan whitespace untuk memisahkan kelompok informasi

### Responsivitas
- Desain untuk mobile-first dengan breakpoint yang jelas
- Pastikan semua fitur dapat diakses di semua ukuran layar
- Optimalkan tata letak untuk berbagai perangkat

### Aksesibilitas
- Pastikan kontras warna memenuhi standar WCAG
- Gunakan label dan alt text yang deskriptif
- Pastikan navigasi keyboard berfungsi dengan baik

## Implementasi dengan Shadcn UI

### Kustomisasi Tema
- Gunakan `tailwind.config.js` untuk mendefinisikan palet warna kustom
- Sesuaikan tema Shadcn UI melalui file `globals.css`
- Buat preset tema yang konsisten untuk semua komponen

### Komponen yang Digunakan
- **Layout**: Card, Sheet, Tabs
- **Navigasi**: NavigationMenu, Breadcrumb, Dropdown
- **Data Display**: Table, Calendar, Avatar
- **Formulir**: Input, Select, Checkbox, DatePicker
- **Feedback**: Toast, Alert, Progress
- **Overlay**: Dialog, Drawer, Popover

### Animasi dan Transisi
- Gunakan animasi subtle untuk meningkatkan UX
- Pastikan transisi halaman yang mulus
- Implementasikan skeleton loading untuk konten dinamis

## Mockup Halaman Utama

```
+-------------------------------------------------------+
|  LOGO  | Dashboard | Program | Tugas | Organisasi | 👤 |
+-------------------------------------------------------+
|       |                                               |
|       | Selamat Datang, [Nama Pengguna]              |
|       |                                               |
|       | +------------+ +------------+ +------------+ |
| SIDE  | | Program    | | Tugas      | | Milestone  | |
| BAR   | | Aktif: 5   | | Pending: 8 | | Selesai: 3 | |
|       | +------------+ +------------+ +------------+ |
|       |                                               |
|       | Timeline Program Kerja                        |
|       | +-------------------------------------------+ |
|       | |                                           | |
|       | |  [Bagan Gantt Visual]                    | |
|       | |                                           | |
|       | +-------------------------------------------+ |
|       |                                               |
|       | Tugas Mendatang                              |
|       | +-------------------------------------------+ |
|       | | • Rapat Koordinasi (Besok, 10:00)         | |
|       | | • Deadline Proposal (3 hari lagi)         | |
|       | | • Evaluasi Program (1 minggu lagi)        | |
|       | +-------------------------------------------+ |
|       |                                               |
+-------------------------------------------------------+
```

## Pedoman Implementasi

1. **Konsistensi**: Pastikan semua halaman mengikuti pedoman desain yang sama
2. **Komponen**: Gunakan komponen Shadcn UI yang telah dikustomisasi
3. **Responsivitas**: Uji di berbagai ukuran layar
4. **Performa**: Optimalkan loading time dan interaktivitas
5. **Aksesibilitas**: Pastikan aplikasi dapat digunakan oleh semua pengguna
