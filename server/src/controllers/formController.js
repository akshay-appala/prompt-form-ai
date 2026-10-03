import Form from "../models/Form.js";
import { generateFormWithGemini } from "../services/geminiService.js";
import Response from "../models/Response.js";

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

export const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({
      owner: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      forms,
    });
  } catch (error) {
    console.error("Get forms error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching forms",
    });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    const responses = await Response.find({
      form: form._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      form,
      responses,
    });
  } catch (error) {
    console.error("Get form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching form",
    });
  }
};

export const getPublicForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).select(
      "title description fields",
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    return res.status(200).json({
      success: true,
      form,
    });
  } catch (error) {
    console.error("Get public form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching public form",
    });
  }
};

export const createResponse = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    const formFieldIds = form.fields.map((field) => field._id.toString());

    for (const answer of answers) {
      if (!answer.fieldId || !("value" in answer)) {
        return res.status(400).json({
          success: false,
          message: "Each answer must contain fieldId and value",
        });
      }

      if (!formFieldIds.includes(answer.fieldId.toString())) {
        return res.status(400).json({
          success: false,
          message: "Invalid field ID",
        });
      }
    }

    const response = await Response.create({
      form: form._id,
      answers,
    });

    return res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      response,
    });
  } catch (error) {
    console.error("Create response error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting response",
    });
  }
};
