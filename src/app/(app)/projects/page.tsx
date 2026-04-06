'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  FolderKanban,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Loader2,
  Trash2,
  Archive,
  Edit3,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Modal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const PROJECT_COLORS = [
  '#4c6ef5', '#7950f2', '#f03e3e', '#e67700', '#2f9e44',
  '#0c8599', '#e64980', '#ae3ec9', '#1971c2', '#364fc7',
]

const PROJECT_ICONS = [
  { value: 'folder', label: '📁' },
  { value: 'globe', label: '🌐' },
  { value: 'smartphone', label: '📱' },
  { value: 'megaphone', label: '📢' },
  { value: 'code', label: '💻' },
  { value: 'chart', label: '📊' },
  { value: 'rocket', label: '🚀' },
  { value: 'star', label: '⭐' },
]

interface Project {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  status: string
  createdAt: string
  _count: { tasks: number }
  completedTasks: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    color: PROJECT_COLORS[0],
    icon: 'folder',
  })

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return

    setCreating(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const project = await res.json()
    setCreating(false)

    if (!res.ok) {
      toast.error(project.error || 'Failed to create project')
      return
    }

    toast.success('Project created!')
    setShowCreateModal(false)
    setForm({ name: '', description: '', color: PROJECT_COLORS[0], icon: 'folder' })
    loadProjects()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project and all its tasks?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Project deleted')
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } else {
      toast.error('Failed to delete')
    }
    setMenuOpen(null)
  }

  const active = projects.filter((p) => p.status === 'ACTIVE')
  const archived = projects.filter((p) => p.status !== 'ACTIVE')

  return (
    <div>
      <Header
        title="Projects"
        actions={
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Project
          </button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 h-40 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start managing tasks and collaborating with your team."
            action={
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            }
          />
        ) : (
          <div className="space-y-8">
            {/* Active Projects */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Active ({active.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    menuOpen={menuOpen === project.id}
                    onMenuToggle={(id) => setMenuOpen(menuOpen === id ? null : id)}
                    onDelete={handleDelete}
                  />
                ))}
                {/* Add project card */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors min-h-[160px]"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm font-medium">New Project</span>
                </button>
              </div>
            </section>

            {archived.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Archived ({archived.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {archived.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      menuOpen={menuOpen === project.id}
                      onMenuToggle={(id) => setMenuOpen(menuOpen === id ? null : id)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}

      {/* Create Project Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Project" size="md">
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name *</label>
            <input
              className="input-field"
              placeholder="e.g. Website Redesign"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="What is this project about?"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, color: c }))}
                  className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_ICONS.map((ic) => (
                <button
                  key={ic.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, icon: ic.value }))}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${form.icon === ic.value ? 'bg-brand-100 ring-2 ring-brand-400' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: form.color }}
            >
              {form.name ? form.name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{form.name || 'Project name'}</p>
              <p className="text-xs text-gray-400">{form.description || 'No description'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function ProjectCard({
  project,
  menuOpen,
  onMenuToggle,
  onDelete,
}: {
  project: Project
  menuOpen: boolean
  onMenuToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  const progress = project._count.tasks > 0
    ? Math.round((project.completedTasks / project._count.tasks) * 100)
    : 0

  return (
    <div className="card p-5 relative group hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: project.color }}
          >
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <Link
              href={`/projects/${project.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors"
            >
              {project.name}
            </Link>
            {project.status !== 'ACTIVE' && (
              <Badge variant="warning" className="ml-2">Archived</Badge>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); onMenuToggle(project.id) }}
            className="p-1 text-gray-300 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
              <Link href={`/projects/${project.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Edit3 className="w-4 h-4" /> Open Board
              </Link>
              <button
                onClick={() => onDelete(project.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {project.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>
      )}

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{project.completedTasks}/{project._count.tasks} tasks</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      <Link
        href={`/projects/${project.id}`}
        className="mt-4 w-full flex items-center justify-center py-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
      >
        Open Board →
      </Link>
    </div>
  )
}
