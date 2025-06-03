/**
 * Modul untuk pengelolaan metrik API
 * Pendekatan sederhana untuk menyimpan dan mengambil metrik API
 */

import { ApiMetric } from './api-gateway';
import { storeApiMetric, executeQuery } from './db';

// Memory storage sebagai fallback
const METRICS_MEMORY: ApiMetric[] = [];

/**
 * Menyimpan metrik API
 * - Jika dipanggil dari server-side API route, akan menyimpan ke database
 * - Jika dipanggil dari middleware atau client-side, akan menyimpan ke memory
 */
export async function recordApiMetric(metric: ApiMetric): Promise<void> {
  // Simpan ke memory sebagai fallback
  METRICS_MEMORY.push(metric);
  
  // Batasi jumlah metrik di memory untuk mencegah memory leak
  if (METRICS_MEMORY.length > 1000) {
    METRICS_MEMORY.splice(0, METRICS_MEMORY.length - 1000);
  }
  
  // Coba simpan ke database jika berjalan di server-side API route
  try {
    // Cek apakah kode berjalan di server-side dan bukan di Edge Runtime
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
      await storeApiMetric(metric);
    }
  } catch (error) {
    console.error('Error recording API metric to database:', error);
    // Sudah disimpan ke memory, tidak perlu tindakan tambahan
  }
}

/**
 * Mengambil metrik API dari database
 * Hanya dapat dipanggil dari server-side API route
 */
export async function getApiMetrics(limit = 1000): Promise<ApiMetric[]> {
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
    // Fallback ke memory jika database tidak tersedia
    return [...METRICS_MEMORY];
  }
}

/**
 * Membersihkan metrik lama dari database
 */
export async function pruneOldMetrics(daysToKeep = 30): Promise<number> {
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
