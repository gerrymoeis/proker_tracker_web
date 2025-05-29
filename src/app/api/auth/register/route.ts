import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// JWT secret key (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user and organization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - organization_name
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               organization_name:
 *                 type: string
 *                 description: Name of the organization
 *               role:
 *                 type: string
 *                 description: User's role in the organization
 *                 default: admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User's ID
 *                     name:
 *                       type: string
 *                       description: User's name
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                     organization_name:
 *                       type: string
 *                       description: User's organization name
 *                     role:
 *                       type: string
 *                       description: User's role
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nama, email, password, dan nama organisasi diperlukan
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email sudah terdaftar
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
    const { name, email, password, organization_name, role } = await req.json();

    // Validate input
    if (!name || !email || !password || !organization_name) {
      return NextResponse.json(
        { message: 'Nama, email, password, dan nama organisasi diperlukan' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await executeQuery<any[]>(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await executeQuery<{ insertId?: number }>(
      `INSERT INTO users (name, email, password, organization_name, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, hashedPassword, organization_name, role || 'anggota']
    );

    if (!result || !result.insertId) {
      return NextResponse.json(
        { message: 'Gagal mendaftarkan pengguna' },
        { status: 500 }
      );
    }

    // Get the newly created user
    const users = await executeQuery<any[]>(
      `SELECT id, name, email, organization_name, role, profile_image FROM users WHERE id = ?`,
      [result.insertId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Gagal mendapatkan data pengguna' },
        { status: 500 }
      );
    }

    const user = users[0];

    // Create JWT token
    const token = sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        organization_name: user.organization_name,
        role: user.role,
        profile_image: user.profile_image
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Registrasi berhasil',
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
