// === React
const { useRef } = React
const { NavLink } = ReactRouterDOM


// ====== Component ======
// =======================

export function MailSideNav({ onOpenCompose, isSideNavPinned, unreadByStatus }) {
    // === Hooks
    const intervalId = useRef()
    // === Effects

    // === Functions
    function onOpenSideNav() {
        if (isSideNavPinned) return
        clearTimeout(intervalId.current)
        intervalId.current = setTimeout(() => {
            openSideBar()
        }, 300);
    }
    function onCloseSideNav() {
        if (isSideNavPinned) return
        clearTimeout(intervalId.current)
        intervalId.current = setTimeout(() => {
            closeSideBar()
        }, 300);
    }

    // if (!data) return <div>Loading...</div>
    return (
        <section className="mail-side-nav side-nav flex flex-column">
            <button
                className="compose-btn"
                onClick={onOpenCompose}
                onMouseOver={onOpenSideNav}
                onMouseOut={onCloseSideNav}
            ></button>
            <nav className="side-nav-list">
                <ul className="clean-list flex flex-column">
                    <li>
                        <NavLink to={{ pathname: '/mail/inbox', search: location.search }}
                            className="inbox-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                            <p className="title">Inbox</p>
                            <p className="attribute">{unreadByStatus && unreadByStatus.inbox}</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{ pathname: '/mail/unread', search: location.search }}
                            className="unread-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                            <p className="title">Unread</p>
                            <p className="attribute">{unreadByStatus && unreadByStatus.unread}</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{ pathname: '/mail/starred', search: location.search }}
                            className="starred-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                            <p className="title">Starred</p>
                            <p className="attribute">{unreadByStatus && unreadByStatus.starred}</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{ pathname: '/mail/draft', search: location.search }}
                            className="draft-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                            <p className="title">Drafts</p>
                            <p className="attribute">{unreadByStatus && unreadByStatus.draft}</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{ pathname: '/mail/sent', search: location.search }}
                            className="sent-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                            <p className="title">Sent</p>
                            <p className="attribute">{unreadByStatus && unreadByStatus.sent}</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{ pathname: '/mail/trash', search: location.search }}
                            className="trash-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                            <p className="title">Trash</p>
                            <p className="attribute">{unreadByStatus && unreadByStatus.trash}</p>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </section>
    )
}