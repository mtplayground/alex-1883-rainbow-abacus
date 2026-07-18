import { describe, expect, it } from "vitest";
import {
  BEAD_IDS,
  MAX_COUNT,
  MIN_COUNT,
  createInitialCountingState,
  moveLastCountedBeadToWaiting,
  moveNextWaitingBeadToCounted,
  resetCountingState,
  setBeadSide,
  setCount,
  type CountingState,
} from "./counting";

function countedIds(state: CountingState): string[] {
  return state.beads.filter((bead) => bead.side === "counted").map((bead) => bead.id);
}

function waitingIds(state: CountingState): string[] {
  return state.beads.filter((bead) => bead.side === "waiting").map((bead) => bead.id);
}

function expectValidCountingState(state: CountingState): void {
  expect(state.total).toBeGreaterThanOrEqual(MIN_COUNT);
  expect(state.total).toBeLessThanOrEqual(MAX_COUNT);
  expect(state.beads).toHaveLength(MAX_COUNT);
  expect(state.beads.map((bead) => bead.id)).toEqual(BEAD_IDS);
  expect(state.beads.map((bead) => bead.order)).toEqual(
    BEAD_IDS.map((_, index) => index),
  );
  expect(
    state.beads.every((bead) => bead.side === "waiting" || bead.side === "counted"),
  ).toBe(true);
  expect(countedIds(state)).toHaveLength(state.total);
  expect(waitingIds(state)).toHaveLength(MAX_COUNT - state.total);
}

describe("counting state", () => {
  it("starts at zero with all beads waiting", () => {
    const state = createInitialCountingState();

    expectValidCountingState(state);
    expect(state.total).toBe(MIN_COUNT);
    expect(countedIds(state)).toEqual([]);
    expect(waitingIds(state)).toEqual(BEAD_IDS);
  });

  it("counts forward from zero through ten without invalid states", () => {
    let state = createInitialCountingState();

    for (let expectedTotal = 1; expectedTotal <= MAX_COUNT; expectedTotal += 1) {
      state = moveNextWaitingBeadToCounted(state);

      expectValidCountingState(state);
      expect(state.total).toBe(expectedTotal);
      expect(countedIds(state)).toEqual(BEAD_IDS.slice(0, expectedTotal));
      expect(waitingIds(state)).toEqual(BEAD_IDS.slice(expectedTotal));
    }
  });

  it("stays at ten when asked to count beyond the final bead", () => {
    let state = createInitialCountingState();

    for (let index = 0; index < MAX_COUNT + 2; index += 1) {
      state = moveNextWaitingBeadToCounted(state);
    }

    expectValidCountingState(state);
    expect(state.total).toBe(MAX_COUNT);
    expect(countedIds(state)).toEqual(BEAD_IDS);
    expect(waitingIds(state)).toEqual([]);
  });

  it("moves counted beads back toward waiting without going below zero", () => {
    let state = setCount(createInitialCountingState(), MAX_COUNT);

    for (
      let expectedTotal = MAX_COUNT - 1;
      expectedTotal >= MIN_COUNT;
      expectedTotal -= 1
    ) {
      state = moveLastCountedBeadToWaiting(state);

      expectValidCountingState(state);
      expect(state.total).toBe(expectedTotal);
      expect(countedIds(state)).toEqual(BEAD_IDS.slice(0, expectedTotal));
      expect(waitingIds(state)).toEqual(BEAD_IDS.slice(expectedTotal));
    }

    state = moveLastCountedBeadToWaiting(state);
    expectValidCountingState(state);
    expect(state.total).toBe(MIN_COUNT);
  });

  it("clamps direct count changes into the valid zero-to-ten range", () => {
    const initialState = createInitialCountingState();
    const negativeState = setCount(initialState, -4.8);
    const decimalState = setCount(initialState, 4.8);
    const oversizedState = setCount(initialState, MAX_COUNT + 7);

    expectValidCountingState(negativeState);
    expect(negativeState.total).toBe(MIN_COUNT);
    expect(countedIds(negativeState)).toEqual([]);

    expectValidCountingState(decimalState);
    expect(decimalState.total).toBe(4);
    expect(countedIds(decimalState)).toEqual(BEAD_IDS.slice(0, 4));

    expectValidCountingState(oversizedState);
    expect(oversizedState.total).toBe(MAX_COUNT);
    expect(countedIds(oversizedState)).toEqual(BEAD_IDS);
  });

  it("updates bead-side transitions and reset behavior", () => {
    const initialState = createInitialCountingState();
    const countedState = setBeadSide(initialState, "green", "counted");
    const waitingState = setBeadSide(countedState, "green", "waiting");
    const resetState = resetCountingState();

    expectValidCountingState(countedState);
    expect(countedState.total).toBe(1);
    expect(countedIds(countedState)).toEqual(["green"]);

    expectValidCountingState(waitingState);
    expect(waitingState.total).toBe(MIN_COUNT);
    expect(countedIds(waitingState)).toEqual([]);

    expectValidCountingState(resetState);
    expect(resetState.total).toBe(MIN_COUNT);
    expect(resetState).toEqual(initialState);
  });
});
