/**
 * Smooth-scrolls to a homepage section, tolerating sections that do not exist
 * yet (page sections are still being built).
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id)

  if (!target) return

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}
