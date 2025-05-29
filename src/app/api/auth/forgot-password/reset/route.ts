import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * /api/auth/forgot-password/reset:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     description: Reset user password with email and new password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: User's new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password berhasil diubah
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email dan password baru diperlukan
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan pada server
 */
export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    // Validate input
    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email dan password baru diperlukan' },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await executeQuery<any[]>(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Email tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await executeQuery(
      `UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?`,
      [hashedPassword, email]
    );

    // Return success response
    return NextResponse.json({
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
