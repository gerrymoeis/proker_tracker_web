import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyProfileAuth } from '@/lib/profile-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Auth]
 *     description: Changes the authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: User's current password
 *               newPassword:
 *                 type: string
 *                 description: User's new password (min 8 characters)
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password berhasil diubah
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password saat ini dan password baru diperlukan
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password saat ini tidak valid
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(request: NextRequest) {
  try {
    // Verifikasi autentikasi menggunakan helper function khusus profile
    const { user: currentUser, response: authResponse } = await verifyProfileAuth();
    
    // Jika autentikasi gagal, kembalikan response error
    if (authResponse) {
      console.error('Change password API: Authentication failed');
      return authResponse;
    }
    
    // Jika tidak ada user, ada kesalahan
    if (!currentUser) {
      console.error('Change password API: No user data');
      return NextResponse.json(
        { message: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }
    
    console.log('Change password API: User authenticated successfully, ID:', currentUser.id, 'Email:', currentUser.email);

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

    // Dapatkan password pengguna dari database untuk verifikasi
    const users = await executeQuery<any[]>(
      'SELECT password FROM users WHERE id = ?',
      [currentUser.id]
    );

    if (users.length === 0) {
      console.error('Change password API: User not found in database with ID:', currentUser.id);
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const user = users[0];
    console.log('Change password API: User found, verifying current password');

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
      [hashedPassword, currentUser.id]
    );

    // Buat response dengan pesan sukses
    const apiResponse = NextResponse.json(
      { message: 'Password berhasil diubah' },
      { status: 200 }
    );
    
    // Pastikan cookie auth_status tetap ada
    apiResponse.cookies.set({
      name: 'auth_status',
      value: 'authenticated',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    console.log('Change password API: Password updated successfully for user ID:', currentUser.id, 'Email:', currentUser.email);
    
    return apiResponse;
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengubah password' },
      { status: 500 }
    );
  }
}
