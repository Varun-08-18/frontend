"use client";

import { Box, Typography, Paper } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 2 }}>
        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Expenses
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            ₹0
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Pending Approvals
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            0
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="subtitle2" color="text.secondary">
            This Month Spent
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            ₹0
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Budget Remaining
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            ₹0
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
}