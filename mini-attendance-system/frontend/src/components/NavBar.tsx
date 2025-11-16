import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import {
  Home,
  Dashboard as DashboardIcon,
  BarChart,
  Logout,
} from "@mui/icons-material";

export default function NavBar() {
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{ textTransform: "none" }}
          >
            Home
          </Button>
          {token ? (
            <>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{ textTransform: "none" }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                startIcon={<BarChart />}
                onClick={() => navigate("/reports")}
                sx={{ textTransform: "none" }}
              >
                Reports
              </Button>
              <Button
                color="inherit"
                startIcon={<Logout />}
                onClick={logout}
                sx={{ ml: "auto", textTransform: "none" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/register")}
                sx={{ textTransform: "none" }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
