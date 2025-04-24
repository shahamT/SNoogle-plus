const { useState, useEffect } = React

export function NoteImagModal({ note, onSaveNoteEdit, onCloseModal }) {
    const [title, setTitle] = useState('')
    const [imgUrl, setImgUrl] = useState('')

    useEffect(() => {
        if (note) {
            setTitle(note.info.title || '')
            setImgUrl(note.info.url || '')
        }
    }, [note])

    function handleReset(ev) {
        ev.preventDefault()
        setTitle('')
        setImgUrl('')
    }

    function handleFileUpload(ev) {
        const file = ev.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            setImgUrl(reader.result)
        }
        reader.readAsDataURL(file)
    }

    if (!note) return <div>Loading...</div>

    return (
        <dialog open className="note-dialog img-modal">
            <div className="modal-backdrop">
                <form
                    className="modal-window"
                    onSubmit={(ev) =>
                        onSaveNoteEdit(ev, {
                            ...note,
                            info: {
                                ...note.info,
                                title,
                                url: imgUrl,
                            },
                        })
                    }
                >
                    <input
                        className="modal-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />

                    <label className="img-upload-btn icon-btn modal-notes-upload">
                    Upload Image
                        <input
                            className="img-upload-btn"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </label>

                    {imgUrl && (
                        <img
                            src={imgUrl}
                            alt="Uploaded preview"
                            style={{ maxWidth: '100%', marginTop: '1em' }}
                        />
                    )}

                    <div className="modal-actions">
                        <button className="icon-btn" type="reset" onClick={handleReset}>
                            Reset
                        </button>
                        <button className="icon-btn" type="submit">
                            Save
                        </button>
                        <button className="icon-btn" type="button" onClick={onCloseModal}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}
