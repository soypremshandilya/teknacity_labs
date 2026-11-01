import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

export type MotionEnv = {
  /** 0 for reduced motion, reduced on small screens, otherwise 1. */
  intensity: number
  /** True while the canvas is off-screen or the tab is hidden. */
  paused: boolean
  /** True when the user prefers reduced motion. */
  reduced: boolean
}

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Central motion policy for the hero scenes.
 *
 * Reads environment state through a ref so the animation loop never triggers a
 * React re-render. Scenes call `read()` at the top of their own useFrame.
 */
export function useMotionProfile() {
  const { gl } = useThree()

  const env = useRef({
    visible: true,
    reduced: false,
    mobile: false,
  })

  useEffect(() => {
    const reducedQuery = window.matchMedia(REDUCED_QUERY)
    const mobileQuery = window.matchMedia(MOBILE_QUERY)

    const sync = () => {
      env.current.reduced = reducedQuery.matches
      env.current.mobile = mobileQuery.matches
    }
    sync()

    reducedQuery.addEventListener('change', sync)
    mobileQuery.addEventListener('change', sync)

    // Parks the scene while it is scrolled out of view.
    const observer = new IntersectionObserver(
      (entries) => {
        env.current.visible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.01 },
    )
    observer.observe(gl.domElement)

    const onVisibility = () => {
      env.current.visible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      reducedQuery.removeEventListener('change', sync)
      mobileQuery.removeEventListener('change', sync)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [gl])

  const api = useRef({
    read: (): MotionEnv => {
      const { visible, reduced, mobile } = env.current
      return {
        paused: !visible,
        reduced,
        intensity: reduced ? 0 : mobile ? 0.45 : 1,
      }
    },
  })

  return api.current
}
