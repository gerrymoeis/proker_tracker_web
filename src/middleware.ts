import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { addMetric } from '@/lib/metrics-storage';
// Using Web Performance API instead of Node.js perf_hooks for Edge Runtime compatibility

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

// Expose metrics data for the metrics dashboard is now imported from api-gateway.ts

/**
 * Ekstrak nama layanan dari path API
 */
function getServiceFromPath(path: string): string {
  // Path format: /api/[service]/...
  const parts = path.split('/');
  if (parts.length >= 3 && parts[1] === 'api') {
    return parts[2];
  }
  return 'unknown';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle API routes differently
  if (pathname.startsWith('/api/')) {
    // Skip certain API routes from middleware processing
    if (
      pathname.includes('/api/swagger') ||
      pathname.includes('/api/auth/login') ||
      pathname.includes('/api/auth/register') ||
      pathname.includes('/api/auth/forgot-password') ||
      pathname.includes('/api/metrics')
    ) {
      return NextResponse.next();
    }
    
    // Start timing for API metrics using Web Performance API
    const startTime = Date.now();
    
    // For API routes, we'll let the API handlers handle auth
    // but we'll track metrics here
    const response = NextResponse.next();
    
    // Add a response header for tracking
    response.headers.set('X-API-Gateway', 'proker-tracker-gateway');
    
    // Add a custom header to track the start time
    // This is a workaround since Edge Runtime doesn't maintain state between requests
    response.headers.set('X-Request-Start-Time', startTime.toString());
    
    // Calculate response time using Date.now() for Edge Runtime compatibility
    try {
      // Extract user ID from JWT token if available
      let userId = null;
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = verify(token, JWT_SECRET) as any;
          userId = decoded.id;
        } catch (error) {
          // Invalid token, continue without user ID
        }
      }

      // Get IP address and user agent
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Simpan metrik ke memory global untuk diakses oleh API routes
      const metric = {
        path: pathname,
        method: request.method,
        statusCode: response.status,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        service: getServiceFromPath(pathname),
        userId,
        ipAddress,
        userAgent
      };
      
      // Simpan metrik langsung ke database melalui API endpoint
      try {
        // Gunakan fetch untuk memanggil endpoint /api/metrics/store
        fetch('http://localhost:3000/api/metrics/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metric),
        }).then(res => {
          if (res.ok) {
            console.log(`Metric recorded for ${pathname} and sent to database`);
          } else {
            console.error(`Failed to send metric for ${pathname} to database: ${res.status}`);
          }
        }).catch(err => {
          console.error(`Error sending metric for ${pathname} to database:`, err);
        });
      } catch (fetchError) {
        console.error('Error sending metric to API:', fetchError);
        
        // Fallback: simpan ke memory global jika gagal mengirim ke API
        const globalMetrics = (globalThis as any).__PROKER_TRACKER__ = (globalThis as any).__PROKER_TRACKER__ || {};
        globalMetrics.apiMetrics = globalMetrics.apiMetrics || [];
        globalMetrics.apiMetrics.push(metric);
        
        // Batasi jumlah metrik di memory
        if (globalMetrics.apiMetrics.length > 1000) {
          globalMetrics.apiMetrics.splice(0, globalMetrics.apiMetrics.length - 1000);
        }
        
        console.log(`Metric recorded for ${pathname} (memory fallback)`);
      }
    } catch (error) {
      console.error('Error in middleware metrics:', error);
    }
    
    return response;
  }
  
  // For non-API routes, continue with the existing frontend auth logic
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
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png).*)'
  ],
}
