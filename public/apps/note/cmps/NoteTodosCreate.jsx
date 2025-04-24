const { useState, useRef, useEffect } = React

export function NoteTodosCreate({ onSaveNote, onClose, noteToEdit }) {
    const { title = '', todos: initialTodos = [] } = noteToEdit.info || {}

    const [currTitle, setCurrTitle] = useState(title)
    const [todos, setTodos] = useState(initialTodos.length ? initialTodos : [{ txt: '', doneAt: null }])
    const [isPinned, setIsPinned] = useState(false)

    const [pendingFocusIndex, setPendingFocusIndex] = useState(null)

    const inputRefs = useRef([])

    useEffect(() => {
        if (pendingFocusIndex !== null) {
            inputRefs.current[pendingFocusIndex].focus()
            setPendingFocusIndex(null)
        }
    }, [todos])



    function handleTitleChange(ev) {
        setCurrTitle(ev.target.value)
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

    function handleSubmit(ev) {
        ev.preventDefault()
        const cleanedTodos = todos.filter(todo => todo.txt.trim() !== '')
        const note = {
            type: 'NoteTodos',
            info: {
                title: currTitle,
                todos: cleanedTodos
            },
            isPinned,
            style: { backgroundColor: '#ffffff' }
        }

        onSaveNote(ev, note)
    }
    function handlePinToggle(ev) {
        ev.preventDefault()
        setIsPinned(prev => !prev)
      }
    

    function handleReset(ev) {
        ev.preventDefault()
        setCurrTitle('')
        setIsPinned(false)
        setTodos([{ txt: '', doneAt: null }])
    }

    return (
        <form onSubmit={handleSubmit} className="add-note-create-container">

            <div className="header flex">
                <input className="add-title clean-input" value={currTitle} onChange={handleTitleChange} type="text" name="title" id="title" placeholder="Title" />
                <button className={`pin-note-btn icon-btn medium ${isPinned ? 'un-pin' : 'pin'}`} name="isPinned" onClick={handlePinToggle}></button>
            </div>

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
                            className="clean-input"
                        />
                    </li>
                ))}
            </ul>
            <div className="action-btns flex">
                <button className="add-reset text-btn" type="reset" onClick={handleReset}>Reset</button>
                <button className="add-submit text-btn bookmark" type="submit">Save</button>
                <button className="create-close-btn text-btn" type="button" onClick={onClose}>Close</button>
            </div>
        </form>
    )
}
