import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import FormDetails from "./pages/FormDetails";
import PublicForm from "./pages/PublicForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms/:id"
            element={
              <ProtectedRoute>
                <FormDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-form"
            element={
              <ProtectedRoute>
                <CreateForm />
              </ProtectedRoute>
            }
          />
          <Route path="/f/:id" element={<PublicForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
