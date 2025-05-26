import { NextRequest, NextResponse } from 'next/server';
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
    
    console.log('Programs API: User authenticated successfully');
    
    // Extract organization name from the decoded token
    const organization_name = decoded.organization_name || 'default';
    
    // Get the organization_id based on the organization_name
    const [orgResult] = await executeQuery<any[]>(
      `SELECT id FROM organizations WHERE name = ?`,
      [organization_name]
    );
    
    // Use the first organization's ID or a default value if not found
    const organization_id = orgResult && orgResult.length > 0 ? orgResult[0].id : 1;
    
    console.log('Programs API GET: Using organization_id:', organization_id);
    
    const programs = await executeQuery<any[]>(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.start_date, 
        p.end_date, 
        p.status,
        d.name as department_name,
        u.name as pic_name,
        o.name as organization_name
      FROM 
        programs p
      LEFT JOIN 
        departments d ON p.department_id = d.id
      LEFT JOIN 
        users u ON p.pic_id = u.id
      LEFT JOIN
        organizations o ON p.organization_id = o.id
      WHERE
        p.organization_id = ?
      ORDER BY 
        p.start_date DESC
    `, [organization_id]);
    
    console.log(`Programs API: Found ${programs.length} programs for organization ID ${organization_id}`);

    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data program' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    console.log('Programs API: User authenticated successfully for POST');

    // Check if user has permission to create programs
    const allowedRoles = ['admin', 'ketua', 'wakil_ketua', 'kepala_departemen'];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Tidak memiliki izin untuk membuat program' },
        { status: 403 }
      );
    }

    // Get request body
    const { 
      name, 
      description, 
      start_date, 
      end_date, 
      department_id, 
      pic_id, 
      budget, 
      status 
    } = await request.json();

    // Validate required fields
    if (!name || !description || !start_date || !end_date || !department_id) {
      return NextResponse.json(
        { error: 'Kolom nama, deskripsi, tanggal mulai, tanggal selesai, dan departemen wajib diisi' },
        { status: 400 }
      );
    }
    
    // Log the received data for debugging
    console.log('Programs API: Received data:', { 
      name, 
      description, 
      start_date, 
      end_date, 
      department_id, 
      pic_id, 
      budget, 
      status 
    });

    // Extract organization name from the decoded token
    const organization_name = decoded.organization_name || 'default';
    
    // Get the organization_id based on the organization_name
    const [orgResult] = await executeQuery<any[]>(
      `SELECT id FROM organizations WHERE name = ?`,
      [organization_name]
    );
    
    // Use the first organization's ID or a default value if not found
    const organization_id = orgResult && orgResult.length > 0 ? orgResult[0].id : 1;
    
    console.log('Programs API: Using organization_id:', organization_id);
    
    // Insert new program - use the current user as pic_id if not provided
    const result = await executeQuery<{ insertId?: number }>(
      `INSERT INTO programs (
        name, 
        description, 
        start_date, 
        end_date, 
        department_id, 
        pic_id, 
        budget, 
        status, 
        organization_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        description,
        start_date,
        end_date,
        department_id,
        pic_id || decoded.id, // Use the authenticated user's ID if pic_id is not provided
        budget || 0,
        status || 'belum_dimulai',
        organization_id
      ]
    );
    
    console.log('Programs API: Program created with ID:', result.insertId);

    if (!result.insertId) {
      throw new Error('Gagal membuat program');
    }

    // Get the newly created program
    const programs = await executeQuery<any[]>(
      `SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.start_date, 
        p.end_date, 
        p.status,
        p.budget,
        d.name as department_name,
        u.name as pic_name
      FROM 
        programs p
      LEFT JOIN 
        departments d ON p.department_id = d.id
      LEFT JOIN 
        users u ON p.pic_id = u.id
      WHERE 
        p.id = ?`,
      [result.insertId]
    );

    if (programs.length === 0) {
      throw new Error('Program berhasil dibuat tetapi gagal mengambil data');
    }

    return NextResponse.json(
      { 
        message: 'Program berhasil dibuat', 
        program: programs[0] 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating program:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a database error
    if (error && typeof error === 'object' && 'code' in error && 'sqlMessage' in error) {
      console.error('SQL error code:', (error as any).code);
      console.error('SQL error message:', (error as any).sqlMessage);
      console.error('SQL query:', (error as any).sql);
      
      return NextResponse.json(
        { 
          error: 'Terjadi kesalahan database saat membuat program', 
          details: (error as any).sqlMessage 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat program' },
      { status: 500 }
    );
  }
}
