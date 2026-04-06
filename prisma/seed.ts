import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo company
  const company = await prisma.company.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      plan: 'PRO',
    },
  })

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo1234', 12)

  const owner = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'admin@acme.com',
      password: hashedPassword,
      image: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=4c6ef5&color=fff',
    },
  })

  const member1 = await prisma.user.upsert({
    where: { email: 'sarah@acme.com' },
    update: {},
    create: {
      name: 'Sarah Chen',
      email: 'sarah@acme.com',
      password: hashedPassword,
      image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=7950f2&color=fff',
    },
  })

  const member2 = await prisma.user.upsert({
    where: { email: 'mike@acme.com' },
    update: {},
    create: {
      name: 'Mike Torres',
      email: 'mike@acme.com',
      password: hashedPassword,
      image: 'https://ui-avatars.com/api/?name=Mike+Torres&background=f03e3e&color=fff',
    },
  })

  // Create memberships
  await prisma.member.upsert({
    where: { userId_companyId: { userId: owner.id, companyId: company.id } },
    update: {},
    create: { userId: owner.id, companyId: company.id, role: 'OWNER' },
  })

  await prisma.member.upsert({
    where: { userId_companyId: { userId: member1.id, companyId: company.id } },
    update: {},
    create: { userId: member1.id, companyId: company.id, role: 'ADMIN' },
  })

  await prisma.member.upsert({
    where: { userId_companyId: { userId: member2.id, companyId: company.id } },
    update: {},
    create: { userId: member2.id, companyId: company.id, role: 'MEMBER' },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design',
      color: '#4c6ef5',
      icon: 'globe',
      companyId: company.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build iOS and Android apps for our platform',
      color: '#7950f2',
      icon: 'smartphone',
      companyId: company.id,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Q2 Marketing Campaign',
      description: 'Social media and content marketing campaign for Q2',
      color: '#f03e3e',
      icon: 'megaphone',
      companyId: company.id,
    },
  })

  // Create columns for each project
  const createColumns = async (projectId: string) => {
    const col1 = await prisma.column.create({
      data: { name: 'Backlog', color: '#868e96', order: 0, projectId, isDefault: false },
    })
    const col2 = await prisma.column.create({
      data: { name: 'To Do', color: '#4dabf7', order: 1, projectId, isDefault: true },
    })
    const col3 = await prisma.column.create({
      data: { name: 'In Progress', color: '#ffd43b', order: 2, projectId },
    })
    const col4 = await prisma.column.create({
      data: { name: 'In Review', color: '#f783ac', order: 3, projectId },
    })
    const col5 = await prisma.column.create({
      data: { name: 'Done', color: '#69db7c', order: 4, projectId },
    })
    return [col1, col2, col3, col4, col5]
  }

  const cols1 = await createColumns(project1.id)
  const cols2 = await createColumns(project2.id)
  const cols3 = await createColumns(project3.id)

  // Create tasks for project 1
  const tasks1 = [
    { title: 'Design new homepage mockup', columnId: cols1[2].id, priority: 'HIGH', assigneeId: member1.id },
    { title: 'Implement responsive navigation', columnId: cols1[2].id, priority: 'HIGH', assigneeId: owner.id },
    { title: 'Write copy for About page', columnId: cols1[1].id, priority: 'MEDIUM', assigneeId: member1.id },
    { title: 'Set up analytics tracking', columnId: cols1[1].id, priority: 'LOW', assigneeId: member2.id },
    { title: 'Optimize images for performance', columnId: cols1[3].id, priority: 'MEDIUM', assigneeId: member2.id },
    { title: 'Launch new website', columnId: cols1[4].id, priority: 'URGENT', assigneeId: owner.id, completedAt: new Date() },
    { title: 'Update footer links', columnId: cols1[4].id, priority: 'LOW', assigneeId: member1.id, completedAt: new Date() },
    { title: 'Create 404 error page', columnId: cols1[0].id, priority: 'LOW', assigneeId: null },
  ]

  for (let i = 0; i < tasks1.length; i++) {
    await prisma.task.create({
      data: { ...tasks1[i], projectId: project1.id, order: i, dueDate: new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000) },
    })
  }

  // Create tasks for project 2
  const tasks2 = [
    { title: 'Define app architecture', columnId: cols2[4].id, priority: 'URGENT', assigneeId: owner.id, completedAt: new Date() },
    { title: 'Set up React Native project', columnId: cols2[2].id, priority: 'HIGH', assigneeId: member2.id },
    { title: 'Design onboarding screens', columnId: cols2[2].id, priority: 'HIGH', assigneeId: member1.id },
    { title: 'Implement user authentication', columnId: cols2[3].id, priority: 'URGENT', assigneeId: owner.id },
    { title: 'Build home dashboard', columnId: cols2[1].id, priority: 'MEDIUM', assigneeId: member2.id },
    { title: 'Integrate push notifications', columnId: cols2[0].id, priority: 'LOW', assigneeId: null },
  ]

  for (let i = 0; i < tasks2.length; i++) {
    await prisma.task.create({
      data: { ...tasks2[i], projectId: project2.id, order: i, dueDate: new Date(Date.now() + (i + 2) * 5 * 24 * 60 * 60 * 1000) },
    })
  }

  // Create tasks for project 3
  const tasks3 = [
    { title: 'Define campaign goals & KPIs', columnId: cols3[4].id, priority: 'HIGH', assigneeId: owner.id, completedAt: new Date() },
    { title: 'Create content calendar', columnId: cols3[2].id, priority: 'HIGH', assigneeId: member1.id },
    { title: 'Design social media assets', columnId: cols3[1].id, priority: 'MEDIUM', assigneeId: member1.id },
    { title: 'Write blog posts (x4)', columnId: cols3[2].id, priority: 'MEDIUM', assigneeId: member2.id },
    { title: 'Set up email automation', columnId: cols3[1].id, priority: 'LOW', assigneeId: member2.id },
  ]

  for (let i = 0; i < tasks3.length; i++) {
    await prisma.task.create({
      data: { ...tasks3[i], projectId: project3.id, order: i, dueDate: new Date(Date.now() + (i + 1) * 4 * 24 * 60 * 60 * 1000) },
    })
  }

  console.log('✅ Seed complete!')
  console.log('Demo login: admin@acme.com / demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
