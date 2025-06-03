# API Gateway dan Metrics Implementation

Dokumen ini menjelaskan implementasi API Gateway dan sistem Metrics untuk Proker Tracker sebagai bagian dari arsitektur microservices.

## Daftar Isi

1. [Pengenalan](#pengenalan)
2. [API Gateway](#api-gateway)
   - [Tujuan dan Manfaat](#tujuan-dan-manfaat)
   - [Implementasi](#implementasi)
   - [Cara Kerja](#cara-kerja)
3. [Metrics System](#metrics-system)
   - [Pengumpulan Data](#pengumpulan-data)
   - [Visualisasi](#visualisasi)
   - [Penggunaan](#penggunaan)
4. [Integrasi dengan Microservices](#integrasi-dengan-microservices)
5. [Pengembangan Lebih Lanjut](#pengembangan-lebih-lanjut)

## Pengenalan

Sebagai bagian dari evolusi Proker Tracker menuju arsitektur microservices, implementasi API Gateway dan sistem Metrics adalah langkah penting untuk memastikan keandalan, skalabilitas, dan pemantauan yang efektif. Dokumen ini menjelaskan bagaimana kedua komponen ini diimplementasikan dan bagaimana mereka berintegrasi dengan arsitektur yang ada.

## API Gateway

### Tujuan dan Manfaat

API Gateway berfungsi sebagai titik masuk tunggal untuk semua layanan microservices di Proker Tracker. Manfaat utamanya meliputi:

- **Single Entry Point**: Menyediakan satu titik akses untuk semua layanan API
- **Authentication & Authorization**: Menangani autentikasi dan otorisasi secara terpusat
- **Logging & Monitoring**: Mencatat dan memantau semua permintaan API
- **Rate Limiting**: Membatasi jumlah permintaan untuk mencegah penyalahgunaan (akan diimplementasikan di masa depan)
- **Load Balancing**: Mendistribusikan beban di antara instance layanan (akan diimplementasikan di masa depan)

### Implementasi

API Gateway diimplementasikan menggunakan Next.js middleware dan API routes. File utama yang terlibat adalah:

- `src/middleware.ts`: Menangani permintaan API dan mengumpulkan metrik
- `src/lib/api-gateway.ts`: Berisi fungsi dan utilitas untuk API Gateway

### Cara Kerja

API Gateway bekerja dengan alur sebagai berikut:

1. Semua permintaan API masuk melalui middleware Next.js
2. Middleware memeriksa apakah permintaan adalah untuk API (dimulai dengan `/api/`)
3. Untuk permintaan API, middleware:
   - Memeriksa autentikasi (kecuali untuk endpoint publik seperti login)
   - Mencatat metrik seperti waktu respons dan status kode
   - Menambahkan header untuk pelacakan
4. Permintaan kemudian diteruskan ke handler API yang sesuai
5. Respons dikembalikan ke klien

Contoh kode middleware untuk menangani permintaan API:

```typescript
// Dari middleware.ts
if (pathname.startsWith('/api/')) {
  // Skip certain API routes from middleware processing
  if (
    pathname.includes('/api/swagger') ||
    pathname.includes('/api/auth/login') ||
    pathname.includes('/api/auth/register') ||
    pathname.includes('/api/auth/forgot-password') ||
    pathname.includes('/api/metrics')
  ) {
    return NextResponse.next();
  }
  
  // Start timing for API metrics
  const startTime = performance.now();
  
  // For API routes, we'll let the API handlers handle auth
  // but we'll track metrics here
  const response = NextResponse.next();
  
  // Add a response header for tracking
  response.headers.set('X-API-Gateway', 'proker-tracker-gateway');
  
  // Calculate response time
  const endTime = performance.now();
  const responseTime = endTime - startTime;
  
  // Store metrics
  apiMetrics.push({
    path: pathname,
    method: request.method,
    timestamp: new Date(),
    responseTime,
    statusCode: 200 // We don't know the actual status code at this point
  });
  
  return response;
}
```

## Metrics System

### Pengumpulan Data

Sistem metrik mengumpulkan data berikut untuk setiap permintaan API:

- **Path**: Jalur API yang dipanggil
- **Method**: Metode HTTP (GET, POST, PUT, DELETE, dll.)
- **Timestamp**: Waktu permintaan
- **Response Time**: Waktu yang dibutuhkan untuk memproses permintaan (dalam milidetik)
- **Status Code**: Kode status HTTP respons
- **Service**: Layanan microservice yang menangani permintaan

Data metrik disimpan dalam memori untuk implementasi saat ini. Dalam lingkungan produksi, data ini akan disimpan dalam database untuk analisis jangka panjang.

### Visualisasi

Data metrik divisualisasikan melalui dashboard yang dapat diakses di `/metrics`. Dashboard ini menampilkan:

- **Overview**: Statistik keseluruhan seperti total permintaan dan waktu respons rata-rata
- **Endpoint Performance**: Metrik terperinci untuk setiap endpoint API
- **Recent Requests**: Daftar permintaan terbaru dengan detail

Dashboard menggunakan Chart.js untuk visualisasi grafik dan diperbarui secara otomatis setiap 30 detik.

### Penggunaan

Untuk mengakses dashboard metrik:

1. Login sebagai administrator
2. Navigasi ke `/metrics` di browser
3. Dashboard akan menampilkan data metrik dalam berbagai format

Perhatikan bahwa hanya pengguna dengan peran admin yang dapat mengakses dashboard metrik untuk alasan keamanan.

## Integrasi dengan Microservices

API Gateway dan sistem Metrics terintegrasi dengan arsitektur microservices yang ada dengan cara berikut:

1. **Service Mapping**: API Gateway memetakan jalur API ke layanan microservice yang sesuai
2. **Authentication**: API Gateway menangani autentikasi secara terpusat untuk semua layanan
3. **Metrics Collection**: Metrik dikumpulkan untuk semua layanan microservice
4. **Visualization**: Dashboard metrik menampilkan kinerja semua layanan

Pemetaan layanan saat ini adalah sebagai berikut:

```typescript
const serviceMap: Record<string, string> = {
  '/api/auth': 'auth-service',
  '/api/organizations': 'organization-service',
  '/api/members': 'member-service',
  '/api/programs': 'program-service',
  '/api/tasks': 'task-service',
  '/api/comments': 'comment-service',
  '/api/departments': 'department-service',
  '/api/users': 'user-service',
  '/api/stats': 'stats-service',
};
```

## Pengembangan Lebih Lanjut

Beberapa area untuk pengembangan lebih lanjut meliputi:

1. **Persistent Storage**: Menyimpan data metrik dalam database untuk analisis jangka panjang
2. **Rate Limiting**: Menerapkan pembatasan laju untuk mencegah penyalahgunaan API
3. **Circuit Breaking**: Menerapkan circuit breaker untuk meningkatkan ketahanan
4. **Service Discovery**: Menambahkan penemuan layanan dinamis
5. **Caching**: Menerapkan caching untuk meningkatkan kinerja
6. **Advanced Analytics**: Menambahkan analitik lanjutan untuk data metrik
7. **Alerting**: Menerapkan sistem peringatan untuk masalah kinerja

Implementasi ini menyediakan fondasi yang kuat untuk evolusi Proker Tracker menuju arsitektur microservices yang lengkap sambil mempertahankan fungsionalitas yang ada.
