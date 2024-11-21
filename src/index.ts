import express, { Application, urlencoded } from "express"
import morgan from "morgan";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT ?? 8000

const app: Application = express()

// middlewares
app.use(
  urlencoded({
    extended: true
  })
)
app.use(express.json()); // use json
app.use(morgan("tiny")); // TODO: what's this doing? a: this is for logging, but need to find out more
app.use(express.static("public")); // provide static dir

console.log(process.env)

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

RegisterRoutes(app);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
})