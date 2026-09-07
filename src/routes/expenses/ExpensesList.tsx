"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";
import {
  Category,
  Expense,
  getCategories,
  getExpenses,
} from "@/services/expense.service";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Categories could not be loaded:", err);
    }
  };

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getExpenses({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        categoryId: categoryId
          ? Number(categoryId)
          : undefined,
        sortBy: "date",
        sortOrder: "DESC",
      });

      setExpenses(result.data);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load expenses",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [page, search, status, categoryId]);

  const getCategoryName = (expense: Expense) => {
    if (expense.category?.name) {
      return expense.category.name;
    }

    const category = categories.find(
      (item) => item.id === expense.categoryId,
    );

    return category?.name || "Unknown";
  };

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
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold" }}
          >
            My Expenses
          </Typography>

          <Button
            component={Link}
            href="/expenses/create"
            variant="contained"
          >
            Create Expense
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Search"
              placeholder="Search description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              size="small"
            />

            <FormControl
              size="small"
              sx={{ minWidth: 160 }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                value={status}
                label="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="SUBMITTED">
                  Submitted
                </MenuItem>
                <MenuItem value="APPROVED">
                  Approved
                </MenuItem>
                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>
                <MenuItem value="CANCELLED">
                  Cancelled
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 180 }}
            >
              <InputLabel>Category</InputLabel>

              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>

                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setStatus("");
                setCategoryId("");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

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
            <Box
              sx={{
                p: 5,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">
                No expenses found.
              </Typography>
            </Box>
          ) : (
            <>
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
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {expense.id}
                      </TableCell>

                      <TableCell>
                        {expense.date}
                      </TableCell>

                      <TableCell>
                        {getCategoryName(expense)}
                      </TableCell>

                      <TableCell>
                        {expense.description}
                      </TableCell>

                      <TableCell>
                        ₹{expense.amount.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {expense.status}
                      </TableCell>

                      <TableCell>
                        <Button
                          component={Link}
                          href={`/expenses/${expense.id}`}
                          size="small"
                          variant="outlined"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                }}
              >
                <Button
                  variant="outlined"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                >
                  Previous
                </Button>

                <Typography>
                  Page {page} of {totalPages}
                </Typography>

                <Button
                  variant="outlined"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
}