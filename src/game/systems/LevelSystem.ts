export function tickTimer(current: number, deltaSeconds: number): number {
  return Math.max(0, current - deltaSeconds);
}

export function isGoalReached(gold: number, goal: number): boolean {
  return gold >= goal;
}
