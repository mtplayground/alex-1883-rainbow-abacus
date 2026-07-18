type ControlsBarProps = Readonly<{
  isResetDisabled: boolean;
  onReset: () => void;
}>;

export function ControlsBar({ isResetDisabled, onReset }: ControlsBarProps) {
  return (
    <div className="controls-bar" aria-label="Abacus controls">
      <button
        aria-label="Reset all beads and count again"
        className="controls-bar__button"
        disabled={isResetDisabled}
        onClick={onReset}
        type="button"
      >
        Count again
      </button>
    </div>
  );
}
