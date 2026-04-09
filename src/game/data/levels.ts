import type { LevelConfig } from "@/game/types/level";

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    timeLimit: 60,
    goal: 500,
    rockRatio: 0.3,
    movingTargets: 0,
    spawnTable: [
      { kind: "gold_small", count: 8 },
      { kind: "gold_large", count: 2 },
      { kind: "rock", count: 5 },
      { kind: "bag", count: 2 },
    ],
  },
  {
    level: 2,
    timeLimit: 60,
    goal: 650,
    rockRatio: 0.35,
    movingTargets: 0,
    spawnTable: [
      { kind: "gold_small", count: 7 },
      { kind: "gold_large", count: 3 },
      { kind: "rock", count: 7 },
      { kind: "bag", count: 2 },
    ],
  },
  {
    level: 3,
    timeLimit: 50,
    goal: 900,
    rockRatio: 0.45,
    movingTargets: 1,
    spawnTable: [
      { kind: "gold_small", count: 6 },
      { kind: "gold_large", count: 3 },
      { kind: "rock", count: 9 },
      { kind: "bag", count: 3 },
    ],
  },
  {
    level: 4,
    timeLimit: 50,
    goal: 1100,
    rockRatio: 0.48,
    movingTargets: 1,
    spawnTable: [
      { kind: "gold_small", count: 6 },
      { kind: "gold_large", count: 4 },
      { kind: "rock", count: 10 },
      { kind: "bag", count: 3 },
    ],
  },
  {
    level: 5,
    timeLimit: 45,
    goal: 1400,
    rockRatio: 0.55,
    movingTargets: 2,
    spawnTable: [
      { kind: "gold_small", count: 5 },
      { kind: "gold_large", count: 5 },
      { kind: "rock", count: 12 },
      { kind: "bag", count: 4 },
    ],
  },
];

export const TOTAL_DEFINED_LEVELS = LEVELS.length;

export function getLevelConfig(levelIndex: number): LevelConfig {
  if (levelIndex < LEVELS.length) {
    return LEVELS[levelIndex];
  }
  const base = LEVELS[LEVELS.length - 1];
  const delta = levelIndex - (LEVELS.length - 1);
  return {
    ...base,
    level: levelIndex + 1,
    goal: base.goal + delta * 220,
    timeLimit: Math.max(35, base.timeLimit - delta),
    movingTargets: Math.min(4, base.movingTargets + Math.floor(delta / 2)),
  };
}
