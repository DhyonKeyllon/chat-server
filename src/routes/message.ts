import { Router } from "express";

import MessageController from "../controllers/MessageController/MessageController";

import { authenticateJWT } from "../middlewares/auth/authenticate";

const router = Router();
const messageController = new MessageController();

router.post("/", authenticateJWT, messageController.createMessage);
router.get("/:sender/:receiver", authenticateJWT, messageController.getMessagesBetweenUsers);

export default router;
