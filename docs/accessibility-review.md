# Accessibility Review

Issue #21 checks for the abacus activity.

## Large Targets

- Beads use button hit areas rather than decorative bead spans, so tap and drag events land on a semantic control.
- Tablet and desktop bead targets are sized from `--abacus-bead-target-size`, with the visual bead kept inside the larger transparent hit area.
- Controls use `--control-target-size` as a minimum interactive height and retain visible focus outlines.
- Compact phones keep the scene within the viewport while preserving a larger-than-visual bead hit area; tablet remains the primary layout target.

## Contrast and Semantics

- Running total, reset, sound toggles, and beads expose accessible labels and state through native controls, `aria-label`, `aria-pressed`, and `aria-live`.
- Text uses dark brown/green against light toy-shelf surfaces; focus outlines use saturated blue with visible offset.
- Bead colors remain visually distinct through hue and light/dark shading rather than relying on text labels alone.

## Reduced Motion

- Bead pop, celebration burst, badge, and confetti animations are reduced to a near-instant single iteration under `prefers-reduced-motion: reduce`.
- Control hover/press movement and bead/control transitions are reduced so users who prefer less motion do not get sliding or bouncing UI feedback.
