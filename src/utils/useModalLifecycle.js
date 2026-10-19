import { useEffect } from 'react'

/**
 * Standardized modal lifecycle hook.
 * Manages body scroll lock, Lenis pause/start, initial focus, and Escape dismissal.
 * Eliminates modal lifecycle duplication across DemoModal, PrivateRepoModal, and Certifications.
 */
export const useModalLifecycle = (isOpen, onClose, closeBtnRef) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      window.lenis?.stop()
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      window.lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      window.lenis?.start()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => closeBtnRef?.current?.focus(), 80)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose, closeBtnRef])
}

export const scrollToContactSection = () => {
  const contactEl = document.getElementById('contact')
  if (!contactEl) return

  document.body.style.overflow = ''
  document.body.style.touchAction = ''
  window.lenis?.start()

  requestAnimationFrame(() => {
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(contactEl, {
          duration: 2.0,
          force: true,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        })
      } else {
        contactEl.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  })
}
