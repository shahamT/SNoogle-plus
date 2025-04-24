// === Child Components
import { Loader } from "../../../cmps/general/Loader.jsx";
import { MailPreview } from "./MailPreview.jsx";


// ====== Component ======
// =======================

export function MailList({
    mails,
    onMarkRead,
    onToogleStarred,
    onToogleChecked,
    checkedMails,
    onRemoveMail,
    onMarkUnRead,
    addParam,
    isLoading }) {

    if (!mails) return (
        <section className="mail-list loader-wraper flex" >
            <Loader
                size={6}
                width={8}
                color="#EA4335"
                speed="2"
                textSize={1.2}
            />

        </section>
    )


    return (
        <section className="mail-list scrollable-content flex flex-column" >

            {isLoading &&
                <div className="loader-wraper flex" >
                    <Loader
                        size={6}
                        width={8}
                        color="#EA4335"
                        speed="2"
                        textSize={1.2}
                    />
                </div>}
            {!isLoading &&
                <React.Fragment>
                    {mails.length === 0 && <img className="emails-empty-state" src="assets\img\empty-state\mail-empty-state.png" alt="" />}
                    {mails.map(mail => {
                        return <MailPreview
                            key={mail.id}
                            mail={mail}
                            onMarkRead={onMarkRead}
                            onToogleStarred={onToogleStarred}
                            onToogleChecked={onToogleChecked}
                            checkedMails={checkedMails}
                            onRemoveMail={onRemoveMail}
                            onMarkUnRead={onMarkUnRead}
                            addParam={addParam}
                        />
                    })}
                </React.Fragment>
            }

        </section>
    )
}



