// === React
const { useState, useEffect } = React
const { useSearchParams, useLocation, useNavigate } = ReactRouterDOM

// === Services
import { mailService } from "../../apps/mail/services/mail.service.js"
import { noteService } from "../../apps/note/services/note.service.js"


// ====== Component ======
// =======================

export function MainSearchBar() {
    // === Hooks
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterByToEdit, setfilterByToEdit] = useState(getParamsFromURL())

    // === Effects
    useEffect(() => {
        setSearchParams({ ...searchParams, ...filterByToEdit  })
    }, [filterByToEdit])

    // === Functions

    function getParamsFromURL() {
        if (pathname.startsWith('/mail')) {
            return mailService.getParamsFromSearchParams(searchParams)
        } else if (pathname.startsWith('/notes')) {
            return noteService.getFilterFromSearchParams(searchParams)
        }
    }

    function onSearchChange(target) {
        handleChange(target)
    }

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
        setfilterByToEdit(prevFilterByToEdit => ({ ...prevFilterByToEdit, [field]: value }))
    }

    function getPlaceholder() {
        if (pathname.startsWith('/mail')) {
            return "Search mail"
        } else if (pathname.startsWith('/notes')) {
            return "Search note"
        }
    }


    function onClearInput() {
        setfilterByToEdit(prevFilterByToEdit => ({ ...prevFilterByToEdit, txt: "" }))
    }


    const searchInput = filterByToEdit.txt ? filterByToEdit.txt : ""
    const clearBtnClass = filterByToEdit.txt ? "" : "hidden";

    return (
        <div className="main-search-bar">
            <input
                name="txt"
                type="text"
                className="search-input"
                value={searchInput}
                onChange={onSearchChange}
                placeholder={getPlaceholder()} />

            <button className={`clear-search-btn icon-btn x big ${clearBtnClass}`} onClick={onClearInput}></button>
        </div>
    )
}