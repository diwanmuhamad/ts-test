import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const token = useAuthStore((s: any) => s.token);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={token ? <Reports /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}
