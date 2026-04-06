'use client'

import { Calendar, MessageSquare, AlertCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/ui/badge'
import { formatDate, isOverdue } from '@/lib/utils'
import type { TaskWithDetails } from '@/types'

interface TaskCardProps {
  task: TaskWithDetails
  onClick: (task: TaskWithDetails) => void
  dragHandleProps?: any
}

export function TaskCard({ task, onClick, dragHandleProps }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && !task.completedAt
  const labels: string[] = task.labels ? JSON.parse(task.labels) : []

  return (
    <div
      className={`task-card animate-fade-in ${task.completedAt ? 'opacity-60' : ''}`}
      onClick={() => onClick(task)}
      {...dragHandleProps}
    >
      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {labels.map((label, i) => (
            <span key={i} className="text-xs px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p className={`text-sm font-medium text-gray-900 leading-snug mb-2 ${task.completedAt ? 'line-through text-gray-400' : ''}`}>
        {task.title}
      </p>

      {/* Priority & Due date */}
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />

        {task.dueDate && (
          <span
            className={`flex items-center gap-1 text-xs ${
              overdue ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {overdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {task.assignee ? (
          <Avatar src={task.assignee.image} name={task.assignee.name ?? undefined} size="xs" />
        ) : (
          <div />
        )}

        {(task._count?.comments ?? 0) > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MessageSquare className="w-3 h-3" />
            {task._count?.comments}
          </span>
        )}
      </div>
    </div>
  )
}
