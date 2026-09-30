import express from "express";
import { createForm, generateForm } from "../controllers/formController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createForm);
router.post("/generate", protect, generateForm);

export default router;
