import type { YouTubeIframeApi } from "@/types/youtube";

/**
 * Carrega o IFrame Player API do YouTube UMA vez por sessão (cache de módulo).
 * O script é injetado dinamicamente a partir do bundle nonce'd — compatível com a CSP
 * `'strict-dynamic'` do `src/proxy.ts`, que exige que scripts externos sejam criados por
 * um script confiável (nunca por `<script src>` estático no HTML).
 */
let iframeApiPromise: Promise<YouTubeIframeApi> | null = null;

export function loadYouTubeIframeApi(): Promise<YouTubeIframeApi> {
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise<YouTubeIframeApi>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("YouTube IFrame API só está disponível no cliente."));
      return;
    }
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(new Error("YouTube IFrame API não inicializou corretamente."));
      }
      window.onYouTubeIframeAPIReady = previousReady;
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      iframeApiPromise = null;
      window.onYouTubeIframeAPIReady = previousReady;
      reject(new Error("Falha ao carregar a YouTube IFrame API."));
    };
    document.head.appendChild(script);
  });

  return iframeApiPromise;
}