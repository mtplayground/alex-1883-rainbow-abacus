import { useCallback } from "react";
import { AppShell } from "./components/AppShell";
import { AbacusFrame } from "./components/AbacusFrame";
import { MAX_COUNT, type BeadId, type BeadSide } from "./state/counting";
import { TotalDisplay } from "./components/TotalDisplay";
import { useCountingState } from "./state/useCountingState";

export default function App() {
  const { beads, moveBeadToSide, total } = useCountingState();

  const handleBeadTap = useCallback(
    (beadId: BeadId) => {
      moveBeadToSide(beadId, "counted");
    },
    [moveBeadToSide],
  );

  const handleBeadDragEnd = useCallback(
    (beadId: BeadId, side: BeadSide) => {
      moveBeadToSide(beadId, side);
    },
    [moveBeadToSide],
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
