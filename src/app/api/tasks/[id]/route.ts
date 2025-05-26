import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get a single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    // Verify token
    verify(token, JWT_SECRET);

    // Get task by ID
    const tasks = await executeQuery<any[]>(
      `SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.due_date, 
        t.status,
        t.priority,
        t.created_at,
        t.updated_at,
        p.id as program_id,
        p.name as program_name,
        u.id as assignee_id,
        u.name as assignee_name,
        c.name as creator_name
      FROM 
        tasks t
      LEFT JOIN 
        programs p ON t.program_id = p.id
      LEFT JOIN 
        users u ON t.assignee_id = u.id
      LEFT JOIN
        users c ON t.created_by = c.id
      WHERE 
        t.id = ?`,
      [params.id]
    );

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: tasks[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data tugas' },
      { status: 500 }
    );
  }
}

// Update a task by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { 
      id: number; 
      role: string;
    };

    // Get request body
    const updates = await request.json();

    // Check if task exists
    const existingTasks = await executeQuery<any[]>(
      'SELECT * FROM tasks WHERE id = ?',
      [params.id]
    );

    if (existingTasks.length === 0) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    // Build update query
    const allowedFields = ['name', 'description', 'due_date', 'program_id', 'assignee_id', 'priority', 'status'];
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang diperbarui' },
        { status: 400 }
      );
    }

    // Add updated_at and updated_by
    updateFields.push('updated_at = NOW()');
    updateFields.push('updated_by = ?');
    updateValues.push(decoded.id);

    // Add task ID to values
    updateValues.push(params.id);

    // Execute update query
    await executeQuery(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated task
    const updatedTasks = await executeQuery<any[]>(
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
      [params.id]
    );

    return NextResponse.json(
      { 
        message: 'Tugas berhasil diperbarui', 
        task: updatedTasks[0] 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui tugas' },
      { status: 500 }
    );
  }
}

// Delete a task by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { 
      id: number; 
      role: string;
    };

    // Check if user has permission to delete tasks
    const allowedRoles = ['admin', 'ketua', 'wakil_ketua', 'kepala_departemen'];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Tidak memiliki izin untuk menghapus tugas' },
        { status: 403 }
      );
    }

    // Check if task exists
    const existingTasks = await executeQuery<any[]>(
      'SELECT * FROM tasks WHERE id = ?',
      [params.id]
    );

    if (existingTasks.length === 0) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete task
    await executeQuery(
      'DELETE FROM tasks WHERE id = ?',
      [params.id]
    );

    return NextResponse.json(
      { message: 'Tugas berhasil dihapus' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus tugas' },
      { status: 500 }
    );
  }
}
