import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const companyId = session.user.companyId

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    teamSize,
    recentActivities,
    tasksByPriority,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count({ where: { companyId } }),
    prisma.task.count({ where: { project: { companyId } } }),
    prisma.task.count({ where: { project: { companyId }, completedAt: { not: null } } }),
    prisma.task.count({
      where: {
        project: { companyId },
        completedAt: null,
        dueDate: { lt: new Date() },
      },
    }),
    prisma.member.count({ where: { companyId } }),
    prisma.activity.findMany({
      where: { user: { memberships: { some: { companyId } } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        project: { select: { id: true, name: true, color: true } },
        task: { select: { id: true, title: true } },
      },
    }),
    prisma.task.groupBy({
      by: ['priority'],
      where: { project: { companyId }, completedAt: null },
      _count: true,
    }),
    prisma.project.findMany({
      where: { companyId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        _count: { select: { tasks: true } },
      },
    }),
  ])

  return NextResponse.json({
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    teamSize,
    recentActivities,
    tasksByPriority,
    recentProjects,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  })
}
