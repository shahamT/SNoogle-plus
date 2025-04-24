// === React
const { useState, useEffect } = React
const Router = ReactRouterDOM.HashRouter
const { Routes, Route, Navigate } = ReactRouterDOM

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



// ====== Component ======
// =======================

export function RootCmp() {
    // === Hooks
    const [isSideNavOpen, setSideNavOpen] = useToggle(false)
    const [isSideNavPinned, setIsSideNavPinned] = useToggle(false)

    // === Effects

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

    return (
        <Router>
            <section className={`app grid main-layout ${sideNanClass}`}>
                <MainHeader isSideNavPinned={isSideNavPinned} setIsSideNavPinned={setIsSideNavPinned} />

                <main className="main-content main-inline-layout">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />


                        <Route path="/mail" element={<Navigate to="/mail/inbox" replace />} />
                        <Route path="/mail/:status/" element={<MailIndex isSideNavPinned={isSideNavPinned}/>} />
                        <Route path="/mail/:status/view/:mailId" element={<MailIndex isSideNavPinned={isSideNavPinned}/>} />


                        <Route path="/notes" element={<NoteIndex isSideNavPinned={isSideNavPinned}/>} />
                        <Route path="/notes/edit/:noteId" element={<NoteIndex isSideNavPinned={isSideNavPinned}/>} />
                        <Route path="/notes/:status/" element={<NoteIndex isSideNavPinned={isSideNavPinned}/>} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <FlashMsg />
                <GlobalDialog />
            </section>
        </Router>
    )
} 