import Bugsnag, { BrowserConfig, Client, Logger } from "@bugsnag/js";
import bugsnagPluginExpress from "@bugsnag/plugin-express";
import winston from "winston";

export type BugsnagConfig = {
  apiKey: string;
  appVersion: string
  loggingClient?: winston.Logger
}

function bugsnagFactory({ apiKey, appVersion, loggingClient }: BugsnagConfig): Client {
  let logger: Logger | undefined = undefined
  if (loggingClient) {
    const childLogger: winston.Logger = loggingClient.child({ module: 'bugsnag' })
    logger = {
      debug: (message: string) => childLogger.debug(`BugSnag - ${message}`),
      info: (message: string) => childLogger.info(`BugSnag - ${message}`),
      warn: (message: string) => childLogger.warn(`BugSnag - ${message}`),
      error: (message: string) => childLogger.error(`BugSnag - ${message}`),
    }
  }

  const config: BrowserConfig = {
    apiKey,
    plugins: [
      bugsnagPluginExpress
    ],
    appVersion,
    logger
  }
  return Bugsnag.start(config)
}

export default bugsnagFactory;