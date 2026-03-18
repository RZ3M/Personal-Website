export interface ThemeColors {
  red: string;     // RGB triplet e.g. "230,57,70"
  blue: string;
  orange: string;
  green: string;
  white: string;   // contrast highlight color — white in dark, near-black in light
}

export const DARK_COLORS: ThemeColors = {
  red: "230,57,70",
  blue: "0,180,216",
  orange: "255,107,53",
  green: "6,214,160",
  white: "255,255,255",
};

export const LIGHT_COLORS: ThemeColors = {
  red: "200,36,59",
  blue: "0,144,184",
  orange: "224,80,16",
  green: "0,175,132",
  white: "20,20,35",
};

export function getThemeColors(theme: "dark" | "light"): ThemeColors {
  return theme === "light" ? LIGHT_COLORS : DARK_COLORS;
}
