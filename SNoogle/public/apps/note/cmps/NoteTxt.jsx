const {useNavigate } = ReactRouterDOM


import { LongTxt } from '../../../cmps/general/LongTxt.jsx'


export function NoteTxt({ note }) {
    const { title, txt } = note.info
    const navigate = useNavigate()

    return (
        <article className='note-txt'>
            <h3 className='title'>{title}</h3>
            <p className='txt'>{txt && <LongTxt txt={txt} />}</p>
        </article>

    )
}