import express from "express";
const router = express.Router();

import { CreateOrder, approveOrderStatus, GetOrders } from "../controller";
import { Authenticate } from "../middleware/CommonAuth";

router.post("/create", Authenticate, CreateOrder);
router.patch("/approve", Authenticate, approveOrderStatus);

router.get("/get", Authenticate, GetOrders);
export { router as OrderRoute };
