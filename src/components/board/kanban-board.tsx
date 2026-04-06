'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal, Loader2, X } from 'lucide-react'
import { TaskCard } from './task-card'
import { TaskModal } from './task-modal'
import type { ColumnWithTasks, TaskWithDetails, UserProfile } from '@/types'
import toast from 'react-hot-toast'

interface KanbanBoardProps {
  initialColumns: ColumnWithTasks[]
  projectId: string
  members: UserProfile[]
  onRefresh: () => void
}

export function KanbanBoard({ initialColumns, projectId, members, onRefresh }: KanbanBoardProps) {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(initialColumns)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [creating, setCreating] = useState(false)

  // Sync when parent refreshes
  useState(() => {
    setColumns(initialColumns)
  })

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = columns.find((c) => c.id === source.droppableId)!
    const destCol = columns.find((c) => c.id === destination.droppableId)!
    const task = sourceCol.tasks[source.index]

    // Optimistic update
    const newCols = columns.map((col) => {
      if (col.id === source.droppableId) {
        const tasks = [...col.tasks]
        tasks.splice(source.index, 1)
        return { ...col, tasks }
      }
      if (col.id === destination.droppableId) {
        const tasks = [...col.tasks]
        tasks.splice(destination.index, 0, { ...task, columnId: destination.droppableId })
        return { ...col, tasks }
      }
      return col
    })
    setColumns(newCols)

    // Persist
    const res = await fetch(`/api/tasks/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        columnId: destination.droppableId,
        order: destination.index,
      }),
    })

    if (!res.ok) {
      setColumns(columns) // rollback
      toast.error('Failed to move task')
    }
  }, [columns])

  async function handleAddTask(columnId: string) {
    if (!newTaskTitle.trim()) return
    setCreating(true)

    const col = columns.find((c) => c.id === columnId)!
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTaskTitle.trim(),
        columnId,
        projectId,
      }),
    })

    const task = await res.json()
    setCreating(false)

    if (res.ok) {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c
        )
      )
      setNewTaskTitle('')
      setAddingToColumn(null)
    } else {
      toast.error('Failed to create task')
    }
  }

  function handleTaskUpdate() {
    onRefresh()
    // Re-fetch to update board
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((data) => setColumns(data.columns))
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full overflow-x-auto pb-4 px-6">
          {columns.map((column) => (
            <div key={column.id} className="kanban-column">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{column.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAddingToColumn(column.id)
                    setNewTaskTitle('')
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-xl min-h-[200px] space-y-2 p-2 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-brand-50 border-2 border-dashed border-brand-200' : 'bg-gray-100/50'
                    }`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.9 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onClick={(t) => setSelectedTaskId(t.id)}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Add task inline */}
                    {addingToColumn === column.id ? (
                      <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                        <input
                          autoFocus
                          className="w-full text-sm outline-none placeholder-gray-400 mb-2"
                          placeholder="Task title..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTask(column.id)
                            if (e.key === 'Escape') setAddingToColumn(null)
                          }}
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleAddTask(column.id)}
                            disabled={creating || !newTaskTitle.trim()}
                            className="btn-primary py-1 text-xs"
                          >
                            {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add'}
                          </button>
                          <button
                            onClick={() => setAddingToColumn(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingToColumn(column.id)
                          setNewTaskTitle('')
                        }}
                        className="w-full flex items-center gap-1.5 px-2 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add task
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Detail Modal */}
      <TaskModal
        taskId={selectedTaskId}
        columns={columns.map((c) => ({ id: c.id, name: c.name, color: c.color }))}
        members={members}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={handleTaskUpdate}
      />
    </>
  )
}
