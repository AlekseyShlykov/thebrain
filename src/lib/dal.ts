/**
 * Data Access Layer — all DB operations go through here.
 * Components and API routes import from this module instead of touching Prisma directly.
 */

import { prisma } from "./db";

/* ──────────────── Sessions ──────────────── */

export async function createSession(language = "en") {
  return prisma.session.create({ data: { language } });
}

export async function getSession(id: string) {
  return prisma.session.findUnique({ where: { id }, include: { decisions: true } });
}

export async function updateSessionSettings(
  id: string,
  data: { sfxOn?: boolean; musicOn?: boolean; voiceOn?: boolean; language?: string }
) {
  return prisma.session.update({ where: { id }, data });
}

/* ──────────────── Decisions ──────────────── */

export interface CreateDecisionInput {
  sessionId: string;
  questionId: string;
  q1Answer: string;
  q2Answer: string;
  isCorrectQ1: boolean;
  isCorrectQ2: boolean;
}

export async function createDecision(input: CreateDecisionInput) {
  return prisma.decision.create({ data: input });
}

export async function getDecisionsBySession(sessionId: string) {
  return prisma.decision.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
}

/* ──────────────── Results ──────────────── */

export async function getResultsBySession(sessionId: string) {
  const decisions = await getDecisionsBySession(sessionId);

  const totalQuestions = decisions.length;
  let correctQ1 = 0;
  let correctQ2 = 0;

  const breakdown: Record<string, { correct: number; total: number }> = {
    reptilian: { correct: 0, total: 0 },
    limbic: { correct: 0, total: 0 },
    neocortex: { correct: 0, total: 0 },
  };

  for (const d of decisions) {
    if (d.isCorrectQ1) correctQ1++;
    if (d.isCorrectQ2) correctQ2++;

    // Count by the correct answer category (Q1 = who is in charge)
    const cat = d.q1Answer.toLowerCase().replace(/\s+/g, "");
    const key = cat.includes("reptil") ? "reptilian" : cat.includes("limbic") ? "limbic" : "neocortex";

    breakdown[key].total++;
    if (d.isCorrectQ1 && d.isCorrectQ2) breakdown[key].correct++;
  }

  const totalCorrect = decisions.filter((d) => d.isCorrectQ1 && d.isCorrectQ2).length;

  // Determine top system: the one with the most fully correct answers
  const topSystem = Object.entries(breakdown).sort(
    (a, b) => b[1].correct - a[1].correct
  )[0]?.[0] ?? "neocortex";

  return {
    totalQuestions,
    totalCorrect,
    correctQ1,
    correctQ2,
    breakdown,
    topSystem,
    decisions,
  };
}
