import beadClickSoundUrl from "../assets/audio/bead-click.wav";

const AUDIO_POOL_SIZE = 4;
const CLICK_VOLUME = 0.45;

let audioPool: HTMLAudioElement[] | null = null;
let nextAudioIndex = 0;

function createClickAudio(): HTMLAudioElement {
  const audio = new Audio(beadClickSoundUrl);
  audio.preload = "auto";
  audio.volume = CLICK_VOLUME;
  return audio;
}

function getAudioPool(): HTMLAudioElement[] {
  audioPool ??= Array.from({ length: AUDIO_POOL_SIZE }, createClickAudio);
  return audioPool;
}

export function playBeadClickSound(): void {
  if (typeof Audio === "undefined") {
    return;
  }

  const pool = getAudioPool();
  const audio = pool[nextAudioIndex];
  nextAudioIndex = (nextAudioIndex + 1) % pool.length;

  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;

  void audio.play().catch(() => {
    // Browser audio permissions can block playback; bead movement should continue.
  });
}
