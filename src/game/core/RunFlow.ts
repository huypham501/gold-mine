import { getLevelConfig } from "@/game/data/levels";
import type { LevelConfig } from "@/game/types/level";
import type { ActiveBuff } from "@/game/types/shop";
import type { RunStats } from "@/game/types/game";

export class RunFlow {
  private stats: RunStats = {
    levelIndex: 0,
    totalGold: 0,
    currentLevelGold: 0,
    currentGoal: getLevelConfig(0).goal,
    timeLeft: getLevelConfig(0).timeLimit,
    activeBuffs: [],
    pendingBuffs: [],
    screen: "home",
    resultMessage: "",
    success: false,
  };

  resetRun(): RunStats {
    this.stats = {
      ...this.stats,
      levelIndex: 0,
      totalGold: 0,
      currentLevelGold: 0,
      currentGoal: getLevelConfig(0).goal,
      timeLeft: getLevelConfig(0).timeLimit,
      activeBuffs: [],
      pendingBuffs: [],
      screen: "gameplay",
      resultMessage: "",
      success: false,
    };
    return this.snapshot();
  }

  getLevelConfig(): LevelConfig {
    return getLevelConfig(this.stats.levelIndex);
  }

  getStats(): RunStats {
    return this.snapshot();
  }

  setLevelGold(levelGold: number): void {
    this.stats.currentLevelGold = levelGold;
  }

  enterShopAfterClear(levelGold: number): RunStats {
    this.stats.totalGold += levelGold;
    this.stats.currentLevelGold = levelGold;
    this.stats.screen = "shop";
    return this.snapshot();
  }

  applyPurchasedBuffs(buffList: ActiveBuff[]): RunStats {
    this.stats.pendingBuffs = [...this.stats.pendingBuffs, ...buffList];
    return this.snapshot();
  }

  checkoutShop(remainingGold: number, buffList: ActiveBuff[]): RunStats {
    this.stats.totalGold = remainingGold;
    this.stats.pendingBuffs = [...this.stats.pendingBuffs, ...buffList];
    return this.snapshot();
  }

  startNextLevel(): RunStats {
    this.stats.levelIndex += 1;
    this.stats.activeBuffs = [...this.stats.pendingBuffs];
    this.stats.pendingBuffs = [];
    const nextLevel = getLevelConfig(this.stats.levelIndex);
    this.stats.currentGoal = nextLevel.goal;
    this.stats.timeLeft = nextLevel.timeLimit;
    this.stats.currentLevelGold = 0;
    this.stats.screen = "gameplay";
    return this.snapshot();
  }

  failRun(levelGold: number): RunStats {
    this.stats.totalGold += levelGold;
    this.stats.currentLevelGold = levelGold;
    this.stats.screen = "result";
    this.stats.success = false;
    this.stats.resultMessage = "Hết giờ trước khi đạt mục tiêu.";
    return this.snapshot();
  }

  completeRun(levelGold: number): RunStats {
    this.stats.totalGold += levelGold;
    this.stats.currentLevelGold = levelGold;
    this.stats.screen = "result";
    this.stats.success = true;
    this.stats.resultMessage = "Bạn đã vượt qua tất cả màn MVP.";
    return this.snapshot();
  }

  goHome(): RunStats {
    this.stats.screen = "home";
    return this.snapshot();
  }

  private snapshot(): RunStats {
    return {
      ...this.stats,
      activeBuffs: [...this.stats.activeBuffs],
      pendingBuffs: [...this.stats.pendingBuffs],
    };
  }
}
