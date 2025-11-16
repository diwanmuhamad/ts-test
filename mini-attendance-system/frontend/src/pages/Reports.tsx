import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "../services/attendance";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { Download, Refresh } from "@mui/icons-material";

// Small client-side CSV converter
function toCsv(rows: Array<Record<string, any>>) {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "present":
      return "success";
    case "late":
      return "warning";
    case "early_leave":
      return "info";
    case "absent":
      return "error";
    default:
      return "default";
  }
};

export default function Reports() {
  const [status, setStatus] = useState("");
  const {
    data: rawData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["reports", status],
    queryFn: () => fetchReports({ status }),
    enabled: true,
  });

  const data = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

  const exportCsv = () => {
    const csv = toCsv(data || []);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Attendance Reports
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Filter by Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{ minWidth: 200 }}
          >
            <option value="">All</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="early_leave">Early Leave</option>
            <option value="absent">Absent</option>
          </TextField>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={exportCsv}
            disabled={data.length === 0}
          >
            Export CSV
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
                    No reports found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((r: any) => (
                  <TableRow
                    key={r.id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{r.userId}</TableCell>
                    <TableCell>
                      {new Date(r.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        color={getStatusColor(r.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {r.totalHours ? r.totalHours.toFixed(2) : "-"} hrs
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
