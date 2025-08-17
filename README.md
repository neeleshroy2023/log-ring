# Log Ring

[![npm version](https://badge.fury.io/js/log-ring.svg)](https://badge.fury.io/js/log-ring)
[![GitHub license](https://img.shields.io/github/license/username/log-ring.svg)](https://github.com/username/log-ring/blob/main/LICENSE)
[![GitHub actions](https://github.com/username/log-ring/actions/workflows/release.yml/badge.svg)](https://github.com/username/log-ring/actions/workflows/release.yml)

A simple ring buffer logging utility for Node.js and TypeScript that maintains a fixed-size circular buffer of log entries.

## Features

- 🔄 **Ring Buffer**: Automatically maintains a fixed-size buffer of recent logs
- 📝 **Multiple Log Levels**: Support for debug, info, warn, and error levels
- 🎯 **TypeScript Support**: Full TypeScript support with type definitions
- 🔍 **Filtering**: Get logs by specific level
- ⏰ **Timestamps**: Automatic timestamping of all log entries
- 🚀 **Zero Dependencies**: Lightweight with no external dependencies.

## Installation

```bash
npm install log-ring
# or
yarn add log-ring
# or
pnpm add log-ring
```

## Usage

### Basic Usage

```typescript
import LogRing from "log-ring";

const logger = new LogRing(50); // Keep last 50 log entries

logger.info("Application started");
logger.warn("This is a warning");
logger.error("Something went wrong");

// Get all logs
const allLogs = logger.getLogs();
console.log(allLogs);

// Get logs by level
const errorLogs = logger.getLogsByLevel("error");
console.log(errorLogs);
```

### Factory Function

```typescript
import { createLogRing } from "log-ring";

const logger = createLogRing(100);
logger.debug("Debug message");
```

### Available Methods

```typescript
// Logging methods
logger.debug("Debug message");
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message");

// Utility methods
logger.getLogs(); // Get all logs
logger.getLogsByLevel("info"); // Get logs by specific level
logger.clear(); // Clear all logs
logger.getSize(); // Get current number of logs
logger.getMaxSize(); // Get maximum buffer size
```

## API Reference

### Class: LogRing

#### Constructor

```typescript
new LogRing(maxSize?: number)
```

- `maxSize` (optional): Maximum number of log entries to keep. Defaults to 100.

#### Methods

##### Logging Methods

- `debug(message: string): void` - Add a debug log entry
- `info(message: string): void` - Add an info log entry
- `warn(message: string): void` - Add a warning log entry
- `error(message: string): void` - Add an error log entry

##### Utility Methods

- `getLogs()` - Returns all log entries with level, message, and timestamp
- `getLogsByLevel(level: LogLevelType)` - Returns logs filtered by level
- `clear()` - Removes all log entries
- `getSize()` - Returns current number of log entries
- `getMaxSize()` - Returns maximum buffer size

### Types

```typescript
type LogLevelType = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevelType;
  message: string;
  timestamp: Date;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
