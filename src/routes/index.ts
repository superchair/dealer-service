import express, { Request, Response } from "express";
import PingController from "../controllers/ping";

const router = express.Router()

router.get(
  "/ping",
  async (req: Request, res: Response) => {
    const controller = new PingController()
    const responseData = await controller.getMessage()
    return res.send(responseData)
  }
)

export default router