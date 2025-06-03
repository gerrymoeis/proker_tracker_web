'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  FileArchive,
  Calculator,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  BarChart
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Base navigation items for all users
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Program Kerja', href: '/dashboard/programs', icon: Calendar },
    { name: 'Tugas', href: '/dashboard/tasks', icon: FileText },
    { name: 'Laporan', href: '/dashboard/reports', icon: FileArchive },
    { name: 'Anggota', href: '/dashboard/members', icon: Users },
    { name: 'Matrik', href: '/metrics', icon: Calculator },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];
  
  // Admin-only navigation items
  const adminNavigation = [
    { name: 'Admin Panel', href: '/dashboard/admin', icon: Settings },
    { name: 'Metrics', href: '/metrics', icon: BarChart },
  ];
  
  // Combine navigation based on user role
  const navigation = user?.role === 'admin' 
    ? [...baseNavigation, ...adminNavigation] 
    : baseNavigation;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop - only rendered when needed */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Mobile sidebar panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Proker Tracker Logo" 
              width={32} 
              height={32} 
              className="rounded-md"
            />
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Proker Tracker</span>
            </Link>
          </div>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 h-[calc(100vh-4rem)] overflow-y-auto px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    pathname === item.href
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="Proker Tracker Logo" 
                width={32} 
                height={32} 
                className="rounded-md"
              />
              <Link href="/">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Proker Tracker</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="mt-5 flex-1 px-2">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        pathname === item.href
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b bg-card">
          <button
            type="button"
            className="border-r px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user?.profile_image ? (
                        <AvatarImage src={user.profile_image} alt={user?.name || 'User'} />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user && (
                        <>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
