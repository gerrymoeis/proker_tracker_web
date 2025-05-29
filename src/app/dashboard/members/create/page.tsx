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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

type Department = {
  id: number;
  name: string;
  description: string;
};

export default function CreateMemberPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'anggota',
    departmentId: ''
  });
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments for dropdown options
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch departments with credentials to include cookies
        const departmentsResponse = await fetch('/api/departments', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!departmentsResponse.ok) {
          console.error('Departments API error:', departmentsResponse.status, departmentsResponse.statusText);
          throw new Error('Gagal mengambil data departemen');
        }
        
        const departmentsData = await departmentsResponse.json();
        console.log('Departments data received:', departmentsData);
        setDepartments(departmentsData.departments);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.name || !formData.email || !formData.password) {
      setError('Nama, email, dan password wajib diisi');
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      setIsSubmitting(false);
      return;
    }

    // Create the request payload
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null
    };
    
    console.log('Submitting member data:', payload);
    
    try {
      const response = await fetch('/api/members/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menambahkan anggota');
      }
      
      setSuccess('Anggota berhasil ditambahkan!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'anggota',
        departmentId: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/members');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating member:', err);
      setError(err.message || 'Terjadi kesalahan saat menambahkan anggota');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-6 max-w-4xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard/members" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Tambah Anggota Baru</h1>
          </div>
          
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Informasi Anggota</CardTitle>
              <CardDescription>Tambahkan anggota baru ke organisasi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-md bg-destructive/20 border border-destructive text-destructive">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-3 rounded-md bg-green-500/20 border border-green-500 text-green-500 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    {success}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Masukkan nama lengkap"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contoh@student.unesa.ac.id"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Masukkan password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Peran</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => handleSelectChange('role', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anggota">Anggota</SelectItem>
                          <SelectItem value="kepala_departemen">Kepala Departemen</SelectItem>
                          <SelectItem value="sekretaris">Sekretaris</SelectItem>
                          <SelectItem value="bendahara">Bendahara</SelectItem>
                          <SelectItem value="wakil_ketua">Wakil Ketua</SelectItem>
                          <SelectItem value="ketua">Ketua</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departmentId">Departemen</Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={(value) => handleSelectChange('departmentId', value)}
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
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Tambah Anggota'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
