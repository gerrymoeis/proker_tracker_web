import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAuth } from '@/lib/api-auth';

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     description: Retrieve all tasks for the authenticated user's organization
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Terjadi kesalahan pada server
 */
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
            p.name as program_name
          FROM 
            tasks t
          LEFT JOIN 
            programs p ON t.program_id = p.id
          LEFT JOIN
            departments d ON p.department_id = d.id
          WHERE 
            p.organization_name = ?
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
            p.name as program_name
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

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     description: Create a new task for a specific program
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - program_id
 *               - due_date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               description:
 *                 type: string
 *                 description: Task description
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, review, completed]
 *                 default: todo
 *                 description: Task status
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *                 description: Task priority
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Task due date
 *               program_id:
 *                 type: integer
 *                 description: ID of the program this task belongs to
 *               assigned_to:
 *                 type: integer
 *                 description: ID of the user assigned to this task
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tugas berhasil dibuat
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Data tugas tidak lengkap
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Terjadi kesalahan pada server
 */
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
      priority, 
      status 
    } = await request.json();

    // Validate required fields
    if (!name || !description || !due_date || !program_id) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi' },
        { status: 400 }
      );
    }

    // Use a simplified query with only the essential fields
    const insertQuery = `INSERT INTO tasks (
      name, 
      description, 
      due_date, 
      program_id, 
      priority, 
      status, 
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    
    const queryParams = [
      name,
      description,
      due_date,
      program_id,
      priority || 'sedang',
      status || 'belum_dimulai'
    ];
    
    // Execute the query
    const result = await executeQuery<{ insertId?: number }>(insertQuery, queryParams);

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
        p.name as program_name
      FROM 
        tasks t
      LEFT JOIN 
        programs p ON t.program_id = p.id
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
