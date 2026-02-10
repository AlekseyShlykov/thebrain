import { BRAIN_SYSTEMS, type BrainSystem } from "./config";

/** Stage 1: only "which part is the main one (responsible)?" — single choice */
export interface Stage1Question {
  id: string;
  stage: 1;
  /** Key into locales: situationsMain[key] */
  localeKey: string;
  /** Key for image: quiz-{imageKey}.png */
  imageKey: string;
  correctAnswerMain: BrainSystem;
  imageColor: string;
}

/** Stage 2: "who controls?" and "who is controlled?" — two choices */
export interface Stage2Question {
  id: string;
  stage: 2;
  /** Key into locales: situations[key] (controller/controlled situations) */
  localeKey: string;
  /** Key for image: quiz-{imageKey}.png */
  imageKey: string;
  correctAnswerQ1: BrainSystem; // who is in charge / controller
  correctAnswerQ2: BrainSystem; // who is controlled
  imageColor: string;
}

export type Question = Stage1Question | Stage2Question;

export function isStage1(q: Question): q is Stage1Question {
  return q.stage === 1;
}

export function isStage2(q: Question): q is Stage2Question {
  return q.stage === 2;
}

/** Number of stage-1 questions shown per game (randomly drawn from the pool of 20) */
export const STAGE1_QUESTIONS_PER_GAME = 6;

/** Image keys cycle through main1–main6 (we only have 6 stage-1 images) */
const STAGE1_IMAGE_KEYS = ["main1", "main2", "main3", "main4", "main5", "main6"] as const;

/** Stage 1 "What?" layer: exactly 6 questions — at least one Neocortex, one Reptilian, one Limbic; the other 3 random */
const STAGE1_WHAT_IMAGE_KEYS = ["main1", "main2", "main3", "main4", "main5", "main6"] as const;

