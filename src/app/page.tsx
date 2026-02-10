"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import GameRouter from "@/components/GameRouter";
import BackgroundMusic from "@/components/BackgroundMusic";
import SpeechSpeaker from "@/components/SpeechSpeaker";

export default function Home() {
  return (
    <>
      <BackgroundMusic />
      <SpeechSpeaker />
      <LanguageSwitcher />
      <main className="min-h-screen pb-16">
        <GameRouter />
      </main>
      <Footer />
    </>
  );
}
