import { NotePreview } from "./NotePreview.jsx"


export function NoteList({ onStyleSave, openColorNoteId, setOpenColorNoteId, notes, onRemove, onSetPin, updateTodo, onDuplicate }) {
        const pinnedNotes = notes.filter(note => note.isPinned)
        const unpinnedNotes = notes.filter(note => !note.isPinned)


        return (<React.Fragment>
                <section className="note-list pinned">

                        {pinnedNotes.map(note =>
                                <NotePreview key={note.id} onStyleSave={onStyleSave} openColorNoteId={openColorNoteId} setOpenColorNoteId={setOpenColorNoteId} note={note} onDuplicate={onDuplicate} onSetPin={onSetPin} updateTodo={updateTodo} onRemove={onRemove} />
                        )}
                </section>
                <section className="note-list regular">

                        {unpinnedNotes.map(note =>
                                <NotePreview key={note.id} onStyleSave={onStyleSave} openColorNoteId={openColorNoteId} setOpenColorNoteId={setOpenColorNoteId} note={note} onDuplicate={onDuplicate} onSetPin={onSetPin} updateTodo={updateTodo} onRemove={onRemove} />
                        )}
                </section>
                </React.Fragment>
        )
}
