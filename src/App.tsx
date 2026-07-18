import { useCallback } from "react";
import { playBeadClickSound } from "./audio/beadClickSound";
import { AppShell } from "./components/AppShell";
import { AbacusFrame } from "./components/AbacusFrame";
import { MAX_COUNT, type BeadId, type BeadSide } from "./state/counting";
import { TotalDisplay } from "./components/TotalDisplay";
import { useCountingState } from "./state/useCountingState";

export default function App() {
  const { beads, moveBeadToSide, total } = useCountingState();

  const handleBeadTap = useCallback(
    (beadId: BeadId) => {
      const bead = beads.find((currentBead) => currentBead.id === beadId);

      if (bead?.side === "counted") {
        return;
      }

      playBeadClickSound();
      moveBeadToSide(beadId, "counted");
    },
    [beads, moveBeadToSide],
  );

  const handleBeadDragEnd = useCallback(
    (beadId: BeadId, side: BeadSide) => {
      const bead = beads.find((currentBead) => currentBead.id === beadId);

      if (bead?.side === side) {
        return;
      }

      playBeadClickSound();
      moveBeadToSide(beadId, side);
    },
    [beads, moveBeadToSide],
  );

  return (
    <AppShell>
      <TotalDisplay maximum={MAX_COUNT} total={total} />
      <AbacusFrame
        beads={beads}
        onBeadDragEnd={handleBeadDragEnd}
        onBeadTap={handleBeadTap}
      />
    </AppShell>
  );
}
