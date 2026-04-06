'use client'

import { useState, useEffect } from 'react'
import { Loader2, Trash2, Calendar, User, Tag, Flag, MessageSquare, CheckCircle2, Circle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/ui/badge'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { TaskFull, UserProfile, ColumnWithTasks } from '@/types'

interface TaskModalProps {
  taskId: string | null
  columns: { id: string; name: string; color: string }[]
  members: UserProfile[]
  onClose: () => void
  onUpdate: () => void
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

export function TaskModal({ taskId, columns, members, onClose, onUpdate }: TaskModalProps) {
  const [task, setTask] = useState<TaskFull | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [comment, setComment] = useState('')
  const [postingComment, setPostingComment] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState('')

  useEffect(() => {
    if (taskId) {
      setLoading(true)
      fetch(`/api/tasks/${taskId}`)
        .then((r) => r.json())
        .then((t) => {
          setTask(t)
          setTitleValue(t.title)
          setLoading(false)
        })
    }
  }, [taskId])

  async function updateTask(patch: Record<string, any>) {
    if (!task) return
    setSaving(true)
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const updated = await res.json()
    setSaving(false)
    if (res.ok) {
      setTask((prev) => ({ ...prev!, ...updated }))
      onUpdate()
    } else {
      toast.error('Failed to update task')
    }
  }

  async function handleDelete() {
    if (!task) return
    if (!confirm('Delete this task?')) return
    const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Task deleted')
      onUpdate()
      onClose()
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim() || !task) return
    setPostingComment(true)
    const res = await fetch(`/api/tasks/${task.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment }),
    })
    const newComment = await res.json()
    setPostingComment(false)
    if (res.ok) {
      setTask((prev) => prev ? ({ ...prev, comments: [...prev.comments, newComment] }) : prev)
      setComment('')
    }
  }

  async function saveTitle() {
    if (titleValue.trim() && titleValue !== task?.title) {
      await updateTask({ title: titleValue })
    }
    setEditingTitle(false)
  }

  if (!taskId) return null

  return (
    <Modal open={!!taskId} onClose={onClose} size="2xl" className="max-h-[90vh] overflow-hidden flex flex-col">
      {loading || !task ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="flex-1">
              {editingTitle ? (
                <input
                  className="input-field text-base font-semibold"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-brand-600 transition-colors"
                  onClick={() => setEditingTitle(true)}
                >
                  {task.title}
                </h2>
              )}
              <p className="text-sm text-gray-400 mt-0.5">
                in <span className="font-medium text-gray-600">{task.column?.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {saving && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              <button
                onClick={() => updateTask({
                  completedAt: task.completedAt ? null : new Date().toISOString(),
                })}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  task.completedAt
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {task.completedAt ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                {task.completedAt ? 'Completed' : 'Mark Complete'}
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                  Description
                </label>
                <textarea
                  className="input-field resize-none text-sm"
                  rows={3}
                  placeholder="Add a description..."
                  defaultValue={task.description ?? ''}
                  onBlur={(e) => {
                    if (e.target.value !== (task.description ?? '')) {
                      updateTask({ description: e.target.value })
                    }
                  }}
                />
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">
                  Comments ({task.comments.length})
                </label>
                <div className="space-y-3 mb-3">
                  {task.comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <Avatar src={c.author.image} name={c.author.name ?? undefined} size="sm" className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-700">{c.author.name}</span>
                          <span className="text-xs text-gray-400">{formatRelativeTime(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    className="input-field flex-1 text-sm"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button type="submit" className="btn-primary px-3" disabled={postingComment || !comment.trim()}>
                    {postingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-60 border-l border-gray-100 px-4 py-5 space-y-5 overflow-y-auto flex-shrink-0">
              {/* Status / Column */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                  Status
                </label>
                <select
                  className="input-field text-sm"
                  value={task.columnId}
                  onChange={(e) => updateTask({ columnId: e.target.value })}
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                  Priority
                </label>
                <select
                  className="input-field text-sm"
                  value={task.priority}
                  onChange={(e) => updateTask({ priority: e.target.value })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                  Assignee
                </label>
                <select
                  className="input-field text-sm"
                  value={task.assigneeId ?? ''}
                  onChange={(e) => updateTask({ assigneeId: e.target.value || null })}
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name ?? m.email}</option>
                  ))}
                </select>
                {task.assignee && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar src={task.assignee.image} name={task.assignee.name ?? undefined} size="xs" />
                    <span className="text-xs text-gray-600">{task.assignee.name}</span>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  className="input-field text-sm"
                  value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateTask({ dueDate: e.target.value || null })}
                />
              </div>

              {/* Created */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">
                  Created
                </label>
                <p className="text-xs text-gray-500">{formatRelativeTime(task.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
