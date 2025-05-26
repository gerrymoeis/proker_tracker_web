import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export type DecodedToken = {
  id: number;
  email: string;
  name: string;
  organization_name: string;
  role: string;
  profile_image?: string | null;
};

/**
 * Verifies authentication for API routes
 * @returns Object with decoded token or null if authentication fails
 */
export async function verifyAuth(): Promise<{ 
  decoded: DecodedToken | null;
  response: NextResponse | null;
}> {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const authStatus = cookieStore.get('auth_status')?.value;
    
    console.log('API Auth: auth_token exists:', !!token, 'auth_status:', authStatus);

    // For development, allow access with auth_status cookie
    if (authStatus === 'authenticated') {
      // Return a default user for development
      return { 
        decoded: {
          id: 1,
          email: 'dev@example.com',
          name: 'Development User',
          organization_name: 'Development Org',
          role: 'admin',
          profile_image: null
        }, 
        response: null 
      };
    }

    if (!token) {
      return { 
        decoded: null, 
        response: NextResponse.json(
          { error: 'Tidak terautentikasi' },
          { status: 401 }
        ) 
      };
    }

    try {
      // Verify token
      const decoded = verify(token, JWT_SECRET) as DecodedToken;
      return { decoded, response: null };
    } catch (error) {
      console.error('Error verifying token:', error);
      return { 
        decoded: null, 
        response: NextResponse.json(
          { error: 'Token tidak valid' },
          { status: 401 }
        ) 
      };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return { 
      decoded: null, 
      response: NextResponse.json(
        { error: 'Terjadi kesalahan pada server' },
        { status: 500 }
      ) 
    };
  }
}
