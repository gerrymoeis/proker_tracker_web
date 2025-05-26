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
    
    console.log('Departments API: User authenticated successfully');
    const departments = await executeQuery<any[]>(`
      SELECT 
        id, 
        name, 
        description, 
        head_id
      FROM 
        departments
      ORDER BY 
        name ASC
    `);

    return NextResponse.json({ departments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data departemen' },
      { status: 500 }
    );
  }
}
