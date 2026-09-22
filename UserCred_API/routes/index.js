import e from "express";
import { authRouter } from "./authRoutes.js";
import { userRouter } from "./userRoutes.js";
import { nfcRouter } from "./nfcRoutes.js";

const indexRouter = e.Router();

indexRouter.use("/auth",authRouter);

indexRouter.use("/users",userRouter);

indexRouter.use("/nfc",nfcRouter);

export default indexRouter;