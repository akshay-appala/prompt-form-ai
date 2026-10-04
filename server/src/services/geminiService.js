import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Structured output keeps Gemini's response predictable for the frontend and database.
const formSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A clear, concise title for the form.",
    },
    description: {
      type: Type.STRING,
      description: "A short description explaining the purpose of the form.",
    },
    fields: {
      type: Type.ARRAY,
      description: "The fields needed to satisfy the user's request.",
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: "The human-readable label for the field.",
          },
          type: {
            type: Type.STRING,
            enum: [
              "text",
              "textarea",
              "email",
              "number",
              "tel",
              "url",
              "date",
              "time",
              "datetime",
              "select",
              "radio",
              "color",
            ],
            description: "The HTML-style field type.",
          },
          required: {
            type: Type.BOOLEAN,
            description: "Whether the user must fill in this field.",
          },
          placeholder: {
            type: Type.STRING,
            description:
              "Helpful placeholder text. Use an empty string when not needed.",
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description:
              "Options for select or radio fields. Use an empty array for other field types.",
          },
        },
        required: ["label", "type", "required", "placeholder", "options"],
      },
    },
  },
  required: ["title", "description", "fields"],
};

export const generateFormWithGemini = async (prompt) => {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: `
You are a form-building assistant.

Convert the user's natural-language request into a useful form.

Rules:
- Generate only fields that are relevant to the user's request.
- Use clear and concise field labels.
- Use "required" thoughtfully based on the purpose of the form.
- Use options for select and radio fields.
- For all other field types, return an empty options array.
- Do not invent unnecessary fields.

User request:
${prompt}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: formSchema,
    },
  });

  // The structured response is parsed before being returned to the controller.
  return JSON.parse(response.text);
};
