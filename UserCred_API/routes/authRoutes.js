import e from "express";
import { loginUser, registerUser, updatePassword } from "../controllers/authController.js";

const authRouter = e.Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.patch("/users/:id", updatePassword);

export { authRouter };