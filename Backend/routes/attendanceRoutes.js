import express from "express";
import {
    markAttendance,
    getTodayAttendance,
    getMemberAttendance,
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, markAttendance);

router.get("/today", protect, getTodayAttendance);

router.get("/member/:id", protect, getMemberAttendance);

export default router;