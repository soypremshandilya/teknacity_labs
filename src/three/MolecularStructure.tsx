import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { useMotionProfile } from '@/three/useMotionProfile'

type Props = {
  theme: string
}

type Atom = { x: number; y: number; z: number; radius: number }

const ATOM_COUNT = 58
const BOND_REACH = 0.62

/** Seeded PRNG so the molecule is stable across renders. */
function createRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildMolecule() {
  const random = createRandom(0x51ab3c7d)
  const atoms: Atom[] = []

  // Organic multi-lobe clusters rather than a uniform sphere.
  const lobes = [
    { x: 0.34, y: 0.12, z: 0.1, r: 0.26 },
    { x: -0.3, y: 0.28, z: -0.14, r: 0.22 },
    { x: -0.12, y: -0.34, z: 0.2, r: 0.24 },
    { x: 0.06, y: 0.32, z: -0.28, r: 0.19 },
  ]

  for (let i = 0; i < ATOM_COUNT; i += 1) {
    const lobe = lobes[i % lobes.length]
    const spread = lobe.r * (0.45 + random() * 0.75)
    atoms.push({
      x: lobe.x + (random() - 0.5) * 2 * spread,
      y: lobe.y + (random() - 0.5) * 2 * spread,
      z: lobe.z + (random() - 0.5) * 2 * spread,
      radius: 0.022 + random() * 0.038,
    })
  }

  const bonds: Array<{ a: number; b: number }> = []
  const seen = new Set<string>()

  for (let i = 0; i < atoms.length; i += 1) {
    for (let j = i + 1; j < atoms.length; j += 1) {
      const dx = atoms[i].x - atoms[j].x
      const dy = atoms[i].y - atoms[j].y
      const dz = atoms[i].z - atoms[j].z
      if (dx * dx + dy * dy + dz * dz > BOND_REACH * BOND_REACH) continue

      const key = `${i}:${j}`
      if (seen.has(key)) continue
      seen.add(key)
      bonds.push({ a: i, b: j })
    }
  }

  return { atoms, bonds }
}

/**
 * Panel 02 — computational molecular structure.
 *
 * Metal spheres at varied sizes joined by fine line bonds, with a translucent
 * outer shell for depth. Rotates gently on two axes.
 */
export default function MolecularStructure({ theme }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const profile = useMotionProfile()
  const nodeRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isDark = theme === 'dark'

  const { atoms, bonds } = useMemo(buildMolecule, [])

  const silver = isDark ? '#e2e4e8' : '#4a4d55'

  const bondGeometry = useMemo(() => {
    const positions = new Float32Array(bonds.length * 6)
    bonds.forEach((bond, index) => {
      const from = atoms[bond.a]
      const to = atoms[bond.b]
      const offset = index * 6
      positions[offset] = from.x
      positions[offset + 1] = from.y
      positions[offset + 2] = from.z
      positions[offset + 3] = to.x
      positions[offset + 4] = to.y
      positions[offset + 5] = to.z
    })
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [atoms, bonds])

  // Static placement: the atoms do not move, only the whole sculpture rotates.
  const placed = useRef(false)
  const placeAtoms = (mesh: THREE.InstancedMesh | null) => {
    nodeRef.current = mesh
    if (!mesh || placed.current) return
    atoms.forEach((atom, index) => {
      dummy.position.set(atom.x, atom.y, atom.z)
      dummy.scale.setScalar(atom.radius)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    placed.current = true
  }

  useFrame((state, delta) => {
    const motion = profile.read()
    if (motion.paused) return

    const group = groupRef.current
    if (!group) return
    const elapsed = state.clock.elapsedTime
    const step = Math.min(delta, 0.05) * motion.intensity

    group.rotation.y += step * 0.18
    // Eased toward the target tilt for a spring-like settle.
    const targetX = Math.sin(elapsed * 0.22) * 0.22
    group.rotation.x += (targetX - group.rotation.x) * step * 2.2
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[-2.5, -1.5, -2]} intensity={0.4} color="#c9ccd2" />

      <lineSegments geometry={bondGeometry}>
        <lineBasicMaterial
          color={silver}
          transparent
          opacity={isDark ? 0.4 : 0.35}
          depthWrite={false}
        />
      </lineSegments>

      <instancedMesh
        ref={placeAtoms}
        args={[undefined, undefined, ATOM_COUNT]}
      >
        <sphereGeometry args={[1, 14, 14]} />
        <meshStandardMaterial
          color={silver}
          metalness={0.95}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </instancedMesh>

      {/* Translucent outer shell for depth. */}
      <mesh>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial
          color={silver}
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={isDark ? 0.06 : 0.05}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
