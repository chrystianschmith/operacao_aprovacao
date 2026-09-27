/**
 * Tipos mínimos do IFrame Player API do YouTube (usados pelo `YouTubeVideoPlayer`).
 * Não há dependência `@types/youtube` — declaramos apenas o subconjunto que consumimos.
 */
export const YouTubePlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

export interface YouTubePlayerEvent {
  data: number;
  target: YouTubePlayer;
}

export interface YouTubePlayerErrorEvent {
  data: number;
}

export interface YouTubePlayerVars {
  autoplay?: 0 | 1;
  controls?: 0 | 1;
  enablejsapi?: 0 | 1;
  origin?: string;
  playsinline?: 0 | 1;
  rel?: 0 | 1;
}

export interface YouTubePlayerOptions {
  videoId?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: YouTubePlayerVars;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerErrorEvent) => void;
    onPlaybackRateChange?: (event: YouTubePlayerEvent) => void;
  };
}

export interface YouTubePlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  getPlaybackRate(): number;
  setPlaybackRate(suggestedRate: number): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  playVideo(): void;
}

export interface YouTubeIframeApi {
  Player: new (element: HTMLElement | string, options: YouTubePlayerOptions) => YouTubePlayer;
  PlayerState: typeof YouTubePlayerState;
}

declare global {
  interface Window {
    YT?: YouTubeIframeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};