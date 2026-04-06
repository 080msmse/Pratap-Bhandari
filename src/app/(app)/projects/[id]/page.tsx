'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, List, LayoutGrid, Plus, Loader2, Calendar, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { KanbanBoard } from '@/components/board/kanban-board'
import { TaskModal } from '@/components/board/task-modal'
import { Avatar } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/ui/badge'
import { formatDate, isOverdue } from '@/lib/utils'
import type { ColumnWithTasks, UserProfile } from '@/types'

type ViewMode = 'board' | 'list'

export default function ProjectBoardPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<any>(null)
  const [members, setMembers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>('board')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [addForm, setAddForm] = useState({ title: '', columnId: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadProject()
    loadMembers()
  }, [id])

  async function loadProject() {
    const res = await fetch(`/api/projects/${id}`)
    const data = await res.json()
    setProject(data)
    if (data.columns?.[1]) setAddForm((p) => ({ ...p, columnId: data.columns[1].id }))
    setLoading(false)
  }

  async function loadMembers() {
    const res = await fetch('/api/team')
    const data = await res.json()
    setMembers(data.map((m: any) => m.user))
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!addForm.title.trim()) return
    setCreating(true)

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: addForm.title,
        priority: addForm.priority,
        assigneeId: addForm.assigneeId || null,
        dueDate: addForm.dueDate || null,
        columnId: addForm.columnId,
        projectId: id,
      }),
    })

    setCreating(false)
    if (res.ok) {
      setShowAddTask(false)
      setAddForm((p) => ({ ...p, title: '', assigneeId: '', dueDate: '' }))
      loadProject()
    }
  }

  const allTasks = project?.columns?.flatMap((c: any) => c.tasks) ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!project || project.error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-500">Project not found</p>
        <Link href="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        title={project.name}
        actions={
          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setView('board')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  view === 'board' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Board
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
            </div>

            <button onClick={() => setShowAddTask(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        }
      />

      {/* Breadcrumb */}
      <div className="px-6 py-2 flex items-center gap-2 text-sm text-gray-500 border-b border-gray-100 bg-white">
        <Link href="/projects" className="hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Projects
        </Link>
        <span>/</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: project.color }} />
          <span className="text-gray-900 font-medium">{project.name}</span>
        </div>
        <span className="ml-auto text-xs text-gray-400">{allTasks.length} tasks</span>
      </div>

      {/* Board / List view */}
      <div className="flex-1 overflow-hidden pt-4">
        {view === 'board' ? (
          <KanbanBoard
            initialColumns={project.columns}
            projectId={id}
            members={members}
            onRefresh={loadProject}
          />
        ) : (
          <ListView
            columns={project.columns}
            onTaskClick={setSelectedTaskId}
          />
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddTask(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Add New Task</h2>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  className="input-field"
                  placeholder="Task title"
                  value={addForm.title}
                  onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Column</label>
                  <select className="input-field text-sm" value={addForm.columnId} onChange={(e) => setAddForm((p) => ({ ...p, columnId: e.target.value }))}>
                    {project.columns.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select className="input-field text-sm" value={addForm.priority} onChange={(e) => setAddForm((p) => ({ ...p, priority: e.target.value }))}>
                    {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Assignee</label>
                  <select className="input-field text-sm" value={addForm.assigneeId} onChange={(e) => setAddForm((p) => ({ ...p, assigneeId: e.target.value }))}>
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name ?? m.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                  <input type="date" className="input-field text-sm" value={addForm.dueDate} onChange={(e) => setAddForm((p) => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" className="btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task detail modal for list view */}
      {view === 'list' && (
        <TaskModal
          taskId={selectedTaskId}
          columns={project.columns.map((c: any) => ({ id: c.id, name: c.name, color: c.color }))}
          members={members}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={loadProject}
        />
      )}
    </div>
  )
}

function ListView({ columns, onTaskClick }: { columns: ColumnWithTasks[]; onTaskClick: (id: string) => void }) {
  const allTasks = columns.flatMap((c) => c.tasks.map((t) => ({ ...t, columnName: c.name, columnColor: c.color })))

  return (
    <div className="px-6 overflow-y-auto h-full">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Assignee</div>
        </div>
        <div className="divide-y divide-gray-50">
          {allTasks.map((task) => {
            const overdue = isOverdue(task.dueDate) && !task.completedAt
            return (
              <div
                key={task.id}
                onClick={() => onTaskClick(task.id)}
                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors items-center"
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <div
                    className={`w-4 h-4 rounded border-2 flex-shrink-0 ${task.completedAt ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                  />
                  <span className={`text-sm text-gray-900 truncate ${task.completedAt ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: (task as any).columnColor + '20', color: (task as any).columnColor }}
                  >
                    {(task as any).columnName}
                  </span>
                </div>
                <div className="col-span-2">
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="col-span-2">
                  {task.dueDate ? (
                    <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500' : 'text-gray-500'}`}>
                      {overdue && <AlertCircle className="w-3 h-3" />}
                      {formatDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </div>
                <div className="col-span-1">
                  {task.assignee ? (
                    <Avatar src={task.assignee.image} name={task.assignee.name ?? undefined} size="xs" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-100" />
                  )}
                </div>
              </div>
            )
          })}
          {allTasks.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-400">No tasks yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
