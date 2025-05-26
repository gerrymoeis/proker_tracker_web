import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth/auth-utils';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  
  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const comments = await executeQuery<any[]>(
      `SELECT c.*, u.name as author_name, u.profile_image as author_image
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.task_id = ?
       ORDER BY c.created_at DESC`,
      [taskId]
    );

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
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
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { taskId, content } = await request.json();

    if (!taskId || !content) {
      return NextResponse.json({ error: 'Task ID and content are required' }, { status: 400 });
    }

    // Check if the task exists
    const taskExists = await executeQuery<any[]>(
      'SELECT id FROM tasks WHERE id = ?',
      [taskId]
    );

    if (taskExists.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Insert the comment
    const result = await executeQuery<{ insertId: number }>(
      `INSERT INTO comments (task_id, user_id, content, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [taskId, user.id, content]
    );

    // Get the newly created comment with author information
    const newComment = await executeQuery<any[]>(
      `SELECT c.*, u.name as author_name, u.profile_image as author_image
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await verifyJwtToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    // Check if the comment exists and belongs to the user
    const comment = await executeQuery<any[]>(
      'SELECT * FROM comments WHERE id = ?',
      [commentId]
    );

    if (comment.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Only allow the comment author or an admin to delete the comment
    if (comment[0].user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to delete this comment' }, { status: 403 });
    }

    // Delete the comment
    await executeQuery(
      'DELETE FROM comments WHERE id = ?',
      [commentId]
    );

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
