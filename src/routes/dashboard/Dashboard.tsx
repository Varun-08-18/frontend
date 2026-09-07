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
import ExpenseChart from "@/components/ExpenseChart/ExpenseChart";

import {
  Expense,
  getExpenses,
} from "@/services/expense.service";

import { getCurrentUser } from "@/services/auth.service";

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: "EMPLOYEE" | "MANAGER" | "ADMIN";
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const currentUser = getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
        }

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

    loadDashboard();
  }, []);

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0,
  );

  const pendingApprovals = expenses.filter(
    (expense) =>
      expense.status === "SUBMITTED",
  ).length;

  const approvedExpenses = expenses.filter(
    (expense) =>
      expense.status === "APPROVED",
  ).length;

  const rejectedExpenses = expenses.filter(
    (expense) =>
      expense.status === "REJECTED",
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthSpent = expenses
    .filter((expense) => {
      const expenseDate = new Date(
        expense.date,
      );

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() ===
          currentYear
      );
    })
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0,
    );

  const budgetRemaining = 0;

  /*
   * Monthly graph data
   */

  const monthlyExpenses = [
    {
      label: "Jan",
      value: 0,
    },
    {
      label: "Feb",
      value: 0,
    },
    {
      label: "Mar",
      value: 0,
    },
    {
      label: "Apr",
      value: 0,
    },
    {
      label: "May",
      value: 0,
    },
    {
      label: "Jun",
      value: 0,
    },
    {
      label: "Jul",
      value: 0,
    },
    {
      label: "Aug",
      value: 0,
    },
    {
      label: "Sep",
      value: 0,
    },
    {
      label: "Oct",
      value: 0,
    },
    {
      label: "Nov",
      value: 0,
    },
    {
      label: "Dec",
      value: 0,
    },
  ];

  expenses.forEach((expense) => {
    const date = new Date(expense.date);

    if (
      date.getFullYear() === currentYear
    ) {
      const month =
        date.getMonth();

      monthlyExpenses[month].value +=
        Number(expense.amount);
    }
  });

  /*
   * Role-based graph title
   */

  let chartTitle = "Monthly Expenses";

  if (user?.role === "EMPLOYEE") {
    chartTitle = "My Monthly Expenses";
  }

  if (user?.role === "MANAGER") {
    chartTitle = "Team Monthly Expenses";
  }

  if (user?.role === "ADMIN") {
    chartTitle = "Company Monthly Expenses";
  }

  return (
    <MainLayout>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
        }}
      >
        Dashboard
      </Typography>

      {user && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Welcome, {user.name}
        </Typography>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
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
        <>
          {/* Statistics */}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <Paper
              sx={{
                p: 3,
                minWidth: 220,
                flex: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Total Expenses
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                ₹
                {totalExpenses.toLocaleString()}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                minWidth: 220,
                flex: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Pending Approvals
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                {pendingApprovals}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                minWidth: 220,
                flex: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                This Month Spent
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                ₹
                {thisMonthSpent.toLocaleString()}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                minWidth: 220,
                flex: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Budget Remaining
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                ₹
                {budgetRemaining.toLocaleString()}
              </Typography>
            </Paper>
          </Box>

          {/* Expense Graph */}

          <Box
            sx={{
              mt: 4,
              width: "100%",
            }}
          >
            <ExpenseChart
              title={chartTitle}
              data={monthlyExpenses}
            />
          </Box>

          {/* Expense Status */}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              mt: 4,
            }}
          >
            <Paper
              sx={{
                p: 3,
                flex: 1,
                minWidth: 200,
              }}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Submitted
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                {pendingApprovals}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: 1,
                minWidth: 200,
              }}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Approved
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                {approvedExpenses}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: 1,
                minWidth: 200,
              }}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Rejected
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                {rejectedExpenses}
              </Typography>
            </Paper>
          </Box>
        </>
      )}
    </MainLayout>
  );
}