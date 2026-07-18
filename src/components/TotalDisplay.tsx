type TotalDisplayProps = Readonly<{
  maximum: number;
  total: number;
}>;

export function TotalDisplay({ maximum, total }: TotalDisplayProps) {
  return (
    <output
      aria-label={`Running total: ${total} of ${maximum} beads counted`}
      aria-live="polite"
      className="total-display"
    >
      <span className="total-display__label">Count</span>
      <span className="total-display__number">{total}</span>
      <span className="total-display__maximum">of {maximum}</span>
    </output>
  );
}
