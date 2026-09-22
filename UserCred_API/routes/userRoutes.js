import e from "express";
import { getUsers, getUser, updateUser, deleteUser } from "../controllers/userController.js"

const userRouter = e.Router();

userRouter.get("/", getUsers);

userRouter.get("/:email",getUser);

userRouter.patch("/:id",updateUser);

userRouter.delete("/:id",deleteUser);


export { userRouter };