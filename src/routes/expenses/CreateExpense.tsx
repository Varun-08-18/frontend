"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  TextField,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";
import {
  Category,
  createExpense,
  getCategories,
} from "@/services/expense.service";

export default function CreateExpense() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load categories",
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!date) {
      setError("Please select an expense date.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    try {
      setLoading(true);

      await createExpense({
        amount: Number(amount),
        date,
        categoryId: Number(categoryId),
        description: description.trim(),
      });

      router.push("/expenses");
    } catch (err: any) {
      const message = err?.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else {
        setError(
          message || "Failed to create expense.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Create Expense
        </Typography>

        <Paper sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              margin="normal"
              slotProps={{
                htmlInput: { min: 1 },
              }}
            />

            <TextField
              fullWidth
              label="Expense Date"
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel>Category</InputLabel>

              <Select
                value={categoryId}
                label="Category"
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                disabled={loadingCategories}
              >
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

            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              margin="normal"
              multiline
              rows={4}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Submit Expense"
                )}
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  router.push("/expenses")
                }
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}