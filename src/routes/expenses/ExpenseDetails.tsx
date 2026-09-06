"use client";

import { Box, Typography, Paper } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function ExpenseDetails() {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Expense Details
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Status, Approval History and Activity Timeline will come here.
        </Typography>
      </Paper>
    </MainLayout>
  );
}