'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  FolderKanban,
  CheckSquare,
  Users,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Avatar } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/ui/badge'
import { formatRelativeTime, formatDate } from '@/lib/utils'

interface DashboardData {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  teamSize: number
  completionRate: number
  recentActivities: any[]
  recentProjects: any[]
  tasksByPriority: any[]
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: any
  label: string
  value: number | string
  sub?: string
  color: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    TASK_CREATED: '✅',
    TASK_COMPLETED: '🎉',
    TASK_MOVED: '↕️',
    TASK_ASSIGNED: '👤',
    COMMENT_ADDED: '💬',
    PROJECT_CREATED: '📁',
    MEMBER_JOINED: '👋',
    MEMBER_INVITED: '📧',
  }
  return <span className="text-base">{icons[type] ?? '📌'}</span>
}

function activityMessage(activity: any): string {
  const name = activity.user?.name ?? 'Someone'
  const taskTitle = activity.task?.title ?? ''
  const projectName = activity.project?.name ?? ''

  switch (activity.type) {
    case 'TASK_CREATED': return `${name} created "${taskTitle}"`
    case 'TASK_COMPLETED': return `${name} completed "${taskTitle}"`
    case 'TASK_MOVED': return `${name} moved "${taskTitle}"`
    case 'COMMENT_ADDED': return `${name} commented on "${taskTitle}"`
    case 'PROJECT_CREATED': return `${name} created project "${projectName}"`
    case 'MEMBER_JOINED': return `${name} joined the workspace`
    case 'MEMBER_INVITED': return `${name} invited a new member`
    default: return `${name} made a change`
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div>
      <Header
        title="Dashboard"
        actions={
          <Link href="/projects" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        }
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {greeting}, {firstName}! 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 h-28 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FolderKanban}
              label="Total Projects"
              value={data?.totalProjects ?? 0}
              sub="Active workspaces"
              color="bg-brand-50 text-brand-600"
            />
            <StatCard
              icon={CheckSquare}
              label="Tasks Done"
              value={`${data?.completedTasks ?? 0}/${data?.totalTasks ?? 0}`}
              sub={`${data?.completionRate ?? 0}% completion rate`}
              color="bg-green-50 text-green-600"
            />
            <StatCard
              icon={AlertCircle}
              label="Overdue Tasks"
              value={data?.overdueTasks ?? 0}
              sub="Need attention"
              color="bg-red-50 text-red-600"
            />
            <StatCard
              icon={Users}
              label="Team Members"
              value={data?.teamSize ?? 0}
              sub="Active in workspace"
              color="bg-purple-50 text-purple-600"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Projects</h3>
              <Link href="/projects" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-50 rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : data?.recentProjects?.length ? (
                data.recentProjects.map((project: any) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-brand-600">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-400">{project._count.tasks} tasks</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 flex-shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-gray-400">
                  No projects yet.{' '}
                  <Link href="/projects" className="text-brand-600 hover:underline">
                    Create your first one
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="overflow-y-auto max-h-80">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-7 h-7 rounded-full bg-gray-100" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-2 bg-gray-50 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.recentActivities?.length ? (
                <div className="divide-y divide-gray-50">
                  {data.recentActivities.map((activity: any) => (
                    <div key={activity.id} className="flex gap-3 px-5 py-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Avatar
                          src={activity.user?.image}
                          name={activity.user?.name}
                          size="xs"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 leading-snug">
                          {activityMessage(activity)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {!loading && data && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Overall Progress</h3>
              <span className="text-sm text-brand-600 font-semibold">{data.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-brand-500 to-brand-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${data.completionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span>{data.completedTasks} tasks completed</span>
              <span>{data.totalTasks - data.completedTasks} remaining</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
