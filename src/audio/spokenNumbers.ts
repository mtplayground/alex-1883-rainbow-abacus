const SPOKEN_TOTALS = new Map<number, string>([
  [0, "zero"],
  [1, "one"],
  [2, "two"],
  [3, "three"],
  [4, "four"],
  [5, "five"],
  [6, "six"],
  [7, "seven"],
  [8, "eight"],
  [9, "nine"],
  [10, "ten"],
]);

export function speakRunningTotal(total: number): void {
  const spokenTotal = SPOKEN_TOTALS.get(total);

  if (spokenTotal === undefined) {
    return;
  }

  if (
    typeof window === "undefined" ||
    typeof window.speechSynthesis === "undefined" ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(spokenTotal);
    utterance.lang = "en-US";
    utterance.pitch = 1.08;
    utterance.rate = 0.9;
    utterance.volume = 0.95;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech support varies by browser; counting should never depend on it.
  }
}
