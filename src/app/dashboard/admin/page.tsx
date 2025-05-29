'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Database, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [migrations, setMigrations] = useState<string[]>([]);
  const [isLoadingMigrations, setIsLoadingMigrations] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRunningMigration, setIsRunningMigration] = useState(false);

  // Available migrations
  const availableMigrations = [
    { name: 'create_comments_table', description: 'Creates the comments table for task discussions' }
  ];

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Fetch applied migrations
  const fetchMigrations = async () => {
    if (!isAuthenticated || !isAdmin) return;
    
    setIsLoadingMigrations(true);
    setError('');
    
    try {
      const response = await fetch('/api/migrations');
      if (!response.ok) {
        throw new Error('Failed to fetch migrations');
      }
      
      const data = await response.json();
      setMigrations(data.migrations || []);
    } catch (err: any) {
      console.error('Error fetching migrations:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data migrasi');
    } finally {
      setIsLoadingMigrations(false);
    }
  };

  // Run a migration
  const runMigration = async (migrationName: string) => {
    setIsRunningMigration(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/migrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ migration: migrationName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run migration');
      }
      
      const data = await response.json();
      setSuccessMessage(data.message);
      fetchMigrations(); // Refresh the list
    } catch (err: any) {
      console.error('Error running migration:', err);
      setError(err.message || 'Terjadi kesalahan saat menjalankan migrasi');
    } finally {
      setIsRunningMigration(false);
    }
  };

  // Load migrations on component mount
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchMigrations();
    } else if (isAuthenticated && !isAdmin && !isLoading) {
      // Redirect non-admin users
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, isLoading, fetchMigrations, router]);

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Akses Ditolak</AlertTitle>
            <AlertDescription>
              Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya tersedia untuk administrator.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Panel Admin</h1>
          <p className="text-muted-foreground">
            Kelola database dan konfigurasi sistem
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Migrasi Database
                </CardTitle>
                <CardDescription>
                  Jalankan migrasi untuk memperbarui skema database
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchMigrations}
                disabled={isLoadingMigrations}
              >
                {isLoadingMigrations ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Sukses</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="text-sm font-medium">Migrasi yang tersedia:</div>
              
              {availableMigrations.map((migration) => {
                const isApplied = migrations.includes(migration.name);
                
                return (
                  <div 
                    key={migration.name}
                    className="flex items-center justify-between border p-4 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{migration.name}</div>
                      <div className="text-sm text-muted-foreground">{migration.description}</div>
                    </div>
                    <div className="flex items-center">
                      {isApplied ? (
                        <span className="text-sm text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Diterapkan
                        </span>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => runMigration(migration.name)}
                          disabled={isRunningMigration}
                        >
                          {isRunningMigration ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Jalankan Migrasi
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {availableMigrations.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Tidak ada migrasi yang tersedia saat ini
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              <Shield className="h-3 w-3 inline-block mr-1" />
              Migrasi database hanya dapat dijalankan oleh administrator sistem.
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
