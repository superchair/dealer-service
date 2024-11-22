import { Get, Route, Tags } from "tsoa";
import logger from "../infrastructure/logger";

/**
 * @example {
 *  "status": "ok"
 * }
 */
interface HealthzResponse {
  status: string;
}

@Route("healthz")
@Tags("Service Utils")
export class HealthzController {
  @Get("/")
  public async getMessage(): Promise<HealthzResponse> {
    logger.info("Healthz endpoint called");
    throw new Error("uhoh");
    return {
      status: "ok",
    };
  }
}