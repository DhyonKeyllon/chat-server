import { Router } from "express";

import UserController from "../controllers/UserController/UserController";

import { authenticateJWT } from "../middlewares/auth/authenticate";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

router.get("/", authenticateJWT, userController.getUsers);
router.get("/:token", authenticateJWT, userController.getUserByToken);
router.put("/:id", authenticateJWT, userController.updateUser);
router.delete("/:id", authenticateJWT, userController.deleteUser);

export default router;