/** Fixed 3 for "What?" layer: one of each system (neocortex, reptilian, limbic) */
const STAGE1_WHAT_FIXED: Stage1Question[] = [
  { id: "stage1-what-1", stage: 1, localeKey: "what1", imageKey: STAGE1_WHAT_IMAGE_KEYS[0], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-what-2", stage: 1, localeKey: "what2", imageKey: STAGE1_WHAT_IMAGE_KEYS[1], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-what-3", stage: 1, localeKey: "what3", imageKey: STAGE1_WHAT_IMAGE_KEYS[2], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
];

/** Image colors by system for "What?" random questions */
const WHAT_IMAGE_COLORS: Record<BrainSystem, string> = {
  reptilian: "#dc2626",
  limbic: "#f59e0b",
  neocortex: "#3b82f6",
};

/** Build the 3 random "What?" questions (what4, what5, what6) with random correct answers */
function buildStage1WhatRandomThree(): Stage1Question[] {
  const systems = shuffleQuestions([...BRAIN_SYSTEMS]);
  return [
    { id: "stage1-what-4", stage: 1, localeKey: "what4", imageKey: STAGE1_WHAT_IMAGE_KEYS[3], correctAnswerMain: systems[0], imageColor: WHAT_IMAGE_COLORS[systems[0]] },
    { id: "stage1-what-5", stage: 1, localeKey: "what5", imageKey: STAGE1_WHAT_IMAGE_KEYS[4], correctAnswerMain: systems[1], imageColor: WHAT_IMAGE_COLORS[systems[1]] },
    { id: "stage1-what-6", stage: 1, localeKey: "what6", imageKey: STAGE1_WHAT_IMAGE_KEYS[5], correctAnswerMain: systems[2], imageColor: WHAT_IMAGE_COLORS[systems[2]] },
  ];
}

/** Stage 1: 20 situations — "What part of the brain is the main one (responsible) here?" — 6 chosen at random per game */
export const STAGE1_POOL: Stage1Question[] = [
  { id: "stage1-1", stage: 1, localeKey: "main1", imageKey: STAGE1_IMAGE_KEYS[0], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-2", stage: 1, localeKey: "main2", imageKey: STAGE1_IMAGE_KEYS[1], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
  { id: "stage1-3", stage: 1, localeKey: "main3", imageKey: STAGE1_IMAGE_KEYS[2], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-4", stage: 1, localeKey: "main4", imageKey: STAGE1_IMAGE_KEYS[3], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-5", stage: 1, localeKey: "main5", imageKey: STAGE1_IMAGE_KEYS[4], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
  { id: "stage1-6", stage: 1, localeKey: "main6", imageKey: STAGE1_IMAGE_KEYS[5], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-7", stage: 1, localeKey: "main7", imageKey: STAGE1_IMAGE_KEYS[0], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-8", stage: 1, localeKey: "main8", imageKey: STAGE1_IMAGE_KEYS[1], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
  { id: "stage1-9", stage: 1, localeKey: "main9", imageKey: STAGE1_IMAGE_KEYS[2], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-10", stage: 1, localeKey: "main10", imageKey: STAGE1_IMAGE_KEYS[3], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-11", stage: 1, localeKey: "main11", imageKey: STAGE1_IMAGE_KEYS[4], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
  { id: "stage1-12", stage: 1, localeKey: "main12", imageKey: STAGE1_IMAGE_KEYS[5], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-13", stage: 1, localeKey: "main13", imageKey: STAGE1_IMAGE_KEYS[0], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-14", stage: 1, localeKey: "main14", imageKey: STAGE1_IMAGE_KEYS[1], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
  { id: "stage1-15", stage: 1, localeKey: "main15", imageKey: STAGE1_IMAGE_KEYS[2], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-16", stage: 1, localeKey: "main16", imageKey: STAGE1_IMAGE_KEYS[3], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-17", stage: 1, localeKey: "main17", imageKey: STAGE1_IMAGE_KEYS[4], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
  { id: "stage1-18", stage: 1, localeKey: "main18", imageKey: STAGE1_IMAGE_KEYS[5], correctAnswerMain: "neocortex", imageColor: "#3b82f6" },
  { id: "stage1-19", stage: 1, localeKey: "main19", imageKey: STAGE1_IMAGE_KEYS[0], correctAnswerMain: "reptilian", imageColor: "#dc2626" },
  { id: "stage1-20", stage: 1, localeKey: "main20", imageKey: STAGE1_IMAGE_KEYS[1], correctAnswerMain: "limbic", imageColor: "#f59e0b" },
];

/** Number of stage-2 questions shown per game (randomly drawn from the pool of 20) */
export const STAGE2_QUESTIONS_PER_GAME = 6;

/** Image keys cycle through ctrl1–ctrl6 (we only have 6 stage-2 images) */
const STAGE2_IMAGE_KEYS = ["ctrl1", "ctrl2", "ctrl3", "ctrl4", "ctrl5", "ctrl6"] as const;

/** Stage 2: 20 situations — "Who controls whom?" — 6 chosen at random per game */
export const STAGE2_POOL: Stage2Question[] = [
  { id: "stage2-1", stage: 2, localeKey: "ctrl1", imageKey: STAGE2_IMAGE_KEYS[0], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-2", stage: 2, localeKey: "ctrl2", imageKey: STAGE2_IMAGE_KEYS[1], correctAnswerQ1: "neocortex", correctAnswerQ2: "reptilian", imageColor: "#3b82f6" },
  { id: "stage2-3", stage: 2, localeKey: "ctrl3", imageKey: STAGE2_IMAGE_KEYS[2], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-4", stage: 2, localeKey: "ctrl4", imageKey: STAGE2_IMAGE_KEYS[3], correctAnswerQ1: "reptilian", correctAnswerQ2: "limbic", imageColor: "#dc2626" },
  { id: "stage2-5", stage: 2, localeKey: "ctrl5", imageKey: STAGE2_IMAGE_KEYS[4], correctAnswerQ1: "limbic", correctAnswerQ2: "neocortex", imageColor: "#f59e0b" },
  { id: "stage2-6", stage: 2, localeKey: "ctrl6", imageKey: STAGE2_IMAGE_KEYS[5], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-7", stage: 2, localeKey: "ctrl7", imageKey: STAGE2_IMAGE_KEYS[0], correctAnswerQ1: "reptilian", correctAnswerQ2: "limbic", imageColor: "#dc2626" },
  { id: "stage2-8", stage: 2, localeKey: "ctrl8", imageKey: STAGE2_IMAGE_KEYS[1], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-9", stage: 2, localeKey: "ctrl9", imageKey: STAGE2_IMAGE_KEYS[2], correctAnswerQ1: "limbic", correctAnswerQ2: "reptilian", imageColor: "#f59e0b" },
  { id: "stage2-10", stage: 2, localeKey: "ctrl10", imageKey: STAGE2_IMAGE_KEYS[3], correctAnswerQ1: "reptilian", correctAnswerQ2: "neocortex", imageColor: "#dc2626" },
  { id: "stage2-11", stage: 2, localeKey: "ctrl11", imageKey: STAGE2_IMAGE_KEYS[4], correctAnswerQ1: "limbic", correctAnswerQ2: "neocortex", imageColor: "#f59e0b" },
  { id: "stage2-12", stage: 2, localeKey: "ctrl12", imageKey: STAGE2_IMAGE_KEYS[5], correctAnswerQ1: "neocortex", correctAnswerQ2: "reptilian", imageColor: "#3b82f6" },
  { id: "stage2-13", stage: 2, localeKey: "ctrl13", imageKey: STAGE2_IMAGE_KEYS[0], correctAnswerQ1: "reptilian", correctAnswerQ2: "limbic", imageColor: "#dc2626" },
  { id: "stage2-14", stage: 2, localeKey: "ctrl14", imageKey: STAGE2_IMAGE_KEYS[1], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-15", stage: 2, localeKey: "ctrl15", imageKey: STAGE2_IMAGE_KEYS[2], correctAnswerQ1: "limbic", correctAnswerQ2: "neocortex", imageColor: "#f59e0b" },
  { id: "stage2-16", stage: 2, localeKey: "ctrl16", imageKey: STAGE2_IMAGE_KEYS[3], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-17", stage: 2, localeKey: "ctrl17", imageKey: STAGE2_IMAGE_KEYS[4], correctAnswerQ1: "reptilian", correctAnswerQ2: "limbic", imageColor: "#dc2626" },
  { id: "stage2-18", stage: 2, localeKey: "ctrl18", imageKey: STAGE2_IMAGE_KEYS[5], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
  { id: "stage2-19", stage: 2, localeKey: "ctrl19", imageKey: STAGE2_IMAGE_KEYS[0], correctAnswerQ1: "limbic", correctAnswerQ2: "reptilian", imageColor: "#f59e0b" },
  { id: "stage2-20", stage: 2, localeKey: "ctrl20", imageKey: STAGE2_IMAGE_KEYS[1], correctAnswerQ1: "neocortex", correctAnswerQ2: "limbic", imageColor: "#3b82f6" },
];

/** Shuffle array (Fisher-Yates) */
export function shuffleQuestions<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Build full quiz: 6 stage-1 (random from main1–main20) + 6 stage-2 (random from ctrl1–ctrl20) */
export function buildQuestionPool(): Question[] {
  const shuffledStage1 = shuffleQuestions(STAGE1_POOL);
  const stage1Chosen = shuffledStage1.slice(0, STAGE1_QUESTIONS_PER_GAME);
  const shuffledStage2 = shuffleQuestions(STAGE2_POOL);
  const stage2Chosen = shuffledStage2.slice(0, STAGE2_QUESTIONS_PER_GAME);
  return [...stage1Chosen, ...stage2Chosen];
}
