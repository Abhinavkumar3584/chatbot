import React, { createContext, useContext, useEffect, useState } from 'react'

const LayoutContext = createContext()

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

export const LayoutProvider = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [pyqVisible, setPyqVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const handleChange = () => setIsMobile(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleSidebar = () => {
    setSidebarVisible((prev) => {
      const next = !prev
      if (isMobile && next) {
        setPyqVisible(false)
        setMobileMenuOpen(false)
      }
      return next
    })
  }

  const togglePyq = () => {
    setPyqVisible((prev) => {
      const next = !prev
      if (isMobile && next) {
        setSidebarVisible(false)
        setMobileMenuOpen(false)
      }
      return next
    })
  }

  const openMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(true)
      setSidebarVisible(false)
      setPyqVisible(false)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const closeAllOverlays = () => {
    setSidebarVisible(false)
    setPyqVisible(false)
    setMobileMenuOpen(false)
  }

  return (
    <LayoutContext.Provider value={{
      sidebarVisible,
      pyqVisible,
      mobileMenuOpen,
      isMobile,
      toggleSidebar,
      togglePyq,
      openMobileMenu,
      closeMobileMenu,
      closeAllOverlays
    }}>
      {children}
    </LayoutContext.Provider>
  )
}
