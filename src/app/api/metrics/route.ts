import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/api-auth';
import { ApiMetric } from '@/lib/api-gateway';
import { executeQuery } from '@/lib/db';

/**
 * Mengambil metrik API dari database
 */
async function getMetricsFromDB(limit = 1000): Promise<ApiMetric[]> {
  try {
    const query = `
      SELECT 
        path, 
        method, 
        status_code as statusCode, 
        response_time as responseTime, 
        timestamp, 
        service,
        user_id as userId,
        ip_address as ipAddress,
        user_agent as userAgent
      FROM api_metrics 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    
    const results = await executeQuery(query, [limit]);
    
    // Convert database results to ApiMetric format
    const metrics = results.map((row: any) => ({
      path: row.path,
      method: row.method,
      statusCode: row.statusCode,
      responseTime: row.responseTime,
      timestamp: new Date(row.timestamp).toISOString(),
      service: row.service,
      userId: row.userId,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent
    }));
    
    console.log(`Retrieved ${metrics.length} metrics from database`);
    return metrics;
  } catch (error) {
    console.error('Error retrieving metrics from database:', error);
    return [];
  }
}

/**
 * Membersihkan metrik lama dari database
 */
async function pruneOldMetricsInDB(daysToKeep = 30): Promise<number> {
  try {
    const query = `
      DELETE FROM api_metrics 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    
    const result = await executeQuery(query, [daysToKeep]);
    const rowsDeleted = result.affectedRows || 0;
    console.log(`Pruned old metrics: ${rowsDeleted} rows deleted`);
    return rowsDeleted;
  } catch (error) {
    console.error('Error pruning old metrics:', error);
    return 0;
  }
}

/**
 * Helper function to parse ISO string to Date
 */
function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Process time series data for charts (last 24 hours)
 */
function processTimeSeriesData(metrics: ApiMetric[]) {
  // Create hourly buckets for the last 24 hours
  return Array.from({ length: 24 }, (_, i) => {
    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - (23 - i));
    hourAgo.setMinutes(0, 0, 0);
    
    const nextHour = new Date(hourAgo);
    nextHour.setHours(nextHour.getHours() + 1);
    
    const hourMetrics = metrics.filter(m => {
      const timestamp = parseDate(m.timestamp);
      return timestamp >= hourAgo && timestamp < nextHour;
    });
    
    return {
      hour: hourAgo.getHours(),
      timestamp: hourAgo.toISOString(),
      requestCount: hourMetrics.length,
      avgResponseTime: hourMetrics.length > 0
        ? hourMetrics.reduce((sum, m) => sum + m.responseTime, 0) / hourMetrics.length
        : 0,
    };
  });
}

/**
 * Process service-specific metrics
 */
function processServiceMetrics(metrics: ApiMetric[]) {
  // Group metrics by service
  const serviceMap: Record<string, { count: number, totalResponseTime: number, success: number, error: number }> = {};
  
  metrics.forEach(metric => {
    const service = metric.service || 'unknown';
    if (!serviceMap[service]) {
      serviceMap[service] = { count: 0, totalResponseTime: 0, success: 0, error: 0 };
    }
    
    serviceMap[service].count++;
    serviceMap[service].totalResponseTime += metric.responseTime;
    
    if (metric.statusCode >= 200 && metric.statusCode < 300) {
      serviceMap[service].success++;
    } else {
      serviceMap[service].error++;
    }
  });
  
  // Convert to array for easier consumption
  return Object.entries(serviceMap).map(([service, data]) => ({
    service,
    count: data.count,
    avgResponseTime: data.count > 0 ? data.totalResponseTime / data.count : 0,
    successRate: data.count > 0 ? (data.success / data.count) * 100 : 0,
    errorRate: data.count > 0 ? (data.error / data.count) * 100 : 0
  })).sort((a, b) => b.count - a.count);
}

/**
 * Process status code distribution
 */
