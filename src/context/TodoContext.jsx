import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'todos'

export const MAX_TITLE_LENGTH = 120
export const MAX_LOCATION_LENGTH = 100
export const MAX_DESCRIPTION_LENGTH = 1000

export const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical']

export const ASSIGNEE_OPTIONS = [
  'Budi Santoso',
  'Siti Aminah',
  'Rizky Pratama',
  'Dewi Lestari',
  'Andi Saputra',
]

export const CATEGORY_OPTIONS = [
  'Pekerjaan',
  'Pribadi',
  'Belajar',
  'Belanja',
  'Kesehatan',
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

export function normalizeTitle(value) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_TITLE_LENGTH)
}

export function normalizeDescription(value) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_DESCRIPTION_LENGTH)
}

export function normalizePriority(value) {
  return VALID_PRIORITIES.includes(value) ? value : 'medium'
}

export function normalizeLocation(value) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_LOCATION_LENGTH)
}

export function normalizeAssignee(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return ASSIGNEE_OPTIONS.includes(trimmed) ? trimmed : ''
}

export function normalizeCategory(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return CATEGORY_OPTIONS.includes(trimmed) ? trimmed : ''
}

export function normalizeCreatedAt(value) {
  if (typeof value !== 'string') return new Date().toISOString()
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString()
  }
  return parsedDate.toISOString()
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
          item.id.trim().length > 0 &&
          typeof item.title === 'string' &&
          normalizeTitle(item.title).length > 0
      )
      .map((item) => ({
        id: item.id.trim(),
        title: normalizeTitle(item.title),
        description: normalizeDescription(item.description),
        priority: normalizePriority(item.priority),
        category: normalizeCategory(item.category),
        location: normalizeLocation(item.location),
        assignee: normalizeAssignee(item.assignee),
        completed: Boolean(item.completed),
        createdAt: normalizeCreatedAt(item.createdAt),
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
    category = '',
    location = '',
    assignee = '',
    priority = 'medium',
  }) => {
    const normalizedTitle = normalizeTitle(title)
    if (!normalizedTitle) return null

    const newTodo = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: normalizedTitle,
      description: normalizeDescription(description),
      category: normalizeCategory(category),
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
        const nextTitle =
          typeof updates.title === 'string'
            ? normalizeTitle(updates.title)
            : normalizeTitle(todo.title)
        if (!nextTitle) return todo
        return {
          id: todo.id,
          title: nextTitle,
          description:
            typeof updates.description === 'string'
              ? normalizeDescription(updates.description)
              : normalizeDescription(todo.description),
          category:
            typeof updates.category === 'string'
              ? normalizeCategory(updates.category)
              : normalizeCategory(todo.category),
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
              : Boolean(todo.completed),
          createdAt: normalizeCreatedAt(todo.createdAt),
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
