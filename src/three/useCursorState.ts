import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Cursor state in world space, smoothly interpolated toward its target. */
export type CursorState = {
  /** Current (eased) point on the camera-facing plane. */
  point: THREE.Vector3
  /** True while the pointer is over the canvas (or a touch is active). */
  active: boolean
  /** 0..1 eased activity, drives the strength of every interaction. */
  strength: number
  /** Eased pointer offset from centre, -1..1 per axis, for parallax. */
  parallax: THREE.Vector2
}

const PLANE_Z = 0.8
const EASE = 6.5

/**
 * Raycasts the pointer onto a plane in front of the camera and eases the
 * result. Handles pointer leave (returns to a resting state) and touch, which
 * R3F reports through the same pointer events.
 */
export function useCursorState(): CursorState {
  const { camera, gl } = useThree()

  const state = useRef<CursorState>({
    point: new THREE.Vector3(),
    active: false,
    strength: 0,
    parallax: new THREE.Vector2(),
  })

  const internals = useMemo(
    () => ({
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), -PLANE_Z),
      raycaster: new THREE.Raycaster(),
      ndc: new THREE.Vector2(),
      target: new THREE.Vector3(),
      targetStrength: 0,
      targetParallax: new THREE.Vector2(),
    }),
    [],
  )

  // Pointer listeners are attached once; no re-subscription per frame.
  useEffect(() => {
    const element = gl.domElement

    const updateFromPointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      internals.ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      )

      internals.raycaster.setFromCamera(internals.ndc, camera)
      const hit = internals.raycaster.ray.intersectPlane(
        internals.plane,
        internals.target,
      )

      if (hit) {
        internals.targetStrength = 1
        internals.targetParallax.set(internals.ndc.x, internals.ndc.y)
      }
    }

    const onPointerMove = (event: PointerEvent) => updateFromPointer(event)
    const onPointerDown = (event: PointerEvent) => updateFromPointer(event)
    const onPointerLeave = () => {
      internals.targetStrength = 0
      internals.targetParallax.set(0, 0)
    }

    // `touchmove` is registered as passive so it never blocks page scrolling.
    element.addEventListener('pointermove', onPointerMove, { passive: true })
    element.addEventListener('pointerdown', onPointerDown, { passive: true })
    element.addEventListener('pointerleave', onPointerLeave)
    element.addEventListener('pointercancel', onPointerLeave)

    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointerleave', onPointerLeave)
      element.removeEventListener('pointercancel', onPointerLeave)
    }
  }, [camera, gl, internals])

  useFrame((_, delta) => {
    const current = state.current
    // Frame-rate independent easing.
    const alpha = 1 - Math.exp(-EASE * Math.min(delta, 0.1))

    current.strength += (internals.targetStrength - current.strength) * alpha
    current.active = current.strength > 0.01

    current.parallax.lerp(internals.targetParallax, alpha)
    current.point.lerp(internals.target, alpha)

    if (current.strength > 0.5) {
      // Track the live pointer only while it is meaningfully present.
      current.point.lerp(internals.target, alpha * 0.6)
    }
  })

  return state.current
}
