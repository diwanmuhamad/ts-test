import React from "react";
import { useMutation } from "@tanstack/react-query";
import { checkIn, checkOut } from "../services/attendance";
import toast from "react-hot-toast";

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
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => ci.mutate()} disabled={ci.isPending}>
          Check In
        </button>
        <button onClick={() => co.mutate()} disabled={co.isPending}>
          Check Out
        </button>
      </div>
    </div>
  );
}
