export interface Logger {
  log(message: string, data?: unknown): void;
}

export class ConsoleLogger implements Logger {
  log(message: string, data?: unknown): void {
    console.log(`[app] ${message}`, data ?? '');
  }
}

export class NoopLogger implements Logger {
  log(): void {}
}
