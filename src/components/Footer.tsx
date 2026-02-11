"use client";

import { useLocale } from "@/context/LocaleContext";
import { useGame } from "@/context/GameContext";
import { LINKS } from "@/lib/config";

function ToggleButton({
  label,
  isOn,
  onToggle,
  onPlayClick,
  ariaLabel,
}: {
  label: string;
  isOn: boolean;
  onToggle: () => void;
  onPlayClick: () => void;
  ariaLabel: string;
}) {
  const { strings } = useLocale();

  return (
    <button
      onClick={() => {
        onPlayClick();
        onToggle();
      }}
      aria-label={ariaLabel}
      aria-pressed={isOn}
      className={`
        flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0 min-w-0
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${isOn
          ? "bg-slate-600 text-white shadow-inner"
          : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
        }
      `}
    >
      <span className="hidden sm:inline truncate">{label}</span>
      <span
        className={`flex-shrink-0 w-8 h-4 rounded-full relative transition-colors duration-200 ${
          isOn ? "bg-emerald-500/90" : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
            isOn ? "translate-x-4 left-0.5" : "translate-x-0 left-0.5"
          }`}
        />
      </span>
      <span className="sr-only">{isOn ? strings.footer.on : strings.footer.off}</span>
    </button>
  );
}

export default function Footer() {
  const { strings } = useLocale();
  const { audio, playClick, toggleSfx, toggleMusic, toggleVoice } = useGame();

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 overflow-x-hidden"
      role="contentinfo"
    >
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 min-w-0 w-full relative">
        {/* Center: credits — subtle, 50% opacity */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-slate-400 opacity-50 pointer-events-none hidden sm:inline"
          aria-hidden
        >
          {strings.footer.createdBy}
        </span>
        {/* Left: Audio toggles — dark segmented pill */}
        <div
          className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700/80 shadow-inner flex-shrink-0 min-w-0"
          role="group"
          aria-label="Audio controls"
        >
          <ToggleButton
            label={strings.footer.sfx}
            isOn={audio.sfxOn}
            onToggle={toggleSfx}
            onPlayClick={playClick}
            ariaLabel={`${strings.footer.sfx} ${audio.sfxOn ? strings.footer.on : strings.footer.off}`}
          />
          <ToggleButton
            label={strings.footer.music}
            isOn={audio.musicOn}
            onToggle={toggleMusic}
            onPlayClick={playClick}
            ariaLabel={`${strings.footer.music} ${audio.musicOn ? strings.footer.on : strings.footer.off}`}
          />
          <ToggleButton
            label={strings.footer.voice}
            isOn={audio.voiceOn}
            onToggle={toggleVoice}
            onPlayClick={playClick}
            ariaLabel={`${strings.footer.voice} ${audio.voiceOn ? strings.footer.on : strings.footer.off}`}
          />
        </div>

        {/* Right: Links — dark theme */}
        <div className="flex items-center gap-3 text-xs flex-shrink-0 min-w-0 text-slate-400">
          <a
            href={LINKS.xProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
          >
            {strings.footer.myX}
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={LINKS.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
          >
            {strings.footer.myWebsite}
          </a>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <a
            href={LINKS.patreon}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
          >
            {strings.footer.supportMe}
          </a>
        </div>
      </div>
    </footer>
  );
}
