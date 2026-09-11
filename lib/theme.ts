export type Theme = 'light' | 'dark'

const THEME_KEY = 'alchasys-theme'

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // storage unavailable — fall through to system preference
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Current effective theme (stored preference, else system). */
export function getCurrentTheme(): Theme {
  return getInitialTheme()
}

/** Runs before first paint to apply the saved (or system) theme, so dark-mode users never see a white flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`

const themeListeners = new Set<() => void>()

export function subscribeToTheme(callback: () => void): () => void {
  themeListeners.add(callback)
  return () => {
    themeListeners.delete(callback)
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  document.documentElement.classList.toggle('dark', theme === 'dark')

  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // storage unavailable — the class still applies for this session
  }

  for (const listener of themeListeners) {
    listener()
  }
}
