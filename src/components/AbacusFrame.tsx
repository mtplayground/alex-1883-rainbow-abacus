import { Bead, type BeadDefinition } from "./Bead";
import { Rod } from "./Rod";
import type { BeadId, CountingBead } from "../state/counting";

const RAINBOW_BEADS = [
  { id: "red", label: "Red", color: "#ff3131", light: "#ffb4a8", dark: "#b31223" },
  {
    id: "orange",
    label: "Orange",
    color: "#ff7a1a",
    light: "#ffd09a",
    dark: "#b9470c",
  },
  { id: "amber", label: "Amber", color: "#ffb000", light: "#ffe27a", dark: "#9a5a00" },
  {
    id: "yellow",
    label: "Yellow",
    color: "#ffe100",
    light: "#fff8a6",
    dark: "#9a7a00",
  },
  { id: "lime", label: "Lime", color: "#91e000", light: "#dfff78", dark: "#4f7d00" },
  { id: "green", label: "Green", color: "#16d66b", light: "#98ffc7", dark: "#08713b" },
  { id: "teal", label: "Teal", color: "#00c7bd", light: "#92fff7", dark: "#04746f" },
  { id: "blue", label: "Blue", color: "#2188ff", light: "#a8d8ff", dark: "#1351ad" },
  {
    id: "indigo",
    label: "Indigo",
    color: "#5b5cff",
    light: "#c2c4ff",
    dark: "#27238f",
  },
  {
    id: "violet",
    label: "Violet",
    color: "#ba3cff",
    light: "#ebb8ff",
    dark: "#64138f",
  },
] as const satisfies readonly BeadDefinition[];

type AbacusFrameProps = Readonly<{
  beads: readonly CountingBead[];
  onBeadTap: (beadId: BeadId) => void;
}>;

export function AbacusFrame({ beads, onBeadTap }: AbacusFrameProps) {
  const beadStateById = new Map<BeadId, CountingBead>(
    beads.map((bead) => [bead.id, bead]),
  );

  return (
    <section
      className="abacus-frame"
      aria-label="Wooden abacus frame with ten rainbow beads on one rod"
    >
      <div className="abacus-frame__rail abacus-frame__rail--top" />
      <div className="abacus-frame__rail abacus-frame__rail--right" />
      <div className="abacus-frame__rail abacus-frame__rail--bottom" />
      <div className="abacus-frame__rail abacus-frame__rail--left" />
      <Rod />
      <ol className="abacus-bead-row" aria-label="Ten rainbow beads on the rod">
        {RAINBOW_BEADS.map((bead, index) => (
          <Bead
            bead={bead}
            key={bead.id}
            onTap={onBeadTap}
            position={index + 1}
            side={beadStateById.get(bead.id)?.side ?? "waiting"}
            total={RAINBOW_BEADS.length}
          />
        ))}
      </ol>
    </section>
  );
}
