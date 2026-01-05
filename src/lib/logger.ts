/**
 * Enterprise Logging System
 * Centralized logging with levels and structured logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

interface LogContext {
  [key: string]: any
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: Error
  userId?: string
  sessionId?: string
}

class Logger {
  private minLevel: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): string {
    const levelName = LogLevel[level]
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''
    const errorStr = error ? `\nError: ${error.message}\nStack: ${error.stack}` : ''
    
    return `[${timestamp}] [${levelName}] ${message} ${contextStr} ${errorStr}`
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    if (!this.shouldLog(level)) return

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }

    // Console logging
    const formattedMessage = this.formatMessage(level, message, context, error)
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, context || '')
        break
      case LogLevel.INFO:
        console.info(formattedMessage, context || '')
        break
      case LogLevel.WARN:
        console.warn(formattedMessage, context || '')
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage, context || '', error || '')
        break
    }

    // TODO: Send to logging service (Sentry, LogRocket, etc.)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   if (level >= LogLevel.ERROR) {
    //     window.Sentry.captureException(error || new Error(message), {
    //       level: level === LogLevel.FATAL ? 'fatal' : 'error',
    //       contexts: { custom: context }
    //     })
    //   }
    // }

    // TODO: Send to analytics/logging endpoint
    // this.sendToLoggingService(logEntry)
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, error?: Error, context?: LogContext) {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // Performance logging
  time(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label)
    }
  }

  // Group logging
  group(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.group(label)
    }
  }

  groupEnd(): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.groupEnd()
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  fatal: (message: string, error?: Error, context?: LogContext) => logger.fatal(message, error, context),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string) => logger.timeEnd(label),
  group: (label: string) => logger.group(label),
  groupEnd: () => logger.groupEnd()
}

