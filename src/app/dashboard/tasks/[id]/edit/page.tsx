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
import { Loader2, ArrowLeft, Save } from 'lucide-react';

type Program = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
};

type Task = {
  id: number;
  name: string;
  description: string;
  due_date: string;
  status: 'belum_dimulai' | 'dalam_progres' | 'selesai' | 'dibatalkan';
  priority: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
  program_id: number;
  program_name: string;
  assignee_id: number;
  assignee_name: string;
};

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    programId: '',
    assigneeId: '',
    priority: '',
    status: ''
  });
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch task, programs, and users data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch task
        const taskResponse = await fetch(`/api/tasks/${params.id}`);
        if (!taskResponse.ok) {
          if (taskResponse.status === 404) {
            throw new Error('Tugas tidak ditemukan');
          }
          throw new Error('Gagal mengambil data tugas');
        }
        
        const taskData = await taskResponse.json();
        const task = taskData.task;
        
        // Format date for input
        const dueDate = new Date(task.due_date);
        const formattedDueDate = dueDate.toISOString().split('T')[0];
        
        // Set form data
        setFormData({
          name: task.name,
          description: task.description,
          dueDate: formattedDueDate,
          programId: task.program_id.toString(),
          assigneeId: task.assignee_id.toString(),
          priority: task.priority,
          status: task.status
        });

        // Fetch programs
        const programsResponse = await fetch('/api/programs');
        if (!programsResponse.ok) throw new Error('Gagal mengambil data program');
        const programsData = await programsResponse.json();
        setPrograms(programsData.programs);

        // Fetch users
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) throw new Error('Gagal mengambil data pengguna');
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
    if (!formData.name || !formData.description || !formData.dueDate || !formData.programId || !formData.assigneeId) {
      setError('Semua kolom wajib diisi');
      setIsSubmitting(false);
      return;
    }

    // Validate date
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today && formData.status !== 'selesai' && formData.status !== 'dibatalkan') {
      setError('Tanggal tenggat tidak boleh sebelum hari ini untuk tugas yang belum selesai');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          due_date: formData.dueDate,
          program_id: parseInt(formData.programId),
          assignee_id: parseInt(formData.assigneeId),
          priority: formData.priority,
          status: formData.status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memperbarui tugas');
      }

      setSuccess('Tugas berhasil diperbarui');
      
      // Redirect to task detail page after successful update
      setTimeout(() => {
        router.push(`/dashboard/tasks/${params.id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.message || 'Terjadi kesalahan saat memperbarui tugas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-8">
          <div className="flex items-center">
            <Link href={`/dashboard/tasks/${params.id}`} className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Tugas</h1>
              <p className="text-muted-foreground">Perbarui informasi tugas</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Detail Tugas</CardTitle>
                <CardDescription>
                  Edit informasi tentang tugas
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="assigneeId">Penanggung Jawab</Label>
                      <Select
                        value={formData.assigneeId}
                        onValueChange={(value) => handleSelectChange('assigneeId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih penanggung jawab" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                  <Link href={`/dashboard/tasks/${params.id}`}>
                    <Button variant="outline">Batal</Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#4F46E5] to-[#EC4899] hover:from-[#4F46E5]/90 hover:to-[#EC4899]/90">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
