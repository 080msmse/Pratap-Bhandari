import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/projects/[id] — get project with columns and tasks
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const project = await prisma.project.findFirst({
    where: { id: params.id, companyId: session.user.companyId },
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            orderBy: { order: 'asc' },
            include: {
              assignee: { select: { id: true, name: true, email: true, image: true } },
              _count: { select: { comments: true } },
            },
          },
        },
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json(project)
}

// PATCH /api/projects/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, color, icon, status } = body

  const project = await prisma.project.findFirst({
    where: { id: params.id, companyId: session.user.companyId },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(color && { color }),
      ...(icon && { icon }),
      ...(status && { status }),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const project = await prisma.project.findFirst({
    where: { id: params.id, companyId: session.user.companyId },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.project.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
