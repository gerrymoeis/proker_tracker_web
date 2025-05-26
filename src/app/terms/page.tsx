import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Syarat dan Ketentuan',
  'Syarat dan Ketentuan Penggunaan Proker Tracker - Aplikasi Manajemen Program Kerja untuk Organisasi Mahasiswa',
  ['syarat dan ketentuan', 'ketentuan layanan', 'aturan penggunaan', 'terms of service'],
  '/terms'
);

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
            Syarat dan Ketentuan
          </h1>
          <p className="text-xl text-muted-foreground">
            Terakhir diperbarui: 26 Mei 2025
          </p>
        </div>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Pendahuluan</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Selamat datang di Proker Tracker. Syarat dan Ketentuan ini mengatur penggunaan Anda atas aplikasi 
              Proker Tracker, termasuk semua fitur dan layanan yang tersedia melalui aplikasi kami.
            </p>
            <p>
              Dengan mengakses atau menggunakan aplikasi Proker Tracker, Anda setuju untuk terikat oleh Syarat dan 
              Ketentuan ini. Jika Anda tidak setuju dengan bagian apa pun dari dokumen ini, Anda tidak boleh 
              menggunakan aplikasi kami.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Definisi</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <ul>
              <li>
                <strong>"Aplikasi"</strong> merujuk pada Proker Tracker, platform manajemen program kerja untuk 
                organisasi mahasiswa.
              </li>
              <li>
                <strong>"Pengguna"</strong> merujuk pada individu yang mengakses atau menggunakan Aplikasi.
              </li>
              <li>
                <strong>"Konten"</strong> merujuk pada semua informasi, data, teks, gambar, grafik, atau materi lain 
                yang diunggah, diposting, atau disediakan oleh Pengguna melalui Aplikasi.
              </li>
              <li>
                <strong>"Organisasi"</strong> merujuk pada entitas yang didaftarkan oleh Pengguna di Aplikasi.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Akun Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Untuk menggunakan fitur tertentu dari Aplikasi, Anda perlu membuat akun. Anda bertanggung jawab untuk:
            </p>
            <ul>
              <li>Menjaga kerahasiaan kata sandi akun Anda</li>
              <li>Membatasi akses ke akun Anda</li>
              <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
            </ul>
            <p>
              Anda harus segera memberi tahu kami tentang setiap pelanggaran keamanan atau penggunaan yang tidak sah 
              atas akun Anda. Kami tidak akan bertanggung jawab atas kerugian apa pun yang timbul dari penggunaan 
              yang tidak sah atas akun Anda.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Hak Kekayaan Intelektual</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Aplikasi dan kontennya, termasuk tetapi tidak terbatas pada teks, grafik, logo, ikon, gambar, klip 
              audio, unduhan digital, kompilasi data, dan perangkat lunak, adalah milik Proker Tracker atau pemberi 
              lisensinya dan dilindungi oleh hukum hak cipta Indonesia dan internasional.
            </p>
            <p>
              Kami memberi Anda lisensi terbatas, non-eksklusif, tidak dapat dialihkan, dan dapat dicabut untuk 
              menggunakan Aplikasi untuk tujuan pribadi dan non-komersial sesuai dengan Syarat dan Ketentuan ini.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Konten Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Anda mempertahankan semua hak kekayaan intelektual Anda atas Konten yang Anda unggah ke Aplikasi. 
              Dengan mengunggah Konten, Anda memberi kami lisensi di seluruh dunia, non-eksklusif, bebas royalti, 
              dapat disublisensikan, dan dapat dialihkan untuk menggunakan, mereproduksi, mendistribusikan, membuat 
              karya turunan dari, menampilkan, dan menjalankan Konten tersebut sehubungan dengan operasi Aplikasi.
            </p>
            <p>
              Anda menyatakan dan menjamin bahwa:
            </p>
            <ul>
              <li>Anda memiliki atau telah memperoleh semua hak, lisensi, persetujuan, izin, kekuasaan dan/atau 
                  wewenang yang diperlukan untuk memberikan hak yang diberikan di sini</li>
              <li>Konten Anda tidak melanggar atau menyalahgunakan hak kekayaan intelektual atau hak kepemilikan 
                  pihak ketiga mana pun</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Perilaku yang Dilarang</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Anda setuju untuk tidak:
            </p>
            <ul>
              <li>Menggunakan Aplikasi dengan cara apa pun yang melanggar hukum atau peraturan yang berlaku</li>
              <li>Menggunakan Aplikasi untuk tujuan yang melanggar hukum atau penipuan</li>
              <li>Mengirimkan, atau mengatur pengiriman, materi iklan atau promosi apa pun</li>
              <li>Mengunggah atau membagikan materi yang memfitnah, cabul, atau menyinggung</li>
              <li>Mencoba untuk mendapatkan akses tidak sah ke Aplikasi, server tempat Aplikasi disimpan, atau server, 
                  komputer, atau database apa pun yang terhubung ke Aplikasi</li>
              <li>Menyerang Aplikasi melalui serangan denial-of-service atau serangan distributed denial-of service</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Batasan Tanggung Jawab</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Sejauh diizinkan oleh hukum yang berlaku, Proker Tracker tidak akan bertanggung jawab atas kerugian 
              tidak langsung, insidental, khusus, konsekuensial, atau punitif, atau kerugian apa pun untuk kehilangan 
              keuntungan, pendapatan, data, atau penggunaan data, yang timbul dari atau sehubungan dengan penggunaan 
              Anda atas Aplikasi.
            </p>
            <p>
              Tanggung jawab kami kepada Anda untuk kerugian yang timbul dari atau sehubungan dengan Aplikasi, 
              baik dalam kontrak, kesalahan (termasuk kelalaian), pelanggaran kewajiban hukum, atau lainnya, 
              terbatas pada jumlah yang Anda bayarkan kepada kami untuk penggunaan Aplikasi.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Perubahan pada Syarat dan Ketentuan</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Kami dapat merevisi Syarat dan Ketentuan ini dari waktu ke waktu. Versi terbaru akan selalu tersedia 
              di Aplikasi. Dengan terus menggunakan Aplikasi setelah perubahan tersebut diberlakukan, Anda menyetujui 
              Syarat dan Ketentuan yang direvisi.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Kontak</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di:
            </p>
            <p>
              <strong>Proker Tracker</strong><br />
              Email: terms@prokertracker.id<br />
              Alamat: Fakultas Vokasi, Universitas Negeri Surabaya<br />
              Jl. Ketintang, Surabaya, Jawa Timur 60231
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
