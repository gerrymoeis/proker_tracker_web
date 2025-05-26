'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're on a client-side render
    if (typeof window !== 'undefined') {
      // Add debug logging
      console.log('ProtectedRoute: isLoading =', isLoading, 'isAuthenticated =', isAuthenticated);
      
      // If not loading and not authenticated, redirect to login
      if (!isLoading && !isAuthenticated) {
        // Check for auth_status cookie as a fallback
        const hasAuthStatusCookie = document.cookie.includes('auth_status=authenticated');
        console.log('ProtectedRoute: auth_status cookie exists =', hasAuthStatusCookie);
        
        if (!hasAuthStatusCookie) {
          router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
      }
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Memuat...</span>
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
}
