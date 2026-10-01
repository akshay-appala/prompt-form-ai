import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormField from "../components/FormField";
import "./PublicForm.css";

function PublicForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
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

  if (!form) {
    return <p>Loading form...</p>;
  }

  return (
    <div className="public-form-page">
      <main className="public-form-content">
        <div className="public-form-card">
          <h1>{form.title}</h1>
          <p className="public-form-description">{form.description}</p>

          <div className="public-form-fields">
            {form.fields.map((field) => (
              <FormField key={field._id} field={field} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicForm;
