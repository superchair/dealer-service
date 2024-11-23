import { Client } from "@bugsnag/core";
import bugsnagFactory from "./bugsnagFactory";
import logger from "../logger";

const apiKey: string = "4cc682b197b705bc25030956bc519697"
const appVersion: string = "0.1.0"
const bugsnag: Client = bugsnagFactory({ 
  apiKey,
  appVersion,
  loggingClient: logger
})

export default bugsnag