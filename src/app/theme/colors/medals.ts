/** Rank colors remain readable on both neutral theme surfaces. */
export const medalColors = {
  light: { gold: '#86600f', silver: '#586678', bronze: '#90512d' },
  dark: { gold: '#e5bf73', silver: '#c6cedb', bronze: '#cc936d' },
} as const;

export const getRankColor = (
  rank?: number | string | null,
  fallback = 'text.secondary',
): string => {
  const place = typeof rank === 'string' ? Number(rank) : rank;
  if (place === 1) return 'var(--kep-gold)';
  if (place === 2) return 'var(--kep-silver)';
  if (place === 3) return 'var(--kep-bronze)';
  return fallback;
};
