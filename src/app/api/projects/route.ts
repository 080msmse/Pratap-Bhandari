import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/projects — list all projects for the current company
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { companyId: session.user.companyId },
    include: {
      _count: { select: { tasks: true, columns: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Add completed task count
  const projectsWithStats = await Promise.all(
    projects.map(async (p) => {
      const completedTasks = await prisma.task.count({
        where: { projectId: p.id, completedAt: { not: null } },
      })
      return { ...p, completedTasks }
    })
  )

  return NextResponse.json(projectsWithStats)
}

// POST /api/projects — create a new project
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, color, icon } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#4c6ef5',
      icon: icon || 'folder',
      companyId: session.user.companyId,
    },
  })

  // Create default columns
  await prisma.column.createMany({
    data: [
      { name: 'Backlog', color: '#868e96', order: 0, projectId: project.id },
      { name: 'To Do', color: '#4dabf7', order: 1, projectId: project.id, isDefault: true },
      { name: 'In Progress', color: '#ffd43b', order: 2, projectId: project.id },
      { name: 'In Review', color: '#f783ac', order: 3, projectId: project.id },
      { name: 'Done', color: '#69db7c', order: 4, projectId: project.id },
    ],
  })

  await prisma.activity.create({
    data: {
      type: 'PROJECT_CREATED',
      userId: session.user.id,
      projectId: project.id,
      data: JSON.stringify({ projectName: project.name }),
    },
  })

  return NextResponse.json(project, { status: 201 })
}
