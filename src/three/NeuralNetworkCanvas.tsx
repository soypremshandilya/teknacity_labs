import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import NeuralNetworkScene from '@/three/NeuralNetworkScene'
import { useTheme } from '@/hooks/useTheme'

/** Probes for a usable WebGL context without throwing. */
function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

type Props = {
  className?: string
}

/**
 * WebGL neural network. Falls back to a static monochrome field when WebGL is
 * unavailable or context creation fails, so the hero never breaks.
 */
export default function NeuralNetworkCanvas({ className }: Props) {
  const { theme } = useTheme()
  const [available, setAvailable] = useState(hasWebGL)
  const [failed, setFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Re-check once mounted; some environments only report after first paint.
  useEffect(() => {
    if (!available) setAvailable(hasWebGL())
  }, [available])

  if (!available || failed) {
    return (
      <div
        aria-hidden="true"
        data-webgl-fallback="true"
        className={`size-full bg-bg-sunken ${className ?? ''}`}
      >
        <div className="size-full opacity-50 [background-image:radial-gradient(circle_at_50%_45%,var(--color-fg-subtle)_1px,transparent_1px)] [background-size:14px_14px]" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`size-full ${className ?? ''}`}>
      {/* touch-action pan-y keeps vertical page scrolling working on mobile. */}
      <div className="size-full [&>canvas]:touch-pan-y">
        <Canvas
          camera={{ position: [0, 0, 6.4], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
          onError={() => setFailed(true)}
          fallback={
            <div
              aria-hidden="true"
              data-webgl-fallback="true"
              className="size-full bg-bg-sunken"
            />
          }
        >
          <Suspense fallback={null}>
            <NeuralNetworkScene theme={theme} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
