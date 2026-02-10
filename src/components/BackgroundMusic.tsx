"use client";

import { useRef, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { AUDIO } from "@/lib/config";

/**
 * Background music (Music MP3) controlled by the footer music toggle.
 * Plays when music is on, pauses when off. Loops continuously.
 */
export default function BackgroundMusic() {
  const { audio } = useGame();
  const el = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioEl = el.current;
    if (!audioEl) return;

    if (audio.musicOn) {
      audioEl.play().catch(() => {
        // Autoplay may be blocked; user can start via toggle after interaction
      });
    } else {
      audioEl.pause();
    }
  }, [audio.musicOn]);

  return (
    <audio
      ref={el}
      src={AUDIO.music}
      loop
      preload="metadata"
      aria-hidden
      className="hidden"
    />
  );
}
