import { ArrowUp } from 'lucide-react'

import LogoMark from '@/components/brand/LogoMark'
import { scrollToSection } from '@/lib/scrollToSection'

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="th-shell flex flex-col gap-4 py-6 text-2xs tracking-label uppercase text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-5 text-fg" />
          <span className="font-medium text-fg">Teknacity Labs</span>
          <span aria-hidden="true" className="text-border-strong">
            /
          </span>
          <span className="normal-case tracking-normal">
            Building Intelligence for Tomorrow.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href="https://www.linkedin.com/company/teknacity-labs/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 ease-swiss hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/teknacitylabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 ease-swiss hover:text-fg"
          >
            Instagram
          </a>

          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="group inline-flex items-center gap-1.5 transition-colors duration-300 ease-swiss hover:text-fg"
          >
            Back to Top
            <ArrowUp
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-3 transition-transform duration-300 ease-swiss group-hover:-translate-y-0.5"
            />
          </button>

          <span>© 2026 Teknacity Labs</span>
        </div>
      </div>
    </footer>
  )
}
