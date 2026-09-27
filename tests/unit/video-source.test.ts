import { describe, expect, it } from "vitest";
import { buildYouTubeEmbedUrl, parseVideoSource } from "@/lib/video-source";

describe("parseVideoSource", () => {
  it("identifica URLs do YouTube (watch, embed, shorts, youtu.be e nocookie)", () => {
    expect(parseVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ")?.kind).toBe("youtube");
    expect(parseVideoSource("https://youtu.be/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      videoId: "dQw4w9WgXcQ",
    });
    expect(parseVideoSource("https://www.youtube.com/embed/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      videoId: "dQw4w9WgXcQ",
    });
    expect(parseVideoSource("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      videoId: "dQw4w9WgXcQ",
    });
    expect(parseVideoSource("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      videoId: "dQw4w9WgXcQ",
    });
    expect(
      parseVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")?.kind,
    ).toBe("youtube");
  });

  it("trata arquivos HTTPS e storage: como vídeo nativo (não-YouTube)", () => {
    expect(parseVideoSource("https://cdn.opapp.mock/videos/lesson-1.mp4")).toEqual({
      kind: "file",
      url: "https://cdn.opapp.mock/videos/lesson-1.mp4",
    });
    expect(parseVideoSource("https://example.com/aula.mp4")).toEqual({
      kind: "file",
      url: "https://example.com/aula.mp4",
    });
  });

  it("devolve null para URLs ausentes ou inválidas", () => {
    expect(parseVideoSource(null)).toBeNull();
    expect(parseVideoSource(undefined)).toBeNull();
    expect(parseVideoSource("")).toBeNull();
    expect(parseVideoSource("not-a-url")).toEqual({ kind: "file", url: "not-a-url" });
  });

  it("não confunde domínios parecidos", () => {
    expect(parseVideoSource("https://example.com/watch?v=dQw4w9WgXcQ")?.kind).toBe("file");
    expect(parseVideoSource("https://youtube.com.br/video")?.kind).toBe("file");
  });
});

describe("buildYouTubeEmbedUrl", () => {
  it("monta embed no domínio de privacidade youtube-nocookie", () => {
    const url = buildYouTubeEmbedUrl("dQw4w9WgXcQ");
    expect(url).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(url).toContain("enablejsapi=1");
    expect(url).toContain("playsinline=1");
  });
});