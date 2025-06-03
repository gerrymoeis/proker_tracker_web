import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { ApiMetric } from '@/lib/api-gateway';

/**
 * POST /api/metrics/store
 * @description Menyimpan metrik API ke database
 * @body ApiMetric
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const metric = await request.json() as ApiMetric;
    
    // Validasi data metrik
    if (!metric || !metric.path || !metric.method || !metric.statusCode || !metric.timestamp) {
      return NextResponse.json(
        { error: 'Data metrik tidak valid' },
        { status: 400 }
      );
    }
    
    console.log('Storing metric to database:', JSON.stringify(metric));
    
    // Format timestamp untuk MySQL (YYYY-MM-DD HH:MM:SS)
    let formattedTimestamp;
    try {
      formattedTimestamp = new Date(metric.timestamp).toISOString().slice(0, 19).replace('T', ' ');
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      formattedTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    // Simpan metrik ke database
    const query = `
      INSERT INTO api_metrics 
      (path, method, status_code, response_time, timestamp, service, user_id, ip_address, user_agent) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    console.log(`Executing query with timestamp: ${formattedTimestamp}`);
    
    const result = await executeQuery(query, [
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
    
    console.log('Database insert result:', result);
    
    return NextResponse.json(
      { message: 'Metrik berhasil disimpan' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing metric:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan metrik' },
      { status: 500 }
    );
  }
}
