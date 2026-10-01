import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import FormField from "../components/FormField";
import "./FormDetails.css";

function FormDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch(`http://localhost:5000/api/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch form.");
        }

        setForm(data.form);
      } catch (error) {
        console.error("Failed to fetch form:", error.message);
      }
    };

    fetchForm();
  }, [id]);

  if (!form) {
    return <p>Loading form...</p>;
  }

  return (
    <div className="form-details-page">
      <main className="form-details-content">
        <div className="form-details-card">
          <h1>{form.title}</h1>
          <p className="form-details-description">{form.description}</p>

          <div className="form-details-fields">
            {form.fields.map((field) => (
              <FormField key={field._id} field={field} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default FormDetails;
