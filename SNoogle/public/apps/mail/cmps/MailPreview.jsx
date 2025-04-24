// === React
const { useEffect, useState } = React
const { useNavigate, useLocation } = ReactRouterDOM

// === Services
import { elapsedTime } from "../../../services/util.service.js"


// ====== Component ======
// =======================

export function MailPreview({
    mail,
    onMarkRead,
    onToogleStarred,
    onToogleChecked,
    checkedMails,
    onRemoveMail,
    onMarkUnRead,
    addParam }) {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [isChecked, setIsChecked] = useState(getCheckedState())
    // === Hooks

    // === Effects
    useEffect(() => {
    }, [mail])

    useEffect(() => {
        setIsChecked(getCheckedState())
    }, [checkedMails])



    // === Functions
    function onOpenMail() {
        if (!mail.sentAt) {
            addParam('compose', mail.id)
            return
        }

        const match = pathname.match(/^\/mail\/(inbox|starred|draft|trash|unread|sent)/)
        const status = match ? match[1] : 'inbox'
        navigate({ pathname: `/mail/${status}/view/${mail.id}`, search: location.search })
    }

    function handleToogleStarred(ev) {
        ev.stopPropagation()
        onToogleStarred(mail)
    }

    function handleToogleChecked(ev) {
        ev.stopPropagation()
        onToogleChecked(mail)
    }

    function handleRemoveMail(ev) {
        ev.stopPropagation()
        onRemoveMail(mail)
    }

    function handleMarkUnRead(ev) {
        ev.stopPropagation()
        onMarkUnRead(mail)
    }

    function handleMarkRead(ev) {
        ev.stopPropagation()
        onMarkRead(mail)
    }

    function getCheckedState() {
        // return Array.isArray(checkedMails) && checkedMails.current.includes(mail.id) ? true : false
    }

    const {
        from,
        body,
        subject,
        sentAt,
        isRead,
        isStarred,
        createdAt,
    } = mail


    const isReadClass = isRead ? "is-read" : ""
    const isStarredClass = isStarred ? "is-starred" : ""
    const isCheckedClass = isChecked ? "is-checked" : ""
    const fromToShow = sentAt ? from : 'Draft'
    const isDraftClass = sentAt ? '' : 'draft'
    const timeStampToShow = sentAt ? sentAt : createdAt

    
    return (
        <article className={`mail-preview flex ${isReadClass} ${isDraftClass}`} onClick={onOpenMail}>
            <label className="checkbox-wrapper" onClick={e => e.stopPropagation()}>
                <input type="checkbox" className={`checkbox mail-checkbox ${isCheckedClass}`} onClick={handleToogleChecked} />
            </label>
            {/* <input className={`checkbox mail-checkbox ${isCheckedClass}`} type="checkbox" onClick={handleToogleChecked} /> */}
            <button className={`star-btn icon-btn medium star ${isStarredClass}`} onClick={handleToogleStarred}></button>
            <p className="mail-from">{fromToShow}</p>
            <div className="mail-content-wraper grid">
                <p className="mail-subject">{subject}</p>
                <p className="seperator">-</p>
                <p className="mail-body-snippet">{body}</p>
            </div>
            <p className="mail-sent-at">{elapsedTime(timeStampToShow)}</p>
            <div className="mail-action-btns">
                <button className="delete-btn icon-btn medium trash-can-regular" onClick={handleRemoveMail}></button>
                {isRead && <button className="mark-unread-btn icon-btn medium envelope" onClick={handleMarkUnRead}></button>}
                {!isRead && <button className="mark-read-btn icon-btn medium envelope-open" onClick={handleMarkRead}></button>}
            </div>

        </article>
    )
}

