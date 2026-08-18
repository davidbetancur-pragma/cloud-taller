import { Observable, tap } from 'rxjs';
import { Logger } from '../creational/logger';

/**
 * Decorator: wraps an Observable-returning function to add logging around
 * it, without changing the wrapped function's implementation or signature.
 */
export function withLogging<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Observable<TResult>,
  logger: Logger,
  label: string,
): (...args: TArgs) => Observable<TResult> {
  return (...args: TArgs) =>
    fn(...args).pipe(
      tap({
        next: (result) => logger.log(`${label} succeeded`, result),
        error: (error) => logger.log(`${label} failed`, error),
      }),
    );
}
