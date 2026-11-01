import ServiceItem from '@/sections/services/ServiceItem'

const SERVICES = [
  {
    index: '01',
    title: 'AI Agents',
    description:
      'Autonomous intelligent agents designed to execute complex business workflows.',
  },
  {
    index: '02',
    title: 'Agentic AI Systems',
    description:
      'Multi-agent architectures with reasoning, orchestration and intelligent decision-making.',
  },
  {
    index: '03',
    title: 'Intelligent Automation',
    description:
      'Workflow automation that eliminates repetitive operations and improves efficiency.',
  },
  {
    index: '04',
    title: 'AI Integration',
    description:
      'Seamless integration of modern AI capabilities into existing business systems.',
  },
] as const

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative"
    >
      <div className="th-shell pb-20 lg:pb-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="th-eyebrow">Our Expertise</p>
            <h2
              id="services-heading"
              className="th-display mt-5 text-4xl sm:text-5xl lg:text-6xl"
            >
              What We Build.
            </h2>
          </div>

          <p className="th-prose text-base lg:max-w-sm lg:justify-self-end lg:pb-2">
            Intelligent systems engineered to move businesses forward.
          </p>
        </div>

        <div className="mt-14 lg:mt-20">
          {SERVICES.map((service) => (
            <ServiceItem
              key={service.index}
              index={service.index}
              title={service.title}
              description={service.description}
            />
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  )
}
