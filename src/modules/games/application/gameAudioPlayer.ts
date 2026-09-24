import type { GameId } from '../domain/entities/games.types';

const world = [
  'feel-good-island-loop.mp3',
  'overworld.mp3',
  'an-adventure.mp3',
  'exploration-theme.mp3',
] as const;

export const gameMusic: Record<GameId, readonly string[]> = {
  'bug-hunt': ['an-adventure.mp3', 'exploration-theme.mp3'],
  'logic-circuit': ['overworld.mp3', 'exploration-theme.mp3'],
  'memory-grid': ['feel-good-island-loop.mp3', 'overworld.mp3'],
  'code-islands': ['an-adventure.mp3', 'feel-good-island-loop.mp3'],
  'keppy-world': world,
};

type Track = { audio: HTMLAudioElement; index: number };

const FADE_MS = 3200;
const FADE_SECONDS = FADE_MS / 1000;

/** Owns one playlist. It only creates media elements when playback is requested. */
export class GameAudioPlayer {
  private current: Track | null = null;
  private incoming: Track | null = null;
  private fadeFrame = 0;
  private fadeStartedAt = 0;
  private fadeProgress = 0;
  private playing = false;
  private ducked = false;
  private destroyed = false;
  private failed = new Set<number>();

  constructor(
    private readonly files: readonly string[],
    private readonly volume: number,
  ) {}

  private targetVolume() {
    return this.volume * (this.ducked ? 0.28 : 1);
  }

  private updateVolumes() {
    const volume = this.targetVolume();
    if (this.current) this.current.audio.volume = volume * (1 - this.fadeProgress);
    if (this.incoming) this.incoming.audio.volume = volume * this.fadeProgress;
  }

  private makeTrack(index: number): Track {
    const audio = new Audio(`${import.meta.env.BASE_URL}games/world/${this.files[index]}`);
    audio.preload = 'none';
    const track = { audio, index };
    audio.ontimeupdate = () => {
      if (this.current !== track || !this.playing || this.incoming) return;
      if (Number.isFinite(audio.duration) && audio.duration - audio.currentTime <= FADE_SECONDS) {
        this.beginTransition();
      }
    };
    audio.onended = () => {
      if (this.current !== track || this.destroyed) return;
      if (this.incoming) this.finishTransition();
      else this.advance();
    };
    audio.onerror = () => {
      if (this.destroyed) return;
      this.failed.add(index);
      if (this.incoming === track) {
        this.release(track);
        this.incoming = null;
        this.fadeProgress = 0;
        this.updateVolumes();
      } else if (this.current === track) {
        this.advance();
      }
    };
    return track;
  }

  private release(track: Track) {
    track.audio.pause();
    track.audio.ontimeupdate = null;
    track.audio.onended = null;
    track.audio.onerror = null;
    track.audio.removeAttribute('src');
    track.audio.load();
  }

  private nextIndex(index: number) {
    for (let step = 1; step <= this.files.length; step += 1) {
      const candidate = (index + step) % this.files.length;
      if (!this.failed.has(candidate)) return candidate;
    }
    return null;
  }

  private beginTransition() {
    if (!this.current || this.incoming || this.files.length < 2) return;
    const index = this.nextIndex(this.current.index);
    if (index === null || index === this.current.index) return;
    const track = this.makeTrack(index);
    this.incoming = track;
    this.fadeProgress = 0;
    this.updateVolumes();
    void track.audio
      .play()
      .then(() => {
        if (this.incoming !== track || !this.playing || this.destroyed) return;
        this.fadeStartedAt = performance.now();
        this.tickFade();
      })
      .catch(() => {
        if (this.incoming !== track) return;
        this.release(track);
        this.incoming = null;
        this.fadeProgress = 0;
        this.updateVolumes();
      });
  }

  private tickFade = () => {
    if (!this.playing || !this.incoming || this.destroyed) return;
    this.fadeProgress = Math.min((performance.now() - this.fadeStartedAt) / FADE_MS, 1);
    this.updateVolumes();
    if (this.fadeProgress >= 1) this.finishTransition();
    else this.fadeFrame = requestAnimationFrame(this.tickFade);
  };

  private finishTransition() {
    cancelAnimationFrame(this.fadeFrame);
    this.fadeFrame = 0;
    if (!this.incoming) return;
    if (this.current) this.release(this.current);
    this.current = this.incoming;
    this.incoming = null;
    this.fadeProgress = 0;
    this.updateVolumes();
  }

  private advance() {
    const previousIndex = this.current?.index ?? -1;
    if (this.current) this.release(this.current);
    this.current = null;
    const index = this.nextIndex(previousIndex);
    if (index === null) {
      this.playing = false;
      return;
    }
    this.current = this.makeTrack(index);
    this.fadeProgress = 0;
    this.updateVolumes();
    if (this.playing) void this.current.audio.play().catch(() => undefined);
  }

  start() {
    if (this.destroyed || this.files.length === 0) return;
    this.playing = true;
    if (!this.current) this.current = this.makeTrack(0);
    this.updateVolumes();
    void this.current.audio.play().catch(() => undefined);
  }

  pause() {
    this.playing = false;
    if (this.incoming) this.finishTransition();
    this.current?.audio.pause();
  }

  setDucked(ducked: boolean) {
    this.ducked = ducked;
    this.updateVolumes();
  }

  destroy() {
    if (this.destroyed) return;
    this.pause();
    this.destroyed = true;
    if (this.current) this.release(this.current);
    this.current = null;
    this.failed.clear();
  }
}
