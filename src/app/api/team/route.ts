import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/team — list all members
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const members = await prisma.member.findMany({
    where: { companyId: session.user.companyId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
    },
    orderBy: { joinedAt: 'asc' },
  })

  return NextResponse.json(members)
}

// POST /api/team — invite member
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { email, role } = body

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  // Check if user exists in the system
  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    // Check if already a member
    const existing = await prisma.member.findFirst({
      where: { userId: user.id, companyId: session.user.companyId },
    })
    if (existing) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
    }

    // Add directly
    const member = await prisma.member.create({
      data: {
        userId: user.id,
        companyId: session.user.companyId,
        role: role || 'MEMBER',
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    })

    await prisma.activity.create({
      data: {
        type: 'MEMBER_INVITED',
        userId: session.user.id,
        data: JSON.stringify({ invitedEmail: email }),
      },
    })

    return NextResponse.json(member, { status: 201 })
  }

  // Create invitation
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const invitation = await prisma.invitation.create({
    data: {
      email,
      companyId: session.user.companyId,
      role: role || 'MEMBER',
      expiresAt,
    },
  })

  return NextResponse.json({ invited: true, email, invitationId: invitation.id }, { status: 201 })
}
