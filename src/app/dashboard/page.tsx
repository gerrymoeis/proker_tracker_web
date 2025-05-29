'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  // State for storing data from the API
  const [stats, setStats] = useState([
    { title: 'Program Aktif', value: '0', description: 'Program kerja yang sedang berjalan' },
    { title: 'Tugas Tertunda', value: '0', description: 'Tugas yang perlu diselesaikan' },
    { title: 'Milestone Selesai', value: '0', description: 'Milestone yang telah dicapai' },
    { title: 'Anggota Aktif', value: '0', description: 'Anggota yang aktif berpartisipasi' },
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [recentPrograms, setRecentPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return 'Besok';
    } else if (diffDays > 1 && diffDays < 7) {
      return `${diffDays} hari lagi`;
    } else if (diffDays >= 7 && diffDays < 14) {
      return '1 minggu lagi';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats with credentials to include cookies
        const statsResponse = await fetch('/api/stats', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!statsResponse.ok) {
          console.error('Stats API error:', statsResponse.status, statsResponse.statusText);
          throw new Error('Gagal mengambil data statistik');
        }
        
        const statsData = await statsResponse.json();
        console.log('Stats data received:', statsData);
        
        // Update stats with real data
        setStats([
          { title: 'Program Aktif', value: statsData.stats.activePrograms.toString(), description: 'Program kerja yang sedang berjalan' },
          { title: 'Tugas Tertunda', value: statsData.stats.pendingTasks.toString(), description: 'Tugas yang perlu diselesaikan' },
          { title: 'Milestone Selesai', value: statsData.stats.completedMilestones.toString(), description: 'Milestone yang telah dicapai' },
          { title: 'Anggota Aktif', value: statsData.stats.activeMembers.toString(), description: 'Anggota yang aktif berpartisipasi' },
        ]);

        // Fetch tasks with credentials to include cookies
        const tasksResponse = await fetch('/api/tasks', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!tasksResponse.ok) {
          console.error('Tasks API error:', tasksResponse.status, tasksResponse.statusText);
          throw new Error('Gagal mengambil data tugas');
        }
        
        const tasksData = await tasksResponse.json();
        console.log('Tasks data received:', tasksData);
        
        // Map tasks to the format we need
        const formattedTasks = tasksData.tasks.map((task: any) => ({
          id: task.id,
          name: task.name,
          dueDate: formatDate(task.due_date),
          program: task.program_name,
          priority: task.priority === 'rendah' ? 'Rendah' : 
                   task.priority === 'sedang' ? 'Sedang' : 
                   task.priority === 'tinggi' ? 'Tinggi' : 'Kritis'
        }));
        setUpcomingTasks(formattedTasks);

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
        
        // Calculate progress for each program (this is a mock calculation since we don't have real progress data)
        const formattedPrograms = programsData.programs.map((program: any) => {
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
            id: program.id,
            name: program.name,
            status: program.status,
            department: program.department_name,
            progress: progress
          };
        });
        setRecentPrograms(formattedPrograms);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <div className="flex space-x-2">
            <Link href="dashboard/programs/create">
              <Button>Program Baru</Button>
            </Link>
            <Link href="dashboard/tasks/create">
              <Button variant="outline">Tugas Baru</Button>
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            // Loading skeleton for stats
            Array(4).fill(0).map((_, index) => (
              <Card key={`loading-${index}`} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-12 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Upcoming Tasks */}
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Tugas Mendatang</CardTitle>
              <CardDescription>Tugas yang perlu segera diselesaikan</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading skeleton for tasks
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={`loading-task-${index}`} className="animate-pulse border-b pb-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                          <div className="h-3 w-24 bg-muted rounded"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                          <div className="h-3 w-12 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Tidak ada tugas mendatang</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-sm text-muted-foreground">{task.program}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${
                          task.priority === 'Kritis' 
                            ? 'text-destructive' 
                            : task.priority === 'Tinggi' 
                              ? 'text-orange-500' 
                              : 'text-muted-foreground'
                        }`}>
                          {task.dueDate}
                        </p>
                        <p className="text-xs">{task.priority}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Programs */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Program Kerja Terbaru</CardTitle>
              <CardDescription>Status program kerja yang sedang berjalan</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading skeleton for programs
                <div className="space-y-6">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={`loading-program-${index}`} className="space-y-2 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                          <div className="h-3 w-32 bg-muted rounded"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 w-24 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-3">
                        <div className="bg-primary/30 h-2 rounded-full w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentPrograms.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Tidak ada program kerja terbaru</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPrograms.map((program) => (
                    <div key={program.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{program.name}</p>
                          <p className="text-sm text-muted-foreground">{program.department}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            program.status === 'dalam_progres' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : program.status === 'selesai' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {program.status === 'dalam_progres' 
                              ? 'Dalam Progres' 
                              : program.status === 'selesai' 
                                ? 'Selesai' 
                                : 'Belum Dimulai'}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Preview */}
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
              <CardDescription>Jadwal dan acara mendatang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p className="text-muted-foreground">Kalender akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
