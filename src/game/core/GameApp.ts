import { Application, Assets } from "pixi.js";
import { SceneManager } from "@/game/core/SceneManager";
import { EventBus } from "@/game/core/EventBus";
import type { GameEvents } from "@/game/core/events";
import { RunFlow } from "@/game/core/RunFlow";
import { TOTAL_DEFINED_LEVELS } from "@/game/data/levels";
import { PRELOAD_TEXTURES } from "@/game/data/sprites";
import { HomeScene } from "@/game/scenes/HomeScene";
import { GameplayScene } from "@/game/scenes/GameplayScene";
import { ShopScene } from "@/game/scenes/ShopScene";
import { ResultScene } from "@/game/scenes/ResultScene";

export class GameApp {
  private app: Application | null = null;
  private sceneManager: SceneManager | null = null;
  private readonly eventBus = new EventBus<GameEvents>();
  private readonly runFlow = new RunFlow();
  private resizeObserver: ResizeObserver | null = null;
  private raf = 0;

  async mount(host: HTMLDivElement): Promise<void> {
    this.app = new Application();
    await this.app.init({
      resizeTo: host,
      antialias: true,
      backgroundAlpha: 0,
    });

    host.appendChild(this.app.canvas);
    this.sceneManager = new SceneManager(this.app.stage);
    await Assets.load(PRELOAD_TEXTURES);
    this.bindTicker();
    this.bindResize(host);
    this.toHome();
  }

  destroy(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.app?.destroy(true, { children: true });
    this.app = null;
    this.sceneManager = null;
  }

  private bindTicker(): void {
    let last = performance.now();
    const tick = (): void => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.sceneManager?.update(dt);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private bindResize(host: HTMLDivElement): void {
    this.resizeObserver = new ResizeObserver(() => {
      const app = this.app;
      if (!app) {
        return;
      }
      const ratio = 16 / 10;
      const width = host.clientWidth;
      const height = Math.min(window.innerHeight - 24, width / ratio);
      host.style.height = `${Math.max(420, height)}px`;
      app.renderer.resize(width, Math.max(420, height));
    });
    this.resizeObserver.observe(host);
  }

  private toHome(): void {
    if (!this.app || !this.sceneManager) {
      return;
    }
    this.runFlow.goHome();
    const home = new HomeScene(this.app.screen.width, this.app.screen.height, () => {
      this.runFlow.resetRun();
      this.toGameplay();
    });
    this.sceneManager.setScene(home);
  }

  private toGameplay(): void {
    if (!this.app || !this.sceneManager) {
      return;
    }
    const stats = this.runFlow.getStats();
    const levelConfig = this.runFlow.getLevelConfig();
    const scene = new GameplayScene(this.app, levelConfig, stats.activeBuffs, this.eventBus, {
      onLevelCleared: (levelGold) => {
        if (stats.levelIndex + 1 >= TOTAL_DEFINED_LEVELS) {
          this.runFlow.completeRun(levelGold);
          this.toResult();
          return;
        }
        this.runFlow.enterShopAfterClear(levelGold);
        this.toShop();
      },
      onLevelFailed: (levelGold) => {
        this.runFlow.failRun(levelGold);
        this.toResult();
      },
    });
    this.sceneManager.setScene(scene);
  }

  private toShop(): void {
    if (!this.app || !this.sceneManager) {
      return;
    }
    const stats = this.runFlow.getStats();
    this.eventBus.emit("SHOP_ENTERED", { level: stats.levelIndex + 1, offers: [] });
    const scene = new ShopScene(this.app.screen.width, this.app.screen.height, stats.totalGold, (remaining, buffs) => {
      this.runFlow.checkoutShop(remaining, buffs);
      this.runFlow.startNextLevel();
      this.toGameplay();
    });
    this.sceneManager.setScene(scene);
  }

  private toResult(): void {
    if (!this.app || !this.sceneManager) {
      return;
    }
    const stats = this.runFlow.getStats();
    this.eventBus.emit("RUN_ENDED", {
      success: stats.success,
      totalGold: stats.totalGold,
      level: stats.levelIndex + 1,
    });
    const scene = new ResultScene(
      this.app.screen.width,
      this.app.screen.height,
      stats.resultMessage,
      stats.totalGold,
      () => this.toHome(),
    );
    this.sceneManager.setScene(scene);
  }
}
