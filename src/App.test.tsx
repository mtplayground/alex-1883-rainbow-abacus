import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./audio/ambienceSound", () => ({
  getAmbienceEnabled: () => false,
  setAmbienceEnabled: vi.fn(),
}));

vi.mock("./audio/beadClickSound", () => ({
  playBeadClickSound: vi.fn(),
}));

vi.mock("./audio/celebrationSound", () => ({
  playCelebrationSound: vi.fn(),
}));

vi.mock("./audio/spokenNumbers", () => ({
  getSpokenNumbersEnabled: () => false,
  setSpokenNumbersEnabled: vi.fn(),
  speakRunningTotal: vi.fn(),
}));

type TestPointerEventInit = PointerEventInit & Readonly<{ isPrimary?: boolean }>;

class TestPointerEvent extends MouseEvent {
  pointerId: number;
  isPrimary: boolean;

  constructor(type: string, eventInitDict: TestPointerEventInit = {}) {
    super(type, eventInitDict);
    this.pointerId = eventInitDict.pointerId ?? 1;
    this.isPrimary = eventInitDict.isPrimary ?? true;
  }
}

function getRunningTotal(total: number): HTMLElement {
  return screen.getByLabelText(`Running total: ${total} of 10 beads counted`);
}

function getBeadButton(color: string, side: "waiting" | "counted"): HTMLElement {
  return screen.getByRole("button", {
    name: new RegExp(`${color} bead \\d+ of 10, ${side} side`, "i"),
  });
}

function dragBead(button: HTMLElement, startX: number, endX: number): void {
  fireEvent.pointerDown(button, {
    clientX: startX,
    clientY: 20,
    isPrimary: true,
    pointerId: 1,
  });
  fireEvent.pointerMove(button, {
    clientX: endX,
    clientY: 20,
    isPrimary: true,
    pointerId: 1,
  });
  fireEvent.pointerUp(button, {
    clientX: endX,
    clientY: 20,
    isPrimary: true,
    pointerId: 1,
  });
}

beforeAll(() => {
  Object.defineProperty(window, "PointerEvent", {
    configurable: true,
    value: TestPointerEvent,
  });

  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = vi.fn();
  }

  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
  }

  if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = vi.fn();
  }
});

afterEach(() => {
  cleanup();
});

describe("App bead interactions", () => {
  it("advances the running total when a waiting bead is tapped", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(getRunningTotal(0)).not.toBeNull();

    const redBead = getBeadButton("Red", "waiting");
    await user.click(redBead);

    expect(getRunningTotal(1)).not.toBeNull();
    expect(getBeadButton("Red", "counted").getAttribute("aria-pressed")).toBe("true");
  });

  it("does not double-count a bead that has already been tapped", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getBeadButton("Red", "waiting"));
    await user.click(getBeadButton("Red", "counted"));

    expect(getRunningTotal(1)).not.toBeNull();
  });

  it("advances the running total when a bead is dragged across the rod", () => {
    render(<App />);

    const redBead = getBeadButton("Red", "waiting");
    dragBead(redBead, 100, 130);

    expect(getRunningTotal(1)).not.toBeNull();
    expect(getBeadButton("Red", "counted").getAttribute("aria-pressed")).toBe("true");
  });

  it("uses bead-sized hit-area buttons for forgiving tap and drag targets", () => {
    render(<App />);

    const redBead = getBeadButton("Red", "waiting");

    expect(redBead.classList.contains("abacus-bead-hit-area")).toBe(true);
    expect(redBead.querySelector(".abacus-bead")).not.toBeNull();
  });

  it("ignores tiny drag slips until the child commits to moving a bead", () => {
    render(<App />);

    const redBead = getBeadButton("Red", "waiting");
    dragBead(redBead, 100, 112);

    expect(getRunningTotal(0)).not.toBeNull();
    expect(getBeadButton("Red", "waiting").getAttribute("aria-pressed")).toBe("false");
  });

  it("suppresses the follow-up click after a committed drag", async () => {
    const user = userEvent.setup();
    render(<App />);

    const redBead = getBeadButton("Red", "waiting");
    dragBead(redBead, 100, 130);
    await user.click(getBeadButton("Red", "counted"));

    expect(getRunningTotal(1)).not.toBeNull();
  });
});
