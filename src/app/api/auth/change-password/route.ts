import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

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
    };

    // Get request body
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Password saat ini dan password baru diperlukan' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password baru minimal 8 karakter' },
        { status: 400 }
      );
    }

    // Get user from database
    const users = await executeQuery<any[]>(
      'SELECT password FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Verify current password
    let isPasswordValid = false;
    
    // First try direct comparison (for passwords from schema.sql that aren't hashed)
    if (currentPassword === user.password) {
      isPasswordValid = true;
    } else {
      // Then try bcrypt comparison (for hashed passwords)
      try {
        isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      } catch (err) {
        // If bcrypt throws an error (likely because password isn't a valid hash)
        // then passwords don't match
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Password saat ini tidak valid' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await executeQuery(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, decoded.id]
    );

    return NextResponse.json(
      { message: 'Password berhasil diubah' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengubah password' },
      { status: 500 }
    );
  }
}
