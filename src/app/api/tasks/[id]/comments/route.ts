import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const task = await prisma.task.findFirst({
    where: { id: params.id, project: { companyId: session.user.companyId } },
  })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      taskId: params.id,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
    },
  })

  await prisma.activity.create({
    data: {
      type: 'COMMENT_ADDED',
      userId: session.user.id,
      projectId: task.projectId,
      taskId: task.id,
      data: JSON.stringify({ taskTitle: task.title }),
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
