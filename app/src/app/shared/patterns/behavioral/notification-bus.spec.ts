import { describe, expect, it, vi } from 'vitest';
import { NotificationBus } from './notification-bus';

describe('NotificationBus', () => {
  it('should notify a subscribed listener when an event is published', () => {
    const bus = new NotificationBus();
    const listener = vi.fn();
    bus.subscribe(listener);

    bus.publish({ kind: 'error', message: 'request failed' });

    expect(listener).toHaveBeenCalledWith({ kind: 'error', message: 'request failed' });
  });

  it('should notify multiple independent subscribers', () => {
    const bus = new NotificationBus();
    const first = vi.fn();
    const second = vi.fn();
    bus.subscribe(first);
    bus.subscribe(second);

    bus.publish({ kind: 'info', message: 'loaded' });

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('should stop notifying a listener after it unsubscribes', () => {
    const bus = new NotificationBus();
    const listener = vi.fn();
    const unsubscribe = bus.subscribe(listener);

    unsubscribe();
    bus.publish({ kind: 'info', message: 'loaded' });

    expect(listener).not.toHaveBeenCalled();
  });
});
