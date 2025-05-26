import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

export async function GET() {
  try {
    // Verify authentication
    const { decoded, response } = await verifyAuth();
    
    // If authentication failed, return the error response
    if (response) {
      return response;
    }
    
    // If we don't have a decoded token, something went wrong
    if (!decoded) {
      return NextResponse.json(
        { error: 'Terjadi kesalahan pada autentikasi' },
        { status: 500 }
      );
    }

    // Get all tasks for the user's organization with a more resilient query
    let tasks;
    
    try {
      // First check if assignee_id column exists in the tasks table
      const columnCheckResult = await executeQuery<any[]>(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'assignee_id'
      `);
      
      const hasAssigneeIdColumn = columnCheckResult.length > 0;
      console.log('Tasks API: assignee_id column exists:', hasAssigneeIdColumn);
      
      if (hasAssigneeIdColumn) {
        // Original query if the column exists
        tasks = await executeQuery<any[]>(`
          SELECT 
            t.id, 
            t.name, 
            t.description, 
            t.due_date, 
            t.status,
            t.priority,
            p.id as program_id,
            p.name as program_name,
            u.id as assignee_id,
            u.name as assignee_name
          FROM 
            tasks t
          LEFT JOIN 
            programs p ON t.program_id = p.id
          LEFT JOIN 
            users u ON t.assignee_id = u.id
          LEFT JOIN
            departments d ON p.department_id = d.id
          WHERE 
            u.organization_name = ?
          ORDER BY 
            t.due_date ASC
        `, [decoded.organization_name]);
      } else {
        // Fallback query if the column doesn't exist
        tasks = await executeQuery<any[]>(`
          SELECT 
            t.id, 
            t.name, 
            t.description, 
            t.due_date, 
            t.status,
            t.priority,
            p.id as program_id,
            p.name as program_name,
            NULL as assignee_id,
            NULL as assignee_name
          FROM 
            tasks t
          LEFT JOIN 
            programs p ON t.program_id = p.id
          LEFT JOIN
            departments d ON p.department_id = d.id
          ORDER BY 
            t.due_date ASC
        `);
      }
    } catch (error) {
      console.error('Error executing query:', error);
      
      // Fallback to a simpler query if the previous ones fail
      tasks = await executeQuery<any[]>(`
        SELECT 
          id, 
          name, 
          description, 
          due_date, 
          status,
          priority,
          program_id
        FROM 
          tasks
        ORDER BY 
          due_date ASC
      `);
    }
    
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data tugas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { decoded, response } = await verifyAuth();
    
    // If authentication failed, return the error response
    if (response) {
      return response;
    }
    
    // If we don't have a decoded token, something went wrong
    if (!decoded) {
      return NextResponse.json(
        { error: 'Terjadi kesalahan pada autentikasi' },
        { status: 500 }
      );
    }

    // Get request body
    const { 
      name, 
      description, 
      due_date, 
      program_id, 
      assignee_id, 
      priority, 
      status 
    } = await request.json();

    // Validate required fields
    if (!name || !description || !due_date || !program_id || !assignee_id) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi' },
        { status: 400 }
      );
    }

    // Insert new task
    const result = await executeQuery<{ insertId?: number }>(
      `INSERT INTO tasks (
        name, 
        description, 
        due_date, 
        program_id, 
        assignee_id, 
        priority, 
        status, 
        created_by, 
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        description,
        due_date,
        program_id,
        assignee_id,
        priority || 'sedang',
        status || 'belum_dimulai',
        decoded.id
      ]
    );

    if (!result.insertId) {
      throw new Error('Gagal membuat tugas');
    }

    // Get the newly created task
    const tasks = await executeQuery<any[]>(
      `SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.due_date, 
        t.status,
        t.priority,
        p.id as program_id,
        p.name as program_name,
        u.id as assignee_id,
        u.name as assignee_name
      FROM 
        tasks t
      LEFT JOIN 
        programs p ON t.program_id = p.id
      LEFT JOIN 
        users u ON t.assignee_id = u.id
      WHERE 
        t.id = ?`,
      [result.insertId]
    );

    if (tasks.length === 0) {
      throw new Error('Tugas berhasil dibuat tetapi gagal mengambil data');
    }

    return NextResponse.json(
      { 
        message: 'Tugas berhasil dibuat', 
        task: tasks[0] 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat tugas' },
      { status: 500 }
    );
  }
}
