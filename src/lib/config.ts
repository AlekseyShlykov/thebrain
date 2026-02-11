/** App-wide constants and placeholder links */

export const SITE_TITLE = "Brain Driver";

/** Base path for GitHub Pages (set via NEXT_PUBLIC_BASE_PATH env var at build time). */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Audio file paths (public URL). Replace music.mp3 with your background track. */
export const AUDIO = {
  music: `${BASE_PATH}/audio/music.mp3`,
  /** Click SFX (public/audio/click.mp3). */
  click: `${BASE_PATH}/audio/click.mp3`,
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
  reptilian: "#F71212",  // vibrant red
  limbic: "#E1E438",     // bright yellow
  neocortex: "#03E7DF",  // bright turquoise
};

export const SYSTEM_BG_COLORS: Record<BrainSystem, string> = {
  reptilian: "#fef2f2",  // light red
  limbic: "#fefce8",     // light yellow
  neocortex: "#ecfeff",  // light cyan
};
