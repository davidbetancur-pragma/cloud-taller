import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { Logger } from '../creational/logger';
import { withLogging } from './with-logging.decorator';

function createLoggerSpy(): Logger {
  return { log: vi.fn() };
}

describe('withLogging', () => {
  it('should log a success message when the wrapped observable emits', () => {
    const logger = createLoggerSpy();
    const fetchValue = () => of(42);
    const decorated = withLogging(fetchValue, logger, 'fetchValue');

    decorated().subscribe();

    expect(logger.log).toHaveBeenCalledWith('fetchValue succeeded', 42);
  });

  it('should log a failure message when the wrapped observable errors', () => {
    const logger = createLoggerSpy();
    const error = new Error('boom');
    const fetchValue = () => throwError(() => error);
    const decorated = withLogging(fetchValue, logger, 'fetchValue');

    decorated().subscribe({ error: () => {} });

    expect(logger.log).toHaveBeenCalledWith('fetchValue failed', error);
  });

  it('should forward arguments to the wrapped function unchanged', () => {
    const logger = createLoggerSpy();
    const fetchValue = vi.fn((id: number) => of(id));
    const decorated = withLogging(fetchValue, logger, 'fetchValue');

    decorated(9).subscribe();

    expect(fetchValue).toHaveBeenCalledWith(9);
  });
});
