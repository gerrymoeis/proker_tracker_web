'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker'; 
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CreateProgramPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: '',
    startDate: '',
    endDate: '',
    status: 'belum_dimulai'
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    departmentId: '',
    startDate: '',
    endDate: ''
  });

  // Fetch departments for the dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        
        const data = await response.json();
        setDepartments(data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load departments. Please try again later.',
          variant: 'destructive'
        });
      }
    };
    
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects a date
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      description: '',
      departmentId: '',
      startDate: '',
      endDate: ''
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Nama program diperlukan';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Deskripsi program diperlukan';
      isValid = false;
    }
    
    if (!formData.departmentId) {
      errors.departmentId = 'Departemen diperlukan';
      isValid = false;
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Tanggal mulai diperlukan';
      isValid = false;
    }
    
    if (!formData.endDate) {
      errors.endDate = 'Tanggal selesai diperlukan';
      isValid = false;
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create the request payload
    const payload = {
      name: formData.name,
      description: formData.description,
      department_id: parseInt(formData.departmentId),
      start_date: formData.startDate,
      end_date: formData.endDate,
      status: formData.status,
      budget: 0 // Adding a default budget value
    };
    
    console.log('Submitting program data:', payload);
    
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      console.log('Program creation response status:', response.status);
      
      // Get the response data regardless of status
      const responseData = await response.json();
      console.log('Program creation response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create program');
      }
      
      toast({
        title: 'Success',
        description: 'Program berhasil dibuat',
      });
      
      // Redirect to programs page
      router.push('/dashboard/programs');
    } catch (error) {
      console.error('Error creating program:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create program',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Buat Program Baru
        </h1>
        
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Detail Program</CardTitle>
            <CardDescription>
              Isi informasi untuk membuat program kerja baru
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Program</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama program"
                  value={formData.name}
                  onChange={handleChange}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Deskripsi program"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
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
                {formErrors.departmentId && (
                  <p className="text-sm text-destructive">{formErrors.departmentId}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <DatePicker
                    value={formData.startDate ? new Date(formData.startDate) : undefined}
                    onChange={(date) => handleDateChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-destructive">{formErrors.startDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <DatePicker
                    value={formData.endDate ? new Date(formData.endDate) : undefined}
                    onChange={(date) => handleDateChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                  />
                  {formErrors.endDate && (
                    <p className="text-sm text-destructive">{formErrors.endDate}</p>
                  )}
                </div>
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
                    <SelectItem value="ditunda">Ditunda</SelectItem>
                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/programs')}
              >
                Batal
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Program'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
