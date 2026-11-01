import { Moon, Sun } from 'lucide-react'

import type { Theme } from '@/hooks/useTheme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
  className?: string
}

export default function ThemeToggle({
  theme,
  onToggle,
  className = '',
}: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-border text-fg-muted transition-[color,border-color,background-color] duration-200 ease-swiss hover:border-border-strong hover:bg-bg-sunken hover:text-fg focus-visible:outline-2 ${className}`}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-4" strokeWidth={1.5} />
      ) : (
        <Moon aria-hidden="true" className="size-4" strokeWidth={1.5} />
      )}
    </button>
  )
}
