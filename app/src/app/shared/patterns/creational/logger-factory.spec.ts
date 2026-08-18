import { describe, expect, it, vi } from 'vitest';
import { ConsoleLogger, NoopLogger } from './logger';
import { LoggerFactory } from './logger-factory';

describe('LoggerFactory', () => {
  it('should create a ConsoleLogger when request logging is enabled', () => {
    const logger = LoggerFactory.create(true);

    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('should create a NoopLogger when request logging is disabled', () => {
    const logger = LoggerFactory.create(false);

    expect(logger).toBeInstanceOf(NoopLogger);
  });

  it('should not log anything through a NoopLogger', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const logger = LoggerFactory.create(false);

    logger.log('should be silent');

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
