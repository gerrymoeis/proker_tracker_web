import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/auth-utils';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await verifyJwtToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin privileges required.' }, { status: 403 });
    }

    // Check if migrations table exists
    const migrationsTableExists = await executeQuery<any[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'migrations'`
    );

    // Create migrations table if it doesn't exist
    if (migrationsTableExists[0].count === 0) {
      await executeQuery(`
        CREATE TABLE migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          applied_at DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    }

    // Get list of applied migrations
    const appliedMigrations = await executeQuery<any[]>(
      'SELECT name FROM migrations ORDER BY id ASC'
    );

    return NextResponse.json({ 
      migrations: appliedMigrations.map(m => m.name),
      message: 'Migrations retrieved successfully' 
    });
  } catch (error) {
    console.error('Error retrieving migrations:', error);
    return NextResponse.json({ error: 'Failed to retrieve migrations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await verifyJwtToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin privileges required.' }, { status: 403 });
    }

    const { migration } = await request.json();
    
    if (!migration) {
      return NextResponse.json({ error: 'Migration name is required' }, { status: 400 });
    }

    // Check if migrations table exists
    const migrationsTableExists = await executeQuery<any[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'migrations'`
    );

    // Create migrations table if it doesn't exist
    if (migrationsTableExists[0].count === 0) {
      await executeQuery(`
        CREATE TABLE migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          applied_at DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    }

    // Check if migration has already been applied
    const migrationExists = await executeQuery<any[]>(
      'SELECT COUNT(*) as count FROM migrations WHERE name = ?',
      [migration]
    );

    if (migrationExists[0].count > 0) {
      return NextResponse.json({ 
        message: `Migration '${migration}' has already been applied` 
      });
    }

    // Apply the migration based on the name
    let migrationResult;
    
    switch (migration) {
      case 'create_comments_table':
        // Check if the table already exists
        const commentsTableExists = await executeQuery<any[]>(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = DATABASE() AND table_name = 'comments'`
        );

        if (commentsTableExists[0].count === 0) {
          await executeQuery(`
            CREATE TABLE comments (
              id INT AUTO_INCREMENT PRIMARY KEY,
              task_id INT NOT NULL,
              user_id INT NOT NULL,
              content TEXT NOT NULL,
              created_at DATETIME NOT NULL,
              updated_at DATETIME NOT NULL,
              FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          `);
          migrationResult = 'Comments table created successfully';
        } else {
          migrationResult = 'Comments table already exists';
        }
        break;
        
      default:
        return NextResponse.json({ error: `Unknown migration: ${migration}` }, { status: 400 });
    }

    // Record the migration
    await executeQuery(
      'INSERT INTO migrations (name, applied_at) VALUES (?, NOW())',
      [migration]
    );

    return NextResponse.json({ 
      message: `Migration '${migration}' applied successfully`,
      details: migrationResult
    });
  } catch (error) {
    console.error('Error applying migration:', error);
    return NextResponse.json({ error: 'Failed to apply migration' }, { status: 500 });
  }
}
