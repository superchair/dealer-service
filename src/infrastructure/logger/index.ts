import { Logger } from "winston";
import { loggerFactory } from "./logger";


const logger: Logger = loggerFactory({
  applicationName: "dealer-service"
})

export default logger