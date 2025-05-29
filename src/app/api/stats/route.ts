import { NextResponse } from 'next/server';
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
    
    console.log('Stats API: User authenticated successfully');
    // Get active programs count
    const activePrograms = await executeQuery<any[]>(`
      SELECT COUNT(*) as count
      FROM programs
      WHERE status = 'dalam_progres'
    `);

    // Get pending tasks count
    const pendingTasks = await executeQuery<any[]>(`
      SELECT COUNT(*) as count
      FROM tasks
      WHERE status = 'belum_dimulai' OR status = 'dalam_progres'
    `);

    // Get completed milestones count
    const completedMilestones = await executeQuery<any[]>(`
      SELECT COUNT(*) as count
      FROM milestones
      WHERE status = 'selesai'
    `);

    // Get active members count
    const activeMembers = await executeQuery<any[]>(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM organization_members
    `);

    const stats = {
      activePrograms: activePrograms[0]?.count || 0,
      pendingTasks: pendingTasks[0]?.count || 0,
      completedMilestones: completedMilestones[0]?.count || 0,
      activeMembers: activeMembers[0]?.count || 0
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data statistik' },
      { status: 500 }
    );
  }
}
