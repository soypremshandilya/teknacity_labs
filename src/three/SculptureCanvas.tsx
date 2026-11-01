import { useEffect, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'

import { hasWebGL } from '@/three/hasWebGL'

type Props = {
  children: ReactNode
  /** Camera distance; smaller panels sit slightly further back. */
  cameraZ?: number
}

/**
 * Shared WebGL surface for the hero's smaller visual panels. Mirrors the
 * neural-network canvas: transparent clear colour, responsive sizing, and a
 * static fallback when WebGL is unavailable.
 */
export default function SculptureCanvas({ children, cameraZ = 2.4 }: Props) {
  const [available, setAvailable] = useState(hasWebGL)

  useEffect(() => {
    if (!available) setAvailable(hasWebGL())
  }, [available])

  if (!available) {
    return <div aria-hidden="true" data-webgl-fallback="true" className="size-full bg-bg-sunken" />
  }

  return (
    <div className="size-full [&>canvas]:touch-pan-y">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        fallback={
          <div aria-hidden="true" data-webgl-fallback="true" className="size-full bg-bg-sunken" />
        }
      >
        {children}
      </Canvas>
    </div>
  )
}
