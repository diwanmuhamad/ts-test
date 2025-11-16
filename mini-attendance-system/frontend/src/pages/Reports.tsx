import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "../services/attendance";

// Small client-side CSV converter to avoid using Node-only packages in the browser
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

export default function Reports() {
  const [status, setStatus] = useState("");
  const { data: rawData, refetch } = useQuery({
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
    <div style={{ padding: 16 }}>
      <h2>Reports</h2>
      <div>
        <label>Filter by status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="early_leave">Early Leave</option>
          <option value="absent">Absent</option>
        </select>
        <button onClick={() => refetch()}>Refresh</button>
        <button onClick={exportCsv}>Export CSV</button>
      </div>

      <table
        style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd" }}>User</th>
            <th style={{ border: "1px solid #ddd" }}>Date</th>
            <th style={{ border: "1px solid #ddd" }}>Status</th>
            <th style={{ border: "1px solid #ddd" }}>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((r: any) => (
            <tr key={r.id}>
              <td style={{ border: "1px solid #ddd" }}>{r.userId}</td>
              <td style={{ border: "1px solid #ddd" }}>
                {new Date(r.date).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ddd" }}>{r.status}</td>
              <td style={{ border: "1px solid #ddd" }}>
                {r.totalHours ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
