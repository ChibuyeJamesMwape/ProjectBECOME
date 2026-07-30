// Colors and type scale lifted directly from ProjectBECOME.dc.html (the
// projectBECOME brand book: noir / gold / cream, Playfair Display + Space
// Mono + Poppins).
export const color = {
  bg: "#0F0E0C",
  bgPanel: "#17130C",
  bgPanelAlt: "#1C180D",
  cream: "#F5F1E8",
  gold: "#C3862B",
  goldHover: "#D2953A",
  goldBright: "#E8B563",
  dim: "#B9B2A4",
  dimmer: "#8F887C",
  faint: "#6E675A",
  track: "#2A241A",
  border: "rgba(245,241,232,0.1)",
  borderFaint: "rgba(245,241,232,0.07)",
  goldBorder: "rgba(195,134,43,0.3)",
};

export const font = {
  serif: "'Playfair Display', serif",
  sans: "Poppins, sans-serif",
  mono: "'Space Mono', monospace",
};

export const STAGE_NAMES = ["Exposure", "Internalization", "Reinforcement", "Solidification", "Replication"] as const;
