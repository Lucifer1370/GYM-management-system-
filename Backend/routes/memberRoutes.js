import express from "express";
import {
    addMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember,
    searchMembers,
} from "../controllers/memberController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Member
router.post("/", protect, addMember);

// Get All Members
router.get("/", protect, getMembers);
router.get("/search", protect, searchMembers);
// Get Single Member
router.get("/:id", protect, getMemberById);

// Update Member
router.put("/:id", protect, updateMember);

// Delete Member
router.delete("/:id", protect, deleteMember);

export default router;