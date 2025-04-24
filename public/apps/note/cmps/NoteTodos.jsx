import { LongTxt } from '../../../cmps/general/LongTxt.jsx'
const { useState } = React

export function NoteTodos({ note, updateTodo }) {
    const { title } = note.info

    const [todos,setTodos] = useState(note.info.todos)

    function onToggleDone(updatedTodo, index) {
        const newDoneAt = todos[index].doneAt ? null : Date.now()
        setTodos(prev => {
            const copy = [...prev]
            copy[index] = updatedTodo
            return copy
        })
        updateTodo(updatedTodo, index, note.id)
    }

    return (
        <article className='note-todos'>
            <h3 className='title'>{title}</h3>
            {todos.map((todo, index) => (
                <div key={index} className={`todo-line ${(todo.doneAt !== null) ? '--crossed-todo' : ''} `}>
                    <input className='checkbox' type="checkbox" name="doneAt" checked={!!todo.doneAt}
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                            e.stopPropagation()
                            const doneAt = e.target.checked ? Date.now() : null
                            onToggleDone({ ...todo, doneAt }, index)
                        }} />{todo.txt}
                </div>)


            )}
        </article>

    )

}
