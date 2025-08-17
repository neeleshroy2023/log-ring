import { describe, it, expect, beforeEach, vi } from "vitest";
import LogRing, { LOG_LEVELS, createLogRing, type LogLevelType } from "./index";

describe("LogRing", () => {
  let logRing: LogRing;

  beforeEach(() => {
    logRing = new LogRing(3); // Small size for testing
    // Mock console methods
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("constructor", () => {
    it("should create a LogRing with default maxSize", () => {
      const defaultLogRing = new LogRing();
      expect(defaultLogRing.getMaxSize()).toBe(100);
    });

    it("should create a LogRing with custom maxSize", () => {
      expect(logRing.getMaxSize()).toBe(3);
    });
  });

  describe("logging methods", () => {
    it("should add debug log", () => {
      logRing.debug("Debug message");

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LOG_LEVELS.DEBUG);
      expect(logs[0].message).toBe("Debug message");
      expect(console.debug).toHaveBeenCalledWith("[DEBUG] Debug message");
    });

    it("should add info log", () => {
      logRing.info("Info message");

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LOG_LEVELS.INFO);
      expect(logs[0].message).toBe("Info message");
      expect(console.info).toHaveBeenCalledWith("[INFO] Info message");
    });

    it("should add warn log", () => {
      logRing.warn("Warning message");

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LOG_LEVELS.WARN);
      expect(logs[0].message).toBe("Warning message");
      expect(console.warn).toHaveBeenCalledWith("[WARN] Warning message");
    });

    it("should add error log", () => {
      logRing.error("Error message");

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LOG_LEVELS.ERROR);
      expect(logs[0].message).toBe("Error message");
      expect(console.error).toHaveBeenCalledWith("[ERROR] Error message");
    });
  });

  describe("ring buffer behavior", () => {
    it("should maintain maximum size", () => {
      logRing.info("Message 1");
      logRing.info("Message 2");
      logRing.info("Message 3");
      logRing.info("Message 4"); // This should remove the first message

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].message).toBe("Message 2");
      expect(logs[1].message).toBe("Message 3");
      expect(logs[2].message).toBe("Message 4");
    });

    it("should handle single item buffer", () => {
      const singleLogRing = new LogRing(1);
      singleLogRing.info("First");
      singleLogRing.info("Second");

      const logs = singleLogRing.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Second");
    });

    it("should not exceed buffer size with mixed log levels", () => {
      logRing.debug("Debug 1");
      logRing.info("Info 1");
      logRing.warn("Warn 1");
      logRing.error("Error 1"); // Should remove Debug 1
      logRing.debug("Debug 2"); // Should remove Info 1

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].message).toBe("Warn 1");
      expect(logs[1].message).toBe("Error 1");
      expect(logs[2].message).toBe("Debug 2");
    });
  });

  describe("utility methods", () => {
    beforeEach(() => {
      logRing.debug("Debug msg");
      logRing.info("Info msg");
      logRing.warn("Warning msg");
    });

    it("should get logs by level", () => {
      const debugLogs = logRing.getLogsByLevel(LOG_LEVELS.DEBUG);
      const infoLogs = logRing.getLogsByLevel(LOG_LEVELS.INFO);
      const warnLogs = logRing.getLogsByLevel(LOG_LEVELS.WARN);
      const errorLogs = logRing.getLogsByLevel(LOG_LEVELS.ERROR);

      expect(debugLogs).toHaveLength(1);
      expect(debugLogs[0].message).toBe("Debug msg");
      expect(infoLogs).toHaveLength(1);
      expect(infoLogs[0].message).toBe("Info msg");
      expect(warnLogs).toHaveLength(1);
      expect(warnLogs[0].message).toBe("Warning msg");
      expect(errorLogs).toHaveLength(0);
    });

    it("should return empty array for non-existent level", () => {
      const errorLogs = logRing.getLogsByLevel(LOG_LEVELS.ERROR);
      expect(errorLogs).toHaveLength(0);
      expect(errorLogs).toEqual([]);
    });

    it("should clear all logs", () => {
      expect(logRing.getSize()).toBe(3);
      logRing.clear();
      expect(logRing.getSize()).toBe(0);
      expect(logRing.getLogs()).toHaveLength(0);
    });

    it("should return current size", () => {
      expect(logRing.getSize()).toBe(3);
    });

    it("should return logs with timestamps", () => {
      const logs = logRing.getLogs();
      logs.forEach((log) => {
        expect(log.timestamp).toBeInstanceOf(Date);
        expect(log.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      });
    });

    it("should return immutable copy of logs", () => {
      const logs1 = logRing.getLogs();
      const logs2 = logRing.getLogs();

      expect(logs1).not.toBe(logs2); // Different array references
      expect(logs1).toEqual(logs2); // Same content

      logs1.pop(); // Modify returned array
      expect(logRing.getSize()).toBe(3); // Original should be unchanged
    });
  });

  describe("createLogRing factory function", () => {
    it("should create a LogRing instance", () => {
      const ring = createLogRing(50);
      expect(ring).toBeInstanceOf(LogRing);
      expect(ring.getMaxSize()).toBe(50);
    });

    it("should create a LogRing with default size", () => {
      const ring = createLogRing();
      expect(ring.getMaxSize()).toBe(100);
    });
  });

  describe("edge cases", () => {
    it("should handle zero maxSize gracefully", () => {
      const zeroLogRing = new LogRing(0);
      zeroLogRing.info("Test");

      expect(zeroLogRing.getSize()).toBe(0);
      expect(zeroLogRing.getLogs()).toHaveLength(0);
    });

    it("should handle negative maxSize by treating as zero", () => {
      const negativeLogRing = new LogRing(-5);
      negativeLogRing.info("Test");

      expect(negativeLogRing.getSize()).toBe(0);
      expect(negativeLogRing.getLogs()).toHaveLength(0);
    });

    it("should handle empty messages", () => {
      logRing.info("");

      const logs = logRing.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("");
    });

    it("should preserve order of logs", () => {
      logRing.info("First");
      logRing.info("Second");
      logRing.info("Third");

      const logs = logRing.getLogs();
      expect(logs[0].message).toBe("First");
      expect(logs[1].message).toBe("Second");
      expect(logs[2].message).toBe("Third");

      // Check timestamps are in order (should be very close, but at least not reverse)
      expect(logs[0].timestamp.getTime()).toBeLessThanOrEqual(
        logs[1].timestamp.getTime()
      );
      expect(logs[1].timestamp.getTime()).toBeLessThanOrEqual(
        logs[2].timestamp.getTime()
      );
    });
  });

  describe("performance and stress testing", () => {
    it("should handle large number of logs efficiently", () => {
      const largeLogRing = new LogRing(1000);

      const start = performance.now();
      for (let i = 0; i < 5000; i++) {
        largeLogRing.info(`Message ${i}`);
      }
      const end = performance.now();

      expect(largeLogRing.getSize()).toBe(1000);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms

      // Check that only the last 1000 messages are kept
      const logs = largeLogRing.getLogs();
      expect(logs[0].message).toBe("Message 4000");
      expect(logs[999].message).toBe("Message 4999");
    });
  });
});
