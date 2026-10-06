import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  themeToggleRef: null
})

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('omnimind-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const themeToggleRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('omnimind-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    if (themeToggleRef.current) {
      gsap.fromTo(
        themeToggleRef.current,
        { rotate: -90, scale: 0.8 },
        { rotate: 0, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }
      )
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeToggleRef }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
