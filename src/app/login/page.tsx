'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  // Check if already logged in via cookie
  useEffect(() => {
    // Check for auth_status cookie
    const hasAuthCookie = document.cookie.includes('auth_status=authenticated');
    if (hasAuthCookie) {
      console.log('Login page: Found auth cookie, redirecting to', returnUrl);
      window.location.href = returnUrl;
    }
  }, [returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);
    
    if (!email || !password) {
      setLoginError('Email dan password diperlukan');
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log('Login: Attempting login with email', email);
      
      // Direct API call for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for cookies
      });
      
      const data = await response.json();
      console.log('Login: Response received', response.status);
      
      if (!response.ok) {
        setLoginError(data.message || 'Login gagal');
        setIsSubmitting(false);
        return;
      }
      
      // Set a client-side flag for successful login
      document.cookie = `auth_status=authenticated; path=/; max-age=${60 * 60 * 24 * 7}`;
      
      console.log('Login successful, redirecting to', returnUrl);
      
      // Add a slight delay to ensure cookies are set
      setTimeout(() => {
        // Force a hard redirect to dashboard
        window.location.href = returnUrl;
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Terjadi kesalahan saat login');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background-start-rgb to-background-end-rgb p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center">
            <Image src="/logo.png" alt="Proker Tracker Logo" width={60} height={60} className="mr-2" />
            <h1 className="text-3xl font-bold text-primary">Proker Tracker</h1>
          </div>
          <p className="text-center text-muted-foreground">
            Masuk untuk melanjutkan ke dashboard Proker Tracker
          </p>
        </div>
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Masuk</CardTitle>
            <CardDescription>
              Masukkan email dan password untuk mengakses akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Daftar sekarang
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Dengan masuk, Anda menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
