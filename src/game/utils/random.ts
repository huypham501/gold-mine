export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function pickRandomDistinct<T>(list: T[], count: number): T[] {
  const copy = [...list];
  const result: T[] = [];
  while (copy.length > 0 && result.length < count) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}
