// === React
// const { useState, useEffect, useRef } = React
const { useEffect, useRef } = React
// const { Routes, Route, Navigate, useParams, useNavigate, Link, useSearchParams } = ReactRouterDOM
const { useNavigate } = ReactRouterDOM

// === Services
import { animateCSS } from "../services/util.service.js"

// === Child Components


// ====== Component ======
// =======================

export function HomePage() {
    // === Hooks
    const navigate = useNavigate()

    const elTitleWraper = useRef(null)
    const elSubtitle = useRef(null)
    const elDescription = useRef(null)
    const elAppsWraper = useRef(null)
    // === Effects
    useEffect(() => {
        animateCSS(elTitleWraper.current, 'fadeInUp',)
        setTimeout(() => { animateCSS(elSubtitle.current, 'fadeInUp',) }, 200);
        setTimeout(() => { animateCSS(elDescription.current, 'fadeInUp',) }, 400);
        setTimeout(() => { animateCSS(elAppsWraper.current, 'fadeInUp',) }, 600);
    }, [])

    // === Functions



    return (
        <section className="home-page grid">

            <div ref={elTitleWraper} className="title-wraper flex align-center hidden-before-anim">
                <img className="brand-icon" src="assets\img\logo\sn-icon.png" alt="SN icon" />
                <h1 className="title">SNoogle</h1>
            </div>
            <p ref={elSubtitle} className="subtitle hidden-before-anim" >Everything you need, in one fast, smart, and simple place.</p>
            <p ref={elDescription} className="description hidden-before-anim" >SNoogle brings your mail and notes together under one beautifully familiar interface. Designed for simplicity and clarity, SNoogle makes communication and capture seamless, intuitive—and yes, a little playful too.
                <br /> No switching tabs. No losing focus. Just you, your thoughts, and the people you care about.</p>

            <div ref={elAppsWraper} className="apps-wraper grid hidden-before-anim">

                <div className="app-container snail flex flex-column align-center" onClick={() => navigate({ pathname: `/mail/` })}>
                    <div className="title-container flex align-center">
                        <img src="assets\img\logo\s-icon.png" alt="" className="app-l-icon" />
                        <h2 className="app-title">SNail</h2>
                    </div>
                    <p className="app-subtitle">Mail that moves at your speed</p>
                    <img src="assets\img\logo\snail-icon.png" alt="" className="app-icon" />
                    <p className="app-description">Classic email. Modern flow. Surprisingly fast for a snail.</p>
                </div>

                <div className="app-container sneep flex flex-column align-center" onClick={() => navigate({ pathname: `/notes/` })}>
                    <div className="title-container flex align-center">
                        <img src="assets\img\logo\n-icon.png" alt="" className="app-l-icon" />
                        <h2 className="app-title">SNeep</h2>
                    </div>
                    <p className="app-subtitle">Keep your thoughts close</p>
                    <img src="assets\img\logo\sneep-icon1.png" alt="" className="app-icon" />
                    <p className="app-description">Notes that feel like second nature. Neat. Nimble. Noteworthy.</p>
                </div>

            </div>
        </section>
    )
}
