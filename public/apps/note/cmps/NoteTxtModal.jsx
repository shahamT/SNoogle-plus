
const { useState, useEffect } = React
export function NoteTxtModal({ note,onSaveNoteEdit,onCloseModal }) {

    const [title, setTitle] = useState('')
    const [txt, setTxt] = useState('')

    useEffect(() => {
        if (note) {
            setTitle(note.info.title || '')
            setTxt(note.info.txt || '')
        }
    }, [note])




    function handleReset(ev) {
        ev.preventDefault()
        setTitle('')
        setTxt('')
      }


    if (!note) return <div>Loading...</div>
    return (
      <dialog open className="note-dialog">
<div className="modal-backdrop">
  <form className="modal-window"  onSubmit={(ev) => onSaveNoteEdit(ev, {
    ...note,
    info: {
        ...note.info,
        title,
        txt
}})}>
    <input className="add-title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Title:"
    />

    <textarea
      className="modal-text"
      value={txt}
      onChange={(e) => setTxt(e.target.value)}
      placeholder="Take a note..."
      rows={8}
    />

    <div className="modal-actions">
      <button className="icon-btn" type="reset" onClick={handleReset}>Reset</button>
      <button className="icon-btn" type="submit">Save</button>
      <button className="icon-btn" type="button" onClick={onCloseModal}>Close</button>
    </div>
  </form>
</div>
</dialog>


    )

}