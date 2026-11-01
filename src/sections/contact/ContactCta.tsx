import { ArrowUpRight } from "lucide-react";

import { CONTACT_SECTION_ID } from "@/data/navigation";
import { scrollToSection } from "@/lib/scrollToSection";

/** Quiet geometric backdrop: concentric arcs and a hairline grid. */
function GeometricBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-fg"
      fill="none"
    >
      <g stroke="currentColor" strokeOpacity="0.07" strokeWidth="1">
        <circle cx="300" cy="200" r="88" />
        <circle cx="300" cy="200" r="156" />
        <circle cx="300" cy="200" r="228" />
        <path d="M0 300 H600" />
        <path d="M420 0 V400" />
      </g>
      <g stroke="currentColor" strokeOpacity="0.14" strokeWidth="1">
        <path d="M212 200 A88 88 0 0 1 388 200" />
        <path d="M300 112 A88 88 0 0 1 300 288" strokeOpacity="0.06" />
      </g>
    </svg>
  );
}

export default function ContactCta() {
  return (
    <section
      id={CONTACT_SECTION_ID}
      aria-labelledby="contact-heading"
      className="relative"
    >
      <div className="th-shell pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-container border border-border bg-surface px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
          <GeometricBackdrop />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="th-eyebrow">
              Let&rsquo;s build something intelligent
            </p>

            <h2
              id="contact-heading"
              className="th-display mt-5 text-4xl sm:text-5xl lg:text-6xl"
            >
              Have an Idea? Let&rsquo;s Make It Intelligent.
            </h2>

            <p className="th-prose mx-auto max-w-xl text-base">
              Let&rsquo;s explore how AI can transform your business operations
              and unlock new possibilities.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => scrollToSection(CONTACT_SECTION_ID)}
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-xs font-medium tracking-label uppercase text-bg transition-[background-color,transform,opacity] duration-300 ease-swiss hover:-translate-y-px hover:opacity-85 active:translate-y-0"
              >
                Start a Conversation
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-3.5 transition-transform duration-300 ease-swiss group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
