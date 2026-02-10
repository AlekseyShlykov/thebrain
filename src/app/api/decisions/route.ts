import { NextRequest, NextResponse } from "next/server";
import { createDecision, getDecisionsBySession } from "@/lib/dal";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, questionId, q1Answer, q2Answer, isCorrectQ1, isCorrectQ2 } = body;

    if (!sessionId || !questionId || !q1Answer || !q2Answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure session exists (upsert-like)
    const existingSession = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!existingSession) {
      await prisma.session.create({ data: { id: sessionId } });
    }

    const decision = await createDecision({
      sessionId,
      questionId,
      q1Answer,
      q2Answer,
      isCorrectQ1: Boolean(isCorrectQ1),
      isCorrectQ2: Boolean(isCorrectQ2),
    });

    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    console.error("Error creating decision:", error);
    return NextResponse.json({ error: "Failed to save decision" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  try {
    const decisions = await getDecisionsBySession(sessionId);
    return NextResponse.json(decisions);
  } catch (error) {
    console.error("Error fetching decisions:", error);
    return NextResponse.json({ error: "Failed to fetch decisions" }, { status: 500 });
  }
}
