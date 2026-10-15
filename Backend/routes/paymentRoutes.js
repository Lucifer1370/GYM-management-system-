import express from "express";

import {
    createPayment,
    getAllPayments,
    getMemberPayments,
    getMonthlyRevenue,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPayment);

router.get("/", protect, getAllPayments);

router.get("/member/:id", protect, getMemberPayments);

router.get("/revenue/monthly", protect, getMonthlyRevenue);

export default router;