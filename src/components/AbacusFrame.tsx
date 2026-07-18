import { Bead, type BeadDefinition } from "./Bead";
import { Rod } from "./Rod";

const RAINBOW_BEADS = [
  { id: "red", label: "Red", color: "#ef4444", light: "#fecaca", dark: "#991b1b" },
  {
    id: "orange",
    label: "Orange",
    color: "#f97316",
    light: "#fed7aa",
    dark: "#9a3412",
  },
  { id: "amber", label: "Amber", color: "#f59e0b", light: "#fde68a", dark: "#92400e" },
  {
    id: "yellow",
    label: "Yellow",
    color: "#eab308",
    light: "#fef08a",
    dark: "#854d0e",
  },
  { id: "lime", label: "Lime", color: "#84cc16", light: "#d9f99d", dark: "#3f6212" },
  { id: "green", label: "Green", color: "#22c55e", light: "#bbf7d0", dark: "#166534" },
  { id: "teal", label: "Teal", color: "#14b8a6", light: "#99f6e4", dark: "#115e59" },
  { id: "blue", label: "Blue", color: "#3b82f6", light: "#bfdbfe", dark: "#1e3a8a" },
  {
    id: "indigo",
    label: "Indigo",
    color: "#6366f1",
    light: "#c7d2fe",
    dark: "#312e81",
  },
  {
    id: "violet",
    label: "Violet",
    color: "#a855f7",
    light: "#e9d5ff",
    dark: "#581c87",
  },
] as const satisfies readonly BeadDefinition[];

export function AbacusFrame() {
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
            position={index + 1}
            total={RAINBOW_BEADS.length}
          />
        ))}
      </ol>
    </section>
  );
}
