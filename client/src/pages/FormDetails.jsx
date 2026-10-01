import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

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
    <main>
      <h1>{form.title}</h1>
      <p>{form.description}</p>

      {form.fields.map((field) => (
        <div key={field._id}>
          <strong>{field.label}</strong>
        </div>
      ))}
    </main>
  );
}

export default FormDetails;
