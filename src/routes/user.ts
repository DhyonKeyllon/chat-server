import { Router } from "express";

import UserController from "../controllers/UserController/UserController";
import { authenticateJWT } from "../middlewares/auth/authenticate";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

router.use(authenticateJWT);

router.get("/", userController.getUsers);
router.get("/:token", userController.getUserByToken);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
