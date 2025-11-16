import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((s: any) => s.setToken);
  const navigate = useNavigate();

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      if (!token) throw new Error("No token");
      // token is a string
      setToken(token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
