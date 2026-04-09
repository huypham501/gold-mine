import type { SpawnEntry } from "./item";

export interface LevelConfig {
  level: number;
  timeLimit: number;
  goal: number;
  rockRatio: number;
  movingTargets: number;
  spawnTable: SpawnEntry[];
}
