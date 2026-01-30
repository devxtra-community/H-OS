import winston from 'winston';

const { combine, timestamp, errors, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, service }) => {
  return `${timestamp} [${service ?? 'app'}] ${level}: ${stack || message}`;
});

const baseLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

export default baseLogger;
