import { NextRequest, NextResponse } from "next/server";
import { createSession, getSession } from "@/lib/dal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, language } = body;

    // Check if session already exists
    const existing = await getSession(sessionId);
    if (existing) {
      return NextResponse.json(existing);
    }

    // Create new session with the provided ID
    const session = await createSession(language ?? "en");
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
