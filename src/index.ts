/**
 * Log Ring - A simple logging utility
 */

export interface LogLevel {
  DEBUG: "debug";
  INFO: "info";
  WARN: "warn";
  ERROR: "error";
}

export const LOG_LEVELS: LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

export type LogLevelType = LogLevel[keyof LogLevel];

export interface LogEntry {
  level: LogLevelType;
  message: string;
  timestamp: Date;
}

export class LogRing {
  private logs: LogEntry[] = [];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = Math.max(0, maxSize); // Ensure non-negative
  }

  private addLog(level: LogLevelType, message: string): void {
    // Don't add logs if maxSize is 0
    if (this.maxSize === 0) {
      return;
    }

    this.logs.push({
      level,
      message,
      timestamp: new Date(),
    });

    // Keep only the most recent logs (ring buffer behavior)
    if (this.logs.length > this.maxSize) {
      this.logs.shift();
    }
  }

  debug(message: string): void {
    this.addLog(LOG_LEVELS.DEBUG, message);
    console.debug(`[DEBUG] ${message}`);
  }

  info(message: string): void {
    this.addLog(LOG_LEVELS.INFO, message);
    console.info(`[INFO] ${message}`);
  }

  warn(message: string): void {
    this.addLog(LOG_LEVELS.WARN, message);
    console.warn(`[WARN] ${message}`);
  }

  error(message: string): void {
    this.addLog(LOG_LEVELS.ERROR, message);
    console.error(`[ERROR] ${message}`);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevelType): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  clear(): void {
    this.logs = [];
  }

  getSize(): number {
    return this.logs.length;
  }

  getMaxSize(): number {
    return this.maxSize;
  }
}

// Default export
export default LogRing;

// Named export for convenience
export const createLogRing = (maxSize?: number): LogRing =>
  new LogRing(maxSize);
