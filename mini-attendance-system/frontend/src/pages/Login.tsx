import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s: any) => s.setToken);
  const navigate = useNavigate();

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await login(email, password);
      if (!token) throw new Error("No token");
      setToken(token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
        >
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={submit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.5, mt: 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
