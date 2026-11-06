import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TodoProvider } from './context/TodoContext.jsx'
import TodoListPage from './pages/TodoListPage.jsx'
import AddTodoPage from './pages/AddTodoPage.jsx'
import TodoDetailPage from './pages/TodoDetailPage.jsx'

export default function App() {
  return (
    <TodoProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
            <Routes>
              <Route path="/" element={<TodoListPage />} />
              <Route path="/add" element={<AddTodoPage />} />
              <Route path="/todo/:id" element={<TodoDetailPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TodoProvider>
  )
}
