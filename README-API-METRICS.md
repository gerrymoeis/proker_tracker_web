# Proker Tracker Web - Sistem Metrik API dengan MySQL

## Ringkasan

Sistem Metrik API pada Proker Tracker Web telah dimigrasi dari penyimpanan in-memory ke database MySQL persisten. Dokumen ini menjelaskan cara menggunakan dan mengakses sistem metrik yang telah diperbarui.

## Prasyarat

1. MySQL Server (versi 5.7 atau lebih baru)
2. Variabel lingkungan yang dikonfigurasi dengan benar di file `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=proker_tracker_web
   JWT_SECRET=your_jwt_secret
   ```

## Instalasi dan Setup

1. **Buat Tabel Database**

   Jalankan script SQL berikut di database MySQL Anda:

   ```sql
   CREATE TABLE IF NOT EXISTS `api_metrics` (
     `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
     `path` VARCHAR(255) NOT NULL,
     `method` VARCHAR(10) NOT NULL,
     `status_code` INT NOT NULL,
     `response_time` INT NOT NULL,
     `timestamp` DATETIME NOT NULL,
     `service` VARCHAR(50) NOT NULL,
     `user_id` INT NULL,
     `ip_address` VARCHAR(45) NULL,
     `user_agent` VARCHAR(255) NULL,
     PRIMARY KEY (`id`),
     INDEX `idx_api_metrics_timestamp` (`timestamp`),
     INDEX `idx_api_metrics_path` (`path`),
     INDEX `idx_api_metrics_service` (`service`),
     INDEX `idx_api_metrics_status_code` (`status_code`),
     CONSTRAINT `fk_api_metrics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

   File SQL ini juga tersedia di `docs/migrations/api_metrics_table.sql`.

2. **Install Dependensi**

   ```bash
   npm install mysql2
   ```

## Cara Mengakses Metrik API

### 1. Melalui Dashboard Web

Dashboard metrik API tersedia di rute `/metrics` dan hanya dapat diakses oleh pengguna dengan peran admin. Dashboard menampilkan:

- Statistik keseluruhan (total permintaan, rata-rata waktu respons, tingkat keberhasilan)
- Data deret waktu untuk grafik
- Metrik spesifik layanan
- Performa endpoint
- Distribusi kode status
- Metrik mentah untuk tampilan detail (terbatas pada 100 terbaru)

### 2. Melalui API

Endpoint API untuk mengakses data metrik tersedia di `/api/metrics`. Endpoint ini dilindungi oleh autentikasi JWT dan hanya dapat diakses oleh pengguna dengan peran admin.

**Contoh Permintaan:**

```javascript
async function fetchMetrics() {
  const response = await fetch('/api/metrics', {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  
  return await response.json();
}
```

**Format Respons:**

```json
{
  "message": "Berhasil mendapatkan data metrik API",
  "metrics": {
    "totalRequests": 1250,
    "avgResponseTime": 42.5,
    "successRate": 98.2,
    "timeSeriesData": [...],
    "serviceMetrics": [...],
    "endpointMetrics": [...],
    "statusCodeDistribution": [...],
    "recentMetrics": [...]
  }
}
```

## Fitur Utama

### 1. Pengumpulan Metrik Otomatis

Sistem secara otomatis mengumpulkan metrik untuk semua permintaan API melalui middleware. Metrik yang dikumpulkan meliputi:

- Path permintaan
- Metode HTTP
- Kode status respons
- Waktu respons (ms)
- Layanan yang dituju
- ID pengguna (jika terautentikasi)
- Alamat IP
- User agent

### 2. Pembersihan Data Otomatis

Sistem secara otomatis membersihkan metrik lama (default: lebih dari 30 hari) untuk menjaga ukuran database tetap terkendali. Pembersihan ini terjadi setiap kali endpoint `/api/metrics` diakses.

### 3. Ketahanan dan Fallback

Jika database tidak tersedia, sistem akan secara otomatis beralih ke penyimpanan in-memory sebagai fallback untuk memastikan pengumpulan metrik tetap berlanjut. Data ini akan disimpan ke database saat koneksi tersedia kembali.

## Pemecahan Masalah

### Masalah Koneksi Database

Jika Anda mengalami masalah koneksi database:

1. Verifikasi variabel lingkungan `DB_HOST`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` dikonfigurasi dengan benar
2. Pastikan server MySQL berjalan dan dapat diakses
3. Periksa log server untuk pesan error spesifik

### Metrik Tidak Muncul di Dashboard

Jika metrik tidak muncul di dashboard:

1. Pastikan Anda login sebagai pengguna dengan peran admin
2. Verifikasi tabel `api_metrics` ada di database dan memiliki data
3. Periksa log server untuk error saat mengambil metrik

## Dokumentasi Tambahan

Untuk informasi lebih detail tentang implementasi sistem metrik API, lihat:

- [Dokumentasi Migrasi Sistem Metrik API ke MySQL](docs/microservices/api-metrics-mysql.md)
- [Dokumentasi API Gateway dan Metrik](docs/microservices/api-gateway-metrics.md)
