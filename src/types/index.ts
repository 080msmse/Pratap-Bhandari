// ─── String union types (replacing Prisma enums for SQLite compat) ─────────

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
export type ActivityType =
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_MOVED'
  | 'TASK_COMPLETED'
  | 'TASK_ASSIGNED'
  | 'COMMENT_ADDED'
  | 'MEMBER_JOINED'
  | 'MEMBER_INVITED'
export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE'

// ─── Shared shapes ──────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
}

export interface CompanyWithPlan {
  id: string
  name: string
  slug: string
  logo: string | null
  plan: Plan
  createdAt: Date
}

export interface MemberWithUser {
  id: string
  role: MemberRole
  joinedAt: Date
  user: UserProfile
}

export interface ProjectWithStats {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  status: ProjectStatus
  companyId: string
  createdAt: Date
  updatedAt: Date
  _count: {
    tasks: number
    columns: number
  }
  completedTasks?: number
}

export interface ColumnWithTasks {
  id: string
  name: string
  color: string
  order: number
  projectId: string
  isDefault: boolean
  tasks: TaskWithDetails[]
}

export interface TaskWithDetails {
  id: string
  title: string
  description: string | null
  priority: Priority
  order: number
  dueDate: Date | null
  completedAt: Date | null
  labels: string | null
  columnId: string
  projectId: string
  assigneeId: string | null
  createdAt: Date
  updatedAt: Date
  assignee: UserProfile | null
  _count?: {
    comments: number
  }
}

export interface TaskFull extends TaskWithDetails {
  column: { id: string; name: string; color: string }
  comments: CommentWithAuthor[]
  activities: ActivityWithUser[]
}

export interface CommentWithAuthor {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: UserProfile
}

export interface ActivityWithUser {
  id: string
  type: ActivityType
  data: string | null
  createdAt: Date
  user: UserProfile
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  teamSize: number
  recentActivities: ActivityWithUser[]
}
