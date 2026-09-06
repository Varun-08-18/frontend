"use client";

import { Typography, Paper } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function Budgets() {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Budgets
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Budget vs Actual Spending will come here.
        </Typography>
      </Paper>
    </MainLayout>
  );
}