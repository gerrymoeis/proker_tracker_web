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

export default function CreateTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<{ id: number; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    programId: '',
    assigneeId: '',
    dueDate: '',
    priority: 'medium',
    status: 'belum_dimulai'
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    programId: '',
    assigneeId: '',
    dueDate: ''
  });

  // Fetch programs and users for the dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch programs
        const programsResponse = await fetch('/api/programs', {
          credentials: 'include'
        });
        
        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }
        
        const programsData = await programsResponse.json();
        setPrograms(programsData.programs);
        
        // Fetch users
        const usersResponse = await fetch('/api/users', {
          credentials: 'include'
        });
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again later.',
          variant: 'destructive'
        });
      }
    };
    
    fetchData();
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
      programId: '',
      assigneeId: '',
      dueDate: ''
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Nama tugas diperlukan';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Deskripsi tugas diperlukan';
      isValid = false;
    }
    
    if (!formData.programId) {
      errors.programId = 'Program diperlukan';
      isValid = false;
    }
    
    if (!formData.assigneeId) {
      errors.assigneeId = 'Penanggung jawab diperlukan';
      isValid = false;
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Tanggal jatuh tempo diperlukan';
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
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          program_id: parseInt(formData.programId),
          assignee_id: parseInt(formData.assigneeId),
          due_date: formData.dueDate,
          priority: formData.priority,
          status: formData.status
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }
      
      toast({
        title: 'Success',
        description: 'Tugas berhasil dibuat',
      });
      
      // Redirect to tasks page
      router.push('/dashboard/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
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
          Buat Tugas Baru
        </h1>
        
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Detail Tugas</CardTitle>
            <CardDescription>
              Isi informasi untuk membuat tugas baru
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Tugas</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama tugas"
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
                  placeholder="Deskripsi tugas"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
              </div>
              
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
                {formErrors.programId && (
                  <p className="text-sm text-destructive">{formErrors.programId}</p>
                )}
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
                {formErrors.assigneeId && (
                  <p className="text-sm text-destructive">{formErrors.assigneeId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
                <DatePicker
                  value={formData.dueDate ? new Date(formData.dueDate) : undefined}
                  onChange={(date) => handleDateChange('dueDate', date ? date.toISOString().split('T')[0] : '')}
                />
                {formErrors.dueDate && (
                  <p className="text-sm text-destructive">{formErrors.dueDate}</p>
                )}
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
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                      <SelectItem value="urgent">Mendesak</SelectItem>
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
                      <SelectItem value="ditunda">Ditunda</SelectItem>
                      <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/tasks')}
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
                  'Simpan Tugas'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
