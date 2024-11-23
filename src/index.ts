import express, { Application, NextFunction, Request, Response, urlencoded } from "express"
import { RegisterRoutes } from "./routes/routes"
import swaggerUi from "swagger-ui-express"
import helmet from "helmet"
import cors from "cors"
import { ValidateError } from "tsoa"
import logger from "./infrastructure/logger"
import expressWinston from "express-winston"
import { LogLevel } from "./infrastructure/logger/logger"
import bugsnag from "./infrastructure/bugsnag"

const PORT = process.env.PORT ?? 8000

const app: Application = express()

// register bugsnag request handler
app.use(bugsnag.getPlugin('express')!.requestHandler)

logger.error('This is an error message')
logger.warn('This is a warning message')
logger.info('This is an info message')
logger.http('This is an http message')
logger.verbose('This is a verbose message')
logger.debug('This is a debug message')

// middlewares
app.use(
  urlencoded({
    extended: true
  })
)
app.use(express.json()) // use json
app.use(express.static("public")) // provide static dir
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

RegisterRoutes(app)

// express error handling for handled errors
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, err?.fields)
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    })
  }

  // this is not a handle-able error - call next handler
  next(err)
})


// express error handling for unhandled errors
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err)

  if (err instanceof Error) {
    bugsnag.notify(err)
  } else {
    bugsnag.notify(new Error(`Unknown unhandled error: ${err}`))
  }

  return res.status(500).json({
    message: "Internal Server Error",
  })
})

// express 404 handler
app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  })
})

// start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})