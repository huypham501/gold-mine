import type { HookState } from "@/game/types/game";

export interface HookRuntime {
  state: HookState;
  angle: number;
  ropeLength: number;
  swingDirection: 1 | -1;
}

export interface HookTuning {
  minAngle: number;
  maxAngle: number;
  swingSpeed: number;
  fireSpeed: number;
  emptyPullSpeed: number;
  basePullSpeed: number;
  maxReach: number;
}

export const DEFAULT_HOOK_TUNING: HookTuning = {
  minAngle: Math.PI * 0.08,
  maxAngle: Math.PI * 0.92,
  swingSpeed: 2.3,
  fireSpeed: 780,
  emptyPullSpeed: 760,
  basePullSpeed: 420,
  maxReach: 520,
};

export function createInitialHookRuntime(): HookRuntime {
  return {
    state: "swinging",
    angle: Math.PI / 2,
    ropeLength: 0,
    swingDirection: 1,
  };
}

export function updateSwing(hook: HookRuntime, dt: number, tuning: HookTuning): void {
  if (hook.state !== "swinging") {
    return;
  }
  hook.angle += hook.swingDirection * tuning.swingSpeed * dt;
  if (hook.angle > tuning.maxAngle) {
    hook.angle = tuning.maxAngle;
    hook.swingDirection = -1;
  } else if (hook.angle < tuning.minAngle) {
    hook.angle = tuning.minAngle;
    hook.swingDirection = 1;
  }
}

export function fireHook(hook: HookRuntime): boolean {
  if (hook.state !== "swinging") {
    return false;
  }
  hook.state = "fired";
  return true;
}

export function attachTarget(hook: HookRuntime): void {
  hook.state = "attached";
}

export function beginPull(hook: HookRuntime): void {
  hook.state = "pulling";
}

export function resetHook(hook: HookRuntime): void {
  hook.state = "swinging";
  hook.ropeLength = 0;
}
