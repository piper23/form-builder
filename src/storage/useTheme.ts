import { useState, useEffect } from 'react'

const THEME_KEY = 'fb_theme'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
    const t = saved ?? 'light'
    document.documentElement.classList.toggle('dark', t === 'dark')
    return t
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme }
}
