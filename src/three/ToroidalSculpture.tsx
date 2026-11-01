import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { useMotionProfile } from '@/three/useMotionProfile'

type Props = {
  theme: string
}

/**
 * Panel 01 — abstract metallic toroidal sculpture.
 *
 * Concentric tori on tilted axes, bound by curved connectors that sweep between
 * them. Materials alternate silver and graphite with transparency so the shells
 * read as layered metal rather than solid rings.
 */
export default function ToroidalSculpture({ theme }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const profile = useMotionProfile()
  const isDark = theme === 'dark'

  const silver = isDark ? '#d6d9de' : '#9aa0a9'
  const graphite = isDark ? '#4a4d55' : '#2a2c31'

  // Concentric rings with varied radii and tilt.
  const rings = useMemo(
    () => [
      { radius: 0.62, tube: 0.032, rot: [0, 0, 0], tone: 'silver' },
      { radius: 0.47, tube: 0.024, rot: [1.1, 0.4, 0.2], tone: 'graphite' },
      { radius: 0.33, tube: 0.018, rot: [0.4, 1.2, 0.9], tone: 'silver' },
    ] as const,
    [],
  )

  // Curved connectors: half-torus arcs bridging consecutive rings.
  const connectors = useMemo(
    () => [
      { rot: [0.3, 0.2, -0.5], scale: 0.55, tone: 'silver' },
      { rot: [1.4, 0.9, 0.4], scale: 0.42, tone: 'graphite' },
      { rot: [-0.8, 1.7, 0.6], scale: 0.48, tone: 'silver' },
    ] as const,
    [],
  )

  useFrame((state, delta) => {
    const motion = profile.read()
    if (motion.paused) return

    const group = groupRef.current
    if (!group) return
    const elapsed = state.clock.elapsedTime
    // Eased step keeps rotation spring-like under frame-rate variance.
    const step = Math.min(delta, 0.05) * motion.intensity

    // Gentle independent rotations; no abrupt movement.
    group.rotation.y += step * 0.22
    const targetX = Math.sin(elapsed * 0.25) * 0.28
    group.rotation.x += (targetX - group.rotation.x) * step * 2.2
    const inner = group.children[1]
    if (inner) inner.rotation.z += step * 0.16
  })

  return (
    <group ref={groupRef} scale={1.05}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 3, 4]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-3, -1, -2]} intensity={0.4} color="#c9ccd2" />
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#a8adb6" />

      {rings.map((ring, index) => (
        <mesh key={index} rotation={ring.rot as unknown as [number, number, number]}>
          <torusGeometry args={[ring.radius, ring.tube, 16, 96]} />
          <meshStandardMaterial
            color={ring.tone === 'silver' ? silver : graphite}
            metalness={0.95}
            roughness={0.22}
            transparent
            opacity={ring.tone === 'silver' ? 0.95 : 0.8}
          />
        </mesh>
      ))}

      {connectors.map((link, index) => (
        <mesh
          key={index}
          rotation={link.rot as unknown as [number, number, number]}
          scale={link.scale}
        >
          <torusGeometry args={[1, 0.016, 10, 48, Math.PI * 1.35]} />
          <meshStandardMaterial
            color={link.tone === 'silver' ? silver : graphite}
            metalness={0.9}
            roughness={0.3}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}
    </group>
  )
}
