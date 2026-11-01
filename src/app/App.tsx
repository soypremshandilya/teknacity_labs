import '@/styles/base.css'
import '@/styles/animations.css'
import '@/styles/utilities.css'

import { type ReactNode } from 'react'

import Layout from '@/components/layout/Layout'
import Hero from '@/sections/hero/Hero'
import Services from '@/sections/services/Services'
import About from '@/sections/about/About'
import ContactCta from '@/sections/contact/ContactCta'

type AppProps = {
  children?: ReactNode
}

/**
 * Application shell. Sections are mounted inside <Layout /> as they are built.
 */
export default function App({ children }: AppProps) {
  return (
    <Layout>
      <Hero />
      <Services />
      <About />
      <ContactCta />
      {children}
    </Layout>
  )
}
