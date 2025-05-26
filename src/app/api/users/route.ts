import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

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

    // Get users from the same organization
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
        organization_name = ?
      ORDER BY 
        name ASC
    `, [decoded.organization_name]);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pengguna' },
      { status: 500 }
    );
  }
}
