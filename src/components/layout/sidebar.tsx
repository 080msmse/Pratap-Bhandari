'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Zap,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  ChevronRight,
  Plus,
  Bell,
  BarChart2,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/team', label: 'Team', icon: Users },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-60 flex-shrink-0 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">ProjectFlow</span>
        </Link>
      </div>

      {/* Workspace */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {session?.user?.companyName?.[0] ?? 'W'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.companyName ?? 'My Workspace'}
              </p>
              <p className="text-xs text-gray-400 capitalize">{session?.user?.role?.toLowerCase() ?? 'member'}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-item', active && 'active')}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent Projects
            </span>
            <Link href="/projects" className="text-gray-400 hover:text-gray-600">
              <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RecentProjects />
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
        {bottomItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('sidebar-item', active && 'active')}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}

        {/* User */}
        <Link href="/settings/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Avatar
            src={session?.user?.image}
            name={session?.user?.name ?? undefined}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name ?? 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}

function RecentProjects() {
  // This will be populated via a small fetch — for now show placeholder
  return (
    <div className="space-y-0.5">
      <RecentProjectItem color="#4c6ef5" name="Website Redesign" href="/projects" />
      <RecentProjectItem color="#7950f2" name="Mobile App" href="/projects" />
      <RecentProjectItem color="#f03e3e" name="Marketing Q2" href="/projects" />
    </div>
  )
}

function RecentProjectItem({ color, name, href }: { color: string; name: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{name}</span>
    </Link>
  )
}
