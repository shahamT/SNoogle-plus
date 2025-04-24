

export function AddNoteCollapsed({onAddNoteTypeChange}) {
    return <div className="add-note-collapsed" >
        <div onClick={()=>onAddNoteTypeChange('addText') } className="add-text-note-btn">Take a note...</div>
        <div className="note-add-btns flex">
            <button className="add-todo-btn icon-btn big square-check" onClick={()=>onAddNoteTypeChange('addToDo')}></button>
            <button className="add-img-btn icon-btn big image" onClick={()=>onAddNoteTypeChange('addImg')}></button>
        </div>
    </div>
}