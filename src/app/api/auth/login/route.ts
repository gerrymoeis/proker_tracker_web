import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// JWT secret key (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth]
 *     description: Authenticate a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login berhasil
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
 *                     profile_image:
 *                       type: string
 *                       description: User's profile image
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email dan password diperlukan
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email atau password salah
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
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    // Get user from database
    const users = await executeQuery<any[]>(
      `SELECT id, name, email, password, organization_name, role, profile_image FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check if password is valid
    let isPasswordValid = false;
    
    // First try direct comparison (for passwords from schema.sql that aren't hashed)
    if (password === user.password) {
      isPasswordValid = true;
    } else {
      // Then try bcrypt comparison (for hashed passwords)
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (err) {
        // If bcrypt throws an error (likely because password isn't a valid hash)
        // then passwords don't match
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

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

    // Set cookie with more permissive settings for development
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: false, // Set to false for local development
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });
    
    // Also set a non-httpOnly cookie for client-side detection
    cookies().set({
      name: 'auth_status',
      value: 'authenticated',
      httpOnly: false,
      secure: false, // Set to false for local development
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });
    
    // Log for debugging
    console.log('Login API: Set auth cookies successfully');

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login berhasil',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
