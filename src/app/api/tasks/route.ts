import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST /api/tasks — create task
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, priority, dueDate, assigneeId, columnId, projectId, labels } = body

  if (!title?.trim() || !columnId || !projectId) {
    return NextResponse.json({ error: 'title, columnId and projectId are required' }, { status: 400 })
  }

  // Verify project belongs to company
  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId: session.user.companyId },
  })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Get max order in column
  const maxOrder = await prisma.task.aggregate({
    where: { columnId },
    _max: { order: true },
  })

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId: assigneeId || null,
      columnId,
      projectId,
      order: (maxOrder._max.order ?? -1) + 1,
      labels: labels ? JSON.stringify(labels) : null,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      _count: { select: { comments: true } },
    },
  })

  await prisma.activity.create({
    data: {
      type: 'TASK_CREATED',
      userId: session.user.id,
      projectId,
      taskId: task.id,
      data: JSON.stringify({ taskTitle: task.title }),
    },
  })

  return NextResponse.json(task, { status: 201 })
}
