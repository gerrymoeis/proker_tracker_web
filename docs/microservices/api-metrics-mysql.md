# Migrasi Sistem Metrik API ke MySQL

## Ringkasan

Dokumen ini menjelaskan migrasi sistem metrik API dari penyimpanan in-memory ke database MySQL persisten untuk Proker Tracker Web. Migrasi ini meningkatkan ketahanan data, memungkinkan analisis historis, dan menyediakan penyimpanan metrik yang lebih andal tanpa kehilangan data saat server di-restart.

## Struktur Database

### Tabel `api_metrics`

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

## Komponen Utama yang Diperbarui

### 1. Modul Koneksi Database (`src/lib/db.ts`)

Modul baru yang menangani koneksi ke database MySQL menggunakan connection pool untuk efisiensi dan skalabilitas.

```typescript
import mysql from 'mysql2/promise';

// Buat connection pool untuk efisiensi dan skalabilitas
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proker_tracker_web',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function untuk mengeksekusi query dengan parameter
export async function executeQuery<T>(query: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export default pool;
```

### 2. Modul Penyimpanan Metrik (`src/lib/metrics-storage.ts`)

Diperbarui untuk menggunakan database MySQL sebagai penyimpanan utama dengan fallback ke penyimpanan in-memory jika database tidak tersedia.

```typescript
// Fungsi untuk mengambil metrik dari database
export async function getMetrics(limit?: number): Promise<ApiMetric[]> {
  try {
    const limitClause = limit ? ' LIMIT ?' : '';
    const query = `SELECT * FROM api_metrics ORDER BY timestamp DESC${limitClause}`;
    const params = limit ? [limit] : [];
    
    const metrics = await executeQuery<ApiMetric[]>(query, params);
    return metrics;
  } catch (error) {
    console.error('Error getting metrics from database:', error);
    // Fallback ke penyimpanan in-memory jika database tidak tersedia
    return getGlobalApiMetrics();
  }
}

// Fungsi untuk menambahkan metrik ke database
export async function addMetric(metric: ApiMetric): Promise<void> {
  try {
    const query = `
      INSERT INTO api_metrics 
      (path, method, status_code, response_time, timestamp, service, user_id, ip_address, user_agent) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await executeQuery(query, [
      metric.path,
      metric.method,
      metric.statusCode,
      metric.responseTime,
      metric.timestamp,
      metric.service,
      metric.userId || null,
      metric.ipAddress || null,
      metric.userAgent || null
    ]);
  } catch (error) {
    console.error('Error adding metric to database:', error);
    // Fallback ke penyimpanan in-memory jika database tidak tersedia
    addGlobalApiMetric(metric);
  }
}

// Fungsi untuk membersihkan metrik lama
export async function pruneOldMetrics(daysToKeep: number = 30): Promise<void> {
  try {
    const query = 'DELETE FROM api_metrics WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)';
    await executeQuery(query, [daysToKeep]);
    console.log(`Pruned metrics older than ${daysToKeep} days`);
  } catch (error) {
    console.error('Error pruning old metrics:', error);
  }
}
```

### 3. Middleware (`src/middleware.ts`)

Diperbarui untuk menggunakan fungsi `addMetric` yang sekarang asinkron.

### 4. Endpoint API Metrik (`src/app/api/metrics/route.ts`)

Diperbarui untuk menggunakan fungsi `getMetrics` dan `pruneOldMetrics` yang sekarang asinkron.

## Variabel Lingkungan

Tambahkan variabel lingkungan berikut ke file `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=proker_tracker_web
```

## Keuntungan Migrasi

1. **Persistensi Data**: Metrik tetap tersimpan bahkan setelah server di-restart
2. **Analisis Historis**: Memungkinkan analisis tren jangka panjang
3. **Skalabilitas**: Dapat menangani volume metrik yang lebih besar
4. **Ketahanan**: Mekanisme fallback ke penyimpanan in-memory jika database tidak tersedia
5. **Pembersihan Otomatis**: Fungsi pruning untuk menghapus data lama secara otomatis

## Pertimbangan Performa

- Operasi database berjalan secara asinkron untuk mencegah pemblokiran thread utama
- Indeks dibuat pada kolom yang sering digunakan dalam query untuk meningkatkan performa
- Connection pool digunakan untuk mengelola koneksi database secara efisien

## Pengujian

Untuk memastikan migrasi berfungsi dengan baik:

1. Verifikasi metrik baru dicatat ke database saat API diakses
2. Konfirmasi data metrik tetap ada setelah server di-restart
3. Periksa dashboard metrik menampilkan data dengan benar
4. Uji fungsi pruning untuk memastikan data lama dihapus sesuai jadwal

## Pemeliharaan

- Pertimbangkan untuk membuat jadwal backup database secara berkala
- Pantau ukuran tabel `api_metrics` dan sesuaikan parameter pruning jika diperlukan
- Pertimbangkan strategi archiving untuk data historis jangka panjang
