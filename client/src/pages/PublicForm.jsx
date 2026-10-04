import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormField from "../components/FormField";
import "./PublicForm.css";

function PublicForm() {
  const { id } = useParams();

  // Store the public form and the answers entered by the respondent.
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  // Track submission state so the UI can show success or errors.
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // GET /api/forms/public/:id is intentionally public and needs no JWT.
        const response = await fetch(
          `http://localhost:5000/api/forms/public/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch form.");
        }

        setForm(data.form);
      } catch (error) {
        console.error("Failed to fetch public form:", error.message);
      }
    };

    fetchForm();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");
    setIsSubmitting(true);

    try {
      // POST /api/forms/public/:id/responses accepts submissions without authentication.
      // Only the answers and their matching field IDs are sent to the backend.
      const response = await fetch(
        `http://localhost:5000/api/forms/public/${id}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: Object.entries(answers).map(([fieldId, value]) => ({
              fieldId,
              value,
            })),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit response.");
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return <p>Loading form...</p>;
  }

  if (isSubmitted) {
    return (
      <div className="public-form-page">
        <main className="public-form-content">
          <div className="public-form-card public-form-success">
            <h1>Form submitted successfully</h1>

            <p>Thank you for your response.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="public-form-page">
      <main className="public-form-content">
        <div className="public-form-card">
          <h1>{form.title}</h1>

          <p className="public-form-description">{form.description}</p>

          {submitError && <p className="public-form-error">{submitError}</p>}

          <form className="public-form-fields" onSubmit={handleSubmit}>
            {form.fields.map((field) => (
              <FormField
                key={field._id}
                field={field}
                onValueChange={(value) => {
                  setAnswers((previousAnswers) => ({
                    ...previousAnswers,
                    [field._id]: value,
                  }));
                }}
              />
            ))}

            <button
              type="submit"
              className="public-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PublicForm;
