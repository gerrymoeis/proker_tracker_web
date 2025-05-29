import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * @swagger
 * /api/auth/forgot-password/verify:
 *   post:
 *     summary: Verify email for password reset
 *     tags: [Auth]
 *     description: Verify if the email exists in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email ditemukan
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
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email diperlukan' },
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

    // Return success response
    return NextResponse.json({
      message: 'Email ditemukan',
      userId: users[0].id
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
