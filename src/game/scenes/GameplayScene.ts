import { Container, Graphics, Text, type Application } from "pixi.js";
import type { Scene } from "@/game/core/SceneManager";
import { EventBus } from "@/game/core/EventBus";
import type { GameEvents } from "@/game/core/events";
import { HookEntity } from "@/game/entities/Hook";
import { syncCollectibleSprite } from "@/game/entities/Collectible";
import {
  attachTarget,
  beginPull,
  createInitialHookRuntime,
  fireHook,
  resetHook,
  updateSwing,
  DEFAULT_HOOK_TUNING,
} from "@/game/systems/HookSystem";
import { findAttachedTarget } from "@/game/systems/CollisionSystem";
import { getBombStock, getBagLuckBonus, getPullSpeedMultiplier, resolveItemValue } from "@/game/systems/EconomySystem";
import { spawnCollectibles, type CollectibleInstance } from "@/game/systems/SpawnSystem";
import { tickTimer, isGoalReached } from "@/game/systems/LevelSystem";
import { InputSystem } from "@/game/systems/InputSystem";
import type { LevelConfig } from "@/game/types/level";
import type { ActiveBuff } from "@/game/types/shop";
import { HUD } from "@/game/ui/HUD";
import { Overlay } from "@/game/ui/Overlay";

interface GameplayCallbacks {
  onLevelCleared: (levelGold: number) => void;
  onLevelFailed: (levelGold: number) => void;
}

interface FloatingText {
  text: Text;
  ttl: number;
}

export class GameplayScene implements Scene {
  readonly container = new Container();
  private static readonly SWING_PREVIEW_LENGTH = 34;
  private readonly world = new Container();
  private readonly hud: HUD;
  private readonly overlay: Overlay;
  private readonly eventBus: EventBus<GameEvents>;
  private readonly hook = new HookEntity();
  private readonly hookState = createInitialHookRuntime();
  private readonly input: InputSystem;
  private readonly originX: number;
  private readonly originY = 120;
  private readonly width: number;
  private readonly height: number;
  private readonly level: LevelConfig;
  private readonly callbacks: GameplayCallbacks;
  private readonly bagLuckBonus: number;
  private readonly pullMultiplier: number;
  private collectibles: CollectibleInstance[] = [];
  private attached: CollectibleInstance | null = null;
  private floatTexts: FloatingText[] = [];
  private currentGold = 0;
  private timer = 0;
  private bombStock = 0;
  private ended = false;
  private pointerAimActive = false;

  constructor(
    app: Application,
    level: LevelConfig,
    buffs: ActiveBuff[],
    eventBus: EventBus<GameEvents>,
    callbacks: GameplayCallbacks,
  ) {
    this.width = app.screen.width;
    this.height = app.screen.height;
    this.level = level;
    this.eventBus = eventBus;
    this.callbacks = callbacks;
    this.bagLuckBonus = getBagLuckBonus(buffs);
    this.pullMultiplier = getPullSpeedMultiplier(buffs);
    this.bombStock = getBombStock(buffs);
    this.originX = this.width / 2;
    this.timer = level.timeLimit;

    const background = new Graphics();
    background.rect(0, 0, this.width, this.height).fill(0xc6882f);
    this.container.addChild(background);
    this.container.addChild(this.world);

    this.hud = new HUD(this.width, this.height);
    this.container.addChild(this.hud.container);
    this.overlay = new Overlay(this.width, this.height);
    this.container.addChild(this.overlay.container);

    this.hud.setGoal(level.goal);
    this.hud.setTime(this.timer);
    this.hud.setGold(this.currentGold);
    this.hud.setBuffLabel(this.getBuffLabel());

    this.drawPlayerAnchor();
    this.spawnLevelItems();
    this.renderHook();

    this.input = new InputSystem(app, {
      onPrimaryAction: (pointer) => this.onPrimaryInput(pointer),
      onSecondaryAction: () => this.onSecondaryInput(),
      onPointerMove: (pointer) => this.onPointerMove(pointer),
    });
  }

  onEnter(): void {
    this.input.attach();
  }

  onExit(): void {
    this.input.detach();
  }