function processStatusCodeDistribution(metrics: ApiMetric[]) {
  const statusCodes: Record<number, number> = {};
  
  metrics.forEach(metric => {
    statusCodes[metric.statusCode] = (statusCodes[metric.statusCode] || 0) + 1;
  });
  
  return Object.entries(statusCodes)
    .map(([code, count]) => ({ code: parseInt(code), count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Process endpoint metrics
 */
function processEndpointMetrics(metrics: ApiMetric[]) {
  // Group metrics by path only (not method)
  const pathGroups: Record<string, ApiMetric[]> = {};
  
  metrics.forEach(metric => {
    const path = metric.path;
    if (!pathGroups[path]) {
      pathGroups[path] = [];
    }
    pathGroups[path].push(metric);
  });
  
  // Calculate statistics for each endpoint path
  const endpointStats = Object.entries(pathGroups).map(([path, pathMetrics]) => {
    // Calculate average response time
    const totalResponseTime = pathMetrics.reduce((sum, m) => sum + m.responseTime, 0);
    const avgResponseTime = pathMetrics.length > 0 ? totalResponseTime / pathMetrics.length : 0;
    
    // Group by methods
    const methodCounts: Record<string, number> = {};
    pathMetrics.forEach(m => {
      methodCounts[m.method] = (methodCounts[m.method] || 0) + 1;
    });
    
    // Convert to array format expected by frontend
    const methods = Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count
    }));
    
    // Count status codes
    const statusCodeCounts: Record<number, number> = {};
    pathMetrics.forEach(m => {
      statusCodeCounts[m.statusCode] = (statusCodeCounts[m.statusCode] || 0) + 1;
    });
    
    // Convert to array format for frontend
    const statusCodes = Object.entries(statusCodeCounts).map(([code, count]) => ({
      code,
      count
    }));
    
    // Find most common status code
    let mostCommonStatusCode = 200;
    let maxCount = 0;
    Object.entries(statusCodeCounts).forEach(([code, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonStatusCode = parseInt(code);
      }
    });
    
    // Calculate success rate (2xx status codes)
    const successfulRequests = pathMetrics.filter(m => m.statusCode >= 200 && m.statusCode < 300).length;
    const successRate = pathMetrics.length > 0 ? (successfulRequests / pathMetrics.length) * 100 : 0;
    
    // Get timestamp of most recent request
    const timestamps = pathMetrics.map(m => new Date(m.timestamp).getTime());
    const mostRecentTimestamp = new Date(Math.max(...timestamps)).toISOString();
    
    return {
      path,
      requestCount: pathMetrics.length,
      avgResponseTime,
      methods, // Array of {method, count}
      statusCodes, // Array of {code, count}
      mostCommonStatusCode,
      successRate,
      mostRecentTimestamp,
      // Include raw metrics for detailed view if needed
      metrics: pathMetrics.slice(0, 10) // Limit to 10 most recent for performance
    };
  });
  
  // Sort by count (most frequently called endpoints first)
  return endpointStats.sort((a, b) => b.requestCount - a.requestCount);
}

/**
 * GET /api/metrics
 * @description Retrieves API metrics for visualization
 * @returns Processed metrics data
 */
export async function GET() {
  try {
    // Verify authentication - only admins should access metrics
    const { decoded, response } = await verifyAuth();
    
    // If authentication failed, return the error response
    if (response) {
      return response;
    }
    
    // Prune old metrics (older than 30 days) to keep database size manageable
    const prunedCount = await pruneOldMetricsInDB();
    console.log(`Pruned old metrics: ${prunedCount} rows deleted`);
    
    // Get metrics from database
    const metrics = await getMetricsFromDB(1000); // Limit to 1000 most recent metrics
    console.log(`Retrieved ${metrics.length} metrics from database`);
    
    // Calculate overall success rate
    const successfulRequests = metrics.filter(m => m.statusCode >= 200 && m.statusCode < 300).length;
    const successRate = metrics.length > 0 ? (successfulRequests / metrics.length) * 100 : 0;
    
    // Calculate average response time across all requests
    const totalResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0);
    const avgResponseTime = metrics.length > 0 ? totalResponseTime / metrics.length : 0;
    
    // Process all metrics data
    const processedData = {
      // Overall metrics
      totalRequests: metrics.length,
      avgResponseTime,
      successRate,
      
      // Time series data for charts
      timeSeriesData: processTimeSeriesData(metrics),
      
      // Service-specific metrics
      serviceMetrics: processServiceMetrics(metrics),
      
      // Endpoint performance
      endpointMetrics: processEndpointMetrics(metrics),
      
      // Status code distribution
      statusCodeDistribution: processStatusCodeDistribution(metrics),
      
      // Raw metrics for detailed view (limited to most recent 100)
      recentMetrics: metrics
        .sort((a, b) => parseDate(b.timestamp).getTime() - parseDate(a.timestamp).getTime())
        .slice(0, 100),
        
      // Timestamp of the request
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(
      { 
        message: 'Berhasil mendapatkan data metrik API',
        metrics: processedData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data metrik' },
      { status: 500 }
    );
  }
}
