import * as path from "path";
import { createLogger, format, Logger, transport, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly'
}

export type LoggerConfiguration = {
  applicationName?: string,
  filePath?: string,
  logLevel?: LogLevel
}

export function loggerFactory(
  {
    applicationName = 'application',
    filePath = './logs',
    logLevel = LogLevel.DEBUG
  }: LoggerConfiguration = {}
): Logger { 
  const loggerTransports: Array<transport> = [new transports.Console({
    level: logLevel,
  })]
  if (filePath) {
    const loggerFilePath: string = path.join(filePath, `${applicationName}-%DATE%.log`)
    loggerTransports.push(
      new DailyRotateFile({
        level: logLevel,
        filename: loggerFilePath,
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '20m',
        maxFiles: '8d',
        auditFile: path.join(filePath, '.daily-rotate-audit.json')
      })
    )
  }

  const loggerFormat = format.printf(
    ({ level, message, timestamp, stack, metadata }) => {
      const applicationNameAndModule = (metadata as { module?: string }).module ? `${applicationName}.${(metadata as { module?: string }).module}` : applicationName;
      const text = `${timestamp} ${applicationNameAndModule} ${level.toUpperCase()} - ${message}`;
      return stack ? text + '\n' + String(stack) : text;
    }
  )

  const logger = createLogger({
    transports: loggerTransports,
    format: format.combine(
      format.errors({ stack: true }),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      format.json(),
      format.timestamp(),
      loggerFormat
    ),
    exitOnError: false
  })

  return logger
}