import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch("http://localhost:5000/api/forms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch forms.");
        }

        setForms(data.forms);
        console.log("My forms:", data.forms);
      } catch (error) {
        console.error("Failed to fetch forms:", error.message);
      }
    };

    fetchForms();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
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
        <h1>Welcome, {user?.name}!</h1>
        <p>Create and manage your forms in one place.</p>

        <section className="dashboard-actions">
          <button
            className="create-form-button"
            onClick={() => navigate("/create-form")}
          >
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
                  onClick={() => navigate(`/forms/${form._id}`)}
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
