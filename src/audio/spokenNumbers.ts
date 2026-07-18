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

let areSpokenNumbersEnabled = true;

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (
    typeof window === "undefined" ||
    typeof window.speechSynthesis === "undefined" ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return null;
  }

  return window.speechSynthesis;
}

export function getSpokenNumbersEnabled(): boolean {
  return areSpokenNumbersEnabled;
}

export function setSpokenNumbersEnabled(isEnabled: boolean): void {
  areSpokenNumbersEnabled = isEnabled;

  if (!isEnabled) {
    getSpeechSynthesis()?.cancel();
  }
}

export function speakRunningTotal(total: number): void {
  if (!areSpokenNumbersEnabled) {
    return;
  }

  const spokenTotal = SPOKEN_TOTALS.get(total);

  if (spokenTotal === undefined) {
    return;
  }

  const speechSynthesis = getSpeechSynthesis();

  if (!speechSynthesis) {
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(spokenTotal);
    utterance.lang = "en-US";
    utterance.pitch = 1.08;
    utterance.rate = 0.9;
    utterance.volume = 0.95;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } catch {
    // Speech support varies by browser; counting should never depend on it.
  }
}
