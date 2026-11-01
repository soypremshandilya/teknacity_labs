export type NavItem = {
  label: string
  /** Target section id on the homepage. */
  id: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', id: 'home' },
  { label: 'Services', id: 'services' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Research', id: 'research' },
  { label: 'About', id: 'about' },
]

export const CONTACT_SECTION_ID = 'contact'
