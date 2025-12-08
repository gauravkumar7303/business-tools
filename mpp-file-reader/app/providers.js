// 'use client'

// import { createContext, useContext, useState, useEffect } from 'react'

// const ThemeContext = createContext()

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState('light')
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     // Check localStorage for saved theme
//     const savedTheme = localStorage.getItem('theme')
//     if (savedTheme) {
//       setTheme(savedTheme)
//     } else {
//       // Check system preference
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//       setTheme(prefersDark ? 'dark' : 'light')
//     }
//   }, [])

//   useEffect(() => {
//     if (!mounted) return
    
//     // Apply theme to document
//     const root = document.documentElement
//     if (theme === 'dark') {
//       root.classList.add('dark')
//     } else {
//       root.classList.remove('dark')
//     }
//     // Save to localStorage
//     localStorage.setItem('theme', theme)
//   }, [theme, mounted])

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light')
//   }

//   // Prevent hydration mismatch
//   if (!mounted) {
//     return <>{children}</>
//   }

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext)
//   if (!context) {
//     throw new Error('useTheme must be used within ThemeProvider')
//   }
//   return context
// }