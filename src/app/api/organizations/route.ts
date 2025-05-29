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
    
    console.log('Organizations API: User authenticated successfully, organization:', decoded.organization_name);

    // Get organization details
    const organizations = await executeQuery<any[]>(`
      SELECT 
        id,
        name
      FROM 
        organizations
      WHERE 
        name = ?
      LIMIT 1
    `, [decoded.organization_name]);

    // If organization not found, return empty data
    if (!organizations || organizations.length === 0) {
      return NextResponse.json(
        { 
          message: 'Organisasi tidak ditemukan',
          organization: {
            name: decoded.organization_name
          }
        },
        { status: 200 }
      );
    }

    // Map database fields to expected response format
    const organizationData = {
      ...organizations[0],
      // Add these fields for UI compatibility
      description: '',
      website: '',
      address: '',
      logo: ''
    };

    return NextResponse.json(
      { 
        message: 'Berhasil mendapatkan data organisasi',
        organization: organizationData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in organizations API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data organisasi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    
    // Get request body
    const body = await request.json();
    const { name, description, website, address, logo } = body;
    
    console.log('Organizations API: Updating organization:', decoded.organization_name);
    console.log('Request body:', body);

    // Check if organization exists
    const existingOrgs = await executeQuery<any[]>(`
      SELECT id FROM organizations WHERE name = ?
    `, [decoded.organization_name]);

    if (existingOrgs && existingOrgs.length > 0) {
      // Update existing organization
      await executeQuery(`
        UPDATE organizations
        SET 
          name = ?
        WHERE name = ?
      `, [
        name || decoded.organization_name,
        decoded.organization_name
      ]);

      console.log('Organizations API: Updated organization name to:', name || decoded.organization_name);
    } else {
      // Create new organization
      await executeQuery(`
        INSERT INTO organizations (
          name, 
          created_at
        ) VALUES (?, NOW())
      `, [
        name || decoded.organization_name
      ]);

      console.log('Organizations API: Created new organization:', decoded.organization_name);
    }

    return NextResponse.json(
      { message: 'Berhasil memperbarui data organisasi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in organizations API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui data organisasi' },
      { status: 500 }
    );
  }
}
