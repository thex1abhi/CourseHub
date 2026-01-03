import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import userMiddleware from "../middlewares/user.mid.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", userMiddleware, verifyPayment);

export default router;
