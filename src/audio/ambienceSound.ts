import ambienceSoundUrl from "../assets/audio/toy-shelf-ambience.wav";

const AMBIENCE_VOLUME = 0.16;

let ambienceAudio: HTMLAudioElement | null = null;
let isAmbienceEnabled = false;

function getAmbienceAudio(): HTMLAudioElement {
  ambienceAudio ??= new Audio(ambienceSoundUrl);
  ambienceAudio.loop = true;
  ambienceAudio.preload = "auto";
  ambienceAudio.volume = AMBIENCE_VOLUME;
  return ambienceAudio;
}

export function getAmbienceEnabled(): boolean {
  return isAmbienceEnabled;
}

export function setAmbienceEnabled(isEnabled: boolean): void {
  isAmbienceEnabled = isEnabled;

  if (typeof Audio === "undefined") {
    return;
  }

  const audio = getAmbienceAudio();

  if (!isEnabled) {
    audio.pause();
    audio.currentTime = 0;
    return;
  }

  void audio.play().catch(() => {
    // Browser audio permissions can block playback; the visual count stays usable.
  });
}
