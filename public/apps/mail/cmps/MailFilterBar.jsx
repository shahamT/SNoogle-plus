// === React
const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

// === Services
import { mailService } from "../services/mail.service.js"


// ====== Component ======
// =======================

export function MailFilterBar({
    initialStart = '',
    initialEnd = '',
    mailsPageInfo,
}) {
    // === Hooks
    const [searchParams, setSearchParams] = useSearchParams()

    const [startDate, setStartDate] = useState(initialStart)
    const [endDate, setEndDate] = useState(initialEnd)


    // === Effects
    useEffect(() => {
        const fromParam = searchParams.get('filterfrom') || '';
        const toParam = searchParams.get('filterto') || '';

        setStartDate(isValidDate(fromParam) ? fromParam : '');
        setEndDate(isValidDate(toParam) ? toParam : '');
    }, [searchParams]);


    // === Functions


    function addParams(keys) {
        const params = mailService.getParamsFromSearchParams(searchParams)
        keys.forEach(key => {
            const k = Object.keys(key)[0]
            const v = key[k]
            params[k] = v
        })
        setSearchParams(params)
        return params
    }

    function isValidDate(str) {
        const isoPattern = /^\d{4}-\d{2}-\d{2}$/
        return isoPattern.test(str) && !Number.isNaN(Date.parse(str))
    }



    // FROM picker changed
    function handleStartChange(ev) {
        const rawStart = ev.target.value;
        const newStart = isValidDate(rawStart) ? rawStart : ''

        // keep range valid
        const newEnd = endDate && newStart > endDate ? newStart : endDate

        setStartDate(newStart)
        setEndDate(newEnd)

        addParams([
            { filterfrom: newStart },
            { filterto: newEnd }
        ]);
    }

    // Clear FROM picker
    function onClearStartDate() {
        setStartDate('');
        addParams([{ filterfrom: '' }])
    }

    // TO picker changed
    function handleEndChange(ev) {
        const rawEnd = ev.target.value;
        const newEnd = isValidDate(rawEnd) ? rawEnd : ''

        // keep range valid
        const newStart = startDate && newEnd < startDate ? newEnd : startDate

        setStartDate(newStart)
        setEndDate(newEnd)

        addParams([
            { filterfrom: newStart },
            { filterto: newEnd }
        ]);
    }

    // Clear TO picker
    function onClearEndDate() {
        setEndDate('');
        addParams([{ filterto: '' }])
    }


    function onNextPage() {
        let { currpage } = mailService.getParamsFromSearchParams(searchParams)
        currpage = currpage ? +currpage : 1
        addParams([{ currpage: currpage + 1 }])
    }
    function onPrevPage() {
        let { currpage } = mailService.getParamsFromSearchParams(searchParams)
        currpage = currpage ? +currpage : 1
        addParams([{ currpage: currpage - 1 }])
    }

    let nextPageClass
    let prevPageClass
    let lastItemCount
    if (mailsPageInfo) {
        nextPageClass = mailsPageInfo.endIdx >= mailsPageInfo.total ? "disabled" : ""
        prevPageClass = mailsPageInfo.startIdx <= 0 ? "disabled" : ""
        lastItemCount = mailsPageInfo.endIdx >= mailsPageInfo.total ? mailsPageInfo.total : mailsPageInfo.endIdx
    }

    return (
        <section className="mail-filter-bar flex">
            <div className="action-btns flex">
                <label className="checkbox-wrapper">
                    <input type="checkbox" className="mail-checkbox" />
                </label>
                {/* <button className="make-note-btn icon-btn big note-sticky"></button> */}
                {/* <button className="mark-unread-btn icon-btn big envelope" ></button> */}
                {/* <button className="delete-btn icon-btn big trash-can-regular" ></button> */}
            </div>


            <div className="date-range-picker flex align-center">

                <label>From</label>
                <div className="input-wraper">
                    {startDate && <button className="clear-btn icon-btn small xmark" onClick={onClearStartDate}></button>}
                    <NativeDateInput
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={handleStartChange}
                    />
                </div>

                <label>To </label>
                <div className="input-wraper">
                    {endDate && <button className="clear-btn icon-btn small xmark" onClick={onClearEndDate}></button>}
                    <NativeDateInput
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={handleEndChange}
                    />
                </div>
            </div>

            {mailsPageInfo &&
                <div className="pagination-container flex align-center">
                    <p className="pagination-text">{mailsPageInfo.startIdx + 1} - {lastItemCount} of {mailsPageInfo.total}</p>
                    <button className={`prev-page-btn icon-btn medium chevron-left ${prevPageClass}`} onClick={onPrevPage}></button>
                    <button className={`next-page-btn icon-btn medium chevron-right ${nextPageClass}`} onClick={onNextPage}></button>
                </div>
            }

        </section>
    )
}




export function NativeDateInput(props) {
    const ref = useRef(null);

    function openPicker() {
        if (ref.current && typeof ref.current.showPicker === 'function') {
            ref.current.showPicker();
        }
    }

    return (
        <input
            {...props}
            ref={ref}
            onClick={openPicker}
        />
    );
}