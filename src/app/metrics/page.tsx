'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Types for metrics data
type ApiMetric = {
  path: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  service: string;
};

type EndpointMetric = {
  path: string;
  requestCount: number;
  avgResponseTime: number;
  methods: { method: string; count: number }[];
  statusCodes: { code: string; count: number }[];
};

type ServiceMetric = {
  service: string;
  requestCount: number;
  avgResponseTime: number;
  successRate: number;
  errorRate: number;
};

type TimeSeriesMetric = {
  hour: number;
  timestamp: string;
  requestCount: number;
  avgResponseTime: number;
};

type StatusCodeDistribution = {
  range: string;
  count: number;
};

type MetricsData = {
  totalRequests: number;
  avgResponseTime: number;
  successRate: number;
  timeSeriesData: TimeSeriesMetric[];
  serviceMetrics: ServiceMetric[];
  endpointMetrics: EndpointMetric[];
  statusCodeDistribution: StatusCodeDistribution[];
  recentMetrics: ApiMetric[];
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/metrics');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch metrics');
        }
        
        const data = await response.json();
        console.log('Fetched metrics data:', data);
        
        if (data.metrics) {
          setMetrics(data.metrics);
        } else {
          console.warn('No metrics data found in response');
          setError('No metrics data available');
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Set up polling to refresh metrics every 30 seconds
    const intervalId = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      console.error('Error parsing timestamp:', e);
      return 'Invalid time';
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    } catch (e) {
      console.error('Error parsing timestamp:', e);
      return 'Invalid date';
    }
  };

  // Format response time to ms with 2 decimal places
  const formatResponseTime = (time: number) => {
    return `${time.toFixed(2)} ms`;
  };

  // Get status code badge color
  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'bg-green-500';
    if (code >= 300 && code < 400) return 'bg-blue-500';
    if (code >= 400 && code < 500) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Prepare time series chart data
  const timeSeriesChartData = {
    labels: metrics?.timeSeriesData?.map(item => `${item.hour}:00`) || [],
    datasets: [
      {
        label: 'Request Count',
        data: metrics?.timeSeriesData?.map(item => item.requestCount) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Avg Response Time (ms)',
        data: metrics?.timeSeriesData?.map(item => item.avgResponseTime) || [],
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const timeSeriesOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Request Count',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Response Time (ms)',
        },
      },
    },
  };

  // Prepare endpoint performance chart data
  const endpointChartData = {
    labels: metrics?.endpointMetrics?.slice(0, 10).map(item => item.path) || [],
    datasets: [
      {
        label: 'Avg Response Time (ms)',
        data: metrics?.endpointMetrics?.slice(0, 10).map(item => item.avgResponseTime) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };
  
  // Prepare service performance chart data
  const serviceChartData = {
    labels: metrics?.serviceMetrics?.map(item => item.service) || [],
    datasets: [
      {
        label: 'Success Rate (%)',
        data: metrics?.serviceMetrics?.map(item => item.successRate) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Error Rate (%)',
        data: metrics?.serviceMetrics?.map(item => item.errorRate) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };
  
  // Prepare status code distribution chart data
  const statusCodeChartData = {
    labels: metrics?.statusCodeDistribution?.map(item => item.range) || [],
    datasets: [
      {
        label: 'Status Code Count',
        data: metrics?.statusCodeDistribution?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // 2xx - Green
          'rgba(59, 130, 246, 0.8)', // 3xx - Blue
          'rgba(245, 158, 11, 0.8)', // 4xx - Yellow
          'rgba(239, 68, 68, 0.8)',  // 5xx - Red
          'rgba(161, 161, 170, 0.8)', // other - Gray
        ],
      },
    ],
  };

  const endpointChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Endpoint Performance',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Response Time (ms)',
        },
      },
    },
  };

  // Loading state
  if (loading && !metrics) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
              API Metrics Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitoring kinerja dan penggunaan API Proker Tracker
            </p>
          </div>
          
          <div className="grid gap-6">
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
              API Metrics Dashboard
            </h1>
          </div>
          
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          
          <p className="text-center text-muted-foreground">
            Pastikan Anda memiliki izin untuk mengakses halaman ini. Hanya admin yang dapat melihat metrik API.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
            API Metrics Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitoring kinerja dan penggunaan API Proker Tracker
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="status">Status Codes</TabsTrigger>
            <TabsTrigger value="requests">Recent Requests</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Requests</CardTitle>
                  <CardDescription>All API requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{metrics?.totalRequests || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Avg Response Time</CardTitle>
                  <CardDescription>Across all endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{formatResponseTime(metrics?.avgResponseTime || 0)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Unique Endpoints</CardTitle>
                  <CardDescription>Distinct API paths</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{metrics?.endpointMetrics?.length || 0}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Time Series Chart */}
            <Card>
              <CardHeader>
                <CardTitle>API Traffic Over Time</CardTitle>
                <CardDescription>Request volume and response times for the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line options={timeSeriesOptions} data={timeSeriesChartData} />
                </div>
              </CardContent>
            </Card>
            
            {/* Top Endpoints Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints by Response Time</CardTitle>
                <CardDescription>Average response time for the most used endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar options={endpointChartOptions} data={endpointChartData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Metrics grouped by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' as const },
                      title: { display: true, text: 'Service Success/Error Rates' },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Percentage (%)' },
                      },
                    },
                  }} data={serviceChartData} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
                <CardDescription>Detailed metrics for each service</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Avg Response Time</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Error Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics?.serviceMetrics?.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{service.service}</TableCell>
                        <TableCell>{service.requestCount}</TableCell>
                        <TableCell>{formatResponseTime(service.avgResponseTime)}</TableCell>
                        <TableCell className="text-green-600">{service.successRate.toFixed(1)}%</TableCell>
                        <TableCell className="text-red-600">{service.errorRate.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Status Codes Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Code Distribution</CardTitle>
                <CardDescription>Distribution of HTTP status codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' as const },
                      title: { display: true, text: 'Status Code Distribution' },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Count' },
                      },
                    },
                  }} data={statusCodeChartData} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Code Summary</CardTitle>
                <CardDescription>Summary of status code ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {metrics?.statusCodeDistribution?.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{item.count}</div>
                          <div className="text-sm text-muted-foreground">{item.range}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Endpoint Performance</CardTitle>
                <CardDescription>Detailed metrics for each API endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Path</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Avg Response Time</TableHead>
                      <TableHead>Methods</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics?.endpointMetrics?.map((endpoint, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{endpoint.path}</TableCell>
                        <TableCell>{endpoint.requestCount}</TableCell>
                        <TableCell>{formatResponseTime(endpoint.avgResponseTime)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {endpoint.methods.map((method, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {method.method}: {method.count}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Recent Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent API Requests</CardTitle>
                <CardDescription>Last 100 API requests with details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics?.recentMetrics?.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">
                          {formatTime(request.timestamp)}
                          <div className="text-xs text-muted-foreground">{formatDate(request.timestamp)}</div>
                        </TableCell>
                        <TableCell className="font-mono text-sm max-w-[200px] truncate">{request.path}</TableCell>
                        <TableCell>
                          <Badge variant={request.method === 'GET' ? 'default' : 'secondary'}>
                            {request.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.statusCode)}>
                            {request.statusCode}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatResponseTime(request.responseTime)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
