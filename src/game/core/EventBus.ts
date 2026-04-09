import type { GameEventName } from "@/game/types/game";

type Listener<TPayload> = (payload: TPayload) => void;

export class EventBus<TEvents extends Record<GameEventName, unknown>> {
  private listeners = new Map<keyof TEvents, Set<Listener<unknown>>>();

  on<TKey extends keyof TEvents>(event: TKey, listener: Listener<TEvents[TKey]>): () => void {
    const collection = this.listeners.get(event) ?? new Set<Listener<unknown>>();
    collection.add(listener as Listener<unknown>);
    this.listeners.set(event, collection);
    return () => this.off(event, listener);
  }

  off<TKey extends keyof TEvents>(event: TKey, listener: Listener<TEvents[TKey]>): void {
    const collection = this.listeners.get(event);
    if (!collection) {
      return;
    }
    collection.delete(listener as Listener<unknown>);
  }

  emit<TKey extends keyof TEvents>(event: TKey, payload: TEvents[TKey]): void {
    const collection = this.listeners.get(event);
    if (!collection) {
      return;
    }
    for (const listener of collection) {
      listener(payload);
    }
  }
}
