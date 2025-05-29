import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';
import { getCurrentUserData, isEmailUsedByOtherUser, verifyProfileAuth } from '@/lib/profile-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     description: Updates the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profil berhasil diperbarui
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nama dan email diperlukan
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email sudah digunakan oleh pengguna lain
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
      console.error('Update profile API: Authentication failed');
      return authResponse;
    }
    
    // Jika tidak ada user, ada kesalahan
    if (!currentUser) {
      console.error('Update profile API: No user data');
      return NextResponse.json(
        { message: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }
    
    console.log('Update profile API: User authenticated successfully, ID:', currentUser.id, 'Email:', currentUser.email);

    // Get request body
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Nama dan email diperlukan' },
        { status: 400 }
      );
    }

    // Kita sudah memiliki data pengguna saat ini dari verifyProfileAuth
    // Tidak perlu mengambil lagi dari database
    
    // Hanya periksa email duplikat jika pengguna mengubah email mereka
    if (email !== currentUser.email) {
      console.log('Update profile API: Email changed from', currentUser.email, 'to', email);
      
      // Periksa apakah email baru sudah digunakan oleh pengguna lain menggunakan helper function
      const emailIsUsed = await isEmailUsedByOtherUser(email, currentUser.id);

      if (emailIsUsed) {
        return NextResponse.json(
          { message: 'Email sudah digunakan oleh pengguna lain' },
          { status: 400 }
        );
      }
    } else {
      console.log('Update profile API: Email not changed, only updating name');
    }

    // Update user in database
    await executeQuery(
      'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
      [name, email, currentUser.id]
    );

    // Get updated user data
    const users = await executeQuery<any[]>(
      `SELECT id, name, email, organization_name, role, profile_image 
       FROM users WHERE id = ?`,
      [currentUser.id]
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
    const apiResponse = NextResponse.json(
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

    // Set auth token cookie
    apiResponse.cookies.set({
      name: 'auth_token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    // Set auth status cookie (non-httpOnly so it's accessible to client-side JavaScript)
    apiResponse.cookies.set({
      name: 'auth_status',
      value: 'authenticated',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    console.log('Update profile API: Profile updated successfully for user ID:', user.id);

    return apiResponse;
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui profil' },
      { status: 500 }
    );
  }
}
