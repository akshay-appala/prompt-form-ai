import { useState } from "react";
import "./CreateForm.css";

function CreateForm() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form prompt:", prompt);
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
      </main>
    </div>
  );
}

export default CreateForm;
