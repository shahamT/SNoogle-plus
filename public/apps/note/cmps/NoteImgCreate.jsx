const { useState } = React


export function NoteImgCreate({ onSaveNote, onClose }) {
  // === Hooks
  const [title, setTitle] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [isPinned, setIsPinned] = useState(false)




  // === Functions
  function handleFileUpload(ev) {
    const file = ev.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImgUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(ev) {
    ev.preventDefault()

    const note = {
      type: 'NoteImg',
      info: {
        title,
        url: imgUrl
      },
      isPinned,
      style: { backgroundColor: '#ffffff' }
    }

    onSaveNote(ev, note)
  }

  function handleTitleChange(ev) {
    setTitle(ev.target.value)
  }

  function handleReset(ev) {
    ev.preventDefault()
    setTitle('')
    setImgUrl('')
    setIsPinned(false)
  }

  function handlePinToggle(ev) {
    ev.preventDefault()
    setIsPinned(prev => !prev)
  }

  return (
    <form className="add-note-create-container" onSubmit={handleSubmit}>

      <div className="header flex">
        <input className="add-title clean-input" value={title} onChange={handleTitleChange} type="text" name="title" id="title" placeholder="Title" />
        <button className={`pin-note-btn icon-btn medium ${isPinned ? 'un-pin' : 'pin'}`} name="isPinned" onClick={handlePinToggle}></button>
      </div>


      {imgUrl && <img className="img-Preview" src={imgUrl} alt="Uploaded preview" style={{ maxWidth: '100%' }} />}
      <label className="img-upload-btn">
        Upload Image
        <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
      </label>

      <div className="action-btns flex">
        <button className="add-reset text-btn" type="reset" onClick={handleReset}>Reset</button>
        <button className="add-submit text-btn" type="submit">Save</button>
        <button className="create-close-btn text-btn" type="button" onClick={onClose}>Close</button>
      </div>

    </form>
  )
}