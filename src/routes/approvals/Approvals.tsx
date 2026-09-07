"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";
import {
  Expense,
  getExpenses,
  approveExpense,
  rejectExpense,
} from "@/services/expense.service";

export default function Approvals() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getExpenses({
        page: 1,
        limit: 100,
        status: "SUBMITTED",
        sortBy: "date",
        sortOrder: "DESC",
      });

      setExpenses(result.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load approval requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      setError("");

      await approveExpense(id);

      setExpenses((current) =>
        current.filter((expense) => expense.id !== id),
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to approve expense",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(id);
      setError("");

      await rejectExpense(id);

      setExpenses((current) =>
        current.filter((expense) => expense.id !== id),
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to reject expense",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <MainLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Approvals
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ overflow: "hidden" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : expenses.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">
                No expenses waiting for approval.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.id}</TableCell>

                    <TableCell>{expense.date}</TableCell>

                    <TableCell>
                      {expense.category?.name ||
                        expense.categoryId}
                    </TableCell>

                    <TableCell>
                      {expense.description}
                    </TableCell>

                    <TableCell>
                      ₹{expense.amount.toLocaleString()}
                    </TableCell>

                    <TableCell>{expense.status}</TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          component={Link}
                          href={`/expenses/${expense.id}`}
                          size="small"
                          variant="outlined"
                        >
                          View
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            handleApprove(expense.id)
                          }
                          disabled={
                            actionLoading === expense.id
                          }
                        >
                          {actionLoading === expense.id
                            ? "Processing..."
                            : "Approve"}
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleReject(expense.id)
                          }
                          disabled={
                            actionLoading === expense.id
                          }
                        >
                          {actionLoading === expense.id
                            ? "Processing..."
                            : "Reject"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
} 