import express from "express";
const router = express.Router();

import { CreateOrder, approveOrderStatus } from "../controller";
import { Authenticate } from "../middleware/CommonAuth";

router.post("/create", Authenticate, CreateOrder);
router.patch("/approve", Authenticate, approveOrderStatus);

export { router as OrderRoute };
