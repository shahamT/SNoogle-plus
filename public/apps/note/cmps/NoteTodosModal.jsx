const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM

export function NoteTodosModal({ note, onSaveNoteEdit }) {
  const [title, setTitle] = useState('')
  const [todos, setTodos] = useState([])
  const [pendingFocusIndex, setPendingFocusIndex] = useState(null)
  const inputRefs = useRef([])

  const navigate = useNavigate()

  useEffect(() => {
    if (note) {
      setTitle(note.info.title || '')
      setTodos(note.info.todos || [{ txt: '', doneAt: null }])
    }
  }, [note])

  useEffect(() => {
    if (pendingFocusIndex !== null && inputRefs.current[pendingFocusIndex]) {
      inputRefs.current[pendingFocusIndex].focus()
      setPendingFocusIndex(null)
    }
  }, [todos])

  function handleTitleChange(ev) {
    setTitle(ev.target.value)
  }

  function handleTextChange(ev, idx) {
    const value = ev.target.value
    setTodos(prev =>
      prev.map((todo, i) =>
        i === idx ? { ...todo, txt: value } : todo
      )
    )
  }

  function toggleDone(idx) {
    setTodos(prev =>
      prev.map((todo, i) =>
        i === idx
          ? { ...todo, doneAt: todo.doneAt ? null : Date.now() }
          : todo
      )
    )
  }

  function handleEnter(ev, idx) {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      const currentTxt = todos[idx].txt.trim()
      if (!currentTxt) return

      const newTodo = { txt: '', doneAt: null }
      setTodos(prev => {
        const copy = [...prev]
        copy.splice(idx + 1, 0, newTodo)
        return copy
      })
      setPendingFocusIndex(idx + 1)
    }
  }

  function handleReset(ev) {
    ev.preventDefault()
    setTitle('')
    setTodos([{ txt: '', doneAt: null }])
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const cleanedTodos = todos.filter(todo => todo.txt.trim() !== '')
    const updatedNote = {
      ...note,
      info: {
        ...note.info,
        title,
        todos: cleanedTodos
      }
    }
    onSaveNoteEdit(ev, updatedNote)
  }

  if (!note) return <div>Loading...</div>

  return (
    <dialog open className="note-dialog">
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} className="modal-window">
        <input
          className="modal-title"
          value={title}
          onChange={handleTitleChange}
          type="text"
          name="title"
          placeholder="Title"
        />

        <ul className="todo-list clean-list">
          {todos.map((todo, idx) => (
            <li key={idx} className="todo-item">
              <input
                type="checkbox"
                checked={!!todo.doneAt}
                onChange={() => toggleDone(idx)}
              />
              <input
                ref={el => inputRefs.current[idx] = el}
                type="text"
                value={todo.txt}
                onChange={(ev) => handleTextChange(ev, idx)}
                onKeyDown={(ev) => handleEnter(ev, idx)}
                placeholder="List item"
              />
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button className="icon-btn" type="reset" onClick={handleReset}>Reset</button>
          <button className="icon-btn" type="submit">Save</button>
          <button className="icon-btn" type="button" onClick={() => navigate('/notes')}>Close</button>
        </div>
      </form>
    </div>
    </dialog>
  )
}
