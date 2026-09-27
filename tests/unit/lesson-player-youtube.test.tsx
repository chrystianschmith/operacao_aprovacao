import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const HEARTBEAT_INTERVAL_MS = 10_000;

const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5, UNSTARTED: -1 } as const;

/**
 * Player fake do IFrame Player API: como o teste não carrega scripts externos, registramos
 * um `YT.Player` que captura as opções (para disparar `onReady`/`onStateChange` manualmente)
 * e devolve sinais via `getCurrentTime`/`getDuration`/`getPlayerState`/`getPlaybackRate`.
 */
const { FakeYoutubePlayer } = vi.hoisted(() => {
  class FakeYoutubePlayer {
    static instances: FakeYoutubePlayer[] = [];
    private currentTime = 0;
    private duration = 120;
    private state = -1;
    private rate = 1;
    private options: { events?: Record<string, (event: { data: number; target: unknown }) => void> };

    constructor(
      _container: HTMLElement,
      options: { events?: Record<string, (event: { data: number; target: unknown }) => void> },
    ) {
      this.options = options;
      FakeYoutubePlayer.instances.push(this);
    }

    getCurrentTime() {
      return this.currentTime;
    }
    getDuration() {
      return this.duration;
    }
    getPlayerState() {
      return this.state;
    }
    getPlaybackRate() {
      return this.rate;
    }
    setPlaybackRate(rate: number) {
      this.rate = rate;
      this.options.events?.onPlaybackRateChange?.({ data: rate, target: this });
    }
    seekTo(seconds: number) {
      this.currentTime = seconds;
    }
    playVideo() {
      this.state = 1;
    }

    fireReady() {
      this.state = 5;
      this.options.events?.onReady?.({ data: this.state, target: this });
    }
    fireState(state: number) {
      this.state = state;
      this.options.events?.onStateChange?.({ data: state, target: this });
    }
    seek(seconds: number) {
      this.currentTime = seconds;
    }
    setDuration(duration: number) {
      this.duration = duration;
    }
  }

  return { FakeYoutubePlayer };
});

let fetchMock: ReturnType<typeof vi.fn>;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/youtube-api", () => ({
  loadYouTubeIframeApi: () =>
    Promise.resolve({
      Player: FakeYoutubePlayer,
      PlayerState: YT_STATE,
    }),
}));

const { LessonPlayer } = await import("@/components/lessons/lesson-player");

function renderLesson(videoUrl: string) {
  return render(
    <LessonPlayer
      lessonId="lesson-1"
      videoUrl={videoUrl}
      resumePositionSeconds={0}
      initialWatchedPercent={0}
      initialStatus="available"
      nextLessonHref={null}
      nextLessonTitle={null}
      courseTrackHref="/cursos/pm-soldado"
    />,
  );
}

describe("LessonPlayer com vídeo do YouTube", () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    FakeYoutubePlayer.instances = [];
  });

  it("renderiza a superfície de vídeo do YouTube (iframe) em vez de <video> nativo", async () => {
    renderLesson("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    await waitFor(() =>
      expect(document.querySelector("[data-video-surface='youtube']")).toBeTruthy(),
    );
    expect(document.querySelectorAll("video")).toHaveLength(0);
    expect(screen.getByLabelText(/vídeo da aula \(youtube\)/i)).toBeTruthy();
  });

  it("envia sinais brutos no heartbeat quando o YouTube sinaliza play (same cadence do <video>)", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        ok: true,
        data: {
          lessonId: "lesson-1",
          watchedPercent: 25,
          status: "in_progress",
          resumePositionSeconds: 30,
          justCompleted: false,
          completion: null,
          flags: [],
        },
      }),
    });

    renderLesson("https://youtu.be/dQw4w9WgXcQ");
    await waitFor(() => expect(FakeYoutubePlayer.instances).toHaveLength(1));

    const player = FakeYoutubePlayer.instances[0]!;
    player.seek(42);
    player.fireState(YT_STATE.PLAYING);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/progress/heartbeat");
    const body: Record<string, unknown> = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      lessonId: "lesson-1",
      positionSeconds: 42,
      durationSeconds: 120,
      playing: true,
      tabVisible: true,
      playbackRate: 1,
    });
    // Nunca um percentual/tempo total/"concluído" calculado no cliente.
    expect(body).not.toHaveProperty("watchedPercent");
    expect(body).not.toHaveProperty("completed");
    expect(body).not.toHaveProperty("percent");
  });

  it("não envia heartbeat enquanto a duração do YouTube ainda não está disponível", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({ ok: true }),
    });

    renderLesson("https://www.youtube.com/embed/dQw4w9WgXcQ");
    await waitFor(() => expect(FakeYoutubePlayer.instances).toHaveLength(1));

    const player = FakeYoutubePlayer.instances[0]!;
    player.setDuration(0);
    player.seek(0);
    player.fireState(YT_STATE.PLAYING);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("interrompe o intervalo de heartbeat em pause (limpa o tick periódico)", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        ok: true,
        data: {
          lessonId: "lesson-1",
          watchedPercent: 20,
          status: "in_progress",
          resumePositionSeconds: 0,
          justCompleted: false,
          completion: null,
          flags: [],
        },
      }),
    });

    renderLesson("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await waitFor(() => expect(FakeYoutubePlayer.instances.length).toBe(1));
    const player = FakeYoutubePlayer.instances[0]!;

    player.fireState(YT_STATE.PLAYING); // heartbeat oportunista (1ª chamada)
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    player.fireState(YT_STATE.PAUSED); // heartbeat oportunista e limpeza do intervalo
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    // Após pausar, o tick periódico não pode disparar novo heartbeat.
    await new Promise((resolve) => setTimeout(resolve, HEARTBEAT_INTERVAL_MS + 50));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});