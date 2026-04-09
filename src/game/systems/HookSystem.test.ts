import { describe, expect, it } from "vitest";
import {
  createInitialHookRuntime,
  fireHook,
  attachTarget,
  beginPull,
  resetHook,
  updateSwing,
  DEFAULT_HOOK_TUNING,
} from "@/game/systems/HookSystem";

describe("HookSystem", () => {
  it("transitions through fire -> attach -> pull -> swing", () => {
    const hook = createInitialHookRuntime();
    expect(hook.state).toBe("swinging");
    expect(fireHook(hook)).toBe(true);
    expect(hook.state).toBe("fired");
    attachTarget(hook);
    expect(hook.state).toBe("attached");
    beginPull(hook);
    expect(hook.state).toBe("pulling");
    hook.ropeLength = 100;
    resetHook(hook);
    expect(hook.state).toBe("swinging");
    expect(hook.ropeLength).toBe(0);
  });

  it("keeps swing angle inside configured bounds", () => {
    const hook = createInitialHookRuntime();
    for (let i = 0; i < 300; i += 1) {
      updateSwing(hook, 0.016, DEFAULT_HOOK_TUNING);
    }
    expect(hook.angle).toBeLessThanOrEqual(DEFAULT_HOOK_TUNING.maxAngle);
    expect(hook.angle).toBeGreaterThanOrEqual(DEFAULT_HOOK_TUNING.minAngle);
  });
});
