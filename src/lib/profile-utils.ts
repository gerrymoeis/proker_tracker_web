import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Verifikasi autentikasi khusus untuk profile
 * Fungsi ini mengambil user ID dari cookie auth_token atau auth_status
 * dan kemudian mengambil data user dari database
 */
export async function verifyProfileAuth() {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const authStatus = cookieStore.get('auth_status')?.value;
    
    console.log('Profile Auth: auth_token exists:', !!token, 'auth_status:', authStatus);
    
    // Coba dapatkan email dari cookie atau URL
    let userEmail = null;
    
    // Jika ada token, coba decode
    if (token) {
      try {
        const decoded = verify(token, JWT_SECRET) as any;
        if (decoded && decoded.email) {
          userEmail = decoded.email;
          console.log('Profile Auth: Got email from token:', userEmail);
        }
      } catch (error) {
        console.error('Profile Auth: Error decoding token:', error);
      }
    }
    
    // Jika tidak ada email dari token, coba cari user berdasarkan auth_status
    if (!userEmail && authStatus === 'authenticated') {
      // Coba dapatkan user dari cookie lain atau session storage jika ada
      console.log('Profile Auth: No email from token, but auth_status is authenticated');
    }
    
    // Jika tidak ada cara untuk mengidentifikasi user, return error
    if (!userEmail) {
      console.error('Profile Auth: Could not identify user');
      return { 
        user: null, 
        response: NextResponse.json(
          { error: 'Tidak terautentikasi' },
          { status: 401 }
        ) 
      };
    }
    
    // Dapatkan user dari database berdasarkan email
    const users = await executeQuery<any[]>(
      `SELECT id, name, email, organization_name, role, profile_image 
       FROM users WHERE email = ?`,
      [userEmail]
    );
    
    if (users.length === 0) {
      console.error('Profile Auth: User not found in database with email:', userEmail);
      return { 
        user: null, 
        response: NextResponse.json(
          { error: 'Pengguna tidak ditemukan' },
          { status: 404 }
        ) 
      };
    }
    
    const user = users[0];
    console.log('Profile Auth: User authenticated successfully, ID:', user.id, 'Email:', user.email);
    
    return { user, response: null };
  } catch (error) {
    console.error('Profile Auth error:', error);
    return { 
      user: null, 
      response: NextResponse.json(
        { error: 'Terjadi kesalahan pada server' },
        { status: 500 }
      ) 
    };
  }
}

/**
 * Mendapatkan data pengguna saat ini berdasarkan ID dari token auth
 * Fungsi ini memastikan data yang diambil adalah data terbaru dari database
 */
export async function getCurrentUserData(userId?: number) {
  try {
    // Jika userId tidak disediakan, coba dapatkan dari auth profile
    if (!userId) {
      const { user, response } = await verifyProfileAuth();
      
      if (response || !user) {
        console.error('getCurrentUserData: Tidak dapat memverifikasi auth');
        return null;
      }
      
      userId = user.id;
    }
    
    // Ambil data pengguna dari database berdasarkan ID
    const users = await executeQuery<any[]>(
      `SELECT id, name, email, organization_name, role, profile_image 
       FROM users WHERE id = ?`,
      [userId]
    );
    
    if (users.length === 0) {
      console.error('getCurrentUserData: Pengguna tidak ditemukan dengan ID', userId);
      return null;
    }
    
    console.log('getCurrentUserData: Berhasil mendapatkan data pengguna dengan ID', userId);
    return users[0];
  } catch (error) {
    console.error('getCurrentUserData error:', error);
    return null;
  }
}

/**
 * Memeriksa apakah email sudah digunakan oleh pengguna lain
 */
export async function isEmailUsedByOtherUser(email: string, userId: number) {
  try {
    const existingUsers = await executeQuery<any[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );
    
    return existingUsers.length > 0;
  } catch (error) {
    console.error('isEmailUsedByOtherUser error:', error);
    return false;
  }
}
