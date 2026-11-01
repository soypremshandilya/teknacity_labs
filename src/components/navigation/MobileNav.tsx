import { useEffect } from 'react'
import { X } from 'lucide-react'

import { NAV_ITEMS } from '@/data/navigation'
import { scrollToSection } from '@/lib/scrollToSection'

type MobileNavProps = {
  open: boolean
  onClose: () => void
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      id="mobile-nav"
      className="border-t border-border bg-surface/95 backdrop-blur-xl md:hidden"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="th-eyebrow">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex size-9 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 ease-swiss hover:bg-bg-sunken hover:text-fg"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <nav aria-label="Mobile">
        <ul className="flex flex-col px-5 py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection(item.id)
                  onClose()
                }}
                className="block border-b border-border py-4 font-display text-xl tracking-tight text-fg-muted transition-colors duration-200 ease-swiss last:border-b-0 hover:text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
