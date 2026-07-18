import { useCallback } from "react";
import { AppShell } from "./components/AppShell";
import { AbacusFrame } from "./components/AbacusFrame";
import type { BeadId } from "./state/counting";
import { useCountingState } from "./state/useCountingState";

export default function App() {
  const { beads, moveBeadToSide } = useCountingState();

  const handleBeadTap = useCallback(
    (beadId: BeadId) => {
      moveBeadToSide(beadId, "counted");
    },
    [moveBeadToSide],
  );

  return (
    <AppShell>
      <AbacusFrame beads={beads} onBeadTap={handleBeadTap} />
    </AppShell>
  );
}
