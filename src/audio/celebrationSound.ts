import celebrationSoundUrl from "../assets/audio/reach-ten-celebration.wav";

const CELEBRATION_VOLUME = 0.58;

let celebrationAudio: HTMLAudioElement | null = null;

function getCelebrationAudio(): HTMLAudioElement {
  celebrationAudio ??= new Audio(celebrationSoundUrl);
  celebrationAudio.preload = "auto";
  celebrationAudio.volume = CELEBRATION_VOLUME;
  return celebrationAudio;
}

export function playCelebrationSound(): void {
  if (typeof Audio === "undefined") {
    return;
  }

  const audio = getCelebrationAudio();
  audio.pause();
  audio.currentTime = 0;

  void audio.play().catch(() => {
    // Browser audio permissions can block playback; the visual celebration remains.
  });
}
