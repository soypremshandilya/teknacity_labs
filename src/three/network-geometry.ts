/**
 * Deterministic layered network geometry shared by the neural-network scene.
 *
 * Nodes are arranged in concentric shells so connections read as depth rather
 * than a flat plane. Values are generated once at module load with a seeded
 * PRNG, so the network is identical on every render and never re-shuffles.
 */

export type NetworkNode = {
  x: number
  y: number
  z: number
  /** Base scale multiplier; different node sizes. */
  scale: number
  /** Base opacity multiplier; different node opacity. */
  opacity: number
  /** Drives the per-node pulse phase so nodes do not blink in unison. */
  phase: number
}

export type NetworkEdge = {
  a: number
  b: number
  /** Lower opacity multiplier for deeper, less prominent layers. */
  opacity: number
}

const NODE_COUNT = 320
const EXTRA_PER_NODE = 2
const SHELL_RADIUS = 2.5

/** Mulberry32 — tiny seeded PRNG for stable geometry. */
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

function buildNodes(): NetworkNode[] {
  const random = createRandom(0x7ec7ac17)
  const nodes: NetworkNode[] = []

  for (let i = 0; i < NODE_COUNT; i += 1) {
    // Concentric shells, back shells slightly compressed for depth.
    const shell = i % 3
    const radius =
      SHELL_RADIUS * (0.42 + shell * 0.29) * (0.85 + random() * 0.3)

    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)

    nodes.push({
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi) * 0.78,
      z: radius * Math.sin(phi) * Math.sin(theta),
      scale: 0.5 + random() * 0.9,
      opacity: 0.28 + random() * 0.62,
      phase: random() * Math.PI * 2,
    })
  }

  return nodes
}

function buildEdges(nodes: NetworkNode[]): NetworkEdge[] {
  const random = createRandom(0x1f3a55d9)
  const edges: NetworkEdge[] = []
  const maxDistance = 1.15
  const seen = new Set<string>()

  for (let i = 0; i < nodes.length; i += 1) {
    const from = nodes[i]
    let linked = 0

    for (let j = 0; j < nodes.length && linked < EXTRA_PER_NODE; j += 1) {
      if (i === j) continue

      const to = nodes[j]
      const dx = from.x - to.x
      const dy = from.y - to.y
      const dz = from.z - to.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distance > maxDistance) continue

      const key = i < j ? `${i}:${j}` : `${j}:${i}`
      if (seen.has(key)) continue
      seen.add(key)

      edges.push({
        a: i,
        b: j,
        opacity: 0.9 - Math.min(distance / maxDistance, 1) * 0.55,
      })
      linked += 1
    }

    // Random long-range links create the multi-layer look.
    if (random() > 0.72) {
      const j = Math.floor(random() * nodes.length)
      if (j !== i) {
        const key = i < j ? `${i}:${j}` : `${j}:${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push({ a: i, b: j, opacity: 0.22 })
        }
      }
    }
  }

  return edges
}

export const NETWORK_NODES = buildNodes()
export const NETWORK_EDGES = buildEdges(NETWORK_NODES)
