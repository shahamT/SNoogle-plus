import { eventBusService } from "../../services/event-bus.service.js"


const { useState, useEffect, useRef } = React


export function FlashMsg() {
    const [msg, setMsg] = useState(null)
    const [visible, setVisible] = useState(false)
    const timeoutRef = useRef()
    const entranceDelayRef = useRef()
  
    useEffect(() => {
      const unsubscribe = eventBusService.on('show-flash-msg', (msg) => {
        setMsg(msg)
  
        // Wait a tick to trigger animation
        entranceDelayRef.current = setTimeout(() => {
          setVisible(true)
        }, 10)
  
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          closeMsg()
        }, 2000)
      })
  
      return () => {
        unsubscribe()
        clearTimeout(timeoutRef.current)
        clearTimeout(entranceDelayRef.current)
      }
    }, [])
  
    function closeMsg() {
      setVisible(false)
      setTimeout(() => {
        setMsg(null)
      }, 300)
    }
  
    if (!msg) return null
  
    return (
      <section className={`flash-msg ${msg.type} ${visible ? 'show' : ''}`}>
        <h4>{msg.txt}</h4>
      </section>
    )
  }

//   usage
// showErrorMsg('i am an error')
// showSuccessMsg('i am a success')