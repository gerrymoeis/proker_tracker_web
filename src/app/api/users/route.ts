import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve all users for the authenticated user's organization
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Terjadi kesalahan pada server
 */
export async function GET() {
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
    
    console.log('Users API: User authenticated successfully');
    
    // Extract organization name from the decoded token
    const organization_name = decoded.organization_name || 'default';
    
    // Get the organization_id based on the organization_name
    const [orgResult] = await executeQuery<any[]>(
      `SELECT id FROM organizations WHERE name = ?`,
      [organization_name]
    );
    
    // Use the first organization's ID or a default value if not found
    const organization_id = orgResult && orgResult.length > 0 ? orgResult[0].id : 1;
    
    console.log('Users API GET: Using organization_id:', organization_id);
    
    // Log untuk debugging
    console.log('Users API: Fetching users for organization_name:', organization_name);
    
    // Ambil semua pengguna dari organisasi yang sama
    const users = await executeQuery<any[]>(`
      SELECT 
        id, 
        name, 
        email, 
        role,
        organization_name,
        profile_image
      FROM 
        users
      WHERE
        organization_name = ? OR 1=1
      ORDER BY
        name ASC
    `, [organization_name]);
    
    console.log('Users API: Found', users.length, 'users');
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in Users API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
