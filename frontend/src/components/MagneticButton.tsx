import { useMagnetic } from "../hooks/useMagnetic";

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}

export default function MagneticButton({ href, children, variant = "primary" }: Props) {
  const { ref, onMove, onLeave } = useMagnetic(0.25);

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300";
  const styles =
    variant === "primary"
      ? `${base} bg-white text-void hover:shadow-[0_0_40px_rgba(124,92,255,0.4)]`
      : `${base} glass text-white hover:border-accent/50`;

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={styles}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </a>
  );
}
