"use client";

import { Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";

export default function ExpensesList() {
  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          My Expenses
        </Typography>
        <Button variant="contained" component={Link} href="/expenses/create">
          Create Expense
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Search, Filters, Sorting and Pagination will come here.
        </Typography>
      </Paper>
    </MainLayout>
  );
}