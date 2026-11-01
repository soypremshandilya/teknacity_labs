import { NAV_ITEMS } from "@/data/navigation";
import { scrollToSection } from "@/lib/scrollToSection";

export default function DesktopNav() {
  return (
    <nav aria-label="Primary" className="flex justify-center">
      <ul className="flex items-center justify-center gap-8">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.id);
              }}
              className="group relative inline-block py-1 text-sm tracking-wide text-fg-muted transition-colors duration-200 ease-swiss hover:text-fg"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-fg transition-transform duration-300 ease-swiss group-hover:scale-x-100"
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
