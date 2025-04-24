// === React
const { useRef } = React
const { NavLink } = ReactRouterDOM


// ====== Component ======
// =======================

export function NoteSideNav({ onOpenCompose, isSideNavPinned }) {
    // === Hooks
const intervalId = useRef()
 

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
        intervalId.current =setTimeout(() => {
            closeSideBar()
        }, 300);
    }


    return (
        <section className="note-side-nav side-nav flex flex-column">

            <nav className="side-nav-list">
                <ul className="clean-list flex flex-column">
                    <li>
                    <NavLink to={{ pathname: '/notes/main', search: location.search }}
                            className="inbox-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                                <p className="title">Notes</p>
                                <p className="attribute"></p>
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to={{ pathname: '/notes/texts', search: location.search }}
                            className="txt-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                                <p className="title">Texts</p>
                                <p className="attribute"></p>
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to={{ pathname: '/notes/todos', search: location.search }}
                            className="todos-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                                <p className="title">To-dos</p>
                                <p className="attribute"></p>
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to={{ pathname: '/notes/images', search: location.search }}
                            className="draft-btn flex"
                            onMouseOver={onOpenSideNav}
                            onMouseOut={onCloseSideNav} >
                                <p className="title">Images</p>
                                <p className="attribute"></p>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </section>
    )
}