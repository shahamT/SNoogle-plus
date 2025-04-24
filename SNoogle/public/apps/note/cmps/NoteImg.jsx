export function NoteImg({ note }) {
    const { title, url } = note.info

    return <article className='note-img'>
        
        <h3 className='title'>{title}</h3>
        <img className='img' src={url} alt="" /> 
        
    </article>

}

