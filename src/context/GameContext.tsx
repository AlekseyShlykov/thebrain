"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { BrainSystem } from "@/lib/config";
import { AUDIO } from "@/lib/config";
import { buildQuestionPool, type Question } from "@/lib/questions";

/* ──────────────── Types ──────────────── */

export type GameScreen =
  | "landing"
  | "stage2-intro"
  | "scrolly-1"
  | "scrolly-2"
  | "scrolly-3"
  | "scrolly-4"
  | "scrolly-5"
  | "quiz"
  | "results";

export interface QuizAnswer {
  questionId: string;
  q1Answer: BrainSystem;
  q2Answer: BrainSystem;
  isCorrectQ1: boolean;
  isCorrectQ2: boolean;
}

export interface AudioSettings {
  sfxOn: boolean;
  musicOn: boolean;
  voiceOn: boolean;
}

interface GameContextValue {
  /* Navigation */
  screen: GameScreen;
  setScreen: (s: GameScreen) => void;

  /* Session */
  sessionId: string;

  /* Quiz state */
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  setCurrentQuestionIndex: (i: number) => void;

  /* Actions */
  startGame: () => void;
  submitAnswer: (answer: QuizAnswer) => Promise<void>;
  nextQuestion: () => void;
  restartGame: () => void;

  /* Audio */
  audio: AudioSettings;
  playClick: () => void;
  toggleSfx: () => void;
  toggleMusic: () => void;
  toggleVoice: () => void;

  /* Results */
  results: null | {
    totalCorrect: number;
    totalQuestions: number;
    breakdown: Record<string, { correct: number; total: number }>;
    topSystem: string;
  };
  loadResults: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const SESSION_KEY = "brain-driver-session-id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return uuidv4();
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) return stored;
  const id = uuidv4();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

/** Compute results from in-memory answers (no server needed). */
/** Stage 2: each correct answer (who controls OR who is controlled) counts as 1 point; max 18 (6 + 6×2). */
function computeResults(answers: QuizAnswer[]) {
  const breakdown: Record<string, { correct: number; total: number }> = {
    reptilian: { correct: 0, total: 0 },
    limbic: { correct: 0, total: 0 },
    neocortex: { correct: 0, total: 0 },
  };

  let totalCorrect = 0;
  let totalPossiblePoints = 0;

  for (const d of answers) {
    const isStage2 = d.questionId.startsWith("stage2-");
    const pointsThisQuestion = isStage2 ? 2 : 1;
    totalPossiblePoints += pointsThisQuestion;

    if (isStage2) {
      // Stage 2: count each correct answer separately (controller + controlled)
      if (breakdown[d.q1Answer]) {
        breakdown[d.q1Answer].total++;
        if (d.isCorrectQ1) {
          breakdown[d.q1Answer].correct++;
          totalCorrect++;
        }
      }
      if (breakdown[d.q2Answer]) {
        breakdown[d.q2Answer].total++;
        if (d.isCorrectQ2) {
          breakdown[d.q2Answer].correct++;
          totalCorrect++;
        }
      }
    } else {
      // Stage 1: one point per question
      if (breakdown[d.q1Answer]) {
        breakdown[d.q1Answer].total++;
        if (d.isCorrectQ1) {
          breakdown[d.q1Answer].correct++;
          totalCorrect++;
        }
      }
    }
  }

  const topSystem =
    Object.entries(breakdown).sort((a, b) => b[1].correct - a[1].correct)[0]?.[0] ?? "neocortex";

  return { totalQuestions: totalPossiblePoints, totalCorrect, breakdown, topSystem };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<GameScreen>("landing");
  const [sessionId, setSessionId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [audio, setAudio] = useState<AudioSettings>({
    sfxOn: true,
    musicOn: false,
    voiceOn: false,
  });
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = new Audio(AUDIO.click);
    clickAudioRef.current = el;
    return () => {
      clickAudioRef.current = null;
    };
  }, []);
  const [results, setResults] = useState<GameContextValue["results"]>(null);

  /* Initialize session on mount */
  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
  }, []);

  const startGame = useCallback(() => {
    setQuestions(buildQuestionPool());
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
    setScreen("scrolly-1");
  }, []);

  const submitAnswer = useCallback(
    async (answer: QuizAnswer) => {
      setAnswers((prev) => [...prev, answer]);
    },
    []
  );

  const nextQuestion = useCallback(() => {
    // After 6th question (index 5), show Stage 2 intro before 7th question
    if (currentQuestionIndex === 5 && questions.length > 6) {
      setCurrentQuestionIndex(6);
      setScreen("stage2-intro");
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setScreen("results");
    }
  }, [currentQuestionIndex, questions.length]);

  const restartGame = useCallback(() => {
    // New session for restart
    const newId = uuidv4();
    localStorage.setItem(SESSION_KEY, newId);
    setSessionId(newId);

    setQuestions(buildQuestionPool());
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
    setScreen("landing");
  }, []);

  const loadResults = useCallback(() => {
    setResults(computeResults(answers));
  }, [answers]);

  const playClick = useCallback(() => {
    if (!audio.sfxOn) return;
    const el = clickAudioRef.current;
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  }, [audio.sfxOn]);

  const toggleSfx = useCallback(() => setAudio((a) => ({ ...a, sfxOn: !a.sfxOn })), []);
  const toggleMusic = useCallback(() => setAudio((a) => ({ ...a, musicOn: !a.musicOn })), []);
  const toggleVoice = useCallback(() => setAudio((a) => ({ ...a, voiceOn: !a.voiceOn })), []);

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        sessionId,
        questions,
        currentQuestionIndex,
        answers,
        setCurrentQuestionIndex,
        startGame,
        submitAnswer,
        nextQuestion,
        restartGame,
        audio,
        playClick,
        toggleSfx,
        toggleMusic,
        toggleVoice,
        results,
        loadResults,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
