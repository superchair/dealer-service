import Bugsnag, { Client, Logger } from "@bugsnag/js";
import bugsnagPluginExpress from "@bugsnag/plugin-express";
import defaultLogger from "../logger";

export type BugsnagConfig = {
  apiKey: string;
  appVersion: string
}

const logger = defaultLogger.child({ module: 'bugsnag' })

const loggerConfig: Logger = {
  debug: (message: string) => logger.debug(`BugSnag - ${message}`),
  info: (message: string) => logger.info(`BugSnag - ${message}`),
  warn: (message: string) => logger.warn(`BugSnag - ${message}`),
  error: (message: string) => logger.error(`BugSnag - ${message}`),
}

function bugsnagFactory({ apiKey, appVersion }: BugsnagConfig): Client {
  return Bugsnag.start({
    apiKey,
    plugins: [
      bugsnagPluginExpress
    ],
    appVersion,
    logger: logger
  })
}

export default bugsnagFactory;