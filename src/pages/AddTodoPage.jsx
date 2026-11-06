import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ASSIGNEE_OPTIONS,
  CATEGORY_OPTIONS,
  MAX_DESCRIPTION_LENGTH,
  MAX_LOCATION_LENGTH,
  MAX_TITLE_LENGTH,
  PRIORITY_OPTIONS,
  useTodos,
} from '../context/TodoContext.jsx'

export default function AddTodoPage() {
  const navigate = useNavigate()
  const { addTodo } = useTodos()
  const baseId = useId()
  const titleId = `${baseId}-title`
  const priorityId = `${baseId}-priority`
  const categoryId = `${baseId}-category`
  const assigneeId = `${baseId}-assignee`
  const locationId = `${baseId}-location`
  const descId = `${baseId}-description`
  const titleErrorId = `${baseId}-title-error`
  const locationErrorId = `${baseId}-location-error`
  const descErrorId = `${baseId}-description-error`

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('')
  const [assignee, setAssignee] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [titleError, setTitleError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [descError, setDescError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateTitle = (value) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setTitleError('Judul tugas wajib diisi dan tidak boleh hanya spasi.')
      return false
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      setTitleError(`Judul tugas maksimal ${MAX_TITLE_LENGTH} karakter.`)
      return false
    }
    setTitleError('')
    return true
  }

  const validateLocation = (value) => {
    if (value.trim().length > MAX_LOCATION_LENGTH) {
      setLocationError(`Lokasi maksimal ${MAX_LOCATION_LENGTH} karakter.`)
      return false
    }
    setLocationError('')
    return true
  }

  const validateDescription = (value) => {
    if (value.trim().length > MAX_DESCRIPTION_LENGTH) {
      setDescError(`Deskripsi maksimal ${MAX_DESCRIPTION_LENGTH} karakter.`)
      return false
    }
    setDescError('')
    return true
  }

  const handleTitleChange = (e) => {
    const nextValue = e.target.value
    setTitle(nextValue)
    if (
      titleError &&
      nextValue.trim() &&
      nextValue.trim().length <= MAX_TITLE_LENGTH
    ) {
      setTitleError('')
    }
  }

  const handleTitleBlur = () => {
    if (title.length > 0) {
      validateTitle(title)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isTitleValid = validateTitle(title)
    const isLocationValid = validateLocation(location)
    const isDescValid = validateDescription(description)
    if (!isTitleValid || !isLocationValid || !isDescValid) {
      return
    }
    setIsSubmitting(true)
    addTodo({ title, description, category, location, assignee, priority })
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Kembali ke Daftar</span>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Tambah Tugas Baru
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs"
      >
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
            maxLength={MAX_TITLE_LENGTH}
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            aria-invalid={titleError ? 'true' : undefined}
            aria-describedby={titleError ? titleErrorId : undefined}
            aria-errormessage={titleError ? titleErrorId : undefined}
            placeholder="Contoh: Pelajari alur OpenSpec"
            className={`mt-1.5 block min-h-12 w-full rounded-xl border px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 ${
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
              htmlFor={categoryId}
              className="block text-sm font-medium text-slate-800"
            >
              Kategori{' '}
              <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <div className="relative mt-1.5">
              <select
                id={categoryId}
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-3.5 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <option value="">-- Pilih --</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
              htmlFor={assigneeId}
              className="block text-sm font-medium text-slate-800"
            >
              Penanggung Jawab{' '}
              <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <div className="relative mt-1.5">
              <select
                id={assigneeId}
                name="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="block min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-3.5 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <option value="">-- Pilih --</option>
                {ASSIGNEE_OPTIONS.map((person) => (
                  <option key={person} value={person}>
                    {person}
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
              maxLength={MAX_LOCATION_LENGTH}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                if (
                  locationError &&
                  e.target.value.trim().length <= MAX_LOCATION_LENGTH
                ) {
                  setLocationError('')
                }
              }}
              aria-invalid={locationError ? 'true' : undefined}
              aria-describedby={locationError ? locationErrorId : undefined}
              placeholder="Contoh: Kantor, Sudirman..."
              className="block min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3.5 pl-10 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
          </div>
          {locationError && (
            <p
              id={locationErrorId}
              role="alert"
              aria-live="polite"
              className="mt-2 flex items-center gap-1.5 text-sm text-rose-600"
            >
              <span aria-hidden="true">!</span>
              <span>{locationError}</span>
            </p>
          )}
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
            maxLength={MAX_DESCRIPTION_LENGTH}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (
                descError &&
                e.target.value.trim().length <= MAX_DESCRIPTION_LENGTH
              ) {
                setDescError('')
              }
            }}
            aria-invalid={descError ? 'true' : undefined}
            aria-describedby={descError ? descErrorId : undefined}
            placeholder="Tambahkan rincian atau catatan tambahan..."
            className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          />
          {descError && (
            <p
              id={descErrorId}
              role="alert"
              aria-live="polite"
              className="mt-2 flex items-center gap-1.5 text-sm text-rose-600"
            >
              <span aria-hidden="true">!</span>
              <span>{descError}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-60"
          >
            Simpan Tugas
          </button>
        </div>
      </form>
    </div>
  )
}
