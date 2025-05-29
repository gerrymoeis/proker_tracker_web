import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Tentang Kami',
  'Informasi tentang tim pengembang Proker Tracker - Kelompok 7 Mata Kuliah SIM',
  ['tentang kami', 'kelompok 7', 'SIM', 'Sistem Informasi Manajemen', 'D4 Manajemen Informatika'],
  '/about'
);

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Gerry Moeis Mahardika Dwi Putra',
      nim: '23091397164',
      role: 'Ketua Kelompok',
      avatar: '/team/gerry.jpg',
    },
    {
      name: 'Ahmad Aryobimo',
      nim: '23091397151',
      role: 'Anggota',
      avatar: '/team/aryobimo.jpg',
    },
    {
      name: 'Zaidan Dhiya Ulhaq',
      nim: '23091397152',
      role: 'Anggota',
      avatar: '/team/zaidan.jpg',
    },
    {
      name: 'Umar Faruq',
      nim: '23091397157',
      role: 'Anggota',
      avatar: '/team/umar.jpg',
    },
    {
      name: 'Adip Setiaputra',
      nim: '23091397158',
      role: 'Anggota',
      avatar: '/team/adip.jpg',
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
            Tentang Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Proker Tracker dikembangkan oleh Kelompok 7 dalam rangka tugas Mata Kuliah Sistem Informasi Manajemen
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-16">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Identitas Kelompok</CardTitle>
              <CardDescription>Mata Kuliah Sistem Informasi Manajemen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-primary">Informasi Kelompok</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center">
                      <span className="font-semibold mr-2">Kelompok:</span> 7
                    </li>
                    <li className="flex items-center">
                      <span className="font-semibold mr-2">Kelas:</span> 2023E
                    </li>
                    <li className="flex items-center">
                      <span className="font-semibold mr-2">Program Studi:</span> D4 Manajemen Informatika
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-primary">Dosen Pengampu</h3>
                  <div className="mt-2 flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">SRN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Salamun Rohman Nudin, S.Kom., M.Kom.</p>
                      <p className="text-sm text-muted-foreground">Dosen Mata Kuliah SIM</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">Anggota Kelompok</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="border border-border/40 bg-card/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription>{member.nim}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Tentang Proker Tracker</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            Proker Tracker adalah aplikasi manajemen program kerja yang dikembangkan untuk membantu organisasi mahasiswa
            dalam merencanakan, melaksanakan, dan mengevaluasi program kerja mereka dengan lebih efektif dan efisien.
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Aplikasi ini dibuat sebagai bagian dari tugas Mata Kuliah Sistem Informasi Manajemen
            di Program Studi D4 Manajemen Informatika, Fakultas Vokasi, Universitas Negeri Surabaya.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
