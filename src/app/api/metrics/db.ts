import mysql from 'mysql2/promise';

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
 * Get metrics from database
 */
export async function getMetricsFromDB(limit = 1000): Promise<any[]> {
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
 * Prune old metrics from database
 * @param daysToKeep Number of days of metrics to keep
 */
export async function pruneOldMetricsInDB(daysToKeep = 30): Promise<number> {
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
