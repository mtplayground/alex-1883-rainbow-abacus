import type { CSSProperties } from "react";
import type { BeadId, BeadSide } from "../state/counting";

export type BeadDefinition = Readonly<{
  id: BeadId;
  label: string;
  color: string;
  light: string;
  dark: string;
}>;

type BeadStyle = CSSProperties & {
  "--bead-color": string;
  "--bead-light": string;
  "--bead-dark": string;
};

type BeadProps = Readonly<{
  bead: BeadDefinition;
  position: number;
  side: BeadSide;
  total: number;
}>;

export function Bead({ bead, position, side, total }: BeadProps) {
  const beadStyle: BeadStyle = {
    "--bead-color": bead.color,
    "--bead-light": bead.light,
    "--bead-dark": bead.dark,
  };

  return (
    <li
      aria-label={`${bead.label} bead ${position} of ${total}, ${side} side`}
      className="abacus-bead"
      data-side={side}
      style={beadStyle}
    />
  );
}
