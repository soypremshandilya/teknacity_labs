import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";

import LogoMark from "@/components/brand/LogoMark";
import DesktopNav from "@/components/navigation/DesktopNav";
import MobileNav from "@/components/navigation/MobileNav";
import ThemeToggle from "@/components/navigation/ThemeToggle";
import { CONTACT_SECTION_ID } from "@/data/navigation";
import { useTheme } from "@/hooks/useTheme";
import { scrollToSection } from "@/lib/scrollToSection";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close the mobile panel when the viewport switches to the desktop layout.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const goToContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(CONTACT_SECTION_ID);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="th-shell flex h-16 items-center justify-between gap-2 sm:gap-4">
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("home");
          }}
          className="flex min-w-0 items-center gap-2.5 text-fg transition-opacity duration-200 ease-swiss hover:opacity-70"
        >
          <LogoMark className="size-7 shrink-0" />
          <span className="truncate font-display text-[0.7rem] font-semibold tracking-label uppercase sm:text-xs">
            Teknacity&nbsp;Labs
          </span>
        </a>

        <div className="hidden flex-1 justify-center md:flex">
          <DesktopNav />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            className="shrink-0"
          />

          <a
            href={`#${CONTACT_SECTION_ID}`}
            onClick={goToContact}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-2 text-[10px] font-medium tracking-label uppercase shadow-sm transition-opacity duration-200 ease-swiss hover:opacity-80 sm:px-4 sm:text-xs ${
              isDark
                ? "border-[#0d0e11] bg-[#0d0e11] text-white"
                : "border-white bg-white text-[#0d0e11]"
            }`}
          >
            Get in Touch
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-fg-muted transition-colors duration-200 ease-swiss hover:border-border-strong hover:text-fg md:hidden"
          >
            <Menu aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <MobileNav open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
