import log from "loglevel";

export function setLogLevels() {
  // Set up logging
  const defaultLogLevel = process.env.BUILD === "prod" ? "info" : "debug";
  log.setDefaultLevel(defaultLogLevel);
  const loggers = log.getLoggers();
  for (const key in loggers) {
    const logger = loggers[key];
    logger.setDefaultLevel(defaultLogLevel);
  }
}
