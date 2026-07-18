import { Rod } from "./Rod";

export function AbacusFrame() {
  return (
    <div
      className="abacus-frame"
      role="img"
      aria-label="Wooden abacus frame with one rod"
    >
      <div className="abacus-frame__rail abacus-frame__rail--top" />
      <div className="abacus-frame__rail abacus-frame__rail--right" />
      <div className="abacus-frame__rail abacus-frame__rail--bottom" />
      <div className="abacus-frame__rail abacus-frame__rail--left" />
      <Rod />
    </div>
  );
}
