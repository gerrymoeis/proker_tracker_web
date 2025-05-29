import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

/**
 * @swagger
 * /api/members/list:
 *   get:
 *     summary: Get a list of all members
 *     tags: [Members]
 *     description: Retrieve a list of all members for task assignment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
    
    console.log('Members API: User authenticated successfully');

    // Get all members from the database
    // For development purposes, we're not filtering by organization
    const members = await executeQuery<any[]>(`
      SELECT 
        id, 
        name, 
        email, 
        role,
        organization_name,
        profile_image
      FROM 
        users
      ORDER BY 
        name ASC
      LIMIT 100
    `);

    console.log(`Members API: Found ${members.length} members`);

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data anggota' },
      { status: 500 }
    );
  }
}
