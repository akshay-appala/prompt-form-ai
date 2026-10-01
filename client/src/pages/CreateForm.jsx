import { useState } from "react";
import Cookies from "js-cookie";
import FormField from "../components/FormField";
import "./CreateForm.css";

function CreateForm() {
  const [prompt, setPrompt] = useState("");
  const [generatedForm, setGeneratedForm] = useState(null);

  const updateField = (fieldIndex, updatedValues) => {
    setGeneratedForm((currentForm) => ({
      ...currentForm,
      fields: currentForm.fields.map((field, index) =>
        index === fieldIndex ? { ...field, ...updatedValues } : field,
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get("token");

    try {
      const response = await fetch("http://localhost:5000/api/forms/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate form.");
      }

      console.log("Generated form:", data.form);
      setGeneratedForm(data.form);
    } catch (error) {
      console.error("Form generation failed:", error.message);
    }
  };

  return (
    <div className="create-form-page">
      <main className="create-form-content">
        <h1>Create New Form</h1>
        <p>Describe the form you want to create.</p>

        <div className="create-form-box">
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: Create a customer feedback form with name, email, rating, and comments."
            />

            <button type="submit" className="generate-form-button">
              Generate Form
            </button>
          </form>
        </div>

        {generatedForm && (
          <section className="generated-form-preview">
            <h2>{generatedForm.title}</h2>

            <p>{generatedForm.description}</p>

            {generatedForm.fields.map((field, index) => (
              <FormField
                key={field._id || index}
                field={field}
                onChange={(updatedValues) => updateField(index, updatedValues)}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default CreateForm;
