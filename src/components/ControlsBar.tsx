type ControlsBarProps = Readonly<{
  isAmbienceEnabled: boolean;
  isResetDisabled: boolean;
  isSpokenNumbersEnabled: boolean;
  onAmbienceChange: (isEnabled: boolean) => void;
  onReset: () => void;
  onSpokenNumbersChange: (isEnabled: boolean) => void;
}>;

export function ControlsBar({
  isAmbienceEnabled,
  isResetDisabled,
  isSpokenNumbersEnabled,
  onAmbienceChange,
  onReset,
  onSpokenNumbersChange,
}: ControlsBarProps) {
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
      <label className="controls-bar__toggle">
        <input
          checked={isSpokenNumbersEnabled}
          className="controls-bar__toggle-input"
          onChange={(event) => {
            onSpokenNumbersChange(event.currentTarget.checked);
          }}
          type="checkbox"
        />
        <span className="controls-bar__toggle-track" aria-hidden="true">
          <span className="controls-bar__toggle-thumb" />
        </span>
        <span className="controls-bar__toggle-text">Spoken numbers</span>
      </label>
      <label className="controls-bar__toggle">
        <input
          checked={isAmbienceEnabled}
          className="controls-bar__toggle-input"
          onChange={(event) => {
            onAmbienceChange(event.currentTarget.checked);
          }}
          type="checkbox"
        />
        <span className="controls-bar__toggle-track" aria-hidden="true">
          <span className="controls-bar__toggle-thumb" />
        </span>
        <span className="controls-bar__toggle-text">Ambience</span>
      </label>
    </div>
  );
}
