import express, { Application, NextFunction, Request, Response, urlencoded } from "express"
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors"
import { ValidateError } from "tsoa";
import logger from "./logger";
import expressWinston from "express-winston";
import { LogLevel } from "./logger/logger";

const PORT = process.env.PORT ?? 8000

const app: Application = express()

// middlewares
app.use(
  urlencoded({
    extended: true
  })
)
app.use(express.json()); // use json
app.use(express.static("public")); // provide static dir
app.use(helmet())
app.use(cors())

// swagger configuration
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
)

// express HTTP logging
app.use(expressWinston.logger({
  winstonInstance: logger,
  level: LogLevel.HTTP,
  msg: "{{res.statusCode}} {{req.method}} {{req.url}} - {{res.responseTime}}ms",
  statusLevels: true
}))

RegisterRoutes(app);

// express uncaught error handling
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, err?.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    logger.error(err)
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

// express 404 handler
app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});

// start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
})