import express, { Application } from "express"
import morgan from "morgan";
import Router from "./routes";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT ?? 8000

const app: Application = express()

// middlewares
app.use(express.json()); // use json
app.use(morgan("tiny")); // TODO: what's this doing?
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
);

app.use(Router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});