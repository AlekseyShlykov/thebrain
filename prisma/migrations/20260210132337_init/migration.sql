-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT NOT NULL DEFAULT 'en',
    "sfxOn" BOOLEAN NOT NULL DEFAULT true,
    "musicOn" BOOLEAN NOT NULL DEFAULT true,
    "voiceOn" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "q1Answer" TEXT NOT NULL,
    "q2Answer" TEXT NOT NULL,
    "isCorrectQ1" BOOLEAN NOT NULL,
    "isCorrectQ2" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Decision_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Decision_sessionId_idx" ON "Decision"("sessionId");

-- CreateIndex
CREATE INDEX "Decision_questionId_idx" ON "Decision"("questionId");
