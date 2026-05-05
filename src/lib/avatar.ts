const PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: "hsl(217 91% 60%)", fg: "#ffffff" },
  { bg: "hsl(160 70% 42%)", fg: "#ffffff" },
  { bg: "hsl(280 65% 60%)", fg: "#ffffff" },
  { bg: "hsl(20 90% 55%)", fg: "#ffffff" },
  { bg: "hsl(340 80% 60%)", fg: "#ffffff" },
  { bg: "hsl(190 85% 42%)", fg: "#ffffff" },
  { bg: "hsl(45 95% 50%)", fg: "#1a1a1a" },
  { bg: "hsl(260 60% 55%)", fg: "#ffffff" },
];

function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function avatarColor(name: string): { bg: string; fg: string } {
  const idx = fnv1a(name.toLowerCase().trim()) % PALETTE.length;
  return PALETTE[idx];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
