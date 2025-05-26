import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { 
      id: number; 
      email: string;
    };

    // Get request body
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Nama dan email diperlukan' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    if (email !== decoded.email) {
      const existingUsers = await executeQuery<any[]>(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, decoded.id]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { message: 'Email sudah digunakan' },
          { status: 400 }
        );
      }
    }

    // Update user in database
    await executeQuery(
      'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
      [name, email, decoded.id]
    );

    // Get updated user data
    const users = await executeQuery<any[]>(
      `SELECT id, name, email, organization_name, role, profile_image 
       FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Create new token with updated user data
    const newToken = require('jsonwebtoken').sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        organization_name: user.organization_name,
        role: user.role,
        profile_image: user.profile_image
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie with new token
    const response = NextResponse.json(
      { 
        message: 'Profil berhasil diperbarui',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          organization_name: user.organization_name,
          role: user.role,
          profile_image: user.profile_image
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui profil' },
      { status: 500 }
    );
  }
}
