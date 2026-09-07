"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  Budget,
  getBudgets,
  deleteBudget,
} from "@/services/budget.service";

import {
  Category,
  getCategories,
} from "@/services/expense.service";

import { getCurrentUser } from "@/services/auth.service";

export default function Budgets() {
  const router = useRouter();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [budgetData, categoryData] = await Promise.all([
        getBudgets(),
        getCategories(),
      ]);

      setBudgets(budgetData);
      setCategories(categoryData);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load budgets",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();

    if (user?.role === "ADMIN") {
      setIsAdmin(true);
    }

    loadData();
  }, []);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(
      (item) => item.id === categoryId,
    );

    return category?.name || `Category ${categoryId}`;
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudget(id);

      setBudgets((current) =>
        current.filter((budget) => budget.id !== id),
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete budget",
      );
    }
  };

  const getPercentage = (budget: Budget) => {
    if (budget.limit <= 0) {
      return 0;
    }

    return (budget.spent / budget.limit) * 100;
  };

  return (
    <MainLayout>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold" }}
          >
            Budgets
          </Typography>

          {/* Admin only */}
          {isAdmin && (
            <Button
              variant="contained"
              onClick={() =>
                router.push("/budgets/create")
              }
            >
              Create Budget
            </Button>
          )}
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Budget Table */}
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
          ) : budgets.length === 0 ? (
            <Box
              sx={{
                p: 5,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">
                No budgets found.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Month</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Year</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Limit</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Spent</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Remaining</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Usage</strong>
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      <strong>Action</strong>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {budgets.map((budget) => {
                  const remaining =
                    budget.limit - budget.spent;

                  const percentage =
                    getPercentage(budget);

                  return (
                    <TableRow key={budget.id}>
                      <TableCell>
                        {getCategoryName(
                          budget.categoryId,
                        )}
                      </TableCell>

                      <TableCell>
                        {budget.month}
                      </TableCell>

                      <TableCell>
                        {budget.year}
                      </TableCell>

                      <TableCell>
                        ₹
                        {budget.limit.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ₹
                        {budget.spent.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ₹
                        {remaining.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {percentage.toFixed(0)}%
                      </TableCell>

                      {/* Admin only */}
                      {isAdmin && (
                        <TableCell>
                          <Button
                            color="error"
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleDelete(budget.id)
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
}