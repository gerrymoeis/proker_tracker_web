import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if the database tables exist by querying the users table
    const tablesExist = await executeQuery<any[]>(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'proker_tracker_web' 
      AND TABLE_NAME = 'users'
    `);

    if (tablesExist.length === 0) {
      return NextResponse.json({
        message: 'Database tables not found. Please run the migration scripts in docs/migrate.sql and docs/schema.sql',
        success: false
      }, { status: 500 });
    }

    // Check if admin user exists, if not create a default admin
    const adminUsers = await executeQuery<any[]>(`
      SELECT id FROM users WHERE email = 'admin@prokertracker.com'
    `);

    if (adminUsers.length === 0) {
      // Hash password for admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Insert default admin user
      await executeQuery(`
        INSERT INTO users (name, email, password, organization_name, role)
        VALUES ('Administrator', 'admin@prokertracker.com', ?, 'Himafortic', 'admin')
      `, [hashedPassword]);

      // Also add the admin user to the organization_members table
      const adminId = await executeQuery<any>(`SELECT LAST_INSERT_ID() as id`);
      const organizationId = await executeQuery<any[]>(`SELECT id FROM organizations WHERE name = 'Himafortic' LIMIT 1`);
      
      if (organizationId.length > 0) {
        await executeQuery(`
          INSERT INTO organization_members (organization_id, user_id, role)
          VALUES (?, ?, 'admin')
        `, [organizationId[0].id, adminId[0].id]);
      }
    }

    return NextResponse.json({
      message: 'Database check completed successfully',
      success: true
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { message: 'Error running migrations', error: String(error) },
      { status: 500 }
    );
  }
}
