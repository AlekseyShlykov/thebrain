"use client";

import { LocaleProvider } from "@/context/LocaleContext";
import { GameProvider } from "@/context/GameContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <GameProvider>{children}</GameProvider>
    </LocaleProvider>
  );
}
