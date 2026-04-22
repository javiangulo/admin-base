'use client'

import * as React from 'react'
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(() => ({theme, toggleTheme}), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
