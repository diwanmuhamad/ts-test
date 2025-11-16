import React, { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await register({ email, password });
      toast.success("Registered, please login");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
