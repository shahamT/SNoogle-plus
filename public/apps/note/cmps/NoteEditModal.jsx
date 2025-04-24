
const {useEffect,useRef} = React
const {useNavigate} = ReactRouterDOM

import { noteService } from "../services/note.service.js"

import { NoteImagModal } from "./NoteImgModal.jsx"
import { NoteTodosModal } from "./NoteTodosModal.jsx"
import { NoteTxtModal } from "./NoteTxtModal.jsx"

export function NoteEditModal({onCloseModal,onStyleSave,note}){
    const navigate = useNavigate()
    
    const dialogRef = useRef()


    useEffect(() => {
        if (note && dialogRef.current) dialogRef.current.showModal()
      }, [note])


    function onSaveNoteEdit(ev, note) {
        ev.preventDefault()
        noteService.save(note)
            .then(() => {
                console.log("save note EDIT:",note)
                showSuccessMsg('Note has been successfully save!')
            })
            .finally(onCloseModal)
    }

    function handleReset(ev) {
        ev.preventDefault()
        setCurrTitle('')
        setIsPinned(false)
        setTodos([{ txt: '', doneAt: null }])
      }

    
   

    
    if (!note) return <div>Loading...</div>
    return (
        <dialog ref={dialogRef} className="note-dialog">
            {note && <NoteType note={note} onSaveNoteEdit={onSaveNoteEdit} onCloseModal={onCloseModal} />}
        
      </dialog>
    )
}
function NoteType(props) {
    const { note } = props
    const type = note.type

    const dynamicCmpMap = {
        NoteTxt: <NoteTxtModal {...props} />,
        NoteTodos: <NoteTodosModal {...props} />,
        NoteImg: <NoteImagModal {...props} />,
    }
    return dynamicCmpMap[type] || null
}

