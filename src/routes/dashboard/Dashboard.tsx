"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";
import { Expense, getExpenses } from "@/services/expense.service";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getExpenses({
          page: 1,
          limit: 100,
        });

        setExpenses(result.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const pendingApprovals = expenses.filter(
    (expense) => expense.status === "SUBMITTED",
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthSpent = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, expense) => total + expense.amount,
      0,
    );

  const budgetRemaining = 0;

  return (
    <MainLayout>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Paper sx={{ p: 3, minWidth: 220 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Total Expenses
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              ₹{totalExpenses.toLocaleString()}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, minWidth: 220 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Pending Approvals
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              {pendingApprovals}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, minWidth: 220 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              This Month Spent
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              ₹{thisMonthSpent.toLocaleString()}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, minWidth: 220 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Budget Remaining
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              ₹{budgetRemaining.toLocaleString()}
            </Typography>
          </Paper>
        </Box>
      )}
    </MainLayout>
  );
}