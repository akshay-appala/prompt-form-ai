import express from "express";
import {
  createForm,
  generateForm,
  getMyForms,
  getFormById,
  getPublicForm,
} from "../controllers/formController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyForms);
router.get("/public/:id", getPublicForm);
router.get("/:id", protect, getFormById);
router.post("/", protect, createForm);
router.post("/generate", protect, generateForm);

export default router;
