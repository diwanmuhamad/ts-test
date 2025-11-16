import { useMutation } from "@tanstack/react-query";
import { checkIn, checkOut } from "../services/attendance";
import toast from "react-hot-toast";
import {
  Container,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Logout } from "@mui/icons-material";

export default function Dashboard() {
  const ci = useMutation({
    mutationFn: () => checkIn(),
    onSuccess: () => toast.success("Checked in"),
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || err.message),
  });

  const co = useMutation({
    mutationFn: () => checkOut(),
    onSuccess: () => toast.success("Checked out"),
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || err.message),
  });

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Attendance Dashboard
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={
              ci.isPending ? <CircularProgress size={20} /> : <CheckCircle />
            }
            onClick={() => ci.mutate()}
            disabled={ci.isPending}
            sx={{
              py: 2,
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#45a049" },
            }}
          >
            {ci.isPending ? "Checking in..." : "Check In"}
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={
              co.isPending ? <CircularProgress size={20} /> : <Logout />
            }
            onClick={() => co.mutate()}
            disabled={co.isPending}
            sx={{
              py: 2,
              backgroundColor: "#ff9800",
              "&:hover": { backgroundColor: "#e68900" },
            }}
          >
            {co.isPending ? "Checking out..." : "Check Out"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
