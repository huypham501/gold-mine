import type { Application, FederatedPointerEvent } from "pixi.js";

interface PointerPayload {
  x: number;
  y: number;
}

interface InputCallbacks {
  onPrimaryAction: (pointer?: PointerPayload) => void;
  onSecondaryAction: () => void;
  onPointerMove: (pointer: PointerPayload) => void;
}

export class InputSystem {
  private readonly pointerDownHandler = (event: FederatedPointerEvent): void => {
    this.callbacks.onPrimaryAction({
      x: event.global.x,
      y: event.global.y,
    });
  };

  private readonly pointerMoveHandler = (event: FederatedPointerEvent): void => {
    this.callbacks.onPointerMove({
      x: event.global.x,
      y: event.global.y,
    });
  };

  private readonly keyHandler = (event: KeyboardEvent): void => {
    if (event.code === "Space") {
      event.preventDefault();
      this.callbacks.onPrimaryAction();
      return;
    }
    if (event.code === "KeyB") {
      this.callbacks.onSecondaryAction();
    }
  };

  constructor(
    private readonly app: Application,
    private readonly callbacks: InputCallbacks,
  ) {}

  attach(): void {
    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on("pointerdown", this.pointerDownHandler);
    this.app.stage.on("pointermove", this.pointerMoveHandler);
    window.addEventListener("keydown", this.keyHandler, { passive: false });
  }

  detach(): void {
    this.app.stage.off("pointerdown", this.pointerDownHandler);
    this.app.stage.off("pointermove", this.pointerMoveHandler);
    window.removeEventListener("keydown", this.keyHandler);
  }
}
