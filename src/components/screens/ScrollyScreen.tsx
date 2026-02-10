"use client";

import { useLocale } from "@/context/LocaleContext";
import { useGame, type GameScreen } from "@/context/GameContext";
import { VectorBrainDiagram } from "@/components/VectorBrainDiagram";
import type { BrainSystem } from "@/lib/config";

const SCROLLY_SCREENS: {
  screen: GameScreen;
  next: GameScreen;
  colorKey: keyof typeof SYSTEM_COLORS | null;
}[] = [
  { screen: "scrolly-1", next: "scrolly-2", colorKey: null },
  { screen: "scrolly-2", next: "scrolly-3", colorKey: "reptilian" },
  { screen: "scrolly-3", next: "scrolly-4", colorKey: "limbic" },
  { screen: "scrolly-4", next: "scrolly-5", colorKey: "neocortex" },
  { screen: "scrolly-5", next: "quiz", colorKey: null },
];

export default function ScrollyScreen() {
  const { strings } = useLocale();
  const { screen, setScreen, playClick } = useGame();

  const config = SCROLLY_SCREENS.find((s) => s.screen === screen);
  if (!config) return null;

  const screenIndex = SCROLLY_SCREENS.indexOf(config) + 1;
  const screenKey = `screen${screenIndex}` as keyof typeof strings.scrolly;
  const content = strings.scrolly[screenKey] as { title: string; body: string };
  const isLast = config.next === "quiz";
  const highlightedZone: BrainSystem | null = config.colorKey;

  const handleNext = () => {
    playClick();
    setScreen(config.next);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 animate-fadeIn">
      {/* Brain diagram: current step’s zone is brightly highlighted (reptilian=red, limbic=yellow, neocortex=turquoise) */}
      <div className="mb-6 flex justify-center" style={{ minHeight: 180 }}>
        <VectorBrainDiagram
          highlightedZone={highlightedZone}
          className="w-40 h-[192px] max-w-[180px] transition-all duration-300"
        />
      </div>

      <div className="w-12 h-0.5 rounded-full bg-gray-200 mb-6" />

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center max-w-lg">
        {content.title}
      </h2>

      <p className="mt-4 text-base sm:text-lg text-gray-600 text-center max-w-md leading-relaxed">
        {content.body}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8 mb-6">
        {SCROLLY_SCREENS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i <= SCROLLY_SCREENS.indexOf(config) ? "bg-gray-900 scale-100" : "bg-gray-300 scale-75"
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="
          mt-4 px-8 py-3 rounded-full
          bg-gray-900 text-white font-semibold text-sm
          shadow-lg shadow-gray-900/20
          hover:bg-gray-800 hover:shadow-xl
          active:scale-[0.98]
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        "
      >
        {isLast ? strings.scrolly.startQuiz : strings.scrolly.continue}
      </button>
    </div>
  );
}
