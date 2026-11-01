import logoUrl from "../../../resources/teknacity.png";

type LogoMarkProps = {
  className?: string;
};

/**
 * Official Teknacity Labs logo mark. Preserves the previous sizing contract.
 */
export default function LogoMark({ className }: LogoMarkProps) {
  return (
    <img
      src={logoUrl}
      alt="Teknacity Labs"
      aria-hidden="true"
      draggable={false}
      className={className}
    />
  );
}
