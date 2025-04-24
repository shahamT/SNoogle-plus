import { eventBusService } from "../../services/event-bus.service.js"

const { useEffect, useRef, useState }= React

export function GlobalDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [ContentCmp, setContentCmp] = useState(null)
    const [callbacks, setCallbacks] = useState({
      onConfirm: null,
      onCancel: null,
      onClose: null,
    })
  
    const overlayRef = useRef()
  
    useEffect(() => {
      const unsubscribeShow = eventBusService.on('show-dialog', ({ content, onConfirm, onCancel, onClose }) => {
        setContentCmp(() => content)
        setCallbacks({ onConfirm, onCancel, onClose })
        setIsOpen(true)
      })
  
      const unsubscribeClose = eventBusService.on('close-dialog', (reason) => {
        const { onConfirm, onCancel, onClose } = callbacks
        if (reason === 'confirm' && onConfirm) onConfirm()
        else if (reason === 'cancel' && onCancel) onCancel()
        else if (onClose) onClose()
  
        setIsOpen(false)
        setTimeout(() => {
          setContentCmp(null)
          setCallbacks({ onConfirm: null, onCancel: null, onClose: null })
        }, 300)
      })
  
      return () => {
        unsubscribeShow()
        unsubscribeClose()
      }
    }, [callbacks])
  
    function handleOverlayClick(e) {
      if (e.target === overlayRef.current) {
        eventBusService.emit('close-dialog', 'overlay')
      }
    }
  
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') eventBusService.emit('close-dialog', 'escape')
      }
      if (isOpen) window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen])
  
    const Content = ContentCmp
  
    return (
      <div
        className={`dialog-overlay ${isOpen ? 'open' : ''}`}
        ref={overlayRef}
        onClick={handleOverlayClick}
      >
        <div className={`dialog-content ${isOpen ? 'open' : ''}`}>
          {Content && <Content {...callbacks} />}
        </div>
      </div>
    )
  }



//   Usage:

// ======== call the modal ========
// ================================

    // function onConfirm() {
    //     console.log('✅ User confirmed!')
    //   }
    
    //   function onCancel() {
    //     console.log('❌ User cancelled!')
    //   }
    
    //   function onClose() {
    //     console.log('👋 Dialog closed (overlay or ESC)')
    //   }
    
    //   function onOpenDialog() {
    //     showDialog({
    //       content: DialogContentTemp, // 👈 pass the component (not JSX)
    //       onConfirm,
    //       onCancel,
    //       onClose,
    //     })
    //   }

    // return (
    //        <button onClick={onOpenDialog}>open DIalog</button>
    // )


// ======== content component ========
// ====================================
// export function DialogContentTemp({ onConfirm, onCancel }) {
//     return (
//         <React.Fragment>
//             <h2>Are you sure?</h2>
//             <p>This action cannot be undone.</p>
//             <div>
//                 <button onClick={() => { closeDialog('cancel') }}>Cancel</button>
//                 <button onClick={() => { closeDialog('confirm') }}>Confirm</button>
//             </div>
//         </React.Fragment>
//     )
// }