'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plus, Calendar, Clock, Users, ArrowUpRight } from 'lucide-react';

type Program = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'belum_dimulai' | 'dalam_progres' | 'selesai' | 'dibatalkan';
  department_name: string;
  progress: number;
};

export default function ProgramsPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calculate remaining days
  const calculateRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Tenggat terlewati';
    } else if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return '1 hari tersisa';
    } else {
      return `${diffDays} hari tersisa`;
    }
  };

  // Get status display
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }> = {
      'belum_dimulai': { label: 'Belum Dimulai', variant: 'secondary' },
      'dalam_progres': { label: 'Dalam Progres', variant: 'default' },
      'selesai': { label: 'Selesai', variant: 'success' },
      'dibatalkan': { label: 'Dibatalkan', variant: 'destructive' }
    };
    
    return statusMap[status] || { label: status, variant: 'outline' };
  };

  // Fetch programs data
  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/programs');
        if (!response.ok) throw new Error('Gagal mengambil data program');
        
        const data = await response.json();
        
        // Calculate progress for each program
        const programsWithProgress = data.programs.map((program: any) => {
          // Calculate progress based on status
          let progress = 0;
          if (program.status === 'dalam_progres') {
            // Calculate progress based on dates
            const startDate = new Date(program.start_date).getTime();
            const endDate = new Date(program.end_date).getTime();
            const currentDate = new Date().getTime();
            
            if (currentDate >= endDate) {
              progress = 90; // Almost complete
            } else if (currentDate <= startDate) {
              progress = 10; // Just started
            } else {
              progress = Math.round(((currentDate - startDate) / (endDate - startDate)) * 100);
            }
          } else if (program.status === 'selesai') {
            progress = 100;
          } else if (program.status === 'belum_dimulai') {
            progress = 0;
          }
          
          return {
            ...program,
            progress
          };
        });
        
        setPrograms(programsWithProgress);
        setFilteredPrograms(programsWithProgress);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Terjadi kesalahan saat mengambil data program');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Filter programs based on search query and active tab
  useEffect(() => {
    let filtered = [...programs];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(program => 
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.department_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(program => program.status === activeTab);
    }
    
    setFilteredPrograms(filtered);
  }, [searchQuery, activeTab, programs]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Mock data for empty state
  const mockPrograms = [
    {
      id: 1,
      name: 'Pelatihan Pemrograman Web',
      description: 'Pelatihan dasar pemrograman web untuk anggota baru',
      start_date: '2025-06-01',
      end_date: '2025-06-30',
      status: 'belum_dimulai',
      department_name: 'Departemen Pendidikan dan Riset Teknologi',
      progress: 0
    },
    {
      id: 2,
      name: 'Webinar Teknologi AI',
      description: 'Webinar tentang perkembangan teknologi AI terkini',
      start_date: '2025-05-15',
      end_date: '2025-05-15',
      status: 'dalam_progres',
      department_name: 'Departemen Pendidikan dan Riset Teknologi',
      progress: 50
    },
    {
      id: 3,
      name: 'Workshop UI/UX Design',
      description: 'Workshop desain antarmuka pengguna untuk aplikasi mobile',
      start_date: '2025-04-10',
      end_date: '2025-04-20',
      status: 'selesai',
      department_name: 'Departemen Pendidikan dan Riset Teknologi',
      progress: 100
    }
  ] as Program[];

  // Use mock data if no programs are fetched yet
  const displayPrograms = programs.length > 0 ? filteredPrograms : mockPrograms;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Program Kerja</h1>
              <p className="text-muted-foreground">Kelola semua program kerja organisasi</p>
            </div>
            <Link href="/dashboard/programs/create">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Program Baru
              </Button>
            </Link>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari program kerja..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="belum_dimulai">Belum Dimulai</TabsTrigger>
                <TabsTrigger value="dalam_progres">Dalam Progres</TabsTrigger>
                <TabsTrigger value="selesai">Selesai</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((_, index) => (
                      <Card key={`skeleton-${index}`} className="animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                          <div className="h-4 w-1/2 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 w-full bg-muted rounded mb-4"></div>
                          <div className="h-4 w-3/4 bg-muted rounded"></div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <div className="h-4 w-1/4 bg-muted rounded"></div>
                          <div className="h-8 w-1/4 bg-muted rounded"></div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : displayPrograms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Tidak ada program yang ditemukan</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchQuery 
                        ? 'Coba ubah kata kunci pencarian Anda' 
                        : 'Buat program kerja baru untuk mulai mengelola kegiatan organisasi'}
                    </p>
                    {!searchQuery && (
                      <Link href="/dashboard/programs/create" className="mt-4">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Program Baru
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayPrograms.map((program) => (
                      <Link href={`/dashboard/programs/${program.id}`} key={program.id}>
                        <Card className="h-full transition-all hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{program.name}</CardTitle>
                              <Badge 
                                variant={getStatusDisplay(program.status).variant as any}
                                className="ml-2"
                              >
                                {getStatusDisplay(program.status).label}
                              </Badge>
                            </div>
                            <CardDescription>{program.department_name}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {program.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{formatDate(program.start_date)} - {formatDate(program.end_date)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{calculateRemainingDays(program.end_date)}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-2">
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>8 anggota</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2 mr-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${program.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{program.progress}%</span>
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
