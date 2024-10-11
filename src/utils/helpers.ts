export function parseDifficulty(diffString: string): number {
    const match = /^(\d+(\.\d+)?)\s*([EPMGTK]?)$/i.exec(diffString);
    if (!match) return 0;

    const [, value, , suffix] = match;
    const numericValue = parseFloat(value);

    const multipliers: Record<string, number> = {
      E: 1e18,
      P: 1e15,
      T: 1e12,
      G: 1e9,
      M: 1e6,
      K: 1e3,
    };

    return numericValue * (multipliers[suffix.toUpperCase()] || 1);
  }
