# Panduan Kontribusi

Terima kasih atas minat Anda untuk berkontribusi pada proyek Proker Tracker! Panduan ini akan membantu Anda memahami proses kontribusi ke proyek ini.

## Kode Etik

Proyek ini dan semua partisipan diatur oleh Kode Etik kami. Dengan berpartisipasi, Anda diharapkan untuk mematuhi kode etik ini. Silakan laporkan perilaku yang tidak dapat diterima.

## Proses Kontribusi

### 1. Fork Repositori

Fork repositori ini ke akun GitHub Anda.

### 2. Clone Repositori

```bash
git clone https://github.com/username/proker-tracker.git
cd proker-tracker
```

### 3. Buat Branch Baru

```bash
git checkout -b fitur-baru
```

Gunakan nama yang deskriptif untuk branch Anda, misalnya:
- `fitur/nama-fitur`
- `perbaikan/nama-bug`
- `dokumentasi/nama-perubahan`

### 4. Lakukan Perubahan

Lakukan perubahan yang diperlukan pada kode.

### 5. Jalankan Tes

Pastikan semua tes berjalan dengan baik:

```bash
npm run test
```

### 6. Commit Perubahan

```bash
git add .
git commit -m "Deskripsi perubahan yang dilakukan"
```

Gunakan pesan commit yang jelas dan deskriptif.

### 7. Push ke Branch

```bash
git push origin fitur-baru
```

### 8. Buat Pull Request

Buka repositori GitHub Anda dan klik tombol "New Pull Request". Jelaskan perubahan yang Anda lakukan dan mengapa perubahan tersebut diperlukan.

## Standar Kode

### Gaya Kode

- Gunakan 2 spasi untuk indentasi
- Gunakan semicolon (;) di akhir statement
- Gunakan single quotes (') untuk string
- Gunakan camelCase untuk penamaan variabel dan fungsi
- Gunakan PascalCase untuk penamaan komponen React

### Linting

Proyek ini menggunakan ESLint untuk menjaga kualitas kode. Pastikan kode Anda lulus pemeriksaan linting:

```bash
npm run lint
```

### Pengujian

Tambahkan tes untuk fitur baru atau perbaikan bug. Pastikan semua tes lulus:

```bash
npm run test
```

## Pull Request

- Pastikan PR Anda memiliki judul yang jelas dan deskriptif
- Jelaskan perubahan yang Anda lakukan dan alasannya
- Jika PR Anda menyelesaikan issue, sertakan "Fixes #123" di deskripsi
- Pastikan semua tes dan linting lulus

## Lisensi

Dengan berkontribusi pada proyek ini, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi yang sama dengan proyek ini.
