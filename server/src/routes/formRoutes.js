import express from "express";
import {
  createForm,
  generateForm,
  getMyForms,
  getFormById,
  getPublicForm,
  createResponse,
} from "../controllers/formController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes use the JWT middleware before reaching the controller.
router.get("/", protect, getMyForms);
router.get("/:id", protect, getFormById);
router.post("/", protect, createForm);
router.post("/generate", protect, generateForm);

// Public routes are intentionally accessible without authentication.
router.get("/public/:id", getPublicForm);
router.post("/public/:id/responses", createResponse);

export default router;
