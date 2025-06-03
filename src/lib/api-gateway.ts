import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from './api-auth';

// Types for metrics tracking
export type ApiMetric = {
  path: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string; // Using string instead of Date for Edge Runtime compatibility
  service: string;
  userId?: number | null; // Optional user ID for authenticated requests
  ipAddress?: string | null; // Optional IP address of the client
  userAgent?: string | null; // Optional user agent of the client
};

// Create a specific namespace for our application in globalThis
// This helps avoid conflicts with other global variables
if (!(globalThis as any).__PROKER_TRACKER__) {
  console.log('Initializing Proker Tracker global namespace');
  (globalThis as any).__PROKER_TRACKER__ = {
    apiMetrics: []
  };
}

// Get a reference to our application namespace
const globalMetrics = (globalThis as any).__PROKER_TRACKER__;

// For debugging
console.log(`Current global metrics count: ${globalMetrics.apiMetrics ? globalMetrics.apiMetrics.length : 0}`);

// Function to access the global metrics array
function getGlobalApiMetrics(): ApiMetric[] {
  console.log(`Getting global metrics, count: ${globalMetrics.apiMetrics.length}`);
  return globalMetrics.apiMetrics || [];
}

// Function to add a metric to the global array
export function addGlobalApiMetric(metric: ApiMetric): void {
  if (!globalMetrics.apiMetrics) {
    console.log('Re-initializing global metrics array in addGlobalApiMetric');
    globalMetrics.apiMetrics = [];
  }
  
  globalMetrics.apiMetrics.push(metric);
  console.log(`Added metric for ${metric.path}, count now: ${globalMetrics.apiMetrics.length}`);
  
  // Limit stored metrics to prevent memory issues
  if (globalMetrics.apiMetrics.length > 1000) {
    globalMetrics.apiMetrics = globalMetrics.apiMetrics.slice(-1000);
    console.log(`Trimmed metrics to 1000, new count: ${globalMetrics.apiMetrics.length}`);
  }
}

// Get metrics data
export function getApiMetrics(): ApiMetric[] {
  return getGlobalApiMetrics();
}

// Clear metrics data (for testing or to prevent memory issues)
export function clearApiMetrics(): void {
  globalMetrics.apiMetrics = [];
}

// Get aggregated metrics by service
export function getMetricsByService() {
  const metrics = getGlobalApiMetrics();
  // Using Array.from instead of spread operator for better compatibility
  const services = Array.from(new Set(metrics.map(metric => metric.service)));
  
  return services.map(service => {
    const serviceMetrics = metrics.filter(metric => metric.service === service);
    const totalRequests = serviceMetrics.length;
    const avgResponseTime = serviceMetrics.reduce((sum: number, metric: ApiMetric) => sum + metric.responseTime, 0) / totalRequests;
    const successRequests = serviceMetrics.filter((metric: ApiMetric) => metric.statusCode >= 200 && metric.statusCode < 300).length;
    const errorRequests = totalRequests - successRequests;
    
    return {
      service,
      totalRequests,
      avgResponseTime,
      successRate: (successRequests / totalRequests) * 100,
      errorRate: (errorRequests / totalRequests) * 100,
    };
  });
}

// Service map to categorize endpoints
const serviceMap: Record<string, string> = {
  '/api/auth': 'auth-service',
  '/api/organizations': 'organization-service',
  '/api/members': 'member-service',
  '/api/programs': 'program-service',
  '/api/tasks': 'task-service',
  '/api/comments': 'comment-service',
  '/api/departments': 'department-service',
  '/api/users': 'user-service',
  '/api/stats': 'stats-service',
};

// Determine which service an API path belongs to
function determineService(path: string): string {
  for (const [prefix, service] of Object.entries(serviceMap)) {
    if (path.startsWith(prefix)) {
      return service;
    }
  }
  return 'unknown-service';
}

// Main API Gateway handler
export async function handleApiRequest(
  req: NextRequest,
  path: string,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Check if we have a start time from middleware in headers
  let startTime = Date.now(); // Default to current time
  const requestStartTimeHeader = req.headers.get('X-Request-Start-Time');
  
  if (requestStartTimeHeader) {
    try {
      // Use the start time from middleware if available
      startTime = parseInt(requestStartTimeHeader, 10);
      console.log(`Using start time from header: ${startTime}`);
    } catch (error) {
      console.error('Error parsing start time from header:', error);
    }
  }
  let statusCode = 200;
  let response: NextResponse;

  try {
    // Authentication check for protected routes
    // Skip auth for swagger, login, register, and other public endpoints
    if (
      !path.includes('/api/swagger') &&
      !path.includes('/api/auth/login') &&
      !path.includes('/api/auth/register') &&
      !path.includes('/api/auth/forgot-password')
    ) {
      const { decoded, response: authResponse } = await verifyAuth();
      
      if (authResponse) {
        statusCode = authResponse.status;
        response = authResponse;
        return response;
      }
      
      if (!decoded) {
        statusCode = 401;
        response = NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 401 }
        );
        return response;
      }
    }

    // Execute the original handler
    response = await handler();
    statusCode = response.status;
    
  } catch (error) {
    console.error(`API Gateway Error for ${path}:`, error);
    statusCode = 500;
    response = NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    // Record metrics
    const endTime = Date.now(); // Using Date.now() instead of performance.now() for Edge Runtime compatibility
    const responseTime = endTime - startTime;
    const service = determineService(path);
    
    // Use the global function to add metrics
    addGlobalApiMetric({
      path,
      method: req.method,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString(), // Using ISO string for Edge Runtime compatibility
      service,
    });
  }

  return response;
}
