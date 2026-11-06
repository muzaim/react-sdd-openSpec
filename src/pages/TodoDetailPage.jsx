import { useId, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  PRIORITY_OPTIONS,
  getPriorityMeta,
  normalizeLocation,
  normalizePriority,
  useTodos,
} from '../context/TodoContext.jsx'

function formatFullDate(isoString) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(isoString))
  } catch {
    return isoString
  }
}

export default function TodoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTodoById, updateTodo, toggleTodo, deleteTodo } = useTodos()
  const baseId = useId()
  const titleId = `${baseId}-edit-title`
  const priorityId = `${baseId}-edit-priority`
  const locationId = `${baseId}-edit-location`
  const descId = `${baseId}-edit-description`
  const statusId = `${baseId}-edit-status`
  const titleErrorId = `${baseId}-edit-title-error`

  const todo = getTodoById(id)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [titleError, setTitleError] = useState('')

  if (!todo) {
    return (
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Kembali ke Daftar</span>
        </Link>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-2xs">
          <h1 className="text-lg font-semibold text-slate-900">
            Tugas tidak ditemukan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tugas yang kamu cari mungkin sudah dihapus atau tautannya tidak
            valid.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Kembali ke Halaman List
          </Link>
        </section>
      </div>
    )
  }

  const priorityMeta = getPriorityMeta(todo.priority)
  const todoLocation = normalizeLocation(todo.location)

  const startEdit = () => {
    setTitle(todo.title)
    setPriority(normalizePriority(todo.priority))
    setLocation(todoLocation)
    setDescription(todo.description || '')
    setCompleted(Boolean(todo.completed))
    setTitleError('')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setTitleError('')
    setIsEditing(false)
  }

  const validateTitle = (value) => {
    if (!value.trim()) {
      setTitleError('Judul tugas wajib diisi dan tidak boleh hanya spasi.')
      return false
    }
    setTitleError('')
    return true
  }

  const handleTitleChange = (e) => {
    const nextValue = e.target.value
    setTitle(nextValue)
    if (titleError && nextValue.trim()) {
      setTitleError('')
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validateTitle(title)) {
      return
    }
    updateTodo(todo.id, {
      title,
      priority,
      location,
      description,
      completed,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteTodo(todo.id)
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Kembali ke Daftar</span>
        </Link>

        {!isEditing && (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-slate-300 hover:text-slate-900"
          >
            Edit Tugas
          </button>
        )}
      </header>

      {isEditing ? (
        <form
          onSubmit={handleSave}
          noValidate
          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h1 className="text-lg font-semibold text-slate-900">Edit Tugas</h1>
            <span className="text-xs text-slate-400">
              Dibuat {formatFullDate(todo.createdAt)}
            </span>
          </div>

          <div>
            <label
              htmlFor={titleId}
              className="block text-sm font-medium text-slate-800"
            >
              Judul Tugas <span className="text-rose-600">*</span>
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              onBlur={() => validateTitle(title)}
              aria-invalid={titleError ? 'true' : undefined}
              aria-describedby={titleError ? titleErrorId : undefined}
              aria-errormessage={titleError ? titleErrorId : undefined}
              className={`mt-1.5 block min-h-12 w-full rounded-xl border px-3.5 py-2.5 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                titleError
                  ? 'border-rose-500 bg-rose-50/40 focus-visible:outline-rose-600'
                  : 'border-slate-300 bg-white focus-visible:outline-slate-900'
              }`}
            />
            {titleError && (
              <p
                id={titleErrorId}
                role="alert"
                aria-live="polite"
                className="mt-2 flex items-center gap-1.5 text-sm text-rose-600"
              >
                <span aria-hidden="true">!</span>
                <span>{titleError}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={priorityId}
                className="block text-sm font-medium text-slate-800"
              >
                Prioritas Tugas
              </label>
              <div className="relative mt-1.5">
                <select
                  id={priorityId}
                  name="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="block min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-3.5 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs text-slate-400"
                >
                  &#9662;
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor={locationId}
                className="block text-sm font-medium text-slate-800"
              >
                Lokasi{' '}
                <span className="font-normal text-slate-400">(opsional)</span>
              </label>
              <div className="relative mt-1.5">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400"
                >
                  <svg
                    className="h-4 w-4"
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
                </span>
                <input
                  id={locationId}
                  name="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Kantor, Sudirman..."
                  className="block min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3.5 pl-10 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor={descId}
              className="block text-sm font-medium text-slate-800"
            >
              Deskripsi / Catatan{' '}
              <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <textarea
              id={descId}
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan rincian atau catatan tambahan..."
              className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <input
              id={statusId}
              name="completed"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded-md border-slate-300 accent-slate-900"
            />
            <label
              htmlFor={statusId}
              className="cursor-pointer text-sm font-medium text-slate-700"
            >
              Tandai tugas ini sudah selesai
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      ) : (
        <article className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  todo.completed
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                }`}
              >
                <span aria-hidden="true">{todo.completed ? '✓' : '•'}</span>
                <span>{todo.completed ? 'Selesai' : 'Belum Selesai'}</span>
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${priorityMeta.badgeClass}`}
              >
                <span aria-hidden="true">{priorityMeta.symbol}</span>
                <span>Priority: {priorityMeta.label}</span>
              </span>
            </div>

            <time dateTime={todo.createdAt} className="text-xs text-slate-400">
              Dibuat {formatFullDate(todo.createdAt)}
            </time>
          </div>

          <div>
            <h1
              className={`text-xl font-semibold tracking-tight ${
                todo.completed ? 'text-slate-500 line-through' : 'text-slate-900'
              }`}
            >
              {todo.title}
            </h1>

            {todoLocation && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-slate-600">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-400"
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
                <span>{todoLocation}</span>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-slate-50/80 p-4">
              <h2 className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                Catatan / Deskripsi
              </h2>
              {todo.description ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {todo.description}
                </p>
              ) : (
                <p className="mt-2 text-sm italic text-slate-400">
                  Tidak ada catatan tambahan untuk tugas ini.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => toggleTodo(todo.id)}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              {todo.completed ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Hapus Tugas
            </button>
          </div>
        </article>
      )}
    </div>
  )
}