  update(deltaSeconds: number): void {
    if (this.ended) {
      return;
    }
    this.updateFloatingTexts(deltaSeconds);
    this.timer = tickTimer(this.timer, deltaSeconds);
    this.hud.setTime(this.timer);
    this.updateMovers(deltaSeconds);
    this.updateHook(deltaSeconds);
    this.renderHook();

    if (isGoalReached(this.currentGold, this.level.goal)) {
      this.finishAsClear();
      return;
    }

    if (this.timer <= 0) {
      this.finishAsFail();
    }
  }

  private onPrimaryInput(pointer?: { x: number; y: number }): void {
    if (this.ended) {
      return;
    }
    if (pointer) {
      this.applyPointerAim(pointer.x, pointer.y);
    }
    if (fireHook(this.hookState)) {
      // Keep continuity from swing preview so hook does not snap back to center on fire.
      this.hookState.ropeLength = Math.max(this.hookState.ropeLength, GameplayScene.SWING_PREVIEW_LENGTH);
      this.eventBus.emit("HOOK_FIRED", { angle: this.hookState.angle });
    }
  }

  private onSecondaryInput(): void {
    if (this.bombStock <= 0 || this.attached === null || this.ended) {
      return;
    }
    this.bombStock -= 1;
    this.removeItem(this.attached);
    this.eventBus.emit("ITEM_DESTROYED", { itemId: this.attached.id, kind: this.attached.kind });
    this.addFloatingText("BOOM!", this.originX, this.originY + 70, 0xff6b6b);
    this.attached = null;
    beginPull(this.hookState);
    this.hud.setBuffLabel(this.getBuffLabel());
  }

  private spawnLevelItems(): void {
    this.collectibles = spawnCollectibles(this.level, this.width, this.height);
    for (const item of this.collectibles) {
      this.world.addChild(item.sprite);
    }
  }

  private updateMovers(deltaSeconds: number): void {
    for (const item of this.collectibles) {
      if (item.moveSpeed <= 0 || this.attached?.id === item.id) {
        continue;
      }
      item.x += item.moveDir * item.moveSpeed * deltaSeconds;
      if (item.x < item.radius + 20) {
        item.x = item.radius + 20;
        item.moveDir = 1;
      } else if (item.x > this.width - item.radius - 20) {
        item.x = this.width - item.radius - 20;
        item.moveDir = -1;
      }
      syncCollectibleSprite(item);
    }
  }

  private updateHook(deltaSeconds: number): void {
    if (this.hookState.state === "swinging") {
      if (!this.pointerAimActive) {
        updateSwing(this.hookState, deltaSeconds, DEFAULT_HOOK_TUNING);
      }
      return;
    }

    if (this.hookState.state === "fired" || this.hookState.state === "attached") {
      this.hookState.ropeLength = Math.min(
        DEFAULT_HOOK_TUNING.maxReach,
        this.hookState.ropeLength + DEFAULT_HOOK_TUNING.fireSpeed * deltaSeconds,
      );
      const hookPos = this.currentHookPosition();
      const target = findAttachedTarget(hookPos.x, hookPos.y, this.collectibles);
      if (target) {
        this.attached = target;
        attachTarget(this.hookState);
        beginPull(this.hookState);
        this.eventBus.emit("TARGET_ATTACHED", { itemId: target.id, kind: target.kind });
        this.hook.drawClaw(0xff9f43);
      } else if (this.hookState.ropeLength >= DEFAULT_HOOK_TUNING.maxReach) {
        beginPull(this.hookState);
      }
      return;
    }

    if (this.hookState.state === "pulling") {
      const speed =
        this.attached === null
          ? DEFAULT_HOOK_TUNING.emptyPullSpeed
          : (DEFAULT_HOOK_TUNING.basePullSpeed * this.pullMultiplier) / Math.max(this.attached.weight, 1);
      this.hookState.ropeLength = Math.max(0, this.hookState.ropeLength - speed * deltaSeconds);
      if (this.attached) {
        const hookPos = this.currentHookPosition();
        this.attached.x = hookPos.x;
        this.attached.y = hookPos.y;
        syncCollectibleSprite(this.attached);
      }
      if (this.hookState.ropeLength <= 0) {
        this.deliverItemIfAny();
        resetHook(this.hookState);
        this.hook.drawClaw(0x3b2b0a);
      }
    }
  }

