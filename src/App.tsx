import { AppShell } from "./components/AppShell";
import { AbacusFrame } from "./components/AbacusFrame";
import { useCountingState } from "./state/useCountingState";

export default function App() {
  const { beads } = useCountingState();

  return (
    <AppShell>
      <AbacusFrame beads={beads} />
    </AppShell>
  );
}
