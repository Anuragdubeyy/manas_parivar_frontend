import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserFlow from "./page/UserFlow";
import AdminDashboard from "./page/adminDashboard";
import Register from "./page/register";
import type { JSX } from "react";
import LoginPage from "./page/Login";
function ProtectedRoute({ children, allowedRole } : { children: JSX.Element; allowedRole?: "user" | "admin" }) {
 const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  // Check if user exists and has valid role
  if (!user) {
    return <Navigate to="/" replace />; // redirect to login if not logged in
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; // redirect if role mismatch
  }

  return children;
}
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Route */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserFlow />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
  
}

export default App;
