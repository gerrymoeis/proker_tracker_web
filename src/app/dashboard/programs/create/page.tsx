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
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';

type Department = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
};

export default function CreateProgramPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    departmentId: '',
    picId: '',
    budget: '',
    status: 'belum_dimulai'
  });
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments and users for dropdown options
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch departments
        const deptResponse = await fetch('/api/departments');
        if (!deptResponse.ok) throw new Error('Gagal mengambil data departemen');
        const deptData = await deptResponse.json();
        setDepartments(deptData.departments);

        // Fetch users (potential PICs)
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) throw new Error('Gagal mengambil data pengguna');
        const usersData = await usersResponse.json();
        setUsers(usersData.users);

        // Set default department if user is kepala_departemen
        if (user && user.role === 'kepala_departemen') {
          const userDept = deptData.departments.find((dept: Department) => 
            dept.name.toLowerCase().includes(user.organization_name.toLowerCase())
          );
          if (userDept) {
            setFormData(prev => ({ ...prev, departmentId: userDept.id.toString() }));
          }
        }

        // Set default PIC to current user
        if (user) {
          setFormData(prev => ({ ...prev, picId: user.id.toString() }));
        }
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
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || !formData.departmentId || !formData.picId) {
      setError('Semua kolom wajib diisi');
      setIsSubmitting(false);
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      setError('Tanggal selesai tidak boleh sebelum tanggal mulai');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate,
          department_id: parseInt(formData.departmentId),
          pic_id: parseInt(formData.picId),
          budget: formData.budget ? parseInt(formData.budget) : 0,
          status: formData.status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat program');
      }

      setSuccess('Program berhasil dibuat');
      
      // Redirect to program detail page after successful creation
      setTimeout(() => {
        router.push(`/dashboard/programs/${data.program.id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error creating program:', err);
      setError(err.message || 'Terjadi kesalahan saat membuat program');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-8">
          <div className="flex items-center">
            <Link href="/dashboard/programs" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Buat Program Baru</h1>
              <p className="text-muted-foreground">Tambahkan program kerja baru untuk organisasi</p>
            </div>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Detail Program</CardTitle>
              <CardDescription>
                Masukkan informasi tentang program kerja yang akan dibuat
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
                  <Label htmlFor="name">Nama Program</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Masukkan nama program"
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
                    placeholder="Jelaskan tentang program ini"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departmentId">Departemen</Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) => handleSelectChange('departmentId', value)}
                      disabled={isLoading || (user?.role === 'kepala_departemen')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih departemen" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {user?.role === 'kepala_departemen' && (
                      <p className="text-xs text-muted-foreground">
                        Sebagai kepala departemen, Anda hanya dapat membuat program untuk departemen Anda
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="picId">Penanggung Jawab</Label>
                    <Select
                      value={formData.picId}
                      onValueChange={(value) => handleSelectChange('picId', value)}
                      disabled={isLoading}
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
                    <Label htmlFor="budget">Anggaran (Rp)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={handleChange}
                    />
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
                <Link href="/dashboard/programs">
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
                      <Calendar className="mr-2 h-4 w-4" />
                      Buat Program
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
