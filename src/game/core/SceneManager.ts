import { Container } from "pixi.js";

export interface Scene {
  container: Container;
  onEnter(): void;
  onExit(): void;
  update(deltaSeconds: number): void;
}

export class SceneManager {
  private currentScene: Scene | null = null;

  constructor(private readonly stage: Container) {}

  setScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.onExit();
      this.stage.removeChild(this.currentScene.container);
    }
    this.currentScene = scene;
    this.stage.addChild(scene.container);
    scene.onEnter();
  }

  update(deltaSeconds: number): void {
    this.currentScene?.update(deltaSeconds);
  }
}
