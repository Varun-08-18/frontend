"use client";

import { Typography, Paper } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function Approvals() {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Approvals
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Manager / Admin Approval Queue will come here.
        </Typography>
      </Paper>
    </MainLayout>
  );
}