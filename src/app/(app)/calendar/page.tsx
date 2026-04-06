'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PriorityBadge } from '@/components/ui/badge'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, addMonths, subMonths } from 'date-fns'

interface CalendarTask {
  id: string
  title: string
  dueDate: string
  priority: string
  projectName: string
  projectColor: string
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all tasks with due dates from all projects
    fetch('/api/projects')
      .then((r) => r.json())
      .then(async (projects) => {
        const allTasks: CalendarTask[] = []
        for (const project of projects) {
          const res = await fetch(`/api/projects/${project.id}`)
          const data = await res.json()
          if (data.columns) {
            for (const col of data.columns) {
              for (const task of col.tasks) {
                if (task.dueDate) {
                  allTasks.push({
                    id: task.id,
                    title: task.title,
                    dueDate: task.dueDate,
                    priority: task.priority,
                    projectName: project.name,
                    projectColor: project.color,
                  })
                }
              }
            }
          }
        }
        setTasks(allTasks)
        setLoading(false)
      })
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)

  function tasksOnDay(date: Date) {
    return tasks.filter((t) => isSameDay(new Date(t.dueDate), date))
  }

  return (
    <div>
      <Header title="Calendar" />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="card overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for offset */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="border-r border-b border-gray-50 min-h-[100px] bg-gray-50/30" />
            ))}

            {days.map((day) => {
              const dayTasks = tasksOnDay(day)
              const today = isToday(day)
              return (
                <div key={day.toISOString()} className="border-r border-b border-gray-50 min-h-[100px] p-2">
                  <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                    today ? 'bg-brand-600 text-white' : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs px-1.5 py-0.5 rounded truncate text-white font-medium"
                        style={{ backgroundColor: task.projectColor }}
                        title={`${task.title} — ${task.projectName}`}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-400 pl-1">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="mt-6 card p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-500" />
            This Month&apos;s Tasks
          </h3>
          <div className="space-y-2">
            {tasks
              .filter((t) => {
                const d = new Date(t.dueDate)
                return d >= monthStart && d <= monthEnd
              })
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.projectColor }} />
                  <span className="text-sm text-gray-900 flex-1">{task.title}</span>
                  <span className="text-xs text-gray-400">{task.projectName}</span>
                  <PriorityBadge priority={task.priority} />
                  <span className="text-xs text-gray-400 w-16 text-right">
                    {format(new Date(task.dueDate), 'MMM d')}
                  </span>
                </div>
              ))}
            {tasks.filter((t) => {
              const d = new Date(t.dueDate)
              return d >= monthStart && d <= monthEnd
            }).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No tasks due this month</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
