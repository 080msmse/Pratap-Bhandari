import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { generateSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, companyName } = body

    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique company slug
    let slug = generateSlug(companyName)
    const existingSlug = await prisma.company.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    // Create user + company + membership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4c6ef5&color=fff`,
        },
      })

      const company = await tx.company.create({
        data: { name: companyName, slug },
      })

      await tx.member.create({
        data: { userId: user.id, companyId: company.id, role: 'OWNER' },
      })

      // Create default project
      const project = await tx.project.create({
        data: {
          name: 'My First Project',
          description: 'Welcome! This is your first project.',
          color: '#4c6ef5',
          companyId: company.id,
        },
      })

      // Create default columns
      await tx.column.createMany({
        data: [
          { name: 'Backlog', color: '#868e96', order: 0, projectId: project.id },
          { name: 'To Do', color: '#4dabf7', order: 1, projectId: project.id, isDefault: true },
          { name: 'In Progress', color: '#ffd43b', order: 2, projectId: project.id },
          { name: 'Done', color: '#69db7c', order: 3, projectId: project.id },
        ],
      })

      await tx.activity.create({
        data: {
          type: 'MEMBER_JOINED',
          userId: user.id,
          projectId: project.id,
        },
      })

      return { user, company }
    })

    return NextResponse.json({
      message: 'Account created successfully',
      userId: result.user.id,
    })
  } catch (error) {
    console.error('[REGISTER]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
