import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormField from "../components/FormField";
import "./CreateForm.css";

function CreateForm() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [generatedForm, setGeneratedForm] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveForm = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const token = Cookies.get("token");

      const response = await fetch("http://localhost:5000/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: generatedForm.title,
          description: generatedForm.description,
          fields: generatedForm.fields,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save form.");
      }

      console.log("Form saved:", data.form);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Form save failed:", error.message);
      setSaveMessage("Unable to save form. Please try again.");
    } finally {
      setIsSaving(false);
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

            <button
              type="button"
              className="save-form-button"
              onClick={handleSaveForm}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Form"}
            </button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
          </section>
        )}
      </main>
    </div>
  );
}

export default CreateForm;
