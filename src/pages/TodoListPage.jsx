import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PRIORITY_OPTIONS,
  getPriorityMeta,
  normalizeAssignee,
  normalizeLocation,
  normalizePriority,
  useTodos,
} from '../context/TodoContext.jsx'

const ITEMS_PER_PAGE = 5

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'incomplete', label: 'Belum Selesai' },
  { value: 'completed', label: 'Selesai' },
]

function formatDate(isoString) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(isoString))
  } catch {
    return ''
  }
}

export default function TodoListPage() {
  const { todos, toggleTodo } = useTodos()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const statusFilterSelectId = useId()
  const filterSelectId = useId()

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'completed'
          ? Boolean(todo.completed)
          : !todo.completed
    const matchesPriority =
      selectedPriority === 'all'
        ? true
        : normalizePriority(todo.priority) === selectedPriority
    return matchesStatus && matchesPriority
  })

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
  const paginatedTodos = filteredTodos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  )

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.length - completedCount

  function handleStatusFilterChange(e) {
    setSelectedStatus(e.target.value)
    setCurrentPage(1)
  }

  function handlePriorityFilterChange(e) {
    setSelectedPriority(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Daftar Tugas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {todos.length === 0
              ? 'Belum ada tugas tersimpan'
              : `${activeCount} belum selesai · ${completedCount} selesai`}
          </p>
        </div>

        <Link
          to="/add"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          <span>Tambah</span>
        </Link>
      </header>

      {/* Combobox Filter Status & Priority */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor={statusFilterSelectId}
            className="block text-xs font-medium text-slate-500"
          >
            Filter berdasarkan Status
          </label>
          <div className="relative">
            <select
              id={statusFilterSelectId}
              name="statusFilter"
              value={selectedStatus}
              onChange={handleStatusFilterChange}
              className="block min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200/90 bg-white py-2 pr-9 pl-3.5 text-base text-slate-800 shadow-2xs transition hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:text-sm"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400"
            >
              &#9662;
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={filterSelectId}
            className="block text-xs font-medium text-slate-500"
          >
            Filter berdasarkan Priority
          </label>
          <div className="relative">
            <select
              id={filterSelectId}
              name="priorityFilter"
              value={selectedPriority}
              onChange={handlePriorityFilterChange}
              className="block min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200/90 bg-white py-2 pr-9 pl-3.5 text-base text-slate-800 shadow-2xs transition hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:text-sm"
            >
              <option value="all">Semua Priority</option>
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400"
            >
              &#9662;
            </span>
          </div>
        </div>
      </div>

      {/* Todo List or Empty State */}
      {filteredTodos.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-700">
            {todos.length === 0
              ? 'Belum ada tugas hari ini'
              : 'Tidak ada tugas yang sesuai dengan filter pilihanmu'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {todos.length === 0
              ? 'Mulai dengan menambahkan tugas pertamamu.'
              : 'Coba pilih "Semua Status" atau "Semua Priority" pada combobox di atas, atau tambahkan tugas baru.'}
          </p>
          {todos.length === 0 && (
            <Link
              to="/add"
              className="mt-5 inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-slate-300 hover:text-slate-900"
            >
              + Buat tugas baru
            </Link>
          )}
        </section>
      ) : (
        <div className="space-y-5">
          <ul className="space-y-2.5" role="list">
            {paginatedTodos.map((todo) => {
              const checkboxId = `todo-check-${todo.id}`
              const priorityMeta = getPriorityMeta(todo.priority)
              const todoAssignee = normalizeAssignee(todo.assignee)
              const todoLocation = normalizeLocation(todo.location)
              return (
                <li
                  key={todo.id}
                  className="group flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition hover:border-slate-300"
                >
                  <div className="pt-0.5">
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      aria-label={`Tandai "${todo.title}" sebagai ${
                        todo.completed ? 'belum selesai' : 'selesai'
                      }`}
                      className="h-5 w-5 cursor-pointer rounded-md border-slate-300 accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    />
                  </div>

                  <Link
                    to={`/todo/${todo.id}`}
                    className="min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`truncate text-base font-medium transition ${
                          todo.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900 group-hover:text-slate-700'
                        }`}
                      >
                        {todo.title}
                      </span>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityMeta.badgeClass}`}
                        >
                          <span aria-hidden="true">{priorityMeta.symbol}</span>
                          <span>{priorityMeta.label}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-xs text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
                        >
                          &rarr;
                        </span>
                      </div>
                    </div>

                    {todo.description && (
                      <p
                        className={`mt-1 line-clamp-1 text-sm ${
                          todo.completed ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      {todoAssignee && (
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            todo.completed ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          <svg
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span className="truncate">{todoAssignee}</span>
                        </span>
                      )}
                      {todoLocation && (
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            todo.completed ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          <svg
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="truncate">{todoLocation}</span>
                        </span>
                      )}
                      <span>{formatDate(todo.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Pagination: Prev - Angka - Next */}
          <nav
            aria-label="Navigasi halaman daftar tugas"
            className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row"
          >
            <p className="text-xs text-slate-500">
              Menampilkan{' '}
              <span className="font-medium text-slate-700">
                {startIndex + 1}&ndash;
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredTodos.length)}
              </span>{' '}
              dari{' '}
              <span className="font-medium text-slate-700">
                {filteredTodos.length}
              </span>{' '}
              tugas
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage(Math.max(1, safeCurrentPage - 1))
                }
                disabled={safeCurrentPage <= 1}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-slate-200/90 disabled:hover:text-slate-700"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                const isActive = pageNumber === safeCurrentPage
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Halaman ${pageNumber}`}
                    className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'border border-slate-200/90 bg-white text-slate-700 shadow-2xs hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))
                }
                disabled={safeCurrentPage >= totalPages}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-slate-200/90 disabled:hover:text-slate-700"
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
