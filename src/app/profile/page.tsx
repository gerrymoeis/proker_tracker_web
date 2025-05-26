'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Mail, Building, UserCircle, Lock } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Call API to update profile
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Gagal memperbarui profil');
      } else {
        setSuccessMessage('Profil berhasil diperbarui');
        setIsEditing(false);
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan saat memperbarui profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru tidak cocok');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password minimal 8 karakter');
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    setPasswordError('');

    try {
      // Call API to change password
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Gagal mengubah password');
      } else {
        setSuccessMessage('Password berhasil diubah');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan saat mengubah password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'ketua': 'Ketua',
      'wakil_ketua': 'Wakil Ketua',
      'sekretaris': 'Sekretaris',
      'bendahara': 'Bendahara',
      'kepala_departemen': 'Kepala Departemen',
      'anggota': 'Anggota'
    };
    
    return roleMap[role] || role;
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Profil Pengguna</h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Memuat...</span>
            </div>
          ) : user ? (
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Informasi Pengguna</CardTitle>
                  <CardDescription>Informasi dasar tentang akun Anda</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    {user.profile_image ? (
                      <AvatarImage src={user.profile_image} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {getRoleDisplay(user.role)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Batal' : 'Edit Profil'}
                  </Button>
                </CardFooter>
              </Card>

              <div className="md:col-span-2">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="security">Keamanan</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Detail Profil</CardTitle>
                        <CardDescription>
                          {isEditing 
                            ? 'Edit informasi profil Anda di bawah ini' 
                            : 'Lihat dan kelola informasi profil Anda'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {successMessage && (
                          <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {successMessage}
                          </div>
                        )}
                        {errorMessage && (
                          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive">
                            {errorMessage}
                          </div>
                        )}
                        
                        {isEditing ? (
                          <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nama Lengkap</Label>
                              <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Organisasi</Label>
                              <Input
                                value={user.organization_name}
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">Organisasi tidak dapat diubah</p>
                            </div>
                            <div className="space-y-2">
                              <Label>Peran</Label>
                              <Input
                                value={getRoleDisplay(user.role)}
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">Peran tidak dapat diubah</p>
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Menyimpan...
                                </>
                              ) : (
                                'Simpan Perubahan'
                              )}
                            </Button>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center border-b py-2">
                              <User className="h-5 w-5 text-muted-foreground mr-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Nama Lengkap</p>
                                <p className="text-sm text-muted-foreground">{user.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center border-b py-2">
                              <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center border-b py-2">
                              <Building className="h-5 w-5 text-muted-foreground mr-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Organisasi</p>
                                <p className="text-sm text-muted-foreground">{user.organization_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center py-2">
                              <UserCircle className="h-5 w-5 text-muted-foreground mr-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Peran</p>
                                <p className="text-sm text-muted-foreground">{getRoleDisplay(user.role)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Keamanan</CardTitle>
                        <CardDescription>
                          Kelola pengaturan keamanan akun Anda
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {successMessage && (
                          <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {successMessage}
                          </div>
                        )}
                        {errorMessage && (
                          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive">
                            {errorMessage}
                          </div>
                        )}
                        
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Password Saat Ini</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                            {passwordError && (
                              <p className="text-xs text-destructive">{passwordError}</p>
                            )}
                          </div>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                              </>
                            ) : (
                              'Ubah Password'
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Tidak ada data pengguna yang ditemukan</p>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
