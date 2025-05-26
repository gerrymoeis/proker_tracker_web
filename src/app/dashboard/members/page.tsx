'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Mail, Phone, UserPlus, MoreHorizontal } from 'lucide-react';

// Define types
type Member = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department_id: number;
  department_name: string;
  avatar_url?: string;
  status: 'active' | 'inactive';
};

export default function MembersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for initial development
  const mockMembers: Member[] = [];

  // Fetch members data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from API
        const response = await fetch('/api/members', { 
          credentials: 'include' 
        });
        
        if (!response.ok) {
          console.error('Members API error:', response.status, response.statusText);
          throw new Error('Gagal mengambil data anggota');
        }
        
        const data = await response.json();
        console.log('Members data fetched:', data);
        
        if (data && data.members) {
          setMembers(data.members);
          setFilteredMembers(data.members);
        } else {
          // Fallback to empty array if no members data
          setMembers(mockMembers);
          setFilteredMembers(mockMembers);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        // Fallback to mock data on error
        setMembers(mockMembers);
        setFilteredMembers(mockMembers);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Filter members based on search query and active tab
  useEffect(() => {
    let result = members;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(query) || 
        member.email.toLowerCase().includes(query) ||
        member.department_name.toLowerCase().includes(query)
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'active') {
        result = result.filter(member => member.status === 'active');
      } else if (activeTab === 'inactive') {
        result = result.filter(member => member.status === 'inactive');
      } else {
        // Filter by department
        const departmentId = parseInt(activeTab);
        result = result.filter(member => member.department_id === departmentId);
      }
    }
    
    setFilteredMembers(result);
  }, [searchQuery, activeTab, members]);

  // Get unique departments for tabs
  const departments = [...new Set(members.map(member => member.department_id))].map(id => {
    const dept = members.find(m => m.department_id === id);
    return {
      id,
      name: dept?.department_name || 'Umum'
    };
  }).filter(dept => dept.id > 0); // Filter out departments with ID 0

  // Loading state
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 space-y-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Anggota Organisasi</h1>
          <p className="text-muted-foreground">Kelola anggota dan departemen dalam organisasi Anda</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari anggota..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/dashboard/members/create">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="active">Aktif</TabsTrigger>
            <TabsTrigger value="inactive">Nonaktif</TabsTrigger>
            {departments.map(dept => (
              <TabsTrigger key={dept.id} value={dept.id.toString()}>{dept.name}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map(member => (
                  <Card key={member.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <CardDescription>{member.role}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Badge variant="outline" className="mt-1">
                            {member.department_name}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        Lihat Profil
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Tidak ada anggota yang ditemukan</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
