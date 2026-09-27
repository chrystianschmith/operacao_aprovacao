"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { loadYouTubeIframeApi } from "@/lib/youtube-api";
import { YouTubePlayerState, type YouTubePlayer, type YouTubePlayerEvent } from "@/types/youtube";

export interface YouTubeSignals {
  positionSeconds: number;
  durationSeconds: number;
  playing: boolean;
  playbackRate: number;
}

export interface YouTubeVideoPlayerHandle {
  getSignals(): YouTubeSignals | null;
  seekTo(seconds: number): void;
  setPlaybackRate(rate: number): void;
}

interface YouTubeVideoPlayerProps {
  videoId: string;
  resumePositionSeconds: number;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onRateChange: (rate: number) => void;
  onError: () => void;
}

/**
 * Renderiza um vídeo do YouTube via IFrame Player API (modo privacidade
 * `youtube-nocookie`), expondo para o `LessonPlayer` os MESMOS sinais brutos
 * que o `<video>` nativo (CLAUDE.md §13): `positionSeconds`, `durationSeconds`,
 * `playing` e `playbackRate`. Nunca calcula percentual/tempo/"concluído" — só
 * telemetria bruta; a decisão de progresso continua 100% no servidor.
 *
 * Eventos de estado (play/pause/ended/rate) são repassados via `props` para a
 * mesma cadência de heartbeat do player nativo (tick de 10s + heartbeat
 * oportunista). A API é carregada dinamicamente de `www.youtube.com/iframe_api`
 * (compatível com a CSP `'strict-dynamic'` do `src/proxy.ts`).
 */
export const YouTubeVideoPlayer = forwardRef<YouTubeVideoPlayerHandle, YouTubeVideoPlayerProps>(
  function YouTubeVideoPlayer(
    { videoId, resumePositionSeconds, onPlay, onPause, onEnded, onRateChange, onError },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const resumeAppliedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      getSignals: () => {
        const player = playerRef.current;
        if (!player) return null;
        const durationSeconds = player.getDuration();
        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;
        return {
          positionSeconds: player.getCurrentTime(),
          durationSeconds,
          playing: player.getPlayerState() === YouTubePlayerState.PLAYING,
          playbackRate: player.getPlaybackRate(),
        };
      },
      seekTo(seconds) {
        playerRef.current?.seekTo(seconds, true);
      },
      setPlaybackRate(rate) {
        playerRef.current?.setPlaybackRate(rate);
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      let disposed = false;

      function handleStateChange(event: YouTubePlayerEvent) {
        if (disposed) return;
        switch (event.data) {
          case YouTubePlayerState.PLAYING:
            onPlay();
            break;
          case YouTubePlayerState.PAUSED:
            onPause();
            break;
          case YouTubePlayerState.ENDED:
            onEnded();
            break;
        }
      }

      function handleRateChange(event: YouTubePlayerEvent) {
        if (disposed) return;
        onRateChange(event.data);
      }

      void loadYouTubeIframeApi()
        .then((YT) => {
          if (disposed) return;
          const player = new YT.Player(container, {
            videoId,
            width: "100%",
            height: "100%",
            playerVars: {
              playsinline: 1,
              rel: 0,
              origin: window.location.origin,
            },
            events: {
              onReady: (event) => {
                if (disposed) return;
                playerRef.current = event.target;
                if (resumePositionSeconds > 0) {
                  event.target.seekTo(resumePositionSeconds, true);
                }
                resumeAppliedRef.current = true;
              },
              onStateChange: handleStateChange,
              onPlaybackRateChange: handleRateChange,
              onError: () => {
                if (disposed) return;
                onError();
              },
            },
          });
          playerRef.current = player;
        })
        .catch(() => {
          if (!disposed) onError();
        });

      return () => {
        disposed = true;
        playerRef.current = null;
      };
    }, [videoId, resumePositionSeconds, onPlay, onPause, onEnded, onRateChange, onError]);

    return (
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Vídeo da aula (YouTube)"
        data-video-surface="youtube"
      />
    );
  },
);