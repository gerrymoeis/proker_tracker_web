import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proker_tracker_web',
};

// Create a connection pool
export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Execute a query with parameters
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results as T;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await connection.end();
  }
}
