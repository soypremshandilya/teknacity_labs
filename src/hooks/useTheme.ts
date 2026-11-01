import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'teknacity-theme'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme()
}

/*
 * Shared store so every useTheme() caller reads the same value. Without this the
 * Header, Hero and canvas each own separate state and a separate media listener,
 * so a toggle in one would not reach the others.
 */
let currentTheme: Theme = resolveInitialTheme()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function applyTheme(next: Theme) {
  currentTheme = next

  const root = document.documentElement
  root.setAttribute('data-theme', next)

  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Storage can be unavailable (private mode); the theme still applies.
  }

  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): Theme {
  return currentTheme
}

// One system-preference listener for the whole app, not one per component.
if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('data-theme', currentTheme)

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event: MediaQueryListEvent) => {
      if (!readStoredTheme()) applyTheme(event.matches ? 'dark' : 'light')
    })
}

/**
 * Drives the `data-theme` attribute on <html>, which the global tokens in
 * src/styles/tokens.css read from. An explicit choice persists to localStorage;
 * with no stored choice the system preference applies and stays in sync.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const setTheme = useCallback((next: Theme) => applyTheme(next), [])

  const toggleTheme = useCallback(() => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, setTheme, toggleTheme }
}
