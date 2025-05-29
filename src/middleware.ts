import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// JWT secret key (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/programs',
  '/tasks',
  '/milestones',
  '/departments',
  '/users',
  '/profile',
];

// Paths that are accessible only for specific roles
const roleProtectedPaths: Record<string, string[]> = {
  admin: ['/users/admin', '/settings'],
  ketua: ['/admin', '/reports'],
  wakil_ketua: ['/admin', '/reports'],
  sekretaris: ['/admin', '/reports'],
  bendahara: ['/admin', '/finance', '/reports'],
  kepala_departemen: ['/admin/departments'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Skip middleware for non-protected paths
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const authStatus = request.cookies.get('auth_status')?.value;
  
  // For debugging - log the token presence
  console.log(`Middleware: Path ${pathname}, Token exists: ${!!token}, Auth status: ${authStatus}`);
  
  // If we have auth_status, consider the user authenticated
  // This is a more permissive approach for development
  if (authStatus === 'authenticated') {
    console.log('Middleware: User authenticated via auth_status cookie');
    return NextResponse.next();
  }
  
  // If we have a token, try to verify it
  if (token) {
    try {
      // Make sure token is a string
      const tokenString = token || '';
      verify(tokenString, JWT_SECRET);
      console.log('Middleware: Token verified successfully');
      return NextResponse.next();
    } catch (error) {
      console.log('Middleware: Token verification failed', error);
      // Continue to redirect to login
    }
  }
  
  // No valid authentication, redirect to login
  console.log('Middleware: No valid authentication, redirecting to login');
  const url = new URL('/login', request.url);
  url.searchParams.set('returnUrl', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|api/auth/login|api/auth/register).*)',
  ],
}
