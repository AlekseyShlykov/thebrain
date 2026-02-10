/** App-wide constants and placeholder links */

export const SITE_TITLE = "Brain Driver";

/** Audio file paths (public URL). Replace music.mp3 with your background track. */
export const AUDIO = {
  music: "/audio/music.mp3",
  /** Click SFX (public/audio/click.mp3). */
  click: "/audio/click.mp3",
} as const;

export const LINKS = {
  xProfile: "https://x.com/buildtoundrstnd",
  website: "https://buildtounderstand.dev/",
  email: "mailto:buildtounderstand@gmail.com",
  goDeeper: "https://en.wikipedia.org/wiki/Triune_brain",
} as const;

export const SUPPORTED_LANGUAGES = ["en", "fr", "ru"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const BRAIN_SYSTEMS = ["reptilian", "limbic", "neocortex"] as const;
export type BrainSystem = (typeof BRAIN_SYSTEMS)[number];

export const SYSTEM_COLORS: Record<BrainSystem, string> = {
  reptilian: "#ef4444",  // red-500
  limbic: "#f59e0b",     // amber-500
  neocortex: "#3b82f6",  // blue-500
};

export const SYSTEM_BG_COLORS: Record<BrainSystem, string> = {
  reptilian: "#fef2f2",  // red-50
  limbic: "#fffbeb",     // amber-50
  neocortex: "#eff6ff",  // blue-50
};
