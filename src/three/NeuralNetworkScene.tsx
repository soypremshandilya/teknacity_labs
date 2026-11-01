import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { NETWORK_EDGES, NETWORK_NODES } from '@/three/network-geometry'
import { useCursorState } from '@/three/useCursorState'
import { useMotionProfile } from '@/three/useMotionProfile'

const NODE_TOTAL = NETWORK_NODES.length
const PARTICLE_TOTAL = 160
/** Halved on small screens to cut per-frame work on mobile GPUs. */
const PARTICLE_TOTAL_MOBILE = 72

/** Cursor influence falloff radius, in world units. */
const INFLUENCE = 1.35
const INFLUENCE_SQ = INFLUENCE * INFLUENCE
/** Frequency of the travelling light wave along each connection. */
const WAVE_FREQUENCY = 2.6

type Props = {
  /** 'light' | 'dark' — drives the monochrome metallic palette. */
  theme: string
}

/**
 * Builds the edge geometry in one BufferGeometry with per-vertex colours, so
 * hundreds of connections cost a single draw call. Position and colour buffers
 * are mutated per frame for the cursor distortion and travelling light wave.
 */
function useEdgeGeometry(theme: string) {
  return useMemo(() => {
    const positions = new Float32Array(NETWORK_EDGES.length * 6)
    const colors = new Float32Array(NETWORK_EDGES.length * 6)
    const base = theme === 'dark' ? 0.78 : 0.32

    NETWORK_EDGES.forEach((edge, index) => {
      const from = NETWORK_NODES[edge.a]
      const to = NETWORK_NODES[edge.b]
      const offset = index * 6

      positions[offset] = from.x
      positions[offset + 1] = from.y
      positions[offset + 2] = from.z
      positions[offset + 3] = to.x
      positions[offset + 4] = to.y
      positions[offset + 5] = to.z

      const shade = base * edge.opacity
      for (let vertex = 0; vertex < 2; vertex += 1) {
        const at = offset + vertex * 3
        colors[at] = shade
        colors[at + 1] = shade
        colors[at + 2] = shade
      }
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // Colours are rewritten every frame for the cursor response and light wave.
    const colorAttribute = new THREE.BufferAttribute(colors, 3)
    colorAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('color', colorAttribute)
    return geometry
  }, [theme])
}

export default function NeuralNetworkScene({ theme }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const nodeMeshRef = useRef<THREE.InstancedMesh>(null)
  const particleMeshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const edgeGeometry = useEdgeGeometry(theme)
  const cursor = useCursorState()
  const profile = useMotionProfile()
  const cursorColor = useMemo(() => new THREE.Color(), [])

  // Resolved once on mount: the instance buffer is sized for the lifetime of the
  // mesh, so this must not change on resize.
  const particleCount = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches
        ? PARTICLE_TOTAL_MOBILE
        : PARTICLE_TOTAL,
    [],
  )

  const isDark = theme === 'dark'
  const nodeColor = isDark ? '#f2f1ec' : '#1b1d21'
  const particleColor = isDark ? '#a8adb6' : '#6b7078'

  // Scatter per-node instance colours once material is ready.
  const applyInstanceColors = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return
    const color = new THREE.Color()
    NETWORK_NODES.forEach((node, index) => {
      const shade = isDark
        ? 0.35 + node.opacity * 0.65
        : 0.12 + node.opacity * 0.5
      color.setRGB(shade, shade, shade)
      mesh.setColorAt(index, color)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  // Instance colours are baked into a buffer attribute on mount, so re-scatter
  // them whenever the theme flips (the material colour prop alone will not).
  useEffect(() => {
    applyInstanceColors(nodeMeshRef.current)
  }, [isDark])

  useFrame((state, delta) => {
    const motion = profile.read()
    // Parked while off-screen: skip every per-frame calculation.
    if (motion.paused) return

    const elapsed = state.clock.elapsedTime
    const intensity = motion.intensity
    // Reduced motion freezes drift but keeps the scene rendered.
    const step = Math.min(delta, 0.05) * intensity
    const strength = cursor.strength
    const cx = cursor.point.x
    const cy = cursor.point.y
    const cz = cursor.point.z

    if (groupRef.current) {
      const group = groupRef.current
      group.rotation.y += step * 0.12
      group.rotation.x =
        (Math.sin(elapsed * 0.18) * 0.16 + state.pointer.y * 0.12) * intensity +
        cursor.parallax.y * 0.12
      group.rotation.z = Math.sin(elapsed * 0.1) * 0.05 * intensity
      group.position.x += (cursor.parallax.x * 0.18 - group.position.x) * step * 4
      group.position.y += (cursor.parallax.y * 0.12 - group.position.y) * step * 4
    }

    // Gentle per-node breathing, plus cursor proximity and gravitational pull.
    const nodes = nodeMeshRef.current
    if (nodes) {
      for (let i = 0; i < NODE_TOTAL; i += 1) {
        const node = NETWORK_NODES[i]
        const pulse =
          1 + Math.sin(elapsed * 1.1 + node.phase) * 0.16 * intensity

        let x = node.x
        let y = node.y
        let z = node.z
        let illuminate = 0

        if (strength > 0.01) {
          const dx = node.x - cx
          const dy = node.y - cy
          const dz = node.z - cz
          const distSq = dx * dx + dy * dy + dz * dz

          if (distSq < INFLUENCE_SQ) {
            // Smooth falloff, no hard edge.
            const falloff = 1 - distSq / INFLUENCE_SQ
            const force = falloff * falloff * strength
            illuminate = force

            // Gravitational distortion: pull toward the cursor, eased.
            const inv = 1 / Math.max(Math.sqrt(distSq), 0.0001)
            x -= dx * inv * force * 0.34
            y -= dy * inv * force * 0.34
            z -= dz * inv * force * 0.34
          }
        }

        dummy.position.set(x, y, z)
        dummy.scale.setScalar(node.scale * pulse * (1 + illuminate * 0.5) * 0.055)
        dummy.updateMatrix()
        nodes.setMatrixAt(i, dummy.matrix)

        // Nearby neurons illuminate — subtle brightness lift only.
        const shade =
          (isDark ? 0.35 + node.opacity * 0.65 : 0.12 + node.opacity * 0.5) +
          illuminate * (isDark ? 0.5 : 0.45)
        cursorColor.setRGB(shade, shade, shade)
        nodes.setColorAt(i, cursorColor)
      }

      nodes.instanceMatrix.needsUpdate = true
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true
    }

    // Connection response: vertex colours follow node proximity and a wave.
    const edgeColors = edgeGeometry.getAttribute('color') as
      | THREE.BufferAttribute
      | undefined
    const edgePositions = edgeGeometry.getAttribute('position') as
      | THREE.BufferAttribute
      | undefined

    if (edgeColors && edgePositions && strength > 0.01) {
      const colorArray = edgeColors.array as Float32Array
      const positionArray = edgePositions.array as Float32Array
      const base = isDark ? 0.78 : 0.32

      for (let e = 0; e < NETWORK_EDGES.length; e += 1) {
        const offset = e * 6
        const ax = positionArray[offset]
        const ay = positionArray[offset + 1]
        const az = positionArray[offset + 2]
        const bx = positionArray[offset + 3]
        const by = positionArray[offset + 4]
        const bz = positionArray[offset + 5]

        const daA = (ax - cx) ** 2 + (ay - cy) ** 2 + (az - cz) ** 2
        const daB = (bx - cx) ** 2 + (by - cy) ** 2 + (bz - cz) ** 2
        const nearest = Math.min(daA, daB)

        if (nearest >= INFLUENCE_SQ) continue

        const falloff = 1 - nearest / INFLUENCE_SQ
        const edge = NETWORK_EDGES[e]
        // Light wave travels along the link near the cursor.
        const wave =
          0.5 + 0.5 * Math.sin(elapsed * WAVE_FREQUENCY + edge.a * 0.35)
        const boost = falloff * strength * (0.6 + wave * 0.7)

        const a = base * edge.opacity + boost
        const b = base * edge.opacity + boost * 0.75

        colorArray[offset] = a
        colorArray[offset + 1] = a
        colorArray[offset + 2] = a
        colorArray[offset + 3] = b
        colorArray[offset + 4] = b
        colorArray[offset + 5] = b
      }

      edgeColors.needsUpdate = true
    }

    // Particles drift toward the cursor when it is near, easing back after.
    const particles = particleMeshRef.current
    if (particles) {
      for (let i = 0; i < particleCount; i += 1) {
        const angle = i * 2.399 + elapsed * (0.06 + (i % 5) * 0.012)
        const radius = 1.1 + ((i * 37) % 100) / 100 * 2.1
        const height = Math.sin(elapsed * 0.4 + i) * 1.9

        let px = Math.cos(angle) * radius
        let py = height
        let pz = Math.sin(angle) * radius

        if (strength > 0.01) {
          const dx = cx - px
          const dy = cy - py
          const dz = cz - pz
          const distSq = dx * dx + dy * dy + dz * dz
          const reach = 2.4

          if (distSq < reach * reach) {
            const falloff = 1 - distSq / (reach * reach)
            const pull = falloff * strength * 0.55
            px += dx * pull
            py += dy * pull
            pz += dz * pull
          }
        }

        dummy.position.set(px, py, pz)
        dummy.scale.setScalar(0.012 + ((i % 7) / 7) * 0.014)
        dummy.updateMatrix()
        particles.setMatrixAt(i, dummy.matrix)
      }
      particles.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#c9ccd2" />
      <pointLight position={[0, 0, 2.5]} intensity={0.6} color="#a8adb6" />

      {/* Interconnecting links — one draw call. */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isDark ? 0.5 : 0.4}
          depthWrite={false}
        />
      </lineSegments>

      {/* Neural nodes — instanced, varied scale and opacity. */}
      <instancedMesh
        ref={(mesh) => {
          nodeMeshRef.current = mesh
          applyInstanceColors(mesh)
        }}
        args={[undefined, undefined, NODE_TOTAL]}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial
          color={nodeColor}
          roughness={0.32}
          metalness={0.85}
          emissive={nodeColor}
          emissiveIntensity={isDark ? 0.12 : 0.04}
          transparent
          opacity={isDark ? 0.95 : 0.9}
        />
      </instancedMesh>

      {/* Floating particles. */}
      <instancedMesh
        ref={particleMeshRef}
        args={[undefined, undefined, particleCount]}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color={particleColor}
          roughness={0.5}
          metalness={0.7}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  )
}
