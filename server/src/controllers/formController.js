import Form from "../models/Form.js";
import { generateFormWithGemini } from "../services/geminiService.js";

export const createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Form title is required",
      });
    }

    const form = await Form.create({
      title,
      description,
      fields,
      owner: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Form created successfully",
      form,
    });
  } catch (error) {
    console.error("Create form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating form",
    });
  }
};

export const generateForm = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const form = await generateFormWithGemini(prompt.trim());

    return res.status(200).json({
      success: true,
      message: "Form generated successfully",
      form,
    });
  } catch (error) {
    console.error("Generate form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate form. Please try again.",
    });
  }
};
