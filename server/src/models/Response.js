import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Mixed allows responses from different form field types.
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
  },
  { _id: false },
);

const responseSchema = new mongoose.Schema(
  {
    // Each response belongs to one saved form.
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Response = mongoose.model("Response", responseSchema);

export default Response;
