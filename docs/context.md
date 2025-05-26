# Proker Tracker: Konteks Proyek

## Gambaran Umum Proyek

"Proker Tracker" adalah aplikasi web yang dirancang khusus untuk organisasi mahasiswa di universitas dan perguruan tinggi. Berbeda dengan aplikasi produktivitas umum, Proker Tracker menargetkan struktur operasional dan dinamika unik organisasi mahasiswa seperti Badan Eksekutif Mahasiswa (BEM), Himpunan Mahasiswa, Unit Kegiatan Mahasiswa (UKM), dan organisasi kampus lainnya. Aplikasi ini bertujuan untuk menyelesaikan masalah manajemen waktu dan koordinasi program kerja yang umum terjadi di organisasi-organisasi ini.

## Pernyataan Masalah

Organisasi mahasiswa menghadapi beberapa tantangan khas yang tidak ditangani secara memadai oleh alat manajemen proyek umum:

1. **Manajemen Alur Kerja Berbasis Peran**: Organisasi mahasiswa memiliki struktur hierarkis spesifik dengan peran yang jelas (seperti anggota pengurus inti, kepala departemen, dan anggota umum) yang memerlukan akses dan tanggung jawab yang disesuaikan.

2. **Integrasi Kalender Akademik**: Organisasi mahasiswa harus menyelaraskan kegiatan mereka dengan kalender akademik, termasuk periode ujian, liburan, dan jeda semester.

3. **Manajemen Pergantian Kepengurusan**: Tidak seperti organisasi profesional, organisasi mahasiswa mengalami pergantian kepemimpinan secara lengkap setiap tahun atau dua tahun, menciptakan tantangan dalam transfer pengetahuan dan kontinuitas program.

4. **Menyeimbangkan Tanggung Jawab Akademik dan Organisasi**: Mahasiswa harus memprioritaskan komitmen akademis mereka sambil mengelola tugas organisasi, menciptakan tantangan manajemen waktu yang unik.

5. **Penyelarasan Siklus Anggaran**: Organisasi mahasiswa biasanya beroperasi pada siklus anggaran tahunan yang terkait dengan tahun akademik, memerlukan perencanaan keuangan khusus.

6. **Koordinasi Multi-Departemen**: Banyak organisasi mahasiswa memiliki beberapa departemen yang menyelenggarakan acara paralel atau saling terkait yang membutuhkan koordinasi.

7. **Dokumentasi dan Pembangunan Warisan**: Organisasi berjuang untuk mempertahankan catatan dan meneruskan pengetahuan institusional kepada generasi kepemimpinan berikutnya.

## Pengguna Target

1. **Anggota Badan Pengurus Harian (BPH)**:
   - Ketua/Presiden
   - Wakil Ketua/Wakil Presiden
   - Sekretaris
   - Bendahara
   - Posisi kepemimpinan inti lainnya

2. **Kepala Departemen**:
   - Pemimpin departemen organisasi tertentu (misalnya, urusan akademik, hubungan masyarakat, sumber daya manusia)
   - Ketua panitia untuk program atau acara tertentu

3. **Fungsionaris**:
   - Anggota reguler dengan tugas khusus yang ditugaskan
   - Anggota departemen
   - Anggota panitia
   - Anggota aktif umum

4. **Penasihat Organisasi**:
   - Anggota fakultas yang mengawasi organisasi
   - Staf universitas penghubung

## Fitur Inti yang Dibutuhkan

1. **Dasbor dan Kontrol Akses Berbasis Peran**:
   - Tampilan dan izin yang disesuaikan berdasarkan peran organisasi
   - Alur kerja penugasan dan persetujuan tugas hierarkis

2. **Manajemen Timeline Visual**:
   - Bagan Gantt interaktif untuk perencanaan program
   - Representasi visual dari program yang tumpang tindih dan potensi konflik
   - Pelacakan tonggak pencapaian dengan indikator yang jelas

3. **Integrasi Kalender Akademik**:
   - Overlay acara kalender akademik dengan timeline organisasi
   - Deteksi konflik otomatis dengan periode ujian, liburan, dll.
   - Rekomendasi penjadwalan berdasarkan waktu optimal

4. **Sistem Manajemen Tugas**:
   - Penugasan tugas, pelacakan, dan notifikasi
   - Pelaporan dan visualisasi kemajuan
   - Manajemen tenggat waktu dengan pengingat cerdas

5. **Alat Kontinuitas**:
   - Template dan dokumentasi program
   - Akses dan pelaporan data historis
   - Fitur manajemen transisi untuk perubahan kepemimpinan

6. **Pusat Komunikasi**:
   - Pesan terintegrasi berdasarkan peran, departemen, dan program
   - Sistem pengumuman dengan tingkat prioritas
   - Manajemen rapat dengan notulen dan item tindakan

7. **Evaluasi Program**:
   - Formulir evaluasi dan metrik bawaan
   - Alat dokumentasi post-mortem
   - Pengukuran keberhasilan terhadap tujuan program

## Implementasi Web dengan Next.js dan Shadcn UI

Proyek ini akan diimplementasikan sebagai aplikasi web menggunakan teknologi modern:

1. **Next.js**: Framework React yang menyediakan rendering sisi server, routing, dan optimasi kinerja.

2. **Shadcn UI**: Library komponen UI yang dapat disesuaikan untuk membangun antarmuka yang konsisten dan profesional.

3. **MySQL**: Database relasional untuk menyimpan data pengguna, program, tugas, dan informasi organisasi.

4. **Tailwind CSS**: Untuk styling yang fleksibel dan responsif.

5. **Netlify**: Platform untuk deployment aplikasi web dengan kemudahan integrasi dan CI/CD.

Implementasi web akan mempertahankan semua fitur inti yang direncanakan untuk aplikasi mobile, dengan penyesuaian untuk pengalaman desktop dan responsivitas untuk perangkat mobile.