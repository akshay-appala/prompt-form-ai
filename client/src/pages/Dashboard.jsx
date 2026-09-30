import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

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

          <div className="empty-state">
            <h3>No forms yet</h3>
            <p>Create your first form to get started.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
