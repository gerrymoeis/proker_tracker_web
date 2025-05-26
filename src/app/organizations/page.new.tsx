'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Organization = {
  id: number;
  name: string;
  description: string;
  university: string;
  faculty: string;
  department: string;
  logo: string | null;
  members: number;
  programs: number;
  created_at: string;
  updated_at: string;
};

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch organizations data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/organizations/list');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data organisasi');
        }
        
        const data = await response.json();
        console.log('Organizations data fetched:', data);
        
        if (data && data.organizations) {
          setOrganizations(data.organizations);
        } else {
          setOrganizations([]);
        }
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError('Terjadi kesalahan saat mengambil data organisasi. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
            Organisasi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Berbagai organisasi mahasiswa yang menggunakan Proker Tracker untuk manajemen program kerja mereka
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">Memuat data organisasi...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada organisasi yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {organizations.map((org, index) => (
              <Card key={index} className="border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="bg-muted rounded-md p-2 flex items-center justify-center w-12 h-12">
                      {org.logo ? (
                        <Image 
                          src={org.logo} 
                          alt={`${org.name} Logo`} 
                          width={40} 
                          height={40} 
                          className="rounded-md" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {org.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{org.name}</CardTitle>
                      <CardDescription>{org.university}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">
                    {org.description}
                  </p>
                  <div className="space-y-2">
                    {org.faculty && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Fakultas:</span>
                        <span className="text-muted-foreground">{org.faculty}</span>
                      </div>
                    )}
                    {org.department && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Program Studi:</span>
                        <span className="text-muted-foreground">{org.department}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mt-4">
                      <Badge variant="secondary" className="px-2 py-1">
                        {org.members} Anggota
                      </Badge>
                      <Badge variant="outline" className="px-2 py-1">
                        {org.programs} Program
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Lihat Detail</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bergabung dengan Proker Tracker</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            Proker Tracker membantu organisasi mahasiswa mengelola program kerja, tugas, dan evaluasi dengan efektif.
            Daftarkan organisasi Anda sekarang dan nikmati manfaatnya!
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Daftarkan Organisasi Anda
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
