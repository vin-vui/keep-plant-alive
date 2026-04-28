type ThemeMode = 'cyber' | 'kawaii'

export const useThemeMode = () => {
  const mode = useState<ThemeMode>('theme-mode', () => {
    if (import.meta.client) {
      return (localStorage.getItem('theme-mode') as ThemeMode) ?? 'cyber'
    }
    return 'cyber'
  })

  function applyClass(m: ThemeMode) {
    const el = document.documentElement
    el.classList.toggle('theme-cyber',  m === 'cyber')
    el.classList.toggle('theme-kawaii', m === 'kawaii')
  }

  function toggle() {
    const next: ThemeMode = mode.value === 'cyber' ? 'kawaii' : 'cyber'
    mode.value = next
    localStorage.setItem('theme-mode', next)
    applyClass(next)
  }

  if (import.meta.client) {
    applyClass(mode.value)
  }

  return { mode: readonly(mode), toggle }
}
