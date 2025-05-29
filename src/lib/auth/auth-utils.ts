import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/db';

// Type for decoded JWT token
export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify and decode JWT token
 * @param token JWT token to verify
 * @returns User data if token is valid, null otherwise
 */
export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return null;
    }
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    // Check if user exists in database
    const users = await executeQuery<any[]>(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return null;
    }
    
    return {
      id: users[0].id,
      email: users[0].email,
      name: users[0].name,
      role: users[0].role || 'user'
    };
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return null;
  }
}
