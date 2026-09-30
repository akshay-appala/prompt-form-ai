import express from "express";
import { createForm } from "../controllers/formController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createForm);

export default router;
