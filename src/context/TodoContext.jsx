import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'todos'

export const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical']

export const ASSIGNEE_OPTIONS = [
  'Budi Santoso',
  'Siti Aminah',
  'Rizky Pratama',
  'Dewi Lestari',
  'Andi Saputra',
]

export const PRIORITY_OPTIONS = [
  {
    value: 'low',
    label: 'Low',
    symbol: '•',
    badgeClass: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  },
  {
    value: 'medium',
    label: 'Medium',
    symbol: '–',
    badgeClass: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  },
  {
    value: 'high',
    label: 'High',
    symbol: '↑',
    badgeClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  {
    value: 'critical',
    label: 'Critical',
    symbol: '!!',
    badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  },
]

export function normalizePriority(value) {
  return VALID_PRIORITIES.includes(value) ? value : 'medium'
}

export function normalizeLocation(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeAssignee(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function getPriorityMeta(value) {
  const normalized = normalizePriority(value)
  return (
    PRIORITY_OPTIONS.find((opt) => opt.value === normalized) ||
    PRIORITY_OPTIONS[1]
  )
}

const TodoContext = createContext(null)

function loadTodosFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.title === 'string'
      )
      .map((item) => ({
        ...item,
        priority: normalizePriority(item.priority),
        location: normalizeLocation(item.location),
        assignee: normalizeAssignee(item.assignee),
      }))
  } catch {
    return []
  }
}

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState(loadTodosFromStorage)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // Abaikan jika penyimpanan penuh atau diblokir oleh pengaturan privasi browser
    }
  }, [todos])

  const addTodo = ({
    title,
    description = '',
    location = '',
    assignee = '',
    priority = 'medium',
  }) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return null

    const newTodo = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmedTitle,
      description: description.trim(),
      location: normalizeLocation(location),
      assignee: normalizeAssignee(assignee),
      priority: normalizePriority(priority),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTodos((prev) => [newTodo, ...prev])
    return newTodo
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const updateTodo = (id, updates) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo
        return {
          ...todo,
          title:
            typeof updates.title === 'string'
              ? updates.title.trim()
              : todo.title,
          description:
            typeof updates.description === 'string'
              ? updates.description.trim()
              : todo.description,
          location:
            typeof updates.location === 'string'
              ? normalizeLocation(updates.location)
              : normalizeLocation(todo.location),
          assignee:
            typeof updates.assignee === 'string'
              ? normalizeAssignee(updates.assignee)
              : normalizeAssignee(todo.assignee),
          priority:
            typeof updates.priority === 'string'
              ? normalizePriority(updates.priority)
              : normalizePriority(todo.priority),
          completed:
            typeof updates.completed === 'boolean'
              ? updates.completed
              : todo.completed,
        }
      })
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const getTodoById = (id) => todos.find((todo) => todo.id === id) || null

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        getTodoById,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos harus digunakan di dalam TodoProvider')
  }
  return context
}
