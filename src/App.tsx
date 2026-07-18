import { useCallback, useState } from "react";
import { playBeadClickSound } from "./audio/beadClickSound";
import { playCelebrationSound } from "./audio/celebrationSound";
import { speakRunningTotal } from "./audio/spokenNumbers";
import { AppShell } from "./components/AppShell";
import { AbacusFrame } from "./components/AbacusFrame";
import { CelebrationOverlay } from "./components/CelebrationOverlay";
import { MAX_COUNT, MIN_COUNT, type BeadId, type BeadSide } from "./state/counting";
import { TotalDisplay } from "./components/TotalDisplay";
import { useCountingState } from "./state/useCountingState";

function clampTotal(nextTotal: number): number {
  return Math.min(Math.max(nextTotal, MIN_COUNT), MAX_COUNT);
}

export default function App() {
  const { beads, moveBeadToSide, total } = useCountingState();
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);

  const celebrateIfComplete = useCallback(
    (nextTotal: number) => {
      if (total < MAX_COUNT && nextTotal === MAX_COUNT) {
        playCelebrationSound();
        setCelebrationTrigger((currentTrigger) => currentTrigger + 1);
      }
    },
    [total],
  );

  const handleBeadTap = useCallback(
    (beadId: BeadId) => {
      const bead = beads.find((currentBead) => currentBead.id === beadId);

      if (!bead || bead.side === "counted") {
        return;
      }

      const nextTotal = clampTotal(total + 1);

      playBeadClickSound();
      speakRunningTotal(nextTotal);
      celebrateIfComplete(nextTotal);
      moveBeadToSide(beadId, "counted");
    },
    [beads, celebrateIfComplete, moveBeadToSide, total],
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
      celebrateIfComplete(nextTotal);
      moveBeadToSide(beadId, side);
    },
    [beads, celebrateIfComplete, moveBeadToSide, total],
  );

  return (
    <AppShell>
      <TotalDisplay maximum={MAX_COUNT} total={total} />
      <AbacusFrame
        beads={beads}
        onBeadDragEnd={handleBeadDragEnd}
        onBeadTap={handleBeadTap}
      />
      <CelebrationOverlay trigger={celebrationTrigger} />
    </AppShell>
  );
}
