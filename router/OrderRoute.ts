import express from "express";
const router = express.Router();

import { CreateOrder } from "../controller";
import { Authenticate } from "../middleware/CommonAuth";

router.post("/create", Authenticate, CreateOrder);

export { router as OrderRoute };
