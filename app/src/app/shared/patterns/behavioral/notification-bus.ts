import { Injectable } from '@angular/core';

export interface NotificationEvent {
  kind: 'error' | 'info';
  message: string;
}

export type NotificationListener = (event: NotificationEvent) => void;

/**
 * Observer: decouples the publisher of app-wide events (e.g. a failed
 * request) from the components that react to them (e.g. a toast banner).
 * Multiple observers can subscribe independently of who publishes.
 */
@Injectable({ providedIn: 'root' })
export class NotificationBus {
  private readonly listeners = new Set<NotificationListener>();

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  publish(event: NotificationEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
