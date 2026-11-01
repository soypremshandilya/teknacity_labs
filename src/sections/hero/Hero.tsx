import { ArrowRight, Play } from "lucide-react";

import HeroStat from "@/sections/hero/HeroStat";
import VisualFrame from "@/sections/hero/VisualFrame";
import NeuralNetworkCanvas from "@/three/NeuralNetworkCanvas";
import SculptureCanvas from "@/three/SculptureCanvas";
import ToroidalSculpture from "@/three/ToroidalSculpture";
import MolecularStructure from "@/three/MolecularStructure";
import { useTheme } from "@/hooks/useTheme";
import { NAV_ITEMS } from "@/data/navigation";
import { scrollToSection } from "@/lib/scrollToSection";

const STATS = [
  { value: "10+", label: "AI Projects" },
  { value: "3", label: "Founders" },
  { value: "\u221E", label: "Possibilities" },
] as const;

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div className="th-shell grid items-center gap-12 pt-16 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24 lg:pb-28">
        {/* ------------------------------------------------ Left column */}
        <div className="max-w-xl">
          <p className="th-eyebrow">Built for a smarter tomorrow</p>

          <h1
            id="hero-heading"
            className="th-display mt-5 text-4xl sm:text-5xl lg:text-6xl"
          >
            AI Systems for a More Intelligent World.
          </h1>

          <p className="th-prose text-base">
            We design and build advanced AI agents, intelligent automation
            systems, and scalable AI solutions that help businesses move from
            ideas to real-world impact.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`#${NAV_ITEMS[1].id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(NAV_ITEMS[1].id);
              }}
              className={`group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-medium tracking-label uppercase shadow-sm transition-[background-color,transform,opacity] duration-300 ease-swiss hover:-translate-y-px hover:opacity-90 active:translate-y-0 ${
                isDark
                  ? "border-[#0d0e11] bg-[#0d0e11] text-white"
                  : "border-white bg-white text-[#0d0e11]"
              }`}
            >
              Explore Our Work
              <ArrowRight
                aria-hidden="true"
                className={`size-3.5 transition-transform duration-300 ease-swiss group-hover:translate-x-0.5 ${
                  isDark ? "text-white" : "text-[#0d0e11]"
                }`}
                strokeWidth={1.75}
              />
            </a>

            <button
              type="button"
              className={`group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-medium tracking-label uppercase shadow-sm transition-[background-color,border-color,transform] duration-300 ease-swiss hover:-translate-y-px hover:opacity-90 active:translate-y-0 ${
                isDark
                  ? "border-[#0d0e11] bg-[#0d0e11] text-white"
                  : "border-white bg-white text-[#0d0e11]"
              }`}
            >
              <Play
                aria-hidden="true"
                className={`size-3.5 transition-colors duration-300 ease-swiss ${
                  isDark ? "text-white" : "text-[#0d0e11]"
                }`}
                strokeWidth={1.75}
              />
              Watch Showreel
            </button>
          </div>

          <dl className="mt-12 flex flex-wrap items-start gap-x-12 gap-y-6 border-t border-border pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <HeroStat value={stat.value} label={stat.label} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ----------------------------------------------- Right column */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <VisualFrame
            slot="neural-network"
            label="Neural Network"
            className="aspect-square rounded-container"
          >
            <NeuralNetworkCanvas />
          </VisualFrame>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <VisualFrame
              slot="generative-a"
              label="Generative I"
              className="aspect-square rounded-panel"
              innerClassName="opacity-70"
            >
              <SculptureCanvas cameraZ={2.1}>
                <ToroidalSculpture theme={theme} />
              </SculptureCanvas>
            </VisualFrame>
            <VisualFrame
              slot="generative-b"
              label="Generative II"
              className="aspect-square rounded-panel"
              innerClassName="opacity-70"
            >
              <SculptureCanvas cameraZ={2.3}>
                <MolecularStructure theme={theme} />
              </SculptureCanvas>
            </VisualFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
