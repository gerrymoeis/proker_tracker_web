import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/api-auth';
import { executeQuery } from '../db';

// Akses fungsi global metrics
const getGlobalApiMetrics = () => {
  const globalMetrics = (globalThis as any).__PROKER_TRACKER__;
  return globalMetrics?.apiMetrics || [];
};

const clearGlobalApiMetrics = () => {
  const globalMetrics = (globalThis as any).__PROKER_TRACKER__;
  if (globalMetrics) {
    globalMetrics.apiMetrics = [];
    console.log('Cleared global API metrics');
  }
};

/**
 * POST /api/metrics/sync
 * @description Sinkronisasi metrik dari memory ke database
 * @returns Status sinkronisasi
 */
export async function POST(request: Request) {
  try {
    // Verify authentication - only admins should access metrics
    const { decoded, response } = await verifyAuth();
    
    // If authentication failed, return the error response
    if (response) {
      // Cek apakah ini adalah request dari sistem internal
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const jwt = require('jsonwebtoken');
          const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
          const systemDecoded = jwt.verify(token, JWT_SECRET);
          
          // Verifikasi bahwa ini adalah token sistem untuk sinkronisasi metrik
          if (systemDecoded.id === 'system' && 
              systemDecoded.role === 'admin' && 
              systemDecoded.purpose === 'metrics_sync') {
            console.log('System metrics sync authenticated successfully');
            // Lanjutkan eksekusi jika ini adalah token sistem yang valid
          } else {
            return response; // Bukan token sistem yang valid
          }
        } catch (error) {
          console.error('Invalid system token:', error);
          return response;
        }
      } else {
        return response; // Tidak ada token
      }
    }

    // Get metrics from memory
    const metrics = getGlobalApiMetrics();
    console.log(`Syncing ${metrics.length} metrics from memory to database`);
    
    if (metrics.length === 0) {
      return NextResponse.json(
        { message: 'Tidak ada metrik untuk disinkronkan' },
        { status: 200 }
      );
    }
    
    // Insert metrics into database
    let successCount = 0;
    let errorCount = 0;
    
    for (const metric of metrics) {
      try {
        // Convert timestamp string to MySQL datetime format
        const formattedTimestamp = new Date(metric.timestamp).toISOString().slice(0, 19).replace('T', ' ');
        
        const query = `
          INSERT INTO api_metrics 
          (path, method, status_code, response_time, timestamp, service, user_id, ip_address, user_agent) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await executeQuery(query, [
          metric.path,
          metric.method,
          metric.statusCode,
          metric.responseTime,
          formattedTimestamp,
          metric.service || 'unknown',
          metric.userId || null,
          metric.ipAddress || null,
          metric.userAgent || null
        ]);
        
        successCount++;
      } catch (error) {
        console.error('Error syncing metric to database:', error);
        errorCount++;
      }
    }
    
    // Clear memory metrics after successful sync
    if (successCount > 0) {
      clearGlobalApiMetrics();
    }
    
    return NextResponse.json(
      { 
        message: 'Sinkronisasi metrik berhasil', 
        details: {
          total: metrics.length,
          success: successCount,
          error: errorCount
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in metrics sync API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat sinkronisasi metrik' },
      { status: 500 }
    );
  }
}
