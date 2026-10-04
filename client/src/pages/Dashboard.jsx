import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useAuth();

  // Store the forms belonging to the currently logged-in user.
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // Read the JWT and send it with the request to identify the current user.
        const token = Cookies.get("token");

        // GET /api/forms returns only forms owned by the authenticated user.
        // The backend uses the JWT to enforce ownership before returning data.
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/forms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch forms.");
        }

        setForms(data.forms);

        // Log temporarily for development/debugging.
        console.log("My forms:", data.forms);
      } catch (error) {
        console.error("Failed to fetch forms:", error.message);
      }
    };

    fetchForms();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");

    // Clear the global authentication state before returning to Login.
    setUser(null);
    setIsAuthenticated(false);

    navigate("/login", { replace: true });
  };

  const handleCreateForm = () => {
    navigate("/create-form");
  };

  const handleOpenForm = (formId) => {
    navigate(`/forms/${formId}`);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h2>prompt-form-ai</h2>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-intro">
          <h1>Welcome, {user?.name}!</h1>

          <p>Create and manage your forms in one place.</p>
        </section>

        <section className="dashboard-actions">
          <button className="create-form-button" onClick={handleCreateForm}>
            + Create New Form
          </button>
        </section>

        <section className="forms-section">
          <h2>Your Forms</h2>

          {forms.length === 0 ? (
            <div className="empty-state">
              <h3>No forms yet</h3>
              <p>Create your first form to get started.</p>
            </div>
          ) : (
            <div className="forms-list">
              {forms.map((form) => (
                <div
                  className="form-card"
                  key={form._id}
                  onClick={() => handleOpenForm(form._id)}
                >
                  <h3>{form.title}</h3>
                  <p>{form.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
