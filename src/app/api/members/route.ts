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
    
    console.log('Members API: User authenticated successfully, organization:', decoded.organization_name);

    console.log('Members API: Fetching users with organization name:', decoded.organization_name);
    
    // For development purposes, get all users from Himafortic organization with their department info
    // In production, you would filter by the user's organization
    const members = await executeQuery<any[]>(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.organization_name,
        u.role,
        u.profile_image,
        u.created_at,
        u.updated_at,
        d.id AS department_id,
        d.name AS department_name,
        om.role AS department_role
      FROM 
        users u
      LEFT JOIN 
        organization_members om ON u.id = om.user_id
      LEFT JOIN 
        departments d ON om.department_id = d.id
      WHERE 
        u.organization_name = 'Himafortic'
      ORDER BY 
        u.name ASC
    `);

    // Map the database fields to the expected format for the UI
    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: '', // This field doesn't exist in the database yet
      role: member.role,
      department_id: member.department_id || 0,
      department_name: member.department_name || 'Umum',
      department_role: member.department_role || 'anggota',
      avatar_url: member.profile_image || '',
      status: 'active', // This field doesn't exist in the database yet, using default
      created_at: member.created_at,
      updated_at: member.updated_at
    }));
    
    console.log(`Members API: Found ${formattedMembers.length} members`);

    return NextResponse.json(
      { 
        message: 'Berhasil mendapatkan data anggota',
        members: formattedMembers
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in members API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data anggota' },
      { status: 500 }
    );
  }
}
