import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

/**
 * @swagger
 * /api/organizations/list:
 *   get:
 *     summary: Get a list of all organizations
 *     tags: [Organizations]
 *     description: Retrieve a list of all organizations with member and program counts
 *     responses:
 *       200:
 *         description: A list of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    // Fetch all organizations from the database
    const organizations = await executeQuery<any[]>(`
      SELECT 
        id, 
        name, 
        description, 
        university, 
        faculty, 
        department, 
        logo,
        created_at,
        updated_at
      FROM 
        organizations
      ORDER BY 
        name ASC
    `);
    
    // Get the count of members and programs for each organization
    const organizationsWithCounts = await Promise.all(
      organizations.map(async (org) => {
        // Get member count
        const memberCountResult = await executeQuery<any[]>(`
          SELECT COUNT(*) as member_count
          FROM organization_members
          WHERE organization_id = ?
        `, [org.id]);
        
        // Get program count
        const programCountResult = await executeQuery<any[]>(`
          SELECT COUNT(*) as program_count
          FROM programs
          WHERE organization_id = ?
        `, [org.id]);
        
        const memberCount = memberCountResult[0]?.member_count || 0;
        const programCount = programCountResult[0]?.program_count || 0;
        
        return {
          ...org,
          members: memberCount,
          programs: programCount
        };
      })
    );

    return NextResponse.json(
      { 
        message: 'Berhasil mendapatkan data organisasi',
        organizations: organizationsWithCounts
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in organizations list API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data organisasi' },
      { status: 500 }
    );
  }
}
