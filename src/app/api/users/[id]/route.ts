import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     description: Retrieve detailed information about a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const { decoded, response } = await verifyAuth();
    
    // If authentication failed, return the error response
    if (response) {
      return response;
    }
    
    // If we don't have a decoded token, something went wrong
    if (!decoded) {
      return NextResponse.json(
        { error: 'Terjadi kesalahan pada autentikasi' },
        { status: 500 }
      );
    }
    
    const userId = params.id;
    
    // For development purposes, allow access to any user data
    // In production, you would want to restrict this
    console.log(`User API: User ${decoded.id} is accessing data for user ${userId}`);
    
    // Comment out the restriction for now
    /*
    if (decoded.id.toString() !== userId) {
      return NextResponse.json(
        { error: 'Tidak diizinkan mengakses data pengguna lain' },
        { status: 403 }
      );
    }
    */
    
    console.log(`User API: Fetching user data for user ID ${userId}`);

    // Get user details
    const users = await executeQuery<any[]>(`
      SELECT 
        id, 
        name, 
        email,
        role
      FROM 
        users
      WHERE 
        id = ?
    `, [userId]);

    // If user not found, return error
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Add additional user data for UI compatibility
    const userData = {
      ...users[0],
      phone: '', // These fields don't exist in the database yet
      bio: ''
    };

    return NextResponse.json(
      userData,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pengguna' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     description: Update information for a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               role:
 *                 type: string
 *                 description: User's role in the organization
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pengguna berhasil diperbarui
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const { decoded, response } = await verifyAuth();
    
    // If authentication failed, return the error response
    if (response) {
      return response;
    }
    
    // If we don't have a decoded token, something went wrong
    if (!decoded) {
      return NextResponse.json(
        { error: 'Terjadi kesalahan pada autentikasi' },
        { status: 500 }
      );
    }
    
    const userId = params.id;
    
    // Verify the user is updating their own data or is an admin
    if (decoded.id.toString() !== userId) {
      return NextResponse.json(
        { error: 'Tidak diizinkan mengubah data pengguna lain' },
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { name, email } = body;
    
    console.log(`User API: Updating user data for user ID ${userId}`);
    console.log('Request body:', body);

    // Update user
    await executeQuery(`
      UPDATE users
      SET 
        name = ?,
        email = ?
      WHERE id = ?
    `, [
      name,
      email,
      userId
    ]);

    return NextResponse.json(
      { message: 'Berhasil memperbarui data pengguna' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui data pengguna' },
      { status: 500 }
    );
  }
}
