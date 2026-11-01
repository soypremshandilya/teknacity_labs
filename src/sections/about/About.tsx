import { useReveal } from "@/hooks/useReveal";

/** Monochrome generative neural mark: layered nodes and connective edges. */
function NeuralMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <radialGradient id="about-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      <circle
        cx="200"
        cy="200"
        r="150"
        stroke="currentColor"
        strokeOpacity="0.08"
      />
      <circle
        cx="200"
        cy="200"
        r="108"
        stroke="currentColor"
        strokeOpacity="0.12"
      />
      <circle
        cx="200"
        cy="200"
        r="66"
        stroke="currentColor"
        strokeOpacity="0.16"
      />

      <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.75">
        <path d="M200 50 L310 130 L276 262 L200 350 L108 268 L96 132 Z" />
        <path d="M200 50 L276 262 M310 130 L108 268 M96 132 L200 350" />
        <path d="M200 200 L200 50 M200 200 L310 130 M200 200 L276 262" />
        <path d="M200 200 L200 350 M200 200 L108 268 M200 200 L96 132" />
      </g>

      <g fill="url(#about-node)">
        <circle cx="200" cy="50" r="6" />
        <circle cx="310" cy="130" r="5" />
        <circle cx="276" cy="262" r="6.5" />
        <circle cx="200" cy="350" r="5" />
        <circle cx="108" cy="268" r="6" />
        <circle cx="96" cy="132" r="4.5" />
        <circle cx="200" cy="200" r="9" />
      </g>

      <g fill="currentColor" fillOpacity="0.45">
        <circle cx="155" cy="120" r="2.5" />
        <circle cx="262" cy="196" r="2.5" />
        <circle cx="148" cy="286" r="2.5" />
        <circle cx="243" cy="320" r="2" />
      </g>
    </svg>
  );
}

export default function About() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="relative"
    >
      <div className="th-shell pb-20 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-[7fr_4fr] lg:items-start lg:gap-16">
          {/* Statement column */}
          <div
            className={`transition-[opacity,transform] duration-700 ease-swiss ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <p className="th-eyebrow">About Teknacity Labs</p>

            <h2
              id="about-heading"
              className="th-display mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-6xl"
            >
              Engineering Intelligence.
              <br />
              Building Possibilities.
            </h2>

            <p className="th-prose max-w-xl text-base sm:text-lg">
              Teknacity Labs is an AI technology company focused on building
              intelligent AI agents, agentic systems, automation solutions and
              AI-powered business infrastructure.
            </p>
          </div>

          {/* Generative artwork column */}
          <div
            className={`mx-auto w-full max-w-sm transition-[opacity,transform] delay-150 duration-700 ease-swiss lg:max-w-none ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="th-panel flex aspect-square items-center justify-center p-8 text-fg">
              <NeuralMark />
            </div>
          </div>
        </div>

        {/* Supporting statement */}
        <div
          className={`mt-14 border-t border-border pt-8 transition-[opacity,transform] delay-300 duration-700 ease-swiss lg:mt-20 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <p className="th-prose max-w-2xl text-base text-fg">
            We combine engineering, intelligence and innovation to help
            businesses build for the future.
          </p>
        </div>
      </div>
    </section>
  );
}
