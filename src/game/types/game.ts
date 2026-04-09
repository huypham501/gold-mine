import type { ActiveBuff } from "./shop";

export type HookState = "swinging" | "fired" | "attached" | "pulling";
export type ScreenState = "home" | "gameplay" | "shop" | "result";
export type GameEventName =
  | "HOOK_FIRED"
  | "TARGET_ATTACHED"
  | "ITEM_DELIVERED"
  | "ITEM_DESTROYED"
  | "TIME_UP"
  | "LEVEL_CLEARED"
  | "SHOP_ENTERED"
  | "RUN_ENDED";

export interface RunStats {
  levelIndex: number;
  totalGold: number;
  currentLevelGold: number;
  currentGoal: number;
  timeLeft: number;
  activeBuffs: ActiveBuff[];
  pendingBuffs: ActiveBuff[];
  screen: ScreenState;
  resultMessage: string;
  success: boolean;
}
