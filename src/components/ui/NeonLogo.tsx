"use client";

interface NeonLogoProps {
  size?: "sm" | "md" | "lg" | "hero";
  flicker?: boolean;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  puffReveal?: number;
}

const PUFF = "PUFF";

const SIZE_CLASS = {
  sm: "neon-logo--sm",
  md: "neon-logo--md",
  lg: "neon-logo--lg",
  hero: "neon-logo--hero",
} as const;

function NeonWord({
  text,
  variant,
}: {
  text: string;
  variant: "pink" | "blue";
}) {
  return <span className={`neon-word neon-word--${variant}`}>{text}</span>;
}

export function NeonLogo({
  size = "md",
  flicker: _flicker = false,
  showTagline = false,
  tagline = "PREMIUM SMOKE BOUTIQUE",
  className = "",
  puffReveal,
}: NeonLogoProps) {
  const puffText = puffReveal === undefined ? PUFF : PUFF.slice(0, puffReveal);
  const displayTagline = showTagline && (size === "lg" || size === "hero");

  return (
    <div
      className={`neon-logo ${SIZE_CLASS[size]} ${className}`}
      aria-label="ציפי PUFF"
    >
      <div className="neon-logo__words">
        <NeonWord text="ציפי" variant="pink" />
        {puffText.length > 0 && <NeonWord text={puffText} variant="blue" />}
      </div>
      {displayTagline && (
        <div className="neon-logo__tagline">
          <p className="gold-heading">{tagline}</p>
          <span className="neon-logo__tagline-line" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
