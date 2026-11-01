import type { ReactNode } from 'react'

type VisualFrameProps = {
  children?: ReactNode
  /** Reserved slot id that a future 3D / generative scene mounts into. */
  slot: string
  label: string
  className?: string
  innerClassName?: string
}

/**
 * Rounded-square container reserved for a future rendered scene. Renders a
 * neutral monochromatic placeholder; no static image stands in for the final
 * implementation.
 */
export default function VisualFrame({
  children,
  slot,
  label,
  className = '',
  innerClassName = '',
}: VisualFrameProps) {
  return (
    <figure
      className={`relative m-0 overflow-hidden border border-border bg-bg-sunken ${className}`}
    >
      <div
        data-scene-slot={slot}
        aria-hidden="true"
        className={`size-full ${innerClassName}`}
      >
        {children ?? <PlaceholderGrid />}
      </div>

      <figcaption className="absolute bottom-3 left-4 text-2xs tracking-label uppercase text-fg-subtle">
        {label}
      </figcaption>
    </figure>
  )
}

/** Quiet Swiss grid — a stand-in for the scene that will replace it. */
function PlaceholderGrid() {
  return (
    <div className="size-full opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:2.5rem_2.5rem]" />
  )
}
