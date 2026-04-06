import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/tasks/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const task = await prisma.task.findFirst({
    where: {
      id: params.id,
      project: { companyId: session.user.companyId },
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      column: { select: { id: true, name: true, color: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  })

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(task)
}

// PATCH /api/tasks/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, priority, dueDate, assigneeId, columnId, order, labels, completedAt } = body

  // Verify access
  const existing = await prisma.task.findFirst({
    where: { id: params.id, project: { companyId: session.user.companyId } },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const wasCompleted = !!existing.completedAt
  const isNowComplete = completedAt !== undefined ? !!completedAt : wasCompleted

  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(assigneeId !== undefined && { assigneeId }),
      ...(columnId !== undefined && { columnId }),
      ...(order !== undefined && { order }),
      ...(labels !== undefined && { labels: JSON.stringify(labels) }),
      ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      column: { select: { id: true, name: true, color: true } },
      _count: { select: { comments: true } },
    },
  })

  // Log activity
  if (columnId && columnId !== existing.columnId) {
    await prisma.activity.create({
      data: {
        type: 'TASK_MOVED',
        userId: session.user.id,
        projectId: task.projectId,
        taskId: task.id,
        data: JSON.stringify({ taskTitle: task.title, newColumnId: columnId }),
      },
    })
  } else if (!wasCompleted && isNowComplete) {
    await prisma.activity.create({
      data: {
        type: 'TASK_COMPLETED',
        userId: session.user.id,
        projectId: task.projectId,
        taskId: task.id,
        data: JSON.stringify({ taskTitle: task.title }),
      },
    })
  }

  return NextResponse.json(task)
}

// DELETE /api/tasks/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const task = await prisma.task.findFirst({
    where: { id: params.id, project: { companyId: session.user.companyId } },
  })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
