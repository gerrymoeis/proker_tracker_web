# Kompatibilitas Edge Runtime untuk Sistem Metrik API

## Masalah yang Dihadapi

Saat mengimplementasikan penyimpanan metrik API ke database MySQL, kami menghadapi masalah berikut:

```
Database error: [Error: The edge runtime does not support Node.js 'net' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime]
```

Masalah ini terjadi karena middleware Next.js berjalan di Edge Runtime, yang tidak mendukung modul Node.js `net` yang digunakan oleh driver MySQL (`mysql2`).

## Solusi yang Diimplementasikan

Untuk mengatasi masalah ini, kami mengimplementasikan pendekatan berikut:

### 1. Pemisahan Kode Edge Runtime dan Server Runtime

- **Edge Runtime**: Middleware dan fungsi yang berjalan di Edge Runtime (seperti `middleware.ts`) hanya menyimpan metrik ke memory.
- **Server Runtime**: API Routes yang berjalan di Server Runtime (seperti `/api/metrics/store`) menangani operasi database.

### 2. Arsitektur Penyimpanan Metrik

Kami mengimplementasikan arsitektur dua tingkat:

1. **Penyimpanan Sementara di Memory**:
   - Middleware menyimpan metrik ke memory global menggunakan `globalThis`.
   - Ini memastikan metrik tetap dicatat meskipun di Edge Runtime.

2. **Sinkronisasi ke Database**:
   - API Route `/api/metrics/store` menerima metrik individual dan menyimpannya ke database.
   - API Route `/api/metrics/sync` menjalankan sinkronisasi batch dari memory ke database.
   - Modul `metrics-sync.ts` menjalankan sinkronisasi berkala setiap 5 menit.

### 3. Fallback dan Ketahanan

- Jika penyimpanan ke database gagal, metrik tetap tersimpan di memory.
- Sinkronisasi berkala memastikan metrik akhirnya disimpan ke database saat koneksi tersedia.

## Struktur File yang Diubah

1. **Middleware (`src/middleware.ts`)**:
   - Dimodifikasi untuk menyimpan metrik ke memory dan mencoba mengirim ke API endpoint.
   - Menambahkan informasi tambahan seperti user ID, IP address, dan user agent.

2. **API Routes**:
   - `/api/metrics/store`: Endpoint untuk menyimpan metrik individual ke database.
   - `/api/metrics/sync`: Endpoint untuk sinkronisasi batch metrik dari memory ke database.
   - `/api/metrics`: Endpoint untuk mengambil dan memproses metrik untuk visualisasi.

3. **Modul Pendukung**:
   - `src/lib/metrics-storage.ts`: Dimodifikasi untuk bekerja di Edge Runtime.
   - `src/lib/metrics-sync.ts`: Menangani sinkronisasi berkala.
   - `src/lib/metrics-init.ts`: Inisialisasi sistem metrik saat server dimulai.
   - `src/app/api/metrics/db.ts`: Modul database khusus untuk API metrics.

## Konfigurasi Tambahan

Untuk memastikan sinkronisasi berjalan dengan benar, tambahkan variabel lingkungan berikut ke file `.env`:

```
METRICS_SYNC_TOKEN=your_admin_jwt_token
```

Token ini digunakan untuk autentikasi saat menjalankan sinkronisasi berkala.

## Pengujian

Untuk memastikan sistem metrik berfungsi dengan benar:

1. Jalankan server dengan `npm run dev`.
2. Akses beberapa endpoint API untuk menghasilkan metrik.
3. Verifikasi metrik disimpan di memory dengan melihat log server.
4. Tunggu sinkronisasi berkala atau panggil `/api/metrics/sync` secara manual.
5. Verifikasi metrik disimpan ke database dengan memeriksa tabel `api_metrics`.

## Kesimpulan

Dengan pendekatan ini, sistem metrik API dapat bekerja dengan baik di Edge Runtime Next.js sambil tetap menyimpan data ke database MySQL untuk persistensi jangka panjang. Pendekatan ini juga memberikan ketahanan terhadap masalah koneksi database sementara.
