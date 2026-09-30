import Form from "../models/Form.js";

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
