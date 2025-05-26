import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

export async function POST(request: Request) {
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
    
    // Parse request body
    const body = await request.json();
    const { name, email, password, role, departmentId } = body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi' },
        { status: 400 }
      );
    }
    
    console.log('Create Member API: Creating new member with data:', { name, email, role, departmentId });
    
    // Insert new user
    const insertUserResult = await executeQuery<any>(`
      INSERT INTO users (
        name, 
        email, 
        password, 
        organization_name, 
        role, 
        profile_image
      ) VALUES (?, ?, ?, ?, ?, NULL)
    `, [name, email, password, 'Himafortic', role]);
    
    // Get the new user's ID
    const userId = insertUserResult.insertId;
    
    // If a department was selected, add the user to that department
    if (departmentId) {
      // Get organization ID for Himafortic
      const orgResult = await executeQuery<any[]>(`
        SELECT id FROM organizations WHERE name = 'Himafortic' LIMIT 1
      `);
      
      if (orgResult.length === 0) {
        return NextResponse.json(
          { error: 'Organisasi tidak ditemukan' },
          { status: 404 }
        );
      }
      
      const organizationId = orgResult[0].id;
      
      // Add user to organization_members table
      await executeQuery(`
        INSERT INTO organization_members (
          organization_id, 
          user_id, 
          department_id, 
          role
        ) VALUES (?, ?, ?, ?)
      `, [organizationId, userId, departmentId, 'staff_departemen']);
    }
    
    return NextResponse.json(
      { 
        message: 'Anggota berhasil ditambahkan',
        userId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan anggota' },
      { status: 500 }
    );
  }
}
