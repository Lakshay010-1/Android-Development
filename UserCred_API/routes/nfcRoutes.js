import e from "express";
import { readNfcTag, readNfcUsers } from "../controllers/nfcController.js";

const nfcRouter = e.Router();

nfcRouter.get("/:id", readNfcTag);
nfcRouter.get("/users/:id", readNfcUsers);

export { nfcRouter };