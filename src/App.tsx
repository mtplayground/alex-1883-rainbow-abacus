import { useCallback } from "react";
import { playBeadClickSound } from "./audio/beadClickSound";
import { speakRunningTotal } from "./audio/spokenNumbers";
import { AppShell } from "./components/AppShell";
import { AbacusFrame } from "./components/AbacusFrame";
import { MAX_COUNT, MIN_COUNT, type BeadId, type BeadSide } from "./state/counting";
import { TotalDisplay } from "./components/TotalDisplay";
import { useCountingState } from "./state/useCountingState";

function clampTotal(nextTotal: number): number {
  return Math.min(Math.max(nextTotal, MIN_COUNT), MAX_COUNT);
}

export default function App() {
  const { beads, moveBeadToSide, total } = useCountingState();

  const handleBeadTap = useCallback(
    (beadId: BeadId) => {
      const bead = beads.find((currentBead) => currentBead.id === beadId);

      if (!bead || bead.side === "counted") {
        return;
      }

      const nextTotal = clampTotal(total + 1);

      playBeadClickSound();
      speakRunningTotal(nextTotal);
      moveBeadToSide(beadId, "counted");
    },
    [beads, moveBeadToSide, total],
  );

  const handleBeadDragEnd = useCallback(
    (beadId: BeadId, side: BeadSide) => {
      const bead = beads.find((currentBead) => currentBead.id === beadId);

      if (!bead || bead.side === side) {
        return;
      }

      const nextTotal = clampTotal(total + (side === "counted" ? 1 : -1));

      playBeadClickSound();
      speakRunningTotal(nextTotal);
      moveBeadToSide(beadId, side);
    },
    [beads, moveBeadToSide, total],
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
