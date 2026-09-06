"use client";

import { Typography, Paper } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function Reports() {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Reports
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Monthly / Category / Employee Summaries will come here.
        </Typography>
      </Paper>
    </MainLayout>
  );
}