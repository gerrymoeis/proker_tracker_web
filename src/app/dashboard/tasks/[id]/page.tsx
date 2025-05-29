'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
  Flag,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import TaskComments from '@/components/tasks/task-comments';

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
  creator_name: string;
  created_at: string;
  updated_at: string;
};

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Format datetime to Indonesian format
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate remaining days
  const calculateRemainingDays = (dueDate: string) => {
    if (!dueDate) return { text: '', color: '' };
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Tenggat terlewati', color: 'text-destructive' };
    } else if (diffDays === 0) {
      return { text: 'Hari ini', color: 'text-orange-500' };
    } else if (diffDays === 1) {
      return { text: '1 hari tersisa', color: 'text-orange-500' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} hari tersisa`, color: 'text-orange-500' };
    } else {
      return { text: `${diffDays} hari tersisa`, color: 'text-muted-foreground' };
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

  // Get priority display
  const getPriorityDisplay = (priority: string) => {
    const priorityMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success', icon: any }> = {
      'rendah': { label: 'Rendah', variant: 'secondary', icon: Flag },
      'sedang': { label: 'Sedang', variant: 'outline', icon: Flag },
      'tinggi': { label: 'Tinggi', variant: 'default', icon: Flag },
      'kritis': { label: 'Kritis', variant: 'destructive', icon: AlertTriangle }
    };
    
    return priorityMap[priority] || { label: priority, variant: 'outline', icon: Flag };
  };

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tasks/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tugas tidak ditemukan');
          }
          throw new Error('Gagal mengambil data tugas');
        }
        
        const data = await response.json();
        setTask(data.task);
      } catch (err: any) {
        console.error('Error fetching task:', err);
        setError(err.message || 'Terjadi kesalahan saat mengambil data tugas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [params.id]);

  // Handle task status change
  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Gagal memperbarui status tugas');
      
      const data = await response.json();
      setTask(data.task);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Terjadi kesalahan saat memperbarui status tugas');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (!task) return;
    
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Gagal menghapus tugas');
      
      // Redirect to tasks page after successful deletion
      router.push('/dashboard/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Terjadi kesalahan saat menghapus tugas');
      setIsUpdating(false);
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
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-primary">Detail Tugas</h1>
              <p className="text-muted-foreground">Informasi lengkap tentang tugas</p>
            </div>
            {!isLoading && task && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Tindakan
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Kelola Tugas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/tasks/${task.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Tugas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('selesai')}
                      disabled={task.status === 'selesai' || isUpdating}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Tandai Selesai
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('dalam_progres')}
                      disabled={task.status === 'dalam_progres' || isUpdating}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Tandai Dalam Progres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('dibatalkan')}
                      disabled={task.status === 'dibatalkan' || isUpdating}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Batalkan Tugas
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      disabled={isUpdating}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Tugas
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : task ? (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Main content */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{task.name}</CardTitle>
                        <CardDescription>
                          Bagian dari program <Link href={`/dashboard/programs/${task.program_id}`} className="text-primary hover:underline">{task.program_name}</Link>
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={getStatusDisplay(task.status).variant as any}
                        className="ml-2"
                      >
                        {getStatusDisplay(task.status).label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="details" onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Detail</TabsTrigger>
                        <TabsTrigger value="comments">Komentar</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4 pt-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Deskripsi</h3>
                          <div className="p-4 bg-muted rounded-md">
                            <p className="whitespace-pre-wrap">{task.description}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Dibuat oleh</h3>
                            <p>{task.creator_name || 'Tidak diketahui'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tanggal dibuat</h3>
                            <p>{formatDateTime(task.created_at)}</p>
                          </div>
                        </div>
                        
                        {task.updated_at && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Terakhir diperbarui</h3>
                            <p>{formatDateTime(task.updated_at)}</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="comments" className="pt-4">
                        <TaskComments taskId={task.id} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Informasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <h3 className="text-sm font-medium">Tenggat</h3>
                        <p>{formatDate(task.due_date)}</p>
                        <p className={`text-xs ${calculateRemainingDays(task.due_date).color}`}>
                          {calculateRemainingDays(task.due_date).text}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <h3 className="text-sm font-medium">Penanggung Jawab</h3>
                        <p>{task.assignee_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {React.createElement(getPriorityDisplay(task.priority).icon, { className: "h-5 w-5 text-muted-foreground mr-2" })}
                      <div>
                        <h3 className="text-sm font-medium">Prioritas</h3>
                        <Badge 
                          variant={getPriorityDisplay(task.priority).variant as any}
                          className="mt-1"
                        >
                          {getPriorityDisplay(task.priority).label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Tindakan Cepat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {task.status !== 'selesai' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleStatusChange('selesai')}
                        disabled={isUpdating}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Tandai Selesai
                      </Button>
                    )}
                    
                    {task.status !== 'dalam_progres' && task.status !== 'selesai' && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleStatusChange('dalam_progres')}
                        disabled={isUpdating}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Mulai Pengerjaan
                      </Button>
                    )}
                    
                    {task.status !== 'dibatalkan' && (
                      <Button 
                        variant="outline" 
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => handleStatusChange('dibatalkan')}
                        disabled={isUpdating}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Batalkan Tugas
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Tugas tidak ditemukan</h3>
              <p className="text-muted-foreground mt-2">
                Tugas yang Anda cari tidak ditemukan atau telah dihapus
              </p>
              <Link href="/dashboard/tasks" className="mt-4">
                <Button variant="outline">Kembali ke Daftar Tugas</Button>
              </Link>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
