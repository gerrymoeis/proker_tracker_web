# BAB 8: METRIK DAN MONITORING

## 8.1 Dashboard Metrik

![Dashboard Metrik](/screenshots/metrics_dashboard_annotated.png)

Dashboard Metrik adalah fitur khusus yang memungkinkan admin untuk memantau performa sistem Proker Tracker secara real-time.

**Cara Mengakses Dashboard Metrik:**

1. Login sebagai admin
2. Klik menu "Metrik" di sidebar navigasi
3. Dashboard metrik akan ditampilkan dengan berbagai visualisasi data

**Elemen Utama Dashboard:**

1. **Header** - Judul halaman dan periode waktu
2. **Filter Waktu** - Dropdown untuk memilih rentang waktu (Hari Ini, 7 Hari Terakhir, 30 Hari Terakhir)
3. **Kartu Ringkasan** - Menampilkan statistik utama seperti total request, rata-rata waktu respons, dan error rate
4. **Grafik Request** - Visualisasi jumlah request per waktu
5. **Grafik Waktu Respons** - Visualisasi rata-rata waktu respons per waktu
6. **Grafik Error** - Visualisasi jumlah error per waktu
7. **Tabel Endpoint** - Daftar endpoint API dengan statistik performa

> **Catatan**: Dashboard Metrik hanya dapat diakses oleh pengguna dengan peran Admin.

## 8.2 Analisis Performa API

![Analisis Performa API](/screenshots/api_performance_annotated.png)

Halaman Analisis Performa API memberikan informasi detail tentang kinerja API Gateway dan layanan microservices.

**Informasi yang Ditampilkan:**

1. **Endpoint Populer** - Daftar endpoint API yang paling sering diakses
2. **Waktu Respons** - Rata-rata waktu respons untuk setiap endpoint
3. **Error Rate** - Persentase error untuk setiap endpoint
4. **Distribusi Request** - Visualisasi distribusi request ke berbagai layanan
5. **Tren Penggunaan** - Grafik tren penggunaan API dari waktu ke waktu

**Cara Menggunakan:**

- Gunakan filter waktu untuk melihat data dalam periode tertentu
- Klik pada endpoint tertentu untuk melihat detail performa
- Sortir tabel berdasarkan waktu respons atau error rate untuk mengidentifikasi masalah
- Ekspor data dalam format CSV untuk analisis lebih lanjut

> **Tips**: Perhatikan endpoint dengan waktu respons tinggi atau error rate tinggi untuk mengidentifikasi area yang perlu dioptimalkan.

## 8.3 Monitoring Sistem

![Monitoring Sistem](/screenshots/system_monitoring_annotated.png)

Fitur Monitoring Sistem memungkinkan admin untuk memantau kesehatan sistem Proker Tracker secara keseluruhan.

**Informasi yang Dipantau:**

1. **Status Layanan** - Status operasional setiap layanan microservices
2. **Penggunaan Sumber Daya** - Penggunaan CPU, memori, dan penyimpanan
3. **Waktu Uptime** - Berapa lama sistem telah berjalan tanpa gangguan
4. **Notifikasi** - Peringatan tentang masalah sistem atau anomali
5. **Log Sistem** - Catatan aktivitas sistem untuk debugging

**Fitur Interaktif:**

1. **Tombol Refresh** - Untuk memperbarui data monitoring secara manual
2. **Toggle Status** - Untuk mengaktifkan/menonaktifkan layanan tertentu (khusus admin)
3. **Download Log** - Untuk mengunduh log sistem untuk analisis
4. **Pengaturan Notifikasi** - Untuk mengonfigurasi peringatan otomatis

**Cara Menggunakan:**

1. Buka halaman Monitoring Sistem
2. Lihat status semua layanan di panel utama
3. Klik pada layanan tertentu untuk melihat detail lebih lanjut
4. Gunakan tab navigasi untuk beralih antara Status, Sumber Daya, dan Log
5. Atur notifikasi untuk mendapatkan peringatan saat terjadi masalah

> **Penting**: Monitoring sistem secara teratur membantu mengidentifikasi dan mengatasi masalah sebelum berdampak pada pengguna.

## 8.4 Laporan dan Analitik

![Laporan dan Analitik](/screenshots/reports_analytics_annotated.png)

Fitur Laporan dan Analitik menyediakan wawasan mendalam tentang penggunaan aplikasi Proker Tracker.

**Jenis Laporan:**

1. **Laporan Penggunaan** - Statistik tentang aktivitas pengguna
2. **Laporan Performa** - Data tentang kinerja sistem
3. **Laporan Error** - Informasi tentang error dan exception
4. **Laporan Keamanan** - Log aktivitas keamanan dan upaya akses

**Cara Membuat Laporan:**

1. Buka halaman Laporan dan Analitik
2. Pilih jenis laporan dari dropdown
3. Tentukan parameter laporan (rentang waktu, layanan, dll.)
4. Klik tombol "Buat Laporan"
5. Laporan akan ditampilkan dan dapat diunduh dalam format PDF atau CSV

**Fitur Analitik:**

- Visualisasi data dengan berbagai jenis grafik
- Perbandingan data antar periode
- Identifikasi tren dan pola
- Prediksi berdasarkan data historis

> **Tips**: Jadwalkan laporan rutin untuk dikirim ke email Anda untuk memantau tren performa sistem dari waktu ke waktu.
