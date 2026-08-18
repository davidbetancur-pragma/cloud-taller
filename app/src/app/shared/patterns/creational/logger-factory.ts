import { ConsoleLogger, Logger, NoopLogger } from './logger';

/**
 * Factory Method: decides which Logger implementation to instantiate
 * based on the running environment, without callers knowing the concrete class.
 */
export class LoggerFactory {
  static create(enableRequestLogging: boolean): Logger {
    return enableRequestLogging ? new ConsoleLogger() : new NoopLogger();
  }
}
