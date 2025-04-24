// === React
const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

// === Services
import { mailService } from "../services/mail.service.js"
import { debounce } from "../../../services/util.service.js"


// ====== Component ======
// =======================

export function MailCompose({ isComposeOpen, onCloseCompose, saveDraft }) {
    // === Hooks
    const [searchParams, setSearchParams] = useSearchParams()

    const [mail, setMail] = useState(mailService.getEmptyMail())
    const [mailToEdit, setMailToEdit] = useState({ ...mail })

    const debouncedSaveDraft = useRef(debounce(draft => {
        onSaveDraft(draft)
        setMailTitle('Saved as draft')
        setTimeout(() => {
            setMailTitle(draft.subject)
        }, 1500);
    }, 1500)).current

    const [mailTitle, setMailTitle] = useState('')

    // === Effects
    useEffect(() => {
        setMailToEdit({ ...mail })
    }, [])


    useEffect(() => {
        const composeParam = searchParams.get('compose')
        if (!composeParam || composeParam === 'new') {
            console.log("composeParam: ", composeParam)
            const newMail = mailService.getEmptyMail()

            const subjectParam = searchParams.get('newsubject')
            console.log("subjectParam: ", subjectParam)
            if (subjectParam) newMail.subject = subjectParam

            const bodyParam = searchParams.get('newbody')
            console.log("bodyParam: ", bodyParam)

            if (bodyParam) newMail.body = bodyParam

            setMailToEdit(newMail)
            setMailTitle('New Message')
            return
        }

        mailService.get(composeParam)
            .then(mail => {
                setMailToEdit(prevMail => ({ ...prevMail, ...mail }))
                setMailTitle(mail.subject)
            })
    }, [searchParams])


    // === Functions

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }

        const newMail = { ...mailToEdit, [field]: value }
        setMailToEdit(newMail)
        debouncedSaveDraft(newMail)

    }

    function onSaveDraft(draft) {
        saveDraft(draft)

    }

    function onSend(ev) {
        ev.preventDefault()

        mailToEdit.sentAt = Date.now()
        mailToEdit.isRead = false

        SaveMail(mailToEdit)
            .then(mail => {
                onCloseCompose()
                showSuccessMsg(`Email was sent to${mail.to}`)
            })
            .catch(err => {
                console.log("err: ", err)
                showErrorMsg(`somthing went wrong, could not save as draft`)
            })
    }

    function SaveMail(mailToSave) {
        return mailService.save(mailToSave)
    }

    if (!isComposeOpen) return ''

    const {
        to,
        subject,
        body

    } = mailToEdit

    const subjectToShow = subject === '(no subject)' ? '' : subject
    const titleToShow = mailTitle === '(no subject)' || mailTitle === '' ? 'New Mail' : mailTitle

    return (
        <div className="mail-compose grid">
            <div className="compose-header flex space-between align-center">
                <p className="compose-title">{titleToShow}</p>
                <button className="close-btn icon-btn small xmark" onClick={onCloseCompose}></button>

            </div>
            <form className="compose-form grid" onSubmit={onSend}>
                <input className="to-input clean-input" type="text" name="to" value={to} onChange={handleChange} placeholder="To" />
                <input className="subject-input clean-input" type="text" name="subject" value={subjectToShow} onChange={handleChange} placeholder="Subject" />
                <textarea className="body-input clean-input" type="text" name="body" value={body} onChange={handleChange} placeholder=""></textarea>
                <div className="action-btns flex">
                    <button type="button" className="discard-btn icon-btn medium trash-can"></button>
                    <button className="send-btn">Send</button>
                </div>
            </form>
        </div>
    )
}