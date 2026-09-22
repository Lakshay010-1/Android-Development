import e from "express";
import { readNfcTag } from "../controllers/nfcController.js";

const nfcRouter = e.Router();

nfcRouter.get("/:id", readNfcTag);

export { nfcRouter };