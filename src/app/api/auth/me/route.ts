import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { executeQuery } from '@/lib/db';

// JWT secret key (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    try {
      // Verify token
      const decoded = verify(token, JWT_SECRET) as { 
        id: number; 
        email: string; 
        name: string;
        organization_name: string;
        role: string;
        profile_image?: string | null;
      };

      // Get user from database
      const users = await executeQuery<any[]>(
        `SELECT id, name, email, organization_name, role, profile_image FROM users WHERE id = ?`,
        [decoded.id]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { message: 'Pengguna tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json(users[0]);
    } catch (error) {
      // Token is invalid
      cookies().delete('auth_token');
      return NextResponse.json(
        { message: 'Sesi tidak valid' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
