"use client";

import { useState, useCallback, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useGame } from "@/context/GameContext";
import { BRAIN_SYSTEMS, type BrainSystem, SYSTEM_COLORS } from "@/lib/config";
import { isStage1, isStage2, type Stage1Question, type Stage2Question } from "@/lib/questions";
import { VectorBrainDiagram } from "@/components/VectorBrainDiagram";
import { trackFunnelEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

type SituationStrings = {
  title: string;
  description: string;
  why: string;
  correctMain?: BrainSystem;
  correctAnswerQ1?: BrainSystem;
  correctAnswerQ2?: BrainSystem;
};

const DIAGRAM_SCALE_UP = 1.18;
const DIAGRAM_SCALE_DOWN = 0.85;

export default function QuizScreen() {
  const { strings, t, language } = useLocale();
  const { questions, currentQuestionIndex, submitAnswer, nextQuestion, answers, playClick } = useGame();

  const [q1, setQ1] = useState<BrainSystem | null>(null);
  const [q2, setQ2] = useState<BrainSystem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrectQ1, setIsCorrectQ1] = useState(false);
  const [isCorrectQ2, setIsCorrectQ2] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<BrainSystem | null>(null);
  const [canHover, setCanHover] = useState(false);

  const question = questions[currentQuestionIndex];

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const fn = () => setCanHover(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  if (!question) return null;

  const stage1 = isStage1(question);
  const stage2 = isStage2(question);
  const situationStrings: SituationStrings | undefined = stage1
    ? (strings.situationsMain as Record<string, SituationStrings>)[question.localeKey]
    : (strings.situations as Record<string, SituationStrings>)[question.localeKey];

  if (!situationStrings) return null;

  /** Prefer correct answers from locale JSON when present (so they can be changed without code) */
  const sit = situationStrings as SituationStrings;
  const effectiveCorrectMain = stage1
    ? (sit.correctMain ?? (question as Stage1Question).correctAnswerMain)
    : undefined;
  const effectiveCorrectQ1 = stage2
    ? (sit.correctAnswerQ1 ?? (question as Stage2Question).correctAnswerQ1)
    : undefined;
  const effectiveCorrectQ2 = stage2
    ? (sit.correctAnswerQ2 ?? (question as Stage2Question).correctAnswerQ2)
    : undefined;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmitAnswer = useCallback(async () => {
    if (isStage1(question)) {
      if (!q1 || effectiveCorrectMain === undefined) return;
      if (currentQuestionIndex === 0) {
        trackFunnelEvent(ANALYTICS_EVENTS.FIRST_QUESTION_CHOICE_STAGE1, { language });
      }
      const correct = q1 === effectiveCorrectMain;
      setIsCorrectQ1(correct);
      setIsCorrectQ2(true);
      setSubmitted(true);
      await submitAnswer({
        questionId: question.id,
        q1Answer: q1,
        q2Answer: q1,
        isCorrectQ1: correct,
        isCorrectQ2: true,
      });
    } else {
      if (!q1 || !q2 || effectiveCorrectQ1 === undefined || effectiveCorrectQ2 === undefined) return;
      const correctQ1 = q1 === effectiveCorrectQ1;
      const correctQ2 = q2 === effectiveCorrectQ2;
      setIsCorrectQ1(correctQ1);
      setIsCorrectQ2(correctQ2);
      setSubmitted(true);
      await submitAnswer({
        questionId: question.id,
        q1Answer: q1,
        q2Answer: q2,
        isCorrectQ1: correctQ1,
        isCorrectQ2: correctQ2,
      });
    }
  }, [q1, q2, question, currentQuestionIndex, submitAnswer, effectiveCorrectMain, effectiveCorrectQ1, effectiveCorrectQ2]);

  const handleNext = useCallback(() => {
    setQ1(null);
    setQ2(null);
    setSubmitted(false);
    setIsCorrectQ1(false);
    setIsCorrectQ2(false);
    setHoveredZone(null);
    nextQuestion();
  }, [nextQuestion]);

  // Stage 1: show result as soon as user selects a brain type (no "Next" needed to see answer)
  useEffect(() => {
    if (stage1 && q1 && !submitted) {
      handleSubmitAnswer();
    }
  }, [stage1, q1, submitted, handleSubmitAnswer]);

  // Stage 2: show result as soon as both "who controls" and "who is controlled" are chosen
  useEffect(() => {
    if (stage2 && q1 && q2 && !submitted) {
      handleSubmitAnswer();
    }
  }, [stage2, q1, q2, submitted, handleSubmitAnswer]);

  const progress = ((currentQuestionIndex + (submitted ? 1 : 0)) / questions.length) * 100;

  // Diagram: highlight only on desktop when hovering (focus/hover), not from selection
  const diagramHighlight = canHover ? hoveredZone : null;
  const scaleReptilian =
    stage2 && !submitted
      ? q1 === "reptilian"
        ? DIAGRAM_SCALE_UP
        : q2 === "reptilian"
          ? DIAGRAM_SCALE_DOWN
          : 1
      : 1;
  const scaleLimbic =
    stage2 && !submitted
      ? q1 === "limbic"
        ? DIAGRAM_SCALE_UP
        : q2 === "limbic"
          ? DIAGRAM_SCALE_DOWN
          : 1
      : 1;
  const scaleNeocortex =
    stage2 && !submitted
      ? q1 === "neocortex"
        ? DIAGRAM_SCALE_UP
        : q2 === "neocortex"
          ? DIAGRAM_SCALE_DOWN
          : 1
      : 1;

  const canSubmit = stage1 ? !!q1 : !!q1 && !!q2;

  return (
    <div className="min-h-screen flex flex-col pt-4 pb-6 px-4 sm:px-6 animate-fadeIn">
      {/* Top bar: progress (same level as language switcher) — uses full width, leaves space for fixed language on right */}
      <div className="flex items-center justify-between gap-4 mb-4 pr-20">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-500">
              {t(strings.quiz.progressLabel, {
                current: currentQuestionIndex + 1,
                total: questions.length,
              })}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className={`mx-auto w-full flex-1 ${stage2 ? "max-w-lg md:max-w-4xl" : "max-w-lg"}`}
      >
        {/* Head-in-profile brain diagram (your vector layers); highlight on desktop hover */}
        <div className="flex justify-center mb-6" style={{ minHeight: 180 }}>
          <VectorBrainDiagram
            key={question.id}
            highlightedZone={diagramHighlight}
            dominantZone={
              submitted
                ? stage1
                  ? effectiveCorrectMain ?? null
                  : effectiveCorrectQ1 ?? null
                : null
            }
            foregroundZone={stage2 && submitted && effectiveCorrectQ2 ? effectiveCorrectQ2 : null}
            scaleReptilian={scaleReptilian}
            scaleLimbic={scaleLimbic}
            scaleNeocortex={scaleNeocortex}
            onZoneHover={canHover && !submitted ? setHoveredZone : undefined}
            className="w-40 h-[192px] max-w-[180px] transition-transform duration-300"
          />
        </div>

        {/* Situation */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {situationStrings.title}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {situationStrings.description}
        </p>

        {/* Stage 1: single question "What part is main?" */}
        {/* Stage 2: desktop = two columns (who controls left, who is controlled right); mobile = stacked */}
        <div
          className={
            stage2
              ? "mb-8 flex flex-col gap-8 md:flex-row md:gap-10 md:items-start"
              : "mb-6"
          }
        >
          <div className={stage2 ? "md:flex-1 md:min-w-0" : ""}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              {stage1 ? strings.quiz.questionMain : strings.quiz.questionQ1}
            </h3>
            <div className="grid gap-2">
              {BRAIN_SYSTEMS.map((sys) => {
                const isSelected = q1 === sys;
                const correctAnswer = isStage1(question)
                  ? effectiveCorrectMain!
                  : effectiveCorrectQ1!;
                const isCorrect = submitted && sys === correctAnswer;
                const isWrong = submitted && isSelected && !isCorrectQ1;

                return (
                  <button
                    key={`q1-${sys}`}
                    onClick={() => {
                      if (!submitted) {
                        playClick();
                        setQ1(sys);
                      }
                    }}
                    onPointerEnter={() => canHover && stage2 && !submitted && setHoveredZone(sys)}
                    onPointerLeave={() => canHover && stage2 && setHoveredZone(null)}
                    disabled={submitted}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium
                      transition-all duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      ${submitted && isCorrect
                        ? "border-green-500 bg-green-50 text-green-800"
                        : submitted && isWrong
                        ? "border-red-400 bg-red-50 text-red-700"
                        : isSelected
                        ? "border-gray-900 bg-gray-50 text-gray-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }
                    ${submitted ? "cursor-default" : "cursor-pointer"}
                  `}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: SYSTEM_COLORS[sys] }}
                      />
                      {strings.quiz.options[sys]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q2 – only for stage 2 */}
          {stage2 && (
            <div className="md:flex-1 md:min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                {strings.quiz.questionQ2}
              </h3>
              <div className="grid gap-2">
                {BRAIN_SYSTEMS.map((sys) => {
                  const isSelected = q2 === sys;
                  const isCorrect = submitted && sys === effectiveCorrectQ2;
                  const isWrong = submitted && isSelected && !isCorrectQ2;

                  return (
                    <button
                      key={`q2-${sys}`}
                      onClick={() => {
                        if (!submitted) {
                          playClick();
                          setQ2(sys);
                        }
                      }}
                      onPointerEnter={() => canHover && !submitted && setHoveredZone(sys)}
                      onPointerLeave={() => canHover && setHoveredZone(null)}
                      disabled={submitted}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium
                        transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                        ${submitted && isCorrect
                          ? "border-green-500 bg-green-50 text-green-800"
                          : submitted && isWrong
                          ? "border-red-400 bg-red-50 text-red-700"
                          : isSelected
                          ? "border-gray-900 bg-gray-50 text-gray-900"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }
                      ${submitted ? "cursor-default" : "cursor-pointer"}
                    `}
                      aria-pressed={isSelected}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: SYSTEM_COLORS[sys] }}
                        />
                        {strings.quiz.options[sys]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Feedback & Why */}
        {submitted && (
          <div
            className={`mb-6 p-4 rounded-xl border animate-fadeIn ${
              isCorrectQ1 && isCorrectQ2
                ? "bg-green-50 border-green-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <p className="font-semibold text-sm mb-1">
              {isCorrectQ1 && isCorrectQ2 ? strings.quiz.correct : strings.quiz.incorrect}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{strings.quiz.explanation}</span>{" "}
              {situationStrings.why}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-20">
          {!submitted ? (
            <button
              onClick={() => {
                playClick();
                handleSubmitAnswer();
              }}
              disabled={!canSubmit}
              className={`
                px-6 py-3 rounded-full font-semibold text-sm
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${
                  canSubmit
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isLastQuestion ? strings.quiz.submit : strings.quiz.next}
            </button>
          ) : (
            <button
              onClick={() => {
                playClick();
                handleNext();
              }}
              className="
                px-6 py-3 rounded-full font-semibold text-sm
                bg-gray-900 text-white shadow-lg shadow-gray-900/20
                hover:bg-gray-800 active:scale-[0.98]
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              "
            >
              {isLastQuestion ? strings.quiz.submit : strings.quiz.next}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
