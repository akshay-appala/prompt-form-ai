import express from "express";
import {
  createForm,
  generateForm,
  getMyForms,
} from "../controllers/formController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyForms);
router.post("/", protect, createForm);
router.post("/generate", protect, generateForm);

export default router;
