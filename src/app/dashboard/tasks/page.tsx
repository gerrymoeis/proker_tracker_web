'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Filter,
  ArrowUpDown
} from 'lucide-react';

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

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<string>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calculate remaining days
  const calculateRemainingDays = (dueDate: string) => {
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
    const priorityMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }> = {
      'rendah': { label: 'Rendah', variant: 'secondary' },
      'sedang': { label: 'Sedang', variant: 'outline' },
      'tinggi': { label: 'Tinggi', variant: 'default' },
      'kritis': { label: 'Kritis', variant: 'destructive' }
    };
    
    return priorityMap[priority] || { label: priority, variant: 'outline' };
  };

  // Fetch tasks data
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Gagal mengambil data tugas');
        
        const data = await response.json();
        setTasks(data.tasks);
        setFilteredTasks(data.tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Terjadi kesalahan saat mengambil data tugas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(task => task.status === activeTab);
    }
    
    // Sort tasks
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      // Determine values to compare based on sort field
      switch (sortField) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'priority':
          const priorityOrder = { kritis: 3, tinggi: 2, sedang: 1, rendah: 0 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        case 'due_date':
          valueA = new Date(a.due_date).getTime();
          valueB = new Date(b.due_date).getTime();
          break;
        case 'program':
          valueA = a.program_name;
          valueB = b.program_name;
          break;
        case 'assignee':
          valueA = a.assignee_name;
          valueB = b.assignee_name;
          break;
        default:
          valueA = a.due_date;
          valueB = b.due_date;
      }
      
      // Compare values based on sort direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredTasks(filtered);
  }, [searchQuery, activeTab, tasks, sortField, sortDirection]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle task status change
  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Gagal memperbarui status tugas');
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus as any } : task
        )
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Terjadi kesalahan saat memperbarui status tugas');
    }
  };

  // Mock data for empty state
  const mockTasks = [] as Task[];

  // Use mock data if no tasks are fetched yet
  const displayTasks = tasks.length > 0 ? filteredTasks : mockTasks;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Tugas</h1>
              <p className="text-muted-foreground">Kelola semua tugas dalam program kerja</p>
            </div>
            <Link href="/dashboard/tasks/create">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Tugas Baru
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
                  placeholder="Cari tugas..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Urutkan berdasarkan</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort('name')}>
                    Nama Tugas {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('due_date')}>
                    Tenggat {sortField === 'due_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('priority')}>
                    Prioritas {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('program')}>
                    Program {sortField === 'program' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('assignee')}>
                    Penanggung Jawab {sortField === 'assignee' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="belum_dimulai">Belum Dimulai</TabsTrigger>
                <TabsTrigger value="dalam_progres">Dalam Progres</TabsTrigger>
                <TabsTrigger value="selesai">Selesai</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Daftar Tugas</CardTitle>
                    <CardDescription>
                      {activeTab === 'all' 
                        ? 'Semua tugas dalam program kerja' 
                        : `Tugas dengan status ${getStatusDisplay(activeTab).label.toLowerCase()}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : displayTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Tidak ada tugas yang ditemukan</h3>
                        <p className="text-muted-foreground mt-2">
                          {searchQuery 
                            ? 'Coba ubah kata kunci pencarian Anda' 
                            : 'Buat tugas baru untuk mulai mengelola aktivitas program kerja'}
                        </p>
                        {!searchQuery && (
                          <Link href="/dashboard/tasks/create" className="mt-4">
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Tugas Baru
                            </Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">Status</TableHead>
                              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                                <div className="flex items-center">
                                  Nama Tugas
                                  {sortField === 'name' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead onClick={() => handleSort('program')} className="cursor-pointer">
                                <div className="flex items-center">
                                  Program
                                  {sortField === 'program' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead onClick={() => handleSort('priority')} className="cursor-pointer">
                                <div className="flex items-center">
                                  Prioritas
                                  {sortField === 'priority' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead onClick={() => handleSort('due_date')} className="cursor-pointer">
                                <div className="flex items-center">
                                  Tenggat
                                  {sortField === 'due_date' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead onClick={() => handleSort('assignee')} className="cursor-pointer">
                                <div className="flex items-center">
                                  Penanggung Jawab
                                  {sortField === 'assignee' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {displayTasks.map((task) => {
                              const remainingDays = calculateRemainingDays(task.due_date);
                              return (
                                <TableRow key={task.id}>
                                  <TableCell>
                                    <Checkbox 
                                      checked={task.status === 'selesai'} 
                                      onCheckedChange={(checked) => {
                                        handleStatusChange(task.id, checked ? 'selesai' : 'dalam_progres');
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium">{task.name}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                      {task.description}
                                    </div>
                                  </TableCell>
                                  <TableCell>{task.program_name}</TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={getPriorityDisplay(task.priority).variant as any}
                                    >
                                      {getPriorityDisplay(task.priority).label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div>{formatDate(task.due_date)}</div>
                                    <div className={`text-xs ${remainingDays.color}`}>
                                      {remainingDays.text}
                                    </div>
                                  </TableCell>
                                  <TableCell>{task.assignee_name}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                          <Link href={`/dashboard/tasks/${task.id}`}>
                                            Lihat Detail
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                          <Link href={`/dashboard/tasks/${task.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          onClick={() => handleStatusChange(task.id, 'selesai')}
                                          disabled={task.status === 'selesai'}
                                        >
                                          <CheckCircle2 className="mr-2 h-4 w-4" />
                                          Tandai Selesai
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => handleStatusChange(task.id, 'dibatalkan')}
                                          disabled={task.status === 'dibatalkan'}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <XCircle className="mr-2 h-4 w-4" />
                                          Batalkan
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
