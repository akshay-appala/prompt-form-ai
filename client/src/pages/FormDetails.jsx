import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import FormField from "../components/FormField";
import "./FormDetails.css";

function FormDetails() {
  const { id } = useParams();

  // Store the saved form, its responses, and the share-link button state.
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = Cookies.get("token");

        // GET /api/forms/:id returns the form only when the JWT owner matches.
        // The response also includes submissions for that form.
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/forms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch form.");
        }

        setForm(data.form);
        setResponses(data.responses);
      } catch (error) {
        console.error("Failed to fetch form:", error.message);
      }
    };

    fetchForm();
  }, [id]);

  const getFieldLabel = (fieldId) => {
    const field = form.fields.find((field) => field._id === fieldId);
    return field?.label;
  };

  if (!form) {
    return (
      <div className="loading-container">
        <Oval height={30} width={30} color="#8b2f6b" ariaLabel="loading" />
      </div>
    );
  }

  // This is the public URL respondents use to open the form.
  const publicUrl = `${window.location.origin}/f/${id}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);

    setLinkCopied(true);

    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  return (
    <div className="form-details-page">
      <main className="form-details-content">
        {/* Saved form preview */}
        <section className="form-details-card">
          <h2 className="form-preview-heading">Form Preview</h2>

          <h1>{form.title}</h1>

          <p className="form-details-description">{form.description}</p>

          <div className="form-details-fields">
            {form.fields.map((field) => (
              <FormField key={field._id} field={field} />
            ))}
          </div>
        </section>

        {/* Public sharing link */}
        <section className="share-card">
          <h2>Share your form</h2>

          <div className="share-link">
            <input type="text" value={publicUrl} readOnly />

            <button type="button" onClick={handleCopyLink}>
              {linkCopied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </section>

        {/* Responses submitted through the public form */}
        <section className="responses-card">
          <h2>Responses ({responses.length})</h2>

          {responses.length === 0 ? (
            <p className="responses-empty">No responses yet.</p>
          ) : (
            responses.map((response, index) => (
              <div className="response-item" key={response._id}>
                <div className="response-header">
                  <h3>Response {index + 1}</h3>

                  <span>{new Date(response.createdAt).toLocaleString()}</span>
                </div>

                {response.answers.map((answer) => (
                  <div className="response-answer" key={answer.fieldId}>
                    <strong>{getFieldLabel(answer.fieldId)}</strong>

                    <p>{String(answer.value)}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default FormDetails;
