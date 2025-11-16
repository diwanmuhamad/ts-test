import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const token = useAuthStore((s: any) => s.token);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ flex: 1, overflow: "auto" }}>
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
      </Box>
    </Box>
  );
}
