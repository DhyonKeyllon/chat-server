import { Router } from "express";

import MessageController from "../controllers/MessageController/MessageController";

const router = Router();
const messageController = new MessageController();

router.post("/", messageController.createMessage);
router.get("/:sender/:receiver", messageController.getMessagesBetweenUsers);

export default router;
