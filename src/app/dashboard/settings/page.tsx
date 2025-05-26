'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, User, Building, Bell, Shield, LogOut, Upload, AlertCircle, CheckCircle } from 'lucide-react';

// Status message component for displaying errors and success messages
const StatusMessage = ({ error, success }: { error?: string; success?: string }) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 bg-destructive/15 text-destructive text-sm p-3 rounded-md w-full">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="flex items-center gap-2 bg-green-500/15 text-green-500 text-sm p-3 rounded-md w-full">
        <CheckCircle className="h-4 w-4" />
        <span>{success}</span>
      </div>
    );
  }
  
  return null;
};

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });
  
  const [organizationForm, setOrganizationForm] = useState({
    name: '',
    description: '',
    website: '',
    address: '',
    logo: ''
  });
  
  // Fetch user and organization data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          // Fetch user details
          const userResponse = await fetch(`/api/users/${user.id}`, {
            credentials: 'include'
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('User data fetched:', userData);
            
            setProfileForm({
              name: userData.name || user.name || '',
              email: userData.email || user.email || '',
              phone: userData.phone || '',
              bio: userData.bio || ''
            });
          }
          
          // Fetch organization details
          const orgResponse = await fetch('/api/organizations', {
            credentials: 'include'
          });
          
          if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            console.log('Organization data fetched:', orgData);
            
            if (orgData && orgData.organization) {
              setOrganizationForm({
                name: orgData.organization.name || '',
                description: orgData.organization.description || '',
                website: orgData.organization.website || '',
                address: orgData.organization.address || '',
                logo: orgData.organization.logo || ''
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user or organization data:', error);
        }
      }
    };
    
    fetchUserData();
  }, [isAuthenticated, user]);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    taskReminders: false,
    programUpdates: false,
    weeklyReports: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordLastChanged: new Date().toISOString().split('T')[0]
  });
  
  // Fetch user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (isAuthenticated && user) {
        try {
          // Fetch notification settings
          const notifResponse = await fetch(`/api/users/${user.id}/settings/notifications`, {
            credentials: 'include'
          });
          
          if (notifResponse.ok) {
            const notifData = await notifResponse.json();
            console.log('Notification settings fetched:', notifData);
            
            if (notifData && notifData.settings) {
              setNotificationSettings({
                emailNotifications: notifData.settings.emailNotifications ?? false,
                taskReminders: notifData.settings.taskReminders ?? false,
                programUpdates: notifData.settings.programUpdates ?? false,
                weeklyReports: notifData.settings.weeklyReports ?? false
              });
            }
          }
          
          // Fetch security settings
          const securityResponse = await fetch(`/api/users/${user.id}/settings/security`, {
            credentials: 'include'
          });
          
          if (securityResponse.ok) {
            const securityData = await securityResponse.json();
            console.log('Security settings fetched:', securityData);
            
            if (securityData && securityData.settings) {
              setSecuritySettings({
                twoFactorAuth: securityData.settings.twoFactorAuth ?? false,
                sessionTimeout: securityData.settings.sessionTimeout || '30',
                passwordLastChanged: securityData.settings.passwordLastChanged || new Date().toISOString().split('T')[0]
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user settings:', error);
          // If API endpoints don't exist yet, we'll use default values
        }
      }
    };
    
    fetchUserSettings();
  }, [isAuthenticated, user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrganizationForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    if (typeof securitySettings[setting] === 'boolean') {
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };
  
  const handleSecurityChange = (name: string, value: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      if (activeTab === 'profile' && user) {
        // Save profile data
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(profileForm)
        });
        
        if (!response.ok) {
          throw new Error('Gagal menyimpan data profil');
        }
        
        setSuccess('Data profil berhasil disimpan');
      } 
      else if (activeTab === 'organization') {
        // Save organization data
        const response = await fetch('/api/organizations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(organizationForm)
        });
        
        if (!response.ok) {
          throw new Error('Gagal menyimpan data organisasi');
        }
        
        setSuccess('Data organisasi berhasil disimpan');
      }
      else if (activeTab === 'notifications' && user) {
        // Save notification settings
        const response = await fetch(`/api/users/${user.id}/settings/notifications`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(notificationSettings)
        });
        
        if (!response.ok) {
          throw new Error('Gagal menyimpan pengaturan notifikasi');
        }
        
        setSuccess('Pengaturan notifikasi berhasil disimpan');
      }
      else if (activeTab === 'security' && user) {
        // Save security settings
        const response = await fetch(`/api/users/${user.id}/settings/security`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(securitySettings)
        });
        
        if (!response.ok) {
          throw new Error('Gagal menyimpan pengaturan keamanan');
        }
        
        setSuccess('Pengaturan keamanan berhasil disimpan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 space-y-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola profil, organisasi, dan preferensi aplikasi Anda</p>
        </div>
        
        <Tabs 
          defaultValue="profile" 
          className="flex flex-col md:flex-row gap-6"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className="md:w-64 space-y-4">
            <TabsList className="flex flex-col h-auto space-y-1">
              <TabsTrigger value="profile" className="justify-start">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="organization" className="justify-start">
                <Building className="h-4 w-4 mr-2" />
                Organisasi
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifikasi
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Keamanan
              </TabsTrigger>
            </TabsList>
            
            <Separator />
            
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
          
          <div className="flex-1">
            <Card>
              <TabsContent value="profile" className="space-y-4 mt-0">
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi profil dan preferensi akun Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar || ''} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Unggah Foto
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>Menyimpan...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="organization" className="space-y-4 mt-0">
                <CardHeader>
                  <CardTitle>Informasi Organisasi</CardTitle>
                  <CardDescription>
                    Kelola detail dan pengaturan organisasi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={organizationForm.logo} />
                      <AvatarFallback>BT</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Unggah Logo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Nama Organisasi</Label>
                      <Input
                        id="org-name"
                        name="name"
                        value={organizationForm.name}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={organizationForm.website}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Input
                        id="address"
                        name="address"
                        value={organizationForm.address}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="org-description">Deskripsi</Label>
                      <Textarea
                        id="org-description"
                        name="description"
                        rows={4}
                        value={organizationForm.description}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>Menyimpan...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4 mt-0">
                <CardHeader>
                  <CardTitle>Preferensi Notifikasi</CardTitle>
                  <CardDescription>
                    Kelola bagaimana dan kapan Anda menerima notifikasi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifikasi Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Terima notifikasi melalui email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pengingat Tugas</Label>
                      <p className="text-sm text-muted-foreground">
                        Terima pengingat untuk tenggat tugas yang akan datang
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.taskReminders}
                      onCheckedChange={() => handleNotificationToggle('taskReminders')}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pembaruan Program</Label>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan notifikasi saat ada perubahan pada program
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.programUpdates}
                      onCheckedChange={() => handleNotificationToggle('programUpdates')}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Laporan Mingguan</Label>
                      <p className="text-sm text-muted-foreground">
                        Terima laporan mingguan tentang kemajuan program dan tugas
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>Menyimpan...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4 mt-0">
                <CardHeader>
                  <CardTitle>Keamanan Akun</CardTitle>
                  <CardDescription>
                    Kelola pengaturan keamanan dan privasi akun Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autentikasi Dua Faktor</Label>
                      <p className="text-sm text-muted-foreground">
                        Tambahkan lapisan keamanan ekstra untuk akun Anda
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth as boolean}
                      onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Batas Waktu Sesi</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Atur berapa lama sesi Anda tetap aktif setelah tidak aktif
                    </p>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih batas waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 menit</SelectItem>
                        <SelectItem value="30">30 menit</SelectItem>
                        <SelectItem value="60">1 jam</SelectItem>
                        <SelectItem value="120">2 jam</SelectItem>
                        <SelectItem value="240">4 jam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Ubah Kata Sandi</Label>
                    <p className="text-sm text-muted-foreground">
                      Kata sandi terakhir diubah: {new Date(securitySettings.passwordLastChanged).toLocaleDateString('id-ID')}
                    </p>
                    <Button variant="outline" className="mt-2">
                      Ubah Kata Sandi
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>Menyimpan...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </TabsContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
