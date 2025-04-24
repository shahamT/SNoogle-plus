// === React
const { useState, useEffect } = React
const { useParams, useNavigate, useLocation } = ReactRouterDOM

// === Services
import { elapsedTime } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

// ====== Component ======
// =======================

export function MailView({
    onToogleStarred,
    onRemoveMail,
    onMarkUnRead,
}) {

    // === Hooks
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const [mail, setMail] = useState(null)
    const { mailId } = useParams()

    // === Effects
    useEffect(() => {
        LoadMail()
    }, [mailId])

    // === Functions

    function LoadMail() {
        mailService.get(mailId)
            .then(mail => setMail(mail))
            .catch(err => console.log("err: ", err))
            showErrorMsg(`somthing went wrong, could not load emails`)

    }


    function handleToogleStarred() {
        setMail(prevMail => {
            const updatedMail = { ...prevMail, isStarred: !prevMail.isStarred }
            onToogleStarred(updatedMail)
            return updatedMail
        })
        onToogleStarred(mail)
    }


    function handleRemoveMail() {
        onRemoveMail(mail)
        navigateBack()
    }

    function handleMarkUnRead() {
        onMarkUnRead(mail)
        navigateBack()
    }

    function handleBack() {
        navigateBack()
    }

    function navigateBack() {
        const match = pathname.match(/^\/mail\/(inbox|starred|draft|trash|unread|sent)/)
        const status = match ? match[1] : 'inbox'
        navigate({ pathname: `/mail/${status}`, search: location.search })
    }


    if (!mail) return <div>Loading...</div>

    const {
        from,
        fromName,
        body,
        subject,
        sentAt,
        isStarred,
        to,
    } = mail
    const isStarredClass = isStarred ? "is-starred" : ""
    console.log("isStarredClass: ", isStarredClass)
    return (
        <section className="mail-view scrollable-content grid">

            <div className="mail-action-btns flex">
                <button className="back-btn icon-btn big arrow-left" onClick={handleBack}></button>
                <button className="make-note-btn icon-btn big note-sticky"></button>
                <button className="mark-unread-btn icon-btn big envelope" onClick={handleMarkUnRead}></button>
                <button className="delete-btn icon-btn big trash-can-regular" onClick={handleRemoveMail}></button>

            </div>

            <div className="mail-content grid">
                <img src="assets/img/mail/default-user.png" className="sender-img" />
                <h2 className="mail-subject">{subject}</h2>

                <div className="details-wraper grid">
                    <p className="mail-from-name">fromname{fromName}</p>
                    <p className="mail-from">{`<${from}>`}</p>
                    <p className="mail-sent-at">{elapsedTime(sentAt)}</p>
                    <button className={`star-btn icon-btn medium star ${isStarredClass}`} onClick={handleToogleStarred}></button>
                </div>
                <p className="mail-to">to: {to}</p>

                <p className="mail-body">{body}</p>
            </div>

        </section>
    )
}