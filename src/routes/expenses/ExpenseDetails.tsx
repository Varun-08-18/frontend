"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";
import {
  Expense,
  getExpense,
  getExpenseApprovals,
} from "@/services/expense.service";

export default function ExpenseDetails() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [expense, setExpense] = useState<Expense | null>(null);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadExpense = async () => {
      try {
        setLoading(true);
        setError("");

        const expenseData = await getExpense(id);
        setExpense(expenseData);

        try {
          const approvalData = await getExpenseApprovals(id);

          if (Array.isArray(approvalData)) {
            setApprovals(approvalData);
          } else if (Array.isArray(approvalData?.data)) {
            setApprovals(approvalData.data);
          } else {
            setApprovals([]);
          }
        } catch (approvalError) {
          console.error("Approval history could not be loaded:", approvalError);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load expense",
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>

        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
      </MainLayout>
    );
  }

  if (!expense) {
    return (
      <MainLayout>
        <Alert severity="warning">Expense not found.</Alert>

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Expense Details
          </Typography>

          <Button variant="outlined" onClick={() => router.back()}>
            Back
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Expense Information
          </Typography>

          <Box sx={{ display: "grid", gap: 2 }}>
            <Typography>
              <strong>ID:</strong> {expense.id}
            </Typography>

            <Typography>
              <strong>Amount:</strong> ₹
              {expense.amount.toLocaleString()}
            </Typography>

            <Typography>
              <strong>Date:</strong> {expense.date}
            </Typography>

            <Typography>
              <strong>Category:</strong>{" "}
              {expense.category?.name || expense.categoryId}
            </Typography>

            <Typography>
              <strong>Description:</strong> {expense.description}
            </Typography>

            <Typography>
              <strong>Status:</strong> {expense.status}
            </Typography>

            <Typography>
              <strong>Employee ID:</strong> {expense.employeeId}
            </Typography>

            {expense.receiptUrl && (
              <Typography>
                <strong>Receipt:</strong>{" "}
                <a
                  href={`http://localhost:3001${expense.receiptUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Receipt
                </a>
              </Typography>
            )}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Approval History
          </Typography>

          {approvals.length === 0 ? (
            <Typography color="text.secondary">
              No approval history available.
            </Typography>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {approvals.map((approval, index) => (
                <Box
                  key={approval.id || index}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography>
                    <strong>Action:</strong>{" "}
                    {approval.action ||
                      approval.status ||
                      "Approval updated"}
                  </Typography>

                  {approval.userId && (
                    <Typography>
                      <strong>User ID:</strong> {approval.userId}
                    </Typography>
                  )}

                  {approval.createdAt && (
                    <Typography>
                      <strong>Date:</strong>{" "}
                      {new Date(approval.createdAt).toLocaleString()}
                    </Typography>
                  )}

                  {approval.comment && (
                    <Typography>
                      <strong>Comment:</strong> {approval.comment}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
}