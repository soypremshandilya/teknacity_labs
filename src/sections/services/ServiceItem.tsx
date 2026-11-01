import { ArrowUpRight } from 'lucide-react'

export type ServiceItemProps = {
  index: string
  title: string
  description: string
}

/**
 * A single service row: index, title, description, and a hairline marker.
 */
export default function ServiceItem({
  index,
  title,
  description,
}: ServiceItemProps) {
  return (
    <article className="group relative border-t border-border">
      <div className="grid gap-4 py-8 transition-[background-color] duration-300 ease-swiss group-hover:bg-bg-sunken sm:grid-cols-[4rem_1fr] sm:gap-8 lg:grid-cols-[5rem_18rem_1fr_1.5rem] lg:items-baseline lg:gap-10 lg:py-10">
        <span className="text-2xs tracking-label uppercase text-fg-subtle tabular-nums transition-colors duration-300 ease-swiss group-hover:text-fg">
          {index}
        </span>

        <h3 className="text-lg font-medium tracking-tight text-fg transition-transform duration-300 ease-swiss group-hover:translate-x-0.5 lg:text-xl">
          {title}
        </h3>

        <p className="th-prose max-w-md text-sm leading-relaxed">
          {description}
        </p>

        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="hidden size-4 text-fg-subtle opacity-0 transition-[opacity,transform,color] duration-300 ease-swiss group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-fg lg:block"
        />
      </div>
    </article>
  )
}
