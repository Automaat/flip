export type CoverageBand = {
  band: string;
  total: number;
  covered: number;
  percent: number;
};

export type Coverage = {
  totalKnown: number;
  bands: CoverageBand[];
};

/**
 * Bucket vocabulary ranks (1..N) into bands of size `size`.
 * `knownRanks` is the set of frequency ranks for which the user has a card.
 */
export function bandCoverage(
  knownRanks: number[],
  totalsByMax: number,
  size = 1000,
): Coverage {
  const known = new Set(knownRanks);
  const bands: CoverageBand[] = [];
  let totalKnown = 0;
  for (let start = 1; start <= totalsByMax; start += size) {
    const end = Math.min(start + size - 1, totalsByMax);
    let covered = 0;
    for (let r = start; r <= end; r++) {
      if (known.has(r)) covered++;
    }
    const total = end - start + 1;
    bands.push({
      band: `${start}–${end}`,
      total,
      covered,
      percent: total === 0 ? 0 : Math.round((covered / total) * 100),
    });
    totalKnown += covered;
  }
  return { totalKnown, bands };
}
