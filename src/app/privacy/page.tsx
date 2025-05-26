import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Kebijakan Privasi',
  'Kebijakan Privasi Proker Tracker - Aplikasi Manajemen Program Kerja untuk Organisasi Mahasiswa',
  ['kebijakan privasi', 'privasi', 'data pengguna', 'keamanan data'],
  '/privacy'
);

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
            Kebijakan Privasi
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
              Proker Tracker ("kami", "kita", atau "aplikasi kami") berkomitmen untuk melindungi privasi Anda. 
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi 
              yang Anda berikan saat menggunakan aplikasi kami.
            </p>
            <p>
              Dengan menggunakan Proker Tracker, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. 
              Kami dapat mengubah Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan efektif segera setelah 
              kami memposting Kebijakan Privasi yang diperbarui.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Informasi yang Kami Kumpulkan</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>Kami mengumpulkan beberapa jenis informasi dari pengguna kami, termasuk:</p>
            <ul>
              <li>
                <strong>Informasi Identitas Pribadi</strong>: Nama, alamat email, dan informasi kontak lainnya yang 
                Anda berikan saat mendaftar atau menggunakan aplikasi kami.
              </li>
              <li>
                <strong>Informasi Organisasi</strong>: Nama organisasi, deskripsi, dan informasi lain terkait 
                organisasi yang Anda kelola.
              </li>
              <li>
                <strong>Data Penggunaan</strong>: Informasi tentang bagaimana Anda menggunakan aplikasi kami, 
                termasuk program kerja, tugas, dan aktivitas lain yang Anda lakukan di dalam aplikasi.
              </li>
              <li>
                <strong>Informasi Perangkat</strong>: Data tentang perangkat yang Anda gunakan untuk mengakses 
                aplikasi kami, seperti jenis perangkat, sistem operasi, dan pengaturan browser.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Bagaimana Kami Menggunakan Informasi Anda</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
            <ul>
              <li>Menyediakan, memelihara, dan meningkatkan aplikasi kami</li>
              <li>Memproses dan menyelesaikan transaksi</li>
              <li>Mengirim informasi teknis, pembaruan, peringatan keamanan, dan pesan dukungan</li>
              <li>Menanggapi komentar, pertanyaan, dan permintaan Anda</li>
              <li>Memantau dan menganalisis tren, penggunaan, dan aktivitas</li>
              <li>Mencegah aktivitas penipuan dan melindungi hak, properti, dan keselamatan pengguna kami</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Keamanan Data</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Kami menerapkan langkah-langkah keamanan untuk melindungi informasi pribadi Anda dari akses yang tidak 
              sah dan pengungkapan. Langkah-langkah ini meliputi:
            </p>
            <ul>
              <li>Enkripsi data sensitif menggunakan teknologi SSL</li>
              <li>Penyimpanan kata sandi yang aman dengan teknik hashing</li>
              <li>Pembatasan akses ke informasi pribadi</li>
              <li>Pemantauan sistem untuk mendeteksi kerentanan dan potensi pelanggaran</li>
            </ul>
            <p>
              Meskipun kami berusaha untuk melindungi informasi Anda, tidak ada metode transmisi melalui internet atau 
              metode penyimpanan elektronik yang 100% aman. Oleh karena itu, kami tidak dapat menjamin keamanan mutlak.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Berbagi Informasi</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>Kami tidak menjual, memperdagangkan, atau menyewakan informasi identitas pribadi pengguna kepada pihak lain. Kami dapat membagikan informasi dalam keadaan berikut:</p>
            <ul>
              <li>Dengan persetujuan Anda</li>
              <li>Untuk mematuhi hukum atau peraturan yang berlaku</li>
              <li>Untuk melindungi hak, properti, atau keselamatan kami, pengguna kami, atau orang lain</li>
              <li>Dengan penyedia layanan yang membantu kami mengoperasikan aplikasi kami</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Hak Anda</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>Anda memiliki hak tertentu terkait dengan informasi pribadi Anda, termasuk:</p>
            <ul>
              <li>Hak untuk mengakses informasi pribadi Anda</li>
              <li>Hak untuk memperbaiki informasi yang tidak akurat</li>
              <li>Hak untuk menghapus informasi Anda (dengan batasan tertentu)</li>
              <li>Hak untuk membatasi pemrosesan informasi Anda</li>
              <li>Hak untuk menolak pemrosesan informasi Anda</li>
              <li>Hak untuk meminta portabilitas data</li>
            </ul>
            <p>
              Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak yang disediakan di bawah.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Kontak</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi kami di:
            </p>
            <p>
              <strong>Proker Tracker</strong><br />
              Email: privacy@prokertracker.id<br />
              Alamat: Fakultas Vokasi, Universitas Negeri Surabaya<br />
              Jl. Ketintang, Surabaya, Jawa Timur 60231
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
