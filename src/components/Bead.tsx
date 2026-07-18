import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { BeadId, BeadSide } from "../state/counting";

const DRAG_START_THRESHOLD_PX = 10;
const DRAG_COMMIT_THRESHOLD_PX = 18;
const MAX_DRAG_OFFSET_PX = 48;

type DragStart = Readonly<{
  pointerId: number;
  x: number;
  y: number;
}>;

export type BeadDefinition = Readonly<{
  id: BeadId;
  label: string;
  color: string;
  light: string;
  dark: string;
}>;

type BeadStyle = CSSProperties & {
  "--bead-color": string;
  "--bead-drag-offset": string;
  "--bead-light": string;
  "--bead-dark": string;
};

type BeadProps = Readonly<{
  bead: BeadDefinition;
  onDragEnd: (beadId: BeadId, side: BeadSide) => void;
  onTap: (beadId: BeadId) => void;
  position: number;
  side: BeadSide;
  total: number;
}>;

function clampDragOffset(offset: number): number {
  return Math.min(Math.max(offset, -MAX_DRAG_OFFSET_PX), MAX_DRAG_OFFSET_PX);
}

function releasePointerCapture(button: HTMLButtonElement, pointerId: number): void {
  if (button.hasPointerCapture(pointerId)) {
    button.releasePointerCapture(pointerId);
  }
}

export function Bead({ bead, onDragEnd, onTap, position, side, total }: BeadProps) {
  const dragStartRef = useRef<DragStart | null>(null);
  const suppressClickRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const beadStyle: BeadStyle = {
    "--bead-color": bead.color,
    "--bead-drag-offset": `${dragOffset}px`,
    "--bead-light": bead.light,
    "--bead-dark": bead.dark,
  };

  const finishDrag = (event: PointerEvent<HTMLButtonElement>): void => {
    const dragStart = dragStartRef.current;

    if (!dragStart) {
      return;
    }

    const dragDistanceX = event.clientX - dragStart.x;
    const movedFarEnough = Math.abs(dragDistanceX) >= DRAG_COMMIT_THRESHOLD_PX;
    const nextSide: BeadSide = dragDistanceX < 0 ? "waiting" : "counted";

    dragStartRef.current = null;
    suppressClickRef.current = movedFarEnough;
    setDragOffset(0);
    setIsDragging(false);
    releasePointerCapture(event.currentTarget, dragStart.pointerId);

    if (movedFarEnough) {
      onDragEnd(bead.id, nextSide);
    }
  };

  return (
    <li className="abacus-bead-item">
      <button
        aria-label={`${bead.label} bead ${position} of ${total}, ${side} side`}
        aria-pressed={side === "counted"}
        className="abacus-bead-hit-area"
        data-dragging={isDragging}
        data-side={side}
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }

          onTap(bead.id);
        }}
        onPointerCancel={(event) => {
          const dragStart = dragStartRef.current;

          dragStartRef.current = null;
          suppressClickRef.current = false;
          setDragOffset(0);
          setIsDragging(false);

          if (dragStart) {
            releasePointerCapture(event.currentTarget, dragStart.pointerId);
          }
        }}
        onPointerDown={(event) => {
          if (!event.isPrimary) {
            return;
          }

          dragStartRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const dragStart = dragStartRef.current;

          if (!dragStart) {
            return;
          }

          const dragDistanceX = event.clientX - dragStart.x;
          const dragDistanceY = event.clientY - dragStart.y;
          const movedFarEnough =
            Math.abs(dragDistanceX) >= DRAG_START_THRESHOLD_PX ||
            Math.abs(dragDistanceY) >= DRAG_START_THRESHOLD_PX;

          if (movedFarEnough) {
            setIsDragging(true);
            setDragOffset(clampDragOffset(dragDistanceX));
          }
        }}
        onPointerUp={finishDrag}
        style={beadStyle}
        type="button"
      >
        <span className="abacus-bead" aria-hidden="true" />
      </button>
    </li>
  );
}
