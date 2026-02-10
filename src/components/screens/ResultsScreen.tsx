"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useGame } from "@/context/GameContext";
import { SYSTEM_COLORS, LINKS, type BrainSystem } from "@/lib/config";

function generateShareImage(
  canvas: HTMLCanvasElement,
  data: {
    topSystem: string;
    totalCorrect: number;
    totalQuestions: number;
    breakdown: Record<string, { correct: number; total: number }>;
    systemLabels: Record<string, string>;
    topDriverLabel: string;
  }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 600;
  const h = 400;
  canvas.width = w;
  canvas.height = h;

  // Background
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);

  // Top accent bar
  const topColor = SYSTEM_COLORS[data.topSystem as BrainSystem] || "#3b82f6";
  ctx.fillStyle = topColor;
  ctx.fillRect(0, 0, w, 6);

  // Title
  ctx.fillStyle = "#111827";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Brain Driver", w / 2, 50);

  // Top driver
  ctx.fillStyle = "#6b7280";
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  ctx.fillText(data.topDriverLabel, w / 2, 80);

  // Score circle
  ctx.beginPath();
  ctx.arc(w / 2, 160, 50, 0, Math.PI * 2);
  ctx.fillStyle = topColor + "20";
  ctx.fill();
  ctx.strokeStyle = topColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${data.totalCorrect}/${data.totalQuestions}`, w / 2, 170);

  // Breakdown
  const systems = ["reptilian", "limbic", "neocortex"];
  const barY = 240;
  const barHeight = 24;
  const barMaxWidth = 140;
  const startX = 80;

  systems.forEach((sys, i) => {
    const y = barY + i * 44;
    const bd = data.breakdown[sys] || { correct: 0, total: 0 };
    const color = SYSTEM_COLORS[sys as BrainSystem];
    const label = data.systemLabels[sys] || sys;

    // Label
    ctx.fillStyle = "#374151";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, startX, y - 4);

    // Background bar
    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.roundRect(startX, y, barMaxWidth, barHeight, 6);
    ctx.fill();

    // Filled bar
    const fillWidth = bd.total > 0 ? (bd.correct / bd.total) * barMaxWidth : 0;
    if (fillWidth > 0) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(startX, y, Math.max(fillWidth, 12), barHeight, 6);
      ctx.fill();
    }

    // Score text
    ctx.fillStyle = "#6b7280";
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${bd.correct}/${bd.total}`, startX + barMaxWidth + 12, y + 17);
  });

  // Footer
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, h - 30, w, 30);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("braindrivergame.com", w / 2, h - 10);
}

export default function ResultsScreen() {
  const { strings, t } = useLocale();
  const { results, loadResults, restartGame, playClick } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  useEffect(() => {
    if (results && canvasRef.current) {
      const topSystemLabel =
        strings.results[results.topSystem as keyof typeof strings.results] || results.topSystem;

      generateShareImage(canvasRef.current, {
        topSystem: results.topSystem,
        totalCorrect: results.totalCorrect,
        totalQuestions: results.totalQuestions,
        breakdown: results.breakdown,
        systemLabels: {
          reptilian: strings.results.reptilian,
          limbic: strings.results.limbic,
          neocortex: strings.results.neocortex,
        },
        topDriverLabel: t(strings.results.topDriver, { system: topSystemLabel }),
      });
      setImageDataUrl(canvasRef.current.toDataURL("image/png"));
    }
  }, [results, strings, t]);

  const handleDownloadImage = useCallback(() => {
    if (!imageDataUrl) return;
    const link = document.createElement("a");
    link.download = "brain-driver-results.png";
    link.href = imageDataUrl;
    link.click();
  }, [imageDataUrl]);

  const handleShare = useCallback(async () => {
    if (!results) return;

    const systemLabel =
      strings.results[results.topSystem as keyof typeof strings.results] || results.topSystem;
    const text = t(strings.results.shareText, {
      correct: results.totalCorrect,
      total: results.totalQuestions,
      system: systemLabel,
    });

    if (navigator.share && canvasRef.current) {
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvasRef.current!.toBlob(resolve, "image/png")
        );
        const files = blob ? [new File([blob], "brain-driver.png", { type: "image/png" })] : [];

        await navigator.share({
          title: strings.results.shareTitle,
          text,
          ...(files.length > 0 && navigator.canShare?.({ files }) ? { files } : {}),
        });
        return;
      } catch {
        // User cancelled or API error — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard failures
    }
  }, [results, strings, t]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const topSystemLabel =
    strings.results[results.topSystem as keyof typeof strings.results] || results.topSystem;
  const topSystemColor = SYSTEM_COLORS[results.topSystem as BrainSystem] || "#3b82f6";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16 sm:px-6 animate-fadeIn">
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
          {strings.results.title}
        </h1>

        {/* Top driver badge */}
        <div
          className="mx-auto mt-4 mb-8 px-5 py-2.5 rounded-full text-center font-semibold text-sm inline-flex justify-center w-full"
          style={{ backgroundColor: topSystemColor + "18", color: topSystemColor }}
        >
          {t(strings.results.topDriver, { system: topSystemLabel })}
        </div>

        {/* Score circle */}
        <div className="flex justify-center mb-8">
          <div
            className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4"
            style={{ borderColor: topSystemColor, backgroundColor: topSystemColor + "10" }}
          >
            <span className="text-3xl font-bold text-gray-900">{results.totalCorrect}</span>
            <span className="text-xs text-gray-500">/ {results.totalQuestions}</span>
          </div>
        </div>

        {/* Breakdown */}
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          {strings.results.breakdownTitle}
        </h3>
        <div className="space-y-3 mb-8">
          {(["reptilian", "limbic", "neocortex"] as const).map((sys) => {
            const bd = results.breakdown[sys] || { correct: 0, total: 0 };
            const pct = bd.total > 0 ? (bd.correct / bd.total) * 100 : 0;

            return (
              <div key={sys}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: SYSTEM_COLORS[sys] }}
                    />
                    {strings.results[sys]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t(strings.results.correctLabel, { count: bd.correct })}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(pct, 4)}%`,
                      backgroundColor: SYSTEM_COLORS[sys],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Preview of share image */}
        {imageDataUrl && (
          <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Share preview"
              className="w-full"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={() => {
              playClick();
              handleShare();
            }}
            className="
              flex-1 px-6 py-3 rounded-full font-semibold text-sm
              bg-gray-900 text-white shadow-lg shadow-gray-900/20
              hover:bg-gray-800 active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            {strings.results.shareResults}
          </button>
          <button
            onClick={() => {
              playClick();
              handleDownloadImage();
            }}
            className="
              flex-1 px-6 py-3 rounded-full font-semibold text-sm
              border-2 border-gray-200 text-gray-700
              hover:bg-gray-50 active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            {strings.results.downloadImage}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pb-20">
          <a
            href={LINKS.goDeeper}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex-1 px-6 py-3 rounded-full font-semibold text-sm text-center
              border-2 border-blue-200 text-blue-700 bg-blue-50
              hover:bg-blue-100 active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            {strings.results.goDeeper}
          </a>
          <button
            onClick={() => {
              playClick();
              restartGame();
            }}
            className="
              flex-1 px-6 py-3 rounded-full font-semibold text-sm
              border-2 border-gray-200 text-gray-700
              hover:bg-gray-50 active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            {strings.results.tryAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
