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
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
