import type { CSSProperties } from "react";

export type BeadDefinition = Readonly<{
  id: string;
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
  total: number;
}>;

export function Bead({ bead, position, total }: BeadProps) {
  const beadStyle: BeadStyle = {
    "--bead-color": bead.color,
    "--bead-light": bead.light,
    "--bead-dark": bead.dark,
  };

  return (
    <li
      aria-label={`${bead.label} bead ${position} of ${total}`}
      className="abacus-bead"
      style={beadStyle}
    />
  );
}
