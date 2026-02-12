"use client";

import { useLocale } from "@/context/LocaleContext";
import { useGame } from "@/context/GameContext";
import { VectorBrainDiagram } from "@/components/VectorBrainDiagram";
import { trackFunnelEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function LandingScreen() {
  const { strings } = useLocale();
  const { startGame, playClick } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 animate-fadeIn">
      {/* Brain diagram (head + zones) with green neon glow */}
      <div
        className="mb-8 flex justify-center"
        style={{
          minHeight: 200,
          filter: "drop-shadow(0 0 36px rgba(0, 255, 136, 0.7)) drop-shadow(0 0 72px rgba(0, 255, 136, 0.6))",
        }}
      >
        <VectorBrainDiagram
          className="w-44 h-[211px] max-w-[200px]"
        />
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight text-center">
        {strings.landing.title}
      </h1>

      <p className="mt-2 text-lg text-gray-500 font-medium text-center">
        {strings.landing.subtitle}
      </p>

      <p className="mt-6 text-base text-gray-600 text-center max-w-md leading-relaxed">
        {strings.landing.description}
      </p>

      <button
        onClick={() => {
          playClick();
          trackFunnelEvent(ANALYTICS_EVENTS.INTRO_BUTTON_CLICK);
          startGame();
        }}
        className="
          mt-10 px-8 py-3.5 rounded-full
          bg-gray-900 text-white font-semibold text-base
          shadow-lg shadow-gray-900/20
          hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/25
          active:scale-[0.98]
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        "
      >
        {strings.landing.cta}
      </button>
    </div>
  );
}
