import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { renewMembership } from "../controllers/subscriptionController.js";

const router = express.Router();

router.put("/:id", protect, renewMembership);

export default router;