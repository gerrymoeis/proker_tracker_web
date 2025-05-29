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
    
    let departments;
    
    // If user is admin or ketua_himpunan, get all departments
    if (decoded.role === 'admin' || decoded.role === 'ketua_himpunan') {
      departments = await executeQuery<any[]>(`
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
    } else if (decoded.role === 'kepala_departemen' && decoded.organization_name) {
      // For kepala_departemen, get only their department
      departments = await executeQuery<any[]>(`
        SELECT 
          id, 
          name, 
          description, 
          head_id
        FROM 
          departments
        WHERE 
          name LIKE ?
        ORDER BY 
          name ASC
      `, [`%${decoded.organization_name}%`]);
    } else {
      // For other roles, get departments in their organization
      if (!decoded.organization_name) {
        // If no organization_name, return all departments as fallback
        departments = await executeQuery<any[]>(`
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
      } else {
        // Get departments that might be related to their organization
        departments = await executeQuery<any[]>(`
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
      }
    }
    
    // If no departments found, log the issue
    if (departments.length === 0) {
      console.log('No departments found for user role:', decoded.role, 'organization:', decoded.organization_name);
    } else {
      console.log(`Found ${departments.length} departments for user`);
    }

    return NextResponse.json({ departments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data departemen' },
      { status: 500 }
    );
  }
}