  private deliverItemIfAny(): void {
    if (!this.attached) {
      return;
    }
    const item = this.attached;
    const value = item.kind === "bag" ? resolveItemValue("bag", this.bagLuckBonus) : item.value;
    this.currentGold += value;
    this.hud.setGold(this.currentGold);
    this.addFloatingText(`+${value}`, this.originX, this.originY + 100, 0xfff07d);
    this.eventBus.emit("ITEM_DELIVERED", { itemId: item.id, kind: item.kind, value });
    this.removeItem(item);
    this.attached = null;
  }

  private removeItem(item: CollectibleInstance): void {
    this.world.removeChild(item.sprite);
    item.sprite.destroy();
    this.collectibles = this.collectibles.filter((x) => x.id !== item.id);
  }

  private currentHookPosition(length = this.hookState.ropeLength): { x: number; y: number } {
    return {
      x: this.originX + Math.cos(this.hookState.angle) * length,
      y: this.originY + Math.sin(this.hookState.angle) * length,
    };
  }

  private renderHook(): void {
    const renderedLength =
      this.hookState.state === "swinging" ? GameplayScene.SWING_PREVIEW_LENGTH : this.hookState.ropeLength;
    const end = this.currentHookPosition(renderedLength);
    this.hook.setPose(this.originX, this.originY, end.x, end.y);
  }

  private finishAsClear(): void {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.overlay.show("LEVEL CLEARED");
    this.eventBus.emit("LEVEL_CLEARED", {
      level: this.level.level,
      gold: this.currentGold,
      goal: this.level.goal,
    });
    window.setTimeout(() => this.callbacks.onLevelCleared(this.currentGold), 450);
  }

  private finishAsFail(): void {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.overlay.show("TIME UP");
    this.eventBus.emit("TIME_UP", {
      level: this.level.level,
      gold: this.currentGold,
      goal: this.level.goal,
    });
    window.setTimeout(() => this.callbacks.onLevelFailed(this.currentGold), 450);
  }

  private drawPlayerAnchor(): void {
    const base = new Graphics();
    base.rect(0, 0, 100, 40).fill(0x5a3900);
    base.position.set(this.originX - 50, this.originY - 35);
    this.world.addChild(base);
    this.world.addChild(this.hook.container);
  }

  private addFloatingText(text: string, x: number, y: number, color: number): void {
    const label = new Text({ text, style: { fill: color, fontSize: 28, fontWeight: "800" } });
    label.anchor.set(0.5);
    label.position.set(x, y);
    this.world.addChild(label);
    this.floatTexts.push({ text: label, ttl: 0.7 });
  }

  private updateFloatingTexts(deltaSeconds: number): void {
    this.floatTexts = this.floatTexts.filter((entry) => {
      entry.ttl -= deltaSeconds;
      entry.text.y -= 40 * deltaSeconds;
      entry.text.alpha = Math.max(0, entry.ttl / 0.7);
      if (entry.ttl <= 0) {
        this.world.removeChild(entry.text);
        entry.text.destroy();
        return false;
      }
      return true;
    });
  }

  private getBuffLabel(): string {
    const parts: string[] = [];
    if (this.pullMultiplier > 1) {
      parts.push(`Pull x${this.pullMultiplier.toFixed(2)}`);
    }
    if (this.bagLuckBonus > 0) {
      parts.push(`Luck +${Math.round(this.bagLuckBonus * 100)}%`);
    }
    if (this.bombStock > 0) {
      parts.push(`Bomb ${this.bombStock}`);
    }
    return parts.length > 0 ? parts.join(" | ") : "none";
  }

  private onPointerMove(pointer: { x: number; y: number }): void {
    if (this.ended || this.hookState.state !== "swinging") {
      return;
    }
    this.applyPointerAim(pointer.x, pointer.y);
  }

  private applyPointerAim(x: number, y: number): void {
    const angle = Math.atan2(y - this.originY, x - this.originX);
    const clamped = Math.max(DEFAULT_HOOK_TUNING.minAngle, Math.min(DEFAULT_HOOK_TUNING.maxAngle, angle));
    this.hookState.angle = clamped;
    this.pointerAimActive = true;
  }
}
