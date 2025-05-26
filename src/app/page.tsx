import Image from 'next/image'

import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center space-y-12">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-heading text-primary">
                Kelola Program Kerja Organisasi Anda dengan Mudah
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Proker Tracker membantu organisasi mahasiswa mengelola program kerja, tugas, dan evaluasi dengan efektif.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    Mulai Sekarang
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading text-primary">
                Fitur Utama
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Dirancang khusus untuk kebutuhan organisasi mahasiswa
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Manajemen Program Kerja</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Buat, kelola, dan evaluasi program kerja dengan timeline visual dan milestone yang jelas.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Manajemen Tugas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Bagi tugas dengan anggota tim, tetapkan tenggat waktu, dan pantau kemajuan secara real-time.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Struktur Organisasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Kelola struktur organisasi dengan departemen dan peran yang jelas untuk setiap anggota.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Evaluasi Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Evaluasi keberhasilan program kerja dengan metrik dan KPI yang terukur.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Integrasi Kalender</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Selaraskan program kerja dengan kalender akademik untuk menghindari konflik jadwal.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Dokumentasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Simpan dokumentasi program kerja untuk referensi dan transfer pengetahuan ke kepengurusan berikutnya.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Untuk Pengembang
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Integrasikan aplikasi Anda dengan Proker Tracker melalui API kami
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border border-primary/20 bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">API Documentation</CardTitle>
                  <CardDescription>Dokumentasi lengkap untuk semua endpoint API</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Akses dokumentasi lengkap API Proker Tracker untuk mengintegrasikan aplikasi Anda dengan platform kami. Dokumentasi ini mencakup semua endpoint, parameter, dan contoh respons.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/api-docs" target="_blank">
                    <Button variant="default" className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                      Lihat Dokumentasi API
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="border border-primary/20 bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Open Source</CardTitle>
                  <CardDescription>Kontribusi pada pengembangan Proker Tracker</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Proker Tracker adalah proyek open source yang dikembangkan oleh mahasiswa untuk mahasiswa. Kami menyambut kontribusi dari komunitas pengembang untuk meningkatkan platform ini.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="https://github.com/gerrymoeis/proker_tracker_web/tree/master" target="_blank">
                    <Button variant="outline" className="w-full">
                      GitHub Repository
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading text-primary">
                Siap Meningkatkan Kinerja Organisasi Anda?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Bergabunglah dengan ratusan organisasi mahasiswa yang telah menggunakan Proker Tracker untuk mengelola program kerja mereka.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    Daftar Sekarang
                  </Button>
                </Link>
                <Link href="/api-docs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    API Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
