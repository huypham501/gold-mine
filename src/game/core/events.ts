import type { CollectibleInstance } from "@/game/systems/SpawnSystem";

export interface GameEvents {
  HOOK_FIRED: { angle: number };
  TARGET_ATTACHED: { itemId: string; kind: string };
  ITEM_DELIVERED: { itemId: string; kind: string; value: number };
  ITEM_DESTROYED: { itemId: string; kind: string };
  TIME_UP: { level: number; gold: number; goal: number };
  LEVEL_CLEARED: { level: number; gold: number; goal: number };
  SHOP_ENTERED: { level: number; offers: string[] };
  RUN_ENDED: { success: boolean; totalGold: number; level: number };
  DEBUG_ITEM_PICKED: { item: CollectibleInstance };
}
