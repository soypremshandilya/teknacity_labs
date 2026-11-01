import type { ReactNode } from 'react'

type HeroStatProps = {
  value: ReactNode
  label: string
}

export default function HeroStat({ value, label }: HeroStatProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-2xl leading-none tracking-tight text-fg">
        {value}
      </span>
      <span className="text-2xs tracking-label uppercase text-fg-subtle">
        {label}
      </span>
    </div>
  )
}
