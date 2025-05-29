'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email input, 2: Password reset
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    if (!email) {
      setMessage({ text: 'Email diperlukan', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Verify if email exists
      const response = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage({ text: data.message || 'Email tidak ditemukan', type: 'error' });
        setIsSubmitting(false);
        return;
      }
      
      // If email exists, move to step 2
      setMessage({ text: 'Email ditemukan. Silakan masukkan password baru Anda.', type: 'success' });
      setStep(2);
    } catch (err) {
      console.error('Email verification error:', err);
      setMessage({ text: 'Terjadi kesalahan saat memverifikasi email', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    if (!newPassword || !confirmPassword) {
      setMessage({ text: 'Password baru dan konfirmasi password diperlukan', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Password baru dan konfirmasi password tidak cocok', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ text: 'Password minimal 8 karakter', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Reset password
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage({ text: data.message || 'Gagal mengubah password', type: 'error' });
        setIsSubmitting(false);
        return;
      }
      
      setMessage({ text: 'Password berhasil diubah. Anda akan diarahkan ke halaman login.', type: 'success' });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setMessage({ text: 'Terjadi kesalahan saat mengubah password', type: 'error' });
    } finally {
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
            {step === 1 ? 'Masukkan email Anda untuk reset password' : 'Buat password baru untuk akun Anda'}
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
            <CardTitle>{step === 1 ? 'Lupa Password' : 'Reset Password'}</CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Masukkan email Anda untuk melanjutkan proses reset password' 
                : 'Masukkan password baru untuk akun Anda'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-destructive/15 text-destructive'}`}>
                {message.text}
              </div>
            )}
            
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Lanjutkan'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
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
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Ingat password Anda?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Masuk sekarang
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Dengan menggunakan fitur ini, Anda menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
