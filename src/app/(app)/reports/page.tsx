'use client'

import { useEffect, useState } from 'react'
import { BarChart2, TrendingUp, CheckSquare, AlertCircle, Users } from 'lucide-react'
import { Header } from '@/components/layout/header'

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
  }, [])

  const priorityColors: Record<string, string> = {
    URGENT: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#22c55e',
  }

  return (
    <div>
      <Header title="Reports" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 h-28 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Completion Rate', value: `${data?.completionRate ?? 0}%`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                { label: 'Tasks Completed', value: data?.completedTasks ?? 0, icon: CheckSquare, color: 'text-brand-600 bg-brand-50' },
                { label: 'Overdue Tasks', value: data?.overdueTasks ?? 0, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
                { label: 'Active Members', value: data?.teamSize ?? 0, icon: Users, color: 'text-purple-600 bg-purple-50' },
              ].map((stat) => (
                <div key={stat.label} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tasks by Priority */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
              <div className="space-y-3">
                {data?.tasksByPriority?.map((item: any) => {
                  const total = data.tasksByPriority.reduce((s: number, i: any) => s + i._count, 0)
                  const pct = total > 0 ? Math.round((item._count / total) * 100) : 0
                  return (
                    <div key={item.priority}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.priority}</span>
                        <span className="text-gray-400">{item._count} tasks ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: priorityColors[item.priority] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Projects overview */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Project Progress</h3>
              <div className="space-y-4">
                {data?.recentProjects?.map((project: any) => {
                  const completed = project.completedTasks ?? 0
                  const total = project._count.tasks
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                  return (
                    <div key={project.id}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: project.color }} />
                          <span className="font-medium text-gray-700">{project.name}</span>
                        </div>
                        <span className="text-gray-400">{completed}/{total} tasks · {pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: project.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
