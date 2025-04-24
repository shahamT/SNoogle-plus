export function NoteEdit({txt,title,onSaveNote,onClose, handleChange}) {

    return (
        <form onSubmit={onSaveNote} className="add-note-create-container">
        <button className="pin-add-btn icon-btn pin" name="isPinned" onClick={handleChange}></button>

            <input className="add-title" value={title} onChange={handleChange} type="text" name="title" id="title" placeholder="Title:" />
            <input className="add-txt" value={false} onChange={handleChange} type="checkbox" name="checkbox" id="checkbox"  />
            <input className="add-txt" value={txt} onChange={handleChange} type="txt" name="txt" id="txt" placeholder="List item" />
      
        <button className="add-reset icon-btn " type="reset">Reset edits</button>
        <button className="add-submit icon-btn bookmark" type="submit">Save post</button>
        <button type="button" onClick={onClose}>Close</button>

    </form>

    )
}