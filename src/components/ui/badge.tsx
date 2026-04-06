import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { label: string; className: string }> = {
    URGENT: { label: 'Urgent', className: 'bg-red-50 text-red-700 border border-red-200' },
    HIGH: { label: 'High', className: 'bg-orange-50 text-orange-700 border border-orange-200' },
    MEDIUM: { label: 'Medium', className: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
    LOW: { label: 'Low', className: 'bg-green-50 text-green-700 border border-green-200' },
  }

  const { label, className } = config[priority] ?? config.MEDIUM

  return (
    <span className={cn('priority-badge', className)}>
      {label}
    </span>
  )
}

export function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; className: string }> = {
    OWNER: { label: 'Owner', className: 'bg-purple-50 text-purple-700' },
    ADMIN: { label: 'Admin', className: 'bg-blue-50 text-blue-700' },
    MEMBER: { label: 'Member', className: 'bg-gray-100 text-gray-700' },
    VIEWER: { label: 'Viewer', className: 'bg-gray-50 text-gray-500' },
  }

  const { label, className } = config[role] ?? config.MEMBER

  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', className)}>
      {label}
    </span>
  )
}
