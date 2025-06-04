# BAB VI
# PENUTUP

## 6.1 Kesimpulan

Berdasarkan implementasi dan pengujian otomatis yang telah dilakukan pada aplikasi Proker Tracker, dapat ditarik beberapa kesimpulan penting terkait dengan pengembangan, arsitektur, dan kualitas aplikasi. Proker Tracker telah berhasil dikembangkan sebagai solusi manajemen program kerja untuk organisasi mahasiswa dengan pendekatan microservices yang modern dan efektif.

Berikut adalah kesimpulan utama dari pengembangan dan pengujian Proker Tracker:

1. **Arsitektur Microservices Berhasil Diimplementasikan**
   
   Proker Tracker telah berhasil menerapkan arsitektur microservices dengan pemisahan layanan berdasarkan domain bisnis (Auth Service, User Service, Organization Service, Program Service, dan Task Service). Pendekatan ini terbukti meningkatkan modularitas, pemeliharaan, dan skalabilitas aplikasi. API Gateway yang diimplementasikan berhasil menangani routing request ke service yang sesuai dan mengumpulkan metrik untuk monitoring.

2. **Pengujian Otomatis Komprehensif**
   
   Implementasi pengujian otomatis dengan Playwright telah mencakup seluruh fitur utama aplikasi dengan tingkat keberhasilan 100% (10 dari 10 test case berhasil). Pendekatan Page Object Model (POM) dan visual testing terbukti efektif untuk memverifikasi fungsionalitas dan tampilan UI aplikasi. Sistem pelaporan hasil pengujian yang komprehensif memudahkan identifikasi dan analisis masalah.

3. **Performa Aplikasi yang Baik**
   
   Meskipun terdapat beberapa komponen yang membutuhkan waktu loading lebih lama (seperti dashboard dan edit profil), secara keseluruhan performa aplikasi masih dalam batas yang dapat diterima. Implementasi sistem metrik API melalui middleware dan penyimpanan di database MySQL memberikan visibilitas yang baik terhadap performa sistem.

4. **Solusi Inovatif untuk Keterbatasan Platform**
   
   Proker Tracker berhasil mengatasi masalah kompatibilitas Edge Runtime dengan MySQL melalui implementasi arsitektur dua tingkat (penyimpanan sementara di memory dan sinkronisasi berkala ke database). Solusi ini memastikan metrik tetap dicatat meskipun di Edge Runtime dan akhirnya disimpan ke database untuk persistensi jangka panjang.

5. **Teknologi Modern dan Best Practices**
   
   Penggunaan teknologi modern seperti Next.js 14 (App Router), React 18, TypeScript, dan Tailwind CSS, serta penerapan best practices seperti Domain-Driven Design (DDD) dan arsitektur microservices, telah menghasilkan aplikasi yang berkualitas tinggi, mudah dipelihara, dan dapat dikembangkan lebih lanjut.

Secara keseluruhan, Proker Tracker telah berhasil mencapai tujuannya sebagai aplikasi manajemen program kerja yang efektif dan efisien untuk organisasi mahasiswa, dengan arsitektur yang modern, performa yang baik, dan kualitas yang terjamin melalui pengujian otomatis yang komprehensif.

## 6.2 Saran

Berdasarkan hasil pengembangan dan pengujian Proker Tracker, berikut adalah beberapa saran untuk pengembangan lebih lanjut dan peningkatan kualitas aplikasi:

1. **Optimasi Performa Komponen UI**
   
   Beberapa komponen UI, terutama pada halaman dashboard, membutuhkan waktu loading yang cukup lama (18.47 detik). Disarankan untuk mengoptimasi rendering komponen dengan teknik seperti lazy loading, code splitting, dan optimasi gambar untuk meningkatkan performa loading halaman.

2. **Peningkatan Pengujian Otomatis**
   
   Meskipun pengujian otomatis saat ini sudah komprehensif, masih ada beberapa area yang dapat ditingkatkan:
   - Menambahkan pengujian performa untuk mengukur waktu loading dan responsivitas UI secara lebih terstruktur
   - Mengimplementasikan pengujian paralel untuk mengurangi waktu eksekusi keseluruhan
   - Menambahkan pengujian API dan integrasi antar microservices secara lebih mendalam

3. **Perbaikan Navigasi Sidebar**
   
   Hasil pengujian menunjukkan adanya masalah pada navigasi sidebar yang tidak terlihat pada beberapa kondisi. Disarankan untuk memperbaiki implementasi sidebar agar konsisten dan terlihat pada semua ukuran layar dan kondisi penggunaan.

4. **Peningkatan Sistem Metrik dan Monitoring**
   
   Sistem metrik API yang ada dapat ditingkatkan dengan:
   - Menambahkan dashboard monitoring yang lebih komprehensif dengan alerting
   - Mengimplementasikan distributed tracing untuk melacak request yang melintasi multiple microservices
   - Mengintegrasikan dengan tools monitoring eksternal seperti Prometheus dan Grafana

5. **Penanganan Edge Cases dan Error**
   
   Meskipun pengujian menunjukkan penanganan error yang baik, disarankan untuk meningkatkan penanganan edge cases dan error dengan:
   - Implementasi circuit breaker pattern untuk meningkatkan ketahanan sistem
   - Penanganan timeout yang lebih baik untuk operasi yang membutuhkan waktu lama
   - Implementasi retry mechanism untuk operasi yang rentan terhadap kegagalan sementara

6. **Dokumentasi Teknis yang Lebih Lengkap**
   
   Untuk memudahkan onboarding developer baru dan pemeliharaan jangka panjang, disarankan untuk meningkatkan dokumentasi teknis dengan:
   - Dokumentasi arsitektur yang lebih detail dengan diagram dan penjelasan
   - Panduan kontribusi untuk developer baru
   - Dokumentasi API yang lebih komprehensif dengan contoh penggunaan

7. **Implementasi Continuous Integration/Continuous Deployment (CI/CD)**
   
   Untuk meningkatkan efisiensi pengembangan dan deployment, disarankan untuk mengimplementasikan pipeline CI/CD yang terintegrasi dengan pengujian otomatis, sehingga setiap perubahan kode dapat diuji dan di-deploy secara otomatis jika memenuhi kriteria kualitas.

Dengan mengimplementasikan saran-saran di atas, Proker Tracker dapat terus berkembang menjadi aplikasi yang lebih handal, performa yang lebih baik, dan kualitas yang lebih tinggi. Pendekatan arsitektur microservices yang telah diimplementasikan memberikan fondasi yang baik untuk pengembangan fitur-fitur baru dan peningkatan skala aplikasi di masa depan.
