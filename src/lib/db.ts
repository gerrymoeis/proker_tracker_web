import mysql from 'mysql2/promise';
import { ApiMetric } from './api-gateway';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proker_tracker_web',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Execute a query with parameters
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Menyimpan metrik API ke database
 * Fungsi ini hanya boleh dipanggil dari komponen server-side
 */
export async function storeApiMetric(metric: ApiMetric): Promise<boolean> {
  try {
    // Convert timestamp string to MySQL datetime format if needed
    const timestamp = typeof metric.timestamp === 'string' 
      ? new Date(metric.timestamp).toISOString().slice(0, 19).replace('T', ' ')
      : new Date().toISOString().slice(0, 19).replace('T', ' ');
    
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
      timestamp,
      metric.service || 'unknown',
      metric.userId || null,
      metric.ipAddress || null,
      metric.userAgent || null
    ]);
    
    console.log(`Stored metric for ${metric.path} in database`);
    return true;
  } catch (error) {
    console.error('Error storing API metric in database:', error);
    return false;
  }
}
