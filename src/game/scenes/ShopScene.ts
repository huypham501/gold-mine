import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "@/game/core/SceneManager";
import type { ActiveBuff } from "@/game/types/shop";
import { getShopOffers, buyShopItem } from "@/game/systems/ShopSystem";
import { createButton } from "@/game/scenes/helpers";

export class ShopScene implements Scene {
  readonly container = new Container();
  private gold: number;
  private buffs: ActiveBuff[] = [];
  private readonly goldText: Text;

  constructor(
    width: number,
    height: number,
    initialGold: number,
    onContinue: (remainingGold: number, buffs: ActiveBuff[]) => void,
  ) {
    this.gold = initialGold;

    // Ensure we respect min width 840
    const viewWidth = Math.max(840, width);

    const bg = new Graphics();
    bg.rect(0, 0, viewWidth, height).fill(0x2f3f00);
    this.container.addChild(bg);

    const title = new Text({
      text: "SHOP (1 lượt giữa màn)",
      style: { fontSize: 42, fontWeight: "900", fill: 0xe8f3b7 },
    });
    title.anchor.set(0.5, 0);
    title.position.set(viewWidth / 2, 25);
    this.container.addChild(title);

    this.goldText = new Text({
      text: `Gold: ${initialGold}`,
      style: { fontSize: 28, fontWeight: "700", fill: 0xffde7a },
    });
    this.goldText.position.set(40, 85);
    this.container.addChild(this.goldText);

    const offers = getShopOffers();
    const cardWidth = (viewWidth - 120) / 2;
    const cardHeight = 110;
    const paddingX = 40;
    const gapX = 40;
    const startY = 140;
    const gapY = 20;

    offers.forEach((offer, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = paddingX + col * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY);

      const card = new Graphics();
      const drawCard = (color: number) => {
        card.clear();
        card.roundRect(0, 0, cardWidth, cardHeight, 12).fill({ color, alpha: 0.9 });
      };
      drawCard(0x6f8b28);
      card.position.set(x, y);
      this.container.addChild(card);

      const name = new Text({
        text: `${offer.name} - ${offer.cost}G`,
        style: { fontSize: 26, fontWeight: "700", fill: 0xfff6d8 },
      });
      name.position.set(20, 12);
      card.addChild(name);

      const desc = new Text({
        text: offer.description,
        style: { fontSize: 18, fill: 0xf0f5cc, wordWrap: true, wordWrapWidth: cardWidth - 140 },
      });
      desc.position.set(20, 50);
      card.addChild(desc);

      const buyButton = createButton("Mua", cardWidth - 120, 30, 100, 50, () => {
        const result = buyShopItem(offer, this.gold);
        if (!result.success || !result.buff) {
          // Failure flash
          drawCard(0x8b2828);
          setTimeout(() => drawCard(0x6f8b28), 200);
          return;
        }

        // Success Effect
        this.gold = result.remainingGold;
        this.goldText.text = `Gold: ${this.gold}`;
        this.buffs.push(result.buff);

        // Flash card green
        drawCard(0xedffad);
        setTimeout(() => drawCard(0x6f8b28), 300);

        // Floating popup
        const feedback = new Text({
          text: "Đã mua!",
          style: { fontSize: 24, fontWeight: "bold", fill: 0xffffff, stroke: { color: 0x000000, width: 4 } },
        });
        feedback.position.set(x + cardWidth / 2, y + cardHeight / 2);
        feedback.anchor.set(0.5);
        this.container.addChild(feedback);

        let elapsed = 0;
        const ticker = (dt: { deltaTime: number }) => {
          elapsed += dt.deltaTime;
          feedback.y -= 1;
          feedback.alpha -= 0.02;
          if (elapsed > 60) {
            this.container.removeChild(feedback);
            feedback.destroy();
            // @ts-ignore - PixiJS ticker removed by app usually but here we manually manage or let it fly
          }
        };
        // Using a simpler approach for feedback animation without global ticker reference if possible
        // But since we are in a Scene, we don't have easy access to the ticker unless we store it.
        // For simplicity, let's use a small interval or just let it stay for a bit.
        setTimeout(() => {
          if (feedback.parent) {
            this.container.removeChild(feedback);
            feedback.destroy();
          }
        }, 800);
      });
      card.addChild(buyButton);
      // Adjust buy button relative to card
      buyButton.position.set(cardWidth - 110, 30);
    });

    const continueBtn = createButton("Vào Màn Kế", viewWidth / 2 - 130, height - 85, 260, 60, () => {
      onContinue(this.gold, [...this.buffs]);
    });
    this.container.addChild(continueBtn);
  }

  onEnter(): void {}

  onExit(): void {}

  update(): void {}
}
