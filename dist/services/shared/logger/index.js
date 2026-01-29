import winston from "winston";
const { combine, timestamp, printf, colorize, errors } = winston.format;
const logFormat = printf(({ level, message, timestamp, stack, service }) => {
    return `${timestamp} [${service ?? "common"}] ${level}: ${stack ?? message}`;
});
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    format: combine(errors({ stack: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), process.env.NODE_ENV !== "production"
        ? colorize()
        : winston.format.uncolorize(), logFormat),
    transports: [new winston.transports.Console()],
});
export default logger;
