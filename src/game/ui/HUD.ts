import { Container, Graphics, Text } from "pixi.js";

export class HUD {
  readonly container = new Container();
  private readonly goldText = new Text({ text: "Gold: 0", style: { fill: 0x1f1300, fontSize: 22, fontWeight: "700" } });
  private readonly goalText = new Text({ text: "Goal: 0", style: { fill: 0x1f1300, fontSize: 22, fontWeight: "700" } });
  private readonly timerText = new Text({ text: "Time: 0", style: { fill: 0x1f1300, fontSize: 22, fontWeight: "700" } });
  private readonly buffText = new Text({ text: "Buff: none", style: { fill: 0x2f2200, fontSize: 16, fontWeight: "600" } });

  constructor(width: number, height: number) {
    const bg = new Graphics();
    bg.rect(0, 0, width, 80).fill({ color: 0xffecb3, alpha: 0.9 });
    this.container.addChild(bg);

    this.goldText.position.set(20, 18);
    this.goalText.position.set(width / 2 - 80, 18);
    this.timerText.position.set(width - 180, 18);
    this.buffText.position.set(20, height - 30);

    this.container.addChild(this.goldText, this.goalText, this.timerText, this.buffText);
  }

  setGold(value: number): void {
    this.goldText.text = `Gold: ${value}`;
  }

  setGoal(value: number): void {
    this.goalText.text = `Goal: ${value}`;
  }

  setTime(value: number): void {
    this.timerText.text = `Time: ${Math.max(0, Math.ceil(value))}`;
  }

  setBuffLabel(label: string): void {
    this.buffText.text = `Buff: ${label}`;
  }
}
