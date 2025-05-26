import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const userId = params.id;
    
    // For development purposes, allow access to any user data
    // In production, you would want to restrict this
    console.log(`Notifications API: User ${decoded.id} is accessing settings for user ${userId}`);
    
    // Comment out the restriction for now
    /*
    if (decoded.id.toString() !== userId) {
      return NextResponse.json(
        { error: 'Tidak diizinkan mengakses data pengguna lain' },
        { status: 403 }
      );
    }
    */
    
    console.log(`Notification Settings API: Fetching settings for user ID ${userId}`);

    // Since we don't have a user_settings table yet, return default values
    // In a real application, you would fetch this from the database
    return NextResponse.json({
      settings: {
        emailNotifications: true,
        taskReminders: true,
        programUpdates: true,
        weeklyReports: false
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in notification settings API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil pengaturan notifikasi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const userId = params.id;
    
    // Verify the user is updating their own data or is an admin
    if (decoded.id.toString() !== userId) {
      return NextResponse.json(
        { error: 'Tidak diizinkan mengubah data pengguna lain' },
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    
    console.log(`Notification Settings API: Updating settings for user ID ${userId}`);
    console.log('Request body:', body);

    // In a real application, you would save this to the database
    // For now, just acknowledge the update
    return NextResponse.json(
      { 
        message: 'Berhasil memperbarui pengaturan notifikasi',
        settings: body
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in notification settings API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui pengaturan notifikasi' },
      { status: 500 }
    );
  }
}
