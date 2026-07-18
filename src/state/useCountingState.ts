import { useCallback, useMemo, useState } from "react";
import {
  createInitialCountingState,
  moveLastCountedBeadToWaiting,
  moveNextWaitingBeadToCounted,
  resetCountingState,
  setBeadSide,
  setCount,
  type BeadId,
  type BeadSide,
  type CountingState,
} from "./counting";

type CountingActions = Readonly<{
  moveBeadToSide: (beadId: BeadId, side: BeadSide) => void;
  moveLastBeadToWaiting: () => void;
  moveNextBeadToCounted: () => void;
  reset: () => void;
  setTotal: (count: number) => void;
}>;

export type CountingModel = CountingState & CountingActions;

export function useCountingState(): CountingModel {
  const [state, setState] = useState(createInitialCountingState);

  const moveBeadToSide = useCallback((beadId: BeadId, side: BeadSide) => {
    setState((currentState) => setBeadSide(currentState, beadId, side));
  }, []);

  const moveNextBeadToCounted = useCallback(() => {
    setState(moveNextWaitingBeadToCounted);
  }, []);

  const moveLastBeadToWaiting = useCallback(() => {
    setState(moveLastCountedBeadToWaiting);
  }, []);

  const setTotal = useCallback((count: number) => {
    setState((currentState) => setCount(currentState, count));
  }, []);

  const reset = useCallback(() => {
    setState(resetCountingState());
  }, []);

  return useMemo(
    () => ({
      ...state,
      moveBeadToSide,
      moveLastBeadToWaiting,
      moveNextBeadToCounted,
      reset,
      setTotal,
    }),
    [
      moveBeadToSide,
      moveLastBeadToWaiting,
      moveNextBeadToCounted,
      reset,
      setTotal,
      state,
    ],
  );
}
