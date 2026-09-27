"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  /** Milissegundos restantes para o bônus expirar. */
  durationMs?: number;
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function CountdownTimer({ durationMs = 24 * 60 * 60 * 1000 }: CountdownTimerProps) {
  const [remainingMs, setRemainingMs] = useState(durationMs);

  useEffect(() => {
    const deadline = Date.now() + durationMs;
    const timer = window.setInterval(() => {
      setRemainingMs(Math.max(0, deadline - Date.now()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [durationMs]);

  const totalSeconds = Math.ceil(remainingMs / 1000);

  return (
    <p role="timer" aria-label={`Tempo restante: ${formatTime(totalSeconds)}`} className="text-sm text-muted-foreground">
      Bônus de mentoria expira em{" "}
      <span className="font-mono font-semibold text-primary">{formatTime(totalSeconds)}</span>
    </p>
  );
}