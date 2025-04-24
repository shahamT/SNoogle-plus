

// === React
// const { useState, useEffect, useRef } = React
const { useState, useEffect } = React
// const { Routes, Route, Navigate, useParams, useNavigate, Link, useSearchParams } = ReactRouterDOM
const { Link, useLocation, useNavigate } = ReactRouterDOM

// === Services

// === Child Components




// ====== Component ======
// =======================

export function MainLogo({ /* prop1, prop2 */ }) {
    // === Hooks
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const [logoToShow, setLogoToShow] = useState(null)

    // === Effects
    useEffect(() => {
        if (pathname.startsWith('/mail')) {
            setLogoToShow('mail')
            return
        } else if (pathname.startsWith('/notes')) {
            setLogoToShow('notes')
            return
        } else setLogoToShow('main')

    }, [pathname])

    // === Functions

    // if (!data) return <div>Loading...</div>
    return (

        <div className="main-logo-wraper">
            {logoToShow === 'main' &&
                <img className="main-logo main" src="assets/img/logo/main-logo-clr-gray.png" alt="SNoogle" onClick={() => navigate({ pathname: '/home' })} />
            }

            {logoToShow === 'mail' &&
                <img className="main-logo app" src="assets/img/logo/snail-logo-clr-gray.png" alt="SNail" onClick={() => navigate({ pathname: '/mail' })} />
            }

            {logoToShow === 'notes' &&
                <img className="main-logo app" src="assets/img/logo/sneep-logo-clr-gray.png" alt="SNeep" onClick={() => navigate({ pathname: '/notes' })} />
            }
        </div>
    )
}