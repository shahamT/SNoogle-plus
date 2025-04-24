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

export function AboutPage() {
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
        <section className="about-page grid">

            <div ref={elTitleWraper} className="title-wraper flex flex-column align-center hidden-before-anim">
                <img className="brand-icon" src="assets\img\logo\main-logo-clr-gray.png" alt="SN icon" />
                <h1 className="title">About</h1>
            </div>
            <p ref={elSubtitle} className="subtitle hidden-before-anim" >We’re Shaham and Noga <br /> fullstack development students at Coding Academy</p>
            <p ref={elDescription} className="description hidden-before-anim" >We met during the course and teamed up to build this app as part of our learning process. It’s one of several projects we’ve created together while working toward a career change into tech.</p>

            <div ref={elAppsWraper} className="apps-wraper grid hidden-before-anim">

                <div className="app-container snail flex flex-column align-center" >
                    <div className="title-container flex align-center">
                        <img src="assets\img\logo\s-icon.png" alt="" className="app-l-icon" />
                        <h2 className="app-title">Shaham</h2>
                    </div>
                    <img src="assets\img\about\shaham-about.png" alt="" className="app-icon" />
                </div>

                <div className="app-container sneep flex flex-column align-center" >
                    <div className="title-container flex align-center">
                        <img src="assets\img\logo\n-icon.png" alt="" className="app-l-icon" />
                        <h2 className="app-title">Noga</h2>
                    </div>
                    <img src="assets\img\about\noga-about.png" alt="" className="app-icon" />
                </div>

            </div>
        </section>
    )
}
