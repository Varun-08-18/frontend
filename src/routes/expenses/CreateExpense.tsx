"use client";

import { Box, Typography, Paper, Button } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function CreateExpense() {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Create Expense
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Typography color="text.secondary" gutterBottom>
          Form validation + Receipt upload will come here.
        </Typography>

        <Button variant="contained" sx={{ mt: 3 }}>
          Submit Expense
        </Button>
      </Paper>
    </MainLayout>
  );
}