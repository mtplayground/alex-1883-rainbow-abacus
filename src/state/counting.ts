export const BEAD_IDS = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "teal",
  "blue",
  "indigo",
  "violet",
] as const;

export const MIN_COUNT = 0;
export const MAX_COUNT = BEAD_IDS.length;

export type BeadId = (typeof BEAD_IDS)[number];
export type BeadSide = "waiting" | "counted";

export type CountingBead = Readonly<{
  id: BeadId;
  order: number;
  side: BeadSide;
}>;

export type CountingState = Readonly<{
  beads: readonly CountingBead[];
  total: number;
}>;

function clampCount(count: number): number {
  return Math.min(Math.max(Math.trunc(count), MIN_COUNT), MAX_COUNT);
}

function countMovedBeads(beads: readonly CountingBead[]): number {
  return beads.filter((bead) => bead.side === "counted").length;
}

function createCountingState(beads: readonly CountingBead[]): CountingState {
  return {
    beads,
    total: countMovedBeads(beads),
  };
}

export function createInitialCountingState(): CountingState {
  return createCountingState(
    BEAD_IDS.map((id, index) => ({
      id,
      order: index,
      side: "waiting",
    })),
  );
}

export function setBeadSide(
  state: CountingState,
  beadId: BeadId,
  side: BeadSide,
): CountingState {
  return createCountingState(
    state.beads.map((bead) => (bead.id === beadId ? { ...bead, side } : bead)),
  );
}

export function setCount(state: CountingState, nextCount: number): CountingState {
  const normalizedCount = clampCount(nextCount);

  return createCountingState(
    state.beads.map((bead) => ({
      ...bead,
      side: bead.order < normalizedCount ? "counted" : "waiting",
    })),
  );
}

export function moveNextWaitingBeadToCounted(state: CountingState): CountingState {
  const nextWaitingBead = state.beads.find((bead) => bead.side === "waiting");

  if (!nextWaitingBead) {
    return state;
  }

  return setBeadSide(state, nextWaitingBead.id, "counted");
}

export function moveLastCountedBeadToWaiting(state: CountingState): CountingState {
  for (let index = state.beads.length - 1; index >= 0; index -= 1) {
    const bead = state.beads[index];

    if (bead?.side === "counted") {
      return setBeadSide(state, bead.id, "waiting");
    }
  }

  return state;
}

export function resetCountingState(): CountingState {
  return createInitialCountingState();
}
