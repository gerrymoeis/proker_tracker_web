'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/auth/auth-context'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Define types for our data
type Program = {
  id: number
  name: string
  description: string
  status: string
  start_date: string
  end_date: string
  department_id: number
  created_by: number
  created_at: string
  updated_at: string
  department_name: string
  total_tasks: number
  completed_tasks: number
}

type Task = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  program_id: number
  assigned_to: number
  created_by: number
  created_at: string
  updated_at: string
  program_name: string
  assignee_name: string
}

type DepartmentStats = {
  department_id: number
  department_name: string
  total_programs: number
  completed_programs: number
  total_tasks: number
  completed_tasks: number
}

// Colors for charts
const COLORS = ['#4F46E5', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
const STATUS_COLORS = {
  'belum_dimulai': '#9CA3AF',
  'dalam_progres': '#3B82F6',
  'selesai': '#10B981',
  'ditunda': '#F59E0B',
  'dibatalkan': '#EF4444'
}

export default function ReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [programs, setPrograms] = useState<Program[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          // Fetch programs with credentials
          const programsRes = await fetch('/api/programs', {
            credentials: 'include'
          })
          const programsData = await programsRes.json()
          console.log('Reports - Programs data:', programsData)
          
          // Make sure we're setting the programs array from the response
          setPrograms(programsData.programs || [])

          // Fetch tasks with credentials
          const tasksRes = await fetch('/api/tasks', {
            credentials: 'include'
          })
          const tasksData = await tasksRes.json()
          console.log('Reports - Tasks data:', tasksData)
          
          // Make sure we're setting the tasks array from the response
          setTasks(tasksData.tasks || [])

          // Calculate department stats
          const deptMap = new Map<number, DepartmentStats>()
          
          programsData.forEach((program: Program) => {
            if (!deptMap.has(program.department_id)) {
              deptMap.set(program.department_id, {
                department_id: program.department_id,
                department_name: program.department_name,
                total_programs: 0,
                completed_programs: 0,
                total_tasks: 0,
                completed_tasks: 0
              })
            }
            
            const dept = deptMap.get(program.department_id)!
            dept.total_programs += 1
            if (program.status === 'completed') {
              dept.completed_programs += 1
            }
            dept.total_tasks += program.total_tasks
            dept.completed_tasks += program.completed_tasks
          })
          
          setDepartmentStats(Array.from(deptMap.values()))
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsDataLoading(false)
        }
      }
    }

    fetchData()
  }, [isAuthenticated])

  // Prepare data for charts
  const programStatusData = [
    { name: 'Belum Dimulai', value: programs.filter(p => p.status === 'belum_dimulai').length },
    { name: 'Dalam Progres', value: programs.filter(p => p.status === 'dalam_progres').length },
    { name: 'Selesai', value: programs.filter(p => p.status === 'selesai').length },
    { name: 'Ditunda', value: programs.filter(p => p.status === 'ditunda').length },
    { name: 'Dibatalkan', value: programs.filter(p => p.status === 'dibatalkan').length }
  ].filter(item => item.value > 0)

  const taskStatusData = [
    { name: 'Belum Dimulai', value: tasks.filter(t => t.status === 'belum_dimulai').length },
    { name: 'Dalam Progres', value: tasks.filter(t => t.status === 'dalam_progres').length },
    { name: 'Selesai', value: tasks.filter(t => t.status === 'selesai').length },
    { name: 'Ditunda', value: tasks.filter(t => t.status === 'ditunda').length },
    { name: 'Dibatalkan', value: tasks.filter(t => t.status === 'dibatalkan').length }
  ].filter(item => item.value > 0)

  const taskPriorityData = [
    { name: 'Rendah', value: tasks.filter(t => t.priority === 'rendah').length },
    { name: 'Sedang', value: tasks.filter(t => t.priority === 'sedang').length },
    { name: 'Tinggi', value: tasks.filter(t => t.priority === 'tinggi').length }
  ].filter(item => item.value > 0)

  const departmentPerformanceData = departmentStats.map(dept => ({
    name: dept.department_name,
    programCompletion: dept.total_programs > 0 ? Math.round((dept.completed_programs / dept.total_programs) * 100) : 0,
    taskCompletion: dept.total_tasks > 0 ? Math.round((dept.completed_tasks / dept.total_tasks) * 100) : 0
  }))

  // Calculate overall stats
  const totalPrograms = programs.length
  const completedPrograms = programs.filter(p => p.status === 'completed').length
  const programCompletionRate = totalPrograms > 0 ? Math.round((completedPrograms / totalPrograms) * 100) : 0
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Loading skeletons
  if (isLoading || isDataLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 p-8">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Dashboard Analitik</h1>
          <p className="text-muted-foreground">Lihat laporan dan analitik detail untuk organisasi Anda</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="programs">Program</TabsTrigger>
            <TabsTrigger value="tasks">Tugas</TabsTrigger>
            <TabsTrigger value="departments">Departemen</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPrograms}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedPrograms} selesai
                  </p>
                  <Progress value={programCompletionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedTasks} selesai
                  </p>
                  <Progress value={taskCompletionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Program Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{programCompletionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedPrograms} of {totalPrograms} programs
                  </p>
                  <Progress value={programCompletionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskCompletionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks
                  </p>
                  <Progress value={taskCompletionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Program Status Distribution</CardTitle>
                  <CardDescription>
                    Current status of all programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {programStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={programStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {programStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No program data available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Task Status Distribution</CardTitle>
                  <CardDescription>
                    Current status of all tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {taskStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No task data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Program Status Overview</CardTitle>
                <CardDescription>
                  Detailed breakdown of program statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {programs.length > 0 ? (
                    <div className="grid gap-4">
                      {programs.map((program) => (
                        <div key={program.id} className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={program.status === 'completed' ? 'default' : 'outline'}>
                                {program.status.replace('-', ' ')}
                              </Badge>
                              <span className="font-medium">{program.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {program.completed_tasks} / {program.total_tasks} tasks
                            </span>
                          </div>
                          <Progress 
                            value={program.total_tasks > 0 ? (program.completed_tasks / program.total_tasks) * 100 : 0} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No program data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task Status Distribution</CardTitle>
                  <CardDescription>
                    Current status of all tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {taskStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No task data available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Task Priority Distribution</CardTitle>
                  <CardDescription>
                    Distribution of tasks by priority
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {taskPriorityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskPriorityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskPriorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No task data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>
                  Program and task completion rates by department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                {departmentPerformanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentPerformanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="programCompletion" name="Program Completion %" fill="#4F46E5" />
                      <Bar dataKey="taskCompletion" name="Task Completion %" fill="#EC4899" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground">No department data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
