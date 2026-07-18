import type { CSSProperties } from "react";

const CONFETTI_PIECES = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "violet",
  "pink",
] as const;

type ConfettiStyle = CSSProperties & {
  "--confetti-index": number;
};

type CelebrationOverlayProps = Readonly<{
  trigger: number;
}>;

export function CelebrationOverlay({ trigger }: CelebrationOverlayProps) {
  if (trigger === 0) {
    return null;
  }

  return (
    <div
      aria-label="All ten beads counted"
      aria-live="polite"
      className="celebration-overlay"
      key={trigger}
      role="status"
    >
      <div className="celebration-overlay__burst" aria-hidden="true" />
      <div className="celebration-overlay__badge">
        <span className="celebration-overlay__number">10</span>
        <span className="celebration-overlay__message">You did it!</span>
      </div>
      <div className="celebration-overlay__confetti" aria-hidden="true">
        {CONFETTI_PIECES.map((piece, index) => {
          const confettiStyle: ConfettiStyle = { "--confetti-index": index };

          return (
            <span
              className="celebration-overlay__confetti-piece"
              data-color={piece}
              key={piece}
              style={confettiStyle}
            />
          );
        })}
      </div>
    </div>
  );
}
