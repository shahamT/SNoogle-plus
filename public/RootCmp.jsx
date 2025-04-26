// === React
const { useState, useEffect, useRef } = React
const Router = ReactRouterDOM.BrowserRouter
const { Routes, Route, Navigate, useLocation } = ReactRouterDOM

// === Services
import { useToggle } from "./custom-hooks/useToggle.js"
import { closeSideBar, eventBusService, openSideBar } from "./services/event-bus.service.js"


// === Child Components
import { MainHeader } from "./cmps/app/MainHeader.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { FlashMsg } from "./cmps/general/FlashMsg.jsx"
import { GlobalDialog } from "./cmps/general/Modal.jsx"
import { NotFound } from "./cmps/general/NotFound.jsx"
import { NoteIndex } from "./apps/note/pages/NoteIndex.jsx"
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { NoteEditModal } from "./apps/note/cmps/NoteEditModal.jsx"
import { AboutPage } from "./pages/AboutPage.jsx"
import { Signup } from "./pages/Signup.jsx"
import { authService } from "./services/auth.service.js"
import { Login } from "./pages/login.jsx"



// ====== Component ======
// =======================

export function RootCmp() {
    // === Hooks
    const { pathname } = useLocation()
    const location = useLocation()
    const [currentFullPath, setCurrentFullPath] = useState(null)

    const [loggedinUser, setLoggedinUser] = useState(authService.getLoggedinUser())

    const [isSideNavOpen, setSideNavOpen] = useToggle(false)
    const [isSideNavPinned, setIsSideNavPinned] = useToggle(false)

    // === Effects
    // save the current page url
    useEffect(() => {
        if (location.pathname.startsWith('/signup') || location.pathname.startsWith('/login')) return
        const fullPath = location.pathname + location.search
        setCurrentFullPath(fullPath)
      }, [location])


    useEffect(() => {
        const unsubscribe = eventBusService.on('toggle-side-bar', (state) => {
            setSideNavOpen(state)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        if (isSideNavPinned) {
            openSideBar()
        } else closeSideBar()

    }, [isSideNavPinned])

    // === Functions

    const sideNanClass = isSideNavOpen ? "side-nav-open" : ""
    let showMainHeader = pathname.startsWith('/login') || pathname.startsWith('/signup') ? false : true
    let pageLayout = pathname.startsWith('/login') || pathname.startsWith('/signup') ? 'clear-layout' : 'main-layout'



    return (
        <section className={`app grid ${pageLayout} ${sideNanClass}`}>
            {showMainHeader &&
                <MainHeader
                    isSideNavPinned={isSideNavPinned}
                    setIsSideNavPinned={setIsSideNavPinned}
                    currentFullPath={currentFullPath}
                    loggedinUser={loggedinUser}
                    setLoggedinUser={setLoggedinUser}
                />}

            <main className="main-content main-inline-layout">
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/signup" element={<Signup setLoggedinUser={setLoggedinUser} />} />
                    <Route path="/login" element={<Login setLoggedinUser={setLoggedinUser} />} />


                    <Route path="/mail" element={<Navigate to="/mail/inbox" replace />} />
                    <Route path="/mail/:status/" element={<MailIndex isSideNavPinned={isSideNavPinned} />} />
                    <Route path="/mail/:status/view/:mailId" element={<MailIndex isSideNavPinned={isSideNavPinned} />} />


                    <Route path="/notes" element={<NoteIndex isSideNavPinned={isSideNavPinned} />} />
                    <Route path="/notes/edit/:noteId" element={<NoteIndex isSideNavPinned={isSideNavPinned} />} />
                    <Route path="/notes/:status/" element={<NoteIndex isSideNavPinned={isSideNavPinned} />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <FlashMsg />
            <GlobalDialog />
        </section>
    )
} 