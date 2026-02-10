"use client";

import { useGame } from "@/context/GameContext";
import LandingScreen from "./screens/LandingScreen";
import Stage2IntroScreen from "./screens/Stage2IntroScreen";
import ScrollyScreen from "./screens/ScrollyScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultsScreen from "./screens/ResultsScreen";

export default function GameRouter() {
  const { screen } = useGame();

  switch (screen) {
    case "landing":
      return <LandingScreen />;
    case "stage2-intro":
      return <Stage2IntroScreen />;
    case "scrolly-1":
    case "scrolly-2":
    case "scrolly-3":
    case "scrolly-4":
    case "scrolly-5":
      return <ScrollyScreen />;
    case "quiz":
      return <QuizScreen />;
    case "results":
      return <ResultsScreen />;
    default:
      return <LandingScreen />;
  }
}
