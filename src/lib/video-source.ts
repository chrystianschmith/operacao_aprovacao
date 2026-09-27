export type VideoSource =
  | { kind: "youtube"; videoId: string }
  | { kind: "file"; url: string }
  | null;

const YOUTUBE_PATTERNS: ReadonlyArray<RegExp> = [
  /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{6,})/,
  /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
  /^https?:\/\/(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{6,})/,
];

/**
 * Normaliza a URL de vídeo de uma aula (CLAUDE.md §12/§13). O player nativo reproduz arquivos
 * HTTPS; vídeos do YouTube são convertidos para embed `youtube-nocookie` (privacidade). O
 * servidor continua a única fonte de verdade de progresso — só a FORMA de reprodução muda.
 */
export function parseVideoSource(url: string | null | undefined): VideoSource {
  if (!url) return null;
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = pattern.exec(url);
    if (match?.[1]) return { kind: "youtube", videoId: match[1] };
  }
  return { kind: "file", url };
}

export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?enablejsapi=1&playsinline=1&origin=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.origin : "",
  )}`;
}