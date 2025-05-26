'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

type Program = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
};

export default function CreateTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    programId: '',
    priority: 'sedang',
    status: 'belum_dimulai'
  });
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch programs and users for dropdown options
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch programs with credentials to include cookies
        const programsResponse = await fetch('/api/programs', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!programsResponse.ok) {
          console.error('Programs API error:', programsResponse.status, programsResponse.statusText);
          throw new Error('Gagal mengambil data program');
        }
        
        const programsData = await programsResponse.json();
        console.log('Programs data received:', programsData);
        setPrograms(programsData.programs);

        // Fetch members (potential assignees) with credentials to include cookies
        const membersResponse = await fetch('/api/members/list', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!membersResponse.ok) {
          console.error('Members API error:', membersResponse.status, membersResponse.statusText);
          throw new Error('Gagal mengambil data anggota');
        }
        
        const membersData = await membersResponse.json();
        console.log('Members data received:', membersData);
        setUsers(membersData.members || []);

        // No need to set default assignee as we've removed that field
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.description || !formData.dueDate || !formData.programId) {
      setError('Semua kolom wajib diisi');
      setIsSubmitting(false);
      return;
    }

    // Validate date
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      setError('Tanggal tenggat tidak boleh sebelum hari ini');
      setIsSubmitting(false);
      return;
    }

    // Create the request payload
    const payload = {
      name: formData.name,
      description: formData.description,
      due_date: formData.dueDate,
      program_id: parseInt(formData.programId),
      priority: formData.priority,
      status: formData.status
    };
    
    console.log('Submitting task data:', payload);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify(payload)
      });
      
      console.log('Task creation response status:', response.status);
      
      // Get the response data regardless of status
      const data = await response.json();
      console.log('Task creation response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat tugas');
      }

      setSuccess('Tugas berhasil dibuat');
      
      // Redirect to tasks page after successful creation
      setTimeout(() => {
        router.push('/dashboard/tasks');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.message || 'Terjadi kesalahan saat membuat tugas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-8">
          <div className="flex items-center">
            <Link href="/dashboard/tasks" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Buat Tugas Baru</h1>
              <p className="text-muted-foreground">Tambahkan tugas baru untuk program kerja</p>
            </div>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Detail Tugas</CardTitle>
              <CardDescription>
                Masukkan informasi tentang tugas yang akan dibuat
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-destructive/15 text-destructive p-4 rounded-md">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-md">
                    {success}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Tugas</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Masukkan nama tugas"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Jelaskan tentang tugas ini"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Tanggal Tenggat</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="programId">Program</Label>
                    <Select
                      value={formData.programId}
                      onValueChange={(value) => handleSelectChange('programId', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id.toString()}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Penanggung Jawab field removed */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioritas</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleSelectChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rendah">Rendah</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="tinggi">Tinggi</SelectItem>
                        <SelectItem value="kritis">Kritis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="belum_dimulai">Belum Dimulai</SelectItem>
                        <SelectItem value="dalam_progres">Dalam Progres</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Link href="/dashboard/tasks">
                  <Button variant="outline">Batal</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Buat Tugas
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
